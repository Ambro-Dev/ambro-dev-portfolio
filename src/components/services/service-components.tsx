"use client";

import type React from "react";
import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronRight, X } from "lucide-react";
import { Glass3DCard, EliteGlassPanel } from "@/components/glass-components";
import { Button } from "@/components/ui/button";
import type { ServiceCategory } from "./service-data";

interface TagProps {
  label: string;
  color: string;
}

interface ServiceCardProps {
  service: ServiceCategory;
  index: number;
  onClick: (id: string) => void;
}

interface ServiceDetailProps {
  service: ServiceCategory;
  onClose: () => void;
}

/**
 * Tag component for service categories
 */
export const Tag: React.FC<TagProps> = ({ label, color }) => {
  return (
    <span
      className="px-2.5 py-0.5 text-xs rounded-full backdrop-blur-sm font-light transition-colors"
      style={{
        backgroundColor: `${color}10`,
        color: color,
        borderWidth: "1px",
        borderColor: `${color}20`,
      }}
    >
      {label}
    </span>
  );
};

/**
 * Service card component with glass effect
 */
export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  index,
  onClick,
}) => {
  return (
    <Glass3DCard
      depth={3}
      blurStrength={3}
      lightReflection={true}
      className="h-72"
      hoverEffect={true}
    >
      <motion.div
        className="h-full cursor-pointer"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          delay: index * 0.08,
          ease: [0.22, 1, 0.36, 1],
        }}
        onClick={() => onClick(service.id)}
      >
        {/* Background gradient */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-20 mix-blend-multiply rounded-lg`}
        />

        {/* Card content */}
        <div className="relative z-10 h-full flex flex-col justify-between p-6 text-white">
          <div>
            {/* Icon with subtle effects */}
            <div className="bg-white/10 backdrop-blur-sm p-2.5 rounded-full inline-block mb-4">
              <service.icon
                size={22}
                className="text-white/80"
                strokeWidth={1.5}
              />
            </div>

            {/* Title with elegant typography */}
            <h3 className="text-lg font-light mb-2.5 tracking-tight">
              {service.title}
            </h3>

            {/* Description with improved readability */}
            <p className="text-slate-200/80 leading-relaxed text-sm font-light">
              {service.description}
            </p>
          </div>

          {/* Tags with subtle effects */}
          <div className="flex flex-wrap gap-1.5 mt-4">
            {service.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-xs rounded-full bg-white/10 backdrop-blur-sm font-light"
              >
                {tag}
              </span>
            ))}
            {service.tags.length > 3 && (
              <span className="px-2 py-0.5 text-xs rounded-full bg-white/10 backdrop-blur-sm font-light">
                +{service.tags.length - 3}
              </span>
            )}
          </div>

          {/* Details button */}
          <motion.div
            className="flex items-center space-x-1.5 text-xs mt-4 text-white/70 hover:text-white transition-colors group"
            whileHover={{ x: 3 }}
          >
            <span className="font-light">Poznaj szczegóły</span>
            <ChevronRight
              size={14}
              className="group-hover:translate-x-0.5 transition-transform"
            />
          </motion.div>
        </div>
      </motion.div>
    </Glass3DCard>
  );
};

/**
 * Service detail modal component
 */
export const ServiceDetail: React.FC<ServiceDetailProps> = ({
  service,
  onClose,
}) => {
  // Extract color without gradient
  const mainColor = service.color.split(" ")[1].replace(/\/.*$/, "");

  // Refs for accessibility
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Handle ESC key and focus management
  useEffect(() => {
    // Focus on close button
    closeButtonRef.current?.focus();

    // Handle ESC key press
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscKey);

    return () => {
      window.removeEventListener("keydown", handleEscKey);
    };
  }, [onClose]);

  return (
    <motion.dialog
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClose();
        }
      }}
      aria-modal="true"
      aria-labelledby={`service-detail-${service.id}`}
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.stopPropagation();
          }
        }}
        className="w-full max-w-3xl"
      >
        <EliteGlassPanel
          variant={service.id === "security" ? "purple" : "blue"}
          borderGradient={true}
          layered={true}
          className="relative w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-700/30">
            <div className="flex items-center space-x-4">
              <div className="p-2.5 bg-white/10 backdrop-blur-sm rounded-full">
                <service.icon
                  size={24}
                  className="text-white/90"
                  strokeWidth={1.5}
                />
              </div>
              <h2
                id={`service-detail-${service.id}`}
                className="text-xl font-light text-white tracking-tight"
              >
                {service.title}
              </h2>
            </div>
          </div>

          {/* Content area with scrolling */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
            <p className="text-slate-300 mb-6 text-base leading-relaxed font-light">
              {service.longDescription}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {service.tags.map((tag) => (
                <Tag key={tag} label={tag} color={mainColor} />
              ))}
            </div>

            {/* Bullet points */}
            <h3 className="text-base font-normal text-white mb-4 tracking-tight">
              Kluczowe cechy:
            </h3>
            <ul className="space-y-3">
              {service.bulletPoints.map((point, index) => (
                <motion.li
                  key={`${service.id}-point-${index}`}
                  className="flex items-start space-x-3 text-slate-300 text-sm"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08 }}
                >
                  <div
                    className="mt-1 flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${mainColor}80` }}
                  >
                    <motion.svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: index * 0.08 + 0.2, duration: 0.4 }}
                    >
                      <title>Key point</title>
                      <motion.path
                        d="M20 6L9 17L4 12"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </motion.svg>
                  </div>
                  <span className="leading-relaxed font-light">{point}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Footer with close button */}
          <div className="p-4 border-t border-slate-700/30 backdrop-blur-sm">
            <div className="flex justify-end">
              <Button
                ref={closeButtonRef}
                variant="outline"
                size="sm"
                className="px-4 border-slate-700/50 hover:bg-slate-800/50 text-slate-200"
                onClick={onClose}
              >
                <X size={14} className="mr-2" />
                <span>Zamknij</span>
              </Button>
            </div>
          </div>
        </EliteGlassPanel>
      </div>
    </motion.dialog>
  );
};

/**
 * Search component for filtering services
 */
export const ServiceSearch: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => {
  return (
    <div className="mb-10 max-w-md mx-auto">
      <div className="relative">
        <input
          type="text"
          placeholder="Szukaj usług, technologii..."
          className="w-full px-5 py-2.5 bg-slate-900/30 rounded-full border border-slate-700/30 
                     focus:border-indigo-500/30 focus:ring-1 focus:ring-indigo-500/20 
                     outline-none transition-all text-slate-200 backdrop-blur-sm text-sm"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label="Szukaj usług"
        />
        <div className="absolute right-4 top-2.5 text-slate-400">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <title>Search</title>
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
      </div>
    </div>
  );
};
