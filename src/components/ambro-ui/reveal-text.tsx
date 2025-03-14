"use client";

import { useAnimation, useInView, motion } from "framer-motion";
import React, { type FC, type ReactNode, useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";

export const RevealText: FC<{
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
}> = ({
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
}) => {
  const controls = useAnimation();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, {
    amount: threshold,
    once,
  });

  // Start animation when in view
  useEffect(() => {
    if (inView) {
      controls.start("visible");
    } else if (!once) {
      controls.start("hidden");
    }
  }, [controls, inView, once]);

  // Define initial and target values based on direction
  const getInitialAndTargetValue = () => {
    switch (direction) {
      case "down":
        return { initial: -30, target: 0 };
      case "left":
        return { initial: 30, target: 0, axis: "x" };
      case "right":
        return { initial: -30, target: 0, axis: "x" };
      default:
        return { initial: 30, target: 0 };
    }
  };

  const { initial, target, axis = "y" } = getInitialAndTargetValue();

  // Animation variants
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  };

  const itemVariants = React.useMemo(() => {
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
  }, [axis, initial, target]);

  // Process children based on staggering options
  const processChildren = () => {
    if (!staggerLines && !staggerWords) {
      return (
        <motion.div variants={itemVariants} className="inline-block">
          {children}
        </motion.div>
      );
    }

    if (staggerWords && typeof children === "string") {
      return children.split(" ").map((word, index) => (
        <React.Fragment
          key={`word-${
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            index
          }`}
        >
          <motion.span variants={itemVariants} className="inline-block">
            {word}
          </motion.span>
          {index < children.split(" ").length - 1 && " "}
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
        >
          {child}
        </motion.div>
      ));
    }

    return children;
  };

  // Apply highlight effect to specific words or all content
  const applyHighlight = () => {
    if (!highlight) return processChildren();

    // For specific words in a string
    if (highlightIndex.length > 0 && typeof children === "string") {
      const words = children.split(" ");

      return words.map((word, index) => {
        if (highlightIndex.includes(index)) {
          return (
            <React.Fragment
              key={`highlighted-${
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                index
              }`}
            >
              <span className="relative inline-block">
                <motion.span className="relative z-10" variants={itemVariants}>
                  {word}
                </motion.span>
                <motion.span
                  className={`absolute bottom-0 left-0 right-0 ${highlightColor} rounded-sm -z-0`}
                  style={{ height: highlightHeight }}
                  initial={{ width: 0, opacity: highlightFade ? 0 : 1 }}
                  animate={{
                    width: "100%",
                    opacity: 1,
                    transition: {
                      duration: 0.6,
                      delay:
                        delay + (staggerWords ? index * staggerDelay : 0) + 0.2,
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
            key={`word-${
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
          {processChildren()}
        </motion.span>
        <motion.span
          className={`absolute bottom-0 left-0 right-0 ${highlightColor} rounded-sm -z-0`}
          style={{ height: highlightHeight }}
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
  };

  return (
    <motion.div
      ref={ref}
      className={twMerge("relative", className)}
      initial="hidden"
      animate={controls}
      variants={containerVariants}
    >
      {applyHighlight()}

      {/* Underline animation */}
      {underline && (
        <motion.div
          className={`absolute bottom-0 left-0 ${underlineColor}`}
          style={{ height: underlineHeight }}
          initial={{ width: 0 }}
          animate={{
            width: underlineWidth,
            transition: {
              duration: 0.6,
              delay: delay + underlineDelay,
              ease: "easeOut",
            },
          }}
        />
      )}
    </motion.div>
  );
};
