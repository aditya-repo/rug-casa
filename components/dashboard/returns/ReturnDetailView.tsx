"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent, type ReactNode } from "react";
import { AdvanceReturnModal } from "@/components/dashboard/returns/AdvanceReturnModal";
import { RejectReturnModal } from "@/components/dashboard/returns/RejectReturnModal";
import { ReturnWorkflowStepper } from "@/components/dashboard/returns/ReturnWorkflowStepper";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { PrimaryButton, SecondaryButton } from "@/components/dashboard/DashboardTable";
import {
  approveReturnClient,
  fetchReturnClient,
  formatReturnStatus,
  getReturnWorkflowAction,
  rejectReturnClient,
  updateReturnStatusClient,
  type ApiReturnDetail,
  type PickupStatus,
  type RefundStatus,
} from "@/lib/api/returns";
import { formatCurrency, formatDate, imageUrl, mapStatusToUi } from "@/lib/api/mappers";

type ReturnDetailViewProps = {
  initialReturn: ApiReturnDetail;
};

const inputClass =
  "mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm outline-none focus:border-rc-accent focus:ring-1 focus:ring-rc-accent";

const PICKUP_STATUSES: PickupStatus[] = ["NOT_SCHEDULED", "SCHEDULED", "PICKED_UP", "FAILED"];
const REFUND_STATUSES: RefundStatus[] = ["NOT_INITIATED", "PENDING", "PROCESSED", "FAILED"];

