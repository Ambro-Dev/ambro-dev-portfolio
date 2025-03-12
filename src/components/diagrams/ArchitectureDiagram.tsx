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
import { EliteGlassPanel, GlassCard } from "@/components/glass-components";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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

// Architecture nodes data with refined, more subtle colors
const architectureNodes: ArchitectureNode[] = [
  {
    id: "user",
    Icon: User,
    label: "Użytkownicy",
    description:
      "Użytkownicy końcowi korzystający z aplikacji i usług. Dostęp przez przeglądarkę lub aplikacje mobilne.",
    position: { x: 100, y: 100 },
    color: "#818cf8", // indigo-400
    category: "frontend",
  },
  {
    id: "lb",
    Icon: Globe,
    label: "Load Balancer",
    description:
      "Równoważy ruch sieciowy między serwerami aplikacji. Zapewnia wysoką dostępność i skalowalność.",
    position: { x: 300, y: 100 },
    color: "#4ade80", // green-400
    category: "infrastructure",
  },
  {
    id: "webapp",
    Icon: Server,
    label: "Serwery Aplikacji",
    description:
      "Klaster kontenerowy Kubernetes z autoskalowaniem. Elastyczna platforma dla mikrousług.",
    position: { x: 500, y: 100 },
    color: "#a5b4fc", // indigo-300
    category: "backend",
  },
  {
    id: "api",
    Icon: Server,
    label: "API Gateway",
    description:
      "Zarządzanie API, autoryzacja i limitowanie zapytań. Centralny punkt dostępu do mikrousług.",
    position: { x: 700, y: 100 },
    color: "#c084fc", // violet-400
    category: "backend",
  },
  {
    id: "db",
    Icon: Database,
    label: "Baza Danych",
    description:
      "Klastrowana baza danych z replikacją i automatycznymi backupami. Wysoka dostępność i odporność na awarie.",
    position: { x: 700, y: 300 },
    color: "#f59e0b", // amber-500
    category: "backend",
  },
  {
    id: "cache",
    Icon: Database,
    label: "Cache",
    description:
      "Warstwa cache (Redis) dla zwiększenia wydajności i redukcji obciążenia bazy danych. Szybki dostęp do często używanych danych.",
    position: { x: 500, y: 300 },
    color: "#c084fc", // violet-400
    category: "backend",
  },
  {
    id: "storage",
    Icon: Database,
    label: "Object Storage",
    description:
      "Skalowalny magazyn plików z wersjonowaniem. Przechowywanie mediów, dokumentów i kopii zapasowych.",
    position: { x: 300, y: 300 },
    color: "#fb7185", // rose-400
    category: "infrastructure",
  },
  {
    id: "monitoring",
    Icon: Monitor,
    label: "Monitoring",
    description:
      "System monitorowania z alertami i wizualizacją metryk. Prometheus, Grafana i ELK Stack dla pełnej widoczności.",
    position: { x: 100, y: 300 },
    color: "#2dd4bf", // teal-400
    category: "monitoring",
  },
  {
    id: "security",
    Icon: Shield,
    label: "Zabezpieczenia",
    description:
      "Firewall, WAF i VPN dla bezpiecznego dostępu. Ochrona przed atakami DDOS i innymi zagrożeniami.",
    position: { x: 100, y: 500 },
    color: "#f87171", // red-400
    category: "security",
  },
  {
    id: "cicd",
    Icon: Cog,
    label: "CI/CD",
    description:
      "Potok wdrożeniowy dla automatyzacji budowania i wdrażania. Ciągła integracja i wdrażanie z GitLab CI lub GitHub Actions.",
    position: { x: 300, y: 500 },
    color: "#38bdf8", // sky-400
    category: "infrastructure",
  },
  {
    id: "backup",
    Icon: CheckCircle,
    label: "Backupy",
    description:
      "Automatyczne kopie zapasowe i strategia odzyskiwania po awarii. Regularne testy przywracania dla pewności.",
    position: { x: 500, y: 500 },
    color: "#4ade80", // green-400
    category: "infrastructure",
  },
  {
    id: "logs",
    Icon: AlertTriangle,
    label: "Logi i Analytics",
    description:
      "Centralizacja logów i analityka w czasie rzeczywistym. Identyfikacja problemów i trendów.",
    position: { x: 700, y: 500 },
    color: "#a78bfa", // violet-400
    category: "monitoring",
  },
  {
    id: "cdn",
    Icon: Network,
    label: "CDN",
    description:
      "Sieć dostarczania treści dla szybkiego udostępniania statycznych zasobów. Globalny zasięg i buforowanie na brzegu.",
    position: { x: 100, y: 700 },
    color: "#fb923c", // orange-400
    category: "infrastructure",
  },
  {
    id: "auth",
    Icon: Lock,
    label: "Autoryzacja",
    description:
      "System uwierzytelniania i autoryzacji. OAuth2, OIDC i SSO dla bezpiecznego dostępu.",
    position: { x: 300, y: 700 },
    color: "#a78bfa", // violet-400
    category: "security",
  },
  {
    id: "containers",
    Icon: Cpu,
    label: "Orkiestracja Kontenerów",
    description:
      "Zarządzanie kontenerami z Kubernetes. Automatyczne skalowanie, samoleczenie i wdrażanie.",
    position: { x: 500, y: 700 },
    color: "#60a5fa", // blue-400
    category: "infrastructure",
  },
  {
    id: "devenv",
    Icon: Terminal,
    label: "Środowiska Deweloperskie",
    description:
      "Izolowane środowiska rozwojowe dla zespołów. Narzędzia współpracy i zarządzania kodem.",
    position: { x: 700, y: 700 },
    color: "#c084fc", // violet-400
    category: "infrastructure",
  },
];

