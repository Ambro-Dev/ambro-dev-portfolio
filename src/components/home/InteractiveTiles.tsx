"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { motion } from "framer-motion-3d";
import { useEffect, useState } from "react";

type Role = string;

type Connection = [number, number];

const roles: Role[] = [
	"DevOps Engineer",
	"Fullstack Developer",
	"Inżynier Automatyzacji",
	"Cloud Engineer",
	"Security Specialist",
	"Software Architect",
	"Data Engineer",
	"Machine Learning Engineer",
];

type TileProps = {
	position: [number, number, number];
	text: string;
	active: boolean;
	onClick: () => void;
};

function Tile({ position, active, onClick }: TileProps) {
	return (
		<motion.mesh
			position={position}
			onClick={onClick}
			animate={{ scale: active ? 1.2 : 1 }}
			transition={{ duration: 0.3 }}
		>
			<boxGeometry args={[1.5, 1, 0.1]} />
			<meshStandardMaterial color={active ? "#ff9900" : "#00aaff"} />
		</motion.mesh>
	);
}

export default function InteractiveTiles() {
	const [activeIndex, setActiveIndex] = useState<number | null>(null);
	const [connections, setConnections] = useState<Connection[]>([]);

	useEffect(() => {
		const generateConnections = () => {
			const conns: Connection[] = [];
			for (let i = 0; i < roles.length - 1; i++) {
				conns.push([i, i + 1]);
			}
			setConnections(conns);
		};
		generateConnections();
	}, []);

	return (
		<Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
			<ambientLight intensity={0.5} />
			<pointLight position={[10, 10, 10]} />
			<OrbitControls />
			{roles.map((role, index) => (
				<Tile
					key={role}
					position={[(index % 3) - 1, Math.floor(index / 3) - 1, 0]}
					text={role}
					active={activeIndex === index}
					onClick={() => setActiveIndex(index)}
				/>
			))}
			{connections.map(([start, end], index) => (
				<motion.lineSegments
					key={index}
					animate={{
						color:
							activeIndex === start || activeIndex === end
								? "#ff9900"
								: "#00aaff",
					}}
				>
					<bufferGeometry>
						<bufferAttribute
							attach="attributes-position"
							args={[
								new Float32Array([
									(start % roles.length) - 1,
									Math.floor(start / 3) - 1,
									0,
									(end % roles.length) - 1,
									Math.floor(end / 3) - 1,
									0,
								]),
								3, // itemSize
							]}
						/>
					</bufferGeometry>
					<lineBasicMaterial attach="material" color="#00aaff" />
				</motion.lineSegments>
			))}
		</Canvas>
	);
}
