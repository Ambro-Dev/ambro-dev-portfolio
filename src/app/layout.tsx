import type { Metadata } from "next";
import { Inter, Source_Code_Pro } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import { cx } from "class-variance-authority";
import { baseURL, home, style } from "./resources";

export const metadata: Metadata = {
	metadataBase: new URL(`https://${baseURL}`),
	title: home.title,
	description: home.description,
	openGraph: {
		title: `Ambro-Dev | ${home.title}`,
		description:
			"Automatyzacja procesów, chmurowe rowziązania, administracja serwerami, tworzenie stron internetowych i aplikacji webowych",
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

const primary = Inter({
	variable: "--font-primary",
	subsets: ["latin"],
	display: "swap",
});

type FontConfig = {
	variable: string;
};

/*
	Replace with code for secondary and tertiary fonts
	from https://once-ui.com/customize
*/
const secondary: FontConfig | undefined = undefined;
const tertiary: FontConfig | undefined = undefined;
/*
 */

const code = Source_Code_Pro({
	variable: "--font-code",
	subsets: ["latin"],
	display: "swap",
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
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
			className={cx(
				primary.variable,
				secondary ? secondary.variable : "",
				tertiary ? tertiary.variable : "",
				code.variable,
				"dark",
			)}
			suppressHydrationWarning
		>
			<body className="antialiased">
				<ThemeProvider
					attribute="class"
					defaultTheme="dark"
					enableSystem={false}
					disableTransitionOnChange
				>
					<Header />
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
