// src/components/3d/service-card-canvas.tsx
"use client";

import React, { useRef, memo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useSpring, animated } from "@react-spring/three";
import { Environment, ContactShadows, Float } from "@react-three/drei";
import type * as THREE from "three";

// Interfejs ServiceIconProps
interface ServiceIconProps {
  serviceId: string;
  isHovered: boolean;
  color: string;
  performance?: "high" | "medium" | "low";
  pauseAnimations?: boolean;
}

// Convert color name to hex
const getColorHex = (colorName: string): string => {
  const colorMap: { [key: string]: string } = {
    indigo: "#6366f1",
    blue: "#3b82f6",
    emerald: "#10b981",
    sky: "#0ea5e9",
    purple: "#a855f7",
    amber: "#f59e0b",
    pink: "#ec4899",
  };

  return colorMap[colorName] || "#6366f1"; // Default to indigo if not found
};

// 3D Service Icon - zoptymalizowany, zaimplementowany jako memo
const ServiceIcon = memo(
  ({
    serviceId,
    isHovered,
    color,
    performance = "medium",
    pauseAnimations = false,
  }: ServiceIconProps) => {
    const meshRef = useRef<THREE.Mesh>(null);

    // Stałe wartości zamiast stanów - redukcja złożoności
    const rotationSpeed = performance === "high" ? 0.15 : 0.3;
    const bounceAmount = performance === "high" ? 0.02 : 0.05;
    const hoverMultiplier = performance === "high" ? 1.5 : 2;

    // Convert color name to hex
    const colorHex = getColorHex(color);

    // Optymalizacja animacji - mniej obciążające sprężyny
    const springs = useSpring<{
      scale: number;
      rotation: [number, number, number];
    }>({
      scale: isHovered ? 1.1 : 1, // Mniejsza skala na hover
      rotation: isHovered ? [0, Math.PI, 0] : [0, 0, 0], // Mniejsza rotacja
      config: {
        mass: 1,
        tension: 170,
        friction: performance === "high" ? 26 : 20, // Większe tarcie dla trybu wysokiej wydajności
      },
    });

    // Zoptymalizowana animacja ciągła
    useFrame((state) => {
      if (meshRef.current) {
        // Płynniejsza i mniej intensywna rotacja
        meshRef.current.rotation.y =
          state.clock.getElapsedTime() * rotationSpeed;

        // Mniej intensywny ruch góra-dół
        if (isHovered) {
          meshRef.current.position.y =
            Math.sin(state.clock.getElapsedTime() * hoverMultiplier) *
            bounceAmount;
        } else {
          // Zerujemy pozycję gdy nie jest hoveredowany - mniej obliczeń
          meshRef.current.position.y =
            Math.sin(state.clock.getElapsedTime()) * bounceAmount * 0.5;
        }
      }
    });

    // Geometrie z drastycznie zredukowaną złożonością podczas przejść
    const renderShape = () => {
      // Ultra-prosta geometria podczas zmiany filtra
      if (pauseAnimations) {
        switch (serviceId) {
          case "infrastructure":
            return <torusKnotGeometry args={[0.8, 0.3, 8, 4]} />;
          case "servers":
            return <boxGeometry args={[1.2, 1.2, 1.2]} />;
          case "monitoring":
            return <sphereGeometry args={[1, 6, 6]} />;
          case "security":
            return <octahedronGeometry args={[1]} />;
          case "databases":
            return <cylinderGeometry args={[0.8, 0.8, 1.5, 8]} />;
          case "deployment":
            return <dodecahedronGeometry args={[1]} />;
          case "webapps":
            return <tetrahedronGeometry args={[1.2]} />;
          case "architecture":
            return <icosahedronGeometry args={[1]} />;
          default:
            return <sphereGeometry args={[1, 6, 6]} />;
        }
      }

      // Wyższe detale gdy nie ma zmiany filtra
      const useHighDetail = performance !== "high";

      switch (serviceId) {
        case "infrastructure":
          return (
            <torusKnotGeometry
              args={useHighDetail ? [0.8, 0.3, 128, 32] : [0.8, 0.3, 100, 16]}
            />
          );
        case "servers":
          return <boxGeometry args={[1.2, 1.2, 1.2]} />;
        case "monitoring":
          return (
            <sphereGeometry args={useHighDetail ? [1, 48, 48] : [1, 32, 32]} />
          );
        case "security":
          return <octahedronGeometry args={useHighDetail ? [1, 2] : [1]} />;
        case "databases":
          return (
            <cylinderGeometry
              args={useHighDetail ? [0.8, 0.8, 1.5, 48] : [0.8, 0.8, 1.5, 32]}
            />
          );
        case "deployment":
          return <dodecahedronGeometry args={useHighDetail ? [1, 1] : [1]} />;
        case "webapps":
          return <tetrahedronGeometry args={[1.2]} />;
        case "architecture":
          return <icosahedronGeometry args={useHighDetail ? [1, 1] : [1]} />;
        default:
          return (
            <sphereGeometry args={useHighDetail ? [1, 48, 48] : [1, 32, 32]} />
          );
      }
    };

    return (
      <animated.mesh
        ref={meshRef}
        scale={springs.scale}
        rotation={springs.rotation}
      >
        {renderShape()}
        <animated.meshStandardMaterial
          color={colorHex}
          metalness={pauseAnimations ? 0.5 : 0.7}
          roughness={pauseAnimations ? 0.5 : 0.3}
          emissive={colorHex}
          emissiveIntensity={pauseAnimations ? 0.1 : isHovered ? 0.4 : 0.2}
          // Poniższe parametry są kosztowne obliczeniowo, więc wyłączamy je podczas zmiany filtra
          flatShading={pauseAnimations}
        />
      </animated.mesh>
    );
  }
);

