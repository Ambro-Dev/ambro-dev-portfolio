"use client";

import type React from "react";
import { useRef, useEffect, useState, useMemo } from "react";
import {
  motion,
  useAnimation,
  useMotionValue,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import { Server, Cloud, Shield, Database, Code, Terminal } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface IconInfo {
  Icon: LucideIcon;
  color: string;
  delay: number;
  size: number;
}

// Main component
const EnhancedHero: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const textControls = useAnimation();
  const opacityValue = useMotionValue(0);
  const opacity = useSpring(opacityValue, { stiffness: 100, damping: 30 });

  // For parallax effect
  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateMousePosition = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const { clientX, clientY } = e;
      const { left, top, width, height } =
        containerRef.current.getBoundingClientRect();

      // Calculate mouse position as a percentage of the container
      const x = (clientX - left) / width;
      const y = (clientY - top) / height;

      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", updateMousePosition);

    // Initial fade-in animation
    const timeout = setTimeout(() => {
      opacityValue.set(1);
      textControls.start("visible");
    }, 300);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      clearTimeout(timeout);
    };
  }, [opacityValue, textControls]);

  // Animation variants for text elements
  const headlineVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1], // Custom easing for elegant motion
      },
    },
  };

  const subtitleVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
        delay: 0.15,
      },
    },
  };

  const buttonVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
        delay: 0.3,
      },
    },
  };

  return (
    <motion.div
      ref={containerRef}
      className="relative min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 flex flex-col justify-center overflow-hidden"
      style={{ opacity }}
    >
      {/* Refined Background Effect */}
      <BackgroundEffect mousePosition={mousePosition} />

      {/* Reduced number of tech icons */}
      <TechIcons mousePosition={mousePosition} />

      {/* Main content with parallax effect */}
      <div className="container mx-auto px-4 z-10 relative py-16">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial="hidden"
            animate={textControls}
            className="relative"
          >
            {/* Subtle glow behind heading */}
            <motion.div
              className="absolute -inset-4 rounded-full bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-violet-600/10 blur-3xl"
              animate={{
                scale: [1, 1.03, 1],
                opacity: [0.2, 0.3, 0.2],
              }}
              transition={{
                duration: 6,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            />

            {/* Main Heading - More refined typography */}
            <motion.h1
              className="text-4xl md:text-6xl font-light mb-6 leading-tight tracking-tight text-white relative"
              variants={headlineVariants}
            >
              <span className="inline-block font-extralight">Specjalista</span>{" "}
              <motion.span
                className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 inline-block font-normal"
                animate={{
                  backgroundPosition: ["0% center", "100% center", "0% center"],
                }}
                transition={{
                  duration: 12,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              >
                DevOps i Architektury IT
              </motion.span>
            </motion.h1>

            {/* Subtitle - Refined spacing and font weight */}
            <motion.p
              className="text-lg md:text-xl text-slate-300 mb-12 max-w-2xl mx-auto font-light leading-relaxed"
              variants={subtitleVariants}
            >
              Zajmuję się automatyzacją procesów, administracją serwerami,
              bezpieczeństwem systemów i wdrażaniem rozwiązań chmurowych.
            </motion.p>

            {/* CTA Buttons using shadcn/ui */}
            <motion.div
              className="flex flex-col sm:flex-row gap-5 justify-center"
              variants={buttonVariants}
            >
              <Button
                size="lg"
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-md px-8 py-6 text-base transition-all shadow-md hover:shadow-lg"
                asChild
              >
                <a href="#services">Poznaj moje usługi</a>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white rounded-md px-8 py-6 text-base transition-all"
                asChild
              >
                <a href="#contact">Kontakt</a>
              </Button>
            </motion.div>

            {/* Tech Tag Line using shadcn/ui Badge */}
            <motion.div
              className="mt-16 flex flex-wrap justify-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              {[
                "Kubernetes",
                "AWS",
                "Azure",
                "CI/CD",
                "Docker",
                "Terraform",
                "DevSecOps",
              ].map((tech, index) => (
                <motion.div
                  key={tech}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.6 + index * 0.07,
                    duration: 0.4,
                  }}
                >
                  <Badge
                    variant="outline"
                    className="px-3 py-1 bg-slate-900/60 text-slate-300 border-slate-700 hover:bg-indigo-900/20 hover:border-indigo-700 transition-all duration-300"
                  >
                    {tech}
                  </Badge>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

// Refined Background effect
const BackgroundEffect: React.FC<{
  mousePosition: { x: number; y: number };
}> = ({ mousePosition }) => {
  const mouseXValue = useMotionValue(mousePosition.x);
  const mouseYValue = useMotionValue(mousePosition.y);

  useEffect(() => {
    mouseXValue.set(mousePosition.x);
    mouseYValue.set(mousePosition.y);
  }, [mousePosition, mouseXValue, mouseYValue]);

  const gradientX = useTransform(mouseXValue, [0, 1], ["0%", "100%"]);
  const gradientY = useTransform(mouseYValue, [0, 1], ["0%", "100%"]);

  // Generate fewer, more elegant particles
  const particles = useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      initialX: `${Math.random() * 100}%`,
      initialY: `${Math.random() * 100}%`,
      targetX: `${Math.random() * 100}%`,
      targetY: `${Math.random() * 100}%`,
      size: Math.random() * 4 + 1, // Smaller particles
      duration: Math.random() * 20 + 25,
      opacity: Math.random() * 0.3 + 0.05, // More subtle opacity
    }));
  }, []);

  return (
    <>
      {/* Subtle gradient background that follows mouse */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/20"
        style={{
          backgroundPosition: `${gradientX} ${gradientY}`,
        }}
        transition={{ type: "spring", damping: 40, stiffness: 80 }}
      />

      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "url('/grid-pattern.svg')",
          backgroundSize: "30px 30px",
        }}
      />

      {/* Refined subtle particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-white/10 blur-sm"
            initial={{
              x: particle.initialX,
              y: particle.initialY,
              opacity: particle.opacity,
            }}
            animate={{
              x: particle.targetX,
              y: particle.targetY,
              opacity: [0.05, 0.1, 0.05],
            }}
            transition={{
              duration: particle.duration,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
            }}
          />
        ))}
      </div>

      {/* Subtle light flares */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.1, 0.15, 0.1],
        }}
        transition={{
          duration: 10,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      />

      <motion.div
        className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.08, 0.12, 0.08],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          delay: 2,
        }}
      />
    </>
  );
};

