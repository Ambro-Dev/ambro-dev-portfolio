"use client";

import { useIsMobile } from "@/hooks/use-is-mobile";
import { useTilt } from "@/hooks/use-tilt";
import { AnimatePresence, motion } from "framer-motion";
import {
  type FC,
  type ReactNode,
  useRef,
  useState,
  useMemo,
  memo,
  useCallback,
} from "react";
import { twMerge } from "tailwind-merge";

export interface TiltCardProps {
  children: ReactNode;
  className?: string;
  tiltAmount?: number;
  glareOpacity?: number;
  disabled?: boolean;
  scale?: number;
  perspective?: number;
  glarePosition?: "top" | "center";
  shadow?: boolean;
  shadowColor?: string;
  borderGlow?: boolean;
  borderColor?: string;
  backgroundEffect?: "none" | "gradient" | "noise" | "grid" | "dots" | "waves";
  transitionDuration?: number;
  onClick?: () => void;
  hoverScale?: number;
  reducedMotion?: boolean;
}

// Pre-calculated background patterns - moved outside component
const BACKGROUND_PATTERNS = {
  gradient: {
    background:
      "linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(168, 85, 247, 0.07))",
  },
  noise: {
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
    backgroundBlendMode: "overlay",
    opacity: 0.08,
  },
  grid: {
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.07'%3E%3Cpath d='M0 0h20v20H0V0zm1 1v18h18V1H1z'/%3E%3C/g%3E%3C/svg%3E")`,
  },
  dots: {
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.07'%3E%3Ccircle cx='3' cy='3' r='1'/%3E%3Ccircle cx='13' cy='13' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
  },
  waves: {
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 10 C 30 20, 70 0, 100 10 L 100 0 L 0 0 Z' fill='%23ffffff' fill-opacity='0.03'/%3E%3C/svg%3E")`,
    backgroundSize: "100px 20px",
  },
  none: {},
};

// Animation variants for better performance
const hoverScaleVariants = {
  initial: { scale: 1 },
  hover: (scale: number) => ({ scale }),
  pressed: { scale: 0.98 },
};

// Border glow animation variants
const borderGlowVariants = {
  initial: { opacity: 0 },
  show: { opacity: 1 },
  exit: { opacity: 0 },
};

export const TiltCard: FC<TiltCardProps> = memo(
  ({
    children,
    className = "",
    tiltAmount = 15,
    glareOpacity = 0.15,
    disabled = false,
    scale = 1.02,
    perspective = 1200,
    glarePosition = "center",
    shadow = true,
    shadowColor = "rgba(0, 0, 0, 0.25)",
    borderGlow = false,
    borderColor = "rgba(99, 102, 241, 0.5)",
    backgroundEffect = "none",
    transitionDuration = 0.3,
    onClick,
    hoverScale = 1.03,
    reducedMotion = false,
  }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const isMobile = useIsMobile();
    const [isActive, setIsActive] = useState(false);
    const isDisabled = disabled || isMobile || reducedMotion;

    // Use tilt hook with advanced configuration
    const {
      rotateX,
      rotateY,
      posX,
      posY,
      isHovered,
      glareStyle,
      shadowStyle,
      handlers,
    } = useTilt({
      amount: tiltAmount,
      disabled: isDisabled,
      perspective,
      springConfig: { stiffness: 300, damping: 30 },
      scale,
      glare: true,
      glareSize: 0.65,
      glarePosition,
      glareColor: `rgba(255, 255, 255, ${glareOpacity})`,
      shadow,
      shadowColor,
    });

    // Memoize background effect to prevent re-calculation
    const backgroundEffectStyle = useMemo(
      () => BACKGROUND_PATTERNS[backgroundEffect] || {},
      [backgroundEffect]
    );

    // Memoize classes to reduce re-renders
    const cardClasses = useMemo(
      () =>
        twMerge(
          "relative overflow-hidden perspective-1000 transition-all",
          isActive ? "ring-2 ring-opacity-50" : "",
          className
        ),
      [isActive, className]
    );

    // Memoize content container styles
    const contentContainerStyle = useMemo(
      () => ({
        rotateX,
        rotateY,
        transformStyle: "preserve-3d" as const,
        ...shadowStyle,
        transition: `all ${transitionDuration}s ease-out`,
      }),
      [rotateX, rotateY, shadowStyle, transitionDuration]
    );

    // Optimized handler
    const handleClick = useCallback(() => {
      setIsActive((prev) => !prev);
      onClick?.();
    }, [onClick]);

    // Handle keyboard navigation
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      },
      [handleClick]
    );

    return (
      <motion.div
        ref={cardRef}
        className={cardClasses}
        style={{
          transformStyle: "preserve-3d",
          transition: `all ${transitionDuration}s ease-out`,
          willChange: isHovered ? "transform" : "auto",
          contain: "layout",
        }}
        variants={hoverScaleVariants}
        initial="initial"
        whileHover={!isDisabled ? "hover" : undefined}
        whileTap="pressed"
        custom={hoverScale}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        aria-pressed={isActive}
        data-testid="tilt-card"
        {...handlers}
      >
        <motion.div
          className="w-full h-full rounded-xl overflow-hidden"
          style={contentContainerStyle}
        >
          {/* Border glow effect */}
          {borderGlow && (
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  className="absolute inset-0 rounded-xl"
                  variants={borderGlowVariants}
                  initial="initial"
                  animate="show"
                  exit="exit"
                  transition={{ duration: transitionDuration }}
                  style={{
                    boxShadow: `0 0 18px 2px ${borderColor}`,
                    zIndex: -1,
                  }}
                />
              )}
            </AnimatePresence>
          )}

          {/* Background pattern - only render if needed */}
          {backgroundEffect !== "none" && (
            <div
              className="absolute inset-0 rounded-xl pointer-events-none"
              style={backgroundEffectStyle}
              aria-hidden="true"
            />
          )}

          {/* Glare effect */}
          <AnimatePresence>
            {isHovered && !isDisabled && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: transitionDuration }}
                className="absolute inset-0 rounded-xl pointer-events-none overflow-hidden"
                aria-hidden="true"
              >
                <div
                  className="absolute inset-0"
                  style={{
                    ...(glareStyle as React.CSSProperties),
                    willChange: "transform, opacity",
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Active state indicator */}
          {isActive && (
            <motion.div
              className="absolute inset-0 bg-indigo-500 opacity-5 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.05 }}
              exit={{ opacity: 0 }}
              aria-hidden="true"
            />
          )}

          {/* Content */}
          <motion.div
            className="relative h-full z-10"
            style={{
              translateZ: 0,
              transform:
                isHovered && !isDisabled
                  ? `translate(${posX}px, ${posY}px)`
                  : undefined,
              transition: `transform ${transitionDuration}s ease-out`,
            }}
          >
            {children}
          </motion.div>
        </motion.div>
      </motion.div>
    );
  }
);

// Add display name
TiltCard.displayName = "TiltCard";

// Export as default with memo
export default TiltCard;
