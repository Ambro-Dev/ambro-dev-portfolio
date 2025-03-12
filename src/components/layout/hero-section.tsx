"use client";

import React from "react";
import EnhancedHero from "@/components/home/EnhancedHero";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative">
      <EnhancedHero />

      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-slate-300 cursor-pointer z-10 group"
        animate={{
          y: [0, 5, 0],
          opacity: [0.6, 0.8, 0.6],
        }}
        transition={{
          duration: 2.5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        onClick={() => {
          document
            .getElementById("services")
            ?.scrollIntoView({ behavior: "smooth" });
        }}
      >
        <motion.p
          className="mb-2 text-xs font-light tracking-wider uppercase opacity-70 group-hover:opacity-100 transition-opacity"
          whileHover={{ letterSpacing: "0.15em" }}
        >
          Przewiń w dół
        </motion.p>

        <motion.div
          className="relative"
          whileHover={{ y: 3 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <ChevronDown
            size={20}
            strokeWidth={1.5}
            className="text-slate-400 group-hover:text-white transition-colors"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
