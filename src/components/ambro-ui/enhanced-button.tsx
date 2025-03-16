"use client";

import { useMagneticEffect } from "@/hooks/use-magnetic-effect";
import {
  type FC,
  type ReactNode,
  type RefObject,
  useRef,
  useState,
  useCallback,
  useEffect,
  useMemo,
  memo,
} from "react";
import { twMerge } from "tailwind-merge";
import { motion, AnimatePresence } from "framer-motion";

/**
 * EnhancedButton Component
 *
 * An advanced button component with various visual effects and states.
 *
 * @param children - Button content
 * @param className - Additional CSS classes
 * @param onClick - Click handler function
 * @param variant - Button style variant
 * @param disabled - Whether the button is disabled
 * @param ariaLabel - Accessibility label
 * @param href - URL for link variant
 * @param type - Button type (button, submit, reset)
 * @param size - Button size preset
 * @param icon - Icon element to display
 * @param iconPosition - Icon position (left or right)
 * @param fullWidth - Whether to take full width of container
 * @param magneticEffect - Enable magnetic mouse effect
 * @param glowOnHover - Enable glow effect on hover
 * @param glowColor - Color of the glow effect
 * @param glowIntensity - Intensity of the glow (0-30)
 * @param borderGradient - Enable gradient border
 * @param glassmorphism - Enable glassmorphism effect
 * @param animatedBg - Enable animated background
 * @param animationDuration - Duration of animation in seconds
 * @param rounded - Border radius preset
 * @param shadow - Shadow size preset
 * @param loading - Display loading state
 * @param loadingText - Text to display while loading
 * @param rippleEffect - Enable ripple effect on click
 * @param ref - Ref for the button element
 */
