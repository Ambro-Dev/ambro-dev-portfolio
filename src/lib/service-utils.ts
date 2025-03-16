import type { ServiceCategory } from "@/data/services";

/**
 * Interfejs definiujący serializowalne dane usługi
 * bez nieserializowalnych pól jak LucideIcon
 */
export interface SerializableService {
	id: string;
	title: string;
	description: string;
	longDescription: string;
	color: string;
	tags: string[];
	bulletPoints: string[];
	// Pomijamy pole icon: LucideIcon
}

/**
 * Funkcja przygotowująca serializowalne dane usługi
 * @param service Obiekt usługi z kolekcji serviceCategories
 * @returns Obiekt zawierający tylko serializowalne pola
 */
export function prepareSerializableService(
	service: ServiceCategory | null | undefined,
): SerializableService | null {
	if (!service) return null;

	// Wyciągamy tylko potrzebne, serializowalne pola
	const { id, title, description, longDescription, color, tags, bulletPoints } =
		service;

	return {
		id,
		title,
		description,
		longDescription,
		color,
		tags,
		bulletPoints,
		// Pole 'icon' jest pomijane - jest to nieserializowalny obiekt LucideIcon
	};
}
