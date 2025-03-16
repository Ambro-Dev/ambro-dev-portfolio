"use client";

import { useTilt } from "@/hooks/use-tilt";
import { useTransform } from "framer-motion";
import {
  useRef,
  type FC,
  type ReactNode,
  memo,
  useMemo,
  useCallback,
} from "react";
import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";

/**
 * Card3D Component
 *
 * Creates a 3D card with interactive tilt effects and customizable styling.
 *
 * @param children - Content to display inside the card
 * @param className - Additional CSS classes
 * @param perspective - 3D perspective value in pixels
 * @param rotateX - Base X-axis rotation in degrees
 * @param rotateY - Base Y-axis rotation in degrees
 * @param rotateZ - Z-axis rotation in degrees
 * @param translateZ - Z-axis translation in pixels
 * @param interactive - Enable interactive tilt effect
 * @param interactiveStrength - Strength of the tilt effect (1-50)
 * @param interactiveLayer - Which layer responds to mouse movement
 * @param bgColor - Background color Tailwind class
 * @param borderColor - Border color Tailwind class
 * @param glowEffect - Enable glow effect
 * @param glowColor - Color of the glow effect
 * @param glowIntensity - Intensity of the glow (0-30)
 * @param invert - Apply invert filter effect
 * @param shadow - Show shadow
 * @param shadowColor - Shadow color
 * @param sharpEdges - Use sharp edges instead of rounded corners
 * @param height - Card height
 * @param width - Card width
 * @param onClick - Click handler function
 */
export const Card3D: FC<{
  children: ReactNode;
  className?: string;
  perspective?: number;
  rotateX?: number;
  rotateY?: number;
  rotateZ?: number;
  translateZ?: number;
  interactive?: boolean;
  interactiveStrength?: number;
  interactiveLayer?: "child" | "parent";
  bgColor?: string;
  borderColor?: string;
  glowEffect?: boolean;
  glowColor?: string;
  glowIntensity?: number;
  invert?: boolean;
  shadow?: boolean;
  shadowColor?: string;
  sharpEdges?: boolean;
  height?: string;
  width?: string;
  onClick?: () => void;
}> = memo(
  ({
    children,
    className = "",
    perspective = 1000,
    rotateX = 0,
    rotateY = 0,
    rotateZ = 0,
    translateZ = 0,
    interactive = true,
    interactiveStrength = 15,
    interactiveLayer = "child",
    bgColor = "bg-black/20",
    borderColor = "border-indigo-500/20",
    glowEffect = false,
    glowColor = "rgba(99, 102, 241, 0.4)",
    glowIntensity = 15,
    invert = false,
    shadow = true,
    shadowColor = "rgba(0, 0, 0, 0.4)",
    sharpEdges = false,
    height = "auto",
    width = "auto",
    onClick,
  }) => {
    const cardRef = useRef<HTMLDivElement>(null);

    // Custom tilt effect - only enable if interactive is true
    const {
      rotateX: tiltX,
      rotateY: tiltY,
      handlers,
    } = useTilt({
      amount: interactiveStrength,
      disabled: !interactive,
    });

    // Calculate rotations including base rotations and interactive rotations
    // Use useTransform only when interactive is true to save resources
    const finalRotateX = useTransform(tiltX, (value) =>
      interactive ? value + rotateX : rotateX
    );

    const finalRotateY = useTransform(tiltY, (value) =>
      interactive ? value + rotateY : rotateY
    );

    // Border radius based on sharp edges setting - memoized
    const borderRadius = useMemo(
      () => (sharpEdges ? "0" : "0.5rem"),
      [sharpEdges]
    );

    // Transform configuration based on interactivity - memoized
    const transformConfig = useMemo(() => {
      if (!interactive) {
        return {
          rotateX,
          rotateY,
          rotateZ,
          translateZ: `${translateZ}px`,
        };
      }

      if (interactiveLayer === "parent") {
        return {
          rotateX: finalRotateX,
          rotateY: finalRotateY,
          rotateZ,
          translateZ: `${translateZ}px`,
        };
      }

      return {
        rotateX,
        rotateY,
        rotateZ,
        translateZ: `${translateZ}px`,
      };
    }, [
      interactive,
      interactiveLayer,
      rotateX,
      rotateY,
      rotateZ,
      translateZ,
      finalRotateX,
      finalRotateY,
    ]);

    // Shadow style - memoized
    const shadowStyle = useMemo(() => {
      if (!shadow) return {};
      return {
        boxShadow: `0 20px 25px -5px ${shadowColor}`,
      };
    }, [shadow, shadowColor]);

    // Glow effect style - memoized
    const glowStyle = useMemo(() => {
      if (!glowEffect) return {};
      return {
        boxShadow: `0 0 ${glowIntensity}px ${glowColor}`,
      };
    }, [glowEffect, glowIntensity, glowColor]);

    // Combined styles for better performance - memoized
    const combinedStyles = useMemo(
      () => ({
        transformStyle: "preserve-3d" as const,
        borderRadius,
        ...transformConfig,
        ...shadowStyle,
        ...glowStyle,
      }),
      [borderRadius, transformConfig, shadowStyle, glowStyle]
    );

    // Memoized click handler to prevent rerenders
    const handleClick = useCallback(() => {
      if (onClick) onClick();
    }, [onClick]);

    return (
      <motion.div
        ref={cardRef}
        className={twMerge("relative overflow-hidden", className)}
        style={{
          perspective: `${perspective}px`,
          height,
          width,
          borderRadius,
        }}
        onClick={handleClick}
        {...(interactiveLayer === "parent" ? handlers : {})}
        // Add appropriate ARIA role
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
      >
        <motion.div
          className={twMerge("w-full h-full border", bgColor, borderColor)}
          style={combinedStyles}
          {...(interactiveLayer === "child" ? handlers : {})}
        >
          <div
            className="relative w-full h-full overflow-hidden"
            style={{
              transformStyle: "preserve-3d",
              borderRadius,
            }}
          >
            {/* Background effects */}
            {invert && (
              <div
                className="absolute inset-0 backdrop-invert mix-blend-difference z-0"
                style={{ borderRadius, backdropFilter: "blur(50%)" }}
                aria-hidden="true" // Hide from screen readers as it's decorative
              />
            )}

            {/* Content */}
            <div
              className="relative z-10 w-full h-full"
              style={{
                transformStyle: "preserve-3d",
                transform: "translateZ(5px)",
              }}
            >
              {children}
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  }
);

// Add display name for better debugging
Card3D.displayName = "Card3D";
