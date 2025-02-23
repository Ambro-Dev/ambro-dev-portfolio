import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, ChevronRight, Globe } from "lucide-react";
import TableOfContents from "@/components/old/TableOfContents";
import { person, about, social } from "@/app/resources/content";

export async function generateMetadata() {
  const title = about.title;
  const description = about.description;
  const ogImage = `/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `/about`,
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

export default function About() {
  const structure = [
    {
      title: about.intro.title,
      display: about.intro.display,
      items: [],
    },
    {
      title: about.work.title,
      display: about.work.display,
      items: about.work.experiences.map((experience) => experience.company),
    },
    {
      title: about.studies.title,
      display: about.studies.display,
      items: about.studies.institutions.map((institution) => institution.name),
    },
    {
      title: about.technical.title,
      display: about.technical.display,
      items: about.technical.skills.map((skill) => skill.title),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: person.name,
            jobTitle: person.role,
            description: about.intro.description,
            url: `/about`,
            image: `/images/${person.avatar}`,
            sameAs: social
              .filter((item) => item.link && !item.link.startsWith("mailto:"))
              .map((item) => item.link),
            worksFor: {
              "@type": "Organization",
              name: about.work.experiences[0]?.company || "",
            },
          }),
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-8">
        {about.tableOfContent.display && (
          <div className="hidden lg:block sticky top-8 self-start">
            <TableOfContents structure={structure} about={about} />
          </div>
        )}

        <div className="space-y-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {about.avatar.display && (
              <div className="flex flex-col items-center gap-4">
                <Avatar className="w-40 h-40">
                  <AvatarImage src={person.avatar} alt={person.name} />
                  <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{person.location}</span>
                </div>
                {person.languages.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {person.languages.map((language, index) => (
                      <Badge key={index} variant="secondary">
                        {language}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold mb-2">{person.name}</h1>
              <p className="text-xl text-muted-foreground mb-4">
                {person.role}
              </p>
              {about.calendar.display && (
                <Button asChild className="mb-4">
                  <Link
                    href={about.calendar.link}
                    className="flex items-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    Schedule a call
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </Button>
              )}
              {social.length > 0 && (
                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                  {social.map(
                    (item) =>
                      item.link && (
                        <Button key={item.name} variant="outline" asChild>
                          <Link href={item.link}>
                            {item.icon && (
                              <span className="mr-2">{item.icon}</span>
                            )}
                            {item.name}
                          </Link>
                        </Button>
                      )
                  )}
                </div>
              )}
            </div>
          </div>

          {about.intro.display && (
            <div className="text-lg" id={about.intro.title}>
              <p>{about.intro.description}</p>
            </div>
          )}

          {about.work.display && (
            <section id={about.work.title}>
              <h2 className="text-2xl font-bold mb-4">{about.work.title}</h2>
              <div className="space-y-8">
                {about.work.experiences.map((experience, index) => (
                  <Card
                    key={`${experience.company}-${experience.role}-${index}`}
                  >
                    <CardHeader>
                      <div className="flex justify-between items-end">
                        <CardTitle id={experience.company}>
                          {experience.company}
                        </CardTitle>
                        <span className="text-sm text-muted-foreground">
                          {experience.timeframe}
                        </span>
                      </div>
                      <p className="text-muted-foreground">{experience.role}</p>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc pl-5 space-y-2">
                        {experience.achievements.map((achievement, index) => (
                          <li key={`${experience.company}-${index}`}>
                            {achievement}
                          </li>
                        ))}
                      </ul>
                      {experience.images.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                          {experience.images.map((image, index) => (
                            <div key={index} className="relative aspect-video">
                              <Image
                                fill
                                src={image.src || "/placeholder.svg"}
                                alt={image.alt}
                                className="object-cover rounded-md"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {about.studies.display && (
            <section id={about.studies.title}>
              <h2 className="text-2xl font-bold mb-4">{about.studies.title}</h2>
              <div className="space-y-4">
                {about.studies.institutions.map((institution, index) => (
                  <div key={`${institution.name}-${index}`}>
                    <h3 className="text-xl font-semibold" id={institution.name}>
                      {institution.name}
                    </h3>
                    <p className="text-muted-foreground">
                      {institution.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {about.technical.display && (
            <section id={about.technical.title}>
              <h2 className="text-2xl font-bold mb-4">
                {about.technical.title}
              </h2>
              <div className="space-y-8">
                {about.technical.skills.map((skill, index) => (
                  <div key={`${skill.title}-${index}`}>
                    <h3 className="text-xl font-semibold mb-2">
                      {skill.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {skill.description}
                    </p>
                    {skill.images && skill.images.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {skill.images.map((image, index) => (
                          <div key={index} className="relative aspect-video">
                            <Image
                              fill
                              src={image.src || "/placeholder.svg"}
                              alt={image.alt}
                              className="object-cover rounded-md"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
