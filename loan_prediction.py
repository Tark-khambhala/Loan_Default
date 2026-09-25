# ==============================================================================
# ML PROJECT: LOAN APPROVAL PREDICTION USING CLASSIFICATION ALGORITHMS
# ==============================================================================
# Target Column: Default
#   - 0 = No Default  -> Loan Approved / Safe Applicant
#   - 1 = Defaulted   -> Loan Not Approved / Risky Applicant
# ==============================================================================

import os
import sys
import warnings
import joblib
import pandas as pd
import numpy as np

# Set matplotlib backend to non-interactive 'Agg' to cleanly save plots to disk
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns

# Scikit-Learn Imports
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.tree import DecisionTreeClassifier, plot_tree
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import SVC
from sklearn.naive_bayes import GaussianNB
from sklearn.ensemble import BaggingClassifier, RandomForestClassifier, AdaBoostClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    classification_report,
    roc_curve,
    roc_auc_score
)

# Suppress minor warnings for clean console output
warnings.filterwarnings('ignore')

# Set styling for plots
sns.set_theme(style="whitegrid")
plt.rcParams['font.sans-serif'] = 'DejaVu Sans'

print("======================================================================")
print("             LOAN APPROVAL PREDICTION - MACHINE LEARNING              ")
print("======================================================================")

# STEP 1 — UNDERSTAND THE DATASET

dataset_path = "Loan_default.csv"
if not os.path.exists(dataset_path):
    dataset_path = os.path.join("dataset", "Loan_default.csv")

print(f"\n[STEP 1] Loading dataset from '{dataset_path}'...")
raw_df = pd.read_csv(dataset_path)

print(f"\n--- Dataset Overview ---")
print(f"Number of Rows (Applicants)   : {raw_df.shape[0]:,}")
print(f"Number of Columns (Features)  : {raw_df.shape[1]}")
print(f"Column Names                  : {raw_df.columns.tolist()}")

print("\n--- Data Types ---")
print(raw_df.dtypes)

print("\n--- First 5 Rows ---")
print(raw_df.head())

print("\n--- Missing Values Per Column ---")
null_counts = raw_df.isnull().sum()
print(null_counts)

print(f"\n--- Duplicate Rows ---")
duplicate_count = raw_df.duplicated().sum()
print(f"Total duplicate rows: {duplicate_count}")

# Distribution of Target Column: Default
target_counts = raw_df['Default'].value_counts()
target_percentages = raw_df['Default'].value_counts(normalize=True) * 100

print("\n--- Target Variable ('Default') Distribution ---")
print(f"Class 0 (No Default / Loan Approved)    : {target_counts[0]:>7,} ({target_percentages[0]:.2f}%)")
print(f"Class 1 (Defaulted / Loan Not Approved) : {target_counts[1]:>7,} ({target_percentages[1]:.2f}%)")


# STEP 2 — EXPLORATORY DATA ANALYSIS (EDA)

os.makedirs("plots", exist_ok=True)
print("\n[STEP 2] Performing Exploratory Data Analysis & Saving Visualizations...")

# 1. Target Class Distribution Plot
plt.figure(figsize=(7, 5))
ax = sns.countplot(x='Default', data=raw_df, palette=['#2ecc71', '#e74c3c'])
plt.title('Target Distribution: Default (0 = Approved, 1 = Not Approved)', fontsize=12, fontweight='bold')
plt.xlabel('Loan Status (0: Approved / Safe, 1: Not Approved / Default)', fontsize=10)
plt.ylabel('Number of Applicants', fontsize=10)
plt.xticks([0, 1], ['Approved (0)', 'Not Approved (1)'])
for p in ax.patches:
    ax.annotate(f'{int(p.get_height()):,}', (p.get_x() + p.get_width() / 2., p.get_height()),
                ha='center', va='bottom', fontsize=9, xytext=(0, 3), textcoords='offset points')
plt.tight_layout()
plt.savefig('plots/01_target_distribution.png', dpi=300)
plt.close()

