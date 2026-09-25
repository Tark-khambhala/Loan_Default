import { useEffect, useState } from "react";
import PerformanceChart from "../components/PerformanceChart";
import BackgroundLayer from "../components/BackgroundLayer";
import { getDashboardStats } from "../services/api";

export default function Dashboard() {
  const [data, setData] = useState({
    total_records: 0,
    approved: 0,
    rejected: 0,
    top_model: { name: "Decision Tree", accuracy: 0.8832 },
    models: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const res = await getDashboardStats();
        setData(res);
      } catch (err) {
        console.error("Dashboard stats load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  return (
    <div className="relative min-h-screen bg-[#F5F3ED] text-[#111111] px-6 lg:px-16 py-16 overflow-hidden">
      {/* Funky Retro Dashboard Background Layer */}
      <BackgroundLayer mode="dashboard" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16 border-b-2 border-[#111111] pb-8 bg-white/50 backdrop-blur-xs p-6 border-2 shadow-[4px_4px_0px_#111111]">
          <span className="font-mono text-xs uppercase tracking-widest text-[#111111]/70 block mb-2 font-bold">
            ANALYTICS ENGINE • LIVE FASTAPI STATS
          </span>
          <h1 className="font-black text-5xl md:text-7xl uppercase tracking-tight text-[#111111]">
            MODEL INTELLIGENCE
          </h1>
          <p className="font-mono text-sm text-[#111111]/80 mt-3">
            A clear view of how the loan prediction system is performing.
          </p>
        </div>

        {/* 3 Large Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white/90 p-8 rounded-2xl border-2 border-[#111111] shadow-[4px_4px_0px_#111111]">
            <span className="font-mono text-xs uppercase tracking-widest text-[#111111]/60 block mb-2 font-bold">
              STORAGE
            </span>
            <div className="font-black text-6xl md:text-7xl text-[#111111] tracking-tighter">
              {data.total_records || 0}
            </div>
            <div className="font-mono text-xs font-bold uppercase tracking-widest text-[#111111] mt-4">
              TOTAL RECORDS
            </div>
          </div>

          <div className="bg-[#EFFF4F]/90 p-8 rounded-2xl border-2 border-[#111111] shadow-[4px_4px_0px_#111111]">
            <span className="font-mono text-xs uppercase tracking-widest text-[#111111]/70 block mb-2 font-bold">
              CLASSIFICATION
            </span>
            <div className="font-black text-6xl md:text-7xl text-[#111111] tracking-tighter">
              {data.approved || 0}
            </div>
            <div className="font-mono text-xs font-bold uppercase tracking-widest text-[#10b981] mt-4">
              APPROVED APPLICATIONS
            </div>
          </div>

          <div className="bg-[#111111] text-white p-8 rounded-2xl border-2 border-[#111111] shadow-[4px_4px_0px_#00A99D]">
            <span className="font-mono text-xs uppercase tracking-widest text-white/60 block mb-2 font-bold">
              CLASSIFICATION
            </span>
            <div className="font-black text-6xl md:text-7xl text-[#ef4444] tracking-tighter">
              {data.rejected || 0}
            </div>
            <div className="font-mono text-xs font-bold uppercase tracking-widest text-[#ef4444] mt-4">
              REJECTED APPLICATIONS
            </div>
          </div>
        </div>

        {/* MODEL ACCURACY Chart Section */}
        <div className="mb-20 bg-white/95 p-6 rounded-2xl border-2 border-[#111111] shadow-[6px_6px_0px_#111111]">
          <PerformanceChart models={data.models} />
        </div>
      </div>
    </div>
  );
}

