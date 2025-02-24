import { motion } from "framer-motion";
import React, { useId } from "react";

type GradientStop = {
  offset: string;
  color: string;
};

type IntermittentShineBorderProps = {
  pathData: string;
  width?: number | string;
  height?: number | string;
  strokeWidth?: number;
  baseStroke?: string;
  gradientStops?: GradientStop[];
  shineStart: number; // Where along the path (in units) the shine should begin
  shineLength: number; // How long the shining segment should be
  shineDuration?: number; // Duration of the flash (in seconds)
  shineRepeatDelay?: number; // Delay between flashes (in seconds)
  gradientDirection?: {
    x1: string;
    y1: string;
    x2: string;
    y2: string;
  };
};

const IntermittentShineBorder: React.FC<IntermittentShineBorderProps> = ({
  pathData,
  width = "100%",
  height = "100%",
  strokeWidth = 1,
  // Use neon pink as the base color by default.
  baseStroke = "#ff1493",
  // Neon gradient with a white center for extra glow.
  gradientStops = [
    { offset: "0%", color: "#ff1493" },
    { offset: "50%", color: "#ffffff" },
    { offset: "100%", color: "#ff1493" },
  ],
  shineStart,
  shineLength,
  shineDuration = 0.5,
  shineRepeatDelay = 3.5,
  gradientDirection = { x1: "0", y1: "0", x2: "1", y2: "0" },
}) => {
  // Generate a unique ID for the gradient so that multiple instances won't conflict.
  const gradientId = useId();

  return (
    <svg width={width} height={height}>
      <defs>
        <linearGradient
          id={`gradient-${gradientId}`}
          x1={gradientDirection.x1}
          y1={gradientDirection.y1}
          x2={gradientDirection.x2}
          y2={gradientDirection.y2}
        >
          {gradientStops.map((stop, index) => (
            <stop key={index} offset={stop.offset} stopColor={stop.color} />
          ))}
        </linearGradient>
      </defs>
      <g
        fill="none"
        strokeLinecap="butt"
        strokeLinejoin="miter"
        strokeMiterlimit={4}
      >
        {/* Base border (static) */}
        <path d={pathData} stroke={baseStroke} strokeWidth={strokeWidth} />
        {/* Animated shine appears only once on the path.
            The dash array is set as:
            - A gap of length 'shineStart'
            - A dash (visible shine) of length 'shineLength'
            - A huge gap (e.g., 10000) that prevents the pattern from repeating */}
        <motion.path
          d={pathData}
          stroke={`url(#gradient-${gradientId})`}
          strokeWidth={strokeWidth}
          strokeDasharray={`${shineStart} ${shineLength} 10000`}
          strokeDashoffset={0}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{
            duration: shineDuration,
            ease: "linear",
            repeat: Infinity,
            repeatDelay: shineRepeatDelay,
          }}
        />
      </g>
    </svg>
  );
};

export default IntermittentShineBorder;
