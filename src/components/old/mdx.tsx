"use client";

import { CodeBlock } from "@/components/code-blocks";
import { Heading } from "@/components/heading";
import { cn } from "@/lib/utils";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { MDXRemote, type MDXRemoteProps } from "next-mdx-remote/rsc";
import Image, { type ImageProps } from "next/image";
import Link from "next/link";
import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from "react";

interface TableProps {
  data: {
    headers: string[];
    rows: string[][];
  };
}

const Table = ({ data }: TableProps) => (
  <table className="min-w-full border-collapse border border-gray-300 my-4">
    <thead className="bg-gray-100">
      <tr>
        {data.headers.map((header, index) => (
          <th key={index} className="px-4 py-2">
            {header}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {data.rows.map((row, index) => (
        <tr key={index}>
          {row.map((cell, cellIndex) => (
            <td key={cellIndex} className="border px-4 py-2">
              {cell}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

interface CustomLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: ReactNode;
}

const CustomLink = ({ href, children, ...props }: CustomLinkProps) => {
  if (href.startsWith("/")) {
    return (
      <Link href={href} {...props} className="text-blue-600 hover:underline">
        {children}
      </Link>
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
};

const CustomImage = ({ alt, src, ...props }: ImageProps) => {
  if (!src) {
    console.error("Image requires a valid 'src' property.");
    return null;
  }
  return (
    <div className="my-8 relative aspect-video">
      <Image
        fill
        src={src}
        alt={alt || ""}
        className="object-cover rounded-md"
        {...props}
      />
    </div>
  );
};

const slugify = (str: string): string =>
  str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/&/g, "-and-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");

const createHeading = (level: 1 | 2 | 3 | 4 | 5 | 6) => {
  const CustomHeading = ({
    children,
    ...props
  }: HTMLAttributes<HTMLHeadingElement>) => {
    const slug = slugify(children as string);
    return (
      <Heading as={`h${level}`} id={slug} {...props}>
        {children}
      </Heading>
    );
  };
  CustomHeading.displayName = `Heading${level}`;
  return CustomHeading;
};

const createParagraph = ({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) => (
  <p
    className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}
    {...props}
  >
    {children}
  </p>
);

const components = {
  p: createParagraph as any,
  h1: createHeading(1) as any,
  h2: createHeading(2) as any,
  h3: createHeading(3) as any,
  h4: createHeading(4) as any,
  h5: createHeading(5) as any,
  h6: createHeading(6) as any,
  img: CustomImage as any,
  a: CustomLink as any,
  Table,
  CodeBlock,
};

interface CustomMDXProps extends Omit<MDXRemoteProps, "components"> {
  components?: Partial<typeof components>;
}

export function CustomMDX({
  components: customComponents,
  ...props
}: CustomMDXProps) {
  return (
    <MDXRemote {...props} components={{ ...components, ...customComponents }} />
  );
}
