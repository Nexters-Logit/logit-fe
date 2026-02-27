"use client";

import { ReportChartCard } from "./ReportChartCard";
import { TypeCountsBarChart, type TypeCount } from "./TypeCountsBarChart";
import {
  CategoryCountsDonutChart,
  type TagCount,
} from "./CategoryCountsDonutChart";
import { ExperienceBarChart } from "./ExperienceBarChart";
import { ExperienceAnalysisSkeleton } from "./ExperienceAnalysisSkeleton";
import { useExperienceSummary } from "@/app/_hooks/useExperienceSummary";
import { EXPERIENCE_CATEGORY, EXPERIENCE_TYPE } from "@/types/api";

/** 해쉬태그 별 지정 멘트: 최다 역량 키워드(category) 기반 */
const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  [EXPERIENCE_CATEGORY.CUSTOMER_VALUE]:
    "고객 가치 지향 역량을 기반으로 고객의 마음을 사로잡고 성과를 만들어내는 마케터입니다.",
  [EXPERIENCE_CATEGORY.TECHNICAL_EXPERTISE]:
    "기술적 전문성을 바탕으로 복잡한 문제를 해결하는 기술 전문가입니다.",
  [EXPERIENCE_CATEGORY.COLLABORATIVE_COMMUNICATION]:
    "업무의 기초가 되는 협력적 소통 역량이 탄탄하게 갖춰져 있습니다.",
  [EXPERIENCE_CATEGORY.PROACTIVE_EXECUTION]:
    "업무의 기초가 되는 주도적 실행력이 탄탄하게 갖춰져 있습니다.",
  [EXPERIENCE_CATEGORY.LOGICAL_ANALYSIS]:
    "논리적 분석력을 발휘하여 비즈니스 모델과 서비스의 방향을 결정하는 기획자입니다.",
  [EXPERIENCE_CATEGORY.CREATIVE_PROBLEM_SOLVING]:
    "창의적 문제해결을 통해 사용자 중심의 가치를 시각적으로 구현하는 디자이너입니다.",
  [EXPERIENCE_CATEGORY.FLEXIBLE_ADAPTABILITY]:
    "유연한 적응력을 통해 서비스 안정성을 높이고 조직의 성장을 돕는 조율자입니다.",
  [EXPERIENCE_CATEGORY.PERSISTENT_RESPONSIBILITY]:
    "업무의 기초가 되는 끈기있는 책임감이 탄탄하게 갖춰져 있습니다.",
};

/** 카테고리 별 지정 멘트: 최다 경험 유형(type) 기반 */
const TYPE_DESCRIPTIONS: Record<string, string> = {
  [EXPERIENCE_TYPE.PART_TIME]:
    "서비스 현장에서 고객과 직접 소통하며 쌓은 실전 감각이 돋보입니다.",
  [EXPERIENCE_TYPE.FULL_TIME]:
    "풍부한 실무 경험을 바탕으로 조직의 성과를 이끌어온 준비된 전문가입니다.",
  [EXPERIENCE_TYPE.INTERN]:
    "실무 현장을 직접 경험하며 조직의 시스템과 업무 흐름을 빠르게 익혔습니다.",
  [EXPERIENCE_TYPE.CONTRACT]:
    "주어진 기간 내에 목표를 완수하며 실무 역량과 책임감을 입증해왔습니다.",
  [EXPERIENCE_TYPE.VOLUNTEER]:
    "사회적 가치를 실현하고 타인을 배려하며 쌓은 선한 영향력이 느껴집니다.",
  [EXPERIENCE_TYPE.CLUB]:
    "동료들과 공동의 목표를 향해 협력하며 팀워크의 가치를 경험했습니다.",
  [EXPERIENCE_TYPE.RESEARCH]:
    "특정 분야를 깊이 있게 탐구하고 분석하여 학술적 전문성을 쌓아왔습니다.",
  [EXPERIENCE_TYPE.AWARD]:
    "치열한 경쟁 속에서 남다른 성과를 내며 객관적인 역량의 우수성을 증명했습니다.",
  [EXPERIENCE_TYPE.MILITARY]:
    "엄격한 환경 속에서도 맡은 임무를 성실히 수행하며 강한 책임감을 길렀습니다.",
  [EXPERIENCE_TYPE.PERSONAL]:
    "스스로 목표를 설정하고 끝까지 완수해낸 자기주도적 실행력이 훌륭합니다.",
};

// 리포트 차트에서 사용할 카테고리 표시 순서 (고정 6개)
const CATEGORY_ORDER: string[] = [
  EXPERIENCE_CATEGORY.TECHNICAL_EXPERTISE,
  EXPERIENCE_CATEGORY.CUSTOMER_VALUE,
  EXPERIENCE_CATEGORY.COLLABORATIVE_COMMUNICATION,
  EXPERIENCE_CATEGORY.PROACTIVE_EXECUTION,
  EXPERIENCE_CATEGORY.LOGICAL_ANALYSIS,
  EXPERIENCE_CATEGORY.CREATIVE_PROBLEM_SOLVING,
];

