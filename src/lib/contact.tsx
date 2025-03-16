"use client";

import Script from "next/script";

// Schema.org JSON-LD dla strony kontaktowej
export function ContactSchemaJsonLd() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Kontakt | DevOS",
    description:
      "Skontaktuj się z DevOS, aby omówić Twój projekt. Oferujemy profesjonalne usługi webowe, aplikacje i rozwiązania dla biznesu.",
    mainEntity: {
      "@type": "Organization",
      name: "DevOS",
      url: "https://devos.pl",
      logo: "https://devos.pl/logo.png",
      email: "kontakt@devos.pl",
      telephone: "+48123456789",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Warszawa",
        addressRegion: "Mazowieckie",
        addressCountry: "PL",
      },
      openingHours: "Mo,Tu,We,Th,Fr 09:00-17:00",
      sameAs: [
        "https://github.com/devos",
        "https://twitter.com/devos",
        "https://linkedin.com/company/devos",
        "https://instagram.com/devos",
      ],
    },
  };

  return (
    <Script
      id="contact-jsonld"
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}

// Schema.org JSON-LD dla FAQ
export function FAQSchemaJsonLd() {
  const faqItems = [
    {
      pytanie: "Jaki jest typowy czas realizacji projektu?",
      odpowiedz:
        "Czas realizacji zależy od złożoności projektu. Małe projekty mogą trwać od 2 do 4 tygodni, podczas gdy większe, bardziej złożone projekty mogą wymagać 3-6 miesięcy. Na początku współpracy zawsze ustalam realistyczny harmonogram z uwzględnieniem Twoich potrzeb biznesowych.",
    },
    // ... other FAQ items
  ];

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.pytanie,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.odpowiedz,
      },
    })),
  };

  return (
    <Script
      id="faq-jsonld"
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}

// Łączony komponent dla wszystkich JSON-LD
export default function AllSchemaJsonLd() {
  return (
    <>
      <Script
        id="breadcrumbs-jsonld"
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
                name: "Kontakt",
                item: "https://devos.pl/kontakt",
              },
            ],
          }),
        }}
      />
      <ContactSchemaJsonLd />
      <FAQSchemaJsonLd />
    </>
  );
}
