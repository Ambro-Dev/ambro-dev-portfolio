import AnimatedLogo from "@/components/home/animated-logo";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";

const AnimatedContent: React.FC = () => (
	<AnimatePresence>
		<motion.div
			key="animated-logo"
			initial={{ opacity: 0, scale: 0.8 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.8, ease: "easeOut" }}
			className="flex justify-center lg:justify-start items-center"
		>
			<AnimatedLogo />
		</motion.div>
		<motion.div
			key="animated-text"
			initial={{ opacity: 0, y: 50 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8, delay: 0.2 }}
			className="flex flex-col space-y-6"
		>
			<div className="space-y-4">
				<motion.h1
					className="font-extrabold tracking-tight text-white gradient-text text-5xl sm:text-6xl py-2"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.3 }}
				>
					Ambro-Dev
				</motion.h1>
				<motion.p
					className="max-w-[600px] mx-auto lg:mx-0 text-gray-300 md:text-xl leading-relaxed"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.4 }}
				>
					I build <span className="gradient-text">modern</span> web applications
					with a focus on user experience and{" "}
					<span className="gradient-text">performance</span>. Let&apos;s create
					something <span className="gradient-text">amazing</span> together.
				</motion.p>
			</div>
			<motion.div
				className="flex flex-col gap-4 min-[400px]:flex-row justify-center lg:justify-start"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.5 }}
			>
				<Link href="#projects" passHref>
					<Button
						className="bg-gradient-to-br from-indigo-500 via-fuchsia-500 to-pink-500 text-white text-lg px-8 py-4 rounded-lg shadow-lg hover:scale-105 transition-transform"
						aria-label="View my projects"
					>
						View Projects
					</Button>
				</Link>
				<Link href="#contact" passHref>
					<Button
						className="bg-gradient-to-br from-gray-700 to-gray-900 text-white text-lg px-8 py-4 rounded-lg shadow-lg hover:scale-105 transition-transform"
						aria-label="Contact me"
					>
						Contact Me
					</Button>
				</Link>
			</motion.div>
		</motion.div>
	</AnimatePresence>
);

export default AnimatedContent;
