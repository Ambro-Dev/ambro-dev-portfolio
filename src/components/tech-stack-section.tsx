"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/ambro-ui/animated-section";
import { SectionHeading } from "@/components/ambro-ui/section-heading";
import { HoverCard } from "@/components/ambro-ui/hover-card";
import { GradientText } from "@/components/ambro-ui/gradient-text";
import { RevealText } from "@/components/ambro-ui/reveal-text";

// Focused list of technologies with DevOps prioritized
const technologies = [
  {
    category: "DevOps & Automation",
    color: "from-indigo-600 to-blue-500",
    description: "Automatyzacja procesów IT i ciągła integracja",
    priority: 1,
    items: [
      {
        name: "Jenkins",
        icon: "jenkins",
        description:
          "Continuous Integration/Continuous Deployment pipeline automation",
        expertise: 95,
      },
      {
        name: "GitHub Actions",
        icon: "github",
        description: "Workflow automation integrated with code repositories",
        expertise: 92,
      },
      {
        name: "Ansible",
        icon: "ansible",
        description: "Infrastructure automation and configuration management",
        expertise: 90,
      },
      {
        name: "GitLab CI/CD",
        icon: "gitlab",
        description: "Integrated CI/CD workflows with code management",
        expertise: 88,
      },
      {
        name: "ArgoCD",
        icon: "argo",
        description: "Declarative GitOps continuous delivery for Kubernetes",
        expertise: 85,
      },
    ],
  },
  {
    category: "Cloud & Infrastructure",
    color: "from-blue-500 to-cyan-400",
    description: "Zarządzanie infrastrukturą chmurową",
    priority: 2,
    items: [
      {
        name: "Kubernetes",
        icon: "kubernetes",
        description: "Container orchestration and cluster management",
        expertise: 94,
      },
      {
        name: "Docker",
        icon: "docker",
        description: "Containerization platform for applications",
        expertise: 96,
      },
      {
        name: "Terraform",
        icon: "terraform",
        description: "Infrastructure as Code for cloud resource provisioning",
        expertise: 93,
      },
      {
        name: "AWS",
        icon: "aws",
        description: "Amazon Web Services cloud platform",
        expertise: 90,
      },
      {
        name: "Azure",
        icon: "azure",
        description: "Microsoft Azure cloud platform",
        expertise: 85,
      },
    ],
  },
  {
    category: "Monitoring & Security",
    color: "from-emerald-500 to-teal-400",
    description: "Monitoring, analiza logów i zabezpieczenia",
    priority: 3,
    items: [
      {
        name: "Prometheus",
        icon: "prometheus",
        description: "Monitoring system and time series database",
        expertise: 92,
      },
      {
        name: "Grafana",
        icon: "grafana",
        description: "Observability platform and visualization",
        expertise: 94,
      },
      {
        name: "ELK Stack",
        icon: "elastic",
        description: "Elasticsearch, Logstash, Kibana for log analysis",
        expertise: 88,
      },
      {
        name: "Vault",
        icon: "vault",
        description: "Secret management and data protection",
        expertise: 85,
      },
    ],
  },
  {
    category: "Databases & Storage",
    color: "from-amber-500 to-orange-400",
    description: "Zarządzanie i optymalizacja baz danych",
    priority: 4,
    items: [
      {
        name: "PostgreSQL",
        icon: "postgresql",
        description: "Advanced SQL database management system",
        expertise: 87,
      },
      {
        name: "Redis",
        icon: "redis",
        description: "In-memory data store and cache",
        expertise: 85,
      },
      {
        name: "MongoDB",
        icon: "mongodb",
        description: "NoSQL document database",
        expertise: 82,
      },
    ],
  },
  {
    category: "Development",
    color: "from-purple-500 to-violet-400",
    description: "Tworzenie aplikacji i usług",
    priority: 5,
    items: [
      {
        name: "Python",
        icon: "python",
        description: "Automation scripts and backend development",
        expertise: 90,
      },
      {
        name: "Node.js",
        icon: "nodejs",
        description: "Server-side JavaScript runtime",
        expertise: 85,
      },
      {
        name: "TypeScript",
        icon: "typescript",
        description: "Typed JavaScript for application development",
        expertise: 88,
      },
      {
        name: "Go",
        icon: "go",
        description: "Efficient language for cloud-native tools",
        expertise: 80,
      },
    ],
  },
];

