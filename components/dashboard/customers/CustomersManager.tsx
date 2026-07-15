"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { CustomerProfileModal } from "@/components/dashboard/customers/CustomerProfileModal";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { SwitchToggle } from "@/components/dashboard/SwitchToggle";
import {
  DashboardTable,
  DashboardTableHead,
  SecondaryButton,
} from "@/components/dashboard/DashboardTable";
import {
  fetchCustomersClient,
  updateCustomerStatusClient,
  type CustomerRow,
} from "@/lib/api/customers";

type CustomersManagerProps = {
  initialCustomers: CustomerRow[];
};

type ProfileState =
  | { type: "closed" }
  | { type: "open"; customerId: string };

export function CustomersManager({ initialCustomers }: CustomersManagerProps) {
  const router = useRouter();
  const [customers, setCustomers] = useState(initialCustomers);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [statusError, setStatusError] = useState("");
  const [profile, setProfile] = useState<ProfileState>({ type: "closed" });

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  const loadCustomers = useCallback(async (query: string) => {
    setLoading(true);
    try {
      const { items } = await fetchCustomersClient({ search: query || undefined });
      setCustomers(items);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCustomers(debouncedSearch);
  }, [debouncedSearch, loadCustomers]);

  async function handleStatusToggle(customer: CustomerRow, active: boolean) {
    setStatusError("");
    setTogglingId(customer.id);
    const nextStatus = active ? "ACTIVE" : "INACTIVE";

    try {
      await updateCustomerStatusClient(customer.id, nextStatus);
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === customer.id
            ? {
                ...c,
                apiStatus: nextStatus,
                status: nextStatus.toLowerCase(),
              }
            : c,
        ),
      );
      router.refresh();
    } catch (err) {
      setStatusError(err instanceof Error ? err.message : "Failed to update customer status");
    } finally {
      setTogglingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Customer management"
        description="View customers, search by name or email, and activate or deactivate accounts."
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email…"
          className="w-full max-w-sm rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm outline-none focus:border-rc-accent focus:ring-1 focus:ring-rc-accent"
          aria-label="Search customers"
        />
        {loading ? <span className="text-sm text-neutral-500">Searching…</span> : null}
      </div>

      {statusError ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{statusError}</p>
      ) : null}

      <DashboardTable>
        <table className="w-full min-w-[800px] border-collapse text-left text-sm">
          <DashboardTableHead
            columns={["Customer", "Email", "Orders", "Total spent", "Joined", "Status", "Active", "Actions"]}
          />
          <tbody className="divide-y divide-neutral-100">
            {customers.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-neutral-500">
                  {debouncedSearch ? "No customers match your search." : "No customers found."}
                </td>
              </tr>
            ) : (
              customers.map((customer) => {
                const isActive = customer.apiStatus === "ACTIVE";
                const toggleDisabled = togglingId === customer.id || customer.apiStatus === "BLOCKED";

                return (
                  <tr key={customer.id} className="text-neutral-800">
                    <td className="px-4 py-3 font-semibold text-neutral-900">{customer.name}</td>
                    <td className="px-4 py-3 text-neutral-600">{customer.email}</td>
                    <td className="px-4 py-3">{customer.orders}</td>
                    <td className="whitespace-nowrap px-4 py-3 font-medium">{customer.spent}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-neutral-500">{customer.joined}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={customer.status} />
                    </td>
                    <td className="px-4 py-3">
                      <SwitchToggle
                        checked={isActive}
                        disabled={toggleDisabled}
                        label={isActive ? "Active" : customer.apiStatus === "BLOCKED" ? "Blocked" : "Inactive"}
                        id={`customer-active-${customer.id}`}
                        onChange={(checked) => handleStatusToggle(customer, checked)}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <SecondaryButton
                        onClick={() => setProfile({ type: "open", customerId: customer.id })}
                      >
                        View profile
                      </SecondaryButton>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </DashboardTable>

      <CustomerProfileModal
        open={profile.type === "open"}
        customerId={profile.type === "open" ? profile.customerId : null}
        onClose={() => setProfile({ type: "closed" })}
      />
    </div>
  );
}
