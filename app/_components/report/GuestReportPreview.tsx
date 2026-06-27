"use client";

import { ReportChartCard } from "./ReportChartCard";
import { TypeCountsBarChart } from "./TypeCountsBarChart";
import { CategoryCountsDonutChart } from "./CategoryCountsDonutChart";
import { ExperienceBarChart } from "./ExperienceBarChart";
import { GUEST_REPORT_DATASETS } from "@/app/_data/guestReportData";

type GuestReportPreviewProps = {
  dataIndex: number;
  onLoginClick: () => void;
};

export function GuestReportPreview({
  dataIndex,
  onLoginClick,
}: GuestReportPreviewProps) {
  const { categoryCounts, tagCounts, typeCounts } =
    GUEST_REPORT_DATASETS[dataIndex % GUEST_REPORT_DATASETS.length];

  const topCategory = categoryCounts.reduce((a, b) =>
    a.count >= b.count ? a : b,
  );
  const topCategoryLabel =
    "category" in topCategory ? topCategory.category : "";

  const topTag = tagCounts[0]?.tag ?? "역량 키워드";

  const topType = typeCounts.reduce((a, b) => (a.count >= b.count ? a : b));
  const topTypeLabel = "type" in topType ? topType.type : "";

  return (
    <main className="w-full mx-auto p-10 pb-25 flex-1 overflow-y-auto scrollbar-hide">
      <div className="w-276 mx-auto relative">
        <h1 className="text-headline-1 text-gray-400 mb-8">경험분석 리포트</h1>

        <section className="mb-16">
          <h2 className="text-title-2-2 text-gray-400 mb-5">경험 분석</h2>
          <div className="flex gap-4 p-5 rounded-7.5 bg-gray-20 border border-gray-70 mx-auto">
            <ReportChartCard
              iconSrc="/icons/report-experience.svg"
              iconAlt="경험 유형 아이콘"
              title={`${topCategoryLabel} 경험이 두드러져요`}
              emptyTitle="핵심 역량"
              description="나의 핵심 역량 분포를 한눈에 확인하세요."
              data={categoryCounts}
            >
              <TypeCountsBarChart data={categoryCounts} />
            </ReportChartCard>

            <ReportChartCard
              iconSrc="/icons/report-tag.svg"
              iconAlt="해쉬태그 아이콘"
              title={`${topTag}에 강점이 있어요.`}
              emptyTitle="역량 키워드"
              description="자주 등장하는 역량 키워드를 확인해보세요."
              data={tagCounts}
            >
              <CategoryCountsDonutChart data={tagCounts} />
            </ReportChartCard>

            <ReportChartCard
              iconSrc="/icons/report-category.svg"
              iconAlt="카테고리 아이콘"
              emptyTitle="활동 이력"
              title={`${topTypeLabel}이 가장 많아요`}
              description="경험 유형별 활동 이력을 확인해보세요."
              data={typeCounts}
            >
              <ExperienceBarChart data={typeCounts} />
            </ReportChartCard>
          </div>
        </section>

        {/* 로그인 유도 오버레이 */}
        <div className="absolute inset-x-0 bottom-0 top-24 flex flex-col items-center justify-end pb-8 bg-gradient-to-b from-transparent via-white/60 to-white pointer-events-none">
          <div className="pointer-events-auto flex flex-col items-center gap-5">
            <p className="semibold_22 text-gray-400">로그인 후 이용해보세요</p>
            <button
              type="button"
              onClick={onLoginClick}
              className="flex items-center justify-center rounded-3.5 bg-primary-300 text-white py-3 px-8 semibold_16 cursor-pointer hover:bg-primary-200 transition-colors"
            >
              로그인하기
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
