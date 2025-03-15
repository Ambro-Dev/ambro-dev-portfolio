// src/components/services/service-tech-stack.tsx
"use client";

import { useState, useRef } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { TiltCard } from "@/components/ambro-ui/tilt-card";

// Informacje o technologiach
interface TechInfo {
  name: string;
  description: string;
  logo?: string;
  category:
    | "infrastructure"
    | "backend"
    | "frontend"
    | "database"
    | "devops"
    | "monitoring"
    | "security"
    | "other";
}

// Dane dla zastosowań w usłudze według kategorii
const applicationPointsByCategory = {
  infrastructure: [
    "Budowa elastycznej infrastruktury chmurowej",
    "Automatyzacja zarządzania zasobami",
    "Zapewnienie wysokiej dostępności",
    "Optymalizacja kosztów i wydajności",
  ],
  backend: [
    "Implementacja logiki biznesowej aplikacji",
    "Budowa skalowalnych API i mikroserwisów",
    "Integracja z systemami zewnętrznymi",
    "Przetwarzanie danych i zarządzanie stanem",
  ],
  frontend: [
    "Tworzenie interaktywnych interfejsów użytkownika",
    "Optymalizacja wydajności i doświadczeń UX",
    "Responsywne wyświetlanie na różnych urządzeniach",
    "Zarządzanie stanem aplikacji",
  ],
  database: [
    "Optymalne przechowywanie i zarządzanie danymi",
    "Zapewnienie integralności i spójności danych",
    "Optymalizacja zapytań i indeksów",
    "Skalowalność i wydajność przy dużych obciążeniach",
  ],
  devops: [
    "Automatyzacja procesów CI/CD",
    "Zarządzanie wersjami i wdrożeniami",
    "Zapewnienie powtarzalności i niezawodności",
    "Testowanie i walidacja zmian",
  ],
  monitoring: [
    "Monitorowanie wydajności i dostępności",
    "Analiza logów i metryk operacyjnych",
    "Wykrywanie anomalii i potencjalnych problemów",
    "Raportowanie i wizualizacja danych",
  ],
  security: [
    "Zabezpieczenie danych i komunikacji",
    "Zarządzanie tożsamością i dostępem",
    "Ochrona przed zagrożeniami i atakami",
    "Zgodność z regulacjami i standardami bezpieczeństwa",
  ],
  other: [
    "Usprawnienie procesów rozwoju i wdrażania",
    "Integracja z istniejącymi systemami",
    "Optymalizacja wydajności i skalowalności",
    "Zwiększenie niezawodności rozwiązania",
  ],
};

// Dane dla korzyści według kategorii
const benefitsByCategory = {
  infrastructure: [
    "Elastyczność i skalowalność środowiska",
    "Redukcja kosztów operacyjnych",
    "Łatwiejsze zarządzanie całą infrastrukturą",
    "Szybsze wdrażanie nowych środowisk",
  ],
  backend: [
    "Wydajna obsługa nawet złożonych operacji",
    "Łatwość rozszerzania funkcjonalności",
    "Wyższe bezpieczeństwo danych i operacji",
    "Niezawodność nawet przy dużym obciążeniu",
  ],
  frontend: [
    "Lepsze doświadczenia użytkownika",
    "Responsywność na wszystkich urządzeniach",
    "Szybsze ładowanie i działanie aplikacji",
    "Łatwiejsza nawigacja i interakcja",
  ],
  database: [
    "Wyższa wydajność operacji na danych",
    "Lepsza skalowalność przy rosnących danych",
    "Niezawodność i odporność na błędy",
    "Łatwiejsze zarządzanie strukturą danych",
  ],
  devops: [
    "Krótszy czas wprowadzania zmian",
    "Mniej błędów wdrożeniowych",
    "Lepsza jakość kodu i większa stabilność",
    "Automatyczne wykrywanie problemów",
  ],
  monitoring: [
    "Szybsze wykrywanie i naprawianie problemów",
    "Proaktywne zarządzanie wydajnością",
    "Lepszy wgląd w działanie całego systemu",
    "Optymalizacja wykorzystania zasobów",
  ],
  security: [
    "Lepsza ochrona danych wrażliwych",
    "Mniejsze ryzyko naruszeń bezpieczeństwa",
    "Spełnienie wymagań regulacyjnych",
    "Zwiększone zaufanie użytkowników",
  ],
  other: [
    "Większa efektywność procesów rozwojowych",
    "Lepsza integracja z ekosystemem technologicznym",
    "Zwiększona niezawodność i wydajność",
    "Optymalizacja kosztów operacyjnych",
  ],
};

