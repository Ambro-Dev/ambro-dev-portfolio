"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { GradientText } from "@/components/ambro-ui/gradient-text";
import { EnhancedButton } from "@/components/ambro-ui/enhanced-button";
import { throttle } from "lodash";

// Dynamiczne importowanie framer-motion dla zredukowania początkowego bundle size
const MotionDiv = motion.div;
const MotionSpan = motion.span;
const MotionNav = motion.nav;
const MotionButton = motion.button;

// Dane nawigacji zdefiniowane poza komponentem - nie będą rerender'owane
const navLinks = [
  { href: "/", label: "Strona główna" },
  { href: "/o-mnie", label: "O mnie" },
  { href: "/uslugi", label: "Usługi" },
  { href: "/projekty", label: "Projekty" },
  { href: "/cennik", label: "Cennik" },
  { href: "/kontakt", label: "Kontakt" },
];

// Animacje zdefiniowane poza komponentem
const menuVariants = {
  closed: {
    opacity: 0,
    y: -20,
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
  open: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  closed: { opacity: 0, y: -10 },
  open: { opacity: 1, y: 0 },
};

/**
 * Main navigation component with mobile and desktop views
 */
const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Optimized scroll handling with throttle
  useEffect(() => {
    // Initial check for scroll position
    const checkScroll = () => setIsScrolled(window.scrollY > 20);
    checkScroll();

    // Zredukowano rate throttle'a dla lepszej wydajności
    const handleScroll = throttle(checkScroll, 200);
    if (window)
      (window as Window).addEventListener("scroll", handleScroll, {
        passive: true,
      });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close mobile menu on route change
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Zoptymalizowane zarządzanie blokowaniem przewijania
  useEffect(() => {
    // Używamy bardziej wydajnego podejścia do blokowania scrolla
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Check if link is active - memoized for performance
  const isLinkActive = useCallback(
    (href: string) => {
      if (href === "/" && pathname === "/") return true;
      if (href !== "/" && pathname.startsWith(href)) return true;
      return false;
    },
    [pathname]
  );

  // Toggle mobile menu z useCallback dla lepszej wydajności
  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
  }, []);

  // Memoizowany renderowanie mobilnego menu dla redukcji niepotrzebnych re-renderów
  const mobileMenu = useMemo(() => {
    if (!mobileMenuOpen) return null;

    return (
      <MotionDiv
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 bg-gradient-to-b from-black/95 to-indigo-950/95 backdrop-blur-xl z-[55]"
        aria-modal="true"
        aria-label="Menu mobilne"
      >
        <div className="flex flex-col h-full">
          {/* Top bar with logo and close button */}
          <div
            className={`py-6 px-6 flex items-center justify-between ${
              isScrolled ? "py-3" : ""
            }`}
          >
            {/* Logo */}
            <Link
              href="/"
              className="relative group"
              aria-label="Strona główna"
            >
              <GradientText
                from="indigo-500"
                via="purple-500"
                to="pink-500"
                fontSize="text-2xl md:text-3xl"
                fontWeight="bold"
                animated={true}
                duration={6}
                className="tracking-tight"
              >
                Ambro-Dev
              </GradientText>
            </Link>

            {/* Close button */}
            <MotionButton
              onClick={toggleMobileMenu}
              className="relative z-[60] p-2 -mr-2"
              type="button"
              aria-label="Zamknij menu"
              whileTap={{ scale: 0.9 }}
            >
              <div className="w-6 h-5 flex flex-col justify-between items-center">
                <MotionSpan
                  animate={{ rotate: 45, translateY: 8 }}
                  className="block h-0.5 w-full bg-white origin-center"
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                  }}
                />
                <MotionSpan
                  animate={{ opacity: 0 }}
                  className="block h-0.5 w-full bg-white"
                  transition={{ duration: 0.2 }}
                />
                <MotionSpan
                  animate={{ rotate: -45, translateY: -8 }}
                  className="block h-0.5 w-full bg-white origin-center"
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                  }}
                />
              </div>
            </MotionButton>
          </div>

          {/* Mobile menu content */}
          <div className="flex-grow flex flex-col items-center justify-center">
            <MotionNav
              className="flex flex-col items-center space-y-8"
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              aria-label="Nawigacja mobilna"
            >
              {navLinks.map((link) => (
                <MotionDiv key={link.href} variants={itemVariants}>
                  <Link
                    href={link.href}
                    className={`text-2xl font-medium transition-colors hover:text-white relative group ${
                      isLinkActive(link.href)
                        ? "text-indigo-400"
                        : "text-gray-300"
                    }`}
                    aria-current={isLinkActive(link.href) ? "page" : undefined}
                  >
                    {link.label}
                    <MotionSpan
                      className={`absolute -bottom-2 left-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 ${
                        isLinkActive(link.href)
                          ? "w-full"
                          : "w-0 group-hover:w-full"
                      }`}
                      transition={{ duration: 0.3 }}
                    />
                  </Link>
                </MotionDiv>
              ))}

              <MotionDiv
                variants={itemVariants}
                className="mt-6 pt-4 border-t border-indigo-500/20 w-32 flex justify-center"
              >
                <MotionDiv
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <EnhancedButton
                    variant="tech"
                    size="md"
                    magneticEffect
                    glowOnHover
                    href="/kontakt"
                    className="font-medium"
                  >
                    Rozpocznij projekt
                  </EnhancedButton>
                </MotionDiv>
              </MotionDiv>
            </MotionNav>
          </div>
        </div>
      </MotionDiv>
    );
  }, [mobileMenuOpen, isScrolled, isLinkActive, toggleMobileMenu]);

  return (
    <>
      {/* Mobile menu overlay */}
      <AnimatePresence>{mobileMenu}</AnimatePresence>

      {/* Main navigation header */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled
            ? "bg-black/85 backdrop-blur-xl py-3 shadow-lg shadow-indigo-500/10"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          {/* Logo with animation */}
          <MotionDiv
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="/"
              className="relative z-20 group"
              aria-label="Strona główna"
            >
              <GradientText
                from="indigo-500"
                via="purple-500"
                to="pink-500"
                fontSize="text-2xl md:text-3xl"
                fontWeight="bold"
                animated={true}
                duration={6}
                className="tracking-tight"
              >
                Ambro-Dev
              </GradientText>
              <MotionSpan
                className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 w-0 group-hover:w-full"
                transition={{ duration: 0.3 }}
              />
            </Link>
          </MotionDiv>

          {/* Desktop navigation */}
          <nav
            className="hidden md:flex items-center space-x-8"
            aria-label="Nawigacja główna"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative group"
                aria-current={isLinkActive(link.href) ? "page" : undefined}
              >
                <span
                  className={`text-sm font-medium transition-colors duration-300 group-hover:text-white ${
                    isLinkActive(link.href)
                      ? "text-indigo-400"
                      : "text-gray-200"
                  }`}
                >
                  {link.label}
                </span>
                {isLinkActive(link.href) ? (
                  <MotionSpan
                    className="absolute -bottom-1 left-0 h-0.5 w-full bg-indigo-400"
                    layoutId="underline"
                  />
                ) : (
                  <MotionSpan
                    className="absolute -bottom-1 left-0 h-0.5 bg-indigo-400 w-0 group-hover:w-full"
                    transition={{ duration: 0.2 }}
                  />
                )}
              </Link>
            ))}

            <MotionDiv
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <EnhancedButton
                variant="tech"
                size="sm"
                magneticEffect
                glowOnHover
                href="/kontakt"
                className="ml-4 font-medium"
              >
                Rozpocznij projekt
              </EnhancedButton>
            </MotionDiv>
          </nav>

          {/* Mobile menu button */}
          {!mobileMenuOpen && (
            <MotionButton
              onClick={toggleMobileMenu}
              className="relative z-20 md:hidden p-2 -mr-2"
              type="button"
              aria-label="Otwórz menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-6 h-5 flex flex-col justify-between items-center">
                <MotionSpan className="block h-0.5 w-full bg-white origin-center" />
                <MotionSpan className="block h-0.5 w-full bg-white" />
                <MotionSpan className="block h-0.5 w-full bg-white origin-center" />
              </div>
            </MotionButton>
          )}
        </div>
      </header>
    </>
  );
};

export default Navigation;
