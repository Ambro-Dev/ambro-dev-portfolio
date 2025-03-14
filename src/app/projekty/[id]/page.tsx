// src/app/projekty/[id]/page.tsx
"use client";

import { useState } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { FloatingBubbles } from "@/components/ambro-ui/floating-bubbles";
import { ScrollProgress } from "@/components/ambro-ui/scroll-progress";
import { SectionHeading } from "@/components/ambro-ui/section-heading";
import { SmoothScroll } from "@/components/ambro-ui/smooth-scroll";
import { Card3D } from "@/components/ambro-ui/card-3d";
import { GradientText } from "@/components/ambro-ui/gradient-text";
import { AnimatedSection } from "@/components/ambro-ui/animated-section";
import { EnhancedButton } from "@/components/ambro-ui/enhanced-button";
import { CodeBlock } from "@/components/ambro-ui/code-block";
import { SectionDivider } from "@/components/ambro-ui/section-divider";
import { TiltCard } from "@/components/ambro-ui/tilt-card";
import Image from "next/image";

// Importujemy dane z poprzedniego pliku
// Uwaga: W rzeczywistej aplikacji prawdopodobnie te dane powinny być przechowywane w bazie danych
// lub API, a nie duplikowane w różnych plikach

// Przykładowa struktura danych projektu (uproszczona wersja z projekty/page.tsx)
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
    client: "FinCorp S.A.",
    timeline: "8 miesięcy",
    role: "Lead Developer",
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
    outcomes: [
      "Zwiększenie efektywności analiz finansowych o 40%",
      "Skrócenie czasu podejmowania decyzji o 60%",
      "Dokładniejsze prognozy finansowe dzięki algorytmom predykcyjnym",
      "Łatwiejsza współpraca między działami dzięki systemowi raportowania",
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
    client: "BestShop.pl",
    timeline: "10 miesięcy",
    role: "Full Stack Developer",
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
    outcomes: [
      "Wzrost konwersji o 28% w porównaniu do poprzedniej platformy",
      "Zwiększenie średniej wartości koszyka o 15%",
      "Skrócenie czasu realizacji zamówień o 35%",
      "Lepsze zarządzanie magazynem i zmniejszenie liczby niedostępnych produktów o 60%",
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
    client: "FitLife App",
    timeline: "6 miesięcy",
    role: "Mobile Developer & ML Engineer",
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
    outcomes: [
      "90% użytkowników raportuje poprawę nawyków zdrowotnych",
      "Średni czas aktywności fizycznej użytkowników wzrósł o 45%",
      "Wysokie oceny w App Store (4.8/5) i Google Play (4.7/5)",
      "85% retencji użytkowników po 3 miesiącach",
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
    client: "Moderna Homes",
    timeline: "12 miesięcy",
    role: "IoT Architect & Lead Developer",
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
    outcomes: [
      "Zmniejszenie zużycia energii w budynkach o średnio 25%",
      "Zwiększenie sprzedaży nieruchomości o 15% dzięki wartości dodanej systemu",
      "98% satysfakcji klientów z funkcjonalności systemu",
      "Stała współpraca przy nowych inwestycjach dewelopera",
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

export default function ProjectDetailsPage() {
  const params = useParams();
  const projectId = params.id as string;
  const [activeImage, setActiveImage] = useState(0);

  // Znajdź projekt na podstawie ID
  const project = projekty.find((p) => p.id === projectId);

  // Jeśli projekt nie istnieje, zwróć 404
  if (!project) {
    notFound();
  }

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
                <Link href="/projekty">
                  <EnhancedButton variant="outline" size="sm" className="mb-8">
                    ← Powrót do projektów
                  </EnhancedButton>
                </Link>

                <SectionHeading
                  title={project.title}
                  subtitle={project.shortDesc}
                  alignment="center"
                  size="xl"
                  gradient={true}
                  gradientFrom={project.color
                    .split(" ")[0]
                    .replace("from-", "")}
                  gradientTo={project.color.split(" ")[1].replace("to-", "")}
                  animation="slide"
                />
              </div>
            </AnimatedSection>

            {/* Project Gallery */}
            <div className="mt-16">
              <AnimatedSection animation="slideUp" delay={0.3}>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <Card3D
                      interactive={false}
                      glowEffect
                      shadow
                      borderColor="border-indigo-500/20"
                      height="100%"
                    >
                      <Image
                        src={project.images[activeImage]}
                        alt={`${project.title} - widok ${activeImage + 1}`}
                        className="w-full h-full object-cover rounded-xl"
                        layout="responsive"
                        width={800}
                        height={500}
                      />
                    </Card3D>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
                    {project.images.map((img, index) => (
                      <div
                        key={img}
                        className={`cursor-pointer transition-all ${
                          activeImage === index
                            ? "ring-2 ring-indigo-500"
                            : "opacity-70 hover:opacity-100"
                        }`}
                        onClick={() => setActiveImage(index)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setActiveImage(index);
                          }
                        }}
                      >
                        <Image
                          src={img}
                          alt={`${project.title} - miniatua ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                          layout="responsive"
                          width={800}
                          height={500}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            </div>

            {/* Project Info */}
            <div className="mt-16 grid md:grid-cols-3 gap-8">
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
                    <h3 className="text-2xl font-bold mb-6">O projekcie</h3>
                    <p className="text-gray-300 mb-8 leading-relaxed">
                      {project.description}
                    </p>

                    <div className="grid md:grid-cols-2 gap-8 mb-8">
                      <div>
                        <h4 className="text-xl font-bold mb-4">Wyzwanie</h4>
                        <p className="text-gray-300">{project.challenge}</p>
                      </div>

                      <div>
                        <h4 className="text-xl font-bold mb-4">Rozwiązanie</h4>
                        <p className="text-gray-300">{project.solution}</p>
                      </div>
                    </div>

                    <h4 className="text-xl font-bold mb-4">Wyniki</h4>
                    <ul className="list-disc pl-5 text-gray-300 space-y-2">
                      {project.outcomes.map((outcome, index) => (
                        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                        <li key={index}>{outcome}</li>
                      ))}
                    </ul>
                  </div>
                </Card3D>
              </AnimatedSection>

              <AnimatedSection animation="slideRight" delay={0.4}>
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
                      Szczegóły projektu
                    </h3>

                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm uppercase text-gray-500 mb-1">
                          Klient
                        </h4>
                        <p className="font-medium">{project.client}</p>
                      </div>

                      <div>
                        <h4 className="text-sm uppercase text-gray-500 mb-1">
                          Rola
                        </h4>
                        <p className="font-medium">{project.role}</p>
                      </div>

                      <div>
                        <h4 className="text-sm uppercase text-gray-500 mb-1">
                          Czas realizacji
                        </h4>
                        <p className="font-medium">{project.timeline}</p>
                      </div>

                      <div>
                        <h4 className="text-sm uppercase text-gray-500 mb-2">
                          Technologie
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech, techIndex) => (
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

                      <div>
                        <h4 className="text-sm uppercase text-gray-500 mb-2">
                          Główne funkcjonalności
                        </h4>
                        <ul className="list-disc pl-5 text-gray-300 space-y-1 text-sm">
                          {project.features.map((feature, featureIndex) => (
                            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                            <li key={featureIndex}>{feature}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </Card3D>
              </AnimatedSection>
            </div>

            {/* Code Sample */}
            <div className="mt-16">
              <AnimatedSection animation="fadeIn" delay={0.3}>
                <SectionHeading
                  title="Przykładowy kod"
                  subtitle="Fragment kodu z projektu"
                  alignment="center"
                  size="lg"
                  animation="fade"
                />

                <div className="mt-8">
                  <CodeBlock
                    code={project.codeSnippet}
                    language="typescript"
                    theme="tech"
                    showLineNumbers
                    fileName={`${project.id}.ts`}
                    animateTyping={false}
                  />
                </div>
              </AnimatedSection>
            </div>

            {/* Related Projects */}
            <div className="mt-24">
              <AnimatedSection animation="fadeIn">
                <SectionHeading
                  title="Podobne projekty"
                  subtitle="Zobacz inne projekty z mojego portfolio"
                  alignment="center"
                  size="lg"
                  animation="fade"
                />

                <div className="mt-12 grid md:grid-cols-3 gap-8">
                  {projekty
                    .filter((p) => p.id !== project.id)
                    .slice(0, 3)
                    .map((relatedProject, index) => (
                      <AnimatedSection
                        key={relatedProject.id}
                        animation="slideUp"
                        delay={0.1 * index}
                      >
                        <Link href={`/projekty/${relatedProject.id}`}>
                          <TiltCard
                            className="h-full"
                            tiltAmount={5}
                            glareOpacity={0.2}
                            perspective={800}
                          >
                            <div className="h-full flex flex-col">
                              <div className="w-full h-48 overflow-hidden rounded-t-xl">
                                <Image
                                  src={relatedProject.image}
                                  alt={relatedProject.title}
                                  className="w-full h-full object-cover"
                                  layout="responsive"
                                  width={800}
                                  height={500}
                                />
                              </div>

                              <div className="p-6 flex-grow flex flex-col">
                                <h3 className="text-xl font-bold mb-2">
                                  <GradientText
                                    from={relatedProject.color
                                      .split(" ")[0]
                                      .replace("from-", "")}
                                    to={relatedProject.color
                                      .split(" ")[1]
                                      .replace("to-", "")}
                                  >
                                    {relatedProject.title}
                                  </GradientText>
                                </h3>

                                <p className="text-gray-400 text-sm mb-4">
                                  {relatedProject.shortDesc}
                                </p>

                                <div className="mt-auto">
                                  <EnhancedButton
                                    variant="outline"
                                    size="sm"
                                    className="w-full"
                                  >
                                    Zobacz szczegóły
                                  </EnhancedButton>
                                </div>
                              </div>
                            </div>
                          </TiltCard>
                        </Link>
                      </AnimatedSection>
                    ))}
                </div>
              </AnimatedSection>
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
