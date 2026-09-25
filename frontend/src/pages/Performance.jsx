import { useEffect, useState } from "react";
import { getModelPerformance } from "../services/api";
import PerformanceChart from "../components/PerformanceChart";
import ErrorChart from "../components/ErrorChart";
import ConfusionMatrix from "../components/ConfusionMatrix";
import BackgroundLayer from "../components/BackgroundLayer";

export default function Performance() {
  const [data, setData] = useState({ active_model: "Decision Tree", models: [] });
  const [loading, setLoading] = useState(true);
  const [selectedMatrixModel, setSelectedMatrixModel] = useState("Decision Tree");
  const [selectedDetailsModel, setSelectedDetailsModel] = useState("Decision Tree");

  useEffect(() => {
    async function loadPerformance() {
      try {
        const res = await getModelPerformance();
        setData(res);
        if (res.models && res.models.length > 0) {
          setSelectedMatrixModel(res.models[0].name);
          setSelectedDetailsModel(res.models[0].name);
        }
      } catch (err) {
        console.error("Model performance load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadPerformance();
  }, []);

  const currentMatrixObj = data.models.find((m) => m.name === selectedMatrixModel) || data.models[0];
  const currentDetailsObj = data.models.find((m) => m.name === selectedDetailsModel) || data.models[0];

  return (
    <div className="relative min-h-screen bg-[#F5F3ED] text-[#111111] px-6 lg:px-16 py-16 overflow-hidden">
      {/* Background Layer with Research / Math elements */}
      <BackgroundLayer mode="performance" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16 border-b-2 border-[#111111] pb-8 bg-white/60 backdrop-blur-xs p-6 border-2 shadow-[4px_4px_0px_#111111]">
          <span className="font-mono text-xs uppercase tracking-widest text-[#111111]/70 block mb-2 font-bold">
            UNIT-03 EVALUATION • CLASSIFICATION BENCHMARKS
          </span>
          <h1 className="font-black text-5xl md:text-7xl uppercase tracking-tight text-[#111111]">
            MODEL PERFORMANCE
          </h1>
          <p className="font-mono text-sm text-[#111111]/80 mt-3">
            Understand how each machine-learning algorithm behaves on test data.
          </p>
        </div>

        {/* 1. Large Comparison Table */}
        <div className="bg-white/95 rounded-2xl border-2 border-[#111111] p-8 shadow-[6px_6px_0px_#111111] mb-20">
          <h2 className="font-black text-2xl uppercase tracking-tight mb-6">ALL TRAINED MODELS</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="bg-[#111111] text-[#EFFF4F] uppercase">
                  <th className="p-4 border-b-2 border-[#111111]">MODEL</th>
                  <th className="p-4 border-b-2 border-[#111111] text-right">ACCURACY</th>
                  <th className="p-4 border-b-2 border-[#111111] text-right">ERROR</th>
                  <th className="p-4 border-b-2 border-[#111111] text-right">PRECISION</th>
                  <th className="p-4 border-b-2 border-[#111111] text-right">RECALL</th>
                  <th className="p-4 border-b-2 border-[#111111] text-right">F1 SCORE</th>
                </tr>
              </thead>
              <tbody>
                {data.models.map((m) => (
                  <tr key={m.name} className="hover:bg-[#EFFF4F]/20 transition-colors border-b border-[#111111]/15">
                    <td className="p-4 font-sans font-bold text-sm text-[#111111]">{m.name}</td>
                    <td className="p-4 text-right font-bold text-sm text-[#111111]">
                      {(m.accuracy * 100).toFixed(1)}%
                    </td>
                    <td className="p-4 text-right font-bold text-[#ef4444]">
                      {(m.error_rate * 100).toFixed(1)}%
                    </td>
                    <td className="p-4 text-right font-bold">
                      {(m.precision * 100).toFixed(1)}%
                    </td>
                    <td className="p-4 text-right font-bold">
                      {(m.recall * 100).toFixed(1)}%
                    </td>
                    <td className="p-4 text-right font-bold text-[#00A99D]">
                      {m.f1_score.toFixed(4)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 2. Performance Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <div className="bg-white/95 p-4 rounded-2xl border-2 border-[#111111] shadow-[4px_4px_0px_#111111]">
            <PerformanceChart models={data.models} />
          </div>
          <div className="bg-white/95 p-4 rounded-2xl border-2 border-[#111111] shadow-[4px_4px_0px_#111111]">
            <ErrorChart models={data.models} />
          </div>
        </div>

        {/* 3. Confusion Matrix Section */}
        <div className="mb-20 bg-white/95 p-8 rounded-2xl border-2 border-[#111111] shadow-[6px_6px_0px_#111111]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="font-black text-2xl uppercase tracking-tight">CONFUSION MATRIX</h2>
            <div className="flex items-center gap-2 font-mono text-xs">
              <label className="font-bold text-[#111111]">SELECT MODEL:</label>
              <select
                value={selectedMatrixModel}
                onChange={(e) => setSelectedMatrixModel(e.target.value)}
                className="bg-[#F5F3ED] border-2 border-[#111111] rounded-xl px-4 py-2 font-bold font-sans text-sm focus:outline-none"
              >
                {data.models.map((m) => (
                  <option key={m.name} value={m.name}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {currentMatrixObj && (
            <ConfusionMatrix matrix={currentMatrixObj.confusion_matrix} modelName={currentMatrixObj.name} />
          )}
        </div>

        {/* 4. Model Details Dropdown Section */}
        <div className="bg-white/95 p-8 md:p-12 rounded-2xl border-2 border-[#111111] shadow-[6px_6px_0px_#111111]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b-2 border-[#111111]/20 pb-6">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-[#111111]/70 block mb-1 font-bold">
                DETAILED INFORMATION
              </span>
              <h2 className="font-black text-2xl uppercase tracking-tight">MODEL DETAILS</h2>
            </div>
            <select
              value={selectedDetailsModel}
              onChange={(e) => setSelectedDetailsModel(e.target.value)}
              className="bg-[#F5F3ED] border-2 border-[#111111] rounded-xl px-4 py-2 font-bold font-sans text-sm focus:outline-none"
            >
              {data.models.map((m) => (
                <option key={m.name} value={m.name}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {currentDetailsObj && (
            <div>
              <div className="font-mono text-xs text-[#111111]/60 uppercase tracking-widest mb-1">Algorithm</div>
              <h3 className="font-black text-3xl text-[#111111] mb-6">{currentDetailsObj.algorithm}</h3>
              <p className="font-mono text-sm text-[#111111]/80 max-w-3xl leading-relaxed mb-8 bg-[#F5F3ED]/60 p-4 border-l-4 border-[#111111]">
                {currentDetailsObj.description}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-6 font-mono text-xs text-center">
                <div className="bg-[#F5F3ED] p-4 rounded-xl border-2 border-[#111111]">
                  <span className="text-[#111111]/70 block mb-1 font-bold">Accuracy</span>
                  <span className="font-black text-2xl text-[#111111]">{(currentDetailsObj.accuracy * 100).toFixed(1)}%</span>
                </div>
                <div className="bg-[#F5F3ED] p-4 rounded-xl border-2 border-[#111111]">
                  <span className="text-[#111111]/70 block mb-1 font-bold">Error Rate</span>
                  <span className="font-black text-2xl text-[#ef4444]">{(currentDetailsObj.error_rate * 100).toFixed(1)}%</span>
                </div>
                <div className="bg-[#F5F3ED] p-4 rounded-xl border-2 border-[#111111]">
                  <span className="text-[#111111]/70 block mb-1 font-bold">Precision</span>
                  <span className="font-black text-2xl text-[#111111]">{(currentDetailsObj.precision * 100).toFixed(1)}%</span>
                </div>
                <div className="bg-[#F5F3ED] p-4 rounded-xl border-2 border-[#111111]">
                  <span className="text-[#111111]/70 block mb-1 font-bold">Recall</span>
                  <span className="font-black text-2xl text-[#111111]">{(currentDetailsObj.recall * 100).toFixed(1)}%</span>
                </div>
                <div className="bg-[#F5F3ED] p-4 rounded-xl border-2 border-[#111111]">
                  <span className="text-[#111111]/70 block mb-1 font-bold">F1 Score</span>
                  <span className="font-black text-2xl text-[#00A99D]">{currentDetailsObj.f1_score.toFixed(4)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

