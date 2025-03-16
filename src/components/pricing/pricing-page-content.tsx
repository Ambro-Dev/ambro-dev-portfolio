"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useInView } from "react-intersection-observer";
import dynamic from "next/dynamic";

// Zoptymalizowane importy komponentów - leniwe ładowanie
const FloatingBubbles = dynamic(
  () =>
    import("@/components/ambro-ui/floating-bubbles").then(
      (mod) => mod.FloatingBubbles
    ),
  { ssr: false }
);
const ScrollProgress = dynamic(() =>
  import("@/components/ambro-ui/scroll-progress").then(
    (mod) => mod.ScrollProgress
  )
);
const SectionHeading = dynamic(() =>
  import("@/components/ambro-ui/section-heading").then(
    (mod) => mod.SectionHeading
  )
);
const SmoothScroll = dynamic(
  () =>
    import("@/components/ambro-ui/smooth-scroll").then(
      (mod) => mod.SmoothScroll
    ),
  { ssr: false }
);
const Card3D = dynamic(() =>
  import("@/components/ambro-ui/card-3d").then((mod) => mod.Card3D)
);
const GradientText = dynamic(() =>
  import("@/components/ambro-ui/gradient-text").then((mod) => mod.GradientText)
);
const RevealText = dynamic(() =>
  import("@/components/ambro-ui/reveal-text").then((mod) => mod.RevealText)
);
const AnimatedSection = dynamic(() =>
  import("@/components/ambro-ui/animated-section").then(
    (mod) => mod.AnimatedSection
  )
);
const EnhancedButton = dynamic(() =>
  import("@/components/ambro-ui/enhanced-button").then(
    (mod) => mod.EnhancedButton
  )
);
const SectionDivider = dynamic(() =>
  import("@/components/ambro-ui/section-divider").then(
    (mod) => mod.SectionDivider
  )
);
const AnimatedGradientBorder = dynamic(() =>
  import("@/components/ambro-ui/animated-gradient-border").then(
    (mod) => mod.AnimatedGradientBorder
  )
);
const TiltCard = dynamic(() =>
  import("@/components/ambro-ui/tilt-card").then((mod) => mod.TiltCard)
);

// Importowanie danych
import { pricingPlans, customPricingServices, pricingFAQ } from "@/lib/pricing";
import type { ServiceCategory } from "@/data/services";

// Typ dla zakładek
type TabType = "packages" | "individual";

// Komponent pakietu cenowego z Intersection Observer dla lazy loading
const PricingPlanCard = ({
  plan,
  index,
}: {
  plan: (typeof pricingPlans)[0];
  index: number;
}) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div ref={ref} className="h-full">
      {inView && (
        <AnimatedSection animation="slideUp" delay={0.1 * index}>
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
                    from={plan.color.split(" ")[0].replace("from-", "")}
                    to={plan.color.split(" ")[1].replace("to-", "")}
                  >
                    {plan.name}
                  </GradientText>
                </h3>

                <p className="text-gray-400 mb-6">{plan.description}</p>

                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-gray-400 ml-2">{plan.period}</span>
                  <div className="text-gray-400 mt-1">lub {plan.or}</div>
                </div>

                <div className="mb-8 flex-grow">
                  <h4 className="text-sm uppercase text-gray-500 mb-3">
                    W pakiecie
                  </h4>
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li
                        key={`${plan.id}-feature-${i}`}
                        className="flex items-start"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-indigo-400 mr-2 flex-shrink-0 mt-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-gray-300">{feature}</span>
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
                        key={`${plan.id}-bestfor-${i}`}
                        className="px-3 py-1 text-xs rounded-full bg-indigo-900/30 text-indigo-300 border border-indigo-700/30"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <Link
                  href="/kontakt?pakiet=pricing"
                  className="mt-auto"
                  aria-label={`Wybierz pakiet ${plan.name}`}
                >
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
      )}
    </div>
  );
};

