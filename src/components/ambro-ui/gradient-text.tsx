/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { type FC, type ReactNode, useMemo, memo } from "react";
import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
import type { JSX } from "react/jsx-runtime";

// Fix HTMLElementType by using specific element types
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type ElementType = keyof JSX.IntrinsicElements | React.ComponentType<any>;

/**
 * GradientText Component
 *
 * Creates text with gradient color effects and optional animations.
 *
 * @param children - Text content
 * @param className - Additional CSS classes
 * @param from - Starting gradient color (Tailwind color class name)
 * @param via - Middle gradient color (Tailwind color class name)
 * @param to - Ending gradient color (Tailwind color class name)
 * @param animated - Enable gradient animation
 * @param duration - Animation duration in seconds
 * @param angle - Gradient angle in degrees
 * @param fontSize - Font size (CSS value)
 * @param fontWeight - Font weight (CSS value)
 * @param letterSpacing - Letter spacing (CSS value)
 * @param glowEffect - Enable text glow effect
 * @param glowColor - Color of the glow effect
 * @param glowIntensity - Intensity of the glow (0-30)
 * @param backgroundSize - Background size for the gradient
 * @param as - HTML element to render as
 */
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
  as?: ElementType;
}> = memo(
  ({
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
    as = "span",
    ...props
  }) => {
    // Memoize gradient classes to prevent recalculation
    const gradientClasses = useMemo(
      () =>
        `bg-gradient-to-r from-${from} via-${via} to-${to} bg-clip-text text-transparent inline-block`,
      [from, via, to]
    );

    // Memoize gradient style to prevent recalculation
    const gradientStyle = useMemo(
      () => ({
        backgroundSize,
        fontWeight,
        letterSpacing,
        fontSize,
        // Only calculate custom gradient angle if not the default 45 degrees
        backgroundImage:
          angle !== 45
            ? `linear-gradient(${angle}deg, var(--tw-gradient-from), var(--tw-gradient-via), var(--tw-gradient-to))`
            : undefined,
        textShadow: glowEffect
          ? `0 0 ${glowIntensity}px ${glowColor || "var(--tw-gradient-from)"}`
          : undefined,
        // Add will-change for better performance with animations
        willChange: animated ? "background-position" : undefined,
      }),
      [
        backgroundSize,
        fontWeight,
        letterSpacing,
        fontSize,
        angle,
        glowEffect,
        glowIntensity,
        glowColor,
        animated,
      ]
    );

    // Memoize animation configuration
    const animationConfig = useMemo(
      () => ({
        animate: {
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        },
        transition: {
          duration,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        },
      }),
      [duration]
    );

    // Memoize combined class names
    const combinedClasses = useMemo(
      () => twMerge(gradientClasses, className),
      [gradientClasses, className]
    );

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const Component = as as any;

    // Render with or without animation
    if (animated) {
      return (
        <motion.span
          className={combinedClasses}
          style={gradientStyle}
          animate={animationConfig.animate}
          transition={animationConfig.transition}
          // Improve accessibility by adding appropriate role
          role={typeof children === "string" ? "text" : undefined}
        >
          {children}
        </motion.span>
      );
    }

    return (
      <Component
        className={combinedClasses}
        style={gradientStyle}
        // Improve accessibility by adding appropriate role for non-span elements
        role={
          Component !== "span" && typeof children === "string"
            ? "text"
            : undefined
        }
        {...props}
      >
        {children}
      </Component>
    );
  }
);

// Add display name for better debugging
GradientText.displayName = "GradientText";
