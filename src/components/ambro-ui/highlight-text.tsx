"use client";

import { useInView, motion } from "framer-motion";
import { type FC, type ReactNode, useRef, useMemo, memo } from "react";
import { twMerge } from "tailwind-merge";

/**
 * HighlightText Component
 *
 * Creates text with a highlight effect that animates into view.
 *
 * @param children - Text content
 * @param color - Background color for the highlight
 * @param delay - Animation delay in seconds
 * @param className - Additional CSS classes
 * @param height - Height of the highlight
 * @param position - Vertical position of the highlight
 * @param inView - Override the component's own inView detection
 * @param threshold - Visibility threshold to trigger animation (0.0 to 1.0)
 * @param animated - Enable animation
 * @param animationDuration - Duration of animation in seconds
 * @param rounded - Border radius Tailwind class
 * @param zIndex - Z-index of the highlight
 */
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
}> = memo(
  ({
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

    // Memoize highlight position class
    const highlightPositionClass = useMemo(() => {
      switch (position) {
        case "top":
          return "top-0";
        case "middle":
          return "top-1/2 -translate-y-1/2";
        default:
          return "bottom-0";
      }
    }, [position]);

    // Memoize combined classes
    const combinedClasses = useMemo(
      () => twMerge("relative inline-block", className),
      [className]
    );

    // Memoize highlight element classes
    const highlightClasses = useMemo(
      () =>
        `absolute ${highlightPositionClass} left-0 right-0 ${color} rounded-${rounded}`,
      [highlightPositionClass, color, rounded]
    );

    // Memoize animation configuration
    const animationConfig = useMemo(
      () => ({
        initial: animated ? { width: 0 } : { width: "100%" },
        transition: {
          duration: animationDuration,
          delay,
          ease: "easeOut",
        },
      }),
      [animated, animationDuration, delay]
    );

    return (
      <motion.span ref={ref} className={combinedClasses}>
        <span className="relative z-10">{children}</span>
        <motion.span
          className={highlightClasses}
          style={{ height, zIndex }}
          initial={animationConfig.initial}
          animate={inView ? { width: "100%" } : {}}
          transition={animationConfig.transition}
          aria-hidden="true" // Hide from screen readers as it's decorative
        />
      </motion.span>
    );
  }
);

// Add display name for better debugging
HighlightText.displayName = "HighlightText";
