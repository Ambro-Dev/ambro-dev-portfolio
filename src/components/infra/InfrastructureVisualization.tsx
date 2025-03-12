"use client";

import type React from "react";
import { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  OrbitControls,
  Text,
  Float,
  Html,
  Sparkles,
  PerspectiveCamera,
  MeshTransmissionMaterial,
  MeshDistortMaterial,
  Sphere,
  Trail,
  Sky,
} from "@react-three/drei";
import { AnimatePresence, motion } from "framer-motion";
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
} from "@react-three/postprocessing";
import type { Mesh, Group } from "three";
import { Vector3, Color } from "three";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/glass-components";

// Definicja typów
interface ServiceData {
  name: string;
  position: [number, number, number];
  color: string;
  description: string;
  icon?: string;
}

interface DataFlowProps {
  from: [number, number, number];
  to: [number, number, number];
  color: string;
  speed?: number;
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
  onSelectService: (service: ServiceData | null) => void;
  selectedService: ServiceData | null;
}

// Zaktualizowane dane usług z bardziej subtelnymi kolorami
const services: ServiceData[] = [
  {
    name: "Serwery",
    position: [0, 0, 0],
    color: "#818cf8", // indigo-400
    description:
      "Zarządzanie serwerami fizycznymi i wirtualnymi, optymalizacja wydajności i monitorowanie zasobów.",
    icon: "server",
  },
  {
    name: "Chmura",
    position: [3, 2, -2],
    color: "#60a5fa", // blue-400
    description:
      "Wdrażanie i utrzymanie rozwiązań chmurowych (AWS, Azure, GCP), infrastruktura jako kod (IaC).",
    icon: "cloud",
  },
  {
    name: "Bezpieczeństwo",
    position: [-3, 1, -1],
    color: "#c084fc", // violet-400
    description:
      "Konfiguracja firewalli, VPN, WAF i zabezpieczanie infrastruktury przed zagrożeniami.",
    icon: "shield",
  },
  {
    name: "Bazy Danych",
    position: [2, -2, -1],
    color: "#4ade80", // green-400
    description:
      "Administracja i optymalizacja systemów bazodanowych, automatyczne backupy i replikacja.",
    icon: "database",
  },
  {
    name: "Automatyzacja",
    position: [-2, -1, -3],
    color: "#38bdf8", // sky-400
    description:
      "Automatyzacja procesów IT za pomocą skryptów i narzędzi CI/CD, zmniejszając ilość pracy ręcznej.",
    icon: "automation",
  },
];

// Dane o połączeniach między usługami
const connections = [
  { from: "Serwery", to: "Chmura" },
  { from: "Serwery", to: "Bazy Danych" },
  { from: "Serwery", to: "Bezpieczeństwo" },
  { from: "Chmura", to: "Automatyzacja" },
  { from: "Bazy Danych", to: "Automatyzacja" },
  { from: "Bezpieczeństwo", to: "Chmura" },
];

// Detekcja poziomu wydajności urządzenia
const detectPerformanceLevel = (): "low" | "medium" | "high" => {
  if (typeof window === "undefined") return "medium";

  // Prosta heurystyka na podstawie liczby rdzeni CPU
  const cpuCores = navigator.hardwareConcurrency || 4;
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

  if (isMobile || cpuCores <= 2) return "low";
  if (cpuCores <= 4) return "medium";
  return "high";
};

