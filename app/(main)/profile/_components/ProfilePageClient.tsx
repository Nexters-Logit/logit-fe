"use client";

import { useIsMobile } from "@/app/_hooks/useIsMobile";
import { ProfilePageWeb } from "./ProfilePageWeb";
import { ProfilePageMobile } from "./ProfilePageMobile";

export function ProfilePageClient() {
  const isMobile = useIsMobile();

  if (isMobile === null) return null;

  return isMobile ? <ProfilePageMobile /> : <ProfilePageWeb />;
}
