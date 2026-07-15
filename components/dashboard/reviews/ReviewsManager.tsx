"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { RejectReviewModal } from "@/components/dashboard/reviews/RejectReviewModal";
import { ReviewDetailModal } from "@/components/dashboard/reviews/ReviewDetailModal";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import {
  DashboardTable,
  DashboardTableHead,
  SecondaryButton,
} from "@/components/dashboard/DashboardTable";
import {
  approveReviewClient,
  fetchReviewsClient,
  rejectReviewClient,
  type ReviewRow,
  type ReviewStatusFilter,
} from "@/lib/api/reviews";

type ReviewsManagerProps = {
  initialReviews: ReviewRow[];
};

type RejectState =
  | { type: "closed" }
  | { type: "open"; review: ReviewRow };

type DetailState =
  | { type: "closed" }
  | { type: "open"; review: ReviewRow };

const statusFilters: Array<{ label: string; value: ReviewStatusFilter | "ALL" }> = [
  { label: "All", value: "ALL" },
  { label: "Pending", value: "PENDING" },
  { label: "Approved", value: "APPROVED" },
  { label: "Rejected", value: "REJECTED" },
];

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

export function ReviewsManager({ initialReviews }: ReviewsManagerProps) {
  const router = useRouter();
  const [reviews, setReviews] = useState(initialReviews);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ReviewStatusFilter | "ALL">("ALL");
  const [loading, setLoading] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");
  const [rejectState, setRejectState] = useState<RejectState>({ type: "closed" });
  const [detailState, setDetailState] = useState<DetailState>({ type: "closed" });
  const [rejecting, setRejecting] = useState(false);
  const [rejectError, setRejectError] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  const loadReviews = useCallback(async (query: string, status: ReviewStatusFilter | "ALL") => {
    setLoading(true);
    try {
      const { items } = await fetchReviewsClient({
        search: query || undefined,
        status: status === "ALL" ? undefined : status,
      });
      setReviews(items);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReviews(debouncedSearch, statusFilter);
  }, [debouncedSearch, statusFilter, loadReviews]);

  async function handleApprove(id: string) {
    setActionError("");
    setActionId(id);
    try {
      await approveReviewClient(id);
      setReviews((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, status: "approved", apiStatus: "APPROVED", rejectionReason: "" } : r,
        ),
      );
      router.refresh();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to approve review");
    } finally {
      setActionId(null);
    }
  }

  async function handleRejectConfirm(reason: string) {
    if (rejectState.type !== "open") return;
    setRejectError("");
    setRejecting(true);
    const { review } = rejectState;

    try {
      await rejectReviewClient(review.id, reason);
      setReviews((prev) =>
        prev.map((r) =>
          r.id === review.id
            ? { ...r, status: "rejected", apiStatus: "REJECTED", rejectionReason: reason }
            : r,
        ),
      );
      setRejectState({ type: "closed" });
      router.refresh();
    } catch (err) {
      setRejectError(err instanceof Error ? err.message : "Failed to reject review");
    } finally {
      setRejecting(false);
    }
  }

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Review management"
        description="Approve customer reviews or reject them with a reason."
      />

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search reviews…"
          className="w-full max-w-sm rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm outline-none focus:border-rc-accent focus:ring-1 focus:ring-rc-accent"
          aria-label="Search reviews"
        />
        <div className="flex flex-wrap gap-2">
          {statusFilters.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => setStatusFilter(filter.value)}
              className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                statusFilter === filter.value
                  ? "border-rc-navy bg-rc-navy text-white"
                  : "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? <p className="text-sm text-neutral-500">Loading reviews…</p> : null}
      {actionError ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{actionError}</p>
      ) : null}

      <DashboardTable>
        <table className="w-full min-w-[900px] border-collapse text-left text-sm">
          <DashboardTableHead
            columns={["Product", "Customer", "Rating", "Review", "Status", "Date", "Actions"]}
          />
          <tbody className="divide-y divide-neutral-100">
            {reviews.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-neutral-500">
                  {debouncedSearch || statusFilter !== "ALL"
                    ? "No reviews match your filters."
                    : "No reviews found."}
                </td>
              </tr>
            ) : (
              reviews.map((review) => (
                <tr key={review.id} className="text-neutral-800">
                  <td className="px-4 py-3 font-medium text-neutral-900">{review.product}</td>
                  <td className="px-4 py-3">{review.customer}</td>
                  <td className="px-4 py-3">
                    <StarRating rating={review.rating} />
                  </td>
                  <td className="max-w-xs px-4 py-3 text-neutral-600">
                    <p className="line-clamp-2">{review.excerpt}</p>
                    {review.status === "rejected" && review.rejectionReason ? (
                      <p className="mt-1 line-clamp-2 text-xs text-red-600">
                        Reason: {review.rejectionReason}
                      </p>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={review.status} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-neutral-500">{review.date}</td>
                  <td className="px-4 py-3">
                    {review.status === "pending" ? (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          disabled={actionId === review.id}
                          onClick={() => handleApprove(review.id)}
                          className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          disabled={actionId === review.id}
                          onClick={() => {
                            setRejectError("");
                            setRejectState({ type: "open", review });
                          }}
                          className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <SecondaryButton onClick={() => setDetailState({ type: "open", review })}>
                        View
                      </SecondaryButton>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </DashboardTable>

      <RejectReviewModal
        open={rejectState.type === "open"}
        productName={rejectState.type === "open" ? rejectState.review.product : ""}
        loading={rejecting}
        error={rejectError}
        onClose={() => {
          if (!rejecting) setRejectState({ type: "closed" });
        }}
        onSubmit={handleRejectConfirm}
      />

      <ReviewDetailModal
        open={detailState.type === "open"}
        review={detailState.type === "open" ? detailState.review : null}
        onClose={() => setDetailState({ type: "closed" })}
      />
    </div>
  );
}
