"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  type FC,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
  memo,
} from "react";
import { twMerge } from "tailwind-merge";

export interface HoverCardProps {
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
}

// Extract animation variants outside component to prevent recreation
const createAnimationVariants = (animation: string, position: string) => {
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

export const HoverCard: FC<HoverCardProps> = memo(
  ({
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
    const observerRef = useRef<ResizeObserver | null>(null);

    // Memoize animation variants
    const animationVariants = useMemo(
      () => createAnimationVariants(animation, position),
      [animation, position]
    );

    // Calculate coordinates based on position with throttling
    const calculateCoords = useCallback(() => {
      if (!triggerRef.current || !contentRef.current) return;

      // Use requestAnimationFrame for better performance
      requestAnimationFrame(() => {
        if (!triggerRef.current || !contentRef.current) return;

        const triggerRect = triggerRef.current.getBoundingClientRect();
        const contentRect = contentRef.current.getBoundingClientRect();

        let top = 0;
        let left = 0;

        switch (position) {
          case "bottom":
            top = triggerRect.bottom + offset;
            left =
              triggerRect.left + triggerRect.width / 2 - contentRect.width / 2;
            break;
          case "left":
            top =
              triggerRect.top + triggerRect.height / 2 - contentRect.height / 2;
            left = triggerRect.left - contentRect.width - offset;
            break;
          case "right":
            top =
              triggerRect.top + triggerRect.height / 2 - contentRect.height / 2;
            left = triggerRect.right + offset;
            break;
          default:
            top = triggerRect.top - contentRect.height - offset;
            left =
              triggerRect.left + triggerRect.width / 2 - contentRect.width / 2;
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
      });
    }, [position, offset]);

    // Handle mouse events with single timeout management
    const handleMouseToggle = useCallback(
      (isEntering: boolean) => {
        if (disabled) return;

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }

        timeoutRef.current = setTimeout(
          () => {
            setIsOpen(isEntering);
            if (isEntering) {
              onOpen?.();
              // Add small delay to ensure content is rendered before calculating coords
              requestAnimationFrame(calculateCoords);
            } else {
              onClose?.();
            }
          },
          isEntering ? openDelay : closeDelay
        );
      },
      [disabled, openDelay, closeDelay, onOpen, onClose, calculateCoords]
    );

    // Set up event handlers as stable references
    const handleMouseEnter = useCallback(
      () => handleMouseToggle(true),
      [handleMouseToggle]
    );
    const handleMouseLeave = useCallback(
      () => handleMouseToggle(false),
      [handleMouseToggle]
    );

    // Handle content hover specifically
    const handleContentMouseEnter = useCallback(() => {
      if (!interactive || disabled) return;

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }, [interactive, disabled]);

    // Handle click
    const handleClick = useCallback(() => {
      if (hideOnClick && isOpen) {
        setIsOpen(false);
        onClose?.();
      }
    }, [hideOnClick, isOpen, onClose]);

    // Handle keyboard navigation
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        } else if (e.key === "Escape" && isOpen) {
          setIsOpen(false);
          onClose?.();
        }
      },
      [handleClick, isOpen, onClose]
    );

    // Set up observers and event listeners
    useEffect(() => {
      // Skip if not open or if we're not in a browser environment
      if (!isOpen || typeof window === "undefined") return;

      // Use passive event listeners for better performance
      const handleResize = () => calculateCoords();
      // Explicitly type window as Window to avoid "never" type issues
      (window as Window).addEventListener("resize", handleResize, {
        passive: true,
      });

      // Use ResizeObserver instead of scroll event when possible
      if (typeof ResizeObserver !== "undefined") {
        observerRef.current = new ResizeObserver(() => {
          calculateCoords();
        });

        if (contentRef.current) {
          observerRef.current.observe(contentRef.current);
        }
        if (triggerRef.current) {
          observerRef.current.observe(triggerRef.current);
        }
      } else {
        // Fallback to scroll event with throttling
        let ticking = false;
        const handleScroll = () => {
          if (!ticking) {
            (window as Window).requestAnimationFrame(() => {
              calculateCoords();
              ticking = false;
            });
            ticking = true;
          }
        };

        (window as Window).addEventListener("scroll", handleScroll, {
          passive: true,
        });

        return () => {
          (window as Window).removeEventListener("scroll", handleScroll);
          (window as Window).removeEventListener("resize", handleResize);
        };
      }

      return () => {
        (window as Window).removeEventListener("resize", handleResize);
        if (observerRef.current) {
          observerRef.current.disconnect();
        }
      };
    }, [isOpen, calculateCoords]);

    // Clean up timeouts
    useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        if (observerRef.current) {
          observerRef.current.disconnect();
        }
      };
    }, []);

    // Memoize content style
    const contentStyle = useMemo(
      () => ({
        position: "fixed" as const,
        top: `${coords.top}px`,
        left: `${coords.left}px`,
        zIndex: 50,
        width: typeof width === "number" ? `${width}px` : width,
        willChange: "transform, opacity",
      }),
      [coords.top, coords.left, width]
    );

    // Memoize arrow style
    const arrowStyle = useMemo(() => {
      const baseStyle = {
        position: "absolute" as const,
        width: 0,
        height: 0,
        border: `${arrowSize}px solid transparent`,
      };

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
    }, [position, arrowSize, glassmorphism]);

    // Memoize content class names
    const contentClassNames = useMemo(
      () =>
        twMerge(
          "rounded-lg p-4",
          glassmorphism
            ? "bg-white/10 backdrop-blur-md border border-white/20"
            : "bg-slate-800 border border-slate-700",
          backdropBlur && "backdrop-blur-md",
          shadow && "shadow-xl",
          hoverContentClassName
        ),
      [glassmorphism, backdropBlur, shadow, hoverContentClassName]
    );

    return (
      <div className={twMerge("relative inline-block", className)}>
        {/* Trigger */}
        <div
          ref={triggerRef}
          className={triggerClassName}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          tabIndex={disabled ? -1 : 0}
          aria-expanded={isOpen}
          aria-haspopup="true"
          data-testid="hover-card-trigger"
        >
          {children}
        </div>

        {/* Hover content */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={contentRef}
              style={contentStyle}
              variants={animationVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ duration: animationDuration }}
              className={contentClassNames}
              onMouseEnter={handleContentMouseEnter}
              onMouseLeave={handleMouseLeave}
              role="tooltip"
              data-testid="hover-card-content"
            >
              {arrow && (
                <div
                  className={twMerge("pointer-events-none", arrowClassName)}
                  style={arrowStyle}
                  aria-hidden="true"
                />
              )}
              {hoverContent}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

// Add display name for better debugging
HoverCard.displayName = "HoverCard";
