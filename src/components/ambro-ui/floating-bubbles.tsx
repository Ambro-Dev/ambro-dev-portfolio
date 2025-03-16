"use client";

import { type FC, useEffect, useRef, useMemo, memo } from "react";
import { twMerge } from "tailwind-merge";
import { throttle } from "lodash"; // Added for performance

/**
 * FloatingBubbles Component
 *
 * Creates an interactive canvas with floating bubble animations.
 *
 * @param count - Number of bubbles to display
 * @param minSize - Minimum size of bubbles in pixels
 * @param maxSize - Maximum size of bubbles in pixels
 * @param minSpeed - Minimum movement speed
 * @param maxSpeed - Maximum movement speed
 * @param fill - Whether to fill bubbles or just stroke them
 * @param color - Color of the bubbles
 * @param interactive - Whether bubbles react to mouse movement
 * @param className - Additional CSS classes
 * @param minDistance - Minimum distance for bubble interaction
 * @param fixed - Whether to position as fixed background
 */
export const FloatingBubbles: FC<{
  count?: number;
  minSize?: number;
  maxSize?: number;
  minSpeed?: number;
  maxSpeed?: number;
  fill?: boolean;
  color?: string;
  interactive?: boolean;
  className?: string;
  minDistance?: number;
  fixed?: boolean;
}> = memo(
  ({
    count = 15,
    minSize = 5,
    maxSize = 30,
    minSpeed = 1,
    maxSpeed = 3,
    fill = true,
    color = "rgba(99, 102, 241, 0.4)",
    interactive = true,
    className = "",
    minDistance = 100,
    fixed = false,
  }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameRef = useRef<number | null>(null);
    const bubblesRef = useRef<
      {
        x: number;
        y: number;
        size: number;
        speedX: number;
        speedY: number;
        opacity: number;
      }[]
    >([]);
    const mouseRef = useRef<{ x: number | null; y: number | null }>({
      x: null,
      y: null,
    });

    // Initialize bubbles
    useEffect(() => {
      if (!canvasRef.current) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Set canvas size - optimized for better performance
      const setCanvasSize = () => {
        const { offsetWidth, offsetHeight } = canvas;
        const dpr = window.devicePixelRatio || 1;

        // Set display size (css pixels)
        canvas.style.width = `${offsetWidth}px`;
        canvas.style.height = `${offsetHeight}px`;

        // Set actual size in memory (scaled to account for extra pixel density)
        canvas.width = offsetWidth * dpr;
        canvas.height = offsetHeight * dpr;

        // Scale context to ensure correct drawing operations
        ctx.scale(dpr, dpr);
      };

      setCanvasSize();

      // Throttle resize handler to improve performance
      const handleResize = throttle(() => {
        setCanvasSize();
      }, 100);

      if (window) (window as Window).addEventListener("resize", handleResize);

      // Create bubbles with optimized random values
      const bubbles = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        size: Math.random() * (maxSize - minSize) + minSize,
        speedX:
          (Math.random() - 0.5) * (maxSpeed - minSpeed) +
          (Math.random() > 0.5 ? minSpeed : -minSpeed),
        speedY:
          (Math.random() - 0.5) * (maxSpeed - minSpeed) +
          (Math.random() > 0.5 ? minSpeed : -minSpeed),
        opacity: Math.random() * 0.5 + 0.2,
      }));

      bubblesRef.current = bubbles;

      // Mouse movement for interactivity
      // Throttle mouse handler to improve performance
      const handleMouseMove = throttle((e: MouseEvent) => {
        if (!interactive || !canvas) return;

        const rect = canvas.getBoundingClientRect();
        mouseRef.current = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        };
      }, 16); // Approx 60fps

      const handleMouseLeave = () => {
        mouseRef.current = { x: null, y: null };
      };

      if (interactive && canvas) {
        canvas.addEventListener("mousemove", handleMouseMove);
        canvas.addEventListener("mouseleave", handleMouseLeave);
      }

      // Animation loop with performance optimizations
      const animate = () => {
        if (!canvas || !ctx) return;

        // Clear canvas - use clearRect for better performance
        ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

        // Get mouse position once to avoid repeated object access
        const mouseX = mouseRef.current.x;
        const mouseY = mouseRef.current.y;
        const isMouseActive = interactive && mouseX !== null && mouseY !== null;

        // Draw and update bubbles
        for (const bubble of bubblesRef.current) {
          // Draw bubble with batched operations
          ctx.beginPath();
          ctx.arc(bubble.x, bubble.y, bubble.size, 0, Math.PI * 2);
          ctx.globalAlpha = bubble.opacity;

          if (fill) {
            ctx.fillStyle = color;
            ctx.fill();
          } else {
            ctx.strokeStyle = color;
            ctx.lineWidth = 1;
            ctx.stroke();
          }

          // Reset opacity
          ctx.globalAlpha = 1;

          // Update position
          bubble.x += bubble.speedX;
          bubble.y += bubble.speedY;

          // Boundary checks optimized with early returns
          if (bubble.x < 0 || bubble.x > canvas.offsetWidth) {
            bubble.speedX *= -1;
            // Ensure bubble doesn't get stuck at edges
            bubble.x = Math.max(0, Math.min(bubble.x, canvas.offsetWidth));
          }

          if (bubble.y < 0 || bubble.y > canvas.offsetHeight) {
            bubble.speedY *= -1;
            // Ensure bubble doesn't get stuck at edges
            bubble.y = Math.max(0, Math.min(bubble.y, canvas.offsetHeight));
          }

          // Interactive movement - only calculate when mouse is active
          if (isMouseActive) {
            // Use type assertion instead of non-null assertion
            const dx = (mouseX as number) - bubble.x;
            const dy = (mouseY as number) - bubble.y;
            const distanceSquared = dx * dx + dy * dy;
            const distanceThreshold = minDistance * minDistance;

            // Rest of the interactive movement code remains the same
            if (distanceSquared < distanceThreshold) {
              const distance = Math.sqrt(distanceSquared);
              const angle = Math.atan2(dy, dx);
              const force = (minDistance - distance) / minDistance;

              bubble.speedX -= Math.cos(angle) * force * 0.5;
              bubble.speedY -= Math.sin(angle) * force * 0.5;

              // Limit speed with optimized calculation
              const speedSquared =
                bubble.speedX * bubble.speedX + bubble.speedY * bubble.speedY;
              if (speedSquared > maxSpeed * maxSpeed) {
                const speedFactor = maxSpeed / Math.sqrt(speedSquared);
                bubble.speedX *= speedFactor;
                bubble.speedY *= speedFactor;
              }
            }
          }
        }

        // Use requestAnimationFrame with reference for proper cleanup
        animationFrameRef.current = requestAnimationFrame(animate);
      };

      // Start animation
      animate();

      // Improved cleanup
      return () => {
        window.removeEventListener("resize", handleResize);

        if (interactive) {
          canvas.removeEventListener("mousemove", handleMouseMove);
          canvas.removeEventListener("mouseleave", handleMouseLeave);
        }

        // Cancel any pending animation frame
        if (animationFrameRef.current !== null) {
          cancelAnimationFrame(animationFrameRef.current);
        }

        // Clean mouse reference
        mouseRef.current = { x: null, y: null };
      };
    }, [
      count,
      minSize,
      maxSize,
      minSpeed,
      maxSpeed,
      fill,
      color,
      interactive,
      minDistance,
    ]);

    // Memoize class names for better performance
    const canvasClasses = useMemo(
      () =>
        twMerge(
          "w-full h-full",
          fixed && "fixed top-0 left-0 -z-10",
          className
        ),
      [fixed, className]
    );

    return (
      <div
        aria-hidden="true"
        role="presentation"
        className={
          fixed ? "fixed top-0 left-0 -z-10 w-full h-full" : "w-full h-full"
        }
      >
        <canvas ref={canvasRef} className={canvasClasses} />
      </div>
    );
  }
);

// Add display name for better debugging
FloatingBubbles.displayName = "FloatingBubbles";
