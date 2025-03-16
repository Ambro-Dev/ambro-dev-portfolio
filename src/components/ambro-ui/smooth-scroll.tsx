"use client";

import { useMotionValue } from "framer-motion";
import {
  type FC,
  type ReactNode,
  useEffect,
  useCallback,
  memo,
  useRef,
  useState,
} from "react";

export interface SmoothScrollProps {
  children: ReactNode;
  offset?: number;
  disabled?: boolean;
  behavior?: ScrollBehavior;
  duration?: number;
  ease?: [number, number, number, number];
  onlyLinks?: boolean;
  selector?: string;
  scrollResistance?: number;
  reducedMotion?: boolean;
}

export const SmoothScroll: FC<SmoothScrollProps> = memo(
  ({
    children,
    offset = 80,
    disabled = false,
    behavior = "smooth",
    duration = 1,
    ease = [0.32, 0.72, 0, 1],
    onlyLinks = true,
    scrollResistance = 5,
    reducedMotion = false,
  }) => {
    // Create the motion value at the component level
    const scrollY = useMotionValue(0);
    const activeScrollingRef = useRef(false);
    const isMobileRef = useRef(false);

    const [effectiveReducedMotion, setEffectiveReducedMotion] =
      useState(reducedMotion);

    // No longer needed as we pass these values directly

    // Check for reduced motion preference
    useEffect(() => {
      if (typeof window === "undefined") return;

      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      // Combine prop with user preference
      setEffectiveReducedMotion(reducedMotion || mediaQuery.matches);

      // Optional: Listen for changes in user preference
      const handleChange = (e: MediaQueryListEvent) => {
        setEffectiveReducedMotion(reducedMotion || e.matches);
      };

      // Modern browsers support addEventListener on MediaQueryList
      if (typeof mediaQuery.addEventListener === "function") {
        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
      }
    }, [reducedMotion]);

    // Cache mobile state
    useEffect(() => {
      if (typeof window === "undefined") return;

      const checkMobile = () => {
        isMobileRef.current = window.innerWidth < 768;
      };

      checkMobile();
      window.addEventListener("resize", checkMobile, { passive: true });

      return () => {
        window.removeEventListener("resize", checkMobile);
      };
    }, []);

    // Define the scroll function with fewer dependencies and optimization
    const scrollWithFramer = useCallback(
      (targetY: number, initialY: number) => {
        const difference = targetY - initialY;

        // Skip small adjustments
        if (Math.abs(difference) < 10) {
          window.scrollTo(0, targetY);
          return;
        }

        // Skip animation if reduced motion is preferred
        if (effectiveReducedMotion) {
          window.scrollTo(0, targetY);
          return;
        }

        // Prevent multiple concurrent scrolls
        if (activeScrollingRef.current) {
          window.scrollTo(0, targetY);
          return;
        }

        activeScrollingRef.current = true;

        // Set the current value
        scrollY.set(initialY);

        // Create a callback for window scrolling
        const updateWindowScroll = (value: number) => {
          window.scrollTo(0, value);
        };

        // Subscribe to changes with the current API
        const unsubscribeCallback = scrollY.on("change", updateWindowScroll);

        // Manual animation using requestAnimationFrame
        const startTime = performance.now();
        const totalDuration = duration * 1000; // Convert to ms

        // Extract control points for bezier easing
        const [, y1, , y2] = ease;

        // Simplified cubic bezier calculation for easing
        const cubicBezier = (t: number): number => {
          const u = 1 - t;
          const tt = t * t;
          const uu = u * u;
          const ttt = tt * t;

          // P = (1-t)²tP₁ + (1-t)t²P₂ + t³
          // For bezier with P₀=(0,0) and P₃=(1,1)
          return 3 * uu * t * y1 + 3 * u * tt * y2 + ttt;
        };

        // Animation frame function
        const animateFrame = (currentTime: number) => {
          const elapsed = currentTime - startTime;

          if (elapsed >= totalDuration) {
            // Animation complete
            scrollY.set(targetY);
            unsubscribeCallback();
            activeScrollingRef.current = false;
            return;
          }

          // Calculate progress (0 to 1)
          const linearProgress = Math.min(elapsed / totalDuration, 1);

          // Apply easing
          const easedProgress = cubicBezier(linearProgress);

          // Calculate the current position
          const currentPosition =
            initialY + (targetY - initialY) * easedProgress;

          // Update scroll position
          scrollY.set(currentPosition);

          // Continue animation
          requestAnimationFrame(animateFrame);
        };

        // Start animation
        requestAnimationFrame(animateFrame);
      },
      [scrollY, duration, ease, effectiveReducedMotion]
    );

    // Event handling for clicks with debouncing
    useEffect(() => {
      if (disabled) return;

      if (isMobileRef.current && scrollResistance > 0) return;

      // Throttle handler using requestAnimationFrame
      let rafId: number | null = null;

      const handleClick = (e: MouseEvent) => {
        if (rafId) return; // Debounce rapid clicks

        rafId = requestAnimationFrame(() => {
          const target = e.target as HTMLElement;

          // Use querySelector to find the closest matching element
          const linkSelector = onlyLinks
            ? 'a[href^="#"]'
            : "[data-scroll], a[href^='#']";
          const anchor = target.closest(linkSelector);

          if (!anchor) {
            rafId = null;
            return;
          }

          const href = anchor.getAttribute("href");
          const dataTarget = anchor.getAttribute("data-scroll-target");
          const targetSelector = dataTarget || href;

          if (!targetSelector) {
            rafId = null;
            return;
          }

          e.preventDefault();
          const element = document.querySelector(targetSelector);
          if (!element) {
            rafId = null;
            return;
          }

          const targetPosition =
            element.getBoundingClientRect().top + window.scrollY - offset;

          // Add focus to target for accessibility
          if (element instanceof HTMLElement) {
            // We focus after scrolling is complete
            setTimeout(() => {
              if (element.tabIndex < 0) {
                element.tabIndex = -1; // Make focusable but not in tab order
              }
              element.focus({ preventScroll: true });
            }, duration * 1000 + 100);
          }

          if (behavior === "smooth" && !effectiveReducedMotion) {
            scrollWithFramer(targetPosition, window.scrollY);
          } else {
            window.scrollTo({
              top: targetPosition,
              behavior: effectiveReducedMotion ? "auto" : behavior,
            });
          }

          rafId = null;
        });
      };

      document.addEventListener("click", handleClick, { passive: false });

      return () => {
        document.removeEventListener("click", handleClick);
        if (rafId) cancelAnimationFrame(rafId);
      };
    }, [
      offset,
      disabled,
      behavior,
      onlyLinks,
      scrollResistance,
      scrollWithFramer,
      duration,
      effectiveReducedMotion,
    ]);

    return <>{children}</>;
  }
);

// Add display name for debugging
SmoothScroll.displayName = "SmoothScroll";

export default SmoothScroll;
