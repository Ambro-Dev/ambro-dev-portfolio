import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type React from "react";

interface ProjectCardProps {
	priority: boolean;
	href: string;
	images: string[];
	title: string;
	description: string;
	content: string;
	avatars: { src: string }[];
	link: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
	priority,
	href,
	images,
	title,
	description,
	content,
	avatars,
	link,
}) => {
	return (
		<Card className="overflow-hidden">
			<Link href={href}>
				<div className="relative aspect-video">
					<Image
						src={images[0] || "/placeholder.svg"}
						alt={title}
						layout="fill"
						objectFit="cover"
						priority={priority}
					/>
				</div>
			</Link>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
			<CardContent>
				<p className="text-sm text-muted-foreground mb-4">
					{content.substring(0, 150)}...
				</p>
				<div className="flex justify-between items-center">
					<div className="flex -space-x-2">
						{avatars.map((avatar, index) => (
							<Avatar key={index} className="border-2 border-background">
								<AvatarImage src={avatar.src} />
								<AvatarFallback>TC</AvatarFallback>
							</Avatar>
						))}
					</div>
					{link && (
						<Button variant="outline" size="sm" asChild>
							<a href={link} target="_blank" rel="noopener noreferrer">
								<ExternalLink className="mr-2 h-4 w-4" />
								Visit Project
							</a>
						</Button>
					)}
				</div>
			</CardContent>
		</Card>
	);
};

export default ProjectCard;
