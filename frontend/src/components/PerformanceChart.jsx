import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

export default function PerformanceChart({ models = [] }) {
  const chartData = models.map((m) => ({
    name: m.name,
    accuracy: Number((m.accuracy * 100).toFixed(1)),
    cv_score: Number(((m.cv_score || 0) * 100).toFixed(1)),
    error_rate: Number((m.error_rate * 100).toFixed(1))
  })).sort((a, b) => b.accuracy - a.accuracy);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#111111] text-[#EFFF4F] p-4 rounded-xl font-mono text-xs border border-white/20 shadow-xl">
          <p className="font-bold text-sm text-white mb-1">{data.name}</p>
          <p>Accuracy: <strong className="text-[#EFFF4F]">{data.accuracy}%</strong></p>
          <p>5-Fold CV: <strong className="text-[#00A99D]">{data.cv_score}%</strong></p>
          <p>Error Rate: <strong>{data.error_rate}%</strong></p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[450px] bg-white p-8 rounded-3xl border border-[#111111]/15 shadow-sm flex flex-col justify-between">
      <div className="flex justify-between items-center mb-6">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#111111]/50 block mb-1">
            CLASSIFICATION ACCURACY
          </span>
          <h3 className="font-black text-2xl text-[#111111] uppercase tracking-tight">MODEL ACCURACY</h3>
        </div>
        <span className="font-mono text-xs font-bold bg-[#EFFF4F] border border-[#111111] px-3 py-1 rounded-full text-[#111111]">
          Real Evaluation Data
        </span>
      </div>

      <ResponsiveContainer width="100%" height="80%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 30, bottom: 5 }}
        >
          <XAxis type="number" domain={[70, 100]} stroke="#111111" tick={{ fill: "#111111", fontSize: 12, fontFamily: "monospace" }} />
          <YAxis dataKey="name" type="category" stroke="#111111" tick={{ fill: "#111111", fontSize: 13, fontWeight: 700 }} width={140} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="accuracy" radius={[0, 8, 8, 0]} barSize={24}>
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={index === 0 ? "#EFFF4F" : "#111111"}
                stroke="#111111"
                strokeWidth={1.5}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
