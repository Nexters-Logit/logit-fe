"use client";

import { useUserMe } from "@/app/_hooks/useUserMe";

export function ReportPageTitle() {
  const { data: user } = useUserMe();
  console.log(user);
  const displayName = user?.full_name ? `${user.full_name}님의` : "사용자님의";

  return (
    <h1 className="text-headline-1 text-gray-400 mb-8">
      {displayName} 경험분석 리포트
    </h1>
  );
}
