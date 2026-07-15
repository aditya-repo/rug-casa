"use client";

import { useEffect, useState, type ReactNode } from "react";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { fetchReviewClient, type ReviewRow } from "@/lib/api/reviews";

type ReviewDetailModalProps = {
  open: boolean;
  review: ReviewRow | null;
  onClose: () => void;
};

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5 text-amber-500" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          className={`h-4 w-4 ${i < rating ? "fill-current" : "fill-neutral-200 text-neutral-200"}`}
          viewBox="0 0 20 20"
          aria-hidden
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.539 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81H7.03a1 1 0 00.95-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  );
}

export function ReviewDetailModal({ open, review, onClose }: ReviewDetailModalProps) {
  const [detail, setDetail] = useState<Awaited<ReturnType<typeof fetchReviewClient>> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open || !review) return;
    setLoading(true);
    setError("");
    fetchReviewClient(review.id)
      .then(setDetail)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load review"))
      .finally(() => setLoading(false));
  }, [open, review]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, loading, onClose]);

  if (!open || !review) return null;

  const rejectionReason = detail?.rejectionReason ?? review.rejectionReason;

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
        aria-labelledby="review-detail-title"
        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-neutral-200 bg-white shadow-xl"
      >
        <div className="sticky top-0 flex items-start justify-between gap-4 border-b border-neutral-200 bg-white px-6 py-4">
          <div>
            <h2 id="review-detail-title" className="text-lg font-semibold text-neutral-900">
              Review details
            </h2>
            <p className="mt-1 text-sm text-neutral-500">{review.product}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-sm font-medium text-neutral-500 hover:bg-neutral-100"
          >
            Close
          </button>
        </div>

        <div className="space-y-5 px-6 py-5">
          {loading ? (
            <p className="text-sm text-neutral-500">Loading review…</p>
          ) : error ? (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-3">
                <StarRating rating={review.rating} />
                <StatusBadge status={review.status} />
                <span className="text-sm text-neutral-500">{review.date}</span>
              </div>

              <InfoBlock label="Customer" value={review.customer} />
              {review.title ? <InfoBlock label="Title" value={review.title} /> : null}
              <InfoBlock label="Review" value={detail?.content ?? review.excerpt} />

              {review.status === "rejected" && rejectionReason ? (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-red-700">
                    Rejection reason
                  </p>
                  <p className="mt-1 text-sm text-red-900">{rejectionReason}</p>
                </div>
              ) : null}

              {detail?.adminReply ? (
                <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                    Admin reply
                  </p>
                  <p className="mt-1 text-sm text-neutral-800">{detail.adminReply}</p>
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoBlock({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">{label}</p>
      <div className="mt-1 text-sm text-neutral-800">{value}</div>
    </div>
  );
}
