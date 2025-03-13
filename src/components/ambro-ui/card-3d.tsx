import { useTilt } from "@/hooks/use-tilt";
import { useTransform } from "framer-motion";
import { useRef, type FC, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";

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
}> = ({
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

  // Custom tilt effect
  const {
    rotateX: tiltX,
    rotateY: tiltY,
    handlers,
  } = useTilt({
    amount: interactiveStrength,
    disabled: !interactive,
  });

  // Calculate rotations including base rotations and interactive rotations
  const finalRotateX = useTransform(tiltX, (value) => value + rotateX);

  const finalRotateY = useTransform(tiltY, (value) => value + rotateY);

  // Border radius based on sharp edges setting
  const borderRadius = sharpEdges ? "0" : "0.5rem";

  // Transform based on interactivity settings
  const getInteractiveTransform = () => {
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
  };

  // Shadow effect
  const getShadowStyle = () => {
    if (!shadow) return {};

    return {
      boxShadow: `0 20px 25px -5px ${shadowColor}`,
    };
  };

  // Glow effect
  const getGlowStyle = () => {
    if (!glowEffect) return {};

    return {
      boxShadow: `0 0 ${glowIntensity}px ${glowColor}`,
    };
  };

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
      onClick={onClick}
      {...(interactiveLayer === "parent" ? handlers : {})}
    >
      <motion.div
        className={twMerge("w-full h-full border", bgColor, borderColor)}
        style={{
          transformStyle: "preserve-3d",
          borderRadius,
          ...getInteractiveTransform(),
          ...getShadowStyle(),
          ...getGlowStyle(),
        }}
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
              className="absolute inset-0 backdrop-invert backdrop-filter-[50%] mix-blend-difference z-0"
              style={{ borderRadius }}
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
};
