"use client";

import { type FC, type ReactNode, useId, useMemo, memo } from "react";
import { twMerge } from "tailwind-merge";
import { motion, type Variants } from "framer-motion";

/**
 * ClipMask Component
 *
 * Creates a container with content clipped to a specific shape mask.
 *
 * @param children - Content to be displayed within the mask
 * @param mask - Predefined mask shape
 * @param customPath - Custom SVG path for "custom" mask type
 * @param width - Width of the container
 * @param height - Height of the container
 * @param className - Additional CSS classes
 * @param animate - Enable shape animation
 * @param animationDuration - Duration of animation in seconds
 * @param expandOnHover - Enable expansion on hover
 * @param hoverScale - Scale factor for hover effect (1.0-1.5)
 * @param backgroundColor - Background color
 * @param borderWidth - Border width in pixels
 * @param borderColor - Border color
 * @param gradientColors - Array of gradient colors
 * @param shadowColor - Shadow color
 * @param shadowSize - Shadow size in pixels
 */
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
}> = memo(
  ({
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
    // Use useId for stable IDs across renders
    const id = useId();
    const svgId = `mask-${id}`;
    const gradientId = `gradient-${id}`;

    // Generate SVG path for the mask shape - memoized
    const maskPath = useMemo(() => {
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
    }, [mask, customPath]);

    // Animation variants for path - memoized
    const pathAnimationVariants = useMemo<Variants>(
      () => ({
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
      }),
      [animationDuration]
    );

    // Path fill based on gradient colors - memoized
    const pathFill = useMemo(
      () =>
        gradientColors.length >= 2 ? `url(#${gradientId})` : backgroundColor,
      [gradientColors.length, gradientId, backgroundColor]
    );

    // Hover animation configuration - memoized
    const hoverConfig = useMemo(
      () => ({
        type: "spring" as const,
        stiffness: 300,
        damping: 20,
      }),
      []
    );

    // Filter style for shadow - memoized
    const shadowStyle = useMemo(
      () => ({
        filter: `drop-shadow(0 0 ${shadowSize}px ${shadowColor})`,
      }),
      [shadowSize, shadowColor]
    );

    // Generate gradient stops - memoized
    const gradientStops = useMemo(
      () =>
        gradientColors.map((color, index) => (
          <stop
            key={`stop-${
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              index
            }`}
            offset={`${(index / (gradientColors.length - 1)) * 100}%`}
            stopColor={color}
          />
        )),
      [gradientColors]
    );

    return (
      <motion.div
        className={twMerge("relative overflow-hidden", className)}
        style={{
          width,
          height,
        }}
        whileHover={expandOnHover ? { scale: hoverScale } : undefined}
        transition={expandOnHover ? hoverConfig : undefined}
      >
        {/* SVG for defining clip path - kept hidden */}
        <svg
          width="0"
          height="0"
          style={{ position: "absolute", visibility: "hidden" }}
          aria-hidden="true"
        >
          <defs>
            <clipPath id={svgId} clipPathUnits="objectBoundingBox">
              <path d={maskPath} transform="scale(0.01, 0.01)" />
            </clipPath>
          </defs>
        </svg>

        {/* Background shape with shadow */}
        <div
          className="absolute inset-0"
          style={shadowStyle}
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 100 100"
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
          >
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
                  {gradientStops}
                </linearGradient>
              </defs>
            )}

            {/* Path with or without animation */}
            {animate ? (
              <motion.path
                d={maskPath}
                fill={pathFill}
                stroke={borderWidth > 0 ? borderColor : "none"}
                strokeWidth={borderWidth}
                animate="animate"
                variants={pathAnimationVariants}
                style={{ willChange: "transform" }} // Optimize for animations
              />
            ) : (
              <path
                d={maskPath}
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
  }
);

// Add display name for better debugging
ClipMask.displayName = "ClipMask";
