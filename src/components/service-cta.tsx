// src/components/service-cta.tsx
"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { motion, useAnimation } from "framer-motion";
import { EnhancedButton } from "@/components/ambro-ui/enhanced-button";
import { GradientText } from "@/components/ambro-ui/gradient-text";
import { RevealText } from "@/components/ambro-ui/reveal-text";
import { ShuffleText } from "@/components/ambro-ui/shuffle-text";
import { FloatingBubbles } from "@/components/ambro-ui/floating-bubbles";
import { AnimatedGradientBorder } from "@/components/ambro-ui/animated-gradient-border";

interface ServiceCTAProps {
  serviceName: string;
  primaryColor: string;
  secondaryColor: string;
  showTestimonial?: boolean;
}

const ServiceCTA: React.FC<ServiceCTAProps> = ({
  serviceName,
  primaryColor,
  secondaryColor,
  showTestimonial = true,
}) => {
  const ctaRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  // Handle scroll-based animations
  useEffect(() => {
    // Capture the current ref value at effect execution time
    const currentElement = ctaRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          controls.start("visible");
        }
      },
      { threshold: 0.3 }
    );

    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      // Use the captured value in cleanup
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [controls]);

  // Animation variants
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.215, 0.61, 0.355, 1] },
    },
  };

  // Random testimonial for this service
  const testimonials = [
    {
      quote: `Wdrożenie usługi ${serviceName} znacząco przyspieszyło rozwój naszego biznesu i poprawiło wydajność zespołu IT.`,
      author: "Tomasz Nowicki",
      company: "CEO, TechFirma Polska",
    },
    {
      quote: `Profesjonalizm i jakość wykonania usługi ${serviceName} przewyższyły nasze oczekiwania. Polecam każdej firmie szukającej niezawodnych rozwiązań IT.`,
      author: "Anna Kowalska",
      company: "CTO, E-commerce Plus",
    },
    {
      quote: `Dzięki ${serviceName} zoptymalizowaliśmy nasze procesy i znacząco zmniejszyliśmy koszty operacyjne. Współpraca na najwyższym poziomie.`,
      author: "Marcin Zawadzki",
      company: "IT Director, StartupTech",
    },
  ];

  const randomTestimonial =
    testimonials[Math.floor(Math.random() * testimonials.length)];

  return (
    <div ref={ctaRef} className="relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 z-0 opacity-50">
        <FloatingBubbles
          count={15}
          color={`rgba(${
            primaryColor === "indigo"
              ? "99, 102, 241"
              : primaryColor === "emerald"
              ? "16, 185, 129"
              : primaryColor === "sky"
              ? "14, 165, 233"
              : primaryColor === "purple"
              ? "168, 85, 247"
              : primaryColor === "amber"
              ? "245, 158, 11"
              : primaryColor === "pink"
              ? "236, 72, 153"
              : "99, 102, 241"
          }, 0.2)`}
          minSize={5}
          maxSize={20}
          interactive={false}
        />
      </div>

      <AnimatedGradientBorder
        borderWidth={1}
        borderColor={`from-${primaryColor}-500 via-${secondaryColor}-500 to-${primaryColor}-500`}
        glowEffect
        glowIntensity={5}
        animated
        animationDuration={10}
        backgroundColor="bg-gray-900/70"
        direction="diagonal"
        rounded="rounded-xl"
        className="relative z-10"
      >
        <motion.div
          className="p-8 md:p-12"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <motion.div variants={itemVariants}>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                <GradientText
                  from={`${primaryColor}-500`}
                  via={`${secondaryColor}-500`}
                  to={`${primaryColor}-500`}
                  animated
                  glowEffect
                >
                  Gotowy na transformację technologiczną?
                </GradientText>
              </h3>

              <div className="mb-6">
                <RevealText delay={0.2} staggerLines>
                  <p>
                    Usługa <strong>{serviceName}</strong> to kompleksowe
                    rozwiązanie dopasowane do potrzeb Twojego biznesu.
                  </p>
                  <p>
                    Skontaktuj się już dziś, aby omówić szczegóły współpracy i
                    rozpocząć proces wdrożenia.
                  </p>
                </RevealText>
              </div>

              <motion.div
                variants={itemVariants}
                className="flex flex-wrap gap-4"
              >
                <Link href="/kontakt">
                  <EnhancedButton
                    variant="tech"
                    size="lg"
                    magneticEffect
                    glowOnHover
                    glowColor={`rgba(${
                      primaryColor === "indigo"
                        ? "99, 102, 241"
                        : primaryColor === "emerald"
                        ? "16, 185, 129"
                        : primaryColor === "sky"
                        ? "14, 165, 233"
                        : primaryColor === "purple"
                        ? "168, 85, 247"
                        : primaryColor === "amber"
                        ? "245, 158, 11"
                        : primaryColor === "pink"
                        ? "236, 72, 153"
                        : "99, 102, 241"
                    }, 0.6)`}
                    rippleEffect
                    animatedBg
                  >
                    Skontaktuj się
                  </EnhancedButton>
                </Link>

                <Link href="/cennik">
                  <EnhancedButton variant="outline" size="lg" borderGradient>
                    Zobacz cennik
                  </EnhancedButton>
                </Link>
              </motion.div>
            </motion.div>

            {showTestimonial ? (
              <motion.div variants={itemVariants}>
                <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/30">
                  <div className="mb-4">
                    <svg
                      className={`w-10 h-10 text-${primaryColor}-400/50`}
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <title>Quote</title>
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>

                  <p className="text-gray-300 mb-6 italic">
                    &quot;{randomTestimonial.quote}&quot;
                  </p>

                  <div>
                    <p className="font-medium text-white">
                      {randomTestimonial.author}
                    </p>
                    <p className="text-sm text-gray-400">
                      {randomTestimonial.company}
                    </p>
                  </div>
                </div>

                <motion.div
                  className="mt-6 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2, duration: 0.8 }}
                >
                  <p className="text-gray-400 text-sm">
                    Dołącz do{" "}
                    <ShuffleText
                      words={["ponad 50", "wielu", "dziesiątek", "licznych"]}
                      changeInterval={3000}
                      highlightActive
                      highlightClass={`text-${primaryColor}-400`}
                    />{" "}
                    zadowolonych klientów
                  </p>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div variants={itemVariants}>
                <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/30">
                  <h4 className="text-xl font-bold mb-4">
                    Korzyści współpracy
                  </h4>

                  <ul className="space-y-3">
                    {[
                      "Indywidualne podejście do każdego projektu",
                      "Wykorzystanie najnowszych technologii i narzędzi",
                      "Wieloletnie doświadczenie w branży IT",
                      "Regularne raportowanie postępów prac",
                      "Wsparcie techniczne po zakończeniu wdrożenia",
                    ].map((benefit, index) => (
                      <li
                        key={`benefit-${
                          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                          index
                        }`}
                        className="flex items-start"
                      >
                        <span
                          className={`w-6 h-6 rounded-full bg-${primaryColor}-900/30 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`w-4 h-4 text-${primaryColor}-400`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <title>Checkmark</title>
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </span>
                        <span className="text-gray-300">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </AnimatedGradientBorder>
    </div>
  );
};

export default ServiceCTA;
