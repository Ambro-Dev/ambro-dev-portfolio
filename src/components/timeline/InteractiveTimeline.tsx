"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useAnimation,
  useInView,
  type Variants,
} from "framer-motion";
import {
  Briefcase,
  Calendar,
  Award,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Server,
  Cloud,
  Code,
  Database,
  Shield,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface TimelineEvent {
  id: string;
  year: string;
  title: string;
  company?: string;
  role: string;
  description: string;
  achievements: string[];
  technologies: string[];
  color: string;
  icon: LucideIcon;
  location?: string;
  duration?: string;
  links?: Array<{ url: string; label: string }>;
}

interface TimelineItemProps {
  item: TimelineEvent;
  index: number;
  selectedIndex: number | null;
  setSelectedIndex: (index: number | null) => void;
  inView: boolean;
  isMobile: boolean;
  onFlip?: (index: number) => void;
  isFlipped?: boolean;
}

interface TimelineFilterProps {
  years: string[];
  selectedYears: string[];
  onToggleYear: (year: string) => void;
}

// Enhanced timeline data with more details
const timelineEvents: TimelineEvent[] = [
  {
    id: "event-2024",
    year: "2024",
    title: "Projekt SecurityEnhancement",
    company: "SecureTech Solutions",
    role: "Security DevOps",
    description:
      "Odpowiedzialny za wdrożenie kompleksowego systemu bezpieczeństwa, co znacząco zmniejszyło podatność na zagrożenia i zapewniło zgodność z wymogami branżowymi.",
    achievements: [
      "Wdrożenie rozwiązania WAF, które zmniejszyło ilość ataków o 60%",
      "Konfiguracja VPN dla bezpiecznego zdalnego dostępu dla 200+ pracowników",
      "Implementacja zaawansowanych systemów monitorowania bezpieczeństwa",
      "Przeprowadzenie szkoleń z bezpieczeństwa dla zespołów deweloperskich",
      "Automatyzacja procesów wykrywania zagrożeń",
    ],
    technologies: [
      "FortiGate",
      "VPN",
      "WAF",
      "SIEM",
      "Penetration Testing",
      "Security Automation",
    ],
    color: "bg-red-600",
    icon: Shield,
    location: "Warszawa, Polska",
    duration: "Styczeń 2024 - Obecnie",
  },
  {
    id: "event-2023",
    year: "2023",
    title: "Projekt CloudMigration",
    company: "CloudTech Solutions",
    role: "Cloud Architect",
    description:
      "Zarządzałem migracją lokalnej infrastruktury do chmury, co doprowadziło do znacznej redukcji kosztów utrzymania i poprawy dostępności systemów.",
    achievements: [
      "Przeprowadzenie migracji 50+ serwerów do AWS z minimalnym przestojem",
      "Redukcja kosztów infrastruktury o 35% dzięki optymalizacji zasobów",
      "Poprawa dostępności systemów z 99.5% do 99.95%",
      "Wdrożenie infrastruktury jako kodu (Terraform) dla całego środowiska",
      "Stworzenie rozwiązań automatycznego skalowania dla aplikacji webowych",
    ],
    technologies: [
      "AWS",
      "Terraform",
      "CloudFormation",
      "Lambda",
      "CI/CD",
      "Monitoring Tools",
    ],
    color: "bg-purple-600",
    icon: Cloud,
    location: "Kraków, Polska",
    duration: "Marzec 2023 - Grudzień 2023",
  },
  {
    id: "event-2022",
    year: "2022",
    title: "TechFlow",
    company: "TechFlow Innovations",
    role: "Starszy Inżynier Oprogramowania / Specjalista DevOps",
    description:
      "Prowadziłem zespół odpowiedzialny za usprawnienie architektury systemu, co skutkowało znaczącym zwiększeniem wydajności aplikacji i skróceniem czasu wdrożeń.",
    achievements: [
      "Przeprojektowanie architektury zwiększyło wydajność aplikacji o 25%",
      "Skrócenie czasu wdrożeń z dni do godzin (redukcja o 40%)",
      "Wdrożenie mikroserwisów z wykorzystaniem konteneryzacji",
      "Pełna automatyzacja cyklu CI/CD dla 15+ projektów",
      "Redukcja liczby incydentów produkcyjnych o 30%",
    ],
    technologies: [
      "Azure",
      "Kubernetes",
      "GitLab CI",
      "Prometheus",
      "Docker",
      "Microservices",
    ],
    color: "bg-indigo-600",
    icon: Code,
    location: "Wrocław, Polska",
    duration: "Luty 2022 - Luty 2023",
    links: [
      { url: "#", label: "Referencje" },
      { url: "#", label: "Studium przypadku" },
    ],
  },
  {
    id: "event-2020",
    year: "2020",
    title: "Projekt Optimization",
    company: "OptimizeIT",
    role: "DevOps Lead",
    description:
      "Kierowałem wdrożeniem automatyzacji procesów CI/CD, co przyczyniło się do znaczącej redukcji błędów w produkcji i przyspieszenia cyklu rozwoju.",
    achievements: [
      "Redukcja błędów w produkcji o 50% poprzez automatyzację testów",
      "Wdrożenie Infrastructure as Code dla całego środowiska",
      "Koordynacja zespołu 5 specjalistów DevOps",
      "Stworzenie centralnego systemu logowania i monitorowania",
      "Optymalizacja procesów wdrożeniowych skracająca time-to-market o 35%",
    ],
    technologies: [
      "Jenkins",
      "Terraform",
      "Ansible",
      "ELK Stack",
      "GitOps",
      "Containerization",
    ],
    color: "bg-emerald-600",
    icon: Server,
    location: "Gdańsk, Polska",
    duration: "Czerwiec 2020 - Styczeń 2022",
  },
  {
    id: "event-2018",
    year: "2018",
    title: "CodeCraft",
    company: "CodeCraft Systems",
    role: "Inżynier Oprogramowania / DevOps",
    description:
      "Odpowiadałem za opracowanie skalowalnych rozwiązań chmurowych i koordynację zespołu wdrażającego nowe technologie, co zwiększyło efektywność systemów.",
    achievements: [
      "Poprawa efektywności systemów o 30% dzięki migracji do chmury",
      "Implementacja konteneryzacji dla 20+ aplikacji",
      "Optymalizacja wydajności baz danych",
      "Wdrożenie automatycznych backupów i strategii disaster recovery",
      "Redukcja okna wdrożeniowego z 8h do 1h",
    ],
    technologies: [
      "AWS",
      "Docker",
      "Kubernetes",
      "CI/CD",
      "Bash/Python Scripting",
      "MongoDB",
    ],
    color: "bg-cyan-600",
    icon: Database,
    location: "Poznań, Polska",
    duration: "Marzec 2018 - Maj 2020",
  },
];

// Timeline filter component
const TimelineFilter: React.FC<TimelineFilterProps> = ({
  years,
  selectedYears,
  onToggleYear,
}) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-8">
      {years.map((year) => {
        const isSelected = selectedYears.includes(year);

        return (
          <motion.button
            key={year}
            className={`px-3 py-1.5 rounded-full text-sm font-medium ${
              isSelected
                ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500"
                : "bg-gray-800 text-gray-400 border border-gray-700"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onToggleYear(year)}
          >
            {year}
          </motion.button>
        );
      })}
    </div>
  );
};

// Desktop version of the timeline item with flip card effect
const DesktopTimelineItem: React.FC<TimelineItemProps> = ({
  item,
  index,
  selectedIndex,
  setSelectedIndex,
  inView,
  isFlipped = false,
  onFlip,
}) => {
  const isSelected = selectedIndex === index;
  const controls = useAnimation();
  const isEven = index % 2 === 0;
  const Icon = item.icon;

  // Card variants for animation
  const cardVariants: Variants = {
    hidden: {
      opacity: 0,
      x: isEven ? -50 : 50,
      rotateY: isFlipped ? 180 : 0,
    },
    visible: {
      opacity: 1,
      x: 0,
      rotateY: isFlipped ? 180 : 0,
      transition: { delay: index * 0.2, duration: 0.5 },
    },
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView, isFlipped]);

  return (
    <div className="relative">
      {/* Connector Line */}
      <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-700 z-0" />

      {/* Timeline Dot */}
      <motion.div
        className={`absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full z-10 cursor-pointer transition-all duration-300 ease-in-out ${item.color}`}
        whileHover={{ scale: 1.5 }}
        animate={{
          scale: isSelected ? 1.3 : 1,
          boxShadow: isSelected
            ? "0 0 15px rgba(0,0,0,0.5)"
            : "0 0 0 rgba(0,0,0,0)",
        }}
        onClick={() => setSelectedIndex(isSelected ? null : index)}
      />

      {/* Year marker */}
      <motion.div
        className={`absolute top-0 ${
          isEven ? "left-[52%]" : "right-[52%]"
        } bg-gray-800 px-3 py-1 rounded-full z-10 flex items-center gap-1`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.2 + 0.1 }}
      >
        <Calendar size={14} className="text-gray-400" />
        <span className="text-sm font-medium text-white">{item.year}</span>
      </motion.div>

      {/* Flip Card */}
      <div
        className="perspective-1000 w-5/6 md:w-5/12 mx-auto md:mx-0 mb-16 relative z-10"
        style={{
          marginLeft: isEven ? "auto" : "8.33%",
          marginRight: isEven ? "8.33%" : "auto",
        }}
      >
        <motion.div
          className="relative w-full h-full transition-all duration-500 preserve-3d"
          variants={cardVariants}
          initial="hidden"
          animate={controls}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Front side - Overview */}
          <div
            className={`backface-hidden absolute inset-0 p-6 rounded-xl overflow-hidden shadow-lg ${
              isFlipped ? "invisible" : ""
            }`}
            style={{
              backfaceVisibility: "hidden",
              background: "linear-gradient(to bottom right, #1f2937, #111827)",
              borderLeft: `4px solid ${item.color.replace(
                "bg-",
                "rgb(var(--"
              )}`,
            }}
          >
            <div className={`absolute top-0 left-0 w-full h-1 ${item.color}`} />

            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg ${item.color} mr-3`}>
                  <Icon size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{item.title}</h3>
                  {item.company && (
                    <p className="text-gray-400 text-sm">{item.company}</p>
                  )}
                </div>
              </div>

              {onFlip && (
                <motion.button
                  className="p-1.5 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    onFlip(index);
                  }}
                  whileHover={{ rotate: 180 }}
                >
                  <ChevronDown size={16} className="text-gray-300" />
                </motion.button>
              )}
            </div>

            <p className="text-gray-400 text-sm mb-4">{item.role}</p>

            {item.location && (
              <div className="flex items-center text-gray-400 text-sm mb-2">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="mr-1"
                >
                  <title>Location</title>
                  <path
                    d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 22C16 18 20 14.4183 20 10C20 5.58172 16.4183 2 12 2C7.58172 2 4 5.58172 4 10C4 14.4183 8 18 12 22Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>{item.location}</span>
              </div>
            )}

            {item.duration && (
              <div className="flex items-center text-gray-400 text-sm mb-4">
                <Calendar size={14} className="mr-1" />
                <span>{item.duration}</span>
              </div>
            )}

            <p className="text-gray-300 mb-4">{item.description}</p>

            <div className="flex flex-wrap gap-1 mb-4">
              {item.technologies.slice(0, 5).map((tech) => (
                <span
                  key={tech}
                  className={`px-2 py-1 text-xs rounded-full ${item.color.replace(
                    "bg-",
                    "bg-"
                  )}/20 text-${item.color.replace("bg-", "")}-400`}
                >
                  {tech}
                </span>
              ))}
              {item.technologies.length > 5 && (
                <span className="px-2 py-1 text-xs rounded-full bg-gray-700 text-gray-300">
                  +{item.technologies.length - 5}
                </span>
              )}
            </div>

            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                {item.links?.map((link) => (
                  <a
                    key={link.label}
                    href={link.url}
                    className="text-sm text-indigo-400 hover:text-indigo-300"
                  >
                    {link.label}
                  </a>
                ))}
              </div>

              <div className="text-gray-400 text-sm flex items-center gap-1">
                <span>Szczegóły</span>
                <ArrowRight size={14} />
              </div>
            </div>
          </div>

          {/* Back side - Details */}
          <div
            className={`backface-hidden absolute inset-0 p-6 rounded-xl overflow-hidden shadow-lg ${
              !isFlipped ? "invisible" : ""
            }`}
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              background: "linear-gradient(to bottom right, #1f2937, #111827)",
              borderLeft: `4px solid ${item.color.replace(
                "bg-",
                "rgb(var(--"
              )}`,
            }}
          >
            <div className={`absolute top-0 left-0 w-full h-1 ${item.color}`} />

            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-white">{item.title}</h3>

              {onFlip && (
                <motion.button
                  className="p-1.5 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    onFlip(index);
                  }}
                  whileHover={{ rotate: 180 }}
                >
                  <ChevronUp size={16} className="text-gray-300" />
                </motion.button>
              )}
            </div>

            <h4 className="text-sm uppercase tracking-wider text-gray-400 mb-3">
              Kluczowe osiągnięcia
            </h4>

            <ul className="space-y-2 mb-4">
              {item.achievements.map((achievement, i) => (
                <motion.li
                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                  key={i}
                  className="flex items-start gap-2 text-gray-300 text-sm"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <CheckCircle
                    size={16}
                    className={`mt-0.5 text-${item.color.replace(
                      "bg-",
                      ""
                    )}-500 flex-shrink-0`}
                  />
                  <span>{achievement}</span>
                </motion.li>
              ))}
            </ul>

            <h4 className="text-sm uppercase tracking-wider text-gray-400 mb-3">
              Technologie
            </h4>

            <div className="flex flex-wrap gap-1 mb-4">
              {item.technologies.map((tech) => (
                <span
                  key={tech}
                  className={`px-2 py-1 text-xs rounded-full ${item.color.replace(
                    "bg-",
                    "bg-"
                  )}/20 text-${item.color.replace("bg-", "")}-400`}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Mobile version of timeline item
const MobileTimelineItem: React.FC<TimelineItemProps> = ({
  item,
  index,
  selectedIndex,
  setSelectedIndex,
  inView,
}) => {
  const isSelected = selectedIndex === index;
  const controls = useAnimation();
  const Icon = item.icon;

  useEffect(() => {
    if (inView) {
      controls.start({
        opacity: 1,
        y: 0,
        transition: { delay: index * 0.1, duration: 0.3 },
      });
    }
  }, [controls, inView, index]);

  return (
    <motion.div
      className="relative mb-8 pl-8 border-l-2 border-gray-700 last:border-l-0 last:mb-0"
      initial={{ opacity: 0, y: 30 }}
      animate={controls}
    >
      {/* Year Marker */}
      <div
        className={`absolute left-0 w-6 h-6 -translate-x-1/2 rounded-full ${item.color} z-10 flex items-center justify-center text-xs font-bold text-white`}
      >
        {item.year.substring(2)}
      </div>

      <div
        className={`absolute -left-12 top-0 text-base font-bold text-${item.color.replace(
          "bg-",
          ""
        )}-500`}
      >
        {item.year}
      </div>

      {/* Content Card */}
      <motion.div
        className={`bg-gray-800 rounded-lg shadow-lg p-5 cursor-pointer border-l-4 ${item.color}`}
        whileTap={{ scale: 0.98 }}
        onClick={() => setSelectedIndex(isSelected ? null : index)}
      >
        <div className="flex items-start gap-3 mb-3">
          <div className={`p-2 rounded-lg ${item.color} flex-shrink-0`}>
            <Icon size={18} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{item.title}</h3>
            <p className="text-gray-400 text-sm">{item.role}</p>
            {item.company && (
              <p className="text-gray-500 text-xs">{item.company}</p>
            )}
          </div>
        </div>

        {/* Expandable content */}
        <AnimatePresence>
          {isSelected ? (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ overflow: "hidden" }}
            >
              <p className="text-gray-300 text-sm my-3">{item.description}</p>

              <h4 className="text-xs uppercase tracking-wider text-gray-400 mb-2">
                Osiągnięcia
              </h4>

              <ul className="space-y-2 mb-4">
                {item.achievements.slice(0, 3).map((achievement, i) => (
                  <li
                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                    key={i}
                    className="flex items-start gap-2 text-gray-300 text-xs"
                  >
                    <CheckCircle
                      size={12}
                      className={`mt-0.5 text-${item.color.replace(
                        "bg-",
                        ""
                      )}-500 flex-shrink-0`}
                    />
                    <span>{achievement}</span>
                  </li>
                ))}
                {item.achievements.length > 3 && (
                  <li className="text-gray-400 text-xs">
                    +{item.achievements.length - 3} więcej osiągnięć
                  </li>
                )}
              </ul>

              <div className="flex flex-wrap gap-1 mt-2">
                {item.technologies.slice(0, 6).map((tech) => (
                  <span
                    key={tech}
                    className={`px-2 py-0.5 text-xs rounded-full ${item.color.replace(
                      "bg-",
                      "bg-"
                    )}/20 text-${item.color.replace("bg-", "")}-400`}
                  >
                    {tech}
                  </span>
                ))}
                {item.technologies.length > 6 && (
                  <span className="px-2 py-0.5 text-xs rounded-full bg-gray-700 text-gray-300">
                    +{item.technologies.length - 6}
                  </span>
                )}
              </div>
            </motion.div>
          ) : (
            <div className="flex justify-between items-center">
              <div className="flex space-x-1">
                {item.technologies.slice(0, 2).map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-0.5 text-xs rounded-full bg-gray-700 text-gray-300"
                  >
                    {tech}
                  </span>
                ))}
                {item.technologies.length > 2 && (
                  <span className="px-2 py-0.5 text-xs rounded-full bg-gray-700 text-gray-300">
                    +{item.technologies.length - 2}
                  </span>
                )}
              </div>

              <div className="text-gray-400 text-xs flex items-center">
                <span>Szczegóły</span>
                <ChevronDown size={14} className="ml-1" />
              </div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

// Main timeline component
const EnhancedTimeline: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [filteredEvents, setFilteredEvents] = useState(timelineEvents);
  const [selectedYears, setSelectedYears] = useState<string[]>(
    timelineEvents.map((event) => event.year)
  );

  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  // Handle card flip
  const handleCardFlip = (index: number) => {
    setFlippedCards((prev) => {
      if (prev.includes(index)) {
        return prev.filter((i) => i !== index);
      }
      return [...prev, index];
    });
  };

  // Filter events by selected years
  useEffect(() => {
    const filtered = timelineEvents.filter((event) =>
      selectedYears.includes(event.year)
    );
    setFilteredEvents(filtered);
    // Reset selection when filters change
    setSelectedIndex(null);
  }, [selectedYears]);

  // Detect mobile devices
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  // Toggle year filter
  const handleToggleYear = (year: string) => {
    setSelectedYears((prev) => {
      // Prevent deselecting all years
      if (prev.includes(year) && prev.length === 1) return prev;

      if (prev.includes(year)) {
        return prev.filter((y) => y !== year);
      }
      return [...prev, year];
    });
  };

  // Get all unique years
  const years = Array.from(
    new Set(timelineEvents.map((event) => event.year))
  ).sort((a, b) => Number.parseInt(b) - Number.parseInt(a)); // Sort descending

  return (
    <div
      className="py-16 px-4 bg-gray-900 rounded-xl border border-gray-800 shadow-xl"
      ref={ref}
    >
      <motion.h2
        className="text-3xl font-bold text-center text-white mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : -20 }}
        transition={{ duration: 0.5 }}
      >
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
          Moja historia zawodowa
        </span>
      </motion.h2>

      <motion.p
        className="text-gray-300 text-center max-w-2xl mx-auto mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : -10 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Przegląd mojej kariery zawodowej, kluczowych projektów i osiągnięć.
        Każde doświadczenie przyczyniło się do rozwoju moich umiejętności w
        dziedzinie DevOps i architektury IT.
      </motion.p>

      {/* Filter by year */}
      <TimelineFilter
        years={years}
        selectedYears={selectedYears}
        onToggleYear={handleToggleYear}
      />

      {/* Timeline */}
      <div className={`relative ${isMobile ? "ml-12" : "pt-8"}`}>
        {filteredEvents.length > 0 ? (
          filteredEvents.map((item, index) =>
            isMobile ? (
              <MobileTimelineItem
                key={item.id}
                item={item}
                index={index}
                selectedIndex={selectedIndex}
                setSelectedIndex={setSelectedIndex}
                inView={inView}
                isMobile={isMobile}
              />
            ) : (
              <DesktopTimelineItem
                key={item.id}
                item={item}
                index={index}
                selectedIndex={selectedIndex}
                setSelectedIndex={setSelectedIndex}
                inView={inView}
                isMobile={isMobile}
                isFlipped={flippedCards.includes(index)}
                onFlip={handleCardFlip}
              />
            )
          )
        ) : (
          <div className="text-center text-gray-400 py-12">
            Brak wydarzeń do wyświetlenia dla wybranych filtrów
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-12 flex justify-center flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <Award size={16} className="text-indigo-400" />
          <span className="text-gray-300 text-sm">Osiągnięcia</span>
        </div>
        <div className="flex items-center gap-2">
          <Briefcase size={16} className="text-blue-400" />
          <span className="text-gray-300 text-sm">Role zawodowe</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-purple-400" />
          <span className="text-gray-300 text-sm">Chronologia</span>
        </div>
      </div>
    </div>
  );
};

export default EnhancedTimeline;
