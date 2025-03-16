"use client";

import {
  useMotionValue,
  useScroll,
  useSpring,
  motion,
  useTransform,
} from "framer-motion";
import { type FC, useEffect, useMemo, memo } from "react";
import { twMerge } from "tailwind-merge";

/**
 * ScrollProgress Component
 *
 * Displays a visual indicator of scroll progress on the page.
 *
 * @param color - Background color/gradient for the progress indicator
 * @param height - Height of the progress bar (for line variant)
 * @param zIndex - Z-index of the component
 * @param position - Position on the screen
 * @param variant - Visual style of the progress indicator
 * @param showValue - Whether to display the percentage value
 * @param valueFormatter - Function to format the progress value
 * @param width - Width of the component (for specific variants)
 * @param containerClassName - Additional CSS classes for the container
 * @param progressClassName - Additional CSS classes for the progress element
 * @param borderRadius - Border radius for the line variant
 */
export const ScrollProgress: FC<{
  color?: string;
  height?: number;
  zIndex?: number;
  position?: "top" | "bottom" | "left" | "right";
  variant?: "line" | "circle" | "dots";
  showValue?: boolean;
  valueFormatter?: (progress: number) => string;
  width?: string | number;
  containerClassName?: string;
  progressClassName?: string;
  borderRadius?: string;
}> = memo(
  ({
    color = "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500",
    height = 2,
    zIndex = 50,
    position = "top",
    variant = "line",
    showValue = false,
    valueFormatter = (progress: number) => `${Math.round(progress * 100)}%`,
    containerClassName = "",
    progressClassName = "",
    borderRadius = "0",
  }) => {
    // Set up scroll tracking
    const { scrollYProgress } = useScroll();

    // Create smooth spring animation for the progress
    const scaleX = useSpring(scrollYProgress, {
      stiffness: 100,
      damping: 30,
      restDelta: 0.001,
    });

    // Motion value for formatted progress
    const progress = useMotionValue(0);

    // Pre-compute transforms outside of render cycle
    const circleProgress = useTransform(scaleX, [0, 1], [188.5, 0]);
    const formattedProgress = useTransform(progress, (p) => valueFormatter(p));

    const dotOpacity1 = useTransform(
      scrollYProgress,
      [0, 0.1, 0.2],
      [0.2, 1, 0.2]
    );
    const dotOpacity2 = useTransform(
      scrollYProgress,
      [0.2, 0.3, 0.4],
      [0.2, 1, 0.2]
    );
    const dotOpacity3 = useTransform(
      scrollYProgress,
      [0.4, 0.5, 0.6],
      [0.2, 1, 0.2]
    );
    const dotOpacity4 = useTransform(
      scrollYProgress,
      [0.6, 0.7, 0.8],
      [0.2, 1, 0.2]
    );
    const dotOpacity5 = useTransform(
      scrollYProgress,
      [0.8, 0.9, 1.0],
      [0.2, 1, 0.2]
    );

    const dotOpacities = useMemo(
      () => [dotOpacity1, dotOpacity2, dotOpacity3, dotOpacity4, dotOpacity5],
      [dotOpacity1, dotOpacity2, dotOpacity3, dotOpacity4, dotOpacity5]
    );

    // Update progress value for formatter - with proper cleanup
    useEffect(() => {
      const unsubscribe = scrollYProgress.onChange((v) => {
        progress.set(v);
      });
      return unsubscribe;
    }, [scrollYProgress, progress]);

    // Get color without the 'bg-' prefix for SVG stroke
    const strokeColor = useMemo(
      () => (color.startsWith("bg-") ? color.replace("bg-", "") : color),
      [color]
    );

    // Calculate position styles based on position prop - memoized
    const positionStyles = useMemo(() => {
      switch (position) {
        case "bottom":
          return {
            top: "auto",
            bottom: 0,
            left: 0,
            right: 0,
            height,
            width: "100%",
          };
        case "left":
          return {
            top: 0,
            bottom: 0,
            left: 0,
            width: typeof height === "number" ? `${height}px` : height,
            height: "100%",
            transformOrigin: "top",
          };
        case "right":
          return {
            top: 0,
            bottom: 0,
            right: 0,
            width: typeof height === "number" ? `${height}px` : height,
            height: "100%",
            transformOrigin: "top",
          };
        default:
          return {
            top: 0,
            left: 0,
            right: 0,
            height,
            width: "100%",
          };
      }
    }, [position, height]);

    // Scale property based on position - memoized
    const scaleStyles = useMemo(() => {
      const isVertical = position === "left" || position === "right";
      return {
        transformOrigin: isVertical ? "top" : "left",
        scaleX: isVertical ? 1 : scaleX,
        scaleY: isVertical ? scaleX : 1,
      };
    }, [position, scaleX]);

    // Render the appropriate variant - using separate memoized components
    const CircleVariant = useMemo(
      () => (
        <motion.div
          className={twMerge(
            "fixed flex items-center justify-center",
            containerClassName
          )}
          style={{
            bottom: "20px",
            right: "20px",
            zIndex,
            width: "64px",
            height: "64px",
          }}
          aria-label="Scroll progress indicator"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress.get() * 100)}
        >
          <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden="true">
            <title>Scroll Progress</title>
            <motion.circle
              cx="32"
              cy="32"
              r="30"
              fill="none"
              strokeWidth="4"
              stroke="rgba(255,255,255,0.1)"
              className={progressClassName}
            />
            <motion.circle
              cx="32"
              cy="32"
              r="30"
              fill="none"
              strokeWidth="4"
              stroke={strokeColor}
              strokeDasharray="188.5"
              strokeDashoffset="188.5"
              style={{
                strokeDashoffset: circleProgress,
                willChange: "stroke-dashoffset", // Optimize for animations
              }}
              className={progressClassName}
            />
            {showValue && (
              <motion.text
                x="32"
                y="36"
                textAnchor="middle"
                fontSize="14"
                fill="white"
                style={{
                  fontWeight: 500,
                }}
              >
                {formattedProgress}
              </motion.text>
            )}
          </svg>
        </motion.div>
      ),
      [
        containerClassName,
        zIndex,
        progress,
        progressClassName,
        strokeColor,
        circleProgress,
        showValue,
        formattedProgress,
      ]
    );

    const DotsVariant = useMemo(
      () => (
        <motion.div
          className={twMerge("fixed flex gap-1", containerClassName)}
          style={{
            top: position === "top" ? "20px" : "auto",
            bottom: position === "bottom" ? "20px" : "auto",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex,
          }}
          aria-label="Scroll progress indicator"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress.get() * 100)}
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={`scroll-dot-${
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                i
              }`}
              className={progressClassName}
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "rgba(255,255,255,0.2)",
                opacity: dotOpacities[i],
                background: color,
              }}
              aria-hidden="true"
            />
          ))}
        </motion.div>
      ),
      [
        containerClassName,
        position,
        zIndex,
        progress,
        progressClassName,
        dotOpacities,
        color,
      ]
    );

    const LineVariant = useMemo(
      () => (
        <motion.div
          className={twMerge("fixed", containerClassName)}
          style={{
            zIndex,
            borderRadius,
            ...positionStyles,
          }}
          aria-label="Scroll progress indicator"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress.get() * 100)}
        >
          <motion.div
            className={twMerge(color, progressClassName)}
            style={{
              height: "100%",
              width: "100%",
              ...scaleStyles,
              borderRadius,
              willChange: "transform", // Optimize for animations
            }}
          />

          {showValue && (
            <motion.div
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/70 text-white text-xs px-2 py-1 rounded"
              aria-hidden="true"
            >
              {formattedProgress}
            </motion.div>
          )}
        </motion.div>
      ),
      [
        containerClassName,
        zIndex,
        borderRadius,
        positionStyles,
        progress,
        color,
        progressClassName,
        scaleStyles,
        showValue,
        formattedProgress,
      ]
    );

    // Return the appropriate variant
    switch (variant) {
      case "circle":
        return CircleVariant;
      case "dots":
        return DotsVariant;
      default:
        return LineVariant;
    }
  }
);

// Add display name for better debugging
ScrollProgress.displayName = "ScrollProgress";
