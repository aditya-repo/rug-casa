"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { AdvanceOrderModal } from "@/components/dashboard/orders/AdvanceOrderModal";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { OrderWorkflowStepper } from "@/components/dashboard/orders/OrderWorkflowStepper";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import {
  DashboardTable,
  DashboardTableHead,
} from "@/components/dashboard/DashboardTable";
import {
  fetchOrdersClient,
  getWorkflowAction,
  ORDER_WORKFLOW_TABS,
  PAYMENT_STATUSES,
  updateOrderStatusClient,
  type OrderRow,
  type OrderStatus,
  type PaymentStatus,
} from "@/lib/api/orders";

type OrdersManagerProps = {
  initialOrders: OrderRow[];
  initialTab?: OrderStatus;
};

type AdvanceState =
  | { type: "closed" }
  | { type: "open"; order: OrderRow };

export function OrdersManager({ initialOrders, initialTab = "PENDING" }: OrdersManagerProps) {
  const router = useRouter();
  const [orders, setOrders] = useState(initialOrders);
  const [activeTab, setActiveTab] = useState<OrderStatus>(initialTab);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState<PaymentStatus | "ALL">("ALL");
  const [loading, setLoading] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");
  const [advanceState, setAdvanceState] = useState<AdvanceState>({ type: "closed" });
  const [advancing, setAdvancing] = useState(false);
  const [advanceError, setAdvanceError] = useState("");

  const activeTabMeta = ORDER_WORKFLOW_TABS.find((t) => t.value === activeTab)!;
  const advanceAction =
    advanceState.type === "open" ? getWorkflowAction(advanceState.order.apiStatus) : null;

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  const loadOrders = useCallback(
    async (query: string, status: OrderStatus, payment: PaymentStatus | "ALL") => {
      setLoading(true);
      try {
        const { items } = await fetchOrdersClient({
          search: query || undefined,
          status,
          paymentStatus: payment === "ALL" ? undefined : payment,
        });
        setOrders(items);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    loadOrders(debouncedSearch, activeTab, paymentFilter);
  }, [debouncedSearch, activeTab, paymentFilter, loadOrders]);

  async function handleQuickAdvance(order: OrderRow) {
    const action = getWorkflowAction(order.apiStatus);
    if (!action) return;

    setActionError("");
    setActionId(order.id);
    try {
      await updateOrderStatusClient(order.id, {
        status: action.nextStatus,
        note: `${action.label} from ${activeTabMeta.label} queue`,
      });
      setOrders((prev) => prev.filter((o) => o.id !== order.id));
      router.refresh();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to update order");
    } finally {
      setActionId(null);
    }
  }

  async function handleAdvanceConfirm(payload: { status: OrderStatus; note?: string }) {
    if (advanceState.type !== "open") return;
    setAdvanceError("");
    setAdvancing(true);
    const { order } = advanceState;

    try {
      await updateOrderStatusClient(order.id, payload);
      setOrders((prev) => prev.filter((o) => o.id !== order.id));
      setAdvanceState({ type: "closed" });
      router.refresh();
    } catch (err) {
      setAdvanceError(err instanceof Error ? err.message : "Failed to update order");
    } finally {
      setAdvancing(false);
    }
  }

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Order management"
        description="Process orders through the fulfillment pipeline: approve, pack, then ship."
      />

      <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
          Fulfillment pipeline
        </p>
        <OrderWorkflowStepper currentStatus={activeTab} />
      </div>

      <div className="flex flex-wrap gap-2">
        {ORDER_WORKFLOW_TABS.map((tab) => (
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
          placeholder="Search by order ID or customer…"
          className="w-full max-w-md rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm outline-none focus:border-rc-accent focus:ring-1 focus:ring-rc-accent"
          aria-label="Search orders"
        />
        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value as PaymentStatus | "ALL")}
          className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-800 outline-none focus:border-rc-accent focus:ring-1 focus:ring-rc-accent"
          aria-label="Filter by payment status"
        >
          <option value="ALL">All payments</option>
          {PAYMENT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.replace(/_/g, " ")}
            </option>
          ))}
        </select>
      </div>

      {loading ? <p className="text-sm text-neutral-500">Loading orders…</p> : null}
      {actionError ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{actionError}</p>
      ) : null}

      <DashboardTable>
        <table className="w-full min-w-[900px] border-collapse text-left text-sm">
          <DashboardTableHead
            columns={["Order", "Customer", "Items", "Total", "Payment", "Date", "Actions"]}
          />
          <tbody className="divide-y divide-neutral-100">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-neutral-500">
                  {debouncedSearch || paymentFilter !== "ALL"
                    ? "No orders match your filters in this stage."
                    : `No ${activeTabMeta.label.toLowerCase()} orders right now.`}
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const action = getWorkflowAction(order.apiStatus);

                return (
                  <tr key={order.id} className="text-neutral-800">
                    <td className="whitespace-nowrap px-4 py-3 font-semibold text-neutral-900">
                      {order.orderNumber}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-neutral-900">{order.customer}</p>
                      <p className="text-xs text-neutral-500">{order.customerEmail}</p>
                    </td>
                    <td className="px-4 py-3">{order.items}</td>
                    <td className="whitespace-nowrap px-4 py-3 font-medium">{order.total}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={order.paymentStatus} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-neutral-500">{order.date}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        {action ? (
                          <>
                            <button
                              type="button"
                              disabled={actionId === order.id}
                              onClick={() => handleQuickAdvance(order)}
                              className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                            >
                              {actionId === order.id ? "Saving…" : action.label}
                            </button>
                            <button
                              type="button"
                              disabled={actionId === order.id}
                              onClick={() => {
                                setAdvanceError("");
                                setAdvanceState({ type: "open", order });
                              }}
                              className="rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
                            >
                              With note
                            </button>
                          </>
                        ) : null}
                        <Link
                          href={`/dashboard/orders/${order.id}`}
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
        <AdvanceOrderModal
          open
          orderNumber={advanceState.order.orderNumber}
          currentStatus={advanceState.order.apiStatus}
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
    </div>
  );
}
