// ============================================================================
// Enums
// ============================================================================

export const EXPERIENCE_CATEGORY = {
  CUSTOMER_VALUE: "고객 가치 지향",
  TECHNICAL_EXPERTISE: "기술적 전문성",
  COLLABORATIVE_COMMUNICATION: "협력적 소통",
  PROACTIVE_EXECUTION: "주도적 실행력",
  LOGICAL_ANALYSIS: "논리적 분석력",
  CREATIVE_PROBLEM_SOLVING: "창의적 문제해결",
  FLEXIBLE_ADAPTABILITY: "유연한 적응력",
  PERSISTENT_RESPONSIBILITY: "끈기있는 책임감",
} as const;

export type ExperienceCategory =
  (typeof EXPERIENCE_CATEGORY)[keyof typeof EXPERIENCE_CATEGORY];

export const EXPERIENCE_TYPE = {
  PART_TIME: "아르바이트",
  INTERN: "인턴",
  FULL_TIME: "정규직",
  CONTRACT: "계약직",
  VOLUNTEER: "봉사 활동",
  AWARD: "수상경력",
  CLUB: "동아리 활동",
  RESEARCH: "연구 활동",
  MILITARY: "군복무",
  PERSONAL: "개인 활동",
} as const;

export type ExperienceType =
  (typeof EXPERIENCE_TYPE)[keyof typeof EXPERIENCE_TYPE];

// ============================================================================
// Experience
// ============================================================================

export interface Experience {
  id: string;
  user_id: string;
  title: string;
  start_date: string;
  end_date: string;
  experience_type: ExperienceType;
  situation: string;
  task: string;
  action: string;
  result: string;
  category: ExperienceCategory;
  tags: string;
  created_at: string;
  updated_at: string;
}

export interface ExperienceListResponse {
  experiences: Experience[];
  total: number;
  limit: number;
  offset: number;
}

export interface MatchedExperience {
  experience: Experience;
  similarity_score: number;
}

export interface MatchedExperienceResponse {
  experiences: MatchedExperience[];
  total: number;
}

// ============================================================================
// Project
// ============================================================================

export interface Project {
  id: string;
  user_id: string;
  company: string;
  job_position: string;
  recruit_notice: string;
  due_date: string | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface ProjectListItem {
  id: string;
  company: string;
  job_position: string;
  updated_at: string;
  question_id: string;
}

// ============================================================================
// Question
// ============================================================================

export interface Question {
  id: string;
  project_id: string;
  user_id: string;
  question: string;
  max_length: number | null;
  answer: string | null;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface QuestionListItem {
  id: string;
  question: string;
  max_length: number | null;
  answer: string | null;
  is_completed: boolean;
}

// ============================================================================
// Chat
// ============================================================================

export interface ChatHistoryItem {
  id: string;
  role: "user" | "assistant";
  content: string;
  is_draft: boolean;
  created_at: string;
}

export interface ChatHistoryResponse {
  project_name: string;
  project_created_at: string;
  question_id: string;
  question: string;
  answer: string | null;
  chats: ChatHistoryItem[];
  experience_ids: string[];
  next_cursor: string | null;
  has_more: boolean;
  remaining_chats: number;
}

export interface ChatRequest {
  question_id: string;
  content: string;
  experience_ids?: string[] | null;
}

export interface UpdateAnswerResponse {
  question_id: string;
  answer: string;
}

// ============================================================================
// Create Types
// ============================================================================

export interface QuestionCreate {
  question: string;
  max_length?: number | null;
}

export interface ProjectCreate {
  company: string;
  job_position: string;
  recruit_notice: string;
  company_talent?: string | null;
  due_date?: string | null;
  questions: QuestionCreate[];
}

export interface ExperienceCreate {
  title: string;
  start_date: string;
  end_date: string;
  experience_type: ExperienceType;
  situation: string;
  task: string;
  action: string;
  result: string;
  category: ExperienceCategory;
}

export interface QuestionUpdate {
  question?: string;
  max_length?: number | null;
  answer?: string;
}

export interface ExperienceUpdate {
  title: string;
  start_date: string;
  end_date: string;
  experience_type: ExperienceType;
  situation: string;
  task: string;
  action: string;
  result: string;
  category: ExperienceCategory;
}
