import { SectionHeading } from "@/components/ambro-ui/section-heading";
import { RevealText } from "@/components/ambro-ui/reveal-text";
import { EnhancedButton } from "@/components/ambro-ui/enhanced-button";
import { GradientText } from "@/components/ambro-ui/gradient-text";
import { AnimatedSection } from "@/components/ambro-ui/animated-section";
import { ClipMask } from "@/components/ambro-ui/clip-mask";
import Image from "next/image";

interface Project {
  title: string;
  description: string;
  technologies: string[];
  image: string;
  color: string;
}

interface ClientProjectsSectionProps {
  projects: Project[];
}

export default function ProjectsSection({
  projects,
}: ClientProjectsSectionProps) {
  return (
    <section id="projects" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection animation="fadeIn">
          <SectionHeading
            title="Wybrane projekty"
            subtitle="Przykłady zrealizowanych wdrożeń"
            alignment="center"
            size="xl"
            gradient
            animation="slide"
          />
        </AnimatedSection>

        <div className="mt-16 space-y-24">
          {projects.map((project, index) => (
            <AnimatedSection
              key={project.title}
              animation={index % 2 === 0 ? "slideLeft" : "slideRight"}
              delay={0.3}
              className="relative"
            >
              <div
                className={`grid md:grid-cols-2 gap-8 relative ${
                  index % 2 === 0 ? "" : "md:flex-row-reverse"
                }`}
              >
                {/* Project Image */}
                <ClipMask
                  mask={index % 2 === 0 ? "hexagon" : "diamond"}
                  width="100%"
                  height="100%"
                  animate
                  expandOnHover
                  shadowSize={20}
                  borderWidth={2}
                  borderColor="white"
                  gradientColors={["#4f46e5", "#7c3aed", "#ec4899"]}
                >
                  <Image
                    src={project.image}
                    alt={project.title}
                    className="object-cover w-full h-full"
                    width={800}
                    height={500}
                  />
                </ClipMask>

                {/* Project Details */}
                <div className="flex flex-col justify-center">
                  <h3 className="text-3xl font-bold mb-4">
                    <GradientText
                      from={project.color.split(" ")[0].replace("from-", "")}
                      to={project.color.split(" ")[1].replace("to-", "")}
                    >
                      {project.title}
                    </GradientText>
                  </h3>

                  <div className="text-gray-300 mb-6">
                    <RevealText delay={0.4}>{project.description}</RevealText>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-sm uppercase text-gray-500 mb-2">
                      Wykorzystane technologie
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 text-xs rounded-full bg-gray-800 text-gray-300 border border-gray-700"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <EnhancedButton
                    variant="tech"
                    size="md"
                    magneticEffect
                    glowOnHover
                    borderGradient
                    href="/projekty"
                  >
                    Zobacz szczegóły
                  </EnhancedButton>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
