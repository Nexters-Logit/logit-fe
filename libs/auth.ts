import { API_BASE_URL } from "./api-config";

export const ACCESS_TOKEN_COOKIE = "logit_access_token";

/** 로그아웃 직후 리다이렉트 시 로그인 모달을 띄우지 않도록 하는 신호 (클라이언트만 사용) */
export const JUST_LOGGED_OUT_COOKIE = "just_logged_out";

function setCookie(name: string, value: string): void {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; SameSite=Lax`;
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(
      "(?:^|; )" + name.replace(/([.$?*|{}()[\]\\/+^])/g, "\\$1") + "=([^;]*)",
    ),
  );
  return match ? decodeURIComponent(match[1]) : null;
}

function deleteCookie(name: string): void {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; path=/; max-age=0`;
}

export function setAuthTokens(accessToken: string): void {
  if (typeof window === "undefined") return;
  setCookie(ACCESS_TOKEN_COOKIE, accessToken);
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  if (process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_DEV_ACCESS_TOKEN) {
    return process.env.NEXT_PUBLIC_DEV_ACCESS_TOKEN;
  }
  return getCookie(ACCESS_TOKEN_COOKIE);
}

export function clearAuthTokens(): void {
  if (typeof window === "undefined") return;
  deleteCookie(ACCESS_TOKEN_COOKIE);
}

let refreshPromise: Promise<boolean> | null = null;

interface RefreshResponse {
  access_token: string;
}

/**
 * HttpOnly 쿠키의 refresh_token으로 새 액세스 토큰을 발급받아 저장합니다.
 * POST 시 credentials: 'include'로 서버에 refresh_token 쿠키가 전달됩니다.
 * @returns 성공 시 true, 실패 시 false
 */
export async function refreshAuthTokens(): Promise<boolean> {
  if (typeof window === "undefined") return false;

  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (!res.ok) return false;
      const data: RefreshResponse = await res.json();
      if (data.access_token) {
        setAuthTokens(data.access_token);
      }
      return !!data.access_token;
    } catch {
      return false;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

/**
 * 로그아웃: 서버에 토큰 무효화 요청 후 로컬 토큰 삭제 및 리다이렉트
 * @param redirectTo 로그아웃 후 이동할 경로 (기본값: "/")
 */
export async function logout(redirectTo = "/"): Promise<void> {
  if (typeof window === "undefined") return;

  const accessToken = getAccessToken();
  clearAuthTokens();

  if (accessToken) {
    try {
      await fetch(`${API_BASE_URL}/api/v1/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({}),
      });
    } catch {
      // 네트워크 오류 등 - 이미 로컬 토큰은 삭제됨
    }
  }
  // 로그아웃 직후 리다이렉트 시 미들웨어가 401로 login_required를 세팅해 모달이 뜨는 것 방지
  setCookie(JUST_LOGGED_OUT_COOKIE, "1");
  window.location.href = redirectTo;
}

const AUTH_REDIRECT_KEY = "auth_redirect";

/**
 * OAuth 로그인을 시작합니다 (Google/Apple 공통).
 * 로그인 완료 후 돌아올 경로를 sessionStorage에 저장해두고 provider 인증
 * 페이지로 이동합니다 — 모든 로그인 진입점(모달/로그인 페이지/모바일
 * 프로필 화면)이 이 함수 하나만 사용해 리다이렉트 동작이 갈라지지 않도록 한다.
 */
export function startOAuthLogin(
  provider: "google" | "apple",
  redirectTo?: string,
): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(
    AUTH_REDIRECT_KEY,
    redirectTo ?? window.location.pathname,
  );
  window.location.href = `${API_BASE_URL}/api/v1/auth/${provider}`;
}
