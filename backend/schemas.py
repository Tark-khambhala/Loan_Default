from typing import Literal
from pydantic import BaseModel, Field

class LoanInput(BaseModel):
    Age: int = Field(..., ge=18, le=100, example=45, description="Age of applicant (18-100)")
    Income: float = Field(..., ge=0.0, le=10000000.0, example=95000.0, description="Annual income (non-negative)")
    LoanAmount: float = Field(..., gt=0.0, le=10000000.0, example=25000.0, description="Requested loan amount (positive)")
    CreditScore: int = Field(..., ge=300, le=850, example=720, description="Credit score (300-850)")
    MonthsEmployed: int = Field(..., ge=0, le=720, example=60, description="Employment duration in months")
    NumCreditLines: int = Field(..., ge=0, le=50, example=3, description="Number of open credit lines")
    InterestRate: float = Field(..., ge=0.0, le=100.0, example=8.5, description="Loan interest rate percentage")
    LoanTerm: int = Field(..., ge=1, le=480, example=36, description="Loan term duration in months")
    DTIRatio: float = Field(..., ge=0.0, le=1.0, example=0.35, description="Debt-to-Income ratio (0.0 to 1.0)")
    
    Education: Literal["High School", "Bachelor's", "Master's", "PhD"] = Field(
        ..., example="Master's", description="Education level"
    )
    EmploymentType: Literal["Full-time", "Part-time", "Self-employed", "Unemployed"] = Field(
        ..., example="Full-time", description="Employment status"
    )
    MaritalStatus: Literal["Single", "Married", "Divorced"] = Field(
        ..., example="Married", description="Marital status"
    )
    HasMortgage: Literal["Yes", "No"] = Field(
        ..., example="Yes", description="Mortgage status"
    )
    HasDependents: Literal["Yes", "No"] = Field(
        ..., example="No", description="Dependents status"
    )
    LoanPurpose: Literal["Home", "Auto", "Education", "Business", "Other"] = Field(
        ..., example="Home", description="Purpose of loan"
    )
    HasCoSigner: Literal["Yes", "No"] = Field(
        ..., example="Yes", description="Co-signer status"
    )

class PredictionResponse(BaseModel):
    prediction: str = Field(..., example="Approved")
    probability: float = Field(..., example=0.9103)
    probability_approved: float = Field(..., example=91.03)
    probability_rejected: float = Field(..., example=8.97)
    model_used: str = Field(..., example="Random Forest")
    message: str = Field(default="Prediction successful", example="Prediction successful")
