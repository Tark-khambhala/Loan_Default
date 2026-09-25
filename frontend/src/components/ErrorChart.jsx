import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

export default function ErrorChart({ models = [] }) {
  const chartData = models.map((m) => ({
    name: m.name,
    error_rate: Number((m.error_rate * 100).toFixed(1)),
    accuracy: Number((m.accuracy * 100).toFixed(1))
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#111111] text-[#ef4444] p-3 rounded-xl font-mono text-xs border border-white/20 shadow-xl">
          <p className="font-bold text-sm text-white">{data.name}</p>
          <p className="mt-1">Error Rate: <strong className="text-[#ef4444]">{data.error_rate}%</strong></p>
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
            MISCLASSIFICATION RATE
          </span>
          <h3 className="font-black text-2xl text-[#111111] uppercase tracking-tight">ERROR ANALYSIS</h3>
        </div>
        <span className="font-mono text-xs font-bold bg-[#ef4444] text-white border border-[#111111] px-3 py-1 rounded-full">
          1 - Accuracy %
        </span>
      </div>

      <ResponsiveContainer width="100%" height="80%">
        <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 25 }}>
          <XAxis dataKey="name" stroke="#111111" tick={{ fill: "#111111", fontSize: 11, fontWeight: 700 }} angle={-15} textAnchor="end" />
          <YAxis stroke="#111111" tick={{ fill: "#111111", fontSize: 12, fontFamily: "monospace" }} domain={[0, 15]} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="error_rate" radius={[8, 8, 0, 0]} barSize={30}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill="#ef4444" stroke="#111111" strokeWidth={1.5} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
