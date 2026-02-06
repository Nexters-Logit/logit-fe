export const ACCESS_TOKEN_COOKIE = "logit_access_token";
const REFRESH_TOKEN_KEY = "logit_refresh_token";
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7일 (초)

function setCookie(name: string, value: string): void {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
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

export function setAuthTokens(accessToken: string, refreshToken: string): void {
  if (typeof window === "undefined") return;
  setCookie(ACCESS_TOKEN_COOKIE, accessToken);
  setCookie(REFRESH_TOKEN_KEY, refreshToken);
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return getCookie(ACCESS_TOKEN_COOKIE);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return getCookie(REFRESH_TOKEN_KEY);
}

export function clearAuthTokens(): void {
  if (typeof window === "undefined") return;
  deleteCookie(ACCESS_TOKEN_COOKIE);
  deleteCookie(REFRESH_TOKEN_KEY);
}

const API_BASE_URL = "https://api-dev.logit.ai.kr";
const LOGOUT_API_URL = `${API_BASE_URL}/api/v1/auth/logout`;
const REFRESH_API_URL = `${API_BASE_URL}/api/v1/auth/refresh`;

let refreshPromise: Promise<boolean> | null = null;

interface RefreshResponse {
  access_token: string;
  refresh_token: string;
}

/**
 * 리프레시 토큰으로 새 액세스/리프레시 토큰을 발급받아 쿠키에 저장합니다.
 * 클라이언트에서만 사용 가능합니다. 동시 호출 시 하나의 refresh만 수행합니다.
 * @returns 성공 시 true, 실패 시 false
 */
export async function refreshAuthTokens(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const res = await fetch(REFRESH_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
      if (!res.ok) return false;
      const data: RefreshResponse = await res.json();
      setAuthTokens(data.access_token, data.refresh_token);
      return true;
    } catch {
      return false;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

/**
 * 로그아웃: 서버에 토큰 무효화 요청 후 로컬 토큰 삭제 및 홈으로 이동
 */
export async function logout(): Promise<void> {
  if (typeof window === "undefined") return;
  const refreshToken = getRefreshToken();
  const accessToken = getAccessToken();
  clearAuthTokens();
  if (refreshToken && accessToken) {
    try {
      await fetch(LOGOUT_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
    } catch {
      // 네트워크 오류 등 - 이미 로컬 토큰은 삭제됨
    }
  }
  window.location.href = "/";
}
