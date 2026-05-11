"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ADDRESS_LABEL_OPTIONS,
  defaultAddresses,
  type AddressLabel,
  type SavedAddress,
} from "@/lib/data/addresses";

const STORAGE_KEY = "rugcasa-account-addresses";

const emptyForm = (): Omit<SavedAddress, "id" | "isDefault"> => ({
  label: "home",
  fullName: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
});

type FormState = Omit<SavedAddress, "id" | "isDefault">;

const inputClass =
  "mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm outline-none transition-colors focus:border-rc-accent focus:ring-1 focus:ring-rc-accent";

const labelClass =
  "text-xs font-medium uppercase tracking-wide text-rc-muted md:text-neutral-500";

function ensureOneDefault(list: SavedAddress[]): SavedAddress[] {
  if (list.length === 0) return list;
  if (!list.some((a) => a.isDefault)) {
    return list.map((a, i) => ({ ...a, isDefault: i === 0 }));
  }
  const firstDefault = list.findIndex((a) => a.isDefault);
  return list.map((a, i) => ({ ...a, isDefault: i === firstDefault }));
}

function parseStored(raw: string | null): SavedAddress[] | null {
  if (raw == null || raw === "") return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return null;
    if (parsed.length === 0) return [];
    const first = parsed[0] as Record<string, unknown>;
    if (
      typeof first.id === "string" &&
      typeof first.fullName === "string" &&
      typeof first.line1 === "string"
    ) {
      return parsed as SavedAddress[];
    }
  } catch {
    /* ignore */
  }
  return null;
}

