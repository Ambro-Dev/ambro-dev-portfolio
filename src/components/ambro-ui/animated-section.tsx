"use client";

import {
  type HTMLMotionProps,
  motion,
  useInView,
  type Variants,
} from "framer-motion";
import React, { type FC, type ReactNode, useRef, useMemo, memo } from "react";

/**
 * AnimatedSection Component
 *
 * Creates a section with animation effects that trigger when the element enters the viewport.
 *
 * @param children - Content to be wrapped and animated
 * @param className - Additional CSS classes
 * @param delay - Animation delay in seconds
 * @param threshold - Visibility threshold to trigger animation (0.0 to 1.0)
 * @param as - Component type to render (defaults to motion.div)
 * @param animation - Animation type preset
 * @param duration - Animation duration in seconds
 * @param distance - Movement distance for slide animations in pixels
 * @param easing - Animation easing curve
 * @param once - Whether to trigger animation only once
 * @param staggerChildren - Delay between child animations in seconds
 * @param customVariants - Custom animation variants
 */
export const AnimatedSection: FC<{
  children: ReactNode;
  className?: string;
  delay?: number;
  threshold?: number;
  as?: React.ComponentType<HTMLMotionProps<"div">>;
  animation?:
    | "fadeIn"
    | "slideUp"
    | "slideLeft"
    | "slideRight"
    | "zoomIn"
    | "custom";
  duration?: number;
  distance?: number;
  easing?: [number, number, number, number];
  once?: boolean;
  staggerChildren?: number;
  customVariants?: Variants;
}> = memo(
  ({
    children,
    className = "",
    delay = 0,
    threshold = 0.1,
    as: Component = motion.div,
    animation = "slideUp",
    duration = 0.8,
    distance = 50,
    easing = [0.215, 0.61, 0.355, 1],
    once = true,
    staggerChildren = 0,
    customVariants,
  }) => {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, {
      amount: threshold,
      once,
    });

    // Predefined animation variants - memoized to prevent recreation on every render
    const animations = useMemo<Record<string, Variants>>(
      () => ({
        fadeIn: {
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        },
        slideUp: {
          hidden: { opacity: 0, y: distance },
          visible: { opacity: 1, y: 0 },
        },
        slideLeft: {
          hidden: { opacity: 0, x: distance },
          visible: { opacity: 1, x: 0 },
        },
        slideRight: {
          hidden: { opacity: 0, x: -distance },
          visible: { opacity: 1, x: 0 },
        },
        zoomIn: {
          hidden: { opacity: 0, scale: 0.9 },
          visible: { opacity: 1, scale: 1 },
        },
      }),
      [distance]
    );

    // Selected animation variant - memoized
    const selectedVariants = useMemo(
      () => (animation === "custom" ? customVariants : animations[animation]),
      [animation, animations, customVariants]
    );

    // Container variants with stagger effect - memoized
    const containerVariants = useMemo(
      () =>
        staggerChildren > 0
          ? {
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren,
                  delayChildren: delay,
                },
              },
            }
          : selectedVariants,
      [staggerChildren, delay, selectedVariants]
    );

    // Animation transition config - memoized
    const transitionConfig = useMemo(
      () => ({
        duration,
        delay: staggerChildren > 0 ? 0 : delay,
        ease: easing,
      }),
      [duration, delay, staggerChildren, easing]
    );

    // Staggered children - only process when staggerChildren is active
    const processedChildren = useMemo(() => {
      if (!staggerChildren) return children;

      return React.Children.map(children, (child) => (
        <motion.div
          key={React.isValidElement(child) && child.key ? child.key : undefined}
          variants={selectedVariants}
          transition={{
            duration,
            ease: easing,
          }}
        >
          {child}
        </motion.div>
      ));
    }, [children, staggerChildren, selectedVariants, duration, easing]);

    return (
      <Component
        ref={ref}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={containerVariants}
        transition={transitionConfig}
        className={className}
        // Add data attribute for easier debugging
        data-in-view={inView}
      >
        {processedChildren}
      </Component>
    );
  }
);

// Add display name for better debugging
AnimatedSection.displayName = "AnimatedSection";
