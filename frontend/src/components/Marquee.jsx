export default function Marquee({ text = "astro • MACHINE LEARNING FOR LOANS • DATA-DRIVEN DECISIONS • MODEL INTELLIGENCE • " }) {
  return (
    <div className="w-full overflow-hidden bg-[#111111] text-[#EFFF4F] py-3 border-y border-[#111111] font-mono font-bold text-xs tracking-widest uppercase select-none">
      <div className="whitespace-nowrap flex animate-marquee">
        <span className="mx-6">{text}</span>
        <span className="mx-6">{text}</span>
        <span className="mx-6">{text}</span>
        <span className="mx-6">{text}</span>
      </div>
    </div>
  );
}
