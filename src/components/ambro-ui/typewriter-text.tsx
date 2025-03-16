"use client";

import {
  type FC,
  useEffect,
  useRef,
  useState,
  type HTMLElementType,
  useMemo,
  useCallback,
  memo,
} from "react";
import { twMerge } from "tailwind-merge";

export interface TypewriterTextProps {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
  cursor?: boolean;
  cursorChar?: string;
  cursorColor?: string;
  cursorBlink?: boolean;
  onComplete?: () => void;
  showWhenDone?: boolean;
  loop?: boolean;
  loopDelay?: number;
  deleteSpeed?: number;
  tag?: HTMLElementType;
  pauseOnHover?: boolean;
  ariaLabel?: string;
  reducedMotion?: boolean;
}

export const TypewriterText: FC<TypewriterTextProps> = memo(
  ({
    text,
    className = "",
    speed = 50,
    delay = 0,
    cursor = true,
    cursorChar = "|",
    cursorColor = "text-indigo-500",
    cursorBlink = true,
    onComplete,
    showWhenDone = true,
    loop = false,
    loopDelay = 1500,
    deleteSpeed = 30,
    tag: Component = "span",
    pauseOnHover = false,
    ariaLabel,
    reducedMotion = false,
  }) => {
    const [displayText, setDisplayText] = useState("");
    const [cursorVisible, setCursorVisible] = useState(true);
    const [isComplete, setIsComplete] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const frameRef = useRef<number | null>(null);
    const textRef = useRef<string>(text); // To avoid text closure issues
    const batchUpdateRef = useRef<string[]>([]);
    const rafTimingRef = useRef<number>(0);
    const prefersReducedMotionRef = useRef<boolean>(false);

    // Update text ref when prop changes
    useEffect(() => {
      textRef.current = text;
    }, [text]);

    // Check for reduced motion preference
    useEffect(() => {
      if (typeof window !== "undefined") {
        const mediaQuery = window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        );
        prefersReducedMotionRef.current = mediaQuery.matches || reducedMotion;

        const handleChange = (e: MediaQueryListEvent) => {
          prefersReducedMotionRef.current = e.matches || reducedMotion;

          if (e.matches || reducedMotion) {
            // If user prefers reduced motion, show the full text immediately
            setDisplayText(textRef.current);
            setIsComplete(true);
            onComplete?.();
          }
        };

        mediaQuery.addEventListener("change", handleChange);

        // Apply reduced motion preference immediately
        if (prefersReducedMotionRef.current) {
          setDisplayText(textRef.current);
          setIsComplete(true);
          onComplete?.();
        }

        return () => {
          mediaQuery.removeEventListener("change", handleChange);
        };
      }
    }, [onComplete, reducedMotion]);

    // Batched state updates function
    const processBatchedUpdates = useCallback(() => {
      if (batchUpdateRef.current.length === 0) return;

      // Get the latest text
      const latestText =
        batchUpdateRef.current[batchUpdateRef.current.length - 1];
      batchUpdateRef.current = [];

      // Update the state once
      setDisplayText(latestText);
    }, []);

    // Optimized type effect using requestAnimationFrame
    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
      // Skip animation if reduced motion is preferred
      if (prefersReducedMotionRef.current) {
        setDisplayText(textRef.current);
        setIsComplete(true);
        onComplete?.();
        return;
      }

      // Handle pause if needed
      if (isPaused) return;

      // Use requestAnimationFrame for smoother animations
      const animationLoop = (timestamp: number) => {
        // Throttle updates to match desired speed
        if (timeoutRef.current) return;

        // Use consistent timing
        if (!rafTimingRef.current) {
          rafTimingRef.current = timestamp;
        }

        const elapsed = timestamp - rafTimingRef.current;
        const targetSpeed = isDeleting ? deleteSpeed : speed;

        if (elapsed < targetSpeed) {
          frameRef.current = requestAnimationFrame(animationLoop);
          return;
        }

        // Reset timing reference
        rafTimingRef.current = timestamp;

        // Initial delay
        const startTyping = () => {
          if (isDeleting) {
            // Delete characters
            if (displayText.length > 0) {
              // Add to batch for processing
              batchUpdateRef.current.push(displayText.slice(0, -1));

              // Schedule next frame
              frameRef.current = requestAnimationFrame(animationLoop);
            } else {
              // Start typing again after delay
              setIsDeleting(false);
              timeoutRef.current = setTimeout(() => {
                timeoutRef.current = null;
                frameRef.current = requestAnimationFrame(animationLoop);
              }, loopDelay);
            }
          } else {
            // Type characters
            if (displayText.length < textRef.current.length) {
              // Add to batch for processing
              batchUpdateRef.current.push(
                displayText + textRef.current.charAt(displayText.length)
              );

              // Schedule next frame
              frameRef.current = requestAnimationFrame(animationLoop);
            } else {
              // Handle completion
              setIsComplete(true);
              onComplete?.();

              if (loop) {
                // Wait before deleting
                timeoutRef.current = setTimeout(() => {
                  timeoutRef.current = null;
                  setIsDeleting(true);
                  frameRef.current = requestAnimationFrame(animationLoop);
                }, loopDelay);
              }
            }
          }
        };

        // Process any pending updates
        processBatchedUpdates();

        // Handle typing
        startTyping();
      };

      // Start the animation
      if (delay > 0 && displayText.length === 0 && !isDeleting) {
        // Initial delay if needed
        timeoutRef.current = setTimeout(() => {
          timeoutRef.current = null;
          frameRef.current = requestAnimationFrame(animationLoop);
        }, delay);
      } else {
        frameRef.current = requestAnimationFrame(animationLoop);
      }

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        if (frameRef.current) {
          cancelAnimationFrame(frameRef.current);
          frameRef.current = null;
        }
      };
    }, [
      displayText,
      speed,
      delay,
      onComplete,
      loop,
      loopDelay,
      deleteSpeed,
      isDeleting,
      isPaused,
      processBatchedUpdates,
      reducedMotion,
    ]);

    // Cursor blinking effect
    useEffect(() => {
      if (!cursor || !cursorBlink) return;

      const blinkInterval = setInterval(() => {
        setCursorVisible((prev) => !prev);
      }, 500);

      return () => {
        clearInterval(blinkInterval);
      };
    }, [cursor, cursorBlink]);

    // Memoized pause handlers
    const handleMouseEnter = useCallback(() => {
      if (pauseOnHover) setIsPaused(true);
    }, [pauseOnHover]);

    const handleMouseLeave = useCallback(() => {
      if (pauseOnHover) setIsPaused(false);
    }, [pauseOnHover]);

    // Memoized cursor styles
    const cursorStyles = useMemo(
      () => ({
        opacity: cursorVisible ? 1 : 0,
        transition: "opacity 0.1s",
      }),
      [cursorVisible]
    );

    // Memoized cursor classes
    const cursorClasses = useMemo(
      () =>
        twMerge(
          "inline-block",
          cursorColor,
          cursorBlink && "animate-cursor-blink"
        ),
      [cursorColor, cursorBlink]
    );

    return (
      <Component
        className={className}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-label={ariaLabel || text}
        data-testid="typewriter-text"
      >
        {displayText}
        {cursor && (showWhenDone || !isComplete) && (
          <span
            className={cursorClasses}
            style={cursorStyles}
            aria-hidden="true"
            data-testid="typewriter-cursor"
          >
            {cursorChar}
          </span>
        )}

        {/* Animation style for cursor */}
        <style jsx global>{`
          @keyframes cursorBlink {
            0%,
            49% {
              opacity: 1;
            }
            50%,
            100% {
              opacity: 0;
            }
          }

          .animate-cursor-blink {
            animation: cursorBlink 1s infinite;
          }
        `}</style>
      </Component>
    );
  }
);

// Add display name for debugging
TypewriterText.displayName = "TypewriterText";

export default TypewriterText;
