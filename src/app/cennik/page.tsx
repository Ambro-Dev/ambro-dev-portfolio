// src/app/cennik/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { FloatingBubbles } from "@/components/ambro-ui/floating-bubbles";
import { ScrollProgress } from "@/components/ambro-ui/scroll-progress";
import { SectionHeading } from "@/components/ambro-ui/section-heading";
import { SmoothScroll } from "@/components/ambro-ui/smooth-scroll";
import { Card3D } from "@/components/ambro-ui/card-3d";
import { GradientText } from "@/components/ambro-ui/gradient-text";
import { RevealText } from "@/components/ambro-ui/reveal-text";
import { AnimatedSection } from "@/components/ambro-ui/animated-section";
import { EnhancedButton } from "@/components/ambro-ui/enhanced-button";
import { SectionDivider } from "@/components/ambro-ui/section-divider";
import { AnimatedGradientBorder } from "@/components/ambro-ui/animated-gradient-border";
import { TiltCard } from "@/components/ambro-ui/tilt-card";
import { serviceCategories } from "@/data/services";

// Dane pakietów cenowych
const pricingPlans = [
  {
    id: "basic",
    name: "Basic",
    description: "Podstawowe rozwiązania dla małych firm i startupów",
    price: "od 2 000 zł",
    period: "miesięcznie",
    or: "od 250 zł/h",
    color: "from-blue-500 to-indigo-600",
    features: [
      "Zdalna administracja serwerami",
      "Podstawowe monitorowanie systemów",
      "Automatyczne kopie zapasowe",
      "Wsparcie email i telefoniczne",
      "Czas reakcji do 24h",
      "Podstawowe aktualizacje zabezpieczeń",
    ],
    bestFor: ["Startupy", "Małe firmy", "Indywidualni przedsiębiorcy"],
    highlighted: false,
  },
  {
    id: "standard",
    name: "Standard",
    description: "Kompleksowe rozwiązania dla średnich firm",
    price: "od 5 000 zł",
    period: "miesięcznie",
    or: "od 220 zł/h",
    color: "from-purple-500 to-indigo-600",
    features: [
      "Wszystko z planu Basic",
      "Zaawansowany monitoring 24/7",
      "Regularne audyty bezpieczeństwa",
      "Zarządzanie infrastrukturą chmurową",
      "Wdrażanie ciągłej integracji (CI/CD)",
      "Czas reakcji do 8h",
      "Miesięczne raporty wydajności",
    ],
    bestFor: ["Średnie firmy", "E-commerce", "Firmy SaaS"],
    highlighted: true,
  },
  {
    id: "premium",
    name: "Premium",
    description: "Zaawansowane rozwiązania dla dużych organizacji",
    price: "od 10 000 zł",
    period: "miesięcznie",
    or: "od 200 zł/h",
    color: "from-pink-500 to-purple-600",
    features: [
      "Wszystko z planu Standard",
      "Dedykowany inżynier DevOps",
      "Architektura wysokiej dostępności",
      "Automatyzacja procesów biznesowych",
      "Zaawansowane zarządzanie bezpieczeństwem",
      "Czas reakcji do 2h",
      "Priorytetowe wsparcie 24/7",
      "Kwartalne przeglądy architektury",
    ],
    bestFor: ["Duże organizacje", "Korporacje", "Aplikacje krytyczne"],
    highlighted: false,
  },
];

