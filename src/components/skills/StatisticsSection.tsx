"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  Server,
  Users,
  Coffee,
  Award,
  CheckCircle,
  Clock,
  Briefcase,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface StatisticItem {
  id: string;
  value: number;
  suffix: string;
  label: string;
  icon: LucideIcon;
  color: string;
  description?: string;
  increment?: number; // Value to increment by
  delay?: number; // Optional delay before animation starts
}

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  suffix?: string;
  animate: boolean;
  delay?: number;
  increment?: number;
}

interface StatCardProps {
  statistic: StatisticItem;
  index: number;
  inView: boolean;
}

// Statistics data
const statisticsData: StatisticItem[] = [
  {
    id: "projects",
    value: 120,
    suffix: "+",
    label: "Zrealizowanych projektów",
    icon: CheckCircle,
    color: "#4361EE",
    description: "Liczba pomyślnie ukończonych projektów dla różnych klientów",
    increment: 1,
  },
  {
    id: "servers",
    value: 250,
    suffix: "+",
    label: "Serwerów pod opieką",
    icon: Server,
    color: "#3A86FF",
    description: "Serwery zarządzane i monitorowane w różnych środowiskach",
    increment: 2,
  },
  {
    id: "clients",
    value: 45,
    suffix: "",
    label: "Zadowolonych klientów",
    icon: Users,
    color: "#FF006E",
    description: "Stali klienci korzystający z moich rozwiązań",
    increment: 1,
    delay: 0.3,
  },
  {
    id: "uptime",
    value: 99.98,
    suffix: "%",
    label: "Średni uptime",
    icon: Clock,
    color: "#06D6A0",
    description: "Średnia dostępność utrzymywanych systemów",
    increment: 0.01,
    delay: 0.4,
  },
  {
    id: "certificates",
    value: 12,
    suffix: "",
    label: "Certyfikatów branżowych",
    icon: Award,
    color: "#FB5607",
    description: "Profesjonalne certyfikaty potwierdzające umiejętności",
    increment: 1,
    delay: 0.5,
  },
  {
    id: "experience",
    value: 8,
    suffix: "",
    label: "Lat doświadczenia",
    icon: Briefcase,
    color: "#8338EC",
    description: "Lata profesjonalnego doświadczenia w branży IT",
    increment: 1,
    delay: 0.6,
  },
];

// Animated counter component
const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 2.5,
  suffix = "",
  animate = false,
  delay = 0,
  increment = 1,
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrameId: number;

    // Only start animation when animate is true
    if (!animate) return;

    // Set a timeout for the delay
    const timeoutId = setTimeout(() => {
      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = timestamp - startTime;
        const progressPercent = Math.min(progress / (duration * 1000), 1);

        // Use different easing functions based on value type
        let easedProgress: number;
        if (value < 100) {
          // Linear for small values
          easedProgress = progressPercent;
        } else {
          // Ease out for large values
          easedProgress = 1 - (1 - progressPercent) ** 3;
        }

        // Calculate the current value based on ease
        let newValue: number;
        if (increment < 1) {
          // For small increments (decimals)
          newValue = Number.parseFloat((easedProgress * value).toFixed(2));
        } else {
          // For larger increments (integers)
          newValue = Math.round(easedProgress * value);
        }

        setDisplayValue(newValue);

        if (progressPercent < 1) {
          animationFrameId = requestAnimationFrame(step);
        }
      };

      animationFrameId = requestAnimationFrame(step);
    }, delay * 1000);

    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(animationFrameId);
    };
  }, [value, duration, animate, delay, increment]);

  // Format the display value
  const formattedValue =
    increment < 1 ? displayValue.toFixed(2) : displayValue.toString();

  return (
    <span>
      {formattedValue}
      {suffix}
    </span>
  );
};

