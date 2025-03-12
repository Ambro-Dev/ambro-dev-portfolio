"use client";

import type React from "react";
import {
  AnimatedSection,
  GradientText,
  RevealText,
} from "@/components/EnhancedUI";
import EnhancedServiceCards from "@/components/services/ServiceCards";
import { NeoGlassSection } from "@/components/glass-components";

/**
 * Services section with enhanced UI components
 */
const ServicesSection: React.FC = () => {
  return (
    <NeoGlassSection
      id="services"
      variant="blue"
      glow="subtle"
      pattern={true}
      className="py-28"
    >
      <AnimatedSection className="container mx-auto px-6">
        <RevealText className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-5">
            <GradientText
              from="blue-400"
              via="indigo-400"
              to="violet-400"
              className="font-light"
            >
              Moje Usługi
            </GradientText>
          </h2>
          <p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-light">
            Specjalizuję się w dostarczaniu kompleksowych rozwiązań IT, które
            optymalizują procesy, zwiększają bezpieczeństwo i wspierają rozwój
            biznesu.
          </p>
        </RevealText>

        {/* Subtle separator */}
        <div className="w-16 h-px mx-auto mb-16 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent opacity-50" />

        {/* Service cards component */}
        <EnhancedServiceCards />
      </AnimatedSection>
    </NeoGlassSection>
  );
};

export default ServicesSection;
