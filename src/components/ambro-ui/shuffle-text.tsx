"use client";

import type React from "react";
import { useState, useEffect, useCallback, useMemo, useRef, memo } from "react";

export interface ShuffleTextProps {
  words: string[];
  className?: string;
  shuffleSpeed?: number;
  changeInterval?: number;
  highlightActive?: boolean;
  highlightClass?: string;
  fixedWidth?: boolean;
  loop?: boolean;
  prefix?: string;
  suffix?: string;
  reducedMotion?: boolean;
  role?: string;
  ariaLive?: "off" | "polite" | "assertive";
}

// Character sets for shuffle effect - moved outside component
const REGULAR_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const GLITCH_CHARS = "!@#$%^&*()_-+=<>{}[]|\\/:;\"',.?~`";

export const ShuffleText: React.FC<ShuffleTextProps> = memo(
  ({
    words = [],
    className = "",
    shuffleSpeed = 50,
    changeInterval = 3000,
    highlightActive = false,
    highlightClass = "text-indigo-500",
    fixedWidth = true,
    loop = true,
    prefix = "",
    suffix = "",
    reducedMotion = false,
    role = "text",
    ariaLive = "polite",
  }) => {
    // Ensure we have words to display
    const safeWords = useMemo(() => (words.length > 0 ? words : [""]), [words]);

    const [wordIndex, setWordIndex] = useState(0);
    const [displayText, setDisplayText] = useState(safeWords[0]);
    const [maxWidth, setMaxWidth] = useState<number>(0);
    const [isShuffling, setIsShuffling] = useState(false);

    const containerRef = useRef<HTMLSpanElement>(null);
    const resizeObserverRef = useRef<ResizeObserver | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const shuffleTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Enhanced function to randomly shuffle characters - optimized & memoized
    const shuffleChars = useCallback(
      (text: string, intensity = 1): string => {
        if (reducedMotion) return text; // Skip effects if reduced motion preferred

        let result = "";
        for (let i = 0; i < text.length; i++) {
          // Higher chance of glitch chars as intensity increases
          const useGlitchChar = Math.random() < 0.3 * intensity;
          const charSet = useGlitchChar ? GLITCH_CHARS : REGULAR_CHARS;

          // Randomly decide to use original char (more likely with lower intensity)
          const useOriginalChar = Math.random() > 0.7 * intensity;

          if (useOriginalChar && text[i] !== " ") {
            result += text[i];
          } else {
            result += charSet.charAt(
              Math.floor(Math.random() * charSet.length)
            );
          }
        }

        // Randomly add extra characters for more glitchy effect at higher intensities
        if (intensity > 0.5 && Math.random() < 0.3) {
          const extraChar = GLITCH_CHARS.charAt(
            Math.floor(Math.random() * GLITCH_CHARS.length)
          );
          const pos = Math.floor(Math.random() * result.length);
          result = result.slice(0, pos) + extraChar + result.slice(pos);
        }

        return result;
      },
      [reducedMotion]
    );

    // Calculate max width using ResizeObserver instead of DOM manipulation
    useEffect(() => {
      if (!fixedWidth || !containerRef.current) return;

      // Use ResizeObserver when available
      if ("ResizeObserver" in window) {
        // Function to measure text width efficiently
        const measureTextWidth = () => {
          if (!containerRef.current) return;

          // Use a helper canvas for text measurement (more efficient)
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          if (!context) return;

          const styles = window.getComputedStyle(containerRef.current);
          context.font = `${styles.fontWeight} ${styles.fontSize} ${styles.fontFamily}`;

          // Measure all words and find max width
          let maxWordWidth = 0;
          for (const word of safeWords) {
            const metrics = context.measureText(word);
            maxWordWidth = Math.max(maxWordWidth, metrics.width);
          }

          // Add small buffer for safer rendering
          setMaxWidth(Math.ceil(maxWordWidth + 4));
        };

        // Measure on mount and when words change
        measureTextWidth();

        // Set up observer for container style changes
        resizeObserverRef.current = new ResizeObserver(measureTextWidth);
        if (containerRef.current) {
          resizeObserverRef.current.observe(containerRef.current);
        }

        return () => {
          if (resizeObserverRef.current) {
            resizeObserverRef.current.disconnect();
          }
        };
      }
      // Fallback for browsers without ResizeObserver
      const tempDiv = document.createElement("div");
      tempDiv.style.position = "absolute";
      tempDiv.style.visibility = "hidden";
      tempDiv.style.whiteSpace = "nowrap";
      document.body.appendChild(tempDiv);

      if (containerRef.current) {
        const styles = (window as Window).getComputedStyle(
          containerRef.current
        );
        tempDiv.style.fontFamily = styles.fontFamily;
        tempDiv.style.fontSize = styles.fontSize;
        tempDiv.style.fontWeight = styles.fontWeight;

        // Find the longest word
        let maxWordWidth = 0;
        for (const word of safeWords) {
          tempDiv.innerText = word;
          const width = tempDiv.getBoundingClientRect().width;
          maxWordWidth = Math.max(maxWordWidth, width);
        }

        setMaxWidth(maxWordWidth);
      }

      document.body.removeChild(tempDiv);
    }, [safeWords, fixedWidth]);

    // Handle word change with optimized shuffle effect
    useEffect(() => {
      if (safeWords.length <= 1) return;

      // Skip animation if reduced motion is preferred
      if (reducedMotion) {
        const changeWord = () => {
          const nextIndex = (wordIndex + 1) % safeWords.length;
          if (!loop && nextIndex === 0) return;

          // Set words directly without shuffling
          setDisplayText(safeWords[nextIndex]);
          setWordIndex(nextIndex);
        };

        intervalRef.current = setInterval(changeWord, changeInterval);
        return () => {
          if (intervalRef.current) clearInterval(intervalRef.current);
        };
      }

      const changeWord = () => {
        // Determine next word index
        const nextIndex = (wordIndex + 1) % safeWords.length;

        // If not looping and reached the end, stop
        if (!loop && nextIndex === 0) return;

        const nextWord = safeWords[nextIndex];
        setIsShuffling(true);

        // Enhanced glitch effect with more shuffles and variable timing
        let shuffleCount = 0;
        const maxShuffles = 15; // Increased from 3 to 15 for longer glitch effect
        const startTime = Date.now();
        const glitchDuration = 500; // Total duration of the glitch effect in ms

        // Use requestAnimationFrame for smoother animation
        const doShuffle = () => {
          const elapsedTime = Date.now() - startTime;
          const progress = Math.min(elapsedTime / glitchDuration, 1);

          if (shuffleCount < maxShuffles && progress < 1) {
            // Calculate intensity based on time progress (peak in the middle)
            const intensity =
              progress < 0.5
                ? progress * 2 // Ramp up from 0 to 1
                : (1 - progress) * 2; // Ramp down from 1 to 0

            setDisplayText(shuffleChars(nextWord, intensity));
            shuffleCount++;

            // Variable speed - faster at the beginning and end, slower in the middle
            const nextShuffleSpeed =
              shuffleSpeed * (0.5 + Math.random() + intensity * 0.5);

            // Use requestAnimationFrame for smoother animation when possible
            if ("requestAnimationFrame" in window && shuffleCount % 3 === 0) {
              animationFrameRef.current = requestAnimationFrame(doShuffle);
            } else {
              shuffleTimerRef.current = setTimeout(doShuffle, nextShuffleSpeed);
            }
          } else {
            setDisplayText(nextWord);
            setWordIndex(nextIndex);
            setIsShuffling(false);
          }
        };

        // Start shuffling
        doShuffle();
      };

      // Set up the interval
      intervalRef.current = setInterval(changeWord, changeInterval);

      // Clean up all timers and animation frames
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (shuffleTimerRef.current) clearTimeout(shuffleTimerRef.current);
        if (animationFrameRef.current)
          cancelAnimationFrame(animationFrameRef.current);
      };
    }, [
      safeWords,
      wordIndex,
      loop,
      shuffleSpeed,
      changeInterval,
      shuffleChars,
      reducedMotion,
    ]);

    // Container style with memoization
    const containerStyle = useMemo(() => {
      if (fixedWidth && maxWidth > 0) {
        return {
          display: "inline-block",
          minWidth: `${maxWidth}px`,
        };
      }
      return undefined;
    }, [fixedWidth, maxWidth]);

    return (
      <span
        ref={containerRef}
        className={className}
        style={containerStyle}
        role={role}
        aria-live={isShuffling ? "off" : ariaLive}
        data-testid="shuffle-text"
      >
        {prefix}
        <span
          className={highlightActive ? highlightClass : ""}
          data-testid="shuffle-text-content"
        >
          {displayText}
        </span>
        {suffix}
      </span>
    );
  }
);

// Add display name for debugging
ShuffleText.displayName = "ShuffleText";

export default ShuffleText;
