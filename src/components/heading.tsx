import { Link } from "lucide-react";
import type * as React from "react";

import { cn } from "@/lib/utils";

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
	as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
	id: string;
}

export function Heading({
	as: Component = "h2",
	id,
	children,
	className,
	...props
}: HeadingProps) {
	return (
		<Component
			id={id}
			className={cn(
				"group flex items-center scroll-m-20 tracking-tight",
				{
					"text-4xl font-extrabold lg:text-5xl mt-8 mb-4": Component === "h1",
					"text-3xl font-semibold mt-8 mb-4": Component === "h2",
					"text-2xl font-semibold mt-6 mb-3": Component === "h3",
					"text-xl font-semibold mt-4 mb-2": Component === "h4",
					"text-lg font-semibold mt-3 mb-2": Component === "h5",
					"text-base font-semibold mt-2 mb-1": Component === "h6",
				},
				className,
			)}
			{...props}
		>
			{children}
			<a
				href={`#${id}`}
				className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
				aria-label={`Link to ${children}`}
			>
				<Link className="w-4 h-4" />
			</a>
		</Component>
	);
}
