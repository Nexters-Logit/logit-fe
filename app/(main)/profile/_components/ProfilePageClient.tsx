"use client";

import { useIsMobile } from "@/app/_hooks/useIsMobile";
import { AccountPageWeb } from "./AccountPageWeb";
import { ProfilePageMobile } from "./ProfilePageMobile";

export function ProfilePageClient() {
  const isMobile = useIsMobile();

  if (isMobile === null) return null;

  return isMobile ? <ProfilePageMobile /> : <AccountPageWeb />;
}