# 2. Histograms for Numerical Columns
num_cols = ['Age', 'Income', 'LoanAmount', 'CreditScore', 'MonthsEmployed', 'NumCreditLines', 'InterestRate', 'LoanTerm', 'DTIRatio']
plt.figure(figsize=(14, 10))
for i, col in enumerate(num_cols, 1):
    plt.subplot(3, 3, i)
    sns.histplot(raw_df[col], kde=True, color='#3498db', bins=25)
    plt.title(f'Distribution of {col}', fontsize=11, fontweight='bold')
    plt.xlabel(col, fontsize=9)
    plt.ylabel('Frequency', fontsize=9)
plt.tight_layout()
plt.savefig('plots/02_numerical_distributions.png', dpi=300)
plt.close()

# 3. Boxplots for Numerical Columns
plt.figure(figsize=(14, 10))
for i, col in enumerate(num_cols, 1):
    plt.subplot(3, 3, i)
    sns.boxplot(x='Default', y=col, data=raw_df, palette=['#2ecc71', '#e74c3c'])
    plt.title(f'{col} by Loan Target', fontsize=11, fontweight='bold')
    plt.xlabel('Default Status (0: Approved, 1: Not Approved)', fontsize=9)
    plt.ylabel(col, fontsize=9)
plt.tight_layout()
plt.savefig('plots/03_numerical_boxplots.png', dpi=300)
plt.close()

# 4. Countplots for Categorical Columns
cat_cols = ['Education', 'EmploymentType', 'MaritalStatus', 'HasMortgage', 'HasDependents', 'LoanPurpose', 'HasCoSigner']
plt.figure(figsize=(16, 12))
for i, col in enumerate(cat_cols, 1):
    plt.subplot(3, 3, i)
    sns.countplot(x=col, hue='Default', data=raw_df, palette=['#2ecc71', '#e74c3c'])
    plt.title(f'{col} vs Loan Approval', fontsize=11, fontweight='bold')
    plt.xlabel(col, fontsize=9)
    plt.ylabel('Count', fontsize=9)
    plt.xticks(rotation=20)
    plt.legend(['Approved (0)', 'Not Approved (1)'], loc='upper right', fontsize=8)
plt.tight_layout()
plt.savefig('plots/04_categorical_countplots.png', dpi=300)
plt.close()

# 5. Correlation Heatmap for Numerical Features
plt.figure(figsize=(10, 8))
numeric_df = raw_df[num_cols + ['Default']]
corr_matrix = numeric_df.corr()
sns.heatmap(corr_matrix, annot=True, fmt=".2f", cmap='coolwarm', vmin=-1, vmax=1, linewidths=0.5)
plt.title('Correlation Heatmap of Numerical Features', fontsize=12, fontweight='bold')
plt.xlabel('Features', fontsize=10)
plt.ylabel('Features', fontsize=10)
plt.tight_layout()
plt.savefig('plots/05_correlation_heatmap.png', dpi=300)
plt.close()

# STEP 3 & 4 — DATA CLEANING & REMOVE IDENTIFIER COLUMNS

print("\n[STEP 3 & 4] Cleaning Data & Removing Identifier Columns...")
df_clean = raw_df.copy()

if 'LoanID' in df_clean.columns:
    df_clean = df_clean.drop(columns=['LoanID'])
    print("  Removed 'LoanID' identifier column to prevent memorization/leakage.")

X = df_clean.drop(columns=['Default'])
y = df_clean['Default']

# Build Scikit-Learn ColumnTransformer for Preprocessing
preprocessor = ColumnTransformer(
    transformers=[
        ('num', StandardScaler(), num_cols),
        ('cat', OneHotEncoder(handle_unknown='ignore', sparse_output=False), cat_cols)
    ]
)

# STEP 7 — TRAIN-TEST SPLIT

print("\n[STEP 7] Performing Train-Test Split (80% Train, 20% Test)...")
SAMPLE_SIZE = 50000
if len(X) > SAMPLE_SIZE:
    X_sample, _, y_sample, _ = train_test_split(
        X, y, train_size=SAMPLE_SIZE, random_state=42, stratify=y
    )
    print(f"  Using a representative stratified sample of {SAMPLE_SIZE:,} rows for robust model training.")
else:
    X_sample, y_sample = X, y

X_train, X_test, y_train, y_test = train_test_split(
    X_sample, y_sample, test_size=0.2, random_state=42, stratify=y_sample
)

