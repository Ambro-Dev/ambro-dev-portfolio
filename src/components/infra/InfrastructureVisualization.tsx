"use client";

import type React from "react";
import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
	Environment,
	OrbitControls,
	Text,
	Float,
	Html,
} from "@react-three/drei";
import { motion } from "framer-motion";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import type { Mesh, Group } from "three";

// Definicja typów
interface ServiceData {
	name: string;
	position: [number, number, number];
	color: string;
	description: string;
}

interface ServerProps {
	position: [number, number, number];
	color: string;
	hovered: boolean;
	selected: boolean;
	onClick: () => void;
	onPointerOver: () => void;
	onPointerOut: () => void;
	service: ServiceData;
	isMobile: boolean;
}

interface SceneProps {
	isMobile: boolean;
	lowPerformance: boolean;
}

// Główne kategorie usług infrastruktury
const services: ServiceData[] = [
	{
		name: "Serwery",
		position: [0, 0, 0],
		color: "#4361EE",
		description:
			"Zarządzanie serwerami fizycznymi i wirtualnymi, optymalizacja wydajności i monitorowanie zasobów.",
	},
	{
		name: "Chmura",
		position: [3, 2, -2],
		color: "#3A86FF",
		description:
			"Wdrażanie i utrzymanie rozwiązań chmurowych (AWS, Azure, GCP), infrastruktura jako kod (IaC).",
	},
	{
		name: "Bezpieczeństwo",
		position: [-3, 1, -1],
		color: "#FF006E",
		description:
			"Konfiguracja firewalli, VPN, WAF i zabezpieczanie infrastruktury przed zagrożeniami.",
	},
	{
		name: "Bazy Danych",
		position: [2, -2, -1],
		color: "#8338EC",
		description:
			"Administracja i optymalizacja systemów bazodanowych, automatyczne backupy i replikacja.",
	},
	{
		name: "Automatyzacja",
		position: [-2, -1, -3],
		color: "#FB5607",
		description:
			"Automatyzacja procesów IT za pomocą skryptów i narzędzi CI/CD, zmniejszając ilość pracy ręcznej.",
	},
];

// Detekcja poziomu wydajności urządzenia
const detectPerformanceLevel = (): "low" | "medium" | "high" => {
	if (typeof window === "undefined") return "medium";

	// Prosta heurystyka na podstawie liczby rdzeni CPU
	const cpuCores = navigator.hardwareConcurrency || 4;
	const isMobile =
		/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
			navigator.userAgent,
		);

	if (isMobile || cpuCores <= 2) return "low";
	if (cpuCores <= 4) return "medium";
	return "high";
};

// Model serwera (uproszczony)
function Server({
	position,
	color,
	hovered,
	selected,
	onClick,
	onPointerOver,
	onPointerOut,
	service,
	isMobile,
}: ServerProps): React.ReactNode {
	const serverRef = useRef<Mesh>(null);
	const scale = isMobile ? 0.7 : 1;
	const currentScale = hovered || selected ? scale * 1.2 : scale;

	useFrame(() => {
		if (serverRef.current) {
			serverRef.current.rotation.y += 0.01;
			// Animowanie skali zamiast używania motion.group
			serverRef.current.scale.set(
				serverRef.current.scale.x +
					(currentScale - serverRef.current.scale.x) * 0.1,
				serverRef.current.scale.y +
					(currentScale - serverRef.current.scale.y) * 0.1,
				serverRef.current.scale.z +
					(currentScale - serverRef.current.scale.z) * 0.1,
			);
		}
	});

	return (
		// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
		<group
			position={position}
			onClick={onClick}
			onPointerOver={onPointerOver}
			onPointerOut={onPointerOut}
		>
			<mesh ref={serverRef} castShadow>
				<boxGeometry args={[1, 0.3, 1.5]} />
				<meshStandardMaterial
					color={color}
					emissive={color}
					emissiveIntensity={hovered || selected ? 0.5 : 0.2}
				/>
			</mesh>

			<Text
				position={[0, 0.5, 0]}
				fontSize={0.3 * scale}
				color="white"
				anchorX="center"
				anchorY="middle"
			>
				{service.name}
			</Text>

			{selected && (
				<Html position={[0, -0.5, 0]} distanceFactor={10} center>
					<div className="bg-gray-900/80 p-2 rounded-lg text-white text-xs max-w-xs text-center">
						{service.description}
					</div>
				</Html>
			)}
		</group>
	);
}

