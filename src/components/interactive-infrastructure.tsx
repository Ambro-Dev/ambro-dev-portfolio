"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeading } from "@/components/ambro-ui/section-heading";
import { AnimatedSection } from "@/components/ambro-ui/animated-section";
import { EnhancedButton } from "@/components/ambro-ui/enhanced-button";
import { Card3D } from "@/components/ambro-ui/card-3d";
import { GradientText } from "@/components/ambro-ui/gradient-text";
import { RevealText } from "@/components/ambro-ui/reveal-text";
import { HoverCard } from "@/components/ambro-ui/hover-card";
import { ClipMask } from "@/components/ambro-ui/clip-mask";
import { ShuffleText } from "@/components/ambro-ui/shuffle-text";
import { TypewriterText } from "@/components/ambro-ui/typewriter-text";
import { FloatingBubbles } from "@/components/ambro-ui/floating-bubbles";

import {
  Cloud,
  Database,
  Server,
  Shield,
  Cpu,
  Layers,
  Monitor,
  GitBranch,
  Terminal,
  Box,
  Network,
  Globe,
  ArrowRight,
  Zap,
  Lock,
  Users,
  type LucideIcon,
} from "lucide-react";

// Infrastructure layer definition
interface InfraLayer {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
  gradient: string;
  tools: string[];
  features: string[];
  position: number;
}

// Define the infrastructure layers from top to bottom
const infrastructureLayers: InfraLayer[] = [
  {
    id: "client",
    name: "User Interface",
    description: "Nowoczesne interfejsy użytkownika",
    icon: Globe,
    color: "pink",
    gradient: "from-pink-500 to-rose-500",
    tools: ["React", "Next.js", "TypeScript", "PWA", "React Native"],
    features: [
      "Responsywne interfejsy na wszystkie urządzenia",
      "Progresywne aplikacje z funkcjami offline",
      "Server-side rendering dla optymalnej wydajności",
      "Zaawansowane zarządzanie stanem aplikacji",
    ],
    position: 1,
  },
  {
    id: "api",
    name: "API Gateway",
    description: "Zarządzanie dostępem do serwisów",
    icon: Server,
    color: "sky",
    gradient: "from-sky-500 to-blue-500",
    tools: ["Kong", "AWS API Gateway", "Nginx", "HAProxy", "Envoy"],
    features: [
      "Centralne zarządzanie ruchem sieciowym",
      "Throttling i ochrona przed przeciążeniem",
      "Walidacja zapytań i transformacja odpowiedzi",
      "Routing oparty o zawartość i nagłówki",
    ],
    position: 2,
  },
  {
    id: "auth",
    name: "Security Layer",
    description: "Bezpieczeństwo i kontrola dostępu",
    icon: Shield,
    color: "amber",
    gradient: "from-amber-500 to-orange-500",
    tools: ["OAuth 2.0", "JWT", "Keycloak", "Vault", "Auth0"],
    features: [
      "Wielopoziomowe uwierzytelnianie użytkowników",
      "Role-based i attribute-based kontrola dostępu",
      "Monitoring zagrożeń w czasie rzeczywistym",
      "Bezpieczne zarządzanie danymi wrażliwymi",
    ],
    position: 3,
  },
  {
    id: "services",
    name: "Microservices",
    description: "Niezależne serwisy biznesowe",
    icon: Layers,
    color: "purple",
    gradient: "from-purple-500 to-violet-500",
    tools: ["Docker", "Kubernetes", "Spring Boot", "Node.js", "gRPC"],
    features: [
      "Modułowa architektura zorientowana na domeny",
      "Izolacja błędów i szybkie odzyskiwanie",
      "Skalowanie horyzontalne oparte o obciążenie",
      "Niezależność technologiczna między serwisami",
    ],
    position: 4,
  },
  {
    id: "data",
    name: "Data Layer",
    description: "Zarządzanie danymi i pamięcią podręczną",
    icon: Database,
    color: "emerald",
    gradient: "from-emerald-500 to-teal-500",
    tools: ["PostgreSQL", "MongoDB", "Redis", "Kafka", "Elasticsearch"],
    features: [
      "Zoptymalizowane systemy baz danych SQL i NoSQL",
      "Rozproszone pamięci podręczne dla wydajności",
      "Asynchroniczna komunikacja przez kolejki wiadomości",
      "Analityka strumieniowa i zarządzanie zdarzeniami",
    ],
    position: 5,
  },
  {
    id: "infra",
    name: "Cloud Infrastructure",
    description: "Elastyczna infrastruktura chmurowa",
    icon: Cloud,
    color: "indigo",
    gradient: "from-indigo-500 to-blue-500",
    tools: ["AWS", "Terraform", "Ansible", "Azure", "Google Cloud"],
    features: [
      "Infrastructure as Code - zarządzanie deklaratywne",
      "Architektura multi-cloud z wysoką dostępnością",
      "Automatyczne skalowanie zasobów obliczeniowych",
      "Zaawansowana wirtualizacja i konteneryzacja",
    ],
    position: 6,
  },
  {
    id: "devops",
    name: "DevOps & Automation",
    description: "Automatyzacja procesów IT",
    icon: GitBranch,
    color: "blue",
    gradient: "from-blue-500 to-cyan-500",
    tools: ["Jenkins", "GitHub Actions", "GitLab CI", "ArgoCD", "Prometheus"],
    features: [
      "Continuous Integration i Continuous Deployment",
      "Automatyczne testowanie i walidacja kodu",
      "Monitoring i alerting w czasie rzeczywistym",
      "GitOps i Infrastructure as Code",
    ],
    position: 7,
  },
];

