"use client";

import { animate, useMotionValue } from "framer-motion";
import {
  type FC,
  type ReactNode,
  useEffect,
  useCallback,
  useMemo,
} from "react";

export const SmoothScroll: FC<{
  children: ReactNode;
  offset?: number;
  disabled?: boolean;
  behavior?: ScrollBehavior;
  duration?: number;
  ease?: [number, number, number, number];
  onlyLinks?: boolean;
  selector?: string;
  scrollResistance?: number;
}> = ({
  children,
  offset = 80,
  disabled = false,
  behavior = "smooth",
  duration = 1,
  ease = [0.32, 0.72, 0, 1],
  onlyLinks = true,
  scrollResistance = 5,
}) => {
  // Create the motion value at the component level
  const scrollY = useMotionValue(0);

  // Memoize the animation options to avoid recreating objects
  const animationOptions = useMemo(
    () => ({
      duration,
      ease,
    }),
    [duration, ease]
  );

  // Define the scroll function with fewer dependencies
  const scrollWithFramer = useCallback(
    (targetY: number, initialY: number) => {
      const difference = targetY - initialY;

      if (Math.abs(difference) < 10) {
        window.scrollTo(0, targetY);
        return;
      }

      // Set the current value
      scrollY.set(initialY);

      // Update window scroll position when the motion value changes
      const unsubscribe = scrollY.onChange((latest) => {
        window.scrollTo(0, latest);
      });

      // Animate the motion value using memoized options
      animate(scrollY, targetY, {
        ...animationOptions,
        onComplete: () => {
          unsubscribe();
        },
      });
    },
    [scrollY, animationOptions] // Now we only depend on stable references
  );

  useEffect(() => {
    if (disabled) return;

    const isMobile = window.innerWidth < 768;
    if (isMobile && scrollResistance > 0) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Use querySelector to find the closest matching element
      const linkSelector = onlyLinks ? 'a[href^="#"]' : "[data-scroll]";
      const anchor = target.closest(linkSelector);

      if (!anchor) return;

      const href = anchor.getAttribute("href");
      const dataTarget = anchor.getAttribute("data-scroll-target");
      const targetSelector = dataTarget || href;

      if (!targetSelector) return;

      e.preventDefault();
      const element = document.querySelector(targetSelector);
      if (!element) return;

      const targetPosition =
        element.getBoundingClientRect().top + window.pageYOffset - offset;

      if (behavior === "smooth") {
        scrollWithFramer(targetPosition, window.pageYOffset);
      } else {
        window.scrollTo({
          top: targetPosition,
          behavior,
        });
      }
    };

    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [
    offset,
    disabled,
    behavior,
    onlyLinks,
    scrollResistance,
    scrollWithFramer,
  ]);

  return <>{children}</>;
};
