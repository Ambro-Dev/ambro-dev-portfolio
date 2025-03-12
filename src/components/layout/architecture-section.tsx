import React, { Suspense } from "react";
import {
  AnimatedSection,
  GradientText,
  RevealText,
} from "@/components/EnhancedUI";
import ArchitectureDiagram from "@/components/diagrams/ArchitectureDiagram";
import { NeoGlassSection } from "@/components/glass-components";

const ArchitectureSection = () => {
  return (
    <NeoGlassSection
      id="architecture"
      variant="purple"
      glow="subtle"
      pattern={true}
      className="py-24"
    >
      <AnimatedSection className="container mx-auto px-4">
        <RevealText className="mb-10 text-center">
          <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-5">
            <GradientText from="violet-400" via="indigo-400" to="blue-400">
              Architektura Systemów
            </GradientText>
          </h2>
          <p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-light">
            Schemat architektury przedstawiający strukturę nowoczesnego systemu
            IT z interaktywnymi elementami, które można eksplorować.
          </p>
        </RevealText>

        {/* Subtelny separator */}
        <div className="w-16 h-px mx-auto mb-12 bg-gradient-to-r from-transparent via-violet-500/20 to-transparent opacity-50" />

        <Suspense
          fallback={
            <div className="h-96 bg-slate-950/50 backdrop-blur-sm animate-pulse rounded-lg flex items-center justify-center">
              <div className="text-slate-400 font-light text-sm">
                Ładowanie diagramu...
              </div>
            </div>
          }
        >
          <div className="mx-auto max-w-5xl">
            <ArchitectureDiagram />
          </div>
        </Suspense>
      </AnimatedSection>
    </NeoGlassSection>
  );
};

export default ArchitectureSection;
