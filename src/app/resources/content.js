const person = {
	firstName: "Piotr",
	lastName: "Ambroziak",
	get name() {
		return `${this.firstName} ${this.lastName}`;
	},
	role: "Software Engineer / DevOps",
	avatar: "/images/avatar.jpg",
	location: "Europe/Warsaw", // Identyfikator strefy czasowej wg IANA
	languages: ["English", "Polski"],
};

const newsletter = {
	display: true,
	title: <>Zapisz się na newsletter Piotra</>,
	description: (
		<>
			Od czasu do czasu dzielę się wiedzą z zakresu programowania, DevOps oraz
			nowoczesnych technologii.
		</>
	),
};

const social = [
	{
		name: "GitHub",
		icon: "github",
		link: "https://github.com/Ambro-Dev",
	},
	{
		name: "LinkedIn",
		icon: "linkedin",
		link: "https://www.linkedin.com/in/piotr-ambroziak-99aa4a254/",
	},
	{
		name: "X",
		icon: "x",
		link: "https://x.com/ambro_devops",
	},
	{
		name: "Email",
		icon: "email",
		link: "mailto:piotr.ambroziak@ambro.dev",
	},
];

const home = {
	label: "Strona główna",
	title: `Ambro-Dev - ${person.name}`,
	description: `Strona prezentująca moje osiągnięcia jako ${person.role}`,
	headline: <>Programista i specjalista DevOps</>,
	subline: (
		<>
			Cześć, jestem {person.name}, Software Engineer / DevOps.
			<br />
			Specjalizuję się w budowie skalowalnych systemów oraz automatyzacji
			procesów wdrożeniowych.
			<br />
			Po godzinach rozwijam własne projekty open source.
		</>
	),
};

const about = {
	label: "O mnie",
	title: "O mnie",
	description: `Poznaj ${person.name}, Software Engineer / DevOps zlokalizowanego w ${person.location}`,
	tableOfContent: {
		display: true,
		subItems: false,
	},
	avatar: {
		display: true,
	},
	calendar: {
		display: true,
		link: "https://cal.com",
	},
	intro: {
		display: true,
		title: "Wprowadzenie",
		description: (
			<>
				{person.name} to doświadczony inżynier oprogramowania i specjalista
				DevOps, który z pasją tworzy wydajne oraz niezawodne rozwiązania IT.
				Jego praca obejmuje zarówno rozwój oprogramowania, jak i optymalizację
				procesów wdrożeniowych, co pozwala na dynamiczny rozwój firm.
			</>
		),
	},
	work: {
		display: true,
		title: "Doświadczenie zawodowe",
		experiences: [
			{
				company: "TechFlow",
				timeframe: "2022 - Obecnie",
				role: "Starszy Inżynier Oprogramowania / Specjalista DevOps",
				achievements: [
					<>
						Usprawnił architekturę systemu, zwiększając wydajność aplikacji o
						25% i skracając czas wdrożeń o 40%.
					</>,
					<>
						Wdrożył automatyzację procesów CI/CD, co przyczyniło się do 50%
						redukcji błędów w produkcji.
					</>,
				],
				images: [
					{
						src: "/images/projects/project-01/cover-01.jpg",
						alt: "Projekt TechFlow",
						width: 16,
						height: 9,
					},
				],
			},
			{
				company: "CodeCraft",
				timeframe: "2018 - 2022",
				role: "Inżynier Oprogramowania / DevOps",
				achievements: [
					<>
						Opracował skalowalne rozwiązania chmurowe, poprawiając efektywność
						systemów o 30%.
					</>,
					<>
						Koordynował zespół wdrażający nowe technologie, co skutkowało 20%
						wzrostem stabilności usług.
					</>,
				],
				images: [],
			},
		],
	},
	studies: {
		display: true,
		title: "Edukacja",
		institutions: [
			{
				name: "Politechnika Warszawska",
				description: <>Studiował inżynierię oprogramowania.</>,
			},
			{
				name: "Kurs DevOps Masterclass",
				description: <>Szkolenie z zakresu nowoczesnych narzędzi DevOps.</>,
			},
		],
	},
	technical: {
		display: true,
		title: "Umiejętności techniczne",
		skills: [
			{
				title: "Docker",
				description: (
					<>
						Znajomość konteneryzacji z wykorzystaniem Docker, umożliwiająca
						szybkie i bezproblemowe wdrażanie aplikacji.
					</>
				),
				images: [
					{
						src: "/images/projects/project-01/docker.jpg",
						alt: "Docker",
						width: 16,
						height: 9,
					},
				],
			},
			{
				title: "Kubernetes",
				description: (
					<>
						Doświadczenie w zarządzaniu klastrami Kubernetes oraz automatyzacji
						procesów wdrożeniowych.
					</>
				),
				images: [
					{
						src: "/images/projects/project-01/kubernetes.jpg",
						alt: "Kubernetes",
						width: 16,
						height: 9,
					},
				],
			},
			{
				title: "Next.js",
				description: (
					<>
						Tworzenie skalowalnych aplikacji webowych z wykorzystaniem Next.js
						oraz integracja z narzędziami DevOps.
					</>
				),
				images: [
					{
						src: "/images/projects/project-01/nextjs.jpg",
						alt: "Next.js",
						width: 16,
						height: 9,
					},
				],
			},
		],
	},
};

