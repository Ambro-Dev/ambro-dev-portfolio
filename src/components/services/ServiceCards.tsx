"use client";

import type React from "react";
import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import { Glass3DCard, EliteGlassPanel } from "@/components/glass-components";
import { Button } from "@/components/ui/button";

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
}

interface ServiceDetailProps {
  service: ServiceCategory;
  onClose: () => void;
}

interface TagProps {
  label: string;
  color: string;
}

// Zmodyfikowane kategorie usług z dostosowaną kolorystyką
const serviceCategories: ServiceCategory[] = [
  {
    id: "servers",
    title: "Administracja Serwerami",
    description:
      "Zarządzanie infrastrukturą serwerową z wykorzystaniem najlepszych praktyk DevOps.",
    longDescription:
      "Kompleksowe zarządzanie serwerami, w tym instalacja, konfiguracja, monitoring, utrzymanie i optymalizacja. Wykorzystuję zaawansowane narzędzia automatyzacji jak Ansible, Puppet i Chef, aby zapewnić spójność i niezawodność infrastruktury.",
    icon: Server,
    color: "from-blue-500/60 to-blue-400/60",
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
    color: "from-rose-500/60 to-rose-400/60",
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
    color: "from-indigo-500/60 to-indigo-400/60",
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
    color: "from-emerald-500/60 to-emerald-400/60",
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
    color: "from-amber-500/60 to-amber-400/60",
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
    color: "from-sky-500/60 to-sky-400/60",
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
    color: "from-cyan-500/60 to-cyan-400/60",
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
    color: "from-violet-500/60 to-violet-400/60",
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
    color: "from-slate-500/60 to-slate-400/60",
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

// Udoskonalony komponent Tag
const Tag: React.FC<TagProps> = ({ label, color }) => {
  return (
    <span
      className="px-2.5 py-0.5 text-xs rounded-full backdrop-blur-sm font-light transition-colors"
      style={{
        backgroundColor: `${color}10`,
        color: color,
        borderWidth: "1px",
        borderColor: `${color}20`,
      }}
    >
      {label}
    </span>
  );
};

// Udoskonalony modal szczegółów usługi
const ServiceDetail: React.FC<ServiceDetailProps> = ({ service, onClose }) => {
  // Wyodrębnij kolor bez gradientu
  const mainColor = service.color.split(" ")[1].replace(/\/.*$/, "");

  // Focus dla dostępności
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Focus na przycisku zamknięcia
    closeButtonRef.current?.focus();

    // Obsługa klawisza ESC
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div
        ref={modalRef}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        onKeyDown={(e: React.KeyboardEvent) => {
          if (e.key === "Enter" || e.key === " ") {
            e.stopPropagation();
          }
        }}
      >
        <EliteGlassPanel
          variant={service.id === "security" ? "purple" : "blue"}
          borderGradient={true}
          layered={true}
          className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden"
        >
          {/* Nagłówek */}
          <div className="p-6 border-b border-slate-700/30">
            <div className="flex items-center space-x-4">
              <div className="p-2.5 bg-white/10 backdrop-blur-sm rounded-full">
                <service.icon
                  size={24}
                  className="text-white/90"
                  strokeWidth={1.5}
                />
              </div>
              <h2 className="text-xl font-light text-white tracking-tight">
                {service.title}
              </h2>
            </div>
          </div>

          {/* Obszar treści z przewijaniem */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
            <p className="text-slate-300 mb-6 text-base leading-relaxed font-light">
              {service.longDescription}
            </p>

            {/* Tagi */}
            <div className="flex flex-wrap gap-2 mb-8">
              {service.tags.map((tag) => (
                <Tag key={tag} label={tag} color={mainColor} />
              ))}
            </div>

            {/* Lista punktów */}
            <h3 className="text-base font-normal text-white mb-4 tracking-tight">
              Kluczowe cechy:
            </h3>
            <ul className="space-y-3">
              {service.bulletPoints.map((point, index) => (
                <motion.li
                  key={`point-${
                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                    index
                  }`}
                  className="flex items-start space-x-3 text-slate-300 text-sm"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08 }}
                >
                  <div
                    className="mt-1 flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${mainColor}80` }}
                  >
                    <motion.svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: index * 0.08 + 0.2, duration: 0.4 }}
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
                  <span className="leading-relaxed font-light">{point}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Stopka z przyciskiem zamknięcia */}
          <div className="p-4 border-t border-slate-700/30 backdrop-blur-sm">
            <div className="flex justify-end">
              <Button
                ref={closeButtonRef}
                variant="outline"
                size="sm"
                className="px-4 border-slate-700/50 hover:bg-slate-800/50 text-slate-200"
                onClick={onClose}
              >
                <X size={14} className="mr-2" />
                <span>Zamknij</span>
              </Button>
            </div>
          </div>
        </EliteGlassPanel>
      </div>
    </motion.div>
  );
};

