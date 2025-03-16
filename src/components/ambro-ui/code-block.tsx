"use client";

import {
  type FC,
  useEffect,
  useState,
  useMemo,
  useCallback,
  memo,
} from "react";
import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";

/**
 * Renders code with syntax highlighting
 * Memoized to prevent recalculation on every render
 */
const highlightCode = (text: string, lang: string) => {
  if (!text) return [<span key="empty">&nbsp;</span>];

  if (lang !== "javascript" && lang !== "typescript") {
    return [<span key="content">{text}</span>];
  }

  // Define token patterns and colors - better readability and maintenance
  const tokenPatterns = [
    {
      type: "keyword",
      pattern:
        /^\b(function|return|if|for|while|var|let|const|async|await|import|from|export)\b/,
      color: "#c792ea",
    },
    {
      type: "literal",
      pattern: /^\b(true|false|null|undefined)\b/,
      color: "#f78c6c",
    },
    { type: "string", pattern: /^("[^"]*")|('[^']*')/, color: "#c3e88d" },
    { type: "number", pattern: /^\b(\d+)\b/, color: "#f78c6c" },
    { type: "comment", pattern: /^\/\/.*/, color: "#546e7a" },
  ];

  // Create an array to hold our tokens
  const tokens: { type: string; content: string; color: string }[] = [];

  // Create a working copy of the text
  let remaining = text;

  // Process the text until there's nothing left
  while (remaining.length > 0) {
    let matched = false;

    // Try to match against each pattern
    for (const { type, pattern, color } of tokenPatterns) {
      const match = remaining.match(pattern);
      if (match) {
        tokens.push({ type, content: match[0], color });
        remaining = remaining.substring(match[0].length);
        matched = true;
        break;
      }
    }

    // If no match, take one character as plain text
    if (!matched) {
      tokens.push({
        type: "text",
        content: remaining.charAt(0),
        color: "inherit",
      });
      remaining = remaining.substring(1);
    }
  }

  // Render tokens with appropriate styling
  return tokens.map((token, i) => (
    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
    <span key={i} style={{ color: token.color }}>
      {token.content}
    </span>
  ));
};

// Add display name for the memoized function
highlightCode.displayName = "highlightCode";

/**
 * CodeBlock Component
 *
 * Displays code with syntax highlighting and additional features like line numbers and copy button.
 *
 * @param code - Code string to display
 * @param language - Programming language for syntax highlighting
 * @param showLineNumbers - Whether to show line numbers
 * @param theme - Visual theme for the code block
 * @param fileName - Optional file name to display
 * @param highlightLines - Array of line numbers to highlight
 * @param wrapLines - Whether to wrap long lines
 * @param copyButton - Show copy button
 * @param className - Additional CSS classes
 * @param maxHeight - Maximum height before scrolling
 * @param animateTyping - Enable typing animation effect
 * @param typingSpeed - Speed of typing animation in milliseconds
 * @param rounded - Border radius Tailwind class
 */
export const CodeBlock: FC<{
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  theme?: "dark" | "light" | "tech";
  fileName?: string;
  highlightLines?: number[];
  wrapLines?: boolean;
  copyButton?: boolean;
  className?: string;
  maxHeight?: string;
  animateTyping?: boolean;
  typingSpeed?: number;
  rounded?: string;
}> = memo(
  ({
    code,
    language = "javascript",
    showLineNumbers = true,
    theme = "tech",
    fileName,
    highlightLines = [],
    wrapLines = false,
    copyButton = true,
    className = "",
    maxHeight = "24rem",
    animateTyping = false,
    typingSpeed = 10,
    rounded = "rounded-lg",
  }) => {
    const [isCopied, setIsCopied] = useState(false);
    const [typedCode, setTypedCode] = useState(animateTyping ? "" : code);

    // Handle copy to clipboard - memoized to prevent rerenders
    const copyToClipboard = useCallback(() => {
      navigator.clipboard.writeText(code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }, [code]);

    // Animate typing effect - optimized with cleanup
    useEffect(() => {
      if (!animateTyping) return;

      let i = 0;
      const interval = typingSpeed; // Store in variable for clarity

      const timer = setInterval(() => {
        if (i < code.length) {
          setTypedCode(() => code.substring(0, i + 1));
          i++;
        } else {
          clearInterval(timer);
        }
      }, interval);

      return () => clearInterval(timer);
    }, [code, animateTyping, typingSpeed]);

    // Get theme classes - memoized
    const themeClasses = useMemo(() => {
      switch (theme) {
        case "light":
          return "bg-gray-50 text-gray-800";
        case "tech":
          return "bg-gray-900/80 text-gray-200 border border-indigo-900/30 backdrop-blur-md";
        default:
          return "bg-gray-900 text-gray-200";
      }
    }, [theme]);

    // Pre-split code into lines for better performance - memoized
    const codeLines = useMemo(() => {
      const codeToRender = animateTyping ? typedCode : code;
      return codeToRender.split("\n");
    }, [code, typedCode, animateTyping]);

    // Format code with syntax highlighting - memoized
    const formattedCode = useMemo(() => {
      return codeLines.map((line, index) => {
        const isHighlighted = highlightLines.includes(index + 1);

        return (
          <div
            key={`line-${
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              index
            }`}
            className={`flex ${isHighlighted ? "bg-indigo-900/30" : ""} ${
              wrapLines ? "whitespace-pre-wrap" : "whitespace-pre"
            }`}
          >
            {showLineNumbers && (
              <span className="select-none w-12 inline-block text-right pr-4 text-gray-500 border-r border-gray-700 mr-4">
                {index + 1}
              </span>
            )}
            <span>{highlightCode(line, language)}</span>
          </div>
        );
      });
    }, [codeLines, highlightLines, wrapLines, showLineNumbers, language]);

    // Animation for the blinking cursor - memoized
    const cursorAnimation = useMemo(
      () => ({
        opacity: [1, 0, 1],
        transition: {
          duration: 1,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        },
      }),
      []
    );

    // Combined class names - memoized
    const containerClasses = useMemo(
      () => twMerge(`${themeClasses} ${rounded} overflow-hidden`, className),
      [themeClasses, rounded, className]
    );

    return (
      <motion.section
        className={containerClasses}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        aria-label={fileName || "Code snippet"}
      >
        {/* Header with filename and copy button */}
        {(fileName || copyButton) && (
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700/50">
            {fileName && (
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full bg-gray-500/50"
                  aria-hidden="true"
                />
                <span className="text-sm text-gray-400">{fileName}</span>
              </div>
            )}

            {copyButton && (
              <button
                onClick={copyToClipboard}
                className="text-xs px-2 py-1 rounded hover:bg-gray-700/30 text-gray-400 hover:text-gray-200 transition-colors"
                type="button"
                aria-label={
                  isCopied ? "Copied to clipboard" : "Copy to clipboard"
                }
              >
                {isCopied ? (
                  <span className="flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    Copied!
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                    </svg>
                    Copy
                  </span>
                )}
              </button>
            )}
          </div>
        )}

        {/* Code content */}
        <div className="p-4 overflow-auto" style={{ maxHeight }}>
          <pre className="font-mono text-sm overflow-visible">
            {formattedCode}

            {/* Blinking cursor at the end when typing */}
            {animateTyping && typedCode.length < code.length && (
              <motion.span
                animate={cursorAnimation}
                className="inline-block w-2 h-4 bg-indigo-400"
                aria-hidden="true"
              />
            )}
          </pre>
        </div>
      </motion.section>
    );
  }
);

// Add display name for better debugging
CodeBlock.displayName = "CodeBlock";
