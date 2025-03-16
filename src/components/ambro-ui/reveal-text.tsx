"use client";

import { useAnimation, useInView, motion } from "framer-motion";
import React, {
  type FC,
  type ReactNode,
  useEffect,
  useRef,
  useMemo,
  memo,
} from "react";
import { twMerge } from "tailwind-merge";

export interface RevealTextProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  threshold?: number;
  once?: boolean;
  staggerLines?: boolean;
  staggerWords?: boolean;
  staggerDelay?: number;
  highlight?: boolean;
  highlightColor?: string;
  highlightHeight?: string;
  highlightIndex?: number[];
  highlightFade?: boolean;
  underline?: boolean;
  underlineColor?: string;
  underlineHeight?: string;
  underlineWidth?: string;
  underlineDelay?: number;
  reducedMotion?: boolean; // New prop for accessibility
}

// Pre-define animation variants outside component to prevent recreation
const createDirectionConfig = (direction: string) => {
  switch (direction) {
    case "down":
      return { initial: -30, target: 0, axis: "y" };
    case "left":
      return { initial: 30, target: 0, axis: "x" };
    case "right":
      return { initial: -30, target: 0, axis: "x" };
    default: // "up"
      return { initial: 30, target: 0, axis: "y" };
  }
};

// Create container animation variant factory
const createContainerVariants = (delay: number, staggerDelay: number) => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: staggerDelay,
      delayChildren: delay,
    },
  },
});

// Factory function for item variants
const createItemVariants = (axis: string, initial: number, target: number) => {
  if (axis === "x") {
    return {
      hidden: {
        opacity: 0,
        x: initial,
      },
      visible: {
        opacity: 1,
        x: target,
        transition: {
          duration: 0.7,
          ease: [0.215, 0.61, 0.355, 1],
        },
      },
    };
  }
  return {
    hidden: {
      opacity: 0,
      y: initial,
    },
    visible: {
      opacity: 1,
      y: target,
      transition: {
        duration: 0.7,
        ease: [0.215, 0.61, 0.355, 1],
      },
    },
  };
};

