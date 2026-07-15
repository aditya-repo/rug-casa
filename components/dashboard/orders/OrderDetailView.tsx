"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent, type ReactNode } from "react";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { AdvanceOrderModal } from "@/components/dashboard/orders/AdvanceOrderModal";
import { OrderWorkflowStepper } from "@/components/dashboard/orders/OrderWorkflowStepper";
import { PrimaryButton, SecondaryButton } from "@/components/dashboard/DashboardTable";
import {
  addOrderNoteClient,
  fetchOrderClient,
  formatOrderStatus,
  generateInvoiceClient,
  getWorkflowAction,
  updateOrderStatusClient,
  type ApiOrderDetail,
  type OrderStatus,
} from "@/lib/api/orders";
import { formatCurrency, formatDate, imageUrl, mapStatusToUi } from "@/lib/api/mappers";

type OrderDetailViewProps = {
  initialOrder: ApiOrderDetail;
};

const inputClass =
  "mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm outline-none focus:border-rc-accent focus:ring-1 focus:ring-rc-accent";

export function OrderDetailView({ initialOrder }: OrderDetailViewProps) {
  const router = useRouter();
  const [order, setOrder] = useState(initialOrder);
  const [advanceModalOpen, setAdvanceModalOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusError, setStatusError] = useState("");
  const [noteText, setNoteText] = useState("");
  const [noteInternal, setNoteInternal] = useState(true);
  const [addingNote, setAddingNote] = useState(false);
  const [noteError, setNoteError] = useState("");
  const [generatingInvoice, setGeneratingInvoice] = useState(false);
  const [invoiceError, setInvoiceError] = useState("");

  async function reloadOrder() {
    const fresh = await fetchOrderClient(order.id);
    setOrder(fresh);
    router.refresh();
  }

  async function handleAdvanceOrder(payload: { status: OrderStatus; note?: string }) {
    setStatusError("");
    setUpdatingStatus(true);
    try {
      await updateOrderStatusClient(order.id, payload);
      setAdvanceModalOpen(false);
      await reloadOrder();
    } catch (err) {
      setStatusError(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setUpdatingStatus(false);
    }
  }

  async function handleAddNote(e: FormEvent) {
    e.preventDefault();
    if (!noteText.trim()) return;
    setNoteError("");
    setAddingNote(true);
    try {
      await addOrderNoteClient(order.id, { note: noteText.trim(), isInternal: noteInternal });
      setNoteText("");
      await reloadOrder();
    } catch (err) {
      setNoteError(err instanceof Error ? err.message : "Failed to add note");
    } finally {
      setAddingNote(false);
    }
  }

  async function handleGenerateInvoice() {
    setInvoiceError("");
    setGeneratingInvoice(true);
    try {
      const result = await generateInvoiceClient(order.id);
      setOrder((prev) => ({
        ...prev,
        invoiceNumber: result.invoiceNumber,
        invoicePath: result.invoicePath,
      }));
      router.refresh();
    } catch (err) {
      setInvoiceError(err instanceof Error ? err.message : "Failed to generate invoice");
    } finally {
      setGeneratingInvoice(false);
    }
  }

  const workflowAction = getWorkflowAction(order.status);
  const invoiceUrl = order.invoicePath ? imageUrl(order.invoicePath) : null;

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title={order.orderNumber}
        description={`Placed on ${formatDate(order.createdAt)}`}
        actions={
          <div className="flex flex-wrap gap-2">
            <Link href="/dashboard/orders">
              <SecondaryButton>Back to orders</SecondaryButton>
            </Link>
            {workflowAction ? (
              <PrimaryButton
                onClick={() => {
                  setStatusError("");
                  setAdvanceModalOpen(true);
                }}
              >
                {workflowAction.label}
              </PrimaryButton>
            ) : null}
          </div>
        }
      />

      <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
          Fulfillment progress
        </p>
        <OrderWorkflowStepper currentStatus={order.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Section title="Order summary">
            <dl className="grid gap-4 sm:grid-cols-2">
              <SummaryItem label="Order status">
                <StatusBadge status={mapStatusToUi(order.status)} />
              </SummaryItem>
              <SummaryItem label="Payment">
                <StatusBadge status={mapStatusToUi(order.paymentStatus)} />
              </SummaryItem>
              <SummaryItem label="Payment method" value={order.paymentMethod?.replace(/_/g, " ") ?? "—"} />
              <SummaryItem label="Customer" value={`${order.customer.firstName} ${order.customer.lastName}`} />
              <SummaryItem label="Email" value={order.customer.email} />
              <SummaryItem label="Phone" value={order.customer.phone ?? "—"} />
              {order.trackingNumber ? (
                <SummaryItem label="Tracking" value={`${order.carrier ? `${order.carrier}: ` : ""}${order.trackingNumber}`} />
              ) : null}
            </dl>
          </Section>

          <Section title="Line items">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[480px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-neutral-200 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                    <th className="pb-2 pr-4">Product</th>
                    <th className="pb-2 pr-4">SKU</th>
                    <th className="pb-2 pr-4">Qty</th>
                    <th className="pb-2 pr-4">Price</th>
                    <th className="pb-2">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <td className="py-3 pr-4 font-medium text-neutral-900">{item.title}</td>
                      <td className="py-3 pr-4 font-mono text-xs text-neutral-500">{item.sku}</td>
                      <td className="py-3 pr-4">{item.quantity}</td>
                      <td className="py-3 pr-4">{formatCurrency(item.price)}</td>
                      <td className="py-3 font-medium">{formatCurrency(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <dl className="mt-4 space-y-1 border-t border-neutral-200 pt-4 text-sm">
              <TotalRow label="Subtotal" value={formatCurrency(order.subtotal)} />
              <TotalRow label="Discount" value={formatCurrency(order.discount)} />
              <TotalRow label="Tax" value={formatCurrency(order.tax)} />
              <TotalRow label="Shipping" value={formatCurrency(order.shippingCost)} />
              <TotalRow label="Total" value={formatCurrency(order.total)} bold />
            </dl>
          </Section>

          <Section title="Status history">
            {order.statusHistory.length === 0 ? (
              <p className="text-sm text-neutral-500">No status changes recorded.</p>
            ) : (
              <ol className="space-y-3">
                {order.statusHistory.map((entry) => (
                  <li key={entry.id} className="flex gap-3 text-sm">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-rc-accent" aria-hidden />
                    <div>
                      <p className="font-medium text-neutral-900">
                        {formatOrderStatus(entry.status)}{" "}
                        <span className="font-normal text-neutral-500">· {formatDate(entry.createdAt)}</span>
                      </p>
                      {entry.note ? <p className="mt-0.5 text-neutral-600">{entry.note}</p> : null}
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </Section>

          <Section title="Admin notes">
            <form onSubmit={handleAddNote} className="mb-4 space-y-3">
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Add note</span>
                <textarea
                  rows={3}
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  className={inputClass}
                  placeholder="Internal note or customer-facing update…"
                />
              </label>
              <label className="flex items-center gap-2 text-sm text-neutral-700">
                <input
                  type="checkbox"
                  checked={noteInternal}
                  onChange={(e) => setNoteInternal(e.target.checked)}
                  className="rounded border-neutral-300 text-rc-accent focus:ring-rc-accent"
                />
                Internal note (not visible to customer)
              </label>
              {noteError ? <p className="text-sm text-red-600">{noteError}</p> : null}
              <button
                type="submit"
                disabled={addingNote || !noteText.trim()}
                className="rounded-lg bg-rc-navy px-4 py-2 text-sm font-semibold text-white hover:bg-rc-navy-dark disabled:opacity-50"
              >
                {addingNote ? "Adding…" : "Add note"}
              </button>
            </form>

            {order.orderNotes.length === 0 ? (
              <p className="text-sm text-neutral-500">No notes yet.</p>
            ) : (
              <ul className="space-y-2">
                {order.orderNotes.map((n) => (
                  <li key={n.id} className="rounded-lg border border-neutral-200 bg-neutral-50/60 px-3 py-2 text-sm">
                    <p className="text-neutral-800">{n.note}</p>
                    <p className="mt-1 text-xs text-neutral-500">
                      {n.admin?.name ?? "Admin"} · {formatDate(n.createdAt)}
                      {n.isInternal ? " · Internal" : " · Customer visible"}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Section>
        </div>

        <div className="space-y-6">
          <Section title="Invoice">
            {order.invoiceNumber ? (
              <div className="space-y-2 text-sm">
                <p className="font-medium text-neutral-900">{order.invoiceNumber}</p>
                {invoiceUrl ? (
                  <a
                    href={invoiceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex text-rc-accent hover:underline"
                  >
                    View invoice
                  </a>
                ) : null}
              </div>
            ) : (
              <p className="text-sm text-neutral-500">No invoice generated yet.</p>
            )}
            {invoiceError ? <p className="mt-2 text-sm text-red-600">{invoiceError}</p> : null}
            <button
              type="button"
              disabled={generatingInvoice}
              onClick={handleGenerateInvoice}
              className="mt-3 w-full rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
            >
              {generatingInvoice ? "Generating…" : order.invoiceNumber ? "Regenerate invoice" : "Generate invoice"}
            </button>
          </Section>

          {order.shippingAddress ? (
            <Section title="Shipping address">
              <AddressBlock address={order.shippingAddress} />
            </Section>
          ) : null}

          {order.billingAddress ? (
            <Section title="Billing address">
              <AddressBlock address={order.billingAddress} />
            </Section>
          ) : null}

          {order.returnRequests && order.returnRequests.length > 0 ? (
            <Section title="Return requests">
              <ul className="space-y-2 text-sm">
                {order.returnRequests.map((r) => (
                  <li key={r.id} className="flex items-center justify-between gap-2">
                    <Link href="/dashboard/returns" className="text-rc-accent hover:underline">
                      View return
                    </Link>
                    <StatusBadge status={mapStatusToUi(r.status)} />
                  </li>
                ))}
              </ul>
            </Section>
          ) : null}
        </div>
      </div>

      {workflowAction ? (
        <AdvanceOrderModal
          open={advanceModalOpen}
          orderNumber={order.orderNumber}
          currentStatus={order.status}
          nextStatus={workflowAction.nextStatus}
          actionLabel={workflowAction.label}
          notePlaceholder={workflowAction.notePlaceholder}
          loading={updatingStatus}
          error={statusError}
          onClose={() => {
            if (!updatingStatus) setAdvanceModalOpen(false);
          }}
          onSubmit={handleAdvanceOrder}
        />
      ) : null}
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-500">{title}</h2>
      {children}
    </section>
  );
}

function SummaryItem({
  label,
  value,
  children,
}: {
  label: string;
  value?: string;
  children?: ReactNode;
}) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-500">{label}</dt>
      <dd className="mt-1 text-sm text-neutral-900">{children ?? value}</dd>
    </div>
  );
}

function TotalRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between ${bold ? "font-semibold text-neutral-900" : "text-neutral-600"}`}>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function AddressBlock({ address }: { address: NonNullable<ApiOrderDetail["shippingAddress"]> }) {
  return (
    <address className="not-italic text-sm text-neutral-700">
      {address.label ? <p className="font-medium text-neutral-900">{address.label}</p> : null}
      <p>{address.line1}</p>
      {address.line2 ? <p>{address.line2}</p> : null}
      <p>
        {address.city}, {address.state} {address.postalCode}
      </p>
      <p>{address.country}</p>
    </address>
  );
}
