// src/app/kontakt/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FloatingBubbles } from "@/components/ambro-ui/floating-bubbles";
import { ScrollProgress } from "@/components/ambro-ui/scroll-progress";
import { SectionHeading } from "@/components/ambro-ui/section-heading";
import { SmoothScroll } from "@/components/ambro-ui/smooth-scroll";
import { Card3D } from "@/components/ambro-ui/card-3d";
import { GradientText } from "@/components/ambro-ui/gradient-text";
import { RevealText } from "@/components/ambro-ui/reveal-text";
import { AnimatedSection } from "@/components/ambro-ui/animated-section";
import { EnhancedButton } from "@/components/ambro-ui/enhanced-button";
import { SectionDivider } from "@/components/ambro-ui/section-divider";
import { AnimatedGradientBorder } from "@/components/ambro-ui/animated-gradient-border";
import { TypewriterText } from "@/components/ambro-ui/typewriter-text";

// Formularz kontaktowy
const FormularzKontaktowy = () => {
  const [formState, setFormState] = useState({
    imie: "",
    email: "",
    temat: "",
    wiadomosc: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    // Tutaj w normalnych warunkach byłoby wysyłanie formularza do API
    // Symulujemy opóźnienie i sukces
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Symulujemy sukces
      setSubmitted(true);
      setFormState({
        imie: "",
        email: "",
        temat: "",
        wiadomosc: "",
      });
    } catch (err) {
      setError(
        "Wystąpił błąd podczas wysyłania wiadomości. Spróbuj ponownie później."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatedGradientBorder
      borderWidth={2}
      borderColor="from-indigo-500 via-purple-500 to-pink-500"
      glowEffect
      glowIntensity={8}
      animated
      backgroundColor="bg-gray-900/50"
      rounded="rounded-xl"
    >
      <div className="p-8">
        <h3 className="text-2xl font-bold mb-6">Wyślij wiadomość</h3>

        {submitted ? (
          <div className="text-center py-10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-green-500 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <h4 className="text-xl font-medium mb-2">Wiadomość wysłana!</h4>
            <p className="text-gray-300 mb-6">
              Dziękuję za kontakt. Odpowiem na Twoją wiadomość najszybciej jak
              to możliwe.
            </p>
            <EnhancedButton
              variant="outline"
              size="md"
              onClick={() => setSubmitted(false)}
            >
              Wyślij kolejną wiadomość
            </EnhancedButton>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="imie"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Imię i nazwisko <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="imie"
                  name="imie"
                  value={formState.imie}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                  placeholder="Twoje imię"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formState.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                  placeholder="twoj@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="temat"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Temat wiadomości <span className="text-red-500">*</span>
              </label>
              <select
                id="temat"
                name="temat"
                value={formState.temat}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                required
              >
                <option value="">Wybierz temat</option>
                <option value="Zapytanie o projekt">Zapytanie o projekt</option>
                <option value="Współpraca">Współpraca</option>
                <option value="Wycena">Wycena</option>
                <option value="Inny">Inny</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="wiadomosc"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Wiadomość <span className="text-red-500">*</span>
              </label>
              <textarea
                id="wiadomosc"
                name="wiadomosc"
                rows={6}
                value={formState.wiadomosc}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                placeholder="Opisz swój projekt lub zadaj pytanie..."
                required
              ></textarea>
            </div>

            {error && (
              <div className="p-3 bg-red-900/30 border border-red-500 rounded-lg text-red-200 text-sm">
                {error}
              </div>
            )}

            <EnhancedButton
              variant="tech"
              size="lg"
              type="submit"
              className="w-full"
              rippleEffect
              glowOnHover
              loading={submitting}
              loadingText="Wysyłanie..."
            >
              Wyślij wiadomość
            </EnhancedButton>

            <p className="text-gray-400 text-xs text-center">* Pola wymagane</p>
          </form>
        )}
      </div>
    </AnimatedGradientBorder>
  );
};

// FAQ
const faqItems = [
  {
    pytanie: "Jaki jest typowy czas realizacji projektu?",
    odpowiedz:
      "Czas realizacji zależy od złożoności projektu. Małe projekty mogą trwać od 2 do 4 tygodni, podczas gdy większe, bardziej złożone projekty mogą wymagać 3-6 miesięcy. Na początku współpracy zawsze ustalam realistyczny harmonogram z uwzględnieniem Twoich potrzeb biznesowych.",
  },
  {
    pytanie: "Jakie są typowe koszty stworzenia aplikacji webowej?",
    odpowiedz:
      "Koszt zależy od wielu czynników, takich jak złożoność, funkcjonalności, skala projektu i terminy. Każdy projekt wyceniam indywidualnie, biorąc pod uwagę wszystkie wymagania. Po wstępnej konsultacji przedstawiam szczegółową wycenę z rozpisanymi kosztami poszczególnych etapów.",
  },
  {
    pytanie:
      "Czy zajmujesz się również utrzymaniem aplikacji po jej wdrożeniu?",
    odpowiedz:
      "Tak, oferuję kompleksowe wsparcie po wdrożeniu, w tym hosting, monitorowanie, aktualizacje zabezpieczeń, poprawki błędów i dalszy rozwój aplikacji. Możemy ustalić odpowiedni plan utrzymania dostosowany do potrzeb Twojego projektu.",
  },
  {
    pytanie: "Jak wygląda proces współpracy od początku do końca?",
    odpowiedz:
      "Proces rozpoczyna się od konsultacji i analizy wymagań, następnie przechodzimy do projektowania UI/UX, implementacji, testów i wreszcie wdrożenia. Na każdym etapie zapewniam przejrzystą komunikację i regularne aktualizacje postępu prac. Po wdrożeniu oferuję wsparcie techniczne i możliwość dalszego rozwoju projektu.",
  },
  {
    pytanie: "Czy podpisujesz umowy o poufności (NDA)?",
    odpowiedz:
      "Tak, zawsze szanuję poufność projektów klientów i jestem gotów podpisać NDA przed rozpoczęciem szczegółowych rozmów o projekcie. Bezpieczeństwo i poufność Twoich danych i pomysłów są dla mnie priorytetem.",
  },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Effect */}
      <FloatingBubbles
        count={20}
        fixed
        color="rgba(99, 102, 241, 0.2)"
        maxSize={100}
        minSize={20}
        interactive
      />

      {/* Scroll Progress Indicator */}
      <ScrollProgress
        position="top"
        color="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
      />

      <SmoothScroll>
        {/* Header Section */}
        <section className="relative py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <AnimatedSection animation="fadeIn">
              <div className="text-center">
                <Link href="/">
                  <EnhancedButton variant="outline" size="sm" className="mb-8">
                    ← Powrót do strony głównej
                  </EnhancedButton>
                </Link>

                <SectionHeading
                  title="Kontakt"
                  subtitle="Porozmawiajmy o Twoim projekcie"
                  alignment="center"
                  size="xl"
                  gradient
                  animation="slide"
                />

                <p className="max-w-2xl mx-auto mt-6 text-gray-300">
                  <RevealText>
                    Masz pomysł na projekt lub pytanie? Jestem tutaj, aby pomóc.
                    Wypełnij formularz poniżej lub skorzystaj z innych metod
                    kontaktu, a odezwę się najszybciej, jak to możliwe.
                  </RevealText>
                </p>
              </div>
            </AnimatedSection>

            {/* Contact Info & Form */}
            <div className="mt-16 grid md:grid-cols-5 gap-8">
              <AnimatedSection
                animation="slideLeft"
                delay={0.3}
                className="md:col-span-2"
              >
                <Card3D
                  interactive={false}
                  glowEffect
                  shadow
                  bgColor="bg-gray-900/50"
                  borderColor="border-indigo-500/20"
                  height="100%"
                >
                  <div className="p-8">
                    <h3 className="text-2xl font-bold mb-6">Dane kontaktowe</h3>

                    <div className="space-y-6 mb-8">
                      <div className="flex items-start">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-indigo-400 mr-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        <div>
                          <p className="font-medium">Email</p>
                          <a
                            href="mailto:kontakt@devos.pl"
                            className="text-gray-400 hover:text-indigo-400 transition-colors"
                          >
                            kontakt@devos.pl
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-indigo-400 mr-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        <div>
                          <p className="font-medium">Telefon</p>
                          <a
                            href="tel:+48123456789"
                            className="text-gray-400 hover:text-indigo-400 transition-colors"
                          >
                            +48 123 456 789
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-indigo-400 mr-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <div>
                          <p className="font-medium">Lokalizacja</p>
                          <p className="text-gray-400">Warszawa, Polska</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-indigo-400 mr-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <div>
                          <p className="font-medium">Godziny pracy</p>
                          <p className="text-gray-400">
                            Poniedziałek - Piątek: 9:00 - 17:00
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-4">Znajdź mnie w sieci</h4>
                      <div className="flex space-x-4">
                        {["github", "twitter", "linkedin", "instagram"].map(
                          (social) => (
                            <a
                              key={social}
                              href={`#${social}`}
                              className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-indigo-500/30 transition-colors"
                              aria-label={social}
                            >
                              {/* Placeholder for social icons */}
                              <div className="w-5 h-5 rounded-full bg-indigo-400/50"></div>
                            </a>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </Card3D>
              </AnimatedSection>

              <AnimatedSection
                animation="slideRight"
                delay={0.4}
                className="md:col-span-3"
              >
                <FormularzKontaktowy />
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 px-6 bg-gradient-to-b from-black to-gray-900">
          <div className="max-w-6xl mx-auto">
            <AnimatedSection animation="fadeIn">
              <SectionHeading
                title="Często zadawane pytania"
                subtitle="Odpowiedzi na najczęściej zadawane pytania"
                alignment="center"
                size="xl"
                gradient
                animation="fade"
              />
            </AnimatedSection>

            <div className="mt-16 max-w-3xl mx-auto space-y-6">
              {faqItems.map((item, index) => (
                <AnimatedSection
                  key={index}
                  animation="slideUp"
                  delay={0.1 * index}
                >
                  <AnimatedGradientBorder
                    borderWidth={1}
                    borderColor="from-indigo-500 via-purple-500 to-pink-500"
                    glowEffect
                    glowIntensity={5}
                    animated
                    backgroundColor="bg-gray-900/30"
                    hoverEffect
                  >
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-3">{item.pytanie}</h3>
                      <p className="text-gray-300">{item.odpowiedz}</p>
                    </div>
                  </AnimatedGradientBorder>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <AnimatedSection animation="fadeIn">
              <SectionHeading
                title="Moja lokalizacja"
                subtitle="Warszawa, Polska"
                alignment="center"
                size="lg"
                gradient
                animation="fade"
              />
            </AnimatedSection>

            <div className="mt-10">
              <AnimatedSection animation="slideUp" delay={0.3}>
                <Card3D
                  interactive={false}
                  glowEffect
                  shadow
                  bgColor="bg-gray-900/30"
                  borderColor="border-indigo-500/20"
                  height="400px"
                >
                  {/* Placeholder for map - w rzeczywistym projekcie można wykorzystać np. Google Maps lub Mapbox */}
                  <div className="w-full h-full flex items-center justify-center bg-gray-800/50 relative overflow-hidden rounded-xl">
                    <div className="absolute inset-0 opacity-20">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="100%"
                        height="100%"
                      >
                        <title>Map Grid</title>
                        <defs>
                          <pattern
                            id="smallGrid"
                            width="20"
                            height="20"
                            patternUnits="userSpaceOnUse"
                          >
                            <path
                              d="M 20 0 L 0 0 0 20"
                              fill="none"
                              stroke="#6366f1"
                              strokeWidth="0.5"
                            />
                          </pattern>
                          <pattern
                            id="grid"
                            width="100"
                            height="100"
                            patternUnits="userSpaceOnUse"
                          >
                            <rect
                              width="100"
                              height="100"
                              fill="url(#smallGrid)"
                            />
                            <path
                              d="M 100 0 L 0 0 0 100"
                              fill="none"
                              stroke="#6366f1"
                              strokeWidth="1"
                            />
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                      </svg>
                    </div>

                    <div className="relative z-10 text-center">
                      <div className="w-16 h-16 rounded-full bg-indigo-500/20 border-4 border-indigo-500 flex items-center justify-center mx-auto mb-4 animate-pulse">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8 text-indigo-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold">Warszawa, Polska</h3>
                      <p className="text-gray-400 mt-2">Centrum miasta</p>

                      <Link
                        href="https://maps.google.com"
                        target="_blank"
                        passHref
                      >
                        <EnhancedButton
                          variant="outline"
                          size="sm"
                          className="mt-6"
                        >
                          Otwórz w Google Maps
                        </EnhancedButton>
                      </Link>
                    </div>
                  </div>
                </Card3D>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6 bg-gradient-to-b from-gray-900 to-black">
          <div className="max-w-4xl mx-auto text-center">
            <AnimatedSection animation="fadeIn">
              <GradientText
                from="indigo-500"
                via="purple-500"
                to="pink-500"
                fontSize="text-3xl md:text-4xl"
                fontWeight="font-bold"
                glowEffect
                glowIntensity={10}
                className="mb-6"
              >
                Gotowy na rozpoczęcie projektu?
              </GradientText>

              <TypewriterText
                text="Skontaktuj się już dziś i przekształćmy Twój pomysł w rzeczywistość."
                speed={40}
                className="text-xl text-gray-300 mb-10"
                cursorChar="_"
                cursorColor="text-indigo-400"
              />
            </AnimatedSection>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 bg-black border-t border-gray-800">
          <div className="max-w-6xl mx-auto">
            <SectionDivider
              variant="tech"
              lineColor="from-transparent via-gray-800 to-transparent"
              dotColor="bg-indigo-500"
            />

            <div className="pt-8 text-center text-gray-500 text-sm">
              <p>
                &copy; {new Date().getFullYear()} DevOS. Wszelkie prawa
                zastrzeżone.
              </p>
            </div>
          </div>
        </footer>
      </SmoothScroll>
    </main>
  );
}
