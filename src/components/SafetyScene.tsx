"use client";

import { motion } from "framer-motion";

export default function SafetyScene() {
  return (
    <div className="h-[500px] w-full flex items-center justify-center">
      <motion.svg
        width="200"
        height="200"
        viewBox="0 0 200 200"
        aria-label="Güvenlik Kaskı"
        role="img"
        animate={{
          rotate: 360,
          scale: [1, 1.03, 1],
        }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Safety Helmet Shape */}
        <path
          d="M100 30 C60 30 30 60 30 100 C30 140 60 170 100 170 C140 170 170 140 170 100 C170 60 140 30 100 30"
          fill="#FFD700"
          stroke="#000"
          strokeWidth="2"
        />
        {/* Helmet Visor */}
        <path
          d="M60 110 L140 110 L130 130 L70 130 Z"
          fill="#FFD700"
          stroke="#000"
          strokeWidth="2"
        />
      </motion.svg>
    </div>
  );
}
