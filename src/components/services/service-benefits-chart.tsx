/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/services/service-benefits-chart.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import {
  Zap,
  TrendingUp,
  ShieldCheck,
  DollarSign,
  Clock,
  LineChart,
  LayoutGrid,
  type LucideIcon,
} from "lucide-react";
import { Card3D } from "@/components/ambro-ui/card-3d";
import { TiltCard } from "@/components/ambro-ui/tilt-card";

interface BenefitData {
  name: string;
  value: number;
  description: string;
  icon: LucideIcon;
}

// Dane korzyści dla różnych usług
const serviceBenefits: { [key: string]: BenefitData[] } = {
  infrastructure: [
    {
      name: "Skalowalność",
      value: 90,
      description: "Łatwe skalowanie infrastruktury w zależności od obciążenia",
      icon: TrendingUp,
    },
    {
      name: "Niezawodność",
      value: 85,
      description: "Wysoka dostępność i odporność na awarie",
      icon: ShieldCheck,
    },
    {
      name: "Oszczędność kosztów",
      value: 75,
      description: "Redukcja kosztów dzięki optymalizacji zasobów",
      icon: DollarSign,
    },
    {
      name: "Bezpieczeństwo",
      value: 80,
      description: "Wbudowane mechanizmy bezpieczeństwa i ochrony danych",
      icon: ShieldCheck,
    },
    {
      name: "Szybkość wdrożenia",
      value: 85,
      description: "Błyskawiczne wdrażanie nowych środowisk",
      icon: Zap,
    },
    {
      name: "Automatyzacja",
      value: 95,
      description: "Automatyzacja zarządzania i konfiguracji",
      icon: LayoutGrid,
    },
  ],
  servers: [
    {
      name: "Wydajność",
      value: 85,
      description: "Zoptymalizowana wydajność serwerów",
      icon: Zap,
    },
    {
      name: "Niezawodność",
      value: 90,
      description: "Wysoka dostępność i minimalizacja przestojów",
      icon: ShieldCheck,
    },
    {
      name: "Bezpieczeństwo",
      value: 85,
      description: "Zaawansowane mechanizmy zabezpieczeń",
      icon: ShieldCheck,
    },
    {
      name: "Monitorowanie",
      value: 80,
      description: "Kompleksowy monitoring i alerty",
      icon: LineChart,
    },
    {
      name: "Oszczędność kosztów",
      value: 70,
      description: "Optymalizacja wykorzystania zasobów",
      icon: DollarSign,
    },
    {
      name: "Skalowalność",
      value: 75,
      description: "Możliwość szybkiego skalowania w górę i w dół",
      icon: TrendingUp,
    },
  ],
  monitoring: [
    {
      name: "Widoczność",
      value: 95,
      description: "Pełna widoczność infrastruktury i aplikacji",
      icon: LineChart,
    },
    {
      name: "Szybkie reagowanie",
      value: 90,
      description: "Natychmiastowa reakcja na problemy",
      icon: Zap,
    },
    {
      name: "Przewidywanie problemów",
      value: 80,
      description: "Wykrywanie potencjalnych problemów zanim wystąpią",
      icon: TrendingUp,
    },
    {
      name: "Analiza wydajności",
      value: 85,
      description: "Szczegółowa analiza wydajności i trendów",
      icon: LineChart,
    },
    {
      name: "Raportowanie",
      value: 80,
      description: "Automatyczne raporty i dashboardy",
      icon: LayoutGrid,
    },
    {
      name: "Optymalizacja zasobów",
      value: 75,
      description: "Identyfikacja możliwości optymalizacji",
      icon: DollarSign,
    },
  ],
  security: [
    {
      name: "Ochrona danych",
      value: 95,
      description: "Kompleksowa ochrona danych wrażliwych",
      icon: ShieldCheck,
    },
    {
      name: "Wykrywanie zagrożeń",
      value: 90,
      description: "Zaawansowane wykrywanie i zapobieganie włamaniom",
      icon: ShieldCheck,
    },
    {
      name: "Zgodność z przepisami",
      value: 85,
      description: "Zapewnienie zgodności z RODO i innymi regulacjami",
      icon: ShieldCheck,
    },
    {
      name: "Ciągłość biznesowa",
      value: 80,
      description: "Minimalizacja ryzyka przestojów związanych z incydentami",
      icon: TrendingUp,
    },
    {
      name: "Bezpieczeństwo sieci",
      value: 85,
      description: "Zabezpieczenie komunikacji sieciowej",
      icon: ShieldCheck,
    },
    {
      name: "Edukacja pracowników",
      value: 75,
      description: "Szkolenia i zwiększanie świadomości bezpieczeństwa",
      icon: LineChart,
    },
  ],
  databases: [
    {
      name: "Wydajność zapytań",
      value: 90,
      description: "Zoptymalizowana wydajność zapytań do bazy danych",
      icon: Zap,
    },
    {
      name: "Niezawodność danych",
      value: 95,
      description: "Zapewnienie integralności i spójności danych",
      icon: ShieldCheck,
    },
    {
      name: "Skalowalność",
      value: 85,
      description: "Łatwe skalowanie wraz ze wzrostem ilości danych",
      icon: TrendingUp,
    },
    {
      name: "Bezpieczeństwo",
      value: 90,
      description: "Zaawansowane mechanizmy ochrony danych",
      icon: ShieldCheck,
    },
    {
      name: "Backup i odzyskiwanie",
      value: 85,
      description: "Niezawodne mechanizmy tworzenia kopii zapasowych",
      icon: Clock,
    },
    {
      name: "Dostępność",
      value: 80,
      description: "Wysoka dostępność i minimalizacja przestojów",
      icon: LineChart,
    },
  ],
  deployment: [
    {
      name: "Szybkość wdrożeń",
      value: 95,
      description: "Skrócenie czasu dostarczania nowych funkcji",
      icon: Zap,
    },
    {
      name: "Automatyzacja",
      value: 90,
      description: "Automatyzacja całego procesu wdrażania",
      icon: LayoutGrid,
    },
    {
      name: "Jakość kodu",
      value: 85,
      description: "Poprawa jakości kodu dzięki automatycznym testom",
      icon: ShieldCheck,
    },
    {
      name: "Niezawodność wdrożeń",
      value: 85,
      description: "Redukcja błędów związanych z wdrożeniami",
      icon: ShieldCheck,
    },
    {
      name: "Szybki rollback",
      value: 80,
      description: "Możliwość szybkiego wycofania zmian w razie problemów",
      icon: Clock,
    },
    {
      name: "Transparentność",
      value: 75,
      description: "Pełna widoczność procesu wdrożeniowego",
      icon: LineChart,
    },
  ],
  webapps: [
    {
      name: "UX/UI",
      value: 95,
      description: "Intuicyjny i atrakcyjny interfejs użytkownika",
      icon: LayoutGrid,
    },
    {
      name: "Wydajność",
      value: 85,
      description: "Optymalna wydajność i szybkość ładowania",
      icon: Zap,
    },
    {
      name: "Skalowalność",
      value: 80,
      description: "Możliwość obsługi rosnącej liczby użytkowników",
      icon: TrendingUp,
    },
    {
      name: "Bezpieczeństwo",
      value: 90,
      description: "Ochrona przed popularnymi zagrożeniami web",
      icon: ShieldCheck,
    },
    {
      name: "Responsywność",
      value: 95,
      description: "Doskonałe działanie na wszystkich urządzeniach",
      icon: LayoutGrid,
    },
    {
      name: "Funkcjonalność",
      value: 90,
      description: "Bogaty zestaw funkcji dopasowanych do potrzeb",
      icon: LayoutGrid,
    },
  ],
  architecture: [
    {
      name: "Skalowalność",
      value: 90,
      description: "Architektura gotowa na przyszły wzrost",
      icon: TrendingUp,
    },
    {
      name: "Elastyczność",
      value: 85,
      description: "Łatwość dostosowania do zmieniających się wymagań",
      icon: LayoutGrid,
    },
    {
      name: "Wydajność",
      value: 85,
      description: "Zoptymalizowana wydajność systemu",
      icon: Zap,
    },
    {
      name: "Maintainability",
      value: 90,
      description: "Łatwość utrzymania i rozwoju systemu",
      icon: Clock,
    },
    {
      name: "Bezpieczeństwo",
      value: 85,
      description: "Bezpieczeństwo wbudowane w architekturę",
      icon: ShieldCheck,
    },
    {
      name: "Spójność",
      value: 80,
      description: "Spójna i przemyślana struktura systemu",
      icon: LayoutGrid,
    },
  ],
};

