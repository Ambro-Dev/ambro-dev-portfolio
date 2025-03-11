"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { motion, useAnimation, useMotionValue, useSpring } from "framer-motion";
import {
  Server,
  Database,
  Shield,
  User,
  Monitor,
  Cog,
  AlertTriangle,
  CheckCircle,
  Globe,
  Cloud,
  Lock,
  Cpu,
  Network,
  Terminal,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// Types
interface ArchitectureNode {
  id: string;
  Icon: LucideIcon;
  label: string;
  description: string;
  position: {
    x: number;
    y: number;
  };
  color: string;
  category:
    | "frontend"
    | "backend"
    | "infrastructure"
    | "security"
    | "monitoring";
}

interface NodePosition {
  x: number;
  y: number;
}

interface Connection {
  from: string;
  to: string;
  label: string;
  animate?: boolean;
  speed?: number; // 1-10 scale, 10 being fastest
  thickness?: number; // 1-5 scale
  color?: string;
}

interface ArchitectureNodeProps {
  node: ArchitectureNode;
  isSelected: boolean;
  isHighlighted: boolean | null;
  onClick: (id: string) => void;
  onHover: (id: string | null) => void;
  hovered: boolean;
}

interface ConnectionProps {
  from: string;
  to: string;
  label: string;
  isHighlighted: boolean | null;
  isAnimated: boolean;
  speed?: number;
  thickness?: number;
  color?: string;
  nodePositions: Record<string, NodePosition>;
}

interface AnimatedDetailsPanelProps {
  selectedNode: ArchitectureNode | null;
}

interface CategoryFilterProps {
  categories: Array<ArchitectureNode["category"]>;
  selectedCategories: Array<ArchitectureNode["category"]>;
  onToggleCategory: (category: ArchitectureNode["category"]) => void;
}

// Architecture nodes data
const architectureNodes: ArchitectureNode[] = [
  {
    id: "user",
    Icon: User,
    label: "Użytkownicy",
    description:
      "Użytkownicy końcowi korzystający z aplikacji i usług. Dostęp przez przeglądarkę lub aplikacje mobilne.",
    position: { x: 100, y: 100 },
    color: "#3B82F6",
    category: "frontend",
  },
  {
    id: "lb",
    Icon: Globe,
    label: "Load Balancer",
    description:
      "Równoważy ruch sieciowy między serwerami aplikacji. Zapewnia wysoką dostępność i skalowalność.",
    position: { x: 300, y: 100 },
    color: "#10B981",
    category: "infrastructure",
  },
  {
    id: "webapp",
    Icon: Server,
    label: "Serwery Aplikacji",
    description:
      "Klaster kontenerowy Kubernetes z autoskalowaniem. Elastyczna platforma dla mikrousług.",
    position: { x: 500, y: 100 },
    color: "#6366F1",
    category: "backend",
  },
  {
    id: "api",
    Icon: Server,
    label: "API Gateway",
    description:
      "Zarządzanie API, autoryzacja i limitowanie zapytań. Centralny punkt dostępu do mikrousług.",
    position: { x: 700, y: 100 },
    color: "#EC4899",
    category: "backend",
  },
  {
    id: "db",
    Icon: Database,
    label: "Baza Danych",
    description:
      "Klastrowana baza danych z replikacją i automatycznymi backupami. Wysoka dostępność i odporność na awarie.",
    position: { x: 700, y: 300 },
    color: "#F59E0B",
    category: "backend",
  },
  {
    id: "cache",
    Icon: Database,
    label: "Cache",
    description:
      "Warstwa cache (Redis) dla zwiększenia wydajności i redukcji obciążenia bazy danych. Szybki dostęp do często używanych danych.",
    position: { x: 500, y: 300 },
    color: "#8B5CF6",
    category: "backend",
  },
  {
    id: "storage",
    Icon: Database,
    label: "Object Storage",
    description:
      "Skalowalny magazyn plików z wersjonowaniem. Przechowywanie mediów, dokumentów i kopii zapasowych.",
    position: { x: 300, y: 300 },
    color: "#F43F5E",
    category: "infrastructure",
  },
  {
    id: "monitoring",
    Icon: Monitor,
    label: "Monitoring",
    description:
      "System monitorowania z alertami i wizualizacją metryk. Prometheus, Grafana i ELK Stack dla pełnej widoczności.",
    position: { x: 100, y: 300 },
    color: "#14B8A6",
    category: "monitoring",
  },
  {
    id: "security",
    Icon: Shield,
    label: "Zabezpieczenia",
    description:
      "Firewall, WAF i VPN dla bezpiecznego dostępu. Ochrona przed atakami DDOS i innymi zagrożeniami.",
    position: { x: 100, y: 500 },
    color: "#EF4444",
    category: "security",
  },
  {
    id: "cicd",
    Icon: Cog,
    label: "CI/CD",
    description:
      "Potok wdrożeniowy dla automatyzacji budowania i wdrażania. Ciągła integracja i wdrażanie z GitLab CI lub GitHub Actions.",
    position: { x: 300, y: 500 },
    color: "#0EA5E9",
    category: "infrastructure",
  },
  {
    id: "backup",
    Icon: CheckCircle,
    label: "Backupy",
    description:
      "Automatyczne kopie zapasowe i strategia odzyskiwania po awarii. Regularne testy przywracania dla pewności.",
    position: { x: 500, y: 500 },
    color: "#22C55E",
    category: "infrastructure",
  },
  {
    id: "logs",
    Icon: AlertTriangle,
    label: "Logi i Analytics",
    description:
      "Centralizacja logów i analityka w czasie rzeczywistym. Identyfikacja problemów i trendów.",
    position: { x: 700, y: 500 },
    color: "#A855F7",
    category: "monitoring",
  },
  {
    id: "cdn",
    Icon: Network,
    label: "CDN",
    description:
      "Sieć dostarczania treści dla szybkiego udostępniania statycznych zasobów. Globalny zasięg i buforowanie na brzegu.",
    position: { x: 100, y: 700 },
    color: "#FB923C",
    category: "infrastructure",
  },
  {
    id: "auth",
    Icon: Lock,
    label: "Autoryzacja",
    description:
      "System uwierzytelniania i autoryzacji. OAuth2, OIDC i SSO dla bezpiecznego dostępu.",
    position: { x: 300, y: 700 },
    color: "#7C3AED",
    category: "security",
  },
  {
    id: "containers",
    Icon: Cpu,
    label: "Orkiestracja Kontenerów",
    description:
      "Zarządzanie kontenerami z Kubernetes. Automatyczne skalowanie, samoleczenie i wdrażanie.",
    position: { x: 500, y: 700 },
    color: "#2563EB",
    category: "infrastructure",
  },
  {
    id: "devenv",
    Icon: Terminal,
    label: "Środowiska Deweloperskie",
    description:
      "Izolowane środowiska rozwojowe dla zespołów. Narzędzia współpracy i zarządzania kodem.",
    position: { x: 700, y: 700 },
    color: "#9333EA",
    category: "infrastructure",
  },
];

// Connections between nodes
const connections: Connection[] = [
  {
    from: "user",
    to: "lb",
    label: "HTTPS",
    animate: true,
    speed: 6,
    thickness: 3,
    color: "#3B82F6",
  },
  {
    from: "lb",
    to: "webapp",
    label: "HTTP",
    animate: true,
    speed: 6,
    thickness: 3,
    color: "#10B981",
  },
  {
    from: "webapp",
    to: "api",
    label: "HTTP/gRPC",
    animate: true,
    speed: 5,
    thickness: 2,
    color: "#6366F1",
  },
  {
    from: "api",
    to: "db",
    label: "TCP",
    animate: true,
    speed: 4,
    thickness: 2,
    color: "#EC4899",
  },
  {
    from: "api",
    to: "cache",
    label: "Redis",
    animate: true,
    speed: 8,
    thickness: 2,
    color: "#8B5CF6",
  },
  {
    from: "webapp",
    to: "cache",
    label: "Redis",
    animate: true,
    speed: 8,
    thickness: 2,
    color: "#8B5CF6",
  },
  {
    from: "webapp",
    to: "storage",
    label: "S3 API",
    animate: true,
    speed: 3,
    thickness: 2,
    color: "#F43F5E",
  },
  {
    from: "monitoring",
    to: "webapp",
    label: "Metrics",
    animate: true,
    speed: 2,
    thickness: 1,
    color: "#14B8A6",
  },
  {
    from: "monitoring",
    to: "api",
    label: "Metrics",
    animate: true,
    speed: 2,
    thickness: 1,
    color: "#14B8A6",
  },
  {
    from: "monitoring",
    to: "db",
    label: "Metrics",
    animate: true,
    speed: 2,
    thickness: 1,
    color: "#14B8A6",
  },
  {
    from: "security",
    to: "lb",
    label: "Rules",
    animate: true,
    speed: 1,
    thickness: 1,
    color: "#EF4444",
  },
  {
    from: "cicd",
    to: "webapp",
    label: "Deploy",
    animate: true,
    speed: 3,
    thickness: 2,
    color: "#0EA5E9",
  },
  {
    from: "cicd",
    to: "api",
    label: "Deploy",
    animate: true,
    speed: 3,
    thickness: 2,
    color: "#0EA5E9",
  },
  {
    from: "backup",
    to: "db",
    label: "Schedule",
    animate: true,
    speed: 1,
    thickness: 1,
    color: "#22C55E",
  },
  {
    from: "backup",
    to: "storage",
    label: "Schedule",
    animate: true,
    speed: 1,
    thickness: 1,
    color: "#22C55E",
  },
  {
    from: "logs",
    to: "webapp",
    label: "Collect",
    animate: true,
    speed: 4,
    thickness: 1,
    color: "#A855F7",
  },
  {
    from: "logs",
    to: "api",
    label: "Collect",
    animate: true,
    speed: 4,
    thickness: 1,
    color: "#A855F7",
  },
  {
    from: "logs",
    to: "db",
    label: "Collect",
    animate: true,
    speed: 4,
    thickness: 1,
    color: "#A855F7",
  },
  {
    from: "user",
    to: "cdn",
    label: "Assets",
    animate: true,
    speed: 7,
    thickness: 2,
    color: "#FB923C",
  },
  {
    from: "cdn",
    to: "storage",
    label: "Fetch",
    animate: true,
    speed: 4,
    thickness: 1,
    color: "#FB923C",
  },
  {
    from: "auth",
    to: "api",
    label: "Validate",
    animate: true,
    speed: 5,
    thickness: 2,
    color: "#7C3AED",
  },
  {
    from: "auth",
    to: "user",
    label: "Identity",
    animate: true,
    speed: 5,
    thickness: 2,
    color: "#7C3AED",
  },
  {
    from: "containers",
    to: "webapp",
    label: "Host",
    animate: true,
    speed: 2,
    thickness: 3,
    color: "#2563EB",
  },
  {
    from: "containers",
    to: "api",
    label: "Host",
    animate: true,
    speed: 2,
    thickness: 3,
    color: "#2563EB",
  },
  {
    from: "devenv",
    to: "cicd",
    label: "Commit",
    animate: true,
    speed: 3,
    thickness: 1,
    color: "#9333EA",
  },
];

// Individual architecture node component
const ArchitectureNode: React.FC<ArchitectureNodeProps> = ({
  node,
  isSelected,
  onClick,
  isHighlighted,
  onHover,
  hovered,
}) => {
  const { Icon } = node;
  const controls = useAnimation();
  const pulseControls = useAnimation();
  const scaleMotionValue = useMotionValue(1);
  const scale = useSpring(scaleMotionValue, { stiffness: 300, damping: 20 });

  useEffect(() => {
    if (isSelected) {
      scaleMotionValue.set(1.1);
      controls.start({
        boxShadow: `0 0 30px ${node.color}80`,
      });
      pulseControls.start({
        scale: [1, 1.15, 1],
        opacity: [0.7, 0.5, 0.7],
        repeatCount: Number.POSITIVE_INFINITY,
        repeatDur: 2,
      });
    } else if (hovered) {
      scaleMotionValue.set(1.05);
      controls.start({
        boxShadow: `0 0 20px ${node.color}60`,
      });
      pulseControls.start({ scale: 1, opacity: 0.5 });
    } else {
      scaleMotionValue.set(1);
      controls.start({
        boxShadow: "0 0 0 rgba(0,0,0,0)",
      });
      pulseControls.start({ scale: 0, opacity: 0 });
    }
  }, [
    controls,
    isSelected,
    node.color,
    pulseControls,
    hovered,
    scaleMotionValue,
  ]);

  const opacityValue = isHighlighted === false ? 0.3 : 1;

  return (
    <motion.div
      className="absolute cursor-pointer transition-opacity duration-300"
      style={{
        left: `${node.position.x}px`,
        top: `${node.position.y}px`,
        transform: "translate(-50%, -50%)",
        opacity: opacityValue,
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: opacityValue, y: 0 }}
      transition={{ type: "spring", damping: 20, stiffness: 100 }}
      onClick={() => onClick(node.id)}
      onMouseEnter={() => onHover(node.id)}
      onMouseLeave={() => onHover(null)}
    >
      <div className="flex flex-col items-center relative">
        {/* Pulse animation background */}
        <motion.div
          className="absolute rounded-full"
          style={{
            backgroundColor: `${node.color}30`,
            width: "70px",
            height: "70px",
          }}
          animate={pulseControls}
        />

        <motion.div
          className="flex items-center justify-center w-16 h-16 rounded-full z-10 relative"
          style={{
            scale,
            backgroundColor: `${node.color}20`,
          }}
          animate={controls}
        >
          <motion.div
            className="flex items-center justify-center w-12 h-12 rounded-full"
            style={{ backgroundColor: node.color }}
            whileHover={{ scale: 1.05 }}
          >
            <Icon size={24} color="white" />
          </motion.div>
        </motion.div>

        {/* Label with background for better readability */}
        <motion.div
          className="mt-2 px-2 py-1 rounded-lg bg-gray-800/80 backdrop-blur-sm"
          animate={{
            scale: isSelected || hovered ? 1.05 : 1,
            backgroundColor: isSelected
              ? `${node.color}30`
              : "rgba(30, 30, 30, 0.8)",
          }}
        >
          <span className="text-sm font-medium text-white text-center whitespace-nowrap">
            {node.label}
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Animation for data flowing through connections
const DataFlow: React.FC<{
  connection: Connection;
  fromPos: NodePosition;
  toPos: NodePosition;
  isHighlighted: boolean | null;
}> = ({ connection, fromPos, toPos, isHighlighted }) => {
  const { speed = 5, color = "#ffffff" } = connection;

  const dx = toPos.x - fromPos.x;
  const dy = toPos.y - fromPos.y;
  // Calculate direction between points (not using angle directly, but needed for animation path)
  Math.atan2(dy, dx);
  Math.sqrt(dx * dx + dy * dy); // Calculate distance for reference (used indirectly in animation timing)

  // Animation duration based on speed (inverted, higher speed = faster animation)
  const duration = 11 - speed; // 1-10 speed maps to 10-1 duration

  // Only show animation if connection is highlighted or all are shown
  if (isHighlighted === false) return null;

  return (
    <motion.div
      className="absolute h-2 w-2 rounded-full"
      style={{
        backgroundColor: color,
        boxShadow: `0 0 5px ${color}, 0 0 10px ${color}`,
      }}
      animate={{
        x: [fromPos.x, toPos.x],
        y: [fromPos.y, toPos.y],
        opacity: [0.8, 0],
        scale: [1, 0.5],
      }}
      transition={{
        duration: duration,
        repeat: Number.POSITIVE_INFINITY,
        ease: "linear",
        delay: Math.random() * duration, // Random delay for varied animation
      }}
    />
  );
};

// Individual connection component
const Connection: React.FC<ConnectionProps> = ({
  from,
  to,
  label,
  isHighlighted,
  isAnimated,
  speed = 5,
  thickness = 2,
  color = "#ffffff",
  nodePositions,
}) => {
  if (!nodePositions[from] || !nodePositions[to]) return null;

  const fromPos = nodePositions[from];
  const toPos = nodePositions[to];
  const dx = toPos.x - fromPos.x;
  const dy = toPos.y - fromPos.y;
  // Calculations for path layout
  const distance = Math.sqrt(dx * dx + dy * dy);

  // Calculate control points for curved lines
  const midX = (fromPos.x + toPos.x) / 2;
  const midY = (fromPos.y + toPos.y) / 2;

  // Add some curvature based on distance
  const curveFactor = Math.min(distance * 0.2, 50);
  const perpX = (-dy / distance) * curveFactor;
  const perpY = (dx / distance) * curveFactor;

  const controlPoint = {
    x: midX + perpX,
    y: midY + perpY,
  };

  // SVG path for curved line
  const path = `M ${fromPos.x} ${fromPos.y} Q ${controlPoint.x} ${controlPoint.y} ${toPos.x} ${toPos.y}`;

  // Adjusted opacity based on highlighting state
  const opacityValue = isHighlighted === false ? 0.15 : 0.7;
  const actualThickness = isHighlighted === true ? thickness + 1 : thickness;

  return (
    <>
      {/* Curved connection line */}
      <motion.path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={actualThickness}
        strokeDasharray={isHighlighted === true ? "0" : "5 5"}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{
          pathLength: 1,
          opacity: opacityValue,
          strokeWidth: actualThickness,
        }}
        transition={{ duration: 1, ease: "easeInOut" }}
        className="connection-path"
      />

      {/* Data flow animation */}
      {isAnimated && (
        <DataFlow
          connection={{ from, to, label, speed, color }}
          fromPos={fromPos}
          toPos={toPos}
          isHighlighted={isHighlighted}
        />
      )}

      {/* Connection label */}
      {label && (
        <motion.div
          className={`absolute px-2 py-0.5 text-xs rounded-full backdrop-blur-sm ${
            isHighlighted === false
              ? "bg-gray-800/40 text-gray-400"
              : "bg-gray-800/80 text-white border border-gray-700"
          }`}
          style={{
            left: controlPoint.x,
            top: controlPoint.y,
            transform: "translate(-50%, -50%)",
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: isHighlighted === false ? 0.5 : 1,
            scale: isHighlighted === true ? 1.1 : 1,
            backgroundColor:
              isHighlighted === true ? `${color}20` : "rgba(30, 30, 30, 0.4)",
          }}
          transition={{ duration: 0.3 }}
        >
          {label}
        </motion.div>
      )}
    </>
  );
};

// Animated details panel
const AnimatedDetailsPanel: React.FC<AnimatedDetailsPanelProps> = ({
  selectedNode,
}) => {
  return (
    <div className="max-w-3xl mx-auto mb-12 h-40">
      {selectedNode ? (
        <motion.div
          className="bg-gray-800/90 backdrop-blur-md p-6 rounded-xl shadow-xl border border-gray-700"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, type: "spring", damping: 20 }}
          key={selectedNode.id}
          layoutId="detailsPanel"
        >
          <div className="flex items-start gap-4">
            <motion.div
              className="flex items-center justify-center w-16 h-16 rounded-xl flex-shrink-0"
              style={{ backgroundColor: selectedNode.color }}
              animate={{
                rotate: [0, 5, 0, -5, 0],
                scale: [1, 1.05, 1, 1.05, 1],
              }}
              transition={{
                duration: 10,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
              }}
            >
              <selectedNode.Icon size={32} color="white" />
            </motion.div>
            <div>
              <motion.h3
                className="text-2xl font-bold mb-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                {selectedNode.label}
              </motion.h3>
              <motion.p
                className="text-gray-300"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                {selectedNode.description}
              </motion.p>

              {/* Category tag */}
              <motion.div
                className="mt-3 inline-block px-3 py-1 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: `${selectedNode.color}20`,
                  color: selectedNode.color,
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                {selectedNode.category}
              </motion.div>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          className="bg-gray-800/40 backdrop-blur-md p-6 rounded-xl text-center border border-gray-800"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          layoutId="detailsPanel"
        >
          <p className="text-gray-400">
            Wybierz węzeł, aby zobaczyć szczegóły komponentu infrastruktury
          </p>
        </motion.div>
      )}
    </div>
  );
};

