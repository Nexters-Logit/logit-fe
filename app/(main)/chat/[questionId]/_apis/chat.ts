import { apiFetch, API_ENDPOINTS } from '@/libs/api-client';
import type {
  ChatHistoryResponse,
  Experience,
  ExperienceListResponse,
  ProjectListItem,
  QuestionListItem,
} from '@/types/api';

/**
 * 채팅 히스토리 조회
 */
export async function getChatHistory(
  questionId: string
): Promise<ChatHistoryResponse> {
  return apiFetch<ChatHistoryResponse>(API_ENDPOINTS.chatHistory(questionId));
}

/**
 * 경험 목록 조회 (서버용 - 직접 API 호출)
 */
export async function getExperiencesServer(): Promise<Experience[]> {
  const data = await apiFetch<ExperienceListResponse>(API_ENDPOINTS.experiences);
  return data.experiences;
}

/**
 * 답변 업데이트 (초안 → 답변 저장)
 */
export async function updateAnswer(
  chatId: string,
  content: string
): Promise<void> {
  return apiFetch<void>(API_ENDPOINTS.updateAnswer(chatId), {
    method: 'PATCH',
    body: JSON.stringify({ content }),
  });
}

/**
 * 프로젝트 목록 조회 (서버용)
 */
export async function getProjectsServer(): Promise<ProjectListItem[]> {
  return apiFetch<ProjectListItem[]>(API_ENDPOINTS.projects);
}

/**
 * 프로젝트의 문항 목록 조회 (서버용)
 */
export async function getQuestionsServer(
  projectId: string
): Promise<QuestionListItem[]> {
  return apiFetch<QuestionListItem[]>(API_ENDPOINTS.questions(projectId));
}

/**
 * questionId로 프로젝트 정보와 문항 정보를 가져옴
 */
export async function getProjectAndQuestionInfo(questionId: string): Promise<{
  company: string;
  jobPosition: string;
  maxLength: number | null;
}> {
  // 프로젝트 목록에서 question_id로 프로젝트 찾기
  const projects = await getProjectsServer();
  const project = projects.find((p) => p.question_id === questionId);

  if (!project) {
    return { company: '회사', jobPosition: '직무', maxLength: null };
  }

  // 프로젝트의 문항 목록에서 max_length 가져오기
  const questions = await getQuestionsServer(project.id);
  const question = questions.find((q) => q.id === questionId);

  return {
    company: project.company,
    jobPosition: project.job_position,
    maxLength: question?.max_length ?? null,
  };
}
