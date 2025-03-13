import {
  type FC,
  useEffect,
  useRef,
  useState,
  type HTMLElementType,
} from "react";
import { twMerge } from "tailwind-merge";

export const TypewriterText: FC<{
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
}> = ({
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
}) => {
  const [displayText, setDisplayText] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Type effect
  useEffect(() => {
    // Handle pause if needed
    if (isPaused) return;

    // Initial delay
    const startTyping = () => {
      if (isDeleting) {
        // Delete characters
        if (displayText.length > 0) {
          timeoutRef.current = setTimeout(() => {
            setDisplayText((prevText) => prevText.slice(0, -1));
          }, deleteSpeed);
        } else {
          // Start typing again after delay
          setIsDeleting(false);
          timeoutRef.current = setTimeout(() => {
            setDisplayText("");
          }, loopDelay);
        }
      } else {
        // Type characters
        if (displayText.length < text.length) {
          timeoutRef.current = setTimeout(() => {
            setDisplayText(
              (prevText) => prevText + text.charAt(prevText.length)
            );
          }, speed);
        } else {
          // Handle completion
          setIsComplete(true);
          onComplete?.();

          if (loop) {
            // Wait before deleting
            timeoutRef.current = setTimeout(() => {
              setIsDeleting(true);
            }, loopDelay);
          }
        }
      }
    };

    if (delay > 0 && displayText.length === 0 && !isDeleting) {
      // Initial delay if needed
      timeoutRef.current = setTimeout(startTyping, delay);
    } else {
      startTyping();
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [
    displayText,
    text,
    speed,
    delay,
    onComplete,
    loop,
    loopDelay,
    deleteSpeed,
    isDeleting,
    isPaused,
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

  return (
    <Component
      className={className}
      onMouseEnter={pauseOnHover ? () => setIsPaused(true) : undefined}
      onMouseLeave={pauseOnHover ? () => setIsPaused(false) : undefined}
    >
      {displayText}
      {cursor && (showWhenDone || !isComplete) && (
        <span
          className={twMerge(
            "inline-block",
            cursorColor,
            cursorBlink && "animate-cursor-blink"
          )}
          style={{
            opacity: cursorVisible ? 1 : 0,
            transition: "opacity 0.1s",
          }}
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
};
