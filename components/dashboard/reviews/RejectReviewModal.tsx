"use client";

import { useEffect, useState, type FormEvent } from "react";

type RejectReviewModalProps = {
  open: boolean;
  productName: string;
  loading?: boolean;
  error?: string;
  onClose: () => void;
  onSubmit: (reason: string) => void;
};

const inputClass =
  "mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm outline-none focus:border-rc-accent focus:ring-1 focus:ring-rc-accent";

export function RejectReviewModal({
  open,
  productName,
  loading = false,
  error,
  onClose,
  onSubmit,
}: RejectReviewModalProps) {
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (!open) return;
    setReason("");
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
    onSubmit(reason.trim());
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
        aria-labelledby="reject-review-title"
        className="relative w-full max-w-md rounded-xl border border-neutral-200 bg-white shadow-xl"
      >
        <form onSubmit={handleSubmit}>
          <div className="border-b border-neutral-200 px-6 py-4">
            <h2 id="reject-review-title" className="text-lg font-semibold text-neutral-900">
              Reject review
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              Provide a reason for rejecting the review on <strong>{productName}</strong>.
            </p>
          </div>

          <div className="space-y-4 px-6 py-5">
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                Rejection reason
              </span>
              <textarea
                required
                rows={4}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className={inputClass}
                placeholder="e.g. Contains inappropriate language or is not related to the product."
                maxLength={1000}
              />
            </label>
            <p className="text-xs text-neutral-500">This reason is stored for admin reference.</p>
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
              disabled={loading || !reason.trim()}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? "Rejecting…" : "Reject review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
