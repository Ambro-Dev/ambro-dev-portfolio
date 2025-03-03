import { getPosts } from "@/app/utils/utils";
import ProjectCard from "./ProjectCard";

interface ProjectsProps {
	range?: [number, number?];
}

export function Projects({ range }: ProjectsProps) {
	const allProjects = getPosts(["src", "app", "work", "projects"]);

	const sortedProjects = allProjects.sort((a, b) => {
		return (
			new Date(b.metadata.publishedAt).getTime() -
			new Date(a.metadata.publishedAt).getTime()
		);
	});

	const displayedProjects = range
		? sortedProjects.slice(range[0] - 1, range[1] ?? sortedProjects.length)
		: sortedProjects;

	return (
		<div className="w-full space-y-12 px-4 sm:px-6 lg:px-8 mb-10">
			{displayedProjects.map((post, index) => (
				<ProjectCard
					key={post.slug}
					priority={index < 2}
					href={`work/${post.slug}`}
					images={post.metadata.images}
					title={post.metadata.title}
					description={post.metadata.summary}
					content={post.content}
					avatars={
						post.metadata.team?.map((member) => ({ src: member.avatar })) || []
					}
					link={post.metadata.link || ""}
				/>
			))}
		</div>
	);
}

export default Projects;
