"use client";

import { SectionDivider } from "@/components/ambro-ui/section-divider";
import { GradientText } from "@/components/ambro-ui/gradient-text";
import Link from "next/link";
import { memo } from "react";
import Script from "next/script";

// Tablica szybkich linków z ich ścieżkami - zdefiniowana poza komponentem
const quickLinks = [
  { name: "Strona główna", path: "/" },
  { name: "O mnie", path: "/o-mnie" },
  { name: "Usługi", path: "/uslugi" },
  { name: "Projekty", path: "/projekty" },
  { name: "Cennik", path: "/cennik" },
  { name: "Kontakt", path: "/kontakt" },
];

// Zoptymalizowane ikony SVG jako komponenty
const MailIcon = memo(() => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4 text-indigo-400 mr-2 flex-shrink-0"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
  >
    <title>Email</title>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
));

const PhoneIcon = memo(() => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4 text-indigo-400 mr-2 flex-shrink-0"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
  >
    <title>Telefon</title>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
    />
  </svg>
));

PhoneIcon.displayName = "PhoneIcon";
MailIcon.displayName = "MailIcon";

// Memoizowany komponent footer dla lepszej wydajności
const Footer = memo(() => {
  const currentYear = new Date().getFullYear();
  const email = "kontakt@ambro-dev.pl";
  const phone = "+48 123 456 789";

  return (
    <footer className="w-full py-12 px-6 bg-black border-t border-gray-800">
      {/* JSON-LD dla stopki */}
      <Script
        id="footer-schema"
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Ambro-Dev",
            url: "https://ambro-dev.pl",
            logo: "https://ambro-dev.pl/logo.webp",
            contactPoint: {
              "@type": "ContactPoint",
              telephone: "+48123456789",
              contactType: "customer service",
              email: "kontakt@ambro-dev.pl",
              availableLanguage: "Polish",
            },
            sameAs: [
              "https://github.com/ambro-dev",
              "https://linkedin.com/company/ambro-dev",
            ],
          }),
        }}
      />

      <div className="container max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-4" id="footer-brand">
              <GradientText from="indigo-500" to="purple-600">
                Ambro-Dev
              </GradientText>
            </h2>
            <p className="text-gray-400 mb-4">
              Kompleksowe rozwiązania DevOps i aplikacje webowe dla nowoczesnego
              biznesu.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4" id="quick-links">
              Szybkie linki
            </h3>
            <nav aria-labelledby="quick-links">
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.path}
                      className="text-gray-400 hover:text-white transition-colors"
                      aria-label={`Przejdź do: ${link.name}`}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4" id="contact-info">
              Kontakt
            </h3>
            <address className="not-italic">
              <ul className="space-y-2">
                <li className="flex items-center">
                  <MailIcon />
                  <a
                    href={`mailto:${email}`}
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label="Email kontaktowy"
                  >
                    {email}
                  </a>
                </li>
                <li className="flex items-center">
                  <PhoneIcon />
                  <a
                    href={`tel:${phone.replace(/\s/g, "")}`}
                    className="text-gray-400 hover:text-white transition-colors truncate"
                    aria-label="Telefon kontaktowy"
                  >
                    {phone}
                  </a>
                </li>
              </ul>
            </address>
          </div>
        </div>

        <SectionDivider
          variant="tech"
          lineColor="from-transparent via-gray-800 to-transparent"
          dotColor="bg-indigo-500"
        />

        <div className="pt-8 text-center text-gray-500 text-sm">
          <p>&copy; {currentYear} Ambro-Dev. Wszelkie prawa zastrzeżone.</p>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";

export default Footer;
