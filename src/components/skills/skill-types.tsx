// Skill data models and types

import type { LucideIcon } from "lucide-react";
import {
  Server,
  Shield,
  Cloud,
  Database,
  Cog,
  BarChart,
  Code,
  Github,
  Network,
  FileCode,
  Globe,
} from "lucide-react";

/**
 * Skill category types
 */
export type SkillCategory =
  | "devops"
  | "cloud"
  | "security"
  | "development"
  | "infrastructure";

/**
 * Skill data interface
 */
export interface Skill {
  id: string;
  name: string;
  level: number;
  color: string;
  description: string;
  tools: string[];
  experience: number; // years of experience
  certifications: string[];
  category: SkillCategory;
  icon: LucideIcon;
}

/**
 * Category color and label mapping
 */
export const CATEGORY_CONFIG = {
  devops: {
    color: "#4361EE",
    label: "DevOps",
  },
  cloud: {
    color: "#3A86FF",
    label: "Cloud",
  },
  security: {
    color: "#FF006E",
    label: "Bezpieczeństwo",
  },
  development: {
    color: "#06D6A0",
    label: "Programowanie",
  },
  infrastructure: {
    color: "#118AB2",
    label: "Infrastruktura",
  },
};

/**
 * Connection configuration for visualizing skill relationships
 */
export const SKILL_CONNECTIONS = [
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

/**
 * Skills data
 */
export const SKILLS_DATA: Skill[] = [
  {
    id: "devops",
    name: "DevOps",
    level: 95,
    color: "#4361EE",
    description:
      "Integracja ciągła (CI/CD), automatyzacja procesów, zarządzanie konfiguracją i wdrażanie. Specjalizuję się w tworzeniu wydajnych potoków wdrożeniowych.",
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
    icon: Cog,
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
    icon: Cloud,
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
    icon: Shield,
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
    icon: Server,
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
    icon: Database,
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
    icon: Code,
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
    icon: FileCode,
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
    icon: Github,
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
    icon: BarChart,
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
    icon: Network,
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
    icon: Globe,
  },
];

/**
 * Get all unique skill categories
 */
export const getAllCategories = (): SkillCategory[] => {
  return [
    ...new Set(SKILLS_DATA.map((skill) => skill.category)),
  ] as SkillCategory[];
};

/**
 * Helper function: Convert degrees to radians
 */
export const degreesToRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

/**
 * Calculate position on a circle with improved distribution
 *
 * @param index Current item index
 * @param total Total number of items
 * @param radius Circle radius
 * @param angleOffset Optional angle offset in degrees
 * @returns Position coordinates {x, y}
 */
export const calculatePosition = (
  index: number,
  total: number,
  radius: number,
  angleOffset = 0
): { x: number; y: number } => {
  // Start from top (-90 degrees) and distribute evenly
  // Add small angle offset for better spacing with many items
  const baseAngle = (index / total) * 360;
  const angle = baseAngle - 90 + angleOffset;

  // Add a slight radial variation for items at crowded angles
  const radialVariation =
    total > 8 ? (index % 3 === 0 ? 0.95 : index % 3 === 1 ? 1 : 1.05) : 1;

  const adjustedRadius = radius * radialVariation;

  const x = adjustedRadius * Math.cos(degreesToRadians(angle));
  const y = adjustedRadius * Math.sin(degreesToRadians(angle));

  return { x, y };
};