export const RevealText: FC<RevealTextProps> = memo(
  ({
    children,
    className = "",
    delay = 0,
    direction = "up",
    threshold = 0.1,
    once = true,
    staggerLines = false,
    staggerWords = false,
    staggerDelay = 0.1,
    highlight = false,
    highlightColor = "bg-blue-500/10",
    highlightHeight = "30%",
    highlightIndex = [],
    highlightFade = true,
    underline = false,
    underlineColor = "bg-blue-500",
    underlineHeight = "2px",
    underlineWidth = "100%",
    underlineDelay = 0.3,
    reducedMotion = false,
  }) => {
    const controls = useAnimation();
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, {
      amount: threshold,
      once,
    });

    // Get configuration based on direction - memoized
    const { initial, target, axis } = useMemo(
      () => createDirectionConfig(direction),
      [direction]
    );

    // Memoize animation variants
    const containerVariants = useMemo(
      () => createContainerVariants(delay, staggerDelay),
      [delay, staggerDelay]
    );

    const itemVariants = useMemo(
      () => createItemVariants(axis, initial, target),
      [axis, initial, target]
    );

    // Start animation when in view
    useEffect(() => {
      let isMounted = true;

      if (inView && isMounted) {
        // Respect reduced motion preference
        if (reducedMotion) {
          controls.set("visible");
        } else {
          controls.start("visible");
        }
      } else if (!once && isMounted) {
        controls.start("hidden");
      }

      return () => {
        isMounted = false;
      };
    }, [controls, inView, once, reducedMotion]);

    // Process children based on staggering options - memoized for performance
    const processedChildren = useMemo(() => {
      if (!staggerLines && !staggerWords) {
        return (
          <motion.div
            variants={itemVariants}
            className="inline-block"
            data-testid="reveal-text-content"
          >
            {children}
          </motion.div>
        );
      }

      if (staggerWords && typeof children === "string") {
        const words = children.split(" ");
        return words.map((word, index) => (
          <React.Fragment
            key={`word-${word}-${
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              index
            }`}
          >
            <motion.span
              variants={itemVariants}
              className="inline-block"
              data-testid={`reveal-text-word-${index}`}
            >
              {word}
            </motion.span>
            {index < words.length - 1 && " "}
          </React.Fragment>
        ));
      }

      if (staggerLines && React.Children.count(children) > 0) {
        return React.Children.map(children, (child, index) => (
          <motion.div
            key={`line-${
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              index
            }`}
            variants={itemVariants}
            className="block"
            data-testid={`reveal-text-line-${index}`}
          >
            {child}
          </motion.div>
        ));
      }

      return children;
    }, [children, itemVariants, staggerLines, staggerWords]);

    // Apply highlight effect to specific words or all content - memoized
    const highlightedContent = useMemo(() => {
      if (!highlight) return processedChildren;

      // For specific words in a string
      if (highlightIndex.length > 0 && typeof children === "string") {
        const words = children.split(" ");

        return words.map((word, index) => {
          if (highlightIndex.includes(index)) {
            return (
              <React.Fragment
                key={`highlighted-${word}-${
                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                  index
                }`}
              >
                <span className="relative inline-block">
                  <motion.span
                    className="relative z-10"
                    variants={itemVariants}
                  >
                    {word}
                  </motion.span>
                  <motion.span
                    className={`absolute bottom-0 left-0 right-0 ${highlightColor} rounded-sm -z-0`}
                    style={{
                      height: highlightHeight,
                      willChange: "width, opacity",
                    }}
                    initial={{ width: 0, opacity: highlightFade ? 0 : 1 }}
                    animate={{
                      width: "100%",
                      opacity: 1,
                      transition: {
                        duration: 0.6,
                        delay:
                          delay +
                          (staggerWords ? index * staggerDelay : 0) +
                          0.2,
                      },
                    }}
                  />
                </span>
                {index < words.length - 1 && " "}
              </React.Fragment>
            );
          }

          return (
            <React.Fragment
              key={`word-${word}-${
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                index
              }`}
            >
              <motion.span variants={itemVariants} className="inline-block">
                {word}
              </motion.span>
              {index < words.length - 1 && " "}
            </React.Fragment>
          );
        });
      }

      // Highlight all content
      return (
        <span className="relative inline-block">
          <motion.span className="relative z-10" variants={itemVariants}>
            {processedChildren}
          </motion.span>
          <motion.span
            className={`absolute bottom-0 left-0 right-0 ${highlightColor} rounded-sm -z-0`}
            style={{
              height: highlightHeight,
              willChange: "width, opacity",
            }}
            initial={{ width: 0, opacity: highlightFade ? 0 : 1 }}
            animate={{
              width: "100%",
              opacity: 1,
              transition: {
                duration: 0.6,
                delay: delay + 0.2,
              },
            }}
          />
        </span>
      );
    }, [
      highlight,
      processedChildren,
      highlightIndex,
      children,
      itemVariants,
      highlightColor,
      highlightHeight,
      highlightFade,
      delay,
      staggerWords,
      staggerDelay,
    ]);

    // Effects that depend on reduced motion preference
    useEffect(() => {
      // Check for the user's preference about motion
      if (typeof window !== "undefined") {
        const prefersReducedMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches;

        if (prefersReducedMotion && inView) {
          // Skip animations for users who prefer reduced motion
          controls.set("visible");
        }
      }
    }, [controls, inView]);

    return (
      <motion.div
        ref={ref}
        className={twMerge("relative", className)}
        initial="hidden"
        animate={controls}
        variants={containerVariants}
        aria-hidden={!inView}
        data-testid="reveal-text"
      >
        {highlightedContent}

        {/* Underline animation */}
        {underline && (
          <motion.div
            className={`absolute bottom-0 left-0 ${underlineColor}`}
            style={{
              height: underlineHeight,
              willChange: "width",
            }}
            initial={{ width: 0 }}
            animate={{
              width: underlineWidth,
              transition: {
                duration: reducedMotion ? 0 : 0.6,
                delay: delay + underlineDelay,
                ease: "easeOut",
              },
            }}
            aria-hidden="true"
          />
        )}
      </motion.div>
    );
  }
);

// Add display name for debugging
RevealText.displayName = "RevealText";

// Add prefers-reduced-motion media query hook
export const usePrefersReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const onChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", onChange);
    return () => {
      mediaQuery.removeEventListener("change", onChange);
    };
  }, []);

  return prefersReducedMotion;
};
