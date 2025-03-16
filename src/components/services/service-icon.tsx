"use client";

// Importy ikon z lucide-react
import {
  Server,
  Shield,
  Cloud,
  Database,
  Cog,
  Users,
  BarChart,
  Code,
  Github,
} from "lucide-react";

// Prop types dla komponentu
interface ServiceIconProps {
  serviceId: string;
  size?: number;
  className?: string;
}

// Mapowanie ID usług na komponenty ikon
const serviceIconMap = {
  servers: Server,
  security: Shield,
  cloud: Cloud,
  databases: Database,
  automation: Cog,
  support: Users,
  monitoring: BarChart,
  webapps: Code,
  architecture: Github,
};

export default function ServiceIcon({
  serviceId,
  size = 6,
  className = "",
}: ServiceIconProps) {
  // Sprawdzamy czy istnieje ikona dla danego ID usługi
  const IconComponent =
    serviceIconMap[serviceId as keyof typeof serviceIconMap] || Cog; // Domyślnie Cog

  // Obsługa size
  const sizeInRem = size / 4; // Konwersja jednostek Tailwind na rem

  return (
    <IconComponent
      className={`text-indigo-400 ${className}`}
      style={{ width: `${sizeInRem}rem`, height: `${sizeInRem}rem` }}
      aria-hidden="true"
    />
  );
}