// Define the different views of the infrastructure
type ViewMode = "layers" | "connections" | "deployment" | "security";

// Connection definition for the connections view
interface Connection {
  from: string;
  to: string;
  type: "sync" | "async" | "data" | "auth";
  description: string;
}

// Define connections between layers
const connections: Connection[] = [
  {
    from: "client",
    to: "api",
    type: "sync",
    description: "Bezpieczna komunikacja HTTPS/REST",
  },
  {
    from: "api",
    to: "auth",
    type: "auth",
    description: "Weryfikacja tożsamości i uprawnień",
  },
  {
    from: "api",
    to: "services",
    type: "sync",
    description: "Routing zapytań do odpowiednich serwisów",
  },
  {
    from: "services",
    to: "data",
    type: "data",
    description: "Operacje na danych i stanie aplikacji",
  },
  {
    from: "services",
    to: "services",
    type: "async",
    description: "Asynchroniczna komunikacja między serwisami",
  },
  {
    from: "data",
    to: "infra",
    type: "data",
    description: "Zarządzanie przechowywaniem i skalowaniem danych",
  },
  {
    from: "infra",
    to: "devops",
    type: "async",
    description: "Monitoring i zarządzanie zasobami",
  },
];

// Flow definition for the deployment view
interface DeploymentFlow {
  id: string;
  name: string;
  description: string;
  steps: Array<{
    name: string;
    icon: LucideIcon;
    description: string;
  }>;
}

// Define deployment flows
const deploymentFlows: DeploymentFlow[] = [
  {
    id: "cicd",
    name: "CI/CD Pipeline",
    description: "Automatyczny proces wdrażania aplikacji",
    steps: [
      {
        name: "Commit Code",
        icon: GitBranch,
        description: "Deweloper pushuje zmiany do repozytorium Git",
      },
      {
        name: "Automated Tests",
        icon: Terminal,
        description: "Uruchamiane są testy jednostkowe i integracyjne",
      },
      {
        name: "Build Artifacts",
        icon: Box,
        description: "Budowanie i pakowanie aplikacji",
      },
      {
        name: "Deploy to Staging",
        icon: Cloud,
        description: "Automatyczne wdrożenie do środowiska testowego",
      },
      {
        name: "Integration Tests",
        icon: Monitor,
        description: "Testy end-to-end i weryfikacja działania",
      },
      {
        name: "Deploy to Production",
        icon: Zap,
        description: "Wdrożenie bez przestojów (zero-downtime)",
      },
    ],
  },
];

