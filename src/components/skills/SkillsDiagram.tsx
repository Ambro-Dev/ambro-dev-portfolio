"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Skill {
  id: string;
  name: string;
  level: number;
  color: string;
  description: string;
  tools: string[];
  experience: number; // years of experience
  certifications: string[];
  category: "devops" | "cloud" | "security" | "development" | "infrastructure";
  icon?: string; // optional icon name from iconify
}

interface SkillNodeProps {
  skill: Skill;
  index: number;
  total: number;
  radius: number;
  selectedSkill: string | null;
  onSelectSkill: (id: string | null) => void;
  hoveredSkill: string | null;
  onHoverSkill: (id: string | null) => void;
  animate: boolean;
}

interface SkillDetailProps {
  skill: Skill;
  onClose: () => void;
}

interface SkillListItemProps {
  skill: Skill;
  index: number;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: () => void;
  onHover: (hovered: boolean) => void;
}

interface CategoryFilterProps {
  categories: Array<Skill["category"]>;
  selectedCategories: Array<Skill["category"]>;
  onToggleCategory: (category: Skill["category"]) => void;
}

// Enhanced skills data with more details
const skills: Skill[] = [
  {
    id: "devops",
    name: "DevOps",
    level: 95,
    color: "#4361EE",
    description:
      "Integracja ciągła (CI/CD), automatyzacja procesów, zarządzanie konfiguracją i wdrażanie. Specjalizuję się w tworzeniu wydajnych potków wdrożeniowych.",
    tools: [
      "Jenkins",
      "GitLab CI",
      "GitHub Actions",
      "Ansible",
      "Terraform",
      "Docker",
      "Kubernetes",
    ],
    experience: 6,
    certifications: ["AWS DevOps Professional", "Azure DevOps Engineer"],
    category: "devops",
    icon: "mdi:rocket-launch",
  },
  {
    id: "cloud",
    name: "Cloud Computing",
    level: 90,
    color: "#3A86FF",
    description:
      "Projektowanie, wdrażanie i zarządzanie infrastrukturą w chmurze. Doświadczenie w architektowaniu rozwiązań multi-cloud dla różnej wielkości projektów.",
    tools: [
      "AWS",
      "Azure",
      "Google Cloud",
      "Kubernetes",
      "Docker",
      "Serverless",
      "Terraform",
    ],
    experience: 5,
    certifications: [
      "AWS Solutions Architect Professional",
      "Google Cloud Architect",
    ],
    category: "cloud",
    icon: "mdi:cloud",
  },
  {
    id: "security",
    name: "Cyberbezpieczeństwo",
    level: 85,
    color: "#FF006E",
    description:
      "Zabezpieczanie infrastruktury i aplikacji, audyty bezpieczeństwa, zarządzanie dostępem i tożsamością, ochrona przed zagrożeniami.",
    tools: [
      "FortiGate",
      "VPN",
      "Firewall",
      "WAF",
      "SIEM",
      "Penetration Testing",
      "Encryption",
    ],
    experience: 4,
    certifications: [
      "Certified Information Systems Security Professional (CISSP)",
      "CompTIA Security+",
    ],
    category: "security",
    icon: "mdi:shield-lock",
  },
  {
    id: "servers",
    name: "Administracja serwerami",
    level: 92,
    color: "#FB5607",
    description:
      "Zarządzanie systemami Linux/Windows, wirtualizacja, monitoring, optymalizacja wydajności i rozwiązywanie problemów.",
    tools: [
      "Linux",
      "Windows Server",
      "vSphere",
      "Proxmox",
      "Zabbix",
      "Nagios",
      "Shell Scripting",
    ],
    experience: 7,
    certifications: [
      "Red Hat Certified Engineer",
      "Microsoft Certified: Windows Server",
    ],
    category: "infrastructure",
    icon: "mdi:server",
  },
  {
    id: "databases",
    name: "Bazy danych",
    level: 80,
    color: "#8338EC",
    description:
      "Projektowanie, administracja i optymalizacja baz danych relacyjnych i NoSQL, migracje danych i utrzymanie wydajności.",
    tools: [
      "PostgreSQL",
      "MySQL",
      "MongoDB",
      "Redis",
      "ElasticSearch",
      "SQL",
      "Database Replication",
    ],
    experience: 5,
    certifications: ["MongoDB Certified DBA", "Oracle Certified Professional"],
    category: "infrastructure",
    icon: "mdi:database",
  },
  {
    id: "programming",
    name: "Programowanie",
    level: 78,
    color: "#06D6A0",
    description:
      "Tworzenie aplikacji, skryptów automatyzacji, integracji systemów i narzędzi deweloperskich dla zespołów IT.",
    tools: [
      "Python",
      "JavaScript",
      "TypeScript",
      "Bash",
      "Go",
      "React",
      "Node.js",
    ],
    experience: 4,
    certifications: ["Certified Python Developer", "JavaScript Certification"],
    category: "development",
    icon: "mdi:code-braces",
  },
  {
    id: "iac",
    name: "Infrastruktura jako kod",
    level: 88,
    color: "#118AB2",
    description:
      "Automatyzacja infrastruktury za pomocą kodu, co zapewnia powtarzalność, skalowalność i audytowalność środowisk.",
    tools: [
      "Terraform",
      "CloudFormation",
      "Ansible",
      "Puppet",
      "Chef",
      "ARM Templates",
      "Pulumi",
    ],
    experience: 4,
    certifications: [
      "HashiCorp Certified: Terraform Associate",
      "AWS Developer Associate",
    ],
    category: "devops",
    icon: "mdi:file-code",
  },
  {
    id: "containers",
    name: "Konteneryzacja",
    level: 86,
    color: "#6A4C93",
    description:
      "Wdrażanie i orkiestracja aplikacji kontenerowych, budowanie mikroserwisów i zarządzanie klastrem Kubernetes.",
    tools: [
      "Docker",
      "Kubernetes",
      "Docker Swarm",
      "Helm",
      "Istio",
      "Podman",
      "Container Security",
    ],
    experience: 4,
    certifications: [
      "Certified Kubernetes Administrator (CKA)",
      "Docker Certified Associate",
    ],
    category: "devops",
    icon: "mdi:docker",
  },
  {
    id: "monitoring",
    name: "Monitoring i Observability",
    level: 82,
    color: "#FFBE0B",
    description:
      "Wdrażanie kompleksowych rozwiązań monitoringu zapewniających pełną widoczność systemów, aplikacji i infrastruktury.",
    tools: [
      "Prometheus",
      "Grafana",
      "ELK Stack",
      "Datadog",
      "New Relic",
      "Zabbix",
      "Alertmanager",
    ],
    experience: 5,
    certifications: [
      "Datadog Monitoring Professional",
      "Prometheus Certified Associate",
    ],
    category: "devops",
    icon: "mdi:chart-line",
  },
  {
    id: "networking",
    name: "Sieci komputerowe",
    level: 79,
    color: "#EF476F",
    description:
      "Projektowanie, konfiguracja i zarządzanie sieciami, rozwiązywanie problemów, optymalizacja wydajności i zabezpieczanie komunikacji.",
    tools: [
      "TCP/IP",
      "DNS",
      "DHCP",
      "VPN",
      "Load Balancing",
      "SDN",
      "Network Security",
    ],
    experience: 6,
    certifications: [
      "Cisco Certified Network Professional",
      "CompTIA Network+",
    ],
    category: "infrastructure",
    icon: "mdi:lan",
  },
  {
    id: "web",
    name: "Technologie webowe",
    level: 75,
    color: "#FFD166",
    description:
      "Tworzenie aplikacji webowych i API, optymalizacja wydajności i implementacja najlepszych praktyk frontend/backend.",
    tools: [
      "HTML/CSS",
      "JavaScript",
      "React",
      "Next.js",
      "REST API",
      "GraphQL",
      "Web Security",
    ],
    experience: 3,
    certifications: [
      "Full Stack Web Developer Certification",
      "React Developer Certification",
    ],
    category: "development",
    icon: "mdi:web",
  },
];

