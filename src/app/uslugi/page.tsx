// src/app/uslugi/page.tsx
"use client";

import { motion } from "framer-motion";
import { serviceCategories } from "@/data/services";
import { AnimatedSection } from "@/components/ambro-ui/animated-section";
import { SectionHeading } from "@/components/ambro-ui/section-heading";
import { FloatingBubbles } from "@/components/ambro-ui/floating-bubbles";
import { SectionDivider } from "@/components/ambro-ui/section-divider";
import { GradientText } from "@/components/ambro-ui/gradient-text";
import { Card3D } from "@/components/ambro-ui/card-3d";
import Link from "next/link";
import ServicesGrid from "@/components/services-grid";

const ServicesPage = () => {
  // Kategoryzuj usługi
  const devopsServices = serviceCategories.filter(
    (service) => service.id !== "webapps" && service.id !== "architecture"
  );

  const fullstackServices = serviceCategories.filter(
    (service) => service.id === "webapps" || service.id === "architecture"
  );

  return (
    <div className="min-h-screen bg-black pt-24 pb-16 relative">
      {/* Background effects */}
      <FloatingBubbles
        count={20}
        color="rgba(99, 102, 241, 0.15)"
        minSize={10}
        maxSize={40}
        interactive={false}
        fixed={true}
      />

      <div className="max-w-6xl mx-auto px-6">
        <AnimatedSection animation="fadeIn">
          <SectionHeading
            title="Kompleksowe usługi technologiczne"
            subtitle="Rozwiązania IT dostosowane do potrzeb Twojego biznesu"
            alignment="center"
            size="xl"
            gradient
            animation="fade"
          />

          <motion.div
            className="text-center max-w-3xl mx-auto mt-8 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-gray-300">
              Oferuję szeroki zakres usług technologicznych - od konfiguracji i
              zarządzania infrastrukturą chmurową, przez automatyzację procesów
              IT, aż po tworzenie nowoczesnych aplikacji webowych. Wszystkie
              rozwiązania są projektowane z myślą o długoterminowym rozwoju
              Twojego biznesu.
            </p>
          </motion.div>
        </AnimatedSection>

        {/* DevOps Services Section */}
        <div className="mt-16">
          <AnimatedSection animation="slideUp" delay={0.1}>
            <SectionHeading
              title="Usługi DevOps"
              subtitle="Automatyzacja, wydajność, skalowalność"
              alignment="left"
              size="lg"
              gradientFrom="indigo-500"
              gradientTo="blue-500"
              animation="slide"
            />

            <div className="mt-8">
              <ServicesGrid services={devopsServices} />
            </div>
          </AnimatedSection>
        </div>

        <SectionDivider
          className="my-16"
          variant="tech"
          dotColor="bg-indigo-500"
          text="Rozwiązania dopasowane do potrzeb"
        />

        {/* Fullstack Services Section */}
        <div className="mt-16">
          <AnimatedSection animation="slideUp" delay={0.1}>
            <SectionHeading
              title="Usługi Fullstack"
              subtitle="Nowoczesne aplikacje i architektura"
              alignment="left"
              size="lg"
              gradientFrom="purple-500"
              gradientTo="pink-500"
              animation="slide"
            />

            <div className="mt-8">
              <ServicesGrid services={fullstackServices} />
            </div>
          </AnimatedSection>
        </div>

        {/* Process Section */}
        <div className="mt-24">
          <AnimatedSection animation="fadeIn">
            <Card3D
              interactive={false}
              glowEffect
              glowColor="rgba(99, 102, 241, 0.4)"
              shadow
              bgColor="bg-gray-900/30"
              borderColor="border-indigo-500/20"
            >
              <div className="p-8">
                <h2 className="text-2xl font-bold mb-6 text-center">
                  <GradientText from="indigo-500" to="purple-600">
                    Jak wygląda proces współpracy
                  </GradientText>
                </h2>

                <div className="grid md:grid-cols-4 gap-6">
                  {[
                    {
                      step: "01",
                      title: "Konsultacja",
                      description:
                        "Dokładna analiza potrzeb i wymagań Twojego projektu",
                    },
                    {
                      step: "02",
                      title: "Propozycja",
                      description:
                        "Przygotowanie szczegółowej propozycji rozwiązania",
                    },
                    {
                      step: "03",
                      title: "Realizacja",
                      description:
                        "Implementacja rozwiązania z regularnymi aktualizacjami",
                    },
                    {
                      step: "04",
                      title: "Wsparcie",
                      description:
                        "Długoterminowe wsparcie i rozwój wdrożonego rozwiązania",
                    },
                  ].map((item, index) => (
                    <motion.div
                      key={`step-${
                        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                        index
                      }`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className="w-12 h-12 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mb-4">
                          <span className="text-xl font-bold text-indigo-400">
                            {item.step}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold mb-2">
                          {item.title}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {item.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Card3D>
          </AnimatedSection>
        </div>

        {/* CTA Section */}
        <div className="mt-24 text-center">
          <AnimatedSection animation="fadeIn">
            <h2 className="text-3xl font-bold mb-6">
              <GradientText from="indigo-500" via="purple-500" to="pink-500">
                Gotowy rozpocząć projekt?
              </GradientText>
            </h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Skontaktuj się ze mną, aby omówić szczegóły Twojego projektu i
              dowiedzieć się, jak mogę pomóc w realizacji Twoich celów
              biznesowych.
            </p>
            <Link href="/kontakt">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-lg font-medium"
              >
                Skontaktuj się
              </motion.div>
            </Link>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
