"use client";

import { motion } from "framer-motion";
import type React from "react";
import { useRef, useState } from "react";
import { ScaledContainer } from "./ScaledContainer";
import AdminPanelPreview from "./admin/AdminPanelProvider";

const AnimatedPanel: React.FC = () => {
	const cardRef = useRef<HTMLDivElement>(null);
	const [rotation, setRotation] = useState({ x: 0, y: 0 });
	const defaultRotation = { x: 5, y: -5 }; // Domyślne przechylenie: dół i prawa strona bliżej

	const handleMouseMove = (e: React.MouseEvent) => {
		if (!cardRef.current) return;
		const rect = cardRef.current.getBoundingClientRect();
		const cardWidth = rect.width;
		const cardHeight = rect.height;
		const centerX = rect.left + cardWidth / 2;
		const centerY = rect.top + cardHeight / 2;
		const x = e.clientX - centerX;
		const y = e.clientY - centerY;
		// Obliczamy dodatkową rotację w zależności od pozycji kursora
		const rotateX = (y / (cardHeight / 2)) * 3;
		const rotateY = (-x / (cardWidth / 2)) * 3;
		setRotation({ x: rotateX, y: rotateY });
	};

	const handleMouseLeave = () => {
		setRotation({ x: 0, y: 0 });
	};

	return (
		<motion.div
			ref={cardRef}
			onMouseMove={handleMouseMove}
			onMouseLeave={handleMouseLeave}
			// Ustawiamy element tak, aby był szerszy i wystawał poza ekran po prawej stronie
			className="bg-transparent rounded-lg shadow-xl w-[150%] ml-auto"
			style={{
				transform: `perspective(1000px) rotateX(${
					defaultRotation.x + rotation.x
				}deg) rotateY(${defaultRotation.y + rotation.y}deg)`,
				transition: "transform 0.2s ease-out",
			}}
		>
			{/* Wewnętrzny wrapper odpowiada tylko za efekt zoomu */}
			<motion.div className="w-full h-full">
				{/* Skalujemy zawartość, by była mniejsza */}
				<ScaledContainer className="overflow-hidden aspect-video border-[1px] border-gray-800 rounded-lg shadow-slate-700 shadow-2xl">
					<AdminPanelPreview />
				</ScaledContainer>
			</motion.div>
		</motion.div>
	);
};

export default AnimatedPanel;
