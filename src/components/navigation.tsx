"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { GradientText } from "@/components/ambro-ui/gradient-text";
import { EnhancedButton } from "@/components/ambro-ui/enhanced-button";

// Lista linków nawigacyjnych
const navLinks = [
  { href: "/", label: "Strona główna" },
  { href: "/o-mnie", label: "O mnie" },
  { href: "/uslugi", label: "Usługi" },
  { href: "/projekty", label: "Projekty" },
  { href: "/cennik", label: "Cennik" },
  { href: "/kontakt", label: "Kontakt" },
];

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Obsługa scrollowania z debounce
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    // Wywołaj od razu, aby ustawić stan na podstawie początkowej pozycji scrollowania
    handleScroll();

    // Dodanie debounce dla lepszej wydajności
    let timeout: NodeJS.Timeout;
    const debouncedHandleScroll = () => {
      clearTimeout(timeout);
      timeout = setTimeout(handleScroll, 10);
    };

    window.addEventListener("scroll", debouncedHandleScroll);
    return () => {
      window.removeEventListener("scroll", debouncedHandleScroll);
      clearTimeout(timeout);
    };
  }, []);

  // Zamykanie menu mobilnego po zmianie trasy
  useEffect(() => {
    setMobileMenuOpen(false);
  }, []);

  // Blokowanie scrollowania gdy menu mobilne jest otwarte
  useEffect(() => {
    if (mobileMenuOpen) {
      // Zapisujemy aktualną pozycję scrollowania przed zablokowaniem
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflowY = "scroll"; // Zapobiega przesunięciu strony
    } else {
      // Przywracamy pozycję scrollowania po zamknięciu menu
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflowY = "";
      if (scrollY) {
        window.scrollTo(0, Number.parseInt(scrollY || "0") * -1);
      }
    }
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflowY = "";
    };
  }, [mobileMenuOpen]);

  // Sprawdzanie czy link jest aktywny
  const isLinkActive = (href: string) => {
    if (href === "/" && pathname === "/") return true;
    if (href !== "/" && pathname.startsWith(href)) return true;
    return false;
  };

  // Warianty animacji dla menu mobilnego
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

  return (
    <>
      {/* Mobilne menu - jako niezależny element */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-gradient-to-b from-black/95 to-indigo-950/95 backdrop-blur-xl z-[55]"
          >
            <div className="flex flex-col h-full">
              {/* Pasek górny z logo i przyciskiem zamykania */}
              <div
                className={`py-6 px-6 flex items-center justify-between ${
                  isScrolled ? "py-3" : ""
                }`}
              >
                {/* Logo */}
                <Link href="/" className="relative group">
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

                {/* Przycisk zamykania w menu mobilnym */}
                <motion.button
                  onClick={() => setMobileMenuOpen(false)}
                  className="relative z-[60] p-2 -mr-2"
                  type="button"
                  aria-label="Zamknij menu"
                  whileTap={{ scale: 0.9 }}
                >
                  <div className="w-6 h-5 flex flex-col justify-between items-center">
                    <motion.span
                      animate={{ rotate: 45, translateY: 8 }}
                      className="block h-0.5 w-full bg-white origin-center"
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                      }}
                    />
                    <motion.span
                      animate={{ opacity: 0 }}
                      className="block h-0.5 w-full bg-white"
                      transition={{ duration: 0.2 }}
                    />
                    <motion.span
                      animate={{ rotate: -45, translateY: -8 }}
                      className="block h-0.5 w-full bg-white origin-center"
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                      }}
                    />
                  </div>
                </motion.button>
              </div>

              {/* Treść menu mobilnego */}
              <div className="flex-grow flex flex-col items-center justify-center">
                <motion.nav
                  className="flex flex-col items-center space-y-8"
                  variants={menuVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                >
                  {navLinks.map((link) => (
                    <motion.div key={link.href} variants={itemVariants}>
                      <Link
                        href={link.href}
                        className={`text-2xl font-medium transition-colors hover:text-white relative group ${
                          isLinkActive(link.href)
                            ? "text-indigo-400"
                            : "text-gray-300"
                        }`}
                      >
                        {link.label}
                        <motion.span
                          className={`absolute -bottom-2 left-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 ${
                            isLinkActive(link.href)
                              ? "w-full"
                              : "w-0 group-hover:w-full"
                          }`}
                          transition={{ duration: 0.3 }}
                        />
                      </Link>
                    </motion.div>
                  ))}

                  <motion.div
                    variants={itemVariants}
                    className="mt-6 pt-4 border-t border-indigo-500/20 w-32 flex justify-center"
                  >
                    <motion.div
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
                    </motion.div>
                  </motion.div>
                </motion.nav>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header nawigacyjny */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-black/85 backdrop-blur-xl py-3 shadow-lg shadow-indigo-500/10"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          {/* Logo z animacją */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" className="relative z-50 group">
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
              <motion.span
                className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 w-0 group-hover:w-full"
                transition={{ duration: 0.3 }}
              />
            </Link>
          </motion.div>

          {/* Nawigacja desktop z ulepszonymi efektami hover */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="relative group">
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
                  <motion.span
                    className="absolute -bottom-1 left-0 h-0.5 w-full bg-indigo-400"
                    layoutId="underline"
                  />
                ) : (
                  <motion.span
                    className="absolute -bottom-1 left-0 h-0.5 bg-indigo-400 w-0 group-hover:w-full"
                    transition={{ duration: 0.2 }}
                  />
                )}
              </Link>
            ))}

            <motion.div
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
            </motion.div>
          </nav>

          {/* Przycisk menu mobilne - tylko do otwierania */}
          {!mobileMenuOpen && (
            <motion.button
              onClick={() => setMobileMenuOpen(true)}
              className="relative z-[60] md:hidden p-2 -mr-2"
              type="button"
              aria-label="Otwórz menu"
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-6 h-5 flex flex-col justify-between items-center">
                <motion.span className="block h-0.5 w-full bg-white origin-center" />
                <motion.span className="block h-0.5 w-full bg-white" />
                <motion.span className="block h-0.5 w-full bg-white origin-center" />
              </div>
            </motion.button>
          )}
        </div>
      </header>
    </>
  );
};

export default Navigation;
