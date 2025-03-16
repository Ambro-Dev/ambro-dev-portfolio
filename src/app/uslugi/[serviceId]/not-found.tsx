// src/app/uslugi/[serviceId]/not-found.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { EnhancedButton } from "@/components/ambro-ui/enhanced-button";

export const metadata: Metadata = {
  title: "Usługa nie znaleziona | Ambro",
  description: "Nie mogliśmy znaleźć szukanej usługi.",
};

export default function ServiceNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-4">Usługa nie znaleziona</h1>
      <p className="mb-8 text-gray-400">
        Nie mogliśmy znaleźć szukanej usługi.
      </p>
      <Link href="/uslugi">
        <EnhancedButton variant="tech">Wróć do wszystkich usług</EnhancedButton>
      </Link>
    </div>
  );
}
