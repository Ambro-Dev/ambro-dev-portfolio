// src/app/projekty/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
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
import { AnimatedGradientBorder } from "@/components/ambro-ui/animated-gradient-border";
import { CodeBlock } from "@/components/ambro-ui/code-block";
import { HoverCard } from "@/components/ambro-ui/hover-card";
import { SectionDivider } from "@/components/ambro-ui/section-divider";
import Image from "next/image";

// Projekty - dane
const projekty = [
  {
    id: "fintech-dashboard",
    title: "Panel FinTech",
    shortDesc:
      "Kompleksowy panel analityczny do finansów z wizualizacją danych w czasie rzeczywistym.",
    description:
      "Panel FinTech to zaawansowane narzędzie analityczne stworzone dla firmy z branży finansowej. Platforma zapewnia kompleksowy wgląd w dane finansowe w czasie rzeczywistym, niestandardowe raporty oraz funkcje analizy predykcyjnej. Dzięki intuicyjnemu interfejsowi użytkownicy mogą łatwo monitorować kluczowe wskaźniki, wykrywać trendy i podejmować decyzje oparte na danych.",
    challenge:
      "Głównym wyzwaniem było stworzenie wydajnego systemu przetwarzającego duże ilości danych w czasie rzeczywistym, zapewniając jednocześnie responsywny interfejs i zaawansowane możliwości wizualizacji danych.",
    solution:
      "Zaimplementowałem architekturę wykorzystującą WebSockets do przesyłania danych w czasie rzeczywistym, zoptymalizowane zapytania do bazy danych oraz zaawansowane algorytmy do analizy danych. Frontend zbudowałem w Next.js z TailwindCSS, wykorzystując D3.js do tworzenia interaktywnych wizualizacji.",
    technologies: [
      "Next.js",
      "TypeScript",
      "Prisma",
      "TailwindCSS",
      "Framer Motion",
      "D3.js",
      "WebSockets",
      "PostgreSQL",
    ],
    features: [
      "Dashboardy z niestandardowymi widżetami",
      "Analiza trendów z algorytmami predykcyjnymi",
      "Dane finansowe w czasie rzeczywistym",
      "Eksport raportów do PDF/Excel",
      "Zaawansowane filtry i wyszukiwanie",
      "Autoryzacja i zarządzanie uprawnieniami",
    ],
    image: "/api/placeholder/800/500",
    images: [
      "/api/placeholder/800/500",
      "/api/placeholder/800/500",
      "/api/placeholder/800/500",
    ],
    color: "from-blue-500 to-indigo-600",
    codeSnippet: `
// Przykładowy kod komponentu wizualizacji trendu
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export function TrendChart({ data, width, height }) {
  const svgRef = useRef(null);
  
  useEffect(() => {
    if (!data || !svgRef.current) return;
    
    const svg = d3.select(svgRef.current);
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    // Skale
    const x = d3.scaleTime()
      .domain(d3.extent(data, d => d.date))
      .range([0, innerWidth]);
    
    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value)])
      .range([innerHeight, 0]);
    
    // Linia trendu
    const line = d3.line()
      .x(d => x(d.date))
      .y(d => y(d.value))
      .curve(d3.curveMonotoneX);
    
    // Rysowanie
    const g = svg.append("g")
      .attr("transform", \`translate(\${margin.left},\${margin.top})\`);
    
    g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#4f46e5")
      .attr("stroke-width", 2)
      .attr("d", line);
    
    // Osie
    g.append("g")
      .attr("transform", \`translate(0,\${innerHeight})\`)
      .call(d3.axisBottom(x));
    
    g.append("g")
      .call(d3.axisLeft(y));
  }, [data, width, height]);
  
  return <svg ref={svgRef} width={width} height={height} />;
}`,
  },
  {
    id: "ecommerce-platform",
    title: "Platforma e-commerce",
    shortDesc:
      "W pełni funkcjonalne rozwiązanie e-commerce z zarządzaniem magazynem i płatnościami.",
    description:
      "Kompleksowa platforma e-commerce stworzona dla średniej wielkości sklepu internetowego, oferująca pełen zakres funkcji potrzebnych do prowadzenia nowoczesnego biznesu online. System integruje zaawansowane zarządzanie magazynem, przetwarzanie płatności online oraz analizę danych klientów, umożliwiając właścicielom sklepu podejmowanie decyzji opartych na danych.",
    challenge:
      "Wyzwaniem było stworzenie platformy, która będzie zarówno przyjazna dla użytkownika, jak i bardzo wydajna, zdolna do obsługi dużej liczby jednoczesnych zamówień, szczególnie w okresach zwiększonego ruchu (np. promocje, święta).",
    solution:
      "Zaimplementowałem architekturę mikroserwisową z wykorzystaniem Node.js i React, z niezależnymi modułami do obsługi katalogu produktów, koszyka, płatności i zarządzania zamówieniami. System wykorzystuje Redis do buforowania i MongoDB jako główną bazę danych, z zaimplementowanym systemem kolejkowania dla operacji intensywnie obciążających serwer.",
    technologies: [
      "React",
      "Node.js",
      "MongoDB",
      "Redis",
      "Stripe API",
      "Redux",
      "AWS",
      "Docker",
    ],
    features: [
      "Responsywny katalog produktów",
      "Zaawansowany koszyk zakupowy",
      "Integracja z bramkami płatności",
      "System zarządzania magazynem",
      "Panel administracyjny",
      "Analityka sprzedaży",
      "Personalizowane rekomendacje produktów",
    ],
    image: "/api/placeholder/800/500",
    images: [
      "/api/placeholder/800/500",
      "/api/placeholder/800/500",
      "/api/placeholder/800/500",
    ],
    color: "from-purple-500 to-indigo-600",
    codeSnippet: `
// Przykładowy kod obsługi koszyka zakupowego
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalAmount: 0,
  loading: false,
  error: null
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<CartItem>) {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalAmount = state.items.reduce((total, item) => 
        total + (item.price * item.quantity), 0);
    },
    // inne akcje: removeFromCart, updateQuantity, clearCart...
  }
});

export const { addToCart } = cartSlice.actions;
export default cartSlice.reducer;`,
  },
  {
    id: "health-app",
    title: "Aplikacja zdrowotna",
    shortDesc:
      "Aplikacja mobilna do śledzenia aktywności fizycznej i planowania posiłków.",
    description:
      "Innowacyjna aplikacja mobilna do kompleksowego zarządzania zdrowiem, obejmująca śledzenie aktywności fizycznej, planowanie posiłków i personalizowane rekomendacje treningowe. Aplikacja wykorzystuje uczenie maszynowe do dostosowania planów treningowych do indywidualnych potrzeb użytkowników i analizy ich postępów w czasie.",
    challenge:
      "Głównym wyzwaniem było stworzenie intuicyjnego interfejsu użytkownika dla złożonych funkcjonalności, a także implementacja algorytmów uczenia maszynowego do analizy danych użytkowników na urządzeniach mobilnych z ograniczoną mocą obliczeniową.",
    solution:
      "Zaprojektowałem aplikację w React Native, co zapewniło spójne doświadczenie na iOS i Android. Do przetwarzania danych wykorzystałem TensorFlow.js, zoptymalizowany pod kątem urządzeń mobilnych. Backend oparłem na Firebase dla łatwej synchronizacji i przechowywania danych, a GraphQL i Apollo Client zapewniają efektywną komunikację między klientem a serwerem.",
    technologies: [
      "React Native",
      "Firebase",
      "TensorFlow.js",
      "GraphQL",
      "Apollo",
      "Redux",
      "Jest",
    ],
    features: [
      "Śledzenie aktywności fizycznej",
      "Planowanie posiłków i dieta",
      "Personalizowane plany treningowe",
      "Analiza postępów w czasie",
      "Integracja z urządzeniami fitness",
      "Społeczność i wyzwania grupowe",
      "Porady zdrowotne oparte na AI",
    ],
    image: "/api/placeholder/800/500",
    images: [
      "/api/placeholder/800/500",
      "/api/placeholder/800/500",
      "/api/placeholder/800/500",
    ],
    color: "from-pink-500 to-purple-600",
    codeSnippet: `
// Hook do personalizowanych rekomendacji treningowych
import { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import { loadLayersModel } from '@tensorflow/tfjs-react-native';
import { useUserData } from './useUserData';

export function useTrainingRecommendations() {
  const [model, setModel] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userData, activityHistory } = useUserData();
  
  // Załaduj model przy inicjalizacji
  useEffect(() => {
    async function loadModel() {
      try {
        const loadedModel = await loadLayersModel('file://path/to/model.json');
        setModel(loadedModel);
      } catch (error) {
        console.error('Nie udało się załadować modelu:', error);
      }
    }
    
    loadModel();
  }, []);
  
  // Generuj rekomendacje, gdy model jest gotowy i mamy dane użytkownika
  useEffect(() => {
    if (!model || !userData || !activityHistory) return;
    
    async function predictRecommendations() {
      setLoading(true);
      
      try {
        // Przygotuj dane wejściowe dla modelu
        const userFeatures = tf.tensor2d([
          userData.age, 
          userData.weight, 
          userData.height, 
          userData.fitnessLevel,
          activityHistory.averageHeartRate,
          activityHistory.weeklyActivityMinutes
        ], [1, 6]);
        
        // Wykonaj predykcję
        const predictions = await model.predict(userFeatures);
        const predictionData = await predictions.data();
        
        // Mapuj predykcje na konkretne ćwiczenia i intensywność
        const recommendedWorkouts = mapPredictionsToWorkouts(predictionData);
        setRecommendations(recommendedWorkouts);
      } catch (error) {
        console.error('Błąd podczas generowania rekomendacji:', error);
      } finally {
        setLoading(false);
      }
    }
    
    predictRecommendations();
  }, [model, userData, activityHistory]);
  
  return { recommendations, loading };
}`,
  },
  {
    id: "smart-home",
    title: "System Smart Home",
    shortDesc:
      "Inteligentny system zarządzania domem z kontrolą głosową i analizą zużycia energii.",
    description:
      "Kompleksowy system smart home zaprojektowany dla deweloperów nieruchomości premium. Rozwiązanie integruje sterowanie oświetleniem, ogrzewaniem, zabezpieczeniami i multimediami w jednym intuicyjnym interfejsie, dostępnym zarówno z aplikacji mobilnej, jak i paneli dotykowych zainstalowanych w domu.",
    challenge:
      "Kluczowym wyzwaniem było stworzenie systemu, który mógłby integrować różnorodne urządzenia i protokoły IoT, zapewniając jednocześnie wysokie bezpieczeństwo, niezawodność oraz łatwość obsługi dla użytkowników końcowych.",
    solution:
      "Zaprojektowałem centralny hub oparty na Node.js z modułową architekturą, umożliwiającą łatwą integrację różnych protokołów (Z-Wave, Zigbee, WiFi). Frontend aplikacji został zbudowany w React Native dla urządzeń mobilnych i React.js dla paneli dotykowych, z wykorzystaniem WebSockets do komunikacji w czasie rzeczywistym.",
    technologies: [
      "React Native",
      "Node.js",
      "WebSockets",
      "MQTT",
      "Z-Wave API",
      "Zigbee",
      "TensorFlow",
      "AWS IoT",
    ],
    features: [
      "Sterowanie oświetleniem i ogrzewaniem",
      "System zabezpieczeń z kamerami",
      "Sterowanie głosowe",
      "Automatyzacja i sceny",
      "Analiza zużycia energii",
      "Powiadomienia i alerty",
      "Integracja z popularnymi asystentami głosowymi",
    ],
    image: "/api/placeholder/800/500",
    images: [
      "/api/placeholder/800/500",
      "/api/placeholder/800/500",
      "/api/placeholder/800/500",
    ],
    color: "from-green-500 to-blue-600",
    codeSnippet: `
// System automatyzacji domowej
import { DeviceManager } from './DeviceManager';
import { SceneController } from './SceneController';
import { EventEmitter } from 'events';

class HomeAutomation extends EventEmitter {
  private deviceManager: DeviceManager;
  private sceneController: SceneController;
  private automationRules: AutomationRule[] = [];
  
  constructor() {
    super();
    this.deviceManager = new DeviceManager();
    this.sceneController = new SceneController(this.deviceManager);
    
    // Nasłuchuj zdarzeń od urządzeń
    this.deviceManager.on('deviceStateChanged', this.evaluateAutomationRules.bind(this));
  }
  
  // Dodaj nową regułę automatyzacji
  public addAutomationRule(rule: AutomationRule): string {
    const ruleId = generateUniqueId();
    rule.id = ruleId;
    this.automationRules.push(rule);
    return ruleId;
  }
  
  // Oceniaj wszystkie reguły, gdy zmienia się stan urządzenia
  private evaluateAutomationRules(deviceId: string, state: DeviceState): void {
    this.automationRules.forEach(rule => {
      // Sprawdź, czy reguła powinna być wyzwolona
      if (this.shouldTriggerRule(rule, deviceId, state)) {
        this.executeRuleActions(rule);
      }
    });
  }
  
  // Sprawdź, czy warunki reguły są spełnione
  private shouldTriggerRule(rule: AutomationRule, deviceId: string, state: DeviceState): boolean {
    // Implementacja logiki oceniającej warunki reguły
    const triggerDevice = rule.trigger.deviceId === deviceId;
    const conditionsMet = rule.conditions.every(condition => {
      // Sprawdź każdy warunek (np. czas, wartości stanu, itp.)
      return this.evaluateCondition(condition);
    });
    
    return triggerDevice && conditionsMet;
  }
  
  // Wykonaj akcje zdefiniowane w regule
  private executeRuleActions(rule: AutomationRule): void {
    rule.actions.forEach(action => {
      if (action.type === 'device') {
        // Ustaw stan urządzenia
        this.deviceManager.setDeviceState(action.deviceId, action.state);
      } else if (action.type === 'scene') {
        // Aktywuj scenę
        this.sceneController.activateScene(action.sceneId);
      }
      // Inne typy akcji...
    });
    
    this.emit('ruleExecuted', rule.id);
  }
}

export default HomeAutomation;`,
  },
];

