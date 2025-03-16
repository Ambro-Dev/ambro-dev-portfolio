"use client";

import { type FC, type ReactNode, useMemo, memo } from "react";
import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
import { HighlightText } from "@/components/ambro-ui/highlight-text";
import React from "react";
import { JsonLd } from "../JsonLd";

export interface SectionHeadingProps {
  title: ReactNode;
  subtitle?: ReactNode;
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
  reducedMotion?: boolean;
  seoHeading?: boolean;
}

// Extract animation variants outside component
const createContainerVariants = (delay: number) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: delay,
    },
  },
});

// Create child variants
const createChildVariants = (animation: string) => {
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

// Size configuration map
const SIZE_CONFIG = {
  sm: {
    title: "text-xl md:text-2xl",
    subtitle: "text-sm md:text-base",
    spacing: "space-y-1",
    iconSize: "w-5 h-5",
  },
  md: {
    title: "text-2xl md:text-3xl",
    subtitle: "text-base md:text-lg",
    spacing: "space-y-2",
    iconSize: "w-6 h-6",
  },
  lg: {
    title: "text-3xl md:text-4xl",
    subtitle: "text-base md:text-lg",
    spacing: "space-y-3",
    iconSize: "w-7 h-7",
  },
  xl: {
    title: "text-4xl md:text-5xl",
    subtitle: "text-lg md:text-xl",
    spacing: "space-y-4",
    iconSize: "w-8 h-8",
  },
};

// Alignment configuration map
const ALIGNMENT_CLASSES = {
  left: "text-left items-start",
  center: "text-center items-center",
  right: "text-right items-end",
};

export const SectionHeading: FC<SectionHeadingProps> = memo(
  ({
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
    reducedMotion = false,
    seoHeading = true,
  }) => {
    // Memoize size classes
    const {
      title: titleSize,
      subtitle: subtitleSize,
      spacing,
      iconSize,
    } = useMemo(() => SIZE_CONFIG[size] || SIZE_CONFIG.lg, [size]);

    // Memoize alignment classes
    const alignClasses = useMemo(
      () => ALIGNMENT_CLASSES[alignment] || ALIGNMENT_CLASSES.left,
      [alignment]
    );

    // Memoize animation variants
    const containerVariants = useMemo(
      () => createContainerVariants(delay),
      [delay]
    );

    const childVariants = useMemo(
      () => createChildVariants(animation),
      [animation]
    );

    // Determine if we should skip animation
    const shouldSkipAnimation = reducedMotion || animation === "none";

    // Memoize element flex direction classes
    const flexDirectionClasses = useMemo(() => {
      let flexDir = iconPosition === "top" ? "flex-col" : "flex-row";
      if (iconPosition === "right") flexDir += " flex-row-reverse";
      return flexDir;
    }, [iconPosition]);

    // Memoize item alignment classes
    const itemAlignClasses = useMemo(
      () => `items-${alignment === "center" ? "center" : alignment}`,
      [alignment]
    );

    // Memoize title classes
    const titleClasses = useMemo(
      () =>
        twMerge(
          titleSize,
          uppercase && "uppercase tracking-wider",
          gradient &&
            `bg-gradient-to-r ${gradientFrom} ${gradientTo} bg-clip-text text-transparent`,
          "font-bold",
          titleClassName
        ),
      [titleSize, uppercase, gradient, gradientFrom, gradientTo, titleClassName]
    );

    // Memoize subtitle classes
    const subtitleClasses = useMemo(
      () =>
        twMerge(subtitleSize, "text-gray-400 font-light", subtitleClassName),
      [subtitleSize, subtitleClassName]
    );

    // Memoize underline styles
    const underlineStyles = useMemo(() => {
      const styles: Record<string, string> = {
        height: underlineWidth,
        width:
          alignment === "center"
            ? "50%"
            : alignment === "right"
            ? "30%"
            : "70%",
      };

      if (alignment === "center") {
        styles.left = "25%";
      } else if (alignment === "right") {
        styles.right = "0";
      } else {
        styles.left = "0";
      }

      return styles;
    }, [alignment, underlineWidth]);

    // Efficiently highlight specific words
    const renderHighlightedTitle = useMemo(() => {
      if (typeof title !== "string" || highlightWords.length === 0) {
        return title;
      }

      const words = title.split(" ");

      return (
        <>
          {words.map((word, index) => {
            const spaceBefore = index > 0 ? " " : "";

            if (highlightWords.includes(index)) {
              return (
                <React.Fragment
                  key={`word-${
                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                    index
                  }`}
                >
                  {spaceBefore}
                  <HighlightText color={highlightColor} className="font-medium">
                    {word}
                  </HighlightText>
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
                {spaceBefore}
                {word}
              </React.Fragment>
            );
          })}
        </>
      );
    }, [title, highlightWords, highlightColor]);

    // For SEO, if it's a primary heading and h1 isn't selected, add structured data
    const seoData = useMemo(() => {
      if (seoHeading && TitleTag !== "h1") {
        const headingData = {
          "@context": "https://schema.org",
          "@type": "WebPageElement",
          name: typeof title === "string" ? title : "Section heading",
        };
        return JSON.stringify(headingData);
      }
      return null;
    }, [seoHeading, TitleTag, title]);

    return (
      <motion.div
        className={twMerge(
          `flex flex-col ${spacing} ${alignClasses}`,
          className
        )}
        variants={containerVariants}
        initial={shouldSkipAnimation ? "visible" : "hidden"}
        animate="visible"
        data-testid="section-heading"
      >
        {/* Hidden SEO Schema if needed */}
        {seoData && <JsonLd data={seoData} />}

        {/* Title with optional icon */}
        <motion.div
          className={`flex ${flexDirectionClasses} ${itemAlignClasses} gap-3`}
          variants={childVariants}
        >
          {icon && <div className={iconSize}>{icon}</div>}

          <TitleTag
            className={titleClasses}
            data-testid="section-heading-title"
          >
            {renderHighlightedTitle}
          </TitleTag>
        </motion.div>

        {/* Divider */}
        {divider && (
          <motion.div
            className={`${dividerColor} h-1 rounded-full mx-${
              alignment === "center" ? "auto" : "0"
            } ${alignment === "right" ? "ml-auto" : ""}`}
            style={{ width: dividerWidth, willChange: "opacity, transform" }}
            variants={childVariants}
            data-testid="section-heading-divider"
            aria-hidden="true"
          />
        )}

        {/* Subtitle */}
        {subtitle && (
          <motion.div
            className="relative"
            variants={childVariants}
            data-testid="section-heading-subtitle"
          >
            <SubtitleTag className={subtitleClasses}>{subtitle}</SubtitleTag>

            {/* Underline */}
            {underline && (
              <motion.div
                className={`absolute bottom-0 ${underlineColor}`}
                style={{
                  ...underlineStyles,
                  willChange: "transform",
                }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  duration: reducedMotion ? 0 : 0.8,
                  delay: reducedMotion ? 0 : delay + 0.4,
                }}
                aria-hidden="true"
              />
            )}
          </motion.div>
        )}
      </motion.div>
    );
  }
);

// Add display name for better debugging
SectionHeading.displayName = "SectionHeading";

export default SectionHeading;
