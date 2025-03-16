/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  type FC,
  type ReactNode,
  useMemo,
  memo,
  useRef,
  useEffect,
  useState,
} from "react";
import { motion, useAnimationControls, useInView } from "framer-motion";
import { twMerge } from "tailwind-merge";
import type { JSX } from "react/jsx-runtime";

// Fix HTMLElementType by using specific element types
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type ElementType = keyof JSX.IntrinsicElements | React.ComponentType<any>;

// Preset gradients optimized for tech/DevOps/AI themes
const GRADIENT_PRESETS = {
  // DevOps theme gradients
  devops: "from-sky-500 via-blue-500 to-cyan-500",
  cloud: "from-sky-400 via-cyan-400 to-blue-500",
  deployment: "from-blue-500 via-sky-500 to-indigo-500",
  kubernetes: "from-blue-500 via-sky-400 to-blue-600",

  // AI/ML theme gradients
  ai: "from-purple-500 via-indigo-500 to-blue-500",
  ml: "from-indigo-600 via-purple-500 to-pink-500",
  neural: "from-fuchsia-500 via-purple-500 to-indigo-500",
  data: "from-emerald-500 via-teal-500 to-cyan-500",

  // Tech theme gradients
  tech: "from-indigo-500 via-purple-500 to-pink-500",
  code: "from-emerald-500 via-teal-500 to-blue-500",
  cyber: "from-blue-500 via-indigo-500 to-purple-500",
  digital: "from-cyan-500 via-blue-500 to-indigo-500",

  // Modern/Vibrant theme
  modern: "from-sky-400 via-indigo-500 to-purple-500",
  vibrant: "from-pink-500 via-purple-500 to-indigo-500",
  elegant: "from-gray-200 via-gray-100 to-gray-300",
  dark: "from-gray-700 via-gray-800 to-gray-900",
};

// Predefined glow effects
const GLOW_PRESETS = {
  soft: { intensity: 10, blur: 10, opacity: 0.6 },
  medium: { intensity: 15, blur: 15, opacity: 0.7 },
  strong: { intensity: 20, blur: 20, opacity: 0.8 },
  intense: { intensity: 25, blur: 25, opacity: 0.9 },
  neon: { intensity: 30, blur: 15, opacity: 1 },
};

/**
 * GradientText Component
 *
 * Creates text with gradient color effects and optional animations.
 *
 * @param children - Text content
 * @param className - Additional CSS classes
 * @param from - Starting gradient color (Tailwind color class name)
 * @param via - Middle gradient color (Tailwind color class name)
 * @param to - Ending gradient color (Tailwind color class name)
 * @param animated - Enable gradient animation
 * @param duration - Animation duration in seconds
 * @param angle - Gradient angle in degrees
 * @param fontSize - Font size (CSS value)
 * @param fontWeight - Font weight (CSS value)
 * @param letterSpacing - Letter spacing (CSS value)
 * @param glowEffect - Enable text glow effect
 * @param glowColor - Color of the glow effect
 * @param glowIntensity - Intensity of the glow (0-30)
 * @param backgroundSize - Background size for the gradient
 * @param as - HTML element to render as
 * @param preset - Use a predefined gradient preset
 * @param pauseOnHover - Pause animation on hover
 * @param glowPreset - Use a predefined glow preset
 * @param textShadow - Add text shadow effect
 * @param animateOnView - Only animate when in viewport
 */
