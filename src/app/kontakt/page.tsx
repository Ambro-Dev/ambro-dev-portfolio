// src/app/kontakt/page.tsx
import ContactPageContent from "@/components/contact/contact-page-content";
import ContactSchemaJsonLd from "@/lib/contact";
import type { Metadata } from "next";
import { Suspense } from "react";

// Metadane dla strony (SEO)
export const metadata: Metadata = {
  title: "Kontakt | DevOS - Profesjonalne rozwiązania webowe",
  description:
    "Skontaktuj się z DevOS, aby omówić Twój projekt. Oferujemy profesjonalne usługi webowe, aplikacje i rozwiązania dla biznesu.",
  alternates: {
    canonical: "https://devos.pl/kontakt",
  },
  openGraph: {
    title: "Kontakt | DevOS - Profesjonalne rozwiązania webowe",
    description: "Skontaktuj się z nami, aby omówić Twój projekt webowy",
    url: "https://devos.pl/kontakt",
    siteName: "DevOS",
    locale: "pl_PL",
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <>
      {/* Structured data dla Google */}
      <ContactSchemaJsonLd />

      {/* Główna zawartość strony w Suspense dla lepszego loadingu */}
      <Suspense fallback={<ContactPageLoading />}>
        <ContactPageContent />
      </Suspense>
    </>
  );
}

// Komponent placeholdera podczas ładowania
function ContactPageLoading() {
  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="max-w-6xl mx-auto py-24 px-6">
        <div className="animate-pulse space-y-8">
          <div className="h-12 bg-gray-800 rounded w-48 mx-auto" />
          <div className="h-6 bg-gray-800 rounded max-w-2xl mx-auto" />
          <div className="grid md:grid-cols-5 gap-8">
            <div className="md:col-span-2 h-96 bg-gray-900/50 rounded-xl" />
            <div className="md:col-span-3 h-96 bg-gray-900/50 rounded-xl" />
          </div>
        </div>
      </div>
    </main>
  );
}
