"use client";

import StatusEmpty from "@/components/StatusEmpty";
import type { Experience } from "@/types/api";
import { useUserMe } from "@/app/_hooks/useUserMe";
import { ReportExperienceRow } from "./ReportExperienceRow";

interface ReportExperienceListProps {
  experiences: Experience[];
  hasToken: boolean;
}

export function ReportExperienceList({
  experiences,
  hasToken,
}: ReportExperienceListProps) {
  const { data: user } = useUserMe();
  const displayName = user?.full_name ? `${user.full_name}님의` : "사용자님의";
  if (!hasToken) {
    return (
      <div className="mt-5 flex justify-center py-10">
        <StatusEmpty message="로그인하고 경험 목록을 확인해보세요." />
      </div>
    );
  }

  if (experiences.length === 0) {
    return (
      <div className="mt-5 flex justify-center py-10">
        <StatusEmpty message={`${displayName} 경험을 등록해보세요.`} />
      </div>
    );
  }

  return (
    <div className="mt-5">
      {/* 테이블 헤더 */}
      {experiences.map((experience) => (
        <ReportExperienceRow
          key={experience.id}
          experience={experience}
          onClick={() => {}}
        />
      ))}
    </div>
  );
}
