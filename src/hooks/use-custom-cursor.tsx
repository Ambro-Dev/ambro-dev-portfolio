import { useEffect, useRef } from "react";
import { useIsMobile } from "@/hooks/use-is-mobile";
import type { CSSProperties } from "react";

export const useCustomCursor = (options: {
  variant?: "dot" | "ring" | "spotlight" | "inverse";
  size?: number;
  color?: string;
  mixBlendMode?:
    | "normal"
    | "multiply"
    | "screen"
    | "overlay"
    | "darken"
    | "lighten"
    | "color-dodge"
    | "color-burn"
    | "hard-light"
    | "soft-light"
    | "difference"
    | "exclusion"
    | "hue"
    | "saturation"
    | "color"
    | "luminosity";
  transitionSpeed?: number;
  innerSize?: number;
  innerColor?: string;
  delay?: number;
  disabled?: boolean;
}) => {
  const {
    variant = "dot",
    size = 40,
    color = "rgba(255, 255, 255, 0.7)",
    mixBlendMode = "difference", // Now properly typed
    transitionSpeed = 0.3,
    innerSize = 8,
    innerColor = "#fff",
    delay = 0.01,
    disabled = false,
  } = options;

  const cursorRef = useRef<HTMLDivElement>(null);
  const innerCursorRef = useRef<HTMLDivElement>(null);
  const mousePosition = useRef({ x: 0, y: 0 });
  const prevPosition = useRef({ x: 0, y: 0 });
  const isMobile = useIsMobile();

  useEffect(() => {
    if (disabled || isMobile || typeof window === "undefined") return;

    // Show custom cursor, hide native cursor
    if (document.body) {
      document.body.style.cursor = "none";
    }

    const updateCursorPosition = (e: MouseEvent) => {
      mousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const animateCursor = () => {
      if (!cursorRef.current || !innerCursorRef.current) return;

      // Smooth transition for main cursor with configurable delay
      const diffX = mousePosition.current.x - prevPosition.current.x;
      const diffY = mousePosition.current.y - prevPosition.current.y;

      prevPosition.current.x += diffX * (1 - delay);
      prevPosition.current.y += diffY * (1 - delay);

      cursorRef.current.style.left = `${prevPosition.current.x}px`;
      cursorRef.current.style.top = `${prevPosition.current.y}px`;

      // Inner cursor follows directly
      innerCursorRef.current.style.left = `${mousePosition.current.x}px`;
      innerCursorRef.current.style.top = `${mousePosition.current.y}px`;

      requestAnimationFrame(animateCursor);
    };

    if (window)
      (window as Window).addEventListener("mousemove", updateCursorPosition);
    const animationId = requestAnimationFrame(animateCursor);

    return () => {
      if (document.body) {
        document.body.style.cursor = "auto";
      }
      window.removeEventListener("mousemove", updateCursorPosition);
      cancelAnimationFrame(animationId);
    };
  }, [disabled, isMobile, delay]);

  // Setup variant-specific styles
  const getCursorStyles = (): {
    outer: CSSProperties;
    inner: CSSProperties;
  } => {
    const baseStyles: CSSProperties = {
      position: "fixed",
      pointerEvents: "none",
      zIndex: 9999,
      mixBlendMode: mixBlendMode as CSSProperties["mixBlendMode"],
      transition: `transform ${transitionSpeed}s ease, opacity ${transitionSpeed}s ease, 
            width ${transitionSpeed}s ease, height ${transitionSpeed}s ease, 
            background ${transitionSpeed}s ease`,
    };

    switch (variant) {
      case "ring":
        return {
          outer: {
            ...baseStyles,
            width: size,
            height: size,
            borderRadius: "50%",
            border: `2px solid ${color}`,
            backgroundColor: "transparent",
            transform: "translate(-50%, -50%)",
          },
          inner: {
            ...baseStyles,
            width: innerSize,
            height: innerSize,
            borderRadius: "50%",
            backgroundColor: innerColor,
            transform: "translate(-50%, -50%)",
          },
        };
      case "spotlight":
        return {
          outer: {
            ...baseStyles,
            width: size * 2,
            height: size * 2,
            borderRadius: "50%",
            backgroundColor: color,
            filter: "blur(50px)",
            opacity: 0.4,
            transform: "translate(-50%, -50%)",
          },
          inner: {
            ...baseStyles,
            width: innerSize,
            height: innerSize,
            borderRadius: "50%",
            backgroundColor: innerColor,
            transform: "translate(-50%, -50%)",
          },
        };
      case "inverse":
        return {
          outer: {
            ...baseStyles,
            width: size,
            height: size,
            borderRadius: "50%",
            backgroundColor: "transparent",
            boxShadow: `0 0 0 9999px ${color}`,
            mixBlendMode: "normal" as React.CSSProperties["mixBlendMode"],
            transform: "translate(-50%, -50%)",
          },
          inner: {
            ...baseStyles,
            display: "none",
          },
        };
      default:
        return {
          outer: {
            ...baseStyles,
            width: size,
            height: size,
            borderRadius: "50%",
            backgroundColor: color,
            opacity: 0.3,
            transform: "translate(-50%, -50%)",
          },
          inner: {
            ...baseStyles,
            width: innerSize,
            height: innerSize,
            borderRadius: "50%",
            backgroundColor: innerColor,
            transform: "translate(-50%, -50%)",
          },
        };
    }
  };

  const cursorStyles = getCursorStyles();

  const CursorComponent = () => {
    if (disabled || isMobile) return null;

    return (
      <>
        <div ref={cursorRef} style={cursorStyles.outer} />
        {variant !== "inverse" && (
          <div ref={innerCursorRef} style={cursorStyles.inner} />
        )}
      </>
    );
  };

  // Modify element events to show/hide cursor or change its appearance
  const generateListeners = (options?: {
    grow?: boolean;
    scale?: number;
    color?: string;
    hide?: boolean;
  }) => {
    if (disabled || isMobile) return {};

    const { grow = false, scale = 1.5, color, hide = false } = options || {};

    return {
      onMouseEnter: () => {
        if (!cursorRef.current) return;

        if (hide) {
          cursorRef.current.style.opacity = "0";
          if (innerCursorRef.current) {
            innerCursorRef.current.style.opacity = "0";
          }
          return;
        }

        if (grow) {
          cursorRef.current.style.transform = `translate(-50%, -50%) scale(${scale})`;
        }

        if (color) {
          cursorRef.current.style.backgroundColor =
            variant === "ring" ? "transparent" : color;
          cursorRef.current.style.borderColor = variant === "ring" ? color : "";
        }
      },
      onMouseLeave: () => {
        if (!cursorRef.current) return;

        cursorRef.current.style.opacity = "1";
        cursorRef.current.style.transform = "translate(-50%, -50%) scale(1)";
        cursorRef.current.style.backgroundColor =
          variant === "ring"
            ? "transparent"
            : (cursorStyles.outer.backgroundColor as string);
        cursorRef.current.style.borderColor =
          variant === "ring" ? (cursorStyles.outer.border as string) : "";

        if (innerCursorRef.current) {
          innerCursorRef.current.style.opacity = "1";
        }
      },
    };
  };

  return {
    CursorComponent,
    cursorRef,
    innerCursorRef,
    generateListeners,
  };
};
