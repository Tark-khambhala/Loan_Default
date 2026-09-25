import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AstroLogo from "./AstroLogo";

export default function BackgroundLayer({ mode = "hero", showGrid = true, showDots = true }) {
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Respect prefers-reduced-motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) return;

    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const x = ((e.clientX / innerWidth) - 0.5) * 12; // -6px to +6px
      const y = ((e.clientY / innerHeight) - 0.5) * 12;
      setMouseOffset({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* 1. Base Grid Layer */}
      {showGrid && (
        <div className="absolute inset-0 bg-grid-pattern opacity-60" />
      )}

      {/* 2. Floating Dot Field */}
      {showDots && (
        <div className="absolute inset-0 bg-dots-pattern opacity-40" />
      )}

      {/* 3. Horizontal Retro Scanline Bar */}
      <div className="absolute inset-x-0 h-16 bg-gradient-to-b from-transparent via-[#EFFF4F]/10 to-transparent animate-scanline opacity-30 pointer-events-none" />

      {/* 4. Parallax Container for Floating Shapes & Graphics */}
      <div
        className="absolute inset-0 transition-transform duration-300 ease-out"
        style={{
          transform: `translate3d(${mouseOffset.x}px, ${mouseOffset.y}px, 0)`
        }}
      >
        {/* HERO MODE DECORATION */}
        {mode === "hero" && (
          <>
            {/* Large Lime Geometric Accent Shape */}
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#EFFF4F] rounded-full blur-3xl opacity-35" />
            <div className="absolute top-1/3 -left-20 w-80 h-80 bg-[#EFFF4F]/40 rounded-full border border-black/10 -rotate-12" />

            {/* Giant Outlined Typography Background Watermark */}
            <div className="absolute top-28 left-1/2 -translate-x-1/2 text-[140px] md:text-[220px] font-black tracking-tighter leading-none text-outline-black opacity-40 uppercase pointer-events-none whitespace-nowrap">
              ASTRO
            </div>

            {/* Large SVG Orbit Rings */}
            <svg className="absolute -top-20 right-10 w-[600px] h-[600px] opacity-25" viewBox="0 0 600 600" fill="none">
              <circle cx="300" cy="300" r="280" stroke="#111111" strokeWidth="1" strokeDasharray="4 4" />
              <circle cx="300" cy="300" r="210" stroke="#111111" strokeWidth="1" />
              <circle cx="300" cy="300" r="140" stroke="#00A99D" strokeWidth="1.5" />
              <circle cx="510" cy="300" r="8" fill="#111111" />
              <circle cx="300" cy="90" r="6" fill="#00A99D" />
            </svg>

            {/* Retro Rotating Text Ring */}
            <div className="absolute top-64 right-16 w-36 h-36 border border-black/10 rounded-full flex items-center justify-center animate-spin-slow opacity-60 hidden md:flex">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <path id="textPathHero" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" fill="none" />
                <text className="text-[9px] font-mono tracking-widest uppercase fill-black">
                  <textPath href="#textPathHero" startOffset="0%">
                    • ASTRO • ML ENGINE • PREDICTION •
                  </textPath>
                </text>
              </svg>
            </div>

            {/* Decorative Stars / Sparks */}
            <div className="absolute top-36 left-16 text-black/40 text-2xl font-mono animate-spin-slow">
              ✦
            </div>
            <div className="absolute top-96 right-1/4 text-black/30 text-3xl font-mono animate-float-pulse">
              ✦
            </div>
            <div className="absolute bottom-40 left-1/4 text-[#00A99D]/60 text-xl font-mono">
              ✦
            </div>

            {/* Abstract Decorative ML Math & Code Labels */}
            <div className="absolute top-48 left-12 font-mono text-xs text-black/40 bg-white/60 border border-black/10 px-2 py-1 rounded shadow-sm">
              <span className="text-[#00A99D] font-bold">P(y|x)</span> = 0.942
            </div>
            <div className="absolute bottom-60 right-20 font-mono text-xs text-black/40 bg-white/60 border border-black/10 px-2 py-1 rounded shadow-sm">
              MODEL_07 • CLASSIFIER [ACTIVE]
            </div>
            <div className="absolute bottom-32 left-16 font-mono text-xs text-black/30">
              ŷ = f(x) | Σ(w_i * x_i) + b
            </div>

            {/* Corner Halftone Pattern */}
            <div className="absolute bottom-10 right-10 w-48 h-48 bg-halftone" />
          </>
        )}

        {/* DASHBOARD MODE DECORATION */}
        {mode === "dashboard" && (
          <>
            {/* Subtle Astro Watermark */}
            <div className="absolute top-20 right-10 opacity-[0.04]">
              <AstroLogo size="lg" />
            </div>
            
            {/* Diagonal Retro Stripes block at corner */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-stripes opacity-40" />

            {/* Orbit Lines */}
            <svg className="absolute top-1/4 -left-40 w-[500px] h-[500px] opacity-20" viewBox="0 0 500 500" fill="none">
              <circle cx="250" cy="250" r="230" stroke="#111111" strokeWidth="1.5" strokeDasharray="6 6" />
              <circle cx="250" cy="250" r="160" stroke="#111111" strokeWidth="1" />
              <circle cx="250" cy="90" r="5" fill="#111111" />
            </svg>

            {/* Sparks */}
            <div className="absolute top-24 left-1/3 text-black/25 text-xl font-mono animate-spin-slow">
              ✦
            </div>
            <div className="absolute bottom-32 right-1/4 text-[#00A99D]/40 text-2xl font-mono">
              ✦
            </div>

            {/* Faint Abstract Data Labels */}
            <div className="absolute bottom-20 left-12 font-mono text-[11px] text-black/35">
              DATASET v2.4 • N = 1,284 • PREDICT_CONFIDENCE: 94.2%
            </div>
          </>
        )}

        {/* PREDICTION MODE DECORATION */}
        {mode === "prediction" && (
          <>
            {/* Faint Outline Typography */}
            <div className="absolute top-16 right-10 text-[120px] md:text-[180px] font-black text-outline-black opacity-20 pointer-events-none whitespace-nowrap">
              PREDICT
            </div>

            {/* Large Soft Lime Background Circle behind form */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#EFFF4F]/25 rounded-full blur-3xl pointer-events-none" />

            {/* Orbit Elements */}
            <svg className="absolute -bottom-20 -right-20 w-[450px] h-[450px] opacity-20" viewBox="0 0 450 450" fill="none">
              <circle cx="225" cy="225" r="210" stroke="#111111" strokeWidth="1" />
              <circle cx="225" cy="225" r="140" stroke="#00A99D" strokeWidth="1" strokeDasharray="3 3" />
            </svg>

            {/* Sparks */}
            <div className="absolute top-40 left-16 text-black/30 text-2xl font-mono animate-float-pulse">
              ✦
            </div>
            <div className="absolute bottom-40 left-24 text-black/20 text-xl font-mono">
              ✦
            </div>

            {/* Math Notation */}
            <div className="absolute top-36 right-36 font-mono text-xs text-black/30">
              P(APPROVED | X_APPLICANT)
            </div>
          </>
        )}

        {/* PERFORMANCE MODE DECORATION */}
        {mode === "performance" && (
          <>
            <div className="absolute top-10 left-10 text-[110px] md:text-[160px] font-black text-outline-black opacity-25 pointer-events-none uppercase">
              METRICS
            </div>

            {/* Corner Lime Stripe block */}
            <div className="absolute bottom-0 left-0 w-80 h-40 bg-[#EFFF4F]/40 -skew-x-12 opacity-50" />

            {/* Math / Technical Background Notation */}
            <div className="absolute top-48 right-16 font-mono text-xs text-black/40 space-y-1 text-right">
              <div>ACCURACY = (TP + TN) / TOTAL</div>
              <div>PRECISION = TP / (TP + FP)</div>
              <div>RECALL = TP / (TP + FN)</div>
              <div className="text-[#00A99D] font-bold">F1_SCORE = 0.942</div>
            </div>

            {/* Spark */}
            <div className="absolute top-28 right-1/3 text-black/30 text-2xl font-mono animate-spin-slow">
              ✦
            </div>

            {/* Orbit rings */}
            <svg className="absolute -bottom-30 right-1/4 w-[500px] h-[500px] opacity-15" viewBox="0 0 500 500" fill="none">
              <circle cx="250" cy="250" r="230" stroke="#111111" strokeWidth="1.5" />
              <circle cx="250" cy="250" r="150" stroke="#111111" strokeWidth="1" strokeDasharray="4 4" />
            </svg>
          </>
        )}

        {/* HISTORY MODE DECORATION */}
        {mode === "history" && (
          <>
            <div className="absolute top-16 left-12 text-[120px] md:text-[180px] font-black text-outline-black opacity-20 pointer-events-none uppercase">
              RECORDS
            </div>

            {/* Faint Astro Watermark */}
            <div className="absolute bottom-20 right-12 opacity-[0.05]">
              <AstroLogo size="lg" />
            </div>

            {/* Halftone block */}
            <div className="absolute top-24 right-20 w-40 h-40 bg-halftone" />

            {/* Spark */}
            <div className="absolute top-44 right-1/3 text-black/25 text-2xl font-mono animate-float-pulse">
              ✦
            </div>

            {/* Data Label */}
            <div className="absolute bottom-16 left-16 font-mono text-xs text-black/30">
              CSV_STORAGE: backend/data/loan_records.csv
            </div>
          </>
        )}
      </div>
    </div>
  );
}
