"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useInView } from "react-intersection-observer";
import dynamic from "next/dynamic";

// Zoptymalizowane importy komponentów - leniwe ładowanie
const FloatingBubbles = dynamic(
  () =>
    import("@/components/ambro-ui/floating-bubbles").then(
      (mod) => mod.FloatingBubbles
    ),
  { ssr: false }
);
const ScrollProgress = dynamic(() =>
  import("@/components/ambro-ui/scroll-progress").then(
    (mod) => mod.ScrollProgress
  )
);
const SectionHeading = dynamic(() =>
  import("@/components/ambro-ui/section-heading").then(
    (mod) => mod.SectionHeading
  )
);
const SmoothScroll = dynamic(
  () =>
    import("@/components/ambro-ui/smooth-scroll").then(
      (mod) => mod.SmoothScroll
    ),
  { ssr: false }
);
const Card3D = dynamic(() =>
  import("@/components/ambro-ui/card-3d").then((mod) => mod.Card3D)
);
const GradientText = dynamic(() =>
  import("@/components/ambro-ui/gradient-text").then((mod) => mod.GradientText)
);
const RevealText = dynamic(() =>
  import("@/components/ambro-ui/reveal-text").then((mod) => mod.RevealText)
);
const AnimatedSection = dynamic(() =>
  import("@/components/ambro-ui/animated-section").then(
    (mod) => mod.AnimatedSection
  )
);
const EnhancedButton = dynamic(() =>
  import("@/components/ambro-ui/enhanced-button").then(
    (mod) => mod.EnhancedButton
  )
);
const SectionDivider = dynamic(() =>
  import("@/components/ambro-ui/section-divider").then(
    (mod) => mod.SectionDivider
  )
);
const AnimatedGradientBorder = dynamic(() =>
  import("@/components/ambro-ui/animated-gradient-border").then(
    (mod) => mod.AnimatedGradientBorder
  )
);
const TypewriterText = dynamic(() =>
  import("@/components/ambro-ui/typewriter-text").then(
    (mod) => mod.TypewriterText
  )
);

