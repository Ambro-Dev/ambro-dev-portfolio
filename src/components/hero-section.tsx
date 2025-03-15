"use client";

import { AnimatedSection } from "@/components/ambro-ui/animated-section";
import { GradientText } from "@/components/ambro-ui/gradient-text";
import { ShuffleText } from "@/components/ambro-ui/shuffle-text";
import { TypewriterText } from "@/components/ambro-ui/typewriter-text";
import { EnhancedButton } from "@/components/ambro-ui/enhanced-button";
import { motion } from "framer-motion";

import React from "react";

const HeroSection = () => {
  const scrollToProjects = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToInfra = () => {
    document
      .getElementById("infrastructure")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 z-0" />

        {/* Grid pattern for more tech feeling */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10 z-0" />

        {/* Light beams effect */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/2 h-1/2 bg-gradient-radial from-indigo-500/10 to-transparent opacity-40 blur-3xl" />
      </div>

      <AnimatedSection
        animation="fadeIn"
        delay={0.2}
        className="relative z-10 max-w-4xl mx-auto text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.215, 0.61, 0.355, 1] }}
        >
          {/* Subtle badge above the title */}
          <div className="mb-6 inline-flex items-center rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-sm backdrop-blur-sm">
            <span className="animate-pulse mr-2 h-2 w-2 rounded-full bg-indigo-500" />
            <span className="text-indigo-300">
              DevOps & Full Stack Developer
            </span>
          </div>

          {/* Main title with enhanced styling */}
          <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tight relative">
            <GradientText
              from="indigo-500"
              via="purple-500"
              to="pink-500"
              glowEffect
              glowIntensity={15}
              className="leading-tight"
            >
              Ambro-Dev
            </GradientText>
            {/* Decorative elements around the title */}
            <div className="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-xl hidden md:block" />
            <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-tr from-purple-500/20 to-transparent rounded-full blur-lg hidden md:block" />
          </h1>

          {/* Subtitle with ShuffleText */}
          <div className="flex flex-col sm:flex-row items-center justify-center mb-8 text-xl md:text-3xl">
            <span className="mr-2">Tworzę</span>
            <ShuffleText
              words={[
                "nowoczesne",
                "wydajne",
                "skalowalne",
                "bezpieczne",
                "kompleksowe",
              ]}
              changeInterval={2000}
              shuffleSpeed={50}
              highlightActive
              highlightClass="text-indigo-400 font-medium"
            />
            <span className="ml-2">rozwiązania DevOps i Fullstack</span>
          </div>

          {/* Description with TypewriterText for dynamic feel */}
          <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed bg-gradient-to-r from-black/10 via-black/30 to-black/10 backdrop-blur-sm p-4 rounded-xl border border-white/5">
            <TypewriterText
              text="Specjalizuję się w administracji serwerami, automatyzacji procesów IT, bezpieczeństwie systemów oraz tworzeniu nowoczesnych aplikacji webowych."
              speed={20}
              showWhenDone
              cursor={false}
            />
          </p>

          {/* Call to action buttons with animation */}
          <motion.div
            className="flex flex-col sm:flex-row gap-5 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <EnhancedButton
              variant="tech"
              size="lg"
              onClick={scrollToProjects}
              magneticEffect
              glowOnHover
              rippleEffect
              className="px-8 py-4 relative overflow-visible group"
            >
              <span className="absolute -inset-1 bg-gradient-to-r from-indigo-500/30 to-blue-500/30 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative flex items-center">
                Zobacz moje projekty
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <title>Arrow Right</title>
                  <path
                    fillRule="evenodd"
                    d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </EnhancedButton>

            <EnhancedButton
              variant="outline"
              size="lg"
              onClick={scrollToInfra}
              borderGradient
              className="px-8 py-4 group"
            >
              <span className="flex items-center">
                Infrastruktura
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2 group-hover:translate-y-1 transition-transform duration-300"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <title>Arrow Down</title>
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </EnhancedButton>
          </motion.div>

          {/* Tech badges - dodane */}
          <motion.div
            className="mt-16 flex flex-wrap justify-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            {[
              "Docker",
              "Kubernetes",
              "AWS",
              "React",
              "Node.js",
              "TypeScript",
            ].map((tech, i) => (
              <div
                key={tech}
                className="text-xs px-3 py-1.5 rounded-full bg-gray-800/50 text-gray-300 border border-gray-700/50 backdrop-blur-sm"
                style={{
                  animationDelay: `${i * 0.1}s`,
                  animation: "fadeInUp 0.5s ease-out forwards",
                }}
              >
                {tech}
              </div>
            ))}
          </motion.div>

          {/* Scroll indicator */}
          <div className="w-full flex justify-center mt-16 z-20">
            <motion.div
              className="flex flex-col items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7, y: [0, 10, 0] }}
              transition={{
                delay: 1.5,
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
              }}
            >
              <div className="text-sm text-gray-400 mb-2">Przewiń w dół</div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mx-auto text-indigo-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <title>Scroll Down</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </motion.div>
          </div>
        </motion.div>
      </AnimatedSection>

      {/* Add CSS for grid pattern and animations */}
      <style jsx>{`
        .bg-grid-pattern {
          background-size: 50px 50px;
          background-image: linear-gradient(
              to right,
              rgba(99, 102, 241, 0.1) 1px,
              transparent 1px
            ),
            linear-gradient(
              to bottom,
              rgba(99, 102, 241, 0.1) 1px,
              transparent 1px
            );
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
