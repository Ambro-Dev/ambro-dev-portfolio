"use client";
// This file contains enhanced UI components used across the portfolio

import type React from "react";
import { useEffect, useState, useRef, useMemo } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionTemplate,
  useMotionValue,
  animate as framerAnimate,
  AnimatePresence,
} from "framer-motion";
import { useInView } from "react-intersection-observer"; // Dodajemy dla lepszej detekcji widoczności
import { twMerge } from "tailwind-merge"; // Lepsze zarządzanie klasami Tailwind

// Custom cursor component that follows mouse position and changes scale based on interaction
export const EnhancedCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorPosition = useMotionValue({ x: 0, y: 0 });
  const [clicked, setClicked] = useState(false);
  const [linkHovered, setLinkHovered] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  const springConfig = { stiffness: 300, damping: 25 };
  const cursorX = useSpring(useMotionValue(0), springConfig);
  const cursorY = useSpring(useMotionValue(0), springConfig);

  useEffect(() => {
    // Sprawdzamy czy urządzenie jest mobilne tylko raz przy inicjalizacji
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    // Jeśli mobilne, nie inicjalizujemy kursora w ogóle
    if (window.innerWidth < 768) return;

    const onMouseMove = (e: MouseEvent) => {
      cursorPosition.set({ x: e.clientX, y: e.clientY });
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
    };

    const onMouseDown = () => setClicked(true);
    const onMouseUp = () => setClicked(false);
    const onMouseLeave = () => setHidden(true);
    const onMouseEnter = () => setHidden(false);

    const setupLinkHoverListeners = () => {
      const interactiveElements = document.querySelectorAll(
        'a, button, [role="button"], .interactive, input, select, textarea'
      );

      for (const el of interactiveElements) {
        el.addEventListener("mouseenter", () => setLinkHovered(true));
        el.addEventListener("mouseleave", () => setLinkHovered(false));
      }
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseenter", onMouseEnter);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);

    // Obserwujemy elementy dopiero po pełnym załadowaniu strony
    window.addEventListener("load", setupLinkHoverListeners);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseenter", onMouseEnter);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("resize", checkIfMobile);
      window.removeEventListener("load", setupLinkHoverListeners);
    };
  }, [cursorPosition, cursorX, cursorY]);

  // Nie renderujemy komponentu na urządzeniach mobilnych
  if (isMobile) return null;

  return (
    <motion.div
      ref={cursorRef}
      className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-50 mix-blend-difference"
      style={{
        x: cursorX,
        y: cursorY,
      }}
      animate={{
        scale: clicked ? 0.8 : linkHovered ? 1.5 : 1,
        opacity: hidden ? 0 : 1,
        backgroundColor: "#ffffff",
      }}
      transition={{
        type: "spring",
        mass: 0.3,
        stiffness: 200,
        damping: 20,
      }}
    />
  );
};

// Smooth scroll manager
export const SmoothScroll: React.FC<{
  children: React.ReactNode;
  offset?: number;
}> = ({ children, offset = 80 }) => {
  useEffect(() => {
    // Skip on mobile devices
    if (typeof window !== "undefined" && window.innerWidth < 768) return;

    // Function to handle smooth scrolling when clicking anchor links
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]');

      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      e.preventDefault();
      const element = document.querySelector(href);
      if (!element) return;

      window.scrollTo({
        top: element.getBoundingClientRect().top + window.pageYOffset - offset,
        behavior: "smooth",
      });
    };

    document.addEventListener("click", handleAnchorClick);
    return () => {
      document.removeEventListener("click", handleAnchorClick);
    };
  }, [offset]);

  return <>{children}</>;
};

// Animated section with fade-in and slide-up effect
export const AnimatedSection: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
  threshold?: number;
}> = ({ children, className = "", delay = 0, threshold = 0.1 }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.215, 0.61, 0.355, 1], // Cubic bezier dla płynniejszej animacji
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Text gradient animation
export const GradientText: React.FC<{
  children: React.ReactNode;
  className?: string;
  from?: string;
  via?: string;
  to?: string;
}> = ({
  children,
  className = "",
  from = "blue-600",
  via = "purple-600",
  to = "pink-600",
}) => {
  const bgClasses = useMemo(
    () =>
      `bg-gradient-to-r from-${from} via-${via} to-${to} bg-clip-text text-transparent inline-block`,
    [from, via, to]
  );

  return (
    <motion.div
      className={twMerge(bgClasses, className)}
      animate={{
        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
      }}
      transition={{
        duration: 15,
        repeat: Number.POSITIVE_INFINITY,
        ease: "linear",
      }}
    >
      {children}
    </motion.div>
  );
};

