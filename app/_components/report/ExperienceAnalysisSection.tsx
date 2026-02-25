"use client";

import { ReportChartCard } from "./ReportChartCard";
import { TypeCountsBarChart } from "./TypeCountsBarChart";
import {
  CategoryCountsDonutChart,
  type CategoryCount,
} from "./CategoryCountsDonutChart";
import { ExperienceBarChart, type TagCount } from "./ExperienceBarChart";

const MOCK_TYPE_COUNTS = [
  { type: "도전", count: 4 },
  { type: "협업", count: 3 },
  { type: "리더십", count: 2 },
  { type: "문제해결", count: 1 },
  { type: "유대", count: 2 },
  { type: "공유", count: 1 },
];

const MOCK_CATEGORY_COUNTS: CategoryCount[] = [
  { category: "카테고리 A", count: 33 },
  { category: "카테고리 B", count: 29 },
  { category: "카테고리 C", count: 22 },
  { category: "카테고리 D", count: 13 },
  { category: "카테고리 E", count: 5 },
  { category: "카테고리 F", count: 2 },
];

const MOCK_TAG_COUNTS: TagCount[] = [
  { tag: "문제해결", count: 80 },
  { tag: "협업", count: 72 },
  { tag: "소통", count: 62 },
  { tag: "성장", count: 24 },
  { tag: "주도성", count: 12 },
  { tag: "책임감", count: 4 },
];

export function ExperienceAnalysisSection() {
  return (
    <section className="mb-16">
      <h2 className="text-title-2-2 text-gray-400 mb-5">경험 분석</h2>
      {/* 1104px 패널 (고정 폭) */}
      <div className="flex gap-4 p-5 rounded-7.5 bg-gray-20 border border-gray-70 mx-auto">
        {/* 343px 카드들 (고정 폭/높이, flex-shrink: 0) */}
        <ReportChartCard
          iconSrc="/icons/report-experience.svg"
          iconAlt="경험 유형 아이콘"
          title="최다 경험 유형이 두드러져요"
          description="최소 경험 유형을 보완하면 더 균형 잡힌 역량의 인재로 보일 수 있어요!"
          data={MOCK_TYPE_COUNTS}
        >
          <TypeCountsBarChart data={MOCK_TYPE_COUNTS} />
        </ReportChartCard>
        <ReportChartCard
          iconSrc="/icons/report-tag.svg"
          iconAlt="해쉬태그 아이콘"
          title="최다 해쉬태그에 강점이 있어요"
          description="{ 각 해쉬태그 별 전문성을 강조하는 지정 멘트 }"
          data={MOCK_CATEGORY_COUNTS}
        >
          <CategoryCountsDonutChart data={MOCK_CATEGORY_COUNTS} />
        </ReportChartCard>
        <ReportChartCard
          iconSrc="/icons/report-category.svg"
          iconAlt="카테고리 아이콘"
          title="{최다 경험 종류}이 가장 많아요"
          description="{카테고리 별 지정멘트}"
          data={MOCK_TAG_COUNTS}
        >
          <ExperienceBarChart data={MOCK_TAG_COUNTS} />
        </ReportChartCard>
      </div>
    </section>
  );
}
