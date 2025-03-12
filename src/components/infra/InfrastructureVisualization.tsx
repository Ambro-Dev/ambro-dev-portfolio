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
  Sparkles,
  AccumulativeShadows,
  RandomizedLight,
} from "@react-three/drei";
import { motion } from "framer-motion";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import type { Mesh, Group } from "three";
import { GlassCard } from "@/components/glass-components";

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

// Zaktualizowane dane usług z bardziej subtelnymi kolorami
const services: ServiceData[] = [
  {
    name: "Serwery",
    position: [0, 0, 0],
    color: "#818cf8", // indigo-400
    description:
      "Zarządzanie serwerami fizycznymi i wirtualnymi, optymalizacja wydajności i monitorowanie zasobów.",
  },
  {
    name: "Chmura",
    position: [3, 2, -2],
    color: "#60a5fa", // blue-400
    description:
      "Wdrażanie i utrzymanie rozwiązań chmurowych (AWS, Azure, GCP), infrastruktura jako kod (IaC).",
  },
  {
    name: "Bezpieczeństwo",
    position: [-3, 1, -1],
    color: "#c084fc", // violet-400
    description:
      "Konfiguracja firewalli, VPN, WAF i zabezpieczanie infrastruktury przed zagrożeniami.",
  },
  {
    name: "Bazy Danych",
    position: [2, -2, -1],
    color: "#4ade80", // green-400
    description:
      "Administracja i optymalizacja systemów bazodanowych, automatyczne backupy i replikacja.",
  },
  {
    name: "Automatyzacja",
    position: [-2, -1, -3],
    color: "#38bdf8", // sky-400
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
      navigator.userAgent
    );

  if (isMobile || cpuCores <= 2) return "low";
  if (cpuCores <= 4) return "medium";
  return "high";
};

// Udoskonalony komponent serwera
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
  const scale = isMobile ? 0.7 : 0.9; // Zmniejszone rozmiary dla elegantszego wyglądu
  const currentScale = hovered || selected ? scale * 1.15 : scale; // Mniejszy współczynnik powiększenia

  // Bardziej subtelna animacja
  useFrame(() => {
    if (serverRef.current) {
      serverRef.current.rotation.y += 0.005; // Wolniejsza rotacja

      // Płynniejsza animacja skali
      serverRef.current.scale.set(
        serverRef.current.scale.x +
          (currentScale - serverRef.current.scale.x) * 0.08,
        serverRef.current.scale.y +
          (currentScale - serverRef.current.scale.y) * 0.08,
        serverRef.current.scale.z +
          (currentScale - serverRef.current.scale.z) * 0.08
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
      <mesh ref={serverRef} castShadow receiveShadow>
        <boxGeometry args={[1, 0.25, 1.2]} />{" "}
        {/* Cieńszy, bardziej elegancki kształt */}
        <meshPhysicalMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered || selected ? 0.3 : 0.1} // Subtelniejszy blask
          roughness={0.2}
          clearcoat={0.5}
          clearcoatRoughness={0.2}
          transmission={0.1} // Lekki efekt przezroczystości dla wrażenia szkła
        />
      </mesh>

      {/* Bardziej elegancka czcionka */}
      <Text
        position={[0, 0.4, 0]}
        fontSize={0.25 * scale}
        color="white"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Light.woff" // Zakładając, że masz taką czcionkę
      >
        {service.name}
      </Text>

      {/* Udoskonalony tooltip */}
      {selected && (
        <Html position={[0, -0.5, 0]} distanceFactor={10} center transform>
          <div className="bg-slate-900/90 backdrop-blur-sm border border-white/10 px-3 py-2 rounded-md text-white text-xs max-w-xs text-center shadow-lg">
            {service.description}
          </div>
        </Html>
      )}

      {/* Delikatny efekt cząsteczek wokół wybranego elementu */}
      {(selected || hovered) && (
        <Sparkles
          count={20}
          scale={[1.5, 1, 1.5]}
          position={[0, 0, 0]}
          size={0.4}
          speed={0.3}
          opacity={0.2}
          color={color}
        />
      )}
    </group>
  );
}

// Udoskonalony komponent połączeń
function Connections({
  lowPerformance,
}: {
  lowPerformance: boolean;
}): React.ReactNode {
  // Redukuj liczbę połączeń na słabszych urządzeniach
  const connections = lowPerformance
    ? services.slice(0, 3).map((_, i) => i) // Mniej połączeń
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
                color="#e2e8f0" // slate-200, delikatniejszy kolor
                opacity={0.15} // Bardziej przezroczysty
                transparent
                linewidth={1}
              />
            </line>
          ))
      )}
    </group>
  );
}

