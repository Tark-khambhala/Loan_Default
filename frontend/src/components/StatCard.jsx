import { motion } from "framer-motion";

export default function StatCard({ title, value, label, subtitle, bg = "bg-[#F5F3ED]", accent = "text-black" }) {
  return (
    <motion.div
      whileHover={{ y: -4, rotate: -0.5 }}
      transition={{ duration: 0.2 }}
      className={`p-6 md:p-8 rounded-2xl border-2 border-black ${bg} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between h-full relative overflow-hidden`}
    >
      <div className="flex justify-between items-start">
        <span className="font-mono text-xs font-bold uppercase tracking-widest text-black/60 bg-black/5 px-3 py-1 rounded-full border border-black/20">
          {label || "Metric"}
        </span>
        <span className="w-3 h-3 rounded-full bg-black"></span>
      </div>

      <div className="my-6">
        <div className={`font-black tracking-tighter leading-none text-5xl md:text-7xl ${accent}`}>
          {value}
        </div>
      </div>

      <div>
        <h3 className="font-extrabold uppercase text-lg text-black">{title}</h3>
        {subtitle && <p className="font-mono text-xs text-black/70 mt-1">{subtitle}</p>}
      </div>
    </motion.div>
  );
}
