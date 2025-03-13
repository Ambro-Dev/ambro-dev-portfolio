"use client";

import type { FC, ReactNode } from "react";
import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
import { HighlightText } from "@/components/ambro-ui/highlight-text";
import React from "react";

export const SectionHeading: FC<{
  title: string;
  subtitle?: string;
  alignment?: "left" | "center" | "right";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  divider?: boolean;
  dividerWidth?: string;
  dividerColor?: string;
  underline?: boolean;
  underlineColor?: string;
  underlineWidth?: string;
  titleTag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  subtitleTag?: "p" | "h3" | "h4" | "div";
  uppercase?: boolean;
  gradient?: boolean;
  gradientFrom?: string;
  gradientTo?: string;
  delay?: number;
  animation?: "fade" | "slide" | "none";
  highlightWords?: number[];
  highlightColor?: string;
  icon?: ReactNode;
  iconPosition?: "left" | "right" | "top";
}> = ({
  title,
  subtitle,
  alignment = "left",
  size = "lg",
  className = "",
  titleClassName = "",
  subtitleClassName = "",
  divider = true,
  dividerWidth = "40px",
  dividerColor = "bg-indigo-500",
  underline = false,
  underlineColor = "bg-indigo-500",
  underlineWidth = "2px",
  titleTag: TitleTag = "h2",
  subtitleTag: SubtitleTag = "p",
  uppercase = false,
  gradient = false,
  gradientFrom = "from-blue-500",
  gradientTo = "to-indigo-600",
  delay = 0,
  animation = "fade",
  highlightWords = [],
  highlightColor = "bg-indigo-500/10",
  icon,
  iconPosition = "left",
}) => {
  // Size classes
  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return {
          title: "text-xl md:text-2xl",
          subtitle: "text-sm md:text-base",
          spacing: "space-y-1",
          iconSize: "w-5 h-5",
        };
      case "md":
        return {
          title: "text-2xl md:text-3xl",
          subtitle: "text-base md:text-lg",
          spacing: "space-y-2",
          iconSize: "w-6 h-6",
        };
      case "xl":
        return {
          title: "text-4xl md:text-5xl",
          subtitle: "text-lg md:text-xl",
          spacing: "space-y-4",
          iconSize: "w-8 h-8",
        };
      default:
        return {
          title: "text-3xl md:text-4xl",
          subtitle: "text-base md:text-lg",
          spacing: "space-y-3",
          iconSize: "w-7 h-7",
        };
    }
  };

  // Alignment classes
  const getAlignmentClasses = () => {
    switch (alignment) {
      case "right":
        return "text-right items-end";
      case "center":
        return "text-center items-center";
      default:
        return "text-left items-start";
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: delay,
      },
    },
  };

  const getChildVariants = () => {
    switch (animation) {
      case "slide":
        return {
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 },
          },
        };
      case "fade":
        return {
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { duration: 0.5 },
          },
        };
      default:
        return {
          hidden: { opacity: 1 },
          visible: { opacity: 1 },
        };
    }
  };

  const {
    title: titleSize,
    subtitle: subtitleSize,
    spacing,
    iconSize,
  } = getSizeClasses();
  const alignClasses = getAlignmentClasses();
  const childVariants = getChildVariants();

  // Highlight specific words in title
  const renderHighlightedTitle = () => {
    if (highlightWords.length === 0) {
      return title;
    }

    const words = title.split(" ");

    return (
      <>
        {words.map((word, index) => {
          // Add space before words (except the first one)
          const spaceBefore = index > 0 ? " " : "";

          if (highlightWords.includes(index)) {
            return (
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              <React.Fragment key={index}>
                {spaceBefore}
                <HighlightText color={highlightColor} className="font-medium">
                  {word}
                </HighlightText>
              </React.Fragment>
            );
          }

          return (
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            <React.Fragment key={index}>
              {spaceBefore}
              {word}
            </React.Fragment>
          );
        })}
      </>
    );
  };

  return (
    <motion.div
      className={twMerge(`flex flex-col ${spacing} ${alignClasses}`, className)}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Title with optional icon */}
      <motion.div
        className={`flex ${iconPosition === "top" ? "flex-col" : "flex-row"} ${
          iconPosition === "right" ? "flex-row-reverse" : "flex-row"
        } items-${alignment === "center" ? "center" : alignment} gap-3`}
        variants={childVariants}
      >
        {icon && <div className={iconSize}>{icon}</div>}

        <TitleTag
          className={twMerge(
            titleSize,
            uppercase && "uppercase tracking-wider",
            gradient &&
              `bg-gradient-to-r ${gradientFrom} ${gradientTo} bg-clip-text text-transparent`,
            "font-bold",
            titleClassName
          )}
        >
          {renderHighlightedTitle()}
        </TitleTag>
      </motion.div>

      {/* Divider */}
      {divider && (
        <motion.div
          className={`${dividerColor} h-1 rounded-full mx-${
            alignment === "center" ? "auto" : "0"
          } ${alignment === "right" ? "ml-auto" : ""}`}
          style={{ width: dividerWidth }}
          variants={childVariants}
        />
      )}

      {/* Subtitle */}
      {subtitle && (
        <motion.div className="relative" variants={childVariants}>
          <SubtitleTag
            className={twMerge(
              subtitleSize,
              "text-gray-400 font-light",
              subtitleClassName
            )}
          >
            {subtitle}
          </SubtitleTag>

          {/* Underline */}
          {underline && (
            <motion.div
              className={`absolute bottom-0 left-0 ${underlineColor}`}
              style={{
                height: underlineWidth,
                width:
                  alignment === "center"
                    ? "50%"
                    : alignment === "right"
                    ? "30%"
                    : "70%",
                left:
                  alignment === "center"
                    ? "25%"
                    : alignment === "right"
                    ? "auto"
                    : "0",
                right: alignment === "right" ? "0" : "auto",
              }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: delay + 0.4 }}
            />
          )}
        </motion.div>
      )}
    </motion.div>
  );
};