// Baza danych technologii
const technologiesInfo: { [key: string]: TechInfo } = {
  AWS: {
    name: "Amazon Web Services",
    description:
      "Platforma usług chmurowych oferująca szeroki zakres rozwiązań od infrastruktury po AI.",
    category: "infrastructure",
  },
  Azure: {
    name: "Microsoft Azure",
    description:
      "Chmura obliczeniowa Microsoftu oferująca usługi infrastruktury, platformy i oprogramowania.",
    category: "infrastructure",
  },
  GCP: {
    name: "Google Cloud Platform",
    description:
      "Platforma chmurowa Google oferująca usługi obliczeniowe, bazy danych i narzędzia AI.",
    category: "infrastructure",
  },
  Kubernetes: {
    name: "Kubernetes",
    description:
      "Open-source'owy system do automatyzacji wdrażania, skalowania i zarządzania aplikacjami w kontenerach.",
    category: "infrastructure",
  },
  Docker: {
    name: "Docker",
    description:
      "Platforma do tworzenia, wdrażania i uruchamiania aplikacji w kontenerach.",
    category: "devops",
  },
  Terraform: {
    name: "Terraform",
    description:
      "Narzędzie do infrastruktury jako kodu (IaC), umożliwiające definiowanie infrastruktury w deklaratywnym języku.",
    category: "devops",
  },
  Ansible: {
    name: "Ansible",
    description:
      "Platforma automatyzacji IT do konfiguracji systemów, wdrażania aplikacji i zarządzania infrastrukturą.",
    category: "devops",
  },
  Jenkins: {
    name: "Jenkins",
    description:
      "Open-source'owy serwer automatyzacji do CI/CD, umożliwiający budowanie, testowanie i wdrażanie kodu.",
    category: "devops",
  },
  "GitHub Actions": {
    name: "GitHub Actions",
    description:
      "Zintegrowane z GitHub narzędzie CI/CD, umożliwiające automatyzację workflow.",
    category: "devops",
  },
  "GitLab CI": {
    name: "GitLab CI/CD",
    description:
      "Zintegrowane z GitLab narzędzie do ciągłej integracji i wdrażania.",
    category: "devops",
  },
  Prometheus: {
    name: "Prometheus",
    description:
      "System monitorowania i alertowania, zbierający i przetwarzający metryki z monitorowanych celów.",
    category: "monitoring",
  },
  Grafana: {
    name: "Grafana",
    description:
      "Platforma do wizualizacji danych i analizy metryk, integrująca się z różnymi źródłami danych.",
    category: "monitoring",
  },
  "ELK Stack": {
    name: "ELK Stack",
    description:
      "Zestaw narzędzi (Elasticsearch, Logstash, Kibana) do przeszukiwania, analizy i wizualizacji danych logowania.",
    category: "monitoring",
  },
  Zabbix: {
    name: "Zabbix",
    description:
      "System monitorowania infrastruktury IT, sieci, usług i aplikacji.",
    category: "monitoring",
  },
  React: {
    name: "React",
    description:
      "Biblioteka JavaScript do budowania interfejsów użytkownika, opracowana przez Facebook.",
    category: "frontend",
  },
  "Next.js": {
    name: "Next.js",
    description:
      "Framework React do tworzenia aplikacji webowych z renderowaniem po stronie serwera (SSR) i generowaniem stron statycznych (SSG).",
    category: "frontend",
  },
  "Vue.js": {
    name: "Vue.js",
    description:
      "Progresywny framework JavaScript do budowania interfejsów użytkownika.",
    category: "frontend",
  },
  Angular: {
    name: "Angular",
    description:
      "Framework do tworzenia aplikacji webowych, rozwijany przez Google.",
    category: "frontend",
  },
  TypeScript: {
    name: "TypeScript",
    description:
      "Typowany nadzbiór JavaScript, który kompiluje się do czystego JavaScript.",
    category: "frontend",
  },
  "Node.js": {
    name: "Node.js",
    description:
      "Środowisko uruchomieniowe JavaScript działające po stronie serwera.",
    category: "backend",
  },
  Express: {
    name: "Express",
    description: "Minimalistyczny framework webowy dla Node.js.",
    category: "backend",
  },
  Django: {
    name: "Django",
    description:
      "Wysokopoziomowy framework Pythona, promujący szybki rozwój i czysty, pragmatyczny design.",
    category: "backend",
  },
  "Spring Boot": {
    name: "Spring Boot",
    description:
      "Framework do tworzenia aplikacji w Javie, upraszczający proces konfiguracji.",
    category: "backend",
  },
  Laravel: {
    name: "Laravel",
    description:
      "Framework PHP do tworzenia aplikacji webowych, oparty na modelu MVC.",
    category: "backend",
  },
  PostgreSQL: {
    name: "PostgreSQL",
    description:
      "Zaawansowany, open-source'owy system zarządzania relacyjnymi bazami danych.",
    category: "database",
  },
  MongoDB: {
    name: "MongoDB",
    description:
      "Dokumentowa baza danych NoSQL, zaprojektowana dla deweloperów aplikacji.",
    category: "database",
  },
  MySQL: {
    name: "MySQL",
    description: "Popularny system zarządzania relacyjnymi bazami danych.",
    category: "database",
  },
  Redis: {
    name: "Redis",
    description:
      "Magazyn danych w pamięci, używany jako baza danych, pamięć podręczna i broker wiadomości.",
    category: "database",
  },
  Elasticsearch: {
    name: "Elasticsearch",
    description:
      "Rozproszony silnik wyszukiwania i analizy, stworzony na bazie Apache Lucene.",
    category: "database",
  },
  "AWS RDS": {
    name: "AWS RDS",
    description: "Usługa zarządzanych baz danych relacyjnych w chmurze AWS.",
    category: "database",
  },
  Vault: {
    name: "HashiCorp Vault",
    description:
      "Narzędzie do zarządzania sekretami i chronienia wrażliwych danych.",
    category: "security",
  },
  NGINX: {
    name: "NGINX",
    description:
      "Serwer HTTP i reverse proxy, serwer proxy poczty elektronicznej oraz serwer TCP/UDP.",
    category: "infrastructure",
  },
  Kong: {
    name: "Kong API Gateway",
    description:
      "API Gateway zarządzający komunikacją między klientami a usługami API.",
    category: "infrastructure",
  },
  Keycloak: {
    name: "Keycloak",
    description:
      "Open-source'owe rozwiązanie do zarządzania tożsamością i dostępem.",
    category: "security",
  },
  "OAuth 2.0": {
    name: "OAuth 2.0",
    description: "Standard protokołu uwierzytelniania i autoryzacji.",
    category: "security",
  },
  "OpenID Connect": {
    name: "OpenID Connect",
    description: "Warstwa tożsamości zbudowana na protokole OAuth 2.0.",
    category: "security",
  },
  "Let's Encrypt": {
    name: "Let's Encrypt",
    description: "Darmowy, automatyczny i otwarty urząd certyfikacji.",
    category: "security",
  },
  Cypress: {
    name: "Cypress",
    description: "Framework do testowania end-to-end dla aplikacji webowych.",
    category: "devops",
  },
  Jest: {
    name: "Jest",
    description: "Framework do testowania JavaScript z naciskiem na prostotę.",
    category: "devops",
  },
  ArgoCD: {
    name: "ArgoCD",
    description: "Narzędzie GitOps do ciągłego dostarczania dla Kubernetes.",
    category: "devops",
  },
  Cloudflare: {
    name: "Cloudflare",
    description:
      "Usługa CDN, zabezpieczająca i zwiększająca wydajność stron internetowych.",
    category: "infrastructure",
  },
  "Apache Kafka": {
    name: "Apache Kafka",
    description: "Rozproszona platforma strumieniowania danych.",
    category: "infrastructure",
  },
  RabbitMQ: {
    name: "RabbitMQ",
    description:
      "Oprogramowanie message broker implementujące Advanced Message Queuing Protocol (AMQP).",
    category: "infrastructure",
  },
  Firebase: {
    name: "Firebase",
    description:
      "Platforma rozwoju aplikacji mobilnych i webowych, dostarczająca narzędzia i usługi infrastrukturalne.",
    category: "backend",
  },
  GraphQL: {
    name: "GraphQL",
    description:
      "Język zapytań API i runtime do wykonywania tych zapytań z istniejącymi danymi.",
    category: "backend",
  },
  gRPC: {
    name: "gRPC",
    description:
      "Nowoczesny, open-source'owy framework RPC, początkowo opracowany przez Google.",
    category: "backend",
  },
  "Tailwind CSS": {
    name: "Tailwind CSS",
    description:
      "Utility-first framework CSS do szybkiego budowania niestandardowych interfejsów.",
    category: "frontend",
  },
  "SASS/SCSS": {
    name: "SASS/SCSS",
    description:
      "Preprocesor CSS, dodający funkcje takie jak zmienne, zagnieżdżone reguły i mixiny.",
    category: "frontend",
  },
  WebSockets: {
    name: "WebSockets",
    description:
      "Protokół komunikacyjny zapewniający pełną komunikację dwukierunkową przez pojedyncze połączenie TCP.",
    category: "frontend",
  },
  PWA: {
    name: "Progressive Web Apps",
    description:
      "Aplikacje webowe, które wykorzystują nowoczesne API przeglądarek, aby zapewnić doświadczenie podobne do natywnych aplikacji.",
    category: "frontend",
  },
  Webpack: {
    name: "Webpack",
    description: "Narzędzie do budowy modułów JavaScript, bundler aktywów.",
    category: "devops",
  },
};

