export const API_BASE_URL = 'https://api-dev.logit.ai.kr';

// ============================================================================
// Token Management
// ============================================================================

/**
 * 인증 토큰을 반환합니다.
 * - 개발 환경: 환경변수에서 가져옴
 * - 프로덕션: 추후 쿠키/세션에서 가져오도록 확장
 */
export function getAuthToken(): string {
  // 서버 사이드에서만 환경변수 접근 가능
  if (typeof window === 'undefined') {
    const token = process.env.API_DEV_TOKEN;
    if (token) {
      return token;
    }
  }

  // TODO: 프로덕션에서는 쿠키/세션에서 토큰 가져오기
  throw new Error('No auth token available');
}

// ============================================================================
// API Client
// ============================================================================

interface FetchOptions extends Omit<RequestInit, 'headers'> {
  headers?: Record<string, string>;
}

/**
 * 인증이 포함된 API 요청을 수행합니다.
 */
export async function apiFetch<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const token = getAuthToken();

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new ApiError(
      response.status,
      error.detail || `API Error: ${response.status}`
    );
  }

  // 204 No Content 처리
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

// ============================================================================
// Error Class
// ============================================================================

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// ============================================================================
// API Endpoints
// ============================================================================

export const API_ENDPOINTS = {
  // Experiences
  experiences: '/api/v1/experiences',
  experienceSearch: (q: string) =>
    `/api/v1/experiences/search?q=${encodeURIComponent(q)}`,

  // Projects & Questions
  projects: '/api/v1/projects/',
  project: (id: string) => `/api/v1/projects/${id}`,
  questions: (projectId: string) =>
    `/api/v1/projects/${projectId}/questions/`,
  question: (projectId: string, questionId: string) =>
    `/api/v1/projects/${projectId}/questions/${questionId}`,

  // Chats
  chats: '/api/v1/projects/chats',
  chatHistory: (questionId: string) =>
    `/api/v1/projects/chats/${questionId}`,
  updateAnswer: (chatId: string) =>
    `/api/v1/projects/chats/${chatId}/answer`,
} as const;
