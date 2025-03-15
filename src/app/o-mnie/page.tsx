// src/app/o-mnie/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FloatingBubbles } from "@/components/ambro-ui/floating-bubbles";
import { ScrollProgress } from "@/components/ambro-ui/scroll-progress";
import { SectionHeading } from "@/components/ambro-ui/section-heading";
import { SmoothScroll } from "@/components/ambro-ui/smooth-scroll";
import { Card3D } from "@/components/ambro-ui/card-3d";
import { ClipMask } from "@/components/ambro-ui/clip-mask";
import { GradientText } from "@/components/ambro-ui/gradient-text";
import { RevealText } from "@/components/ambro-ui/reveal-text";
import { AnimatedSection } from "@/components/ambro-ui/animated-section";
import { EnhancedButton } from "@/components/ambro-ui/enhanced-button";
import { SectionDivider } from "@/components/ambro-ui/section-divider";
import { TiltCard } from "@/components/ambro-ui/tilt-card";
import { AnimatedGradientBorder } from "@/components/ambro-ui/animated-gradient-border";
import { TypewriterText } from "@/components/ambro-ui/typewriter-text";
import Image from "next/image";

// Dane doświadczenia zawodowego
const doswiadczenie = [
  {
    id: 1,
    firma: "TechSolutions S.A.",
    stanowisko: "Senior Software Developer",
    okres: "2021 - obecnie",
    opis: "Tworzenie zaawansowanych aplikacji webowych i mobilnych dla klientów korporacyjnych. Prowadzenie zespołu programistów, planowanie architektury systemów oraz wdrażanie najnowszych technologii.",
    technologie: [
      "React",
      "Next.js",
      "TypeScript",
      "Node.js",
      "GraphQL",
      "AWS",
    ],
    osiagniecia: [
      "Zredukowałem czas ładowania kluczowej aplikacji klienta o 40%",
      "Wdrożyłem architekturę mikroserwisową, zwiększając skalowalność i niezawodność systemu",
      "Stworzyłem framework wewnętrzny przyspieszający rozwój nowych projektów o 25%",
    ],
  },
  {
    id: 2,
    firma: "Innowacje.pl",
    stanowisko: "Full Stack Developer",
    okres: "2018 - 2021",
    opis: "Pełna odpowiedzialność za rozwój i utrzymanie platformy e-commerce. Projektowanie i implementacja nowych funkcjonalności, optymalizacja wydajności oraz integracja z zewnętrznymi systemami.",
    technologie: [
      "JavaScript",
      "React",
      "Redux",
      "Node.js",
      "MongoDB",
      "Docker",
    ],
    osiagniecia: [
      "Przeprowadziłem kompleksową modernizację platformy, zwiększając konwersje o 35%",
      "Zaimplementowałem system rekomendacji produktów, co zwiększyło średnią wartość zamówienia o 20%",
      "Opracowałem strategię CI/CD, skracając czas wdrożenia nowych funkcji z dni do godzin",
    ],
  },
  {
    id: 3,
    firma: "Digital Craft",
    stanowisko: "Frontend Developer",
    okres: "2016 - 2018",
    opis: "Tworzenie responsywnych interfejsów użytkownika dla aplikacji webowych. Współpraca z zespołem projektantów UX/UI w celu dostarczania intuicyjnych i estetycznych rozwiązań.",
    technologie: ["JavaScript", "React", "CSS/SASS", "Webpack", "Agile/Scrum"],
    osiagniecia: [
      "Stworzyłem system komponentów UI wielokrotnego użytku, przyspieszając czas rozwoju o 30%",
      "Zoptymalizowałem wydajność aplikacji, zwiększając ocenę PageSpeed z 65 do 95",
      "Przeprowadziłem 15 warsztatów dla zespołu z zakresu najnowszych technologii frontendowych",
    ],
  },
];