// Refined floating tech icons with 3D effect (reduced quantity)
const TechIcons: React.FC<{ mousePosition: { x: number; y: number } }> = ({
  mousePosition,
}) => {
  // Reduced number of icons for minimalism
  const icons = useMemo<IconInfo[]>(
    () => [
      { Icon: Server, color: "#818cf8", delay: 0, size: 28 },
      { Icon: Cloud, color: "#a5b4fc", delay: 0.3, size: 32 },
      { Icon: Shield, color: "#93c5fd", delay: 0.6, size: 26 },
      { Icon: Database, color: "#c4b5fd", delay: 0.9, size: 24 },
      { Icon: Code, color: "#a5b4fc", delay: 1.2, size: 30 },
      { Icon: Terminal, color: "#818cf8", delay: 1.5, size: 28 },
    ],
    []
  );

  // Pre-calculate icon positions with more elegant spacing
  const iconPositions = useMemo(() => {
    return icons.map((_, index) => ({
      baseX: (index % 3) * 30 + 15 + Math.random() * 5,
      baseY: Math.floor(index / 3) * 30 + 15 + Math.random() * 5,
    }));
  }, [icons]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {icons.map((iconProps, index) => (
        <FloatingIcon
          key={`icon-${
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            index
          }`}
          {...iconProps}
          index={index}
          mousePosition={mousePosition}
          basePosition={iconPositions[index]}
        />
      ))}
    </div>
  );
};

// Refined floating icon with more subtle animation
const FloatingIcon = ({
  Icon,
  color,
  delay,
  size,
  index,
  mousePosition,
  basePosition,
}: {
  Icon: LucideIcon;
  color: string;
  delay: number;
  size: number;
  index: number;
  mousePosition: { x: number; y: number };
  basePosition: { baseX: number; baseY: number };
}) => {
  const mouseX = useMotionValue(mousePosition.x);
  const mouseY = useMotionValue(mousePosition.y);

  useEffect(() => {
    mouseX.set(mousePosition.x);
    mouseY.set(mousePosition.y);
  }, [mousePosition, mouseX, mouseY]);

  // Reduced parallax effect for subtlety
  const x = useTransform(
    mouseX,
    [0, 1],
    [`${basePosition.baseX - 5}%`, `${basePosition.baseX + 5}%`]
  );
  const y = useTransform(
    mouseY,
    [0, 1],
    [`${basePosition.baseY - 5}%`, `${basePosition.baseY + 5}%`]
  );

  // Smoother movement
  const springX = useSpring(x, { stiffness: 80, damping: 25 });
  const springY = useSpring(y, { stiffness: 80, damping: 25 });

  return (
    <motion.div
      className="absolute"
      style={{
        left: `${basePosition.baseX}%`,
        top: `${basePosition.baseY}%`,
        x: springX,
        y: springY,
        zIndex: index * 10,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 0.6, 0.4],
        scale: 1,
      }}
      transition={{
        duration: 1.5,
        delay: delay,
        ease: "easeOut",
      }}
    >
      <motion.div
        className="bg-slate-900/50 backdrop-blur-sm p-3 rounded-xl shadow-sm"
        whileHover={{ scale: 1.1, rotate: 0 }}
        animate={{
          y: [0, 5, 0],
          rotate: [0, 2, 0, -2, 0],
        }}
        transition={{
          y: {
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            ease: "easeInOut",
          },
          rotate: {
            duration: 12,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            ease: "easeInOut",
          },
        }}
      >
        <Icon style={{ color }} size={size} strokeWidth={1.5} />
      </motion.div>
    </motion.div>
  );
};

export default EnhancedHero;