// Helper function to convert degrees to radians
const degreesToRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

// Calculate position on a circle
const calculatePosition = (
  index: number,
  total: number,
  radius: number
): { x: number; y: number } => {
  const angle = (index / total) * 360;
  const x = radius * Math.cos(degreesToRadians(angle - 90));
  const y = radius * Math.sin(degreesToRadians(angle - 90));
  return { x, y };
};

// Skill node component (for desktop view)
const SkillNode: React.FC<SkillNodeProps> = ({
  skill,
  index,
  total,
  radius,
  selectedSkill,
  onSelectSkill,
  hoveredSkill,
  onHoverSkill,
  animate,
}) => {
  const position = calculatePosition(index, total, radius);
  const isSelected = selectedSkill === skill.id;
  const isHovered = hoveredSkill === skill.id;

  // Calculate size based on skill level
  const size = Math.max(skill.level * 0.5, 40);

  return (
    <motion.div
      className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: 1,
        scale: 1,
        x: position.x,
        y: position.y,
        transition: { delay: animate ? index * 0.1 : 0, duration: 0.5 },
      }}
      style={{ left: "50%", top: "50%" }}
    >
      <motion.div
        className="relative cursor-pointer"
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
        animate={{
          scale: isSelected ? 1.2 : isHovered ? 1.1 : 1,
          boxShadow: isSelected
            ? `0 0 20px ${skill.color}, 0 0 40px ${skill.color}40`
            : isHovered
            ? `0 0 15px ${skill.color}80`
            : "0 0 0 rgba(0,0,0,0)",
        }}
        onClick={() => onSelectSkill(isSelected ? null : skill.id)}
        onMouseEnter={() => onHoverSkill(skill.id)}
        onMouseLeave={() => onHoverSkill(null)}
      >
        {/* Outer glow effect */}
        <motion.div
          className="absolute -inset-2 rounded-full opacity-30 blur-md"
          style={{ backgroundColor: skill.color }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: isSelected || isHovered ? [0.2, 0.4, 0.2] : 0,
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />

        {/* The main circle */}
        <div
          className="flex items-center justify-center rounded-full text-white font-bold relative overflow-hidden z-10"
          style={{
            backgroundColor: skill.color,
            width: `${size}px`,
            height: `${size}px`,
          }}
        >
          {/* Skill level display */}
          <div className="flex flex-col items-center justify-center">
            <span className="text-lg font-bold">{skill.level}%</span>
            {skill.experience > 0 && (
              <span className="text-xs opacity-80">{skill.experience} lat</span>
            )}
          </div>

          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
            style={{
              width: "200%",
              left: "-50%",
              transform: "rotate(30deg)",
              zIndex: -1,
            }}
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
              ease: "linear",
            }}
          />
        </div>

        {/* Skill name with background for better readability */}
        <motion.div
          className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 text-center whitespace-nowrap px-2 py-1 rounded-full bg-gray-800/80 backdrop-blur-sm"
          animate={{
            backgroundColor:
              isSelected || isHovered
                ? `${skill.color}20`
                : "rgba(30, 30, 30, 0.8)",
            color: isSelected || isHovered ? skill.color : "white",
            fontWeight: isSelected ? "bold" : "normal",
          }}
        >
          <span className="text-sm">{skill.name}</span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

