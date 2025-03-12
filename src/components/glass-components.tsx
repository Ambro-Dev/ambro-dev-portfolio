"use client";

import type React from "react";
import { useRef, useState } from "react";
import { motion, useSpring, useMotionValue, useTransform } from "framer-motion";
import { twMerge } from "tailwind-merge";
import { useInView } from "react-intersection-observer";

// Elegancki komponent karty ze szklanym efektem
export const GlassCard: React.FC<{
  id?: string;
  children: React.ReactNode;
  className?: string;
  blur?: "none" | "sm" | "md" | "lg"; // Poziom rozmycia
  opacity?: number; // Nieprzezroczystość od 0 do 100
  border?: boolean; // Czy ma obramowanie
  highlight?: boolean; // Czy dodać subtelny efekt połysku na górze
  shadow?: "none" | "sm" | "md" | "lg"; // Poziom cienia
}> = ({
  id,
  children,
  className = "",
  blur = "md",
  opacity = 20, // Domyślnie 20% nieprzezroczystości
  border = true,
  highlight = true,
  shadow = "sm",
}) => {
  // Walidacja parametrów
  const validOpacity = Math.max(0, Math.min(opacity, 100));
  const bgOpacity = validOpacity / 100;

  // Mapowanie parametrów do klas Tailwind
  const blurClass = blur !== "none" ? `backdrop-blur-${blur}` : "";
  const borderClass = border ? "border border-white/10" : "";
  const shadowClass =
    shadow === "none"
      ? ""
      : shadow === "sm"
      ? "shadow-sm"
      : shadow === "md"
      ? "shadow-md"
      : "shadow-lg";

  return (
    <div
      id={id}
      className={twMerge(
        "rounded-lg overflow-hidden",
        `bg-white/[${bgOpacity}] dark:bg-slate-900/[${bgOpacity}]`,
        blurClass,
        borderClass,
        shadowClass,
        className
      )}
    >
      {/* Subtelny efekt podświetlenia na górze */}
      {highlight && (
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      )}

      {/* Zawartość */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

// Zaawansowany komponent karty 3D z efektem szkła
export const Glass3DCard: React.FC<{
  id?: string;
  children: React.ReactNode;
  className?: string;
  depth?: number; // Głębokość efektu 3D (1-10)
  blurStrength?: number; // Siła rozmycia (1-10)
  hoverEffect?: boolean; // Czy reagować na hover
  lightReflection?: boolean; // Czy dodać efekt odbicia światła
}> = ({
  id,
  children,
  className = "",
  depth = 5,
  blurStrength = 4,
  hoverEffect = true,
  lightReflection = true,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  // Normalizacja parametrów
  const normalizedDepth = Math.max(1, Math.min(depth, 10)) / 10;
  const normalizedBlur = Math.max(1, Math.min(blurStrength, 10)) / 10;

  // Obliczanie efektu 3D w zależności od głębokości
  const tiltAmount = 5 * normalizedDepth;
  const blurAmount = normalizedBlur * 10;

  // Transformacja ruchu myszy na obrót
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !hoverEffect) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    // Obrót zależny od pozycji myszy i głębokości
    rotateX.set(-(mouseY / (rect.height / 2)) * tiltAmount);
    rotateY.set((mouseX / (rect.width / 2)) * tiltAmount);
  };

  // Reset obrotu po opuszczeniu
  const handleMouseLeave = () => {
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
  };

  // Spring dla płynnych przejść
  const springConfig = { stiffness: 150, damping: 15 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);

  // Efekt cienia zależny od pozycji - use individual transforms to avoid type issues
  const shadowX = useTransform(
    springRotateY,
    [-tiltAmount, tiltAmount],
    [-8, 8]
  );
  const shadowY = useTransform(
    springRotateX,
    [-tiltAmount, tiltAmount],
    [-8, 8]
  );

  // Create a derived MotionValue for shadow blur
  const shadowBlur = useTransform(springRotateX, (x) => {
    // We'll calculate the combined effect here
    const xVal = x;
    const yVal = springRotateY.get();
    return Math.sqrt(xVal * xVal + yVal * yVal) * 2 + 10;
  });

  // Create a derived MotionValue for the complete box shadow string
  const boxShadowTransform = useTransform(shadowX, (x) => {
    const y = shadowY.get();
    const blur = shadowBlur.get();
    return `${x}px ${y}px ${blur}px rgba(0, 0, 0, 0.1)`;
  });

  // Light reflection transforms - we need to move these from conditional execution
  const lightReflectionRotateX = useTransform(
    springRotateX,
    [-tiltAmount, tiltAmount],
    [15, -15]
  );

  const lightReflectionRotateY = useTransform(
    springRotateY,
    [-tiltAmount, tiltAmount],
    [-15, 15]
  );

  return (
    <motion.div
      id={id}
      ref={cardRef}
      className={twMerge("relative perspective-1200 rounded-lg", className)}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="w-full h-full rounded-lg overflow-hidden"
        style={{
          rotateX: springRotateX,
          rotateY: springRotateY,
          transformStyle: "preserve-3d",
          boxShadow: boxShadowTransform,
        }}
        whileHover={hoverEffect ? { scale: 1.02 } : {}}
        transition={{ type: "spring", damping: 15, stiffness: 200 }}
      >
        {/* Tło ze szklanym efektem */}
        <div
          className={twMerge(
            "absolute inset-0 rounded-lg border border-white/10",
            `backdrop-blur-[${blurAmount}px]`,
            "bg-gradient-to-b from-white/10 to-white/5 dark:from-slate-800/20 dark:to-slate-900/30"
          )}
        />

        {/* Subtelny efekt odbicia światła */}
        {lightReflection && (
          <motion.div
            className="absolute inset-0 rounded-lg overflow-hidden"
            style={{ opacity: isHovered ? 0.07 : 0.04 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-transparent"
              style={{
                rotateX: lightReflectionRotateX,
                rotateY: lightReflectionRotateY,
              }}
            />
          </motion.div>
        )}

        {/* Zawartość */}
        <div className="relative z-10 h-full">{children}</div>
      </motion.div>
    </motion.div>
  );
};

// Elegancki panel z efektem szkła i 3D
export const EliteGlassPanel: React.FC<{
  id?: string;
  children: React.ReactNode;
  className?: string;
  hoverEffect?: "none" | "float" | "glow" | "scale"; // Typ efektu po najechaniu
  variant?: "light" | "dark" | "frosted" | "blue" | "purple"; // Wariant kolorystyczny
  borderGradient?: boolean; // Czy dodać gradient na obramowaniu
  layered?: boolean; // Czy dodać efekt warstw
}> = ({
  id,
  children,
  className = "",
  hoverEffect = "glow",
  variant = "frosted",
  borderGradient = true,
  layered = false,
}) => {
  // Referencja w widoku do animacji wejścia
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Określenie stylów dla różnych wariantów
  const getVariantStyles = () => {
    switch (variant) {
      case "light":
        return "bg-white/10 backdrop-blur-md border-white/20";
      case "dark":
        return "bg-slate-900/30 backdrop-blur-md border-slate-700/30";
      case "blue":
        return "bg-indigo-950/10 backdrop-blur-md border-indigo-500/20";
      case "purple":
        return "bg-violet-950/10 backdrop-blur-md border-violet-500/20";
      default:
        return "bg-gradient-to-b from-white/10 to-white/5 dark:from-slate-900/20 dark:to-slate-950/30 backdrop-blur-md border-white/10 dark:border-slate-700/20";
    }
  };

  // Określenie efektów hover
  const getHoverStyles = () => {
    switch (hoverEffect) {
      case "float":
        return "transition-transform duration-300 hover:-translate-y-1";
      case "glow":
        return "transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] dark:hover:shadow-[0_0_15px_rgba(30,64,175,0.15)]";
      case "scale":
        return "transition-transform duration-300 hover:scale-[1.02]";
      default:
        return "";
    }
  };

  // Określenie stylu gradientu na obramowaniu
  const getBorderGradient = () => {
    if (!borderGradient) return "";

    if (variant === "blue") {
      return "before:absolute before:inset-0 before:p-[1px] before:rounded-lg before:content-[''] before:bg-gradient-to-b before:from-blue-400/30 before:to-indigo-500/10 before:-z-10";
    }

    if (variant === "purple") {
      return "before:absolute before:inset-0 before:p-[1px] before:rounded-lg before:content-[''] before:bg-gradient-to-b before:from-violet-400/30 before:to-purple-500/10 before:-z-10";
    }

    return "before:absolute before:inset-0 before:p-[1px] before:rounded-lg before:content-[''] before:bg-gradient-to-b before:from-white/30 before:to-white/10 dark:before:from-slate-500/30 dark:before:to-slate-700/10 before:-z-10";
  };

  return (
    <motion.div
      id={id}
      ref={ref}
      className={twMerge(
        "relative rounded-lg border overflow-hidden",
        getVariantStyles(),
        getHoverStyles(),
        getBorderGradient(),
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Subtelny efekt połysku na górze */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {/* Efekt warstw */}
      {layered && (
        <>
          <div className="absolute -bottom-1 -right-1 -left-1 h-full rounded-lg bg-slate-800/20 backdrop-blur-sm -z-10" />
          <div className="absolute -bottom-2 -right-2 -left-2 h-full rounded-lg bg-slate-800/10 backdrop-blur-sm -z-20" />
        </>
      )}

      {/* Zawartość */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

// Komponent z efektem pochylonej karty 3D
export const Tilt3DCard: React.FC<{
  id?: string;
  children: React.ReactNode;
  className?: string;
  bgColor?: string;
  perspective?: number; // 800-1500
  angle?: number; // 0-10
  depth?: number; // 0-50
  shadow?: boolean;
}> = ({
  id,
  children,
  className = "",
  bgColor = "bg-slate-900/90",
  perspective = 1000,
  angle = 5,
  depth = 15,
  shadow = true,
}) => {
  const wrapperStyles = {
    transform: `perspective(${perspective}px) rotateY(${angle}deg)`,
    transformStyle: "preserve-3d" as const,
  };

  // Obliczanie pozycji elementów na podstawie głębokości
  const depthValue = `${depth}px`;

  return (
    <div
      id={id}
      className={twMerge(
        "relative my-4",
        shadow ? "drop-shadow-xl" : "",
        className
      )}
      style={wrapperStyles}
    >
      {/* Główna karta */}
      <div
        className={twMerge(
          "rounded-lg overflow-hidden backdrop-blur-md border border-white/10",
          bgColor
        )}
      >
        {children}
      </div>

      {/* Warstwa głębi (w tyle) */}
      <div
        className="absolute top-0 left-0 w-full h-full rounded-lg bg-black/30"
        style={{
          transform: `translateZ(-${depthValue})`,
          transformStyle: "preserve-3d",
        }}
      />

      {/* Krawędzie łączące przód i tył */}
      <div
        className="absolute top-0 bottom-0 left-0 w-[1px] bg-gradient-to-b from-white/0 via-white/10 to-white/0"
        style={{
          transform: `translateZ(-${
            Number.parseInt(depthValue) / 2
          }px) rotateY(90deg)`,
          transformStyle: "preserve-3d",
        }}
      />

      <div
        className="absolute top-0 bottom-0 right-0 w-[1px] bg-gradient-to-b from-white/0 via-white/10 to-white/0"
        style={{
          transform: `translateZ(-${
            Number.parseInt(depthValue) / 2
          }px) rotateY(-90deg)`,
          transformStyle: "preserve-3d",
        }}
      />
    </div>
  );
};

// Komponent tworzący sekcję z neomorficznym efektem
export const NeoGlassSection: React.FC<{
  id?: string;
  children: React.ReactNode;
  className?: string;
  glow?: "none" | "subtle" | "medium" | "strong";
  variant?: "blue" | "purple" | "neutral";
  pattern?: boolean; // Dodaje subtelny wzór w tle
}> = ({
  id,
  children,
  className = "",
  glow = "subtle",
  variant = "blue",
  pattern = false,
}) => {
  // Określenie stylu poświaty
  const getGlowStyle = () => {
    switch (glow) {
      case "strong":
        return "0 0 25px";
      case "medium":
        return "0 0 15px";
      case "subtle":
        return "0 0 10px";
      default:
        return "none";
    }
  };

  // Określenie kolorów dla wariantów
  const getVariantColor = () => {
    switch (variant) {
      case "blue":
        return {
          bgFrom: "from-indigo-950/30",
          bgTo: "to-slate-950/40",
          glowColor: "rgba(30, 64, 175, 0.15)",
          border: "border-indigo-900/30",
        };
      case "purple":
        return {
          bgFrom: "from-violet-950/30",
          bgTo: "to-slate-950/40",
          glowColor: "rgba(91, 33, 182, 0.15)",
          border: "border-violet-900/30",
        };
      default:
        return {
          bgFrom: "from-slate-900/30",
          bgTo: "to-slate-950/40",
          glowColor: "rgba(30, 41, 59, 0.15)",
          border: "border-slate-800/30",
        };
    }
  };

  const { bgFrom, bgTo, glowColor, border } = getVariantColor();

  return (
    <div
      id={id}
      className={twMerge(
        "relative rounded-xl overflow-hidden backdrop-blur-md",
        "border",
        border,
        "bg-gradient-to-b",
        bgFrom,
        bgTo,
        className
      )}
      style={{
        boxShadow:
          glow !== "none" ? `${getGlowStyle()} ${glowColor}` : undefined,
      }}
    >
      {/* Subtelny blask na górze */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Wzór w tle jeśli włączony */}
      {pattern && (
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.15' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='1'/%3E%3Ccircle cx='13' cy='13' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      )}

      {/* Główna zawartość */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};