// Komponent animowanego przepływu danych
function DataFlow({ from, to, color, speed = 1 }: DataFlowProps) {
  const ref = useRef<Group>(null);

  // Utwórz wektor dla pozycji początkowej i końcowej
  const startPosition = useMemo(() => new Vector3(...from), [from]);
  const endPosition = useMemo(() => new Vector3(...to), [to]);

  // Oblicz kierunek i długość

  // Animuj ruch pakietu danych
  useFrame(({ clock }) => {
    if (ref.current) {
      // Używamy czasu zegara do animacji
      const t = (clock.getElapsedTime() * speed) % 1;
      const position = new Vector3().copy(startPosition).lerp(endPosition, t);
      ref.current.position.copy(position);
    }
  });

  return (
    <>
      {/* Linia połączenia */}
      <line>
        <bufferGeometry attach="geometry">
          <bufferAttribute
            attach="attributes-position"
            args={[
              new Float32Array([
                ...startPosition.toArray(),
                ...endPosition.toArray(),
              ]),
              3,
            ]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          attach="material"
          color={color}
          opacity={0.2}
          transparent
          linewidth={1}
        />
      </line>

      {/* Pakiet danych poruszający się po linii */}
      <group ref={ref}>
        <Trail width={0.1} length={5} color={color} attenuation={(t) => t * t}>
          <mesh>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshBasicMaterial color={color} />
          </mesh>
        </Trail>
      </group>
    </>
  );
}

// Komponent serwera 3D z zaawansowanymi materiałami
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
  const threeColor = new Color(color);
  const scale = isMobile ? 0.7 : 0.9;
  const currentScale = hovered || selected ? scale * 1.15 : scale;
  const glowIntensity = hovered || selected ? 0.5 : 0.2;

  // Animacja ruchu i rotacji
  useFrame((state) => {
    if (serverRef.current) {
      // Delikatna rotacja
      serverRef.current.rotation.y += 0.003;

      // Płynne przejście skali
      serverRef.current.scale.lerp(
        new Vector3(currentScale, currentScale, currentScale),
        0.1
      );

      // Delikatne unoszenie się
      const hoverOffset = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.05;
      serverRef.current.position.y =
        position[1] + (selected || hovered ? hoverOffset : 0);
    }
  });

  return (
    <Float
      speed={selected || hovered ? 3 : 1}
      rotationIntensity={0.2}
      floatIntensity={0.3}
      position={position}
    >
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
      <group
        onClick={onClick}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
      >
        {/* Neon glow effect */}
        <Sphere args={[0.6, 16, 16]}>
          <MeshDistortMaterial
            color={color}
            opacity={0.15}
            transparent
            distort={0.3}
            speed={2}
          />
        </Sphere>

        {/* Main server mesh */}
        <mesh ref={serverRef} castShadow receiveShadow>
          <boxGeometry args={[0.8, 0.2, 1]} />
          <MeshTransmissionMaterial
            background={threeColor}
            backside
            transmission={0.8}
            thickness={0.5}
            chromaticAberration={0.2}
            roughness={0.2}
            ior={1.5}
            distortion={0.2}
            distortionScale={0.5}
            temporalDistortion={0.2}
            color={color}
            attenuationDistance={0.5}
            attenuationColor={color}
            emissive={color}
            emissiveIntensity={glowIntensity}
          />
        </mesh>

        {/* Text label */}
        <Text
          position={[0, 0.7, 0]}
          fontSize={0.25 * scale}
          color="white"
          anchorX="center"
          anchorY="middle"
          font="/fonts/Inter-Light.woff"
          outlineColor={color}
          outlineWidth={0.01}
        >
          {service.name}
        </Text>

        {/* Tooltip shown when selected */}
        {selected && (
          <Html position={[0, -0.5, 0]} center distanceFactor={10} transform>
            <div className="bg-slate-900/90 backdrop-blur-sm border border-white/10 px-3 py-2 rounded-md text-white text-xs max-w-xs text-center shadow-lg">
              {service.description}
            </div>
          </Html>
        )}

        {/* Sparkle effect around hovered or selected items */}
        {(selected || hovered) && (
          <Sparkles
            count={30}
            scale={[1.5, 1, 1.5]}
            size={0.4}
            speed={0.2}
            opacity={0.2}
            color={color}
          />
        )}
      </group>
    </Float>
  );
}

