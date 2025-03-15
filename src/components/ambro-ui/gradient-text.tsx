"use client";

import type { FC, ReactNode, HTMLElementType } from "react";
import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";

export const GradientText: FC<{
  children: ReactNode;
  className?: string;
  from?: string;
  via?: string;
  to?: string;
  animated?: boolean;
  duration?: number;
  angle?: number;
  fontSize?: string;
  fontWeight?: string;
  letterSpacing?: string;
  glowEffect?: boolean;
  glowColor?: string;
  glowIntensity?: number;
  backgroundSize?: string;
  as?: HTMLElementType;
}> = ({
  children,
  className = "",
  from = "blue-600",
  via = "purple-600",
  to = "pink-600",
  animated = true,
  duration = 15,
  angle = 45,
  fontSize,
  fontWeight = "inherit",
  letterSpacing,
  glowEffect = false,
  glowColor,
  glowIntensity = 15,
  backgroundSize = "200% 100%",
  as: Component = "span",
  ...props
}) => {
  const gradientClasses = `bg-gradient-to-r from-${from} via-${via} to-${to} bg-clip-text text-transparent inline-block`;

  // Generate inline style for the gradient
  const gradientStyle = {
    backgroundSize: backgroundSize,
    fontWeight,
    letterSpacing,
    fontSize,
    backgroundImage:
      angle !== 45
        ? `linear-gradient(${angle}deg, var(--tw-gradient-from), var(--tw-gradient-via), var(--tw-gradient-to))`
        : undefined,
    textShadow: glowEffect
      ? `0 0 ${glowIntensity}px ${glowColor || "var(--tw-gradient-from)"}`
      : undefined,
  };

  if (animated) {
    return (
      <motion.span
        className={twMerge(gradientClasses, className)}
        style={gradientStyle}
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      >
        {children}
      </motion.span>
    );
  }

  return (
    <Component
      className={twMerge(gradientClasses, className)}
      style={gradientStyle}
      {...props}
    >
      {children}
    </Component>
  );
};
