import { EXPERIENCE_CATEGORY, EXPERIENCE_TYPE } from "@/types/api";
import type { TypeCount } from "@/app/_components/report/TypeCountsBarChart";
import type { TagCount } from "@/app/_components/report/CategoryCountsDonutChart";

// 리포트 미리보기에 사용할 카테고리/타입 순서 (ExperienceAnalysisSection과 동일)
const CATEGORY_ORDER = [
  EXPERIENCE_CATEGORY.TECHNICAL_EXPERTISE,
  EXPERIENCE_CATEGORY.CUSTOMER_VALUE,
  EXPERIENCE_CATEGORY.COLLABORATIVE_COMMUNICATION,
  EXPERIENCE_CATEGORY.PROACTIVE_EXECUTION,
  EXPERIENCE_CATEGORY.LOGICAL_ANALYSIS,
  EXPERIENCE_CATEGORY.CREATIVE_PROBLEM_SOLVING,
];

const TYPE_ORDER = [
  EXPERIENCE_TYPE.INTERN,
  EXPERIENCE_TYPE.FULL_TIME,
  EXPERIENCE_TYPE.PART_TIME,
  EXPERIENCE_TYPE.VOLUNTEER,
  EXPERIENCE_TYPE.CLUB,
  EXPERIENCE_TYPE.PERSONAL,
];

export type GuestReportDataset = {
  categoryCounts: TypeCount[];
  tagCounts: TagCount[];
  typeCounts: TypeCount[];
};

function makeCategoryCounts(counts: number[]): TypeCount[] {
  return CATEGORY_ORDER.map((category, i) => ({
    category,
    count: counts[i],
  })) as TypeCount[];
}

function makeTypeCounts(counts: number[]): TypeCount[] {
  return TYPE_ORDER.map((type, i) => ({
    type,
    count: counts[i],
  })) as TypeCount[];
}

// 개발자 페르소나 — 기술적 전문성 중심
const DATASET_DEVELOPER: GuestReportDataset = {
  categoryCounts: makeCategoryCounts([7, 2, 3, 4, 5, 2]),
  tagCounts: [
    { tag: "프론트엔드", count: 6 },
    { tag: "트러블슈팅", count: 4 },
    { tag: "API 연동", count: 4 },
    { tag: "백엔드", count: 3 },
    { tag: "코드리뷰", count: 2 },
    { tag: "협업도구", count: 2 },
  ],
  typeCounts: makeTypeCounts([5, 0, 1, 1, 3, 3]),
};

// 디자이너 페르소나 — 창의적 문제해결 중심
const DATASET_DESIGNER: GuestReportDataset = {
  categoryCounts: makeCategoryCounts([2, 3, 3, 2, 1, 7]),
  tagCounts: [
    { tag: "UX/UI", count: 7 },
    { tag: "프로토타이핑", count: 4 },
    { tag: "브랜딩", count: 3 },
    { tag: "사용자테스트", count: 3 },
    { tag: "디자인시스템", count: 2 },
    { tag: "영상편집", count: 1 },
  ],
  typeCounts: makeTypeCounts([4, 0, 3, 2, 3, 2]),
};

// 마케터 페르소나 — 고객 가치 지향 중심
const DATASET_MARKETER: GuestReportDataset = {
  categoryCounts: makeCategoryCounts([1, 6, 3, 4, 2, 3]),
  tagCounts: [
    { tag: "SNS 운영", count: 5 },
    { tag: "콘텐츠제작", count: 5 },
    { tag: "퍼포먼스 마케팅", count: 4 },
    { tag: "CRM", count: 2 },
    { tag: "광고집행", count: 2 },
    { tag: "검색최적화", count: 1 },
  ],
  typeCounts: makeTypeCounts([3, 1, 5, 2, 2, 1]),
};

// 기획자/PM 페르소나 — 논리적 분석력 중심
const DATASET_PM: GuestReportDataset = {
  categoryCounts: makeCategoryCounts([3, 4, 5, 3, 7, 2]),
  tagCounts: [
    { tag: "서비스 기획", count: 6 },
    { tag: "PM/PO", count: 5 },
    { tag: "데이터 분석", count: 4 },
    { tag: "요구사항 정의", count: 3 },
    { tag: "벤치마킹", count: 2 },
    { tag: "지표설정", count: 2 },
  ],
  typeCounts: makeTypeCounts([5, 2, 1, 1, 4, 2]),
};

// 운영/사업개발 페르소나 — 협력적 소통 중심
const DATASET_OPS: GuestReportDataset = {
  categoryCounts: makeCategoryCounts([2, 3, 6, 4, 3, 2]),
  tagCounts: [
    { tag: "고객응대", count: 5 },
    { tag: "서비스 운영", count: 4 },
    { tag: "이벤트 기획", count: 4 },
    { tag: "커뮤니케이션", count: 3 },
    { tag: "프로세스 개선", count: 2 },
    { tag: "문서작성", count: 2 },
  ],
  typeCounts: makeTypeCounts([3, 3, 4, 3, 2, 1]),
};

// 연구/학술 페르소나 — 끈기있는 책임감 + 논리적 분석력
const DATASET_RESEARCH: GuestReportDataset = {
  categoryCounts: makeCategoryCounts([4, 1, 2, 3, 6, 1]),
  tagCounts: [
    { tag: "리서치", count: 6 },
    { tag: "데이터 분석", count: 5 },
    { tag: "문서작성", count: 4 },
    { tag: "AI/LLM", count: 3 },
    { tag: "문제해결", count: 3 },
    { tag: "DB 설계", count: 1 },
  ],
  typeCounts: makeTypeCounts([2, 0, 0, 2, 3, 4]),
};

export const GUEST_REPORT_DATASETS: GuestReportDataset[] = [
  DATASET_DEVELOPER,
  DATASET_DESIGNER,
  DATASET_MARKETER,
  DATASET_PM,
  DATASET_OPS,
  DATASET_RESEARCH,
];
