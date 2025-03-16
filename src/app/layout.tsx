import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { cx } from "class-variance-authority";
import { baseURL, home, style } from "./resources";
import Script from "next/script";
import dynamic from "next/dynamic";

// Statycznie zaimportowane komponenty krytyczne dla pierwszego renderowania
import Navigation from "@/components/navigation";
import { WebVitals } from "@/components/web-vitals";

// Dynamiczne importy z lazy-loading dla niekrytycznych komponentów
const Footer = dynamic(() => import("@/components/footer"), {
  ssr: true, // Server-side rendering dla SEO
});

const ScrollProgress = dynamic(
  () =>
    import("@/components/ambro-ui/scroll-progress").then(
      (mod) => mod.ScrollProgress
    ),
  { ssr: true }
);

const FloatingBubbles = dynamic(
  () =>
    import("@/components/ambro-ui/floating-bubbles").then(
      (mod) => mod.FloatingBubbles
    ),
  { ssr: true, loading: () => <div className="absolute inset-0 z-0" /> }
);

// Analytics component
const Analytics = dynamic(() => import("@/components/analytics"), {
  ssr: true,
});

// Optymalizacja fontów zgodna z Next.js 15
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "sans-serif"],
  adjustFontFallback: true, // Nowa funkcja w Next.js 15
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false, // Załaduj ten font później
  fallback: ["monospace"],
  adjustFontFallback: true, // Nowa funkcja w Next.js 15
});

const primary = Inter({
  variable: "--font-primary",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "sans-serif"],
  adjustFontFallback: true, // Nowa funkcja w Next.js 15
});

// Rozszerzone metadane zgodne z Next.js 15
export const metadata: Metadata = {
  metadataBase: new URL(`https://${baseURL}`),
  title: {
    template: `%s | ${home.title}`,
    default: home.title,
  },
  description: home.description,
  applicationName: "Ambro-Dev",
  keywords: [
    "DevOps",
    "automatyzacja",
    "aplikacje webowe",
    "chmura",
    "AWS",
    "infrastruktura IT",
  ],
  authors: [{ name: "Ambro-Dev", url: `https://${baseURL}` }],
  creator: "Ambro-Dev",
  publisher: "Ambro-Dev",
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  alternates: {
    canonical: `https://${baseURL}`,
    languages: {
      "pl-PL": `https://${baseURL}`,
    },
  },
  openGraph: {
    title: `Ambro-Dev | ${home.title}`,
    description:
      "Automatyzacja procesów, chmurowe rozwiązania, administracja serwerami, tworzenie stron internetowych i aplikacji webowych",
    url: `https://${baseURL}`,
    siteName: "Ambro-Dev",
    locale: "pl_PL",
    type: "website",
    images: [
      {
        url: `https://${baseURL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Ambro-Dev",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Ambro-Dev | ${home.title}`,
    description: home.description,
    images: [`https://${baseURL}/og-image.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "twój-identyfikator-google-site-verification",
  },
  appleWebApp: {
    title: "Ambro-Dev",
    statusBarStyle: "black-translucent",
    capable: true,
  },
  category: "technology",
};

// Viewport settings
export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Combine all font variables
  const fontClasses = cx(
    primary.variable,
    geistSans.variable,
    geistMono.variable,
    "dark antialiased"
  );

  return (
    <html
      lang="pl"
      data-neutral={style.neutral}
      data-brand={style.brand}
      data-accent={style.accent}
      data-solid={style.solid}
      data-solid-style={style.solidStyle}
      data-theme={style.theme}
      data-border={style.border}
      data-surface={style.surface}
      data-transition={style.transition}
      className={fontClasses}
      suppressHydrationWarning
    >
      <head>
        {/* Preload critical assets - funkcja Next.js 15 */}
        <link
          rel="preload"
          as="image"
          href="/logo.webp"
          type="image/webp"
          fetchPriority="high"
        />

        {/* Preconnect do domen zewnętrznych */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* PWA manifest */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />

        {/* Dane strukturalne Schema.org */}
        <Script
          id="schema-org"
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Ambro-Dev",
              url: `https://${baseURL}`,
              logo: `https://${baseURL}/logo.webp`,
              description: home.description,
              email: "kontakt@ambro-dev.pl",
              telephone: "+48123456789",
              address: {
                "@type": "PostalAddress",
                addressCountry: "PL",
              },
              sameAs: [
                "https://github.com/ambro-dev",
                "https://linkedin.com/company/ambro-dev",
              ],
            }),
          }}
          strategy="afterInteractive" // Next.js 15 - strategy option
        />
      </head>
      <body className="flex flex-col min-h-screen">
        <WebVitals />
        {/* Analytics Component */}
        <Analytics />

        <ThemeProvider
          attribute="class"
          forcedTheme="dark"
          disableTransitionOnChange
        >
          {/* Scroll Progress Indicator zoptymalizowany pod Next.js 15 */}
          <Suspense
            fallback={
              <div className="h-1 w-full bg-transparent fixed top-0 z-50" />
            }
          >
            <ScrollProgress
              position="top"
              color="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
              zIndex={60}
              height={3}
              borderRadius="rounded-none"
            />
          </Suspense>

          {/* Navigation - prerendered */}
          <Navigation />

          <div className="flex-grow relative overflow-hidden">
            {/* Floating bubbles - lazy loaded */}
            <Suspense fallback={<div className="absolute inset-0 z-0" />}>
              <div className="absolute inset-0 z-0">
                <FloatingBubbles
                  count={10} // Zredukowana liczba dla lepszej wydajności
                  minSize={2}
                  maxSize={6}
                  color="rgba(99, 102, 241, 0.3)"
                  minSpeed={0.5}
                  maxSpeed={1}
                  fixed
                  className="h-full w-full opacity-50"
                />
              </div>
            </Suspense>
            {children}
          </div>

          {/* Footer - lazy loaded */}
          <Suspense fallback={<div className="h-64 bg-black" />}>
            <Footer />
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
