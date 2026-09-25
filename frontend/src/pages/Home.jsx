import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import AstroLogo from "../components/AstroLogo";
import Marquee from "../components/Marquee";
import BackgroundLayer from "../components/BackgroundLayer";
import { getDashboardStats } from "../services/api";

export default function Home() {
  const [stats, setStats] = useState({
    total_records: 0,
    approved: 0,
    rejected: 0,
    top_model: { name: "Decision Tree", accuracy: 0.8832 }
  });

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error("Home stats error:", err);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="relative min-h-screen bg-[#F5F3ED] text-[#111111] overflow-hidden">
      {/* Dynamic Funky Background Layer */}
      <BackgroundLayer mode="hero" />

      {/* Foreground Content Container */}
      <div className="relative z-10">
        <Marquee text="astro • MACHINE LEARNING FOR LOANS • DATA-DRIVEN DECISIONS • MODEL INTELLIGENCE • " />

        {/* Hero Section */}
        <section className="px-6 lg:px-16 pt-16 pb-24 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            {/* Left Column: Typography */}
            <div className="lg:col-span-7">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="mb-8"
              >
                <AstroLogo size="lg" animated={true} />
              </motion.div>

              <motion.h1
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="font-black text-6xl md:text-8xl tracking-tight leading-none uppercase text-[#111111] mb-8"
              >
                LOAN APPROVAL,<br />
                <span className="bg-[#EFFF4F] text-[#111111] px-3 py-1 inline-block border border-[#111111] mt-2 shadow-[4px_4px_0px_#111111]">
                  REIMAGINED.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="font-mono text-base md:text-lg text-[#111111]/80 max-w-xl leading-relaxed mb-10 bg-white/40 p-4 border-l-4 border-[#111111] backdrop-blur-xs"
              >
                Machine learning for smarter lending decisions. Evaluated using cross-validated decision trees, random forests, and gradient boosting algorithms.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                className="flex flex-wrap items-center gap-6"
              >
                <Link
                  to="/predict"
                  className="bg-[#EFFF4F] text-[#111111] font-mono font-bold text-sm uppercase tracking-widest px-8 py-4 rounded-full border border-[#111111] hover:bg-[#111111] hover:text-[#EFFF4F] transition-all duration-200 shadow-[4px_4px_0px_#111111] hover:translate-y-[-2px]"
                >
                  MAKE A PREDICTION →
                </Link>
                <Link
                  to="/dashboard"
                  className="bg-white text-[#111111] font-mono font-bold text-sm uppercase tracking-widest px-8 py-4 rounded-full border border-[#111111] hover:bg-[#EFFF4F] transition-all duration-200 shadow-[4px_4px_0px_#111111]"
                >
                  VIEW DASHBOARD
                </Link>
              </motion.div>
            </div>

            {/* Right Column: Abstract Rotating Logo Visual */}
            <div className="lg:col-span-5 flex justify-center relative">
              <motion.div
                initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="w-80 h-80 md:w-96 md:h-96 rounded-full bg-[#111111] relative flex flex-col items-center justify-center p-8 border-4 border-[#111111] shadow-2xl"
              >
                {/* Orbit Accent Ring */}
                <div className="absolute inset-[-16px] rounded-full border-2 border-dashed border-[#111111]/40 animate-spin-slow"></div>

                <div className="bg-[#EFFF4F] p-4 rounded-full mb-4 border border-[#111111] shadow-[2px_2px_0px_#111111]">
                  <AstroLogo size="sm" color="black" />
                </div>

                <div className="font-mono text-xs text-white/70 uppercase tracking-widest text-center mt-2">
                  ACTIVE MODEL
                </div>
                <div className="font-black text-2xl text-white uppercase mt-1">
                  {stats.top_model?.name || "Decision Tree"}
                </div>
                <div className="font-mono text-4xl font-extrabold text-[#EFFF4F] mt-2">
                  {((stats.top_model?.accuracy || 0.8832) * 100).toFixed(1)}%
                </div>
                <div className="font-mono text-[10px] text-white/50 tracking-widest mt-1">
                  ACCURACY
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Section: THE NUMBERS */}
        <section className="bg-white/90 backdrop-blur-sm py-24 px-6 lg:px-16 border-y-2 border-[#111111]">
          <div className="max-w-7xl mx-auto">
            <span className="font-mono text-xs uppercase tracking-widest text-[#111111]/50 block mb-3">
              SYSTEM METRICS • API DIRECT
            </span>
            <h2 className="font-black text-3xl md:text-5xl uppercase tracking-tight text-[#111111] mb-16">
              THE NUMBERS
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 items-start">
              {/* Stat 1 */}
              <div className="border-l-4 border-[#111111] pl-6 bg-[#F5F3ED]/40 p-4 border border-black/10">
                <div className="font-black text-7xl md:text-8xl tracking-tighter text-[#111111] leading-none">
                  {stats.total_records || 0}
                </div>
                <div className="font-mono text-sm font-bold uppercase tracking-widest text-[#111111] mt-4">
                  TOTAL APPLICATIONS
                </div>
                <p className="font-mono text-xs text-[#111111]/60 mt-1">
                  Stored in backend/data/loan_records.csv
                </p>
              </div>

              {/* Stat 2 */}
              <div className="border-l-4 border-[#EFFF4F] pl-6 bg-[#EFFF4F]/20 p-4 border border-black/10">
                <div className="font-black text-7xl md:text-8xl tracking-tighter text-[#111111] leading-none">
                  {stats.approved || 0}
                </div>
                <div className="font-mono text-sm font-bold uppercase tracking-widest text-[#10b981] mt-4">
                  APPROVED LOANS
                </div>
                <p className="font-mono text-xs text-[#111111]/60 mt-1">
                  Classified as safe borrowers
                </p>
              </div>

              {/* Stat 3 */}
              <div className="border-l-4 border-[#00A99D] pl-6 bg-[#00A99D]/10 p-4 border border-black/10">
                <div className="font-black text-7xl md:text-8xl tracking-tighter text-[#111111] leading-none">
                  {((stats.top_model?.accuracy || 0.8832) * 100).toFixed(1)}%
                </div>
                <div className="font-mono text-sm font-bold uppercase tracking-widest text-[#00A99D] mt-4">
                  MODEL ACCURACY
                </div>
                <p className="font-mono text-xs text-[#111111]/60 mt-1">
                  Top classifier performance
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section: WHY ASTRO? */}
        <section className="py-28 px-6 lg:px-16 max-w-7xl mx-auto">
          <span className="font-mono text-xs uppercase tracking-widest text-[#111111]/50 block mb-3">
            EDITORIAL BREAKDOWN
          </span>
          <h2 className="font-black text-4xl md:text-6xl uppercase tracking-tight text-[#111111] mb-20">
            WHY ASTRO?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {/* Item 01 */}
            <div className="space-y-4 bg-white/70 p-6 border-2 border-[#111111] shadow-[4px_4px_0px_#111111]">
              <span className="font-black text-5xl text-[#111111] bg-[#EFFF4F] px-4 py-1 border border-[#111111] inline-block">
                01
              </span>
              <h3 className="font-black text-2xl uppercase tracking-tight text-[#111111]">
                MULTIPLE MODELS
              </h3>
              <p className="font-mono text-sm text-[#111111]/70 leading-relaxed">
                Compare several machine-learning algorithms for loan approval including Decision Trees, Random Forests, AdaBoost, and Support Vector Machines.
              </p>
            </div>

            {/* Item 02 */}
            <div className="space-y-4 bg-white/70 p-6 border-2 border-[#111111] shadow-[4px_4px_0px_#111111]">
              <span className="font-black text-5xl text-[#111111] bg-[#EFFF4F] px-4 py-1 border border-[#111111] inline-block">
                02
              </span>
              <h3 className="font-black text-2xl uppercase tracking-tight text-[#111111]">
                DATA-DRIVEN
              </h3>
              <p className="font-mono text-sm text-[#111111]/70 leading-relaxed">
                Every prediction is evaluated using real model metrics derived directly from scikit-learn classification pipelines and test validation data.
              </p>
            </div>

            {/* Item 03 */}
            <div className="space-y-4 bg-white/70 p-6 border-2 border-[#111111] shadow-[4px_4px_0px_#111111]">
              <span className="font-black text-5xl text-[#111111] bg-[#EFFF4F] px-4 py-1 border border-[#111111] inline-block">
                03
              </span>
              <h3 className="font-black text-2xl uppercase tracking-tight text-[#111111]">
                TRACKABLE
              </h3>
              <p className="font-mono text-sm text-[#111111]/70 leading-relaxed">
                Every loan prediction is automatically stored in loan_records.csv and can be searched, filtered, and reviewed later in the application history.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