// Security aspect definition
interface SecurityAspect {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
}

// Define security aspects
const securityAspects: SecurityAspect[] = [
  {
    id: "auth",
    name: "Authentication & Authorization",
    description: "Wielopoziomowa weryfikacja tożsamości i kontrola dostępu",
    icon: Users,
    color: "amber",
  },
  {
    id: "data",
    name: "Data Protection",
    description: "Szyfrowanie danych w spoczynku i podczas transferu",
    icon: Lock,
    color: "indigo",
  },
  {
    id: "network",
    name: "Network Security",
    description: "Segmentacja sieci, firewalle i kontrola ruchu",
    icon: Shield,
    color: "emerald",
  },
  {
    id: "monitoring",
    name: "Security Monitoring",
    description: "Wykrywanie zagrożeń i odpowiedź na incydenty",
    icon: Monitor,
    color: "sky",
  },
];

const InfrastructureConcept: React.FC = () => {
  const [activeLayer, setActiveLayer] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("layers");
  const [isExploding, setIsExploding] = useState(false);
  const [currentDeployment, setCurrentDeployment] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Helper function to get layer by ID
  const getLayerById = (id: string): InfraLayer | undefined => {
    return infrastructureLayers.find((layer) => layer.id === id);
  };

  // Handle viewport resize
  useEffect(() => {
    const handleResize = () => {
      // Adjust container size or other responsive elements
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-increment deployment flow steps
  useEffect(() => {
    if (viewMode === "deployment") {
      const interval = setInterval(() => {
        setCurrentDeployment((prev) =>
          prev < deploymentFlows[0].steps.length - 1 ? prev + 1 : 0
        );
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [viewMode]);

  // Animation variants for layers
  const layerVariants = {
    initial: {
      opacity: 0,
      y: 30,
    },
    animate: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: custom * 0.1,
        duration: 0.5,
        type: "spring",
        stiffness: 100,
      },
    }),
    hover: {
      scale: 1.02,
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
      y: -5,
    },
    explode: (custom: number) => ({
      x: (custom % 2 === 0 ? -1 : 1) * (Math.random() * 200 + 100),
      opacity: 0,
      transition: {
        duration: 0.5,
      },
    }),
    expanded: {
      scale: 1.1,
      y: -10,
      zIndex: 10,
    },
  };

  // Animation variants for connections
  const connectionVariants = {
    initial: {
      opacity: 0,
      pathLength: 0,
    },
    animate: (custom: number) => ({
      opacity: 1,
      pathLength: 1,
      transition: {
        delay: custom * 0.15 + 0.3,
        pathLength: {
          duration: 1.2,
          ease: "easeInOut",
        },
        opacity: {
          duration: 0.6,
        },
      },
    }),
  };

  // Generate path for connection lines
  const getConnectionPath = (from: string, to: string): string => {
    const fromLayer = getLayerById(from);
    const toLayer = getLayerById(to);
    if (!fromLayer || !toLayer) return "";

    // For same layer (self-connection)
    if (from === to) {
      const baseY = fromLayer.position * 100;
      return `M150,${baseY} C0,${baseY - 50} 300,${baseY - 50} 150,${baseY}`;
    }

    const startY = fromLayer.position * 100;
    const endY = toLayer.position * 100;

    return `M150,${startY} C250,${startY} 250,${endY} 150,${endY}`;
  };

  // Handle layer click
  const handleLayerClick = (layerId: string) => {
    if (viewMode !== "layers") return;

    if (activeLayer === layerId) {
      setActiveLayer(null);
    } else {
      setActiveLayer(layerId);
    }
  };

  // Switch to connection view with explosion animation
  const handleExplodeView = () => {
    setIsExploding(true);
    setTimeout(() => {
      setIsExploding(false);
      setViewMode("connections");
      setActiveLayer(null);
    }, 600);
  };

  // Handle view mode change
  const handleViewChange = (mode: ViewMode) => {
    if (mode === viewMode) return;

    if (viewMode === "layers" && mode === "connections") {
      handleExplodeView();
    } else {
      setViewMode(mode);
      setActiveLayer(null);
    }
  };

  // Render active layer details
  const renderLayerDetails = () => {
    if (!activeLayer) return null;

    const layer = getLayerById(activeLayer);
    if (!layer) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        className="mt-8 bg-gray-800/50 p-6 rounded-xl border border-gray-700/50 backdrop-blur-sm"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className={`p-3 rounded-lg bg-gradient-to-br ${layer.gradient}`}>
            <layer.icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold">
              <GradientText from={layer.color} to={layer.color}>
                {layer.name}
              </GradientText>
            </h3>
            <p className="text-gray-300">{layer.description}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm uppercase text-gray-500 mb-3 font-medium">
              Kluczowe funkcje
            </h4>
            <ul className="space-y-2">
              {layer.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <span
                    className={`inline-block w-1.5 h-1.5 rounded-full bg-${layer.color}-400 mt-1.5 mr-2`}
                  />
                  <span className="text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm uppercase text-gray-500 mb-3 font-medium">
              Technologie i narzędzia
            </h4>
            <div className="flex flex-wrap gap-2">
              {layer.tools.map((tool, index) => (
                <span
                  key={index}
                  className={`px-3 py-1 text-sm rounded-full bg-${layer.color}-900/30 text-${layer.color}-300 border border-${layer.color}-700/30`}
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  // Render the layers view
  const renderLayersView = () => {
    return (
      <div className="relative py-20">
        {infrastructureLayers.map((layer) => (
          <motion.div
            key={layer.id}
            className={`mb-8 w-full ${
              activeLayer && activeLayer !== layer.id ? "opacity-50" : ""
            }`}
            custom={layer.position}
            initial="initial"
            animate={isExploding ? "explode" : "animate"}
            variants={layerVariants}
            whileHover={activeLayer === null ? "hover" : undefined}
            onClick={() => handleLayerClick(layer.id)}
          >
            <Card3D
              className="w-full cursor-pointer overflow-hidden"
              interactive={activeLayer === null}
              rotateX={0}
              rotateY={0}
              glowEffect={activeLayer === layer.id}
              glowColor={`rgba(${
                layer.color === "indigo"
                  ? "99, 102, 241"
                  : layer.color === "emerald"
                  ? "16, 185, 129"
                  : layer.color === "sky"
                  ? "14, 165, 233"
                  : layer.color === "purple"
                  ? "168, 85, 247"
                  : layer.color === "amber"
                  ? "245, 158, 11"
                  : layer.color === "pink"
                  ? "236, 72, 153"
                  : layer.color === "blue"
                  ? "59, 130, 246"
                  : "99, 102, 241"
              }, 0.6)`}
              bgColor={
                activeLayer === layer.id
                  ? `bg-${layer.color}-900/30`
                  : "bg-gray-800/30"
              }
              borderColor={`border-${layer.color}-500/30`}
              sharpEdges={false}
              shadow={true}
              shadowColor="rgba(0, 0, 0, 0.3)"
              perspective={1000}
            >
              <div
                className={`p-5 flex items-center gap-4 ${
                  activeLayer === layer.id ? "border-l-4" : "border-l-2"
                } border-${layer.color}-500`}
              >
                <div
                  className={`p-2 rounded-lg bg-gradient-to-br ${layer.gradient}`}
                >
                  <layer.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{layer.name}</h3>
                  <p className="text-sm text-gray-400">{layer.description}</p>
                </div>
                <ArrowRight
                  className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                    activeLayer === layer.id ? "rotate-90" : ""
                  }`}
                />
              </div>
            </Card3D>
          </motion.div>
        ))}

        <AnimatePresence>{renderLayerDetails()}</AnimatePresence>
      </div>
    );
  };

  // Render the connections view
  const renderConnectionsView = () => {
    return (
      <div className="relative my-10 h-[700px]">
        <svg
          width="300"
          height="700"
          viewBox="0 0 300 700"
          className="absolute left-0 top-0"
        >
          {connections.map((connection, index) => (
            <motion.path
              key={`${connection.from}-${connection.to}`}
              d={getConnectionPath(connection.from, connection.to)}
              stroke={
                connection.type === "sync"
                  ? "#60a5fa"
                  : connection.type === "async"
                  ? "#8b5cf6"
                  : connection.type === "data"
                  ? "#10b981"
                  : "#f59e0b"
              }
              strokeWidth={2}
              strokeDasharray={connection.type === "async" ? "8 4" : "0"}
              fill="none"
              initial="initial"
              animate="animate"
              custom={index}
              variants={connectionVariants}
            />
          ))}
        </svg>

        <div className="relative z-10 pl-[150px]">
          {infrastructureLayers.map((layer) => (
            <motion.div
              key={layer.id}
              className="absolute w-[300px]"
              style={{ top: `${layer.position * 100 - 40}px` }}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: layer.position * 0.1, duration: 0.5 }}
            >
              <HoverCard
                hoverContent={
                  <div className="w-72">
                    <h4 className="text-lg font-semibold mb-2">{layer.name}</h4>
                    <p className="text-gray-300 mb-3">{layer.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {layer.tools.slice(0, 3).map((tool, i) => (
                        <span
                          key={i}
                          className={`text-xs px-2 py-1 rounded-full bg-${layer.color}-900/30 text-${layer.color}-300`}
                        >
                          {tool}
                        </span>
                      ))}
                      {layer.tools.length > 3 && (
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-800">
                          +{layer.tools.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                }
                position="right"
                animation="scale"
                backdropBlur
                glassmorphism
              >
                <div
                  className={`py-3 px-4 rounded-lg bg-${layer.color}-900/20 border border-${layer.color}-700/30`}
                >
                  <div className="flex items-center gap-2">
                    <layer.icon className={`w-5 h-5 text-${layer.color}-400`} />
                    <span className="font-medium">{layer.name}</span>
                  </div>
                </div>
              </HoverCard>
            </motion.div>
          ))}
        </div>

        <div className="absolute right-0 top-0 w-[300px] h-full p-4">
          <div className="bg-gray-800/50 rounded-xl border border-gray-700/30 p-5 h-full overflow-auto">
            <h3 className="text-xl font-bold mb-4">
              Przepływ danych i komunikacja
            </h3>
            <p className="text-gray-400 mb-6">
              Architektura zapewnia elastyczną komunikację między warstwami za
              pomocą różnych protokołów i wzorców integracyjnych.
            </p>

            <div className="space-y-4">
              {connections.map((connection, i) => {
                const fromLayer = getLayerById(connection.from);
                const toLayer = getLayerById(connection.to);
                if (!fromLayer || !toLayer) return null;

                return (
                  <motion.div
                    key={i}
                    className="p-3 bg-gray-800/80 rounded-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <fromLayer.icon
                        className={`w-4 h-4 text-${fromLayer.color}-400`}
                      />
                      <ArrowRight className="w-4 h-4 text-gray-500" />
                      <toLayer.icon
                        className={`w-4 h-4 text-${toLayer.color}-400`}
                      />

                      <span
                        className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                          connection.type === "sync"
                            ? "bg-blue-900/30 text-blue-300"
                            : connection.type === "async"
                            ? "bg-purple-900/30 text-purple-300"
                            : connection.type === "data"
                            ? "bg-emerald-900/30 text-emerald-300"
                            : "bg-amber-900/30 text-amber-300"
                        }`}
                      >
                        {connection.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300">
                      {connection.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render the deployment view
  const renderDeploymentView = () => {
    const flow = deploymentFlows[0]; // Using first flow

    return (
      <div className="relative py-10">
        <div className="flex items-center justify-center mb-10">
          <ClipMask
            mask="hexagon"
            height={120}
            width={120}
            animate
            borderWidth={2}
            borderColor="#6366f1"
            shadowColor="rgba(99, 102, 241, 0.3)"
            shadowSize={20}
            gradientColors={["#6366f1", "#8b5cf6", "#ec4899"]}
          >
            <div className="w-full h-full flex items-center justify-center bg-gray-900">
              <GitBranch className="w-8 h-8 text-white" />
            </div>
          </ClipMask>
        </div>

        <AnimatedSection animation="fadeIn" className="mb-8 text-center">
          <h3 className="text-2xl font-bold">
            <GradientText from="blue-500" to="indigo-500">
              {flow.name}
            </GradientText>
          </h3>
          <p className="text-gray-400">{flow.description}</p>
        </AnimatedSection>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-8">
          {flow.steps.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = index === currentDeployment;

            return (
              <Card3D
                key={index}
                className="h-full"
                glowEffect={isActive}
                bgColor={isActive ? "bg-indigo-900/20" : "bg-gray-800/30"}
                borderColor={
                  isActive ? "border-indigo-500/40" : "border-gray-700/30"
                }
                rotateX={0}
                rotateY={0}
                interactive={false}
              >
                <div className="p-4 h-full flex flex-col">
                  <div className="mb-3 flex justify-between items-center">
                    <div
                      className={`w-8 h-8 rounded-full ${
                        isActive ? "bg-indigo-600" : "bg-gray-700"
                      } flex items-center justify-center`}
                    >
                      <span className="text-white font-medium">
                        {index + 1}
                      </span>
                    </div>
                    <StepIcon
                      className={`w-5 h-5 ${
                        isActive ? "text-indigo-400" : "text-gray-500"
                      }`}
                    />
                  </div>

                  <h4
                    className={`font-medium ${
                      isActive ? "text-white" : "text-gray-300"
                    }`}
                  >
                    {step.name}
                  </h4>

                  <p
                    className={`text-sm mt-1 flex-1 ${
                      isActive ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    {step.description}
                  </p>

                  {index < flow.steps.length - 1 && (
                    <div className="mt-3 flex justify-end">
                      <ArrowRight
                        className={`w-4 h-4 ${
                          isActive ? "text-indigo-400" : "text-gray-600"
                        }`}
                      />
                    </div>
                  )}
                </div>
              </Card3D>
            );
          })}
        </div>
      </div>
    );
  };

  // Render the security view
  const renderSecurityView = () => {
    return (
      <div className="relative py-10">
        <div className="text-center mb-12">
          <TypewriterText
            text="Security by Design"
            className="text-2xl font-bold"
            speed={80}
            cursorChar="█"
            cursorColor="text-indigo-500"
          />
          <p className="text-gray-400 mt-2">
            Wielowarstwowe podejście do bezpieczeństwa w każdym elemencie
            architektury
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {securityAspects.map((aspect, idx) => (
            <motion.div
              key={aspect.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2, duration: 0.5 }}
            >
              <Card3D
                className="h-full"
                interactive
                glowEffect
                glowColor={`rgba(${
                  aspect.color === "amber"
                    ? "245, 158, 11"
                    : aspect.color === "indigo"
                    ? "99, 102, 241"
                    : aspect.color === "emerald"
                    ? "16, 185, 129"
                    : aspect.color === "sky"
                    ? "14, 165, 233"
                    : "99, 102, 241"
                }, 0.4)`}
                bgColor={`bg-${aspect.color}-900/20`}
                borderColor={`border-${aspect.color}-700/30`}
              >
                <div className="p-6">
                  <div className="mb-4 flex items-center justify-center">
                    <div
                      className={`p-3 rounded-full bg-${aspect.color}-500/20`}
                    >
                      <aspect.icon
                        className={`w-8 h-8 text-${aspect.color}-400`}
                      />
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-center mb-2">
                    {aspect.name}
                  </h3>

                  <p className="text-gray-400 text-center">
                    {aspect.description}
                  </p>
                </div>
              </Card3D>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
          <h3 className="text-xl font-bold mb-4">
            Zintegrowany system bezpieczeństwa
          </h3>
          <p className="text-gray-300 mb-6">
            Wszystkie warstwy architektury są projektowane z myślą o
            bezpieczeństwie, wykorzystując:
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              "Zero-trust architecture dla wszystkich zasobów",
              "Szyfrowanie end-to-end dla danych wrażliwych",
              "Continuous security monitoring i alerting",
              "Automatyczne skanowanie podatności w kodzie",
              "Microsegmentation w sieciach overlay",
              "Identity and Access Management (IAM)",
              "Zabezpieczenia przed atakami DDoS i OWASP Top 10",
              "Regularne audyty bezpieczeństwa i testy penetracyjne",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-indigo-500 mt-1.5" />
                <span className="text-gray-300">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="py-20 px-4 relative overflow-hidden bg-gray-900/40">
      {/* Background effects */}
      <div className="absolute inset-0 z-0">
        <FloatingBubbles
          count={25}
          minSize={2}
          maxSize={6}
          color="rgba(99, 102, 241, 0.3)"
          minSpeed={0.5}
          maxSpeed={1}
          fixed
          className="h-full w-full opacity-50"
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <AnimatedSection animation="fadeIn">
          <SectionHeading
            title={
              <span>
                Nowoczesna{" "}
                <ShuffleText
                  words={["architektura", "infrastruktura", "automatyzacja"]}
                  changeInterval={3000}
                  highlightActive
                  highlightClass="text-indigo-400"
                />
              </span>
            }
            subtitle="Elastyczne, skalowalne i bezpieczne rozwiązania chmurowe dla wymagających projektów"
            alignment="center"
            size="lg"
            gradient
            animation="fade"
            highlightWords={[1]}
            highlightColor="bg-indigo-500/10"
          />
        </AnimatedSection>

        {/* View selector tabs */}
        <div className="mt-12 mb-8 flex justify-center">
          <div className="bg-gray-800/50 p-1 rounded-lg inline-flex">
            {[
              { id: "layers", label: "Warstwy" },
              { id: "connections", label: "Połączenia" },
              { id: "deployment", label: "Wdrożenia" },
              { id: "security", label: "Bezpieczeństwo" },
            ].map((tab) => (
              <button
                key={tab.id}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  viewMode === tab.id
                    ? "bg-indigo-600 text-white"
                    : "text-gray-300 hover:bg-gray-700/50"
                }`}
                onClick={() => handleViewChange(tab.id as ViewMode)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main content container */}
        <div
          ref={containerRef}
          className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 overflow-hidden"
        >
          <div className="p-6">
            {viewMode === "layers" && renderLayersView()}
            {viewMode === "connections" && renderConnectionsView()}
            {viewMode === "deployment" && renderDeploymentView()}
            {viewMode === "security" && renderSecurityView()}
          </div>
        </div>

        {/* Call to action */}
        <div className="mt-12 text-center">
          <RevealText className="text-xl font-bold mb-4" delay={0.3}>
            Zbuduj swoją infrastrukturę z myślą o przyszłości
          </RevealText>

          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            Nowoczesna architektura musi być elastyczna, skalowalna i
            bezpieczna. Skonsultuj swoje potrzeby i dowiedz się, jak
            zaprojektować optymalną infrastrukturę dla swojego projektu.
          </p>

          <EnhancedButton
            variant="tech"
            size="lg"
            href="/kontakt"
            animatedBg
            magneticEffect
            borderGradient
            glowOnHover
            rippleEffect
            className="mt-2"
          >
            Skonsultuj swój projekt
          </EnhancedButton>
        </div>
      </div>
    </section>
  );
};

export default InfrastructureConcept;
