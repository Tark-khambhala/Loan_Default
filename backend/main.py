import os
import logging
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Any, Optional

import joblib
import pandas as pd
import numpy as np
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from schemas import LoanInput, PredictionResponse

# Load environment variables
load_dotenv()

# Configure structured logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("astro_backend")

# Define base paths using pathlib (deployment safe)
BASE_DIR = Path(__file__).resolve().parent
MODEL_DIR = BASE_DIR / "model"
DATA_DIR = BASE_DIR / "data"
DATA_DIR.mkdir(parents=True, exist_ok=True)
RECORDS_FILE = DATA_DIR / "loan_records.csv"

# Locate model file safely
MODEL_PATH = MODEL_DIR / "model_pipeline.pkl"
if not MODEL_PATH.exists():
    MODEL_PATH = MODEL_DIR / "loan_model.pkl"
if not MODEL_PATH.exists():
    MODEL_PATH = BASE_DIR.parent / "loan_model.pkl"

logger.info(f"Resolved model path: {MODEL_PATH.name}")

# Safe startup model validation & loading
if not MODEL_PATH.exists():
    logger.error(f"Model file not found: {MODEL_PATH.name}")
    raise FileNotFoundError(f"Model file not found: {MODEL_PATH.name}")

try:
    logger.info(f"Loading ML model artifact from {MODEL_PATH.name}...")
    model_pack = joblib.load(MODEL_PATH)
    
    if isinstance(model_pack, dict):
        best_model_name = str(model_pack.get('best_model_name', 'Trained Classifier'))
        model_metrics = model_pack.get('model_metrics', {})
        classes = list(model_pack.get('classes', [0, 1]))
        feature_columns = model_pack.get('feature_columns', [])
        
        if 'pipeline' in model_pack:
            pipeline = model_pack['pipeline']
        elif 'model' in model_pack:
            # Fallback for models saved with separate model & scaler
            raw_model = model_pack['model']
            raw_scaler = model_pack.get('scaler')
            
            class LegacyPipelineWrapper:
                def __init__(self, model, scaler, cols, binary_cols, multi_cat_cols):
                    self.model = model
                    self.scaler = scaler
                    self.cols = cols
                    self.binary_cols = binary_cols or []
                    self.multi_cat_cols = multi_cat_cols or []
                    self.classes_ = getattr(model, 'classes_', np.array([0, 1]))
                    self.steps = [('scaler', scaler), ('classifier', model)]
                
                def _preprocess(self, df: pd.DataFrame) -> pd.DataFrame:
                    df_proc = df.copy()
                    # Binary encode
                    for c in self.binary_cols:
                        if c in df_proc.columns:
                            df_proc[c] = df_proc[c].apply(lambda x: 1 if str(x).lower() in ['yes', '1', 'true'] else 0)
                    # One-hot encode
                    df_proc = pd.get_dummies(df_proc, columns=[c for c in self.multi_cat_cols if c in df_proc.columns], drop_first=True)
                    # Reindex
                    for col in self.cols:
                        if col not in df_proc.columns:
                            df_proc[col] = 0
                    df_proc = df_proc[self.cols]
                    if self.scaler is not None:
                        scaled = self.scaler.transform(df_proc)
                        df_proc = pd.DataFrame(scaled, columns=self.cols)
                    return df_proc
                
                def predict(self, df: pd.DataFrame):
                    df_proc = self._preprocess(df)
                    return self.model.predict(df_proc)
                
                def predict_proba(self, df: pd.DataFrame):
                    df_proc = self._preprocess(df)
                    return self.model.predict_proba(df_proc)
            
            pipeline = LegacyPipelineWrapper(
                model=raw_model,
                scaler=raw_scaler,
                cols=feature_columns,
                binary_cols=model_pack.get('binary_cols', []),
                multi_cat_cols=model_pack.get('multi_cat_cols', [])
            )
        else:
            raise ValueError(f"Unknown model pack structure with keys: {list(model_pack.keys())}")
    else:
        pipeline = model_pack
        best_model_name = "Trained Classifier"
        model_metrics = {}
        classes = list(getattr(pipeline, 'classes_', [0, 1]))
        feature_columns = []
        
    logger.info(f"Model successfully loaded: '{best_model_name}'. Classes: {classes}")

