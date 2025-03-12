"use client";

import type React from "react";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { serviceCategories } from "./service-data";
import {
  ServiceCard,
  ServiceDetail,
  ServiceSearch,
} from "./service-components";

/**
 * Enhanced service cards grid with search functionality and modal details
 */
const EnhancedServiceCards: React.FC = () => {
  // State for selected service and search
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Get the selected service
  const selectedService = useMemo(
    () => serviceCategories.find((service) => service.id === selectedServiceId),
    [selectedServiceId]
  );

  // Filter services based on search query
  const filteredServices = useMemo(() => {
    if (!searchQuery.trim()) return serviceCategories;

    const searchTerm = searchQuery.toLowerCase();
    return serviceCategories.filter(
      (service) =>
        service.title.toLowerCase().includes(searchTerm) ||
        service.description.toLowerCase().includes(searchTerm) ||
        service.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
    );
  }, [searchQuery]);

  return (
    <div className="mt-6">
      {/* Search component */}
      <ServiceSearch value={searchQuery} onChange={setSearchQuery} />

      {/* Service cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service, index) => (
          <ServiceCard
            key={service.id}
            service={service}
            index={index}
            onClick={setSelectedServiceId}
          />
        ))}
      </div>

      {/* No results message */}
      {filteredServices.length === 0 && (
        <motion.div
          className="text-center py-16 text-slate-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-base font-light">
            Nie znaleziono usług pasujących do zapytania &quot;{searchQuery}
            &quot;
          </p>
        </motion.div>
      )}

      {/* Service detail modal */}
      <AnimatePresence>
        {selectedService && (
          <ServiceDetail
            service={selectedService}
            onClose={() => setSelectedServiceId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedServiceCards;