// Connections with more subtle styling
const connections: Connection[] = [
  {
    from: "user",
    to: "lb",
    label: "HTTPS",
    animate: true,
    speed: 5,
    thickness: 1.5,
    color: "#818cf8", // indigo-400
  },
  {
    from: "lb",
    to: "webapp",
    label: "HTTP",
    animate: true,
    speed: 4,
    thickness: 1.5,
    color: "#4ade80", // green-400
  },
  {
    from: "webapp",
    to: "api",
    label: "HTTP/gRPC",
    animate: true,
    speed: 4,
    thickness: 1,
    color: "#a5b4fc", // indigo-300
  },
  {
    from: "api",
    to: "db",
    label: "TCP",
    animate: true,
    speed: 3,
    thickness: 1,
    color: "#c084fc", // violet-400
  },
  {
    from: "api",
    to: "cache",
    label: "Redis",
    animate: true,
    speed: 4,
    thickness: 1,
    color: "#c084fc", // violet-400
  },
  {
    from: "webapp",
    to: "cache",
    label: "Redis",
    animate: true,
    speed: 4,
    thickness: 1,
    color: "#c084fc", // violet-400
  },
  {
    from: "webapp",
    to: "storage",
    label: "S3 API",
    animate: true,
    speed: 3,
    thickness: 1,
    color: "#fb7185", // rose-400
  },
  {
    from: "monitoring",
    to: "webapp",
    label: "Metrics",
    animate: true,
    speed: 2,
    thickness: 0.5,
    color: "#2dd4bf", // teal-400
  },
  {
    from: "monitoring",
    to: "api",
    label: "Metrics",
    animate: true,
    speed: 2,
    thickness: 0.5,
    color: "#2dd4bf", // teal-400
  },
  {
    from: "monitoring",
    to: "db",
    label: "Metrics",
    animate: true,
    speed: 2,
    thickness: 0.5,
    color: "#2dd4bf", // teal-400
  },
  {
    from: "security",
    to: "lb",
    label: "Rules",
    animate: true,
    speed: 1,
    thickness: 0.5,
    color: "#f87171", // red-400
  },
  {
    from: "cicd",
    to: "webapp",
    label: "Deploy",
    animate: true,
    speed: 2,
    thickness: 1,
    color: "#38bdf8", // sky-400
  },
  {
    from: "cicd",
    to: "api",
    label: "Deploy",
    animate: true,
    speed: 2,
    thickness: 1,
    color: "#38bdf8", // sky-400
  },
  {
    from: "backup",
    to: "db",
    label: "Schedule",
    animate: true,
    speed: 1,
    thickness: 0.5,
    color: "#4ade80", // green-400
  },
  {
    from: "backup",
    to: "storage",
    label: "Schedule",
    animate: true,
    speed: 1,
    thickness: 0.5,
    color: "#4ade80", // green-400
  },
  {
    from: "logs",
    to: "webapp",
    label: "Collect",
    animate: true,
    speed: 3,
    thickness: 0.5,
    color: "#a78bfa", // violet-400
  },
  {
    from: "logs",
    to: "api",
    label: "Collect",
    animate: true,
    speed: 3,
    thickness: 0.5,
    color: "#a78bfa", // violet-400
  },
  {
    from: "logs",
    to: "db",
    label: "Collect",
    animate: true,
    speed: 3,
    thickness: 0.5,
    color: "#a78bfa", // violet-400
  },
  {
    from: "user",
    to: "cdn",
    label: "Assets",
    animate: true,
    speed: 4,
    thickness: 1,
    color: "#fb923c", // orange-400
  },
  {
    from: "cdn",
    to: "storage",
    label: "Fetch",
    animate: true,
    speed: 3,
    thickness: 0.5,
    color: "#fb923c", // orange-400
  },
  {
    from: "auth",
    to: "api",
    label: "Validate",
    animate: true,
    speed: 3,
    thickness: 1,
    color: "#a78bfa", // violet-400
  },
  {
    from: "auth",
    to: "user",
    label: "Identity",
    animate: true,
    speed: 3,
    thickness: 1,
    color: "#a78bfa", // violet-400
  },
  {
    from: "containers",
    to: "webapp",
    label: "Host",
    animate: true,
    speed: 1,
    thickness: 1,
    color: "#60a5fa", // blue-400
  },
  {
    from: "containers",
    to: "api",
    label: "Host",
    animate: true,
    speed: 1,
    thickness: 1,
    color: "#60a5fa", // blue-400
  },
  {
    from: "devenv",
    to: "cicd",
    label: "Commit",
    animate: true,
    speed: 2,
    thickness: 0.5,
    color: "#c084fc", // violet-400
  },
];

