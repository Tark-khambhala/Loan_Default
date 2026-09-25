export default function ConfusionMatrix({ matrix, modelName = "Model" }) {
  if (!matrix) return null;

  const { tp = 0, tn = 0, fp = 0, fn = 0 } = matrix;

  return (
    <div className="bg-[#111111] text-white p-8 rounded-3xl border border-[#111111]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#EFFF4F]">
            CLASSIFICATION MATRIX
          </span>
          <h4 className="font-black text-2xl text-white uppercase tracking-tight mt-1">
            {modelName}
          </h4>
        </div>
        <span className="font-mono text-xs bg-white/10 text-white px-3 py-1 rounded-full border border-white/20">
          2x2 Heatmap
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 font-mono text-xs text-center mt-6">
        {/* Header row */}
        <div className="p-3 font-bold text-white/50 flex items-center justify-center">Actual \ Predicted</div>
        <div className="p-3 font-bold text-[#10b981] bg-white/5 rounded-t-xl">Pred: APPROVED (0)</div>
        <div className="p-3 font-bold text-[#ef4444] bg-white/5 rounded-t-xl">Pred: REJECTED (1)</div>

        {/* Row 1: Actual Approved (0) */}
        <div className="p-4 font-bold text-[#10b981] bg-white/5 flex items-center justify-center rounded-l-xl">
          Actual: APPROVED (0)
        </div>
        <div className="p-6 bg-[#10b981]/20 border border-[#10b981]/40 rounded-xl flex flex-col items-center justify-center">
          <span className="text-3xl font-black text-[#10b981]">{tn}</span>
          <span className="text-[10px] text-white/70 uppercase mt-1">True Negative (Safe)</span>
        </div>
        <div className="p-6 bg-[#ef4444]/20 border border-[#ef4444]/40 rounded-xl flex flex-col items-center justify-center">
          <span className="text-3xl font-black text-[#ef4444]">{fp}</span>
          <span className="text-[10px] text-white/70 uppercase mt-1">False Positive (False Alarm)</span>
        </div>

        {/* Row 2: Actual Rejected (1) */}
        <div className="p-4 font-bold text-[#ef4444] bg-white/5 flex items-center justify-center rounded-l-xl">
          Actual: REJECTED (1)
        </div>
        <div className="p-6 bg-[#ef4444]/30 border border-[#ef4444]/60 rounded-xl flex flex-col items-center justify-center">
          <span className="text-3xl font-black text-[#ef4444]">{fn}</span>
          <span className="text-[10px] text-white/70 uppercase mt-1">False Negative (Default Risk!)</span>
        </div>
        <div className="p-6 bg-[#10b981]/20 border border-[#10b981]/40 rounded-xl flex flex-col items-center justify-center">
          <span className="text-3xl font-black text-[#10b981]">{tp}</span>
          <span className="text-[10px] text-white/70 uppercase mt-1">True Positive (Risk Caught)</span>
        </div>
      </div>
    </div>
  );
}
