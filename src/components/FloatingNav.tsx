"use client";

import React, { useState, useEffect, useMemo, type ReactNode } from "react";
import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";

/**
 * Interface for navigation items
 */
interface NavItem {
  label: string;
  href: string;
  icon?: ReactNode;
}

/**
 * Floating navigation bar with section tracking and animations
 */
export const FloatingNav: React.FC<{
  items: NavItem[];
  className?: string;
  showAfter?: number;
  position?: "bottom" | "top";
  bgColor?: string;
  textColor?: string;
  activeColor?: string;
}> = ({
  items,
  className = "",
  showAfter = 500,
  position = "bottom",
  bgColor = "bg-gray-800/80",
  textColor = "text-gray-400",
  activeColor = "text-white",
}) => {
  const [activeSection, setActiveSection] = useState<string>("");
  const [visible, setVisible] = useState<boolean>(false);

  // Calculate position classes once when props change
  const positionClasses = useMemo(() => {
    return position === "top"
      ? "top-8 left-1/2 transform -translate-x-1/2"
      : "bottom-8 left-1/2 transform -translate-x-1/2";
  }, [position]);

  // Scroll handler - track visibility and active section
  useEffect(() => {
    const handleScroll = () => {
      // Show/hide the nav based on scroll position
      setVisible(window.scrollY > showAfter);

      // Get all section IDs from href values (removing the #)
      const sectionIds = items.map((item) => item.href.substring(1));

      // Find all visible sections (closest to top gets priority)
      const visibleSections = sectionIds
        .filter((id) => {
          const element = document.getElementById(id);
          if (!element) return false;

          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 0;
        })
        .sort((a, b) => {
          // Sort by proximity to top of viewport
          const aElement = document.getElementById(a);
          const bElement = document.getElementById(b);

          if (!aElement || !bElement) return 0;

          return (
            Math.abs(aElement.getBoundingClientRect().top) -
            Math.abs(bElement.getBoundingClientRect().top)
          );
        });

      // Update active section (first visible one, closest to top)
      if (visibleSections.length > 0) {
        setActiveSection(visibleSections[0]);
      }
    };
    if (window)
      if (window)
        // Set up scroll listener
        (window as Window).addEventListener("scroll", handleScroll);

    // Initial check
    handleScroll();

    // Clean up
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [items, showAfter]);

  // Animation variants for smooth transitions
  const navVariants = {
    hidden: {
      y: position === "top" ? -100 : 100,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
      },
    },
    exit: {
      y: position === "top" ? -100 : 100,
      opacity: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.nav
      className={twMerge(`fixed z-40 ${positionClasses}`, className)}
      initial="hidden"
      animate={visible ? "visible" : "hidden"}
      variants={navVariants}
      aria-label="Navigation"
    >
      <motion.div
        className={`${bgColor} backdrop-blur-sm rounded-full p-2 border border-gray-700/50 shadow-lg`}
        layout
      >
        <div className="flex items-center space-x-1">
          {items.map((item) => {
            const isActive = activeSection === item.href.substring(1);
            return (
              <motion.a
                key={item.href}
                href={item.href}
                className={twMerge(
                  "relative px-4 py-2 rounded-full flex items-center justify-center text-sm transition-colors",
                  isActive ? activeColor : `${textColor} hover:${activeColor}`
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-current={isActive ? "page" : undefined}
              >
                {isActive && (
                  <motion.div
                    className="absolute inset-0 bg-blue-600/20 rounded-full"
                    layoutId="navIndicator"
                    transition={{
                      type: "spring",
                      damping: 20,
                      stiffness: 300,
                    }}
                  />
                )}
                <span className="relative z-10 flex items-center">
                  {item.icon && <span className="mr-2">{item.icon}</span>}
                  {item.label}
                </span>
              </motion.a>
            );
          })}
        </div>
      </motion.div>
    </motion.nav>
  );
};

/**
 * Custom hook to create floating nav items with icon components
 */
export const useNavItems = (
  items: Array<{
    label: string;
    href: string;
    iconName?: string;
  }>,
  iconComponents: Record<
    string,
    React.ComponentType<{ size?: number; className?: string }>
  >
): NavItem[] => {
  return items.map((item) => ({
    label: item.label,
    href: item.href,
    icon:
      item.iconName && iconComponents[item.iconName]
        ? React.createElement(iconComponents[item.iconName], {
            size: 18,
            className: "opacity-75",
          })
        : undefined,
  }));
};
