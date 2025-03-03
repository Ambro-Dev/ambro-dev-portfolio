import { cn } from "@/lib/utils";
import type React from "react";

export const ScaledContainer: React.FC<{
	className?: string;
	children: React.ReactNode;
}> = ({ children, className }) => {
	return (
		<div className={cn("relative w-full h-full", className)}>
			{/* Skalujemy zawartość, by była mniejsza */}
			<div
				className="absolute top-0 left-0"
				style={{
					transform: "scale(0.7)",
					transformOrigin: "top left",
					width: "calc(100% / 0.7)",
					height: "calc(100% / 0.7)",
				}}
			>
				{children}
			</div>
		</div>
	);
};
