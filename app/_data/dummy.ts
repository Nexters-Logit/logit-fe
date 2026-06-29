import type {
  ProjectCreate,
  ExperienceCreate,
} from "@/types/api";
import { EXPERIENCE_CATEGORY, FORMAT_TYPE } from "@/types/api";

// 사용자가 직접 수정 가능한 더미 프로젝트 데이터
export const DUMMY_PROJECTS: ProjectCreate[] = [
  {
    company: "네이버",
    job_position: "프론트엔드 개발자",
    recruit_notice: "2025년 상반기 신입 개발자 공개채용",
    questions: [
      { question: "본인의 강점과 지원 동기를 작성해주세요.", max_length: 1000 },
      {
        question: "협업 경험에 대해 구체적으로 작성해주세요.",
        max_length: 800,
      },
    ],
  },
  {
    company: "카카오",
    job_position: "백엔드 개발자",
    recruit_notice: "2025년 경력 개발자 수시 채용",
    questions: [
      {
        question: "가장 어려웠던 기술적 문제와 해결 과정을 설명해주세요.",
        max_length: 1200,
      },
    ],
  },
  {
    company: "삼성전자",
    job_position: "SW 개발자",
    recruit_notice: "2025년 상반기 GSAT 채용",
    questions: [
      {
        question: "본인의 성장 과정과 가치관을 설명해주세요.",
        max_length: 1500,
      },
      {
        question: "팀워크를 발휘한 경험을 구체적으로 작성해주세요.",
        max_length: 1000,
      },
    ],
  },
  {
    company: "토스",
    job_position: "iOS 개발자",
    recruit_notice: "2025년 상시 채용",
    questions: [
      {
        question: "가장 몰입했던 프로젝트 경험을 설명해주세요.",
        max_length: 1000,
      },
    ],
  },
  {
    company: "라인",
    job_position: "데이터 엔지니어",
    recruit_notice: "2025년 신입/경력 채용",
    questions: [
      {
        question: "데이터를 활용하여 문제를 해결한 경험을 작성해주세요.",
        max_length: 1200,
      },
      {
        question: "기술적으로 도전했던 경험을 설명해주세요.",
        max_length: 1000,
      },
    ],
  },
];

// 사용자가 직접 수정 가능한 더미 경험 데이터 (5개 이상)
export const DUMMY_EXPERIENCES: ExperienceCreate[] = [
  {
    title: "AI 챗봇 서비스 개발",
    start_date: "2024-05-01",
    end_date: "2024-06-15",
    experience_type: "동아리 활동",
    format_type: FORMAT_TYPE.STAR,
    category: EXPERIENCE_CATEGORY.TECHNICAL_EXPERTISE,
    situation: "팀 프로젝트에서 사용자 문의 응대 자동화가 필요했습니다.",
    task: "자연어 처리 기반 챗봇을 설계하고 구현해야 했습니다.",
    action:
      "OpenAI API를 활용하여 RAG 기반 챗봇을 개발하고, FastAPI로 REST API를 구축했습니다.",
    result: "응답 시간을 70% 단축하고 고객 만족도를 85%로 향상시켰습니다.",
  },
  {
    title: "대규모 트래픽 처리 시스템 구축",
    start_date: "2024-02-01",
    end_date: "2024-03-20",
    experience_type: "인턴",
    format_type: FORMAT_TYPE.STAR,
    category: EXPERIENCE_CATEGORY.LOGICAL_ANALYSIS,
    situation: "이벤트 기간 동안 평소의 10배 트래픽이 예상되었습니다.",
    task: "기존 시스템을 확장 가능한 아키텍처로 재설계해야 했습니다.",
    action: "Redis 캐싱과 메시지 큐를 도입하고, Auto Scaling을 구성했습니다.",
    result: "서버 비용을 40% 절감하면서 99.9% 가용성을 달성했습니다.",
  },
  {
    title: "신입사원 온보딩 프로그램 개선",
    start_date: "2023-12-01",
    end_date: "2024-01-10",
    experience_type: "정규직",
    format_type: FORMAT_TYPE.STAR,
    category: EXPERIENCE_CATEGORY.COLLABORATIVE_COMMUNICATION,
    situation: "신입사원들의 업무 적응 기간이 평균 3개월로 길었습니다.",
    task: "온보딩 프로세스를 체계화하여 적응 기간을 단축해야 했습니다.",
    action: "멘토링 시스템을 구축하고, 단계별 학습 가이드를 제작했습니다.",
    result: "적응 기간을 1.5개월로 단축하고, 신입 만족도를 92%로 높였습니다.",
  },
  {
    title: "오픈소스 라이브러리 기여",
    start_date: "2023-10-15",
    end_date: "2023-11-05",
    experience_type: "개인 활동",
    format_type: FORMAT_TYPE.STAR,
    category: EXPERIENCE_CATEGORY.CREATIVE_PROBLEM_SOLVING,
    situation: "사용하던 라이브러리에 한글 처리 버그가 있었습니다.",
    task: "버그를 수정하고 공식 저장소에 기여해야 했습니다.",
    action:
      "원인을 분석하여 PR을 작성하고, 메인테이너와 코드 리뷰를 진행했습니다.",
    result: "PR이 머지되어 1만+ 사용자에게 개선된 기능을 제공했습니다.",
  },
  {
    title: "교내 해커톤 우승",
    start_date: "2023-09-14",
    end_date: "2023-09-15",
    experience_type: "수상경력",
    format_type: FORMAT_TYPE.STAR,
    category: EXPERIENCE_CATEGORY.PROACTIVE_EXECUTION,
    situation: "24시간 내에 사회 문제 해결 서비스를 개발해야 했습니다.",
    task: "팀 리더로서 아이디어 선정부터 개발, 발표까지 총괄해야 했습니다.",
    action:
      "독거노인 안부 확인 서비스를 기획하고, React Native로 MVP를 개발했습니다.",
    result:
      "참가팀 50개 중 1위를 차지하고, 지자체 시범 사업으로 선정되었습니다.",
  },
  {
    title: "데이터 분석 자동화 시스템 구축",
    start_date: "2023-06-01",
    end_date: "2023-07-20",
    experience_type: "인턴",
    format_type: FORMAT_TYPE.STAR,
    category: EXPERIENCE_CATEGORY.LOGICAL_ANALYSIS,
    situation: "매주 수작업으로 리포트를 작성하는 데 8시간이 소요되었습니다.",
    task: "반복 작업을 자동화하여 업무 효율을 높여야 했습니다.",
    action: "Python과 Airflow를 활용해 ETL 파이프라인을 구축했습니다.",
    result:
      "주간 리포트 작성 시간을 30분으로 단축하고, 데이터 정확도를 향상시켰습니다.",
  },
];

// 순차적으로 더미 데이터 선택하는 카운터
let projectCounter = 0;

// 순차적으로 더미 데이터 선택 (매번 다른 데이터 반환)
export function getRandomProject(): ProjectCreate {
  const project = DUMMY_PROJECTS[projectCounter % DUMMY_PROJECTS.length];
  projectCounter++;
  return project;
}
