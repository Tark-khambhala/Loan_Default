import { motion } from "framer-motion";

export default function AstroLogo({ size = "md", color = "black", animated = false }) {
  // Dimension mapping
  const dimensions = {
    sm: { width: 100, height: 32 },
    md: { width: 140, height: 46 },
    lg: { width: 260, height: 84 }
  };

  const dim = dimensions[size] || dimensions.md;
  const fillColor = color === "white" ? "#FFFFFF" : "#111111";

  // SVG representation matching the logo in the uploaded reference image:
  // Solid dot prefix + liquid curved lower-case wordmark ".astro"
  const LogoSVG = () => (
    <svg
      width={dim.width}
      height={dim.height}
      viewBox="0 0 280 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="inline-block select-none"
    >
      {/* Dot Prefix */}
      <circle cx="24" cy="66" r="12" fill={fillColor} />

      {/* Letter 'a' with liquid fluid sweep */}
      <path
        d="M 52 42 C 52 28, 66 24, 78 24 C 92 24, 102 32, 102 46 L 102 78 L 90 78 L 90 70 C 84 76, 76 80, 66 80 C 52 80, 42 70, 42 56 C 42 44, 52 36, 68 36 L 90 36 L 90 44 C 90 34, 82 32, 76 32 C 68 32, 62 36, 62 42 L 52 42 Z M 90 46 L 70 46 C 58 46, 54 50, 54 57 C 54 64, 60 70, 68 70 C 78 70, 90 62, 90 52 L 90 46 Z"
        fill={fillColor}
      />

      {/* Letter 's' with fluid S-curve */}
      <path
        d="M 106 64 C 106 74, 116 80, 128 80 C 140 80, 150 74, 150 64 C 150 54, 138 50, 124 46 C 114 43, 108 38, 108 32 C 108 26, 116 22, 126 22 C 136 22, 144 26, 146 34 L 158 34 C 156 20, 144 12, 126 12 C 110 12, 96 20, 96 32 C 96 44, 108 48, 120 52 C 132 56, 138 60, 138 66 C 138 72, 128 76, 118 76 C 108 76, 98 70, 96 64 L 106 64 Z"
        fill={fillColor}
      />

      {/* Letter 't' with solid crossbar */}
      <path
        d="M 166 16 L 154 16 L 154 26 L 144 26 L 144 36 L 154 36 L 154 64 C 154 74, 160 80, 172 80 C 178 80, 184 78, 188 74 L 188 64 C 184 66, 180 68, 174 68 C 168 68, 166 64, 166 58 L 166 36 L 184 36 L 184 26 L 166 26 L 166 16 Z"
        fill={fillColor}
      />

      {/* Letter 'r' with arched shoulder */}
      <path
        d="M 194 26 L 194 78 L 206 78 L 206 48 C 210 38, 218 34, 226 34 L 226 22 C 216 22, 208 28, 204 36 L 204 26 L 194 26 Z"
        fill={fillColor}
      />

      {/* Letter 'o' with geometric circle */}
      <path
        d="M 252 22 C 234 22, 222 34, 222 51 C 222 68, 234 80, 252 80 C 270 80, 282 68, 282 51 C 282 34, 270 22, 252 22 Z M 252 68 C 242 68, 234 60, 234 51 C 234 42, 242 34, 252 34 C 262 34, 270 42, 270 51 C 270 60, 262 68, 252 68 Z"
        fill={fillColor}
      />
    </svg>
  );

  if (!animated) {
    return <LogoSVG />;
  }

  return (
    <motion.div
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <LogoSVG />
    </motion.div>
  );
}
