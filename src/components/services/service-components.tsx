"use client";

import { type FC, useRef, useEffect, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useSpring,
} from "framer-motion";
import { Search, X, ChevronRight, Layers, Sparkles } from "lucide-react";
import { Neo3DCard, HolographicPanel } from "@/components/3d-elements";
import {
  GlassBadge,
  GlowButton,
  InteractiveLine,
} from "@/components/enhanced-ui";
import type { ServiceCategory } from "./types";
import { filterGroupsByColor } from "./utils";
import { useKeyPress } from "./hooks/useKeyPress";

interface TagProps {
  label: string;
  color: string;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  interactive?: boolean;
}

interface ServiceCardProps {
  service: ServiceCategory;
  index: number;
  onClick: () => void;
}

interface ServiceDetailModalProps {
  service: ServiceCategory;
  onClose: () => void;
}

interface AdvancedSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

interface FilterTabsProps {
  tags: string[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

/**
 * Komponent etykiety technologicznej z efektem szkła
 */
export const TechTag: FC<TagProps> = ({
  label,
  color,
  size = "sm",
  onClick,
  interactive = false,
}) => {
  // Dynamiczne klasy w zależności od rozmiaru
  const sizeClasses = {
    sm: "px-2.5 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-base",
  };

  // Animacje dla interaktywnych tagów
  const interactiveStyles = interactive
    ? "cursor-pointer hover:scale-105 active:scale-95 transition-transform"
    : "";

  return (
    <motion.span
      className={`rounded-full backdrop-blur-md font-light inline-flex items-center ${sizeClasses[size]} ${interactiveStyles}`}
      style={{
        backgroundColor: `${color}15`,
        color,
        borderWidth: "1px",
        borderColor: `${color}30`,
      }}
      whileHover={interactive ? { y: -2 } : {}}
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {interactive && <Sparkles size={12} className="mr-1.5 opacity-80" />}
      {label}
    </motion.span>
  );
};

/**
 * Zaawansowana karta usługi z efektami 3D i interaktywnymi animacjami
 */
export const TechServiceCard: FC<ServiceCardProps> = ({
  service,
  index,
  onClick,
}) => {
  // Animacja przy najechaniu
  const [isHovered, setIsHovered] = useState(false);

  // Dynamiczne kolory na podstawie schematu usługi
  const colorGroup = filterGroupsByColor(service.color);

  // Animacja gradientu w tle
  const gradientAngle = useMotionValue(135);
  const springGradient = useSpring(gradientAngle, {
    stiffness: 100,
    damping: 30,
  });

  useEffect(() => {
    if (isHovered) {
      gradientAngle.set(165);
    } else {
      gradientAngle.set(135);
    }
  }, [isHovered, gradientAngle]);

  // Dynamiczny styl gradientu
  const gradientStyle = useTransform(
    springGradient,
    (angle) =>
      `linear-gradient(${angle}deg, ${colorGroup.from} 0%, ${colorGroup.to} 100%)`
  );

  // Animacje dla karty
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        delay: index * 0.1,
        duration: 0.6,
        stiffness: 100,
        damping: 20,
      },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Neo3DCard
        depth={isHovered ? 15 : 8}
        onClick={onClick}
        className="h-80 cursor-pointer"
        hoverEffect="levitate"
        shadowColor={colorGroup.shadow}
        lightReflection={true}
      >
        {/* Background gradient with dynamic animation */}
        <motion.div
          className="absolute inset-0 rounded-xl opacity-20 mix-blend-multiply"
          style={{ background: gradientStyle }}
        />

        {/* Glowing border on hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="absolute inset-0 rounded-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                boxShadow: `0 0 15px ${colorGroup.glow}`,
                zIndex: -1,
              }}
            />
          )}
        </AnimatePresence>

        {/* Card content */}
        <div className="relative z-10 h-full flex flex-col justify-between p-6 text-white">
          <div>
            {/* Icon with enhanced effects */}
            <motion.div
              className="bg-white/10 backdrop-blur-md p-3 rounded-full inline-block mb-5"
              initial={{ rotate: 0 }}
              animate={{ rotate: isHovered ? 5 : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <service.icon
                size={22}
                className="text-white"
                strokeWidth={1.5}
              />
            </motion.div>

            {/* Title with eleganter typography */}
            <motion.h3
              className="text-xl font-light mb-3 tracking-tight"
              animate={{ x: isHovered ? 3 : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              {service.title}
            </motion.h3>

            {/* Description with improved readability */}
            <p className="text-slate-200/90 leading-relaxed text-sm font-light">
              {service.description}
            </p>
          </div>

          {/* Tags with hover animation */}
          <div className="flex flex-wrap gap-2 mt-4">
            {service.tags.slice(0, 3).map((tag, i) => (
              <motion.div
                key={tag}
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { delay: i * 0.1 + 0.2 },
                }}
              >
                <TechTag label={tag} color={colorGroup.from} />
              </motion.div>
            ))}
            {service.tags.length > 3 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { delay: 0.5 },
                }}
              >
                <TechTag
                  label={`+${service.tags.length - 3}`}
                  color={colorGroup.to}
                />
              </motion.div>
            )}
          </div>

