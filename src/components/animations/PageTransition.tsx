import { motion, AnimatePresence, Transition } from "framer-motion";
import { useLocation } from "react-router-dom";
import { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

const transition: Transition = {
  duration: 0.4,
  ease: "easeOut",
};

const exitTransition: Transition = {
  duration: 0.3,
  ease: "easeOut",
};

export function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={transition}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}