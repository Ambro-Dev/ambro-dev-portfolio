"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import { Card3D } from "@/components/ambro-ui/card-3d";
import type { SerializableService } from "@/lib/service-utils";

// Dynamicznie importowany komponent ikony
const ServiceIcon = dynamic(() => import("./service-icon"), {
  ssr: true,
});

interface ServiceGridItemProps {
  service: SerializableService;
  index: number;
}

export default function ServiceGridItem({ service }: ServiceGridItemProps) {
  return (
    <Link href={`/uslugi/${service.id}`}>
      <Card3D
        interactive
        interactiveStrength={10}
        glowEffect
        // biome-ignore lint/style/noUnusedTemplateLiteral: <explanation>
        glowColor={`rgba(99, 102, 241, 0.4)`}
        shadow
        bgColor="bg-gray-900/50"
        borderColor="border-indigo-500/20"
        height="100%"
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center mb-4">
            <div
              className={`w-12 h-12 rounded-full ${service.color} flex items-center justify-center mr-4 border border-gray-700`}
              aria-hidden="true"
            >
              <Suspense
                fallback={
                  <div className="w-6 h-6 bg-indigo-500/20 rounded-full animate-pulse" />
                }
              >
                <ServiceIcon serviceId={service.id} size={6} />
              </Suspense>
            </div>
            <h3 className="text-xl font-semibold">{service.title}</h3>
          </div>

          <p className="text-gray-300 mb-4 flex-grow">{service.description}</p>

          <div className="flex flex-wrap gap-2 mt-2 mb-4">
            {service.tags.slice(0, 3).map((tag, i) => (
              <span
                key={`${service.id}-tag-${i}`}
                className="px-2 py-1 text-xs rounded-full bg-indigo-900/30 text-indigo-300 border border-indigo-700/30"
              >
                {tag}
              </span>
            ))}
          </div>

          <div>
            <motion.div
              className="text-indigo-400 font-medium flex items-center"
              whileHover={{ x: 5 }}
            >
              Dowiedz się więcej
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </motion.div>
          </div>
        </div>
      </Card3D>
    </Link>
  );
}
