// src/components/services-grid.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { TiltCard } from "@/components/ambro-ui/tilt-card";
import { GradientText } from "@/components/ambro-ui/gradient-text";
import ServiceCardCanvas from "@/components/3d/service-card-canvas";

interface Service {
  id: string;
  title: string;
  description: string;
  tags: string[];
  color: string;
  icon: React.ElementType;
}

interface ServicesGridProps {
  services: Service[];
}

const ServicesGrid: React.FC<ServicesGridProps> = ({ services }) => {
  const [hoveredService, setHoveredService] = useState<string | null>(null);

  // Animation variants for cards
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1 * i,
        duration: 0.5,
        ease: [0.43, 0.13, 0.23, 0.96],
      },
    }),
    hover: {
      y: -10,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
    >
      {services.map((service, index) => (
        <motion.div
          key={service.id}
          custom={index}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          onHoverStart={() => setHoveredService(service.id)}
          onHoverEnd={() => setHoveredService(null)}
          className="h-full"
        >
          <Link href={`/uslugi/${service.id}`} className="block h-full">
            <TiltCard
              className="h-full"
              tiltAmount={10}
              glareOpacity={0.2}
              borderGlow
              borderColor="rgba(99, 102, 241, 0.4)"
              backgroundEffect="gradient"
            >
              <div className="p-6 h-full flex flex-col relative overflow-hidden">
                {/* 3D Icon element using R3F */}
                <div className="w-16 h-16 mb-6">
                  <ServiceCardCanvas
                    serviceId={service.id}
                    isHovered={hoveredService === service.id}
                    color={service.color.split(" ")[0].replace("from-", "")}
                  />
                </div>

                <h3 className="text-xl font-bold mb-3">
                  <GradientText glowEffect>{service.title}</GradientText>
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

                {/* Animated arrow indicator on hover */}
                <motion.div
                  className="absolute bottom-4 right-4 text-indigo-400"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{
                    opacity: hoveredService === service.id ? 1 : 0,
                    x: hoveredService === service.id ? 0 : -10,
                  }}
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
                  >
                    <title>Find out more</title>
                    <path d="M5 12h13M12 5l7 7-7 7" />
                  </svg>
                </motion.div>
              </div>
            </TiltCard>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ServicesGrid;
