import React, { Suspense } from "react";
import {
  AnimatedSection,
  GradientText,
  RevealText,
} from "@/components/EnhancedUI";
import InfrastructureVisualization from "@/components/infra/InfrastructureVisualization";
import { NeoGlassSection } from "@/components/glass-components";

const InfrastructureSection = () => {
  return (
    <NeoGlassSection
      id="infrastructure"
      variant="blue"
      glow="subtle"
      pattern={true}
      className="py-24"
    >
      <AnimatedSection className="container mx-auto px-4">
        <RevealText className="mb-10 text-center">
          <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-5">
            <GradientText from="indigo-400" via="blue-400" to="violet-400">
              Wizualizacja Infrastruktury
            </GradientText>
          </h2>
          <p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-light">
            Interaktywna wizualizacja nowoczesnej infrastruktury IT, pokazująca
            komponenty i ich wzajemne powiązania w trójwymiarowej przestrzeni.
          </p>
        </RevealText>

        {/* Subtelny separator */}
        <div className="w-16 h-px mx-auto mb-12 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent opacity-50" />

        <Suspense
          fallback={
            <div className="h-96 bg-slate-950/50 backdrop-blur-sm animate-pulse rounded-lg flex items-center justify-center">
              <div className="text-slate-400 font-light text-sm">
                Ładowanie wizualizacji...
              </div>
            </div>
          }
        >
          <div className="mx-auto max-w-5xl">
            <div className="p-1 bg-slate-950/70 backdrop-blur-sm rounded-lg shadow-md">
              <InfrastructureVisualization />
            </div>
          </div>
        </Suspense>
      </AnimatedSection>
    </NeoGlassSection>
  );
};

export default InfrastructureSection;
