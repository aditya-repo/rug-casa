"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { IconLogout } from "./account-icons";

type LogoutConfirmButtonProps = {
  variant: "sidebar" | "mobile";
};

const triggerClass: Record<LogoutConfirmButtonProps["variant"], string> = {
  sidebar:
    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50",
  mobile:
    "flex w-full items-center justify-center gap-1.5 rounded-lg border border-red-100 bg-white py-2 text-xs font-semibold text-red-600 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors active:bg-red-50",
};

export function LogoutConfirmButton({ variant }: LogoutConfirmButtonProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const el = dialogRef.current?.querySelector<HTMLElement>(
      "[data-autofocus='logout-dialog']",
    );
    el?.focus();
  }, [open]);

  const confirmLogout = useCallback(() => {
    setOpen(false);
    router.push("/");
  }, [router]);

  const iconClass = variant === "mobile" ? "h-4 w-4 shrink-0" : "h-5 w-5 shrink-0";

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={triggerClass[variant]}>
        <IconLogout className={iconClass} />
        Logout
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 p-4"
          role="presentation"
          onClick={() => setOpen(false)}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="w-full max-w-md rounded-xl border border-neutral-200 bg-white p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              id={titleId}
              className="text-lg font-semibold tracking-tight text-neutral-900"
            >
              Log out?
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              You will leave your account area. Sign in again any time to view orders and
              saved details.
            </p>
            <div className="mt-6 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                data-autofocus="logout-dialog"
                onClick={() => setOpen(false)}
                className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-800 transition-colors hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmLogout}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
