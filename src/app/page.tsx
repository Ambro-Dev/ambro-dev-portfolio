import { Suspense } from "react";
import type { Metadata } from "next";
import Script from "next/script";
import HeroSection from "@/components/layout/hero-section";
import AboutMeSection from "@/components/layout/about-section";
import ServicesSection from "@/components/layout/services-section";
import { getProjects, getTestimonials } from "@/lib/data"; // Funkcje do pobrania danych

// Częściowo wyrenderowane komponenty (Partial Prerendering - nowe w Next.js 15)
import { unstable_noStore as noStore } from "next/cache";
import ProjectsSection from "@/components/layout/projects-section";
import TestimonialsSection from "@/components/layout/testimonials-section";
import CTASection from "@/components/layout/cta-section";
import { SmoothScroll } from "@/components/ambro-ui/smooth-scroll";
import InfrastructureConcept from "@/components/layout/interactive-infrastructure";
import TechStackSection from "@/components/layout/tech-stack-section";

// Komponent zastępczy dla dynamicznie ładowanych sekcji
function DynamicSectionSkeleton({ title }: { title: string }) {
  return (
    <div className="w-full py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-gray-800/50 rounded-lg h-64 animate-pulse"
              aria-hidden="true"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Dodatkowe metadane dla strony głównej
export const metadata: Metadata = {
  title: "Ambro-Dev - DevOps, Automatyzacja, Aplikacje Webowe",
  description:
    "Kompleksowe usługi DevOps, automatyzacja procesów IT, administracja serwerami, tworzenie aplikacji webowych i optymalizacja infrastruktury.",
  keywords:
    "DevOps, automatyzacja, aplikacje webowe, chmura, AWS, infrastruktura IT, monitoring, CI/CD",
};

// Asynchroniczna funkcja do pobrania projektów (Server Component)
async function ProjectsData() {
  // Wykorzystanie noStore() do wyłączenia cache dla tej części (Partial Prerendering)
  noStore();

  // Pobierz projekty (symulacja opóźnienia dla demonstracji PPR)
  const projects = await getProjects();

  return (
    <Suspense fallback={<DynamicSectionSkeleton title="Nasze projekty" />}>
      <ProjectsSection projects={projects} />
    </Suspense>
  );
}

// Asynchroniczna funkcja do pobrania opinii (Server Component)
async function TestimonialsData() {
  // Wykorzystanie noStore() do wyłączenia cache dla tej części (Partial Prerendering)
  noStore();

  // Pobierz opinie (symulacja opóźnienia dla demonstracji PPR)
  const testimonials = await getTestimonials();

  return (
    <Suspense fallback={<DynamicSectionSkeleton title="Opinie klientów" />}>
      <TestimonialsSection testimonials={testimonials} />
    </Suspense>
  );
}

export default function Home() {
  return (
    <>
      {/* JSON-LD dla strony głównej */}
      <Script
        id="structured-data-home"
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Ambro-Dev - DevOps, Automatyzacja, Aplikacje Webowe",
            description:
              "Kompleksowe usługi DevOps, automatyzacja procesów IT, administracja serwerami, tworzenie aplikacji webowych i optymalizacja infrastruktury.",
            mainEntity: {
              "@type": "ProfessionalService",
              name: "Ambro-Dev",
              description:
                "Kompleksowe usługi DevOps, automatyzacja procesów IT, administracja serwerami, tworzenie aplikacji webowych i optymalizacja infrastruktury.",
              image: "/logo.webp",
              telephone: "+48123456789",
              email: "kontakt@ambro-dev.pl",
              address: {
                "@type": "PostalAddress",
                addressCountry: "PL",
              },
              priceRange: "$$",
              openingHours: "Mo-Fr 09:00-17:00",
              serviceType: [
                "DevOps",
                "Cloud Migration",
                "Web Development",
                "IT Automation",
              ],
            },
          }),
        }}
      />

      <main className="min-h-screen text-white relative overflow-hidden md:pt-0 pt-28">
        {/* Smooth Scroll */}
        <SmoothScroll>
          {/* Prerendered Sections (szybkie ładowanie) */}
          <HeroSection />
          <AboutMeSection />
          <ServicesSection />

          {/* Partial Prerendering (ładowane dynamicznie) */}
          <Suspense
            fallback={<DynamicSectionSkeleton title="Infrastruktura" />}
          >
            <InfrastructureConcept />
          </Suspense>

          {/* Server Components z asynchronicznym pobieraniem danych */}
          <ProjectsData />

          <Suspense fallback={<DynamicSectionSkeleton title="Technologie" />}>
            <TechStackSection />
          </Suspense>

          <TestimonialsData />

          <Suspense
            fallback={
              <div className="h-48 bg-gradient-to-r from-indigo-500 to-purple-600" />
            }
          >
            <CTASection />
          </Suspense>
        </SmoothScroll>
      </main>
    </>
  );
}
