import { MDXRemote, type MDXRemoteProps } from "next-mdx-remote/rsc";
import type React from "react";
import type { ReactNode } from "react";
import Image, { ImageProps } from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { CodeBlock } from "@/components/code-blocks";
import { Heading } from "@/components/heading";

type TableProps = {
  data: {
    headers: string[];
    rows: string[][];
  };
};

function Table({ data }: TableProps) {
  const headers = data.headers.map((header, index) => (
    <th key={index} className="px-4 py-2">
      {header}
    </th>
  ));
  const rows = data.rows.map((row, index) => (
    <tr key={index}>
      {row.map((cell, cellIndex) => (
        <td key={cellIndex} className="border px-4 py-2">
          {cell}
        </td>
      ))}
    </tr>
  ));

  return (
    <table className="min-w-full border-collapse border border-gray-300 my-4">
      <thead className="bg-gray-100">
        <tr>{headers}</tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

type CustomLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
};

function CustomLink({ href, children, ...props }: CustomLinkProps) {
  if (href.startsWith("/")) {
    return (
      <Link href={href} {...props} className="text-blue-600 hover:underline">
        {children}
      </Link>
    );
  }

  if (href.startsWith("#")) {
    return (
      <a href={href} {...props} className="text-blue-600 hover:underline">
        {children}
      </a>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      {...props}
      className="text-blue-600 hover:underline"
    >
      {children}
    </a>
  );
}

function CustomImage({ alt, src, ...props }: ImageProps) {
  if (!src) {
    console.error("Image requires a valid 'src' property.");
    return null;
  }

  return (
    <div className="my-8 relative aspect-video">
      <Image
        fill
        src={src || "/placeholder.svg"}
        alt={alt || ""}
        className="object-cover rounded-md"
        {...props}
      />
    </div>
  );
}

function slugify(str: string): string {
  return str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/&/g, "-and-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

function createHeading(level: 1 | 2 | 3 | 4 | 5 | 6) {
  const CustomHeading = ({
    children,
    ...props
  }: React.HTMLAttributes<HTMLHeadingElement>) => {
    const slug = slugify(children as string);
    return (
      <Heading as={`h${level}`} id={slug} {...props}>
        {children}
      </Heading>
    );
  };

  CustomHeading.displayName = `Heading${level}`;

  return CustomHeading;
}

const components = {
  p: ({
    children,
    className,
    ...props
  }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
      className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}
      {...props}
    >
      {children}
    </p>
  ),
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  img: CustomImage,
  a: CustomLink,
  Table,
  pre: ({ children }: { children: React.ReactElement }) => {
    const { children: code, className } = children.props;
    const language = className?.replace(/language-/, "");
    return <CodeBlock code={code} language={language || "text"} />;
  },
};

type CustomMDXProps = Omit<MDXRemoteProps, "components"> & {
  components?: typeof components;
};

export function CustomMDX(props: CustomMDXProps) {
  return (
    <MDXRemote
      {...props}
      components={{ ...components, ...(props.components || {}) }}
    />
  );
}
