"use client";

import type React from "react";
import { type ReactNode, useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionTemplate,
  useMotionValue,
  AnimatePresence,
  type HTMLMotionProps,
} from "framer-motion";
import { useInView } from "react-intersection-observer";
import { twMerge } from "tailwind-merge";

// ===== Custom Hooks =====

/**
 * Hook for creating tilt effect on elements
 */
export const useTilt = (options: {
  amount?: number;
  disabled?: boolean;
  springConfig?: { stiffness: number; damping: number };
}) => {
  const {
    amount = 20,
    disabled = false,
    springConfig = { stiffness: 300, damping: 30 },
  } = options;

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);

  // Spring animations for smoother transitions
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);

  // Handle mouse movement
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;

    const element = e.currentTarget;
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    const newRotateY = (mouseX / (rect.width / 2)) * amount;
    const newRotateX = -(mouseY / (rect.height / 2)) * amount;

    rotateX.set(newRotateX);
    rotateY.set(newRotateY);
  };

  // Reset on mouse leave
  const handleMouseLeave = () => {
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
  };

  // Handle mobile detection
  useEffect(() => {
    if (
      disabled ||
      (typeof window !== "undefined" && window.innerWidth < 768)
    ) {
      rotateX.set(0);
      rotateY.set(0);
    }
  }, [disabled, rotateX, rotateY]);

  return {
    rotateX: springRotateX,
    rotateY: springRotateY,
    isHovered,
    handlers: {
      onMouseMove: handleMouseMove,
      onMouseEnter: () => !disabled && setIsHovered(true),
      onMouseLeave: handleMouseLeave,
    },
  };
};

/**
 * Hook for detecting mobile devices
 */
export const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Check on mount and add listener for resize
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, [breakpoint]);

  return isMobile;
};

// ===== UI Components =====

/**
 * Enhanced animated section with fade-in and slide-up effect
 */
export const AnimatedSection: React.FC<{
  children: ReactNode;
  className?: string;
  delay?: number;
  threshold?: number;
  as?: React.ComponentType<HTMLMotionProps<"div">>;
}> = ({
  children,
  className = "",
  delay = 0,
  threshold = 0.1,
  as: Component = motion.div,
}) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold,
  });

  return (
    <Component
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.215, 0.61, 0.355, 1],
      }}
      className={className}
    >
      {children}
    </Component>
  );
};

/**
 * Text with gradient animation
 */
export const GradientText: React.FC<{
  children: ReactNode;
  className?: string;
  from?: string;
  via?: string;
  to?: string;
}> = ({
  children,
  className = "",
  from = "blue-600",
  via = "purple-600",
  to = "pink-600",
}) => {
  const gradientClasses = `bg-gradient-to-r from-${from} via-${via} to-${to} bg-clip-text text-transparent inline-block`;

  return (
    <motion.span
      className={twMerge(gradientClasses, className)}
      animate={{
        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
      }}
      transition={{
        duration: 15,
        repeat: Number.POSITIVE_INFINITY,
        ease: "linear",
      }}
    >
      {children}
    </motion.span>
  );
};

/**
 * Enhanced card component with 3D tilt effect
 */
export const TiltCard: React.FC<{
  children: ReactNode;
  className?: string;
  tiltAmount?: number;
  glareOpacity?: number;
  disabled?: boolean;
}> = ({
  children,
  className = "",
  tiltAmount = 20,
  glareOpacity = 0.2,
  disabled = false,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { rotateX, rotateY, isHovered, handlers } = useTilt({
    amount: tiltAmount,
    disabled,
  });

  // Transform for the glare effect
  const rotateYDegrees = useTransform(
    rotateY,
    [-tiltAmount, tiltAmount],
    ["-60deg", "60deg"]
  );

  const glareBackground = useMotionTemplate`linear-gradient(
    ${rotateYDegrees},
    rgba(255, 255, 255, ${glareOpacity}) 0%,
    rgba(255, 255, 255, 0) 80%
  )`;

  const isMobile = useIsMobile();
  if (isMobile) disabled = true;

  return (
    <motion.div
      ref={cardRef}
      className={twMerge("perspective-1000", className)}
      style={{
        transformStyle: "preserve-3d",
      }}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      {...handlers}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
      >
        {children}

        {/* Glare effect - only rendered when hovered */}
        <AnimatePresence>
          {isHovered && !disabled && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 rounded-lg pointer-events-none"
              style={{
                background: glareBackground,
                transformStyle: "preserve-3d",
              }}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

/**
 * Scroll progress indicator
 */
export const ScrollProgress: React.FC<{
  color?: string;
  height?: number;
  zIndex?: number;
}> = ({
  color = "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500",
  height = 2,
  zIndex = 50,
}) => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className={`fixed top-0 left-0 right-0 ${color}`}
      style={{
        scaleX,
        height,
        zIndex,
        transformOrigin: "left",
      }}
    />
  );
};

/**
 * Enhanced text reveal animation
 */
export const RevealText: React.FC<{
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  threshold?: number;
}> = ({
  children,
  className = "",
  delay = 0,
  direction = "up",
  threshold = 0.1,
}) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold,
  });

  // Define initial and target values based on direction
  const getInitialAndTargetValue = () => {
    switch (direction) {
      case "down":
        return { initial: -20, target: 0 };
      case "left":
        return { initial: 20, target: 0, axis: "x" };
      case "right":
        return { initial: -20, target: 0, axis: "x" };
      default:
        return { initial: 20, target: 0 };
    }
  };

  const { initial, target, axis = "y" } = getInitialAndTargetValue();

  const initialStyles = {
    opacity: 0,
    [axis]: initial,
  };

  const targetStyles = {
    opacity: 1,
    [axis]: target,
  };

  return (
    <motion.div
      ref={ref}
      className={twMerge("overflow-hidden", className)}
      initial={initialStyles}
      animate={inView ? targetStyles : initialStyles}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.215, 0.61, 0.355, 1],
      }}
    >
      {children}
    </motion.div>
  );
};

