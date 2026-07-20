"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import {
  CART_MAX_QTY,
  lineTotal,
  lineUnitTotal,
} from "@/lib/cart/types";

function formatRupee(amount: number): string {
  return amount.toLocaleString("en-IN");
}

export function CartClient() {
  const { lines, ready, itemCount, subtotal, adjustQuantity, removeItem } =
    useCart();

  if (!ready) {
    return (
      <div className="rounded-lg border border-rc-border bg-white px-6 py-14 text-center text-sm text-rc-muted">
        Loading cart…
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
          Add rugs from the shop — free shipping across India on qualifying
          orders.
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
      <div className="lg:col-span-7 xl:col-span-8">
        <h2 className="sr-only">Cart items</h2>
        <ul className="divide-y divide-rc-border rounded-lg border border-rc-border bg-white">
          {lines.map((line) => {
            const unit = lineUnitTotal(line);
            const total = lineTotal(line);
            const href = `/product/${line.productId}`;
            const atMax = line.quantity >= CART_MAX_QTY;
            const meta = [line.sizeLabel, line.colorLabel]
              .filter(Boolean)
              .join(" · ");

            return (
              <li key={line.key}>
                <div className="flex flex-col gap-3 p-3 sm:flex-row sm:gap-4 sm:p-4">
                  <div className="flex gap-3 sm:contents">
                    <Link
                      href={href}
                      className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border border-rc-border bg-rc-surface sm:h-24 sm:w-24"
                    >
                      {line.imageSrc ? (
                        <Image
                          src={line.imageSrc}
                          alt={line.imageAlt || line.name}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      ) : (
                        <span className="flex h-full items-center justify-center text-[10px] text-rc-muted">
                          No image
                        </span>
                      )}
                    </Link>
                    <div className="min-w-0 flex-1 sm:py-0.5">
                      <Link
                        href={href}
                        className="font-heading text-sm font-semibold text-rc-navy hover:underline sm:text-base"
                      >
                        {line.name}
                      </Link>
                      {meta ? (
                        <p className="mt-0.5 text-xs text-rc-muted sm:text-sm">
                          {meta}
                        </p>
                      ) : null}
                      {line.serviceLabels.length > 0 ? (
                        <p className="mt-1 text-[11px] text-rc-muted">
                          Services: {line.serviceLabels.join(", ")}
                        </p>
                      ) : null}
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className="text-xs text-rc-muted">Quantity</span>
                        <div className="inline-flex items-stretch rounded-md border border-rc-border bg-white shadow-sm">
                          <button
                            type="button"
                            className="flex min-w-[2.25rem] items-center justify-center px-2 py-1.5 text-rc-navy transition-colors hover:bg-rc-surface active:bg-rc-border disabled:pointer-events-none disabled:opacity-40"
                            aria-label={`Decrease quantity of ${line.name}`}
                            onClick={() => adjustQuantity(line.key, -1)}
                          >
                            <span className="text-lg leading-none">−</span>
                          </button>
                          <span className="flex min-w-[2.5rem] items-center justify-center border-x border-rc-border px-2 py-1.5 text-sm font-semibold text-rc-navy tabular-nums">
                            {line.quantity}
                          </span>
                          <button
                            type="button"
                            className="flex min-w-[2.25rem] items-center justify-center px-2 py-1.5 text-rc-navy transition-colors hover:bg-rc-surface active:bg-rc-border disabled:pointer-events-none disabled:opacity-40"
                            aria-label={`Increase quantity of ${line.name}`}
                            disabled={atMax}
                            onClick={() => adjustQuantity(line.key, 1)}
                          >
                            <span className="text-lg leading-none">+</span>
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(line.key)}
                          className="text-xs font-medium text-red-600 hover:underline"
                        >
                          Remove
                        </button>
                        {atMax ? (
                          <span className="text-[11px] text-rc-muted">
                            Max {CART_MAX_QTY} per line
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-start justify-between gap-4 border-t border-rc-border pt-2 sm:flex-col sm:border-t-0 sm:pt-0 sm:text-right">
                    <p className="text-sm font-semibold text-rc-navy sm:text-base">
                      ₹{formatRupee(total)}
                    </p>
                    {line.quantity > 1 ? (
                      <p className="text-[11px] text-rc-muted sm:order-first">
                        ₹{formatRupee(unit)} each
                      </p>
                    ) : (
                      <span
                        className="sm:order-first sm:invisible sm:h-[14px]"
                        aria-hidden
                      />
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <aside className="mt-8 lg:col-span-5 lg:mt-0 xl:col-span-4">
        <div className="rounded-lg border border-rc-border bg-rc-surface/60 p-5 sm:p-6">
          <h2 className="font-heading text-lg font-semibold text-rc-navy">
            Order summary
          </h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4 text-rc-muted">
              <dt>
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
            <div className="border-t border-rc-border pt-3">
              <div className="flex justify-between gap-4 text-base font-semibold text-rc-navy">
                <dt>Estimated total</dt>
                <dd>₹{formatRupee(subtotal)}</dd>
              </div>
            </div>
          </dl>
          <div className="mt-6 flex flex-col gap-3">
            <Link
              href="/checkout"
              className="flex w-full items-center justify-center rounded-lg bg-rc-navy px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-rc-navy-dark"
            >
              Proceed to checkout
            </Link>
            <Link
              href="/shop"
              className="flex w-full items-center justify-center rounded-lg border border-rc-navy px-4 py-3 text-center text-sm font-semibold text-rc-navy transition-colors hover:bg-white"
            >
              Continue shopping
            </Link>
          </div>
          <p className="mt-4 text-center text-xs text-rc-muted">
            Taxes calculated at checkout. Easy 7-day returns on eligible rugs.
          </p>
        </div>
      </aside>
    </div>
  );
}
