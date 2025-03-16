"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

// Funkcja inicjalizacji Google Analytics
const initGA = () => {
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID;
  if (!GA_MEASUREMENT_ID) return;

  // Define dataLayer properly
  window.dataLayer = window.dataLayer || [];

  // Define gtag function correctly
  window.gtag = (...args) => {
    window.dataLayer.push(args);
  };

  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID, {
    page_path: window.location.pathname,
  });
};

// Funkcja śledzenia widoku strony
const trackPageView = (url: string) => {
  if (typeof window.gtag !== "undefined") {
    window.gtag("config", process.env.NEXT_PUBLIC_GA_ID || "", {
      page_path: url,
    });
  }
};

// Funkcja mierzenia Web Vitals
interface WebVitalMetric {
  id: string;
  name: string;
  value: number;
  // Add other properties as needed
  label?: string;
  delta?: number;
}

export function reportWebVitals(metric: WebVitalMetric) {
  // Wysyłaj do Google Analytics
  if (typeof window.gtag !== "undefined") {
    window.gtag("event", metric.name, {
      event_category: "Web Vitals",
      event_label: metric.id,
      value: Math.round(
        metric.name === "CLS" ? metric.value * 1000 : metric.value
      ),
      non_interaction: true,
    });
  }

  // Możesz również wysłać do własnego endpointu
  if (process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT) {
    fetch(process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT, {
      method: "POST",
      body: JSON.stringify(metric),
      headers: { "Content-Type": "application/json" },
    });
  }
}

// Komponent Analytics, który można dodać do layoutu
export default function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Śledź zmiany URL
  useEffect(() => {
    const url = `${pathname}${
      searchParams?.toString() ? `?${searchParams.toString()}` : ""
    }`;
    trackPageView(url);
  }, [pathname, searchParams]);

  return (
    <>
      {/* Google Tag Manager - załaduj tylko w produkcji */}
      {process.env.NODE_ENV === "production" &&
        process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              id="gtm-script"
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              onLoad={initGA}
            />
            <Script
              id="gtm-init"
              strategy="afterInteractive"
              // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
              dangerouslySetInnerHTML={{
                __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                  page_path: window.location.pathname,
                });
              `,
              }}
            />
          </>
        )}

      {/* Vercel Analytics - Nowa wersja kompatybilna z Next.js 15 */}
      <VercelAnalytics
        mode={process.env.NODE_ENV === "production" ? "auto" : "development"}
      />

      {/* Speed Insights - Nowy komponent w Next.js 15 */}
      <SpeedInsights />
    </>
  );
}

// Dodaj ten typ dla globalnego window
type GtagCommand = "js" | "config" | "event";

interface GtagConfigParams {
  page_path?: string;
  send_to?: string;
  event_category?: string;
  event_label?: string;
  value?: number;
  non_interaction?: boolean;
  [key: string]: unknown;
}

declare global {
  interface Window {
    gtag: (
      command: GtagCommand,
      targetId: string | Date,
      config?: GtagConfigParams
    ) => void;
    dataLayer: {
      push: (...args: unknown[]) => number;
      [index: number]: unknown;
    };
  }
}
