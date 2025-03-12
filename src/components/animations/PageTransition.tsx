import { motion } from "framer-motion";
import { ReactNode } from "react";
import Breadcrumbs from "@/components/ui/breadcrumbs";

interface PageTransitionProps {
  children: ReactNode;
}

export const PageTransition = ({ children }: PageTransitionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="min-h-screen pt-28"
    >
      <div className="container mx-auto px-4">
        <Breadcrumbs />
        {children}
      </div>
    </motion.div>
  );
};

export default PageTransition;
