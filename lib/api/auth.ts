import { clientApi, serverApi } from "./fetch";
import { getClientRefreshToken } from "./auth-storage";
import type { AdminProfile, LoginResult } from "./types";

export async function fetchProfile(): Promise<AdminProfile> {
  const res = await serverApi<AdminProfile>("/auth/profile");
  return res.data!;
}

export async function fetchProfileClient(): Promise<AdminProfile> {
  const res = await clientApi<AdminProfile>("/auth/profile");
  return res.data!;
}

export async function logoutClient(): Promise<void> {
  const refreshToken = getClientRefreshToken();
  if (!refreshToken) return;

  try {
    await clientApi("/auth/logout", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });
  } catch {
    // Session may already be expired — local logout still proceeds.
  }
}

export type { LoginResult };
