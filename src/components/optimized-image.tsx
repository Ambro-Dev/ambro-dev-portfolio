"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils"; // Upewnij się, że masz taką funkcję pomocniczą do łączenia klas

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  className?: string;
  sizes?: string;
  fill?: boolean;
  quality?: number;
}

/**
 * Komponent OptimizedImage wykorzystujący nowe funkcje obrazowania w Next.js 15
 * - Automatyczne generowanie BlurDataURL
 * - Inteligentne ładowanie
 * - Obsługa placeholderów
 */
export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  fill = false,
  quality = 80,
}: OptimizedImageProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Sprawdź, czy używamy placeholdera
  const isPlaceholder = src.includes("/api/placeholder/");

  // Automatycznie wygeneruj prawdziwy src, jeśli używamy placeholdera
  // Format: /api/placeholder/800/500 -> /images/placeholder-800x500.webp
  const optimizedSrc = isPlaceholder
    ? (() => {
        const parts = src.split("/");
        const dims = parts.slice(-2);
        return `/images/placeholder-${dims[0]}x${dims[1]}.webp`;
      })()
    : src;

  // Automatycznie wygeneruj BlurDataURL w zależności od proporcji obrazu
  // To jest prosty przykład - w rzeczywistości możesz wygenerować prawdziwe BlurDataURL
  const blurDataUrl = `data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${width} ${height}'%3E%3Crect width='${width}' height='${height}' fill='%23ddd'/%3E%3C/svg%3E`;

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-gray-100 dark:bg-gray-800",
        loading ? "animate-pulse" : "",
        className
      )}
      style={!fill ? { width, height } : undefined}
    >
      <Image
        src={error ? "/images/error-placeholder.webp" : optimizedSrc}
        alt={alt}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        fill={fill}
        sizes={sizes}
        quality={quality}
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        placeholder="blur"
        blurDataURL={blurDataUrl}
        className={cn(
          "object-cover transition-opacity duration-300",
          loading ? "opacity-0" : "opacity-100"
        )}
        onLoadingComplete={() => setLoading(false)}
        onError={() => {
          setError(true);
          setLoading(false);
        }}
      />
    </div>
  );
}