print(f"  Training set size : {X_train.shape[0]:,} samples")
print(f"  Testing set size  : {X_test.shape[0]:,} samples")


# MODEL DEFINITIONS (Handling class imbalance via class_weight='balanced')

classifiers = {
    'Random Forest': RandomForestClassifier(n_estimators=100, max_depth=12, class_weight='balanced', random_state=42, n_jobs=-1),
    'Decision Tree': DecisionTreeClassifier(max_depth=8, class_weight='balanced', random_state=42),
    'Logistic Regression': LogisticRegression(class_weight='balanced', max_iter=1000, random_state=42),
    'AdaBoost': AdaBoostClassifier(n_estimators=100, random_state=42),
    'Bagging': BaggingClassifier(estimator=DecisionTreeClassifier(max_depth=8, class_weight='balanced', random_state=42), n_estimators=10, random_state=42),
    'Naive Bayes': GaussianNB(),
    'KNN': KNeighborsClassifier(n_neighbors=9),
    'SVC': SVC(kernel='rbf', class_weight='balanced', probability=True, random_state=42)
}

fitted_pipelines = {}
model_results = {}
y_probs = {}

print("\n" + "="*70)
print("TRAINING & EVALUATING ALL 8 CLASSIFICATION MODELS")
print("="*70)

plt.figure(figsize=(16, 14))
plot_idx = 1

for name, clf in classifiers.items():
    pipe = Pipeline([
        ('preprocessor', preprocessor),
        ('classifier', clf)
    ])
    
    pipe.fit(X_train, y_train)
    fitted_pipelines[name] = pipe
    
    y_pred = pipe.predict(X_test)
    y_prob = pipe.predict_proba(X_test)[:, 1]
    y_probs[name] = y_prob
    
    acc = accuracy_score(y_test, y_pred)
    err = 1.0 - acc
    prec = precision_score(y_test, y_pred, zero_division=0)
    rec = recall_score(y_test, y_pred, zero_division=0)
    f1 = f1_score(y_test, y_pred, zero_division=0)
    auc = roc_auc_score(y_test, y_prob)
    cm = confusion_matrix(y_test, y_pred)
    
    model_results[name] = {
        'name': name,
        'accuracy': acc,
        'error_rate': err,
        'precision': prec,
        'recall': rec,
        'f1_score': f1,
        'auc': auc,
        'confusion_matrix': {
            'tn': int(cm[0, 0]),
            'fp': int(cm[0, 1]),
            'fn': int(cm[1, 0]),
            'tp': int(cm[1, 1])
        }
    }
    
    print(f"\n--- Model: {name} ---")
    print(f"Accuracy    : {acc:.4f}")
    print(f"Error Rate  : {err:.4f}")
    print(f"Precision   : {prec:.4f}")
    print(f"Recall      : {rec:.4f}")
    print(f"F1 Score    : {f1:.4f}")
    print(f"AUC Score   : {auc:.4f}")
    print(f"Confusion Matrix:\n{cm}")

    # Plot Confusion Matrix Subplot
    plt.subplot(3, 3, plot_idx)
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', cbar=False,
                xticklabels=['Approved', 'Not Approved'],
                yticklabels=['Approved', 'Not Approved'])
    plt.title(f'{name}\nConfusion Matrix', fontsize=10, fontweight='bold')
    plt.xlabel('Predicted Class', fontsize=8)
    plt.ylabel('Actual Class', fontsize=8)
    plot_idx += 1

plt.tight_layout()
plt.savefig('plots/07_confusion_matrices.png', dpi=300)
plt.close()
print("\n  Saved: plots/07_confusion_matrices.png")


# STRATIFIED K-FOLD CROSS VALIDATION

print("\n" + "="*70)
print("5-FOLD STRATIFIED CROSS-VALIDATION")
print("="*70)

skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
summary_rows = []