// Skill details component
const SkillDetail: React.FC<SkillDetailProps> = ({ skill, onClose }) => {
  return (
    <motion.div
      className="bg-gray-800/95 backdrop-blur-md rounded-xl p-6 shadow-2xl border border-gray-700 relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      layoutId={`skill-detail-${skill.id}`}
    >
      {/* Close button */}
      <button
        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-gray-300 hover:bg-gray-600 transition-colors"
        onClick={onClose}
        type="button"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Zamknij</title>
          <path
            d="M18 6L6 18M6 6L18 18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Skill header */}
      <div className="flex items-start gap-4 mb-4">
        <div
          className="flex items-center justify-center w-16 h-16 rounded-xl flex-shrink-0"
          style={{ backgroundColor: skill.color }}
        >
          <span className="text-white font-bold text-xl">{skill.level}%</span>
        </div>

        <div>
          <h3 className="text-2xl font-bold" style={{ color: skill.color }}>
            {skill.name}
          </h3>
          <div className="flex items-center text-gray-400 text-sm mt-1">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mr-1"
            >
              <title>Doświadczenie</title>
              <path
                d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>
              {skill.experience}{" "}
              {skill.experience === 1
                ? "rok"
                : skill.experience < 5
                ? "lata"
                : "lat"}{" "}
              doświadczenia
            </span>
          </div>
        </div>
      </div>

      {/* Skill progress bar */}
      <div className="mb-6">
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="h-2 rounded-full"
            style={{ backgroundColor: skill.color }}
            initial={{ width: 0 }}
            animate={{ width: `${skill.level}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Skill description */}
      <p className="text-gray-300 mb-6">{skill.description}</p>

      {/* Tools section */}
      <div className="mb-6">
        <h4 className="text-sm uppercase tracking-wider text-gray-400 mb-3">
          Narzędzia i technologie
        </h4>
        <div className="flex flex-wrap gap-2">
          {skill.tools.map((tool) => (
            <motion.span
              key={tool}
              className="px-3 py-1 text-xs rounded-full"
              style={{
                backgroundColor: `${skill.color}20`,
                color: skill.color,
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.05 }}
            >
              {tool}
            </motion.span>
          ))}
        </div>
      </div>

      {/* Certifications section */}
      {skill.certifications && skill.certifications.length > 0 && (
        <div>
          <h4 className="text-sm uppercase tracking-wider text-gray-400 mb-3">
            Certyfikaty
          </h4>
          <ul className="space-y-2">
            {skill.certifications.map((cert, index) => (
              <motion.li
                key={cert}
                className="flex items-center gap-2 text-gray-300"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ color: skill.color }}
                >
                  <title>Certyfikat</title>
                  <path
                    d="M9 12L11 14L15 10M12 3L4 7V15C4 15.7377 4.13 16.4362 4.35 17.0767C4.91 18.6618 6.03 19.9937 7.5 20.837C9 21.7003 10.7 22 12 22C13.3 22 15 21.7003 16.5 20.837C17.97 19.9937 19.09 18.6618 19.65 17.0767C19.87 16.4362 20 15.7377 20 15V7L12 3Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>{cert}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
};

// Mobile skill list item
const SkillListItem: React.FC<SkillListItemProps> = ({
  skill,
  index,
  isSelected,
  isHovered,
  onSelect,
  onHover,
}) => {
  return (
    <motion.div
      className={`p-4 cursor-pointer rounded-lg mb-3 border-l-4 transition-colors ${
        isSelected
          ? "bg-gray-800 border-current"
          : isHovered
          ? "bg-gray-800/70 border-gray-600"
          : "bg-gray-800/50 border-gray-700 hover:bg-gray-800/70"
      }`}
      style={{ borderColor: isSelected || isHovered ? skill.color : undefined }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      onClick={onSelect}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      whileHover={{
        x: 5,
        transition: { duration: 0.2 },
      }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div
            className="w-12 h-12 rounded-lg flex flex-col items-center justify-center mr-3 font-bold text-white"
            style={{ backgroundColor: skill.color }}
          >
            <span className="text-lg">{skill.level}%</span>
            <span className="text-xs opacity-80">{skill.experience}y</span>
          </div>
          <div>
            <h3 className="font-bold text-white">{skill.name}</h3>
            <div className="flex flex-wrap gap-1 mt-1">
              {skill.tools.slice(0, 2).map((tool) => (
                <span
                  key={tool}
                  className="inline-block px-2 py-0.5 text-xs rounded-full bg-gray-700 text-gray-300"
                >
                  {tool}
                </span>
              ))}
              {skill.tools.length > 2 && (
                <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-gray-700 text-gray-300">
                  +{skill.tools.length - 2}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="w-20 h-2 bg-gray-700 rounded-full">
          <div
            className="h-2 rounded-full"
            style={{
              width: `${skill.level}%`,
              backgroundColor: skill.color,
            }}
          />
        </div>
      </div>

      {/* Expanded content when selected */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pt-4 mt-4 border-t border-gray-700">
              <p className="text-gray-300 text-sm mb-4">{skill.description}</p>

              <div className="flex flex-wrap gap-1 mb-3">
                {skill.tools.map((tool) => (
                  <span
                    key={tool}
                    className="px-2 py-0.5 text-xs rounded-full"
                    style={{
                      backgroundColor: `${skill.color}20`,
                      color: skill.color,
                    }}
                  >
                    {tool}
                  </span>
                ))}
              </div>

              {skill.certifications && skill.certifications.length > 0 && (
                <div className="text-xs text-gray-400">
                  <div className="mb-1">Certyfikaty:</div>
                  <ul className="list-disc list-inside">
                    {skill.certifications.map((cert) => (
                      <li key={cert}>{cert}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Category filter
const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategories,
  onToggleCategory,
}) => {
  const categoryColors = {
    devops: "#4361EE",
    cloud: "#3A86FF",
    security: "#FF006E",
    development: "#06D6A0",
    infrastructure: "#118AB2",
  };

  const categoryLabels = {
    devops: "DevOps",
    cloud: "Cloud",
    security: "Bezpieczeństwo",
    development: "Programowanie",
    infrastructure: "Infrastruktura",
  };

  return (
    <div className="flex flex-wrap justify-center gap-2 mb-8">
      {categories.map((category) => {
        const isSelected = selectedCategories.includes(category);

        return (
          <motion.button
            key={category}
            className={`px-3 py-1.5 rounded-full text-sm font-medium ${
              isSelected ? "border" : "border border-gray-700 opacity-70"
            }`}
            style={{
              backgroundColor: isSelected
                ? `${categoryColors[category]}20`
                : "transparent",
              borderColor: isSelected ? categoryColors[category] : undefined,
              color: isSelected ? categoryColors[category] : "#a0a0a0",
            }}
            whileHover={{ scale: 1.05, opacity: 1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onToggleCategory(category)}
          >
            {categoryLabels[category]}
          </motion.button>
        );
      })}
    </div>
  );
};

// Connecting lines between skills
const SkillConnections: React.FC<{
  skills: Skill[];
  nodePositions: { [id: string]: { x: number; y: number } };
  selectedSkill: string | null;
  hoveredSkill: string | null;
  radius: number;
}> = ({ skills, nodePositions, selectedSkill, hoveredSkill, radius }) => {
  // Only show connecting lines if we have positions and the viewport is large enough
  if (!nodePositions || Object.keys(nodePositions).length === 0 || radius < 100)
    return null;

  // Create connections between related skills
  const connections = [
    // DevOps connections
    { from: "devops", to: "iac" },
    { from: "devops", to: "containers" },
    { from: "devops", to: "monitoring" },
    { from: "devops", to: "cloud" },
    // Cloud connections
    { from: "cloud", to: "iac" },
    { from: "cloud", to: "containers" },
    { from: "cloud", to: "networking" },
    // Security connections
    { from: "security", to: "networking" },
    { from: "security", to: "servers" },
    // Server connections
    { from: "servers", to: "databases" },
    { from: "servers", to: "monitoring" },
    { from: "servers", to: "networking" },
    // Database connections
    { from: "databases", to: "programming" },
    { from: "databases", to: "web" },
    // Programming connections
    { from: "programming", to: "web" },
    { from: "programming", to: "containers" },
    { from: "programming", to: "iac" },
  ];

  // Filter connections based on selectedSkill or hoveredSkill
  const filteredConnections = connections.filter((conn) => {
    if (!selectedSkill && !hoveredSkill) return true;
    const activeSkill = selectedSkill || hoveredSkill;
    return conn.from === activeSkill || conn.to === activeSkill;
  });

  return (
    <svg
      className="absolute inset-0 w-full h-full"
      style={{ overflow: "visible" }}
    >
      <title>Connections</title>
      {filteredConnections.map(({ from, to }) => {
        // Check if both nodes exist
        if (!nodePositions[from] || !nodePositions[to]) return null;

        const fromPos = nodePositions[from];
        const toPos = nodePositions[to];
        const isHighlighted =
          selectedSkill === from ||
          selectedSkill === to ||
          hoveredSkill === from ||
          hoveredSkill === to;

        // Find the skill colors
        const fromSkill = skills.find((s) => s.id === from);
        const toSkill = skills.find((s) => s.id === to);

        if (!fromSkill || !toSkill) return null;

        // Create a gradient between the two skill colors
        const gradientId = `gradient-${from}-${to}`;

        return (
          <g key={`${from}-${to}`}>
            {/* Define the gradient */}
            <defs>
              <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={fromSkill.color} />
                <stop offset="100%" stopColor={toSkill.color} />
              </linearGradient>
            </defs>

            {/* Draw the connection line */}
            <motion.line
              x1={fromPos.x + radius}
              y1={fromPos.y + radius}
              x2={toPos.x + radius}
              y2={toPos.y + radius}
              stroke={`url(#${gradientId})`}
              strokeWidth={isHighlighted ? 3 : 1}
              strokeOpacity={isHighlighted ? 0.8 : 0.3}
              strokeDasharray={isHighlighted ? "none" : "5,5"}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1 }}
            />

            {/* Animated particle along the line */}
            {isHighlighted && (
              <motion.circle
                r={3}
                fill={toSkill.color}
                filter="blur(1px)"
                animate={{
                  cx: [fromPos.x + radius, toPos.x + radius],
                  cy: [fromPos.y + radius, toPos.y + radius],
                  opacity: [1, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              />
            )}
          </g>
        );
      })}
    </svg>
  );
};