// 리포트 차트에서 사용할 경험 유형(type) 표시 순서 (고정 6개, Figma 기준)
const TYPE_ORDER: string[] = [
  EXPERIENCE_TYPE.INTERN,
  EXPERIENCE_TYPE.FULL_TIME,
  EXPERIENCE_TYPE.PART_TIME,
  EXPERIENCE_TYPE.VOLUNTEER,
  EXPERIENCE_TYPE.CLUB,
  EXPERIENCE_TYPE.PERSONAL,
];

export function ExperienceAnalysisSection() {
  const { data, isLoading } = useExperienceSummary();
  if (isLoading) return <ExperienceAnalysisSkeleton />;
  console.log(data);

  const rawTypeCounts = (data?.type_counts ?? []) as TypeCount[];
  const rawCategoryCounts = (data?.category_counts ?? []) as TypeCount[];
  // 카테고리 막대는 항상 6개를 고정 순서로 보여주기 위해 부족한 카테고리는 count 0으로 채운다.
  const categoryCounts: TypeCount[] = CATEGORY_ORDER.map((category) => {
    const found = rawCategoryCounts.find((item) => item.category === category);
    return found ?? ({ category, count: 0 } as TypeCount);
  });
  const typeCounts: TypeCount[] = TYPE_ORDER.map((type) => {
    const found = rawTypeCounts.find(
      (item) => "type" in item && item.type === type,
    );
    return (found ?? { type, count: 0 }) as TypeCount;
  });

  const rawTagCounts = (data?.tag_counts ?? []) as TagCount[];
  const tagCounts = rawTagCounts.slice(0, 6);

  const topTypeItem = typeCounts.length
    ? typeCounts.reduce((a, b) => (a.count >= b.count ? a : b))
    : null;
  const bottomTypeItem = typeCounts.length
    ? typeCounts.reduce((a, b) => (a.count <= b.count ? a : b))
    : null;
  const topTypeLabel = topTypeItem?.type ?? "최다 경험 유형";
  const bottomTypeLabel = bottomTypeItem?.type ?? "최소 경험 유형";

  const topCategoryItem = categoryCounts.length
    ? categoryCounts.reduce((a, b) => (a.count >= b.count ? a : b))
    : null;

  const bottomCategoryItem = categoryCounts.length
    ? categoryCounts.reduce((a, b) => (a.count <= b.count ? a : b))
    : null;

  const totalCategoryCount = categoryCounts.reduce(
    (sum, item) => sum + item.count,
    0,
  );
  const topTagItem = tagCounts.length
    ? tagCounts.reduce((a, b) => (a.count >= b.count ? a : b))
    : null;
  const topTagLabel = topTagItem?.tag ?? "최다 해쉬태그";

  const categoryDescription =
    totalCategoryCount > 3
      ? `현재 ${bottomCategoryItem?.category} 관련 경험이 적은 편이에요. 이 부분을 보완하면 더 입체적인 자소서가 될 거예요!`
      : `현재 경험 유형이 ${topCategoryItem?.category} 중심으로 구성되어 있어요. 경험 유형을 다양화하면 더 입체적인 자소서가 될 거예요!`;

  const typeDescription =
    typeCounts.length > 3
      ? `현재 ${bottomTypeLabel} 관련 경험이 적은 편이에요. 이 부분을 보완하면 더 입체적인 자소서가 될 거예요!`
      : `현재 경험 유형이 ${topTypeLabel} 중심으로 구성되어 있어요. 경험 유형을 다양화하면 더 입체적인 자소서가 될 거예요!`;

  // TYPE_DESCRIPTIONS[topTypeLabel] ??
  // `${topTypeLabel} 경험을 통해 다양한 역량을 쌓아왔습니다.`;

  console.log(tagCounts);
  return (
    <section className="mb-16">
      <h2 className="text-title-2-2 text-gray-400 mb-5">경험 분석</h2>
      {/* 1104px 패널 (고정 폭) */}
      <div className="flex gap-4 p-5 rounded-7.5 bg-gray-20 border border-gray-70 mx-auto">
        {/* 카테고리 */}
        <ReportChartCard
          iconSrc="/icons/report-experience.svg"
          iconAlt="경험 유형 아이콘"
          title={`${topCategoryItem?.category} 경험이 두드러져요`}
          description={categoryDescription}
          data={categoryCounts}
        >
          <TypeCountsBarChart data={categoryCounts} />
        </ReportChartCard>

        {/* 해쉬태그 기반 도넛차트 */}
        <ReportChartCard
          iconSrc="/icons/report-tag.svg"
          iconAlt="해쉬태그 아이콘"
          title={`${topTagLabel}에 강점이 있어요.`}
          description={"변경 필요함"}
          data={tagCounts}
        >
          {/* 태그 기반 도넛 차트 */}
          <CategoryCountsDonutChart data={tagCounts} />
        </ReportChartCard>

        <ReportChartCard
          iconSrc="/icons/report-category.svg"
          iconAlt="카테고리 아이콘"
          title={`${topTypeLabel}이 가장 많아요`}
          description={TYPE_DESCRIPTIONS[topTypeLabel] ?? "변경 필요함"}
          data={typeCounts}
        >
          {/* 경험 유형 기반 가로 막대 차트 */}
          <ExperienceBarChart data={typeCounts} />
        </ReportChartCard>
      </div>
    </section>
  );
}