export function ReturnDetailView({ initialReturn }: ReturnDetailViewProps) {
  const router = useRouter();
  const [item, setItem] = useState(initialReturn);
  const [advanceOpen, setAdvanceOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [advancing, setAdvancing] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [advanceError, setAdvanceError] = useState("");
  const [rejectError, setRejectError] = useState("");
  const [adminNotes, setAdminNotes] = useState(item.adminNotes ?? "");
  const [pickupStatus, setPickupStatus] = useState<PickupStatus>(item.pickupStatus);
  const [refundStatus, setRefundStatus] = useState<RefundStatus>(item.refundStatus);
  const [savingMeta, setSavingMeta] = useState(false);
  const [metaError, setMetaError] = useState("");

  const workflowAction = getReturnWorkflowAction(item.type, item.status);

  async function reload() {
    const fresh = await fetchReturnClient(item.id);
    setItem(fresh);
    setAdminNotes(fresh.adminNotes ?? "");
    setPickupStatus(fresh.pickupStatus);
    setRefundStatus(fresh.refundStatus);
    router.refresh();
  }

  async function handleAdvance(note?: string) {
    if (!workflowAction) return;
    setAdvanceError("");
    setAdvancing(true);
    try {
      if (item.status === "PENDING") {
        await approveReturnClient(item.id);
      } else {
        await updateReturnStatusClient(item.id, {
          status: workflowAction.nextStatus,
          note,
        });
      }
      setAdvanceOpen(false);
      await reload();
    } catch (err) {
      setAdvanceError(err instanceof Error ? err.message : "Failed to update request");
    } finally {
      setAdvancing(false);
    }
  }

  async function handleReject(note: string) {
    setRejectError("");
    setRejecting(true);
    try {
      await rejectReturnClient(item.id, note);
      setRejectOpen(false);
      await reload();
    } catch (err) {
      setRejectError(err instanceof Error ? err.message : "Failed to decline request");
    } finally {
      setRejecting(false);
    }
  }

  async function handleSaveMeta(e: FormEvent) {
    e.preventDefault();
    setMetaError("");
    setSavingMeta(true);
    try {
      await updateReturnStatusClient(item.id, {
        status: item.status,
        adminNotes: adminNotes.trim() || undefined,
        pickupStatus,
        refundStatus,
      });
      await reload();
    } catch (err) {
      setMetaError(err instanceof Error ? err.message : "Failed to save details");
    } finally {
      setSavingMeta(false);
    }
  }

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title={item.requestNumber}
        description={`${formatReturnStatus(item.type)} request · ${formatDate(item.createdAt)}`}
        actions={
          <div className="flex flex-wrap gap-2">
            <Link href="/dashboard/returns">
              <SecondaryButton>Back to returns</SecondaryButton>
            </Link>
            {item.status === "PENDING" ? (
              <button
                type="button"
                onClick={() => {
                  setRejectError("");
                  setRejectOpen(true);
                }}
                className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
              >
                Decline
              </button>
            ) : null}
            {workflowAction ? (
              <PrimaryButton
                onClick={() => {
                  setAdvanceError("");
                  setAdvanceOpen(true);
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
          Request progress
        </p>
        <ReturnWorkflowStepper type={item.type} currentStatus={item.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Section title="Request summary">
            <dl className="grid gap-4 sm:grid-cols-2">
              <SummaryItem label="Type">
                <StatusBadge status={mapStatusToUi(item.type)} />
              </SummaryItem>
              <SummaryItem label="Status">
                <StatusBadge status={mapStatusToUi(item.status)} />
              </SummaryItem>
              <SummaryItem label="Amount" value={formatCurrency(item.amount)} />
              <SummaryItem label="Customer" value={`${item.customer.firstName} ${item.customer.lastName}`} />
              <SummaryItem label="Email" value={item.customer.email} />
              <SummaryItem label="Phone" value={item.customer.phone ?? "—"} />
              <SummaryItem label="Order">
                <Link href={`/dashboard/orders/${item.order.id}`} className="text-rc-accent hover:underline">
                  {item.order.orderNumber}
                </Link>
              </SummaryItem>
            </dl>
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Customer reason</p>
              <p className="mt-1 text-sm text-neutral-800">{item.reason}</p>
            </div>
          </Section>

          {item.order.items && item.order.items.length > 0 ? (
            <Section title="Order items">
              <ul className="divide-y divide-neutral-100 text-sm">
                {item.order.items.map((line) => (
                  <li key={line.id} className="flex justify-between gap-4 py-2">
                    <span className="font-medium text-neutral-900">{line.title}</span>
                    <span className="text-neutral-500">
                      {line.sku} × {line.quantity}
                    </span>
                  </li>
                ))}
              </ul>
            </Section>
          ) : null}

          {item.images.length > 0 ? (
            <Section title="Customer photos">
              <div className="flex flex-wrap gap-3">
                {item.images.map((img) => (
                  <div
                    key={img.id}
                    className="relative h-20 w-20 overflow-hidden rounded-lg border border-neutral-200"
                  >
                    <Image
                      src={imageUrl(img.thumbnail ?? img.path)}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                ))}
              </div>
            </Section>
          ) : null}

          <Section title="Status history">
            {item.statusHistory.length === 0 ? (
              <p className="text-sm text-neutral-500">No status changes recorded.</p>
            ) : (
              <ol className="space-y-3">
                {item.statusHistory.map((entry) => (
                  <li key={entry.id} className="flex gap-3 text-sm">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-rc-accent" aria-hidden />
                    <div>
                      <p className="font-medium text-neutral-900">
                        {formatReturnStatus(entry.status)}{" "}
                        <span className="font-normal text-neutral-500">· {formatDate(entry.createdAt)}</span>
                      </p>
                      {entry.note ? <p className="mt-0.5 text-neutral-600">{entry.note}</p> : null}
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </Section>
        </div>

        <div className="space-y-6">
          <Section title="Pickup & refund">
            <form onSubmit={handleSaveMeta} className="space-y-4">
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Pickup status
                </span>
                <select
                  value={pickupStatus}
                  onChange={(e) => setPickupStatus(e.target.value as PickupStatus)}
                  className={inputClass}
                >
                  {PICKUP_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {formatReturnStatus(s)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Refund status
                </span>
                <select
                  value={refundStatus}
                  onChange={(e) => setRefundStatus(e.target.value as RefundStatus)}
                  className={inputClass}
                >
                  {REFUND_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {formatReturnStatus(s)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Admin notes
                </span>
                <textarea
                  rows={4}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className={inputClass}
                  placeholder="Internal notes about this return or exchange…"
                />
              </label>
              {metaError ? <p className="text-sm text-red-600">{metaError}</p> : null}
              <button
                type="submit"
                disabled={savingMeta}
                className="w-full rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
              >
                {savingMeta ? "Saving…" : "Save details"}
              </button>
            </form>
            {item.admin?.name ? (
              <p className="mt-3 text-xs text-neutral-500">Last handled by {item.admin.name}</p>
            ) : null}
          </Section>
        </div>
      </div>

      {workflowAction ? (
        <AdvanceReturnModal
          open={advanceOpen}
          requestNumber={item.requestNumber}
          currentStatus={item.status}
          nextStatus={workflowAction.nextStatus}
          actionLabel={workflowAction.label}
          notePlaceholder={workflowAction.notePlaceholder}
          loading={advancing}
          error={advanceError}
          onClose={() => {
            if (!advancing) setAdvanceOpen(false);
          }}
          onSubmit={handleAdvance}
        />
      ) : null}

      <RejectReturnModal
        open={rejectOpen}
        requestNumber={item.requestNumber}
        loading={rejecting}
        error={rejectError}
        onClose={() => {
          if (!rejecting) setRejectOpen(false);
        }}
        onSubmit={handleReject}
      />
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
