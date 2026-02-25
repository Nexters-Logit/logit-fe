"use client";

import { ReportChartCard } from "./ReportChartCard";
import { TypeCountsBarChart, type TypeCount } from "./TypeCountsBarChart";
import {
  CategoryCountsDonutChart,
  type CategoryCount,
} from "./CategoryCountsDonutChart";
import { ExperienceBarChart, type TagCount } from "./ExperienceBarChart";
import { useExperienceSummary } from "@/app/_hooks/useExperienceSummary";

export function ExperienceAnalysisSection() {
  const { data } = useExperienceSummary();

  const typeCounts = (data?.type_counts ?? []) as TypeCount[];
  const categoryCounts = (data?.category_counts ?? []) as CategoryCount[];
  const tagCounts = (data?.tag_counts ?? []) as TagCount[];

  const getTypeLabel = (item: TypeCount) =>
    "type" in item
      ? item.type
      : "category" in item
        ? item.category
        : "tag" in item
          ? item.tag
          : "";

  const topTypeItem = typeCounts.length
    ? typeCounts.reduce((a, b) => (a.count >= b.count ? a : b))
    : null;
  const bottomTypeItem = typeCounts.length
    ? typeCounts.reduce((a, b) => (a.count <= b.count ? a : b))
    : null;
  const topTypeLabel = topTypeItem
    ? getTypeLabel(topTypeItem)
    : "최다 경험 유형";
  const bottomTypeLabel = bottomTypeItem
    ? getTypeLabel(bottomTypeItem)
    : "최소 경험 유형";

  const topCategoryItem = categoryCounts.length
    ? categoryCounts.reduce((a, b) => (a.count >= b.count ? a : b))
    : null;
  const topCategoryLabel = topCategoryItem
    ? topCategoryItem.category
    : "최다 해쉬태그";

  const topTagItem = tagCounts.length
    ? tagCounts.reduce((a, b) => (a.count >= b.count ? a : b))
    : null;
  const topTagLabel = topTagItem ? topTagItem.tag : "최다 해쉬태그";
  return (
    <section className="mb-16">
      <h2 className="text-title-2-2 text-gray-400 mb-5">경험 분석</h2>
      {/* 1104px 패널 (고정 폭) */}
      <div className="flex gap-4 p-5 rounded-7.5 bg-gray-20 border border-gray-70 mx-auto">
        {/* 343px 카드들 (고정 폭/높이, flex-shrink: 0) */}
        <ReportChartCard
          iconSrc="/icons/report-experience.svg"
          iconAlt="경험 유형 아이콘"
          title={`${topTypeLabel} 경험이 두드러져요`}
          description={`${bottomTypeLabel} 경험을 보완하면 더 균형 잡힌 역량의 인재로 보일 수 있어요!`}
          data={typeCounts}
        >
          <TypeCountsBarChart data={typeCounts} />
        </ReportChartCard>
        <ReportChartCard
          iconSrc="/icons/report-tag.svg"
          iconAlt="해쉬태그 아이콘"
          title={`${topCategoryLabel}에 강점이 있어요.`}
          description="{카테고리 별 지정멘트}"
          data={categoryCounts}
        >
          <CategoryCountsDonutChart data={categoryCounts} />
        </ReportChartCard>
        <ReportChartCard
          iconSrc="/icons/report-category.svg"
          iconAlt="카테고리 아이콘"
          title={`${topTagLabel}이 가장 많아요`}
          description="{ 각 해쉬태그 별 전문성을 강조하는 지정 멘트 }"
          data={tagCounts}
        >
          <ExperienceBarChart data={tagCounts} />
        </ReportChartCard>
      </div>
    </section>
  );
}