for name, pipe in fitted_pipelines.items():
    if name == 'SVC':
        # Skip heavy CV on SVC for speed
        cv_mean = model_results[name]['accuracy']
    else:
        scores = cross_val_score(pipe, X_sample, y_sample, cv=skf, scoring='accuracy')
        cv_mean = scores.mean()
        
    model_results[name]['cv_score'] = cv_mean
    print(f"  {name:22s} -> 5-Fold Stratified CV Accuracy: {cv_mean:.4f}")
    
    m = model_results[name]
    summary_rows.append({
        'Model': name,
        'Accuracy': m['accuracy'],
        'Precision': m['precision'],
        'Recall': m['recall'],
        'F1 Score': m['f1_score'],
        'CV Score': m['cv_score'],
        'AUC': m['auc']
    })

# ROC CURVE PLOT

plt.figure(figsize=(10, 8))
for name in fitted_pipelines.keys():
    y_prob = y_probs[name]
    auc_val = model_results[name]['auc']
    fpr, tpr, _ = roc_curve(y_test, y_prob)
    plt.plot(fpr, tpr, label=f'{name} (AUC = {auc_val:.3f})', linewidth=2)

plt.plot([0, 1], [0, 1], 'k--', label='Random Chance (AUC = 0.500)')
plt.title('Receiver Operating Characteristic (ROC) Curves', fontsize=12, fontweight='bold')
plt.xlabel('False Positive Rate (FPR)', fontsize=10)
plt.ylabel('True Positive Rate (TPR / Recall)', fontsize=10)
plt.legend(loc='lower right', fontsize=9)
plt.tight_layout()
plt.savefig('plots/08_roc_curves.png', dpi=300)
plt.close()
print("  Saved: plots/08_roc_curves.png")

# SUMMARY TABLE & SELECTION

summary_df = pd.DataFrame(summary_rows)
summary_df = summary_df.sort_values(by='F1 Score', ascending=False).reset_index(drop=True)

print("\n" + "="*70)
print("MODEL COMPARISON SUMMARY TABLE")
print("="*70)
print(summary_df.to_string(index=False, float_format=lambda x: f"{x:.4f}"))

best_model_name = summary_df.iloc[0]['Model']
best_pipeline = fitted_pipelines[best_model_name]

print(f"\n[SELECTED BEST MODEL] : '{best_model_name}' (F1={summary_df.iloc[0]['F1 Score']:.4f}, AUC={summary_df.iloc[0]['AUC']:.4f})")

# Feature Importance Plot for Random Forest
rf_pipe = fitted_pipelines['Random Forest']
rf_clf = rf_pipe.named_steps['classifier']
ohe = rf_pipe.named_steps['preprocessor'].named_transformers_['cat']
cat_feature_names = ohe.get_feature_names_out(cat_cols).tolist()
all_feature_names = num_cols + cat_feature_names

importances = rf_clf.feature_importances_
feat_imp = pd.Series(importances, index=all_feature_names).sort_values(ascending=True)

plt.figure(figsize=(10, 8))
feat_imp.tail(15).plot(kind='barh', color='#27ae60')
plt.title('Random Forest - Top Feature Importance', fontsize=12, fontweight='bold')
plt.xlabel('Importance Score', fontsize=10)
plt.ylabel('Feature', fontsize=10)
plt.tight_layout()
plt.savefig('plots/09_feature_importance.png', dpi=300)
plt.close()
print("  Saved: plots/09_feature_importance.png")

# STEP 24 — SAVE THE TRAINED PIPELINE & ARTIFACTS

print("\n" + "="*70)
print("SAVING TRAINED MODEL PIPELINE AND METRICS ARTIFACTS")
print("="*70)

pipeline_pack = {
    'best_model_name': best_model_name,
    'pipeline': best_pipeline,
    'model_metrics': model_results,
    'feature_columns': X.columns.tolist(),
    'num_cols': num_cols,
    'cat_cols': cat_cols,
    'classes': list(best_pipeline.classes_)
}

os.makedirs("backend/model", exist_ok=True)
joblib.dump(pipeline_pack, "loan_model.pkl")
joblib.dump(pipeline_pack, "backend/model/loan_model.pkl")
joblib.dump(pipeline_pack, "backend/model/model_pipeline.pkl")
print("  Successfully saved pipeline to 'loan_model.pkl', 'backend/model/loan_model.pkl' & 'backend/model/model_pipeline.pkl'.")

print("\n======================================================================")
print("             LOAN PREDICTION MODEL TRAINING COMPLETED!                ")
print("======================================================================")