// Główna scena 3D
function Scene({
  isMobile,
  lowPerformance,
  onSelectService,
  selectedService,
}: SceneProps): React.ReactNode {
  const [hoveredService, setHoveredService] = useState<number | null>(null);
  const cameraPosition = useMemo<[number, number, number]>(() => [0, 0, 8], []);
  const { camera } = useThree();

  // Generate connections data from services
  const dataFlows = useMemo(() => {
    const flows: {
      from: [number, number, number];
      to: [number, number, number];
      color: string;
      speed: number;
    }[] = [];

    for (const conn of connections) {
      const fromService = services.find((s) => s.name === conn.from);
      const toService = services.find((s) => s.name === conn.to);

      if (fromService && toService) {
        flows.push({
          from: fromService.position,
          to: toService.position,
          color: fromService.color,
          speed: Math.random() * 0.5 + 0.5, // Random speed between 0.5 and 1
        });
      }
    }

    return flows;
  }, []);

  // Focus camera on selected service
  useEffect(() => {
    if (selectedService) {
      const targetPosition: [number, number, number] = [
        selectedService.position[0] * 0.5,
        selectedService.position[1] * 0.5,
        selectedService.position[2] + 5,
      ];

      // Animate camera position change
      const interval = setInterval(() => {
        camera.position.lerp(new Vector3(...targetPosition), 0.05);
        if (camera.position.distanceTo(new Vector3(...targetPosition)) < 0.1) {
          clearInterval(interval);
        }
      }, 16);

      return () => clearInterval(interval);
    }
    // Reset camera position
    const defaultPosition: [number, number, number] = [0, 0, 8];

    const interval = setInterval(() => {
      camera.position.lerp(new Vector3(...defaultPosition), 0.05);
      if (camera.position.distanceTo(new Vector3(...defaultPosition)) < 0.1) {
        clearInterval(interval);
      }
    }, 16);

    return () => clearInterval(interval);
  }, [selectedService, camera]);

  return (
    <>
      {/* Background environment */}
      <color attach="background" args={["#0a0f1c"]} />
      <fog attach="fog" args={["#0a0f1c", 8, 25]} />
      <Environment preset="night" />

      {/* Ambient lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.5} castShadow />
      <pointLight position={[-10, -10, -10]} intensity={0.2} color="#60a5fa" />

      {/* Sky with subtle stars */}
      {!lowPerformance && (
        <Sky
          distance={450000}
          sunPosition={[0, 0, -1]}
          inclination={0}
          azimuth={0.25}
          mieCoefficient={0.001}
          mieDirectionalG={0.99}
          rayleigh={0.5}
          turbidity={10}
        />
      )}

      {/* Decorative background particles */}
      <Sparkles
        count={lowPerformance ? 100 : 300}
        scale={50}
        size={1}
        speed={0.1}
        opacity={0.1}
        color="#ffffff"
      />

      {/* Data flow animations */}
      {!lowPerformance &&
        dataFlows.map((flow, index) => (
          <DataFlow
            key={`flow-${
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              index
            }`}
            from={flow.from}
            to={flow.to}
            color={flow.color}
            speed={flow.speed}
          />
        ))}

      {/* Service nodes */}
      {services.map((service, index) => (
        <Server
          key={service.name}
          position={service.position}
          color={service.color}
          hovered={hoveredService === index}
          selected={selectedService?.name === service.name}
          onClick={() =>
            onSelectService(
              selectedService?.name === service.name ? null : service
            )
          }
          onPointerOver={() => setHoveredService(index)}
          onPointerOut={() => setHoveredService(null)}
          service={service}
          isMobile={isMobile}
        />
      ))}

      {/* Camera controls */}
      <OrbitControls
        enablePan={false}
        enableZoom={!isMobile}
        minDistance={4}
        maxDistance={15}
        rotateSpeed={isMobile ? 0.5 : 0.8}
        dampingFactor={0.05}
        autoRotate={!selectedService}
        autoRotateSpeed={0.5}
      />

      {/* Post-processing effects */}
      {!lowPerformance && (
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
            intensity={0.3}
          />
          <ChromaticAberration offset={[0.0005, 0.0005]} />
        </EffectComposer>
      )}

      {/* Camera */}
      <PerspectiveCamera
        makeDefault
        position={cameraPosition}
        fov={50}
        near={0.1}
        far={1000}
      />
    </>
  );
}

// Panel informacyjny o wybranej usłudze
const ServiceInfoPanel: React.FC<{
  service: ServiceData | null;
  onClose: () => void;
}> = ({ service, onClose }) => {
  if (!service) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-md z-10 px-4"
    >
      <GlassCard
        blur="md"
        opacity={30}
        className="p-4 backdrop-blur-xl shadow-xl border border-gray-700/50"
      >
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: service.color }}
            >
              <span className="text-white text-xl">
                {service.name.charAt(0)}
              </span>
            </div>
            <h3 className="text-lg font-medium text-white">{service.name}</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 rounded-full"
          >
            <span className="sr-only">Zamknij</span>✕
          </Button>
        </div>
        <p className="text-gray-300 text-sm mb-3">{service.description}</p>
        <div className="mt-2 text-right">
          <Button
            variant="outline"
            size="sm"
            className="text-xs border-gray-700 text-blue-400 hover:text-blue-300 hover:bg-gray-800/50"
          >
            Więcej szczegółów
          </Button>
        </div>
      </GlassCard>
    </motion.div>
  );
};

