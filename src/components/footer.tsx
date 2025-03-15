"use client";

import { SectionDivider } from "@/components/ambro-ui/section-divider";
import { GradientText } from "@/components/ambro-ui/gradient-text";
import Link from "next/link";

const Footer = () => {
  // Tablica szybkich linków z ich ścieżkami
  const quickLinks = [
    { name: "Strona główna", path: "/" },
    { name: "O mnie", path: "/o-mnie" },
    { name: "Usługi", path: "/uslugi" },
    { name: "Projekty", path: "/projekty" },
    { name: "Cennik", path: "/cennik" },
    { name: "Kontakt", path: "/kontakt" },
  ];

  return (
    <footer className="w-full py-12 px-6 bg-black border-t border-gray-800">
      <div className="container max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">
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
            <h3 className="text-lg font-bold mb-4">Szybkie linki</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Kontakt</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-indigo-400 mr-2 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <title>Mail</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <a
                  href="mailto:kontakt@ambro-dev.pl"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  kontakt@ambro-dev.pl
                </a>
              </li>
              <li className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-indigo-400 mr-2 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <title>Phone</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <a
                  href="tel:+48123456789"
                  className="text-gray-400 hover:text-white transition-colors truncate"
                >
                  +48 123 456 789
                </a>
              </li>
            </ul>
          </div>
        </div>

        <SectionDivider
          variant="tech"
          lineColor="from-transparent via-gray-800 to-transparent"
          dotColor="bg-indigo-500"
        />

        <div className="pt-8 text-center text-gray-500 text-sm">
          <p>
            &copy; {new Date().getFullYear()} Ambro-Dev. Wszelkie prawa
            zastrzeżone.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