// Dane projektów osobistych
const projektyOsobiste = [
  {
    id: "devtools-extension",
    nazwa: "DevTools Extension",
    opis: "Rozszerzenie do przeglądarki ułatwiające codzienną pracę programisty. Narzędzie automatyzuje powtarzalne zadania, takie jak generowanie komponentów, formatowanie kodu czy testowanie API.",
    technologie: ["JavaScript", "Chrome API", "React", "Jest"],
    link: "https://github.com/devos/devtools-extension",
    image: "/api/placeholder/400/300",
    color: "from-indigo-500 to-blue-600",
  },
  {
    id: "nlp-analyzer",
    nazwa: "NLP Analyzer",
    opis: "Aplikacja do analizy tekstu wykorzystująca algorytmy przetwarzania języka naturalnego. Narzędzie pozwala na wykrywanie emocji, klasyfikację tekstu oraz ekstrakcję kluczowych informacji.",
    technologie: ["Python", "TensorFlow", "Flask", "React"],
    link: "https://github.com/devos/nlp-analyzer",
    image: "/api/placeholder/400/300",
    color: "from-purple-500 to-indigo-600",
  },
  {
    id: "smart-garden",
    nazwa: "Smart Garden System",
    opis: "System IoT do inteligentnego zarządzania ogrodem, monitorujący wilgotność gleby, nasłonecznienie oraz automatycznie sterujący nawadnianiem. Projekt łączy hardware (Arduino) z aplikacją webową i mobilną.",
    technologie: ["Arduino", "ESP32", "MQTT", "React Native", "Node.js"],
    link: "https://github.com/devos/smart-garden",
    image: "/api/placeholder/400/300",
    color: "from-green-500 to-teal-600",
  },
];

// Dane edukacji
const edukacja = [
  {
    id: 1,
    uczelnia: "Politechnika Warszawska",
    kierunek: "Informatyka, specjalizacja Inżynieria Oprogramowania",
    stopien: "Magister",
    okres: "2014 - 2016",
    opis: "Praca magisterska na temat optymalizacji aplikacji webowych z wykorzystaniem Progressive Web Apps",
  },
  {
    id: 2,
    uczelnia: "Politechnika Warszawska",
    kierunek: "Informatyka",
    stopien: "Inżynier",
    okres: "2010 - 2014",
    opis: "Praca inżynierska dotycząca projektowania systemów rozproszonych",
  },
];

// Dane certyfikatów
const certyfikaty = [
  {
    id: 1,
    nazwa: "AWS Certified Solutions Architect",
    wydawca: "Amazon Web Services",
    rok: 2022,
  },
  {
    id: 2,
    nazwa: "Google Professional Cloud Developer",
    wydawca: "Google Cloud",
    rok: 2021,
  },
  {
    id: 3,
    nazwa: "Microsoft Certified: Azure Developer Associate",
    wydawca: "Microsoft",
    rok: 2020,
  },
  {
    id: 4,
    nazwa: "TensorFlow Developer Certificate",
    wydawca: "Google",
    rok: 2020,
  },
];

