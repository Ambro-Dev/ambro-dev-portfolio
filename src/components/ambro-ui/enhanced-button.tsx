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
} from "react";
import { twMerge } from "tailwind-merge";
import { motion, AnimatePresence } from "framer-motion";

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
}> = ({
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

  // Memoizacja funkcji mergującej referencje dla lepszej wydajności
  const mergedRef = useCallback(
    (refToUse: HTMLButtonElement | HTMLAnchorElement | null) => {
      buttonRef.current = refToUse;
      if (ref && refToUse) {
        ref.current = refToUse;
      }
    },
    [ref]
  );

  // States
  const [ripples, setRipples] = useState<
    { id: number; x: number; y: number; size: number }[]
  >([]);
  const rippleCount = useRef(0);
  const [isHovered, setIsHovered] = useState(false);

  // Czyszczenie efektów po odmontowaniu komponentu
  useEffect(() => {
    return () => {
      setRipples([]);
      rippleCount.current = 0;
    };
  }, []);

  // Apply magnetic effect if enabled
  useMagneticEffect(buttonRef as RefObject<HTMLElement>, {
    strength: 30,
    disabled: !magneticEffect || disabled,
  });

  // Variant styling
  const getVariantClasses = () => {
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
  };

  // Size classes
  const getSizeClasses = () => {
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
  };

  // Rounding classes
  const getRoundedClasses = () => {
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
  };

  // Shadow classes
  const getShadowClasses = () => {
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
  };

  // Handle ripple effect - zoptymalizowana implementacja
  const addRipple = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (!rippleEffect || disabled) return;

      const button = e.currentTarget;
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Dostosowanie rozmiaru efektu w zależności od wielkości przycisku
      const size = Math.max(rect.width, rect.height) * 2.5;
      const id = rippleCount.current;
      rippleCount.current += 1;

      setRipples((prev) => [...prev, { id, x, y, size }]);

      // Remove ripple after animation
      setTimeout(() => {
        setRipples((prev) => prev.filter((ripple) => ripple.id !== id));
      }, 750); // Wydłużony czas dla lepszego efektu
    },
    [rippleEffect, disabled]
  );

  // Handle events
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

  // Generate common classes
  const baseClasses = twMerge(
    "relative overflow-hidden transition-all font-medium outline-none flex items-center justify-center gap-2",
    getVariantClasses(),
    getSizeClasses(),
    getRoundedClasses(),
    getShadowClasses(),
    disabled && "opacity-50 cursor-not-allowed pointer-events-none",
    fullWidth && "w-full",
    "will-change-transform", // Optymalizacja wydajności animacji
    borderGradient && "border-0",
    className
  );

  // Generate common motion props - ulepszone z lepszymi wartościami dla animacji
  const motionProps = {
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
      stiffness: 500, // Zwiększona wartość dla bardziej responsywnej animacji
      damping: 17, // Dostosowana wartość tłumienia
      mass: 0.8, // Dodana mniejsza masa dla szybszej animacji
    },
  };

  // Generate animated gradient background - ulepszona animacja (tylko 2 klatki kluczowe)
  const gradientAnimation = animatedBg
    ? {
        animate: {
          backgroundPosition: ["0% 0%", "100% 100%"],
        },
        transition: {
          duration: animationDuration,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse" as const, // Używamy reverse zamiast trzeciej klatki kluczowej
          ease: "linear",
        },
        style: {
          background:
            "linear-gradient(45deg, #4f46e5, #3b82f6, #8b5cf6, #4f46e5)",
          backgroundSize: "300% 300%",
        },
      }
    : {};

  // Bordered gradient - zoptymalizowana implementacja z użyciem pseudo-elementów
  const BorderGradient = () => {
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
        }}
      />
    );
  };

  // Loading animation - ulepszony efekt ładowania
  const LoadingSpinner = () => (
    <motion.div
      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
      animate={{ rotate: 360 }}
      transition={{
        duration: 0.8,
        repeat: Number.POSITIVE_INFINITY,
        ease: "linear",
      }}
    />
  );

  // Loading state
  const loadingState = loading ? (
    <div className="flex items-center gap-2">
      <LoadingSpinner />
      {loadingText || children}
    </div>
  ) : (
    <>
      {iconPosition === "left" && icon && (
        <span className="flex items-center">{icon}</span>
      )}
      <span>{children}</span>
      {iconPosition === "right" && icon && (
        <span className="flex items-center">{icon}</span>
      )}
    </>
  );

  // Wspólne propsy dla obu wersji komponentu (button i link)
  const commonProps = {
    className: baseClasses,
    onClick: handleClick,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    "aria-disabled": disabled,
    "aria-label": ariaLabel,
    ...motionProps,
    animate: {
      ...(animatedBg ? gradientAnimation.animate : {}),
      ...(motionProps.whileHover && isHovered ? motionProps.whileHover : {}),
    },
    transition: {
      ...motionProps.transition,
      ...(animatedBg ? gradientAnimation.transition : {}),
    },
    style: animatedBg ? gradientAnimation.style : undefined,
  };

  // Render jako link lub button
  const Content = (
    <>
      {/* Border gradient jako osobny element */}
      <BorderGradient />

      {/* Ripple effects - z AnimatePresence dla lepszego zarządzania */}
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
              ease: [0.4, 0, 0.2, 1], // Custom easing dla płynniejszego efektu
            }}
            style={{
              left: 0,
              top: 0,
              transform: "translate(-50%, -50%)",
              willChange: "width, height, opacity", // Optymalizacja wydajności
            }}
          />
        ))}
      </AnimatePresence>

      {/* Content */}
      {loadingState}
    </>
  );

  if (href) {
    return (
      <motion.a ref={mergedRef} href={href} {...commonProps}>
        {Content}
      </motion.a>
    );
  }

  return (
    <motion.button
      ref={mergedRef}
      type={type}
      disabled={disabled}
      {...commonProps}
    >
      {Content}
    </motion.button>
  );
};
