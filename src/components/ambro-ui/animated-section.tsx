import {
  type HTMLMotionProps,
  motion,
  useInView,
  type Variants,
} from "framer-motion";
import React, { type FC, type ReactNode, useRef } from "react";

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
}> = ({
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

  // Predefiniowane warianty animacji
  const animations = {
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
  };

  const selectedVariants =
    animation === "custom" ? customVariants : animations[animation];

  const containerVariants =
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
      : selectedVariants;

  return (
    <Component
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={containerVariants}
      transition={{
        duration,
        delay: staggerChildren > 0 ? 0 : delay,
        ease: easing,
      }}
      className={className}
    >
      {staggerChildren > 0
        ? React.Children.map(children, (child) => (
            <motion.div
              key={
                React.isValidElement(child) && child.key ? child.key : undefined
              }
              variants={selectedVariants}
              transition={{
                duration,
                ease: easing,
              }}
            >
              {child}
            </motion.div>
          ))
        : children}
    </Component>
  );
};
