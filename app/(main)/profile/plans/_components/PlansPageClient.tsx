"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/app/_hooks/useIsMobile";
import { PlansPageMobile } from "./PlansPageMobile";

export function PlansPageClient() {
  const isMobile = useIsMobile();
  const router = useRouter();

  useEffect(() => {
    if (isMobile === false) {
      router.replace("/profile");
    }
  }, [isMobile, router]);

  if (isMobile === null || isMobile === false) return null;

  return <PlansPageMobile />;
}
