type Route = Record<string, boolean>;

type ThemeStyle = {
	theme: "dark" | "light";
	neutral: "sand" | "gray" | "slate";
	brand:
		| "blue"
		| "indigo"
		| "violet"
		| "magenta"
		| "pink"
		| "red"
		| "orange"
		| "yellow"
		| "moss"
		| "green"
		| "emerald"
		| "aqua"
		| "cyan";
	accent:
		| "blue"
		| "indigo"
		| "violet"
		| "magenta"
		| "pink"
		| "red"
		| "orange"
		| "yellow"
		| "moss"
		| "green"
		| "emerald"
		| "aqua"
		| "cyan";
	solid: "color" | "contrast";
	solidStyle: "flat" | "plastic";
	border: "rounded" | "playful" | "conservative";
	surface: "filled" | "translucent";
	transition: "all" | "micro" | "macro";
};

type MaskEffect = {
	cursor: boolean;
	x: number;
	y: number;
	radius: number;
};

type GradientEffect = {
	display: boolean;
	x: number;
	y: number;
	width: number;
	height: number;
	tilt: number;
	colorStart: string;
	colorEnd: string;
	opacity: number;
};

type PatternEffect = {
	display: boolean;
	size?: number;
	color: string;
	opacity: number;
};

type Effects = {
	mask: MaskEffect;
	gradient: GradientEffect;
	dots: PatternEffect;
	lines: PatternEffect;
	grid: PatternEffect;
};

type Display = {
	location: boolean;
	time: boolean;
};

type Mailchimp = {
	action: string;
	effects: Effects;
};

const baseURL = "ambro.dev";

const routes: Route = {
	"/": true,
	"/about": true,
	"/work": true,
	"/blog": true,
	"/gallery": true,
};

const protectedRoutes: Route = {
	"/work/automate-design-handovers-with-a-figma-to-code-pipeline": true,
};

const style: ThemeStyle = {
	theme: "dark",
	neutral: "gray",
	brand: "emerald",
	accent: "orange",
	solid: "contrast",
	solidStyle: "flat",
	border: "playful",
	surface: "translucent",
	transition: "all",
};

const effects: Effects = {
	mask: {
		cursor: true,
		x: 0,
		y: 0,
		radius: 75,
	},
	gradient: {
		display: true,
		x: 50,
		y: 0,
		width: 100,
		height: 100,
		tilt: 0,
		colorStart: "brand-background-strong",
		colorEnd: "static-transparent",
		opacity: 50,
	},
	dots: {
		display: true,
		size: 2,
		color: "brand-on-background-weak",
		opacity: 20,
	},
	lines: {
		display: false,
		color: "neutral-alpha-weak",
		opacity: 100,
	},
	grid: {
		display: false,
		color: "neutral-alpha-weak",
		opacity: 100,
	},
};

const display: Display = {
	location: true,
	time: true,
};

const mailchimp: Mailchimp = {
	action: "https://url/subscribe/post?parameters",
	effects: {
		mask: {
			cursor: false,
			x: 100,
			y: 0,
			radius: 100,
		},
		gradient: {
			display: true,
			x: 100,
			y: 50,
			width: 100,
			height: 100,
			tilt: -45,
			colorStart: "accent-background-strong",
			colorEnd: "static-transparent",
			opacity: 100,
		},
		dots: {
			display: false,
			size: 24,
			color: "brand-on-background-weak",
			opacity: 100,
		},
		lines: {
			display: false,
			color: "neutral-alpha-weak",
			opacity: 100,
		},
		grid: {
			display: true,
			color: "neutral-alpha-weak",
			opacity: 100,
		},
	},
};

export { baseURL, routes, protectedRoutes, style, effects, display, mailchimp };
