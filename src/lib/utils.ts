"use client";

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { useOptimistic } from "react"; // Nowe hooki Next.js 15

/**
 * Narzędzie do łączenia klas CSS
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Formatowanie daty w sposób przyjazny dla użytkownika
 */
export function formatDate(input: string | number | Date): string {
	const date = new Date(input);
	return date.toLocaleDateString("pl-PL", {
		day: "numeric",
		month: "long",
		year: "numeric",
	});
}

/**
 * Optymistyczne aktualizacje UI dla Server Actions (nowa funkcja Next.js 15)
 * Pozwala na natychmiastową aktualizację UI przed zakończeniem akcji serwera
 */
export function useOptimisticFormSubmit<T extends Record<string, unknown>>(
	initialState: T,
) {
	// Wykorzystanie useOptimistic z Next.js 15
	const [optimisticState, addOptimistic] = useOptimistic(
		initialState,
		(state, formData: FormData) => {
			// Create a type-safe copy
			const newState = { ...state };

			// Przetworzenie danych formularza do stanu
			for (const [key, value] of formData.entries()) {
				// Check if key exists in state and is a valid string key
				if (typeof key === "string" && key in newState) {
					// Convert FormData values to appropriate types based on existing state
					const currentValue = state[key as keyof T];
					let typedValue: unknown;

					// Type conversion based on current value type
					if (typeof currentValue === "number") {
						typedValue = Number(value);
					} else if (typeof currentValue === "boolean") {
						typedValue = value === "true";
					} else {
						// For strings and other types, use as is
						typedValue = value;
					}

					// Now assign the properly typed value
					newState[key as keyof T] = typedValue as T[keyof T];
				}
			}

			return newState;
		},
	);

	return {
		optimisticState,
		addOptimistic,
	};
}

/**
 * Konwersja relatywnych URL do absolutnych
 */
export function absoluteUrl(path: string): string {
	return `${process.env.NEXT_PUBLIC_SITE_URL || "https://ambro.dev"}${path}`;
}

/**
 * Maskowanie adresu email dla prywatności
 */
export function maskEmail(email: string): string {
	const [name, domain] = email.split("@");
	return `${name.substring(0, 3)}***@${domain}`;
}

/**
 * Funkcja pomocnicza do opóźnienia (używana w demach)
 */
export async function delay(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Generowanie unikalnego ID
 */
export function generateId(): string {
	return Math.random().toString(36).substring(2, 9);
}

/**
 * Konwertuje string na slug URL (dla SEO)
 */
export function slugify(text: string): string {
	return (
		text
			.toString()
			.normalize("NFD")
			// Replace the problematic regex with a safer alternative
			.replace(/\p{Diacritic}/gu, "")
			.toLowerCase()
			.trim()
			.replace(/\s+/g, "-")
			.replace(/[^\w-]+/g, "")
			.replace(/--+/g, "-")
	);
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
	if (text.length <= maxLength) return text;
	return `${text.slice(0, maxLength)}…`;
}

/**
 * Pobieranie optymalnego rozmiaru obrazu dla device pixel ratio
 */
export function getOptimalImageSize(
	baseWidth: number,
	devicePixelRatio = typeof window !== "undefined"
		? window.devicePixelRatio
		: 1,
): number {
	return Math.round(baseWidth * Math.min(devicePixelRatio, 3));
}
