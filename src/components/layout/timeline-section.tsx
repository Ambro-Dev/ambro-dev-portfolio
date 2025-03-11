import dynamic from "next/dynamic";
import React, { Suspense } from "react";
import {
  AnimatedSection,
  GradientText,
  RevealText,
} from "@/components/EnhancedUI";

const LazyTimeline = dynamic(
  () => import("@/components/timeline/InteractiveTimeline"),
  {
    loading: () => (
      <div className="h-96 bg-gray-900 animate-pulse rounded-lg" />
    ),
  }
);

const TimelineSection = () => {
  return (
    <div id="timeline">
      <AnimatedSection className="py-16">
        <div className="container mx-auto px-4">
          <RevealText className="mb-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <GradientText from="yellow-500" via="green-500" to="teal-500">
                Historia Zawodowa
              </GradientText>
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Interaktywna oś czasu przedstawiająca moją drogę zawodową,
              osiągnięcia i zdobyte doświadczenie na przestrzeni lat.
            </p>
          </RevealText>
          <Suspense
            fallback={
              <div className="h-96 bg-gray-900 animate-pulse rounded-lg" />
            }
          >
            <LazyTimeline />
          </Suspense>
        </div>
      </AnimatedSection>
    </div>
  );
};

export default TimelineSection;