// Enhanced card component with 3D tilt effect
export const TiltCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  tiltAmount?: number;
  glareOpacity?: number;
  disabled?: boolean;
}> = ({
  children,
  className = "",
  tiltAmount = 20,
  glareOpacity = 0.2,
  disabled = false,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  // Tworzymy transformację zawsze, a nie tylko gdy hover
  const rotateYDegrees = useTransform(
    rotateY,
    [-tiltAmount, tiltAmount],
    ["-60deg", "60deg"]
  );

  const glareBackground = useMotionTemplate`linear-gradient(
    ${rotateYDegrees},
    rgba(255, 255, 255, ${glareOpacity}) 0%,
    rgba(255, 255, 255, 0) 80%
  )`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || disabled) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    const maxRotation = tiltAmount;
    const newRotateY = (mouseX / (rect.width / 2)) * maxRotation;
    const newRotateX = -(mouseY / (rect.height / 2)) * maxRotation;

    rotateX.set(newRotateX);
    rotateY.set(newRotateY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
  };

  // Sprawdzamy czy efekt powinien być aktywny
  useEffect(() => {
    if (
      disabled ||
      (typeof window !== "undefined" && window.innerWidth < 768)
    ) {
      rotateX.set(0);
      rotateY.set(0);
    }
  }, [disabled, rotateX, rotateY]);

  return (
    <motion.div
      ref={cardRef}
      className={twMerge("perspective-1000", className)}
      style={{
        transformStyle: "preserve-3d",
      }}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{
          rotateX: useSpring(rotateX, { stiffness: 300, damping: 30 }),
          rotateY: useSpring(rotateY, { stiffness: 300, damping: 30 }),
          transformStyle: "preserve-3d",
        }}
      >
        {children}

        {/* Glare effect - only rendered when hovered */}
        <AnimatePresence>
          {isHovered && !disabled && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 rounded-lg pointer-events-none"
              style={{
                background: glareBackground,
                transformStyle: "preserve-3d",
              }}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

// Scroll progress indicator
export const ScrollProgress: React.FC<{
  color?: string;
  height?: number;
  zIndex?: number;
}> = ({
  color = "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500",
  height = 2,
  zIndex = 50,
}) => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className={`fixed top-0 left-0 right-0 ${color}`}
      style={{
        scaleX,
        height,
        zIndex,
        transformOrigin: "left",
      }}
    />
  );
};

// Enhanced text reveal animation
export const RevealText: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  threshold?: number;
}> = ({
  children,
  className = "",
  delay = 0,
  direction = "up",
  threshold = 0.1,
}) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold,
  });

  // Określamy wartości początkowe i końcowe w zależności od kierunku
  const getInitialAndTargetValue = () => {
    switch (direction) {
      case "down":
        return { initial: -20, target: 0 };
      case "left":
        return { initial: 20, target: 0, axis: "x" };
      case "right":
        return { initial: -20, target: 0, axis: "x" };
      default:
        return { initial: 20, target: 0 };
    }
  };

  const { initial, target, axis = "y" } = getInitialAndTargetValue();

  const initialStyles = {
    opacity: 0,
    [axis]: initial,
  };

  const targetStyles = {
    opacity: 1,
    [axis]: target,
  };

  return (
    <motion.div
      ref={ref}
      className={twMerge("overflow-hidden", className)}
      initial={initialStyles}
      animate={inView ? targetStyles : initialStyles}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.215, 0.61, 0.355, 1],
      }}
    >
      {children}
    </motion.div>
  );
};

// Animated counter for statistics
export const AnimatedCounter: React.FC<{
  from: number;
  to: number;
  duration?: number;
  formatter?: (value: number) => string;
  className?: string;
  threshold?: number;
}> = ({
  from,
  to,
  duration = 2,
  formatter = (value) => Math.round(value).toString(),
  className = "",
  threshold = 0.5,
}) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold,
  });

  const count = useMotionValue(from);
  const rounded = useTransform(count, (latest) => formatter(latest));

  useEffect(() => {
    if (inView) {
      const controls = framerAnimate(count, to, {
        duration,
        ease: "easeOut",
      });

      return controls.stop;
    }
  }, [count, to, inView, duration]);

  return (
    <motion.span ref={ref} className={className}>
      {rounded}
    </motion.span>
  );
};

