// src/app/uslugi/page.tsx
import type { Metadata } from "next";
import { serviceCategories } from "@/data/services";
import ServicesPageClient from "@/components/services/services-page-client";
import { Suspense } from "react";
import {
  prepareSerializableService,
  type SerializableService,
} from "@/lib/service-utils";

export const metadata: Metadata = {
  title: "Usługi IT i DevOps | Nowoczesne rozwiązania technologiczne",
  description:
    "Kompleksowe usługi technologiczne - od konfiguracji i zarządzania infrastrukturą chmurową, automatyzację procesów IT, po tworzenie aplikacji webowych.",
  openGraph: {
    title: "Usługi IT i DevOps | Ambro",
    description:
      "Kompleksowe usługi technologiczne dopasowane do potrzeb Twojego biznesu - DevOps, infrastruktura, automatyzacja, aplikacje webowe.",
    images: [
      {
        url: "/images/services/og-services.jpg",
        width: 1200,
        height: 630,
        alt: "Usługi IT i DevOps",
      },
    ],
    type: "website",
  },
  alternates: {
    canonical: "https://ambro.dev/uslugi",
  },
  keywords: [
    "DevOps",
    "usługi IT",
    "automatyzacja",
    "infrastruktura chmurowa",
    "aplikacje webowe",
    "fullstack development",
    "CI/CD",
    "Terraform",
    "Kubernetes",
    "Next.js",
  ],
};

export default function ServicesPage() {
  // Kategoryzuj usługi (przygotowanie danych na serwerze)
  const devopsServicesRaw = serviceCategories.filter(
    (service) => service.id !== "webapps" && service.id !== "architecture"
  );

  const fullstackServicesRaw = serviceCategories.filter(
    (service) => service.id === "webapps" || service.id === "architecture"
  );

  // Przetwórz dane do formatu serializowalnego
  const devopsServices = devopsServicesRaw
    .map(prepareSerializableService)
    .filter(Boolean) as SerializableService[];

  const fullstackServices = fullstackServicesRaw
    .map(prepareSerializableService)
    .filter(Boolean) as SerializableService[];

  // Render klienta z przygotowanymi danymi
  return (
    <Suspense fallback={<ServicesPageLoading />}>
      <ServicesPageClient
        devopsServices={devopsServices}
        fullstackServices={fullstackServices}
      />
    </Suspense>
  );
}

function ServicesPageLoading() {
  return (
    <div className="min-h-screen bg-black pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="h-12 w-2/3 mx-auto bg-gray-800/20 animate-pulse rounded-lg mb-4" />
        <div className="h-6 w-1/2 mx-auto bg-gray-800/20 animate-pulse rounded-lg mb-12" />

        <div className="h-8 w-1/3 bg-gray-800/20 animate-pulse rounded-lg mb-6" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <div
              key={`skeleton-${item}`}
              className="h-64 bg-gray-800/20 rounded-lg animate-pulse"
            />
          ))}
        </div>

        <div className="h-2 w-full bg-gray-800/20 animate-pulse rounded-lg my-16" />

        <div className="h-8 w-1/3 bg-gray-800/20 animate-pulse rounded-lg mb-6" />
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2].map((item) => (
            <div
              key={`skeleton-${item}`}
              className="h-64 bg-gray-800/20 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
