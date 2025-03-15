import ServicesSection from "@/components/services-section";
import InfrastructureConcept from "@/components/interactive-infrastructure";
import TechStackSection from "@/components/tech-stack-section";
import HeroSection from "@/components/hero-section";
import AboutMeSection from "@/components/about-section";
import ProjectsSection from "@/components/projects-section";
import TestimonialsSection from "@/components/testimonials-section";
import CTASection from "@/components/cta-section";
import { SmoothScroll } from "@/components/ambro-ui/smooth-scroll";

export default function Home() {
  const projects = [
    {
      title: "Platforma monitoringu",
      description:
        "Kompleksowy system monitoringu infrastruktury IT z alertami w czasie rzeczywistym, analizą wydajności i dashboardami dla różnych zespołów.",
      technologies: ["Zabbix", "Grafana", "Prometheus", "Docker", "Ansible"],
      image: "/api/placeholder/800/500",
      color: "from-cyan-500 to-blue-600",
    },
    {
      title: "Migracja do chmury",
      description:
        "Kompleksowa migracja infrastruktury on-premise do środowiska AWS z zachowaniem ciągłości działania i optymalizacją kosztów.",
      technologies: ["AWS", "Terraform", "CloudFormation", "Docker", "CI/CD"],
      image: "/api/placeholder/800/500",
      color: "from-indigo-500 to-purple-600",
    },
    {
      title: "System zarządzania zasobami",
      description:
        "Aplikacja webowa do zarządzania zasobami IT firmy, integrująca informacje o sprzęcie, oprogramowaniu i licencjach.",
      technologies: ["React", "Node.js", "MongoDB", "TypeScript", "WebSocket"],
      image: "/api/placeholder/800/500",
      color: "from-violet-500 to-pink-600",
    },
  ];

  const testimonials = [
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
  ];

  return (
    <main className="min-h-screen text-white relative overflow-hidden md:pt-0 pt-28">
      {/* Smooth Scroll */}
      <SmoothScroll>
        {/* Hero Section */}
        <HeroSection />
        {/* About Section */}
        <AboutMeSection />
        {/* Services Section */}
        <ServicesSection />
        {/* Infrastructure Concept Section */}
        <InfrastructureConcept />
        {/* Projects Section */}
        <ProjectsSection projects={projects} />
        {/* Tech Stack Section */}
        <TechStackSection />
        {/* Testimonials */}
        <TestimonialsSection testimonials={testimonials} />
        {/* CTA Section */}
        <CTASection />
      </SmoothScroll>
    </main>
  );
}