// Alternatywny widok dla urządzeń o niskiej wydajności
const MobileAlternativeView: React.FC<{
  onSelectService: (service: ServiceData | null) => void;
  selectedService: ServiceData | null;
}> = ({ onSelectService, selectedService }) => {
  return (
    <GlassCard
      className="w-full p-5 rounded-lg"
      blur="md"
      opacity={15}
      highlight={true}
    >
      <h3 className="text-xl font-light text-white text-center mb-4 tracking-wide">
        Infrastruktura IT
      </h3>
      <p className="text-slate-300 text-center mb-6 text-sm font-light">
        Komponenty infrastruktury IT i ich powiązania
      </p>

      <div className="space-y-2">
        {services.map((service) => (
          <motion.div
            key={service.name}
            className="p-3 rounded-md cursor-pointer backdrop-blur-sm transition-all"
            style={{
              backgroundColor: `${service.color}10`,
              borderLeft: `2px solid ${service.color}80`,
            }}
            whileHover={{
              backgroundColor: `${service.color}15`,
              x: 2,
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() =>
              onSelectService(
                selectedService?.name === service.name ? null : service
              )
            }
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${service.color}30` }}
              >
                <span className="text-white text-xs font-light">
                  {service.name.charAt(0)}
                </span>
              </div>
              <h4 className="font-light text-white text-sm">{service.name}</h4>
            </div>

            {selectedService?.name === service.name && (
              <motion.p
                className="text-xs text-slate-300 mt-2 font-light leading-relaxed"
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
    </GlassCard>
  );
};

// Główny komponent
const Modern3DInfrastructureVisualization: React.FC = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [performanceLevel, setPerformanceLevel] = useState<
    "low" | "medium" | "high"
  >("medium");
  const [selectedService, setSelectedService] = useState<ServiceData | null>(
    null
  );

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

  // Handler for selecting a service
  const handleSelectService = (service: ServiceData | null) => {
    setSelectedService(service);
  };

  // Jeśli komponent nie jest jeszcze zamontowany (SSR), pokaż loading
  if (!isMounted) {
    return (
      <div className="w-full h-80 bg-slate-950/50 backdrop-blur-sm rounded-lg flex items-center justify-center">
        <div className="text-slate-400 font-light">
          Ładowanie wizualizacji...
        </div>
      </div>
    );
  }

  // Dla bardzo słabych urządzeń lub małych ekranów, użyj alternatywnego widoku
  const shouldUseAlternativeView = performanceLevel === "low" && isMobile;

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7 }}
    >
      {shouldUseAlternativeView ? (
        <MobileAlternativeView
          onSelectService={handleSelectService}
          selectedService={selectedService}
        />
      ) : (
        <div
          ref={canvasRef}
          className="w-full h-[500px] bg-slate-950/70 rounded-lg overflow-hidden relative"
        >
          <Canvas
            shadows
            gl={{ antialias: true }}
            dpr={[1, performanceLevel === "high" ? 2 : 1.5]}
          >
            <Scene
              isMobile={isMobile}
              lowPerformance={performanceLevel === "low"}
              onSelectService={handleSelectService}
              selectedService={selectedService}
            />
          </Canvas>

          {/* Info panel for selected service */}
          <motion.div className="absolute bottom-0 left-0 right-0 z-10">
            <AnimatePresence>
              {selectedService && (
                <ServiceInfoPanel
                  service={selectedService}
                  onClose={() => setSelectedService(null)}
                />
              )}
            </AnimatePresence>
          </motion.div>

          <div className="absolute top-4 left-4 z-10">
            <div className="bg-slate-900/60 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs text-slate-300">
              {selectedService
                ? `Wybrany komponent: ${selectedService.name}`
                : "Kliknij komponent, aby zobaczyć szczegóły"}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Modern3DInfrastructureVisualization;
