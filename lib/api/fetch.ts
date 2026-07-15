import { redirect } from "next/navigation";
import { API_URL } from "./config";
import { getClientAccessToken, getServerAccessToken } from "./auth-storage";
import { redirectToLogin } from "./session";
import type { ApiResponse } from "./types";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public code?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type FetchOptions = RequestInit & {
  token?: string | null;
  searchParams?: Record<string, string | number | undefined | null>;
};

function buildUrl(path: string, searchParams?: FetchOptions["searchParams"]): string {
  const base = path.startsWith("http") ? path : `${API_URL}${path.startsWith("/") ? path : `/${path}`}`;
  if (!searchParams) return base;
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  }
  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

async function parseResponse<T>(res: Response): Promise<ApiResponse<T>> {
  const body = (await res.json()) as ApiResponse<T>;
  if (!res.ok || !body.success) {
    throw new ApiError(res.status, body.message ?? "Request failed", body.error?.code);
  }
  return body;
}

async function apiFetchInternal<T>(
  path: string,
  token: string | null | undefined,
  options: FetchOptions = {},
): Promise<ApiResponse<T>> {
  const { searchParams, token: _tokenOverride, ...init } = options;
  const headers = new Headers(init.headers);
  if (!headers.has("Content-Type") && init.body && !(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(buildUrl(path, searchParams), {
    ...init,
    headers,
    cache: "no-store",
  });

  return parseResponse<T>(res);
}

export async function serverApi<T>(path: string, options: FetchOptions = {}): Promise<ApiResponse<T>> {
  const token = options.token ?? (await getServerAccessToken());
  if (!token && !path.includes("/auth/login")) {
    redirect("/dashboard/login?session=expired");
  }
  try {
    return await apiFetchInternal<T>(path, token, options);
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      redirect("/dashboard/login?session=expired");
    }
    throw err;
  }
}

export async function clientApi<T>(path: string, options: FetchOptions = {}): Promise<ApiResponse<T>> {
  const token = options.token ?? getClientAccessToken();
  try {
    return await apiFetchInternal<T>(path, token, options);
  } catch (err) {
    if (err instanceof ApiError && err.status === 401 && !path.includes("/auth/login")) {
      redirectToLogin("expired");
    }
    throw err;
  }
}

/** Unauthenticated API calls for the public storefront. */
export async function publicApi<T>(path: string, options: FetchOptions = {}): Promise<ApiResponse<T>> {
  return apiFetchInternal<T>(path, null, options);
}

export async function loginRequest(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return parseResponse<import("./types").LoginResult>(res);
}