// Formularz kontaktowy z walidacją
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
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Walidacja formularza
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formState.imie.trim()) {
      newErrors.imie = "Imię jest wymagane";
    }

    if (!formState.email.trim()) {
      newErrors.email = "Email jest wymagany";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
      newErrors.email = "Podaj prawidłowy adres email";
    }

    if (!formState.temat) {
      newErrors.temat = "Wybierz temat wiadomości";
    }

    if (!formState.wiadomosc.trim()) {
      newErrors.wiadomosc = "Wiadomość jest wymagana";
    } else if (formState.wiadomosc.length < 10) {
      newErrors.wiadomosc = "Wiadomość powinna zawierać co najmniej 10 znaków";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));

    // Usuwanie błędu po wprowadzeniu zmian
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      // Symulacja wysyłania formularza (w rzeczywistym projekcie byłoby API)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Analityka konwersji
      if (typeof window !== "undefined" && "gtag" in window) {
        window.gtag("event", "form_submission", {
          event_category: "contact",
          event_label: formState.temat,
        });
      }

      // Resetowanie formularza po pomyślnym wysłaniu
      setSubmitted(true);
      setFormState({
        imie: "",
        email: "",
        temat: "",
        wiadomosc: "",
      });
    } catch {
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
          <div className="text-center py-10" role="alert" aria-live="assertive">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-green-500 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <title>Wiadomość wysłana</title>
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
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
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
                  aria-invalid={!!errors.imie}
                  aria-describedby={errors.imie ? "imie-error" : undefined}
                  className={`w-full px-4 py-3 bg-gray-800/50 border ${
                    errors.imie ? "border-red-500" : "border-gray-700"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white`}
                  placeholder="Twoje imię"
                  required
                />
                {errors.imie && (
                  <p id="imie-error" className="mt-1 text-sm text-red-500">
                    {errors.imie}
                  </p>
                )}
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
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className={`w-full px-4 py-3 bg-gray-800/50 border ${
                    errors.email ? "border-red-500" : "border-gray-700"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white`}
                  placeholder="twoj@email.com"
                  required
                />
                {errors.email && (
                  <p id="email-error" className="mt-1 text-sm text-red-500">
                    {errors.email}
                  </p>
                )}
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
                aria-invalid={!!errors.temat}
                aria-describedby={errors.temat ? "temat-error" : undefined}
                className={`w-full px-4 py-3 bg-gray-800/50 border ${
                  errors.temat ? "border-red-500" : "border-gray-700"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white`}
                required
              >
                <option value="">Wybierz temat</option>
                <option value="Zapytanie o projekt">Zapytanie o projekt</option>
                <option value="Współpraca">Współpraca</option>
                <option value="Wycena">Wycena</option>
                <option value="Inny">Inny</option>
              </select>
              {errors.temat && (
                <p id="temat-error" className="mt-1 text-sm text-red-500">
                  {errors.temat}
                </p>
              )}
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
                aria-invalid={!!errors.wiadomosc}
                aria-describedby={
                  errors.wiadomosc ? "wiadomosc-error" : undefined
                }
                className={`w-full px-4 py-3 bg-gray-800/50 border ${
                  errors.wiadomosc ? "border-red-500" : "border-gray-700"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white`}
                placeholder="Opisz swój projekt lub zadaj pytanie..."
                required
              />
              {errors.wiadomosc && (
                <p id="wiadomosc-error" className="mt-1 text-sm text-red-500">
                  {errors.wiadomosc}
                </p>
              )}
            </div>

            {error && (
              <div
                className="p-3 bg-red-900/30 border border-red-500 rounded-lg text-red-200 text-sm"
                role="alert"
              >
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

// FAQ z "lazy loading" i intersection observer
const FAQ = () => {
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

  return (
    <div className="mt-16 max-w-3xl mx-auto space-y-6">
      {faqItems.map((item, index) => (
        <FAQItem
          key={`faq-${
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            index
          }`}
          item={item}
          index={index}
        />
      ))}
    </div>
  );
};

// Komponent mapy z obsługą ładowania
const MapSection = () => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Symulacja ładowania mapy gdy sekcja jest widoczna
  useEffect(() => {
    if (inView && !mapLoaded) {
      const timer = setTimeout(() => {
        setMapLoaded(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [inView, mapLoaded]);

  return (
    <section ref={ref} className="py-24 px-6">
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
              <div
                ref={mapRef}
                className="w-full h-full flex items-center justify-center bg-gray-800/50 relative overflow-hidden rounded-xl"
              >
                {!mapLoaded ? (
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-12 h-12 border-t-2 border-b-2 border-indigo-500 rounded-full animate-spin mb-4" />
                    <p className="text-gray-400">Ładowanie mapy...</p>
                  </div>
                ) : (
                  <>
                    <div className="absolute inset-0 opacity-20">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="100%"
                        height="100%"
                        aria-hidden="true"
                      >
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
                          aria-hidden="true"
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
                        href="https://maps.google.com/?q=Warsaw,Poland"
                        target="_blank"
                        rel="noopener noreferrer"
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
                  </>
                )}
              </div>
            </Card3D>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

// Komponent danych kontaktowych z opóźnionym ładowaniem ikon
const ContactInfo = () => {
  const socialLinks = [
    {
      name: "GitHub",
      url: "https://github.com/devos",
      icon: "/icons/github.svg",
    },
    {
      name: "Twitter",
      url: "https://twitter.com/devos",
      icon: "/icons/twitter.svg",
    },
    {
      name: "LinkedIn",
      url: "https://linkedin.com/company/devos",
      icon: "/icons/linkedin.svg",
    },
    {
      name: "Instagram",
      url: "https://instagram.com/devos",
      icon: "/icons/instagram.svg",
    },
  ];

  return (
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
              className="h-6 w-6 text-indigo-400 mr-4 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
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
              className="h-6 w-6 text-indigo-400 mr-4 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
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
              className="h-6 w-6 text-indigo-400 mr-4 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
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
              className="h-6 w-6 text-indigo-400 mr-4 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
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
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-indigo-500/30 transition-colors"
                aria-label={social.name}
                rel="noopener noreferrer"
                target="_blank"
              >
                <span className="sr-only">{social.name}</span>
                <div className="w-5 h-5 rounded-full bg-indigo-400/50" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </Card3D>
  );
};

// Główny komponent strony
export default function ContactPageContent() {
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

                <div className="max-w-2xl mx-auto mt-6 text-gray-300">
                  <RevealText>
                    Masz pomysł na projekt lub pytanie? Jestem tutaj, aby pomóc.
                    Wypełnij formularz poniżej lub skorzystaj z innych metod
                    kontaktu, a odezwę się najszybciej, jak to możliwe.
                  </RevealText>
                </div>
              </div>
            </AnimatedSection>

            {/* Contact Info & Form */}
            <div className="mt-16 grid md:grid-cols-5 gap-8">
              <AnimatedSection
                animation="slideLeft"
                delay={0.3}
                className="md:col-span-2"
              >
                <ContactInfo />
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

            <FAQ />
          </div>
        </section>

        {/* Map Section */}
        <MapSection />

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

const FAQItem = ({
  item,
  index,
}: {
  item: { pytanie: string; odpowiedz: string };
  index: number;
}) => {
  // Move the useInView hook to the top level of this component
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div ref={ref}>
      {inView && (
        <AnimatedSection animation="slideUp" delay={0.1 * index}>
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
      )}
    </div>
  );
};
