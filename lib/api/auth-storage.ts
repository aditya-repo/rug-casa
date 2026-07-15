import { ACCESS_COOKIE, REFRESH_COOKIE } from "./config";

const ACCESS_MAX_AGE = 60 * 60; // 1 hour (backend may expire sooner)
const REFRESH_MAX_AGE = 60 * 60 * 24 * 7;

export function setAuthCookies(accessToken: string, refreshToken: string): void {
  if (typeof document === "undefined") return;
  document.cookie = `${ACCESS_COOKIE}=${encodeURIComponent(accessToken)}; path=/; max-age=${ACCESS_MAX_AGE}; SameSite=Lax`;
  document.cookie = `${REFRESH_COOKIE}=${encodeURIComponent(refreshToken)}; path=/; max-age=${REFRESH_MAX_AGE}; SameSite=Lax`;
}

export function clearAuthCookies(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${ACCESS_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
  document.cookie = `${REFRESH_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}

export function getClientAccessToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${ACCESS_COOKIE}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function getClientRefreshToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${REFRESH_COOKIE}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export async function getServerAccessToken(): Promise<string | null> {
  const { cookies } = await import("next/headers");
  const store = await cookies();
  const value = store.get(ACCESS_COOKIE)?.value;
  return value ? decodeURIComponent(value) : null;
}