const blog = {
	label: "Blog",
	title: "Piszę o technologii i DevOps...",
	description: `Przeczytaj, czym ostatnio zajmuje się ${person.name}`,
};

const workProjects = {
	label: "Projekty",
	title: "Moje projekty",
	description: `Projekty programistyczne i DevOps opracowane przez ${person.name}`,
};

const gallery = {
	label: "Galeria",
	title: "Moja galeria zdjęć",
	description: `Kolekcja zdjęć autorstwa ${person.name}`,
	images: [
		{
			src: "/images/gallery/img-01.jpg",
			alt: "Zdjęcie",
			orientation: "vertical",
		},
		{
			src: "/images/gallery/img-02.jpg",
			alt: "Zdjęcie",
			orientation: "horizontal",
		},
		{
			src: "/images/gallery/img-03.jpg",
			alt: "Zdjęcie",
			orientation: "vertical",
		},
		{
			src: "/images/gallery/img-04.jpg",
			alt: "Zdjęcie",
			orientation: "horizontal",
		},
		{
			src: "/images/gallery/img-05.jpg",
			alt: "Zdjęcie",
			orientation: "horizontal",
		},
		{
			src: "/images/gallery/img-06.jpg",
			alt: "Zdjęcie",
			orientation: "vertical",
		},
		{
			src: "/images/gallery/img-07.jpg",
			alt: "Zdjęcie",
			orientation: "horizontal",
		},
		{
			src: "/images/gallery/img-08.jpg",
			alt: "Zdjęcie",
			orientation: "vertical",
		},
		{
			src: "/images/gallery/img-09.jpg",
			alt: "Zdjęcie",
			orientation: "horizontal",
		},
		{
			src: "/images/gallery/img-10.jpg",
			alt: "Zdjęcie",
			orientation: "horizontal",
		},
		{
			src: "/images/gallery/img-11.jpg",
			alt: "Zdjęcie",
			orientation: "vertical",
		},
		{
			src: "/images/gallery/img-12.jpg",
			alt: "Zdjęcie",
			orientation: "horizontal",
		},
		{
			src: "/images/gallery/img-13.jpg",
			alt: "Zdjęcie",
			orientation: "horizontal",
		},
		{
			src: "/images/gallery/img-14.jpg",
			alt: "Zdjęcie",
			orientation: "horizontal",
		},
	],
};

export {
	person,
	social,
	newsletter,
	home,
	about,
	blog,
	workProjects as work,
	gallery,
};
