import React, { Suspense } from "react";
import {
  AnimatedSection,
  GradientText,
  RevealText,
} from "@/components/EnhancedUI";
import ResponsiveSkillsDiagram from "@/components/skills/SkillsDiagram";

const SkillsSection = () => {
  return (
    <div id="skills">
      <AnimatedSection className="py-16">
        <div className="container mx-auto px-4">
          <RevealText className="mb-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <GradientText from="pink-500" via="red-500" to="orange-500">
                Umiejętności Techniczne
              </GradientText>
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Interaktywny diagram przedstawiający moje główne umiejętności
              techniczne wraz z poziomem zaawansowania i używanymi narzędziami.
            </p>
          </RevealText>
          <Suspense
            fallback={
              <div className="h-96 bg-gray-900 animate-pulse rounded-lg" />
            }
          >
            <ResponsiveSkillsDiagram />
          </Suspense>
        </div>
      </AnimatedSection>
    </div>
  );
};

export default SkillsSection;