          {/* Enhanced details button */}
          <motion.div
            className="flex items-center space-x-1.5 text-sm mt-5 text-white/80 group"
            initial={{ x: 0 }}
            animate={{ x: isHovered ? 3 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <span className="font-light">Poznaj szczegóły</span>
            <motion.div
              animate={{ x: isHovered ? 5 : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <ChevronRight size={16} className="text-white/70" />
            </motion.div>
          </motion.div>
        </div>
      </Neo3DCard>
    </motion.div>
  );
};

/**
 * Zaawansowany modal ze szczegółami usługi
 */
export const ServiceDetailModal: FC<ServiceDetailModalProps> = ({
  service,
  onClose,
}) => {
  // Wydzielamy kolor bez gradientu
  const colorGroup = filterGroupsByColor(service.color);

  // Obsługa zamykania przez ESC
  useKeyPress("Escape", onClose);

  // Refs dla dostępności
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Efekty dla zarządzania focusem
  useEffect(() => {
    // Focus na przycisku zamykania
    closeButtonRef.current?.focus();

    // Blokada scrollowania
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // Animacje modalu
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      transition: { delay: 0.2, duration: 0.3 },
    },
  };

  const modalVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
      },
    },
    exit: {
      opacity: 0,
      y: -50,
      scale: 0.95,
      transition: { duration: 0.3 },
    },
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={onClose}
        aria-modal="true"
        aria-labelledby={`service-detail-${service.id}`}
      >
        <motion.div
          ref={modalRef}
          className="w-full max-w-4xl max-h-[90vh]"
          variants={modalVariants}
          onClick={(e) => e.stopPropagation()}
        >
          <HolographicPanel
            variant="premium"
            borderColor={colorGroup.from}
            glowEffect={true}
            layered={true}
          >
            {/* Header */}
            <div className="p-7 border-b border-slate-700/30 backdrop-blur-md">
              <div className="flex items-center space-x-5">
                <motion.div
                  className="p-3.5 bg-white/10 backdrop-blur-md rounded-full"
                  initial={{ rotate: -5 }}
                  animate={{ rotate: 0 }}
                  transition={{ type: "spring", stiffness: 150, damping: 15 }}
                >
                  <service.icon
                    size={26}
                    className="text-white"
                    strokeWidth={1.5}
                  />
                </motion.div>
                <h2
                  id={`service-detail-${service.id}`}
                  className="text-2xl font-light text-white tracking-tight"
                >
                  {service.title}
                </h2>
              </div>
            </div>

            {/* Scrollable content area */}
            <div className="p-7 overflow-y-auto max-h-[calc(80vh-150px)]">
              <p className="text-slate-300 mb-8 text-base leading-relaxed font-light">
                {service.longDescription}
              </p>

              {/* Tags with enhanced visual */}
              <div className="flex flex-wrap gap-2.5 mb-10">
                {service.tags.map((tag, idx) => (
                  <motion.div
                    key={tag}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05, duration: 0.3 }}
                  >
                    <TechTag label={tag} color={colorGroup.from} size="md" />
                  </motion.div>
                ))}
              </div>

              {/* Key features with interactive animations */}
              <div className="mb-4">
                <div className="flex items-center mb-6">
                  <Layers size={18} className="text-indigo-400 mr-3" />
                  <h3 className="text-lg font-normal text-white tracking-tight">
                    Kluczowe cechy
                  </h3>
                </div>

                <InteractiveLine color={colorGroup.from} className="mb-8" />

                <ul className="space-y-4">
                  {service.bulletPoints.map((point, index) => (
                    <motion.li
                      key={`${service.id}-point-${index}`}
                      className="flex items-start space-x-3.5 text-slate-300"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div
                        className="mt-1 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${colorGroup.from}90` }}
                      >
                        <motion.svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: 1, opacity: 1 }}
                          transition={{
                            delay: index * 0.1 + 0.2,
                            duration: 0.6,
                          }}
                        >
                          <title>Checkmark</title>
                          <motion.path
                            d="M20 6L9 17L4 12"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </motion.svg>
                      </div>
                      <span className="leading-relaxed text-sm">{point}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Footer with close button */}
            <div className="p-5 border-t border-slate-700/30 backdrop-blur-md">
              <div className="flex justify-end">
                <GlowButton
                  ref={closeButtonRef}
                  variant="outline"
                  size="md"
                  glowColor={colorGroup.glow}
                  onClick={onClose}
                >
                  <X size={14} className="mr-2" />
                  <span>Zamknij</span>
                </GlowButton>
              </div>
            </div>
          </HolographicPanel>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/**
 * Zaawansowane pole wyszukiwania z animacjami
 */