// Udoskonalony komponent cząsteczek
function DataParticles({
  lowPerformance,
}: {
  lowPerformance: boolean;
}): React.ReactNode {
  const particles = useRef<Group>(null);
  // Dostosowanie liczby cząsteczek do wydajności urządzenia
  const particlesCount = lowPerformance ? 12 : 35; // Mniej cząsteczek dla subtelniejszego efektu
  const particlePositions = new Float32Array(particlesCount * 3);

  for (let i = 0; i < particlesCount; i++) {
    particlePositions[i * 3] = (Math.random() - 0.5) * 10;
    particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 10;
    particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 10;
  }

  // Bardziej subtelny ruch
  useFrame(() => {
    if (particles.current) {
      particles.current.rotation.x += 0.0005;
      particles.current.rotation.y += 0.001;
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
      <pointsMaterial
        size={0.08} // Mniejsze cząsteczki
        color="#a5b4fc" // indigo-300, delikatniejszy kolor
        opacity={0.4}
        transparent
        sizeAttenuation
      />
    </points>
  );
}

// Udoskonalona główna scena
function Scene({ isMobile, lowPerformance }: SceneProps): React.ReactNode {
  const [hoveredService, setHoveredService] = useState<number | null>(null);
  const [selectedService, setSelectedService] = useState<number | null>(null);

  return (
    <>
      <color attach="background" args={["#0a0f1c"]} />{" "}
      {/* Ciemniejsze, bardziej eleganckie tło */}
      <fog attach="fog" args={["#0a0f1c", 8, 25]} />{" "}
      {/* Subtelna mgła dla głębi */}
      <ambientLight intensity={0.3} /> {/* Delikatniejsze światło otoczenia */}
      <pointLight position={[10, 10, 10]} intensity={0.7} castShadow />
      <pointLight
        position={[-10, -10, -10]}
        intensity={0.2}
        color="#60a5fa"
      />{" "}
      {/* Lekkie podświetlenie z drugiej strony */}
      {!lowPerformance && (
        <AccumulativeShadows
          temporal
          frames={30}
          scale={10}
          alphaTest={0.85}
          opacity={0.5}
          position={[0, -2, 0]}
        >
          <RandomizedLight
            amount={4}
            radius={9}
            intensity={0.8}
            ambient={0.25}
            position={[5, 5, -10]}
          />
        </AccumulativeShadows>
      )}
      <DataParticles lowPerformance={lowPerformance} />
      <Connections lowPerformance={lowPerformance} />
      {services.map((service, index) => (
        <Float
          key={service.name}
          speed={1.5} // Wolniejszy ruch
          rotationIntensity={0.1} // Bardziej subtelny ruch
          floatIntensity={0.3} // Mniejsza amplituda
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
        rotateSpeed={isMobile ? 0.5 : 0.8} // Nieco wolniejszy ruch dla lepszej kontroli
        dampingFactor={0.05} // Większe wygaszanie dla płynniejszych ruchów
      />
      {!lowPerformance && (
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
            height={300}
            intensity={0.3} // Subtelniejszy efekt bloom
          />
        </EffectComposer>
      )}
    </>
  );
}

// Udoskonalony alternatywny widok dla urządzeń o niskiej wydajności
const MobileAlternativeView: React.FC = () => {
  const [selectedService, setSelectedService] = useState<number | null>(null);

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
        Interaktywna wizualizacja komponentów infrastruktury IT
      </p>

      <div className="space-y-2">
        {services.map((service, index) => (
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
              setSelectedService(selectedService === index ? null : index)
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

            {selectedService === index && (
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

// Udoskonalony komponent kontrolujący responsywność
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
    <div className="w-full">
      {shouldUseAlternativeView ? (
        <MobileAlternativeView />
      ) : (
        <div
          ref={canvasRef}
          className="w-full h-96 bg-slate-950 rounded-lg overflow-hidden"
        >
          <Canvas
            shadows
            camera={{ position: isMobile ? [0, 0, 12] : [0, 0, 8], fov: 50 }} // Węższe pole widzenia dla eleganckiego efektu
          >
            <Environment preset="night" />{" "}
            {/* Ciemniejsze, bardziej eleganckie środowisko */}
            <Scene
              isMobile={isMobile}
              lowPerformance={performanceLevel === "low"}
            />
          </Canvas>
          <div className="p-3 bg-slate-900/80 backdrop-blur-sm border-t border-slate-800/50 text-slate-400 text-xs">
            <p className="text-center font-light">
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