ServiceIcon.displayName = "ServiceIcon";

// Interfejs dla propsów głównego komponentu ServiceCardCanvas
interface ServiceCardCanvasProps {
  serviceId: string;
  isHovered: boolean;
  color: string;
  performance?: "high" | "medium" | "low";
  pauseAnimations?: boolean;
}

// Główny komponent Canvas zoptymalizowany jako memo
const ServiceCardCanvas = memo(
  ({
    serviceId,
    isHovered,
    color,
    performance = "medium",
  }: ServiceCardCanvasProps) => {
    // Usunięto opóźnione renderowanie, które powodowało problemy

    // Optymalizacja parametrów Canvas na podstawie trybu wydajności
    const dpr: [number, number] = [1, 2]; // Ograniczenie maksymalnego DPR

    // Wybór presetu środowiska na podstawie wydajności
    const environmentPreset = performance === "high" ? "apartment" : "city";

    return (
      <div className="w-full h-full">
        <Canvas
          camera={{ position: [0, 0, 6], fov: 50 }}
          dpr={dpr}
          style={{ background: "transparent" }}
          frameloop="always" // Zawsze renderuj - "demand" powodowało problemy
        >
          <ambientLight intensity={0.5} />
          <spotLight
            position={[10, 10, 10]}
            angle={0.15}
            penumbra={1}
            intensity={1}
          />

          {/* Usunięto pointLight dla lepszej wydajności w trybie wysokiej wydajności */}
          {performance !== "high" && (
            <pointLight position={[-10, -10, -10]} intensity={0.5} />
          )}

          {/* Zoptymalizowany Float z mniejszą intensywnością */}
          <Float
            speed={1.5}
            rotationIntensity={isHovered ? 0.3 : 0.1}
            floatIntensity={isHovered ? 0.6 : 0.3}
          >
            <ServiceIcon
              serviceId={serviceId}
              isHovered={isHovered}
              color={color}
              performance={performance}
            />
          </Float>

          {/* Cienie tylko gdy nie jest w trybie wysokiej wydajności */}
          {performance !== "high" && (
            <ContactShadows
              position={[0, -1.5, 0]}
              opacity={0.3}
              scale={3.5}
              blur={2}
              far={4}
            />
          )}

          {/* Uproszczone środowisko dla trybu wysokiej wydajności */}
          <Environment preset={environmentPreset} />
        </Canvas>
      </div>
    );
  }
);

ServiceCardCanvas.displayName = "ServiceCardCanvas";

export default ServiceCardCanvas;
