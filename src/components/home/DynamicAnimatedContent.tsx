"use client";

import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const LoadingFallback = () => (
  <div className="flex justify-center items-center h-screen">
    <Skeleton className="w-12 h-12 rounded-full" />
  </div>
);

// Dynamiczny import AnimatedContent z wyłączonym SSR
const AnimatedContent = dynamic(
  () => import("@/components/home/AnimatedContent"),
  {
    ssr: false,
  }
);

const DynamicAnimatedContent: React.FC = () => (
  <Suspense fallback={<LoadingFallback />}>
    <AnimatedContent />
  </Suspense>
);

export default DynamicAnimatedContent;
