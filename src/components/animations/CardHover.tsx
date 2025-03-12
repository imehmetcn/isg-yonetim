import { motion } from "framer-motion";
import { ReactNode } from "react";

interface CardHoverProps {
  children: ReactNode;
  className?: string;
}

export const CardHover = ({ children, className = "" }: CardHoverProps) => {
  return (
    <motion.div
      whileHover={{
        y: -5,
        scale: 1.02,
        transition: { duration: 0.2 },
      }}
      whileTap={{ scale: 0.98 }}
      className={`bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default CardHover;
