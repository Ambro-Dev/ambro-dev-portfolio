"use client";

import type React from "react";
import { useState, useRef, useEffect, useMemo } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  AnimatePresence,
  type MotionValue,
} from "framer-motion";
import {
  Server,
  Shield,
  Cloud,
  Database,
  Cog,
  Users,
  BarChart,
  Code,
  Github,
  ChevronRight,
  Search,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface ServiceCategory {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  icon: LucideIcon;
  color: string;
  tags: string[];
  bulletPoints: string[];
}

interface ServiceCardProps {
  service: ServiceCategory;
  index: number;
  onClick: (id: string) => void;
  isSelected: boolean;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}

interface ServiceDetailProps {
  service: ServiceCategory;
  onClose: () => void;
}

interface TagProps {
  label: string;
  color: string;
}

// Enhanced service categories with more detailed content
const serviceCategories: ServiceCategory[] = [
  {
    id: "servers",
    title: "Administracja Serwerami",
    description:
      "Zarządzanie infrastrukturą serwerową z wykorzystaniem najlepszych praktyk DevOps.",
    longDescription:
      "Kompleksowe zarządzanie serwerami, w tym instalacja, konfiguracja, monitoring, utrzymanie i optymalizacja. Wykorzystuję zaawansowane narzędzia automatyzacji jak Ansible, Puppet i Chef, aby zapewnić spójność i niezawodność infrastruktury.",
    icon: Server,
    color: "from-blue-500/90 to-cyan-400/90",
    tags: ["Linux", "Windows", "Ansible", "Monitoring", "Automatyzacja"],
    bulletPoints: [
      "Konfiguracja serwerów pocztowych, webowych i baz danych",
      "Automatyzacja zadań administracyjnych z wykorzystaniem skryptów",
      "Monitoring wydajności i dostępności usług 24/7",
      "Zarządzanie backupami i strategiami disaster recovery",
      "Wdrażanie bezpiecznych praktyk i polityk serwera",
    ],
  },
  {
    id: "security",
    title: "Bezpieczeństwo Systemów",
    description:
      "Ochrona infrastruktury IT przed zagrożeniami z wykorzystaniem zaawansowanych rozwiązań.",
    longDescription:
      "Kompleksowe podejście do bezpieczeństwa systemów informatycznych, obejmujące analizę zagrożeń, wdrażanie zabezpieczeń oraz reagowanie na incydenty. Specjalizuję się w rozwiązaniach Fortinet i wdrażaniu wielowarstwowych strategii ochrony.",
    icon: Shield,
    color: "from-red-500/90 to-pink-400/90",
    tags: ["Firewall", "VPN", "WAF", "IDS/IPS", "Security Audit"],
    bulletPoints: [
      "Konfiguracja i zarządzanie urządzeniami Fortinet FortiGate",
      "Implementacja wielowarstwowych strategii bezpieczeństwa",
      "Regularne audyty bezpieczeństwa i testy penetracyjne",
      "Wykrywanie i reagowanie na incydenty bezpieczeństwa",
      "Szyfrowanie danych i bezpieczna komunikacja w sieci",
    ],
  },
  {
    id: "cloud",
    title: "Chmurowe Wdrożenia",
    description:
      "Projektowanie i implementacja nowoczesnych rozwiązań chmurowych dla biznesu.",
    longDescription:
      "Kompleksowe rozwiązania chmurowe wykorzystujące platformy AWS, Azure i Google Cloud. Projektuję architektury chmurowe z myślą o skalowalności, niezawodności i optymalizacji kosztów, stosując podejście Infrastructure as Code.",
    icon: Cloud,
    color: "from-indigo-500/90 to-purple-400/90",
    tags: ["AWS", "Azure", "Google Cloud", "IaC", "Serverless"],
    bulletPoints: [
      "Migracja on-premise do chmury z minimalnym przestojem",
      "Projektowanie architektury multi-cloud i hybrid-cloud",
      "Wdrażanie infrastruktury jako kodu (Terraform, CloudFormation)",
      "Optymalizacja kosztów i wydajności usług chmurowych",
      "Automatyczne skalowanie i zarządzanie zasobami",
    ],
  },
  {
    id: "databases",
    title: "Utrzymanie Baz Danych",
    description:
      "Optymalizacja wydajności i niezawodności systemów bazodanowych.",
    longDescription:
      "Profesjonalna administracja systemami bazodanowymi, obejmująca instalację, konfigurację, monitoring, optymalizację wydajności i bezpieczeństwo. Specjalizuję się zarówno w relacyjnych jak i nierelacyjnych bazach danych.",
    icon: Database,
    color: "from-green-500/90 to-teal-400/90",
    tags: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "High Availability"],
    bulletPoints: [
      "Projektowanie i implementacja architektury baz danych",
      "Optymalizacja zapytań i indeksów dla maksymalnej wydajności",
      "Konfiguracja replikacji i klastrowania dla wysokiej dostępności",
      "Automatyczne backupy i procedury odtwarzania",
      "Migracja i upgrade baz danych bez utraty danych",
    ],
  },
  {
    id: "automation",
    title: "Automatyzacja Procesów IT",
    description:
      "Transformacja ręcznych procesów w zautomatyzowane, efektywne rozwiązania.",
    longDescription:
      "Automatyzacja procesów IT z wykorzystaniem najnowszych narzędzi i technologii, skutkująca redukcją błędów ludzkich, przyspieszeniem wdrożeń i zwiększeniem efektywności operacyjnej zespołów deweloperskich i operacyjnych.",
    icon: Cog,
    color: "from-orange-500/90 to-yellow-400/90",
    tags: ["CI/CD", "Jenkins", "GitHub Actions", "GitLab CI", "Skrypty"],
    bulletPoints: [
      "Implementacja potoku CI/CD dla ciągłej integracji i wdrażania",
      "Automatyzacja testów i walidacji kodu",
      "Orkiestracja kontenerów z Kubernetes",
      "Skrypty automatyzacji powwtarzalnych zadań",
      "Automatyczne skalowanie infrastruktury na podstawie obciążenia",
    ],
  },
  {
    id: "support",
    title: "Wsparcie Techniczne",
    description:
      "Kompleksowe wsparcie IT dla użytkowników i systemów na wszystkich poziomach.",
    longDescription:
      "Profesjonalne wsparcie techniczne dostosowane do potrzeb klienta, od pomocy użytkownikom końcowym, przez rozwiązywanie złożonych problemów systemowych, aż po zarządzanie infrastrukturą. Oferuję elastyczne modele wsparcia z gwarantowanym SLA.",
    icon: Users,
    color: "from-emerald-500/90 to-lime-400/90",
    tags: ["Helpdesk", "Service Desk", "Remote Support", "SLA", "Konsultacje"],
    bulletPoints: [
      "Wsparcie pierwszej i drugiej linii dla użytkowników",
      "Rozwiązywanie złożonych problemów technicznych",
      "Dokumentacja procedur i wiedzy technicznej",
      "Proaktywny monitoring i zapobieganie problemom",
      "Szkolenia i warsztaty techniczne dla zespołów",
    ],
  },
  {
    id: "monitoring",
    title: "Monitorowanie Systemów",
    description:
      "Kompleksowe rozwiązania monitoringu zapewniające ciągłość działania systemów.",
    longDescription:
      "Zaawansowane systemy monitoringu infrastruktury IT, aplikacji i usług, zapewniające wczesne wykrywanie problemów, analizę wydajności i alarmowanie o potencjalnych zagrożeniach. Wykorzystuję narzędzia takie jak Zabbix, Grafana, Prometheus i ELK Stack.",
    icon: BarChart,
    color: "from-cyan-500/90 to-blue-400/90",
    tags: ["Zabbix", "Grafana", "Prometheus", "ELK Stack", "Alerting"],
    bulletPoints: [
      "Monitorowanie dostępności i wydajności systemów 24/7",
      "Konfiguracja dashboardów i wizualizacji metryk",
      "Ustawienie inteligentnych alertów i powiadomień",
      "Analiza trendów i przewidywanie problemów",
      "Monitorowanie doświadczeń użytkownika końcowego",
    ],
  },
  {
    id: "webapps",
    title: "Aplikacje Webowe",
    description:
      "Tworzenie nowoczesnych, wydajnych i skalowalnych aplikacji internetowych.",
    longDescription:
      "Projektowanie i rozwijanie zaawansowanych aplikacji webowych z wykorzystaniem najnowszych technologii frontendowych i backendowych. Tworzę rozwiązania dostosowane do potrzeb biznesowych, z naciskiem na wydajność, bezpieczeństwo i doświadczenie użytkownika.",
    icon: Code,
    color: "from-violet-500/90 to-fuchsia-400/90",
    tags: ["React", "Node.js", "Next.js", "TypeScript", "REST API"],
    bulletPoints: [
      "Tworzenie responsywnych interfejsów użytkownika",
      "Implementacja API i mikroserwisów",
      "Optymalizacja wydajności aplikacji webowych",
      "Integracja z zewnętrznymi systemami i API",
      "Wdrażanie najlepszych praktyk bezpieczeństwa aplikacji",
    ],
  },
  {
    id: "architecture",
    title: "Projektowanie Architektury IT",
    description:
      "Projektowanie skalowalnych, niezawodnych i bezpiecznych systemów informatycznych.",
    longDescription:
      "Kompleksowe projektowanie architektury systemów IT z naciskiem na skalowalność, niezawodność, bezpieczeństwo i efektywność kosztową. Tworzę rozwiązania dostosowane do specyficznych wymagań biznesowych, z myślą o przyszłym rozwoju.",
    icon: Github,
    color: "from-slate-500/90 to-gray-400/90",
    tags: [
      "System Design",
      "Microservices",
      "High Availability",
      "Scalability",
      "Documentation",
    ],
    bulletPoints: [
      "Projektowanie architektury dla systemów wysokiej dostępności",
      "Tworzenie dokumentacji technicznej i diagramów architektury",
      "Planowanie strategii disaster recovery i business continuity",
      "Optymalizacja kosztów utrzymania infrastruktury",
      "Doradztwo w zakresie wyboru technologii i narzędzi",
    ],
  },
];

