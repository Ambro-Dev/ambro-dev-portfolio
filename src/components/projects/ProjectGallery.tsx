"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Github,
  Calendar,
  ArrowRight,
  CheckCircle,
  Tag as TagIcon,
  Globe,
  Code,
  Server,
  Database,
  Cloud,
  Shield,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";

// Define interfaces for our data
interface Project {
  id: number;
  title: string;
  description: string;
  longDescription?: string;
  image: string;
  technologies: string[];
  date: string;
  category: string;
  link: string;
  clientName?: string;
  challenge?: string;
  solution?: string;
  results?: string[];
  features?: string[];
  icon?: LucideIcon;
  color?: string;
}

interface TagProps {
  label: string;
  color?: string;
  onSelect?: () => void;
  isSelected?: boolean;
}

interface ProjectCardProps {
  project: Project;
  isActive: boolean;
  index: number;
  currentIndex: number;
  direction: number;
  onSelect: () => void;
}

interface DetailViewProps {
  project: Project;
  onClose: () => void;
}

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

// Enhanced project data with more details
const projects: Project[] = [
  {
    id: 1,
    title: "Automatyzacja procesów wdrożeniowych",
    description:
      "Wdrożenie pipeline'u CI/CD, który skrócił czas wdrożeń o 70% i znacznie zmniejszył liczbę błędów w produkcji.",
    longDescription:
      "Kompleksowe wdrożenie potoku CI/CD dla dużej organizacji finansowej, obejmujące automatyzację testów, wdrożeń i walidacji. Projekt wymagał koordynacji pracy wielu zespołów i integracji różnorodnych technologii w spójny, niezawodny proces.",
    image: "/images/projects/project-01/cover-01.jpg",
    technologies: [
      "Jenkins",
      "Docker",
      "Kubernetes",
      "GitHub Actions",
      "AWS",
      "Terraform",
      "Python",
      "Bash",
    ],
    date: "2023",
    category: "DevOps",
    link: "https://github.com/user/project1",
    clientName: "FinTech Solutions Inc.",
    challenge:
      "Firma borykała się z długimi, ręcznymi procesami wdrożeniowymi, które powodowały częste błędy w produkcji i wydłużały czas wprowadzania nowych funkcji na rynek.",
    solution:
      "Zaprojektowanie i wdrożenie w pełni zautomatyzowanego potoku CI/CD z wielostopniowymi testami, walidacją i automatycznym wdrażaniem. Implementacja infrastruktury jako kodu (IaC) i konteneryzacja aplikacji.",
    results: [
      "Skrócenie czasu wdrożeń o 70%, z dni do godzin",
      "Zmniejszenie liczby błędów w produkcji o 85%",
      "Zwiększenie częstotliwości wdrożeń z miesięcznych do dziennych",
      "Oszczędność ponad 400 godzin pracy zespołu miesięcznie",
      "Poprawa morale zespołu deweloperskiego",
    ],
    features: [
      "Multi-stage pipeline z walidacjami na każdym etapie",
      "Automatyczne tworzenie środowisk testowych",
      "Kompleksowe testy integracyjne i bezpieczeństwa",
      "Rollback w ciągu minut w przypadku problemów",
      "Zaawansowany system monitorowania wdrożeń",
    ],
    icon: Code,
    color: "#4361EE",
  },
  {
    id: 2,
    title: "Migracja infrastruktury do chmury",
    description:
      "Kompleksowa migracja lokalnej infrastruktury do AWS z wykorzystaniem Infrastructure as Code, skutkująca 40% redukcją kosztów.",
    longDescription:
      "Projekt obejmował przeniesienie całej infrastruktury firmy z centrum danych do środowiska AWS. Wymagało to starannego planowania, minimalizacji przestojów i zapewnienia bezpieczeństwa danych. Wykorzystano podejście 'Infrastructure as Code' z Terraform do automatyzacji procesu.",
    image: "/images/projects/project-01/cover-02.jpg",
    technologies: [
      "AWS",
      "Terraform",
      "CloudFormation",
      "Lambda",
      "S3",
      "EC2",
      "RDS",
      "Docker",
    ],
    date: "2022",
    category: "Cloud",
    link: "https://github.com/user/project2",
    clientName: "RetailTech Global",
    challenge:
      "Firma posiadała przestarzałą infrastrukturę lokalną, która generowała wysokie koszty utrzymania, miała ograniczoną skalowalność i powodowała częste przestoje.",
    solution:
      "Przeprowadzenie migracji 'lift and shift' z jednoczesną modernizacją kluczowych komponentów. Implementacja infrastruktury jako kodu z Terraform, wdrożenie architektury wielowarstwowej i automatyzacja procesów zarządzania zasobami.",
    results: [
      "Redukcja kosztów infrastruktury o 40%",
      "Zwiększenie dostępności systemów z 99.5% do 99.99%",
      "Skrócenie czasu wdrażania nowych zasobów o 85%",
      "Poprawa bezpieczeństwa i zgodności z przepisami",
      "Elastyczne skalowanie dostosowane do obciążenia",
    ],
    features: [
      "Architektura multi-region dla wysokiej dostępności",
      "Automatyczne kopie zapasowe i procedury disaster recovery",
      "Monitorowanie i alarmowanie w czasie rzeczywistym",
      "Optymalizacja kosztów z auto-skalowaniem",
      "Zaawansowane mechanizmy bezpieczeństwa",
    ],
    icon: Cloud,
    color: "#3A86FF",
  },
  {
    id: 3,
    title: "System monitorowania infrastruktury",
    description:
      "Implementacja rozwiązania do kompleksowego monitorowania systemów IT z automatycznymi alertami i dashboardami.",
    longDescription:
      "Wdrożenie zaawansowanego systemu monitorowania opartego na stosie Prometheus, Grafana i Alertmanager. Projekt obejmował monitorowanie infrastruktury, aplikacji i procesów biznesowych z automatycznym alertowaniem i wizualizacją danych na customizowanych dashboardach.",
    image: "/images/projects/project-01/cover-03.jpg",
    technologies: [
      "Prometheus",
      "Grafana",
      "Alertmanager",
      "ELK Stack",
      "Kubernetes",
      "Terraform",
      "Node Exporter",
      "Blackbox Exporter",
    ],
    date: "2023",
    category: "Monitoring",
    link: "https://github.com/user/project3",
    clientName: "HealthTech Solutions",
    challenge:
      "Brak centralnego systemu monitorowania uniemożliwiał szybkie wykrywanie i rozwiązywanie problemów. Firma potrzebowała kompleksowego rozwiązania do monitorowania infrastruktury, aplikacji i procesów biznesowych.",
    solution:
      "Wdrożenie stosu Prometheus-Grafana-Alertmanager do zbierania metryk, wizualizacji danych i alertowania. Integracja z systemami ticketowymi i komunikacją zespołową. Stworzenie customizowanych dashboardów dla różnych zespołów.",
    results: [
      "Skrócenie średniego czasu wykrywania problemów (MTTD) o 75%",
      "Zmniejszenie średniego czasu rozwiązywania problemów (MTTR) o 60%",
      "Proaktywne wykrywanie potencjalnych problemów przed wpływem na użytkowników",
      "Lepsze zrozumienie wzorców użytkowania i obciążenia systemów",
      "Optymalizacja zasobów na podstawie danych historycznych",
    ],
    features: [
      "Customizowane dashboardy dla różnych zespołów i ról",
      "Automatyczne powiadomienia przez różne kanały (Slack, email, SMS)",
      "Korelacja zdarzeń z różnych systemów",
      "Historyczne analizy trendów",
      "Automatyczne eskalacje alertów",
    ],
    icon: Server,
    color: "#FB5607",
  },
  {
    id: 4,
    title: "Portal dla zespołu DevOps",
    description:
      "Aplikacja webowa umożliwiająca zarządzanie zasobami infrastruktury, automatyzację zadań i self-service dla deweloperów.",
    longDescription:
      "Stworzenie wewnętrznego portalu DevOps, który służy jako centralne miejsce zarządzania infrastrukturą, automatyzacji powtarzalnych zadań i umożliwia deweloperom samodzielne tworzenie zasobów bez konieczności angażowania zespołu operacyjnego.",
    image: "/images/projects/project-01/cover-04.jpg",
    technologies: [
      "React",
      "Node.js",
      "MongoDB",
      "Docker",
      "GitLab API",
      "Terraform",
      "GraphQL",
      "Material UI",
    ],
    date: "2021",
    category: "Web Development",
    link: "https://github.com/user/project4",
    clientName: "TechCorp International",
    challenge:
      "Zespół DevOps był przeciążony powtarzalnymi zadaniami konfiguracji i prowizjonowania zasobów. Deweloperzy musieli czekać na wykonanie rutynowych zadań przez zespół operacyjny, co spowalniało rozwój produktu.",
    solution:
      "Stworzenie wewnętrznego portalu z interfejsem samoobsługowym, umożliwiającego deweloperom samodzielne tworzenie środowisk, zarządzanie zasobami i automatyzację rutynowych zadań przy zachowaniu odpowiednich polityk bezpieczeństwa.",
    results: [
      "Zmniejszenie liczby ticketów do zespołu DevOps o 70%",
      "Skrócenie czasu oczekiwania deweloperów na zasoby z dni do minut",
      "Standaryzacja środowisk deweloperskich i testowych",
      "Lepsza widoczność wykorzystania zasobów i kosztów",
      "Zwiększenie produktywności zespołów deweloperskich",
    ],
    features: [
      "Self-service portal dla tworzenia zasobów",
      "Automatyzacja cyklu życia środowisk",
      "Integracja z systemami CI/CD",
      "Zarządzanie dostępem bazujące na rolach",
      "Raportowanie i analityka wykorzystania zasobów",
    ],
    icon: Globe,
    color: "#8338EC",
  },
  {
    id: 5,
    title: "Bezpieczna infrastruktura hybrydowa",
    description:
      "Wdrożenie rozwiązania hybrydowego łączącego środowisko lokalne z chmurą, z zaawansowanymi mechanizmami bezpieczeństwa.",
    longDescription:
      "Projekt polegał na stworzeniu bezpiecznej infrastruktury hybrydowej, która pozwoliła klientowi zachować krytyczne dane lokalnie, jednocześnie wykorzystując skalowalność i elastyczność chmury publicznej. Szczególny nacisk położono na zabezpieczenia i płynną integrację obu środowisk.",
    image: "/images/projects/project-01/cover-05.jpg",
    technologies: [
      "AWS Direct Connect",
      "Azure ExpressRoute",
      "VPN",
      "Firewall",
      "Zero Trust Architecture",
      "Kubernetes",
      "Terraform",
      "Ansible",
    ],
    date: "2022",
    category: "Security",
    link: "https://github.com/user/project5",
    clientName: "Financial Services Group",
    challenge:
      "Klient z sektora finansowego potrzebował wykorzystać zalety chmury, jednocześnie zachowując zgodność z regulacjami wymagającymi lokalnego przechowywania danych osobowych i finansowych.",
    solution:
      "Zaprojektowanie i wdrożenie architektury hybrydowej z bezpiecznym połączeniem między środowiskiem lokalnym a chmurą, implementacja podejścia Zero Trust, wielowarstwowe zabezpieczenia i monitoring bezpieczeństwa w czasie rzeczywistym.",
    results: [
      "Zgodność ze wszystkimi wymaganiami regulacyjnymi przy jednoczesnym wykorzystaniu zalet chmury",
      "Zwiększenie poziomu bezpieczeństwa dzięki wielowarstwowej architekturze",
      "Redukcja kosztów infrastruktury o 25% przy zwiększeniu możliwości",
      "Wykrywanie i odpowiedź na zagrożenia w czasie rzeczywistym",
      "Efektywne wykorzystanie zasobów lokalnych i chmurowych",
    ],
    features: [
      "Zabezpieczone połączenia dedykowane (AWS Direct Connect, Azure ExpressRoute)",
      "End-to-end szyfrowanie danych",
      "Zaawansowana segmentacja sieci",
      "Ciągłe monitorowanie bezpieczeństwa",
      "Automatyzowane audyty bezpieczeństwa",
    ],
    icon: Shield,
    color: "#FF006E",
  },
  {
    id: 6,
    title: "Platform as a Service dla mikroserwisów",
    description:
      "Budowa własnej platformy PaaS umożliwiającej szybkie wdrażanie i zarządzanie aplikacjami opartymi o mikroserwisy.",
    longDescription:
      "Stworzenie wewnętrznej platformy typu Platform as a Service, która umożliwia zespołom deweloperskim samodzielne wdrażanie mikroserwisów bez konieczności zarządzania infrastrukturą. Platforma zapewnia automatyczne skalowanie, monitoring i zarządzanie konfiguracją.",
    image: "/images/projects/project-01/cover-06.jpg",
    technologies: [
      "Kubernetes",
      "Istio",
      "Helm",
      "Docker",
      "Prometheus",
      "Grafana",
      "Harbor",
      "GitOps",
    ],
    date: "2023",
    category: "DevOps",
    link: "https://github.com/user/project6",
    clientName: "E-commerce Platform Inc.",
    challenge:
      "Firma miała trudności z efektywnym zarządzaniem rosnącą liczbą mikroserwisów. Deweloperzy tracili czas na konfigurację infrastruktury zamiast skupiać się na rozwoju funkcji biznesowych.",
    solution:
      "Zaprojektowanie i zbudowanie wewnętrznej platformy PaaS, która automatyzuje proces wdrażania, skalowania i monitorowania mikroserwisów. Wdrożenie podejścia GitOps do zarządzania konfiguracją i pipeline'ami CI/CD.",
    results: [
      "Skrócenie czasu wdrażania nowych mikroserwisów z tygodni do minut",
      "Zwiększenie liczby wdrożeń o 300% bez dodatkowych zasobów DevOps",
      "Standaryzacja konfiguracji i praktyk bezpieczeństwa",
      "Lepsze wykorzystanie zasobów obliczeniowych dzięki auto-skalowaniu",
      "Redukcja kosztów operacyjnych o 35%",
    ],
    features: [
      "Self-service portal dla deweloperów",
      "Automatyczne skalowanie horyzontalne i wertykalne",
      "Zaawansowany routing i zarządzanie ruchem",
      "Wbudowane monitorowanie i alarmowanie",
      "Zarządzanie sekretami i konfiguracją",
    ],
    icon: Database,
    color: "#06D6A0",
  },
];

