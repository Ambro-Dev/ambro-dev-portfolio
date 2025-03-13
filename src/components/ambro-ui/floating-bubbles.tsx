import { type FC, useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";

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
}> = ({
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

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    // Create bubbles
    const bubbles = [];
    for (let i = 0; i < count; i++) {
      bubbles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * (maxSize - minSize) + minSize,
        speedX:
          (Math.random() - 0.5) * (maxSpeed - minSpeed) +
          (Math.random() > 0.5 ? minSpeed : -minSpeed),
        speedY:
          (Math.random() - 0.5) * (maxSpeed - minSpeed) +
          (Math.random() > 0.5 ? minSpeed : -minSpeed),
        opacity: Math.random() * 0.5 + 0.2,
      });
    }
    bubblesRef.current = bubbles;

    // Mouse movement for interactivity
    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;

      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: null, y: null };
    };

    if (interactive) {
      canvas.addEventListener("mousemove", handleMouseMove);
      canvas.addEventListener("mouseleave", handleMouseLeave);
    }

    // Animation loop
    const animate = () => {
      if (!canvas || !ctx) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw and update bubbles
      for (const bubble of bubblesRef.current) {
        // Draw bubble
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

        // Bounce off edges
        if (bubble.x < 0 || bubble.x > canvas.width) {
          bubble.speedX *= -1;
        }

        if (bubble.y < 0 || bubble.y > canvas.height) {
          bubble.speedY *= -1;
        }

        // Interactive movement
        if (
          interactive &&
          mouseRef.current.x !== null &&
          mouseRef.current.y !== null
        ) {
          const dx = mouseRef.current.x - bubble.x;
          const dy = mouseRef.current.y - bubble.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < minDistance) {
            const angle = Math.atan2(dy, dx);
            const force = (minDistance - distance) / minDistance;

            bubble.speedX -= Math.cos(angle) * force * 0.5;
            bubble.speedY -= Math.sin(angle) * force * 0.5;

            // Limit speed
            const speed = Math.sqrt(
              bubble.speedX * bubble.speedX + bubble.speedY * bubble.speedY
            );
            if (speed > maxSpeed) {
              bubble.speedX = (bubble.speedX / speed) * maxSpeed;
              bubble.speedY = (bubble.speedY / speed) * maxSpeed;
            }
          }
        }
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", setCanvasSize);

      if (interactive) {
        canvas.removeEventListener("mousemove", handleMouseMove);
        canvas.removeEventListener("mouseleave", handleMouseLeave);
      }
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

  return (
    <canvas
      ref={canvasRef}
      className={twMerge(
        "w-full h-full",
        fixed && "fixed top-0 left-0 -z-10",
        className
      )}
    />
  );
};
