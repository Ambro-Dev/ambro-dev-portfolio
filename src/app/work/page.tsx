import { person, work } from "@/app/resources/content";
import { getPosts } from "@/app/utils/utils";
import Projects from "@/components/old/Projects";

export async function generateMetadata() {
  const title = work.title;
  const description = work.description;
  const ogImage = `/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: "/work/",
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

export default function Work() {
  const allProjects = getPosts(["src", "app", "work", "projects"]);

  return (
    <div className="container mx-auto px-4 pb-8 pt-32">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            headline: work.title,
            description: work.description,
            // biome-ignore lint/style/noUnusedTemplateLiteral: <explanation>
            url: `/projects`,
            image: "/og?title=Design%20Projects",
            author: {
              "@type": "Person",
              name: person.name,
            },
            hasPart: allProjects.map((project) => ({
              "@type": "CreativeWork",
              headline: project.metadata.title,
              description: project.metadata.summary,
              url: `/projects/${project.slug}`,
              image: `/${project.metadata.image}`,
            })),
          }),
        }}
      />
      <Projects />
    </div>
  );
}
