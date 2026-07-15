import { clearAuthCookies, getClientAccessToken } from "./auth-storage";

export type SessionEndReason = "expired" | "logout" | "unauthorized";

const LOGIN_PATH = "/dashboard/login";
let redirectInFlight = false;

export function getAccessTokenExpiryMs(token: string): number | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1])) as { exp?: number };
    return payload.exp ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}

export function getSessionRemainingMs(): number | null {
  const token = getClientAccessToken();
  if (!token) return null;
  const exp = getAccessTokenExpiryMs(token);
  if (!exp) return null;
  return exp - Date.now();
}

export function clearSessionCookies(): void {
  clearAuthCookies();
  redirectInFlight = false;
}

export function redirectToLogin(reason: SessionEndReason): void {
  if (typeof window === "undefined") return;
  if (redirectInFlight) return;
  if (window.location.pathname === LOGIN_PATH) return;

  redirectInFlight = true;
  clearAuthCookies();
  window.location.replace(`${LOGIN_PATH}?session=${reason}`);
}

export function isLoginPath(pathname: string): boolean {
  return pathname === LOGIN_PATH;
}