except Exception as e:
    logger.exception("Critical failure during ML model startup loading")
    raise RuntimeError(f"Failed to load ML model: {e}")

# Initialize FastAPI Application
app = FastAPI(
    title="ASTRO Loan Intelligence API",
    description="FastAPI backend service powering the ASTRO Loan Approval ML Platform.",
    version="2.0.0"
)

# Configure CORS
frontend_env = os.getenv("FRONTEND_URL", "").strip()

# Local development origins
allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "http://localhost:5175",
    "http://127.0.0.1:5175",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:4173",
    "http://127.0.0.1:4173",
]

# Support custom frontend URLs (e.g. Vercel deployment)
if frontend_env:
    for url in frontend_env.split(","):
        cleaned = url.strip().rstrip("/")
        if cleaned and cleaned not in allowed_origins:
            allowed_origins.append(cleaned)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"^https?:\/\/(localhost|127\.0\.0\.1)(:[0-9]+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Standard Security Headers Middleware
@app.middleware("http")
async def add_security_headers(request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    return response

RECORD_COLUMNS = [
    "timestamp", "Age", "Income", "LoanAmount", "CreditScore",
    "MonthsEmployed", "NumCreditLines", "InterestRate", "LoanTerm",
    "DTIRatio", "Education", "EmploymentType", "MaritalStatus",
    "HasMortgage", "HasDependents", "LoanPurpose", "HasCoSigner",
    "prediction", "probability", "probability_approved", "probability_rejected",
    "model_used"
]


def sanitize_csv_value(val: Any) -> Any:
    """Sanitize string values to prevent CSV formula injection."""
    if isinstance(val, str) and val.startswith(("=", "+", "-", "@", "\t", "\r")):
        return f"'{val}"
    return val


def save_record(record_dict: dict) -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    sanitized = {k: sanitize_csv_value(v) for k, v in record_dict.items()}
    df_new = pd.DataFrame([sanitized])
    
    file_exists = RECORDS_FILE.exists() and RECORDS_FILE.stat().st_size > 0
    if file_exists:
        df_new.to_csv(RECORDS_FILE, mode="a", header=False, index=False)
    else:
        df_new.to_csv(RECORDS_FILE, mode="w", header=True, index=False)
    logger.info(f"Appended record to '{RECORDS_FILE.name}'.")


def load_records_df() -> pd.DataFrame:
    if not RECORDS_FILE.exists() or RECORDS_FILE.stat().st_size == 0:
        return pd.DataFrame(columns=RECORD_COLUMNS)
    try:
        df = pd.read_csv(RECORDS_FILE)
        if "prediction" not in df.columns and len(df.columns) == len(RECORD_COLUMNS):
            df = pd.read_csv(RECORDS_FILE, names=RECORD_COLUMNS)
        return df
    except Exception:
        logger.exception("Error reading records CSV file")
        return pd.DataFrame(columns=RECORD_COLUMNS)


@app.get("/")
def home():
    return {
        "message": "ASTRO API is running"
    }


@app.get("/health")
def health():
    return {
        "status": "ok"
    }


@app.get("/model-info")
def get_model_info():
    if pipeline is None:
        raise HTTPException(status_code=500, detail="ML Pipeline is not loaded.")
    
    pipeline_steps = [name for name, _ in pipeline.steps] if hasattr(pipeline, "steps") else ["classifier"]
    
    return {
        "active_model": best_model_name,
        "classes": [int(c) for c in classes],
        "class_mapping": {
            "0": "Approved (Safe Borrower)",
            "1": "Rejected (Risky Borrower)"
        },
        "feature_columns": feature_columns,
        "pipeline_steps": pipeline_steps
    }


@app.post("/predict", response_model=PredictionResponse)
def predict_loan(data: LoanInput):
    logger.info("Received prediction request")
    if pipeline is None:
        logger.error("Predict called but ML pipeline is not initialized")
        raise HTTPException(status_code=500, detail="ML model pipeline is not loaded on server.")
    
    try:
        input_dict = data.model_dump()
        input_df = pd.DataFrame([input_dict])
        logger.info("Input validation successful")

        logger.info("Starting model prediction")
        raw_pred = pipeline.predict(input_df)[0]
        prediction_val = int(raw_pred)
        
        raw_probs = pipeline.predict_proba(input_df)[0]
        logger.info("Model prediction completed")

        # Map classes correctly: 0 = Approved (No Default), 1 = Rejected (Defaulted)
        classes_list = list(getattr(pipeline, "classes_", classes))
        approved_idx = classes_list.index(0) if 0 in classes_list else 0
        rejected_idx = classes_list.index(1) if 1 in classes_list else 1

        prob_approved = float(raw_probs[approved_idx])
        prob_rejected = float(raw_probs[rejected_idx])

        prediction_label = "Approved" if prediction_val == 0 else "Rejected"
        confidence_prob = prob_approved if prediction_val == 0 else prob_rejected

        timestamp_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        record_to_save = {
            "timestamp": timestamp_str,
            "Age": int(data.Age),
            "Income": float(data.Income),
            "LoanAmount": float(data.LoanAmount),
            "CreditScore": int(data.CreditScore),
            "MonthsEmployed": int(data.MonthsEmployed),
            "NumCreditLines": int(data.NumCreditLines),
            "InterestRate": float(data.InterestRate),
            "LoanTerm": int(data.LoanTerm),
            "DTIRatio": float(data.DTIRatio),
            "Education": str(data.Education),
            "EmploymentType": str(data.EmploymentType),
            "MaritalStatus": str(data.MaritalStatus),
            "HasMortgage": str(data.HasMortgage),
            "HasDependents": str(data.HasDependents),
            "LoanPurpose": str(data.LoanPurpose),
            "HasCoSigner": str(data.HasCoSigner),
            "prediction": prediction_label,
            "probability": round(float(confidence_prob), 4),
            "probability_approved": round(float(prob_approved * 100), 2),
            "probability_rejected": round(float(prob_rejected * 100), 2),
            "model_used": str(best_model_name)
        }

        logger.info("Saving prediction record")
        save_record(record_to_save)

        return {
            "prediction": prediction_label,
            "probability": round(float(confidence_prob), 4),
            "probability_approved": round(float(prob_approved * 100), 2),
            "probability_rejected": round(float(prob_rejected * 100), 2),
            "model_used": str(best_model_name),
            "message": "Prediction successful"
        }

    except HTTPException:
        raise
    except Exception as err:
        logger.exception(f"Prediction processing error: {err}")
        raise HTTPException(
            status_code=500,
            detail="Prediction failed. Please try again."
        )


@app.get("/records")
def get_records():
    try:
        df_records = load_records_df()
        df_records = df_records.fillna("")
        records_list = df_records.to_dict(orient="records")
        return {
            "records": records_list,
            "count": len(records_list)
        }
    except Exception as e:
        logger.exception(f"Error reading records: {e}")
        raise HTTPException(status_code=500, detail="Error reading records file.")


@app.get("/records/count")
def get_records_count():
    try:
        df_records = load_records_df()
        return {"count": int(len(df_records))}
    except Exception:
        return {"count": 0}


@app.get("/dashboard")
def get_dashboard_stats():
    total_records = 0
    approved_count = 0
    rejected_count = 0
    
    try:
        df_records = load_records_df()
        total_records = int(len(df_records))
        if 'prediction' in df_records.columns:
            approved_count = int((df_records['prediction'] == 'Approved').sum())
            rejected_count = int((df_records['prediction'] == 'Rejected').sum())
    except Exception:
        logger.exception("Error computing dashboard statistics from records")
        
    models_list = list(model_metrics.values()) if model_metrics else []
    top_model = models_list[0] if models_list else {
        "name": best_model_name,
        "accuracy": 0.8832,
        "f1_score": 0.45
    }
    
    return {
        "total_records": total_records,
        "approved": approved_count,
        "rejected": rejected_count,
        "top_model": {
            "name": top_model.get("name", best_model_name),
            "accuracy": float(top_model.get("accuracy", 0.8832)),
            "f1_score": float(top_model.get("f1_score", 0.45))
        },
        "models": models_list
    }


@app.get("/model-performance")
def get_model_performance():
    models_list = list(model_metrics.values()) if model_metrics else []
    return {
        "active_model": best_model_name,
        "total_models_evaluated": int(len(models_list)),
        "models": models_list
    }