// Category filter component
const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategories,
  onToggleCategory,
}) => {
  const categoryColors = {
    frontend: "#3B82F6",
    backend: "#EC4899",
    infrastructure: "#10B981",
    security: "#EF4444",
    monitoring: "#14B8A6",
  };

  const categoryLabels = {
    frontend: "Frontend",
    backend: "Backend",
    infrastructure: "Infrastruktura",
    security: "Bezpieczeństwo",
    monitoring: "Monitoring",
  };

  const categoryIcons = {
    frontend: User,
    backend: Database,
    infrastructure: Cloud,
    security: Shield,
    monitoring: Monitor,
  };

  return (
    <div className="flex flex-wrap gap-2 justify-center mb-8">
      {categories.map((category) => {
        const isSelected = selectedCategories.includes(category);
        const Icon = categoryIcons[category];

        return (
          <motion.button
            key={category}
            className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-colors ${
              isSelected
                ? "bg-gray-700 border border-gray-600"
                : "bg-gray-800/50 border border-gray-700"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onToggleCategory(category)}
            animate={{
              backgroundColor: isSelected
                ? `${categoryColors[category]}20`
                : "rgba(30, 30, 30, 0.5)",
              color: isSelected ? categoryColors[category] : "#a3a3a3",
              borderColor: isSelected
                ? categoryColors[category]
                : "rgba(75, 75, 75, 0.5)",
            }}
          >
            <Icon size={16} />
            <span>{categoryLabels[category]}</span>
          </motion.button>
        );
      })}
    </div>
  );
};

