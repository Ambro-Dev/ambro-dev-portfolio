"use client";

import React from "react";
import type { ReactNode } from "react";
import { motion, useTransform, type MotionProps } from "framer-motion";
import { twMerge } from "tailwind-merge";
import { useInView } from "react-intersection-observer";
import { useTilt, useIsMobile } from "@/components/EnhancedUI";

type BlurStrength = "none" | "sm" | "md" | "lg" | "xl";
type ShadowSize = "none" | "sm" | "md" | "lg" | "xl";
type GlassVariant = "light" | "dark" | "frosted" | "blue" | "purple";
type HoverEffect = "none" | "float" | "glow" | "scale";

/**
 * Maps blur strength to Tailwind class
 */
const getBlurClass = (blur: BlurStrength): string => {
  if (blur === "none") return "";
  return `backdrop-blur-${blur}`;
};

/**
 * Maps shadow size to Tailwind class
 */
const getShadowClass = (shadow: ShadowSize): string => {
  if (shadow === "none") return "";
  return `shadow-${shadow}`;
};

/**
 * Extended props for glass components
 */
type ExtendedProps = React.HTMLAttributes<HTMLDivElement> & MotionProps;

/**
 * Basic glass card component with customizable appearance
 */
export const GlassCard: React.FC<
  {
    id?: string;
    children: ReactNode;
    className?: string;
    blur?: BlurStrength;
    opacity?: number;
    border?: boolean;
    highlight?: boolean;
    shadow?: ShadowSize;
  } & ExtendedProps
