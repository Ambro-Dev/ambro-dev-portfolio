import Script from "next/script";
import {
  Server,
  Shield,
  Cloud,
  Code,
  BarChart,
  User,
  FormInput,
} from "lucide-react";

// Import custom UI components
import {
  SmoothScroll,
  ScrollProgress,
  SectionDivider,
} from "@/components/EnhancedUI";

// Import existing components

// Load metadata from resources
import { baseURL, home, person } from "./resources";
import HeroSection from "@/components/layout/hero-section";
import ServicesSection from "@/components/layout/services-section";
import InfrastructureSection from "@/components/layout/infrastructure-section";
import ArchitectureSection from "@/components/layout/architecture-section";
import SkillsSection from "@/components/layout/skills-section";
import ProjectsSection from "@/components/layout/projects-section";
import TimelineSection from "@/components/layout/timeline-section";
import ContactSection from "@/components/layout/contact-section";
import Footer from "@/components/layout/footer";
import { FloatingNav } from "@/components/FloatingNav";
import StatisticsSection from "@/components/skills/StatisticsSection";

// Navigation items for the floating nav
const navItems = [
  { label: "Start", href: "#top", icon: <User size={16} /> },
  { label: "Usługi", href: "#services", icon: <Server size={16} /> },
  {
    label: "Infrastruktura",
    href: "#infrastructure",
    icon: <Cloud size={16} />,
  },
  { label: "Architektura", href: "#architecture", icon: <Shield size={16} /> },
  { label: "Umiejętności", href: "#skills", icon: <Code size={16} /> },
  { label: "Projekty", href: "#projects", icon: <BarChart size={16} /> },
  { label: "Kontakt", href: "#contact", icon: <FormInput size={16} /> },
];

// Metadata generation function
export async function generateMetadata() {
  const title = home.title;
  const description = home.description;
  const ogImage = `https://${baseURL}/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://${baseURL}`,
      images: [{ url: ogImage, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

// Main component
export default function EnhancedPortfolioPage() {
  return (
    <SmoothScroll>
      {/* Scroll progress indicator */}
      <ScrollProgress />

      {/* Structured data for SEO */}
      <Script
        id="schema-structured-data"
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: home.title,
          description: home.description,
          url: `https://${baseURL}`,
          image: `${baseURL}/og?title=${encodeURIComponent(home.title)}`,
          publisher: {
            "@type": "Person",
            name: person.name,
            image: {
              "@type": "ImageObject",
              url: `${baseURL}${person.avatar}`,
            },
          },
        })}
      </Script>

      {/* Floating navigation */}
      <FloatingNav items={navItems} />

      {/* Main content */}
      <div className="relative" id="top">
        {/* Hero section */}
        <HeroSection />

        {/* Services section */}
        <ServicesSection />

        <SectionDivider />

        {/* Infrastructure section */}
        <InfrastructureSection />

        <SectionDivider />

        {/* Architecture section */}
        <ArchitectureSection />

        <SectionDivider />

        {/* Skills section */}
        <SkillsSection />

        <SectionDivider />

        {/* Projects section */}
        <ProjectsSection />

        <SectionDivider />

        <StatisticsSection />

        <SectionDivider />

        {/* Timeline section */}
        <TimelineSection />

        {/* Contact section with animated background */}
        <ContactSection />

        {/* Footer */}
        <Footer />
      </div>
    </SmoothScroll>
  );
}
