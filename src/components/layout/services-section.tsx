// src/components/services-section.tsx
"use client";

import { useState, useRef, useMemo, useCallback, memo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { serviceCategories } from "@/data/services";
import { AnimatedSection } from "@/components/ambro-ui/animated-section";
import { SectionHeading } from "@/components/ambro-ui/section-heading";
import { TiltCard } from "@/components/ambro-ui/tilt-card";
import { GradientText } from "@/components/ambro-ui/gradient-text";
import { EnhancedButton } from "@/components/ambro-ui/enhanced-button";

// Importujemy bezpośrednio, bez dynamic - problemy z 3D po zmianie filtra
import ServiceCardCanvas from "@/components/3d/service-card-canvas";

// Typ dla danych usługi
interface ServiceType {
  id: string;
  title: string;
  description: string;
  tags: string[];
  color: string;
}

// Interfejs propsów dla komponentu ServiceCard
interface ServiceCardProps {
  service: ServiceType;
  index: number;
  hoveredService: string | null;
  setHoveredService: (id: string | null) => void;
  handleServiceClick: (id: string) => void;
  cardVariants: Variants;
  isFilterChanging: boolean;
}

// Memoizowany komponent karty usługi dla lepszej wydajności
const ServiceCard = memo(
  ({
    service,
    index,
    hoveredService,
    setHoveredService,
    handleServiceClick,
    cardVariants,
    isFilterChanging,
  }: ServiceCardProps) => {
    return (
      <motion.li
        key={service.id}
        custom={index}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        onHoverStart={() => setHoveredService(service.id)}
        onHoverEnd={() => setHoveredService(null)}
        onClick={() => handleServiceClick(service.id)}
        className="h-full cursor-pointer"
        aria-label={`Usługa: ${service.title}`}
      >
        <TiltCard
          className="h-full"
          tiltAmount={5} // Zredukowano tilt dla lepszej wydajności
          glareOpacity={0.08} // Zredukowano glare
          borderGlow
          borderColor="rgba(99, 102, 241, 0.4)"
          backgroundEffect="gradient"
        >
          <div className="p-6 h-full flex flex-col relative overflow-hidden">
            {/* 3D Icon element - bez placeholdera */}
            <div className="w-16 h-16 mb-6">
              <ServiceCardCanvas
                serviceId={service.id}
                isHovered={hoveredService === service.id}
                color={service.color.split(" ")[0].replace("from-", "")}
                performance="high" // Tryb wysokiej wydajności
                pauseAnimations={isFilterChanging}
              />
            </div>

            <h3 className="text-xl font-bold mb-3">
              <GradientText
                preset="tech"
                glowEffect
                glowPreset="strong"
                fontWeight="bold"
                letterSpacing="wide"
              >
                &gt; {service.title}
              </GradientText>
            </h3>

            <p className="text-gray-400 mb-6">{service.description}</p>

            <div className="mt-auto">
              <h4 className="text-sm uppercase text-gray-500 mb-2">
                Technologie
              </h4>
              <div className="flex flex-wrap gap-2">
                {service.tags.slice(0, 3).map((tag, tagIndex) => (
                  <span
                    key={`${service.id}-tag-${tagIndex}`}
                    className="px-3 py-1 text-xs rounded-full bg-gray-800 text-gray-300 border border-gray-700"
                  >
                    {tag}
                  </span>
                ))}
                {service.tags.length > 3 && (
                  <span className="px-3 py-1 text-xs rounded-full bg-gray-800 text-gray-300 border border-gray-700">
                    +{service.tags.length - 3}
                  </span>
                )}
              </div>
            </div>

            {/* Uproszczony wskaźnik hover bez animacji */}
            <div
              className={`absolute bottom-4 right-4 text-indigo-400 transition-opacity duration-200 ${
                hoveredService === service.id ? "opacity-100" : "opacity-0"
              }`}
              aria-hidden="true"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <title>Dowiedz się więcej</title>
                <path d="M5 12h13M12 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </TiltCard>
      </motion.li>
    );
  }
);

ServiceCard.displayName = "ServiceCard";

// Interfejs dla kategorii filtrowania
interface FilterCategoryType {
  id: string | null;
  label: string;
}

// Interfejs propsów dla komponentu FilterButtons
interface FilterButtonsProps {
  filterCategories: FilterCategoryType[];
  activeCategory: string | null;
  setActiveCategory: (id: string | null) => void;
}

// Memoizowany komponent przycisków filtrowania
const FilterButtons = memo(
  ({
    filterCategories,
    activeCategory,
    setActiveCategory,
  }: FilterButtonsProps) => {
    return (
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <AnimatePresence>
          {filterCategories.map((tab) => (
            <motion.button
              key={tab.id || "all"}
              type="button"
              onClick={() => setActiveCategory(tab.id)}
              aria-selected={activeCategory === tab.id}
              aria-controls="services-grid"
              className={`px-6 py-2 rounded-full relative transition-all ${
                activeCategory === tab.id
                  ? "text-white"
                  : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {activeCategory === tab.id && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full -z-10"
                  layoutId="activeTab"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              {tab.label}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    );
  }
);

FilterButtons.displayName = "FilterButtons";

// Dodajemy globalny CSS dla akceleracji sprzętowej
const GlobalStyles = () => {
  return (
    <style jsx global>{`
      .gpu-accelerated {
        transform: translateZ(0);
        backface-visibility: hidden;
        perspective: 1000px;
        will-change: transform, opacity;
      }

      @media (prefers-reduced-motion: reduce) {
        * {
          animation-duration: 0.01ms !important;
          transition-duration: 0.01ms !important;
        }
      }
    `}</style>
  );
};

export const ServicesSection = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [hoveredService, setHoveredService] = useState<string | null>(null);
  const [isFilterChanging, setIsFilterChanging] = useState(false);
  const [renderedCategory, setRenderedCategory] = useState<string | null>(null);
  const router = useRouter();
  const servicesRef = useRef<HTMLDivElement>(null);

  // Memoizacja kategorii aby uniknąć ponownych obliczeń przy re-renderach
  const { devopsCategories, fullstackCategories } = useMemo(() => {
    return {
      devopsCategories: serviceCategories.filter(
        (cat) => cat.id !== "webapps" && cat.id !== "architecture"
      ),
      fullstackCategories: serviceCategories.filter(
        (cat) => cat.id === "webapps" || cat.id === "architecture"
      ),
    };
  }, []);

  // Memoizacja filtrowania usług z dwustopniowym systemem - redukuje re-rendery
  const filteredServices = useMemo(() => {
    // Używamy renderedCategory zamiast activeCategory do renderowania
    // To pozwala na dwustopniowe przejście: najpierw zmiana filtra, potem renderowanie
    if (renderedCategory === null) return serviceCategories;
    if (renderedCategory === "devops") return devopsCategories;
    if (renderedCategory === "fullstack") return fullstackCategories;
    return serviceCategories;
  }, [renderedCategory, devopsCategories, fullstackCategories]);

  // Zoptymalizowany callback dla zmiany kategorii z dwustopniowym procesem
  const handleCategoryChange = useCallback(
    (categoryId: string | null) => {
      if (activeCategory === categoryId) return; // Nie rób nic jeśli ta sama kategoria

      // Krok 1: Aktywuj tryb zmiany filtra i zapamiętaj, że będziemy zmieniać kategorię
      setIsFilterChanging(true);
      setActiveCategory(categoryId);

      // Reset hover state
      setHoveredService(null);

      // Krok 2: Po 50ms wykonaj rzeczywistą zmianę przefiltrowanych usług
      // Ten delay pozwala przeglądarce najpierw obsłużyć operacje UI bez zacinania
      setTimeout(() => {
        setRenderedCategory(categoryId);

        // Krok 3: Po kolejnych 250ms wyłącz tryb zmiany filtra
        setTimeout(() => {
          setIsFilterChanging(false);
        }, 250);
      }, 50);
    },
    [activeCategory]
  );

  // Callback dla handlera kliknięcia
  const handleServiceClick = useCallback(
    (serviceId: string) => {
      router.push(`/uslugi/${serviceId}`);
    },
    [router]
  );

  // Animation variants dla kart - zdefiniowane poza komponentem
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.03 * i, // Zmniejszono delay dla szybszego ładowania
        duration: 0.3, // Szybsza animacja
        ease: [0.43, 0.13, 0.23, 0.96],
      },
    }),
    hover: {
      y: -5, // Zmniejszono efekt unoszenia
      transition: { duration: 0.2, ease: "easeOut" },
    },
  };

  // Kategorie filtrowania - memoizowane aby uniknąć ponownego tworzenia tablicy
  const filterCategories = useMemo(
    () => [
      { id: null, label: "Wszystkie" },
      { id: "devops", label: "DevOps" },
      { id: "fullstack", label: "Fullstack" },
    ],
    []
  );

  return (
    <section
      ref={servicesRef}
      id="uslugi"
      aria-label="Usługi"
      className="py-24 px-6 bg-gradient-to-b from-black to-gray-900 relative overflow-hidden"
    >
      <GlobalStyles />
      <div className="max-w-6xl mx-auto relative z-10">
        <AnimatedSection animation="fadeIn">
          <SectionHeading
            title="Moje usługi"
            subtitle="Profesjonalne rozwiązania DevOps i Fullstack"
            alignment="center"
            size="xl"
            gradient
            animation="fade"
          />

          {/* Brief introduction text */}
          <motion.div
            className="text-center max-w-2xl mx-auto mt-6 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-gray-300">
              Oferuję kompleksowe usługi obejmujące zarówno obszar DevOps, jak i
              tworzenie aplikacji Fullstack. Każde rozwiązanie jest dopasowane
              do indywidualnych potrzeb biznesowych, zapewniając wydajność,
              skalowalność i bezpieczeństwo.
            </p>
          </motion.div>
        </AnimatedSection>

        {/* Zoptymalizowany komponent przycisków filtrowania */}
        <FilterButtons
          filterCategories={filterCategories}
          activeCategory={activeCategory}
          setActiveCategory={handleCategoryChange}
        />

        {/* Service cards grid z hardware acceleration i optymalizacją GPU */}
        <motion.ul
          id="services-grid"
          aria-label="Lista usług"
          className={`mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-8 
            ${isFilterChanging ? "gpu-accelerated" : ""}`}
          style={{
            willChange: isFilterChanging ? "transform, opacity" : "auto",
            transform: "translateZ(0)",
            backfaceVisibility: "hidden",
          }}
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {filteredServices.map((service, index) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={index}
              hoveredService={hoveredService}
              setHoveredService={setHoveredService}
              handleServiceClick={handleServiceClick}
              cardVariants={cardVariants}
              isFilterChanging={isFilterChanging}
            />
          ))}
        </motion.ul>

        {/* Bottom CTA section */}
        <div className="mt-20 text-center">
          <AnimatedSection animation="fadeIn" delay={0.3}>
            <div className="max-w-3xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">
                <GradientText from="indigo-500" to="purple-600">
                  Kompleksowe rozwiązania dla nowoczesnego biznesu
                </GradientText>
              </h3>
              <p className="text-gray-300 mb-8">
                Niezależnie od skali czy branży, moje usługi pomogą Ci
                zdigitalizować, zautomatyzować i usprawnić procesy w Twojej
                firmie.
              </p>

              <Link href="/uslugi" aria-label="Zobacz wszystkie usługi">
                <EnhancedButton
                  variant="tech"
                  size="lg"
                  magneticEffect
                  glowOnHover
                  rippleEffect
                >
                  Zobacz wszystkie usługi
                </EnhancedButton>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
