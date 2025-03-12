"use client";

import type React from "react";
import { Suspense, useState } from "react";
import { motion } from "framer-motion";
import { GlassCard, NeoGlassSection } from "@/components/glass-components";
import { AnimatedSection, GradientText } from "@/components/EnhancedUI";
import dynamic from "next/dynamic";

// Dynamically import the skills diagram
const SkillsDiagram = dynamic(
  () => import("@/components/skills/SkillsDiagram"),
  {
    ssr: false,
  }
);

/**
 * Elegancki komponent ładowania
 */
const SkillsPlaceholder: React.FC = () => (
  <div className="animate-pulse">
    <div className="flex justify-center space-x-2 mb-8">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="h-10 rounded-lg"
          style={{
            width: `${60 + i * 10}px`,
            backgroundColor: `rgba(${60 + i * 10}, ${70 + i * 5}, ${
              120 + i * 20
            }, 0.2)`,
          }}
        />
      ))}
    </div>

    <div className="space-y-4 max-w-5xl mx-auto">
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-3">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-blue-600/20" />
            <div className="h-5 bg-gray-700 rounded-lg w-32" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {[1, 2, 3, 4].map((j) => (
              <div
                key={j}
                className="h-28 rounded-lg"
                style={{
                  backgroundColor: `rgba(${40 + j * 5}, ${45 + j * 5}, ${
                    70 + j * 5
                  }, 0.3)`,
                  borderLeft: "3px solid rgba(70, 70, 100, 0.3)",
                }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

/**
 * Udoskonalona sekcja umiejętności z eleganckim designem
 */
const SkillsSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <NeoGlassSection
      id="skills"
      variant="blue"
      glow="subtle"
      pattern={true}
      className="py-20 md:py-28"
      onIntersect={() => setIsVisible(true)}
    >
      <AnimatedSection className="container mx-auto px-4">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-light mb-5 tracking-tight inline-block">
            <GradientText from="violet-500" via="purple-500" to="fuchsia-500">
              Umiejętności Techniczne
            </GradientText>
          </h2>

          <motion.div
            className="relative mt-3 mb-6 mx-auto"
            initial={{ width: 0 }}
            animate={isVisible ? { width: "200px" } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="h-0.5 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent">
              <motion.div
                className="absolute h-1 w-1 -top-[1px] rounded-full bg-purple-500/70 blur-[1px]"
                animate={{
                  left: ["0%", "100%", "0%"],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 5,
                  ease: "easeInOut",
                }}
              />
            </div>
          </motion.div>

          <motion.p
            className="text-base md:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : {}}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Przegląd moich kluczowych umiejętności technicznych. Wybierz
            kategorię lub kliknij na wybraną umiejętność, aby zobaczyć więcej
            szczegółów, w tym poziom zaawansowania, wykorzystywane narzędzia i
            zdobyte certyfikaty.
          </motion.p>
        </motion.div>

        <Suspense fallback={<SkillsPlaceholder />}>
          <SkillsDiagram />
        </Suspense>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ delay: 1, duration: 0.5 }}
          className="mt-8"
        >
          <GlassCard
            blur="sm"
            opacity={10}
            className="text-center py-3 px-4 mx-auto max-w-xl text-sm text-gray-400"
          >
            Kompleksowe i zweryfikowane umiejętności poparte latami praktycznego
            doświadczenia
          </GlassCard>
        </motion.div>
      </AnimatedSection>
    </NeoGlassSection>
  );
};

export default SkillsSection;