// Reprezentacja połączeń między elementami infrastruktury
function Connections({
	lowPerformance,
}: { lowPerformance: boolean }): React.ReactNode {
	// Redukuj liczbę połączeń na słabszych urządzeniach
	const connections = lowPerformance
		? services
				.slice(0, 3)
				.map((_, i) => i) // Mniej połączeń
		: services.map((_, i) => i);

	return (
		<group>
			{connections.map((i) =>
				services
					.slice(i + 1, lowPerformance ? i + 3 : undefined)
					.map((otherService) => (
						<line key={`${services[i].name}-to-${otherService.name}`}>
							<bufferGeometry attach="geometry">
								<bufferAttribute
									args={[
										new Float32Array([
											...services[i].position,
											...otherService.position,
										]),
										3,
										false,
									]}
									attach="attributes-position"
									count={2}
									array={
										new Float32Array([
											...services[i].position,
											...otherService.position,
										])
									}
									itemSize={3}
								/>
							</bufferGeometry>
							<lineBasicMaterial
								attach="material"
								color="#ffffff"
								opacity={0.3}
								transparent
							/>
						</line>
					)),
			)}
		</group>
	);
}

// Komponent dla cząsteczek danych - optymalizowany dla różnych poziomów wydajności
function DataParticles({
	lowPerformance,
}: { lowPerformance: boolean }): React.ReactNode {
	const particles = useRef<Group>(null);
	// Dostosowanie liczby cząsteczek do wydajności urządzenia
	const particlesCount = lowPerformance ? 15 : 50;
	const particlePositions = new Float32Array(particlesCount * 3);

	for (let i = 0; i < particlesCount; i++) {
		particlePositions[i * 3] = (Math.random() - 0.5) * 10;
		particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 10;
		particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 10;
	}

	useFrame(() => {
		if (particles.current) {
			particles.current.rotation.x += 0.001;
			particles.current.rotation.y += 0.002;
		}
	});

	return (
		<points ref={particles}>
			<bufferGeometry>
				<bufferAttribute
					args={[particlePositions, 3, false]}
					attach="attributes-position"
					count={particlesCount}
					array={particlePositions}
					itemSize={3}
				/>
			</bufferGeometry>
			<pointsMaterial size={0.1} color="#4fc3f7" sizeAttenuation />
		</points>
	);
}

// Główna scena
function Scene({ isMobile, lowPerformance }: SceneProps): React.ReactNode {
	const [hoveredService, setHoveredService] = useState<number | null>(null);
	const [selectedService, setSelectedService] = useState<number | null>(null);

	return (
		<>
			<ambientLight intensity={0.5} />
			<pointLight position={[10, 10, 10]} intensity={1} castShadow />

			<DataParticles lowPerformance={lowPerformance} />
			<Connections lowPerformance={lowPerformance} />

			{services.map((service, index) => (
				<Float
					key={service.name}
					speed={2}
					rotationIntensity={0.2}
					floatIntensity={0.5}
					// Wyłącz animację pływania na słabszych urządzeniach
					enabled={!lowPerformance}
				>
					<Server
						position={service.position}
						color={service.color}
						hovered={hoveredService === index}
						selected={selectedService === index}
						onClick={() =>
							setSelectedService(index === selectedService ? null : index)
						}
						onPointerOver={() => setHoveredService(index)}
						onPointerOut={() => setHoveredService(null)}
						service={service}
						isMobile={isMobile}
					/>
				</Float>
			))}

			<OrbitControls
				enablePan={false}
				enableZoom={!isMobile}
				minDistance={5}
				maxDistance={20}
				// Zredukuj wrażliwość dla urządzeń mobilnych
				rotateSpeed={isMobile ? 0.5 : 1}
			/>

			{!lowPerformance && (
				<EffectComposer>
					<Bloom
						luminanceThreshold={0.2}
						luminanceSmoothing={0.9}
						height={300}
					/>
				</EffectComposer>
			)}
		</>
	);
}

