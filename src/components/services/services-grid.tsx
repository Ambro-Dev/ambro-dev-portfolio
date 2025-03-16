// src/components/services-grid.tsx
"use client";

import { useState, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";
import { TiltCard } from "@/components/ambro-ui/tilt-card";
import { GradientText } from "@/components/ambro-ui/gradient-text";
import type { SerializableService } from "@/lib/service-utils";

// Dynamically import the 3D canvas component with no SSR to avoid hydration issues
// and only load the heavy 3D library when needed
const ServiceCardCanvas = dynamic(
  () => import("@/components/3d/service-card-canvas"),
  {
    ssr: false,
    loading: () => (
      <div className="w-16 h-16 rounded-full bg-gray-800/50 animate-pulse" />
    ),
  }
);

interface ServicesGridProps {
  services: SerializableService[];
}

// Create a memoized card component to prevent unnecessary re-renders
const ServiceCard = memo(
  ({
    service,
    index,
    isHovered,
    onHoverStart,
    onHoverEnd,
  }: {
    service: SerializableService;
    index: number;
    isHovered: boolean;
    onHoverStart: () => void;
    onHoverEnd: () => void;
  }) => {
    // Animation variants for cards
    const cardVariants = {
      hidden: { opacity: 0, y: 50 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          delay: 0.1 * index,
          duration: 0.5,
          ease: [0.43, 0.13, 0.23, 0.96],
        },
      },
      hover: {
        y: -10,
        transition: { duration: 0.3, ease: "easeOut" },
      },
    };

    // Extract the primary color from the gradient string
    const primaryColor = service.color.split(" ")[0].replace("from-", "");

    return (
      <motion.div
        custom={index}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        onHoverStart={onHoverStart}
        onHoverEnd={onHoverEnd}
        className="h-full"
        layout
      >
        <Link
          href={`/uslugi/${service.id}`}
          className="block h-full"
          aria-label={`Zobacz usługę: ${service.title}`}
        >
          <TiltCard
            className="h-full"
            tiltAmount={10}
            glareOpacity={0.2}
            borderGlow
            borderColor={`rgba(${
              primaryColor === "indigo"
                ? "99, 102, 241"
                : primaryColor === "emerald"
                ? "16, 185, 129"
                : primaryColor === "pink"
                ? "236, 72, 153"
                : primaryColor === "purple"
                ? "168, 85, 247"
                : primaryColor === "blue"
                ? "37, 99, 235"
                : "99, 102, 241"
            }, ${isHovered ? 0.6 : 0.4})`}
            backgroundEffect="gradient"
          >
            <div className="p-6 h-full flex flex-col relative overflow-hidden">
              {/* 3D Icon element using R3F - conditionally rendered when hovered or visible */}
              <div className="w-16 h-16 mb-6">
                <ServiceCardCanvas
                  serviceId={service.id}
                  isHovered={isHovered}
                  color={primaryColor}
                />
              </div>

              <h3 className="text-xl font-bold mb-3">
                <GradientText
                  preset={
                    service.id.includes("ai") || service.id.includes("ml")
                      ? "ai"
                      : service.id.includes("cloud") ||
                        service.id.includes("deploy")
                      ? "devops"
                      : service.id.includes("data")
                      ? "data"
                      : "tech"
                  }
                  glowEffect
                  glowPreset="medium"
                  fontWeight="bold"
                  pauseOnHover
                >
                  {service.title}
                </GradientText>
              </h3>

              <p className="text-gray-400 mb-6">{service.description}</p>

              <div className="mt-auto">
                <h4 className="text-sm uppercase text-gray-500 mb-2">
                  Technologie
                </h4>
                <div className="flex flex-wrap gap-2">
                  {service.tags.slice(0, 3).map((tag, tagIndex) => (
                    <span
                      key={`${service.id}-tag-${tagIndex}`}
                      className="px-3 py-1 text-xs rounded-full bg-gray-800 text-gray-300 border border-gray-700"
                    >
                      {tag}
                    </span>
                  ))}
                  {service.tags.length > 3 && (
                    <span className="px-3 py-1 text-xs rounded-full bg-gray-800 text-gray-300 border border-gray-700">
                      +{service.tags.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Animated arrow indicator on hover - using AnimatePresence for better performance */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    className="absolute bottom-4 right-4 text-indigo-400"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <title>Find out more</title>
                      <path d="M5 12h13M12 5l7 7-7 7" />
                    </svg>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </TiltCard>
        </Link>
      </motion.div>
    );
  }
);

// Prevent missing display name ESLint warning
ServiceCard.displayName = "ServiceCard";

const ServicesGrid = ({ services }: ServicesGridProps) => {
  const [hoveredService, setHoveredService] = useState<string | null>(null);

  // Use useCallback for event handlers to prevent recreating functions on every render
  const handleHoverStart = useCallback((serviceId: string) => {
    setHoveredService(serviceId);
  }, []);

  const handleHoverEnd = useCallback(() => {
    setHoveredService(null);
  }, []);

  return (
    <div
      className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
      aria-label="Dostępne usługi"
    >
      {services.map((service, index) => (
        <ServiceCard
          key={service.id}
          service={service}
          index={index}
          isHovered={hoveredService === service.id}
          onHoverStart={() => handleHoverStart(service.id)}
          onHoverEnd={handleHoverEnd}
        />
      ))}
    </div>
  );
};

export default ServicesGrid;
