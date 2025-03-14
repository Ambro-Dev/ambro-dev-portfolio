import React, { useState } from "react";
import { SectionHeading } from "@/components/ambro-ui/section-heading";
import { SectionDivider } from "@/components/ambro-ui/section-divider";
import { TiltCard } from "@/components/ambro-ui/tilt-card";
import { GradientText } from "@/components/ambro-ui/gradient-text";
import { RevealText } from "@/components/ambro-ui/reveal-text";
import { FloatingBubbles } from "@/components/ambro-ui/floating-bubbles";
import { ShuffleText } from "@/components/ambro-ui/shuffle-text";
import { motion } from "framer-motion";

const TechSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const technologies = [
    {
      name: "Next.js",
      icon: "⚡",
      color: "from-blue-600 to-cyan-500",
      description:
        "React framework enabling server-side rendering and generating static websites",
      features: [
        "Server Components",
        "App Router",
        "Image Optimization",
        "API Routes",
      ],
    },
    {
      name: "TypeScript",
      icon: "𝓣𝓢",
      color: "from-blue-500 to-blue-700",
      description:
        "Strongly typed programming language that builds on JavaScript",
      features: [
        "Static Types",
        "Code Completion",
        "Early Error Detection",
        "Self-Documenting",
      ],
    },
    {
      name: "shadcn/ui",
      icon: "◼",
      color: "from-slate-700 to-slate-900",
      description:
        "Beautifully designed components built with Radix UI and Tailwind CSS",
      features: [
        "Unstyled & Accessible",
        "Customizable",
        "Fast Development",
        "Modern Design",
      ],
    },
    {
      name: "Framer Motion",
      icon: "▶",
      color: "from-purple-600 to-pink-600",
      description:
        "Production-ready motion library for React websites and applications",
      features: [
        "Declarative Animations",
        "Gestures",
        "Layout Animations",
        "Seamless Transitions",
      ],
    },
    {
      name: "React Three Fiber",
      icon: "△",
      color: "from-green-400 to-blue-500",
      description:
        "React renderer for Three.js, creating 3D graphics in a React-like workflow",
      features: [
        "Declarative 3D",
        "React Ecosystem",
        "Performance Optimized",
        "WebGL Support",
      ],
    },
  ];

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background particles */}
      <div className="absolute inset-0 opacity-40">
        <FloatingBubbles
          count={30}
          minSize={2}
          maxSize={12}
          color="rgba(99, 102, 241, 0.3)"
          minSpeed={0.2}
          maxSpeed={0.5}
          fixed={true}
        />
      </div>

      {/* Section heading */}
      <div className="container mx-auto px-4 mb-16 relative z-10">
        <SectionHeading
          title="Technology Stack"
          subtitle="Modern tools powering a seamless experience"
          alignment="center"
          size="xl"
          animation="slide"
          highlightWords={[0, 1]}
          highlightColor="bg-indigo-500/10"
          divider={true}
          dividerWidth="80px"
          dividerColor="bg-indigo-500"
        />
      </div>

      {/* Tech section divider */}
      <SectionDivider
        variant="tech"
        text="CORE TECHNOLOGIES"
        dotColor="bg-indigo-500"
        className="mb-12"
      />

      {/* Tech cards */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {technologies.map((tech, index) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <TiltCard
                className="h-60 rounded-xl overflow-hidden"
                tiltAmount={10}
                glareOpacity={0.2}
                borderGlow={index === activeIndex}
                borderColor="rgba(99, 102, 241, 0.8)"
                backgroundEffect="gradient"
                onClick={() =>
                  setActiveIndex(index === activeIndex ? null : index)
                }
              >
                <div className="p-6 h-full flex flex-col">
                  <div className="flex items-center mb-3">
                    <span className="text-2xl mr-2">{tech.icon}</span>
                    <GradientText
                      from={tech.color.split(" ")[0].replace("from-", "")}
                      to={tech.color.split(" ")[1].replace("to-", "")}
                      className="text-xl font-bold"
                    >
                      {tech.name}
                    </GradientText>
                  </div>

                  <RevealText
                    className="text-sm text-gray-300 mb-4"
                    delay={index * 0.1 + 0.2}
                  >
                    {tech.description}
                  </RevealText>

                  <div className="mt-auto">
                    <ShuffleText
                      words={tech.features}
                      shuffleSpeed={60}
                      changeInterval={3000}
                      highlightActive={true}
                      highlightClass="text-indigo-400"
                      prefix="» "
                      className="text-sm font-mono"
                    />
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechSection;
