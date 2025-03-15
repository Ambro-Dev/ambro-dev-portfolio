"use client";

import { useIsMobile } from "@/hooks/use-is-mobile";
import { useTilt } from "@/hooks/use-tilt";
import { AnimatePresence, motion } from "framer-motion";
import { type FC, type ReactNode, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

export const TiltCard: FC<{
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
}> = ({
  children,
  className = "",
  tiltAmount = 15, // Zmniejszona wartość dla bardziej subtelnego efektu
  glareOpacity = 0.15, // Delikatniejszy efekt
  disabled = false,
  scale = 1.02,
  perspective = 1200, // Zwiększona perspektywa
  glarePosition = "center", // Zmieniona domyślna pozycja
  shadow = true,
  shadowColor = "rgba(0, 0, 0, 0.25)", // Bardziej subtelny cień
  borderGlow = false,
  borderColor = "rgba(99, 102, 241, 0.5)", // Zwiększony kontrast obramowania
  backgroundEffect = "none",
  transitionDuration = 0.3, // Nowy parametr dla kontroli czasu animacji
  onClick,
  hoverScale = 1.03, // Nowy parametr dla skali przy najechaniu
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [isActive, setIsActive] = useState(false);

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
    disabled: disabled || isMobile,
    perspective,
    springConfig: { stiffness: 300, damping: 30 },
    scale,
    glare: true,
    glareSize: 0.65, // Zwiększony rozmiar efektu
    glarePosition,
    glareColor: `rgba(255, 255, 255, ${glareOpacity})`,
    shadow,
    shadowColor,
  });

  // Background patterns/effects
  const getBackgroundEffect = () => {
    switch (backgroundEffect) {
      case "gradient":
        return {
          background:
            "linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(168, 85, 247, 0.07))",
        };
      case "noise":
        return {
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundBlendMode: "overlay",
          opacity: 0.08, // Zwiększona widoczność
        };
      case "grid":
        return {
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.07'%3E%3Cpath d='M0 0h20v20H0V0zm1 1v18h18V1H1z'/%3E%3C/g%3E%3C/svg%3E")`,
        };
      case "dots":
        return {
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.07'%3E%3Ccircle cx='3' cy='3' r='1'/%3E%3Ccircle cx='13' cy='13' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
        };
      case "waves":
        return {
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 10 C 30 20, 70 0, 100 10 L 100 0 L 0 0 Z' fill='%23ffffff' fill-opacity='0.03'/%3E%3C/svg%3E")`,
          backgroundSize: "100px 20px",
        };
      default:
        return {};
    }
  };

  return (
    <motion.div
      ref={cardRef}
      className={twMerge(
        "relative overflow-hidden perspective-1000 transition-all",
        isActive ? "ring-2 ring-opacity-50" : "",
        className
      )}
      style={{
        transformStyle: "preserve-3d",
        transition: `all ${transitionDuration}s ease-out`,
      }}
      whileHover={!disabled && !isMobile ? { scale: hoverScale } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 25 }} // Ulepszony spring
      onClick={() => {
        setIsActive(!isActive);
        onClick?.();
      }}
      {...handlers}
    >
      <motion.div
        className="w-full h-full rounded-xl overflow-hidden"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          ...shadowStyle,
          transition: `all ${transitionDuration}s ease-out`,
        }}
      >
        {/* Border glow effect */}
        {borderGlow && isHovered && (
          <motion.div
            className="absolute inset-0 rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: transitionDuration }}
            style={{
              boxShadow: `0 0 18px 2px ${borderColor}`,
              zIndex: -1,
            }}
          />
        )}

        {/* Background pattern */}
        {backgroundEffect !== "none" && (
          <div
            className="absolute inset-0 rounded-xl pointer-events-none"
            style={getBackgroundEffect()}
          />
        )}

        {/* Glare effect */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: transitionDuration }}
              className="absolute inset-0 rounded-xl pointer-events-none overflow-hidden"
            >
              <motion.div
                className="absolute inset-0"
                style={glareStyle as React.CSSProperties}
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
          />
        )}

        {/* Content */}
        <motion.div
          className="relative h-full z-10"
          style={{
            translateZ: 0,
            transform:
              isHovered && !disabled
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
};
