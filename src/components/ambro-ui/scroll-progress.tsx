"use client";

import {
	useMotionValue,
	useScroll,
	useSpring,
	motion,
	useTransform,
} from "framer-motion";
import { type FC, useEffect } from "react";
import { twMerge } from "tailwind-merge";

export const ScrollProgress: FC<{
	color?: string;
	height?: number;
	zIndex?: number;
	position?: "top" | "bottom" | "left" | "right";
	variant?: "line" | "circle" | "dots";
	showValue?: boolean;
	valueFormatter?: (progress: number) => string;
	width?: string | number;
	containerClassName?: string;
	progressClassName?: string;
	borderRadius?: string;
}> = ({
	color = "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500",
	height = 2,
	zIndex = 50,
	position = "top",
	variant = "line",
	showValue = false,
	valueFormatter = (progress) => `${Math.round(progress * 100)}%`,
	containerClassName = "",
	progressClassName = "",
	borderRadius = "0",
}) => {
	const { scrollYProgress } = useScroll();
	const scaleX = useSpring(scrollYProgress, {
		stiffness: 100,
		damping: 30,
		restDelta: 0.001,
	});
	const progress = useMotionValue(0);

	// Move all useTransform calls to the top level
	const circleProgress = useTransform(scaleX, [0, 1], [188.5, 0]);
	const formattedProgress = useTransform(progress, (p) => valueFormatter(p));

	// Create INDIVIDUAL transforms instead of using map() with hooks
	const dotOpacity0 = useTransform(
		scrollYProgress,
		[0, 0.1, 0.2],
		[0.2, 1, 0.2],
	);
	const dotOpacity1 = useTransform(
		scrollYProgress,
		[0.2, 0.3, 0.4],
		[0.2, 1, 0.2],
	);
	const dotOpacity2 = useTransform(
		scrollYProgress,
		[0.4, 0.5, 0.6],
		[0.2, 1, 0.2],
	);
	const dotOpacity3 = useTransform(
		scrollYProgress,
		[0.6, 0.7, 0.8],
		[0.2, 1, 0.2],
	);
	const dotOpacity4 = useTransform(
		scrollYProgress,
		[0.8, 0.9, 1.0],
		[0.2, 1, 0.2],
	);

	// Store them in an array AFTER creating them
	const dotOpacities = [
		dotOpacity0,
		dotOpacity1,
		dotOpacity2,
		dotOpacity3,
		dotOpacity4,
	];

	// Update progress value for formatter
	useEffect(() => {
		const unsubscribe = scrollYProgress.onChange((v) => {
			progress.set(v);
		});
		return unsubscribe;
	}, [scrollYProgress, progress]);

	// Get styles based on position
	const getPositionStyles = () => {
		switch (position) {
			case "bottom":
				return {
					top: "auto",
					bottom: 0,
					left: 0,
					right: 0,
					height,
					width: "100%",
				};
			case "left":
				return {
					top: 0,
					bottom: 0,
					left: 0,
					width: typeof height === "number" ? `${height}px` : height,
					height: "100%",
					transformOrigin: "top",
					scaleY: scaleX,
					scaleX: 1,
				};
			case "right":
				return {
					top: 0,
					bottom: 0,
					right: 0,
					width: typeof height === "number" ? `${height}px` : height,
					height: "100%",
					transformOrigin: "top",
					scaleY: scaleX,
					scaleX: 1,
				};
			default:
				return { top: 0, left: 0, right: 0, height, width: "100%" };
		}
	};

	// Render different variants
	switch (variant) {
		case "circle":
			return (
				<motion.div
					className={twMerge(
						"fixed flex items-center justify-center",
						containerClassName,
					)}
					style={{
						bottom: "20px",
						right: "20px",
						zIndex,
						width: "64px",
						height: "64px",
					}}
				>
					<svg width="64" height="64" viewBox="0 0 64 64">
						<title>Scroll Progress</title>
						<motion.circle
							cx="32"
							cy="32"
							r="30"
							fill="none"
							strokeWidth="4"
							stroke="rgba(255,255,255,0.1)"
							className={progressClassName}
						/>
						<motion.circle
							cx="32"
							cy="32"
							r="30"
							fill="none"
							strokeWidth="4"
							stroke={color.replace("bg-", "")}
							strokeDasharray="188.5"
							strokeDashoffset="188.5"
							style={{
								strokeDashoffset: circleProgress, // Use the pre-computed value
							}}
							className={progressClassName}
						/>
						{showValue && (
							<motion.text
								x="32"
								y="36"
								textAnchor="middle"
								fontSize="14"
								fill="white"
								style={{
									fontWeight: 500,
								}}
							>
								{formattedProgress}
							</motion.text>
						)}
					</svg>
				</motion.div>
			);

		case "dots":
			return (
				<motion.div
					className={twMerge("fixed flex gap-1", containerClassName)}
					style={{
						top: position === "top" ? "20px" : "auto",
						bottom: position === "bottom" ? "20px" : "auto",
						left: "50%",
						transform: "translateX(-50%)",
						zIndex,
					}}
				>
					{Array.from({ length: 5 }).map((_, i) => (
						<motion.div
							key={`scroll-dot-${
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								i
							}`}
							className={progressClassName}
							style={{
								width: "8px",
								height: "8px",
								borderRadius: "50%",
								backgroundColor: "rgba(255,255,255,0.2)",
								opacity: dotOpacities[i],
								background: color,
							}}
						/>
					))}
				</motion.div>
			);

		default:
			return (
				<motion.div
					className={twMerge("fixed", containerClassName)}
					style={{
						zIndex,
						borderRadius,
						...getPositionStyles(),
					}}
				>
					<motion.div
						className={twMerge(color, progressClassName)}
						style={{
							height: "100%",
							width: "100%",
							transformOrigin:
								position === "left" || position === "right" ? "top" : "left",
							scaleX: position === "left" || position === "right" ? 1 : scaleX,
							scaleY: position === "left" || position === "right" ? scaleX : 1,
							borderRadius,
						}}
					/>

					{showValue && (
						<motion.div className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/70 text-white text-xs px-2 py-1 rounded">
							{formattedProgress}
						</motion.div>
					)}
				</motion.div>
			);
	}
};
