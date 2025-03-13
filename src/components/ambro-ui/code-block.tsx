import { type FC, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";

const renderHighlightedCode = (text: string, lang: string) => {
  if (!text) return [<span key="empty">&nbsp;</span>];

  if (lang !== "javascript" && lang !== "typescript") {
    return [<span key="content">{text}</span>];
  }

  // Create an array to hold our tokens
  const tokens: { type: string; content: string }[] = [];

  // Create a working copy of the text
  let remaining = text;

  // Process the text until there's nothing left
  while (remaining.length > 0) {
    // Check for keywords
    const keywordMatch = remaining.match(
      /^\b(function|return|if|for|while|var|let|const|async|await|import|from|export)\b/
    );
    if (keywordMatch) {
      tokens.push({ type: "keyword", content: keywordMatch[0] });
      remaining = remaining.substring(keywordMatch[0].length);
      continue;
    }

    // Check for literals
    const literalMatch = remaining.match(/^\b(true|false|null|undefined)\b/);
    if (literalMatch) {
      tokens.push({ type: "literal", content: literalMatch[0] });
      remaining = remaining.substring(literalMatch[0].length);
      continue;
    }

    // Check for strings
    const stringMatch = remaining.match(/^("[^"]*")|('[^']*')/);
    if (stringMatch) {
      tokens.push({ type: "string", content: stringMatch[0] });
      remaining = remaining.substring(stringMatch[0].length);
      continue;
    }

    // Check for numbers
    const numberMatch = remaining.match(/^\b(\d+)\b/);
    if (numberMatch) {
      tokens.push({ type: "number", content: numberMatch[0] });
      remaining = remaining.substring(numberMatch[0].length);
      continue;
    }

    // Check for comments
    const commentMatch = remaining.match(/^\/\/.*/);
    if (commentMatch) {
      tokens.push({ type: "comment", content: commentMatch[0] });
      remaining = remaining.substring(commentMatch[0].length);
      continue;
    }

    // If no match, take one character as plain text
    tokens.push({ type: "text", content: remaining.charAt(0) });
    remaining = remaining.substring(1);
  }

  // Render tokens with appropriate styling
  return tokens.map((token, i) => {
    switch (token.type) {
      case "keyword":
        return (
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          <span key={i} style={{ color: "#c792ea" }}>
            {token.content}
          </span>
        );
      case "literal":
        return (
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          <span key={i} style={{ color: "#f78c6c" }}>
            {token.content}
          </span>
        );
      case "string":
        return (
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          <span key={i} style={{ color: "#c3e88d" }}>
            {token.content}
          </span>
        );
      case "number":
        return (
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          <span key={i} style={{ color: "#f78c6c" }}>
            {token.content}
          </span>
        );
      case "comment":
        return (
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          <span key={i} style={{ color: "#546e7a" }}>
            {token.content}
          </span>
        );
      default:
        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
        return <span key={i}>{token.content}</span>;
    }
  });
};

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
}> = ({
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

  // Handle copy to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Animate typing effect
  useEffect(() => {
    if (!animateTyping) return;

    let i = 0;
    const timer = setInterval(() => {
      if (i < code.length) {
        setTypedCode(code.substring(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
      }
    }, typingSpeed);

    return () => clearInterval(timer);
  }, [code, animateTyping, typingSpeed]);

  // Get theme styles
  const getThemeClasses = () => {
    switch (theme) {
      case "light":
        return "bg-gray-50 text-gray-800";
      case "tech":
        return "bg-gray-900/80 text-gray-200 border border-indigo-900/30 backdrop-blur-md";
      default:
        return "bg-gray-900 text-gray-200";
    }
  };

  // Format code with syntax highlighting
  const formatCode = () => {
    const codeToRender = animateTyping ? typedCode : code;
    const lines = codeToRender.split("\n");

    return lines.map((line, index) => {
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
          <span>{renderHighlightedCode(line, language)}</span>
        </div>
      );
    });
  };

  return (
    <motion.div
      className={twMerge(
        `${getThemeClasses()} ${rounded} overflow-hidden`,
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header with filename and copy button */}
      {(fileName || copyButton) && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700/50">
          {fileName && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-500/50" />
              <span className="text-sm text-gray-400">{fileName}</span>
            </div>
          )}

          {copyButton && (
            <button
              onClick={copyToClipboard}
              className="text-xs px-2 py-1 rounded hover:bg-gray-700/30 text-gray-400 hover:text-gray-200 transition-colors"
              type="button"
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
                  >
                    <title>Copied to clipboard</title>
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
                  >
                    <title>Copy to clipboard</title>
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
          {formatCode()}

          {/* Blinking cursor at the end when typing */}
          {animateTyping && typedCode.length < code.length && (
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
              className="inline-block w-2 h-4 bg-indigo-400"
            />
          )}
        </pre>
      </div>
    </motion.div>
  );
};
