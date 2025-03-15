// src/components/services/service-process-steps.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  CheckCircle,
  ArrowRight,
  AlertCircle,
  HelpCircle,
  type LucideIcon,
} from "lucide-react";

interface Step {
  id: string;
  title: string;
  description: string;
  duration: string;
  icon: LucideIcon;
  keyPoints: string[];
}

// Dane procesu dla różnych usług
const serviceProcesses: { [key: string]: Step[] } = {
  infrastructure: [
    {
      id: "analysis",
      title: "Analiza wymagań",
      description: "Dokładne określenie potrzeb i celów infrastrukturalnych",
      duration: "1-2 dni",
      icon: HelpCircle,
      keyPoints: [
        "Identyfikacja kluczowych wymagań biznesowych",
        "Analiza obecnej infrastruktury (jeśli istnieje)",
        "Określenie skali i elastyczności rozwiązania",
        "Identyfikacja potencjalnych wyzwań i ograniczeń",
      ],
    },
    {
      id: "design",
      title: "Projektowanie architektury",
      description: "Tworzenie optymalnej architektury chmurowej",
      duration: "2-3 dni",
      icon: HelpCircle,
      keyPoints: [
        "Wybór odpowiednich usług chmurowych",
        "Projektowanie topologii sieci i zabezpieczeń",
        "Planowanie skalowalności i redundancji",
        "Optymalizacja kosztów infrastruktury",
      ],
    },
    {
      id: "implementation",
      title: "Implementacja",
      description: "Wdrożenie infrastruktury jako kodu (IaC)",
      duration: "3-7 dni",
      icon: Clock,
      keyPoints: [
        "Konfiguracja dostawcy chmury (AWS/Azure/GCP)",
        "Implementacja z wykorzystaniem Terraform/CloudFormation",
        "Konfiguracja sieci, bezpieczeństwa i monitoringu",
        "Tworzenie środowisk (dev, staging, prod)",
      ],
    },
    {
      id: "testing",
      title: "Testowanie i walidacja",
      description: "Weryfikacja poprawności działania infrastruktury",
      duration: "1-2 dni",
      icon: AlertCircle,
      keyPoints: [
        "Testowanie wydajności i skalowalności",
        "Audyt bezpieczeństwa infrastruktury",
        "Walidacja procedur backupu i disaster recovery",
        "Testowanie scenariuszy awarii i przełączania",
      ],
    },
    {
      id: "deployment",
      title: "Wdrożenie produkcyjne",
      description: "Uruchomienie infrastruktury w środowisku docelowym",
      duration: "1 dzień",
      icon: CheckCircle,
      keyPoints: [
        "Migracja danych (jeśli wymagana)",
        "Konfiguracja monitoringu produkcyjnego",
        "Uruchomienie wszystkich komponentów",
        "Weryfikacja działania po wdrożeniu",
      ],
    },
  ],
  servers: [
    {
      id: "audit",
      title: "Audyt istniejącej infrastruktury",
      description: "Analiza obecnych serwerów i architektury",
      duration: "1-2 dni",
      icon: HelpCircle,
      keyPoints: [
        "Inwentaryzacja istniejących serwerów",
        "Analiza wydajności i identyfikacja wąskich gardeł",
        "Przegląd konfiguracji i zabezpieczeń",
        "Ocena stabilności i niezawodności",
      ],
    },
    {
      id: "planning",
      title: "Planowanie i projektowanie",
      description: "Opracowanie optymalnego rozwiązania serwerowego",
      duration: "2-3 dni",
      icon: HelpCircle,
      keyPoints: [
        "Wybór odpowiednich technologii serwerowych",
        "Projektowanie architektury i specyfikacji sprzętowej",
        "Planowanie redundancji i rozwiązań wysokiej dostępności",
        "Optymalizacja kosztów i wydajności",
      ],
    },
    {
      id: "setup",
      title: "Konfiguracja i wdrożenie",
      description: "Instalacja i konfiguracja serwerów",
      duration: "3-5 dni",
      icon: Clock,
      keyPoints: [
        "Instalacja systemów operacyjnych i oprogramowania",
        "Konfiguracja zabezpieczeń i firewalli",
        "Wdrożenie rozwiązań monitorujących",
        "Automatyzacja procesu wdrożenia (IaC)",
      ],
    },
    {
      id: "migration",
      title: "Migracja i optymalizacja",
      description: "Przeniesienie aplikacji i danych na nowe serwery",
      duration: "1-3 dni",
      icon: AlertCircle,
      keyPoints: [
        "Planowanie procesu migracji z minimalizacją przestojów",
        "Przeniesienie aplikacji i danych",
        "Optymalizacja wydajności po migracji",
        "Testowanie działania i stabilności",
      ],
    },
    {
      id: "handover",
      title: "Przekazanie i dokumentacja",
      description: "Przekazanie rozwiązania i szkolenie zespołu",
      duration: "1 dzień",
      icon: CheckCircle,
      keyPoints: [
        "Przekazanie pełnej dokumentacji technicznej",
        "Szkolenie zespołu z obsługi i zarządzania",
        "Ustalenie procedur utrzymania i aktualizacji",
        "Definiowanie planów reagowania na awarie",
      ],
    },
  ],
  monitoring: [
    {
      id: "requirements",
      title: "Analiza wymagań monitoringu",
      description: "Określenie kluczowych metryk i alertów",
      duration: "1-2 dni",
      icon: HelpCircle,
      keyPoints: [
        "Identyfikacja kluczowych wskaźników do monitorowania",
        "Określenie progów alertów i powiadomień",
        "Planowanie retencji danych historycznych",
        "Analiza potrzeb raportowych",
      ],
    },
    {
      id: "setup",
      title: "Wdrożenie narzędzi monitoringu",
      description: "Instalacja i konfiguracja systemów monitorujących",
      duration: "2-4 dni",
      icon: Clock,
      keyPoints: [
        "Instalacja agentów monitorujących",
        "Konfiguracja serwerów Prometheus/Grafana/Zabbix",
        "Implementacja monitoringu infrastruktury i aplikacji",
        "Konfiguracja eksporterów danych",
      ],
    },
    {
      id: "dashboards",
      title: "Tworzenie dashboardów",
      description: "Przygotowanie przejrzystych paneli wizualizacji",
      duration: "1-2 dni",
      icon: AlertCircle,
      keyPoints: [
        "Projektowanie dashboardów dla różnych grup odbiorców",
        "Wizualizacja kluczowych metryk biznesowych",
        "Tworzenie widoków technicznych dla zespołów IT",
        "Konfiguracja raportów automatycznych",
      ],
    },
    {
      id: "alerts",
      title: "Konfiguracja alertów",
      description: "Ustawienie systemu powiadomień i alertów",
      duration: "1-2 dni",
      icon: CheckCircle,
      keyPoints: [
        "Konfiguracja progów alertów i reguł",
        "Integracja z systemami powiadomień (Slack, email, SMS)",
        "Ustawienie eskalacji alertów",
        "Testowanie systemu powiadomień",
      ],
    },
    {
      id: "testing",
      title: "Testowanie i optymalizacja",
      description: "Weryfikacja działania systemu monitoringu",
      duration: "1-2 dni",
      icon: CheckCircle,
      keyPoints: [
        "Testowanie systemu w różnych scenariuszach",
        "Eliminacja fałszywych alertów",
        "Optymalizacja wydajności monitoringu",
        "Szkolenie zespołu z obsługi systemu",
      ],
    },
  ],
  security: [
    {
      id: "audit",
      title: "Audyt bezpieczeństwa",
      description: "Kompleksowy przegląd aktualnych zabezpieczeń",
      duration: "2-3 dni",
      icon: HelpCircle,
      keyPoints: [
        "Identyfikacja podatności i luk bezpieczeństwa",
        "Analiza polityk i procedur bezpieczeństwa",
        "Rewizja uprawnień i kontroli dostępu",
        "Ocena zgodności z regulacjami (RODO, ISO27001)",
      ],
    },
    {
      id: "planning",
      title: "Planowanie zabezpieczeń",
      description: "Opracowanie strategii bezpieczeństwa",
      duration: "1-2 dni",
      icon: Clock,
      keyPoints: [
        "Projektowanie architektury bezpieczeństwa",
        "Wybór odpowiednich rozwiązań i narzędzi",
        "Planowanie procesu wdrożenia zmian",
        "Definiowanie polityk bezpieczeństwa",
      ],
    },
    {
      id: "implementation",
      title: "Implementacja zabezpieczeń",
      description: "Wdrożenie zaplanowanych rozwiązań ochronnych",
      duration: "3-7 dni",
      icon: AlertCircle,
      keyPoints: [
        "Konfiguracja firewalli i systemów wykrywania włamań",
        "Wdrożenie uwierzytelniania wieloskładnikowego",
        "Implementacja szyfrowania danych",
        "Hardening systemów i aplikacji",
      ],
    },
    {
      id: "testing",
      title: "Testowanie bezpieczeństwa",
      description: "Weryfikacja skuteczności wdrożonych zabezpieczeń",
      duration: "2-3 dni",
      icon: AlertCircle,
      keyPoints: [
        "Przeprowadzenie testów penetracyjnych",
        "Symulacje ataków i analiza reakcji",
        "Weryfikacja bezpieczeństwa aplikacji",
        "Testy odporności na ataki DDoS",
      ],
    },
    {
      id: "training",
      title: "Szkolenia i procedury",
      description: "Przygotowanie zespołu i procedur bezpieczeństwa",
      duration: "1-2 dni",
      icon: CheckCircle,
      keyPoints: [
        "Szkolenia dla pracowników z zakresu bezpieczeństwa",
        "Utworzenie procedur reagowania na incydenty",
        "Dokumentacja polityk bezpieczeństwa",
        "Plan ciągłego doskonalenia bezpieczeństwa",
      ],
    },
  ],
  databases: [
    {
      id: "analysis",
      title: "Analiza potrzeb",
      description: "Określenie wymagań dla bazy danych",
      duration: "1-2 dni",
      icon: HelpCircle,
      keyPoints: [
        "Określenie typu danych i modelu bazy",
        "Analiza wymagań wydajnościowych",
        "Planowanie skalowalności i dostępności",
        "Identyfikacja wymagań zgodności i bezpieczeństwa",
      ],
    },
    {
      id: "design",
      title: "Projektowanie struktury",
      description: "Utworzenie optymalnego modelu danych",
      duration: "2-3 dni",
      icon: Clock,
      keyPoints: [
        "Projektowanie schematów i relacji",
        "Optymalizacja pod kątem wydajności",
        "Planowanie indeksów i partycjonowania",
        "Projektowanie strategii backupu i replikacji",
      ],
    },
    {
      id: "implementation",
      title: "Implementacja bazy danych",
      description: "Wdrożenie zaprojektowanej bazy danych",
      duration: "2-4 dni",
      icon: Clock,
      keyPoints: [
        "Instalacja i konfiguracja serwerów bazodanowych",
        "Tworzenie struktur zgodnie z projektem",
        "Implementacja zabezpieczeń i kontroli dostępu",
        "Konfiguracja replikacji i klastrów",
      ],
    },
    {
      id: "migration",
      title: "Migracja danych",
      description: "Przeniesienie danych z istniejących systemów",
      duration: "1-5 dni",
      icon: AlertCircle,
      keyPoints: [
        "Planowanie procesu migracji",
        "Ekstrahowanie danych ze źródeł",
        "Transformacja i walidacja danych",
        "Ładowanie danych do nowej bazy",
      ],
    },
    {
      id: "optimization",
      title: "Optymalizacja i monitoring",
      description: "Dostrojenie wydajności i monitorowanie",
      duration: "1-3 dni",
      icon: CheckCircle,
      keyPoints: [
        "Optymalizacja zapytań i indeksów",
        "Konfiguracja narzędzi monitoringu",
        "Planowanie konserwacji i aktualizacji",
        "Testowanie wydajności pod obciążeniem",
      ],
    },
  ],
  deployment: [
    {
      id: "setup",
      title: "Konfiguracja środowiska CI/CD",
      description: "Przygotowanie infrastruktury do automatyzacji",
      duration: "1-3 dni",
      icon: HelpCircle,
      keyPoints: [
        "Wybór i konfiguracja narzędzi CI/CD",
        "Integracja z systemem kontroli wersji",
        "Konfiguracja środowisk (dev, staging, prod)",
        "Przygotowanie kredencjałów i uprawnień",
      ],
    },
    {
      id: "pipeline",
      title: "Budowa pipeline'ów",
      description: "Tworzenie procesów automatyzacji wdrożeń",
      duration: "2-4 dni",
      icon: Clock,
      keyPoints: [
        "Definiowanie etapów pipeline'u",
        "Konfiguracja automatycznych testów",
        "Implementacja procesów budowania artefaktów",
        "Integracja z systemami monitoringu",
      ],
    },
    {
      id: "automation",
      title: "Automatyzacja wdrożeń",
      description: "Konfiguracja automatycznych deploymentów",
      duration: "1-3 dni",
      icon: Clock,
      keyPoints: [
        "Implementacja wdrożeń zero-downtime",
        "Automatyzacja rollbacków w przypadku awarii",
        "Konfiguracja strategii wdrażania (blue-green, canary)",
        "Integracja z zarządzaniem konfiguracją",
      ],
    },
    {
      id: "security",
      title: "Integracja bezpieczeństwa",
      description: "Wbudowanie bezpieczeństwa w proces CI/CD",
      duration: "1-2 dni",
      icon: AlertCircle,
      keyPoints: [
        "Implementacja skanowania kodu i zależności",
        "Testy bezpieczeństwa aplikacji (SAST, DAST)",
        "Skanowanie kontenerów i obrazów",
        "Weryfikacja zgodności z politykami",
      ],
    },
    {
      id: "handover",
      title: "Dokumentacja i przekazanie",
      description: "Przygotowanie zespołu do korzystania z CI/CD",
      duration: "1 dzień",
      icon: CheckCircle,
      keyPoints: [
        "Kompleksowa dokumentacja procesów",
        "Szkolenie zespołu deweloperskiego",
        "Ustalenie procedur utrzymania pipeline'ów",
        "Przekazanie wiedzy i najlepszych praktyk",
      ],
    },
  ],
  webapps: [
    {
      id: "requirements",
      title: "Analiza wymagań",
      description: "Określenie funkcjonalności i architektury aplikacji",
      duration: "1-3 dni",
      icon: HelpCircle,
      keyPoints: [
        "Zbieranie wymagań funkcjonalnych i biznesowych",
        "Definiowanie architektury technicznej",
        "Projektowanie modelu danych",
        "Planowanie interfejsu użytkownika",
      ],
    },
    {
      id: "design",
      title: "Projektowanie UI/UX",
      description: "Tworzenie interfejsu użytkownika i doświadczeń",
      duration: "2-5 dni",
      icon: Clock,
      keyPoints: [
        "Projektowanie makiet i prototypów",
        "Definiowanie ścieżek użytkownika",
        "Projektowanie responsywnego layoutu",
        "Optymalizacja doświadczeń użytkownika",
      ],
    },
    {
      id: "development",
      title: "Implementacja aplikacji",
      description: "Programowanie funkcjonalności i komponentów",
      duration: "5-15 dni",
      icon: Clock,
      keyPoints: [
        "Rozwój frontendu (React, Vue, Angular)",
        "Implementacja backendu i API",
        "Integracja z bazami danych",
        "Tworzenie systemu autoryzacji i uwierzytelniania",
      ],
    },
    {
      id: "testing",
      title: "Testowanie i QA",
      description: "Walidacja jakości i funkcjonalności",
      duration: "2-5 dni",
      icon: AlertCircle,
      keyPoints: [
        "Testy jednostkowe i integracyjne",
        "Testy UI i e2e",
        "Testy wydajnościowe",
        "Testy bezpieczeństwa aplikacji",
      ],
    },
    {
      id: "deployment",
      title: "Wdrożenie i uruchomienie",
      description: "Publikacja aplikacji w środowisku produkcyjnym",
      duration: "1-2 dni",
      icon: CheckCircle,
      keyPoints: [
        "Konfiguracja środowiska produkcyjnego",
        "Wdrożenie wersji produkcyjnej",
        "Konfiguracja domeny i certyfikatów SSL",
        "Monitoring i obserwacja po wdrożeniu",
      ],
    },
  ],
  architecture: [
    {
      id: "discovery",
      title: "Analiza i odkrywanie",
      description: "Zrozumienie potrzeb i ograniczeń",
      duration: "1-3 dni",
      icon: HelpCircle,
      keyPoints: [
        "Rozmowy z interesariuszami i zespołami",
        "Zrozumienie celów biznesowych",
        "Identyfikacja ograniczeń technicznych",
        "Inwentaryzacja istniejących systemów",
      ],
    },
    {
      id: "strategy",
      title: "Strategia architektoniczna",
      description: "Określenie kierunku i celów architektury",
      duration: "2-3 dni",
      icon: Clock,
      keyPoints: [
        "Ustalenie zasad architektury",
        "Wybór podejścia architektonicznego",
        "Definiowanie metodologii rozwoju",
        "Planowanie ewolucji architektury",
      ],
    },
    {
      id: "design",
      title: "Projektowanie rozwiązania",
      description: "Tworzenie szczegółowej architektury systemu",
      duration: "3-7 dni",
      icon: Clock,
      keyPoints: [
        "Projektowanie architektury modułów",
        "Definiowanie interfejsów i integracji",
        "Planowanie skalowalności i wydajności",
        "Projektowanie bezpieczeństwa systemu",
      ],
    },
    {
      id: "validation",
      title: "Walidacja architektury",
      description: "Weryfikacja założeń i rozwiązań",
      duration: "1-3 dni",
      icon: AlertCircle,
      keyPoints: [
        "Przegląd architektury przez interesariuszy",
        "Analiza ryzyka i wąskich gardeł",
        "Walidacja wymagań niefunkcjonalnych",
        "Prototypowanie kluczowych elementów",
      ],
    },
    {
      id: "documentation",
      title: "Dokumentacja i przekazanie",
      description: "Tworzenie dokumentacji technicznej",
      duration: "2-4 dni",
      icon: CheckCircle,
      keyPoints: [
        "Opracowanie dokumentacji architektury",
        "Tworzenie diagramów i schematów",
        "Definiowanie standardów i wytycznych",
        "Przekazanie wiedzy zespołom wdrożeniowym",
      ],
    },
  ],
};

