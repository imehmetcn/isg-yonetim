import { motion } from "framer-motion";
import { ReactNode } from "react";

interface SectionTransitionProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  variant?: "default" | "fade" | "slide" | "scale";
  direction?: "up" | "down" | "left" | "right";
  duration?: number;
  once?: boolean;
}

const variants = {
  default: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  },
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  slide: {
    hidden: (direction: string) => ({
      x: direction === "left" ? -50 : direction === "right" ? 50 : 0,
      y: direction === "up" ? 50 : direction === "down" ? -50 : 0,
      opacity: 0,
    }),
    visible: {
      x: 0,
      y: 0,
      opacity: 1,
    },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  },
};

export const SectionTransition = ({
  children,
  delay = 0,
  className = "",
  variant = "default",
  direction = "up",
  duration = 0.5,
  once = true,
}: SectionTransitionProps) => {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once }}
      variants={variants[variant]}
      custom={direction}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1.0], // Cubic bezier easing
      }}
      className={`relative ${className}`}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50"
        animate={{
          scale: [1, 1.02, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="relative z-10"
        whileHover={{
          scale: variant === "scale" ? 1.02 : 1,
          transition: { duration: 0.2 },
        }}
      >
        {children}
      </motion.div>
    </motion.section>
  );
};

export default SectionTransition;
