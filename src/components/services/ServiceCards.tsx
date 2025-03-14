"use client";

import { FC, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import {
  SearchIcon,
  ArrowRight,
  X,
  Filter,
  Flame,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowRightCircle,
  Check,
} from "lucide-react";

import { ServiceCategory, serviceCategories } from "./service-data";
import { AnimatedGradientBorder } from "@/components/ambro-ui/animated-gradient-border";

import { useCustomCursor } from "@/hooks/use-custom-cursor";
import { useParticleEffect } from "@/hooks/use-particle-effect";
import { FloatingBubbles } from "@/components/ambro-ui/floating-bubbles";
import { useMagneticEffect } from "@/hooks/use-magnetic-effect";
import { TiltCard } from "@/components/ambro-ui/tilt-card";
import { GradientText } from "@/components/ambro-ui/gradient-text";
import { ClipMask } from "@/components/ambro-ui/clip-mask";
import { TypewriterText } from "@/components/ambro-ui/typewriter-text";
import { RevealText } from "@/components/ambro-ui/reveal-text";
import { SectionHeading } from "@/components/ambro-ui/section-heading";
import { HoverCard } from "@/components/ambro-ui/hover-card";

// =============================
// Main Component
// =============================
const AdvancedServiceCards: FC = () => {
  // States
  const [selectedService, setSelectedService] =
    useState<ServiceCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [highlightedTags, setHighlightedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"default" | "alphabetical" | "new">(
    "default"
  );
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);

  // Custom cursor setup
  const { CursorComponent, generateListeners } = useCustomCursor({
    variant: "ring",
    size: 50,
    color: "rgba(99, 102, 241, 0.5)",
    disabled: false,
  });

  // Particles setup
  const { particlesRef } = useParticleEffect({
    count: 30,
    color: "#6366f1",
    connected: true,
    connectionDistance: 100,
    connectionOpacity: 0.1,
    size: 2,
    speed: 0.2,
    container: containerRef,
  });

  // Animation controls
  const controls = useAnimation();

  // Extract all available tags from services
  const allTags = Array.from(
    new Set(serviceCategories.flatMap((service) => service.tags))
  );

  // Filter services based on search and active filter
  const filteredServices = serviceCategories
    .filter((service) => {
      // Filter by search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          service.title.toLowerCase().includes(query) ||
          service.description.toLowerCase().includes(query) ||
          service.tags.some((tag) => tag.toLowerCase().includes(query))
        );
      }
      return true;
    })
    .filter((service) => {
      // Filter by active tag
      if (activeFilter) {
        return service.tags.includes(activeFilter);
      }
      return true;
    })
    .sort((a, b) => {
      // Sort based on selected sort method
      switch (sortBy) {
        case "alphabetical":
          return a.title.localeCompare(b.title);
        case "new":
          return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        default:
          return (b.priority || 0) - (a.priority || 0);
      }
    });

  // Handle service selection
  const handleServiceClick = (service: ServiceCategory) => {
    setSelectedService(service);
    // Animate the modal with a delay
    setTimeout(() => {
      controls.start("visible");
    }, 100);
  };

  // Close modal
  const handleCloseModal = () => {
    controls.start("hidden").then(() => {
      setTimeout(() => {
        setSelectedService(null);
      }, 300);
    });
  };

  // Handle tag click
  const handleTagClick = (tag: string) => {
    if (activeFilter === tag) {
      setActiveFilter("");
    } else {
      setActiveFilter(tag);
    }
  };

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Toggle filter panel
  const toggleFilterPanel = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  // Update highlighted tags
  useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      setHighlightedTags(
        allTags.filter((tag) => tag.toLowerCase().includes(query))
      );
    } else {
      setHighlightedTags([]);
    }
  }, [searchQuery, allTags]);

  return (
    <div ref={containerRef} className="relative min-h-[600px]">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <FloatingBubbles
          count={12}
          minSize={5}
          maxSize={20}
          color="rgba(99, 102, 241, 0.15)"
          interactive={false}
        />
      </div>

      <canvas
        ref={particlesRef}
        className="absolute inset-0 pointer-events-none opacity-20"
      />

      {/* Custom cursor */}
      <CursorComponent />

      {/* Search and filters section */}
      <div className="relative z-10 mb-12">
        <SearchFilterBar
          searchQuery={searchQuery}
          onSearchChange={handleSearch}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onToggleFilters={toggleFilterPanel}
          allTags={allTags}
          activeFilter={activeFilter}
          onTagClick={handleTagClick}
          isFilterOpen={isFilterOpen}
          highlightedTags={highlightedTags}
          cursorListeners={generateListeners}
        />
      </div>

      {/* Services grid */}
      <div
        className={`relative z-10 ${
          viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            : "space-y-6"
        }`}
      >
        <AnimatePresence>
          {filteredServices.length > 0 ? (
            filteredServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.1,
                  type: "spring",
                  damping: 15,
                }}
              >
                {viewMode === "grid" ? (
                  <ServiceCard
                    service={service}
                    onClick={() => handleServiceClick(service)}
                    cursorListeners={generateListeners}
                  />
                ) : (
                  <ServiceListItem
                    service={service}
                    onClick={() => handleServiceClick(service)}
                    cursorListeners={generateListeners}
                  />
                )}
              </motion.div>
            ))
          ) : (
            <motion.div
              className="col-span-full flex flex-col items-center justify-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="text-center">
                <motion.div
                  className="inline-block mb-6 p-4 rounded-full bg-slate-800/50 backdrop-blur-sm"
                  animate={{
                    scale: [1, 1.05, 1],
                    rotate: [0, 5, 0, -5, 0],
                  }}
                  transition={{ duration: 5, repeat: Infinity }}
                >
                  <SearchIcon size={40} className="text-slate-400" />
                </motion.div>
                <h3 className="text-xl font-light text-slate-300 mb-2">
                  Brak wyników
                </h3>
                <p className="text-slate-400 max-w-md mb-8">
                  Nie znaleziono usług pasujących do zapytania "{searchQuery}"
                  {activeFilter && (
                    <>
                      {" "}
                      z filtrem{" "}
                      <span className="text-indigo-400">{activeFilter}</span>
                    </>
                  )}
                </p>
                <button
                  className="px-4 py-2 bg-indigo-600/80 hover:bg-indigo-600 rounded-full text-white text-sm transition-colors backdrop-blur-sm"
                  onClick={() => {
                    setSearchQuery("");
                    setActiveFilter("");
                  }}
                >
                  Wyczyść filtry
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Service detail modal */}
      <AnimatePresence>
        {selectedService && (
          <ServiceDetailModal
            service={selectedService}
            onClose={handleCloseModal}
            controls={controls}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// =============================
// Search and Filter Components
// =============================
interface SearchFilterBarProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  sortBy: "default" | "alphabetical" | "new";
  onSortChange: (sort: "default" | "alphabetical" | "new") => void;
  onToggleFilters: () => void;
  allTags: string[];
  activeFilter: string;
  onTagClick: (tag: string) => void;
  isFilterOpen: boolean;
  highlightedTags: string[];
  cursorListeners: any;
}

const SearchFilterBar: FC<SearchFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  sortBy,
  onSortChange,
  onToggleFilters,
  allTags,
  activeFilter,
  onTagClick,
  isFilterOpen,
  highlightedTags,
  cursorListeners,
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Magnetic effect for filter button
  const filterBtnRef = useRef<HTMLButtonElement>(null);
  useMagneticEffect(filterBtnRef, { strength: 20 });

  // Generate color for tag
  const getTagColor = (
    tag: string,
    isActive: boolean,
    isHighlighted: boolean
  ) => {
    if (isActive) return "bg-indigo-600/90 text-white";
    if (isHighlighted) return "bg-indigo-500/30 text-indigo-300";
    return "bg-slate-800/80 hover:bg-slate-700/80 text-slate-300";
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        {/* Search box */}
        <div className="relative flex-grow max-w-md">
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={onSearchChange}
            placeholder="Szukaj usług, technologii..."
            className="w-full bg-slate-900/50 border border-slate-700/30 rounded-full px-5 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 backdrop-blur-sm"
            {...cursorListeners({
              grow: true,
              color: "rgba(99, 102, 241, 0.8)",
            })}
          />
          <div className="absolute right-4 top-3.5 text-slate-400">
            <SearchIcon size={18} />
          </div>
        </div>

        <div className="flex space-x-2 items-center">
          {/* View mode toggle */}
          <div className="bg-slate-900/50 border border-slate-700/30 rounded-full p-1 flex space-x-1 backdrop-blur-sm">
            <button
              className={`rounded-full p-2 transition-colors ${
                viewMode === "grid"
                  ? "bg-indigo-600/80 text-white"
                  : "text-slate-400 hover:bg-slate-800/80"
              }`}
              onClick={() => onViewModeChange("grid")}
              aria-label="Grid view"
              {...cursorListeners()}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
              </svg>
            </button>
            <button
              className={`rounded-full p-2 transition-colors ${
                viewMode === "list"
                  ? "bg-indigo-600/80 text-white"
                  : "text-slate-400 hover:bg-slate-800/80"
              }`}
              onClick={() => onViewModeChange("list")}
              aria-label="List view"
              {...cursorListeners()}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
            </button>
          </div>

          {/* Sort dropdown */}
          <div className="relative group">
            <button
              className="bg-slate-900/50 border border-slate-700/30 rounded-full p-3 flex items-center gap-2 text-slate-300 hover:bg-slate-800/80 transition-colors backdrop-blur-sm"
              aria-label="Sort options"
              {...cursorListeners()}
            >
              <span className="hidden md:inline text-sm">Sortuj</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M11 5h10M11 9h7M11 13h4M3 17h18M3 5l4 4M7 9L3 5M3 13l4-4M7 9l-4 4" />
              </svg>
            </button>
            <div className="absolute right-0 mt-2 w-48 rounded-lg overflow-hidden shadow-xl bg-slate-900/95 backdrop-blur-md border border-slate-700/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20">
              <div className="p-1">
                <button
                  className={`w-full text-left px-4 py-2 text-sm rounded-md ${
                    sortBy === "default"
                      ? "bg-indigo-600/80 text-white"
                      : "text-slate-300 hover:bg-slate-800"
                  }`}
                  onClick={() => onSortChange("default")}
                  {...cursorListeners()}
                >
                  Priorytet
                </button>
                <button
                  className={`w-full text-left px-4 py-2 text-sm rounded-md ${
                    sortBy === "alphabetical"
                      ? "bg-indigo-600/80 text-white"
                      : "text-slate-300 hover:bg-slate-800"
                  }`}
                  onClick={() => onSortChange("alphabetical")}
                  {...cursorListeners()}
                >
                  Alfabetycznie
                </button>
                <button
                  className={`w-full text-left px-4 py-2 text-sm rounded-md ${
                    sortBy === "new"
                      ? "bg-indigo-600/80 text-white"
                      : "text-slate-300 hover:bg-slate-800"
                  }`}
                  onClick={() => onSortChange("new")}
                  {...cursorListeners()}
                >
                  Najpierw nowe
                </button>
              </div>
            </div>
          </div>

          {/* Filter toggle button */}
          <motion.button
            ref={filterBtnRef}
            className="relative bg-indigo-600/80 hover:bg-indigo-600 rounded-full p-3 text-white transition-colors backdrop-blur-sm"
            onClick={onToggleFilters}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle filters"
            {...cursorListeners()}
          >
            <Filter size={16} />
            {activeFilter && (
              <span className="absolute top-0 right-0 w-3 h-3 bg-white rounded-full transform translate-x-1 -translate-y-1"></span>
            )}
          </motion.button>
        </div>
      </div>

      {/* Filters panel */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="bg-slate-900/60 backdrop-blur-md rounded-xl p-4 border border-slate-700/30">
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                {allTags.map((tag) => {
                  const isActive = activeFilter === tag;
                  const isHighlighted = highlightedTags.includes(tag);

                  return (
                    <motion.button
                      key={tag}
                      className={`px-3 py-1.5 rounded-full text-sm ${getTagColor(
                        tag,
                        isActive,
                        isHighlighted
                      )}`}
                      onClick={() => onTagClick(tag)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      {...cursorListeners()}
                    >
                      {tag}
                      {isActive && (
                        <Check size={12} className="ml-1 inline-block" />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// =============================
// Service Card Component
// =============================
interface ServiceCardProps {
  service: ServiceCategory;
  onClick: () => void;
  cursorListeners: any;
}

const ServiceCard: FC<ServiceCardProps> = ({
  service,
  onClick,
  cursorListeners,
}) => {
  // Get color group based on service color
  const colorGroup = filterGroupsByColor(service.color);

  return (
    <TiltCard
      tiltAmount={15}
      glareOpacity={0.2}
      scale={1.03}
      glarePosition="top"
      shadow={true}
      shadowColor={colorGroup.shadow}
      borderGlow={true}
      borderColor={colorGroup.from}
      backgroundEffect="gradient"
      className="h-[350px] cursor-pointer"
      onClick={onClick}
    >
      {/* Card content */}
      <div className="h-full p-6 flex flex-col">
        {/* Header with icon */}
        <div className="flex items-start mb-4">
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl">
            <service.icon size={22} className="text-white" />
          </div>

          {/* New badge */}
          {service.isNew && (
            <div className="ml-auto">
              <AnimatedGradientBorder
                borderColor="from-indigo-400 via-purple-400 to-indigo-400"
                borderWidth={1.5}
                rounded="rounded-full"
                glowEffect={true}
                glowColor="rgba(99, 102, 241, 0.5)"
                animated={true}
                animationDuration={3}
              >
                <div className="flex items-center gap-1 px-3 py-1">
                  <Flame size={12} className="text-indigo-300" />
                  <span className="text-xs font-medium text-indigo-300">
                    Nowość
                  </span>
                </div>
              </AnimatedGradientBorder>
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-medium text-white mb-3 tracking-tight">
          <GradientText
            from={colorGroup.from}
            to={colorGroup.to}
            fontSize="inherit"
            animated={true}
            glowEffect={true}
            glowIntensity={8}
            glowColor={`${colorGroup.from}50`}
            duration={20}
          >
            {service.title}
          </GradientText>
        </h3>

        {/* Description */}
        <div className="flex-grow">
          <p className="text-slate-300 text-sm leading-relaxed">
            {service.description}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-4 mb-4">
          {service.tags.slice(0, 3).map((tag, idx) => (
            <div
              key={`${service.id}-${tag}`}
              className="px-2.5 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs text-white/80"
            >
              {tag}
            </div>
          ))}
          {service.tags.length > 3 && (
            <div className="px-2.5 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs text-white/80">
              +{service.tags.length - 3}
            </div>
          )}
        </div>

        {/* Call to action */}
        <motion.div
          className="flex items-center justify-end text-sm text-white/70 group"
          whileHover={{ x: 5 }}
          {...cursorListeners({ grow: true })}
        >
          <span>Szczegóły</span>
          <ArrowRight
            size={16}
            className="ml-1 transition-transform group-hover:translate-x-1"
          />
        </motion.div>
      </div>
    </TiltCard>
  );
};

// =============================
// Service List Item Component
// =============================
interface ServiceListItemProps {
  service: ServiceCategory;
  onClick: () => void;
  cursorListeners: any;
}

const ServiceListItem: FC<ServiceListItemProps> = ({
  service,
  onClick,
  cursorListeners,
}) => {
  const colorGroup = filterGroupsByColor(service.color);

  return (
    <motion.div
      className="relative overflow-hidden rounded-xl border border-slate-700/30 backdrop-blur-sm bg-slate-900/40"
      whileHover={{
        scale: 1.01,
        borderColor: colorGroup.from,
        boxShadow: `0 0 15px ${colorGroup.shadow}`,
      }}
      onClick={onClick}
      {...cursorListeners({ grow: true })}
    >
      <div className="p-5 flex flex-col md:flex-row md:items-center gap-4">
        {/* Icon */}
        <div
          className="p-3 rounded-xl w-12 h-12 flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${colorGroup.from}, ${colorGroup.to})`,
          }}
        >
          <service.icon size={20} className="text-white" />
        </div>

        {/* Content */}
        <div className="flex-grow">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-medium text-white tracking-tight">
              {service.title}
            </h3>
            {service.isNew && (
              <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded-full text-xs flex items-center gap-1">
                <Sparkles size={10} /> Nowość
              </span>
            )}
          </div>
          <p className="text-slate-300 text-sm mt-1 line-clamp-2">
            {service.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {service.tags.slice(0, 5).map((tag) => (
              <span
                key={`${service.id}-list-${tag}`}
                className="px-2 py-0.5 bg-slate-800/80 rounded-full text-xs text-slate-300"
              >
                {tag}
              </span>
            ))}
            {service.tags.length > 5 && (
              <span className="px-2 py-0.5 bg-slate-800/80 rounded-full text-xs text-slate-300">
                +{service.tags.length - 5}
              </span>
            )}
          </div>
        </div>

        {/* Action button */}
        <div className="md:ml-4">
          <button
            className="w-full md:w-auto px-4 py-2 bg-indigo-600/80 hover:bg-indigo-600 rounded-full text-white text-sm transition-colors flex items-center justify-center gap-1"
            onClick={onClick}
          >
            <span>Szczegóły</span>
            <ArrowRightCircle size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// =============================
// Service Detail Modal
// =============================
interface ServiceDetailModalProps {
  service: ServiceCategory;
  onClose: () => void;
  controls: any;
}

const ServiceDetailModal: FC<ServiceDetailModalProps> = ({
  service,
  onClose,
  controls,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const colorGroup = filterGroupsByColor(service.color);

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Animation variants
  const modalVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const contentVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
      },
    },
  };

  return (
    <motion.div
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md"
      variants={modalVariants}
      initial="hidden"
      animate={controls}
      exit="hidden"
      onClick={onClose}
    >
      <motion.div
        ref={contentRef}
        className="w-full max-w-4xl max-h-[90vh] bg-gradient-to-b from-slate-900/95 to-slate-800/95 rounded-2xl overflow-hidden relative border border-slate-700/30"
        variants={contentVariants}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background glowing shape */}
        <div
          className="absolute w-full h-full -z-10 opacity-20 blur-3xl"
          style={{
            background: `radial-gradient(circle at 50% 0%, ${colorGroup.from}, transparent 70%)`,
          }}
        />

        {/* Header */}
        <div className="p-6 border-b border-slate-700/30 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ClipMask
                mask="hexagon"
                width={60}
                height={60}
                borderWidth={1}
                borderColor={colorGroup.from}
                backgroundColor={colorGroup.from + "30"}
                animate={true}
                animationDuration={10}
              >
                <div className="flex items-center justify-center w-full h-full">
                  <service.icon size={24} className="text-white" />
                </div>
              </ClipMask>

              <div>
                <TypewriterText
                  text={service.title}
                  className="text-2xl font-medium text-white tracking-tight"
                  speed={30}
                  cursor={false}
                />

                <div className="flex items-center mt-1">
                  <motion.div
                    className="h-1 rounded-full"
                    style={{
                      background: `linear-gradient(to right, ${colorGroup.from}, ${colorGroup.to})`,
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: "60px" }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  />
                </div>
              </div>
            </div>

            <button
              className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
              onClick={onClose}
              aria-label="Zamknij"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content area with scrolling */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Description */}
          <div className="mb-8 text-slate-300 leading-relaxed">
            <RevealText staggerLines={true} delay={0.1} className="space-y-4">
              <p>{service.longDescription}</p>
            </RevealText>
          </div>

          {/* Tags */}
          <div className="mb-8">
            <SectionHeading
              title="Technologie"
              divider={true}
              dividerColor={`bg-gradient-to-r from-transparent via-${colorGroup.from} to-transparent`}
              dividerWidth="40%"
              size="sm"
              alignment="left"
              animation="slide"
              delay={0.3}
            />

            <div className="flex flex-wrap gap-2 mt-4">
              {service.tags.map((tag, idx) => (
                <motion.div
                  key={`detail-${service.id}-${tag}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + idx * 0.05 }}
                >
                  <HoverCard
                    hoverContent={
                      <div className="text-xs text-slate-300">{tag}</div>
                    }
                    position="top"
                    glassmorphism={true}
                    animation="scale"
                  >
                    <div
                      className="px-3 py-1.5 rounded-full text-sm transition-colors"
                      style={{
                        background: `${colorGroup.from}20`,
                        color: colorGroup.from,
                        borderWidth: "1px",
                        borderColor: `${colorGroup.from}30`,
                      }}
                    >
                      {tag}
                    </div>
                  </HoverCard>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Key features */}
          <div className="mb-8">
            <SectionHeading
              title="Kluczowe cechy"
              divider={true}
              dividerColor={`bg-gradient-to-r from-transparent via-${colorGroup.from} to-transparent`}
              dividerWidth="40%"
              size="sm"
              alignment="left"
              animation="slide"
              delay={0.4}
            />

            <div className="mt-4 space-y-3">
              {service.bulletPoints.map((point, idx) => (
                <motion.div
                  key={`bullet-${service.id}-${idx}`}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + idx * 0.1 }}
                >
                  <div
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5"
                    style={{ background: `${colorGroup.from}40` }}
                  >
                    <motion.svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ delay: 0.8 + idx * 0.1, duration: 0.5 }}
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </motion.svg>
                  </div>
                  <p className="text-slate-300">{point}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Related services suggestion */}
          <div>
            <SectionHeading
              title="Powiązane usługi"
              divider={true}
              dividerColor={`bg-gradient-to-r from-transparent via-${colorGroup.from} to-transparent`}
              dividerWidth="40%"
              size="sm"
              alignment="left"
              animation="slide"
              delay={0.5}
            />

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              {serviceCategories
                .filter(
                  (s) =>
                    s.id !== service.id &&
                    s.tags.some((tag) => service.tags.includes(tag))
                )
                .slice(0, 2)
                .map((relatedService, idx) => {
                  const relatedColorGroup = filterGroupsByColor(
                    relatedService.color
                  );

                  return (
                    <motion.div
                      key={`related-${relatedService.id}`}
                      className="p-4 rounded-xl border border-slate-700/30 bg-slate-800/30 backdrop-blur-sm"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 + idx * 0.1 }}
                      whileHover={{
                        scale: 1.02,
                        borderColor: relatedColorGroup.from,
                        boxShadow: `0 0 15px ${relatedColorGroup.shadow}`,
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="p-2 rounded-lg flex-shrink-0"
                          style={{ background: `${relatedColorGroup.from}30` }}
                        >
                          <relatedService.icon
                            size={18}
                            className="text-white"
                          />
                        </div>
                        <div>
                          <h4 className="text-white font-medium">
                            {relatedService.title}
                          </h4>
                          <p className="text-slate-400 text-sm mt-1 line-clamp-2">
                            {relatedService.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700/30 backdrop-blur-sm">
          <motion.div
            className="flex justify-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <AnimatedGradientBorder
              borderColor={`from-${colorGroup.from} via-white/20 to-${colorGroup.to}`}
              borderWidth={1}
              rounded="rounded-full"
              glowEffect={true}
              glowColor={colorGroup.glow}
              animated={true}
            >
              <button
                className="px-5 py-2 flex items-center gap-2 text-white"
                onClick={onClose}
              >
                <span>Zamknij</span>
                <X size={16} />
              </button>
            </AnimatedGradientBorder>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdvancedServiceCards;
