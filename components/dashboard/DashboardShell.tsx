"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { dashboardNavItems } from "@/lib/dashboard/nav";
import { getClientAccessToken, clearAuthCookies } from "@/lib/api/auth-storage";
import { fetchProfileClient, logoutClient } from "@/lib/api/auth";
import { getAccessTokenExpiryMs, redirectToLogin } from "@/lib/api/session";
import type { AdminProfile } from "@/lib/api/types";

function IconMenu({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
  );
}

function IconClose({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function isNavActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname.startsWith(href);
}

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
      {dashboardNavItems.map(({ id, label, href, Icon }) => {
        const active = isNavActive(pathname, href);
        return (
          <Link
            key={id}
            href={href}
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              active ? "bg-white/10 text-white" : "text-slate-300 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Icon className={`h-5 w-5 shrink-0 ${active ? "text-blue-300" : ""}`} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/dashboard/login";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [admin, setAdmin] = useState<AdminProfile | null>(null);
  const [authChecked, setAuthChecked] = useState(isLoginPage);
  const [loggingOut, setLoggingOut] = useState(false);

  const endSession = useCallback(
    (reason: "expired" | "logout") => {
      clearAuthCookies();
      if (reason === "logout") {
        router.replace("/dashboard/login?session=logout");
      } else {
        redirectToLogin("expired");
      }
    },
    [router],
  );

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isLoginPage) return;

    const token = getClientAccessToken();
    if (!token) {
      router.replace("/dashboard/login?session=expired");
      return;
    }

    fetchProfileClient()
      .then(setAdmin)
      .catch(() => endSession("expired"))
      .finally(() => setAuthChecked(true));
  }, [isLoginPage, router, pathname, endSession]);

  useEffect(() => {
    if (isLoginPage) return;

    const token = getClientAccessToken();
    if (!token) return;

    const expiryMs = getAccessTokenExpiryMs(token);
    if (!expiryMs) return;

    const remaining = expiryMs - Date.now();
    if (remaining <= 0) {
      endSession("expired");
      return;
    }

    const timer = window.setTimeout(() => endSession("expired"), remaining);
    return () => window.clearTimeout(timer);
  }, [isLoginPage, pathname, endSession]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  async function handleLogout() {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await logoutClient();
    } finally {
      endSession("logout");
    }
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!authChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-100">
        <p className="text-sm text-neutral-500">Loading dashboard…</p>
      </div>
    );
  }

  const initials = admin?.name?.charAt(0)?.toUpperCase() ?? "A";

  return (
    <div className="min-h-screen bg-neutral-100">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-rc-navy text-white lg:flex">
        <div className="shrink-0 border-b border-white/10 px-5 py-5">
          <Link href="/dashboard" className="block">
            <span className="font-heading text-xl font-semibold tracking-tight">Rugs Bhadohi</span>
            <span className="mt-0.5 block text-xs font-medium text-slate-400">Admin Panel</span>
          </Link>
        </div>
        <SidebarNav />
        <div className="shrink-0 border-t border-white/10 p-4">
          <Link
            href="/"
            className="flex items-center justify-center rounded-lg border border-white/15 px-3 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-white/5 hover:text-white"
          >
            View storefront
          </Link>
        </div>
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="presentation">
          <button type="button" className="absolute inset-0 bg-black/50" aria-label="Close menu" onClick={() => setMobileOpen(false)} />
          <aside className="relative flex h-full w-[min(18rem,85vw)] flex-col bg-rc-navy text-white shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
              <div>
                <p className="font-heading text-lg font-semibold">Rugs Bhadohi</p>
                <p className="text-xs text-slate-400">Admin Panel</p>
              </div>
              <button type="button" onClick={() => setMobileOpen(false)} className="rounded-lg p-2 text-slate-300 hover:bg-white/10" aria-label="Close navigation">
                <IconClose />
              </button>
            </div>
            <SidebarNav onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      ) : null}

      <div className="flex min-h-screen min-w-0 flex-col lg:ml-64">
        <header className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-neutral-200 bg-white px-4 py-3 shadow-sm lg:px-6">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setMobileOpen(true)} className="rounded-lg p-2 text-neutral-700 hover:bg-neutral-100 lg:hidden" aria-label="Open navigation">
              <IconMenu />
            </button>
            <p className="text-sm font-medium text-neutral-500 lg:hidden">Admin</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-neutral-500 sm:inline">
              Signed in as <span className="font-medium text-neutral-800">{admin?.name ?? admin?.email ?? "Admin"}</span>
            </span>
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="hidden text-sm text-neutral-500 hover:text-neutral-800 disabled:opacity-50 sm:inline"
            >
              {loggingOut ? "Signing out…" : "Logout"}
            </button>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rc-navy text-sm font-semibold text-white">
              {initials}
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
