"use client";

import { useReportWebVitals } from "next/web-vitals";
import { reportWebVitals } from "@/components/analytics";

export function WebVitals() {
  useReportWebVitals((metric) => {
    reportWebVitals(metric);
  });

  return null;
}