// Tag component
const Tag: React.FC<TagProps> = ({
  label,
  color = "#4361EE",
  onSelect,
  isSelected = false,
}) => {
  return (
    <motion.span
      className={`px-3 py-1.5 text-xs rounded-full flex items-center gap-1 cursor-pointer transition-colors ${
        isSelected
          ? "bg-opacity-30 border border-current"
          : "bg-opacity-10 hover:bg-opacity-20"
      }`}
      style={{
        backgroundColor: `${color}${isSelected ? "30" : "10"}`,
        color: color,
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onSelect}
    >
      {isSelected && <CheckCircle size={12} />}
      {label}
    </motion.span>
  );
};

// Category filter component
const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  // Color mapping for categories
  const categoryColors: Record<string, string> = {
    All: "#64748b",
    DevOps: "#4361EE",
    Cloud: "#3A86FF",
    Security: "#FF006E",
    Monitoring: "#FB5607",
    "Web Development": "#8338EC",
  };

  return (
    <div className="flex flex-wrap justify-center gap-2 mb-8">
      <Tag
        label="All Projects"
        color={categoryColors.All}
        onSelect={() => onSelectCategory(null)}
        isSelected={selectedCategory === null}
      />

      {categories.map((category) => (
        <Tag
          key={category}
          label={category}
          color={categoryColors[category] || "#64748b"}
          onSelect={() => onSelectCategory(category)}
          isSelected={selectedCategory === category}
        />
      ))}
    </div>
  );
};

