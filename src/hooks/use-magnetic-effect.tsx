import { type RefObject, useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-is-mobile";

export const useMagneticEffect = (
  ref: RefObject<HTMLElement>,
  options?: {
    strength?: number;
    radius?: number;
    disabled?: boolean;
    onEnter?: () => void;
    onLeave?: () => void;
  }
) => {
  const {
    strength = 30,
    radius = 200,
    disabled = false,
    onEnter,
    onLeave,
  } = options || {};

  const [active, setActive] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (disabled || isMobile || !ref.current) return;

    const element = ref.current;
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const handleMouseMove = (e: MouseEvent) => {
      const distance = Math.sqrt(
        (e.clientX - centerX) ** 2 + (e.clientY - centerY) ** 2
      );

      // Apply magnetic effect if within radius
      if (distance < radius) {
        if (!active) {
          setActive(true);
          onEnter?.();
        }

        // Calculate movement
        const magneticPullX = ((e.clientX - centerX) / radius) * strength;
        const magneticPullY = ((e.clientY - centerY) / radius) * strength;

        element.style.transform = `translate(${magneticPullX}px, ${magneticPullY}px)`;
      } else if (active) {
        // Reset when outside radius
        element.style.transform = "";
        setActive(false);
        onLeave?.();
      }
    };

    const handleMouseLeave = () => {
      element.style.transform = "";
      setActive(false);
      onLeave?.();
    };

    if (window)
      (window as Window).addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [ref, strength, radius, disabled, isMobile, active, onEnter, onLeave]);

  return { active };
};
