"use client";

import { useEffect, useState, type ReactNode } from "react";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { fetchCustomerClient, type ApiCustomerDetail } from "@/lib/api/customers";
import { formatCurrency, formatDate, mapStatusToUi } from "@/lib/api/mappers";

type CustomerProfileModalProps = {
  open: boolean;
  customerId: string | null;
  onClose: () => void;
};

export function CustomerProfileModal({ open, customerId, onClose }: CustomerProfileModalProps) {
  const [customer, setCustomer] = useState<ApiCustomerDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open || !customerId) return;
    setLoading(true);
    setError("");
    fetchCustomerClient(customerId)
      .then(setCustomer)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load customer"))
      .finally(() => setLoading(false));
  }, [open, customerId]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, loading, onClose]);

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
        aria-labelledby="customer-profile-title"
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-neutral-200 bg-white shadow-xl"
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-neutral-200 bg-white px-6 py-4">
          <div>
            <h2 id="customer-profile-title" className="text-lg font-semibold text-neutral-900">
              Customer profile
            </h2>
            {customer ? (
              <p className="mt-1 text-sm text-neutral-500">{customer.email}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-sm font-medium text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800"
          >
            Close
          </button>
        </div>

        <div className="space-y-6 px-6 py-5">
          {loading ? (
            <p className="text-sm text-neutral-500">Loading customer…</p>
          ) : error ? (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          ) : customer ? (
            <>
              <section className="grid gap-4 sm:grid-cols-2">
                <InfoItem label="Name" value={`${customer.firstName} ${customer.lastName}`} />
                <InfoItem label="Email" value={customer.email} />
                <InfoItem label="Phone" value={customer.phone ?? "—"} />
                <InfoItem
                  label="Status"
                  value={<StatusBadge status={mapStatusToUi(customer.status)} />}
                />
                <InfoItem label="Total spent" value={formatCurrency(customer.totalSpend)} />
                <InfoItem label="Joined" value={formatDate(customer.createdAt)} />
                <InfoItem
                  label="Last login"
                  value={customer.lastLoginAt ? formatDate(customer.lastLoginAt) : "—"}
                />
                <InfoItem label="Orders" value={String(customer._count?.orders ?? customer.orders?.length ?? 0)} />
              </section>

              {customer.addresses && customer.addresses.length > 0 ? (
                <section>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
                    Addresses
                  </h3>
                  <ul className="mt-3 space-y-2">
                    {customer.addresses.map((addr) => (
                      <li
                        key={addr.id}
                        className="rounded-lg border border-neutral-200 bg-neutral-50/60 px-3 py-2 text-sm text-neutral-700"
                      >
                        {addr.label ? <p className="font-medium text-neutral-900">{addr.label}</p> : null}
                        <p>
                          {addr.line1}
                          {addr.line2 ? `, ${addr.line2}` : ""}
                        </p>
                        <p>
                          {addr.city}, {addr.state} {addr.postalCode}, {addr.country}
                        </p>
                        {addr.isDefault ? (
                          <span className="mt-1 inline-block text-xs font-semibold text-rc-accent">
                            Default
                          </span>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {customer.orders && customer.orders.length > 0 ? (
                <section>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
                    Recent orders
                  </h3>
                  <ul className="mt-3 divide-y divide-neutral-100 rounded-lg border border-neutral-200">
                    {customer.orders.map((order) => (
                      <li
                        key={order.id}
                        className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 text-sm"
                      >
                        <div>
                          <p className="font-medium text-neutral-900">{order.orderNumber}</p>
                          <p className="text-neutral-500">{formatDate(order.createdAt)}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <StatusBadge status={mapStatusToUi(order.status)} />
                          <span className="font-medium">{formatCurrency(order.total)}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">{label}</p>
      <div className="mt-1 text-sm text-neutral-900">{value}</div>
    </div>
  );
}
