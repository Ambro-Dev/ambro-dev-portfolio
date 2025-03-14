"use client";

import {
  type ElementType,
  type FC,
  useEffect,
  useRef,
  useState,
  createElement,
} from "react";

export interface ShuffleTextProps {
  words: string[];
  className?: string;
  shuffleSpeed?: number;
  changeInterval?: number;
  separator?: string;
  highlightActive?: boolean;
  highlightClass?: string;
  fixedWidth?: boolean;
  loop?: boolean;
  onWordChange?: (word: string, index: number) => void;
  prefix?: string;
  suffix?: string;
  typingEffect?: boolean;
  typingSpeed?: number;
  delayAfterWord?: number;
  tag?: ElementType;
}

export const ShuffleText: FC<ShuffleTextProps> = ({
  words,
  className = "",
  shuffleSpeed = 50,
  changeInterval = 3000,
  separator = "",
  highlightActive = false,
  highlightClass = "text-indigo-500",
  fixedWidth = true,
  loop = true,
  onWordChange,
  prefix = "",
  suffix = "",
  typingEffect = false,
  typingSpeed = 30,
  delayAfterWord = 1000,
  tag = "span",
}) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayedWord, setDisplayedWord] = useState(words[0] || "");
  const [isShuffling, setIsShuffling] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [charIndex, setCharIndex] = useState(0);
  const [maxWidth, setMaxWidth] = useState<number | null>(null);

  // Use a more generic ref type that works with any HTML element
  const containerRef = useRef<HTMLElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate max width if fixedWidth is enabled
  useEffect(() => {
    if (fixedWidth && containerRef.current) {
      const currentEl = containerRef.current;
      const computedStyle = window.getComputedStyle(currentEl);

      const widths = words.map((word) => {
        const tempSpan = document.createElement("span");
        tempSpan.innerHTML = word;
        tempSpan.style.visibility = "hidden";
        tempSpan.style.position = "absolute";
        tempSpan.style.fontSize = computedStyle.fontSize;
        tempSpan.style.fontFamily = computedStyle.fontFamily;
        tempSpan.style.fontWeight = computedStyle.fontWeight;
        document.body.appendChild(tempSpan);
        const width = tempSpan.getBoundingClientRect().width;
        document.body.removeChild(tempSpan);
        return width;
      });

      setMaxWidth(Math.max(...widths));
    }
  }, [words, fixedWidth]);

  // Change word at interval
  useEffect(() => {
    if (words.length <= 1) return;

    const changeWord = () => {
      if (typingEffect) {
        // Use typing effect
        setIsTyping(true);
        setCharIndex(0);
      } else {
        // Use shuffle effect
        setIsShuffling(true);

        // Start with random chars
        const randomChars =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let shuffleCount = 0;
        const maxShuffles = 10;
        const word = words[currentWordIndex];

        const shuffle = () => {
          shuffleCount++;

          // Generate shuffled text
          let result = "";
          for (let i = 0; i < word.length; i++) {
            if (shuffleCount > (maxShuffles * (i + 1)) / word.length) {
              result += word[i];
            } else {
              result += randomChars.charAt(
                Math.floor(Math.random() * randomChars.length)
              );
            }
          }

          setDisplayedWord(result);

          if (shuffleCount < maxShuffles) {
            timeoutRef.current = setTimeout(shuffle, shuffleSpeed);
          } else {
            // Finish shuffling
            setDisplayedWord(word);
            setIsShuffling(false);

            // Move to next word after a delay
            timeoutRef.current = setTimeout(() => {
              setCurrentWordIndex((prevIndex) =>
                loop || prevIndex < words.length - 1
                  ? (prevIndex + 1) % words.length
                  : prevIndex
              );
            }, delayAfterWord);
          }
        };

        shuffle();
      }
    };

    // Set up interval for changing words
    intervalRef.current = setInterval(() => {
      if (!isShuffling && !isTyping) {
        changeWord();
        onWordChange?.(words[currentWordIndex], currentWordIndex);
      }
    }, changeInterval);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [
    words,
    currentWordIndex,
    isShuffling,
    isTyping,
    shuffleSpeed,
    changeInterval,
    loop,
    delayAfterWord,
    onWordChange,
    typingEffect,
  ]);

  // Handle typing effect
  useEffect(() => {
    if (!typingEffect || !isTyping) return;

    const currentWord = words[currentWordIndex];

    if (charIndex === 0) {
      // Start with empty string
      setDisplayedWord("");
    }

    timeoutRef.current = setTimeout(() => {
      if (charIndex < currentWord.length) {
        // Add next character
        setDisplayedWord((prev) => prev + currentWord[charIndex]);
        setCharIndex(charIndex + 1);
      } else {
        // Finished typing
        setIsTyping(false);

        // Move to next word after delay
        timeoutRef.current = setTimeout(() => {
          setCurrentWordIndex((prevIndex) =>
            loop || prevIndex < words.length - 1
              ? (prevIndex + 1) % words.length
              : prevIndex
          );
        }, delayAfterWord);
      }
    }, typingSpeed);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [
    typingEffect,
    isTyping,
    charIndex,
    words,
    currentWordIndex,
    typingSpeed,
    delayAfterWord,
    loop,
  ]);

  const content = (
    <>
      {prefix}
      <span className={highlightActive ? highlightClass : ""}>
        {displayedWord}
      </span>
      {suffix}
      {separator && " "}
    </>
  );

  // Używamy createElement zamiast bezpośredniego renderowania JSX z dynamicznym tagiem
  // Rozwiązuje to problem typowania propsów
  return createElement(
    tag,
    {
      ref: containerRef,
      className: className,
      style:
        fixedWidth && maxWidth
          ? { display: "inline-block", minWidth: `${maxWidth}px` }
          : undefined,
    },
    content
  );
};

export default ShuffleText;