// Kategorie technologii z ikonami
const techCategories = [
  { id: "infrastructure", label: "Infrastruktura", color: "blue" },
  { id: "backend", label: "Backend", color: "emerald" },
  { id: "frontend", label: "Frontend", color: "pink" },
  { id: "database", label: "Bazy danych", color: "amber" },
  { id: "devops", label: "DevOps", color: "indigo" },
  { id: "monitoring", label: "Monitoring", color: "sky" },
  { id: "security", label: "Bezpieczeństwo", color: "red" },
  { id: "other", label: "Inne", color: "gray" },
];

// Mapowanie kategorii na kolory Tailwind - bezpieczne dla PurgeCSS
const categoryColorMap: Record<string, string> = {
  infrastructure: "blue",
  backend: "emerald",
  frontend: "pink",
  database: "amber",
  devops: "indigo",
  monitoring: "sky",
  security: "red",
  other: "gray",
};

interface PointsListProps {
  title: string;
  points: string[];
  categoryColor: string;
  pointIcon: string;
}

const PointsList: React.FC<PointsListProps> = ({
  title,
  points,
  categoryColor,
  pointIcon,
}) => {
  // Bezpieczne generowanie klas CSS w zależności od koloru
  const getColorClass = (baseClass: string, color: string) => {
    if (color === "blue") return `${baseClass}-blue-400`;
    if (color === "emerald") return `${baseClass}-emerald-400`;
    if (color === "pink") return `${baseClass}-pink-400`;
    if (color === "amber") return `${baseClass}-amber-400`;
    if (color === "indigo") return `${baseClass}-indigo-400`;
    if (color === "sky") return `${baseClass}-sky-400`;
    if (color === "red") return `${baseClass}-red-400`;
    return `${baseClass}-gray-400`;
  };

  return (
    <div>
      <h4 className="text-sm uppercase text-gray-500 mb-2">{title}</h4>
      <ul className="space-y-1">
        {points.map((point, idx) => (
          <li
            key={`${title.toLowerCase()}-${idx}`}
            className="flex items-start gap-2"
          >
            <span className={`${getColorClass("text", categoryColor)} mt-1`}>
              {pointIcon}
            </span>
            <span className="text-gray-300 text-sm">{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Główny komponent szczegółów technologii
interface TechDetailsProps {
  techInfo: TechInfo;
}

const TechDetails: React.FC<TechDetailsProps> = ({ techInfo }) => {
  const categoryId = techInfo.category;
  const categoryColor = categoryColorMap[categoryId] || "gray";

  // Pobierz odpowiednie listy punktów dla danej kategorii
  const applicationPoints =
    applicationPointsByCategory[categoryId] ||
    applicationPointsByCategory.other;
  const benefitPoints =
    benefitsByCategory[categoryId] || benefitsByCategory.other;

  // Bezpieczne klasy CSS
  let bgClass = "";
  let borderClass = "";
  let textClass = "";

  // Zamiast dynamicznej interpolacji, używamy warunków dla bezpieczeństwa Tailwind
  switch (categoryColor) {
    case "blue":
      bgClass = "bg-blue-900/10";
      borderClass = "border-blue-500/20";
      textClass = "text-blue-400";
      break;
    case "emerald":
      bgClass = "bg-emerald-900/10";
      borderClass = "border-emerald-500/20";
      textClass = "text-emerald-400";
      break;
    case "pink":
      bgClass = "bg-pink-900/10";
      borderClass = "border-pink-500/20";
      textClass = "text-pink-400";
      break;
    case "amber":
      bgClass = "bg-amber-900/10";
      borderClass = "border-amber-500/20";
      textClass = "text-amber-400";
      break;
    case "indigo":
      bgClass = "bg-indigo-900/10";
      borderClass = "border-indigo-500/20";
      textClass = "text-indigo-400";
      break;
    case "sky":
      bgClass = "bg-sky-900/10";
      borderClass = "border-sky-500/20";
      textClass = "text-sky-400";
      break;
    case "red":
      bgClass = "bg-red-900/10";
      borderClass = "border-red-500/20";
      textClass = "text-red-400";
      break;
    default:
      bgClass = "bg-gray-900/10";
      borderClass = "border-gray-500/20";
      textClass = "text-gray-400";
  }

  // To samo dla klasy tła ikony
  let iconBgClass = "";
  switch (categoryColor) {
    case "blue":
      iconBgClass = "bg-blue-900/20";
      break;
    case "emerald":
      iconBgClass = "bg-emerald-900/20";
      break;
    case "pink":
      iconBgClass = "bg-pink-900/20";
      break;
    case "amber":
      iconBgClass = "bg-amber-900/20";
      break;
    case "indigo":
      iconBgClass = "bg-indigo-900/20";
      break;
    case "sky":
      iconBgClass = "bg-sky-900/20";
      break;
    case "red":
      iconBgClass = "bg-red-900/20";
      break;
    default:
      iconBgClass = "bg-gray-900/20";
  }

  return (
    <motion.div
      className={`p-4 ${bgClass} border ${borderClass} rounded-lg`}
      initial={{ opacity: 0, height: 0, marginBottom: 0 }}
      animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="md:w-1/4">
          <div
            className={`flex justify-center items-center h-24 w-24 mx-auto ${iconBgClass} rounded-lg border ${borderClass}`}
          >
            <span className={`${textClass} text-2xl font-bold`}>
              {techInfo.name.substring(0, 2).toUpperCase()}
            </span>
          </div>
        </div>

        <div className="md:w-3/4">
          <h3 className={`text-xl font-bold ${textClass}`}>{techInfo.name}</h3>
          <p className="text-gray-300 mt-1">{techInfo.description}</p>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <PointsList
              title="Zastosowanie w usłudze"
              points={applicationPoints}
              categoryColor={categoryColor}
              pointIcon="→"
            />

            <PointsList
              title="Korzyści"
              points={benefitPoints}
              categoryColor={categoryColor}
              pointIcon="✓"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Główny komponent
const ServiceTechStack: React.FC<{
  technologies: string[];
  primaryColor: string;
}> = ({ technologies, primaryColor }) => {
  const [selectedTechnology, setSelectedTechnology] = useState<string | null>(
    null
  );
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  // Filtruj technologie według kategorii
  const filteredTechnologies = activeCategory
    ? technologies.filter(
        (tech) =>
          technologiesInfo[tech] &&
          technologiesInfo[tech].category === activeCategory
      )
    : technologies;

  // Grupuj technologie według kategorii
  const groupedTechnologies = technologies.reduce((acc, tech) => {
    if (technologiesInfo[tech]) {
      const category = technologiesInfo[tech].category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(tech);
    } else {
      if (!acc.other) {
        acc.other = [];
      }
      acc.other.push(tech);
    }
    return acc;
  }, {} as Record<string, string[]>);

  // Liczba technologii w każdej kategorii
  const getCategoryCount = (categoryId: string) => {
    return groupedTechnologies[categoryId]?.length || 0;
  };

  // Znajdź informacje o wybranej technologii
  const selectedTechInfo = selectedTechnology
    ? technologiesInfo[selectedTechnology] || {
        name: selectedTechnology,
        description: "Zaawansowana technologia używana w implementacji usługi.",
        category: "other" as const,
      }
    : null;

  // Funkcja generująca bezpieczne klasy CSS dla przycisków kategorii
  const getCategoryButtonClasses = (
    categoryId: string | null,
    buttonCategoryId: string | null
  ) => {
    const isActive = categoryId === buttonCategoryId;
    const color =
      buttonCategoryId === null
        ? primaryColor
        : techCategories.find((c) => c.id === buttonCategoryId)?.color ||
          "gray";

    if (isActive) {
      switch (color) {
        case "blue":
          return "bg-blue-900/40 text-blue-400 border border-blue-500/30";
        case "emerald":
          return "bg-emerald-900/40 text-emerald-400 border border-emerald-500/30";
        case "pink":
          return "bg-pink-900/40 text-pink-400 border border-pink-500/30";
        case "amber":
          return "bg-amber-900/40 text-amber-400 border border-amber-500/30";
        case "indigo":
          return "bg-indigo-900/40 text-indigo-400 border border-indigo-500/30";
        case "sky":
          return "bg-sky-900/40 text-sky-400 border border-sky-500/30";
        case "red":
          return "bg-red-900/40 text-red-400 border border-red-500/30";
        default:
          return "bg-gray-900/40 text-gray-400 border border-gray-500/30";
      }
    }
    return "bg-gray-800/50 hover:bg-gray-800 text-gray-400 border border-gray-700/30";
  };

  return (
    <div ref={sectionRef}>
      {/* Filtry kategorii */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          type="button"
          className={`px-3 py-1.5 rounded-full text-sm transition-colors ${getCategoryButtonClasses(
            activeCategory,
            null
          )}`}
          onClick={() => setActiveCategory(null)}
        >
          Wszystkie ({technologies.length})
        </button>

        {techCategories.map((category) => {
          const count = getCategoryCount(category.id);
          if (count === 0) return null;

          return (
            <button
              key={category.id}
              type="button"
              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${getCategoryButtonClasses(
                activeCategory,
                category.id
              )}`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Siatka technologii */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
        {filteredTechnologies.map((tech, index) => {
          const techInfo = technologiesInfo[tech] || {
            name: tech,
            description:
              "Zaawansowana technologia używana w implementacji usługi.",
            category: "other" as const,
          };
          const isSelected = selectedTechnology === tech;
          const categoryColor = categoryColorMap[techInfo.category] || "gray";

          // Bezpieczne generowanie kolorów RGB dla borderGlow
          let borderColorRGB = "";
          switch (categoryColor) {
            case "indigo":
              borderColorRGB = "rgba(99, 102, 241, 0.5)";
              break;
            case "emerald":
              borderColorRGB = "rgba(16, 185, 129, 0.5)";
              break;
            case "sky":
              borderColorRGB = "rgba(14, 165, 233, 0.5)";
              break;
            case "pink":
              borderColorRGB = "rgba(236, 72, 153, 0.5)";
              break;
            case "amber":
              borderColorRGB = "rgba(245, 158, 11, 0.5)";
              break;
            case "red":
              borderColorRGB = "rgba(239, 68, 68, 0.5)";
              break;
            case "blue":
              borderColorRGB = "rgba(59, 130, 246, 0.5)";
              break;
            default:
              borderColorRGB = "rgba(107, 114, 128, 0.5)";
          }

          // Klasy dla etykiety kategorii
          let categoryBgClass = "";
          let categoryTextClass = "";
          switch (categoryColor) {
            case "blue":
              categoryBgClass = "bg-blue-900/30";
              categoryTextClass = "text-blue-400";
              break;
            case "emerald":
              categoryBgClass = "bg-emerald-900/30";
              categoryTextClass = "text-emerald-400";
              break;
            case "pink":
              categoryBgClass = "bg-pink-900/30";
              categoryTextClass = "text-pink-400";
              break;
            case "amber":
              categoryBgClass = "bg-amber-900/30";
              categoryTextClass = "text-amber-400";
              break;
            case "indigo":
              categoryBgClass = "bg-indigo-900/30";
              categoryTextClass = "text-indigo-400";
              break;
            case "sky":
              categoryBgClass = "bg-sky-900/30";
              categoryTextClass = "text-sky-400";
              break;
            case "red":
              categoryBgClass = "bg-red-900/30";
              categoryTextClass = "text-red-400";
              break;
            default:
              categoryBgClass = "bg-gray-900/30";
              categoryTextClass = "text-gray-400";
          }

          // Klasa dla tytułu technologii, jeśli jest wybrana
          const titleClass = isSelected ? categoryTextClass : "";

          return (
            <motion.div
              key={tech}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              whileHover={{ y: -5 }}
            >
              <TiltCard
                className="h-full cursor-pointer"
                tiltAmount={10}
                glareOpacity={0.1}
                onClick={() => setSelectedTechnology(isSelected ? null : tech)}
                borderGlow={isSelected}
                borderColor={borderColorRGB}
              >
                <div className="p-4 h-full flex flex-col">
                  <div
                    className={`text-xs px-2 py-0.5 rounded-full self-start ${categoryBgClass} ${categoryTextClass} mb-2`}
                  >
                    {techCategories.find((c) => c.id === techInfo.category)
                      ?.label || "Inne"}
                  </div>

                  <h3 className={`font-medium mb-1 ${titleClass}`}>
                    {techInfo.name}
                  </h3>

                  {isSelected && (
                    <motion.p
                      className="text-xs text-gray-400 mt-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      {techInfo.description}
                    </motion.p>
                  )}
                </div>
              </TiltCard>
            </motion.div>
          );
        })}
      </div>

      {/* Szczegóły wybranej technologii */}
      <AnimatePresence>
        {selectedTechInfo && <TechDetails techInfo={selectedTechInfo} />}
      </AnimatePresence>

      {/* Podsumowanie stosu technologicznego */}
      <div className="text-center mt-6">
        <p className="text-gray-400">
          Technologie są starannie dobierane do specyficznych wymagań każdego
          projektu, zapewniając optymalne połączenie wydajności, skalowalności i
          kosztów.
        </p>
      </div>
    </div>
  );
};

export default ServiceTechStack;
