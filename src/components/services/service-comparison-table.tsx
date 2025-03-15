// src/components/services/service-comparison-table.tsx
"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check, X, AlertTriangle, HelpCircle } from "lucide-react";
import { HoverCard } from "@/components/ambro-ui/hover-card";
import { Card3D } from "@/components/ambro-ui/card-3d";
import { GradientText } from "@/components/ambro-ui/gradient-text";

interface ComparisonFeature {
  name: string;
  description: string;
  myService: {
    value: "yes" | "no" | "partial";
    note?: string;
  };
  traditional: {
    value: "yes" | "no" | "partial";
    note?: string;
  };
  competitor: {
    value: "yes" | "no" | "partial";
    note?: string;
  };
}

interface ComparisonData {
  title: string;
  competitorLabel: string;
  traditionalLabel: string;
  features: ComparisonFeature[];
}

// Dane porównawcze dla różnych usług
const servicesComparison: { [key: string]: ComparisonData } = {
  infrastructure: {
    title: "Porównanie rozwiązań infrastrukturalnych",
    competitorLabel: "Typowi dostawcy",
    traditionalLabel: "On-premise",
    features: [
      {
        name: "Skalowalność",
        description:
          "Możliwość szybkiego i elastycznego skalowania infrastruktury",
        myService: {
          value: "yes",
          note: "Automatyczne skalowanie w pełni zautomatyzowane",
        },
        traditional: {
          value: "partial",
          note: "Wymaga dodatkowego sprzętu i przestojów",
        },
        competitor: {
          value: "partial",
          note: "Podstawowe opcje skalowania, często z ograniczeniami",
        },
      },
      {
        name: "Koszty początkowe",
        description: "Początkowe nakłady finansowe wymagane do uruchomienia",
        myService: {
          value: "yes",
          note: "Minimalne koszty początkowe, model subskrypcyjny",
        },
        traditional: {
          value: "no",
          note: "Wysokie koszty zakupu sprzętu i licencji",
        },
        competitor: {
          value: "partial",
          note: "Zróżnicowane modele cenowe, często z ukrytymi opłatami",
        },
      },
      {
        name: "Infrastruktura jako kod",
        description:
          "Zarządzanie infrastrukturą za pomocą kodu i automatyzacji",
        myService: {
          value: "yes",
          note: "Pełna automatyzacja z wykorzystaniem najnowszych narzędzi",
        },
        traditional: { value: "no", note: "Ręczna konfiguracja i zarządzanie" },
        competitor: {
          value: "partial",
          note: "Podstawowa automatyzacja, często z ograniczeniami",
        },
      },
      {
        name: "Elastyczność technologiczna",
        description: "Możliwość wyboru i zmiany technologii",
        myService: {
          value: "yes",
          note: "Pełna swoboda wyboru technologii i narzędzi",
        },
        traditional: {
          value: "partial",
          note: "Ograniczenia sprzętowe i licencyjne",
        },
        competitor: {
          value: "partial",
          note: "Często ograniczona do rozwiązań partnera",
        },
      },
      {
        name: "Odporność na awarie",
        description: "Zdolność do kontynuacji działania w przypadku awarii",
        myService: {
          value: "yes",
          note: "Architektura multi-AZ z automatycznym przełączaniem",
        },
        traditional: {
          value: "partial",
          note: "Wymaga dodatkowych inwestycji i konfiguracji",
        },
        competitor: {
          value: "partial",
          note: "Zależne od wybranego planu, często jako płatna opcja",
        },
      },
      {
        name: "Czas wdrożenia",
        description: "Czas potrzebny na uruchomienie środowiska",
        myService: {
          value: "yes",
          note: "Szybkie wdrożenie, najczęściej w ciągu dni",
        },
        traditional: {
          value: "no",
          note: "Tygodnie lub miesiące na zakup i konfigurację",
        },
        competitor: {
          value: "partial",
          note: "Zależne od złożoności projektu, średnio 1-2 tygodnie",
        },
      },
      {
        name: "Bezpieczeństwo",
        description: "Kompleksowe zabezpieczenia i zgodność z regulacjami",
        myService: {
          value: "yes",
          note: "Zaawansowane mechanizmy bezpieczeństwa i zgodność z normami",
        },
        traditional: {
          value: "partial",
          note: "Wymaga dodatkowych inwestycji i konfiguracji",
        },
        competitor: {
          value: "partial",
          note: "Podstawowe zabezpieczenia, często bez audytów",
        },
      },
    ],
  },
  servers: {
    title: "Porównanie zarządzania serwerami",
    competitorLabel: "Podstawowy hosting",
    traditionalLabel: "Własna administracja",
    features: [
      {
        name: "Automatyzacja zarządzania",
        description: "Automatyzacja zadań administracyjnych i konfiguracji",
        myService: {
          value: "yes",
          note: "Pełna automatyzacja z wykorzystaniem Ansible i Terraform",
        },
        traditional: {
          value: "partial",
          note: "Wymaga dodatkowego oprogramowania i konfiguracji",
        },
        competitor: {
          value: "no",
          note: "Głównie ręczna konfiguracja przez panel",
        },
      },
      {
        name: "Monitoring proaktywny",
        description:
          "Wykrywanie i rozwiązywanie problemów zanim wpłyną na działanie",
        myService: {
          value: "yes",
          note: "Zaawansowany monitoring z alertami predykcyjnymi",
        },
        traditional: {
          value: "partial",
          note: "Wymaga dodatkowych narzędzi i konfiguracji",
        },
        competitor: {
          value: "partial",
          note: "Podstawowy monitoring, głównie reaktywny",
        },
      },
      {
        name: "Optymalizacja wydajności",
        description: "Strojenie wydajności serwera pod konkretne potrzeby",
        myService: {
          value: "yes",
          note: "Zaawansowana optymalizacja na wielu poziomach",
        },
        traditional: {
          value: "partial",
          note: "Zależna od umiejętności wewnętrznego zespołu",
        },
        competitor: {
          value: "no",
          note: "Standardowe konfiguracje bez optymalizacji",
        },
      },
      {
        name: "Zabezpieczenia i łatki",
        description:
          "Regularne aktualizacje bezpieczeństwa i zarządzanie podatnościami",
        myService: {
          value: "yes",
          note: "Automatyczne zarządzanie łatkami z minimalnymi przestojami",
        },
        traditional: {
          value: "partial",
          note: "Ręczne zarządzanie, ryzyko pominięcia aktualizacji",
        },
        competitor: {
          value: "partial",
          note: "Podstawowe aktualizacje, często z opóźnieniami",
        },
      },
      {
        name: "Skalowalność zasobów",
        description: "Możliwość łatwego zwiększania zasobów serwera",
        myService: {
          value: "yes",
          note: "Elastyczne skalowanie w górę i w szerz",
        },
        traditional: {
          value: "no",
          note: "Wymaga zakupu i instalacji dodatkowego sprzętu",
        },
        competitor: {
          value: "partial",
          note: "Ograniczone opcje upgrade'u, często z przestojami",
        },
      },
      {
        name: "Czas reakcji na problemy",
        description: "Szybkość rozwiązywania problemów i awarii",
        myService: {
          value: "yes",
          note: "Wsparcie 24/7 z SLA na poziomie minut",
        },
        traditional: {
          value: "partial",
          note: "Zależne od dostępności wewnętrznego zespołu",
        },
        competitor: {
          value: "partial",
          note: "Standardowe wsparcie z czasem reakcji w godzinach",
        },
      },
      {
        name: "Całkowity koszt posiadania",
        description: "Łączne koszty utrzymania w dłuższej perspektywie",
        myService: {
          value: "yes",
          note: "Optymalizacja kosztów i przewidywalne wydatki",
        },
        traditional: {
          value: "no",
          note: "Wysokie koszty sprzętu, personelu i utrzymania",
        },
        competitor: {
          value: "partial",
          note: "Niższe koszty początkowe, ale wyższe w dłuższej perspektywie",
        },
      },
    ],
  },
  monitoring: {
    title: "Porównanie rozwiązań monitoringu",
    competitorLabel: "Gotowe usługi",
    traditionalLabel: "Rozwiązania własne",
    features: [
      {
        name: "Kompleksowy monitoring",
        description:
          "Monitoring infrastruktury, aplikacji i doświadczeń użytkownika",
        myService: {
          value: "yes",
          note: "Wielopoziomowy monitoring z korelacją zdarzeń",
        },
        traditional: {
          value: "partial",
          note: "Często podzielone na oddzielne systemy",
        },
        competitor: {
          value: "partial",
          note: "Ograniczony do wybranych metryk i systemów",
        },
      },
      {
        name: "Alerty predykcyjne",
        description: "Wykrywanie potencjalnych problemów zanim wystąpią",
        myService: {
          value: "yes",
          note: "Zaawansowana analiza trendów i anomalii",
        },
        traditional: {
          value: "no",
          note: "Głównie reaktywne alerty po wystąpieniu problemu",
        },
        competitor: {
          value: "partial",
          note: "Podstawowa analiza trendów bez predykcji",
        },
      },
      {
        name: "Kastomizacja dashboardów",
        description:
          "Możliwość dostosowania widoków do potrzeb różnych zespołów",
        myService: {
          value: "yes",
          note: "Pełna kastomizacja dla różnych ról i potrzeb",
        },
        traditional: {
          value: "partial",
          note: "Wymaga dodatkowego nakładu pracy",
        },
        competitor: {
          value: "partial",
          note: "Ograniczone opcje personalizacji",
        },
      },
      {
        name: "Integracja z narzędziami",
        description:
          "Możliwość integracji z istniejącymi systemami i narzędziami",
        myService: { value: "yes", note: "Bogaty zestaw integracji i API" },
        traditional: {
          value: "partial",
          note: "Wymaga dodatkowego rozwoju i utrzymania",
        },
        competitor: { value: "no", note: "Ograniczone do wybranych partnerów" },
      },
      {
        name: "Automatyczne reagowanie",
        description: "Automatyczne działania naprawcze po wykryciu problemów",
        myService: {
          value: "yes",
          note: "Zaawansowana automatyzacja reakcji na zdarzenia",
        },
        traditional: {
          value: "partial",
          note: "Wymaga dodatkowego oprogramowania i konfiguracji",
        },
        competitor: {
          value: "no",
          note: "Głównie powiadomienia bez automatyzacji",
        },
      },
      {
        name: "Długoterminowa analiza",
        description: "Możliwość analizy danych historycznych i trendów",
        myService: {
          value: "yes",
          note: "Długoterminowe przechowywanie i analiza danych",
        },
        traditional: {
          value: "partial",
          note: "Często ograniczone przez zasoby dyskowe",
        },
        competitor: {
          value: "partial",
          note: "Ograniczony okres retencji w standardowych planach",
        },
      },
    ],
  },
  security: {
    title: "Porównanie rozwiązań bezpieczeństwa",
    competitorLabel: "Standardowe pakiety",
    traditionalLabel: "Podstawowe zabezpieczenia",
    features: [
      {
        name: "Wielowarstwowa ochrona",
        description:
          "Zabezpieczenia na wielu poziomach infrastruktury i aplikacji",
        myService: {
          value: "yes",
          note: "Kompleksowe podejście obejmujące wszystkie warstwy",
        },
        traditional: {
          value: "partial",
          note: "Często skupione na wybranych obszarach",
        },
        competitor: {
          value: "partial",
          note: "Ograniczone do określonych warstw",
        },
      },
      {
        name: "Aktywne monitorowanie zagrożeń",
        description: "Ciągłe wykrywanie i reagowanie na zagrożenia",
        myService: {
          value: "yes",
          note: "Zaawansowane narzędzia z analizą behawioralną",
        },
        traditional: {
          value: "no",
          note: "Ograniczone do okresowych skanów i audytów",
        },
        competitor: {
          value: "partial",
          note: "Podstawowe narzędzia bez zaawansowanej analizy",
        },
      },
      {
        name: "Audyty i testy penetracyjne",
        description: "Regularne sprawdzanie odporności na ataki",
        myService: {
          value: "yes",
          note: "Regularne testy z kompleksowymi raportami",
        },
        traditional: {
          value: "partial",
          note: "Rzadko wykonywane, często tylko po incydentach",
        },
        competitor: {
          value: "no",
          note: "Zwykle jako dodatkowa płatna usługa",
        },
      },
      {
        name: "Ochrona danych wrażliwych",
        description: "Zabezpieczenie i szyfrowanie danych poufnych",
        myService: {
          value: "yes",
          note: "Zaawansowane szyfrowanie i zarządzanie danymi wrażliwymi",
        },
        traditional: {
          value: "partial",
          note: "Podstawowe zabezpieczenia często bez szyfrowania",
        },
        competitor: {
          value: "partial",
          note: "Standardowe rozwiązania bez kastomizacji",
        },
      },
      {
        name: "Zgodność z regulacjami",
        description: "Spełnienie wymogów RODO, ISO27001, itp.",
        myService: {
          value: "yes",
          note: "Pełna zgodność z rozwiązaniami wspierającymi audyt",
        },
        traditional: {
          value: "partial",
          note: "Wymaga znacznych nakładów na dostosowanie",
        },
        competitor: {
          value: "partial",
          note: "Podstawowa zgodność, często bez dowodów",
        },
      },
      {
        name: "Reagowanie na incydenty",
        description:
          "Procedury i narzędzia reagowania na naruszenia bezpieczeństwa",
        myService: {
          value: "yes",
          note: "Kompleksowe procedury i wsparcie 24/7",
        },
        traditional: { value: "no", note: "Często brak formalnych procedur" },
        competitor: {
          value: "partial",
          note: "Podstawowe procedury bez specjalistycznego wsparcia",
        },
      },
    ],
  },
  databases: {
    title: "Porównanie rozwiązań bazodanowych",
    competitorLabel: "Hostowane bazy",
    traditionalLabel: "Lokalne bazy danych",
    features: [
      {
        name: "Wydajność przy dużym obciążeniu",
        description: "Zachowanie wydajności przy wzroście liczby zapytań",
        myService: {
          value: "yes",
          note: "Optymalizacja wydajności na wielu poziomach",
        },
        traditional: {
          value: "partial",
          note: "Ograniczona przez sprzęt i konfigurację",
        },
        competitor: {
          value: "partial",
          note: "Spadek wydajności przy przekroczeniu limitów",
        },
      },
      {
        name: "Automatyczne skalowanie",
        description: "Możliwość automatycznego zwiększania zasobów",
        myService: {
          value: "yes",
          note: "Automatyczne skalowanie w oparciu o obciążenie",
        },
        traditional: {
          value: "no",
          note: "Wymaga ręcznej konfiguracji i przestojów",
        },
        competitor: {
          value: "partial",
          note: "Ograniczone opcje skalowania, często ręczne",
        },
      },
      {
        name: "Optymalizacja zapytań",
        description: "Analiza i optymalizacja wydajności zapytań",
        myService: {
          value: "yes",
          note: "Zaawansowana analiza i rekomendacje optymalizacji",
        },
        traditional: {
          value: "partial",
          note: "Zależna od umiejętności wewnętrznego zespołu",
        },
        competitor: {
          value: "no",
          note: "Ograniczone do podstawowego monitoringu",
        },
      },
      {
        name: "Wysokia dostępność",
        description: "Odporność na awarie i minimalizacja przestojów",
        myService: {
          value: "yes",
          note: "Architektura multi-AZ z automatycznym failover",
        },
        traditional: {
          value: "partial",
          note: "Wymaga dodatkowej konfiguracji i zasobów",
        },
        competitor: {
          value: "partial",
          note: "Często jako płatna opcja premium",
        },
      },
      {
        name: "Bezpieczeństwo danych",
        description: "Ochrona danych przed nieautoryzowanym dostępem",
        myService: {
          value: "yes",
          note: "Wielowarstwowa ochrona i szyfrowanie",
        },
        traditional: {
          value: "partial",
          note: "Wymaga dodatkowej konfiguracji i monitoringu",
        },
        competitor: {
          value: "partial",
          note: "Podstawowe zabezpieczenia bez audytów",
        },
      },
      {
        name: "Automatyczne backupy",
        description: "Regularne kopie zapasowe z prostym odtwarzaniem",
        myService: {
          value: "yes",
          note: "Automatyczne kopie z opcją point-in-time recovery",
        },
        traditional: {
          value: "partial",
          note: "Wymaga dodatkowego oprogramowania i przestrzeni",
        },
        competitor: {
          value: "partial",
          note: "Podstawowe kopie, często bez testów odtwarzania",
        },
      },
    ],
  },
  deployment: {
    title: "Porównanie rozwiązań wdrożeniowych",
    competitorLabel: "Standardowe CI/CD",
    traditionalLabel: "Ręczne wdrożenia",
    features: [
      {
        name: "Pełna automatyzacja",
        description: "Automatyzacja całego procesu od kodu do produkcji",
        myService: {
          value: "yes",
          note: "Kompleksowa automatyzacja z zero-touch deployment",
        },
        traditional: { value: "no", note: "Ręczne kroki i procesy" },
        competitor: {
          value: "partial",
          note: "Częściowa automatyzacja z ręcznymi krokami",
        },
      },
      {
        name: "Wdrożenia zero-downtime",
        description: "Wdrażanie zmian bez przestojów produkcyjnych",
        myService: {
          value: "yes",
          note: "Zaawansowane strategie wdrożeń (blue-green, canary)",
        },
        traditional: {
          value: "no",
          note: "Typowo wymaga okien serwisowych i przestojów",
        },
        competitor: {
          value: "partial",
          note: "Podstawowe mechanizmy, nie zawsze niezawodne",
        },
      },
      {
        name: "Automatyczne testy",
        description: "Kompleksowe testy jako część procesu wdrożenia",
        myService: {
          value: "yes",
          note: "Wielopoziomowe testy (unit, integracyjne, e2e)",
        },
        traditional: {
          value: "partial",
          note: "Często ograniczone lub pomijane",
        },
        competitor: {
          value: "partial",
          note: "Podstawowe testy, często bez automatyzacji",
        },
      },
      {
        name: "Automatyczne rollbacki",
        description: "Automatyczne wycofywanie zmian w przypadku problemów",
        myService: {
          value: "yes",
          note: "Natychmiastowy rollback z pełną automatyzacją",
        },
        traditional: {
          value: "no",
          note: "Ręczne procedury, często skomplikowane",
        },
        competitor: {
          value: "partial",
          note: "Podstawowe mechanizmy, często wymagające interwencji",
        },
      },
      {
        name: "Security w pipeline",
        description: "Automatyczne testy bezpieczeństwa w procesie",
        myService: {
          value: "yes",
          note: "SAST, DAST, skanowanie zależności i kontenerów",
        },
        traditional: {
          value: "no",
          note: "Bezpieczeństwo sprawdzane oddzielnie, jeśli w ogóle",
        },
        competitor: {
          value: "partial",
          note: "Podstawowe skanowanie, często bez integracji",
        },
      },
      {
        name: "Konfigurowalność",
        description: "Możliwość dostosowania procesu do potrzeb projektu",
        myService: {
          value: "yes",
          note: "Pełna konfigurowalność dla różnych typów projektów",
        },
        traditional: {
          value: "partial",
          note: "Własne skrypty, często niestandardowe",
        },
        competitor: {
          value: "no",
          note: "Sztywne procesy z ograniczonymi opcjami",
        },
      },
    ],
  },
  webapps: {
    title: "Porównanie rozwiązań webowych",
    competitorLabel: "Gotowe szablony",
    traditionalLabel: "Tradycyjne strony",
    features: [
      {
        name: "Responsywność mobilna",
        description: "Dostosowanie do różnych urządzeń i rozmiarów ekranu",
        myService: {
          value: "yes",
          note: "Pełna responsywność z mobile-first design",
        },
        traditional: {
          value: "partial",
          note: "Często ograniczona lub wymagająca osobnych wersji",
        },
        competitor: {
          value: "partial",
          note: "Podstawowa responsywność z ograniczeniami",
        },
      },
      {
        name: "Wydajność i szybkość",
        description: "Optymalizacja czasu ładowania i interakcji",
        myService: {
          value: "yes",
          note: "Zaawansowana optymalizacja spełniająca Core Web Vitals",
        },
        traditional: {
          value: "no",
          note: "Często powolna i nieoptymalizowana",
        },
        competitor: {
          value: "partial",
          note: "Ograniczona przez szablon i technologię",
        },
      },
      {
        name: "SEO-friendly",
        description: "Optymalizacja dla wyszukiwarek internetowych",
        myService: {
          value: "yes",
          note: "Kompleksowa optymalizacja SEO od podstaw",
        },
        traditional: {
          value: "partial",
          note: "Podstawowa optymalizacja bez zaawansowanych funkcji",
        },
        competitor: {
          value: "partial",
          note: "Ograniczona przez strukturę szablonu",
        },
      },
      {
        name: "Skalowalność",
        description: "Możliwość obsługi rosnącego ruchu",
        myService: {
          value: "yes",
          note: "Architektura przygotowana na duże obciążenia",
        },
        traditional: {
          value: "no",
          note: "Ograniczona przez hosting i architekturę",
        },
        competitor: {
          value: "partial",
          note: "Zależna od wybranego planu hostingowego",
        },
      },
      {
        name: "Integracje z zewnętrznymi systemami",
        description: "Możliwość łączenia z API i platformami",
        myService: {
          value: "yes",
          note: "Nieograniczona możliwość integracji z dowolnymi systemami",
        },
        traditional: {
          value: "partial",
          note: "Wymaga dodatkowego rozwoju, często ograniczona",
        },
        competitor: {
          value: "partial",
          note: "Ograniczona do wspieranych przez dostawcę",
        },
      },
      {
        name: "Bezpieczeństwo aplikacji",
        description: "Ochrona przed popularnymi atakami (OWASP Top 10)",
        myService: {
          value: "yes",
          note: "Kompleksowe zabezpieczenia i regularne audyty",
        },
        traditional: {
          value: "no",
          note: "Często niestandardowe i niekompletne",
        },
        competitor: {
          value: "partial",
          note: "Podstawowe zabezpieczenia bez testów",
        },
      },
      {
        name: "Łatwość rozwoju",
        description: "Możliwość szybkiego dodawania nowych funkcji",
        myService: {
          value: "yes",
          note: "Modularna architektura ułatwiająca rozwój",
        },
        traditional: {
          value: "partial",
          note: "Często wymaga znacznych zmian",
        },
        competitor: {
          value: "no",
          note: "Ograniczona do funkcji oferowanych przez szablon",
        },
      },
    ],
  },
  architecture: {
    title: "Porównanie usług architektonicznych",
    competitorLabel: "Typowi konsultanci",
    traditionalLabel: "Wewnętrzny zespół",
    features: [
      {
        name: "Podejście całościowe",
        description: "Uwzględnienie wszystkich aspektów systemu",
        myService: {
          value: "yes",
          note: "Holistyczne podejście obejmujące wszystkie warstwy",
        },
        traditional: {
          value: "partial",
          note: "Często skupione na wybranych aspektach",
        },
        competitor: {
          value: "partial",
          note: "Ograniczone doświadczeniem konsultanta",
        },
      },
      {
        name: "Znajomość najnowszych technologii",
        description: "Wykorzystanie nowoczesnych rozwiązań i wzorców",
        myService: {
          value: "yes",
          note: "Ciągłe śledzenie i stosowanie najnowszych podejść",
        },
        traditional: {
          value: "partial",
          note: "Ograniczona przez bieżące projekty i czas",
        },
        competitor: {
          value: "partial",
          note: "Często ograniczona do wąskiej specjalizacji",
        },
      },
      {
        name: "Perspektywa zewnętrzna",
        description:
          "Obiektywne spojrzenie z doświadczeniem z różnych projektów",
        myService: {
          value: "yes",
          note: "Bogate doświadczenie z różnych branż i kontekstów",
        },
        traditional: { value: "no", note: "Brak zewnętrznej perspektywy" },
        competitor: {
          value: "partial",
          note: "Ograniczone przez specjalizację branżową",
        },
      },
      {
        name: "Skalowalność architektury",
        description: "Projekt przygotowany na przyszły wzrost",
        myService: {
          value: "yes",
          note: "Architektura projektowana z myślą o skalowalności",
        },
        traditional: {
          value: "partial",
          note: "Często skupiona na bieżących potrzebach",
        },
        competitor: {
          value: "partial",
          note: "Zależna od doświadczenia konsultanta",
        },
      },
      {
        name: "Dokumentacja i transfer wiedzy",
        description: "Przekazanie kompleksowej dokumentacji i wiedzy",
        myService: {
          value: "yes",
          note: "Szczegółowa dokumentacja i warsztaty przekazania wiedzy",
        },
        traditional: {
          value: "partial",
          note: "Często niekompletna lub nieaktualna",
        },
        competitor: { value: "partial", note: "Zależna od zakresu kontraktu" },
      },
      {
        name: "Koszty długoterminowe",
        description: "Optymalizacja całkowitego kosztu posiadania",
        myService: {
          value: "yes",
          note: "Projektowanie z myślą o TCO i długoterminowej wartości",
        },
        traditional: {
          value: "partial",
          note: "Często skupienie na krótkoterminowych celach",
        },
        competitor: {
          value: "no",
          note: "Skupienie na szybkim dostarczeniu projektu",
        },
      },
    ],
  },
};