// Udoskonalona karta usługi z efektem szkła 3D
const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  index,
  onClick,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <Glass3DCard
      depth={3}
      blurStrength={3}
      lightReflection={true}
      className="h-72"
      hoverEffect={true}
    >
      <motion.div
        ref={cardRef}
        className="h-full cursor-pointer"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          delay: index * 0.08,
          ease: [0.22, 1, 0.36, 1],
        }}
        onClick={() => onClick(service.id)}
      >
        {/* Gradient tła */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-20 mix-blend-multiply rounded-lg`}
        />

        {/* Treść karty */}
        <div className="relative z-10 h-full flex flex-col justify-between p-6 text-white">
          <div>
            {/* Ikona z subtelnymi efektami */}
            <div className="bg-white/10 backdrop-blur-sm p-2.5 rounded-full inline-block mb-4">
              <service.icon
                size={22}
                className="text-white/80"
                strokeWidth={1.5}
              />
            </div>

            {/* Tytuł z elegancką typografią */}
            <h3 className="text-lg font-light mb-2.5 tracking-tight">
              {service.title}
            </h3>

            {/* Opis z ulepszoną czytelnością */}
            <p className="text-slate-200/80 leading-relaxed text-sm font-light">
              {service.description}
            </p>
          </div>

          {/* Tagi ze subtelnymi efektami */}
          <div className="flex flex-wrap gap-1.5 mt-4">
            {service.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-xs rounded-full bg-white/10 backdrop-blur-sm font-light"
              >
                {tag}
              </span>
            ))}
            {service.tags.length > 3 && (
              <span className="px-2 py-0.5 text-xs rounded-full bg-white/10 backdrop-blur-sm font-light">
                +{service.tags.length - 3}
              </span>
            )}
          </div>

          {/* Przycisk szczegółów */}
          <motion.div
            className="flex items-center space-x-1.5 text-xs mt-4 text-white/70 hover:text-white transition-colors group"
            whileHover={{ x: 3 }}
          >
            <span className="font-light">Poznaj szczegóły</span>
            <ChevronRight
              size={14}
              className="group-hover:translate-x-0.5 transition-transform"
            />
          </motion.div>
        </div>
      </motion.div>
    </Glass3DCard>
  );
};

// Główny komponent
const EnhancedServiceCards: React.FC = () => {
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Pobierz wybraną usługę
  const selectedService = serviceCategories.find(
    (service) => service.id === selectedServiceId
  );

  // Filtruj usługi na podstawie wyszukiwania
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
      {/* Elegancka wyszukiwarka */}
      <div className="mb-10 max-w-md mx-auto">
        <div className="relative">
          <input
            type="text"
            placeholder="Szukaj usług, technologii..."
            className="w-full px-5 py-2.5 bg-slate-900/30 rounded-full border border-slate-700/30 focus:border-indigo-500/30 focus:ring-1 focus:ring-indigo-500/20 outline-none transition-all text-slate-200 backdrop-blur-sm text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute right-4 top-2.5 text-slate-400">
            <Search size={16} />
          </div>
        </div>
      </div>

      {/* Siatka kart usług */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service, index) => (
          <ServiceCard
            key={service.id}
            service={service}
            index={index}
            onClick={setSelectedServiceId}
            isSelected={selectedServiceId === service.id}
          />
        ))}
      </div>

      {/* Komunikat o braku wyników */}
      {filteredServices.length === 0 && (
        <motion.div
          className="text-center py-16 text-slate-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-base font-light">
            Nie znaleziono usług pasujących do zapytania &quot;{searchQuery}
            &quot;
          </p>
        </motion.div>
      )}

      {/* Modal szczegółów usługi */}
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
