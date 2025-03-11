"use client";

import React from "react";
import { motion } from "framer-motion";
import { GradientText, RevealText } from "@/components/EnhancedUI";

const ContactSection = () => {
  return (
    <section id="contact" className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900/95 to-blue-900/20" />
        <div className="h-full w-full">
          {/* Animated dots */}
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={`animated-dot-${i}-${Math.random()
                .toString(36)
                .substr(2, 9)}`}
              className="absolute rounded-full bg-blue-500"
              initial={{
                x: `${Math.random() * 100}%`,
                y: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5 + 0.1,
                scale: Math.random() * 0.8 + 0.2,
              }}
              animate={{
                x: `${Math.random() * 100}%`,
                y: `${Math.random() * 100}%`,
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: Math.random() * 20 + 10,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
              style={{
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <RevealText className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <GradientText from="teal-500" via="cyan-500" to="blue-500">
              Skontaktuj się ze mną
            </GradientText>
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Potrzebujesz wsparcia w zakresie DevOps, architektury IT lub
            bezpieczeństwa systemów? Skontaktuj się ze mną, aby omówić
            możliwości współpracy.
          </p>
        </RevealText>

        <div className="max-w-2xl mx-auto">
          <motion.form
            className="bg-gray-800/50 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-gray-700"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Imię i nazwisko
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                  placeholder="Jan Kowalski"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                  placeholder="jan@example.com"
                />
              </div>
            </div>
            <div className="mb-6">
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Temat
              </label>
              <input
                type="text"
                id="subject"
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                placeholder="Temat wiadomości"
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Wiadomość
              </label>
              <textarea
                id="message"
                rows={5}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                placeholder="Treść wiadomości..."
              />
            </div>
            <div>
              <motion.button
                type="submit"
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Wyślij wiadomość
              </motion.button>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