export function AddressesManager() {
  const [addresses, setAddresses] = useState<SavedAddress[]>(defaultAddresses);
  const [hydrated, setHydrated] = useState(false);
  const [mode, setMode] = useState<"idle" | "add" | "edit">("idle");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm());

  useEffect(() => {
    const raw =
      typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    const stored = parseStored(raw);
    if (stored !== null) {
      setAddresses(stored.length === 0 ? [] : ensureOneDefault(stored));
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses));
  }, [addresses, hydrated]);

  const openAdd = useCallback(() => {
    setForm(emptyForm());
    setEditingId(null);
    setMode("add");
  }, []);

  const openEdit = useCallback((addr: SavedAddress) => {
    setForm({
      label: addr.label,
      fullName: addr.fullName,
      phone: addr.phone,
      line1: addr.line1,
      line2: addr.line2,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      country: addr.country,
    });
    setEditingId(addr.id);
    setMode("edit");
  }, []);

  const closeForm = useCallback(() => {
    setMode("idle");
    setEditingId(null);
    setForm(emptyForm());
  }, []);

  const saveForm = useCallback(() => {
    const trimmed: FormState = {
      ...form,
      fullName: form.fullName.trim(),
      phone: form.phone.trim(),
      line1: form.line1.trim(),
      line2: form.line2.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      pincode: form.pincode.trim(),
      country: form.country.trim() || "India",
    };
    if (
      !trimmed.fullName ||
      !trimmed.phone ||
      !trimmed.line1 ||
      !trimmed.city ||
      !trimmed.state ||
      !trimmed.pincode
    ) {
      return;
    }

    if (mode === "add") {
      const id = `addr-${Date.now()}`;
      const isFirst = addresses.length === 0;
      const newAddr: SavedAddress = {
        id,
        ...trimmed,
        isDefault: isFirst,
      };
      setAddresses((prev) => [...prev, newAddr]);
    } else if (mode === "edit" && editingId) {
      setAddresses((prev) =>
        prev.map((a) =>
          a.id === editingId ? { ...a, ...trimmed, id: a.id, isDefault: a.isDefault } : a,
        ),
      );
    }
    closeForm();
  }, [addresses.length, closeForm, editingId, form, mode]);

  const removeAddress = useCallback((id: string) => {
    setAddresses((prev) => {
      const next = prev.filter((a) => a.id !== id);
      return ensureOneDefault(next);
    });
  }, []);

  const setDefault = useCallback((id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id })),
    );
  }, []);

  const formValid = useMemo(() => {
    const t = {
      fullName: form.fullName.trim(),
      phone: form.phone.trim(),
      line1: form.line1.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      pincode: form.pincode.trim(),
    };
    return Object.values(t).every(Boolean);
  }, [form]);

  const showForm = mode !== "idle";

  return (
    <div className="space-y-6">
      {addresses.length > 0 || showForm ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          {addresses.length > 0 ? (
            <p className="text-sm text-rc-muted md:text-neutral-500">
              {addresses.length}{" "}
              {addresses.length === 1 ? "address" : "addresses"} saved on this device.
            </p>
          ) : (
            <p className="text-sm text-rc-muted md:text-neutral-500">
              Fill in the form below to save your first address.
            </p>
          )}
          {!showForm && addresses.length > 0 ? (
            <button
              type="button"
              onClick={openAdd}
              className="rounded-lg bg-rc-navy px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-rc-navy-dark"
            >
              Add address
            </button>
          ) : null}
        </div>
      ) : null}

      {showForm ? (
        <div className="rounded-lg border border-rc-border bg-white p-4 md:rounded-[10px] md:border-neutral-200 md:p-5 md:shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
          <h2 className="text-base font-semibold text-rc-navy md:text-neutral-900">
            {mode === "add" ? "New address" : "Edit address"}
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="addr-label" className={labelClass}>
                Label
              </label>
              <select
                id="addr-label"
                value={form.label}
                onChange={(e) =>
                  setForm((f) => ({ ...f, label: e.target.value as AddressLabel }))
                }
                className={inputClass}
              >
                {ADDRESS_LABEL_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="addr-name" className={labelClass}>
                Full name
              </label>
              <input
                id="addr-name"
                value={form.fullName}
                onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                className={inputClass}
                autoComplete="name"
              />
            </div>
            <div>
              <label htmlFor="addr-phone" className={labelClass}>
                Phone
              </label>
              <input
                id="addr-phone"
                type="tel"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                className={inputClass}
                autoComplete="tel"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="addr-line1" className={labelClass}>
                Address line 1
              </label>
              <input
                id="addr-line1"
                value={form.line1}
                onChange={(e) => setForm((f) => ({ ...f, line1: e.target.value }))}
                className={inputClass}
                autoComplete="address-line1"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="addr-line2" className={labelClass}>
                Address line 2{" "}
                <span className="font-normal normal-case text-neutral-400">(optional)</span>
              </label>
              <input
                id="addr-line2"
                value={form.line2}
                onChange={(e) => setForm((f) => ({ ...f, line2: e.target.value }))}
                className={inputClass}
                autoComplete="address-line2"
              />
            </div>
            <div>
              <label htmlFor="addr-city" className={labelClass}>
                City
              </label>
              <input
                id="addr-city"
                value={form.city}
                onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                className={inputClass}
                autoComplete="address-level2"
              />
            </div>
            <div>
              <label htmlFor="addr-state" className={labelClass}>
                State
              </label>
              <input
                id="addr-state"
                value={form.state}
                onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))}
                className={inputClass}
                autoComplete="address-level1"
              />
            </div>
            <div>
              <label htmlFor="addr-pin" className={labelClass}>
                PIN code
              </label>
              <input
                id="addr-pin"
                value={form.pincode}
                onChange={(e) => setForm((f) => ({ ...f, pincode: e.target.value }))}
                className={inputClass}
                autoComplete="postal-code"
              />
            </div>
            <div>
              <label htmlFor="addr-country" className={labelClass}>
                Country
              </label>
              <input
                id="addr-country"
                value={form.country}
                onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
                className={inputClass}
                autoComplete="country-name"
              />
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={saveForm}
              disabled={!formValid}
              className="rounded-lg bg-rc-navy px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-rc-navy-dark disabled:cursor-not-allowed disabled:opacity-50"
            >
              Save address
            </button>
            <button
              type="button"
              onClick={closeForm}
              className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}

      {addresses.length === 0 && !showForm ? (
        <div className="rounded-lg border border-dashed border-rc-border bg-rc-surface/50 px-6 py-12 text-center md:rounded-[10px]">
          <p className="font-heading text-base font-semibold text-rc-navy md:text-neutral-900">
            No delivery addresses
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-rc-muted md:text-neutral-500">
            Add a home or work address for faster checkout. You can save several and pick
            a default.
          </p>
          <button
            type="button"
            onClick={openAdd}
            className="mt-6 inline-flex rounded-lg bg-rc-navy px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-rc-navy-dark"
          >
            Add your first address
          </button>
        </div>
      ) : null}

      <ul className="space-y-3">
        {addresses.map((addr) => {
          const labelText =
            ADDRESS_LABEL_OPTIONS.find((o) => o.value === addr.label)?.label ??
            addr.label;
          return (
            <li
              key={addr.id}
              className="rounded-lg border border-rc-border bg-white p-4 md:rounded-[10px] md:border-neutral-200 md:p-5 md:shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-rc-navy md:text-neutral-900">
                      {labelText}
                    </span>
                    {addr.isDefault ? (
                      <span className="rounded-full bg-[#DBEAFE] px-2 py-0.5 text-[11px] font-semibold text-[#1E40AF]">
                        Default
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2 text-sm font-medium text-neutral-900">{addr.fullName}</p>
                  <p className="text-sm text-neutral-600">{addr.phone}</p>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-700">
                    {addr.line1}
                    {addr.line2 ? (
                      <>
                        <br />
                        {addr.line2}
                      </>
                    ) : null}
                    <br />
                    {addr.city}, {addr.state} {addr.pincode}
                    <br />
                    {addr.country}
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  {!addr.isDefault ? (
                    <button
                      type="button"
                      onClick={() => setDefault(addr.id)}
                      className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-semibold text-rc-navy transition-colors hover:bg-neutral-50 md:text-sm"
                    >
                      Set default
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => openEdit(addr)}
                    disabled={showForm}
                    className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-semibold text-rc-accent transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const msg =
                        addresses.length === 1
                          ? "Remove your only saved address?"
                          : "Remove this address?";
                      if (window.confirm(msg)) removeAddress(addr.id);
                    }}
                    disabled={showForm}
                    className="rounded-lg border border-red-100 px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40 md:text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <p className="text-xs text-neutral-500">
        Addresses are stored in your browser for this demo. Connect to your account API
        to sync across devices.
      </p>
    </div>
  );
}
