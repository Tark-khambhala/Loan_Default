import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getRecords } from "../services/api";
import { Search, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import BackgroundLayer from "../components/BackgroundLayer";

export default function History() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedRow, setExpandedRow] = useState(null);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await getRecords();
      setRecords(data.records || []);
    } catch (err) {
      console.error("History records load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const toggleRow = (idx) => {
    setExpandedRow(expandedRow === idx ? null : idx);
  };

  const filteredRecords = records.filter((rec) => {
    if (filter === "APPROVED" && rec.prediction !== "Approved") return false;
    if (filter === "REJECTED" && rec.prediction !== "Rejected") return false;

    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const matchIncome = String(rec.Income || "").includes(q);
      const matchPurpose = String(rec.LoanPurpose || "").toLowerCase().includes(q);
      const matchEducation = String(rec.Education || "").toLowerCase().includes(q);
      const matchPrediction = String(rec.prediction || "").toLowerCase().includes(q);

      return matchIncome || matchPurpose || matchEducation || matchPrediction;
    }

    return true;
  });

  return (
    <div className="relative min-h-screen bg-[#F5F3ED] text-[#111111] px-6 lg:px-16 py-16 overflow-hidden">
      {/* Background Layer with faint HISTORY watermark and retro details */}
      <BackgroundLayer mode="history" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16 border-b-2 border-[#111111] pb-8 bg-white/60 backdrop-blur-xs p-6 border-2 shadow-[4px_4px_0px_#111111]">
          <span className="font-mono text-xs uppercase tracking-widest text-[#111111]/70 block mb-2 font-bold">
            CSV RECORD STORAGE • LIVE CSV SYNC
          </span>
          <h1 className="font-black text-5xl md:text-7xl uppercase tracking-tight text-[#111111]">
            LOAN HISTORY
          </h1>
          <p className="font-mono text-sm text-[#111111]/80 mt-3">
            Persistent log of submitted applications stored in <code className="bg-[#EFFF4F] px-2 py-0.5 border border-black text-xs">backend/data/loan_records.csv</code>.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
          {/* Status Filter Pills */}
          <div className="flex items-center gap-3 font-mono text-xs font-bold">
            <button
              onClick={() => setFilter("ALL")}
              className={`px-5 py-2.5 rounded-full border-2 border-[#111111] transition-all cursor-pointer ${
                filter === "ALL"
                  ? "bg-[#111111] text-[#EFFF4F] shadow-[3px_3px_0px_#00A99D]"
                  : "bg-white text-[#111111] hover:bg-[#EFFF4F]"
              }`}
            >
              ALL ({records.length})
            </button>
            <button
              onClick={() => setFilter("APPROVED")}
              className={`px-5 py-2.5 rounded-full border-2 border-[#111111] transition-all cursor-pointer ${
                filter === "APPROVED"
                  ? "bg-[#10b981] text-white shadow-[3px_3px_0px_#111111]"
                  : "bg-white text-[#111111] hover:bg-[#10b981]/20"
              }`}
            >
              APPROVED ({records.filter((r) => r.prediction === "Approved").length})
            </button>
            <button
              onClick={() => setFilter("REJECTED")}
              className={`px-5 py-2.5 rounded-full border-2 border-[#111111] transition-all cursor-pointer ${
                filter === "REJECTED"
                  ? "bg-[#ef4444] text-white shadow-[3px_3px_0px_#111111]"
                  : "bg-white text-[#111111] hover:bg-[#ef4444]/20"
              }`}
            >
              REJECTED ({records.filter((r) => r.prediction === "Rejected").length})
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-3 text-[#111111]/60" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search history..."
                className="w-full pl-9 pr-4 py-2.5 bg-white border-2 border-[#111111] rounded-full font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#EFFF4F]"
              />
            </div>
            <button
              onClick={loadHistory}
              disabled={loading}
              className="bg-[#111111] text-[#EFFF4F] p-2.5 rounded-full border-2 border-[#111111] hover:bg-[#EFFF4F] hover:text-[#111111] transition-all cursor-pointer shadow-[2px_2px_0px_#111111]"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* History Table or Empty State */}
        {filteredRecords.length === 0 ? (
          <div className="bg-white/95 rounded-2xl border-2 border-[#111111] p-16 text-center max-w-xl mx-auto my-12 shadow-[6px_6px_0px_#111111]">
            <h2 className="font-black text-3xl uppercase tracking-tight mb-3 text-[#111111]">
              NO LOAN APPLICATIONS YET.
            </h2>
            <p className="font-mono text-xs text-[#111111]/70 mb-8">
              Make your first loan prediction to store application records in loan_records.csv.
            </p>
            <Link
              to="/predict"
              className="inline-block bg-[#EFFF4F] text-[#111111] font-mono font-bold text-xs uppercase tracking-widest px-8 py-4 rounded-full border-2 border-[#111111] hover:bg-[#111111] hover:text-[#EFFF4F] transition-all shadow-[4px_4px_0px_#111111]"
            >
              MAKE A PREDICTION →
            </Link>
          </div>
        ) : (
          <div className="bg-white/95 rounded-2xl border-2 border-[#111111] overflow-hidden shadow-[6px_6px_0px_#111111]">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead>
                  <tr className="bg-[#111111] text-[#EFFF4F] uppercase">
                    <th className="p-4 border-b-2 border-[#111111]">DATE</th>
                    <th className="p-4 border-b-2 border-[#111111]">LOAN DETAILS</th>
                    <th className="p-4 border-b-2 border-[#111111]">PREDICTION</th>
                    <th className="p-4 border-b-2 border-[#111111] text-right">PROBABILITY</th>
                    <th className="p-4 border-b-2 border-[#111111] text-center">DETAILS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((rec, idx) => (
                    <React.Fragment key={idx}>
                      <tr
                        onClick={() => toggleRow(idx)}
                        className="hover:bg-[#EFFF4F]/20 transition-colors border-b border-[#111111]/15 cursor-pointer"
                      >
                        <td className="p-4 font-bold text-[#111111]/70 whitespace-nowrap">
                          {rec.timestamp || "N/A"}
                        </td>
                        <td className="p-4 font-sans font-bold text-sm">
                          ${Number(rec.LoanAmount || 0).toLocaleString()} <span className="text-xs text-[#111111]/60 font-mono">({rec.LoanPurpose})</span>
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-block px-3 py-1 rounded-full font-bold text-[10px] uppercase border-2 ${
                              rec.prediction === "Approved"
                                ? "bg-[#10b981]/20 text-[#10b981] border-[#10b981]"
                                : "bg-[#ef4444]/20 text-[#ef4444] border-[#ef4444]"
                            }`}
                          >
                            {rec.prediction}
                          </span>
                        </td>
                        <td className="p-4 text-right font-bold text-sm">
                          {rec.probability_approved != null
                            ? `${rec.probability_approved}%`
                            : `${(Number(rec.probability || 0) * 100).toFixed(1)}%`}
                        </td>
                        <td className="p-4 text-center text-[#111111]/50">
                          {expandedRow === idx ? <ChevronUp className="w-4 h-4 inline" /> : <ChevronDown className="w-4 h-4 inline" />}
                        </td>
                      </tr>

                      {/* Expandable Details Drawer */}
                      {expandedRow === idx && (
                        <tr className="bg-[#F5F3ED] border-b-2 border-[#111111]">
                          <td colSpan={5} className="p-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs">
                              <div>
                                <span className="text-[#111111]/60 block">Applicant Age:</span>
                                <strong>{rec.Age} years</strong>
                              </div>
                              <div>
                                <span className="text-[#111111]/60 block">Annual Income:</span>
                                <strong>${Number(rec.Income || 0).toLocaleString()}</strong>
                              </div>
                              <div>
                                <span className="text-[#111111]/60 block">Credit Score:</span>
                                <strong>{rec.CreditScore}</strong>
                              </div>
                              <div>
                                <span className="text-[#111111]/60 block">DTI Ratio:</span>
                                <strong>{rec.DTIRatio}</strong>
                              </div>
                              <div>
                                <span className="text-[#111111]/60 block">Education:</span>
                                <strong>{rec.Education}</strong>
                              </div>
                              <div>
                                <span className="text-[#111111]/60 block">Employment:</span>
                                <strong>{rec.EmploymentType} ({rec.MonthsEmployed} mos)</strong>
                              </div>
                              <div>
                                <span className="text-[#111111]/60 block">Interest Rate:</span>
                                <strong>{rec.InterestRate}%</strong>
                              </div>
                              <div>
                                <span className="text-[#111111]/60 block">Model Used:</span>
                                <strong className="text-[#00A99D]">{rec.model_used || "Decision Tree"}</strong>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

