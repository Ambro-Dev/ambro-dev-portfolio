"use client";

import type React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Award, Clock } from "lucide-react";
import { type Skill, type SkillCategory, CATEGORY_CONFIG } from "./skill-types";
import { GlassCard, Glass3DCard } from "@/components/glass-components";

/**
 * Nowoczesny komponent filtrów kategorii z eleganckim wyglądem
 */
interface CategoryFilterProps {
  categories: SkillCategory[];
  selectedCategories: SkillCategory[];
  onToggleCategory: (category: SkillCategory) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategories,
  onToggleCategory,
}) => {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {categories.map((category, index) => {
        const isSelected = selectedCategories.includes(category);
        const { color, label } = CATEGORY_CONFIG[category];

        return (
          <motion.button
            key={category}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all backdrop-blur-sm
              ${isSelected ? "shadow-sm" : "opacity-80 hover:opacity-100"}`}
            style={{
              backgroundColor: isSelected
                ? `${color}15`
                : "rgba(30, 30, 40, 0.2)",
              borderLeft: isSelected
                ? `3px solid ${color}`
                : "3px solid transparent",
              color: isSelected ? color : "#c0c0c0",
              boxShadow: isSelected ? `0 4px 15px ${color}15` : undefined,
            }}
            whileHover={{
              scale: 1.03,
              backgroundColor: isSelected
                ? `${color}20`
                : "rgba(40, 40, 50, 0.3)",
            }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onToggleCategory(category)}
            aria-pressed={isSelected}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.4 }}
          >
            {label}
          </motion.button>
        );
      })}
    </div>
  );
};

/**
 * Ulepszona lista umiejętności na widok mobilny
 */
interface SkillListItemProps {
  skill: Skill;
  index: number;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: () => void;
  onHover: (hovered: boolean) => void;
}

export const SkillListItem: React.FC<SkillListItemProps> = ({
  skill,
  index,
  isSelected,
  isHovered,
  onSelect,
  onHover,
}) => {
  const isActive = isSelected || isHovered;

  return (
    <Glass3DCard
      depth={3}
      blurStrength={3}
      hoverEffect={true}
      lightReflection={true}
      className="relative cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      onClick={onSelect}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      whileHover={{
        x: 4,
        backgroundColor: `${skill.color}15`,
        transition: { duration: 0.2 },
      }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div
              className="w-14 h-14 rounded-lg flex flex-col items-center justify-center mr-4 font-bold text-white shadow-md"
              style={{
                backgroundColor: skill.color,
                boxShadow: isActive ? `0 0 15px ${skill.color}40` : "none",
              }}
            >
              <span className="text-lg">{skill.level}</span>
              <span className="text-xs opacity-80">{skill.experience}y</span>
            </div>
            <div>
              <h3
                className="font-bold"
                style={{ color: isActive ? skill.color : "white" }}
              >
                {skill.name}
              </h3>
              <div className="flex flex-wrap gap-1 mt-2">
                {skill.tools.slice(0, 3).map((tool) => (
                  <span
                    key={tool}
                    className="inline-block px-2 py-0.5 text-xs rounded-md"
                    style={{
                      backgroundColor: `${skill.color}15`,
                      color: isActive ? skill.color : "#e0e0e0",
                    }}
                  >
                    {tool}
                  </span>
                ))}
                {skill.tools.length > 3 && (
                  <span className="inline-block px-2 py-0.5 text-xs rounded-md bg-gray-700/50 text-gray-300">
                    +{skill.tools.length - 3}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="w-24 h-3 bg-gray-700/50 rounded-full overflow-hidden">
            <motion.div
              className="h-3 rounded-full"
              style={{
                backgroundColor: skill.color,
              }}
              initial={{ width: 0 }}
              animate={{ width: `${skill.level}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Rozwinięta zawartość po wybraniu */}
        <AnimatePresence>
          {isSelected && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-4 mt-4 border-t border-gray-700/50">
                <p className="text-gray-300 text-sm mb-4">
                  {skill.description}
                </p>

                <div className="flex items-center gap-2 text-gray-400 text-xs mb-3">
                  <Clock size={14} />
                  <span>
                    {skill.experience}{" "}
                    {skill.experience === 1
                      ? "rok"
                      : skill.experience < 5
                      ? "lata"
                      : "lat"}{" "}
                    doświadczenia
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {skill.tools.map((tool, idx) => (
                    <motion.span
                      key={tool}
                      className="px-2.5 py-1 text-xs rounded-md"
                      style={{
                        backgroundColor: `${skill.color}15`,
                        color: skill.color,
                      }}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                    >
                      {tool}
                    </motion.span>
                  ))}
                </div>

                {skill.certifications && skill.certifications.length > 0 && (
                  <div className="text-xs text-gray-300 bg-gray-800/40 p-3 rounded-md">
                    <div className="mb-2 font-semibold flex items-center gap-1.5">
                      <Award size={14} style={{ color: skill.color }} />
                      <span>Certyfikaty:</span>
                    </div>
                    <ul className="space-y-1.5">
                      {skill.certifications.map((cert, idx) => (
                        <motion.li
                          key={cert}
                          className="flex items-center gap-2"
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 + idx * 0.07 }}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: skill.color }}
                          />
                          <span>{cert}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Glass3DCard>
  );
};

/**
 * Komponent szczegółów umiejętności - bardziej elegancki i informatywny
 */
interface SkillDetailProps {
  skill: Skill;
  onClose: () => void;
}

export const SkillDetail: React.FC<SkillDetailProps> = ({ skill, onClose }) => {
  return (
    <div className="relative overflow-hidden">
      {/* This component is now wrapped in EliteGlassPanel in the main component */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
      >
        {/* Gradient header background */}
        <div
          className="absolute top-0 left-0 right-0 h-24 z-0 opacity-60"
          style={{
            background: `linear-gradient(135deg, ${skill.color}50, transparent 80%)`,
          }}
        />

        {/* Header with skill name and close button */}
        <div className="relative z-10 px-6 pt-6 pb-2 flex justify-between items-start">
          <div>
            <h3
              className="text-2xl font-bold mb-1"
              style={{ color: skill.color }}
            >
              {skill.name}
            </h3>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Clock size={16} />
              <span>
                {skill.experience}{" "}
                {skill.experience === 1
                  ? "rok"
                  : skill.experience < 5
                  ? "lata"
                  : "lat"}{" "}
                doświadczenia
              </span>
            </div>
          </div>

          <GlassCard
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-300 hover:bg-gray-700/70 transition-colors"
            opacity={30}
            blur="md"
            onClick={onClose}
            aria-label="Zamknij szczegóły"
          >
            <X size={16} />
          </GlassCard>
        </div>

        <div className="p-6 pt-2">
          {/* Skill proficiency and metrics */}
          <div className="flex items-start gap-6 mb-6">
            <div
              className="w-24 h-24 rounded-xl flex flex-col items-center justify-center text-white shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${skill.color}, ${skill.color}90)`,
                boxShadow: `0 10px 25px ${skill.color}40`,
              }}
            >
              <span className="text-3xl font-bold">{skill.level}</span>
              <span className="text-sm mt-1">Poziom</span>
            </div>

            <div className="flex-1">
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-gray-400">Poziom zaawansowania</span>
                <span className="font-medium text-white">{skill.level}%</span>
              </div>
              <div className="h-2 bg-gray-700/50 rounded-full overflow-hidden mb-4">
                <motion.div
                  className="h-2 rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${skill.color}90, ${skill.color})`,
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.level}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-gray-800/30 rounded-lg p-2">
                  <div className="text-lg font-medium text-white">
                    {skill.experience}
                  </div>
                  <div className="text-xs text-gray-400">Lat doświadczenia</div>
                </div>
                <div className="bg-gray-800/30 rounded-lg p-2">
                  <div className="text-lg font-medium text-white">
                    {skill.tools.length}
                  </div>
                  <div className="text-xs text-gray-400">Narzędzia</div>
                </div>
                <div className="bg-gray-800/30 rounded-lg p-2">
                  <div className="text-lg font-medium text-white">
                    {skill.certifications?.length || 0}
                  </div>
                  <div className="text-xs text-gray-400">Certyfikaty</div>
                </div>
              </div>
            </div>
          </div>

          {/* Skill description */}
          <div className="mb-6">
            <h4 className="text-sm uppercase tracking-wider text-gray-400 mb-2 font-medium flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: skill.color }}
              />
              Opis
            </h4>
            <p className="text-gray-300 text-sm leading-relaxed">
              {skill.description}
            </p>
          </div>

          {/* Tools section */}
          <div className="mb-6">
            <h4 className="text-sm uppercase tracking-wider text-gray-400 mb-3 font-medium flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: skill.color }}
              />
              Narzędzia i technologie
            </h4>
            <div className="flex flex-wrap gap-2">
              {skill.tools.map((tool, idx) => (
                <motion.div
                  key={tool}
                  className="px-3 py-1.5 text-sm rounded-lg"
                  style={{
                    backgroundColor: `${skill.color}15`,
                    border: `1px solid ${skill.color}30`,
                    color: skill.color,
                  }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: idx * 0.03 }}
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: `${skill.color}25`,
                    transition: { duration: 0.2 },
                  }}
                >
                  {tool}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Certifications section */}
          {skill.certifications && skill.certifications.length > 0 && (
            <div>
              <h4 className="text-sm uppercase tracking-wider text-gray-400 mb-3 font-medium flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: skill.color }}
                />
                Certyfikaty
              </h4>
              <div className="space-y-2">
                {skill.certifications.map((cert, idx) => (
                  <motion.div
                    key={cert}
                    className="flex items-center gap-3 bg-gray-800/30 p-3 rounded-lg"
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{
                      x: 3,
                      backgroundColor: "rgba(40, 40, 50, 0.4)",
                      transition: { duration: 0.2 },
                    }}
                  >
                    <Award
                      size={18}
                      style={{ color: skill.color }}
                      className="flex-shrink-0"
                    />
                    <span className="text-gray-200">{cert}</span>
                    <ExternalLink
                      size={14}
                      className="text-gray-500 ml-auto flex-shrink-0"
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
