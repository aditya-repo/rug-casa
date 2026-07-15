"use client";

import { useEffect, useState, type FormEvent } from "react";
import { formatOrderStatus, type OrderStatus } from "@/lib/api/orders";

type AdvanceOrderModalProps = {
  open: boolean;
  orderNumber: string;
  currentStatus: OrderStatus;
  nextStatus: OrderStatus;
  actionLabel: string;
  notePlaceholder?: string;
  loading?: boolean;
  error?: string;
  onClose: () => void;
  onSubmit: (payload: { status: OrderStatus; note?: string }) => void;
};

const inputClass =
  "mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm outline-none focus:border-rc-accent focus:ring-1 focus:ring-rc-accent";

export function AdvanceOrderModal({
  open,
  orderNumber,
  currentStatus,
  nextStatus,
  actionLabel,
  notePlaceholder,
  loading = false,
  error,
  onClose,
  onSubmit,
}: AdvanceOrderModalProps) {
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!open) return;
    setNote("");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, loading, onClose]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit({ status: nextStatus, note: note.trim() || undefined });
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="presentation">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label="Close modal"
        onClick={loading ? undefined : onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="advance-order-title"
        className="relative w-full max-w-md rounded-xl border border-neutral-200 bg-white shadow-xl"
      >
        <form onSubmit={handleSubmit}>
          <div className="border-b border-neutral-200 px-6 py-4">
            <h2 id="advance-order-title" className="text-lg font-semibold text-neutral-900">
              {actionLabel}
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              Move <strong>{orderNumber}</strong> from{" "}
              <strong>{formatOrderStatus(currentStatus)}</strong> to{" "}
              <strong>{formatOrderStatus(nextStatus)}</strong>.
            </p>
          </div>

          <div className="space-y-4 px-6 py-5">
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                Note (optional)
              </span>
              <textarea
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className={inputClass}
                placeholder={notePlaceholder ?? "Add an optional note…"}
              />
            </label>

            {error ? (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
            ) : null}
          </div>

          <div className="flex justify-end gap-2 border-t border-neutral-200 px-6 py-4">
            <button
              type="button"
              disabled={loading}
              onClick={onClose}
              className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-rc-navy px-4 py-2 text-sm font-semibold text-white hover:bg-rc-navy-dark disabled:opacity-50"
            >
              {loading ? "Saving…" : actionLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
