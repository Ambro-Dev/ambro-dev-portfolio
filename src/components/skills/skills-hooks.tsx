"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import {
  type Skill,
  type SkillCategory,
  SKILLS_DATA,
  calculatePosition,
} from "./skill-types";

/**
 * Custom hook to filter skills by categories
 */
export const useSkillFiltering = (initialCategories: SkillCategory[] = []) => {
  const [selectedCategories, setSelectedCategories] = useState<SkillCategory[]>(
    initialCategories.length > 0
      ? initialCategories
      : ["devops", "cloud", "security", "development", "infrastructure"]
  );

  // Filtered skills based on selected categories
  const filteredSkills = useMemo(
    () =>
      SKILLS_DATA.filter((skill) =>
        selectedCategories.includes(skill.category)
      ),
    [selectedCategories]
  );

  // Handle category toggle
  const toggleCategory = (category: SkillCategory) => {
    setSelectedCategories((prev) => {
      // Don't allow deselecting all categories
      if (prev.includes(category) && prev.length === 1) return prev;

      if (prev.includes(category)) {
        return prev.filter((c) => c !== category);
      }
      return [...prev, category];
    });
  };

  return {
    selectedCategories,
    toggleCategory,
    filteredSkills,
  };
};

/**
 * Custom hook to handle responsive layout
 * Simplified to provide stable sizing
 */
export const useResponsiveLayout = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [diagramRadius, setDiagramRadius] = useState<number>(200);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkLayout = () => {
      setIsMobile(window.innerWidth < 768);

      if (!containerRef.current) return;

      // Simple scaling based on viewport width
      const viewportWidth = window.innerWidth;

      let radius: number;
      if (viewportWidth < 640) {
        radius = 150;
      } else if (viewportWidth < 768) {
        radius = 180;
      } else if (viewportWidth < 1024) {
        radius = 200;
      } else if (viewportWidth < 1280) {
        radius = 220;
      } else {
        radius = 240;
      }

      setDiagramRadius(radius);
    };

    checkLayout();
    window.addEventListener("resize", checkLayout);

    return () => {
      window.removeEventListener("resize", checkLayout);
    };
  }, []);

  return {
    isMobile,
    diagramRadius,
    containerRef,
  };
};

/**
 * Custom hook to calculate and update node positions based on filtered skills
 * with improved positioning to prevent overlapping
 */
export const useNodePositions = (
  filteredSkills: Skill[],
  radius: number,
  shouldUpdate = true
) => {
  const [positions, setPositions] = useState<{
    [id: string]: { x: number; y: number };
  }>({});

  useEffect(() => {
    if (!shouldUpdate) return;

    const newPositions: { [id: string]: { x: number; y: number } } = {};
    const skillCount = filteredSkills.length;

    // Adjust spacing based on number of skills
    let radiusMultiplier = 1;
    if (skillCount > 8) {
      radiusMultiplier = 0.95; // Move skills slightly inward for better spacing
    }

    // Apply a small jitter to prevent exact overlaps when skills count is high
    const applyJitter = skillCount > 10;

    filteredSkills.forEach((skill, index) => {
      // Add small random variation to angle if many skills
      let angleOffset = 0;
      if (applyJitter) {
        // Alternate small offsets for better distribution
        angleOffset = index % 2 === 0 ? 2 : -2;
      }

      // Calculate base position
      const position = calculatePosition(
        index,
        skillCount,
        radius * radiusMultiplier,
        angleOffset
      );

      newPositions[skill.id] = position;
    });

    setPositions(newPositions);
  }, [filteredSkills, radius, shouldUpdate]);

  return positions;
};

/**
 * Custom hook to handle skill selection and hover states
 */
export const useSkillInteraction = () => {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  const selectSkill = (id: string | null) => {
    setSelectedSkill(id === selectedSkill ? null : id);
  };

  const hoverSkill = (id: string | null) => {
    setHoveredSkill(id);
  };

  const getSelectedSkill = useMemo(
    () => SKILLS_DATA.find((skill) => skill.id === selectedSkill),
    [selectedSkill]
  );

  return {
    selectedSkill,
    hoveredSkill,
    selectSkill,
    hoverSkill,
    getSelectedSkill,
  };
};

/**
 * Custom hook to track when component enters viewport
 */
export const useVisibilityTracking = () => {
  const [hasAnimated, setHasAnimated] = useState<boolean>(false);
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!targetRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(targetRef.current);

    return () => {
      if (targetRef.current) {
        observer.unobserve(targetRef.current);
      }
    };
  }, [hasAnimated]);

  return {
    hasAnimated,
    targetRef,
  };
};
