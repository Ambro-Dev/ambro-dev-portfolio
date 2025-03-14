"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";

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
}

export const ShuffleText: React.FC<ShuffleTextProps> = ({
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
}) => {
  // Ensure we have words to display
  const safeWords = useMemo(() => (words.length > 0 ? words : [""]), [words]);

  const [wordIndex, setWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState(safeWords[0]);
  const [maxWidth, setMaxWidth] = useState<number>(0);
  const containerRef = React.useRef<HTMLSpanElement>(null);

  // Calculate max width for fixed width display
  useEffect(() => {
    if (fixedWidth && containerRef.current) {
      const tempDiv = document.createElement("div");
      tempDiv.style.position = "absolute";
      tempDiv.style.visibility = "hidden";
      tempDiv.style.whiteSpace = "nowrap";
      document.body.appendChild(tempDiv);

      // Get the styles of the current element
      const styles = window.getComputedStyle(containerRef.current);
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
      document.body.removeChild(tempDiv);
    }
  }, [safeWords, fixedWidth]);

  // Enhanced function to randomly shuffle characters with more glitchy effect
  const shuffleChars = useCallback((text: string, intensity = 1): string => {
    const regularChars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const glitchChars = "!@#$%^&*()_-+=<>{}[]|\\/:;\"',.?~`";

    let result = "";
    for (let i = 0; i < text.length; i++) {
      // Higher chance of glitch chars as intensity increases
      const useGlitchChar = Math.random() < 0.3 * intensity;
      const charSet = useGlitchChar ? glitchChars : regularChars;

      // Randomly decide to use original char (more likely with lower intensity)
      const useOriginalChar = Math.random() > 0.7 * intensity;

      if (useOriginalChar && text[i] !== " ") {
        result += text[i];
      } else {
        result += charSet.charAt(Math.floor(Math.random() * charSet.length));
      }
    }

    // Randomly add extra characters for more glitchy effect at higher intensities
    if (intensity > 0.5 && Math.random() < 0.3) {
      const extraChar = glitchChars.charAt(
        Math.floor(Math.random() * glitchChars.length)
      );
      const pos = Math.floor(Math.random() * result.length);
      result = result.slice(0, pos) + extraChar + result.slice(pos);
    }

    return result;
  }, []);

  // Effect to change words with an interval
  useEffect(() => {
    if (safeWords.length <= 1) return;

    const changeWord = () => {
      // Determine next word index
      const nextIndex = (wordIndex + 1) % safeWords.length;

      // If not looping and reached the end, stop
      if (!loop && nextIndex === 0) return;

      const nextWord = safeWords[nextIndex];

      // Enhanced glitch effect with more shuffles and variable timing
      let shuffleCount = 0;
      const maxShuffles = 15; // Increased from 3 to 15 for longer glitch effect
      const startTime = Date.now();
      const glitchDuration = 500; // Total duration of the glitch effect in ms

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
          setTimeout(doShuffle, nextShuffleSpeed);
        } else {
          setDisplayText(nextWord);
          setWordIndex(nextIndex);
        }
      };

      // Start shuffling
      doShuffle();
    };

    // Set up the interval
    const intervalId = setInterval(changeWord, changeInterval);

    // Clean up
    return () => clearInterval(intervalId);
  }, [safeWords, wordIndex, loop, shuffleSpeed, changeInterval, shuffleChars]);

  return (
    <span
      ref={containerRef}
      className={className}
      style={
        fixedWidth && maxWidth
          ? { display: "inline-block", minWidth: `${maxWidth}px` }
          : undefined
      }
    >
      {prefix}
      <span className={highlightActive ? highlightClass : ""}>
        {displayText}
      </span>
      {suffix}
    </span>
  );
};

export default ShuffleText;
