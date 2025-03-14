// src/components/navigation.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { GradientText } from "@/components/ambro-ui/gradient-text";
import { EnhancedButton } from "@/components/ambro-ui/enhanced-button";

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Obsługa scrollowania
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Zamykanie menu mobilnego po zmianie trasy
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lista linków nawigacyjnych
  const navLinks = [
    { href: "/", label: "Strona główna" },
    { href: "/o-mnie", label: "O mnie" },
    { href: "/projekty", label: "Projekty" },
    { href: "/cennik", label: "Cennik" },
    { href: "/kontakt", label: "Kontakt" },
  ];

  // Sprawdzanie czy link jest aktywny
  const isLinkActive = (href: string) => {
    if (href === "/" && pathname === "/") return true;
    if (href !== "/" && pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? "bg-black/80 backdrop-blur-md py-3 shadow-lg"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="relative z-50">
          <GradientText
            from="indigo-500"
            via="purple-500"
            to="pink-500"
            fontSize="text-2xl"
            fontWeight="bold"
            animated={true}
            duration={8}
          >
            Ambro-Dev
          </GradientText>
        </Link>

        {/* Nawigacja desktop */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-indigo-400 ${
                isLinkActive(link.href) ? "text-indigo-400" : "text-gray-200"
              }`}
            >
              {link.label}
            </Link>
          ))}

          <EnhancedButton
            variant="tech"
            size="sm"
            magneticEffect
            glowOnHover
            href="/kontakt"
          >
            Rozpocznij projekt
          </EnhancedButton>
        </nav>

        {/* Przycisk menu mobilne */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="relative z-50 md:hidden"
          aria-label={mobileMenuOpen ? "Zamknij menu" : "Otwórz menu"}
        >
          <div className="w-6 h-6 flex flex-col justify-between items-center">
            <span
              className={`block h-0.5 w-full bg-white transition-all duration-300 ${
                mobileMenuOpen ? "rotate-45 translate-y-2.5" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-full bg-white transition-all duration-300 ${
                mobileMenuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`block h-0.5 w-full bg-white transition-all duration-300 ${
                mobileMenuOpen ? "-rotate-45 -translate-y-2.5" : ""
              }`}
            />
          </div>
        </button>

        {/* Menu mobilne */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/95 backdrop-blur-md z-40 flex flex-col items-center justify-center"
            >
              <nav className="flex flex-col items-center space-y-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-xl font-medium transition-colors hover:text-indigo-400 ${
                      isLinkActive(link.href)
                        ? "text-indigo-400"
                        : "text-gray-200"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}

                <EnhancedButton
                  variant="tech"
                  size="md"
                  magneticEffect
                  glowOnHover
                  href="/kontakt"
                  className="mt-4"
                >
                  Rozpocznij projekt
                </EnhancedButton>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Navigation;
