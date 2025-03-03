"use client";

import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

const getStarCount = (width: number, height: number) => {
	const area = width * height;
	return Math.min(Math.max(area / 2000, 200), 800);
};

const SPEED = 0.02;

class Star {
	x: number;
	y: number;
	z: number;
	xPrev: number;
	yPrev: number;

	constructor(x = 0, y = 0, z = 0) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.xPrev = x;
		this.yPrev = y;
	}

	update(width: number, height: number, speed: number) {
		this.xPrev = this.x;
		this.yPrev = this.y;
		this.z += speed * 0.0675;
		this.x += this.x * (speed * 0.0225) * this.z;
		this.y += this.y * (speed * 0.0225) * this.z;
		if (
			this.x > width / 2 ||
			this.x < -width / 2 ||
			this.y > height / 2 ||
			this.y < -height / 2
		) {
			this.x = Math.random() * width - width / 2;
			this.y = Math.random() * height - height / 2;
			this.xPrev = this.x;
			this.yPrev = this.y;
			this.z = 0;
		}
	}

	draw(ctx: CanvasRenderingContext2D) {
		ctx.lineWidth = this.z;
		ctx.beginPath();
		ctx.moveTo(this.x, this.y);
		ctx.lineTo(this.xPrev, this.yPrev);
		ctx.stroke();
	}
}

const Starfield: React.FC = () => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const containerRef = useRef<HTMLDivElement | null>(null);
	const starsRef = useRef<Star[]>([]);
	const [isLoaded, setIsLoaded] = useState(false);

	const setupCanvas = useCallback(() => {
		const canvas = canvasRef.current;
		const container = containerRef.current;
		if (!canvas || !container) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const { clientWidth: width, clientHeight: height } = container;
		const dpr = window.devicePixelRatio || 1;
		canvas.width = width * dpr;
		canvas.height = height * dpr;
		canvas.style.width = `${width}px`;
		canvas.style.height = `${height}px`;
		ctx.scale(dpr, dpr);

		starsRef.current = Array.from(
			{ length: getStarCount(width, height) },
			() =>
				new Star(
					Math.random() * width - width / 2,
					Math.random() * height - height / 2,
					0,
				),
		);

		ctx.translate(width / 2, height / 2);
		ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
		ctx.strokeStyle = "white";

		setIsLoaded(true);
	}, []);

	const animate = useCallback(
		(ctx: CanvasRenderingContext2D, width: number, height: number) => {
			ctx.fillRect(-width / 2, -height / 2, width, height);
			for (const star of starsRef.current) {
				star.update(width, height, SPEED);
				star.draw(ctx);
			}
			requestAnimationFrame(() => animate(ctx, width, height));
		},
		[],
	);

	useEffect(() => {
		const canvas = canvasRef.current;
		const container = containerRef.current;
		if (!canvas || !container) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		setupCanvas();
		const { clientWidth: width, clientHeight: height } = container;
		const animationFrame = requestAnimationFrame(() =>
			animate(ctx, width, height),
		);

		const resizeObserver = new ResizeObserver(() => {
			setupCanvas();
		});

		resizeObserver.observe(container);

		return () => {
			resizeObserver.unobserve(container);
			cancelAnimationFrame(animationFrame);
		};
	}, [animate, setupCanvas]);

	return (
		<div
			id="starfield"
			className="absolute inset-0 h-full"
			ref={containerRef}
			aria-hidden="true"
		>
			<canvas
				id="starfield-canvas"
				ref={canvasRef}
				className={`transition-opacity duration-1000 ${
					isLoaded ? "opacity-100" : "opacity-0"
				}`}
			></canvas>
		</div>
	);
};

export default Starfield;