// Domyślny proces do użycia, jeśli nie znajdzie usługi
const defaultProcess = serviceProcesses.infrastructure;

const ServiceProcessSteps: React.FC<{
  serviceId: string;
  primaryColor: string;
  secondaryColor: string;
}> = ({ serviceId, primaryColor }) => {
  const [activeStep, setActiveStep] = useState<string | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);

  useEffect(() => {
    // Pobierz kroki dla wskazanej usługi lub użyj domyślnych
    const serviceSteps = serviceProcesses[serviceId] || defaultProcess;
    setSteps(serviceSteps);

    // Ustaw pierwszy krok jako aktywny przy początkowym ładowaniu
    if (serviceSteps.length > 0 && !activeStep) {
      setActiveStep(serviceSteps[0].id);
    }
  }, [serviceId, activeStep]);

  return (
    <div className="flex flex-col">
      {/* Linia czasu procesu */}
      <div className="flex items-center justify-between mb-8 overflow-x-auto pb-4">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center min-w-fit">
            {/* Krok */}
            <motion.button
              type="button"
              className={`relative flex flex-col items-center group ${
                activeStep === step.id
                  ? `text-${primaryColor}-400`
                  : "text-gray-400 hover:text-gray-300"
              }`}
              onClick={() => setActiveStep(step.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${
                  activeStep === step.id
                    ? `bg-${primaryColor}-900/50 border-2 border-${primaryColor}-500`
                    : "bg-gray-800 border border-gray-700"
                }`}
              >
                {index + 1}
              </div>
              <span className="mt-2 text-sm font-medium whitespace-nowrap">
                {step.title}
              </span>

              {/* Wskaźnik aktywnego kroku */}
              {activeStep === step.id && (
                <motion.div
                  className={`absolute -bottom-1 left-0 right-0 h-0.5 bg-${primaryColor}-500`}
                  layoutId="activeStep"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>

            {/* Linia łącząca (poza ostatnim krokiem) */}
            {index < steps.length - 1 && (
              <div
                className={`w-10 md:w-20 h-0.5 mx-2 ${
                  activeStep === step.id || activeStep === steps[index + 1].id
                    ? `bg-${primaryColor}-500`
                    : "bg-gray-700"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Szczegóły wybranego kroku */}
      <AnimatePresence mode="wait">
        {steps.map((step) => {
          if (step.id !== activeStep) return null;

          return (
            <motion.div
              key={step.id}
              className={`p-6 bg-gray-800/50 rounded-xl border border-${primaryColor}-500/20`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/2">
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`p-2.5 rounded-lg bg-${primaryColor}-900/30 text-${primaryColor}-400`}
                    >
                      <step.icon size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{step.title}</h3>
                      <p className="text-gray-400">{step.description}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                      <Clock size={16} />
                      <span>
                        Szacowany czas trwania: <strong>{step.duration}</strong>
                      </span>
                    </div>
                  </div>

                  <ul className="space-y-2">
                    {step.keyPoints.map((point, idx) => (
                      <motion.li
                        key={`point-${
                          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                          idx
                        }`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-start gap-2"
                      >
                        <span
                          className={`w-5 h-5 rounded-full bg-${primaryColor}-900/30 flex items-center justify-center flex-shrink-0 mt-0.5`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`w-3 h-3 text-${primaryColor}-400`}
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <title>check</title>
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </span>
                        <span className="text-gray-300">{point}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                <div className="md:w-1/2 flex items-center justify-center">
                  <div className="w-full h-full max-h-60 flex items-center justify-center rounded-lg bg-gray-900/50 p-4 border border-gray-800/50">
                    <div className={`text-${primaryColor}-400 opacity-20`}>
                      <svg
                        className="w-32 h-32"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <title>process</title>
                        {step.id === "analysis" ||
                        step.id === "requirements" ||
                        step.id === "discovery" ||
                        step.id === "audit" ? (
                          // Analiza / Wymagania
                          <path
                            d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5M12 12H15M12 16H15M9 12H9.01M9 16H9.01"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            fill="currentColor"
                          />
                        ) : step.id === "design" ||
                          step.id === "planning" ||
                          step.id === "strategy" ? (
                          // Projektowanie / Planowanie
                          <path
                            d="M9 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3H15M9 3C9 4.10457 9.89543 5 11 5H13C14.1046 5 15 4.10457 15 3M9 3C9 1.89543 9.89543 1 11 1H13C14.1046 1 15 1.89543 15 3M12 10L16 14M12 10L8 14M12 10V19"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            fill="currentColor"
                          />
                        ) : step.id === "implementation" ||
                          step.id === "development" ||
                          step.id === "setup" ? (
                          // Implementacja / Rozwój
                          <path
                            d="M10 20L14 4M18 8L22 12L18 16M6 16L2 12L6 8"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            fill="currentColor"
                          />
                        ) : step.id === "testing" ||
                          step.id === "validation" ? (
                          // Testowanie / Walidacja
                          <path
                            d="M9 12L11 14L15 10M20.618 5.984C20.8572 6.52313 21 7.10495 21 7.71429C21 10.0811 19.1215 12 16.8 12C16.8 14.8406 14.6255 17.1429 12 17.1429C9.37446 17.1429 7.19996 14.8406 7.19996 12C4.87848 12 2.99996 10.0811 2.99996 7.71429C2.99996 7.10495 3.14271 6.52313 3.38195 5.984C4.24972 6.63328 5.31187 7 6.42854 7C8.51896 7 10.2538 5.48399 10.6526 3.5M11 12C11 14.2091 9.20914 16 7 16C4.79086 16 3 14.2091 3 12C3 9.79086 4.79086 8 7 8C9.20914 8 11 9.79086 11 12Z"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            fill="currentColor"
                          />
                        ) : (
                          // Wdrożenie / Zakończenie
                          <path
                            d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            fill="currentColor"
                          />
                        )}
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Nawigacja do kolejnego/poprzedniego kroku */}
              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  className={`flex items-center gap-2 px-3 py-1 rounded-md bg-gray-800 hover:bg-gray-700 transition-colors ${
                    steps.findIndex((s) => s.id === activeStep) === 0
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  onClick={() => {
                    const currentIndex = steps.findIndex(
                      (s) => s.id === activeStep
                    );
                    if (currentIndex > 0) {
                      setActiveStep(steps[currentIndex - 1].id);
                    }
                  }}
                  disabled={steps.findIndex((s) => s.id === activeStep) === 0}
                >
                  <ArrowRight className="w-4 h-4 rotate-180" />
                  <span>Poprzedni krok</span>
                </button>

                <button
                  type="button"
                  className={`flex items-center gap-2 px-3 py-1 rounded-md bg-${primaryColor}-900/30 hover:bg-${primaryColor}-900/50 text-${primaryColor}-400 transition-colors ${
                    steps.findIndex((s) => s.id === activeStep) ===
                    steps.length - 1
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  onClick={() => {
                    const currentIndex = steps.findIndex(
                      (s) => s.id === activeStep
                    );
                    if (currentIndex < steps.length - 1) {
                      setActiveStep(steps[currentIndex + 1].id);
                    }
                  }}
                  disabled={
                    steps.findIndex((s) => s.id === activeStep) ===
                    steps.length - 1
                  }
                >
                  <span>Następny krok</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default ServiceProcessSteps;
