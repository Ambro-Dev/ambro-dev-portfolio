import { motion } from "framer-motion";
import type React from "react";
import { useId } from "react";

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
	totalLength?: number; // Approximate total length of the path
	shineStart: number; // Starting offset (in the same units) along the path for the shine segment
	shineLength: number; // Length of the shining segment
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
	// Base stroke uses neon pink
	baseStroke = "#ff1493",
	// Neon gradient stops with a white center for extra glow
	gradientStops = [
		{ offset: "0%", color: "#ff1493" },
		{ offset: "50%", color: "#ffffff" },
		{ offset: "100%", color: "#ff1493" },
	],
	totalLength = 400,
	shineStart,
	shineLength,
	shineDuration = 0.5, // Flash duration (flash in/out cycle)
	shineRepeatDelay = 3.5, // Time between flashes
	gradientDirection = { x1: "0", y1: "0", x2: "1", y2: "0" },
}) => {
	// Generate a unique gradient ID so multiple instances don't conflict.
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
				{/* Base (static) border */}
				<path d={pathData} stroke={baseStroke} strokeWidth={strokeWidth} />
				{/* Intermittent shine on the selected segment */}
				<motion.path
					d={pathData}
					stroke={`url(#gradient-${gradientId})`}
					strokeWidth={strokeWidth}
					// The dash array creates a visible segment (shineLength) and an invisible gap (totalLength - shineLength)
					strokeDasharray={`${shineLength} ${totalLength - shineLength}`}
					// Offset the dash so the visible segment starts at the desired point along the path.
					strokeDashoffset={-shineStart}
					initial={{ opacity: 0 }}
					animate={{ opacity: [0, 1, 0] }}
					transition={{
						duration: shineDuration,
						ease: "linear",
						repeat: Number.POSITIVE_INFINITY,
						repeatDelay: shineRepeatDelay,
					}}
				/>
			</g>
		</svg>
	);
};

export default IntermittentShineBorder;