// Dane usług z indywidualną wyceną
const customPricingServices = [
  {
    id: "webapps",
    name: "Aplikacje Webowe",
    description:
      "Tworzenie nowoczesnych aplikacji internetowych dopasowanych do potrzeb biznesowych.",
    pricingModel: "Wycena projektowa lub stawka godzinowa",
    estimatedRange: "8 000 - 50 000 zł",
    factors: [
      "Złożoność funkcjonalności",
      "Skala projektu",
      "Wymagania UX/UI",
      "Integracje z zewnętrznymi systemami",
      "Wymagana wydajność i skalowalność",
    ],
    icon: "webapps",
    color: "from-violet-500/60 to-violet-400/60",
  },
  {
    id: "cloud",
    name: "Wdrożenia Chmurowe",
    description: "Kompleksowa migracja i wdrożenie infrastruktury w chmurze.",
    pricingModel: "Wycena projektowa",
    estimatedRange: "15 000 - 100 000 zł",
    factors: [
      "Wielkość istniejącej infrastruktury",
      "Wybrana platforma chmurowa",
      "Złożoność migracji danych",
      "Wymagania dostępności i redundancji",
      "Poziom automatyzacji",
    ],
    icon: "cloud",
    color: "from-indigo-500/60 to-indigo-400/60",
  },
  {
    id: "security",
    name: "Audyt i Implementacja Bezpieczeństwa",
    description:
      "Kompleksowy audyt i wdrożenie zabezpieczeń infrastruktury IT.",
    pricingModel: "Wycena projektowa lub abonament",
    estimatedRange: "5 000 - 30 000 zł",
    factors: [
      "Zakres audytu",
      "Wielkość infrastruktury",
      "Poziom wymaganych zabezpieczeń",
      "Liczba systemów do zabezpieczenia",
      "Regularna analiza i monitorowanie",
    ],
    icon: "security",
    color: "from-rose-500/60 to-rose-400/60",
  },
  {
    id: "architecture",
    name: "Projektowanie Architektury IT",
    description:
      "Profesjonalne projektowanie architektury systemów informatycznych.",
    pricingModel: "Wycena projektowa lub stawka dzienna",
    estimatedRange: "10 000 - 80 000 zł",
    factors: [
      "Złożoność systemu",
      "Wymagania skalowalności",
      "Poziom dokumentacji",
      "Konsultacje i warsztaty z zespołem",
      "Długoterminowe wsparcie architektoniczne",
    ],
    icon: "architecture",
    color: "from-slate-500/60 to-slate-400/60",
  },
];

// FAQ
const pricingFAQ = [
  {
    question: "Jakie są dostępne metody płatności?",
    answer:
      "Akceptuję płatności przelewem bankowym oraz przez PayPal. Dla stałych klientów możliwe jest ustalenie indywidualnych warunków płatności, takich jak rozliczenia miesięczne, kwartalne lub projektowe.",
  },
  {
    question: "Czy oferujesz umowy SLA (Service Level Agreement)?",
    answer:
      "Tak, dla wszystkich pakietów oferuję umowy SLA określające gwarantowany poziom usług, czas reakcji oraz dostępność. Warunki SLA są dostosowane do wybranego pakietu, a dla indywidualnych projektów możemy ustalić niestandardowe warunki.",
  },
  {
    question: "Jak wygląda proces ustalania indywidualnej wyceny?",
    answer:
      "Proces rozpoczyna się od konsultacji, podczas której omówimy Twoje potrzeby i oczekiwania. Następnie przygotowuję szczegółową ofertę z wyceną, harmonogramem realizacji i zakresem prac. Po akceptacji oferty podpisujemy umowę i rozpoczynamy współpracę.",
  },
  {
    question: "Czy możliwa jest zmiana pakietu w trakcie współpracy?",
    answer:
      "Tak, istnieje możliwość zmiany pakietu w trakcie współpracy. Zmiany są wprowadzane zazwyczaj od początku następnego okresu rozliczeniowego. Jeśli Twoje potrzeby wzrosną lub zmniejszą się, możemy elastycznie dostosować zakres usług.",
  },
  {
    question: "Jakie są koszty dodatkowych usług poza pakietem?",
    answer:
      "Usługi wykraczające poza zakres wybranego pakietu są rozliczane według stawki godzinowej lub projektowej, zależnie od charakteru prac. Przed rozpoczęciem dodatkowych prac zawsze przedstawiam szacunkowy koszt do akceptacji.",
  },
  {
    question: "Czy oferujesz zniżki dla długoterminowej współpracy?",
    answer:
      "Tak, dla klientów decydujących się na długoterminową współpracę (np. umowa roczna) oferuję atrakcyjne rabaty. Dodatkowo, stali klienci mogą liczyć na preferencyjne stawki przy rozszerzaniu zakresu usług.",
  },
];

