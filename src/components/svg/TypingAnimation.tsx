import { motion } from "framer-motion";
import React from "react";

type TypingAnimationProps = {
	text: string;
	xPosition: number;
	yPosition: number;
};

const TypingAnimation = ({
	text,
	xPosition,
	yPosition,
}: TypingAnimationProps) => {
	const letters = text.split("");

	// Define variants for the container and each letter
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				// This will stagger the appearance of each letter
				staggerChildren: 0.1,
			},
		},
	};

	const letterVariants = {
		hidden: { opacity: 0, y: 10 },
		visible: { opacity: 1, y: 0 },
	};

	return (
		<motion.text
			variants={containerVariants}
			initial="hidden"
			animate="visible"
			style={{
				fontStyle: "normal",
				fontVariantCaps: "normal",
				fontWeight: "normal",
				fontStretch: "normal",
				fontSize: 20,
				lineHeight: "normal",
				fontFamily: "Arial, Helvetica, sans-serif",
				fontSizeAdjust: "none",
				fontKerning: "auto",
				fontVariantAlternates: "normal",
				fontVariantLigatures: "normal",
				fontVariantNumeric: "normal",
				fontVariantEastAsian: "normal",
				fontVariantPosition: "normal",
				fontVariantEmoji: "normal",
				fontFeatureSettings: "normal",
				fontOpticalSizing: "auto",
				fontVariationSettings: "normal",
				whiteSpace: "pre",
			}}
		>
			{letters.map((char, index) => (
				<motion.tspan
					key={index}
					variants={letterVariants}
					// Position the first tspan and let others follow naturally.
					x={index === 0 ? xPosition : undefined}
					y={yPosition}
					dominantBaseline="ideographic"
				>
					{char}
				</motion.tspan>
			))}
		</motion.text>
	);
};

export default TypingAnimation;
