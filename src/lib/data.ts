// Funkcje do pobierania danych dla Server Components
// Kompatybilne z Next.js 15 Partial Prerendering

import { cache } from "react";

/**
 * Typy danych dla projektów
 */
export interface Project {
	title: string;
	description: string;
	technologies: string[];
	image: string;
	color: string;
	slug: string;
}

/**
 * Typy danych dla opinii
 */
export interface Testimonial {
	quote: string;
	author: string;
	position: string;
	image: string;
	company: string;
}

/**
 * Pobieranie projektów z opcjonalną możliwością cache'owania
 * Zoptymalizowane pod Next.js 15 Server Components
 */
export const getProjects = cache(async (): Promise<Project[]> => {
	// W rzeczywistej aplikacji to miejsce do pobrania danych z CMS/API
	// Symulacja opóźnienia dla demonstracji PPR
	await new Promise((resolve) => setTimeout(resolve, 300));

	return [
		{
			title: "Platforma monitoringu",
			description:
				"Kompleksowy system monitoringu infrastruktury IT z alertami w czasie rzeczywistym, analizą wydajności i dashboardami dla różnych zespołów.",
			technologies: ["Zabbix", "Grafana", "Prometheus", "Docker", "Ansible"],
			image: "/images/projects/monitoring-platform.webp",
			color: "from-cyan-500 to-blue-600",
			slug: "platforma-monitoringu",
		},
		{
			title: "Migracja do chmury",
			description:
				"Kompleksowa migracja infrastruktury on-premise do środowiska AWS z zachowaniem ciągłości działania i optymalizacją kosztów.",
			technologies: ["AWS", "Terraform", "CloudFormation", "Docker", "CI/CD"],
			image: "/images/projects/cloud-migration.webp",
			color: "from-indigo-500 to-purple-600",
			slug: "migracja-do-chmury",
		},
		{
			title: "System zarządzania zasobami",
			description:
				"Aplikacja webowa do zarządzania zasobami IT firmy, integrująca informacje o sprzęcie, oprogramowaniu i licencjach.",
			technologies: ["React", "Node.js", "MongoDB", "TypeScript", "WebSocket"],
			image: "/images/projects/resource-management.webp",
			color: "from-violet-500 to-pink-600",
			slug: "system-zarzadzania-zasobami",
		},
	];
});

/**
 * Pobieranie opinii klientów z opcjonalną możliwością cache'owania
 * Zoptymalizowane pod Next.js 15 Server Components
 */
export const getTestimonials = cache(async (): Promise<Testimonial[]> => {
	// W rzeczywistej aplikacji to miejsce do pobrania danych z CMS/API
	// Symulacja opóźnienia dla demonstracji PPR
	await new Promise((resolve) => setTimeout(resolve, 500));

	return [
		{
			quote:
				"Ambro-Dev przeprowadził migrację naszej infrastruktury do chmury AWS, znacząco poprawiając wydajność i zmniejszając koszty operacyjne.",
			author: "Tomasz Nowicki",
			position: "CTO, TechFirma Polska",
			image: "/images/testimonials/tomasz-nowicki.webp",
			company: "TechFirma Polska",
		},
		{
			quote:
				"Wdrożenie systemu monitoringu i alertowania pozwoliło nam wykryć i rozwiązać problemy zanim wpłynęły na nasz biznes. Profesjonalizm i wiedza na najwyższym poziomie.",
			author: "Anna Kowalska",
			position: "IT Manager, E-commerce Plus",
			image: "/images/testimonials/anna-kowalska.webp",
			company: "E-commerce Plus",
		},
		{
			quote:
				"Ambro-Dev nie tylko zrealizował projekt aplikacji webowej, ale także zoptymalizował naszą infrastrukturę, co przełożyło się na znacznie lepsze doświadczenia użytkowników.",
			author: "Marcin Zawadzki",
			position: "CEO, StartupTech",
			image: "/images/testimonials/marcin-zawadzki.webp",
			company: "StartupTech",
		},
		{
			quote:
				"Automatyzacja procesów IT, którą dla nas wdrożył, pozwoliła zaoszczędzić dziesiątki godzin pracy zespołu technicznego miesięcznie. Doskonała inwestycja.",
			author: "Karolina Jankowska",
			position: "COO, Digital Solutions",
			image: "/images/testimonials/karolina-jankowska.webp",
			company: "Digital Solutions",
		},
		{
			quote:
				"Profesjonalne podejście, terminowość i doskonała komunikacja. Ambro-Dev rozumie nie tylko technologię, ale także nasze potrzeby biznesowe.",
			author: "Piotr Adamski",
			position: "Founder, EdTech Platform",
			image: "/images/testimonials/piotr-adamski.webp",
			company: "EdTech Platform",
		},
		{
			quote:
				"Wdrożenie CI/CD i containeryzacja naszych aplikacji znacząco przyspieszyły nasz proces rozwoju oprogramowania. Mogę z czystym sumieniem polecić te usługi.",
			author: "Magdalena Wiśniewska",
			position: "VP Engineering, SoftwareLab",
			image: "/images/testimonials/magdalena-wisniewska.webp",
			company: "SoftwareLab",
		},
	];
});

/**
 * Funkcja pomocnicza do pobierania wszystkich niezbędnych danych strony
 */
export async function getPageData() {
	const [projects, testimonials] = await Promise.all([
		getProjects(),
		getTestimonials(),
	]);

	return {
		projects,
		testimonials,
	};
}