// Particle effect for the background
const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    const setDimensions = () => {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    setDimensions();
    window.addEventListener("resize", setDimensions);

    // Particle class
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;

      constructor(canvasElement: HTMLCanvasElement) {
        this.x = Math.random() * canvasElement.width;
        this.y = Math.random() * canvasElement.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.color = `rgba(100, 149, 237, ${Math.random() * 0.2 + 0.1})`;
      }

      update(canvasElement: HTMLCanvasElement) {
        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap around edges
        if (this.x < 0) this.x = canvasElement.width;
        else if (this.x > canvasElement.width) this.x = 0;

        if (this.y < 0) this.y = canvasElement.height;
        else if (this.y > canvasElement.height) this.y = 0;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    // Create particles
    const particleCount = Math.min(
      Math.floor((canvas.width * canvas.height) / 15000),
      70
    );
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle(canvas));
    }

    // Animation function
    const animate = () => {
      if (!ctx) return;

      // Clear canvas with a semi-transparent background for trail effect
      ctx.fillStyle = "rgba(17, 24, 39, 0.2)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      for (const particle of particles) {
        particle.update(canvas);
        particle.draw();
      }

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(100, 149, 237, ${0.1 - distance / 1000})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", setDimensions);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 0 }}
    />
  );
};

// Individual statistic card component
const StatCard: React.FC<StatCardProps> = ({ statistic, index, inView }) => {
  const {
    icon: Icon,
    color,
    value,
    suffix,
    label,
    description,
    increment,
    delay,
  } = statistic;

  return (
    <motion.div
      className="relative z-10 bg-gray-800/60 backdrop-blur-md rounded-xl p-6 border border-gray-700 overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 30 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        type: "spring",
        damping: 20,
      }}
      whileHover={{
        y: -10,
        boxShadow: `0 10px 25px rgba(0,0,0,0.2), 0 0 15px ${color}40`,
      }}
    >
      {/* Gradient overlay */}
      <div
        className="absolute top-0 left-0 h-2 w-full"
        style={{ backgroundColor: color }}
      />

      {/* Icon */}
      <div className="flex items-center mb-4">
        <div
          className="p-3 rounded-lg mr-4"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon style={{ color }} size={24} />
        </div>
        <p className="text-gray-400 text-sm">{label}</p>
      </div>

      {/* Value */}
      <div className="flex items-baseline">
        <h3 className="text-4xl font-bold" style={{ color }}>
          <AnimatedCounter
            value={value}
            suffix={suffix}
            animate={inView}
            delay={delay}
            increment={increment}
          />
        </h3>
      </div>

      {/* Description */}
      {description && (
        <p className="text-gray-300 text-sm mt-2">{description}</p>
      )}

      {/* Background decoration */}
      <div
        className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full opacity-10"
        style={{ backgroundColor: color }}
      />
    </motion.div>
  );
};

// Main statistics section component
const StatisticsSection: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section
      ref={ref}
      className="relative py-16 px-4 bg-gray-900 rounded-xl border border-gray-800 overflow-hidden"
    >
      {/* Background effect */}
      <ParticleBackground />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <motion.span
            className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-blue-600/20 text-blue-400 mb-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : -10 }}
            transition={{ duration: 0.5 }}
          >
            STATYSTYKI
          </motion.span>

          <motion.h2
            className="text-3xl md:text-4xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : -20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Liczby mówią same za siebie
          </motion.h2>

          <motion.p
            className="text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : -10 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Podsumowanie efektów mojej pracy jako specjalista DevOps i
            architektury IT. Każdy projekt to nowe wyzwanie i satysfakcja z
            osiągniętych rezultatów.
          </motion.p>
        </div>

        {/* Statistics grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statisticsData.map((stat, index) => (
            <StatCard
              key={stat.id}
              statistic={stat}
              index={index}
              inView={isInView}
            />
          ))}
        </div>

        {/* Call to action */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p className="text-gray-300 mb-6">
            Zainteresowany współpracą? Skontaktuj się ze mną, aby omówić jak
            mogę wesprzeć Twój biznes.
          </p>

          <motion.a
            href="#contact"
            className="inline-flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium"
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 25px rgba(59, 130, 246, 0.5)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Coffee size={18} className="mr-2" />
            <span>Porozmawiajmy</span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default StatisticsSection;
