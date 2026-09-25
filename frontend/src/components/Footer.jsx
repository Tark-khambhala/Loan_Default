import AstroLogo from "./AstroLogo";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#111111] text-[#F5F3EA] border-t border-[#111111] pt-20 pb-12 px-6 lg:px-16 mt-32">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
        {/* Brand Col */}
        <div className="md:col-span-6 flex flex-col justify-between">
          <div>
            <div className="mb-6">
              <AstroLogo size="md" color="white" />
            </div>
            <p className="font-mono text-sm text-[#F5F3EA]/70 max-w-md leading-relaxed">
              Machine learning for smarter lending decisions. astro analyzes financial parameters using cross-validated decision algorithms.
            </p>
          </div>
          <div className="font-mono text-xs text-[#EFFF4F] tracking-widest uppercase mt-8">
            MACHINE LEARNING • LOAN ANALYTICS • DATA
          </div>
        </div>

        {/* Quick Links */}
        <div className="md:col-span-3 font-mono text-xs">
          <h4 className="text-[#EFFF4F] uppercase font-bold tracking-widest mb-4">PLATFORM</h4>
          <ul className="space-y-3 text-[#F5F3EA]/80 font-bold">
            <li><Link to="/" className="hover:text-[#EFFF4F] transition-colors">HOME</Link></li>
            <li><Link to="/dashboard" className="hover:text-[#EFFF4F] transition-colors">MODEL INTELLIGENCE</Link></li>
            <li><Link to="/predict" className="hover:text-[#EFFF4F] transition-colors">MAKE A PREDICTION</Link></li>
            <li><Link to="/performance" className="hover:text-[#EFFF4F] transition-colors">MODEL PERFORMANCE</Link></li>
            <li><Link to="/history" className="hover:text-[#EFFF4F] transition-colors">LOAN HISTORY</Link></li>
          </ul>
        </div>

        {/* System Details */}
        <div className="md:col-span-3 font-mono text-xs">
          <h4 className="text-[#EFFF4F] uppercase font-bold tracking-widest mb-4">ENGINE SPECS</h4>
          <div className="space-y-2 text-[#F5F3EA]/70">
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span>Active Model:</span>
              <strong className="text-white">Decision Tree</strong>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span>FastAPI Backend:</span>
              <strong className="text-[#EFFF4F]">Online (8000)</strong>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span>CSV Storage:</span>
              <strong className="text-white">loan_records.csv</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-xs font-mono text-[#F5F3EA]/50 gap-4">
        <div>Built for intelligent loan analysis. © 2026 astro. All rights reserved.</div>
        <div className="text-[#EFFF4F]">LESS, BUT BETTER.</div>
      </div>
    </footer>
  );
}
