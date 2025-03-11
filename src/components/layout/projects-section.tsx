import dynamic from "next/dynamic";
import React, { Suspense } from "react";
import {
  AnimatedSection,
  GradientText,
  RevealText,
} from "@/components/EnhancedUI";

const LazyProjectGallery = dynamic(
  () => import("@/components/projects/ProjectGallery"),
  {
    loading: () => (
      <div className="h-96 bg-gray-900 animate-pulse rounded-lg" />
    ),
  }
);

const ProjectsSection = () => {
  return (
    <div id="projects">
      <AnimatedSection className="py-16">
        <div className="container mx-auto px-4">
          <RevealText className="mb-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <GradientText from="red-500" via="orange-500" to="yellow-500">
                Wybrane Projekty
              </GradientText>
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Przegląd najważniejszych projektów, które zrealizowałem, wraz z
              opisem technologii, wyzwań i osiągniętych rezultatów.
            </p>
          </RevealText>
          <Suspense
            fallback={
              <div className="h-96 bg-gray-900 animate-pulse rounded-lg" />
            }
          >
            <LazyProjectGallery />
          </Suspense>
        </div>
      </AnimatedSection>
    </div>
  );
};

export default ProjectsSection;