export const TechStackSection = () => {
  // Default to showing DevOps category
  const [activeCategory, setActiveCategory] = useState("DevOps & Automation");

  // Get the selected category data
  const selectedCategory =
    technologies.find((cat) => cat.category === activeCategory) ||
    technologies[0];

  // Sort categories by priority
  const sortedTechnologies = [...technologies].sort(
    (a, b) => a.priority - b.priority
  );

  return (
    <section className="py-20 px-4 bg-gray-900/40 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 z-0 opacity-5">
        <div className="h-full w-full bg-grid-pattern" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <AnimatedSection animation="fadeIn">
          <SectionHeading
            title="Stack Technologiczny"
            subtitle="Specjalizacja w narzędziach DevOps i automatyzacji infrastruktury"
            alignment="center"
            size="lg"
            gradient
            animation="fade"
          />
        </AnimatedSection>

        {/* Main content with sidebar layout */}
        <div className="mt-12 flex flex-col lg:flex-row gap-8">
          {/* Category navigation sidebar */}
          <div className="lg:w-64 shrink-0">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 sticky top-24">
              <h3 className="text-lg font-medium mb-4 text-gray-200">
                Kategorie
              </h3>
              <div className="space-y-2">
                {sortedTechnologies.map((category) => (
                  <button
                    key={category.category}
                    type="button"
                    onClick={() => setActiveCategory(category.category)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 text-sm font-medium ${
                      activeCategory === category.category
                        ? "bg-indigo-600/80 text-white"
                        : "bg-gray-800/30 text-gray-300 hover:bg-gray-700/50"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full bg-gradient-to-r ${category.color}`}
                    />
                    {category.category}
                  </button>
                ))}
              </div>

              {/* Expertise summary */}
              <div className="mt-8 pt-6 border-t border-gray-700/50">
                <h4 className="text-sm font-medium text-gray-300 mb-3">
                  Kluczowe umiejętności
                </h4>

                <div className="space-y-4">
                  {sortedTechnologies.slice(0, 3).map((category) => (
                    <div
                      key={`skill-${category.category}`}
                      className="space-y-1"
                    >
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">
                          {category.category}
                        </span>
                        <span className="text-indigo-400">
                          {Math.round(
                            category.items.reduce(
                              (acc, item) => acc + item.expertise,
                              0
                            ) / category.items.length
                          )}
                          %
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-700/50 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full bg-gradient-to-r ${category.color} rounded-full`}
                          initial={{ width: 0 }}
                          animate={{
                            width: `${Math.round(
                              category.items.reduce(
                                (acc, item) => acc + item.expertise,
                                0
                              ) / category.items.length
                            )}%`,
                          }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main content area */}
          <div className="flex-1">
            <AnimatedSection animation="fadeIn" delay={0.1}>
              {/* Category header */}
              <div className="mb-8">
                <RevealText
                  className="text-2xl font-bold"
                  delay={0.1}
                  highlight
                  highlightColor={`${selectedCategory.color
                    .split(" ")[0]
                    .replace("from-", "bg-")}/10`}
                >
                  <GradientText
                    from={selectedCategory.color
                      .split(" ")[0]
                      .replace("from-", "")}
                    to={selectedCategory.color.split(" ")[1].replace("to-", "")}
                    animated={false}
                  >
                    {selectedCategory.category}
                  </GradientText>
                </RevealText>
                <p className="text-gray-400 mt-2">
                  {selectedCategory.description}
                </p>
              </div>

              {/* Technologies grid */}
              <div className="grid md:grid-cols-2 gap-4">
                {selectedCategory.items.map((tech, index) => (
                  <AnimatedSection
                    key={tech.name}
                    animation="fadeIn"
                    delay={0.05 * index}
                    className="h-full"
                  >
                    <HoverCard
                      hoverContent={
                        <div className="w-72">
                          <h4 className="text-lg font-semibold mb-2">
                            {tech.name}
                          </h4>
                          <p className="text-sm text-gray-300 mb-4">
                            {tech.description}
                          </p>
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>Poziom biegłości</span>
                              <span className="text-indigo-300 font-medium">
                                {tech.expertise}%
                              </span>
                            </div>
                            <div className="h-1.5 w-full bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className={`h-full bg-gradient-to-r ${selectedCategory.color} rounded-full`}
                                style={{ width: `${tech.expertise}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      }
                      position="top"
                      animation="scale"
                      backdropBlur
                      glassmorphism
                      className="h-full"
                    >
                      <div className="p-5 bg-gray-800/40 hover:bg-gray-800/60 border border-gray-700/50 rounded-xl transition-all h-full">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-12 h-12 flex items-center justify-center rounded-lg
                              bg-gradient-to-br ${selectedCategory.color} p-2 shadow-lg shrink-0`}
                          >
                            <TechIcon name={tech.icon} />
                          </div>

                          <div>
                            <h4 className="text-lg font-medium">{tech.name}</h4>
                            <div className="flex items-center mt-1 gap-1.5">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <div
                                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                                    key={i}
                                    className={`w-1.5 h-4 rounded-sm mx-0.5 ${
                                      i < Math.floor(tech.expertise / 20)
                                        ? `bg-gradient-to-r ${selectedCategory.color}`
                                        : "bg-gray-700/50"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-gray-400 ml-1">
                                {tech.expertise}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </HoverCard>
                  </AnimatedSection>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>

      {/* Grid pattern CSS */}
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
      `}</style>
    </section>
  );
};

// Simple tech icon component
const TechIcon = ({ name }: { name: string }) => {
  return (
    <svg
      className="w-full h-full text-white"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{name}</title>
      <path
        d="M12 2L2 7L12 12L22 7L12 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 17L12 22L22 17"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 12L12 17L22 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default TechStackSection;
