import React, { Suspense } from "react";
import {
  AnimatedSection,
  GradientText,
  RevealText,
} from "@/components/EnhancedUI";
import InfrastructureVisualization from "@/components/infra/InfrastructureVisualization";

const InfrastructureSection = () => {
  return (
    <div id="infrastructure">
      <AnimatedSection className="py-16">
        <div className="container mx-auto px-4">
          <RevealText className="mb-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <GradientText from="indigo-500" via="purple-500" to="pink-500">
                Wizualizacja Infrastruktury
              </GradientText>
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Interaktywna wizualizacja nowoczesnej infrastruktury IT,
              pokazująca komponenty i ich wzajemne powiązania w trójwymiarowej
              przestrzeni.
            </p>
          </RevealText>
          <Suspense
            fallback={
              <div className="h-96 bg-gray-900 animate-pulse rounded-lg" />
            }
          >
            <div className="mx-auto max-w-6xl">
              <InfrastructureVisualization />
            </div>
          </Suspense>
        </div>
      </AnimatedSection>
    </div>
  );
};

export default InfrastructureSection;
