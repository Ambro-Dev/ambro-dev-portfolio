// src/app/uslugi/[serviceId]/page.tsx

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { serviceCategories } from "@/data/services";
import ServiceDetailClient from "@/components/services/service-detail-client";
import { Suspense } from "react";
import {
  prepareSerializableService,
  type SerializableService,
} from "@/lib/service-utils";

// Typ props dla Next.js 15
type ServiceDetailPageProps = {
  params: Promise<{ serviceId: string }>;
};

// Generowanie metadanych z obsługą Promise params
export async function generateMetadata({
  params,
}: ServiceDetailPageProps): Promise<Metadata> {
  // Rozwiązanie Promise, aby uzyskać rzeczywiste params
  const { serviceId } = await params;

  // Find the service based on the URL parameter
  const service = serviceCategories.find((s) => s.id === serviceId);

  if (!service) {
    return {
      title: "Usługa nie znaleziona | Ambro",
      description: "Nie mogliśmy znaleźć szukanej usługi.",
    };
  }

  return {
    title: `${service.title} | Usługi IT | Ambro`,
    description: service.description,
    openGraph: {
      title: `${service.title} | Profesjonalne usługi IT`,
      description: service.description,
      images: [
        {
          url: `/images/services/${serviceId}.jpg`,
          width: 1200,
          height: 630,
          alt: service.title,
        },
      ],
      locale: "pl_PL",
      type: "website",
    },
    alternates: {
      canonical: `https://ambro.dev/uslugi/${serviceId}`,
    },
    robots: {
      index: true,
      follow: true,
    },
    twitter: {
      card: "summary_large_image",
      title: service.title,
      description: service.description,
      images: [`/images/services/${serviceId}.jpg`],
    },
    keywords: [
      service.title,
      ...service.tags,
      "usługi IT",
      "DevOps",
      "development",
      "Polska",
    ],
  };
}

// Generate static paths for all service pages
export async function generateStaticParams() {
  return serviceCategories.map((service) => ({
    serviceId: service.id,
  }));
}

// Komponent ładowania
function ServiceDetailLoading() {
  return (
    <div className="min-h-screen bg-gray-900 pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="h-80 w-full bg-gray-800/20 animate-pulse rounded-lg mb-8" />
        <div className="h-12 w-1/3 bg-gray-800/20 animate-pulse rounded-lg mb-4" />
        <div className="h-6 w-1/2 bg-gray-800/20 animate-pulse rounded-lg mb-8" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="space-y-4">
              <div className="h-4 bg-gray-800/20 animate-pulse rounded-lg" />
              <div className="h-4 bg-gray-800/20 animate-pulse rounded-lg" />
              <div className="h-4 bg-gray-800/20 animate-pulse rounded-lg" />
              <div className="h-4 bg-gray-800/20 animate-pulse rounded-lg w-2/3" />
            </div>
          </div>
          <div>
            <div className="h-64 bg-gray-800/20 animate-pulse rounded-lg" />
          </div>
        </div>

        <div className="mt-16">
          <div className="h-8 w-1/4 bg-gray-800/20 animate-pulse rounded-lg mb-6" />
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div
                key={`related-skeleton-${item}`}
                className="h-48 bg-gray-800/20 animate-pulse rounded-lg"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Komponent główny (server component)
export default async function ServiceDetailPage({
  params,
}: ServiceDetailPageProps) {
  // Rozwiązanie Promise, aby uzyskać rzeczywiste params
  const { serviceId } = await params;

  // Find the service in our data
  const service = serviceCategories.find((s) => s.id === serviceId);

  if (!service) {
    notFound();
  }

  const isDevOps = serviceId !== "webapps" && serviceId !== "architecture";
  const relatedServicesRaw = serviceCategories
    .filter((s) => {
      const sIsDevOps = s.id !== "webapps" && s.id !== "architecture";
      return s.id !== serviceId && sIsDevOps === isDevOps;
    })
    .slice(0, 3);

  // Serializacja danych
  const relatedServices = relatedServicesRaw
    .map((s) => prepareSerializableService(s))
    .filter(Boolean) as SerializableService[];

  const serializableService = prepareSerializableService(service);
  if (!serializableService) {
    notFound();
  }

  // Render
  return (
    <Suspense fallback={<ServiceDetailLoading />}>
      <ServiceDetailClient
        service={serializableService}
        relatedServices={relatedServices}
      />
    </Suspense>
  );
}
