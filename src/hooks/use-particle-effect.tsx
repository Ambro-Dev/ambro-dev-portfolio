import { useCallback, useEffect, useRef, type RefObject } from "react";

export const useParticleEffect = (options?: {
  count?: number;
  color?: string;
  size?: number;
  speed?: number;
  connected?: boolean;
  connectionDistance?: number;
  connectionOpacity?: number;
  connectionColor?: string;
  randomMovement?: boolean;
  interactive?: boolean;
  container?: RefObject<HTMLDivElement>;
}) => {
  const {
    count = 50,
    color = "#6366f1",
    size = 2,
    speed = 0.5,
    connected = true,
    connectionDistance = 150,
    connectionOpacity = 0.3,
    connectionColor = "#6366f1",
    randomMovement = true,
    interactive = true,
    container,
  } = options || {};

  const particlesRef = useRef<HTMLCanvasElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const isActive = useRef(false);

  // Initialize particles with randomized positions
  const initializeParticles = useCallback(() => {
    if (!particlesRef.current || !container?.current) return null;

    const canvas = particlesRef.current;
    const containerRect = container.current.getBoundingClientRect();
    canvas.width = containerRect.width;
    canvas.height = containerRect.height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Create particles
    const particles = Array.from({ length: count }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      velocityX: (Math.random() - 0.5) * speed,
      velocityY: (Math.random() - 0.5) * speed,
      size: Math.random() * size + 1,
    }));

    return { ctx, particles, canvas };
  }, [count, size, speed, container]);

  // Animate particles
  useEffect(() => {
    if (!container?.current) return;

    const data = initializeParticles();
    if (!data) return;

    const { ctx, particles, canvas } = data;

    // IMPORTANT: Store the current container element
    const currentContainer = container.current;

    // Handle window resize
    const handleResize = () => {
      if (!currentContainer || !particlesRef.current) return;

      const containerRect = currentContainer.getBoundingClientRect();
      canvas.width = containerRect.width;
      canvas.height = containerRect.height;
    };

    // Handle mouse movement if interactive
    const handleMouseMove = (e: MouseEvent) => {
      if (!currentContainer || !interactive) return;

      const rect = currentContainer.getBoundingClientRect();
      mousePos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      isActive.current = true;
    };

    const handleMouseLeave = () => {
      isActive.current = false;
    };

    // Animation loop
    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      // Update and draw particles - replace forEach with for...of
      for (const p of particles) {
        if (randomMovement) {
          p.x += p.velocityX;
          p.y += p.velocityY;

          // Boundary check
          if (p.x < 0 || p.x > canvas.width) {
            p.velocityX *= -1;
          }

          if (p.y < 0 || p.y > canvas.height) {
            p.velocityY *= -1;
          }
        }

        // Interactive effect - move toward mouse
        if (isActive.current && interactive) {
          const dx = mousePos.current.x - p.x;
          const dy = mousePos.current.y - p.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            p.x += dx * 0.01;
            p.y += dy * 0.01;
          }
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      }

      // Draw connections between particles - replace nested forEach with nested for...of
      if (connected) {
        for (let i = 0; i < particles.length; i++) {
          const p1 = particles[i];

          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < connectionDistance) {
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              const opacity =
                (1 - distance / connectionDistance) * connectionOpacity;
              ctx.strokeStyle = `${connectionColor}${Math.floor(opacity * 255)
                .toString(16)
                .padStart(2, "0")}`;
              ctx.stroke();
            }
          }
        }
      }

      requestAnimationFrame(animate);
    };

    if (window) (window as Window).addEventListener("resize", handleResize);

    if (interactive) {
      if (window)
        (window as Window).addEventListener("mousemove", handleMouseMove);
      currentContainer.addEventListener("mouseleave", handleMouseLeave);
    }

    const animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);

      if (interactive) {
        window.removeEventListener("mousemove", handleMouseMove);
        // Use the stored container reference here
        currentContainer.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [
    initializeParticles,
    color,
    connected,
    connectionDistance,
    connectionOpacity,
    connectionColor,
    randomMovement,
    interactive,
    container,
  ]);

  return { particlesRef };
};
