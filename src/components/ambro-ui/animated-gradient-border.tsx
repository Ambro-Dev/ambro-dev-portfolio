"use client";

import type { FC, ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";

export const AnimatedGradientBorder: FC<{
  children: ReactNode;
  className?: string;
  borderColor?: string;
  borderWidth?: number;
  rounded?: string;
  glowEffect?: boolean;
  glowColor?: string;
  glowIntensity?: number;
  animated?: boolean;
  animationDuration?: number;
  direction?: "horizontal" | "vertical" | "diagonal" | "radial";
  content?: ReactNode;
  contentPosition?:
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right"
    | "center";
  hoverEffect?: boolean;
  backgroundColor?: string;
}> = ({
  children,
  className = "",
  borderColor = "from-blue-500 via-purple-500 to-pink-500",
  borderWidth = 2,
  rounded = "rounded-lg",
  glowEffect = true,
  glowColor = "rgba(99, 102, 241, 0.4)",
  glowIntensity = 10,
  animated = true,
  animationDuration = 8,
  direction = "horizontal",
  content,
  contentPosition = "top-left",
  hoverEffect = false,
  backgroundColor = "bg-gray-900",
}) => {
  // Calculate background size/position based on direction
  const getGradientAnimation = () => {
    switch (direction) {
      case "vertical":
        return {
          backgroundSize: "100% 300%",
          animate: animated
            ? {
                backgroundPosition: ["0% 0%", "0% 100%", "0% 0%"],
              }
            : {},
        };
      case "diagonal":
        return {
          backgroundSize: "300% 300%",
          animate: animated
            ? {
                backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
              }
            : {},
        };
      case "radial":
        return {
          backgroundImage:
            "radial-gradient(circle, var(--tw-gradient-from), var(--tw-gradient-via), var(--tw-gradient-to))",
          backgroundSize: "150% 150%",
          animate: animated
            ? {
                backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
              }
            : {},
        };
      default:
        return {
          backgroundSize: "300% 100%",
          animate: animated
            ? {
                backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"],
              }
            : {},
        };
    }
  };

  const { backgroundSize, animate } = getGradientAnimation();

  // Position for additional content
  const getContentPosition = () => {
    switch (contentPosition) {
      case "top-right":
        return "top-2 right-2";
      case "bottom-left":
        return "bottom-2 left-2";
      case "bottom-right":
        return "bottom-2 right-2";
      case "center":
        return "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2";
      default:
        return "top-2 left-2";
    }
  };

  return (
    <div className={twMerge("relative", rounded, className)}>
      <motion.div
        className={`absolute inset-0 bg-gradient-to-r ${borderColor} ${rounded}`}
        style={{
          backgroundSize,
        }}
        animate={animate}
        transition={{
          duration: animationDuration,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
        whileHover={hoverEffect ? { scale: 1.02 } : {}}
      >
        {/* Glow effect */}
        {glowEffect && (
          <div
            className={`absolute inset-0 ${rounded}`}
            style={{
              boxShadow: `0 0 ${glowIntensity}px ${glowColor}`,
              opacity: 0.6,
            }}
          />
        )}
      </motion.div>

      {/* Border padding */}
      <div
        className={`relative ${backgroundColor} ${rounded} h-full w-full overflow-hidden z-10`}
        style={{
          margin: borderWidth,
        }}
      >
        {children}
      </div>

      {/* Additional content */}
      {content && (
        <div className={`absolute ${getContentPosition()} z-20`}>{content}</div>
      )}
    </div>
  );
};
