import { getAccessToken, ACCESS_TOKEN_COOKIE, refreshAuthTokens } from "./auth";

const DEFAULT_API_BASE_URL = "https://api-dev.logit.ai.kr";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.API_BASE_URL ||
  DEFAULT_API_BASE_URL;

// ============================================================================
// Query String Utility
// ============================================================================

type QueryParams = Record<string, string | number | boolean | undefined | null>;

function buildQueryString(params?: QueryParams): string {
  if (!params) return "";
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null,
  );
  if (entries.length === 0) return "";
  const searchParams = new URLSearchParams(
    entries.map(([k, v]) => [k, String(v)]),
  );
  return `?${searchParams.toString()}`;
}

// ============================================================================
// Token Management
// ============================================================================

/**
 * 인증 토큰을 반환합니다.
 * - 클라이언트: cookie의 access_token
 * - 서버: cookie 또는 환경변수 API_DEV_TOKEN
 */
export async function getAuthToken(): Promise<string> {
  if (typeof window !== "undefined") {
    const token = getAccessToken();

    if (token) return token;
  } else {
    const { cookies } = await import("next/headers");
    const store = await cookies();

    const cookieToken = store.get(ACCESS_TOKEN_COOKIE)?.value;
    if (cookieToken) return cookieToken;
  }
  throw new Error("No auth token available");
}

// ============================================================================
// API Client
// ============================================================================

interface FetchOptions extends Omit<RequestInit, "headers"> {
  headers?: Record<string, string>;
}

/**
 * 인증이 포함된 API 요청을 수행합니다.
 * 401 발생 시 클라이언트에서 리프레시 토큰으로 갱신 후 1회 재시도합니다.
 */
export async function apiFetch<T>(
  endpoint: string,
  options: FetchOptions = {},
  isRetry = false,
): Promise<T> {
  const token = await getAuthToken();

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    ...options.headers,
  };

  if (options.body) {
    headers["Content-Type"] = "application/json";
  }

  const baseUrl = API_BASE_URL?.trim() || DEFAULT_API_BASE_URL;
  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401 && !isRetry) {
    console.log("401! ");
    if (typeof window !== "undefined") {
      const refreshed = await refreshAuthTokens();
      if (refreshed) return apiFetch<T>(endpoint, options, true);
    }
    throw new ApiError(401, "토큰 갱신에 실패했습니다. 다시 로그인해 주세요.");
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    const detail = error.detail;
    const message =
      typeof detail === "string"
        ? detail
        : detail
          ? JSON.stringify(detail)
          : `API Error: ${response.status}`;
    throw new ApiError(response.status, message);
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
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// ============================================================================
// API Endpoints
// ============================================================================

export const API_ENDPOINTS = {
  // Auth
  authGoogle: "/api/v1/auth/google",
  authGoogleCallback: (code: string) =>
    `/api/v1/auth/google/callback?code=${encodeURIComponent(code)}`,
  authLogout: "/api/v1/auth/logout",
  authRefresh: "/api/v1/auth/refresh",

  // Experiences
  experiences: "/api/v1/experiences",
  experience: (id: string) => `/api/v1/experiences/${id}`,
  experienceSearch: (q: string) =>
    `/api/v1/experiences/search?q=${encodeURIComponent(q)}`,
  matchQuestion: (questionId: string) =>
    `/api/v1/experiences/match-question/${questionId}`,
  // Projects & Questions
  projects: "/api/v1/projects/",
  projectsList: (params?: { skip?: number; limit?: number }) =>
    `/api/v1/projects/${buildQueryString(params)}`,
  project: (id: string) => `/api/v1/projects/${id}`,
  questions: (projectId: string) => `/api/v1/projects/${projectId}/questions/`,
  question: (projectId: string, questionId: string) =>
    `/api/v1/projects/${projectId}/questions/${questionId}`,
  questionComplete: (projectId: string, questionId: string) =>
    `/api/v1/projects/${projectId}/questions/${questionId}/complete`,

  // Chats
  chats: "/api/v1/projects/chats",
  chatHistory: (
    questionId: string,
    params?: { cursor?: string; size?: number },
  ) => `/api/v1/projects/chats/${questionId}${buildQueryString(params)}`,
} as const;