// Main skills diagram component
const EnhancedSkillsDiagram: React.FC = () => {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [hasAnimated, setHasAnimated] = useState<boolean>(false);
  const [nodePositions, setNodePositions] = useState<{
    [id: string]: { x: number; y: number };
  }>({});
  const [selectedCategories, setSelectedCategories] = useState<
    Array<Skill["category"]>
  >(["devops", "cloud", "security", "development", "infrastructure"]);

  const diagramRef = useRef<HTMLDivElement>(null);
  const radius = useRef<number>(180);

  // Filtered skills based on selected categories
  const filteredSkills = skills.filter((skill) =>
    selectedCategories.includes(skill.category)
  );

  // Check if the component is visible in viewport
  const isVisible = useRef<boolean>(false);

  // Handle category toggle
  const handleToggleCategory = (category: Skill["category"]) => {
    setSelectedCategories((prev) => {
      // Don't allow deselecting all categories
      if (prev.includes(category) && prev.length === 1) return prev;

      if (prev.includes(category)) {
        // If we're removing a category and the selected skill is in that category, deselect it
        if (
          selectedSkill &&
          skills.find((s) => s.id === selectedSkill)?.category === category
        ) {
          setSelectedSkill(null);
        }
        return prev.filter((c) => c !== category);
      }
      return [...prev, category];
    });
  };

  // Detect mobile and calculate positions
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    const calculateRadius = () => {
      if (!diagramRef.current) return;

      const width = diagramRef.current.clientWidth;
      const baseRadius = 180;

      if (width < 640) {
        radius.current = baseRadius * 0.5;
      } else if (width < 768) {
        radius.current = baseRadius * 0.7;
      } else if (width < 1024) {
        radius.current = baseRadius * 0.9;
      } else {
        radius.current = baseRadius;
      }

      // Calculate and store node positions
      const positions: { [id: string]: { x: number; y: number } } = {};

      filteredSkills.forEach((skill, index) => {
        const position = calculatePosition(
          index,
          filteredSkills.length,
          radius.current
        );
        positions[skill.id] = position;
      });

      setNodePositions(positions);
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      for (const entry of entries) {
        if (entry.isIntersecting && !hasAnimated) {
          isVisible.current = true;
          setHasAnimated(true);
        }
      }
    };

    // Initialize intersection observer
    if (typeof window !== "undefined" && diagramRef.current) {
      const observer = new IntersectionObserver(handleIntersection, {
        threshold: 0.1,
      });

      observer.observe(diagramRef.current);
    }

    checkIsMobile();
    calculateRadius();

    window.addEventListener("resize", checkIsMobile);
    window.addEventListener("resize", calculateRadius);

    return () => {
      window.removeEventListener("resize", checkIsMobile);
      window.removeEventListener("resize", calculateRadius);
    };
  }, [filteredSkills, hasAnimated]);

  // Get all unique categories
  const allCategories = Array.from(
    new Set(skills.map((skill) => skill.category))
  ) as Array<Skill["category"]>;

  return (
    <div className="py-16 px-4 bg-gray-900 rounded-xl border border-gray-800 shadow-xl text-white">
      <motion.h2
        className="text-2xl md:text-3xl font-bold text-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
          Umiejętności Techniczne
        </span>
      </motion.h2>

      <motion.p
        className="text-gray-300 text-center max-w-2xl mx-auto mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Specjalizuję się w szerokiej gamie technologii DevOps, chmurowych i
        bezpieczeństwa, z wieloletnim doświadczeniem w projektowaniu, wdrażaniu
        i zarządzaniu kompleksowymi środowiskami IT.
      </motion.p>

      {/* Category filters */}
      <CategoryFilter
        categories={allCategories}
        selectedCategories={selectedCategories}
        onToggleCategory={handleToggleCategory}
      />

      {isMobile ? (
        // Mobile list view
        <div className="space-y-3 mt-6">
          {filteredSkills.map((skill, index) => (
            <SkillListItem
              key={skill.id}
              skill={skill}
              index={index}
              isSelected={selectedSkill === skill.id}
              isHovered={hoveredSkill === skill.id}
              onSelect={() =>
                setSelectedSkill(selectedSkill === skill.id ? null : skill.id)
              }
              onHover={(hovered) => setHoveredSkill(hovered ? skill.id : null)}
            />
          ))}
        </div>
      ) : (
        // Desktop diagram view
        <div
          ref={diagramRef}
          className="relative mt-6"
          style={{ height: `${radius.current * 2 + 150}px` }}
        >
          {/* Connecting lines between skills */}
          <SkillConnections
            skills={skills}
            nodePositions={nodePositions}
            selectedSkill={selectedSkill}
            hoveredSkill={hoveredSkill}
            radius={radius.current}
          />

          {/* Background circles */}
          <div className="absolute inset-0 flex items-center justify-center">
            {[0.4, 0.7, 1].map((scale, i) => (
              <motion.div
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                key={i}
                className="absolute rounded-full border border-gray-700"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.5 }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
                style={{
                  width: `${radius.current * 2 * scale}px`,
                  height: `${radius.current * 2 * scale}px`,
                }}
              />
            ))}

            {/* Central circle */}
            <motion.div
              className="absolute bg-gradient-to-br from-blue-600/30 to-purple-600/30 rounded-full flex items-center justify-center z-10 text-center px-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              style={{ width: "100px", height: "100px" }}
            >
              <span className="text-white font-bold">DevOps Skills</span>
            </motion.div>
          </div>

          {/* Skill nodes */}
          {filteredSkills.map((skill, index) => (
            <SkillNode
              key={skill.id}
              skill={skill}
              index={index}
              total={filteredSkills.length}
              radius={radius.current}
              selectedSkill={selectedSkill}
              onSelectSkill={setSelectedSkill}
              hoveredSkill={hoveredSkill}
              onHoverSkill={setHoveredSkill}
              animate={hasAnimated}
            />
          ))}

          {/* Skill detail panel */}
          <AnimatePresence>
            {selectedSkill && (
              <motion.div
                className="absolute left-1/2 transform -translate-x-1/2 bottom-0 w-full max-w-lg z-20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Find the skill safely without using non-null assertion */}
                {(() => {
                  const foundSkill = skills.find((s) => s.id === selectedSkill);
                  return foundSkill ? (
                    <SkillDetail
                      skill={foundSkill}
                      onClose={() => setSelectedSkill(null)}
                    />
                  ) : null;
                })()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default EnhancedSkillsDiagram;