// Project detail view
const DetailView: React.FC<DetailViewProps> = ({ project, onClose }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  // Scroll to top when opening detail view
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [project]);

  // Get icon component
  const Icon = project.icon || Code;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/90 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative w-full max-w-5xl max-h-[90vh] bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.9 }}
        transition={{ type: "spring", damping: 25 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-gray-700/70 backdrop-blur-sm text-white hover:bg-gray-600 transition-colors"
          onClick={onClose}
          type="button"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <title>Close</title>
            <path d="M18 6L6 18M6 6L18 18" />
          </svg>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left side - Image and brief info */}
          <div className="relative h-64 md:h-full">
            {/* Image with overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/70 to-transparent z-10 md:bg-gradient-to-b md:from-transparent md:via-gray-900/70 md:to-gray-900" />

            <Image
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />

            {/* Brief info overlay */}
            <div className="absolute bottom-0 left-0 p-6 z-20 w-full">
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={16} className="text-gray-400" />
                <span className="text-sm text-gray-300">{project.date}</span>

                <span className="mx-2 text-gray-500">•</span>

                <TagIcon size={16} className="text-gray-400" />
                <span className="text-sm text-gray-300">
                  {project.category}
                </span>
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                {project.title}
              </h2>

              {project.clientName && (
                <p className="text-gray-400 text-sm mb-4">
                  Client: {project.clientName}
                </p>
              )}

              <div className="flex flex-wrap gap-1 mb-4">
                {project.technologies.slice(0, 5).map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-1 text-xs bg-gray-700/50 backdrop-blur-sm rounded-full text-gray-300"
                  >
                    {tech}
                  </span>
                ))}
                {project.technologies.length > 5 && (
                  <span className="px-2 py-1 text-xs bg-gray-700/50 backdrop-blur-sm rounded-full text-gray-300">
                    +{project.technologies.length - 5}
                  </span>
                )}
              </div>

              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white text-sm font-medium transition-colors"
              >
                <Github size={16} />
                <span>View Repository</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>

          {/* Right side - Detailed content */}
          <div ref={contentRef} className="p-6 overflow-y-auto max-h-[90vh]">
            {/* Section: Description */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <div
                  className="p-1.5 rounded-lg"
                  style={{ backgroundColor: project.color || "#4361EE" }}
                >
                  <Icon size={18} color="white" />
                </div>
                Project Overview
              </h3>
              <p className="text-gray-300">
                {project.longDescription || project.description}
              </p>
            </div>

            {/* Section: Challenge */}
            {project.challenge && (
              <div className="mb-8">
                <h3 className="text-lg font-bold text-white mb-3">
                  The Challenge
                </h3>
                <p className="text-gray-300">{project.challenge}</p>
              </div>
            )}

            {/* Section: Solution */}
            {project.solution && (
              <div className="mb-8">
                <h3 className="text-lg font-bold text-white mb-3">
                  The Solution
                </h3>
                <p className="text-gray-300">{project.solution}</p>
              </div>
            )}

            {/* Section: Key Results */}
            {project.results && project.results.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-bold text-white mb-3">
                  Key Results
                </h3>
                <ul className="space-y-2">
                  {project.results.map((result, index) => (
                    <motion.li
                      // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                      key={index}
                      className="flex items-start gap-2 text-gray-300"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <CheckCircle
                        size={18}
                        className="text-green-500 flex-shrink-0 mt-1"
                      />
                      <span>{result}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}

            {/* Section: Features */}
            {project.features && project.features.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-bold text-white mb-3">
                  Key Features
                </h3>
                <ul className="space-y-2">
                  {project.features.map((feature, index) => (
                    <motion.li
                      // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                      key={index}
                      className="flex items-start gap-2 text-gray-300"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                    >
                      <div className="p-1 rounded-full bg-blue-500/20 text-blue-400 flex-shrink-0 mt-0.5">
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <title>Checkmark</title>
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      <span>{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}

            {/* Section: All Technologies */}
            <div>
              <h3 className="text-lg font-bold text-white mb-3">
                Technologies Used
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 text-xs rounded-full bg-gray-700 text-gray-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Project card component
const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  isActive,
  index,
  currentIndex,
  direction,
  onSelect,
}) => {
  const isNext = (currentIndex + 1) % projects.length === index;
  const isPrev =
    (currentIndex - 1 + projects.length) % projects.length === index;

  // Define slide variants for the animation
  const slideVariants: Variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.5 },
        scale: { duration: 0.5 },
      },
    },
    exit: (direction: number) => ({
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 0.8,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.5 },
        scale: { duration: 0.5 },
      },
    }),
    prev: {
      x: "-25%",
      opacity: 0.5,
      scale: 0.9,
      filter: "blur(2px)",
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.5 },
        scale: { duration: 0.5 },
      },
    },
    next: {
      x: "25%",
      opacity: 0.5,
      scale: 0.9,
      filter: "blur(2px)",
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.5 },
        scale: { duration: 0.5 },
      },
    },
    inactive: {
      x: "100%",
      opacity: 0,
      scale: 0.8,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.5 },
        scale: { duration: 0.5 },
      },
    },
  };

  // Determine which variant to use
  let variant: string;
  if (isActive) {
    variant = "center";
  } else if (isPrev) {
    variant = "prev";
  } else if (isNext) {
    variant = "next";
  } else {
    variant = "inactive";
  }

  // Item variants for staggered animation
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
  };

  return (
    <motion.div
      custom={direction}
      variants={slideVariants}
      initial={isActive ? "enter" : "inactive"}
      animate={variant}
      exit="exit"
      className={`absolute w-full ${
        isActive ? "z-20 cursor-pointer" : isPrev || isNext ? "z-10" : "z-0"
      }`}
      onClick={isActive ? onSelect : undefined}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 bg-gray-800 rounded-xl overflow-hidden shadow-xl">
        {/* Project image */}
        <div className="relative h-64 md:h-auto overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gray-900/60 z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
          <motion.img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.7 }}
          />

          {/* Overlay content for mobile view */}
          <div className="absolute bottom-0 left-0 p-4 z-20 md:hidden">
            <motion.div initial="hidden" animate="visible">
              <motion.div
                className="flex items-center gap-2 mb-2"
                custom={0}
                variants={itemVariants}
              >
                <Calendar size={14} className="text-gray-300" />
                <span className="text-xs text-gray-300">{project.date}</span>

                <span className="mx-1 text-gray-500">•</span>

                <TagIcon size={14} className="text-gray-300" />
                <span className="text-xs text-gray-300">
                  {project.category}
                </span>
              </motion.div>

              <motion.h3
                className="text-xl font-bold text-white mb-2"
                custom={1}
                variants={itemVariants}
              >
                {project.title}
              </motion.h3>
            </motion.div>
          </div>
        </div>

        {/* Project details */}
        <div className="p-6">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            {/* Meta information */}
            <motion.div
              className="flex items-center gap-4 mb-4 text-sm text-gray-400 md:flex"
              custom={0}
              variants={itemVariants}
            >
              <div className="flex items-center gap-1">
                <Calendar size={16} />
                <span>{project.date}</span>
              </div>
              <div className="flex items-center gap-1">
                <TagIcon size={16} />
                <span>{project.category}</span>
              </div>
            </motion.div>

            {/* Title - hidden on mobile as it's in the image overlay */}
            <motion.h3
              className="text-2xl font-bold mb-4 hidden md:block"
              custom={1}
              variants={itemVariants}
            >
              {project.title}
            </motion.h3>

            {/* Description */}
            <motion.p
              className="text-gray-300 mb-6"
              custom={2}
              variants={itemVariants}
            >
              {project.description}
            </motion.p>

            {/* Technologies */}
            <motion.div
              className="flex flex-wrap gap-2 mb-6"
              custom={3}
              variants={itemVariants}
            >
              {project.technologies.slice(0, 5).map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 text-xs rounded-full bg-gray-700"
                >
                  {tech}
                </span>
              ))}
              {project.technologies.length > 5 && (
                <span className="px-3 py-1 text-xs rounded-full bg-gray-700">
                  +{project.technologies.length - 5}
                </span>
              )}
            </motion.div>

            {/* Call to action */}
            <motion.div
              custom={4}
              variants={itemVariants}
              className="flex items-center justify-between"
            >
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white text-sm transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <Github size={16} />
                <span className="hidden sm:inline">View on GitHub</span>
                <span className="sm:hidden">GitHub</span>
              </a>

              <button
                className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 text-sm"
                type="button"
              >
                <span>View Details</span>
                <ArrowRight size={14} />
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

