"use client";

import { useMotionValue, useSpring, useTransform } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

export const useTilt = (options: {
  amount?: number;
  disabled?: boolean;
  perspective?: number;
  springConfig?: { stiffness: number; damping: number };
  scale?: number;
  glare?: boolean;
  glareSize?: number;
  glarePosition?: "top" | "center";
  glareColor?: string;
  shadow?: boolean;
  shadowColor?: string;
  rotateReset?: boolean;
  onEnter?: () => void;
  onLeave?: () => void;
}) => {
  const {
    amount = 20,
    disabled = false,
    perspective = 1000,
    springConfig = { stiffness: 300, damping: 30 },
    scale = 1.02,
    glare = true,
    glareSize = 0.6,
    glarePosition = "top",
    glareColor = "rgba(255, 255, 255, 0.25)",
    shadow = true,
    shadowColor = "rgba(0, 0, 0, 0.35)",
    rotateReset = true,
    onEnter,
    onLeave,
  } = options;

  // Motion values for rotation and position
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const posX = useMotionValue(0);
  const posY = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);

  // Spring animations for smoother transitions
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);
  const springPosX = useSpring(posX, {
    ...springConfig,
    damping: springConfig.damping * 1.2,
  });
  const springPosY = useSpring(posY, {
    ...springConfig,
    damping: springConfig.damping * 1.2,
  });

  // Handle mouse movement
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (disabled) return;

      const element = e.currentTarget;
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;

      // Calculate new rotation values based on mouse position
      const newRotateY = (mouseX / (rect.width / 2)) * amount;
      const newRotateX = -(mouseY / (rect.height / 2)) * amount;

      // Update position values for more advanced 3D effects
      const newPosX = (mouseX / rect.width) * 5;
      const newPosY = (mouseY / rect.height) * 5;

      // Set new values
      rotateX.set(newRotateX);
      rotateY.set(newRotateY);
      posX.set(newPosX);
      posY.set(newPosY);
    },
    [disabled, amount, rotateX, rotateY, posX, posY]
  );

  // Reset on mouse leave
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);

    if (rotateReset) {
      rotateX.set(0);
      rotateY.set(0);
    }

    posX.set(0);
    posY.set(0);

    onLeave?.();
  }, [rotateReset, rotateX, rotateY, posX, posY, onLeave]);

  // Handle mouse enter
  const handleMouseEnter = useCallback(() => {
    if (!disabled) {
      setIsHovered(true);
      onEnter?.();
    }
  }, [disabled, onEnter]);

  // Handle mobile detection and disable effect if needed
  useEffect(() => {
    const checkMobile = () => {
      if (
        disabled ||
        (typeof window !== "undefined" && window.innerWidth < 768)
      ) {
        rotateX.set(0);
        rotateY.set(0);
        posX.set(0);
        posY.set(0);
      }
    };

    checkMobile();
    if (window) (window as Window).addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, [disabled, rotateX, rotateY, posX, posY]);

  // Calculate glare position
  const glareTransform = useTransform(
    [springRotateX, springRotateY],
    (latest: number[]) => {
      const [rX, rY] = latest;
      if (glarePosition === "top") {
        return `rotate(${rY * 0.5}deg) translate(${-rY * 5}%, ${-rX * 5}%)`;
      }
      return `rotate(${rY * 0.5}deg)`;
    }
  );

  // Calculate shadow for 3D effect
  const shadowTransform = useTransform(
    [springRotateX, springRotateY],
    (latest: number[]) => {
      const [rX, rY] = latest;
      const distance = Math.sqrt(rX * rX + rY * rY) * 0.3;
      return `0 ${distance}px ${distance * 3}px ${shadowColor}`;
    }
  );

  return {
    rotateX: springRotateX,
    rotateY: springRotateY,
    posX: springPosX,
    posY: springPosY,
    isHovered,
    transformStyle: "preserve-3d",
    perspective: `${perspective}px`,
    scale: isHovered && !disabled ? scale : 1,
    glareStyle:
      glare && isHovered && !disabled
        ? {
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: `${glareSize * 200}%`,
            pointerEvents: "none",
            transform: glareTransform,
            background: `linear-gradient(0deg, transparent, ${glareColor})`,
            opacity: 0.6,
            borderRadius: "inherit",
            mixBlendMode: "overlay",
          }
        : {},
    shadowStyle:
      shadow && isHovered && !disabled
        ? {
            boxShadow: shadowTransform,
          }
        : {},
    handlers: {
      onMouseMove: handleMouseMove,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
    },
  };
};