const PricingPage = () => {
  const [activeTab, setActiveTab] = useState<"packages" | "individual">(
    "packages"
  );

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Effect */}
      <FloatingBubbles
        count={20}
        fixed
        color="rgba(99, 102, 241, 0.2)"
        maxSize={100}
        minSize={20}
        interactive
      />

      {/* Scroll Progress Indicator */}
      <ScrollProgress
        position="top"
        color="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
      />

      <SmoothScroll>
        {/* Header Section */}
        <section className="pt-36 pb-24 px-6">
          <div className="max-w-6xl mx-auto">
            <AnimatedSection animation="fadeIn">
              <SectionHeading
                title="Cennik Usług"
                subtitle="Przejrzyste i elastyczne modele cenowe"
                alignment="center"
                size="xl"
                gradient
                animation="slide"
              />

              <div className="mt-6 text-center max-w-3xl mx-auto">
                <div className="text-gray-300">
                  <RevealText>
                    Oferuję różne modele cenowe dopasowane do indywidualnych
                    potrzeb klientów. Wybierz pakiet abonamentowy lub skorzystaj
                    z indywidualnej wyceny dla specjalistycznych projektów.
                  </RevealText>
                </div>
              </div>
            </AnimatedSection>

            {/* Tab Buttons */}
            <div className="mt-12 flex justify-center space-x-4">
              <button
                onClick={() => setActiveTab("packages")}
                type="button"
                className={`px-6 py-3 rounded-full transition-all ${
                  activeTab === "packages"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50"
                }`}
              >
                Pakiety Abonamentowe
              </button>

              <button
                onClick={() => setActiveTab("individual")}
                type="button"
                className={`px-6 py-3 rounded-full transition-all ${
                  activeTab === "individual"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50"
                }`}
              >
                Wyceny Indywidualne
              </button>
            </div>

            {/* Pricing Plans Section */}
            {activeTab === "packages" && (
              <div className="mt-16 grid lg:grid-cols-3 gap-8">
                {pricingPlans.map((plan, index) => (
                  <AnimatedSection
                    key={plan.id}
                    animation="slideUp"
                    delay={0.1 * index}
                  >
                    <TiltCard
                      className={`h-full ${
                        plan.highlighted ? "relative z-10 scale-105" : ""
                      }`}
                      tiltAmount={5}
                      glareOpacity={0.2}
                      borderGlow={plan.highlighted}
                      borderColor="rgba(99, 102, 241, 0.6)"
                      backgroundEffect={plan.highlighted ? "gradient" : "none"}
                    >
                      <AnimatedGradientBorder
                        borderWidth={2}
                        borderColor={plan.color
                          .replace("from-", "")
                          .replace("to-", "via-purple-500 to-")}
                        glowEffect
                        glowIntensity={plan.highlighted ? 10 : 5}
                        animated
                        backgroundColor="bg-gray-900/80"
                      >
                        <div className="p-8 h-full flex flex-col">
                          {plan.highlighted && (
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                              Polecany
                            </div>
                          )}

                          <h3 className="text-2xl font-bold mb-2">
                            <GradientText
                              from={plan.color
                                .split(" ")[0]
                                .replace("from-", "")}
                              to={plan.color.split(" ")[1].replace("to-", "")}
                            >
                              {plan.name}
                            </GradientText>
                          </h3>

                          <p className="text-gray-400 mb-6">
                            {plan.description}
                          </p>

                          <div className="mb-6">
                            <span className="text-4xl font-bold">
                              {plan.price}
                            </span>
                            <span className="text-gray-400 ml-2">
                              {plan.period}
                            </span>
                            <div className="text-gray-400 mt-1">
                              lub {plan.or}
                            </div>
                          </div>

                          <div className="mb-8 flex-grow">
                            <h4 className="text-sm uppercase text-gray-500 mb-3">
                              W pakiecie
                            </h4>
                            <ul className="space-y-3">
                              {plan.features.map((feature, i) => (
                                <li
                                  key={`${feature}-index-${
                                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                                    i
                                  }`}
                                  className="flex items-start"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 text-indigo-400 mr-2 flex-shrink-0 mt-0.5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <title>{feature}</title>
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                  <span className="text-gray-300">
                                    {feature}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="mb-6">
                            <h4 className="text-sm uppercase text-gray-500 mb-2">
                              Idealne dla
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {plan.bestFor.map((item, i) => (
                                <span
                                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                                  key={i}
                                  className={`px-3 py-1 text-xs rounded-full bg-${
                                    plan.color.split("-")[1]
                                  }-900/30 text-${
                                    plan.color.split("-")[1]
                                  }-300 border border-${
                                    plan.color.split("-")[1]
                                  }-700/30`}
                                >
                                  {item}
                                </span>
                              ))}
                            </div>
                          </div>

                          <Link href="/kontakt" className="mt-auto">
                            <EnhancedButton
                              variant={plan.highlighted ? "tech" : "outline"}
                              size="lg"
                              className="w-full"
                              magneticEffect={plan.highlighted}
                              glowOnHover={plan.highlighted}
                              rippleEffect={plan.highlighted}
                            >
                              Wybierz pakiet
                            </EnhancedButton>
                          </Link>
                        </div>
                      </AnimatedGradientBorder>
                    </TiltCard>
                  </AnimatedSection>
                ))}
              </div>
            )}

            {/* Individual Pricing Services */}
            {activeTab === "individual" && (
              <div className="mt-16 space-y-8">
                {customPricingServices.map((service, index) => {
                  // Find the matching service from service categories to get icon
                  const matchingService = serviceCategories.find(
                    (cat) => cat.id === service.id
                  );

                  return (
                    <AnimatedSection
                      key={service.id}
                      animation={index % 2 === 0 ? "slideLeft" : "slideRight"}
                      delay={0.2}
                    >
                      <Card3D
                        interactive
                        interactiveStrength={5}
                        glowEffect
                        shadow
                        bgColor="bg-gray-900/50"
                        borderColor={`border-${
                          service.color.split("-")[1]
                        }-500/20`}
                        height="100%"
                      >
                        <div className="p-8">
                          <div className="flex flex-col md:flex-row gap-8">
                            <div className="flex-shrink-0">
                              <div
                                className={`w-16 h-16 rounded-full bg-gradient-to-br ${service.color} flex items-center justify-center`}
                              >
                                {matchingService && (
                                  <matchingService.icon className="w-8 h-8 text-white" />
                                )}
                              </div>
                            </div>

                            <div className="flex-grow">
                              <h3 className="text-2xl font-bold mb-2">
                                <GradientText
                                  from={service.color
                                    .split(" ")[0]
                                    .replace("from-", "")
                                    .replace("/60", "")}
                                  to={service.color
                                    .split(" ")[1]
                                    .replace("to-", "")
                                    .replace("/60", "")}
                                >
                                  {service.name}
                                </GradientText>
                              </h3>

                              <p className="text-gray-300 mb-4">
                                {service.description}
                              </p>

                              <div className="grid md:grid-cols-2 gap-8 mb-6">
                                <div>
                                  <h4 className="text-sm uppercase text-gray-500 mb-2">
                                    Model wyceny
                                  </h4>
                                  <p className="text-gray-300 mb-2">
                                    {service.pricingModel}
                                  </p>
                                  <p className="text-lg font-bold text-indigo-400">
                                    {service.estimatedRange}
                                  </p>
                                </div>

                                <div>
                                  <h4 className="text-sm uppercase text-gray-500 mb-2">
                                    Czynniki wpływające na cenę
                                  </h4>
                                  <ul className="space-y-2">
                                    {service.factors.map((factor, i) => (
                                      <li
                                        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                                        key={i}
                                        className="flex items-start text-sm"
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          className={`h-4 w-4 text-${service.color
                                            .split("-")[1]
                                            .replace(
                                              "/60",
                                              ""
                                            )}-400 mr-2 flex-shrink-0 mt-0.5`}
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          stroke="currentColor"
                                        >
                                          <title>{factor}</title>
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                          />
                                        </svg>
                                        <span className="text-gray-300">
                                          {factor}
                                        </span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>

                              <div className="flex justify-end">
                                <Link href="/kontakt">
                                  <EnhancedButton
                                    variant="tech"
                                    size="md"
                                    magneticEffect
                                    glowOnHover
                                  >
                                    Zapytaj o wycenę
                                  </EnhancedButton>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card3D>
                    </AnimatedSection>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 px-6 bg-gradient-to-b from-black to-gray-900">
          <div className="max-w-6xl mx-auto">
            <AnimatedSection animation="fadeIn">
              <SectionHeading
                title="FAQ - Często zadawane pytania"
                subtitle="Odpowiedzi na pytania dotyczące cennika i płatności"
                alignment="center"
                size="xl"
                gradient
                animation="fade"
              />
            </AnimatedSection>

            <div className="mt-16 max-w-3xl mx-auto space-y-6">
              {pricingFAQ.map((item, index) => (
                <AnimatedSection
                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                  key={index}
                  animation="slideUp"
                  delay={0.1 * index}
                >
                  <AnimatedGradientBorder
                    borderWidth={1}
                    borderColor="from-indigo-500 via-purple-500 to-pink-500"
                    glowEffect
                    glowIntensity={5}
                    animated
                    backgroundColor="bg-gray-900/30"
                    hoverEffect
                  >
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-3">
                        {item.question}
                      </h3>
                      <p className="text-gray-300">{item.answer}</p>
                    </div>
                  </AnimatedGradientBorder>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Additional Info Section */}
        <section className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              <AnimatedSection animation="slideLeft" delay={0.3}>
                <Card3D
                  interactive
                  interactiveStrength={10}
                  glowEffect
                  glowColor="rgba(99, 102, 241, 0.5)"
                  shadow
                  bgColor="bg-gray-900/50"
                  borderColor="border-indigo-500/20"
                  height="100%"
                >
                  <div className="p-8">
                    <h3 className="text-2xl font-bold mb-4">
                      Elastyczne rozwiązania
                    </h3>
                    <div className="text-gray-300 mb-4">
                      <RevealText staggerLines>
                        <span>Każdy biznes ma unikalne potrzeby, dlatego</span>
                        <span>oferuję elastyczne rozwiązania cenowe</span>
                        <span>dostosowane do Twojej sytuacji i wymagań.</span>
                      </RevealText>
                    </div>
                    <p className="text-gray-400">
                      Niezależnie od tego, czy potrzebujesz jednorazowego
                      projektu, czy długoterminowej współpracy, znajdziemy
                      optymalny model rozliczeń, który będzie odpowiadał Twoim
                      potrzebom biznesowym i budżetowi.
                    </p>
                  </div>
                </Card3D>
              </AnimatedSection>

              <AnimatedSection animation="slideRight" delay={0.4}>
                <Card3D
                  interactive
                  interactiveStrength={10}
                  glowEffect
                  glowColor="rgba(168, 85, 247, 0.5)"
                  shadow
                  bgColor="bg-gray-900/50"
                  borderColor="border-purple-500/20"
                  height="100%"
                >
                  <div className="p-8">
                    <h3 className="text-2xl font-bold mb-4">
                      Przejrzyste rozliczenia
                    </h3>
                    <p className="text-gray-300 mb-4">
                      <RevealText staggerLines>
                        <span>Cenię sobie transparentność, dlatego zawsze</span>
                        <span>
                          przedstawiam dokładną wycenę przed rozpoczęciem
                        </span>
                        <span>
                          współpracy i regularne raporty z postępów prac.
                        </span>
                      </RevealText>
                    </p>
                    <p className="text-gray-400">
                      Nie ma ukrytych kosztów ani niespodzianek. Otrzymujesz
                      regularny dostęp do raportów z wykonanych prac, co pozwala
                      na pełną kontrolę nad budżetem i realizowanymi zadaniami.
                    </p>
                  </div>
                </Card3D>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6 bg-gradient-to-b from-gray-900 to-black">
          <div className="max-w-4xl mx-auto text-center">
            <AnimatedSection animation="fadeIn">
              <SectionHeading
                title="Potrzebujesz niestandardowej wyceny?"
                subtitle="Skontaktuj się ze mną, aby omówić szczegóły Twojego projektu"
                alignment="center"
                size="xl"
                gradient
                animation="fade"
              />

              <div className="mt-10">
                <Link href="/kontakt">
                  <EnhancedButton
                    variant="tech"
                    size="lg"
                    magneticEffect
                    glowOnHover
                    rippleEffect
                    animatedBg
                  >
                    Skontaktuj się
                  </EnhancedButton>
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 bg-black border-t border-gray-800">
          <div className="max-w-6xl mx-auto">
            <SectionDivider
              variant="tech"
              lineColor="from-transparent via-gray-800 to-transparent"
              dotColor="bg-indigo-500"
            />

            <div className="pt-8 text-center text-gray-500 text-sm">
              <p>
                Podane ceny są orientacyjne i mogą ulec zmianie. Wszystkie ceny
                są cenami netto.
              </p>
              <p className="mt-2">
                &copy; {new Date().getFullYear()} Ambro-Dev. Wszelkie prawa
                zastrzeżone.
              </p>
            </div>
          </div>
        </footer>
      </SmoothScroll>
    </main>
  );
};

export default PricingPage;