// Main component
const EnhancedProjectGallery: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const constraintsRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  // Get filtered projects
  const filteredProjects = selectedCategory
    ? projects.filter((project) => project.category === selectedCategory)
    : projects;

  // Get all unique categories
  const categories = Array.from(
    new Set(projects.map((project) => project.category))
  );

  // Handle category selection
  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
    setCurrentIndex(0);
    setDirection(0);
  };

  // Navigation functions
  const goToPrevious = () => {
    if (filteredProjects.length <= 1) return;

    setDirection(-1);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? filteredProjects.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    if (filteredProjects.length <= 1) return;

    setDirection(1);
    setCurrentIndex((prevIndex) =>
      prevIndex === filteredProjects.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Set up intersection observer to trigger animations when gallery is in view
  useEffect(() => {
    if (!galleryRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(galleryRef.current);

    return () => {
      if (galleryRef.current) {
        observer.unobserve(galleryRef.current);
      }
    };
  }, []);

  return (
    <div
      className="py-16 bg-gray-900 rounded-xl border border-gray-800 shadow-xl text-white overflow-hidden"
      ref={galleryRef}
    >
      <motion.h2
        className="text-3xl font-bold text-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : -20 }}
        transition={{ duration: 0.5 }}
      >
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-400">
          Wybrane Projekty
        </span>
      </motion.h2>

      <motion.p
        className="text-gray-300 max-w-2xl mx-auto text-center mb-8 px-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : -10 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Przegląd kluczowych projektów, które zrealizowałem. Każdy z nich
        podkreśla moje umiejętności w rozwiązywaniu realnych problemów
        biznesowych za pomocą technologii.
      </motion.p>

      {/* Category filters */}
      <div className="mb-8 px-4">
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategorySelect}
        />
      </div>

      <div
        className="relative w-full max-w-6xl mx-auto px-4"
        ref={constraintsRef}
      >
        {/* Empty state when no projects match filter */}
        {filteredProjects.length === 0 ? (
          <div className="py-20 text-center text-gray-400">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <p className="mb-2">No projects match the selected category.</p>
              <button
                className="px-4 py-2 bg-indigo-600 rounded-lg text-white"
                onClick={() => setSelectedCategory(null)}
                type="button"
              >
                View all projects
              </button>
            </motion.div>
          </div>
        ) : (
          <>
            {/* Navigation buttons */}
            {filteredProjects.length > 1 && (
              <>
                <div className="absolute top-1/2 left-0 z-30 transform -translate-y-1/2 ml-2 md:ml-4">
                  <motion.button
                    className="bg-gray-800/80 hover:bg-gray-700 text-white p-3 rounded-full backdrop-blur-sm"
                    onClick={goToPrevious}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : -20 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                  >
                    <ChevronLeft size={24} />
                  </motion.button>
                </div>

                <div className="absolute top-1/2 right-0 z-30 transform -translate-y-1/2 mr-2 md:mr-4">
                  <motion.button
                    className="bg-gray-800/80 hover:bg-gray-700 text-white p-3 rounded-full backdrop-blur-sm"
                    onClick={goToNext}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : 20 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                  >
                    <ChevronRight size={24} />
                  </motion.button>
                </div>
              </>
            )}

            {/* Project carousel/slider */}
            <div className="relative overflow-hidden h-[600px] md:h-[500px]">
              <AnimatePresence
                initial={false}
                custom={direction}
                mode="popLayout"
              >
                {filteredProjects.map((project, index) => (
                  <ProjectCard
                    key={`${project.id}-${index}`}
                    project={project}
                    isActive={index === currentIndex}
                    index={index}
                    currentIndex={currentIndex}
                    direction={direction}
                    onSelect={() => setSelectedProject(project)}
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* Pagination dots */}
            <div className="flex justify-center mt-6 space-x-2">
              {filteredProjects.map((_, index) => (
                <motion.button
                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index === currentIndex ? "bg-indigo-500" : "bg-gray-600"
                  }`}
                  onClick={() => {
                    setDirection(index > currentIndex ? 1 : -1);
                    setCurrentIndex(index);
                  }}
                  whileHover={{ scale: 1.5 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    scale: index === currentIndex ? 1.2 : 1,
                    opacity: inView ? 1 : 0,
                    y: inView ? 0 : 20,
                  }}
                  transition={{
                    duration: 0.3,
                    delay: 0.3 + index * 0.05,
                    scale: { duration: 0.2 },
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Project detail modal */}
      <AnimatePresence>
        {selectedProject && (
          <DetailView
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedProjectGallery;