> = ({
  id,
  children,
  className = "",
  blur = "md",
  opacity = 20,
  border = true,
  highlight = true,
  shadow = "sm",
  ...props
}) => {
  // Validate opacity (0-100)
  const validOpacity = Math.max(0, Math.min(opacity, 100)) / 100;

  // Get appropriate classes
  const blurClass = getBlurClass(blur);
  const borderClass = border ? "border border-white/10" : "";
  const shadowClass = getShadowClass(shadow);

  return (
    <div
      id={id}
      className={twMerge(
        "rounded-lg overflow-hidden relative",
        `bg-white/[${validOpacity}] dark:bg-slate-900/[${validOpacity}]`,
        blurClass,
        borderClass,
        shadowClass,
        className
      )}
      {...props}
    >
      {/* Subtle highlight effect on top */}
      {highlight && (
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

/**
 * Advanced 3D glass card with tilt effect
 */
export const Glass3DCard: React.FC<
  {
    id?: string;
    children: ReactNode;
    className?: string;
    depth?: number;
    blurStrength?: number;
    hoverEffect?: boolean;
    lightReflection?: boolean;
  } & ExtendedProps
> = ({
  id,
  children,
  className = "",
  depth = 5,
  blurStrength = 4,
  hoverEffect = true,
  lightReflection = true,
  ...props
}) => {
  // Normalize parameters
  const normalizedDepth = Math.max(1, Math.min(depth, 10)) / 10;
  const normalizedBlur = Math.max(1, Math.min(blurStrength, 10));
  const tiltAmount = 5 * normalizedDepth;

  // Check if mobile
  const isMobile = useIsMobile();
  const disabled = isMobile || !hoverEffect;

  // Use tilt hook
  const { rotateX, rotateY, isHovered, handlers } = useTilt({
    amount: tiltAmount,
    disabled,
  });

  // Shadow effect based on tilt
  const shadowX = useTransform(rotateY, [-tiltAmount, tiltAmount], [-8, 8]);
  const shadowY = useTransform(rotateX, [-tiltAmount, tiltAmount], [-8, 8]);

  // Calculate shadow blur based on movement
  const shadowBlur = useTransform([rotateX, rotateY], (latest: number[]) => {
    const [x, y] = latest;
    return Math.sqrt(x * x + y * y) * 2 + 10;
  });

  // Combine shadow values into box-shadow string
  const boxShadow = useTransform(
    [shadowX, shadowY, shadowBlur],
    (latest: number[]) => {
      const [x, y, blur] = latest;
      return `${x}px ${y}px ${blur}px rgba(0, 0, 0, 0.1)`;
    }
  );

  // Light reflection transforms
  const lightRefX = useTransform(rotateX, [-tiltAmount, tiltAmount], [15, -15]);
  const lightRefY = useTransform(rotateY, [-tiltAmount, tiltAmount], [-15, 15]);

  // Extract motion props
  const {
    initial,
    animate,
    exit,
    transition,
    variants,
    whileHover,
    whileTap,
    ...restProps
  } = props;

  return (
    <motion.div
      id={id}
      className={twMerge("relative perspective-1200 rounded-lg", className)}
      initial={initial}
      animate={animate}
      exit={exit}
      transition={transition}
      variants={variants}
      {...handlers}
      {...restProps}
    >
      <motion.div
        className="w-full h-full rounded-lg overflow-hidden"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          boxShadow,
        }}
        whileHover={!disabled ? whileHover || { scale: 1.02 } : undefined}
        whileTap={whileTap}
        transition={{
          type: "spring",
          damping: 15,
          stiffness: 200,
          ...(transition ? transition : {}),
        }}
      >
        {/* Glass background effect */}
        <div
          className={twMerge(
            "absolute inset-0 rounded-lg border border-white/10",
            `backdrop-blur-[${normalizedBlur}px]`,
            "bg-gradient-to-b from-white/10 to-white/5 dark:from-slate-800/20 dark:to-slate-900/30"
          )}
        />

        {/* Light reflection effect */}
        {lightReflection && (
          <motion.div
            className="absolute inset-0 rounded-lg overflow-hidden"
            style={{ opacity: isHovered ? 0.07 : 0.04 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-transparent"
              style={{
                rotateX: lightRefX,
                rotateY: lightRefY,
              }}
            />
          </motion.div>
        )}

        {/* Content */}
        <div className="relative z-10 h-full">{children}</div>
      </motion.div>
    </motion.div>
  );
};

/**
 * Premium glass panel with various effects
 */
export const EliteGlassPanel: React.FC<
  {
    id?: string;
    children: ReactNode;
    className?: string;
    hoverEffect?: HoverEffect;
    variant?: GlassVariant;
    borderGradient?: boolean;
    layered?: boolean;
    ref?: React.Ref<HTMLDivElement>;
  } & ExtendedProps
> = ({
  id,
  children,
  className = "",
  hoverEffect = "glow",
  variant = "frosted",
  borderGradient = true,
  layered = false,
  ref,
  ...props
}) => {
  // Track when component enters viewport
  const [inViewRef, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Get styles for different variants
  const getVariantStyles = () => {
    switch (variant) {
      case "light":
        return "bg-white/10 backdrop-blur-md border-white/20";
      case "dark":
        return "bg-slate-900/30 backdrop-blur-md border-slate-700/30";
      case "blue":
        return "bg-indigo-950/10 backdrop-blur-md border-indigo-500/20";
      case "purple":
        return "bg-violet-950/10 backdrop-blur-md border-violet-500/20";
      default:
        return "bg-gradient-to-b from-white/10 to-white/5 dark:from-slate-900/20 dark:to-slate-950/30 backdrop-blur-md border-white/10 dark:border-slate-700/20";
    }
  };

  // Get hover effect styles
  const getHoverStyles = () => {
    switch (hoverEffect) {
      case "float":
        return "transition-transform duration-300 hover:-translate-y-1";
      case "glow":
        return "transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] dark:hover:shadow-[0_0_15px_rgba(30,64,175,0.15)]";
      case "scale":
        return "transition-transform duration-300 hover:scale-[1.02]";
      default:
        return "";
    }
  };

  // Get border gradient style
  const getBorderGradient = () => {
    if (!borderGradient) return "";

    if (variant === "blue") {
      return "before:absolute before:inset-0 before:p-[1px] before:rounded-lg before:content-[''] before:bg-gradient-to-b before:from-blue-400/30 before:to-indigo-500/10 before:-z-10";
    }

    if (variant === "purple") {
      return "before:absolute before:inset-0 before:p-[1px] before:rounded-lg before:content-[''] before:bg-gradient-to-b before:from-violet-400/30 before:to-purple-500/10 before:-z-10";
    }

    return "before:absolute before:inset-0 before:p-[1px] before:rounded-lg before:content-[''] before:bg-gradient-to-b before:from-white/30 before:to-white/10 dark:before:from-slate-500/30 dark:before:to-slate-700/10 before:-z-10";
  };

  // Extract motion props
  const {
    initial,
    animate,
    exit,
    transition,
    variants,
    whileHover,
    whileTap,
    ...restProps
  } = props;

  // Merge refs if needed
  const setRefs = React.useCallback(
    (element: HTMLDivElement) => {
      // Set the ref from useInView
      inViewRef(element);

      // Set the forwarded ref if it exists
      if (ref) {
        if (typeof ref === "function") {
          ref(element);
        } else {
          (ref as React.MutableRefObject<HTMLDivElement | null>).current =
            element;
        }
      }
    },
    [inViewRef, ref]
  );

  return (
    <motion.div
      id={id}
      ref={setRefs}
      className={twMerge(
        "relative rounded-lg border overflow-hidden",
        getVariantStyles(),
        getHoverStyles(),
        getBorderGradient(),
        className
      )}
      initial={initial || { opacity: 0, y: 20 }}
      animate={animate || (inView ? { opacity: 1, y: 0 } : {})}
      exit={exit}
      variants={variants}
      whileHover={whileHover}
      whileTap={whileTap}
      transition={transition || { duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      {...restProps}
    >
      {/* Subtle highlight on top */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {/* Layered effect */}
      {layered && (
        <>
          <div className="absolute -bottom-1 -right-1 -left-1 h-full rounded-lg bg-slate-800/20 backdrop-blur-sm -z-10" />
          <div className="absolute -bottom-2 -right-2 -left-2 h-full rounded-lg bg-slate-800/10 backdrop-blur-sm -z-20" />
        </>
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

/**
 * Section with glass neomorphic effect
 */
export const NeoGlassSection: React.FC<
  {
    id?: string;
    children: ReactNode;
    className?: string;
    glow?: "none" | "subtle" | "medium" | "strong";
    variant?: "blue" | "purple" | "neutral";
    pattern?: boolean;
    onIntersect?: () => void;
  } & ExtendedProps
> = ({
  id,
  children,
  className = "",
  glow = "subtle",
  variant = "blue",
  pattern = false,
  onIntersect,
  ...props
}) => {
  // Track when component enters viewport
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Call onIntersect when component is in view
  React.useEffect(() => {
    if (inView && onIntersect) {
      onIntersect();
    }
  }, [inView, onIntersect]);

  // Get glow style
  const getGlowStyle = () => {
    switch (glow) {
      case "strong":
        return "0 0 25px";
      case "medium":
        return "0 0 15px";
      case "subtle":
        return "0 0 10px";
      default:
        return "none";
    }
  };

  // Get colors for variant
  const getVariantColor = () => {
    switch (variant) {
      case "blue":
        return {
          bgFrom: "from-indigo-950/30",
          bgTo: "to-slate-950/40",
          glowColor: "rgba(30, 64, 175, 0.15)",
          border: "border-indigo-900/30",
        };
      case "purple":
        return {
          bgFrom: "from-violet-950/30",
          bgTo: "to-slate-950/40",
          glowColor: "rgba(91, 33, 182, 0.15)",
          border: "border-violet-900/30",
        };
      default:
        return {
          bgFrom: "from-slate-900/30",
          bgTo: "to-slate-950/40",
          glowColor: "rgba(30, 41, 59, 0.15)",
          border: "border-slate-800/30",
        };
    }
  };

  const { bgFrom, bgTo, glowColor, border } = getVariantColor();

  return (
    <div
      id={id}
      ref={ref}
      className={twMerge(
        "relative rounded-xl overflow-hidden backdrop-blur-md",
        "border",
        border,
        "bg-gradient-to-b",
        bgFrom,
        bgTo,
        className
      )}
      style={{
        boxShadow:
          glow !== "none" ? `${getGlowStyle()} ${glowColor}` : undefined,
      }}
      {...props}
    >
      {/* Subtle highlight on top */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Pattern background */}
      {pattern && (
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.15' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='1'/%3E%3Ccircle cx='13' cy='13' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};
