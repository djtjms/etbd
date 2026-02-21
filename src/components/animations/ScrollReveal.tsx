import { motion } from "framer-motion";
import { ReactNode, forwardRef } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  duration?: number;
  once?: boolean;
}

export function ScrollReveal({
  children,
  className = "",
}: ScrollRevealProps) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}

// Stagger children animation wrapper
interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export const StaggerContainer = forwardRef<HTMLDivElement, StaggerContainerProps>(
  ({ children, className = "" }, ref) => {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }
);
StaggerContainer.displayName = "StaggerContainer";

// Individual stagger item
interface StaggerItemProps {
  children: ReactNode;
  className?: string;
}

export const StaggerItem = forwardRef<HTMLDivElement, StaggerItemProps>(
  ({ children, className = "" }, ref) => {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }
);
StaggerItem.displayName = "StaggerItem";
