"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeading } from "@/components/ambro-ui/section-heading";
import { AnimatedSection } from "@/components/ambro-ui/animated-section";
import { EnhancedButton } from "@/components/ambro-ui/enhanced-button";
import { Card3D } from "@/components/ambro-ui/card-3d";
import { GradientText } from "@/components/ambro-ui/gradient-text";
import { RevealText } from "@/components/ambro-ui/reveal-text";
import { ShuffleText } from "@/components/ambro-ui/shuffle-text";
import { TypewriterText } from "@/components/ambro-ui/typewriter-text";
import { FloatingBubbles } from "@/components/ambro-ui/floating-bubbles";
import { TiltCard } from "@/components/ambro-ui/tilt-card";
import { AnimatedGradientBorder } from "@/components/ambro-ui/animated-gradient-border";

import {
  Cloud,
  Database,
  Server,
  Shield,
  Layers,
  GitBranch,
  Globe,
  Zap,
  Check,
  TrendingUp,
  DollarSign,
  BarChart,
  Clock,
  Tag,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";

// Business benefit definition
interface BusinessBenefit {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  value: number;
  stats: string;
  gradient: string;
}

const businessBenefits: BusinessBenefit[] = [
  {
    id: "cost",
    title: "Redukcja kosztów",
    description: "Obniżenie kosztów infrastruktury i utrzymania systemów",
    icon: DollarSign,
    value: 40,
    stats: "Średnio 40% niższe koszty operacyjne w ciągu pierwszego roku",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    id: "agility",
    title: "Zwiększona elastyczność",
    description: "Szybsze reagowanie na zmieniające się potrzeby biznesowe",
    icon: Zap,
    value: 80,
    stats: "Nawet 80% krótszy czas wprowadzania zmian",
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    id: "scalability",
    title: "Nieograniczona skalowalność",
    description: "Łatwe skalowanie w górę lub w dół w zależności od obciążenia",
    icon: TrendingUp,
    value: 95,
    stats: "95% usprawnienie procesów skalowania zasobów",
    gradient: "from-purple-500 to-violet-500",
  },
  {
    id: "security",
    title: "Wzmocnione bezpieczeństwo",
    description: "Kompleksowa ochrona danych i systemów",
    icon: Shield,
    value: 70,
    stats: "Redukcja incydentów bezpieczeństwa o ponad 70%",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    id: "insights",
    title: "Pełna widoczność",
    description: "Szczegółowy monitoring i analityka operacyjna",
    icon: BarChart,
    value: 85,
    stats: "85% większa widoczność procesów i metryk operacyjnych",
    gradient: "from-sky-500 to-blue-500",
  },
  {
    id: "time",
    title: "Oszczędność czasu",
    description: "Automatyzacja rutynowych zadań administracyjnych",
    icon: Clock,
    value: 75,
    stats: "Redukcja czasu administracji o 75% dzięki automatyzacji",
    gradient: "from-pink-500 to-rose-500",
  },
];

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
  businessValue: string;
  position: number;
}

// Define the infrastructure layers from top to bottom
const infrastructureLayers: InfraLayer[] = [
  {
    id: "client",
    name: "Warstwa interfejsu użytkownika",
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
    businessValue:
      "Zwiększenie satysfakcji użytkowników i konwersji o 35% dzięki intuicyjnym i responsywnym interfejsom",
    position: 1,
  },
  {
    id: "api",
    name: "Warstwa API Gateway",
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
    businessValue:
      "Redukcja opóźnień API o 40% i zoptymalizowana komunikacja między systemami",
    position: 2,
  },
  {
    id: "auth",
    name: "Warstwa bezpieczeństwa",
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
    businessValue:
      "Minimalizacja ryzyka naruszenia danych i przeciętnie 70% mniej incydentów bezpieczeństwa",
    position: 3,
  },
  {
    id: "services",
    name: "Warstwa mikroserwisów",
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
    businessValue:
      "Skrócenie czasu wprowadzania nowych funkcji o 60% i izolacja błędów zapobiegająca awariom",
    position: 4,
  },
  {
    id: "data",
    name: "Warstwa danych",
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
    businessValue:
      "Zwiększenie wydajności systemów o 55% i wsparcie analityki biznesowej w czasie rzeczywistym",
    position: 5,
  },
  {
    id: "infra",
    name: "Warstwa infrastruktury chmurowej",
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
    businessValue:
      "40% redukcja kosztów infrastruktury i przyspieszenie deploymentów z dni do minut",
    position: 6,
  },
  {
    id: "devops",
    name: "Warstwa DevOps & Automatyzacji",
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
    businessValue:
      "75% szybsze wprowadzanie zmian i redukcja błędów wdrożeniowych o 68%",
    position: 7,
  },
];