export const EnhancedButton: FC<{
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "subtle" | "tech";
  disabled?: boolean;
  ariaLabel?: string;
  href?: string;
  type?: "button" | "submit" | "reset";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  magneticEffect?: boolean;
  glowOnHover?: boolean;
  glowColor?: string;
  glowIntensity?: number;
  borderGradient?: boolean;
  glassmorphism?: boolean;
  animatedBg?: boolean;
  animationDuration?: number;
  rounded?: "sm" | "md" | "lg" | "full";
  shadow?: "none" | "sm" | "md" | "lg";
  loading?: boolean;
  loadingText?: string;
  rippleEffect?: boolean;
  ref?: RefObject<HTMLButtonElement | HTMLAnchorElement>;
}> = memo(
  ({
    children,
    className = "",
    onClick,
    variant = "primary",
    disabled = false,
    ariaLabel,
    href,
    type = "button",
    size = "md",
    icon,
    iconPosition = "left",
    fullWidth = false,
    magneticEffect = false,
    glowOnHover = false,
    glowColor,
    glowIntensity = 15,
    borderGradient = false,
    glassmorphism = false,
    animatedBg = false,
    animationDuration = 6,
    rounded = "md",
    shadow = "md",
    loading = false,
    loadingText,
    rippleEffect = false,
    ref,
  }) => {
    // Refs
    const buttonRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);

    // Memoized merged ref function
    const mergedRef = useCallback(
      (refToUse: HTMLButtonElement | HTMLAnchorElement | null) => {
        buttonRef.current = refToUse;
        if (ref && refToUse) {
          ref.current = refToUse;
        }
      },
      [ref]
    );

    // States - with optimized initial state
    const [ripples, setRipples] = useState<
      { id: number; x: number; y: number; size: number }[]
    >([]);
    const rippleCount = useRef(0);
    const [isHovered, setIsHovered] = useState(false);

    // Cleanup effect - optimized with proper dependency array
    useEffect(() => {
      // No cleanup needed on mount
      return () => {
        setRipples([]);
        rippleCount.current = 0;
      };
    }, []);

    // Apply magnetic effect if enabled - only when needed
    useMagneticEffect(buttonRef as RefObject<HTMLElement>, {
      strength: 10,
      disabled: !magneticEffect || disabled,
    });

    // Variant styling - memoized
    const variantClasses = useMemo(() => {
      if (glassmorphism) {
        return "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20";
      }

      switch (variant) {
        case "primary":
          return "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md border-none";
        case "secondary":
          return "bg-gray-800 hover:bg-gray-700 text-white shadow-sm border-none";
        case "outline":
          return "bg-transparent border border-gray-700 hover:bg-gray-800/30 text-white backdrop-blur-sm";
        case "ghost":
          return "bg-transparent hover:bg-gray-800/30 text-white border-none";
        case "subtle":
          return "bg-gray-800/30 hover:bg-gray-800/50 text-gray-200 border-none backdrop-blur-sm";
        case "tech":
          return "bg-black/40 border border-indigo-500/30 text-white hover:border-indigo-400/50 backdrop-blur-md";
        default:
          return "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md border-none";
      }
    }, [variant, glassmorphism]);

    // Size classes - memoized
    const sizeClasses = useMemo(() => {
      switch (size) {
        case "xs":
          return "px-2.5 py-1 text-xs";
        case "sm":
          return "px-3.5 py-1.5 text-sm";
        case "lg":
          return "px-6 py-3 text-lg";
        case "xl":
          return "px-8 py-4 text-xl";
        default:
          return "px-5 py-2.5 text-base";
      }
    }, [size]);

    // Rounding classes - memoized
    const roundedClasses = useMemo(() => {
      switch (rounded) {
        case "sm":
          return "rounded";
        case "lg":
          return "rounded-xl";
        case "full":
          return "rounded-full";
        default:
          return "rounded-lg";
      }
    }, [rounded]);

    // Shadow classes - memoized
    const shadowClasses = useMemo(() => {
      switch (shadow) {
        case "sm":
          return "shadow-sm";
        case "lg":
          return "shadow-lg";
        case "none":
          return "";
        default:
          return "shadow-md";
      }
    }, [shadow]);

    // Handle ripple effect - optimized
    const addRipple = useCallback(
      (e: React.MouseEvent<HTMLElement>) => {
        if (!rippleEffect || disabled) return;

        const button = e.currentTarget;
        const rect = button.getBoundingClientRect();

        // Calculate ripple position
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Optimize size calculation
        const size = Math.max(rect.width, rect.height) * 2.5;
        const id = rippleCount.current++;

        // Batch state update
        setRipples((prev) => [...prev, { id, x, y, size }]);

        // Remove ripple after animation completes
        setTimeout(() => {
          setRipples((prev) => prev.filter((ripple) => ripple.id !== id));
        }, 750);
      },
      [rippleEffect, disabled]
    );

    // Event handlers - optimized with proper dependencies
    const handleMouseEnter = useCallback(() => {
      if (!disabled) {
        setIsHovered(true);
      }
    }, [disabled]);

    const handleMouseLeave = useCallback(() => {
      setIsHovered(false);
    }, []);

    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLElement>) => {
        addRipple(e);
        if (!disabled && onClick) onClick();
      },
      [addRipple, disabled, onClick]
    );

    // Generate common classes - memoized
    const baseClasses = useMemo(
      () =>
        twMerge(
          "relative overflow-hidden transition-all font-medium outline-none flex items-center justify-center gap-2",
          variantClasses,
          sizeClasses,
          roundedClasses,
          shadowClasses,
          disabled && "opacity-50 cursor-not-allowed pointer-events-none",
          fullWidth && "w-full",
          "will-change-transform", // Performance optimization
          borderGradient && "border-0",
          className
        ),
      [
        variantClasses,
        sizeClasses,
        roundedClasses,
        shadowClasses,
        disabled,
        fullWidth,
        borderGradient,
        className,
      ]
    );

    // Motion props - memoized
    const motionProps = useMemo(
      () => ({
        whileHover: disabled
          ? {}
          : {
              scale: magneticEffect ? 1 : 1.03,
              boxShadow: glowOnHover
                ? `0 0 ${glowIntensity}px 2px ${
                    glowColor || "rgba(99, 102, 241, 0.8)"
                  }`
                : undefined,
            },
        whileTap: disabled ? {} : { scale: magneticEffect ? 1 : 0.97 },
        transition: {
          type: "spring",
          stiffness: 500,
          damping: 17,
          mass: 0.8,
        },
      }),
      [disabled, magneticEffect, glowOnHover, glowIntensity, glowColor]
    );

    // Gradient animation - memoized
    const gradientAnimation = useMemo(
      () =>
        animatedBg
          ? {
              animate: {
                backgroundPosition: ["0% 0%", "100% 100%"],
              },
              transition: {
                duration: animationDuration,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse" as const,
                ease: "linear",
              },
              style: {
                background:
                  "linear-gradient(45deg, #4f46e5, #3b82f6, #8b5cf6, #4f46e5)",
                backgroundSize: "300% 300%",
                willChange: "background-position", // Performance optimization
              },
            }
          : {},
      [animatedBg, animationDuration]
    );

    // BorderGradient component - memoized
    const BorderGradient = useCallback(() => {
      if (!borderGradient) return null;

      return (
        <motion.div
          className="absolute inset-0 rounded-[inherit] -z-10 opacity-80"
          initial={{ opacity: 0.6 }}
          animate={{
            opacity: isHovered ? 1 : 0.8,
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            opacity: { duration: 0.3 },
            backgroundPosition: {
              duration: 6,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            },
          }}
          style={{
            background:
              "linear-gradient(45deg, #4f46e5, #8b5cf6, #ec4899, #4f46e5)",
            backgroundSize: "300% 300%",
            padding: "1px",
            willChange: "opacity, background-position", // Performance optimization
          }}
          aria-hidden="true"
        />
      );
    }, [borderGradient, isHovered]);

    // Loading spinner - memoized
    const LoadingSpinner = useCallback(
      () => (
        <motion.div
          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
          animate={{ rotate: 360 }}
          transition={{
            duration: 0.8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          aria-hidden="true"
        />
      ),
      []
    );

    // Content with loading state - memoized
    const buttonContent = useMemo(() => {
      if (loading) {
        return (
          <div className="flex items-center gap-2">
            <LoadingSpinner />
            <span>{loadingText || children}</span>
          </div>
        );
      }

      return (
        <>
          {iconPosition === "left" && icon && (
            <span className="flex items-center" aria-hidden="true">
              {icon}
            </span>
          )}
          <span>{children}</span>
          {iconPosition === "right" && icon && (
            <span className="flex items-center" aria-hidden="true">
              {icon}
            </span>
          )}
        </>
      );
    }, [loading, loadingText, children, iconPosition, icon, LoadingSpinner]);

    // Common component props - memoized
    const commonProps = useMemo(
      () => ({
        className: baseClasses,
        onClick: handleClick,
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
        "aria-disabled": disabled || loading,
        "aria-label": ariaLabel,
        "aria-busy": loading,
        ...motionProps,
        animate: {
          ...(animatedBg ? gradientAnimation.animate : {}),
          ...(motionProps.whileHover && isHovered
            ? motionProps.whileHover
            : {}),
        },
        transition: {
          ...motionProps.transition,
          ...(animatedBg ? gradientAnimation.transition : {}),
        },
        style: animatedBg ? gradientAnimation.style : undefined,
      }),
      [
        baseClasses,
        handleClick,
        handleMouseEnter,
        handleMouseLeave,
        disabled,
        loading,
        ariaLabel,
        motionProps,
        animatedBg,
        gradientAnimation,
        isHovered,
      ]
    );

    // Ripple elements - memoized for better performance
    const rippleElements = useMemo(
      () => (
        <AnimatePresence>
          {ripples.map((ripple) => (
            <motion.span
              key={ripple.id}
              className="absolute bg-white/30 rounded-full pointer-events-none"
              initial={{
                width: 0,
                height: 0,
                opacity: 0.7,
                x: ripple.x,
                y: ripple.y,
              }}
              animate={{
                width: ripple.size,
                height: ripple.size,
                opacity: 0,
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.75,
                ease: [0.4, 0, 0.2, 1],
              }}
              style={{
                left: 0,
                top: 0,
                transform: "translate(-50%, -50%)",
                willChange: "width, height, opacity",
              }}
              aria-hidden="true"
            />
          ))}
        </AnimatePresence>
      ),
      [ripples]
    );

    // Complete button content - with all features
    const Content = (
      <>
        <BorderGradient />
        {rippleElements}
        {buttonContent}
      </>
    );

    // Render either link or button based on href prop
    if (href) {
      return (
        <motion.a
          ref={mergedRef}
          href={href}
          {...commonProps}
          // Add proper semantic attributes for links
          rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
          target={href.startsWith("http") ? "_blank" : undefined}
        >
          {Content}
        </motion.a>
      );
    }

    return (
      <motion.button
        ref={mergedRef}
        type={type}
        disabled={disabled || loading}
        {...commonProps}
      >
        {Content}
      </motion.button>
    );
  }
);

// Add display name for better debugging
EnhancedButton.displayName = "EnhancedButton";
