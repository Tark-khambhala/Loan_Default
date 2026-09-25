import { motion } from "framer-motion";

export default function Logo({ size = "md", animated = false }) {
  const sizeClasses = {
    sm: "text-xl",
    md: "text-3xl",
    lg: "text-6xl md:text-8xl"
  };

  const dotSize = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-6 h-6 md:w-8 md:h-8"
  };

  if (!animated) {
    return (
      <div className={`font-black tracking-tighter flex items-center gap-1 text-black select-none ${sizeClasses[size]}`}>
        <span className={`inline-block rounded-full bg-black ${dotSize[size]}`}></span>
        <span className="font-extrabold font-mono tracking-tight text-black">astra</span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`font-black tracking-tighter flex items-center gap-2 text-black select-none ${sizeClasses[size]}`}
    >
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className={`inline-block rounded-full bg-black ${dotSize[size]}`}
      ></motion.span>
      <motion.span
        initial={{ letterSpacing: "-0.1em", opacity: 0 }}
        animate={{ letterSpacing: "-0.04em", opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="font-extrabold font-mono text-black"
      >
        astra
      </motion.span>
    </motion.div>
  );
}
