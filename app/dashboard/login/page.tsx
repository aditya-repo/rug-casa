"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { loginRequest } from "@/lib/api/fetch";
import { clearAuthCookies, setAuthCookies } from "@/lib/api/auth-storage";

const sessionMessages: Record<string, string> = {
  expired: "Your session has expired. Please sign in again.",
  logout: "You have been signed out successfully.",
  unauthorized: "Please sign in to continue.",
};

export default function DashboardLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@mail.com");
  const [password, setPassword] = useState("admin:");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    clearAuthCookies();
    const params = new URLSearchParams(window.location.search);
    const session = params.get("session");
    if (session && sessionMessages[session]) {
      setNotice(sessionMessages[session]);
    }
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await loginRequest(email, password);
      setAuthCookies(res.data!.accessToken, res.data!.refreshToken);
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-100 px-4">
      <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="font-heading text-2xl font-semibold text-rc-navy">Rugs Bhadohi Admin</h1>
          <p className="mt-1 text-sm text-neutral-500">Sign in to manage your store</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm outline-none focus:border-rc-accent focus:ring-1 focus:ring-rc-accent"
              autoComplete="email"
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm outline-none focus:border-rc-accent focus:ring-1 focus:ring-rc-accent"
              autoComplete="current-password"
            />
          </label>

          {notice ? (
            <p className="rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-800">{notice}</p>
          ) : null}

          {error ? (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-rc-navy py-2.5 text-sm font-semibold text-white transition-colors hover:bg-rc-navy-dark disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
