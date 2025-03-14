"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  type FC,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { twMerge } from "tailwind-merge";

export const HoverCard: FC<{
  children: ReactNode;
  hoverContent: ReactNode;
  className?: string;
  hoverContentClassName?: string;
  triggerClassName?: string;
  openDelay?: number;
  closeDelay?: number;
  position?: "top" | "bottom" | "left" | "right";
  offset?: number;
  arrow?: boolean;
  arrowSize?: number;
  arrowClassName?: string;
  interactive?: boolean;
  hideOnClick?: boolean;
  animation?: "fade" | "scale" | "slide";
  animationDuration?: number;
  glassmorphism?: boolean;
  backdropBlur?: boolean;
  shadow?: boolean;
  disabled?: boolean;
  width?: string | number;
  onOpen?: () => void;
  onClose?: () => void;
}> = ({
  children,
  hoverContent,
  className = "",
  hoverContentClassName = "",
  triggerClassName = "",
  openDelay = 200,
  closeDelay = 300,
  position = "top",
  offset = 10,
  arrow = true,
  arrowSize = 8,
  arrowClassName = "",
  interactive = true,
  hideOnClick = false,
  animation = "fade",
  animationDuration = 0.2,
  glassmorphism = false,
  backdropBlur = false,
  shadow = true,
  disabled = false,
  width = "auto",
  onOpen,
  onClose,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate coordinates based on position
  const calculateCoords = useCallback(() => {
    if (!triggerRef.current || !contentRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const contentRect = contentRef.current.getBoundingClientRect();

    let top = 0;
    let left = 0;

    switch (position) {
      case "bottom":
        top = triggerRect.bottom + offset;
        left = triggerRect.left + triggerRect.width / 2 - contentRect.width / 2;
        break;
      case "left":
        top = triggerRect.top + triggerRect.height / 2 - contentRect.height / 2;
        left = triggerRect.left - contentRect.width - offset;
        break;
      case "right":
        top = triggerRect.top + triggerRect.height / 2 - contentRect.height / 2;
        left = triggerRect.right + offset;
        break;
      default:
        top = triggerRect.top - contentRect.height - offset;
        left = triggerRect.left + triggerRect.width / 2 - contentRect.width / 2;
    }

    // Apply boundary checking
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    if (left < 10) left = 10;
    if (left + contentRect.width > windowWidth - 10) {
      left = windowWidth - contentRect.width - 10;
    }

    if (top < 10) top = 10;
    if (top + contentRect.height > windowHeight - 10) {
      top = windowHeight - contentRect.height - 10;
    }

    setCoords({ top, left });
  }, [position, offset]);

  // Handle mouse enter
  const handleMouseEnter = () => {
    if (disabled) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setIsOpen(true);
      onOpen?.();

      // Add small delay to ensure content is rendered before calculating coords
      setTimeout(calculateCoords, 10);
    }, openDelay);
  };

  // Handle mouse leave
  const handleMouseLeave = () => {
    if (disabled) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
      onClose?.();
    }, closeDelay);
  };

  // Handle content hover
  const handleContentMouseEnter = () => {
    if (!interactive || disabled) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  // Handle content hover leave
  const handleContentMouseLeave = () => {
    if (!interactive || disabled) return;

    handleMouseLeave();
  };

  // Handle click
  const handleClick = () => {
    if (hideOnClick && isOpen) {
      setIsOpen(false);
      onClose?.();
    }
  };

  // Handle window resize
  useEffect(() => {
    if (isOpen) {
      const handleResize = () => calculateCoords();
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [isOpen, calculateCoords]); // Add calculateCoords

  // Handle scroll
  useEffect(() => {
    if (isOpen) {
      const handleScroll = () => calculateCoords();
      window.addEventListener("scroll", handleScroll, true);

      return () => {
        window.removeEventListener("scroll", handleScroll, true);
      };
    }
  }, [isOpen, calculateCoords]);

  // Clean up timeouts
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Animation variants
  const getAnimationVariants = () => {
    switch (animation) {
      case "scale":
        return {
          hidden: { opacity: 0, scale: 0.9 },
          visible: { opacity: 1, scale: 1 },
        };
      case "slide":
        return {
          hidden: {
            opacity: 0,
            y: position === "bottom" ? -10 : position === "top" ? 10 : 0,
            x: position === "left" ? 10 : position === "right" ? -10 : 0,
          },
          visible: { opacity: 1, y: 0, x: 0 },
        };
      default:
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        };
    }
  };

  // Style for content
  const getContentStyle = () => {
    const baseStyle = {
      position: "fixed",
      top: `${coords.top}px`,
      left: `${coords.left}px`,
      zIndex: 50,
      width: typeof width === "number" ? `${width}px` : width,
    } as const;

    return baseStyle;
  };

  // Style for arrow
  const getArrowStyle = () => {
    const baseStyle = {
      position: "absolute",
      width: 0,
      height: 0,
      border: `${arrowSize}px solid transparent`,
    } as const;

    switch (position) {
      case "bottom":
        return {
          ...baseStyle,
          top: -arrowSize * 2,
          left: "50%",
          transform: "translateX(-50%)",
          borderBottomColor: glassmorphism
            ? "rgba(255, 255, 255, 0.1)"
            : "rgb(30, 41, 59)",
        };
      case "left":
        return {
          ...baseStyle,
          top: "50%",
          right: -arrowSize * 2,
          transform: "translateY(-50%)",
          borderLeftColor: glassmorphism
            ? "rgba(255, 255, 255, 0.1)"
            : "rgb(30, 41, 59)",
        };
      case "right":
        return {
          ...baseStyle,
          top: "50%",
          left: -arrowSize * 2,
          transform: "translateY(-50%)",
          borderRightColor: glassmorphism
            ? "rgba(255, 255, 255, 0.1)"
            : "rgb(30, 41, 59)",
        };
      default:
        return {
          ...baseStyle,
          bottom: -arrowSize * 2,
          left: "50%",
          transform: "translateX(-50%)",
          borderTopColor: glassmorphism
            ? "rgba(255, 255, 255, 0.1)"
            : "rgb(30, 41, 59)",
        };
    }
  };

  // Content class names
  const contentClassNames = twMerge(
    "rounded-lg p-4",
    glassmorphism
      ? "bg-white/10 backdrop-blur-md border border-white/20"
      : "bg-slate-800 border border-slate-700",
    backdropBlur && "backdrop-blur-md",
    shadow && "shadow-xl",
    hoverContentClassName
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Trigger click handler when user presses Enter or Space
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div className={twMerge("relative inline-block", className)}>
      {/* Trigger */}
      <div
        ref={triggerRef}
        className={triggerClassName}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        onKeyDown={handleKeyDown} // Add keyboard support
        tabIndex={disabled ? -1 : 0} // Make element focusable
        aria-expanded={isOpen} // Indicate current state
      >
        {children}
      </div>

      {/* Hover content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={contentRef}
            style={getContentStyle()}
            variants={getAnimationVariants()}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: animationDuration }}
            className={contentClassNames}
            onMouseEnter={handleContentMouseEnter}
            onMouseLeave={handleContentMouseLeave}
          >
            {arrow && (
              <div
                className={twMerge("pointer-events-none", arrowClassName)}
                style={getArrowStyle()}
              />
            )}
            {hoverContent}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
