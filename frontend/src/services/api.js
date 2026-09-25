const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000").replace(/\/+$/, "");

/**
 * Health check endpoint
 */
export async function getHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    if (!res.ok) throw new Error("Health check failed");
    return await res.json();
  } catch (err) {
    console.error("API Health Error:", err);
    return { status: "offline" };
  }
}

/**
 * Submit loan application for ML prediction
 */
export async function predictLoan(formData) {
  const response = await fetch(`${API_BASE_URL}/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(formData)
  });
  
  if (!response.ok) {
    const errText = await response.text();
    throw new Error(errText || "Prediction request failed");
  }
  
  return await response.json();
}

/**
 * Fetch saved application records from loan_records.csv
 */
export async function getRecords() {
  const response = await fetch(`${API_BASE_URL}/records`);
  if (!response.ok) {
    throw new Error("Failed to fetch application records");
  }
  return await response.json();
}

/**
 * Fetch total record count
 */
export async function getRecordsCount() {
  const response = await fetch(`${API_BASE_URL}/records/count`);
  if (!response.ok) {
    throw new Error("Failed to fetch records count");
  }
  return await response.json();
}

/**
 * Fetch dashboard summary statistics
 */
export async function getDashboardStats() {
  const response = await fetch(`${API_BASE_URL}/dashboard`);
  if (!response.ok) {
    throw new Error("Failed to fetch dashboard statistics");
  }
  return await response.json();
}

/**
 * Fetch comprehensive model performance evaluation metrics
 */
export async function getModelPerformance() {
  const response = await fetch(`${API_BASE_URL}/model-performance`);
  if (!response.ok) {
    throw new Error("Failed to fetch model performance metrics");
  }
  return await response.json();
}

export { API_BASE_URL };
