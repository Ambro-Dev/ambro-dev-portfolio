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
import {
  Server,
  Cloud,
  Shield,
  Database,
  Code,
  Cog,
  Cpu,
  Network,
  Globe,
  Terminal,
  Lock,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

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
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.215, 0.61, 0.355, 1], // Cubic bezier easing
      },
    },
  };

  const subtitleVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.215, 0.61, 0.355, 1],
        delay: 0.2,
      },
    },
  };

  const buttonVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.215, 0.61, 0.355, 1],
        delay: 0.4,
      },
    },
  };

  return (
    <motion.div
      ref={containerRef}
      className="relative min-h-screen bg-gray-900 flex flex-col justify-center overflow-hidden"
      style={{ opacity }}
    >
      {/* Enhanced Background Effect */}
      <BackgroundEffect mousePosition={mousePosition} />

      {/* Tech icons floating in 3D space */}
      <TechIcons mousePosition={mousePosition} />

      {/* Main content with parallax effect */}
      <div className="container mx-auto px-4 z-10 relative py-16">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="hidden"
            animate={textControls}
            className="relative"
          >
            {/* Glowing highlight behind heading */}
            <motion.div
              className="absolute -inset-4 rounded-full bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 blur-3xl"
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 5,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            />

            {/* Main Heading */}
            <motion.h1
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-white relative"
              variants={headlineVariants}
            >
              <span className="inline-block">Specjalista</span>{" "}
              <motion.span
                className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 inline-block"
                animate={{
                  backgroundPosition: ["0% center", "100% center", "0% center"],
                }}
                transition={{
                  duration: 10,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              >
                DevOps i Architektury IT
              </motion.span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto"
              variants={subtitleVariants}
            >
              Zajmuję się automatyzacją procesów, administracją serwerami,
              bezpieczeństwem systemów i wdrażaniem rozwiązań chmurowych.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              variants={buttonVariants}
            >
              <PrimaryButton href="#services">Poznaj moje usługi</PrimaryButton>
              <SecondaryButton href="#contact">Kontakt</SecondaryButton>
            </motion.div>

            {/* Tech Tag Line */}
            <motion.div
              className="mt-16 flex flex-wrap justify-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
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
                <TechTag key={tech} label={tech} index={index} />
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      {/* Removing duplicate scroll indicator since hero-section.tsx already has one */}
    </motion.div>
  );
};

// Background effect with responsive particles and gradient
const BackgroundEffect: React.FC<{
  mousePosition: { x: number; y: number };
}> = ({ mousePosition }) => {
  // Create motion values at the component level, not inside render
  const mouseXValue = useMotionValue(mousePosition.x);
  const mouseYValue = useMotionValue(mousePosition.y);

  // Update values when props change
  useEffect(() => {
    mouseXValue.set(mousePosition.x);
    mouseYValue.set(mousePosition.y);
  }, [mousePosition, mouseXValue, mouseYValue]);

  // Transform to percentage values for CSS
  const gradientX = useTransform(mouseXValue, [0, 1], ["0%", "100%"]);
  const gradientY = useTransform(mouseYValue, [0, 1], ["0%", "100%"]);

  // Generate static particles once to avoid re-creation
  const particles = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      initialX: `${Math.random() * 100}%`,
      initialY: `${Math.random() * 100}%`,
      targetX: `${Math.random() * 100}%`,
      targetY: `${Math.random() * 100}%`,
      size: Math.random() * 6 + 2,
      duration: Math.random() * 20 + 20,
      opacity: Math.random() * 0.5 + 0.1,
    }));
  }, []);

  return (
    <>
      {/* Gradient background that follows mouse */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-gray-900 to-purple-900/40"
        style={{
          backgroundPosition: `${gradientX} ${gradientY}`,
        }}
        transition={{ type: "spring", damping: 40, stiffness: 80 }}
      />

      {/* Grid pattern overlay - ensure it displays even if image is missing */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: "url('/grid-pattern.svg')",
          backgroundSize: "30px 30px",
        }}
      />

      {/* Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-white/20 blur-sm"
            initial={{
              x: particle.initialX,
              y: particle.initialY,
              opacity: particle.opacity,
            }}
            animate={{
              x: particle.targetX,
              y: particle.targetY,
              opacity: [0.1, 0.3, 0.1],
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

      {/* Light flare effect */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      />

      <motion.div
        className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          delay: 2,
        }}
      />
    </>
  );
};

