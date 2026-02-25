"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/libs/auth";
import { useLoginModal } from "../LoginModalContext";
import { ExperienceModal } from "../ExperienceModal";

export function ReportExperienceButton() {
  const router = useRouter();
  const [isExperienceModalOpen, setExperienceModalOpen] = useState(false);
  const { setLoginModalOpen } = useLoginModal();

  const handleClick = () => {
    if (getAccessToken()) {
      setExperienceModalOpen(true);
    } else {
      setLoginModalOpen(true);
    }
  };

  const handleExperienceSuccess = () => {
    setExperienceModalOpen(false);
    router.refresh();
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className="inline-flex items-center justify-center px-5 h-11 rounded-3.5 bg-primary-100 text-body-5-2 text-white hover:bg-primary-80 transition-colors cursor-pointer"
      >
        경험 등록
      </button>
      <ExperienceModal
        open={isExperienceModalOpen}
        onOpenChange={setExperienceModalOpen}
        onSuccess={handleExperienceSuccess}
      />
    </>
  );
}

