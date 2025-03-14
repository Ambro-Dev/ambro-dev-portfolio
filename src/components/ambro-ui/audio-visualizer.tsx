"use client";

import { type FC, useCallback, useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

export const AudioVisualizer: FC<{
  audioUrl?: string;
  variant?: "bars" | "circle" | "waveform" | "particles";
  barCount?: number;
  color?: string;
  sensitivity?: number;
  className?: string;
  width?: number;
  height?: number;
  autoplay?: boolean;
  controls?: boolean;
  loop?: boolean;
  captionUrl?: string; // New prop for caption file URL
  captionsEnabled?: boolean; // New prop to enable captions by default
}> = ({
  audioUrl,
  variant = "bars",
  barCount = 64,
  color = "#6366f1",
  sensitivity = 1.5,
  className = "",
  width = 400,
  height = 100,
  autoplay = false,
  controls = true,
  loop = false,
  captionUrl, // Add this
  captionsEnabled = false, // Add this
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const dataArray = useRef<Uint8Array | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const source = useRef<MediaElementAudioSourceNode | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);

  const drawBars = useCallback(
    (ctx: CanvasRenderingContext2D, data: Uint8Array) => {
      const barWidth = width / barCount;
      const centerY = height / 2;

      for (let i = 0; i < barCount; i++) {
        const barHeight = (data[i] / 255) * height * sensitivity;

        // Create gradient for bars
        const gradient = ctx.createLinearGradient(
          0,
          centerY - barHeight / 2,
          0,
          centerY + barHeight / 2
        );
        gradient.addColorStop(0, `${color}66`);
        gradient.addColorStop(0.5, color);
        gradient.addColorStop(1, `${color}66`);

        ctx.fillStyle = gradient;
        ctx.fillRect(
          i * barWidth,
          centerY - barHeight / 2,
          barWidth - 1,
          barHeight
        );
      }
    },
    [width, height, barCount, sensitivity, color]
  );

  const drawCircle = useCallback(
    (ctx: CanvasRenderingContext2D, data: Uint8Array) => {
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) / 3;
      const angleStep = (2 * Math.PI) / barCount;

      ctx.beginPath();
      ctx.arc(centerX, centerY, 2, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();

      for (let i = 0; i < barCount; i++) {
        const amplitude = (data[i] / 255) * radius * sensitivity;
        const barLength = radius + amplitude;

        const angle = i * angleStep;
        const x1 = centerX + radius * Math.cos(angle);
        const y1 = centerY + radius * Math.sin(angle);
        const x2 = centerX + barLength * Math.cos(angle);
        const y2 = centerY + barLength * Math.sin(angle);

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineWidth = 2;
        ctx.strokeStyle = `${color}${Math.floor((data[i] / 255) * 255)
          .toString(16)
          .padStart(2, "0")}`;
        ctx.stroke();
      }
    },
    [width, height, barCount, sensitivity, color]
  );

  const drawWaveform = useCallback(
    (ctx: CanvasRenderingContext2D, data: Uint8Array) => {
      const centerY = height / 2;
      const sliceWidth = width / barCount;

      ctx.beginPath();
      ctx.moveTo(0, centerY);

      for (let i = 0; i < barCount; i++) {
        const amplitude = (data[i] / 255) * height * (sensitivity / 2);
        const y = centerY - amplitude;
        const x = i * sliceWidth;

        ctx.lineTo(x, y);
      }

      for (let i = barCount - 1; i >= 0; i--) {
        const amplitude = (data[i] / 255) * height * (sensitivity / 2);
        const y = centerY + amplitude;
        const x = i * sliceWidth;

        ctx.lineTo(x, y);
      }

      ctx.closePath();

      // Fill with gradient
      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, `${color}99`);
      gradient.addColorStop(0.5, color);
      gradient.addColorStop(1, `${color}99`);

      ctx.fillStyle = gradient;
      ctx.fill();
    },
    [width, height, barCount, sensitivity, color]
  );

  const drawParticles = useCallback(
    (ctx: CanvasRenderingContext2D, data: Uint8Array) => {
      const centerY = height / 2;
      const particleCount = barCount / 2;

      for (let i = 0; i < particleCount; i++) {
        const dataIndex = i * 2;
        const amplitude = (data[dataIndex] / 255) * height * sensitivity;

        // Calculate position based on frequency
        const angle = (i / particleCount) * Math.PI * 2;
        const distance = amplitude / 2;
        const x = width / 2 + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;

        // Size based on amplitude
        const size = (data[dataIndex] / 255) * 10 + 2;

        // Draw particle
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `${color}${Math.floor((data[dataIndex] / 255) * 255)
          .toString(16)
          .padStart(2, "0")}`;
        ctx.fill();

        // Draw connecting lines
        if (i > 0) {
          const prevDataIndex = (i - 1) * 2;
          const prevAmplitude =
            (data[prevDataIndex] / 255) * height * sensitivity;
          const prevAngle = ((i - 1) / particleCount) * Math.PI * 2;
          const prevDistance = prevAmplitude / 2;
          const prevX = width / 2 + Math.cos(prevAngle) * prevDistance;
          const prevY = centerY + Math.sin(prevAngle) * prevDistance;

          ctx.beginPath();
          ctx.moveTo(prevX, prevY);
          ctx.lineTo(x, y);
          ctx.strokeStyle = `${color}44`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    },
    [width, height, barCount, sensitivity, color]
  );

  const draw = useCallback(() => {
    if (!analyser.current || !dataArray.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = width;
    canvas.height = height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Get frequency data
    analyser.current.getByteFrequencyData(dataArray.current);

    // Draw based on variant
    switch (variant) {
      case "circle":
        drawCircle(ctx, dataArray.current);
        break;
      case "waveform":
        drawWaveform(ctx, dataArray.current);
        break;
      case "particles":
        drawParticles(ctx, dataArray.current);
        break;
      default:
        drawBars(ctx, dataArray.current);
    }

    // Continue animation
    animationFrameId.current = requestAnimationFrame(draw);
  }, [
    height,
    variant,
    width,
    drawBars,
    drawCircle,
    drawWaveform,
    drawParticles,
  ]);

  // Initialize audio context and analyzer when audio is loaded
  const setupAudio = useCallback(() => {
    if (!audioRef.current || !canvasRef.current) return;

    // Create audio context
    const AudioContext = window.AudioContext || window.AudioContext;
    audioContext.current = new AudioContext();

    // Create analyzer node
    analyser.current = audioContext.current.createAnalyser();
    analyser.current.fftSize = barCount * 2;

    // Connect audio to analyzer
    source.current = audioContext.current.createMediaElementSource(
      audioRef.current
    );
    source.current.connect(analyser.current);
    analyser.current.connect(audioContext.current.destination);

    // Create data array
    const bufferLength = analyser.current.frequencyBinCount;
    dataArray.current = new Uint8Array(bufferLength);

    // Start drawing
    draw();

    // Start playing if autoplay
    if (autoplay && audioRef.current) {
      audioRef.current
        .play()
        .catch((e) => console.error("Autoplay failed:", e));
    }
  }, [barCount, autoplay, draw]);

  // Play/pause audio
  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioContext.current?.resume().then(() => {
        audioRef.current?.play();
      });
    }

    setIsPlaying(!isPlaying);
  };

  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }

      if (audioContext.current) {
        audioContext.current.close();
      }
    };
  }, []);

  // Set up audio when ref is available
  useEffect(() => {
    // Capture the current value of the ref
    const audioElement = audioRef.current;

    if (audioElement) {
      audioElement.addEventListener("loadeddata", setupAudio);

      return () => {
        // Use the captured value in cleanup
        audioElement.removeEventListener("loadeddata", setupAudio);
      };
    }
  }, [setupAudio]);

  // Track play state
  useEffect(() => {
    // Capture the current value of the ref
    const audioElement = audioRef.current;

    if (audioElement) {
      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);
      const handleEnded = () => setIsPlaying(false);

      audioElement.addEventListener("play", handlePlay);
      audioElement.addEventListener("pause", handlePause);
      audioElement.addEventListener("ended", handleEnded);

      return () => {
        // Use the captured value in cleanup
        audioElement.removeEventListener("play", handlePlay);
        audioElement.removeEventListener("pause", handlePause);
        audioElement.removeEventListener("ended", handleEnded);
      };
    }
  }, []);

  return (
    <div className={twMerge("relative", className)}>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        width={width}
        height={height}
      />

      <audio
        ref={audioRef}
        src={audioUrl}
        controls={controls}
        loop={loop}
        className={controls ? "mt-4 w-full" : "hidden"}
      >
        <track
          kind="captions"
          src={captionUrl || ""}
          srcLang="en"
          label="English captions"
          default={captionsEnabled}
        />
      </audio>

      {!controls && (
        <button
          onClick={togglePlay}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 text-white bg-black/30 backdrop-blur-sm p-3 rounded-full"
          type="button"
        >
          {isPlaying ? (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <title>Pause</title>
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <title>Play</title>
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          )}
        </button>
      )}
    </div>
  );
};