// Individual architecture node component with refined styling
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
  const scale = useSpring(scaleMotionValue, { stiffness: 250, damping: 25 });

  useEffect(() => {
    if (isSelected) {
      scaleMotionValue.set(1.08); // Subtle scale-up
      controls.start({
        boxShadow: `0 0 15px ${node.color}50`, // More subtle shadow
      });
      pulseControls.start({
        scale: [1, 1.08, 1], // Smaller pulse
        opacity: [0.4, 0.3, 0.4], // More transparent
        repeatCount: Number.POSITIVE_INFINITY,
        repeatDur: 3,
      });
    } else if (hovered) {
      scaleMotionValue.set(1.03); // Smaller hover effect
      controls.start({
        boxShadow: `0 0 10px ${node.color}40`, // Even more subtle shadow
      });
      pulseControls.start({ scale: 1, opacity: 0.3 });
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
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: opacityValue, y: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 150 }}
      onClick={() => onClick(node.id)}
      onMouseEnter={() => onHover(node.id)}
      onMouseLeave={() => onHover(null)}
    >
      <div className="flex flex-col items-center relative">
        {/* Pulse animation background - more subtle */}
        <motion.div
          className="absolute rounded-full"
          style={{
            backgroundColor: `${node.color}20`,
            width: "60px", // Smaller pulse effect
            height: "60px",
          }}
          animate={pulseControls}
        />

        <motion.div
          className="flex items-center justify-center w-14 h-14 rounded-full z-10 relative" // Smaller node
          style={{
            scale,
            backgroundColor: `${node.color}10`, // More transparent
          }}
          animate={controls}
        >
          <motion.div
            className="flex items-center justify-center w-10 h-10 rounded-full" // Smaller inner circle
            style={{ backgroundColor: `${node.color}70` }} // More transparent color
            whileHover={{ scale: 1.03 }} // More subtle hover
          >
            <Icon size={18} color="white" strokeWidth={1.5} />{" "}
            {/* Smaller, thinner icon */}
          </motion.div>
        </motion.div>

        {/* Label with glass effect for better readability */}
        <motion.div
          className="mt-2 px-2 py-0.5 rounded-md bg-slate-900/60 backdrop-blur-sm" // Smaller, more subtle background
          animate={{
            scale: isSelected || hovered ? 1.03 : 1, // More subtle scale
            backgroundColor: isSelected
              ? `${node.color}20` // More transparent highlight
              : "rgba(15, 23, 42, 0.6)", // Slate-900 with 60% opacity
          }}
        >
          <span className="text-xs font-light text-slate-200 text-center whitespace-nowrap">
            {" "}
            {/* Smaller, lighter text */}
            {node.label}
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Refined animation for data flowing through connections
const DataFlow: React.FC<{
  connection: Connection;
  fromPos: NodePosition;
  toPos: NodePosition;
  isHighlighted: boolean | null;
}> = ({ connection, fromPos, toPos, isHighlighted }) => {
  const { speed = 5, color = "#e2e8f0" } = connection; // Default to slate-200

  // Animation duration based on speed (inverted, higher speed = faster animation)
  const duration = 12 - speed; // 1-10 speed maps to 11-2 duration (slower overall)

  // Only show animation if connection is highlighted or all are shown
  if (isHighlighted === false) return null;

  return (
    <motion.div
      className="absolute h-1.5 w-1.5 rounded-full" // Smaller particle
      style={{
        backgroundColor: color,
        boxShadow: `0 0 3px ${color}80`, // More subtle glow
        opacity: 0.5, // Base opacity reduced
      }}
      animate={{
        x: [fromPos.x, toPos.x],
        y: [fromPos.y, toPos.y],
        opacity: [0.5, 0], // More subtle fade
        scale: [0.8, 0.4], // Smaller scale change
      }}
      transition={{
        duration: duration,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut", // More elegant easing
        delay: Math.random() * duration, // Random delay for varied animation
      }}
    />
  );
};

// Refined connection component
const Connection: React.FC<ConnectionProps> = ({
  from,
  to,
  label,
  isHighlighted,
  isAnimated,
  speed = 5,
  thickness = 2,
  color = "#e2e8f0", // Default to slate-200
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
  const curveFactor = Math.min(distance * 0.15, 40); // Less curvature
  const perpX = (-dy / distance) * curveFactor;
  const perpY = (dx / distance) * curveFactor;

  const controlPoint = {
    x: midX + perpX,
    y: midY + perpY,
  };

  // SVG path for curved line
  const path = `M ${fromPos.x} ${fromPos.y} Q ${controlPoint.x} ${controlPoint.y} ${toPos.x} ${toPos.y}`;

  // Adjusted opacity based on highlighting state
  const opacityValue = isHighlighted === false ? 0.1 : 0.4; // More subtle overall
  const actualThickness = isHighlighted === true ? thickness + 0.5 : thickness; // Less dramatic thickness change

  return (
    <>
      {/* Curved connection line */}
      <motion.path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={actualThickness}
        strokeDasharray={isHighlighted === true ? "0" : "4 4"} // Smaller dash pattern
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

      {/* Connection label - refined with glass effect */}
      {label && (
        <motion.div
          className={`absolute px-1.5 py-0.5 text-xs rounded-md backdrop-blur-sm ${
            isHighlighted === false
              ? "bg-slate-900/30 text-slate-400" // More transparent when not highlighted
              : "bg-slate-900/50 text-slate-200 border border-slate-700/30" // Glass effect
          }`}
          style={{
            left: controlPoint.x,
            top: controlPoint.y,
            transform: "translate(-50%, -50%)",
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: isHighlighted === false ? 0.4 : 0.8, // More subtle opacity
            scale: isHighlighted === true ? 1.05 : 1, // More subtle scale
            backgroundColor:
              isHighlighted === true ? `${color}10` : "rgba(15, 23, 42, 0.3)", // Very subtle color highlight
          }}
          transition={{ duration: 0.3 }}
        >
          {label}
        </motion.div>
      )}
    </>
  );
};

// Refined animated details panel using EliteGlassPanel
const AnimatedDetailsPanel: React.FC<AnimatedDetailsPanelProps> = ({
  selectedNode,
}) => {
  return (
    <div className="max-w-3xl mx-auto mb-10 h-40">
      {selectedNode ? (
        <motion.div
          key={selectedNode.id}
          layoutId="detailsPanel"
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, type: "spring", damping: 25 }}
        >
          <EliteGlassPanel
            variant={selectedNode.category === "security" ? "purple" : "blue"}
            borderGradient={true}
            hoverEffect="none"
            className="p-5 rounded-lg"
          >
            <div className="flex items-start gap-4">
              <motion.div
                className="flex items-center justify-center w-12 h-12 rounded-lg flex-shrink-0"
                style={{ backgroundColor: `${selectedNode.color}80` }} // More transparent
                animate={{
                  rotate: [0, 3, 0, -3, 0], // More subtle rotation
                  scale: [1, 1.03, 1, 1.03, 1], // More subtle scale
                }}
                transition={{
                  duration: 12, // Slower for elegance
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "loop",
                }}
              >
                <selectedNode.Icon
                  size={24}
                  className="text-white"
                  strokeWidth={1.5}
                />{" "}
                {/* Thinner icon */}
              </motion.div>
              <div>
                <motion.h3
                  className="text-xl font-light tracking-wide mb-2 text-white" // Lighter font
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  {selectedNode.label}
                </motion.h3>
                <motion.p
                  className="text-slate-300 text-sm font-light leading-relaxed" // Lighter, smaller text
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  {selectedNode.description}
                </motion.p>

                {/* Category tag using Badge component */}
                <motion.div
                  className="mt-3"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <Badge
                    variant="outline"
                    className="px-2.5 py-0.5 text-xs rounded-full font-light"
                    style={{
                      backgroundColor: `${selectedNode.color}10`,
                      color: selectedNode.color,
                      borderColor: `${selectedNode.color}30`,
                    }}
                  >
                    {selectedNode.category}
                  </Badge>
                </motion.div>
              </div>
            </div>
          </EliteGlassPanel>
        </motion.div>
      ) : (
        <motion.div
          layoutId="detailsPanel"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <GlassCard
            blur="md"
            opacity={10}
            highlight={true}
            className="p-5 rounded-lg text-center"
          >
            <p className="text-slate-400 text-sm font-light">
              Wybierz węzeł, aby zobaczyć szczegóły komponentu infrastruktury
            </p>
          </GlassCard>
        </motion.div>
      )}
    </div>
  );
};