// Floating tech icons with 3D effect
const TechIcons: React.FC<{ mousePosition: { x: number; y: number } }> = ({
  mousePosition,
}) => {
  // Define icons once with useMemo to prevent re-creation on each render
  const icons = useMemo<IconInfo[]>(
    () => [
      { Icon: Server, color: "#4361EE", delay: 0, size: 32 },
      { Icon: Cloud, color: "#3A86FF", delay: 0.2, size: 36 },
      { Icon: Shield, color: "#FF006E", delay: 0.4, size: 30 },
      { Icon: Database, color: "#8338EC", delay: 0.6, size: 28 },
      { Icon: Code, color: "#06D6A0", delay: 0.8, size: 34 },
      { Icon: Cog, color: "#FB5607", delay: 1, size: 38 },
      { Icon: Cpu, color: "#FFBE0B", delay: 1.2, size: 32 },
      { Icon: Network, color: "#118AB2", delay: 1.4, size: 30 },
      { Icon: Globe, color: "#073B4C", delay: 1.6, size: 36 },
      { Icon: Terminal, color: "#3A86FF", delay: 1.8, size: 34 },
      { Icon: Lock, color: "#FF006E", delay: 2, size: 28 },
    ],
    []
  );

  // Pre-calculate icon positions for stability
  // Using same percentage-based grid as in original
  const iconPositions = useMemo(() => {
    return icons.map((_, index) => ({
      baseX: (index % 4) * 25 + Math.random() * 10,
      baseY: Math.floor(index / 4) * 25 + Math.random() * 10,
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
  // Create motion values properly at component level
  const mouseX = useMotionValue(mousePosition.x);
  const mouseY = useMotionValue(mousePosition.y);

  // Update them when props change
  useEffect(() => {
    mouseX.set(mousePosition.x);
    mouseY.set(mousePosition.y);
  }, [mousePosition, mouseX, mouseY]);

  // Transform motion values based on base position
  // Keep percentage based positioning from original
  const x = useTransform(
    mouseX,
    [0, 1],
    [`${basePosition.baseX - 10}%`, `${basePosition.baseX + 10}%`]
  );
  const y = useTransform(
    mouseY,
    [0, 1],
    [`${basePosition.baseY - 10}%`, `${basePosition.baseY + 10}%`]
  );

  // Spring-based physics for smoother movement
  const springX = useSpring(x, { stiffness: 100, damping: 30 });
  const springY = useSpring(y, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      className="absolute"
      style={{
        // Position absolutely using percentages like the original
        left: `${basePosition.baseX}%`,
        top: `${basePosition.baseY}%`,
        x: springX,
        y: springY,
        zIndex: index * 10, // Use zIndex instead of z for proper stacking
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 0.8, 0.6],
        scale: 1,
        rotate: [0, Math.random() * 20 - 10],
      }}
      transition={{
        duration: 2,
        delay: delay,
        ease: "easeOut",
      }}
    >
      <motion.div
        className="bg-gray-900/70 backdrop-blur-md p-3 rounded-2xl shadow-lg"
        whileHover={{ scale: 1.2, rotate: 0 }}
        animate={{
          y: [0, 10, 0],
          rotate: [0, 5, 0, -5, 0],
        }}
        transition={{
          y: {
            duration: 6,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            ease: "easeInOut",
          },
          rotate: {
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            ease: "easeInOut",
          },
        }}
      >
        <Icon style={{ color }} size={size} />
      </motion.div>
    </motion.div>
  );
};

// Primary CTA button with glow effect
const PrimaryButton: React.FC<{
  children: React.ReactNode;
  href: string;
}> = ({ children, href }) => {
  return (
    <motion.a
      href={href}
      className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg font-medium text-white overflow-hidden"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 opacity-0 group-hover:opacity-50 blur-md"
        transition={{ duration: 0.3 }}
      />

      {/* Shine effect */}
      <motion.div
        className="absolute -inset-full h-full w-1/3 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20"
        animate={{
          x: ["200%", "-200%"],
        }}
        transition={{
          duration: 1.5,
          ease: "easeInOut",
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "loop",
          repeatDelay: 0.5,
        }}
      />

      <span className="relative z-10">{children}</span>
    </motion.a>
  );
};

// Secondary button with subtle hover effect
const SecondaryButton: React.FC<{
  children: React.ReactNode;
  href: string;
}> = ({ children, href }) => {
  return (
    <motion.a
      href={href}
      className="px-8 py-4 bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-lg font-medium text-white hover:bg-gray-700/80 transition-all"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.a>
  );
};

// Tech tag with animation
const TechTag: React.FC<{
  label: string;
  index: number;
}> = ({ label, index }) => {
  return (
    <motion.span
      className="inline-block px-3 py-1 bg-gray-800/60 backdrop-blur-sm text-gray-300 text-sm rounded-full border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.8 + index * 0.1,
        duration: 0.4,
        ease: "easeOut",
      }}
      whileHover={{
        y: -5,
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        borderColor: "#3b82f6",
        color: "#ffffff",
      }}
    >
      {label}
    </motion.span>
  );
};

export default EnhancedHero;
