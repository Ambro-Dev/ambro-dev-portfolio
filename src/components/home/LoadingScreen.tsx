"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Server, Cloud, Database, Code, Shield } from "lucide-react";

// Interface for the component props
interface LoadingScreenProps {
	minLoadingTime?: number; // Minimum time to show loading screen in ms
	onLoadingComplete?: () => void; // Callback when loading is complete
}

// Loading icon component with animation
const LoadingIcon: React.FC<{
	icon: React.ReactNode;
	delay: number;
	color: string;
}> = ({ icon, delay, color }) => {
	return (
		<motion.div
			className="relative"
			initial={{ opacity: 0, scale: 0 }}
			animate={{
				opacity: [0, 1, 1, 0],
				scale: [0, 1, 1, 0],
				y: [0, -20, -20, 0],
			}}
			transition={{
				duration: 2.5,
				delay,
				repeat: Number.POSITIVE_INFINITY,
				repeatDelay: 0.5,
				times: [0, 0.2, 0.8, 1],
			}}
		>
			<div
				className="p-3 rounded-full"
				style={{ backgroundColor: `${color}20` }}
			>
				<div
					className="w-12 h-12 flex items-center justify-center rounded-full"
					style={{ backgroundColor: color }}
				>
					{icon}
				</div>
			</div>

			{/* Pulsing effect */}
			<motion.div
				className="absolute inset-0 rounded-full"
				style={{ backgroundColor: color }}
				initial={{ opacity: 0.3, scale: 1 }}
				animate={{
					opacity: 0,
					scale: 1.8,
				}}
				transition={{
					duration: 1.5,
					delay: delay + 0.3,
					repeat: Number.POSITIVE_INFINITY,
					repeatDelay: 1.5,
				}}
			/>
		</motion.div>
	);
};

// Main loading screen component
const LoadingScreen: React.FC<LoadingScreenProps> = ({
	minLoadingTime = 3000,
	onLoadingComplete,
}) => {
	const [isLoading, setIsLoading] = useState(true);
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		// Simulate loading progress
		const startTime = Date.now();
		const interval = setInterval(() => {
			const elapsedTime = Date.now() - startTime;
			const newProgress = Math.min(
				Math.floor((elapsedTime / minLoadingTime) * 100),
				100,
			);
			setProgress(newProgress);

			if (elapsedTime >= minLoadingTime) {
				clearInterval(interval);
				setTimeout(() => {
					setIsLoading(false);
					if (onLoadingComplete) {
						onLoadingComplete();
					}
				}, 500); // Small delay before hiding
			}
		}, 50);

		return () => clearInterval(interval);
	}, [minLoadingTime, onLoadingComplete]);

	// Loading animation icons with colors
	const loadingIcons = [
		{ icon: <Server size={24} color="white" />, delay: 0, color: "#4361EE" },
		{ icon: <Cloud size={24} color="white" />, delay: 0.3, color: "#3A86FF" },
		{
			icon: <Database size={24} color="white" />,
			delay: 0.6,
			color: "#8338EC",
		},
		{ icon: <Code size={24} color="white" />, delay: 0.9, color: "#FF006E" },
		{ icon: <Shield size={24} color="white" />, delay: 1.2, color: "#FB5607" },
	];

	return (
		<AnimatePresence>
			{isLoading && (
				<motion.div
					className="fixed inset-0 flex flex-col items-center justify-center bg-gray-900 z-50"
					initial={{ opacity: 1 }}
					exit={{
						opacity: 0,
						transition: { duration: 0.5, ease: "easeInOut" },
					}}
				>
					{/* Gradient overlay */}
					<div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 opacity-80" />

					{/* Background grid pattern */}
					<div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />

					{/* Content */}
					<div className="relative z-10 flex flex-col items-center">
						{/* Title with animated gradient */}
						<motion.h1
							className="text-4xl md:text-5xl font-bold mb-8 relative"
							initial={{ opacity: 0, y: -20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5 }}
						>
							<span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-gradient">
								DevOps & IT Architecture
							</span>
						</motion.h1>

						{/* Icons animation */}
						<div className="flex flex-wrap justify-center gap-6 mb-10">
							{loadingIcons.map((item, index) => (
								<LoadingIcon
									// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
									key={index}
									icon={item.icon}
									delay={item.delay}
									color={item.color}
								/>
							))}
						</div>

						{/* Loading message */}
						<motion.div
							className="text-gray-400 text-center mb-6"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.5 }}
						>
							<p className="text-lg">Ładowanie portfolio...</p>
							<p className="text-sm mt-1">
								Przygotowuję dla Ciebie interaktywne doświadczenie
							</p>
						</motion.div>

						{/* Progress bar */}
						<div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
							<motion.div
								className="h-full bg-gradient-to-r from-blue-600 to-indigo-600"
								initial={{ width: 0 }}
								animate={{ width: `${progress}%` }}
								transition={{ duration: 0.3 }}
							/>
						</div>

						{/* Progress percentage */}
						<motion.div
							className="text-gray-400 text-sm mt-2"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.8 }}
						>
							{progress}%
						</motion.div>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default LoadingScreen;