// Refined category filter using shadcn Button component
const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategories,
  onToggleCategory,
}) => {
  const categoryColors = {
    frontend: "#818cf8", // indigo-400
    backend: "#c084fc", // violet-400
    infrastructure: "#4ade80", // green-400
    security: "#f87171", // red-400
    monitoring: "#2dd4bf", // teal-400
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
          <Button
            key={category}
            variant={isSelected ? "outline" : "ghost"}
            size="sm"
            className={
              "flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-full font-light transition-all h-auto"
            }
            style={{
              backgroundColor: isSelected
                ? `${categoryColors[category]}10`
                : "transparent",
              color: isSelected ? categoryColors[category] : "#a1a1aa", // Slate-400
              borderColor: isSelected
                ? `${categoryColors[category]}30`
                : "transparent",
            }}
            onClick={() => onToggleCategory(category)}
          >
            <Icon size={14} strokeWidth={1.5} /> {/* Smaller, thinner icon */}
            <span>{categoryLabels[category]}</span>
          </Button>
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
    <div className="py-8 bg-slate-950/30 backdrop-blur-sm rounded-lg border border-slate-800/50 shadow-lg text-white">
      <motion.h2
        className="text-2xl font-light text-center mb-6 tracking-wide"
        initial={{ opacity: 0, y: -15 }}
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

      {/* Reset button with shadcn Button */}
      {selectedNode && (
        <div className="text-center mt-6">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full text-xs font-light border-slate-700/30 hover:bg-slate-800/50"
            onClick={() => setSelectedNode(null)}
          >
            Pokaż pełną architekturę
          </Button>
        </div>
      )}
    </div>
  );
};

export default ArchitectureDiagram;