// Enhanced button with hover and click effects
export const EnhancedButton: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  disabled?: boolean;
  ariaLabel?: string;
  href?: string;
  type?: "button" | "submit" | "reset";
}> = ({
  children,
  className = "",
  onClick,
  variant = "primary",
  disabled = false,
  ariaLabel,
  href,
  type = "button",
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "primary":
        return "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md";
      case "secondary":
        return "bg-gray-800 hover:bg-gray-700 text-white shadow-sm";
      case "outline":
        return "bg-transparent border border-gray-700 hover:bg-gray-800/30 text-white backdrop-blur-sm";
      case "ghost":
        return "bg-transparent hover:bg-gray-800/30 text-white";
      default:
        return "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md";
    }
  };

  const baseClasses = twMerge(
    "px-6 py-3 rounded-lg font-medium transition-all",
    getVariantClasses(),
    disabled && "opacity-50 cursor-not-allowed pointer-events-none",
    className
  );

  const buttonProps = {
    className: baseClasses,
    onClick: disabled ? undefined : onClick,
    disabled,
    "aria-label": ariaLabel,
    whileHover: disabled ? {} : { scale: 1.03 },
    whileTap: disabled ? {} : { scale: 0.97 },
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 15,
    },
  };

  // Zwracamy link jeśli jest href, w przeciwnym razie button
  if (href) {
    return (
      <motion.a href={href} {...buttonProps}>
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button type={type} {...buttonProps}>
      {children}
    </motion.button>
  );
};

// Floating elements with parallax effect
export const ParallaxFloat: React.FC<{
  children: React.ReactNode;
  className?: string;
  offset?: number;
  speed?: number;
  disabled?: boolean;
}> = ({
  children,
  className = "",
  offset = 20,
  speed = 1,
  disabled = false,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  // Create a constant zero motion value for when disabled
  const zeroMotionValue = useMotionValue(0);

  // Calculate the movement with the speed factor
  const moveX = useTransform(
    mouseX,
    [-1, 1],
    [-offset * speed, offset * speed]
  );
  const moveY = useTransform(
    mouseY,
    [-1, 1],
    [-offset * speed, offset * speed]
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (
      disabled ||
      (typeof window !== "undefined" && window.innerWidth < 768)
    ) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;

      const { clientX, clientY } = e;
      const { width, height, left, top } = ref.current.getBoundingClientRect();

      const x = (clientX - left - width / 2) / (width / 2);
      const y = (clientY - top - height / 2) / (height / 2);

      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mouseX, mouseY, disabled, speed]);

  const springConfig = { stiffness: 100, damping: 30 };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        x: useSpring(disabled ? zeroMotionValue : moveX, springConfig),
        y: useSpring(disabled ? zeroMotionValue : moveY, springConfig),
      }}
    >
      {children}
    </motion.div>
  );
};

// Enhanced section divider with modern design
export const SectionDivider: React.FC<{
  className?: string;
  dotColor?: string;
  lineColor?: string;
  dotSize?: number;
}> = ({
  className = "",
  dotColor = "bg-blue-500",
  lineColor = "from-transparent via-gray-700 to-transparent",
  dotSize = 3,
}) => {
  return (
    <div className={twMerge("relative h-24", className)}>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`w-full h-px bg-gradient-to-r ${lineColor}`} />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-gray-900 px-4 py-2 rounded-full">
          <motion.div
            className={`w-${dotSize} h-${dotSize} ${dotColor} rounded-full`}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        </div>
      </div>
    </div>
  );
};

