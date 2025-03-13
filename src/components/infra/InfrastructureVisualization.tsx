import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Server,
  Cloud,
  Database,
  Shield,
  Network,
  Code,
  Cpu,
  Activity,
} from "lucide-react";

const InfrastructureNode = ({
  id,
  name,
  Icon,
  x,
  y,
  z,
  color,
  size = 1,
  isActive,
  onClick,
  isHovered,
  onHover,
}) => {
  // Normalize x/y to handle different screen sizes (0-100%)
  const normalX = `${x}%`;
  const normalY = `${y}%`;

  // Scale based on z position (perspective)
  const scale = 0.7 + z * 0.3;

  // Shadow effect
  const shadowOpacity = 0.2 + z * 0.1;
  const shadowSize = 10 + z * 5;

  return (
    <motion.div
      className="absolute cursor-pointer"
      style={{
        left: normalX,
        top: normalY,
        zIndex: Math.round(z * 100),
      }}
      animate={{
        scale,
        filter: `drop-shadow(0 ${shadowSize}px ${shadowSize}px rgba(0,0,0,${shadowOpacity}))`,
      }}
      whileHover={{ scale: scale * 1.15, zIndex: 1000 }}
      transition={{ duration: 0.3 }}
      onClick={() => onClick(id)}
      onMouseEnter={() => onHover(id)}
      onMouseLeave={() => onHover(null)}
    >
      <motion.div
        className="relative transition-all duration-300"
        animate={{
          boxShadow:
            isActive || isHovered
              ? `0 0 20px ${color}40, 0 0 40px ${color}20`
              : "0 0 0 rgba(0,0,0,0)",
          y: isActive ? -8 : 0,
        }}
      >
        {/* Node circle */}
        <motion.div
          className="flex items-center justify-center rounded-full backdrop-blur-sm bg-opacity-20"
          style={{
            width: `${56 * size}px`,
            height: `${56 * size}px`,
            backgroundColor: `${color}20`,
          }}
          animate={{
            backgroundColor:
              isActive || isHovered ? `${color}30` : `${color}20`,
          }}
        >
          <motion.div
            className="flex items-center justify-center rounded-full"
            style={{
              width: `${40 * size}px`,
              height: `${40 * size}px`,
              backgroundColor: color,
            }}
          >
            <Icon size={24 * size} color="white" />
          </motion.div>
        </motion.div>

        {/* Label */}
        <motion.div
          className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap px-3 py-1 rounded-full backdrop-blur-sm text-sm"
          style={{
            backgroundColor:
              isActive || isHovered ? `${color}30` : "rgba(15, 23, 42, 0.6)",
            color: isActive || isHovered ? color : "white",
          }}
        >
          {name}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

// Connection between nodes
const Connection = ({
  startId,
  endId,
  nodePositions,
  isActive,
  strength = 0.5,
}) => {
  const startNode = nodePositions[startId];
  const endNode = nodePositions[endId];

  if (!startNode || !endNode) return null;

  const color = startNode.color;
  const halfwayX = (startNode.x + endNode.x) / 2;
  const halfwayY = (startNode.y + endNode.y) / 2;

  // Deeper nodes should have thicker connections
  const strokeWidth = 1 + (startNode.z + endNode.z) / 2;

  return (
    <svg
      className="absolute inset-0 z-0 w-full h-full"
      style={{ overflow: "visible" }}
    >
      <defs>
        <linearGradient
          id={`grad-${startId}-${endId}`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
        >
          <stop offset="0%" stopColor={startNode.color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={endNode.color} stopOpacity="0.4" />
        </linearGradient>
      </defs>

      <path
        d={`M ${startNode.x}% ${startNode.y}% Q ${halfwayX}% ${
          halfwayY - 10
        }% ${endNode.x}% ${endNode.y}%`}
        fill="none"
        stroke={`url(#grad-${startId}-${endId})`}
        strokeWidth={isActive ? strokeWidth * 2 : strokeWidth}
        strokeOpacity={isActive ? 0.8 : 0.3}
        strokeLinecap="round"
        strokeDasharray={isActive ? "0" : "3 3"}
      />

      {/* Animated particle along the connection */}
      {isActive && (
        <motion.circle
          r={3}
          fill={color}
          filter="blur(1px)"
          animate={{
            offsetDistance: ["0%", "100%"],
            opacity: [0.8, 0],
          }}
          transition={{
            duration: 2 - strength,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          style={{
            offsetPath: `path("M ${startNode.x}% ${
              startNode.y
            }% Q ${halfwayX}% ${halfwayY - 10}% ${endNode.x}% ${endNode.y}%")`,
          }}
        />
      )}
    </svg>
  );
};

// Floating particle effect
const ParticleEffect = () => {
  const particles = [];
  const particleCount = 30;

  for (let i = 0; i < particleCount; i++) {
    const size = Math.random() * 3 + 1;
    const opacity = Math.random() * 0.2 + 0.1;
    const delay = Math.random() * 2;
    const duration = Math.random() * 20 + 20;
    const initialX = Math.random() * 100;
    const initialY = Math.random() * 100;

    particles.push(
      <motion.div
        key={`particle-${i}`}
        className="absolute rounded-full bg-blue-500 blur-sm"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          opacity,
        }}
        initial={{
          x: `${initialX}%`,
          y: `${initialY}%`,
        }}
        animate={{
          x: [`${initialX}%`, `${Math.random() * 100}%`],
          y: [`${initialY}%`, `${Math.random() * 100}%`],
          opacity: [opacity, opacity / 2, opacity],
        }}
        transition={{
          duration,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          delay,
        }}
      />
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles}
    </div>
  );
};

// Info panel to display details about selected node
const InfoPanel = ({ node }) => {
  if (!node) return null;

  const { name, description, Icon, color, features } = node;

  return (
    <motion.div
      className="bg-slate-900/70 backdrop-blur-md p-5 rounded-xl border border-slate-800 shadow-xl max-w-md mx-auto mt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      layoutId="info-panel"
    >
      <div className="flex items-start gap-4">
        <div
          className="p-3 rounded-lg"
          style={{ backgroundColor: `${color}30` }}
        >
          <Icon size={24} color={color} />
        </div>

        <div>
          <h3 className="text-xl font-semibold text-white">{name}</h3>
          <p className="text-slate-300 text-sm mt-2">{description}</p>

          {features && features.length > 0 && (
            <ul className="mt-4 space-y-2">
              {features.map((feature, index) => (
                <motion.li
                  key={`feature-${index}`}
                  className="text-slate-300 text-sm flex items-start gap-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div
                    className="rounded-full p-1 flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: `${color}30` }}
                  >
                    <div
                      className="w-1 h-1 rounded-full"
                      style={{ backgroundColor: color }}
                    ></div>
                  </div>
                  {feature}
                </motion.li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Main component
const InfrastructureVisualization = () => {
  const [activeNode, setActiveNode] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  // Define the infrastructure nodes
  const nodes = [
    {
      id: "user",
      name: "Użytkownicy",
      Icon: Activity,
      x: 50,
      y: 15,
      z: 0.9,
      color: "#3B82F6", // blue-500
      description:
        "Użytkownicy końcowi systemu, dostęp przez aplikacje webowe i mobilne.",
      features: [
        "Dostęp do aplikacji przez przeglądarkę i urządzenia mobilne",
        "Bezpieczne logowanie z MFA",
        "Personalizowane dashboardy",
      ],
    },
    {
      id: "loadBalancer",
      name: "Load Balancer",
      Icon: Network,
      x: 50,
      y: 30,
      z: 0.8,
      color: "#10B981", // emerald-500
      description:
        "Rozkłada ruch między serwerami, zapewniając wysoką dostępność i wydajność systemu.",
      features: [
        "Automatyczne skalowanie",
        "Inteligentny routing",
        "Terminacja SSL",
        "Ochrona przed DDoS",
      ],
    },
    {
      id: "appServer1",
      name: "Serwer Aplikacji 1",
      Icon: Server,
      x: 30,
      y: 45,
      z: 0.7,
      color: "#6366F1", // indigo-500
      description:
        "Główny serwer aplikacji obsługujący żądania użytkowników i logikę biznesową.",
      features: [
        "Kubernetes Cluster",
        "Auto-healing",
        "Skalowanie horyzontalne",
        "Monitoring w czasie rzeczywistym",
      ],
    },
    {
      id: "appServer2",
      name: "Serwer Aplikacji 2",
      Icon: Server,
      x: 70,
      y: 45,
      z: 0.7,
      color: "#6366F1", // indigo-500
      description:
        "Zapasowy serwer aplikacji zapewniający wysoką dostępność i rozkład obciążenia.",
      features: [
        "Kubernetes Cluster",
        "Auto-healing",
        "Skalowanie horyzontalne",
        "Monitoring w czasie rzeczywistym",
      ],
    },
    {
      id: "database",
      name: "Baza Danych",
      Icon: Database,
      x: 50,
      y: 60,
      z: 0.6,
      color: "#EC4899", // pink-500
      description:
        "Klastrowana baza danych z replikacją i automatycznymi backupami.",
      features: [
        "Automatyczna replikacja",
        "Point-in-time recovery",
        "Szyfrowanie danych",
        "Monitoring wydajności",
      ],
    },
    {
      id: "cache",
      name: "Cache",
      Icon: Cpu,
      x: 20,
      y: 60,
      z: 0.5,
      color: "#8B5CF6", // violet-500
      description:
        "Warstwa cache przyspieszająca dostęp do często używanych danych.",
      features: [
        "Rozproszona pamięć podręczna",
        "Automatyczne usuwanie nieaktualnych danych",
        "Kompresja danych",
        "Replikacja",
      ],
    },
    {
      id: "security",
      name: "Zabezpieczenia",
      Icon: Shield,
      x: 80,
      y: 60,
      z: 0.5,
      color: "#EF4444", // red-500
      description:
        "Wielowarstwowe zabezpieczenia chroniące infrastrukturę przed zagrożeniami.",
      features: [
        "Firewall na poziomie aplikacji i sieci",
        "Intrusion Detection System",
        "Skanowanie podatności",
        "Automatyzacja odpowiedzi na incydenty",
      ],
    },
    {
      id: "cloudStorage",
      name: "Cloud Storage",
      Icon: Cloud,
      x: 50,
      y: 75,
      z: 0.4,
      color: "#F59E0B", // amber-500
      description:
        "Skalowalne rozwiązanie do przechowywania danych w chmurze z redundancją geograficzną.",
      features: [
        "Automatyczne skalowanie bez limitów",
        "Replikacja danych pomiędzy regionami",
        "Kontrola dostępu oparta na rolach",
        "Wersjonowanie obiektów",
      ],
    },
    {
      id: "cicd",
      name: "CI/CD Pipeline",
      Icon: Code,
      x: 80,
      y: 75,
      z: 0.3,
      color: "#3B82F6", // blue-500
      description:
        "Zautomatyzowany proces ciągłej integracji i wdrażania zmian w systemie.",
      features: [
        "Automatyczne testy jednostkowe i integracyjne",
        "Statyczna analiza kodu",
        "Blue/green deployment",
        "Automatyczne rollbacki",
      ],
    },
    {
      id: "monitoring",
      name: "Monitoring",
      Icon: Activity,
      x: 20,
      y: 75,
      z: 0.3,
      color: "#10B981", // emerald-500
      description:
        "Kompleksowy system monitoringu infrastruktury i aplikacji z alertami.",
      features: [
        "Dashboardy w czasie rzeczywistym",
        "Alerty oparte na anomaliach",
        "Analiza trendów",
        "Śledzenie wydajności aplikacji",
      ],
    },
  ];

  // Define connections between nodes
  const connections = [
    { start: "user", end: "loadBalancer", strength: 0.8 },
    { start: "loadBalancer", end: "appServer1", strength: 0.6 },
    { start: "loadBalancer", end: "appServer2", strength: 0.6 },
    { start: "appServer1", end: "database", strength: 0.7 },
    { start: "appServer2", end: "database", strength: 0.7 },
    { start: "appServer1", end: "cache", strength: 0.5 },
    { start: "appServer2", end: "cache", strength: 0.5 },
    { start: "database", end: "cloudStorage", strength: 0.4 },
    { start: "security", end: "loadBalancer", strength: 0.3 },
    { start: "security", end: "appServer1", strength: 0.3 },
    { start: "security", end: "appServer2", strength: 0.3 },
    { start: "security", end: "database", strength: 0.3 },
    { start: "cicd", end: "appServer1", strength: 0.3 },
    { start: "cicd", end: "appServer2", strength: 0.3 },
    { start: "monitoring", end: "appServer1", strength: 0.3 },
    { start: "monitoring", end: "appServer2", strength: 0.3 },
    { start: "monitoring", end: "database", strength: 0.3 },
    { start: "monitoring", end: "cache", strength: 0.3 },
  ];

  // Create a map of node positions with node data for easier access
  const nodePositions = {};
  nodes.forEach((node) => {
    nodePositions[node.id] = {
      x: node.x,
      y: node.y,
      z: node.z,
      color: node.color,
    };
  });

  // Get selected node data
  const selectedNode = activeNode
    ? nodes.find((node) => node.id === activeNode)
    : null;

  // Handle component mount and resize
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    // Initial size update
    updateSize();

    // Update on resize
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div className="bg-slate-950/90 rounded-xl overflow-hidden p-4">
      <h2 className="text-2xl font-light text-center text-white mb-6 tracking-tight">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
          Wizualizacja Infrastruktury
        </span>
      </h2>

      <div
        ref={containerRef}
        className="relative h-[500px] w-full mx-auto rounded-lg bg-gradient-to-b from-slate-950 to-slate-900/80 overflow-hidden border border-slate-800"
      >
        {/* Background particle effect */}
        <ParticleEffect />

        {/* Grid background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(255,255,255,0.03)_1px,_transparent_1px)] bg-[length:40px_40px]" />

        {/* Connections between nodes */}
        {connections.map((conn) => (
          <Connection
            key={`${conn.start}-${conn.end}`}
            startId={conn.start}
            endId={conn.end}
            nodePositions={nodePositions}
            isActive={
              activeNode === conn.start ||
              activeNode === conn.end ||
              hoveredNode === conn.start ||
              hoveredNode === conn.end
            }
            strength={conn.strength}
          />
        ))}

        {/* Nodes */}
        {nodes.map((node) => (
          <InfrastructureNode
            key={node.id}
            id={node.id}
            name={node.name}
            Icon={node.Icon}
            x={node.x}
            y={node.y}
            z={node.z}
            color={node.color}
            isActive={activeNode === node.id}
            isHovered={hoveredNode === node.id}
            onClick={(id) => setActiveNode(id === activeNode ? null : id)}
            onHover={setHoveredNode}
            size={1}
          />
        ))}
      </div>

      {/* Info panel for selected node */}
      <InfoPanel node={selectedNode} />
    </div>
  );
};

export default InfrastructureVisualization;
