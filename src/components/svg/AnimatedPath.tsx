import { motion } from "framer-motion";

type PacketPathProps = {
	path: string;
	packetColor?: string;
	interval?: number; // Time it takes for the stroke to complete an animation cycle
	delay?: number; // Initial delay before animation starts
};

const PacketPath = ({
	path,
	packetColor = "#ff1493",
	interval = 3,
	delay = 0,
}: PacketPathProps) => (
	<>
		<defs>
			{/* Optional neon glow filter */}
			<filter id="neon">
				<feGaussianBlur stdDeviation="2" result="blur" />
				<feMerge>
					<feMergeNode in="blur" />
					<feMergeNode in="SourceGraphic" />
				</feMerge>
			</filter>
		</defs>
		<g
			id="cu_qoeh7i1j9lafg-stroke"
			fill="none"
			strokeLinecap="butt"
			strokeLinejoin="miter"
			strokeMiterlimit="4"
		>
			{/* Base path in gray */}
			<path d={path} stroke="#ababab" strokeWidth="1" />

			{/* Animated path */}
			<motion.path
				d={path}
				stroke={packetColor}
				strokeWidth="2"
				strokeDasharray="15 310"
				filter="url(#neon)"
				animate={{ strokeDashoffset: [0, 310] }}
				transition={{
					duration: interval,
					repeat: Number.POSITIVE_INFINITY,
					ease: "linear",
					delay: delay,
				}}
			/>
		</g>
	</>
);

export default PacketPath;
