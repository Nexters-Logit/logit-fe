import { NextRequest, NextResponse } from "next/server";
import { ACCESS_TOKEN_COOKIE } from "@/libs/auth";
import { API_BASE_URL, API_ENDPOINTS } from "@/libs/api-client";

function isJwtExpired(token: string): boolean {
  try {
    const [, payload] = token.split(".");
    if (!payload) return false;
    const decoded = JSON.parse(
      Buffer.from(
        payload.replace(/-/g, "+").replace(/_/g, "/"),
        "base64",
      ).toString("utf8"),
    ) as { exp?: number };
    if (!decoded.exp) return false;
    const now = Math.floor(Date.now() / 1000);
    return decoded.exp <= now;
  } catch {
    return false;
  }
}

function updateCookieHeader(
  original: string,
  key: string,
  value: string,
): string {
  const parts = original
    .split(/;\s*/)
    .map((p) => p.trim())
    .filter(Boolean);

  let found = false;
  const next = parts.map((part) => {
    const [k] = part.split("=");
    if (k === key) {
      found = true;
      return `${key}=${encodeURIComponent(value)}`;
    }
    return part;
  });

  if (!found) {
    next.push(`${key}=${encodeURIComponent(value)}`);
  }

  return next.join("; ");
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 보호가 필요한 경로만 처리 (필요에 따라 조정)
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next();
  }

  const accessToken = req.cookies.get(ACCESS_TOKEN_COOKIE)?.value ?? null;
  const refreshToken = req.cookies.get("refresh_token")?.value ?? null;

  // 리프레시 토큰이 없으면 패스
  if (!refreshToken) {
    return NextResponse.next();
  }

  // access_token이 있고 아직 만료 안 되었으면 패스
  if (accessToken && !isJwtExpired(accessToken)) {
    return NextResponse.next();
  }

  const cookieHeader = req.headers.get("cookie") ?? "";
  const refreshUrl = `${API_BASE_URL}${API_ENDPOINTS.authRefresh}`;

  const refreshResponse = await fetch(refreshUrl, {
    method: "POST",
    headers: {
      Cookie: cookieHeader,
      "Content-Type": "application/json",
    },
  });

  const res = NextResponse.next();

  if (refreshResponse.status === 401) {
    // refresh_token도 더 이상 유효하지 않은 상태 → 세션 정리
    res.cookies.delete(ACCESS_TOKEN_COOKIE);
    res.cookies.delete("refresh_token");
    // 클라이언트에서 로그인 모달을 띄우도록 신호용 쿠키 설정
    res.cookies.set("login_required", "1", {
      path: "/",
      sameSite: "lax",
    });
    return res;
  }

  if (!refreshResponse.ok) {
    return res;
  }

  let data: { access_token?: string } | null = null;
  try {
    data = await refreshResponse.json();
  } catch {
    data = null;
  }

  if (data?.access_token) {
    // 브라우저 쿠키 갱신
    res.cookies.set(ACCESS_TOKEN_COOKIE, data.access_token, {
      path: "/",
      sameSite: "lax",
    });

    // 이번 요청 컨텍스트에서 서버 컴포넌트가 새 토큰을 보게 하도록 Cookie 헤더도 덮어쓰기
    const newCookieHeader = updateCookieHeader(
      cookieHeader,
      ACCESS_TOKEN_COOKIE,
      data.access_token,
    );

    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("cookie", newCookieHeader);
    res.headers.set("x-middleware-request-cookie", newCookieHeader);
  }

  // 백엔드가 내려준 Set-Cookie(예: refresh_token 회전)가 있다면 그대로 전달
  const backendSetCookie = refreshResponse.headers.get("set-cookie");
  if (backendSetCookie) {
    res.headers.append("set-cookie", backendSetCookie);
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/).*)"],
};
