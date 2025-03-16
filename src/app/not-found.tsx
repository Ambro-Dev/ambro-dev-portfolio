import { Home, Search } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import type { Metadata, MetadataRoute } from "next";
import { Inter, Poppins } from "next/font/google";

// Optymalizacja fontów
const inter = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-inter",
});

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-poppins",
});

// Metadane dla strony 404 z rozszerzonymi opcjami SEO
export const metadata: Metadata = {
  title: "Strona nie znaleziona | 404",
  description:
    "Nie mogliśmy znaleźć strony, której szukasz. Wróć na stronę główną lub skorzystaj z wyszukiwarki.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "https://ambro.dev/404",
  },
  openGraph: {
    title: "Strona nie znaleziona | 404",
    description:
      "Nie mogliśmy znaleźć strony, której szukasz. Wróć na stronę główną lub skorzystaj z wyszukiwarki.",
    type: "website",
  },
};

// Generowanie sitemap.xml (wyłączenie strony 404 z sitemap)
export function generateSitemapExclusion(): MetadataRoute.Sitemap {
  return [];
}

// Komponent wyszukiwarki z obsługą Suspense
const SearchComponent = () => {
  // Zamiast useSearchParams, używamy formularza z metodą GET
  return (
    <form action="/" method="get" className="mt-6 mb-4 w-full max-w-sm mx-auto">
      <div className="relative">
        <input
          type="text"
          name="q"
          placeholder="Czego szukasz?"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
          aria-label="Wyszukiwarka"
        />
        <Search
          className="absolute left-3 top-2.5 text-gray-400"
          size={18}
          aria-hidden="true"
        />
        <button
          type="submit"
          className="absolute right-2 top-1.5 px-2 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition"
        >
          Szukaj
        </button>
      </div>
    </form>
  );
};

export default function NotFound() {
  return (
    <div
      className={`min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex items-center justify-center px-4 ${inter.variable} ${poppins.variable}`}
    >
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-8 text-center">
          {/* Strukturalne nagłówki z semantycznym HTML dla lepszego SEO */}
          <h1
            className="text-4xl font-bold text-blue-600 mb-2 font-poppins"
            aria-label="Błąd 404"
          >
            404
          </h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 font-poppins">
            Ups! Strona nie znaleziona
          </h2>

          {/* Zoptymalizowana animacja z preload="none" dla lepszej wydajności */}
          <div className="relative mb-6 h-28 flex items-center justify-center">
            <div
              className="text-8xl font-bold text-blue-50 select-none"
              aria-hidden="true"
            >
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="w-20 h-20 text-blue-500"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  animation: "spin 3s linear infinite",
                  willChange: "transform",
                }}
              >
                <title>Animacja 404</title>
                <path
                  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="60"
                  strokeDashoffset="60"
                  pathLength="60"
                />
              </svg>
            </div>
          </div>

          <p className="text-gray-600 mb-4">
            Strona, której szukasz, nie istnieje lub została przeniesiona.
          </p>

          {/* Dodanie komponentu wyszukiwania w Suspense */}
          <Suspense
            fallback={
              <div className="h-12 w-full bg-gray-100 animate-pulse rounded-md" />
            }
          >
            <SearchComponent />
          </Suspense>

          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ease-in-out mt-4"
            aria-label="Powrót na stronę główną"
            prefetch={true}
          >
            <Home className="mr-2" size={18} aria-hidden="true" />
            Strona główna
          </Link>

          {/* Dodanie linków do najczęściej odwiedzanych stron dla lepszego UX */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-500 mb-3">Popularne strony:</p>
            <div className="flex flex-wrap justify-center gap-2 text-sm">
              <Link
                href="/kontakt"
                className="text-blue-600 hover:underline px-2 py-1"
              >
                Kontakt
              </Link>
              <Link
                href="/o-nas"
                className="text-blue-600 hover:underline px-2 py-1"
              >
                O nas
              </Link>
              <Link
                href="/oferta"
                className="text-blue-600 hover:underline px-2 py-1"
              >
                Oferta
              </Link>
              <Link
                href="/blog"
                className="text-blue-600 hover:underline px-2 py-1"
              >
                Blog
              </Link>
            </div>
          </div>
        </div>

        {/* Dodanie schematów strukturalnych JSON-LD dla lepszego SEO */}
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
                  item: "https://twojadomena.pl",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Strona nie znaleziona",
                  item: "https://twojadomena.pl/404",
                },
              ],
            }),
          }}
        />
      </div>
    </div>
  );
}

// Dodaj w pliku global.css:
/*
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
*/
