import { NextResponse, type NextRequest } from "next/server";
/*import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

// Wspierane lokalizacje
const locales = ["pl"];
const defaultLocale = "pl";

// Funkcja pomocnicza do wykrywania lokalizacji
function getLocale(request: NextRequest) {
	// Negotiator expects standard node request object, so we need to adapt
	const headers = Object.fromEntries(request.headers);
	const negotiator = new Negotiator({ headers });
	const languages = negotiator.languages();

	try {
		return matchLocale(languages, locales, defaultLocale);
	} catch (e) {
		return defaultLocale;
	}
}
*/
export async function middleware(request: NextRequest) {
	const { nextUrl, headers } = request;
	const pathname = nextUrl.pathname;

	// Nowe w Next.js 15 - sprawdzanie czy Page Router czy App Router
	const isAppRoute =
		/^\/(_.+|favicon\.ico|api|trpc|images|fonts|icons|manifest\.json|robots\.txt|sitemap\.xml)($|\/)/.test(
			pathname,
		);

	// Przygotuj odpowiedź i modyfikuj nagłówki
	const response = NextResponse.next();

	// Dodaj dodatkowe nagłówki bezpieczeństwa
	response.headers.set("X-DNS-Prefetch-Control", "on");
	response.headers.set(
		"Strict-Transport-Security",
		"max-age=63072000; includeSubDomains; preload",
	);
	response.headers.set("X-XSS-Protection", "1; mode=block");
	response.headers.set("X-Frame-Options", "SAMEORIGIN");
	response.headers.set("X-Content-Type-Options", "nosniff");
	response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

	// Jeśli to nie jest trasa App Router lub specjalny zasób, kończymy
	if (isAppRoute) {
		return response;
	}

	// Automatyczne blokowanie botów
	const userAgent = request.headers.get("user-agent") || "";
	const isBadBot =
		/bot|crawl|spider|scrape|scan/i.test(userAgent) &&
		!/google|bing|yandex|baidu|duckduck|yahoo/i.test(userAgent);

	if (isBadBot) {
		return new NextResponse("Bot Access Forbidden", { status: 403 });
	}

	// Przekierowanie starych URL do nowych (przykład)
	if (pathname.startsWith("/old-path")) {
		const newPath = pathname.replace("/old-path", "/nowa-sciezka");
		return NextResponse.redirect(new URL(newPath, request.url), 301);
	}

	// Optymalizacja dla przeglądania mobilnego
	const isMobile =
		userAgent.includes("Mobi") || headers.get("sec-ch-ua-mobile") === "?1";
	if (isMobile) {
		response.headers.set("Save-Data", "on");
	}

	// Dodaj niestandardowe nagłówki
	response.headers.set("X-Ambro-Dev", "true");

	// Sprawdź kraj użytkownika (opcjonalnie)
	const country =
		(request as NextRequest & { geo?: { country?: string } }).geo?.country ||
		"PL";
	response.headers.set("X-Country", country);

	return response;
}

// Skonfiguruj ścieżki dla middleware
export const config = {
	matcher: [
		/*
		 * Dopasuj wszystkie ścieżki z wyjątkiem:
		 * 1. /api (trasy API)
		 * 2. /_next (zasoby Next.js)
		 * 3. /_vercel (zasoby wewnętrzne)
		 * 4. /(.*) dane statyczne (zasoby)
		 */
		"/((?!api|_next|_vercel|.*\\..*).*)",
	],
};
