import DynamicAnimatedContent from "@/components/home/DynamicAnimatedContent";
import HomeServices from "@/components/home/HomeServices";
import Starfield from "@/components/home/starfield";
import { baseURL, home, person } from "./resources";
import Script from "next/script";

export async function generateMetadata() {
	const title = home.title;
	const description = home.description;
	const ogImage = `https://${baseURL}/og?title=${encodeURIComponent(title)}`;

	return {
		title,
		description,
		openGraph: {
			title,
			description,
			type: "website",
			url: `https://${baseURL}`,
			images: [
				{
					url: ogImage,
					alt: title,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
			images: [ogImage],
		},
	};
}

export default function Home() {
	return (
		<>
			<Script
				id="schema-structured-data"
				type="application/ld+json"
				strategy="afterInteractive"
			>
				{JSON.stringify({
					"@context": "https://schema.org",
					"@type": "WebPage",
					name: home.title,
					description: home.description,
					url: `https://${baseURL}`,
					image: `${baseURL}/og?title=${encodeURIComponent(home.title)}`,
					publisher: {
						"@type": "Person",
						name: person.name,
						image: {
							"@type": "ImageObject",
							url: `${baseURL}${person.avatar}`,
						},
					},
				})}
			</Script>

			<section
				className="w-full relative min-h-svh flex flex-col justify-center items-center sm:px-2 overflow-x-hidden"
				id="home"
			>
				<Starfield />
				<div className="relative z-10 container py-16 px-2 sm:px-2 bg-transparent">
					<div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
						<div className="flex flex-col justify-center space-y-4 text-center lg:text-left col-span-2">
							<DynamicAnimatedContent />
						</div>
						<div className="flex justify-center items-center w-full h-full col-span-3">
							<HomeServices />
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