// Case study definition
interface CaseStudy {
  id: string;
  company: string;
  industry: string;
  logo?: string;
  challenge: string;
  solution: string;
  results: string[];
  testimonial: {
    quote: string;
    author: string;
    position: string;
  };
}

// Define case studies
const caseStudies: CaseStudy[] = [
  {
    id: "ecommerce",
    company: "OnlineShop",
    industry: "E-commerce",
    challenge:
      "Problemy z wydajnością i wysokie koszty w okresach szczytowego ruchu",
    solution:
      "Wdrożenie skalowalnej architektury chmurowej z auto-skalowaniem i mikroserwisami",
    results: [
      "Zwiększenie przepustowości o 500% w Black Friday",
      "Redukcja kosztów infrastruktury o 42%",
      "Skrócenie czasu ładowania strony o 65%",
      "Zwiększenie konwersji o 28%",
    ],
    testimonial: {
      quote:
        "Nowa architektura pozwoliła nam bez stresu obsłużyć ruch 5x większy niż poprzednio, przy niższych kosztach. To zmieniło nasze podejście do obsługi szczytów sprzedażowych.",
      author: "Marek Nowak",
      position: "CTO, OnlineShop",
    },
  },
  {
    id: "fintech",
    company: "SecureFinance",
    industry: "Fintech",
    challenge:
      "Potrzeba wysokiego bezpieczeństwa przy jednoczesnej elastyczności wprowadzania nowych funkcji",
    solution:
      "Zbudowanie architektury mikroserwisowej z zaawansowaną warstwą bezpieczeństwa i CI/CD",
    results: [
      "Brak incydentów bezpieczeństwa od 24 miesięcy",
      "Skrócenie czasu wdrożenia nowych funkcji o 70%",
      "Zwiększenie niezawodności systemu do 99.99%",
      "Redukcja kosztów utrzymania o 35%",
    ],
    testimonial: {
      quote:
        "Dzięki nowej architekturze możemy szybko reagować na zmiany rynkowe, zachowując najwyższe standardy bezpieczeństwa wymagane w branży finansowej.",
      author: "Anna Kowalska",
      position: "Head of IT Security, SecureFinance",
    },
  },
  {
    id: "manufacturing",
    company: "SmartFactory",
    industry: "Produkcja",
    challenge:
      "Przestarzałe systemy IT ograniczające możliwości optymalizacji procesów produkcyjnych",
    solution:
      "Kompleksowa modernizacja infrastruktury z wykorzystaniem IoT i przetwarzania w czasie rzeczywistym",
    results: [
      "Zwiększenie efektywności produkcji o 23%",
      "Redukcja przestojów o 47%",
      "Optymalizacja zapasów obniżająca koszty o 18%",
      "Pełna widoczność procesów w czasie rzeczywistym",
    ],
    testimonial: {
      quote:
        "Przejście na nowoczesną architekturę pozwoliło nam zautomatyzować decyzje operacyjne i znacząco zwiększyć efektywność. Wyniki przekroczyły nasze oczekiwania.",
      author: "Jan Wiśniewski",
      position: "COO, SmartFactory",
    },
  },
];

// FAQ definition
interface FAQItem {
  question: string;
  answer: string;
}

// Define FAQs
const faqs: FAQItem[] = [
  {
    question: "Ile czasu zajmuje wdrożenie takiej architektury?",
    answer:
      "Czas wdrożenia zależy od złożoności projektu, ale typowo trwa od 2 do 6 miesięcy. Stosujemy podejście iteracyjne, dostarczając wartość biznesową już po pierwszych tygodniach współpracy.",
  },
  {
    question: "Czy muszę przebudować całą infrastrukturę naraz?",
    answer:
      "Nie, oferujemy podejście stopniowe, które umożliwia migrację w etapach. Możemy zacząć od najbardziej krytycznych elementów i stopniowo modernizować pozostałe części systemu.",
  },
  {
    question: "Jakie są koszty takiego rozwiązania?",
    answer:
      "Koszty zależą od skali projektu i wybranych technologii, jednak nasze rozwiązania są projektowane z myślą o optymalizacji kosztów. Typowo klienci widzą zwrot z inwestycji w ciągu 6-12 miesięcy dzięki redukcji kosztów operacyjnych.",
  },
  {
    question: "Czy mój zespół będzie w stanie zarządzać taką architekturą?",
    answer:
      "Tak, zapewniamy kompleksowe szkolenia i dokumentację dla Twojego zespołu. Oferujemy również usługi wsparcia i utrzymania, które możesz dostosować do swoich potrzeb.",
  },
  {
    question:
      "Czy to rozwiązanie jest bezpieczne dla krytycznych danych biznesowych?",
    answer:
      "Bezpieczeństwo jest priorytetem w naszych rozwiązaniach. Stosujemy najlepsze praktyki branżowe, szyfrowanie, wielopoziomowe zabezpieczenia i regularnie audytujemy bezpieczeństwo infrastruktury.",
  },
];

