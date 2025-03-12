"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SKILLS_DATA, getAllCategories } from "./skill-types";
import {
  useSkillFiltering,
  useSkillInteraction,
  useVisibilityTracking,
} from "./skills-hooks";
import {
  GlassCard,
  Glass3DCard,
  EliteGlassPanel,
} from "@/components/glass-components";
import { CategoryFilter, SkillDetail, SkillListItem } from "./skill-components";

/**
 * Modernized Skills Diagram Component with elegantly organized visualization
 */
const SkillsDiagram: React.FC = () => {
  // Get all unique categories
  const allCategories = getAllCategories();

  // Responsive layout state
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Update layout based on viewport
  useEffect(() => {
    const checkLayout = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkLayout();
    window.addEventListener("resize", checkLayout);
    return () => {
      window.removeEventListener("resize", checkLayout);
    };
  }, []);

  // Custom hooks for functionality
  const { selectedCategories, toggleCategory, filteredSkills } =
    useSkillFiltering();
  const {
    selectedSkill,
    hoveredSkill,
    selectSkill,
    hoverSkill,
    getSelectedSkill,
  } = useSkillInteraction();
  const { hasAnimated, targetRef } = useVisibilityTracking();

  // Group skills by category for the new layout
  const skillsByCategory = React.useMemo(() => {
    const grouped: Record<string, typeof filteredSkills> = {};

    for (const skill of filteredSkills) {
      if (!grouped[skill.category]) {
        grouped[skill.category] = [];
      }
      grouped[skill.category].push(skill);
    }

    return grouped;
  }, [filteredSkills]);

  return (
    <EliteGlassPanel
      ref={targetRef}
      variant="blue"
      hoverEffect="none"
      borderGradient={true}
      className="overflow-hidden"
    >
      {/* Filter Controls */}
      <div className="py-6 px-4">
        <CategoryFilter
          categories={allCategories}
          selectedCategories={selectedCategories}
          onToggleCategory={toggleCategory}
        />
      </div>

      {isMobile ? (
        // Mobile list view - improved with better spacing and transitions
        <div className="px-4 pb-8 space-y-4">
          {filteredSkills.map((skill, index) => (
            <SkillListItem
              key={skill.id}
              skill={skill}
              index={index}
              isSelected={selectedSkill === skill.id}
              isHovered={hoveredSkill === skill.id}
              onSelect={() => selectSkill(skill.id)}
              onHover={(hovered) => hoverSkill(hovered ? skill.id : null)}
            />
          ))}
        </div>
      ) : (
        // Desktop view - new elegant visualization
        <div className="px-4 pb-8">
          <motion.div
            className="grid grid-cols-1 gap-6 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            {Object.entries(skillsByCategory).map(
              ([category, skills], categoryIndex) => (
                <motion.div
                  key={category}
                  className="relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: categoryIndex * 0.1, duration: 0.5 }}
                >
                  {/* Category Header */}
                  <motion.div
                    className="mb-3 ml-2 flex items-center"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: categoryIndex * 0.1 + 0.2,
                      duration: 0.4,
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center mr-2"
                      style={{
                        backgroundColor: skills[0]?.color || "#4361EE",
                        boxShadow: `0 0 12px ${skills[0]?.color}30`,
                      }}
                    >
                      {React.createElement(skills[0]?.icon || (() => null), {
                        size: 16,
                        className: "text-white",
                      })}
                    </div>
                    <h3 className="text-white font-medium">
                      {category === "devops" && "DevOps"}
                      {category === "cloud" && "Cloud Computing"}
                      {category === "security" && "Cyberbezpieczeństwo"}
                      {category === "development" && "Programowanie"}
                      {category === "infrastructure" && "Infrastruktura"}
                    </h3>
                  </motion.div>

                  {/* Skills within category */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {skills.map((skill, skillIndex) => {
                      const isActive =
                        selectedSkill === skill.id || hoveredSkill === skill.id;

                      return (
                        <Glass3DCard
                          key={skill.id}
                          depth={3}
                          blurStrength={2}
                          hoverEffect={true}
                          lightReflection={true}
                          className="cursor-pointer relative"
                          initial={{ opacity: 0, scale: 0.95, y: 10 }}
                          animate={{
                            opacity: 1,
                            scale: 1,
                            y: 0,
                            transition: {
                              delay: hasAnimated
                                ? 0
                                : categoryIndex * 0.1 + skillIndex * 0.05 + 0.3,
                              duration: 0.4,
                            },
                          }}
                          onClick={() => selectSkill(skill.id)}
                          onMouseEnter={() => hoverSkill(skill.id)}
                          onMouseLeave={() => hoverSkill(null)}
                        >
                          {/* Highlight for active state */}
                          {isActive && (
                            <motion.div
                              className="absolute inset-0 rounded-lg"
                              style={{
                                boxShadow: `inset 0 0 0 2px ${skill.color}`,
                                background: `linear-gradient(135deg, ${skill.color}10, transparent)`,
                              }}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3 }}
                            />
                          )}
                          <div className="p-4">
                            {/* Skill Header */}
                            <div className="flex justify-between items-start mb-3">
                              <h4
                                className="font-medium"
                                style={{
                                  color: isActive ? skill.color : "white",
                                }}
                              >
                                {skill.name}
                              </h4>
                              <div
                                className="flex flex-col items-center justify-center w-12 h-12 rounded-lg font-bold text-white"
                                style={{
                                  backgroundColor: skill.color,
                                  boxShadow: isActive
                                    ? `0 0 12px ${skill.color}40`
                                    : "none",
                                }}
                              >
                                <span className="text-base">{skill.level}</span>
                                <span className="text-xs opacity-80">
                                  {skill.experience}y
                                </span>
                              </div>
                            </div>

                            {/* Experience bar */}
                            <div className="h-1 w-full bg-gray-700/50 rounded-full overflow-hidden mb-3">
                              <motion.div
                                className="h-full rounded-full"
                                style={{ backgroundColor: skill.color }}
                                initial={{ width: 0 }}
                                animate={{ width: `${skill.level}%` }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                              />
                            </div>

                            {/* Tools */}
                            <div className="flex flex-wrap gap-1 mt-1">
                              {skill.tools.slice(0, 3).map((tool) => (
                                <span
                                  key={tool}
                                  className="px-1.5 py-0.5 text-xs rounded-md"
                                  style={{
                                    backgroundColor: `${skill.color}20`,
                                    color: isActive ? skill.color : "#e0e0e0",
                                  }}
                                >
                                  {tool}
                                </span>
                              ))}
                              {skill.tools.length > 3 && (
                                <span
                                  className="px-1.5 py-0.5 text-xs rounded-md"
                                  style={{
                                    backgroundColor: "rgba(60, 60, 70, 0.5)",
                                  }}
                                >
                                  +{skill.tools.length - 3}
                                </span>
                              )}
                            </div>
                          </div>
                        </Glass3DCard>
                      );
                    })}
                  </div>
                </motion.div>
              )
            )}
          </motion.div>
        </div>
      )}

      {/* Skill detail panel - elegantly positioned */}
      <AnimatePresence>
        {selectedSkill && getSelectedSkill && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4">
            <motion.div
              className="w-11/12 md:w-4/5 lg:w-3/5 xl:w-2/5 max-w-2xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <EliteGlassPanel
                variant={
                  getSelectedSkill.category === "security" ? "purple" : "blue"
                }
                borderGradient={true}
                layered={true}
                hoverEffect="none"
                className="max-h-[90vh] overflow-y-auto"
              >
                <SkillDetail
                  skill={getSelectedSkill}
                  onClose={() => selectSkill(null)}
                />
              </EliteGlassPanel>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer with skill count */}
      <motion.div
        className="py-4 text-center text-gray-400 text-sm border-t border-gray-800/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <GlassCard
          opacity={5}
          blur="sm"
          border={false}
          shadow="none"
          className="inline-flex py-1 px-4 rounded-full"
        >
          {filteredSkills.length} z {SKILLS_DATA.length} umiejętności
          wyświetlanych
        </GlassCard>
      </motion.div>
    </EliteGlassPanel>
  );
};

export default SkillsDiagram;
