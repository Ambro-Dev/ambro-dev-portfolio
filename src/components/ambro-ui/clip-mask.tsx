"use client";

import { type FC, type ReactNode, useRef } from "react";
import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";

export const ClipMask: FC<{
	children: ReactNode;
	mask?: "circle" | "hexagon" | "diamond" | "triangle" | "star" | "custom";
	customPath?: string;
	width?: string | number;
	height?: string | number;
	className?: string;
	animate?: boolean;
	animationDuration?: number;
	expandOnHover?: boolean;
	hoverScale?: number;
	backgroundColor?: string;
	borderWidth?: number;
	borderColor?: string;
	gradientColors?: string[];
	shadowColor?: string;
	shadowSize?: number;
}> = ({
	children,
	mask = "circle",
	customPath,
	width = "100%",
	height = "100%",
	className = "",
	animate = false,
	animationDuration = 10,
	expandOnHover = false,
	hoverScale = 1.05,
	backgroundColor = "transparent",
	borderWidth = 0,
	borderColor = "white",
	gradientColors = [],
	shadowColor = "rgba(0, 0, 0, 0.3)",
	shadowSize = 10,
}) => {
	const svgId = useRef(`mask-${Math.random().toString(36).substring(2, 9)}`);

	// Generate SVG path for the mask shape
	const getMaskPath = () => {
		switch (mask) {
			case "hexagon":
				return "M50,0 L93.3,25 L93.3,75 L50,100 L6.7,75 L6.7,25 Z";
			case "diamond":
				return "M50,0 L100,50 L50,100 L0,50 Z";
			case "triangle":
				return "M50,0 L100,100 L0,100 Z";
			case "star":
				return "M50,0 L63.5,36.5 L100,36.5 L69.5,60.5 L82.5,100 L50,75 L17.5,100 L30.5,60.5 L0,36.5 L36.5,36.5 Z";
			case "custom":
				return customPath || "M0,0 H100 V100 H0 Z";
			default:
				return "M50,0 A50,50 0 1,1 50,100 A50,50 0 1,1 50,0 Z";
		}
	};

	// Calculate viewBox based on mask type
	const getViewBox = () => {
		return "0 0 100 100";
	};

	// Generate gradient if colors are provided
	const renderGradient = () => {
		if (gradientColors.length < 2) return null;

		return (
			<defs>
				<linearGradient
					id={`gradient-${svgId.current}`}
					x1="0%"
					y1="0%"
					x2="100%"
					y2="100%"
				>
					{gradientColors.map((color, index) => (
						<stop
							// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
							key={index}
							offset={`${(index / (gradientColors.length - 1)) * 100}%`}
							stopColor={color}
						/>
					))}
				</linearGradient>
			</defs>
		);
	};

	// Apply animation to mask path
	const renderAnimatedPath = () => {
		if (!animate) {
			return (
				<path
					d={getMaskPath()}
					fill={
						gradientColors.length >= 2
							? `url(#gradient-${svgId.current})`
							: backgroundColor
					}
					stroke={borderWidth > 0 ? borderColor : "none"}
					strokeWidth={borderWidth}
				/>
			);
		}

		return (
			<motion.path
				d={getMaskPath()}
				fill={
					gradientColors.length >= 2
						? `url(#gradient-${svgId.current})`
						: backgroundColor
				}
				stroke={borderWidth > 0 ? borderColor : "none"}
				strokeWidth={borderWidth}
				animate={{
					scale: [1, 1.02, 0.98, 1],
					rotate: [0, 1, -1, 0],
				}}
				transition={{
					duration: animationDuration,
					repeat: Number.POSITIVE_INFINITY,
					repeatType: "loop",
					ease: "easeInOut",
				}}
			/>
		);
	};

	return (
		<motion.div
			className={twMerge("relative overflow-hidden", className)}
			style={{
				width,
				height,
			}}
			whileHover={expandOnHover ? { scale: hoverScale } : {}}
			transition={{ type: "spring", stiffness: 300, damping: 20 }}
		>
			{/* SVG mask */}
			<svg
				width="0"
				height="0"
				style={{ position: "absolute", visibility: "hidden" }}
			>
				<title>Clip Mask</title>
				<defs>
					<clipPath id={svgId.current} clipPathUnits="objectBoundingBox">
						<path d={getMaskPath()} transform="scale(0.01, 0.01)" />
					</clipPath>
				</defs>
			</svg>

			{/* Background shape with optional shadow */}
			<div
				className="absolute inset-0"
				style={{
					filter: `drop-shadow(0 0 ${shadowSize}px ${shadowColor})`,
				}}
			>
				<svg
					viewBox={getViewBox()}
					width="100%"
					height="100%"
					preserveAspectRatio="xMidYMid meet"
				>
					<title>Clip Mask</title>
					{renderGradient()}
					{renderAnimatedPath()}
				</svg>
			</div>

			{/* Content with clipping mask */}
			<div
				className="absolute inset-0"
				style={{
					clipPath: `url(#${svgId.current})`,
				}}
			>
				{children}
			</div>
		</motion.div>
	);
};
