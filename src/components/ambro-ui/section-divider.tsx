import type { FC } from "react";
import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";

export const SectionDivider: FC<{
  className?: string;
  dotColor?: string;
  lineColor?: string;
  dotSize?: number;
  variant?: "dot" | "line" | "gradient" | "animated" | "waves" | "tech";
  thickness?: number;
  width?: string;
  animated?: boolean;
  animationDuration?: number;
  text?: string;
  fontSize?: string;
  fontColor?: string;
}> = ({
  className = "",
  dotColor = "bg-blue-500",
  lineColor = "from-transparent via-gray-700 to-transparent",
  dotSize = 3,
  variant = "dot",
  thickness = 1,
  width = "full",
  animated = true,
  animationDuration = 2,
  text,
  fontSize = "sm",
  fontColor = "text-gray-400",
}) => {
  // SVG path for waves variant
  const wavePath =
    "M0,32 C12,40 24,24 36,32 C48,40 60,24 72,32 C84,40 96,24 108,32 C120,40 132,24 144,32 C156,40 168,24 180,32 C192,40";

  switch (variant) {
    case "gradient":
      return (
        <div className={twMerge("relative py-10", className)}>
          <div
            className={`w-${width} h-${thickness} bg-gradient-to-r ${lineColor} mx-auto`}
          />
        </div>
      );

    case "animated":
      return (
        <div className={twMerge("relative py-10", className)}>
          <div
            className={`w-${width} h-${thickness} bg-gray-800/50 mx-auto overflow-hidden`}
          >
            <motion.div
              className={`h-full ${dotColor}`}
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{
                duration: animationDuration,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            />
          </div>
        </div>
      );

    case "waves":
      return (
        <div
          className={twMerge("relative py-10 flex justify-center", className)}
        >
          <svg width="200" height="40" viewBox="0 0 200 64">
            <title>Waves</title>
            <motion.path
              d={wavePath}
              stroke={dotColor.replace("bg-", "")}
              strokeWidth={thickness}
              fill="none"
              initial={{ pathLength: 0, opacity: 0.5 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                duration: animated ? animationDuration : 0,
                repeat: animated ? Number.POSITIVE_INFINITY : 0,
                repeatType: "loop",
                ease: "easeInOut",
              }}
            />
          </svg>
        </div>
      );

    case "tech":
      return (
        <div className={twMerge("relative py-10", className)}>
          <div className="flex items-center justify-center gap-2">
            {text && (
              <span className={`${fontColor} text-${fontSize} px-4`}>
                {text}
              </span>
            )}
            <div className="flex-1 relative h-px bg-gray-800">
              <motion.div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(90deg, transparent, ${dotColor.replace(
                    "bg-",
                    ""
                  )}, transparent)`,
                }}
                animate={{
                  x: [-100, 100],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />
            </div>
            <div className="w-3 h-3 border border-gray-700 rotate-45" />
            <div className="flex-1 relative h-px bg-gray-800">
              <motion.div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(90deg, transparent, ${dotColor.replace(
                    "bg-",
                    ""
                  )}, transparent)`,
                }}
                animate={{
                  x: [100, -100],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />
            </div>
            {text && (
              <span className={`${fontColor} text-${fontSize} px-4`}>
                {text}
              </span>
            )}
          </div>
        </div>
      );

    case "line":
      return (
        <div className={twMerge("relative py-10", className)}>
          <div className={`w-${width} h-${thickness} bg-gray-800 mx-auto`} />
        </div>
      );

    default:
      return (
        <div className={twMerge("relative h-24", className)}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`w-full h-px bg-gradient-to-r ${lineColor}`} />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-gray-900 px-4 py-2 rounded-full">
              <motion.div
                className={`w-${dotSize} h-${dotSize} ${dotColor} rounded-full`}
                animate={
                  animated
                    ? {
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5],
                      }
                    : {}
                }
                transition={{
                  duration: animationDuration,
                  repeat: animated ? Number.POSITIVE_INFINITY : 0,
                  ease: "easeInOut",
                }}
              />
            </div>
          </div>
        </div>
      );
  }
};
