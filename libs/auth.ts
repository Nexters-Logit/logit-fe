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

const LOGOUT_API_URL = "https://api-dev.logit.ai.kr/api/v1/auth/logout";

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
