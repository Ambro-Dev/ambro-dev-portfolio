"use client";

import { useCallback, useEffect, useState } from "react";

export const useIsMobile = (options?: {
  breakpoint?: number;
  watchResize?: boolean;
  ssrValue?: boolean;
}) => {
  const {
    breakpoint = 768,
    watchResize = true,
    ssrValue = false,
  } = options || {};

  // Set initial state with SSR fallback
  const [isMobile, setIsMobile] = useState(ssrValue);

  const checkIfMobile = useCallback(() => {
    if (typeof window === "undefined") return ssrValue;
    setIsMobile(window.innerWidth < breakpoint);
  }, [breakpoint, ssrValue]);

  useEffect(() => {
    // Initial check
    checkIfMobile();

    // Add resize listener if watchResize is true
    if (watchResize) {
      if (window) (window as Window).addEventListener("resize", checkIfMobile);
      return () => {
        window.removeEventListener("resize", checkIfMobile);
      };
    }
  }, [watchResize, checkIfMobile]); // Removed redundant 'breakpoint'

  return isMobile;
};
