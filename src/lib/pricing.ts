// src/app/cennik/data.ts

// Typy danych dla pakietów cenowych
export interface PricingPlan {
	id: string;
	name: string;
	description: string;
	price: string;
	period: string;
	or: string;
	color: string;
	features: string[];
	bestFor: string[];
	highlighted: boolean;
}

// Typy danych dla usług z indywidualną wyceną
export interface CustomPricingService {
	id: string;
	name: string;
	description: string;
	pricingModel: string;
	estimatedRange: string;
	factors: string[];
	icon: string;
	color: string;
}

// Typy danych dla FAQ
export interface FAQ {
	question: string;
	answer: string;
}

// Dane pakietów cenowych
export const pricingPlans: PricingPlan[] = [
	{
		id: "basic",
		name: "Basic",
		description: "Podstawowe rozwiązania dla małych firm i startupów",
		price: "od 2 000 zł",
		period: "miesięcznie",
		or: "od 250 zł/h",
		color: "from-blue-500 to-indigo-600",
		features: [
			"Zdalna administracja serwerami",
			"Podstawowe monitorowanie systemów",
			"Automatyczne kopie zapasowe",
			"Wsparcie email i telefoniczne",
			"Czas reakcji do 24h",
			"Podstawowe aktualizacje zabezpieczeń",
		],
		bestFor: ["Startupy", "Małe firmy", "Indywidualni przedsiębiorcy"],
		highlighted: false,
	},
	{
		id: "standard",
		name: "Standard",
		description: "Kompleksowe rozwiązania dla średnich firm",
		price: "od 5 000 zł",
		period: "miesięcznie",
		or: "od 220 zł/h",
		color: "from-purple-500 to-indigo-600",
		features: [
			"Wszystko z planu Basic",
			"Zaawansowany monitoring 24/7",
			"Regularne audyty bezpieczeństwa",
			"Zarządzanie infrastrukturą chmurową",
			"Wdrażanie ciągłej integracji (CI/CD)",
			"Czas reakcji do 8h",
			"Miesięczne raporty wydajności",
		],
		bestFor: ["Średnie firmy", "E-commerce", "Firmy SaaS"],
		highlighted: true,
	},
	{
		id: "premium",
		name: "Premium",
		description: "Zaawansowane rozwiązania dla dużych organizacji",
		price: "od 10 000 zł",
		period: "miesięcznie",
		or: "od 200 zł/h",
		color: "from-pink-500 to-purple-600",
		features: [
			"Wszystko z planu Standard",
			"Dedykowany inżynier DevOps",
			"Architektura wysokiej dostępności",
			"Automatyzacja procesów biznesowych",
			"Zaawansowane zarządzanie bezpieczeństwem",
			"Czas reakcji do 2h",
			"Priorytetowe wsparcie 24/7",
			"Kwartalne przeglądy architektury",
		],
		bestFor: ["Duże organizacje", "Korporacje", "Aplikacje krytyczne"],
		highlighted: false,
	},
];

