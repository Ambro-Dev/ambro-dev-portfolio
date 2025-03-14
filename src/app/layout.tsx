import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Source_Code_Pro } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { cx } from "class-variance-authority";
import { baseURL, home, style } from "./resources";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";

// Primary fonts
const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

const primary = Inter({
	variable: "--font-primary",
	subsets: ["latin"],
	display: "swap",
});

const code = Source_Code_Pro({
	variable: "--font-code",
	subsets: ["latin"],
	display: "swap",
});

// Optional fonts
// Replace with code for secondary and tertiary fonts from https://once-ui.com/customize
type FontConfig = {
	variable: string;
};

const secondary: FontConfig | undefined = undefined;
const tertiary: FontConfig | undefined = undefined;

// Metadata configuration
export const metadata: Metadata = {
	metadataBase: new URL(`https://${baseURL}`),
	title: home.title,
	description: home.description,
	openGraph: {
		title: `Ambro-Dev | ${home.title}`,
		description:
			"Automatyzacja procesów, chmurowe rozwiązania, administracja serwerami, tworzenie stron internetowych i aplikacji webowych",
		url: baseURL,
		siteName: "Ambro-Dev",
		locale: "pl_PL",
		type: "website",
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	// Combine all font variables
	const fontClasses = cx(
		primary.variable,
		secondary?.variable,
		tertiary?.variable,
		code.variable,
		geistSans.variable,
		geistMono.variable,
		"dark antialiased",
	);

	return (
		<html
			lang="pl"
			data-neutral={style.neutral}
			data-brand={style.brand}
			data-accent={style.accent}
			data-solid={style.solid}
			data-solid-style={style.solidStyle}
			data-theme={style.theme}
			data-border={style.border}
			data-surface={style.surface}
			data-transition={style.transition}
			className={fontClasses}
			suppressHydrationWarning
		>
			<body>
				<ThemeProvider
					attribute="class"
					forcedTheme="dark"
					disableTransitionOnChange
				>
					<Navigation />
					{children}
					<Footer />
				</ThemeProvider>
			</body>
		</html>
	);
}
