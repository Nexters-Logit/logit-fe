"use client";

import { ReportChartCard } from "./ReportChartCard";
import { TypeCountsBarChart } from "./TypeCountsBarChart";

const MOCK_TYPE_COUNTS = [
  { type: "도전", count: 4 },
  { type: "협업", count: 3 },
  { type: "리더십", count: 2 },
  { type: "문제해결", count: 1 },
  { type: "리더십", count: 2 },
  { type: "문제해결", count: 1 },
];

export function ExperienceAnalysisSection() {
  return (
    <section className="mb-16">
      <h2 className="text-title-2-2 text-gray-400 mb-5">경험 분석</h2>
      {/* 1104px 패널 (고정 폭) */}
      <div className="flex gap-5 w-[1104px] px-7.5 py-5 rounded-7.5 bg-gray-20 border border-gray-70 mx-auto">
        {/* 343px 카드들 (고정 폭/높이, flex-shrink: 0) */}
        <ReportChartCard
          iconSrc="/icons/report-experience.svg"
          iconAlt="경험 유형 아이콘"
          title="최다 경험 유형이 두드러져요"
          description="최소 경험 유형을 보완하면 더 균형 잡힌 역량의 인재로 보일 수 있어요!"
        >
          <TypeCountsBarChart data={MOCK_TYPE_COUNTS} />
        </ReportChartCard>
        <ReportChartCard
          iconSrc="/icons/report-tag.svg"
          iconAlt="해쉬태그 아이콘"
          title="최다 해쉬태그에 강점이 있어요"
          description="각 해쉬태그 별 전문성을 강조하는 지정 멘트"
        >
          <div>2</div>
        </ReportChartCard>
        <ReportChartCard
          iconSrc="/icons/report-category.svg"
          iconAlt="카테고리 아이콘"
          title="최다 경험 종류이 가장 많아요"
          description="카테고리 별 지정멘트"
        >
          <div>3</div>
        </ReportChartCard>
      </div>
    </section>
  );
}