// Dane usług z indywidualną wyceną
export const customPricingServices: CustomPricingService[] = [
	{
		id: "webapps",
		name: "Aplikacje Webowe",
		description:
			"Tworzenie nowoczesnych aplikacji internetowych dopasowanych do potrzeb biznesowych.",
		pricingModel: "Wycena projektowa lub stawka godzinowa",
		estimatedRange: "8 000 - 50 000 zł",
		factors: [
			"Złożoność funkcjonalności",
			"Skala projektu",
			"Wymagania UX/UI",
			"Integracje z zewnętrznymi systemami",
			"Wymagana wydajność i skalowalność",
		],
		icon: "webapps",
		color: "from-violet-500/60 to-violet-400/60",
	},
	{
		id: "cloud",
		name: "Wdrożenia Chmurowe",
		description: "Kompleksowa migracja i wdrożenie infrastruktury w chmurze.",
		pricingModel: "Wycena projektowa",
		estimatedRange: "15 000 - 100 000 zł",
		factors: [
			"Wielkość istniejącej infrastruktury",
			"Wybrana platforma chmurowa",
			"Złożoność migracji danych",
			"Wymagania dostępności i redundancji",
			"Poziom automatyzacji",
		],
		icon: "cloud",
		color: "from-indigo-500/60 to-indigo-400/60",
	},
	{
		id: "security",
		name: "Audyt i Implementacja Bezpieczeństwa",
		description:
			"Kompleksowy audyt i wdrożenie zabezpieczeń infrastruktury IT.",
		pricingModel: "Wycena projektowa lub abonament",
		estimatedRange: "5 000 - 30 000 zł",
		factors: [
			"Zakres audytu",
			"Wielkość infrastruktury",
			"Poziom wymaganych zabezpieczeń",
			"Liczba systemów do zabezpieczenia",
			"Regularna analiza i monitorowanie",
		],
		icon: "security",
		color: "from-rose-500/60 to-rose-400/60",
	},
	{
		id: "architecture",
		name: "Projektowanie Architektury IT",
		description:
			"Profesjonalne projektowanie architektury systemów informatycznych.",
		pricingModel: "Wycena projektowa lub stawka dzienna",
		estimatedRange: "10 000 - 80 000 zł",
		factors: [
			"Złożoność systemu",
			"Wymagania skalowalności",
			"Poziom dokumentacji",
			"Konsultacje i warsztaty z zespołem",
			"Długoterminowe wsparcie architektoniczne",
		],
		icon: "architecture",
		color: "from-slate-500/60 to-slate-400/60",
	},
];

// FAQ
export const pricingFAQ: FAQ[] = [
	{
		question: "Jakie są dostępne metody płatności?",
		answer:
			"Akceptuję płatności przelewem bankowym oraz przez PayPal. Dla stałych klientów możliwe jest ustalenie indywidualnych warunków płatności, takich jak rozliczenia miesięczne, kwartalne lub projektowe.",
	},
	{
		question: "Czy oferujesz umowy SLA (Service Level Agreement)?",
		answer:
			"Tak, dla wszystkich pakietów oferuję umowy SLA określające gwarantowany poziom usług, czas reakcji oraz dostępność. Warunki SLA są dostosowane do wybranego pakietu, a dla indywidualnych projektów możemy ustalić niestandardowe warunki.",
	},
	{
		question: "Jak wygląda proces ustalania indywidualnej wyceny?",
		answer:
			"Proces rozpoczyna się od konsultacji, podczas której omówimy Twoje potrzeby i oczekiwania. Następnie przygotowuję szczegółową ofertę z wyceną, harmonogramem realizacji i zakresem prac. Po akceptacji oferty podpisujemy umowę i rozpoczynamy współpracę.",
	},
	{
		question: "Czy możliwa jest zmiana pakietu w trakcie współpracy?",
		answer:
			"Tak, istnieje możliwość zmiany pakietu w trakcie współpracy. Zmiany są wprowadzane zazwyczaj od początku następnego okresu rozliczeniowego. Jeśli Twoje potrzeby wzrosną lub zmniejszą się, możemy elastycznie dostosować zakres usług.",
	},
	{
		question: "Jakie są koszty dodatkowych usług poza pakietem?",
		answer:
			"Usługi wykraczające poza zakres wybranego pakietu są rozliczane według stawki godzinowej lub projektowej, zależnie od charakteru prac. Przed rozpoczęciem dodatkowych prac zawsze przedstawiam szacunkowy koszt do akceptacji.",
	},
	{
		question: "Czy oferujesz zniżki dla długoterminowej współpracy?",
		answer:
			"Tak, dla klientów decydujących się na długoterminową współpracę (np. umowa roczna) oferuję atrakcyjne rabaty. Dodatkowo, stali klienci mogą liczyć na preferencyjne stawki przy rozszerzaniu zakresu usług.",
	},
];
