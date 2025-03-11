import React from "react";
import {
  AnimatedSection,
  GradientText,
  RevealText,
} from "@/components/EnhancedUI";
import EnhancedServiceCards from "@/components/services/ServiceCards";

const ServicesSection = () => {
  return (
    <div id="services" className="bg-gradient-to-b from-gray-900 to-gray-950">
      <AnimatedSection className="py-24">
        <div className="container mx-auto px-6">
          <RevealText className="mb-16 text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
              <GradientText
                from="blue-400"
                via="indigo-500"
                to="violet-500"
                className="p-5"
              >
                Moje Usługi
              </GradientText>
            </h2>
            <p className="text-lg md:text-xl text-gray-300/90 max-w-2xl mx-auto leading-relaxed">
              Specjalizuję się w dostarczaniu kompleksowych rozwiązań IT, które
              optymalizują procesy, zwiększają bezpieczeństwo i wspierają rozwój
              biznesu.
            </p>
          </RevealText>

          {/* Subtle divider */}
          <div className="w-24 h-1 mx-auto mb-16 rounded-full bg-gradient-to-r from-blue-500/30 via-indigo-500/30 to-violet-500/30" />

          <EnhancedServiceCards />
        </div>
      </AnimatedSection>
    </div>
  );
};

export default ServicesSection;