// Domyślne korzyści do użycia, jeśli nie znajdzie usługi
const defaultBenefits = serviceBenefits.infrastructure;

// Główny komponent wykresu korzyści
const ServiceBenefitsChart: React.FC<{
  serviceId: string;
  primaryColor: string;
  secondaryColor?: string;
}> = ({ serviceId, primaryColor, secondaryColor = primaryColor }) => {
  const [chartType, setChartType] = useState<"bar" | "radar">("radar");
  const [selectedBenefit, setSelectedBenefit] = useState<string | null>(null);

  // Pobierz dane korzyści dla wskazanej usługi lub użyj domyślnych
  const benefits = serviceBenefits[serviceId] || defaultBenefits;

  // Konwersja koloru na format hex dla Recharts
  const getColorHex = (color: string): string => {
    const colorMap: { [key: string]: string } = {
      indigo: "#6366f1",
      blue: "#3b82f6",
      emerald: "#10b981",
      sky: "#0ea5e9",
      purple: "#a855f7",
      amber: "#f59e0b",
      pink: "#ec4899",
    };

    return colorMap[color] || "#6366f1";
  };

  const primaryColorHex = getColorHex(primaryColor);

  // Sortuj korzyści według wartości (od największej)
  const sortedBenefits = [...benefits].sort((a, b) => b.value - a.value);

  // Znajdź szczegóły wybranej korzyści
  const selectedBenefitDetails = benefits.find(
    (b) => b.name === selectedBenefit
  );

  return (
    <div className="flex flex-col">
      {/* Przyciski przełączania typów wykresów */}
      <div className="flex justify-end mb-6 gap-2">
        <button
          type="button"
          className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 ${
            chartType === "bar"
              ? `bg-${primaryColor}-900/40 text-${primaryColor}-400 border border-${primaryColor}-500/30`
              : "bg-gray-800/50 text-gray-400 border border-gray-700/30 hover:bg-gray-800"
          }`}
          onClick={() => setChartType("bar")}
        >
          <BarChart className="w-4 h-4" />
          <span>Słupkowy</span>
        </button>
        <button
          type="button"
          className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 ${
            chartType === "radar"
              ? `bg-${primaryColor}-900/40 text-${primaryColor}-400 border border-${primaryColor}-500/30`
              : "bg-gray-800/50 text-gray-400 border border-gray-700/30 hover:bg-gray-800"
          }`}
          onClick={() => setChartType("radar")}
        >
          <RadarChart className="w-4 h-4" />
          <span>Radarowy</span>
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Wykres */}
        <div className="md:col-span-2">
          <Card3D
            interactive={false}
            glowEffect
            glowColor={`rgba(${
              primaryColor === "indigo"
                ? "99, 102, 241"
                : primaryColor === "emerald"
                ? "16, 185, 129"
                : primaryColor === "sky"
                ? "14, 165, 233"
                : primaryColor === "purple"
                ? "168, 85, 247"
                : primaryColor === "amber"
                ? "245, 158, 11"
                : primaryColor === "pink"
                ? "236, 72, 153"
                : "99, 102, 241"
            }, 0.4)`}
            shadow
            bgColor="bg-gray-900/50"
            borderColor={`border-${primaryColor}-500/30`}
          >
            <div className="p-4 h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === "bar" ? (
                  <BarChart
                    data={sortedBenefits}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    layout="vertical"
                    barGap={5}
                    barSize={24}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                      type="number"
                      domain={[0, 100]}
                      tick={{ fill: "#9CA3AF" }}
                    />
                    <YAxis
                      dataKey="name"
                      type="category"
                      tick={{ fill: "#9CA3AF" }}
                      width={100}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: `1px solid ${primaryColorHex}80`,
                        borderRadius: "0.375rem",
                        color: "#F9FAFB",
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="value"
                      name="Ocena (0-100)"
                      fill={primaryColorHex}
                      onClick={(data) => setSelectedBenefit(data.name)}
                      isAnimationActive={true}
                      animationDuration={1000}
                      animationEasing="ease-out"
                    />
                  </BarChart>
                ) : (
                  <RadarChart
                    cx="50%"
                    cy="50%"
                    outerRadius="70%"
                    data={benefits}
                  >
                    <PolarGrid stroke="#374151" />
                    <PolarAngleAxis dataKey="name" tick={{ fill: "#9CA3AF" }} />
                    <PolarRadiusAxis
                      angle={30}
                      domain={[0, 100]}
                      tick={{ fill: "#9CA3AF" }}
                    />
                    <Radar
                      name="Ocena (0-100)"
                      dataKey="value"
                      stroke={primaryColorHex}
                      fill={primaryColorHex}
                      fillOpacity={0.5}
                      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                      onClick={(data: any) => {
                        if (data?.name) {
                          setSelectedBenefit(data.name);
                        }
                      }}
                      isAnimationActive={true}
                      animationDuration={1000}
                      animationEasing="ease-out"
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: `1px solid ${primaryColorHex}80`,
                        borderRadius: "0.375rem",
                        color: "#F9FAFB",
                      }}
                    />
                    <Legend />
                  </RadarChart>
                )}
              </ResponsiveContainer>
            </div>
          </Card3D>
        </div>

        {/* Lista korzyści z opisami */}
        <div className="md:col-span-1">
          <div className="space-y-4">
            {benefits.map((benefit) => (
              <motion.div key={benefit.name} whileHover={{ scale: 1.02 }}>
                <TiltCard
                  tiltAmount={5}
                  glareOpacity={0.1}
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedBenefit === benefit.name
                      ? `border-l-4 border-${primaryColor}-500`
                      : ""
                  }`}
                  onClick={() => setSelectedBenefit(benefit.name)}
                >
                  <div className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className={`p-2 rounded-md bg-${primaryColor}-900/30 text-${primaryColor}-400`}
                      >
                        <benefit.icon size={16} />
                      </div>
                      <h3
                        className={`font-semibold ${
                          selectedBenefit === benefit.name
                            ? `text-${primaryColor}-400`
                            : "text-white"
                        }`}
                      >
                        {benefit.name}
                      </h3>
                    </div>
                    <div className="ml-9">
                      <p className="text-sm text-gray-400">
                        {benefit.description}
                      </p>
                      {selectedBenefit === benefit.name && (
                        <div className="mt-2">
                          <div className="h-1.5 w-full bg-gray-700 rounded-full overflow-hidden">
                            <motion.div
                              className={`h-full bg-${primaryColor}-500 rounded-full`}
                              initial={{ width: 0 }}
                              animate={{ width: `${benefit.value}%` }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                            />
                          </div>
                          <div className="flex justify-end mt-1">
                            <span
                              className={`text-xs font-medium text-${primaryColor}-400`}
                            >
                              {benefit.value}/100
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Szczegóły wybranej korzyści */}
      {selectedBenefitDetails && (
        <motion.div
          className={`mt-8 p-6 bg-${primaryColor}-900/10 border border-${primaryColor}-500/20 rounded-lg`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          key={selectedBenefitDetails.name}
        >
          <div className="flex items-center gap-4">
            <div
              className={`p-3 rounded-full bg-${primaryColor}-900/30 text-${primaryColor}-400`}
            >
              <selectedBenefitDetails.icon size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold">
                {selectedBenefitDetails.name}
              </h3>
              <p className="text-gray-300">
                {selectedBenefitDetails.description}
              </p>
            </div>
          </div>

          <div className="mt-4 grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm uppercase text-gray-500 mb-2">
                Jak to osiągamy
              </h4>
              <ul className="space-y-2">
                {[
                  "Wykorzystanie najnowszych technologii i narzędzi",
                  "Wieloletnie doświadczenie specjalistów",
                  "Indywidualne podejście do każdego projektu",
                  "Ciągłe monitorowanie i optymalizacja",
                ].map((point, idx) => (
                  <li
                    key={`point-${
                      // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                      idx
                    }`}
                    className="flex items-start gap-2"
                  >
                    <span className={`text-${primaryColor}-400 mt-1`}>→</span>
                    <span className="text-gray-300 text-sm">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm uppercase text-gray-500 mb-2">
                Rezultaty dla Twojego biznesu
              </h4>
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-300">
                    Wartość dla biznesu
                  </span>
                  <span className={`text-${primaryColor}-400 font-semibold`}>
                    {selectedBenefitDetails.value}/100
                  </span>
                </div>
                <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full bg-gradient-to-r from-${primaryColor}-600 to-${secondaryColor}-500 rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${selectedBenefitDetails.value}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>

                <div className="mt-4 text-sm text-gray-400">
                  <p>
                    {selectedBenefitDetails.name === "Skalowalność"
                      ? "Rozwiązanie dostosowuje się do zmieniających się potrzeb biznesowych, umożliwiając szybki wzrost bez konieczności przebudowy infrastruktury."
                      : selectedBenefitDetails.name === "Niezawodność"
                      ? "Minimalizacja przestojów i przerw w działaniu dzięki architekturze wysokiej dostępności i mechanizmom automatycznego przywracania."
                      : selectedBenefitDetails.name === "Oszczędność kosztów"
                      ? "Optymalizacja wykorzystania zasobów i redukcja kosztów operacyjnych dzięki automatyzacji i zarządzaniu zasobami."
                      : selectedBenefitDetails.name === "Bezpieczeństwo"
                      ? "Kompleksowa ochrona danych i systemów przed zagrożeniami zewnętrznymi i wewnętrznymi, zgodność z najlepszymi praktykami."
                      : selectedBenefitDetails.name === "Szybkość wdrożenia"
                      ? "Znaczące skrócenie czasu potrzebnego na wdrożenie nowych funkcji i usług, przyspieszając time-to-market."
                      : selectedBenefitDetails.name === "Automatyzacja"
                      ? "Redukcja ręcznej pracy i błędów ludzkich dzięki automatyzacji powtarzalnych zadań i procesów."
                      : selectedBenefitDetails.name === "UX/UI"
                      ? "Intuicyjny i atrakcyjny interfejs użytkownika zwiększający zaangażowanie i satysfakcję klientów."
                      : selectedBenefitDetails.name === "Wydajność"
                      ? "Optymalizacja szybkości działania i responsywności, prowadząca do lepszych doświadczeń użytkownika i wyższych konwersji."
                      : "Znacząca poprawa wyników biznesowych dzięki profesjonalnemu wdrożeniu i optymalizacji rozwiązania."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ServiceBenefitsChart;