export const GradientText: FC<{
  children: ReactNode;
  className?: string;
  from?: string;
  via?: string;
  to?: string;
  animated?: boolean;
  duration?: number;
  angle?: number;
  fontSize?: string;
  fontWeight?: string;
  letterSpacing?: string;
  glowEffect?: boolean;
  glowColor?: string;
  glowIntensity?: number;
  backgroundSize?: string;
  as?: ElementType;
  preset?: keyof typeof GRADIENT_PRESETS | string;
  pauseOnHover?: boolean;
  glowPreset?: keyof typeof GLOW_PRESETS | string;
  textShadow?: string | boolean;
  animateOnView?: boolean;
}> = memo(
  ({
    children,
    className = "",
    from = "blue-600",
    via = "purple-600",
    to = "pink-600",
    animated = true,
    duration = 15,
    angle = 45,
    fontSize,
    fontWeight = "inherit",
    letterSpacing,
    glowEffect = false,
    glowColor,
    glowIntensity = 15,
    backgroundSize = "200% 100%",
    as = "span",
    preset,
    pauseOnHover = false,
    glowPreset,
    textShadow = false,
    animateOnView = false,
    ...props
  }) => {
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: false, amount: 0.5 });
    const controls = useAnimationControls();
    const [isHovered, setIsHovered] = useState(false);

    // Apply preset gradients if specified
    const gradientClasses = useMemo(() => {
      if (preset && preset in GRADIENT_PRESETS) {
        return `bg-gradient-to-r ${
          GRADIENT_PRESETS[preset as keyof typeof GRADIENT_PRESETS]
        } bg-clip-text text-transparent inline-block`;
      }
      return `bg-gradient-to-r from-${from} via-${via} to-${to} bg-clip-text text-transparent inline-block`;
    }, [from, via, to, preset]);

    // Apply glow presets if specified
    const getGlowSettings = useMemo(() => {
      if (glowPreset && glowPreset in GLOW_PRESETS) {
        const preset = GLOW_PRESETS[glowPreset as keyof typeof GLOW_PRESETS];
        return {
          intensity: preset.intensity,
          blur: preset.blur,
          opacity: preset.opacity,
        };
      }
      return {
        intensity: glowIntensity,
        blur: glowIntensity,
        opacity: 0.8,
      };
    }, [glowIntensity, glowPreset]);

    // Handle gradient colors for glow
    const getGlowColor = useMemo(() => {
      if (glowColor) return glowColor;

      if (preset && preset in GRADIENT_PRESETS) {
        // Extract from color from the preset
        const presetClasses =
          GRADIENT_PRESETS[preset as keyof typeof GRADIENT_PRESETS];
        const fromColorMatch = presetClasses.match(/from-([a-z]+-[0-9]+)/);
        if (fromColorMatch?.[1]) {
          const colorParts = fromColorMatch[1].split("-");
          const colorName = colorParts[0];
          const colorIntensity = Number.parseInt(colorParts[1]);

          // Map Tailwind color names to approximate RGB values
          const colorMap: Record<string, string> = {
            sky: "rgb(56, 189, 248)",
            blue: "rgb(59, 130, 246)",
            indigo: "rgb(99, 102, 241)",
            purple: "rgb(168, 85, 247)",
            pink: "rgb(236, 72, 153)",
            emerald: "rgb(16, 185, 129)",
            teal: "rgb(20, 184, 166)",
            cyan: "rgb(6, 182, 212)",
            fuchsia: "rgb(232, 121, 249)",
            gray:
              colorIntensity > 500 ? "rgb(75, 85, 99)" : "rgb(209, 213, 219)",
          };

          return colorName in colorMap ? colorMap[colorName] : "currentColor";
        }
      }

      return "var(--tw-gradient-from)";
    }, [glowColor, preset]);

    // Memoize gradient style
    const gradientStyle = useMemo(() => {
      // Initialize textShadowCSS with undefined
      let textShadowCSS: string | undefined = undefined;

      if (glowEffect) {
        const { blur, opacity } = getGlowSettings;
        const color = getGlowColor;

        // Create a color with opacity if it's rgb format
        const glowColorWithOpacity = color.startsWith("rgb")
          ? color.replace(")", `, ${opacity})`).replace("rgb", "rgba")
          : color;

        textShadowCSS = `0 0 ${blur}px ${glowColorWithOpacity}`;
      } else if (textShadow === true) {
        textShadowCSS = "2px 2px 4px rgba(0, 0, 0, 0.3)";
      } else if (typeof textShadow === "string") {
        textShadowCSS = textShadow;
      }

      return {
        backgroundSize,
        fontWeight,
        letterSpacing,
        fontSize,
        // Only calculate custom gradient angle if not the default 45 degrees
        backgroundImage:
          angle !== 45
            ? `linear-gradient(${angle}deg, var(--tw-gradient-from), var(--tw-gradient-via), var(--tw-gradient-to))`
            : undefined,
        // Only include textShadow if it's defined
        ...(textShadowCSS ? { textShadow: textShadowCSS } : {}),
        // Add will-change for better performance with animations
        willChange: animated ? "background-position" : undefined,
      };
    }, [
      backgroundSize,
      fontWeight,
      letterSpacing,
      fontSize,
      angle,
      glowEffect,
      getGlowSettings,
      getGlowColor,
      animated,
      textShadow,
    ]);

    // Handle animation control based on hover state and view state
    useEffect(() => {
      // Determine if we should be animating
      const shouldAnimate =
        animated &&
        (!pauseOnHover || (pauseOnHover && !isHovered)) &&
        (!animateOnView || (animateOnView && isInView));

      if (shouldAnimate) {
        controls.start({
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          transition: {
            duration,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          },
        });
      } else {
        controls.stop();
      }

      return () => {
        controls.stop();
      };
    }, [
      controls,
      animated,
      pauseOnHover,
      isHovered,
      animateOnView,
      isInView,
      duration,
    ]);

    // Memoize combined class names
    const combinedClasses = useMemo(
      () => twMerge(gradientClasses, className),
      [gradientClasses, className]
    );

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const Component = as as any;

    // Mouse event handlers for hover state
    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    // Render with or without animation
    if (animated) {
      return (
        <motion.span
          ref={ref}
          className={combinedClasses}
          style={gradientStyle}
          animate={controls}
          onMouseEnter={pauseOnHover ? handleMouseEnter : undefined}
          onMouseLeave={pauseOnHover ? handleMouseLeave : undefined}
          // Improve accessibility by adding appropriate role
          role={typeof children === "string" ? "text" : undefined}
        >
          {children}
        </motion.span>
      );
    }

    return (
      <Component
        ref={ref}
        className={combinedClasses}
        style={gradientStyle}
        // Improve accessibility by adding appropriate role for non-span elements
        role={
          Component !== "span" && typeof children === "string"
            ? "text"
            : undefined
        }
        {...props}
      >
        {children}
      </Component>
    );
  }
);

// Add display name for better debugging
GradientText.displayName = "GradientText";

export default GradientText;
