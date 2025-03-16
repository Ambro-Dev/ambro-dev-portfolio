"use client";

import { type FC, useMemo, memo } from "react";
import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";

export interface SectionDividerProps {
  className?: string;
  dotColor?: string;
  lineColor?: string;
  dotSize?: number;
  variant?: "dot" | "line" | "gradient" | "animated" | "waves" | "tech";
  thickness?: number;
  width?: string;
  animated?: boolean;
  animationDuration?: number;
  text?: string;
  fontSize?: string;
  fontColor?: string;
  reducedMotion?: boolean;
}

// Pre-define SVG path for waves variant - moved outside component
const WAVE_PATH =
  "M0,32 C12,40 24,24 36,32 C48,40 60,24 72,32 C84,40 96,24 108,32 C120,40 132,24 144,32 C156,40 168,24 180,32 C192,40";

// Pre-defined animation variants
const DOT_ANIMATION_VARIANTS = {
  animate: {
    scale: [1, 1.2, 1],
    opacity: [0.5, 1, 0.5],
  },
  static: {},
};

const TECH_ANIMATION_VARIANTS = {
  animate: (direction: number) => ({
    x: direction > 0 ? [-100, 100] : [100, -100],
    opacity: [0, 1, 0],
  }),
};

export const SectionDivider: FC<SectionDividerProps> = memo(
  ({
    className = "",
    dotColor = "bg-blue-500",
    lineColor = "from-transparent via-gray-700 to-transparent",
    dotSize = 3,
    variant = "dot",
    thickness = 1,
    width = "full",
    animated = true,
    animationDuration = 2,
    text,
    fontSize = "sm",
    fontColor = "text-gray-400",
    reducedMotion = false,
  }) => {
    // Extract color without the bg- prefix for SVG use
    const svgColor = useMemo(
      () => dotColor.replace("bg-", "").trim(),
      [dotColor]
    );

    // Animation config with reduced motion support
    const animationConfig = useMemo(
      () => ({
        duration: reducedMotion ? 0 : animationDuration,
        repeat: animated && !reducedMotion ? Number.POSITIVE_INFINITY : 0,
        ease: "easeInOut" as const,
      }),
      [animated, animationDuration, reducedMotion]
    );

    // Render the appropriate variant
    switch (variant) {
      case "gradient":
        return (
          <div
            className={twMerge("relative py-10", className)}
            data-testid="section-divider-gradient"
          >
            <div
              className={`w-${width} h-${thickness} bg-gradient-to-r ${lineColor} mx-auto`}
              aria-hidden="true"
            />
          </div>
        );

      case "animated":
        return (
          <div
            className={twMerge("relative py-10", className)}
            data-testid="section-divider-animated"
          >
            <div
              className={`w-${width} h-${thickness} bg-gray-800/50 mx-auto overflow-hidden`}
              aria-hidden="true"
            >
              <motion.div
                className={`h-full ${dotColor}`}
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{
                  duration: animationConfig.duration,
                  repeat: animationConfig.repeat,
                  ease: "linear",
                }}
                style={{ willChange: "transform" }}
              />
            </div>
          </div>
        );

      case "waves":
        return (
          <div
            className={twMerge("relative py-10 flex justify-center", className)}
            data-testid="section-divider-waves"
          >
            <svg
              width="200"
              height="40"
              viewBox="0 0 200 64"
              aria-hidden="true"
            >
              <title>Decorative wave divider</title>
              <motion.path
                d={WAVE_PATH}
                stroke={svgColor}
                strokeWidth={thickness}
                fill="none"
                initial={{ pathLength: 0, opacity: 0.5 }}
                animate={
                  reducedMotion ? { opacity: 1 } : { pathLength: 1, opacity: 1 }
                }
                transition={{
                  duration: animationConfig.duration,
                  repeat: animationConfig.repeat,
                  repeatType: "loop",
                  ease: animationConfig.ease,
                }}
                style={{ willChange: "stroke-dashoffset, opacity" }}
              />
            </svg>
          </div>
        );

      case "tech":
        return (
          <div
            className={twMerge("relative py-10", className)}
            data-testid="section-divider-tech"
          >
            <div
              className="flex items-center justify-center gap-2"
              aria-hidden="true"
            >
              {text && (
                <span className={`${fontColor} text-${fontSize} px-4`}>
                  {text}
                </span>
              )}
              <div className="flex-1 relative h-px bg-gray-800">
                <motion.div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${svgColor}, transparent)`,
                    willChange: "transform, opacity",
                  }}
                  animate={TECH_ANIMATION_VARIANTS.animate(1)}
                  transition={{
                    duration: animationConfig.duration,
                    repeat: animationConfig.repeat,
                    ease: animationConfig.ease,
                  }}
                />
              </div>
              <div className="w-3 h-3 border border-gray-700 rotate-45" />
              <div className="flex-1 relative h-px bg-gray-800">
                <motion.div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${svgColor}, transparent)`,
                    willChange: "transform, opacity",
                  }}
                  animate={TECH_ANIMATION_VARIANTS.animate(-1)}
                  transition={{
                    duration: animationConfig.duration,
                    repeat: animationConfig.repeat,
                    ease: animationConfig.ease,
                  }}
                />
              </div>
              {text && (
                <span className={`${fontColor} text-${fontSize} px-4`}>
                  {text}
                </span>
              )}
            </div>
          </div>
        );

      case "line":
        return (
          <div
            className={twMerge("relative py-10", className)}
            data-testid="section-divider-line"
          >
            <div
              className={`w-${width} h-${thickness} bg-gray-800 mx-auto`}
              aria-hidden="true"
            />
          </div>
        );

      default:
        return (
          <div
            className={twMerge("relative h-24", className)}
            data-testid="section-divider-dot"
          >
            <div
              className="absolute inset-0 flex items-center justify-center"
              aria-hidden="true"
            >
              <div className={`w-full h-px bg-gradient-to-r ${lineColor}`} />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-gray-900 px-4 py-2 rounded-full">
                <motion.div
                  className={`w-${dotSize} h-${dotSize} ${dotColor} rounded-full`}
                  animate={
                    animated && !reducedMotion
                      ? DOT_ANIMATION_VARIANTS.animate
                      : DOT_ANIMATION_VARIANTS.static
                  }
                  transition={{
                    duration: animationConfig.duration,
                    repeat: animationConfig.repeat,
                    ease: animationConfig.ease,
                  }}
                  style={{ willChange: "transform, opacity" }}
                />
              </div>
            </div>
          </div>
        );
    }
  }
);

// Add display name for better debugging
SectionDivider.displayName = "SectionDivider";

export default SectionDivider;
