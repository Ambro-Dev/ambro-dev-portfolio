import React, { Suspense } from "react";
import {
  AnimatedSection,
  GradientText,
  RevealText,
} from "@/components/EnhancedUI";
import ArchitectureDiagram from "@/components/diagrams/ArchitectureDiagram";

const ArchitectureSection = () => {
  return (
    <div id="architecture">
      <AnimatedSection className="py-16">
        <div className="container mx-auto px-4">
          <RevealText className="mb-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <GradientText from="purple-500" via="pink-500" to="red-500">
                Architektura Systemów
              </GradientText>
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Schemat architektury przedstawiający strukturę nowoczesnego
              systemu IT z interaktywnymi elementami, które można eksplorować.
            </p>
          </RevealText>
          <Suspense
            fallback={
              <div className="h-96 bg-gray-900 animate-pulse rounded-lg" />
            }
          >
            <ArchitectureDiagram />
          </Suspense>
        </div>
      </AnimatedSection>
    </div>
  );
};

export default ArchitectureSection;