// Floating navigation with accessibility improvements
export const FloatingNav: React.FC<{
  items: { label: string; href: string; icon?: React.ReactNode }[];
  className?: string;
  showAfter?: number;
  position?: "bottom" | "top";
}> = ({ items, className = "", showAfter = 500, position = "bottom" }) => {
  const [activeSection, setActiveSection] = useState("");
  const [visible, setVisible] = useState(false);

  // Użycie useMemo zapobiega zbędnym re-renderom
  const positionClasses = useMemo(() => {
    return position === "top"
      ? "top-8 left-1/2 transform -translate-x-1/2"
      : "bottom-8 left-1/2 transform -translate-x-1/2";
  }, [position]);

  useEffect(() => {
    const handleScroll = () => {
      // Show the nav after scrolling down
      if (window.scrollY > showAfter) {
        setVisible(true);
      } else {
        setVisible(false);
      }

      // Determine active section
      const sections = items.map((item) => item.href.substring(1));

      // Odwracamy sekcje aby znaleźć najwyższą widoczną (najbliższą góry)
      const visibleSections = sections.filter((section) => {
        const element = document.getElementById(section);
        if (!element) return false;

        const rect = element.getBoundingClientRect();
        return rect.top <= 100 && rect.bottom >= 0;
      });

      if (visibleSections.length > 0) {
        setActiveSection(visibleSections[0]);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Wywołujemy raz na początku aby ustawić aktywną sekcję
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [items, showAfter]);

  return (
    <motion.nav
      className={twMerge(`fixed z-40 ${positionClasses}`, className)}
      initial={{ y: position === "top" ? -100 : 100, opacity: 0 }}
      animate={{
        y: visible ? 0 : position === "top" ? -100 : 100,
        opacity: visible ? 1 : 0,
      }}
      transition={{ duration: 0.3 }}
      aria-label="Nawigacja strony"
    >
      <motion.div
        className="bg-gray-800/80 backdrop-blur-sm rounded-full p-2 border border-gray-700/50 shadow-lg"
        layout
      >
        <div className="flex items-center space-x-1">
          {items.map((item) => {
            const isActive = activeSection === item.href.substring(1);
            return (
              <motion.a
                key={item.href}
                href={item.href}
                className={twMerge(
                  "relative px-4 py-2 rounded-full flex items-center justify-center text-sm transition-colors",
                  isActive ? "text-white" : "text-gray-400 hover:text-white"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-current={isActive ? "page" : undefined}
              >
                {isActive && (
                  <motion.div
                    className="absolute inset-0 bg-blue-600/20 rounded-full"
                    layoutId="navIndicator"
                    transition={{ type: "spring", damping: 20, stiffness: 300 }}
                  />
                )}
                <span className="relative z-10 flex items-center">
                  {item.icon && <span className="mr-2">{item.icon}</span>}
                  {item.label}
                </span>
              </motion.a>
            );
          })}
        </div>
      </motion.div>
    </motion.nav>
  );
};

// Nowy komponent - Podświetlanie tekstu
export const HighlightText: React.FC<{
  children: React.ReactNode;
  color?: string;
  delay?: number;
  className?: string;
}> = ({ children, color = "bg-blue-500/10", delay = 0, className = "" }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.span
      ref={ref}
      className={twMerge("relative inline-block", className)}
    >
      <motion.span className="relative z-10">{children}</motion.span>
      <motion.span
        className={`absolute bottom-0 left-0 right-0 h-[30%] ${color} rounded-sm -z-0`}
        initial={{ width: 0 }}
        animate={inView ? { width: "100%" } : {}}
        transition={{ duration: 0.6, delay, ease: "easeOut" }}
      />
    </motion.span>
  );
};

// Nowy komponent - AnimatedGradientBorder
export const AnimatedGradientBorder: React.FC<{
  children: React.ReactNode;
  className?: string;
  borderColor?: string;
  borderWidth?: number;
  rounded?: string;
  glowEffect?: boolean;
}> = ({
  children,
  className = "",
  borderColor = "from-blue-500 via-purple-500 to-pink-500",
  borderWidth = 2,
  rounded = "rounded-lg",
  glowEffect = true,
}) => {
  return (
    <div className={twMerge("relative p-[3px]", rounded, className)}>
      <div
        className="absolute inset-0 bg-gradient-to-r animate-gradient-slow rounded-[inherit]"
        style={{
          backgroundSize: "200% 100%",
          padding: borderWidth,
        }}
      >
        <div
          className={`absolute inset-0 ${borderColor} rounded-[inherit] ${
            glowEffect ? "blur-sm opacity-50" : ""
          }`}
        />
      </div>
      <div className="relative bg-gray-900 h-full w-full rounded-[inherit] overflow-hidden">
        {children}
      </div>

      {/* Styl dla animacji gradientu */}
      <style jsx global>{`
        @keyframes gradientSlow {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient-slow {
          animation: gradientSlow 8s ease infinite;
        }
      `}</style>
    </div>
  );
};