export const AdvancedSearchBar: FC<AdvancedSearchBarProps> = ({
  value,
  onChange,
  className = "",
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{
          boxShadow: isFocused
            ? "0 0 0 2px rgba(99, 102, 241, 0.3), 0 4px 10px rgba(0, 0, 0, 0.1)"
            : "0 0 0 1px rgba(99, 102, 241, 0.1), 0 2px 5px rgba(0, 0, 0, 0.05)",
        }}
        transition={{ duration: 0.2 }}
      />

      <input
        type="text"
        placeholder="Szukaj usług, technologii..."
        className="w-full px-5 py-3 bg-slate-900/40 rounded-full border border-slate-700/50 
                focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 
                outline-none transition-all text-slate-200 backdrop-blur-md text-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        aria-label="Szukaj usług"
      />

      <div className="absolute right-4 top-3 text-slate-400">
        <Search size={18} className={isFocused ? "text-indigo-400" : ""} />
      </div>

      {/* Animacja podświetlenia podczas wpisywania */}
      {value && (
        <motion.div
          className="absolute inset-0 rounded-full border border-indigo-500/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}
    </motion.div>
  );
};

/**
 * Zakładki filtrowania z efektem glassmorphism
 */
export const FilterTabs: FC<FilterTabsProps> = ({
  tags,
  activeFilter,
  onFilterChange,
}) => {
  // Zwracamy wszystkie filtry łącznie z "Wszystkie"
  const allFilters = ["Wszystkie", ...tags.slice(0, 5)];

  return (
    <motion.div
      className="flex flex-wrap gap-2.5 justify-center"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      {allFilters.map((filter) => {
        const isActive =
          filter === activeFilter ||
          (filter === "Wszystkie" && activeFilter === "");
        const color = isActive ? "#6366f1" : "#94a3b8";

        return (
          <GlassBadge
            key={filter}
            label={filter}
            isActive={isActive}
            onClick={() => onFilterChange(filter === "Wszystkie" ? "" : filter)}
            glowEffect={isActive}
            glowColor="rgba(99, 102, 241, 0.3)"
          />
        );
      })}
    </motion.div>
  );
};