// Dane umiejętności
const umiejetnosci = {
  technologie: [
    { nazwa: "JavaScript/TypeScript", poziom: 95 },
    { nazwa: "React/React Native", poziom: 90 },
    { nazwa: "Next.js", poziom: 85 },
    { nazwa: "Node.js", poziom: 80 },
    { nazwa: "GraphQL", poziom: 75 },
    { nazwa: "SQL/NoSQL", poziom: 85 },
    { nazwa: "AWS/Cloud", poziom: 80 },
    { nazwa: "Docker/Kubernetes", poziom: 75 },
  ],
  jezykiProgramowania: [
    { nazwa: "JavaScript", poziom: 95 },
    { nazwa: "TypeScript", poziom: 90 },
    { nazwa: "Python", poziom: 75 },
    { nazwa: "Java", poziom: 65 },
    { nazwa: "C#", poziom: 60 },
  ],
  miękkie: [
    "Zarządzanie projektami",
    "Komunikacja",
    "Rozwiązywanie problemów",
    "Praca zespołowa",
    "Zarządzanie czasem",
    "Kreatywne myślenie",
  ],
};

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState<string>("doswiadczenie");

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
                  title="O mnie"
                  subtitle="Poznaj moją historię, doświadczenie i umiejętności"
                  alignment="center"
                  size="xl"
                  gradient
                  animation="slide"
                />
              </div>
            </AnimatedSection>

            {/* Profile Section */}
            <div className="mt-16 grid md:grid-cols-5 gap-12">
              <AnimatedSection
                animation="slideLeft"
                delay={0.3}
                className="md:col-span-2"
              >
                <Card3D
                  interactive
                  interactiveStrength={15}
                  glowEffect
                  glowColor="rgba(99, 102, 241, 0.5)"
                  shadow
                  bgColor="bg-gray-900/50"
                  borderColor="border-indigo-500/20"
                  height="100%"
                >
                  <div className="p-4 flex flex-col items-center">
                    <ClipMask
                      mask="hexagon"
                      width={240}
                      height={240}
                      animate
                      expandOnHover={false}
                      borderWidth={2}
                      borderColor="white"
                      gradientColors={["#4f46e5", "#7c3aed", "#ec4899"]}
                      className="mb-6"
                    >
                      <Image
                        src="/api/placeholder/240/240"
                        alt="Moje zdjęcie"
                        className="w-full h-full object-cover"
                        width={240}
                        height={240}
                      />
                    </ClipMask>

                    <h2 className="text-2xl font-bold mb-2">Jan Kowalski</h2>
                    <p className="text-indigo-400 mb-4">Full Stack Developer</p>

                    <div className="w-full space-y-4 mt-4">
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-indigo-400 mr-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <title>8+ lat doświadczenia</title>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        <span>8+ lat doświadczenia</span>
                      </div>

                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-indigo-400 mr-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <title>Warszawa, Polska</title>
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
                        <span>Warszawa, Polska</span>
                      </div>

                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-indigo-400 mr-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <title>Email</title>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        <span>kontakt@devos.pl</span>
                      </div>

                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-indigo-400 mr-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <title>Telefon</title>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        <span>+48 123 456 789</span>
                      </div>
                    </div>

                    <div className="flex space-x-4 mt-8">
                      {["github", "twitter", "linkedin"].map((social) => (
                        <a
                          key={social}
                          href={`#${social}`}
                          className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-indigo-500/30 transition-colors"
                          aria-label={social}
                        >
                          {/* Placeholder for social icons */}
                          <div className="w-5 h-5 rounded-full bg-indigo-400/50" />
                        </a>
                      ))}
                    </div>

                    <EnhancedButton
                      variant="tech"
                      size="md"
                      className="mt-8 w-full"
                      href="/kontakt"
                      rippleEffect
                      glowOnHover
                    >
                      Skontaktuj się ze mną
                    </EnhancedButton>
                  </div>
                </Card3D>
              </AnimatedSection>

              <AnimatedSection
                animation="slideRight"
                delay={0.4}
                className="md:col-span-3"
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
                    <h3 className="text-2xl font-bold mb-6">Kim jestem</h3>

                    <div className="space-y-4 text-gray-300">
                      <div>
                        <RevealText delay={0.1}>
                          Jestem doświadczonym Full Stack Developerem z ponad
                          8-letnim doświadczeniem w tworzeniu nowoczesnych
                          aplikacji webowych i mobilnych. Moja przygoda z
                          programowaniem zaczęła się na studiach
                          informatycznych, a z czasem przerodziła się w pasję,
                          która napędza mnie do ciągłego rozwoju i podejmowania
                          nowych wyzwań technologicznych.
                        </RevealText>
                      </div>

                      <div>
                        <RevealText delay={0.2}>
                          Specjalizuję się w ekosystemie JavaScript/TypeScript,
                          ze szczególnym uwzględnieniem React.js, Next.js,
                          Node.js oraz technologii chmurowych. Moim głównym
                          celem jest tworzenie wydajnych, skalowalnych i
                          przyjaznych dla użytkownika rozwiązań, które realnie
                          rozwiązują problemy biznesowe moich klientów.
                        </RevealText>
                      </div>

                      <div>
                        <RevealText delay={0.3}>
                          Poza pracą nad projektami komercyjnymi, aktywnie
                          udzielam się w społeczności Open Source, prowadzę blog
                          techniczny oraz występuję na konferencjach dzieląc się
                          wiedzą i doświadczeniem. Wierzę w ciągły rozwój i
                          nieustannie poszerzam swoje kompetencje, śledząc
                          najnowsze trendy i technologie w branży IT.
                        </RevealText>
                      </div>
                    </div>

                    <div className="mt-8">
                      <h3 className="text-2xl font-bold mb-6">
                        Co mnie wyróżnia
                      </h3>

                      <div className="grid md:grid-cols-2 gap-4">
                        {[
                          {
                            title: "Kompleksowe podejście",
                            desc: "Dbam o każdy aspekt projektu - od architektury, przez wydajność, po doświadczenie użytkownika.",
                          },
                          {
                            title: "Zorientowanie na rezultaty",
                            desc: "Skupiam się na dostarczaniu rozwiązań, które przynoszą realne korzyści biznesowe.",
                          },
                          {
                            title: "Ciągły rozwój",
                            desc: "Nieustannie poszerzam swoją wiedzę i umiejętności, śledzę najnowsze trendy technologiczne.",
                          },
                          {
                            title: "Komunikacja i współpraca",
                            desc: "Przykładam dużą wagę do jasnej komunikacji i efektywnej współpracy z klientem i zespołem.",
                          },
                        ].map((item, index) => (
                          <div
                            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                            key={index}
                            className="bg-gray-800/30 rounded-lg p-4 backdrop-blur-sm"
                          >
                            <h4 className="font-bold mb-2">{item.title}</h4>
                            <p className="text-gray-400 text-sm">{item.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-8">
                      <TypewriterText
                        text="Szukasz doświadczonego developera, który pomoże zrealizować Twój projekt? Skontaktuj się ze mną!"
                        speed={40}
                        cursor={true}
                        cursorColor="text-indigo-400"
                        className="text-lg font-medium"
                      />
                    </div>
                  </div>
                </Card3D>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* CV Section */}
        <section className="py-24 px-6 bg-gradient-to-b from-black to-gray-900">
          <div className="max-w-6xl mx-auto">
            <AnimatedSection animation="fadeIn">
              <SectionHeading
                title="Moje CV"
                subtitle="Doświadczenie, edukacja i umiejętności"
                alignment="center"
                size="xl"
                gradient
                animation="fade"
              />
            </AnimatedSection>

            {/* Tabs */}
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              {[
                { id: "doswiadczenie", label: "Doświadczenie" },
                { id: "umiejetnosci", label: "Umiejętności" },
                { id: "edukacja", label: "Edukacja" },
                { id: "certyfikaty", label: "Certyfikaty" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-2 rounded-full transition-all ${
                    activeTab === tab.id
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="mt-16">
              {/* Doświadczenie zawodowe */}
              {activeTab === "doswiadczenie" && (
                <div className="space-y-12">
                  {doswiadczenie.map((praca, index) => (
                    <AnimatedSection
                      key={praca.id}
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
                      >
                        <div className="p-6">
                          <div className="grid md:grid-cols-4 gap-8">
                            <div>
                              <div className="mb-4">
                                <h3 className="text-xl font-bold">
                                  {praca.firma}
                                </h3>
                                <p className="text-indigo-400 font-medium">
                                  {praca.stanowisko}
                                </p>
                                <p className="text-gray-400 text-sm">
                                  {praca.okres}
                                </p>
                              </div>

                              <div>
                                <h4 className="text-sm uppercase text-gray-500 mb-2">
                                  Technologie
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {praca.technologie.map((tech, techIndex) => (
                                    <span
                                      // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                                      key={techIndex}
                                      className="px-3 py-1 text-xs rounded-full bg-gray-800 text-gray-300 border border-gray-700"
                                    >
                                      {tech}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <div className="md:col-span-3">
                              <div className="mb-6">
                                <h4 className="text-sm uppercase text-gray-500 mb-2">
                                  Opis stanowiska
                                </h4>
                                <p className="text-gray-300">{praca.opis}</p>
                              </div>

                              <div>
                                <h4 className="text-sm uppercase text-gray-500 mb-2">
                                  Kluczowe osiągnięcia
                                </h4>
                                <ul className="list-disc pl-5 text-gray-300 space-y-2">
                                  {praca.osiagniecia.map((osiagniecie, i) => (
                                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                                    <li key={i}>{osiagniecie}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </AnimatedGradientBorder>
                    </AnimatedSection>
                  ))}
                </div>
              )}

              {/* Umiejętności */}
              {activeTab === "umiejetnosci" && (
                <div className="grid md:grid-cols-2 gap-8">
                  <AnimatedSection animation="slideLeft" delay={0.3}>
                    <Card3D
                      interactive={false}
                      glowEffect
                      shadow
                      bgColor="bg-gray-900/50"
                      borderColor="border-indigo-500/20"
                      height="100%"
                    >
                      <div className="p-8">
                        <h3 className="text-2xl font-bold mb-6">
                          Technologie & Narzędzia
                        </h3>

                        <div className="space-y-6">
                          {umiejetnosci.technologie.map((tech, index) => (
                            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                            <div key={index}>
                              <div className="flex justify-between mb-2">
                                <span>{tech.nazwa}</span>
                                <span className="text-indigo-400">
                                  {tech.poziom}%
                                </span>
                              </div>
                              <div className="w-full bg-gray-800 rounded-full h-2">
                                <motion.div
                                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${tech.poziom}%` }}
                                  transition={{
                                    duration: 1,
                                    delay: 0.1 * index,
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Card3D>
                  </AnimatedSection>

                  <div className="space-y-8">
                    <AnimatedSection animation="slideRight" delay={0.4}>
                      <Card3D
                        interactive={false}
                        glowEffect
                        shadow
                        bgColor="bg-gray-900/50"
                        borderColor="border-purple-500/20"
                        height="100%"
                      >
                        <div className="p-8">
                          <h3 className="text-2xl font-bold mb-6">
                            Języki programowania
                          </h3>

                          <div className="space-y-6">
                            {umiejetnosci.jezykiProgramowania.map(
                              (jezyk, index) => (
                                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                                <div key={index}>
                                  <div className="flex justify-between mb-2">
                                    <span>{jezyk.nazwa}</span>
                                    <span className="text-purple-400">
                                      {jezyk.poziom}%
                                    </span>
                                  </div>
                                  <div className="w-full bg-gray-800 rounded-full h-2">
                                    <motion.div
                                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                                      initial={{ width: 0 }}
                                      animate={{ width: `${jezyk.poziom}%` }}
                                      transition={{
                                        duration: 1,
                                        delay: 0.1 * index,
                                      }}
                                    />
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </Card3D>
                    </AnimatedSection>

                    <AnimatedSection animation="slideRight" delay={0.5}>
                      <Card3D
                        interactive={false}
                        glowEffect
                        shadow
                        bgColor="bg-gray-900/50"
                        borderColor="border-pink-500/20"
                        height="100%"
                      >
                        <div className="p-8">
                          <h3 className="text-2xl font-bold mb-6">
                            Umiejętności miękkie
                          </h3>

                          <div className="grid grid-cols-2 gap-4">
                            {umiejetnosci.miękkie.map((umiejetnosc, index) => (
                              <div
                                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                                key={index}
                                className="flex items-center space-x-2"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5 text-pink-400"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <title>Umiejętność miękka</title>
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                                <span>{umiejetnosc}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </Card3D>
                    </AnimatedSection>
                  </div>
                </div>
              )}

              {/* Edukacja */}
              {activeTab === "edukacja" && (
                <div className="space-y-8">
                  {edukacja.map((edu, index) => (
                    <AnimatedSection
                      key={edu.id}
                      animation="slideUp"
                      delay={0.1 * index}
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
                          <div className="grid md:grid-cols-4 gap-8">
                            <div>
                              <div className="mb-4">
                                <h3 className="text-xl font-bold">
                                  {edu.uczelnia}
                                </h3>
                                <p className="text-indigo-400 font-medium">
                                  {edu.stopien}
                                </p>
                                <p className="text-gray-400 text-sm">
                                  {edu.okres}
                                </p>
                              </div>
                            </div>

                            <div className="md:col-span-3">
                              <div>
                                <h4 className="text-sm uppercase text-gray-500 mb-2">
                                  Kierunek
                                </h4>
                                <p className="text-gray-300 mb-4">
                                  {edu.kierunek}
                                </p>

                                <h4 className="text-sm uppercase text-gray-500 mb-2">
                                  Opis
                                </h4>
                                <p className="text-gray-300">{edu.opis}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card3D>
                    </AnimatedSection>
                  ))}
                </div>
              )}

              {/* Certyfikaty */}
              {activeTab === "certyfikaty" && (
                <div className="grid md:grid-cols-2 gap-6">
                  {certyfikaty.map((cert, index) => (
                    <AnimatedSection
                      key={cert.id}
                      animation="fadeIn"
                      delay={0.1 * index}
                    >
                      <TiltCard
                        className="h-full"
                        tiltAmount={5}
                        glareOpacity={0.2}
                        perspective={800}
                      >
                        <div className="p-6 flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-full bg-indigo-900/30 flex items-center justify-center">
                            <span className="text-lg font-bold text-indigo-400">
                              {cert.id}
                            </span>
                          </div>

                          <div>
                            <h3 className="font-bold">{cert.nazwa}</h3>
                            <p className="text-gray-400 text-sm">
                              {cert.wydawca} | {cert.rok}
                            </p>
                          </div>
                        </div>
                      </TiltCard>
                    </AnimatedSection>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Personal Projects Section */}
        <section className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <AnimatedSection animation="fadeIn">
              <SectionHeading
                title="Projekty osobiste"
                subtitle="Rozwiązania tworzone z pasją w wolnym czasie"
                alignment="center"
                size="xl"
                gradient
                animation="fade"
              />
            </AnimatedSection>

            <div className="mt-16 grid md:grid-cols-3 gap-8">
              {projektyOsobiste.map((projekt, index) => (
                <AnimatedSection
                  key={projekt.id}
                  animation="slideUp"
                  delay={0.1 * index}
                >
                  <TiltCard
                    className="h-full"
                    tiltAmount={10}
                    glareOpacity={0.2}
                    borderGlow
                    borderColor="rgba(99, 102, 241, 0.4)"
                  >
                    <div className="h-full flex flex-col">
                      <div className="w-full h-48 overflow-hidden">
                        <Image
                          src={projekt.image}
                          alt={projekt.nazwa}
                          className="w-full h-full object-cover"
                          width={400}
                          height={300}
                        />
                      </div>

                      <div className="p-6 flex-grow flex flex-col">
                        <h3 className="text-xl font-bold mb-2">
                          <GradientText
                            from={projekt.color
                              .split(" ")[0]
                              .replace("from-", "")}
                            to={projekt.color.split(" ")[1].replace("to-", "")}
                          >
                            {projekt.nazwa}
                          </GradientText>
                        </h3>

                        <p className="text-gray-300 mb-4 flex-grow">
                          {projekt.opis}
                        </p>

                        <div className="mb-4">
                          <h4 className="text-sm uppercase text-gray-500 mb-2">
                            Technologie
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {projekt.technologie.map((tech, techIndex) => (
                              <span
                                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                                key={techIndex}
                                className="px-3 py-1 text-xs rounded-full bg-gray-800 text-gray-300 border border-gray-700"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>

                        <EnhancedButton
                          variant="outline"
                          size="sm"
                          href={projekt.link}
                          className="w-full"
                        >
                          Zobacz na GitHub
                        </EnhancedButton>
                      </div>
                    </div>
                  </TiltCard>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6 bg-gradient-to-b from-gray-900 to-black">
          <div className="max-w-4xl mx-auto text-center">
            <AnimatedSection animation="fadeIn">
              <SectionHeading
                title="Zróbmy coś razem"
                subtitle="Masz pomysł na projekt? Porozmawiajmy o nim"
                alignment="center"
                size="xl"
                gradient
                animation="fade"
              />

              <div className="mt-10">
                <Link href="/kontakt">
                  <EnhancedButton
                    variant="tech"
                    size="lg"
                    magneticEffect
                    glowOnHover
                    rippleEffect
                    animatedBg
                  >
                    Skontaktuj się ze mną
                  </EnhancedButton>
                </Link>
              </div>
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