// Main architecture diagram component
const ArchitectureDiagram: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [nodePositions, setNodePositions] = useState<
    Record<string, NodePosition>
  >({});
  const [scaleFactor, setScaleFactor] = useState<number>(1);
  const [selectedCategories, setSelectedCategories] = useState<
    Array<ArchitectureNode["category"]>
  >(["frontend", "backend", "infrastructure", "security", "monitoring"]);
  const diagramRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Handle window resize and initial positioning
  useEffect(() => {
    if (!diagramRef.current) return;

    const updatePositions = () => {
      const diagramWidth = diagramRef.current?.clientWidth || 800;
      const baseWidth = 800;
      const newScaleFactor = diagramWidth / baseWidth;
      setScaleFactor(newScaleFactor);

      const newPositions: Record<string, NodePosition> = {};
      for (const node of architectureNodes) {
        newPositions[node.id] = {
          x: node.position.x * newScaleFactor,
          y: node.position.y * newScaleFactor,
        };
      }

      setNodePositions(newPositions);
    };

    updatePositions();
    window.addEventListener("resize", updatePositions);

    return () => {
      window.removeEventListener("resize", updatePositions);
    };
  }, []);

  // Filtered nodes based on selected categories
  const filteredNodes = architectureNodes.filter((node) =>
    selectedCategories.includes(node.category)
  );

  // Filtered connections based on filtered nodes
  const filteredConnections = connections.filter(
    (conn) =>
      filteredNodes.some((node) => node.id === conn.from) &&
      filteredNodes.some((node) => node.id === conn.to)
  );

  // Determine if a node is highlighted
  const isNodeHighlighted = (nodeId: string): boolean | null => {
    if (!selectedNode && !hoveredNode) return null; // All nodes normal when nothing selected

    const activeNode = hoveredNode || selectedNode;
    if (nodeId === activeNode) return true; // Selected or hovered node is highlighted

    // Check if node is connected to the active node
    const isConnected = filteredConnections.some(
      (conn) =>
        (conn.from === activeNode && conn.to === nodeId) ||
        (conn.to === activeNode && conn.from === nodeId)
    );

    return isConnected;
  };

  // Determine if a connection is highlighted
  const isConnectionHighlighted = (
    from: string,
    to: string
  ): boolean | null => {
    if (!selectedNode && !hoveredNode) return null; // All connections normal

    const activeNode = hoveredNode || selectedNode;
    return from === activeNode || to === activeNode;
  };

  // Get the selected node details
  const getSelectedNodeDetails = (): ArchitectureNode | null => {
    if (!selectedNode) return null;
    return architectureNodes.find((node) => node.id === selectedNode) || null;
  };

  // Handle category toggle
  const handleToggleCategory = (category: ArchitectureNode["category"]) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        // Don't allow deselecting all categories
        if (prev.length === 1) return prev;
        return prev.filter((c) => c !== category);
      }
      // Add the category if not present
      return [...prev, category];
    });
  };

  // Get all unique categories
  const allCategories = Array.from(
    new Set(architectureNodes.map((node) => node.category))
  ) as Array<ArchitectureNode["category"]>;

  return (
    <div className="py-12 bg-gray-900/70 backdrop-blur-sm rounded-xl border border-gray-800 shadow-xl text-white">
      <motion.h2
        className="text-3xl font-bold text-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Architektura Przykładowej Infrastruktury
      </motion.h2>

      {/* Category filters */}
      <CategoryFilter
        categories={allCategories}
        selectedCategories={selectedCategories}
        onToggleCategory={handleToggleCategory}
      />

      {/* Node details panel */}
      <AnimatedDetailsPanel selectedNode={getSelectedNodeDetails()} />

      {/* Main diagram */}
      <div
        ref={diagramRef}
        className="relative w-full mx-auto max-w-5xl overflow-hidden"
        style={{ height: `${800 * scaleFactor}px` }}
      >
        {/* SVG layer for connections */}
        <svg
          ref={svgRef}
          className="absolute inset-0 w-full h-full"
          style={{ overflow: "visible" }}
          aria-labelledby="architecture-diagram-title"
        >
          <title id="architecture-diagram-title">
            Architecture Diagram Connections
          </title>
          {/* Connections */}
          {Object.keys(nodePositions).length > 0 &&
            filteredConnections.map((conn) => (
              <Connection
                key={`${conn.from}-${conn.to}`}
                from={conn.from}
                to={conn.to}
                label={conn.label}
                isHighlighted={isConnectionHighlighted(conn.from, conn.to)}
                isAnimated={conn.animate || false}
                speed={conn.speed}
                thickness={conn.thickness}
                color={conn.color}
                nodePositions={nodePositions}
              />
            ))}
        </svg>

        {/* Nodes layer */}
        <div className="absolute inset-0">
          {filteredNodes.map((node) => (
            <ArchitectureNode
              key={node.id}
              node={{
                ...node,
                position: nodePositions[node.id] || node.position,
              }}
              isSelected={selectedNode === node.id}
              isHighlighted={isNodeHighlighted(node.id)}
              onClick={(id) => setSelectedNode(id === selectedNode ? null : id)}
              onHover={setHoveredNode}
              hovered={hoveredNode === node.id}
            />
          ))}
        </div>
      </div>

      {/* Reset button */}
      {selectedNode && (
        <div className="text-center mt-8">
          <motion.button
            className="px-4 py-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors border border-gray-700"
            onClick={() => setSelectedNode(null)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Pokaż pełną architekturę
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default ArchitectureDiagram;
