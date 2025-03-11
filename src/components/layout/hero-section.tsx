"use client";

import React from "react";
import EnhancedHero from "@/components/home/EnhancedHero";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="relative">
      <EnhancedHero />

      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-white cursor-pointer z-10"
        animate={{
          y: [0, 10, 0],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        onClick={() => {
          document
            .getElementById("services")
            ?.scrollIntoView({ behavior: "smooth" });
        }}
      >
        <p className="mb-2 text-sm font-medium">Przewiń w dół</p>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <title>Scroll down</title>
          <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
        </svg>
      </motion.div>
    </section>
  );
};

export default HeroSection;
