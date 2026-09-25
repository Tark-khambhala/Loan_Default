

---

## 🔌 API Endpoints Summary

| Route | Method | Purpose |
| :--- | :--- | :--- |
| `GET /` | `GET` | Root API status |
| `GET /health` | `GET` | System health check |
| `POST /predict` | `POST` | Runs ML inference & saves application row to `loan_records.csv` |
| `GET /records` | `GET` | Retrieves all saved user records from CSV |
| `GET /records/count` | `GET` | Returns total stored application count |
| `GET /dashboard` | `GET` | Summary statistics & model accuracy list |
| `GET /model-performance` | `GET` | Comprehensive metrics for all 8 trained algorithms |

---

## 📊 Empirical ML Classification Performance

| Model | Accuracy | Error Rate | Precision | Recall | F1 Score | 5-Fold CV | AUC |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Decision Tree** | **88.32%** | **11.68%** | **47.73%** | **4.52%** | **0.0825** | **88.13%** | **0.7025** |
| **AdaBoost** | 88.52% | 11.48% | 61.54% | 3.44% | 0.0652 | 88.44% | 0.7261 |
| **Logistic Regression** | 88.42% | 11.58% | 55.56% | 2.15% | 0.0414 | 88.50% | 0.7453 |
| **Bagging** | 88.45% | 11.55% | 80.00% | 0.86% | 0.0170 | 88.45% | 0.7150 |
| **Naive Bayes** | 88.40% | 11.60% | 100.00% | 0.22% | 0.0043 | 88.45% | 0.7330 |
| **KNN (K=9)** | 88.22% | 11.78% | 12.50% | 0.22% | 0.0042 | 87.99% | 0.5962 |
| **SVC (RBF Kernel)** | 88.38% | 11.62% | 0.00% | 0.00% | 0.0000 | 88.39% | 0.6447 |
| **Random Forest** | 88.38% | 11.62% | 0.00% | 0.00% | 0.0000 | 88.41% | 0.7278 |