// Define the different views of the infrastructure
type ViewMode = "overview" | "layers" | "benefits" | "cases" | "faq";

const InfrastructureConcept: React.FC = () => {
  const [activeLayer, setActiveLayer] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("overview");
  const [activeBenefit, setActiveBenefit] = useState<string | null>("cost");
  const [activeCaseStudy, setActiveCaseStudy] = useState<string>("ecommerce");
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const benefitsRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);

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
    expanded: {
      scale: 1.05,
      y: -10,
      zIndex: 10,
    },
  };

  // Animation variants for benefits
  const benefitVariants = {
    initial: {
      opacity: 0,
      y: 20,
    },
    animate: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: custom * 0.1,
        duration: 0.4,
        ease: "easeOut",
      },
    }),
    hover: {
      y: -7,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  // Handle layer click
  const handleLayerClick = (layerId: string) => {
    if (activeLayer === layerId) {
      setActiveLayer(null);
    } else {
      setActiveLayer(layerId);
    }
  };

  // Handle view mode change
  const handleViewChange = (mode: ViewMode) => {
    setViewMode(mode);
    setActiveLayer(null);

    // Reset scroll position
    window.scrollTo({
      top: containerRef.current?.offsetTop || 0,
      behavior: "smooth",
    });
  };

  // Handle FAQ click
  const handleFaqClick = (question: string) => {
    if (activeQuestion === question) {
      setActiveQuestion(null);
    } else {
      setActiveQuestion(question);
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
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="md:w-1/3 flex justify-center">
            <div
              className={`p-6 rounded-xl bg-gradient-to-br ${layer.gradient} flex flex-col items-center gap-4`}
            >
              <layer.icon className="w-16 h-16 text-white" />
              <div className="text-center">
                <h3 className="text-xl font-bold text-white">{layer.name}</h3>
                <p className="text-white/80">{layer.description}</p>
              </div>
            </div>
          </div>

          <div className="md:w-2/3">
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-2">Wartość biznesowa</h3>
              <p className="text-lg text-gray-200">{layer.businessValue}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm uppercase text-gray-500 mb-3 font-medium">
                  Kluczowe funkcje
                </h4>
                <ul className="space-y-2">
                  {layer.features.map((feature, index) => (
                    <li
                      key={`feature-${layer.id}-${index}`}
                      className="flex items-start"
                    >
                      <span
                        className={`inline-block w-5 h-5 rounded-full bg-${layer.color}-400/20 text-${layer.color}-400 flex items-center justify-center mr-3 mt-0.5`}
                      >
                        <Check className="w-3 h-3" />
                      </span>
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
                      key={`tool-${layer.id}-${index}`}
                      className={`px-3 py-1 text-sm rounded-full bg-${layer.color}-900/30 text-${layer.color}-300 border border-${layer.color}-700/30`}
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-700/50">
          <p className="text-gray-400 text-sm">
            Każda warstwa naszej architektury została zaprojektowana z myślą o
            konkretnych potrzebach biznesowych i technicznych, zapewniając
            optymalną wydajność, bezpieczeństwo i skalowalność dla Twojego
            projektu.
          </p>
        </div>
      </motion.div>
    );
  };

  // Render the overview
  const renderOverview = () => {
    return (
      <div className="space-y-12 py-6">
        <AnimatedSection animation="fadeIn">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                <GradientText from="indigo-500" to="purple-600">
                  Nowoczesne podejście do infrastruktury IT
                </GradientText>
              </h3>

              <RevealText delay={0.2} staggerLines>
                <p className="text-gray-300 mb-3">
                  Tradycyjne infrastruktury IT nie nadążają za dynamicznymi
                  potrzebami współczesnego biznesu, generując niepotrzebne
                  koszty i opóźniając innowacje.
                </p>
                <p className="text-gray-300 mb-3">
                  Nasza nowoczesna, warstwowa architektura rozwiązuje te
                  problemy, dostarczając elastyczne, skalowalne i bezpieczne
                  rozwiązanie dopasowane do Twoich unikatowych potrzeb.
                </p>
                <p className="text-gray-300">
                  Każdy element architektury przekłada się na konkretne korzyści
                  biznesowe - od redukcji kosztów po zwiększenie szybkości
                  wdrażania innowacji.
                </p>
              </RevealText>

              <div className="mt-8 flex flex-wrap gap-4">
                <EnhancedButton
                  variant="tech"
                  size="lg"
                  onClick={() => handleViewChange("layers")}
                  magneticEffect
                  glowOnHover
                >
                  Zobacz architekturę
                </EnhancedButton>

                <EnhancedButton
                  variant="outline"
                  size="lg"
                  onClick={() => handleViewChange("benefits")}
                  borderGradient
                >
                  Korzyści biznesowe
                </EnhancedButton>
              </div>
            </div>

            <div>
              <Card3D
                interactive
                interactiveStrength={10}
                glowEffect
                shadow
                bgColor="bg-gray-900/30"
                borderColor="border-indigo-500/30"
              >
                <div className="p-6 relative h-[350px] overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-full">
                    <FloatingBubbles
                      count={20}
                      color="rgba(99, 102, 241, 0.2)"
                      minSize={5}
                      maxSize={20}
                    />
                  </div>

                  <div className="relative z-10 h-full flex flex-col justify-center items-center">
                    <div className="flex flex-col items-center mb-8">
                      <div className="w-20 h-20 rounded-full bg-indigo-600/20 border-2 border-indigo-600/50 flex items-center justify-center mb-4">
                        <Cloud className="w-10 h-10 text-indigo-400" />
                      </div>
                      <h3 className="text-xl font-bold text-center">
                        Elastyczna Infrastruktura Chmurowa
                      </h3>
                    </div>

                    <div className="flex flex-col gap-3 w-full max-w-md">
                      {[
                        {
                          text: "Redukcja kosztów do 40%",
                          icon: DollarSign,
                          color: "emerald",
                        },
                        {
                          text: "Skalowanie w czasie rzeczywistym",
                          icon: TrendingUp,
                          color: "indigo",
                        },
                        {
                          text: "Zwiększone bezpieczeństwo",
                          icon: Shield,
                          color: "amber",
                        },
                        {
                          text: "Przyspieszone wdrażanie zmian",
                          icon: Zap,
                          color: "blue",
                        },
                      ].map((item, idx) => (
                        <motion.div
                          key={`advantage-${
                            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                            idx
                          }`}
                          className="flex items-center gap-3 bg-gray-800/40 rounded-lg p-3"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + idx * 0.1 }}
                        >
                          <div
                            className={`w-8 h-8 rounded-full bg-${item.color}-900/30 text-${item.color}-400 flex items-center justify-center`}
                          >
                            <item.icon className="w-4 h-4" />
                          </div>
                          <span className="text-gray-200">{item.text}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card3D>
            </div>
          </div>

          <div className="mt-16">
            <h3 className="text-2xl font-bold mb-6 text-center">
              <TypewriterText
                text="Zaufali nam liderzy z różnych branż"
                speed={50}
                showWhenDone
                cursor={false}
              />
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
              {["Fintech", "E-commerce", "Healthcare", "Manufacturing"].map(
                (industry, idx) => (
                  <motion.div
                    key={`trust-${
                      // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                      idx
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + idx * 0.1 }}
                    className="flex flex-col items-center"
                  >
                    <div className="w-20 h-20 mb-4 bg-gray-800/70 rounded-lg flex items-center justify-center">
                      <Tag className="w-10 h-10 text-gray-400" />
                    </div>
                    <p className="text-center text-gray-300">{industry}</p>
                  </motion.div>
                )
              )}
            </div>
          </div>
        </AnimatedSection>
      </div>
    );
  };

  // Render the layers view
  const renderLayersView = () => {
    return (
      <div className="relative py-6">
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-3">
            <GradientText from="indigo-500" to="purple-600">
              Warstwy nowoczesnej architektury
            </GradientText>
          </h3>
          <p className="text-gray-300">
            Nasza architektura składa się z modułowych, niezależnych warstw,
            które współpracują ze sobą, tworząc elastyczny, skalowalny i
            bezpieczny ekosystem dla Twoich aplikacji i usług. Każda warstwa
            dostarcza konkretną wartość biznesową.
          </p>
        </div>

        <div className="rounded-lg overflow-hidden border border-gray-800 bg-gray-900/30">
          {infrastructureLayers.map((layer) => (
            <motion.div
              key={layer.id}
              className={`border-b border-gray-800 last:border-b-0 transition-colors ${
                activeLayer === layer.id
                  ? `bg-${layer.color}-900/10`
                  : "hover:bg-gray-800/30"
              } ${activeLayer && activeLayer !== layer.id ? "opacity-60" : ""}`}
              custom={layer.position}
              initial="initial"
              animate="animate"
              variants={layerVariants}
              whileHover={activeLayer === null ? "hover" : undefined}
              onClick={() => handleLayerClick(layer.id)}
            >
              <div
                className={`p-5 flex items-center gap-4 cursor-pointer ${
                  activeLayer === layer.id
                    ? `border-l-4 border-${layer.color}-500`
                    : ""
                }`}
              >
                <div
                  className={`p-3 rounded-lg bg-gradient-to-br ${layer.gradient}`}
                >
                  <layer.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3
                    className={`text-lg font-semibold ${
                      activeLayer === layer.id ? `text-${layer.color}-400` : ""
                    }`}
                  >
                    {layer.name}
                  </h3>
                  <p className="text-sm text-gray-400">{layer.description}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="hidden md:block max-w-md">
                    <span className="text-sm text-gray-400">
                      <span className={`text-${layer.color}-400 font-medium`}>
                        Korzyść biznesowa:
                      </span>{" "}
                      {layer.businessValue.split(" ").slice(0, 6).join(" ")}...
                    </span>
                  </div>
                  <ChevronRight
                    className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                      activeLayer === layer.id ? "rotate-90" : ""
                    }`}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>{renderLayerDetails()}</AnimatePresence>
      </div>
    );
  };

  // Render the benefits view
  const renderBenefitsView = () => {
    const activeBenefitObj = businessBenefits.find(
      (b) => b.id === activeBenefit
    );

    return (
      <div ref={benefitsRef} className="relative py-6">
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-3">
            <GradientText from="indigo-500" to="purple-600">
              Wymierne korzyści biznesowe
            </GradientText>
          </h3>
          <p className="text-gray-300">
            Nasza architektura to nie tylko innowacyjna technologia, ale przede
            wszystkim konkretne, wymierne korzyści biznesowe, które przekładają
            się na przewagę konkurencyjną.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {businessBenefits.map((benefit, index) => (
            <motion.div
              key={benefit.id}
              className="cursor-pointer"
              variants={benefitVariants}
              initial="initial"
              animate="animate"
              custom={index}
              whileHover="hover"
              onClick={() => setActiveBenefit(benefit.id)}
            >
              <TiltCard
                className="h-full"
                tiltAmount={7}
                glareOpacity={0.1}
                borderGlow={activeBenefit === benefit.id}
                borderColor={`rgba(${
                  benefit.gradient.includes("emerald")
                    ? "16, 185, 129"
                    : benefit.gradient.includes("blue")
                    ? "59, 130, 246"
                    : benefit.gradient.includes("purple")
                    ? "168, 85, 247"
                    : benefit.gradient.includes("amber")
                    ? "245, 158, 11"
                    : benefit.gradient.includes("sky")
                    ? "14, 165, 233"
                    : benefit.gradient.includes("pink")
                    ? "236, 72, 153"
                    : "99, 102, 241"
                }, 0.6)`}
              >
                <div className="p-5 h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`p-2 rounded-lg bg-gradient-to-br ${benefit.gradient}`}
                    >
                      <benefit.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold">{benefit.title}</h3>
                  </div>

                  <p className="text-gray-400 text-sm mb-5">
                    {benefit.description}
                  </p>

                  <div className="mt-auto">
                    <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full bg-gradient-to-r ${benefit.gradient}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${benefit.value}%` }}
                        transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                      />
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="text-xs text-gray-500">0%</span>
                      <span className="text-xs text-gray-500">100%</span>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>

        {/* Selected benefit details */}
        {activeBenefitObj && (
          <AnimatedGradientBorder
            borderWidth={1}
            borderColor={activeBenefitObj.gradient
              .replace("from-", "")
              .replace("to-", "")}
            glowEffect
            glowIntensity={5}
            animated
            backgroundColor="bg-gray-900/70"
            direction="diagonal"
            className="mb-8"
          >
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="md:w-1/4 flex justify-center">
                  <div
                    className={`w-32 h-32 rounded-full bg-gradient-to-br ${activeBenefitObj.gradient} flex items-center justify-center`}
                  >
                    <activeBenefitObj.icon className="w-16 h-16 text-white" />
                  </div>
                </div>

                <div className="md:w-3/4">
                  <h3 className="text-2xl font-bold mb-2">
                    <GradientText
                      from={activeBenefitObj.gradient
                        .split(" ")[0]
                        .replace("from-", "")}
                      to={activeBenefitObj.gradient
                        .split(" ")[1]
                        .replace("to-", "")}
                    >
                      {activeBenefitObj.title}
                    </GradientText>
                  </h3>

                  <p className="text-xl text-gray-200 mb-4">
                    {activeBenefitObj.stats}
                  </p>

                  <p className="text-gray-400">
                    {activeBenefitObj.description}
                  </p>

                  <div className="mt-6 grid md:grid-cols-2 gap-4">
                    <div className="bg-gray-800/50 p-4 rounded-lg">
                      <h4 className="text-sm uppercase text-gray-500 mb-2">
                        Jak to osiągamy
                      </h4>
                      <ul className="space-y-2">
                        {[
                          "Zastosowanie najnowszych technologii i rozwiązań",
                          "Optymalizacja pod kątem Twoich specyficznych potrzeb",
                          "Wykorzystanie efektu skali i automatyzacji",
                          "Ciągły monitoring i usprawnienia wydajności",
                        ].map((item, idx) => (
                          <li
                            key={`how-${
                              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                              idx
                            }`}
                            className="flex items-start gap-2"
                          >
                            <Check className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-300">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-gray-800/50 p-4 rounded-lg">
                      <h4 className="text-sm uppercase text-gray-500 mb-2">
                        Co to oznacza dla Twojego biznesu
                      </h4>
                      <ul className="space-y-2">
                        {activeBenefitObj.id === "cost"
                          ? [
                              "Niższe całkowite koszty posiadania (TCO)",
                              "Lepsze wykorzystanie budżetu IT",
                              "Oszczędności do reinwestycji w innowacje",
                              "Przewidywalne koszty operacyjne",
                            ]
                          : activeBenefitObj.id === "agility"
                          ? [
                              "Szybsza reakcja na zmiany rynkowe",
                              "Skrócony czas wprowadzania nowych funkcji",
                              "Większa elastyczność w dostosowywaniu się do potrzeb",
                              "Szybkie testowanie nowych pomysłów",
                            ]
                          : activeBenefitObj.id === "scalability"
                          ? [
                              "Płynna obsługa szczytów ruchu",
                              "Eliminacja przepłacania za nieużywane zasoby",
                              "Wsparcie szybkiego wzrostu biznesu",
                              "Dostosowanie się do sezonowych zmian",
                            ]
                          : activeBenefitObj.id === "security"
                          ? [
                              "Zmniejszenie ryzyka naruszenia danych",
                              "Ochrona reputacji marki",
                              "Zgodność z regulacjami (RODO, ISO27001)",
                              "Spokój umysłu dla kierownictwa",
                            ]
                          : activeBenefitObj.id === "insights"
                          ? [
                              "Lepsze decyzje oparte na danych",
                              "Identyfikacja trendów i wzorców",
                              "Proaktywne zarządzanie problemami",
                              "Odkrywanie nowych możliwości biznesowych",
                            ]
                          : [
                              "Uwolnienie zasobów dla strategicznych inicjatyw",
                              "Redukcja błędów wynikających z pracy manualnej",
                              "Zwiększona produktywność zespołu IT",
                              "Szybsze iteracje i usprawnienia",
                            ].map((item, idx) => (
                              <li
                                key={`business-${
                                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                                  idx
                                }`}
                                className="flex items-start gap-2"
                              >
                                <span className="text-indigo-400">→</span>
                                <span className="text-sm text-gray-300">
                                  {item}
                                </span>
                              </li>
                            ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedGradientBorder>
        )}

        <div className="bg-gray-900/30 border border-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4">
            Metodologia pomiaru korzyści
          </h3>
          <p className="text-gray-300 mb-4">
            Wszystkie przedstawione korzyści opierają się na rzeczywistych
            wynikach osiągniętych przez naszych klientów. Do oceny efektywności
            wdrożeń stosujemy rygorystyczne metodologie i narzędzia analityczne:
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Analiza przed-po",
                description:
                  "Porównanie kluczowych metryk przed i po wdrożeniu, uwzględniające naturalne trendy i sezonowość",
                icon: BarChart,
              },
              {
                title: "Długoterminowe pomiary",
                description:
                  "Monitorowanie korzyści w czasie, aby potwierdzić trwałość i stabilność osiągniętych rezultatów",
                icon: Clock,
              },
              {
                title: "Analiza finansowa",
                description:
                  "Szczegółowa kalkulacja oszczędności i zwrotu z inwestycji (ROI) wykorzystująca standardowe wskaźniki finansowe",
                icon: DollarSign,
              },
            ].map((item, idx) => (
              <div
                key={`method-${
                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                  idx
                }`}
                className="bg-gray-800/40 p-4 rounded-lg"
              >
                <div className="flex items-center gap-3 mb-3">
                  <item.icon className="w-5 h-5 text-indigo-400" />
                  <h4 className="font-medium">{item.title}</h4>
                </div>
                <p className="text-sm text-gray-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Render the case studies view
  const renderCaseStudiesView = () => {
    const activeCase = caseStudies.find((cs) => cs.id === activeCaseStudy);

    if (!activeCase) return null;

    return (
      <div className="relative py-6">
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-3">
            <GradientText from="indigo-500" to="purple-600">
              Historie sukcesu naszych klientów
            </GradientText>
          </h3>
          <p className="text-gray-300">
            Zobacz jak nowoczesna architektura pomogła firmom podobnym do Twojej
            osiągnąć wymierne rezultaty biznesowe.
          </p>
        </div>

        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          {caseStudies.map((caseStudy) => (
            <motion.button
              key={caseStudy.id}
              type="button"
              onClick={() => setActiveCaseStudy(caseStudy.id)}
              className={`px-6 py-3 rounded-lg whitespace-nowrap transition-colors ${
                activeCaseStudy === caseStudy.id
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-800/50 text-gray-300 hover:bg-gray-800"
              }`}
              whileHover={{ y: -3 }}
              whileTap={{ y: 0 }}
            >
              {caseStudy.company} ({caseStudy.industry})
            </motion.button>
          ))}
        </div>

        <Card3D
          interactive={false}
          glowEffect
          glowColor="rgba(99, 102, 241, 0.4)"
          shadow
          bgColor="bg-gray-900/50"
          borderColor="border-indigo-500/30"
        >
          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-lg bg-indigo-900/50 flex items-center justify-center">
                    <span className="text-2xl font-bold text-indigo-400">
                      {activeCase.company.substring(0, 2)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{activeCase.company}</h3>
                    <p className="text-gray-400">{activeCase.industry}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-2">Wyzwanie</h4>
                  <p className="text-gray-300">{activeCase.challenge}</p>
                </div>

                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-2">Rozwiązanie</h4>
                  <p className="text-gray-300">{activeCase.solution}</p>
                </div>
              </div>

              <div>
                <div className="bg-gray-800/50 p-6 rounded-xl mb-6">
                  <h4 className="text-lg font-semibold mb-4">Rezultaty</h4>
                  <ul className="space-y-3">
                    {activeCase.results.map((result, idx) => (
                      <li
                        key={`result-${
                          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                          idx
                        }`}
                        className="flex items-start gap-3"
                      >
                        <div className="w-6 h-6 rounded-full bg-indigo-900/50 text-indigo-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-4 h-4" />
                        </div>
                        <span className="text-gray-200">{result}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-indigo-900/10 border border-indigo-500/20 p-6 rounded-xl">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-indigo-900/50 text-indigo-400 flex items-center justify-center flex-shrink-0 mt-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        className="inline-block w-5 h-5 stroke-current"
                      >
                        <title>quote</title>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    </div>
                    <div className="italic text-gray-300">
                      &quot;{activeCase.testimonial.quote}&quot;
                    </div>
                  </div>
                  <div className="ml-11">
                    <div className="font-semibold">
                      {activeCase.testimonial.author}
                    </div>
                    <div className="text-sm text-gray-400">
                      {activeCase.testimonial.position}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-700">
              <EnhancedButton
                variant="tech"
                size="lg"
                href="/kontakt"
                magneticEffect
                glowOnHover
                rippleEffect
              >
                Chcę osiągnąć podobne rezultaty
              </EnhancedButton>
            </div>
          </div>
        </Card3D>
      </div>
    );
  };

  // Render the FAQ view
  const renderFaqView = () => {
    return (
      <div ref={faqRef} className="relative py-6">
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-3">
            <GradientText from="indigo-500" to="purple-600">
              Najczęściej zadawane pytania
            </GradientText>
          </h3>
          <p className="text-gray-300">
            Masz pytania dotyczące naszej nowoczesnej architektury? Oto
            odpowiedzi na najczęściej zadawane pytania.
          </p>
        </div>

        <div className="space-y-4 mb-8">
          {faqs.map((faq, index) => (
            <div
              key={`faq-${
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                index
              }`}
              className={`border border-gray-800 rounded-lg overflow-hidden transition-all ${
                activeQuestion === faq.question
                  ? "bg-gray-800/30"
                  : "bg-gray-900/30"
              }`}
            >
              <button
                type="button"
                className="w-full flex justify-between items-center p-5 text-left"
                onClick={() => handleFaqClick(faq.question)}
              >
                <h4 className="text-lg font-medium">{faq.question}</h4>
                <ChevronRight
                  className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                    activeQuestion === faq.question ? "rotate-90" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {activeQuestion === faq.question && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-5 pb-5 text-gray-300">{faq.answer}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <AnimatedGradientBorder
          borderWidth={1}
          borderColor="from-indigo-500 via-purple-500 to-pink-500"
          glowEffect
          glowIntensity={5}
          animated
          backgroundColor="bg-gray-900/70"
          direction="diagonal"
        >
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="md:w-2/3">
                <h3 className="text-xl font-bold mb-2">
                  <GradientText
                    from="indigo-500"
                    via="purple-500"
                    to="pink-500"
                  >
                    Nie znalazłeś odpowiedzi na swoje pytanie?
                  </GradientText>
                </h3>

                <p className="text-gray-300">
                  Skontaktuj się z nami, aby uzyskać szczegółowe informacje
                  dotyczące Twojego konkretnego przypadku. Pierwsze konsultacje
                  są bezpłatne i niezobowiązujące.
                </p>
              </div>

              <div className="md:w-1/3 flex justify-center">
                <EnhancedButton
                  variant="tech"
                  size="lg"
                  href="/kontakt"
                  magneticEffect
                  glowOnHover
                  rippleEffect
                  animatedBg
                  fullWidth
                >
                  Zadaj pytanie
                </EnhancedButton>
              </div>
            </div>
          </div>
        </AnimatedGradientBorder>
      </div>
    );
  };

  return (
    <section
      ref={containerRef}
      className="py-20 px-4 relative overflow-hidden bg-gray-900/40"
    >
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
                  shuffleSpeed={20}
                />{" "}
                dla Twojego biznesu
              </span>
            }
            subtitle="Elastyczne, skalowalne i bezpieczne rozwiązania chmurowe zapewniające wymierne korzyści biznesowe"
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
          <div className="bg-gray-800/50 p-1 rounded-lg inline-flex flex-wrap justify-center">
            {[
              { id: "overview", label: "Przegląd" },
              { id: "layers", label: "Architektura" },
              { id: "benefits", label: "Korzyści" },
              { id: "cases", label: "Historie sukcesu" },
              { id: "faq", label: "FAQ" },
            ].map((tab) => (
              <button
                key={tab.id}
                className={`px-4 py-2 m-1 rounded-md text-sm font-medium transition-all ${
                  viewMode === tab.id
                    ? "bg-indigo-600 text-white"
                    : "text-gray-300 hover:bg-gray-700/50"
                }`}
                type="button"
                onClick={() => handleViewChange(tab.id as ViewMode)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main content container */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 overflow-hidden">
          <div className="p-6">
            {viewMode === "overview" && renderOverview()}
            {viewMode === "layers" && renderLayersView()}
            {viewMode === "benefits" && renderBenefitsView()}
            {viewMode === "cases" && renderCaseStudiesView()}
            {viewMode === "faq" && renderFaqView()}
          </div>
        </div>

        {/* Call to action */}
        <div className="mt-12 text-center">
          <RevealText className="text-2xl font-bold mb-4" delay={0.3}>
            Gotów zrewolucjonizować swoją infrastrukturę IT?
          </RevealText>

          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            Umów bezpłatną konsultację, podczas której omówimy Twoje potrzeby i
            zaproponujemy optymalną architekturę dostosowaną do specyfiki
            Twojego biznesu.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <EnhancedButton
              variant="tech"
              size="lg"
              href="/kontakt"
              animatedBg
              magneticEffect
              borderGradient
              glowOnHover
              rippleEffect
            >
              Umów bezpłatną konsultację
            </EnhancedButton>

            <EnhancedButton
              variant="outline"
              size="lg"
              onClick={() => handleViewChange("cases")}
            >
              Zobacz historie sukcesu
            </EnhancedButton>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InfrastructureConcept;
