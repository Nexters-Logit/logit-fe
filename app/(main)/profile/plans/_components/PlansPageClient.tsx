"use client";

import { useIsMobile } from "@/app/_hooks/useIsMobile";
import { PlansPageWeb } from "./PlansPageWeb";
import { PlansPageMobile } from "./PlansPageMobile";

export function PlansPageClient() {
  const isMobile = useIsMobile();

  if (isMobile === null) return null;

  return isMobile ? <PlansPageMobile /> : <PlansPageWeb />;
}
