import { person } from "@/app/resources/content";
import { formatDate } from "@/app/utils/formatDate";
import { getPosts } from "@/app/utils/utils";
import { AvatarGroup } from "@/components/avatar-group";
import ScrollToHash from "@/components/old/ScrollToHash";
import { CustomMDX } from "@/components/old/mdx";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface WorkParams {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const posts = getPosts(["src", "app", "work", "projects"]);
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: WorkParams) {
  const { slug } = await params;
  const post = getPosts(["src", "app", "work", "projects"]).find(
    (post) => post.slug === slug
  );

  if (!post) {
    return;
  }

  const {
    title,
    publishedAt: publishedTime,
    summary: description,
    images,
    image,
    team,
  } = post.metadata;
  const ogImage = image
    ? `/${image}`
    : `/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    images,
    team,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime,
      url: `/work/${post.slug}`,
      images: [
        {
          url: ogImage,
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

export default async function Project({ params }: WorkParams) {
  const { slug } = await params;
  const post = getPosts(["src", "app", "work", "projects"]).find(
    (post) => post.slug === slug
  );

  if (!post) {
    notFound();
  }

  const avatars =
    post.metadata.team?.map((person) => ({
      src: person.avatar,
      alt: person.name,
      fallback: person.name.charAt(0),
    })) || [];

  return (
    <section className="container mx-auto px-4 py-8 space-y-8">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.metadata.title,
            datePublished: post.metadata.publishedAt,
            dateModified: post.metadata.publishedAt,
            description: post.metadata.summary,
            image: post.metadata.image
              ? `/${post.metadata.image}`
              : `/og?title=${encodeURIComponent(post.metadata.title)}`,
            url: `/work/${post.slug}`,
            author: {
              "@type": "Person",
              name: person.name,
            },
          }),
        }}
      />
      <div className="max-w-2xl mx-auto space-y-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/work" className="flex items-center">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Projects
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">{post.metadata.title}</h1>
      </div>
      {post.metadata.images.length > 0 && (
        <div className="relative aspect-video max-w-4xl mx-auto">
          <Image
            priority
            fill
            className="object-cover rounded-lg"
            alt="Project cover image"
            src={post.metadata.images[0] || "/placeholder.svg"}
          />
        </div>
      )}
      <article className="prose dark:prose-invert mx-auto">
        <div className="flex items-center gap-3 mb-6">
          {post.metadata.team && <AvatarGroup avatars={avatars} />}
          <span className="text-sm text-muted-foreground">
            {formatDate(post.metadata.publishedAt)}
          </span>
        </div>
        <CustomMDX source={post.content} />
      </article>
      <ScrollToHash />
    </section>
  );
}