// Tag component for services
const Tag: React.FC<TagProps> = ({ label, color }) => {
  return (
    <span
      className="px-2 py-1 text-xs rounded-full font-medium"
      style={{
        backgroundColor: `${color}15`,
        color: color,
      }}
    >
      {label}
    </span>
  );
};

// Service detail modal component
const ServiceDetail: React.FC<ServiceDetailProps> = ({ service, onClose }) => {
  // Extract color without the gradient for simpler usage
  const mainColor = service.color.split(" ")[1].replace(/\/.*$/, "");

  // Trap focus inside modal for accessibility
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Focus on close button when modal opens
    closeButtonRef.current?.focus();

    // Add event listener for ESC key
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscKey);

    return () => {
      window.removeEventListener("keydown", handleEscKey);
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        ref={modalRef}
        className="relative w-full max-w-3xl max-h-[90vh] bg-gray-800 rounded-xl shadow-xl overflow-hidden"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with subtle gradient background */}
        <div className={`p-8 bg-gradient-to-r ${service.color}`}>
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-full">
              <service.icon size={32} color="white" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {service.title}
            </h2>
          </div>
        </div>

        {/* Content area with scroll */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-220px)]">
          <p className="text-gray-300 mb-8 text-lg leading-relaxed">
            {service.longDescription}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {service.tags.map((tag) => (
              <Tag key={tag} label={tag} color={mainColor} />
            ))}
          </div>

          {/* Bullet points */}
          <h3 className="text-lg font-semibold text-white mb-6 tracking-tight">
            Kluczowe cechy:
          </h3>
          <ul className="space-y-4">
            {service.bulletPoints.map((point, index) => (
              <motion.li
                key={`point-${
                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                  index
                }`}
                className="flex items-start space-x-3 text-gray-300"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div
                  className="mt-1 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: mainColor }}
                >
                  <motion.svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
                  >
                    <title>Checkmark</title>
                    <motion.path
                      d="M20 6L9 17L4 12"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </motion.svg>
                </div>
                <span className="leading-relaxed">{point}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Footer with close button */}
        <div className="p-6 border-t border-gray-700/50 bg-gray-800/80 backdrop-blur-sm">
          <div className="flex justify-end">
            <motion.button
              ref={closeButtonRef}
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 rounded-lg text-white font-medium backdrop-blur-sm transition-colors duration-300 flex items-center gap-2"
              onClick={onClose}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <X size={16} />
              <span>Zamknij</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Individual service card with 3D effect
const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  index,
  onClick,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Create stable motion values for this component
  const cardMouseX = useMotionValue(0.5);
  const cardMouseY = useMotionValue(0.5);

  // Position-based rotation for 3D effect
  const rotateX = useTransform(cardMouseY, [0, 1], [5, -5]);
  const rotateY = useTransform(cardMouseX, [0, 1], [-5, 5]);

  // Handle mouse position relative to card
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !isHovered) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    cardMouseX.set(x);
    cardMouseY.set(y);
  };

  // Reset rotation when not hovered
  useEffect(() => {
    if (!isHovered) {
      cardMouseX.set(0.5);
      cardMouseY.set(0.5);
    }
  }, [isHovered, cardMouseX, cardMouseY]);

  return (
    <motion.div
      ref={cardRef}
      className="relative h-80 rounded-xl shadow-xl overflow-hidden cursor-pointer group"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        type: "spring",
        damping: 20,
      }}
      style={{
        rotateX: isHovered ? rotateX : 0,
        rotateY: isHovered ? rotateY : 0,
        transformStyle: "preserve-3d",
        perspective: 1000,
        backgroundImage:
          "linear-gradient(to bottom right, var(--tw-gradient-stops))",
      }}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.3 },
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      onClick={() => onClick(service.id)}
    >
      {/* Gradient background with subtle animated effect */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-90`}
        animate={{
          backgroundPosition: isHovered ? ["0% 0%", "100% 100%"] : "0% 0%",
        }}
        transition={{
          duration: 3,
          repeat: isHovered ? Number.POSITIVE_INFINITY : 0,
          repeatType: "reverse",
        }}
      />

      {/* Glass overlay */}
      <motion.div
        className="absolute inset-0 bg-black/10 backdrop-blur-[1px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 0.3 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Card content with 3D transform */}
      <div
        className="relative z-10 h-full flex flex-col justify-between p-7 text-white"
        style={{ transform: "translateZ(20px)" }}
      >
        <div>
          {/* Icon with subtle animation */}
          <motion.div
            className="bg-white/20 backdrop-blur-sm p-3.5 rounded-full inline-block mb-5"
            animate={{
              y: isHovered ? [0, -6, 0] : 0,
              scale: isHovered ? [1, 1.1, 1] : 1,
            }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
          >
            <service.icon size={26} className="text-white" />
          </motion.div>

          {/* Title with better typography */}
          <h3 className="text-xl font-semibold mb-3 tracking-tight">
            {service.title}
          </h3>

          {/* Description with improved readability */}
          <motion.p
            className="text-white/90 leading-relaxed text-sm"
            animate={{ opacity: isHovered ? 1 : 0.9 }}
          >
            {service.description}
          </motion.p>
        </div>

        {/* Tags with more subtle styling */}
        <div className="flex flex-wrap gap-1.5 mt-4">
          {service.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-xs rounded-full bg-white/15 backdrop-blur-sm"
            >
              {tag}
            </span>
          ))}
          {service.tags.length > 3 && (
            <span className="px-2 py-0.5 text-xs rounded-full bg-white/15 backdrop-blur-sm">
              +{service.tags.length - 3}
            </span>
          )}
        </div>

        {/* Call to action with improved animation */}
        <motion.div
          className="flex items-center space-x-2 text-sm mt-5"
          initial={{ opacity: 0, y: 10 }}
          animate={{
            opacity: isHovered ? 1 : 0,
            y: isHovered ? 0 : 10,
          }}
          transition={{ duration: 0.3 }}
        >
          <span className="font-medium">Poznaj szczegóły</span>
          <ChevronRight size={16} />
        </motion.div>
      </div>

      {/* Subtle shimmer effect on hover */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 -rotate-12 translate-y-full bg-white/10"
          animate={{ translateY: ["-100%", "100%"] }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
            ease: "linear",
          }}
          style={{ width: "150%" }}
        />
      )}
    </motion.div>
  );
};

// Main component
const EnhancedServiceCards: React.FC = () => {
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  // Get selected service
  const selectedService = serviceCategories.find(
    (service) => service.id === selectedServiceId
  );

  // Filter services based on search query
  const filteredServices = useMemo(() => {
    if (!searchQuery.trim()) return serviceCategories;

    const searchTerm = searchQuery.toLowerCase();
    return serviceCategories.filter(
      (service) =>
        service.title.toLowerCase().includes(searchTerm) ||
        service.description.toLowerCase().includes(searchTerm) ||
        service.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
    );
  }, [searchQuery]);

  return (
    <div className="mt-6">
      {/* Search bar - elegantszy design */}
      <div className="mb-10 max-w-md mx-auto">
        <div className="relative">
          <input
            type="text"
            placeholder="Szukaj usług, technologii..."
            className="w-full px-5 py-3 bg-gray-800/50 rounded-full border border-gray-700/50 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/30 outline-none transition-all text-white backdrop-blur-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute right-4 top-3.5 text-gray-400">
            <Search size={18} />
          </div>
        </div>
      </div>

      {/* Grid of service cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredServices.map((service, index) => (
          <ServiceCard
            key={service.id}
            service={service}
            index={index}
            onClick={setSelectedServiceId}
            isSelected={selectedServiceId === service.id}
            mouseX={mouseX}
            mouseY={mouseY}
          />
        ))}
      </div>

      {/* No results message */}
      {filteredServices.length === 0 && (
        <motion.div
          className="text-center py-16 text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-lg">
            Nie znaleziono usług pasujących do zapytania &quot;{searchQuery}
            &quot;
          </p>
        </motion.div>
      )}

      {/* Service details modal */}
      <AnimatePresence>
        {selectedService && (
          <ServiceDetail
            service={selectedService}
            onClose={() => setSelectedServiceId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedServiceCards;
