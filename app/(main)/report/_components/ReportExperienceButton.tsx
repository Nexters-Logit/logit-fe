"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/libs/auth";
import { useLoginModal } from "@/components/common/LoginModalContext";
import { ExperienceModal } from "@/components/common/ExperienceModal";
import { Button } from "@/components/ui/button";

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
      <Button
        type="button"
        onClick={handleClick}
        className="inline-flex items-center justify-center px-5 h-11 rounded-3.5 bg-primary-100 text-body-5-2 text-white hover:bg-primary-80 transition-colors cursor-pointer w-41.25"
      >
        경험 등록
      </Button>
      <ExperienceModal
        open={isExperienceModalOpen}
        onOpenChange={setExperienceModalOpen}
        onSuccess={handleExperienceSuccess}
      />
    </>
  );
}
