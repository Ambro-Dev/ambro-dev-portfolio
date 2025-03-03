"use client";

import { cn } from "@/lib/utils";
import { motion, useAnimation } from "framer-motion";
import React, { useEffect } from "react";

type AnimatedLogoProps = {
	className?: string;
};

const AnimatedLogo = ({ className }: AnimatedLogoProps) => {
	const controls = useAnimation();

	useEffect(() => {
		controls.start({
			pathLength: [0, 2],
			transition: {
				duration: 5, // Adjust the duration to control speed
				ease: "easeInOut",
			},
		});
	}, [controls]);

	return (
		<div className={cn(className)}>
			<motion.svg
				xmlns="http://www.w3.org/2000/svg"
				xmlnsXlink="http://www.w3.org/1999/xlink"
				width="300"
				height="300"
				viewBox="0 0 375 374.999991"
				preserveAspectRatio="xMidYMid meet"
				version="1.0"
			>
				<motion.g
					stroke="#ffffff"
					strokeWidth="2"
					fill="#ffffff"
					initial={{ fillOpacity: 0 }}
					animate={{ fillOpacity: 1 }}
					transition={{ duration: 2, delay: 2 }}
				>
					<g transform="translate(71.733526, 299.428909)">
						<motion.path
							d="M 67.875 -167.671875 L 97.21875 -110.0625 L 40.71875 0 L -18.34375 0 Z M 165.46875 -41.09375 L 92.09375 -41.09375 L 118.140625 -92.453125 L 139.046875 -92.453125 L 83.65625 -199.21875 L 113.375 -256.453125 L 245.8125 0 L 186.375 0 Z M 165.46875 -41.09375 "
							strokeDasharray="0 1"
							initial={{ pathLength: 0 }}
							animate={controls}
						/>
					</g>
				</motion.g>
			</motion.svg>
		</div>
	);
};

export default AnimatedLogo;
