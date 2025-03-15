"use client";

import { type FC, type ReactNode, useId } from "react";
import { twMerge } from "tailwind-merge";
import { motion, type Variants } from "framer-motion";

export const ClipMask: FC<{
  children: ReactNode;
  mask?: "circle" | "hexagon" | "diamond" | "triangle" | "star" | "custom";
  customPath?: string;
  width?: string | number;
  height?: string | number;
  className?: string;
  animate?: boolean;
  animationDuration?: number;
  expandOnHover?: boolean;
  hoverScale?: number;
  backgroundColor?: string;
  borderWidth?: number;
  borderColor?: string;
  gradientColors?: string[];
  shadowColor?: string;
  shadowSize?: number;
}> = ({
  children,
  mask = "circle",
  customPath,
  width = "100%",
  height = "100%",
  className = "",
  animate = false,
  animationDuration = 10,
  expandOnHover = false,
  hoverScale = 1.05,
  backgroundColor = "transparent",
  borderWidth = 0,
  borderColor = "white",
  gradientColors = [],
  shadowColor = "rgba(0, 0, 0, 0.3)",
  shadowSize = 10,
}) => {
  // Użyj useId() zamiast Math.random()
  const id = useId();
  const svgId = `mask-${id}`;
  const gradientId = `gradient-${id}`;

  // Generate SVG path for the mask shape
  const getMaskPath = () => {
    switch (mask) {
      case "hexagon":
        return "M50,0 L93.3,25 L93.3,75 L50,100 L6.7,75 L6.7,25 Z";
      case "diamond":
        return "M50,0 L100,50 L50,100 L0,50 Z";
      case "triangle":
        return "M50,0 L100,100 L0,100 Z";
      case "star":
        return "M50,0 L63.5,36.5 L100,36.5 L69.5,60.5 L82.5,100 L50,75 L17.5,100 L30.5,60.5 L0,36.5 L36.5,36.5 Z";
      case "custom":
        return customPath || "M0,0 H100 V100 H0 Z";
      default:
        return "M50,0 A50,50 0 1,1 50,100 A50,50 0 1,1 50,0 Z";
    }
  };

  // Animation variants for path
  const pathAnimationVariants: Variants = {
    animate: {
      scale: [1, 1.02, 0.98, 1],
      rotate: [0, 1, -1, 0],
      transition: {
        duration: animationDuration,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "loop",
        ease: "easeInOut",
      },
    },
  };

  // Determine fill color/gradient for path
  const pathFill =
    gradientColors.length >= 2 ? `url(#${gradientId})` : backgroundColor;

  return (
    <motion.div
      className={twMerge("relative overflow-hidden", className)}
      style={{
        width,
        height,
      }}
      whileHover={expandOnHover ? { scale: hoverScale } : undefined}
      transition={
        expandOnHover
          ? { type: "spring", stiffness: 300, damping: 20 }
          : undefined
      }
    >
      {/* SVG for defining clip path - kept hidden */}
      <svg
        width="0"
        height="0"
        style={{ position: "absolute", visibility: "hidden" }}
      >
        <title>Clip Mask Definition</title>
        <defs>
          <clipPath id={svgId} clipPathUnits="objectBoundingBox">
            <path d={getMaskPath()} transform="scale(0.01, 0.01)" />
          </clipPath>
        </defs>
      </svg>

      {/* Background shape with shadow */}
      <div
        className="absolute inset-0"
        style={{
          filter: `drop-shadow(0 0 ${shadowSize}px ${shadowColor})`,
        }}
      >
        <svg
          viewBox="0 0 100 100"
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid meet"
        >
          <title>Clip Mask Shape</title>
          {/* Gradient definition */}
          {gradientColors.length >= 2 && (
            <defs>
              <linearGradient
                id={gradientId}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                {gradientColors.map((color, index) => (
                  <stop
                    key={`stop-${
                      // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                      index
                    }`}
                    offset={`${(index / (gradientColors.length - 1)) * 100}%`}
                    stopColor={color}
                  />
                ))}
              </linearGradient>
            </defs>
          )}

          {/* Path with or without animation */}
          {animate ? (
            <motion.path
              d={getMaskPath()}
              fill={pathFill}
              stroke={borderWidth > 0 ? borderColor : "none"}
              strokeWidth={borderWidth}
              animate="animate"
              variants={pathAnimationVariants}
            />
          ) : (
            <path
              d={getMaskPath()}
              fill={pathFill}
              stroke={borderWidth > 0 ? borderColor : "none"}
              strokeWidth={borderWidth}
            />
          )}
        </svg>
      </div>

      {/* Content with clipping mask */}
      <div
        className="absolute inset-0"
        style={{
          clipPath: `url(#${svgId})`,
        }}
      >
        {children}
      </div>
    </motion.div>
  );
};
