"use client";

import type React from "react";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Komponent ładowania
const LoadingFallback: React.FC = () => (
	<div className="w-full h-64 md:h-96 flex flex-col items-center justify-center bg-gray-900 rounded-lg animate-pulse">
		<div className="w-12 h-12 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin mb-4" />
		<p className="text-gray-400">Ładowanie wizualizacji...</p>
	</div>
);

// Alternatywny widok dla małych ekranów
const MobileAlternative: React.FC<{
	title: string;
	description: string;
}> = ({ title, description }) => (
	<div className="w-full p-6 bg-gray-900 rounded-lg text-white">
		<h3 className="text-xl font-bold text-center mb-4">{title}</h3>
		<p className="text-gray-300 text-center mb-4">{description}</p>
		<div className="flex flex-wrap justify-center gap-3">
			{[
				"Serwery",
				"Chmura",
				"Bezpieczeństwo",
				"Bazy Danych",
				"Automatyzacja",
			].map((item) => (
				<div
					key={item}
					className="px-4 py-2 bg-blue-900/30 rounded-full text-sm"
				>
					{item}
				</div>
			))}
		</div>
	</div>
);

type ResponsiveVisualizationProps = {
	visualizationComponent: React.ComponentType;
	title: string;
	description: string;
	minScreenWidth?: number; // Minimalna szerokość ekranu w px, poniżej której pokazuje się alternatywa
};

const ResponsiveVisualization: React.FC<ResponsiveVisualizationProps> = ({
	visualizationComponent: VisualizationComponent,
	title,
	description,
	minScreenWidth = 768, // Domyślnie tablet (md)
}) => {
	const [isMounted, setIsMounted] = useState(false);
	const [screenWidth, setScreenWidth] = useState(0);

	useEffect(() => {
		setIsMounted(true);
		setScreenWidth(window.innerWidth);

		const handleResize = () => {
			setScreenWidth(window.innerWidth);
		};

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	// Dopóki komponent nie jest zamontowany (SSR), pokaż loading
	if (!isMounted) return <LoadingFallback />;

	// Na małych ekranach pokaż alternatywny widok
	if (screenWidth < minScreenWidth) {
		return <MobileAlternative title={title} description={description} />;
	}

	// Na większych ekranach pokaż wizualizację 3D
	return <VisualizationComponent />;
};

// Przykład użycia:
// Dynamiczny import komponentu 3D
const InfrastructureVisualizationDynamic = dynamic(
	() => import("@/components/infra/InfrastructureVisualization"),
	{ ssr: false, loading: () => <LoadingFallback /> },
);

export const ResponsiveInfrastructureVisualization: React.FC = () => (
	<ResponsiveVisualization
		visualizationComponent={InfrastructureVisualizationDynamic}
		title="Wizualizacja Infrastruktury IT"
		description="Interaktywny model pokazujący komponenty nowoczesnej infrastruktury IT. Dostępny na większych ekranach."
	/>
);

export default ResponsiveVisualization;