// Alternatywny widok dla urządzeń mobilnych o niskiej wydajności
const MobileAlternativeView: React.FC = () => {
	const [selectedService, setSelectedService] = useState<number | null>(null);

	return (
		<div className="w-full p-6 bg-gray-900 rounded-lg text-white">
			<h3 className="text-xl font-bold text-center mb-4">Infrastruktura IT</h3>
			<p className="text-gray-300 text-center mb-6">
				Interaktywna wizualizacja komponentów infrastruktury IT
			</p>

			<div className="space-y-3">
				{services.map((service, index) => (
					<motion.div
						key={service.name}
						className="p-4 rounded-lg cursor-pointer"
						style={{
							backgroundColor: `${service.color}20`,
							borderLeft: `4px solid ${service.color}`,
						}}
						whileTap={{ scale: 0.98 }}
						onClick={() =>
							setSelectedService(selectedService === index ? null : index)
						}
					>
						<div className="flex items-center gap-3">
							<div
								className="w-10 h-10 rounded-full flex items-center justify-center"
								style={{ backgroundColor: service.color }}
							>
								<span className="text-white font-bold text-xs">
									{index + 1}
								</span>
							</div>
							<h4 className="font-bold text-white">{service.name}</h4>
						</div>

						{selectedService === index && (
							<motion.p
								className="text-sm text-gray-300 mt-3"
								initial={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: "auto" }}
								transition={{ duration: 0.3 }}
							>
								{service.description}
							</motion.p>
						)}
					</motion.div>
				))}
			</div>
		</div>
	);
};

// Komponent kontrolujący responsywność
const ResponsiveInfrastructureVisualization: React.FC = () => {
	const [isMobile, setIsMobile] = useState<boolean>(false);
	const [isMounted, setIsMounted] = useState<boolean>(false);
	const [performanceLevel, setPerformanceLevel] = useState<
		"low" | "medium" | "high"
	>("medium");
	const canvasRef = useRef<HTMLDivElement>(null);

	// Wykrywanie urządzenia mobilnego i poziomu wydajności
	useEffect(() => {
		setIsMounted(true);

		const checkDevice = () => {
			setIsMobile(window.innerWidth < 768);
			setPerformanceLevel(detectPerformanceLevel());
		};

		checkDevice();
		window.addEventListener("resize", checkDevice);
		return () => window.removeEventListener("resize", checkDevice);
	}, []);

	// Jeśli komponent nie jest jeszcze zamontowany (SSR), nie renderuj nic
	if (!isMounted) {
		return (
			<div className="w-full h-80 bg-gray-900 rounded-lg flex items-center justify-center animate-pulse">
				<div className="text-gray-400">Ładowanie wizualizacji...</div>
			</div>
		);
	}

	// Dla bardzo słabych urządzeń lub małych ekranów, użyj alternatywnego widoku
	const shouldUseAlternativeView = performanceLevel === "low" && isMobile;

	return (
		<div className="w-full">
			{shouldUseAlternativeView ? (
				<MobileAlternativeView />
			) : (
				<div
					ref={canvasRef}
					className="w-full h-96 bg-black rounded-lg shadow-lg overflow-hidden"
				>
					<Canvas
						shadows
						camera={{ position: isMobile ? [0, 0, 15] : [0, 0, 10], fov: 60 }}
					>
						<Environment preset="city" />
						<Scene
							isMobile={isMobile}
							lowPerformance={performanceLevel === "low"}
						/>
					</Canvas>
					<div className="p-4 bg-gray-900 border-t border-gray-800 text-gray-300 text-xs md:text-sm">
						<p className="text-center">
							{isMobile
								? "Dotknij elementów, aby poznać szczegóły"
								: "Kliknij na elementy, aby poznać szczegóły. Użyj myszy, aby obracać widok."}
						</p>
					</div>
				</div>
			)}
		</div>
	);
};

// Renamed to match file name for consistency
const InfrastructureVisualization = ResponsiveInfrastructureVisualization;
export default InfrastructureVisualization;
