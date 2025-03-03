import { Highlight, themes } from "prism-react-renderer";
import type * as React from "react";

import { cn } from "@/lib/utils";

interface CodeBlockProps extends React.HTMLAttributes<HTMLPreElement> {
	code: string;
	language: string;
	showLineNumbers?: boolean;
}

export function CodeBlock({
	code,
	language,
	showLineNumbers = true,
	className,
	...props
}: CodeBlockProps) {
	return (
		<Highlight theme={themes.vsLight} code={code.trim()} language={language}>
			{({
				className: highlightClassName,
				style,
				tokens,
				getLineProps,
				getTokenProps,
			}) => (
				<pre
					className={cn(
						"overflow-x-auto rounded-lg p-4",
						highlightClassName,
						className,
					)}
					style={style}
					{...props}
				>
					{tokens.map((line, i) => (
						<div key={i} {...getLineProps({ line })}>
							{showLineNumbers && (
								<span className="mr-4 inline-block w-4 text-right text-gray-500 select-none">
									{i + 1}
								</span>
							)}
							{line.map((token, key) => (
								<span key={key} {...getTokenProps({ token })} />
							))}
						</div>
					))}
				</pre>
			)}
		</Highlight>
	);
}
