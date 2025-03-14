// src/app/page.tsx
"use client";

import { useRef } from "react";
import { SmoothScroll } from "@/components/ambro-ui/smooth-scroll";
import { FloatingBubbles } from "@/components/ambro-ui/floating-bubbles";
import { ScrollProgress } from "@/components/ambro-ui/scroll-progress";
import { SectionHeading } from "@/components/ambro-ui/section-heading";
import { RevealText } from "@/components/ambro-ui/reveal-text";
import { Card3D } from "@/components/ambro-ui/card-3d";
import { EnhancedButton } from "@/components/ambro-ui/enhanced-button";
import { GradientText } from "@/components/ambro-ui/gradient-text";
import { AnimatedSection } from "@/components/ambro-ui/animated-section";
import { AnimatedGradientBorder } from "@/components/ambro-ui/animated-gradient-border";
import { ClipMask } from "@/components/ambro-ui/clip-mask";
import ServicesSection from "@/components/services-section";
import InfrastructureConcept from "@/components/interactive-infrastructure";
import TechStackSection from "@/components/tech-stack-section";
import Image from "next/image";
import HeroSection from "@/components/hero-section";

export default function Home() {
  const projectsRef = useRef<HTMLDivElement>(null);
  const infraRef = useRef<HTMLDivElement>(null);

  const scrollToProjects = () => {
    projectsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToInfra = () => {
    infraRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Effect */}
      <FloatingBubbles
        count={30}
        fixed
        color="rgba(99, 102, 241, 0.2)"
        maxSize={120}
        minSize={20}
        interactive
      />

      {/* Scroll Progress Indicator */}
      <ScrollProgress
        position="top"
        color="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
      />

      {/* Smooth Scroll */}
      <SmoothScroll>
        {/* Hero Section */}
        <HeroSection
          scrollToProjects={scrollToProjects}
          scrollToInfra={scrollToInfra}
        />
        {/* About Section */}
        <section className="py-24 px-6 relative">
          <div className="max-w-6xl mx-auto">
            <AnimatedSection animation="slideUp">
              <SectionHeading
                title="O mnie"
                subtitle="DevOps Engineer & Fullstack Developer"
                alignment="center"
                size="xl"
                gradient
                highlightWords={[2]}
                animation="fade"
                delay={0.2}
              />
            </AnimatedSection>

            <div className="grid md:grid-cols-2 gap-12 mt-16">
              <AnimatedSection animation="slideLeft" delay={0.3}>
                <Card3D
                  interactive
                  interactiveStrength={10}
                  glowEffect
                  glowColor="rgba(99, 102, 241, 0.5)"
                  shadow
                  bgColor="bg-gray-900/80"
                  borderColor="border-indigo-500/20"
                  height="100%"
                >
                  <div className="p-8">
                    <h3 className="text-2xl font-bold mb-4">Moja wizja</h3>
                    <div className="text-gray-300 mb-4">
                      <RevealText staggerLines>
                        <span>
                          Tworzenie rozwiązań technologicznych, które łączą
                        </span>
                        <span>
                          niezawodną infrastrukturę z nowoczesnymi aplikacjami,
                        </span>
                        <span>
                          umożliwiając firmom szybszy rozwój i innowacje.
                        </span>
                      </RevealText>
                    </div>
                    <p className="text-gray-400">
                      Posiadam wieloletnie doświadczenie zarówno w obszarze
                      DevOps, jak i tworzenia aplikacji webowych, co pozwala mi
                      oferować kompleksowe rozwiązania technologiczne
                      dostosowane do indywidualnych potrzeb biznesowych.
                    </p>
                  </div>
                </Card3D>
              </AnimatedSection>

              <AnimatedSection animation="slideRight" delay={0.4}>
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold">
                    Dlaczego warto mnie wybrać
                  </h3>

                  <div className="space-y-4">
                    {[
                      {
                        title: "Kompleksowa wiedza",
                        desc: "Łączę kompetencje w obszarze DevOps i programowania Fullstack, co pozwala na holistyczne podejście do projektów.",
                      },
                      {
                        title: "Doświadczenie praktyczne",
                        desc: "Posiadam wieloletnie doświadczenie w zarządzaniu serwerami, automatyzacji procesów IT oraz tworzeniu aplikacji webowych.",
                      },
                      {
                        title: "Podejście zorientowane na cel",
                        desc: "Koncentruję się na dostarczaniu rozwiązań, które realnie wspierają cele biznesowe i przynoszą wymierną wartość.",
                      },
                      {
                        title: "Ciągły rozwój",
                        desc: "Nieustannie poszerzam swoją wiedzę o najnowsze technologie i najlepsze praktyki w branży IT.",
                      },
                    ].map((item, index) => (
                      <AnimatedGradientBorder
                        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                        key={index}
                        borderWidth={2}
                        borderColor="from-indigo-500 via-purple-500 to-pink-500"
                        glowEffect
                        glowIntensity={5}
                        animated
                        backgroundColor="bg-gray-900/80"
                      >
                        <div className="p-4">
                          <h4 className="font-bold mb-2">{item.title}</h4>
                          <p className="text-gray-400 text-sm">{item.desc}</p>
                        </div>
                      </AnimatedGradientBorder>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>
        {/* Services Section */}
        <ServicesSection />
        {/* Infrastructure Concept Section */}
        <InfrastructureConcept />
        {/* Projects Section */}
        <section ref={projectsRef} id="projects" className="py-24 px-6">
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
              {[
                {
                  title: "Platforma monitoringu",
                  description:
                    "Kompleksowy system monitoringu infrastruktury IT z alertami w czasie rzeczywistym, analizą wydajności i dashboardami dla różnych zespołów.",
                  technologies: [
                    "Zabbix",
                    "Grafana",
                    "Prometheus",
                    "Docker",
                    "Ansible",
                  ],
                  image: "/api/placeholder/800/500",
                  color: "from-cyan-500 to-blue-600",
                },
                {
                  title: "Migracja do chmury",
                  description:
                    "Kompleksowa migracja infrastruktury on-premise do środowiska AWS z zachowaniem ciągłości działania i optymalizacją kosztów.",
                  technologies: [
                    "AWS",
                    "Terraform",
                    "CloudFormation",
                    "Docker",
                    "CI/CD",
                  ],
                  image: "/api/placeholder/800/500",
                  color: "from-indigo-500 to-purple-600",
                },
                {
                  title: "System zarządzania zasobami",
                  description:
                    "Aplikacja webowa do zarządzania zasobami IT firmy, integrująca informacje o sprzęcie, oprogramowaniu i licencjach.",
                  technologies: [
                    "React",
                    "Node.js",
                    "MongoDB",
                    "TypeScript",
                    "WebSocket",
                  ],
                  image: "/api/placeholder/800/500",
                  color: "from-violet-500 to-pink-600",
                },
              ].map((project, index) => (
                <AnimatedSection
                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                  key={index}
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
                          from={project.color
                            .split(" ")[0]
                            .replace("from-", "")}
                          to={project.color.split(" ")[1].replace("to-", "")}
                        >
                          {project.title}
                        </GradientText>
                      </h3>

                      <p className="text-gray-300 mb-6">
                        <RevealText delay={0.4}>
                          {project.description}
                        </RevealText>
                      </p>

                      <div className="mb-6">
                        <h4 className="text-sm uppercase text-gray-500 mb-2">
                          Wykorzystane technologie
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech, techIndex) => (
                            <span
                              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                              key={techIndex}
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
        {/* Tech Stack Section */}
        <TechStackSection />
        {/* Testimonials */}
        <section className="py-24 px-6 bg-gradient-to-b from-gray-900 to-black">
          <div className="max-w-6xl mx-auto">
            <AnimatedSection animation="fadeIn">
              <SectionHeading
                title="Opinie klientów"
                subtitle="Co moi klienci mówią o współpracy ze mną"
                alignment="center"
                size="xl"
                gradient
                animation="fade"
              />
            </AnimatedSection>

            <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  quote:
                    "Ambro-Dev przeprowadził migrację naszej infrastruktury do chmury AWS, znacząco poprawiając wydajność i zmniejszając koszty operacyjne.",
                  author: "Tomasz Nowicki",
                  position: "CTO, TechFirma Polska",
                  image: "/api/placeholder/100/100",
                },
                {
                  quote:
                    "Wdrożenie systemu monitoringu i alertowania pozwoliło nam wykryć i rozwiązać problemy zanim wpłynęły na nasz biznes. Profesjonalizm i wiedza na najwyższym poziomie.",
                  author: "Anna Kowalska",
                  position: "IT Manager, E-commerce Plus",
                  image: "/api/placeholder/100/100",
                },
                {
                  quote:
                    "Ambro-Dev nie tylko zrealizował projekt aplikacji webowej, ale także zoptymalizował naszą infrastrukturę, co przełożyło się na znacznie lepsze doświadczenia użytkowników.",
                  author: "Marcin Zawadzki",
                  position: "CEO, StartupTech",
                  image: "/api/placeholder/100/100",
                },
                {
                  quote:
                    "Automatyzacja procesów IT, którą dla nas wdrożył, pozwoliła zaoszczędzić dziesiątki godzin pracy zespołu technicznego miesięcznie. Doskonała inwestycja.",
                  author: "Karolina Jankowska",
                  position: "COO, Digital Solutions",
                  image: "/api/placeholder/100/100",
                },
                {
                  quote:
                    "Profesjonalne podejście, terminowość i doskonała komunikacja. Ambro-Dev rozumie nie tylko technologię, ale także nasze potrzeby biznesowe.",
                  author: "Piotr Adamski",
                  position: "Founder, EdTech Platform",
                  image: "/api/placeholder/100/100",
                },
                {
                  quote:
                    "Wdrożenie CI/CD i containeryzacja naszych aplikacji znacząco przyspieszyły nasz proces rozwoju oprogramowania. Mogę z czystym sumieniem polecić te usługi.",
                  author: "Magdalena Wiśniewska",
                  position: "VP Engineering, SoftwareLab",
                  image: "/api/placeholder/100/100",
                },
              ].map((testimonial, index) => (
                <AnimatedSection
                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                  key={index}
                  animation="fadeIn"
                  delay={0.1 * index}
                >
                  <AnimatedGradientBorder
                    borderWidth={1}
                    borderColor="from-indigo-500 via-purple-500 to-pink-500"
                    glowEffect
                    glowIntensity={5}
                    animated
                    backgroundColor="bg-gray-900/30"
                    hoverEffect
                  >
                    <div className="p-6">
                      <div className="mb-4">
                        {/* Quote marks */}
                        <svg
                          className="w-8 h-8 text-indigo-400/50"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <title>Quote</title>
                          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                        </svg>
                      </div>

                      <p className="text-gray-300 mb-6 italic">
                        {testimonial.quote}
                      </p>

                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                          <Image
                            src={testimonial.image}
                            alt={testimonial.author}
                            className="w-full h-full object-cover"
                            width={
                              typeof testimonial.image === "string" ? 100 : 100
                            }
                            height={
                              typeof testimonial.image === "string" ? 100 : 100
                            }
                          />
                        </div>
                        <div>
                          <p className="font-medium">{testimonial.author}</p>
                          <p className="text-sm text-gray-400">
                            {testimonial.position}
                          </p>
                        </div>
                      </div>
                    </div>
                  </AnimatedGradientBorder>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
        {/* CTA Section */}
        <section className="py-32 px-6 relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <FloatingBubbles
              count={20}
              color="rgba(99, 102, 241, 0.2)"
              maxSize={150}
              minSize={30}
              interactive={false}
            />
          </div>

          <div className="max-w-4xl mx-auto relative z-10">
            <AnimatedSection animation="fadeIn">
              <div className="text-center">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  <GradientText
                    from="indigo-500"
                    via="purple-500"
                    to="pink-500"
                    glowEffect
                  >
                    Gotowy na transformację technologiczną?
                  </GradientText>
                </h2>

                <div className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                  <RevealText>
                    Skontaktuj się ze mną, aby omówić, jak mogę pomóc w rozwoju
                    Twojego biznesu poprzez nowoczesne rozwiązania DevOps i
                    aplikacje webowe.
                  </RevealText>
                </div>

                <EnhancedButton
                  variant="tech"
                  size="xl"
                  href="/kontakt"
                  magneticEffect
                  glowOnHover
                  rippleEffect
                  animatedBg
                >
                  Rozpocznij projekt
                </EnhancedButton>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </SmoothScroll>
    </main>
  );
}
