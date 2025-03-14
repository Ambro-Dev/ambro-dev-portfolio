"use client";

import { useIsMobile } from "@/hooks/use-is-mobile";
import { useTilt } from "@/hooks/use-tilt";
import { AnimatePresence, motion } from "framer-motion";
import { type FC, type ReactNode, useRef } from "react";
import { twMerge } from "tailwind-merge";

export const TiltCard: FC<{
	children: ReactNode;
	className?: string;
	tiltAmount?: number;
	glareOpacity?: number;
	disabled?: boolean;
	scale?: number;
	perspective?: number;
	glarePosition?: "top" | "center";
	shadow?: boolean;
	shadowColor?: string;
	borderGlow?: boolean;
	borderColor?: string;
	backgroundEffect?: "none" | "gradient" | "noise" | "grid";
	onClick?: () => void;
}> = ({
	children,
	className = "",
	tiltAmount = 20,
	glareOpacity = 0.2,
	disabled = false,
	scale = 1.02,
	perspective = 1000,
	glarePosition = "top",
	shadow = true,
	shadowColor = "rgba(0, 0, 0, 0.35)",
	borderGlow = false,
	borderColor = "rgba(99, 102, 241, 0.4)",
	backgroundEffect = "none",
	onClick,
}) => {
	const cardRef = useRef<HTMLDivElement>(null);
	const isMobile = useIsMobile();

	// Use tilt hook with advanced configuration
	const {
		rotateX,
		rotateY,
		posX,
		posY,
		isHovered,
		glareStyle,
		shadowStyle,
		handlers,
	} = useTilt({
		amount: tiltAmount,
		disabled: disabled || isMobile,
		perspective,
		springConfig: { stiffness: 300, damping: 30 },
		scale,
		glare: true,
		glareSize: 0.6,
		glarePosition,
		glareColor: `rgba(255, 255, 255, ${glareOpacity})`,
		shadow,
		shadowColor,
	});

	// Background patterns/effects
	const getBackgroundEffect = () => {
		switch (backgroundEffect) {
			case "gradient":
				return {
					background:
						"linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.05))",
				};
			case "noise":
				return {
					backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
					backgroundBlendMode: "overlay",
					opacity: 0.05,
				};
			case "grid":
				return {
					backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M0 0h20v20H0V0zm1 1v18h18V1H1z'/%3E%3C/g%3E%3C/svg%3E")`,
				};
			default:
				return {};
		}
	};

	return (
		<motion.div
			ref={cardRef}
			className={twMerge(
				"relative overflow-hidden perspective-1000",
				className,
			)}
			style={{
				transformStyle: "preserve-3d",
			}}
			whileHover={!disabled && !isMobile ? { scale } : {}}
			transition={{ type: "spring", stiffness: 300, damping: 20 }}
			onClick={onClick}
			{...handlers}
		>
			<motion.div
				className="w-full h-full rounded-xl overflow-hidden"
				style={{
					rotateX,
					rotateY,
					transformStyle: "preserve-3d",
					...shadowStyle,
				}}
			>
				{/* Border glow effect */}
				{borderGlow && isHovered && (
					<motion.div
						className="absolute inset-0 rounded-xl"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.3 }}
						style={{
							boxShadow: `0 0 15px ${borderColor}`,
							zIndex: -1,
						}}
					/>
				)}

				{/* Background pattern */}
				{backgroundEffect !== "none" && (
					<div
						className="absolute inset-0 rounded-xl pointer-events-none"
						style={getBackgroundEffect()}
					/>
				)}

				{/* Glare effect */}
				<AnimatePresence>
					{isHovered && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="absolute inset-0 rounded-xl pointer-events-none overflow-hidden"
						>
							<motion.div
								className="absolute inset-0"
								style={glareStyle as React.CSSProperties}
							/>
						</motion.div>
					)}
				</AnimatePresence>

				{/* Content */}
				<motion.div
					className="relative h-full z-10"
					style={{
						translateZ: 0,
						transform:
							isHovered && !disabled
								? `translate(${posX}px, ${posY}px)`
								: undefined,
					}}
				>
					{children}
				</motion.div>
			</motion.div>
		</motion.div>
	);
};
