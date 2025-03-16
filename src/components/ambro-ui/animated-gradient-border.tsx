"use client";

import { memo, type FC, type ReactNode, useMemo } from "react";
import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";

/**
 * AnimatedGradientBorder Component
 *
 * Creates a container with an animated gradient border effect.
 *
 * @param children - Content to be wrapped by the border
 * @param className - Additional CSS classes
 * @param borderColor - Tailwind gradient color classes
 * @param borderWidth - Width of the border in pixels
 * @param rounded - Border radius Tailwind class
 * @param glowEffect - Whether to show a glow effect
 * @param glowColor - Color of the glow effect
 * @param glowIntensity - Intensity of the glow (0-20)
 * @param animated - Whether to animate the gradient
 * @param animationDuration - Duration of the animation in seconds
 * @param direction - Direction of the gradient animation
 * @param content - Additional content to display on top of the border
 * @param contentPosition - Position of the additional content
 * @param hoverEffect - Whether to show a hover effect
 * @param backgroundColor - Background color Tailwind class
 */
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
}> = memo(
  ({
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
    // Calculate background settings based on animation direction
    // Memoized to prevent recalculation on every render
    const { backgroundSize, animate } = useMemo(() => {
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
    }, [direction, animated]);

    // Memoize the content position calculation
    const contentPositionClass = useMemo(() => {
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
    }, [contentPosition]);

    // Animation transition configuration - memoized
    const transitionConfig = useMemo(
      () => ({
        duration: animationDuration,
        repeat: Number.POSITIVE_INFINITY,
        ease: "linear",
      }),
      [animationDuration]
    );

    return (
      <div
        className={twMerge("relative", rounded, className)}
        // Add role for accessibility when appropriate
        role={content ? "group" : undefined}
      >
        <motion.div
          className={`absolute inset-0 bg-gradient-to-r ${borderColor} ${rounded}`}
          style={{
            backgroundSize,
            willChange: animated ? "background-position" : undefined, // Optimize for animations
          }}
          animate={animate}
          transition={transitionConfig}
          whileHover={hoverEffect ? { scale: 1.02 } : undefined}
          aria-hidden="true" // Hide from screen readers as it's decorative
        >
          {/* Glow effect */}
          {glowEffect && (
            <div
              className={`absolute inset-0 ${rounded}`}
              style={{
                boxShadow: `0 0 ${glowIntensity}px ${glowColor}`,
                opacity: 0.6,
              }}
              aria-hidden="true"
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
          <div
            className={`absolute ${contentPositionClass} z-20`}
            aria-live={typeof content === "string" ? "polite" : undefined}
          >
            {content}
          </div>
        )}
      </div>
    );
  }
);

// Add display name for better debugging
AnimatedGradientBorder.displayName = "AnimatedGradientBorder";
