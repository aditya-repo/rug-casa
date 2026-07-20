"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { getMyAddresses } from "@/lib/auth/address-actions";
import { startCheckoutSession } from "@/lib/checkout/actions";
import { isIndiaShippingAddress } from "@/lib/checkout/addresses";
import type { SavedAddress } from "@/lib/data/addresses";
import { lineTotal, lineUnitTotal } from "@/lib/cart/types";

declare global {
  interface Window {
    Cashfree?: (options: { mode: "sandbox" | "production" }) => {
      checkout: (options: {
        paymentSessionId: string;
        redirectTarget?: "_self" | "_blank" | "_top" | "_modal";
      }) => Promise<unknown>;
    };
  }
}

function formatRupee(amount: number): string {
  return amount.toLocaleString("en-IN");
}

function loadCashfreeSdk(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.Cashfree) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-cashfree-sdk="v3"]',
    );
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () =>
        reject(new Error("Failed to load Cashfree SDK")),
      );
      return;
    }

    const script = document.createElement("script");
    script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
    script.async = true;
    script.dataset.cashfreeSdk = "v3";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Cashfree SDK"));
    document.body.appendChild(script);
  });
}

type CheckoutClientProps = {
  email: string;
  customerName: string;
};

export function CheckoutClient({ email, customerName }: CheckoutClientProps) {
  const router = useRouter();
  const { lines, ready, itemCount, subtotal } = useCart();
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await getMyAddresses();
        if (cancelled) return;
        setAddresses(list);
        const preferred = list.find((a) => a.isDefault) ?? list[0] ?? null;
        setSelectedId(preferred?.id ?? null);
      } catch {
        if (!cancelled) setError("Could not load saved addresses.");
      } finally {
        if (!cancelled) setHydrated(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const selected = useMemo(
    () => addresses.find((a) => a.id === selectedId) ?? null,
    [addresses, selectedId],
  );

  const india = selected ? isIndiaShippingAddress(selected) : true;
  const gatewayLabel = india ? "Cashfree" : "Stripe";

  const placeOrder = useCallback(async () => {
    setError("");
    if (!selected) {
      setError("Select a shipping address to continue.");
      return;
    }
    if (lines.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setSubmitting(true);
    try {
      const result = await startCheckoutSession({
        address: {
          label: selected.label,
          fullName: selected.fullName,
          phone: selected.phone,
          line1: selected.line1,
          line2: selected.line2 || null,
          landmark: selected.landmark || null,
          city: selected.city,
          state: selected.state,
          postalCode: selected.pincode,
          country: selected.country,
          countryCode: selected.countryCode ?? null,
        },
        items: lines.map((line) => ({
          productId: line.productId,
          variantId: line.sizeId,
          quantity: line.quantity,
          unitPrice: line.unitPrice,
          servicesPerUnit: line.servicesPerUnit,
          serviceLabels: line.serviceLabels,
          title: [
            line.name,
            line.sizeLabel,
            line.colorLabel,
            ...line.serviceLabels,
          ]
            .filter(Boolean)
            .join(" · "),
        })),
      });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      if (result.data.gateway === "stripe") {
        setError(result.data.message);
        return;
      }

      if (!result.data.paymentSessionId || !result.data.mode) {
        setError("Payment session could not be created. Please try again.");
        return;
      }

      await loadCashfreeSdk();
      if (!window.Cashfree) {
        setError("Cashfree checkout could not be loaded. Please refresh and try again.");
        return;
      }

      const cashfree = window.Cashfree({ mode: result.data.mode });
      sessionStorage.setItem(
        "rc-pending-order",
        JSON.stringify({
          orderNumber: result.data.orderNumber,
          orderId: result.data.orderId,
        }),
      );
      await cashfree.checkout({
        paymentSessionId: result.data.paymentSessionId,
        redirectTarget: "_self",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setSubmitting(false);
    }
  }, [lines, selected]);

  if (!ready || !hydrated) {
    return (
      <div className="rounded-lg border border-rc-border bg-white px-6 py-14 text-center text-sm text-rc-muted">
        Loading checkout…
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-rc-border bg-rc-surface/50 px-6 py-14 text-center">
        <p className="font-heading text-lg font-semibold text-rc-navy">
          Your cart is empty
        </p>
        <p className="mx-auto mt-2 max-w-md text-sm text-rc-muted">
          Add rugs from the shop before checking out.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-flex rounded-lg bg-rc-navy px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-rc-navy-dark"
        >
          Browse rugs
        </Link>
      </div>
    );
  }

  return (
    <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-10">
      <div className="space-y-6 lg:col-span-7 xl:col-span-8">
        <section className="rounded-lg border border-rc-border bg-white p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-heading text-lg font-semibold text-rc-navy">
                Shipping address
              </h2>
              <p className="mt-1 text-sm text-rc-muted">
                Signed in as {customerName || email}. India addresses pay with
                Cashfree; other countries will use Stripe.
              </p>
            </div>
            <Link
              href="/account/addresses"
              className="text-sm font-medium text-rc-navy underline-offset-2 hover:underline"
            >
              Manage addresses
            </Link>
          </div>

          {addresses.length === 0 ? (
            <div className="mt-4 rounded-lg border border-dashed border-rc-border px-4 py-8 text-center">
              <p className="text-sm text-rc-muted">
                No saved addresses yet. Add one to continue.
              </p>
              <Link
                href="/account/addresses"
                className="mt-4 inline-flex rounded-lg bg-rc-navy px-4 py-2 text-sm font-semibold text-white"
              >
                Add address
              </Link>
            </div>
          ) : (
            <ul className="mt-4 space-y-3">
              {addresses.map((addr) => {
                const checked = addr.id === selectedId;
                const gate = isIndiaShippingAddress(addr) ? "Cashfree" : "Stripe";
                return (
                  <li key={addr.id}>
                    <label
                      className={`flex cursor-pointer gap-3 rounded-lg border p-3 transition-colors sm:p-4 ${
                        checked
                          ? "border-rc-navy bg-rc-surface/60"
                          : "border-rc-border hover:border-rc-navy/40"
                      }`}
                    >
                      <input
                        type="radio"
                        name="checkout-address"
                        className="mt-1"
                        checked={checked}
                        onChange={() => setSelectedId(addr.id)}
                      />
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-2">
                          <span className="font-medium text-rc-navy">
                            {addr.fullName}
                          </span>
                          <span className="rounded bg-rc-surface px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-rc-muted">
                            {addr.label}
                          </span>
                          <span className="text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
                            {gate}
                          </span>
                        </span>
                        <span className="mt-1 block text-sm text-rc-muted">
                          {addr.line1}
                          {addr.line2 ? `, ${addr.line2}` : ""}
                          <br />
                          {addr.city}, {addr.state} {addr.pincode}
                          <br />
                          {addr.country} · {addr.phone}
                        </span>
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="rounded-lg border border-rc-border bg-white">
          <h2 className="border-b border-rc-border px-4 py-3 font-heading text-lg font-semibold text-rc-navy sm:px-5">
            Order items
          </h2>
          <ul className="divide-y divide-rc-border">
            {lines.map((line) => (
              <li key={line.key} className="flex gap-3 p-3 sm:gap-4 sm:p-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border border-rc-border bg-rc-surface sm:h-20 sm:w-20">
                  {line.imageSrc ? (
                    <Image
                      src={line.imageSrc}
                      alt={line.imageAlt || line.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-rc-navy">{line.name}</p>
                  <p className="mt-0.5 text-xs text-rc-muted">
                    {[line.sizeLabel, line.colorLabel].filter(Boolean).join(" · ")}
                    {line.quantity > 1 ? ` · Qty ${line.quantity}` : ""}
                  </p>
                  <p className="mt-1 text-sm font-medium text-rc-navy">
                    ₹{formatRupee(lineTotal(line))}
                    <span className="ml-2 text-xs font-normal text-rc-muted">
                      (₹{formatRupee(lineUnitTotal(line))} each)
                    </span>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <aside className="mt-6 lg:col-span-5 lg:mt-0 xl:col-span-4">
        <div className="rounded-lg border border-rc-border bg-white p-4 sm:p-5 lg:sticky lg:top-28">
          <h2 className="font-heading text-lg font-semibold text-rc-navy">
            Payment summary
          </h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-rc-muted">
                Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
              </dt>
              <dd className="font-medium text-rc-navy">
                ₹{formatRupee(subtotal)}
              </dd>
            </div>
            <div className="flex justify-between gap-4 text-rc-muted">
              <dt>Shipping</dt>
              <dd className="font-medium text-emerald-700">Free</dd>
            </div>
            <div className="flex justify-between gap-4 text-rc-muted">
              <dt>Gateway</dt>
              <dd className="font-medium text-rc-navy">{gatewayLabel}</dd>
            </div>
            <div className="border-t border-rc-border pt-3">
              <div className="flex justify-between gap-4 text-base font-semibold text-rc-navy">
                <dt>Total</dt>
                <dd>₹{formatRupee(subtotal)}</dd>
              </div>
            </div>
          </dl>

          {error ? (
            <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          ) : null}

          <button
            type="button"
            disabled={submitting || !selected}
            onClick={() => void placeOrder()}
            className="mt-6 flex w-full items-center justify-center rounded-lg bg-rc-navy px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-rc-navy-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting
              ? "Starting payment…"
              : india
                ? "Pay with Cashfree"
                : "Continue (Stripe coming soon)"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/cart")}
            className="mt-3 flex w-full items-center justify-center rounded-lg border border-rc-navy px-4 py-3 text-sm font-semibold text-rc-navy"
          >
            Back to cart
          </button>

          <p className="mt-4 text-center text-xs text-rc-muted">
            You will be redirected securely to complete payment. Order status
            updates via Cashfree webhook after success.
          </p>
        </div>
      </aside>
    </div>
  );
}
