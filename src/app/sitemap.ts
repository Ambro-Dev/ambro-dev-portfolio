// src/app/sitemap.ts
import type { MetadataRoute } from "next";
import { serviceCategories } from "@/data/services";

export default function sitemap(): MetadataRoute.Sitemap {
	const baseUrl = "https://ambro.dev";

	// Get service URLs
	const serviceUrls = serviceCategories.map((service) => ({
		url: `${baseUrl}/uslugi/${service.id}`,
		lastModified: new Date(),
		changeFrequency: "monthly" as const,
		priority: 0.8,
	}));

	// Add other pages
	const staticPages = [
		{
			url: baseUrl,
			lastModified: new Date(),
			changeFrequency: "weekly" as const,
			priority: 1.0,
		},
		{
			url: `${baseUrl}/uslugi`,
			lastModified: new Date(),
			changeFrequency: "weekly" as const,
			priority: 0.9,
		},
		{
			url: `${baseUrl}/o-mnie`,
			lastModified: new Date(),
			changeFrequency: "monthly" as const,
			priority: 0.7,
		},
		{
			url: `${baseUrl}/kontakt`,
			lastModified: new Date(),
			changeFrequency: "monthly" as const,
			priority: 0.7,
		},
		{
			url: `${baseUrl}/blog`,
			lastModified: new Date(),
			changeFrequency: "weekly" as const,
			priority: 0.8,
		},
	];

	return [...staticPages, ...serviceUrls];
}
