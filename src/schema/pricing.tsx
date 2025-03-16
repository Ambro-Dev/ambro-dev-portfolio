"use client";

import { pricingPlans, customPricingServices, pricingFAQ } from "@/lib/pricing";

// Schema.org JSON-LD dla strony cennikowej
export function PricingOfferSchemaJsonLd() {
  // Konwersja pakietów cenowych do struktury Schema.org Offer
  const offers = pricingPlans.map((plan) => ({
    "@type": "Offer",
    name: plan.name,
    description: plan.description,
    price: plan.price.replace("od ", "").replace(" zł", ""),
    priceCurrency: "PLN",
    priceSpecification: {
      "@type": "PriceSpecification",
      price: plan.price.replace("od ", "").replace(" zł", ""),
      priceCurrency: "PLN",
      billingIncrement: 1,
      unitText: "month",
    },
    itemOffered: {
      "@type": "Service",
      name: plan.name,
      description: plan.description,
      offers: {
        "@type": "Offer",
        price: plan.price.replace("od ", "").replace(" zł", ""),
        priceCurrency: "PLN",
      },
    },
  }));

  // Konwersja indywidualnych usług do struktury Schema.org Service
  const services = customPricingServices.map((service) => ({
    "@type": "Service",
    name: service.name,
    description: service.description,
    offers: {
      "@type": "Offer",
      priceSpecification: {
        "@type": "PriceSpecification",
        price: service.estimatedRange,
        priceCurrency: "PLN",
      },
    },
  }));

  const pricingSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Cennik Usług | DevOS",
    description:
      "Zapoznaj się z przejrzystym cennikiem usług DevOS. Oferujemy elastyczne pakiety abonamentowe oraz indywidualne wyceny projektów webowych.",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: [
        ...offers.map((offer, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: offer,
        })),
        ...services.map((service, index) => ({
          "@type": "ListItem",
          position: index + offers.length + 1,
          item: service,
        })),
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
      dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingSchema) }}
    />
  );
}

// Schema.org JSON-LD dla FAQ
export function FAQSchemaJsonLd() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: pricingFAQ.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}

// Łączony komponent dla wszystkich JSON-LD
export default function PricingSchemaJsonLd() {
  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Strona główna",
                item: "https://devos.pl",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Cennik",
                item: "https://devos.pl/cennik",
              },
            ],
          }),
        }}
      />
      <PricingSchemaJsonLd />
      <FAQSchemaJsonLd />
    </>
  );
}