export default function ProjektyPage() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const categories = ["all", "Web", "Mobile", "IoT", "AI"];

  // Filtrowanie projektów na podstawie aktywnej zakładki
  const filteredProjects =
    activeTab === "all"
      ? projekty
      : projekty.filter((project) => {
          if (activeTab === "Web")
            return project.technologies.some((t) =>
              ["React", "Next.js", "TailwindCSS"].includes(t)
            );
          if (activeTab === "Mobile")
            return project.technologies.some((t) =>
              ["React Native"].includes(t)
            );
          if (activeTab === "IoT")
            return project.technologies.some((t) =>
              ["MQTT", "Z-Wave API", "Zigbee"].includes(t)
            );
          if (activeTab === "AI")
            return project.technologies.some((t) =>
              ["TensorFlow.js", "TensorFlow"].includes(t)
            );
          return true;
        });

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
        <section className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <AnimatedSection animation="fadeIn">
              <div className="text-center">
                <Link href="/">
                  <EnhancedButton variant="outline" size="sm" className="mb-8">
                    ← Powrót do strony głównej
                  </EnhancedButton>
                </Link>

                <SectionHeading
                  title="Moje projekty"
                  subtitle="Przegląd wybranych realizacji i wdrożeń"
                  alignment="center"
                  size="xl"
                  gradient
                  animation="slide"
                />
              </div>
            </AnimatedSection>

            {/* Kategorie projektów */}
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveTab(category)}
                  className={`px-6 py-2 rounded-full transition-all ${
                    activeTab === category
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50"
                  }`}
                >
                  {category === "all" ? "Wszystkie" : category}
                </button>
              ))}
            </div>

            {/* Lista projektów */}
            <div className="mt-16 space-y-24">
              {filteredProjects.map((project, index) => (
                <AnimatedSection
                  key={project.id}
                  animation={index % 2 === 0 ? "slideLeft" : "slideRight"}
                  delay={0.3}
                  className="relative"
                >
                  <AnimatedGradientBorder
                    borderWidth={2}
                    borderColor="from-indigo-500 via-purple-500 to-pink-500"
                    glowEffect
                    glowIntensity={5}
                    animated
                    backgroundColor="bg-gray-900/50"
                    rounded="rounded-xl"
                  >
                    <div className="p-8">
                      <div
                        className={`grid md:grid-cols-2 gap-12 relative ${
                          index % 2 === 0 ? "" : "md:flex-row-reverse"
                        }`}
                      >
                        {/* Project Image */}
                        <ClipMask
                          mask={index % 2 === 0 ? "hexagon" : "diamond"}
                          width="100%"
                          height="100%"
                          animate
                          expandOnHover
                          shadowSize={20}
                          borderWidth={2}
                          borderColor="white"
                          gradientColors={["#4f46e5", "#7c3aed", "#ec4899"]}
                        >
                          <Image
                            src={project.image}
                            alt={project.title}
                            className="object-cover w-full h-full"
                            layout="responsive"
                            width={800}
                            height={500}
                          />
                        </ClipMask>

                        {/* Project Details */}
                        <div className="flex flex-col justify-center">
                          <h3 className="text-3xl font-bold mb-4">
                            <GradientText
                              from={project.color
                                .split(" ")[0]
                                .replace("from-", "")}
                              to={project.color
                                .split(" ")[1]
                                .replace("to-", "")}
                            >
                              {project.title}
                            </GradientText>
                          </h3>

                          <div className="text-gray-300 mb-6">
                            <RevealText delay={0.4}>
                              {project.description.substring(0, 200)}...
                            </RevealText>
                          </div>

                          <div className="mb-6">
                            <h4 className="text-sm uppercase text-gray-500 mb-2">
                              Wykorzystane technologie
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {project.technologies
                                .slice(0, 6)
                                .map((tech, techIndex) => (
                                  <span
                                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                                    key={techIndex}
                                    className="px-3 py-1 text-xs rounded-full bg-gray-800 text-gray-300 border border-gray-700"
                                  >
                                    {tech}
                                  </span>
                                ))}
                              {project.technologies.length > 6 && (
                                <span className="px-3 py-1 text-xs rounded-full bg-gray-800 text-gray-300 border border-gray-700">
                                  +{project.technologies.length - 6}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-4">
                            <Link href={`/projekty/${project.id}`}>
                              <EnhancedButton
                                variant="tech"
                                size="md"
                                magneticEffect
                                glowOnHover
                                borderGradient
                              >
                                Szczegóły projektu
                              </EnhancedButton>
                            </Link>

                            <HoverCard
                              hoverContent={
                                <div className="w-full max-w-2xl">
                                  <CodeBlock
                                    code={project.codeSnippet}
                                    language="typescript"
                                    theme="tech"
                                    showLineNumbers
                                    maxHeight="300px"
                                    fileName={`${project.id}.ts`}
                                  />
                                </div>
                              }
                              position="top"
                              glassmorphism
                              width={700}
                            >
                              <EnhancedButton variant="outline" size="md">
                                Zobacz kod
                              </EnhancedButton>
                            </HoverCard>
                          </div>
                        </div>
                      </div>

                      {/* Główne funkcjonalności */}
                      <div className="mt-12">
                        <h4 className="text-xl font-bold mb-4">
                          Główne funkcjonalności
                        </h4>
                        <div className="grid md:grid-cols-3 gap-4">
                          {project.features.map((feature, featureIndex) => (
                            <div
                              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                              key={featureIndex}
                              className="bg-gray-800/30 rounded-lg p-4 backdrop-blur-sm"
                            >
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Wyzwania i rozwiązania */}
                      <div className="mt-12 grid md:grid-cols-2 gap-8">
                        <Card3D
                          interactive={false}
                          glowEffect
                          shadow
                          bgColor="bg-gray-900/50"
                          borderColor="border-indigo-500/20"
                          height="100%"
                        >
                          <div className="p-6">
                            <h4 className="text-xl font-bold mb-4">Wyzwanie</h4>
                            <p className="text-gray-300">{project.challenge}</p>
                          </div>
                        </Card3D>

                        <Card3D
                          interactive={false}
                          glowEffect
                          shadow
                          bgColor="bg-gray-900/50"
                          borderColor="border-pink-500/20"
                          height="100%"
                        >
                          <div className="p-6">
                            <h4 className="text-xl font-bold mb-4">
                              Rozwiązanie
                            </h4>
                            <p className="text-gray-300">{project.solution}</p>
                          </div>
                        </Card3D>
                      </div>
                    </div>
                  </AnimatedGradientBorder>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6">
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
