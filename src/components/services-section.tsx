// src/components/services-section.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { serviceCategories } from "@/data/services";
import { Card3D } from "@/components/ambro-ui/card-3d";
import { GradientText } from "@/components/ambro-ui/gradient-text";
import { RevealText } from "@/components/ambro-ui/reveal-text";
import { AnimatedSection } from "@/components/ambro-ui/animated-section";
import { SectionHeading } from "@/components/ambro-ui/section-heading";
import { EnhancedButton } from "@/components/ambro-ui/enhanced-button";
import { TiltCard } from "@/components/ambro-ui/tilt-card";
import { TypewriterText } from "@/components/ambro-ui/typewriter-text";

export const ServicesSection = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [detailsCategory, setDetailsCategory] = useState<string | null>(null);

  // Filter categories by type (DevOps or Fullstack)
  const devopsCategories = serviceCategories.filter(
    (cat) => cat.id !== "webapps" && cat.id !== "architecture"
  );

  const fullstackCategories = serviceCategories.filter(
    (cat) => cat.id === "webapps" || cat.id === "architecture"
  );

  // View details for a specific category
  const viewCategoryDetails = (categoryId: string) => {
    setDetailsCategory(categoryId);
  };

  // Close details view
  const closeDetails = () => {
    setDetailsCategory(null);
  };

  return (
    <section className="py-24 px-6 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection animation="fadeIn">
          <SectionHeading
            title="Moje usługi"
            subtitle="Profesjonalne rozwiązania DevOps i Fullstack"
            alignment="center"
            size="xl"
            gradient
            animation="fade"
          />
        </AnimatedSection>

        {/* Category tabs */}
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          {[
            { id: null, label: "Wszystkie" },
            { id: "devops", label: "DevOps" },
            { id: "fullstack", label: "Fullstack" },
          ].map((tab) => (
            <button
              key={tab.id || "all"}
              type="button"
              onClick={() => setActiveCategory(tab.id)}
              className={`px-6 py-2 rounded-full transition-all ${
                activeCategory === tab.id
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Service categories grid */}
        {!detailsCategory ? (
          <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {serviceCategories
              .filter((category) => {
                if (activeCategory === null) return true;
                if (activeCategory === "devops")
                  return devopsCategories.includes(category);
                if (activeCategory === "fullstack")
                  return fullstackCategories.includes(category);
                return true;
              })
              .map((category, index) => (
                <AnimatedSection
                  key={category.id}
                  animation="slideUp"
                  delay={0.1 * index}
                >
                  <TiltCard
                    className="h-full"
                    tiltAmount={5}
                    glareOpacity={0.2}
                    borderGlow
                    borderColor="rgba(99, 102, 241, 0.4)"
                    backgroundEffect="gradient"
                    onClick={() => viewCategoryDetails(category.id)}
                  >
                    <div className="p-6 h-full flex flex-col">
                      <div
                        className={`w-12 h-12 rounded-full bg-gradient-to-br ${category.color} flex items-center justify-center mb-6`}
                      >
                        <category.icon className="w-6 h-6 text-white" />
                      </div>

                      <h3 className="text-xl font-bold mb-4">
                        {category.title}
                      </h3>
                      <p className="text-gray-400 mb-6">
                        {category.description}
                      </p>

                      <div className="mb-6 flex-grow">
                        <h4 className="text-sm uppercase text-gray-500 mb-2">
                          Technologie
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {category.tags.map((tag, tagIndex) => (
                            <span
                              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                              key={tagIndex}
                              className="px-3 py-1 text-xs rounded-full bg-gray-800 text-gray-300 border border-gray-700"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <EnhancedButton
                        variant="outline"
                        size="sm"
                        className="w-full mt-auto"
                      >
                        Szczegóły usługi
                      </EnhancedButton>
                    </div>
                  </TiltCard>
                </AnimatedSection>
              ))}
          </div>
        ) : (
          // Detailed view of selected category
          <AnimatedSection animation="fadeIn" delay={0.2}>
            {serviceCategories
              .filter((category) => category.id === detailsCategory)
              .map((category) => (
                <div key={category.id} className="mt-16">
                  <EnhancedButton
                    variant="outline"
                    size="sm"
                    onClick={closeDetails}
                    className="mb-8"
                  >
                    ← Powrót do wszystkich usług
                  </EnhancedButton>

                  <Card3D
                    interactive={false}
                    glowEffect
                    shadow
                    bgColor="bg-gray-900/50"
                    borderColor={`border-${
                      category.color.split("-")[1]
                    }-500/30`}
                    height="100%"
                  >
                    <div className="p-8">
                      <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
                        <div
                          className={`w-16 h-16 rounded-full bg-gradient-to-br ${category.color} flex items-center justify-center`}
                        >
                          <category.icon className="w-8 h-8 text-white" />
                        </div>

                        <div>
                          <h2 className="text-3xl font-bold mb-2">
                            <GradientText
                              from={category.color
                                .split(" ")[0]
                                .replace("from-", "")
                                .replace("/60", "")}
                              to={category.color
                                .split(" ")[1]
                                .replace("to-", "")
                                .replace("/60", "")}
                            >
                              {category.title}
                            </GradientText>
                          </h2>
                          <p className="text-xl text-gray-300">
                            {category.description}
                          </p>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-12 mb-8">
                        <div>
                          <h3 className="text-xl font-bold mb-4">
                            Opis usługi
                          </h3>
                          <p className="text-gray-300 mb-6">
                            <RevealText delay={0.2}>
                              {category.longDescription}
                            </RevealText>
                          </p>

                          <div className="mb-6">
                            <h4 className="text-sm uppercase text-gray-500 mb-2">
                              Technologie i narzędzia
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {category.tags.map((tag, tagIndex) => (
                                <span
                                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                                  key={tagIndex}
                                  className={`px-3 py-1 text-sm rounded-full bg-${
                                    category.color.split("-")[1]
                                  }-900/30 text-${
                                    category.color.split("-")[1]
                                  }-300 border border-${
                                    category.color.split("-")[1]
                                  }-700/30`}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-xl font-bold mb-4">Co oferuję</h3>
                          <ul className="space-y-3">
                            {category.bulletPoints.map((point, pointIndex) => (
                              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                              <li key={pointIndex} className="flex items-start">
                                <span
                                  className={`w-6 h-6 rounded-full bg-${
                                    category.color.split("-")[1]
                                  }-900/30 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0`}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`w-4 h-4 text-${
                                      category.color.split("-")[1]
                                    }-400`}
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
                                <span className="text-gray-300">{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="mt-12 flex flex-col md:flex-row justify-between items-center gap-6 bg-gray-800/30 p-6 rounded-lg">
                        <div>
                          <h3 className="text-xl font-bold mb-2">
                            Zainteresowany tą usługą?
                          </h3>
                          <p className="text-gray-400">
                            Skontaktuj się ze mną, aby omówić szczegóły
                            projektu.
                          </p>
                        </div>

                        <Link href="/kontakt">
                          <EnhancedButton
                            variant="tech"
                            size="lg"
                            magneticEffect
                            glowOnHover
                            rippleEffect
                          >
                            Skontaktuj się
                          </EnhancedButton>
                        </Link>
                      </div>
                    </div>
                  </Card3D>
                </div>
              ))}
          </AnimatedSection>
        )}

        {/* Summary */}
        <div className="mt-20 text-center">
          <AnimatedSection animation="fadeIn" delay={0.3}>
            <div className="max-w-3xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">
                <TypewriterText
                  text="Kompleksowe rozwiązania dla nowoczesnego biznesu"
                  speed={40}
                  showWhenDone
                  cursor={false}
                />
              </h3>
              <div className="text-gray-300">
                <RevealText>
                  Moje usługi obejmują zarówno obszar DevOps, jak i rozwój
                  aplikacji Fullstack, co pozwala mi dostarczać kompleksowe
                  rozwiązania technologiczne. Dzięki temu podejściu, zapewniam
                  nie tylko profesjonalne wdrożenie i utrzymanie infrastruktury,
                  ale również tworzenie nowoczesnych aplikacji dostosowanych do
                  potrzeb Twojego biznesu.
                </RevealText>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