// Komponent usługi z indywidualną wyceną
const CustomPricingServiceCard = ({
  service,
  index,
  serviceCategories,
}: {
  service: (typeof customPricingServices)[0];
  index: number;
  serviceCategories: ServiceCategory[];
}) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Find the matching service from service categories to get icon
  const matchingService = serviceCategories?.find(
    (cat) => cat.id === service.id
  );

  return (
    <div ref={ref}>
      {inView && (
        <AnimatedSection
          animation={index % 2 === 0 ? "slideLeft" : "slideRight"}
          delay={0.2}
        >
          <Card3D
            interactive
            interactiveStrength={5}
            glowEffect
            shadow
            bgColor="bg-gray-900/50"
            borderColor="border-indigo-500/20"
            height="100%"
          >
            <div className="p-8">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-shrink-0">
                  <div
                    className={`w-16 h-16 rounded-full bg-gradient-to-br ${service.color} flex items-center justify-center`}
                    aria-hidden="true"
                  >
                    {matchingService?.icon && (
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

                  <p className="text-gray-300 mb-4">{service.description}</p>

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
                            key={`${service.id}-factor-${i}`}
                            className="flex items-start text-sm"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-indigo-400 mr-2 flex-shrink-0 mt-0.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            <span className="text-gray-300">{factor}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Link href={`/kontakt?usluga=${service.id}`}>
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
      )}
    </div>
  );
};

// FAQ komponenty
const FAQItem = ({
  item,
  index,
}: {
  item: { question: string; answer: string };
  index: number;
}) => {
  // Now the hook is at the top level of a React component
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div ref={ref} key={`faq-${index}`}>
      {inView && (
        <AnimatedSection animation="slideUp" delay={0.1 * index}>
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
              <h3 className="text-xl font-bold mb-3">{item.question}</h3>
              <p className="text-gray-300">{item.answer}</p>
            </div>
          </AnimatedGradientBorder>
        </AnimatedSection>
      )}
    </div>
  );
};

// Then use this component in your FAQSection
const FAQSection = () => {
  return (
    <div className="mt-16 max-w-3xl mx-auto space-y-6">
      {pricingFAQ.map((item, index) => (
        <FAQItem
          key={`faq-${
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            index
          }`}
          item={item}
          index={index}
        />
      ))}
    </div>
  );
};

// Główny komponent strony
export default function PricingPageContent() {
  // Stan dla aktywnej zakładki z obsługą URL
  const [activeTab, setActiveTab] = useState<TabType>("packages");
  const searchParams = useSearchParams();

  // Lazy load serviceCategories
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>(
    []
  );

  useEffect(() => {
    // Pobranie kategorii usług na stronie klienta
    import("@/data/services").then((module) => {
      setServiceCategories(module.serviceCategories);
    });

    // Sprawdź URL dla aktywnej zakładki
    const tab = searchParams?.get("tab");
    if (tab === "individual") {
      setActiveTab("individual");
    } else if (tab === "packages") {
      setActiveTab("packages");
    }
  }, [searchParams]);

  // Obsługa zmiany zakładki z aktualizacją URL
  const handleTabChange = useCallback((tab: TabType) => {
    setActiveTab(tab);

    // Aktualizacja parametru URL bez przeładowania strony
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("tab", tab);
      window.history.pushState({}, "", url);

      // Analityka
      if ("gtag" in window) {
        window.gtag("event", "tab_switch", {
          event_category: "pricing",
          event_label: tab,
        });
      }
    }
  }, []);

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
            <div className="mt-12 flex justify-center space-x-4" role="tablist">
              <button
                onClick={() => handleTabChange("packages")}
                type="button"
                role="tab"
                id="tab-packages"
                aria-selected={activeTab === "packages"}
                aria-controls="panel-packages"
                className={`px-6 py-3 rounded-full transition-all ${
                  activeTab === "packages"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50"
                }`}
              >
                Pakiety Abonamentowe
              </button>

              <button
                onClick={() => handleTabChange("individual")}
                type="button"
                role="tab"
                id="tab-individual"
                aria-selected={activeTab === "individual"}
                aria-controls="panel-individual"
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
            <div
              id="panel-packages"
              role="tabpanel"
              aria-labelledby="tab-packages"
              className={activeTab === "packages" ? "block" : "hidden"}
            >
              <div className="mt-16 grid lg:grid-cols-3 gap-8">
                {pricingPlans.map((plan, index) => (
                  <PricingPlanCard key={plan.id} plan={plan} index={index} />
                ))}
              </div>
            </div>

            {/* Individual Pricing Services */}
            <div
              id="panel-individual"
              role="tabpanel"
              aria-labelledby="tab-individual"
              className={activeTab === "individual" ? "block" : "hidden"}
            >
              <div className="mt-16 space-y-8">
                {customPricingServices.map((service, index) => (
                  <CustomPricingServiceCard
                    key={service.id}
                    service={service}
                    index={index}
                    serviceCategories={serviceCategories}
                  />
                ))}
              </div>
            </div>
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

            <FAQSection />
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
                    <div className="text-gray-300 mb-4">
                      <RevealText staggerLines>
                        <span>Cenię sobie transparentność, dlatego zawsze</span>
                        <span>
                          przedstawiam dokładną wycenę przed rozpoczęciem
                        </span>
                        <span>
                          współpracy i regularne raporty z postępów prac.
                        </span>
                      </RevealText>
                    </div>
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
                <Link href="/kontakt?origin=pricing">
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
                &copy; {new Date().getFullYear()} DevOS. Wszelkie prawa
                zastrzeżone.
              </p>
            </div>
          </div>
        </footer>
      </SmoothScroll>
    </main>
  );
}
