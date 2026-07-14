"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { getAccessToken } from "@/libs/auth";
import { useLoginModal } from "@/app/_components/LoginModalContext";
import { GuestReportPreview } from "./GuestReportPreview";
import { GUEST_REPORT_DATASETS } from "@/app/_data/guestReportData";

interface ReportPageGuardProps {
  children: ReactNode;
}

export function ReportPageGuard({ children }: ReportPageGuardProps) {
  const { setLoginModalOpen } = useLoginModal();
  const [mounted, setMounted] = useState(false);
  const [guestDataIndex] = useState(
    () => Math.floor(Math.random() * GUEST_REPORT_DATASETS.length),
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || typeof document === "undefined") return;
    if (!getAccessToken()) {
      setLoginModalOpen(true);
    }
  }, [mounted, setLoginModalOpen]);

  if (!mounted) {
    return null;
  }

  if (!getAccessToken()) {
    return (
      <GuestReportPreview
        dataIndex={guestDataIndex}
        onLoginClick={() => setLoginModalOpen(true)}
      />
    );
  }

  return <>{children}</>;
}
