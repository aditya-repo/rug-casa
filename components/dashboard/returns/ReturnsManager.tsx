"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { AdvanceReturnModal } from "@/components/dashboard/returns/AdvanceReturnModal";
import { RejectReturnModal } from "@/components/dashboard/returns/RejectReturnModal";
import { ReturnWorkflowStepper } from "@/components/dashboard/returns/ReturnWorkflowStepper";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { DashboardTable, DashboardTableHead } from "@/components/dashboard/DashboardTable";
import {
  advanceReturnClient,
  approveReturnClient,
  fetchReturnsClient,
  getReturnWorkflowAction,
  rejectReturnClient,
  updateReturnStatusClient,
  RETURN_TYPE_FILTERS,
  RETURN_WORKFLOW_TABS,
  type ReturnRow,
  type ReturnStatus,
  type ReturnType,
} from "@/lib/api/returns";

type ReturnsManagerProps = {
  initialReturns: ReturnRow[];
  initialTab?: ReturnStatus;
};

type AdvanceState = { type: "closed" } | { type: "open"; item: ReturnRow };
type RejectState = { type: "closed" } | { type: "open"; item: ReturnRow };

export function ReturnsManager({ initialReturns, initialTab = "PENDING" }: ReturnsManagerProps) {
  const router = useRouter();
  const [returns, setReturns] = useState(initialReturns);
  const [activeTab, setActiveTab] = useState<ReturnStatus>(initialTab);
  const [typeFilter, setTypeFilter] = useState<ReturnType | "ALL">("ALL");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");
  const [advanceState, setAdvanceState] = useState<AdvanceState>({ type: "closed" });
  const [rejectState, setRejectState] = useState<RejectState>({ type: "closed" });
  const [advancing, setAdvancing] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [advanceError, setAdvanceError] = useState("");
  const [rejectError, setRejectError] = useState("");

  const activeTabMeta = RETURN_WORKFLOW_TABS.find((t) => t.value === activeTab)!;
  const advanceAction =
    advanceState.type === "open"
      ? getReturnWorkflowAction(advanceState.item.apiType, advanceState.item.apiStatus)
      : null;

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  const loadReturns = useCallback(
    async (query: string, status: ReturnStatus, type: ReturnType | "ALL") => {
      setLoading(true);
      try {
        const { items } = await fetchReturnsClient({
          search: query || undefined,
          status,
          type: type === "ALL" ? undefined : type,
        });
        setReturns(items);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    loadReturns(debouncedSearch, activeTab, typeFilter);
  }, [debouncedSearch, activeTab, typeFilter, loadReturns]);

  async function handleQuickAdvance(item: ReturnRow) {
    const action = getReturnWorkflowAction(item.apiType, item.apiStatus);
    if (!action) return;

    setActionError("");
    setActionId(item.id);
    try {
      if (item.apiStatus === "PENDING") {
        await approveReturnClient(item.id);
      } else {
        await advanceReturnClient(item.id, item.apiType, item.apiStatus);
      }
      setReturns((prev) => prev.filter((r) => r.id !== item.id));
      router.refresh();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to update request");
    } finally {
      setActionId(null);
    }
  }

  async function handleAdvanceConfirm(note?: string) {
    if (advanceState.type !== "open" || !advanceAction) return;
    setAdvanceError("");
    setAdvancing(true);
    const { item } = advanceState;

    try {
      if (item.apiStatus === "PENDING") {
        await updateReturnStatusClient(item.id, { status: "APPROVED", note });
      } else {
        await updateReturnStatusClient(item.id, { status: advanceAction.nextStatus, note });
      }
      setReturns((prev) => prev.filter((r) => r.id !== item.id));
      setAdvanceState({ type: "closed" });
      router.refresh();
    } catch (err) {
      setAdvanceError(err instanceof Error ? err.message : "Failed to update request");
    } finally {
      setAdvancing(false);
    }
  }

  async function handleRejectConfirm(note: string) {
    if (rejectState.type !== "open") return;
    setRejectError("");
    setRejecting(true);
    const { item } = rejectState;

    try {
      await rejectReturnClient(item.id, note);
      setReturns((prev) => prev.filter((r) => r.id !== item.id));
      setRejectState({ type: "closed" });
      router.refresh();
    } catch (err) {
      setRejectError(err instanceof Error ? err.message : "Failed to decline request");
    } finally {
      setRejecting(false);
    }
  }

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Return & exchange management"
        description="Review requests, approve or decline, then process refunds and exchanges."
      />

      <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
          Return / exchange pipeline
        </p>
        <ReturnWorkflowStepper type="RETURN" currentStatus={activeTab} />
      </div>

      <div className="flex flex-wrap gap-2">
        {RETURN_WORKFLOW_TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setActiveTab(tab.value)}
            className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.value
                ? "border-rc-navy bg-rc-navy text-white"
                : "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <p className="text-sm text-neutral-600">{activeTabMeta.description}</p>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by request ID or order…"
          className="w-full max-w-md rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm outline-none focus:border-rc-accent focus:ring-1 focus:ring-rc-accent"
          aria-label="Search return requests"
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as ReturnType | "ALL")}
          className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-800 outline-none focus:border-rc-accent focus:ring-1 focus:ring-rc-accent"
          aria-label="Filter by request type"
        >
          {RETURN_TYPE_FILTERS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
      </div>

      {loading ? <p className="text-sm text-neutral-500">Loading requests…</p> : null}
      {actionError ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{actionError}</p>
      ) : null}

      <DashboardTable>
        <table className="w-full min-w-[920px] border-collapse text-left text-sm">
          <DashboardTableHead
            columns={["Request", "Order", "Customer", "Type", "Reason", "Amount", "Date", "Actions"]}
          />
          <tbody className="divide-y divide-neutral-100">
            {returns.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-neutral-500">
                  {debouncedSearch || typeFilter !== "ALL"
                    ? "No requests match your filters in this stage."
                    : `No ${activeTabMeta.label.toLowerCase()} requests right now.`}
                </td>
              </tr>
            ) : (
              returns.map((item) => {
                const action = getReturnWorkflowAction(item.apiType, item.apiStatus);
                const isPending = item.apiStatus === "PENDING";

                return (
                  <tr key={item.id} className="text-neutral-800">
                    <td className="whitespace-nowrap px-4 py-3 font-semibold text-neutral-900">
                      {item.requestNumber}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-xs">
                      {item.orderUuid ? (
                        <Link href={`/dashboard/orders/${item.orderUuid}`} className="text-rc-accent hover:underline">
                          {item.orderId}
                        </Link>
                      ) : (
                        item.orderId
                      )}
                    </td>
                    <td className="px-4 py-3">{item.customer}</td>
                    <td className="px-4 py-3 capitalize">
                      <StatusBadge status={item.type} />
                    </td>
                    <td className="max-w-[10rem] px-4 py-3 text-neutral-600">
                      <p className="line-clamp-2">{item.reason}</p>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-medium">{item.amount}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-neutral-500">{item.date}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        {action ? (
                          <>
                            <button
                              type="button"
                              disabled={actionId === item.id}
                              onClick={() => handleQuickAdvance(item)}
                              className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                            >
                              {actionId === item.id ? "Saving…" : action.label}
                            </button>
                            {!isPending ? (
                              <button
                                type="button"
                                disabled={actionId === item.id}
                                onClick={() => {
                                  setAdvanceError("");
                                  setAdvanceState({ type: "open", item });
                                }}
                                className="rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
                              >
                                With note
                              </button>
                            ) : (
                              <button
                                type="button"
                                disabled={actionId === item.id}
                                onClick={() => {
                                  setAdvanceError("");
                                  setAdvanceState({ type: "open", item });
                                }}
                                className="rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
                              >
                                Approve with note
                              </button>
                            )}
                          </>
                        ) : null}
                        {isPending ? (
                          <button
                            type="button"
                            disabled={actionId === item.id}
                            onClick={() => {
                              setRejectError("");
                              setRejectState({ type: "open", item });
                            }}
                            className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                          >
                            Decline
                          </button>
                        ) : null}
                        <Link
                          href={`/dashboard/returns/${item.id}`}
                          className="inline-block rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
                        >
                          View
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </DashboardTable>

      {advanceAction && advanceState.type === "open" ? (
        <AdvanceReturnModal
          open
          requestNumber={advanceState.item.requestNumber}
          currentStatus={advanceState.item.apiStatus}
          nextStatus={advanceAction.nextStatus}
          actionLabel={advanceAction.label}
          notePlaceholder={advanceAction.notePlaceholder}
          loading={advancing}
          error={advanceError}
          onClose={() => {
            if (!advancing) setAdvanceState({ type: "closed" });
          }}
          onSubmit={handleAdvanceConfirm}
        />
      ) : null}

      <RejectReturnModal
        open={rejectState.type === "open"}
        requestNumber={rejectState.type === "open" ? rejectState.item.requestNumber : ""}
        loading={rejecting}
        error={rejectError}
        onClose={() => {
          if (!rejecting) setRejectState({ type: "closed" });
        }}
        onSubmit={handleRejectConfirm}
      />
    </div>
  );
}
