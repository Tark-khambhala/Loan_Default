import { useState } from "react";
import { predictLoan } from "../services/api";
import { motion } from "framer-motion";
import { ArrowRight, RefreshCw, AlertTriangle } from "lucide-react";
import BackgroundLayer from "../components/BackgroundLayer";

export default function Prediction() {
  const defaultValues = {
    Age: 45,
    Income: 95000,
    LoanAmount: 25000,
    CreditScore: 720,
    MonthsEmployed: 60,
    NumCreditLines: 3,
    InterestRate: 8.5,
    LoanTerm: 36,
    DTIRatio: 0.35,

    Education: "Master's",
    EmploymentType: "Full-time",
    MaritalStatus: "Married",
    HasMortgage: "Yes",
    HasDependents: "No",
    LoanPurpose: "Home",
    HasCoSigner: "Yes"
  };

  const [formData, setFormData] = useState(defaultValues);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    
    try {
      const payload = {
        Age: Number(formData.Age),
        Income: Number(formData.Income),
        LoanAmount: Number(formData.LoanAmount),
        CreditScore: Number(formData.CreditScore),
        MonthsEmployed: Number(formData.MonthsEmployed),
        NumCreditLines: Number(formData.NumCreditLines),
        InterestRate: Number(formData.InterestRate),
        LoanTerm: Number(formData.LoanTerm),
        DTIRatio: Number(formData.DTIRatio),

        Education: formData.Education,
        EmploymentType: formData.EmploymentType,
        MaritalStatus: formData.MaritalStatus,
        HasMortgage: formData.HasMortgage,
        HasDependents: formData.HasDependents,
        LoanPurpose: formData.LoanPurpose,
        HasCoSigner: formData.HasCoSigner
      };

      const data = await predictLoan(payload);
      setResult(data);
    } catch (err) {
      console.error("Prediction error:", err);
      setError("PREDICTION FAILED. Please check the submitted information or make sure FastAPI is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#F5F3ED] text-[#111111] px-6 lg:px-16 py-16 overflow-hidden">
      {/* Dynamic Background Layer */}
      <BackgroundLayer mode="prediction" />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-16 border-b-2 border-[#111111] pb-8 bg-white/60 backdrop-blur-xs p-6 border-2 shadow-[4px_4px_0px_#111111]">
          <span className="font-mono text-xs uppercase tracking-widest text-[#111111]/70 block mb-2 font-bold">
            CLASSIFICATION ENGINE • FASTAPI POWERED
          </span>
          <h1 className="font-black text-5xl md:text-7xl uppercase tracking-tight text-[#111111]">
            MAKE A PREDICTION
          </h1>
          <p className="font-mono text-sm text-[#111111]/80 mt-3">
            Enter the applicant details. astro will analyze the application using trained machine learning models.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Section 01: APPLICANT */}
          <div className="bg-white/95 p-8 md:p-10 rounded-2xl border-2 border-[#111111] shadow-[4px_4px_0px_#111111]">
            <div className="mb-8 border-b-2 border-[#111111]/20 pb-4 flex items-center justify-between">
              <div>
                <span className="font-black text-xl text-[#111111] bg-[#EFFF4F] px-3 py-1 border border-[#111111] inline-block mb-2 shadow-[2px_2px_0px_#111111]">
                  01
                </span>
                <h3 className="font-black text-2xl uppercase tracking-tight text-[#111111]">
                  APPLICANT
                </h3>
                <p className="font-mono text-xs text-[#111111]/60 mt-1">Personal information</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-mono text-xs">
              <div>
                <label className="block font-bold text-[#111111] uppercase mb-2">Age</label>
                <input
                  type="number"
                  name="Age"
                  value={formData.Age}
                  onChange={handleChange}
                  min="18"
                  max="100"
                  required
                  className="w-full bg-[#F5F3ED] border-2 border-[#111111] rounded-xl p-4 font-sans text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#EFFF4F]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#111111] uppercase mb-2">Months Employed</label>
                <input
                  type="number"
                  name="MonthsEmployed"
                  value={formData.MonthsEmployed}
                  onChange={handleChange}
                  min="0"
                  required
                  className="w-full bg-[#F5F3ED] border-2 border-[#111111] rounded-xl p-4 font-sans text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#EFFF4F]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#111111] uppercase mb-2">Education Level</label>
                <select
                  name="Education"
                  value={formData.Education}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#F5F3ED] border-2 border-[#111111] rounded-xl p-4 font-sans text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#EFFF4F]"
                >
                  <option value="High School">High School</option>
                  <option value="Bachelor's">Bachelor's</option>
                  <option value="Master's">Master's</option>
                  <option value="PhD">PhD</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#111111] uppercase mb-2">Employment Type</label>
                <select
                  name="EmploymentType"
                  value={formData.EmploymentType}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#F5F3ED] border-2 border-[#111111] rounded-xl p-4 font-sans text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#EFFF4F]"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Self-employed">Self-employed</option>
                  <option value="Unemployed">Unemployed</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#111111] uppercase mb-2">Marital Status</label>
                <select
                  name="MaritalStatus"
                  value={formData.MaritalStatus}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#F5F3ED] border-2 border-[#111111] rounded-xl p-4 font-sans text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#EFFF4F]"
                >
                  <option value="Married">Married</option>
                  <option value="Single">Single</option>
                  <option value="Divorced">Divorced</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 02: FINANCIAL */}
          <div className="bg-white/95 p-8 md:p-10 rounded-2xl border-2 border-[#111111] shadow-[4px_4px_0px_#111111]">
            <div className="mb-8 border-b-2 border-[#111111]/20 pb-4">
              <span className="font-black text-xl text-[#111111] bg-[#EFFF4F] px-3 py-1 border border-[#111111] inline-block mb-2 shadow-[2px_2px_0px_#111111]">
                02
              </span>
              <h3 className="font-black text-2xl uppercase tracking-tight text-[#111111]">
                FINANCIAL
              </h3>
              <p className="font-mono text-xs text-[#111111]/60 mt-1">Income and loan information</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-mono text-xs">
              <div>
                <label className="block font-bold text-[#111111] uppercase mb-2">Applicant Income ($)</label>
                <input
                  type="number"
                  name="Income"
                  value={formData.Income}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#F5F3ED] border-2 border-[#111111] rounded-xl p-4 font-sans text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#EFFF4F]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#111111] uppercase mb-2">Loan Amount ($)</label>
                <input
                  type="number"
                  name="LoanAmount"
                  value={formData.LoanAmount}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#F5F3ED] border-2 border-[#111111] rounded-xl p-4 font-sans text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#EFFF4F]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#111111] uppercase mb-2">Interest Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  name="InterestRate"
                  value={formData.InterestRate}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#F5F3ED] border-2 border-[#111111] rounded-xl p-4 font-sans text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#EFFF4F]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#111111] uppercase mb-2">Loan Term (Months)</label>
                <select
                  name="LoanTerm"
                  value={formData.LoanTerm}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#F5F3ED] border-2 border-[#111111] rounded-xl p-4 font-sans text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#EFFF4F]"
                >
                  <option value={12}>12 Months</option>
                  <option value={24}>24 Months</option>
                  <option value={36}>36 Months</option>
                  <option value={48}>48 Months</option>
                  <option value={60}>60 Months</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 03: CREDIT */}
          <div className="bg-white/95 p-8 md:p-10 rounded-2xl border-2 border-[#111111] shadow-[4px_4px_0px_#111111]">
            <div className="mb-8 border-b-2 border-[#111111]/20 pb-4">
              <span className="font-black text-xl text-[#111111] bg-[#EFFF4F] px-3 py-1 border border-[#111111] inline-block mb-2 shadow-[2px_2px_0px_#111111]">
                03
              </span>
              <h3 className="font-black text-2xl uppercase tracking-tight text-[#111111]">
                CREDIT
              </h3>
              <p className="font-mono text-xs text-[#111111]/60 mt-1">Credit information</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-mono text-xs">
              <div>
                <label className="block font-bold text-[#111111] uppercase mb-2">Credit Score (300 - 850)</label>
                <input
                  type="number"
                  name="CreditScore"
                  value={formData.CreditScore}
                  onChange={handleChange}
                  min="300"
                  max="850"
                  required
                  className="w-full bg-[#F5F3ED] border-2 border-[#111111] rounded-xl p-4 font-sans text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#EFFF4F]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#111111] uppercase mb-2">Debt-to-Income (DTI)</label>
                <input
                  type="number"
                  step="0.01"
                  name="DTIRatio"
                  value={formData.DTIRatio}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#F5F3ED] border-2 border-[#111111] rounded-xl p-4 font-sans text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#EFFF4F]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#111111] uppercase mb-2">Open Credit Lines</label>
                <input
                  type="number"
                  name="NumCreditLines"
                  value={formData.NumCreditLines}
                  onChange={handleChange}
                  min="1"
                  max="10"
                  required
                  className="w-full bg-[#F5F3ED] border-2 border-[#111111] rounded-xl p-4 font-sans text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#EFFF4F]"
                />
              </div>
            </div>
          </div>

          {/* Section 04: PROPERTY */}
          <div className="bg-white/95 p-8 md:p-10 rounded-2xl border-2 border-[#111111] shadow-[4px_4px_0px_#111111]">
            <div className="mb-8 border-b-2 border-[#111111]/20 pb-4">
              <span className="font-black text-xl text-[#111111] bg-[#EFFF4F] px-3 py-1 border border-[#111111] inline-block mb-2 shadow-[2px_2px_0px_#111111]">
                04
              </span>
              <h3 className="font-black text-2xl uppercase tracking-tight text-[#111111]">
                PROPERTY
              </h3>
              <p className="font-mono text-xs text-[#111111]/60 mt-1">Property information</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-mono text-xs">
              <div>
                <label className="block font-bold text-[#111111] uppercase mb-2">Loan Purpose</label>
                <select
                  name="LoanPurpose"
                  value={formData.LoanPurpose}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#F5F3ED] border-2 border-[#111111] rounded-xl p-4 font-sans text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#EFFF4F]"
                >
                  <option value="Home">Home</option>
                  <option value="Auto">Auto</option>
                  <option value="Education">Education</option>
                  <option value="Business">Business</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#111111] uppercase mb-2">Has Mortgage?</label>
                <select
                  name="HasMortgage"
                  value={formData.HasMortgage}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#F5F3ED] border-2 border-[#111111] rounded-xl p-4 font-sans text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#EFFF4F]"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#111111] uppercase mb-2">Has Dependents?</label>
                <select
                  name="HasDependents"
                  value={formData.HasDependents}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#F5F3ED] border-2 border-[#111111] rounded-xl p-4 font-sans text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#EFFF4F]"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#111111] uppercase mb-2">Has Co-Signer?</label>
                <select
                  name="HasCoSigner"
                  value={formData.HasCoSigner}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#F5F3ED] border-2 border-[#111111] rounded-xl p-4 font-sans text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#EFFF4F]"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>
          </div>

          {/* Predict Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#EFFF4F] text-[#111111] font-mono font-bold text-base uppercase tracking-widest py-5 px-8 rounded-full border-2 border-[#111111] hover:bg-[#111111] hover:text-[#EFFF4F] transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer shadow-[6px_6px_0px_#111111] hover:translate-y-[-2px]"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  ANALYZING APPLICATION...
                </>
              ) : (
                <>
                  MAKE A PREDICTION →
                </>
              )}
            </button>
          </div>
        </form>

        {/* Error Alert */}
        {error && (
          <div className="mt-8 bg-[#ef4444] text-white p-6 rounded-2xl font-mono text-xs flex items-center gap-3 border-2 border-black shadow-[4px_4px_0px_#111111]">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <div>{error}</div>
          </div>
        )}

        {/* Prediction Result Section */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-16 p-12 bg-[#111111] text-white rounded-3xl border-4 border-[#111111] shadow-[8px_8px_0px_#EFFF4F]"
          >
            <span className="font-mono text-xs uppercase tracking-widest text-[#EFFF4F] block mb-2 font-bold">
              LOAN DECISION • REAL-TIME MODEL RESPONSE
            </span>
            <h2 className={`font-black text-7xl md:text-9xl uppercase tracking-tighter leading-none ${
              result.prediction === "Approved" ? "text-[#10b981]" : "text-[#ef4444]"
            }`}>
              {result.prediction === "Approved" ? "APPROVED" : "REJECTED"}
            </h2>

            <div className="font-mono text-4xl font-bold text-white mt-6">
              {result.probability_approved || (result.probability * 100).toFixed(1)}%
            </div>
            <div className="font-mono text-xs text-white/50 tracking-widest uppercase mt-1">
              MODEL CONFIDENCE ({result.model_used})
            </div>

            <p className="font-mono text-xs text-[#EFFF4F] mt-8 pt-6 border-t border-white/20">
              Prediction saved successfully to backend/data/loan_records.csv.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