/**
 * Enhanced button with hover and click effects
 */
export const EnhancedButton: React.FC<{
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  disabled?: boolean;
  ariaLabel?: string;
  href?: string;
  type?: "button" | "submit" | "reset";
}> = ({
  children,
  className = "",
  onClick,
  variant = "primary",
  disabled = false,
  ariaLabel,
  href,
  type = "button",
}) => {
  // Variant styling
  const getVariantClasses = () => {
    switch (variant) {
      case "primary":
        return "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md";
      case "secondary":
        return "bg-gray-800 hover:bg-gray-700 text-white shadow-sm";
      case "outline":
        return "bg-transparent border border-gray-700 hover:bg-gray-800/30 text-white backdrop-blur-sm";
      case "ghost":
        return "bg-transparent hover:bg-gray-800/30 text-white";
      default:
        return "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md";
    }
  };

  const baseClasses = twMerge(
    "px-6 py-3 rounded-lg font-medium transition-all",
    getVariantClasses(),
    disabled && "opacity-50 cursor-not-allowed pointer-events-none",
    className
  );

  const motionProps = {
    whileHover: disabled ? {} : { scale: 1.03 },
    whileTap: disabled ? {} : { scale: 0.97 },
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 15,
    },
  };

  // Render as link or button
  if (href) {
    return (
      <motion.a
        href={href}
        className={baseClasses}
        aria-label={ariaLabel}
        {...motionProps}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      className={baseClasses}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      {...motionProps}
    >
      {children}
    </motion.button>
  );
};

/**
 * Text with highlight effect
 */
export const HighlightText: React.FC<{
  children: ReactNode;
  color?: string;
  delay?: number;
  className?: string;
}> = ({ children, color = "bg-blue-500/10", delay = 0, className = "" }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.span
      ref={ref}
      className={twMerge("relative inline-block", className)}
    >
      <span className="relative z-10">{children}</span>
      <motion.span
        className={`absolute bottom-0 left-0 right-0 h-[30%] ${color} rounded-sm -z-0`}
        initial={{ width: 0 }}
        animate={inView ? { width: "100%" } : {}}
        transition={{ duration: 0.6, delay, ease: "easeOut" }}
      />
    </motion.span>
  );
};

/**
 * Enhanced section divider with modern design
 */
export const SectionDivider: React.FC<{
  className?: string;
  dotColor?: string;
  lineColor?: string;
  dotSize?: number;
}> = ({
  className = "",
  dotColor = "bg-blue-500",
  lineColor = "from-transparent via-gray-700 to-transparent",
  dotSize = 3,
}) => {
  return (
    <div className={twMerge("relative h-24", className)}>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`w-full h-px bg-gradient-to-r ${lineColor}`} />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-gray-900 px-4 py-2 rounded-full">
          <motion.div
            className={`w-${dotSize} h-${dotSize} ${dotColor} rounded-full`}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        </div>
      </div>
    </div>
  );
};

/**
 * Smooth scroll component
 */
export const SmoothScroll: React.FC<{
  children: ReactNode;
  offset?: number;
}> = ({ children, offset = 80 }) => {
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) return;

    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]');

      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      e.preventDefault();
      const element = document.querySelector(href);
      if (!element) return;

      window.scrollTo({
        top: element.getBoundingClientRect().top + window.pageYOffset - offset,
        behavior: "smooth",
      });
    };

    document.addEventListener("click", handleAnchorClick);
    return () => {
      document.removeEventListener("click", handleAnchorClick);
    };
  }, [offset]);

  return <>{children}</>;
};

/**
 * Animated gradient border component
 */
export const AnimatedGradientBorder: React.FC<{
  children: ReactNode;
  className?: string;
  borderColor?: string;
  borderWidth?: number;
  rounded?: string;
  glowEffect?: boolean;
}> = ({
  children,
  className = "",
  borderColor = "from-blue-500 via-purple-500 to-pink-500",
  borderWidth = 2,
  rounded = "rounded-lg",
  glowEffect = true,
}) => {
  return (
    <div className={twMerge("relative p-[3px]", rounded, className)}>
      <div
        className="absolute inset-0 bg-gradient-to-r animate-gradient-slow rounded-[inherit]"
        style={{
          backgroundSize: "200% 100%",
          padding: borderWidth,
        }}
      >
        <div
          className={`absolute inset-0 ${borderColor} rounded-[inherit] ${
            glowEffect ? "blur-sm opacity-50" : ""
          }`}
        />
      </div>
      <div className="relative bg-gray-900 h-full w-full rounded-[inherit] overflow-hidden">
        {children}
      </div>

      {/* Style for gradient animation */}
      <style jsx global>{`
        @keyframes gradientSlow {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient-slow {
          animation: gradientSlow 8s ease infinite;
        }
      `}</style>
    </div>
  );
};
