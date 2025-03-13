import { useInView, motion } from "framer-motion";
import { type FC, type ReactNode, useRef } from "react";
import { twMerge } from "tailwind-merge";

export const HighlightText: FC<{
  children: ReactNode;
  color?: string;
  delay?: number;
  className?: string;
  height?: string;
  position?: "bottom" | "top" | "middle";
  inView?: boolean;
  threshold?: number;
  animated?: boolean;
  animationDuration?: number;
  rounded?: string;
  zIndex?: number;
}> = ({
  children,
  color = "bg-blue-500/10",
  delay = 0,
  className = "",
  height = "30%",
  position = "bottom",
  inView: propInView,
  threshold = 0.1,
  animated = true,
  animationDuration = 0.6,
  rounded = "sm",
  zIndex = -1,
}) => {
  const ref = useRef<HTMLElement>(null);
  const inViewHook = useInView(ref, {
    amount: threshold,
    once: false,
  });

  // Use prop inView if provided, otherwise use hook
  const inView = propInView !== undefined ? propInView : inViewHook;

  // Calculate position
  const getHighlightPosition = () => {
    switch (position) {
      case "top":
        return "top-0";
      case "middle":
        return "top-1/2 -translate-y-1/2";
      default:
        return "bottom-0";
    }
  };

  return (
    <motion.span
      ref={ref}
      className={twMerge("relative inline-block", className)}
    >
      <span className="relative z-10">{children}</span>
      <motion.span
        className={`absolute ${getHighlightPosition()} left-0 right-0 ${color} rounded-${rounded}`}
        style={{ height, zIndex }}
        initial={animated ? { width: 0 } : { width: "100%" }}
        animate={inView ? { width: "100%" } : {}}
        transition={{ duration: animationDuration, delay, ease: "easeOut" }}
      />
    </motion.span>
  );
};