// Domyślne porównanie do użycia, jeśli nie znajdzie usługi
const defaultComparison = servicesComparison.infrastructure;

const ServiceComparisonTable: React.FC<{
  serviceId: string;
  primaryColor: string;
}> = ({ serviceId, primaryColor }) => {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  // Pobierz dane porównawcze dla wskazanej usługi lub użyj domyślnych
  const comparisonData = servicesComparison[serviceId] || defaultComparison;

  // Funkcja renderująca wskaźnik wartości (tak, nie, częściowo)
  const renderValueIndicator = (
    value: "yes" | "no" | "partial",
    highlight = false
  ) => {
    switch (value) {
      case "yes":
        return (
          <span
            className={`flex justify-center items-center ${
              highlight ? `text-${primaryColor}-400` : "text-green-400"
            }`}
          >
            <Check className="w-5 h-5" />
          </span>
        );
      case "no":
        return (
          <span className="flex justify-center items-center text-red-400">
            <X className="w-5 h-5" />
          </span>
        );
      case "partial":
        return (
          <span className="flex justify-center items-center text-yellow-400">
            <AlertTriangle className="w-5 h-5" />
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div ref={sectionRef}>
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
        <div className="p-6">
          <h3 className="text-xl font-bold mb-6">
            <GradientText from={primaryColor} to={primaryColor}>
              {comparisonData.title}
            </GradientText>
          </h3>

          {/* Tabela porównawcza */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="py-3 px-4 text-left">Funkcja / Cecha</th>
                  <th className="py-3 px-4 text-center">
                    <span className={`text-${primaryColor}-400 font-semibold`}>
                      Moja usługa
                    </span>
                  </th>
                  <th className="py-3 px-4 text-center">
                    {comparisonData.traditionalLabel}
                  </th>
                  <th className="py-3 px-4 text-center">
                    {comparisonData.competitorLabel}
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.features.map((feature, index) => {
                  const isSelected = selectedFeature === feature.name;

                  return (
                    <motion.tr
                      key={feature.name}
                      className={`border-b border-gray-800 hover:bg-gray-800/30 cursor-pointer ${
                        isSelected ? `bg-${primaryColor}-900/20` : ""
                      }`}
                      onClick={() =>
                        setSelectedFeature(isSelected ? null : feature.name)
                      }
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                    >
                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          <span className="font-medium">{feature.name}</span>
                          <span className="text-sm text-gray-400">
                            {feature.description}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <HoverCard
                          hoverContent={feature.myService.note}
                          position="top"
                          offset={10}
                          animation="fade"
                          width={200}
                        >
                          <div
                            className={`w-full flex justify-center ${
                              isSelected
                                ? `bg-${primaryColor}-900/40 rounded-lg py-1`
                                : ""
                            }`}
                          >
                            {renderValueIndicator(
                              feature.myService.value,
                              true
                            )}
                          </div>
                        </HoverCard>
                      </td>
                      <td className="py-3 px-4">
                        <HoverCard
                          hoverContent={feature.traditional.note}
                          position="top"
                          offset={10}
                          animation="fade"
                          width={200}
                        >
                          <div className="w-full flex justify-center">
                            {renderValueIndicator(feature.traditional.value)}
                          </div>
                        </HoverCard>
                      </td>
                      <td className="py-3 px-4">
                        <HoverCard
                          hoverContent={feature.competitor.note}
                          position="top"
                          offset={10}
                          animation="fade"
                          width={200}
                        >
                          <div className="w-full flex justify-center">
                            {renderValueIndicator(feature.competitor.value)}
                          </div>
                        </HoverCard>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Legenda */}
          <div className="mt-6 flex flex-wrap gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Check className={`w-4 h-4 text-${primaryColor}-400`} />
              <span>W pełni wspierane</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
              <span>Częściowo wspierane</span>
            </div>
            <div className="flex items-center gap-2">
              <X className="w-4 h-4 text-red-400" />
              <span>Niewspierane</span>
            </div>
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-gray-500" />
              <span>Najedź kursorem, aby zobaczyć szczegóły</span>
            </div>
          </div>

          {/* Szczegółowe porównanie wybranej funkcji */}
          {selectedFeature && (
            <motion.div
              className={`mt-6 p-4 bg-${primaryColor}-900/10 border border-${primaryColor}-500/20 rounded-lg`}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h4 className="font-bold mb-2">
                {
                  comparisonData.features.find(
                    (f) => f.name === selectedFeature
                  )?.name
                }
              </h4>

              <div className="grid md:grid-cols-3 gap-4 mt-4">
                <div
                  className={`p-3 rounded-lg bg-${primaryColor}-900/20 border border-${primaryColor}-500/20`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className={`font-medium text-${primaryColor}-400`}>
                      Moja usługa
                    </span>
                    {renderValueIndicator(
                      comparisonData.features.find(
                        (f) => f.name === selectedFeature
                      )?.myService.value || "partial",
                      true
                    )}
                  </div>
                  <p className="text-sm text-gray-300">
                    {
                      comparisonData.features.find(
                        (f) => f.name === selectedFeature
                      )?.myService.note
                    }
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-gray-800/40 border border-gray-700/30">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-300">
                      {comparisonData.traditionalLabel}
                    </span>
                    {renderValueIndicator(
                      comparisonData.features.find(
                        (f) => f.name === selectedFeature
                      )?.traditional.value || "partial"
                    )}
                  </div>
                  <p className="text-sm text-gray-400">
                    {
                      comparisonData.features.find(
                        (f) => f.name === selectedFeature
                      )?.traditional.note
                    }
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-gray-800/40 border border-gray-700/30">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-300">
                      {comparisonData.competitorLabel}
                    </span>
                    {renderValueIndicator(
                      comparisonData.features.find(
                        (f) => f.name === selectedFeature
                      )?.competitor.value || "partial"
                    )}
                  </div>
                  <p className="text-sm text-gray-400">
                    {
                      comparisonData.features.find(
                        (f) => f.name === selectedFeature
                      )?.competitor.note
                    }
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </Card3D>
    </div>
  );
};

export default ServiceComparisonTable;
