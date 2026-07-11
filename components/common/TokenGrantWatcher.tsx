"use client";

import { useTokenGrantToasts } from "@/app/_hooks/useTokenGrantToasts";

export function TokenGrantWatcher() {
  useTokenGrantToasts();
  return null;
}
