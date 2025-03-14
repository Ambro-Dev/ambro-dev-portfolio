import { useInView, useScroll, useSpring, useTransform } from "framer-motion";
import { type RefObject, useMemo, useRef } from "react";

export const useParallax = (options?: {
	speed?: number;
	direction?: "up" | "down" | "left" | "right";
	container?: RefObject<HTMLElement> | null;
	disabled?: boolean;
	threshold?: number;
	ease?: number;
}) => {
	const {
		speed = 0.2,
		direction = "up",
		container,
		disabled = false,
		threshold = 0.01,
	} = options || {};

	const ref = useRef<HTMLElement>(null);
	const inView = useInView(ref, {
		amount: threshold,
		once: false,
	});

	const { scrollYProgress } = useScroll({
		target: container || ref,
		offset: ["start end", "end start"],
	});

	// Call useTransform unconditionally with the transformation logic inside
	const transformValue = useTransform<number, string>(
		scrollYProgress,
		(value: number) => {
			// Apply the transformation based on direction
			const percentage = speed * 100;

			switch (direction) {
				case "down":
					return `${value * percentage}%`;
				case "left":
					return `-${value * percentage}%`;
				case "right":
					return `${value * percentage}%`;
				default:
					return `-${value * percentage}%`;
			}
		},
	);

	const springValue = useSpring(transformValue, {
		stiffness: 100,
		damping: 30,
		restDelta: 0.001,
	});

	const style = useMemo(() => {
		if (disabled) return {};

		if (direction === "left" || direction === "right") {
			return { x: inView ? springValue : 0 };
		}
		return { y: inView ? springValue : 0 };
	}, [disabled, direction, inView, springValue]);

	return {
		ref,
		style,
		inView,
		scrollYProgress,
	};
};
