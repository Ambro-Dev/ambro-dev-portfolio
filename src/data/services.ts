// src/data/services.ts
import {
	Server,
	Shield,
	Cloud,
	Database,
	Cog,
	Users,
	BarChart,
	Code,
	Github,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface ServiceCategory {
	id: string;
	title: string;
	description: string;
	longDescription: string;
	icon: LucideIcon;
	color: string;
	tags: string[];
	bulletPoints: string[];
}

// Service categories data
export const serviceCategories: ServiceCategory[] = [
	{
		id: "servers",
		title: "Administracja Serwerami",
		description:
			"Zarządzanie infrastrukturą serwerową z wykorzystaniem najlepszych praktyk DevOps.",
		longDescription:
			"Kompleksowe zarządzanie serwerami, w tym instalacja, konfiguracja, monitoring, utrzymanie i optymalizacja. Wykorzystuję zaawansowane narzędzia automatyzacji jak Ansible, Puppet i Chef, aby zapewnić spójność i niezawodność infrastruktury.",
		icon: Server,
		color: "from-blue-500/60 to-blue-400/60",
		tags: ["Linux", "Windows", "Ansible", "Monitoring", "Automatyzacja"],
		bulletPoints: [
			"Konfiguracja serwerów pocztowych, webowych i baz danych",
			"Automatyzacja zadań administracyjnych z wykorzystaniem skryptów",
			"Monitoring wydajności i dostępności usług 24/7",
			"Zarządzanie backupami i strategiami disaster recovery",
			"Wdrażanie bezpiecznych praktyk i polityk serwera",
		],
	},
	{
		id: "security",
		title: "Bezpieczeństwo Systemów",
		description:
			"Ochrona infrastruktury IT przed zagrożeniami z wykorzystaniem zaawansowanych rozwiązań.",
		longDescription:
			"Kompleksowe podejście do bezpieczeństwa systemów informatycznych, obejmujące analizę zagrożeń, wdrażanie zabezpieczeń oraz reagowanie na incydenty. Specjalizuję się w rozwiązaniach Fortinet i wdrażaniu wielowarstwowych strategii ochrony.",
		icon: Shield,
		color: "from-rose-500/60 to-rose-400/60",
		tags: ["Firewall", "VPN", "WAF", "IDS/IPS", "Security Audit"],
		bulletPoints: [
			"Konfiguracja i zarządzanie urządzeniami Fortinet FortiGate",
			"Implementacja wielowarstwowych strategii bezpieczeństwa",
			"Regularne audyty bezpieczeństwa i testy penetracyjne",
			"Wykrywanie i reagowanie na incydenty bezpieczeństwa",
			"Szyfrowanie danych i bezpieczna komunikacja w sieci",
		],
	},
	{
		id: "cloud",
		title: "Chmurowe Wdrożenia",
		description:
			"Projektowanie i implementacja nowoczesnych rozwiązań chmurowych dla biznesu.",
		longDescription:
			"Kompleksowe rozwiązania chmurowe wykorzystujące platformy AWS, Azure i Google Cloud. Projektuję architektury chmurowe z myślą o skalowalności, niezawodności i optymalizacji kosztów, stosując podejście Infrastructure as Code.",
		icon: Cloud,
		color: "from-indigo-500/60 to-indigo-400/60",
		tags: ["AWS", "Azure", "Google Cloud", "IaC", "Serverless"],
		bulletPoints: [
			"Migracja on-premise do chmury z minimalnym przestojem",
			"Projektowanie architektury multi-cloud i hybrid-cloud",
			"Wdrażanie infrastruktury jako kodu (Terraform, CloudFormation)",
			"Optymalizacja kosztów i wydajności usług chmurowych",
			"Automatyczne skalowanie i zarządzanie zasobami",
		],
	},
	{
		id: "databases",
		title: "Utrzymanie Baz Danych",
		description:
			"Optymalizacja wydajności i niezawodności systemów bazodanowych.",
		longDescription:
			"Profesjonalna administracja systemami bazodanowymi, obejmująca instalację, konfigurację, monitoring, optymalizację wydajności i bezpieczeństwo. Specjalizuję się zarówno w relacyjnych jak i nierelacyjnych bazach danych.",
		icon: Database,
		color: "from-emerald-500/60 to-emerald-400/60",
		tags: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "High Availability"],
		bulletPoints: [
			"Projektowanie i implementacja architektury baz danych",
			"Optymalizacja zapytań i indeksów dla maksymalnej wydajności",
			"Konfiguracja replikacji i klastrowania dla wysokiej dostępności",
			"Automatyczne backupy i procedury odtwarzania",
			"Migracja i upgrade baz danych bez utraty danych",
		],
	},
	{
		id: "automation",
		title: "Automatyzacja Procesów IT",
		description:
			"Transformacja ręcznych procesów w zautomatyzowane, efektywne rozwiązania.",
		longDescription:
			"Automatyzacja procesów IT z wykorzystaniem najnowszych narzędzi i technologii, skutkująca redukcją błędów ludzkich, przyspieszeniem wdrożeń i zwiększeniem efektywności operacyjnej zespołów deweloperskich i operacyjnych.",
		icon: Cog,
		color: "from-amber-500/60 to-amber-400/60",
		tags: ["CI/CD", "Jenkins", "GitHub Actions", "GitLab CI", "Skrypty"],
		bulletPoints: [
			"Implementacja potoku CI/CD dla ciągłej integracji i wdrażania",
			"Automatyzacja testów i walidacji kodu",
			"Orkiestracja kontenerów z Kubernetes",
			"Skrypty automatyzacji powwtarzalnych zadań",
			"Automatyczne skalowanie infrastruktury na podstawie obciążenia",
		],
	},
	{
		id: "support",
		title: "Wsparcie Techniczne",
		description:
			"Kompleksowe wsparcie IT dla użytkowników i systemów na wszystkich poziomach.",
		longDescription:
			"Profesjonalne wsparcie techniczne dostosowane do potrzeb klienta, od pomocy użytkownikom końcowym, przez rozwiązywanie złożonych problemów systemowych, aż po zarządzanie infrastrukturą. Oferuję elastyczne modele wsparcia z gwarantowanym SLA.",
		icon: Users,
		color: "from-sky-500/60 to-sky-400/60",
		tags: ["Helpdesk", "Service Desk", "Remote Support", "SLA", "Konsultacje"],
		bulletPoints: [
			"Wsparcie pierwszej i drugiej linii dla użytkowników",
			"Rozwiązywanie złożonych problemów technicznych",
			"Dokumentacja procedur i wiedzy technicznej",
			"Proaktywny monitoring i zapobieganie problemom",
			"Szkolenia i warsztaty techniczne dla zespołów",
		],
	},
	{
		id: "monitoring",
		title: "Monitorowanie Systemów",
		description:
			"Kompleksowe rozwiązania monitoringu zapewniające ciągłość działania systemów.",
		longDescription:
			"Zaawansowane systemy monitoringu infrastruktury IT, aplikacji i usług, zapewniające wczesne wykrywanie problemów, analizę wydajności i alarmowanie o potencjalnych zagrożeniach. Wykorzystuję narzędzia takie jak Zabbix, Grafana, Prometheus i ELK Stack.",
		icon: BarChart,
		color: "from-cyan-500/60 to-cyan-400/60",
		tags: ["Zabbix", "Grafana", "Prometheus", "ELK Stack", "Alerting"],
		bulletPoints: [
			"Monitorowanie dostępności i wydajności systemów 24/7",
			"Konfiguracja dashboardów i wizualizacji metryk",
			"Ustawienie inteligentnych alertów i powiadomień",
			"Analiza trendów i przewidywanie problemów",
			"Monitorowanie doświadczeń użytkownika końcowego",
		],
	},
	{
		id: "webapps",
		title: "Aplikacje Webowe",
		description:
			"Tworzenie nowoczesnych, wydajnych i skalowalnych aplikacji internetowych.",
		longDescription:
			"Projektowanie i rozwijanie zaawansowanych aplikacji webowych z wykorzystaniem najnowszych technologii frontendowych i backendowych. Tworzę rozwiązania dostosowane do potrzeb biznesowych, z naciskiem na wydajność, bezpieczeństwo i doświadczenie użytkownika.",
		icon: Code,
		color: "from-violet-500/60 to-violet-400/60",
		tags: ["React", "Node.js", "Next.js", "TypeScript", "REST API"],
		bulletPoints: [
			"Tworzenie responsywnych interfejsów użytkownika",
			"Implementacja API i mikroserwisów",
			"Optymalizacja wydajności aplikacji webowych",
			"Integracja z zewnętrznymi systemami i API",
			"Wdrażanie najlepszych praktyk bezpieczeństwa aplikacji",
		],
	},
	{
		id: "architecture",
		title: "Projektowanie Architektury IT",
		description:
			"Projektowanie skalowalnych, niezawodnych i bezpiecznych systemów informatycznych.",
		longDescription:
			"Kompleksowe projektowanie architektury systemów IT z naciskiem na skalowalność, niezawodność, bezpieczeństwo i efektywność kosztową. Tworzę rozwiązania dostosowane do specyficznych wymagań biznesowych, z myślą o przyszłym rozwoju.",
		icon: Github,
		color: "from-slate-500/60 to-slate-400/60",
		tags: [
			"System Design",
			"Microservices",
			"High Availability",
			"Scalability",
			"Documentation",
		],
		bulletPoints: [
			"Projektowanie architektury dla systemów wysokiej dostępności",
			"Tworzenie dokumentacji technicznej i diagramów architektury",
			"Planowanie strategii disaster recovery i business continuity",
			"Optymalizacja kosztów utrzymania infrastruktury",
			"Doradztwo w zakresie wyboru technologii i narzędzi",
		],
	},
];
