"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";
import type { CartLine } from "@/lib/data/cart";

const MAX_QTY = 10;

function parsePriceRupee(value: string): number {
  return Number(value.replace(/,/g, "")) || 0;
}

function formatRupee(amount: number): string {
  return amount.toLocaleString("en-IN");
}

function cartSubtotal(lines: CartLine[]): number {
  return lines.reduce(
    (sum, { product, quantity }) =>
      sum + parsePriceRupee(product.price) * quantity,
    0,
  );
}

function cloneLines(lines: CartLine[]): CartLine[] {
  return lines.map((l) => ({ ...l, product: { ...l.product } }));
}

type CartClientProps = {
  initialLines: CartLine[];
};

export function CartClient({ initialLines }: CartClientProps) {
  const [lines, setLines] = useState<CartLine[]>(() => cloneLines(initialLines));

  const adjustQuantity = useCallback((productId: string, delta: number) => {
    setLines((prev) =>
      prev
        .map((line) => {
          if (line.product.id !== productId) return line;
          const nextQty = line.quantity + delta;
          if (nextQty <= 0) return null;
          if (nextQty > MAX_QTY) return line;
          return { ...line, quantity: nextQty };
        })
        .filter((line): line is CartLine => line != null),
    );
  }, []);

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

  const subtotal = cartSubtotal(lines);
  const itemCount = lines.reduce((n, l) => n + l.quantity, 0);

  return (
    <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-10">
      <div className="lg:col-span-7 xl:col-span-8">
        <h2 className="sr-only">Cart items</h2>
        <ul className="divide-y divide-rc-border rounded-lg border border-rc-border bg-white">
          {lines.map(({ product, quantity }) => {
            const unit = parsePriceRupee(product.price);
            const lineTotal = unit * quantity;
            const href = `/product/${product.id}`;
            const atMax = quantity >= MAX_QTY;

            return (
              <li key={product.id}>
                <div className="flex flex-col gap-3 p-3 sm:flex-row sm:gap-4 sm:p-4">
                  <div className="flex gap-3 sm:contents">
                    <Link
                      href={href}
                      className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border border-rc-border bg-rc-surface sm:h-24 sm:w-24"
                    >
                      <Image
                        src={product.imageSrc}
                        alt={product.imageAlt}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </Link>
                    <div className="min-w-0 flex-1 sm:py-0.5">
                      <Link
                        href={href}
                        className="font-heading text-sm font-semibold text-rc-navy hover:underline sm:text-base"
                      >
                        {product.name}
                      </Link>
                      <p className="mt-0.5 text-xs text-rc-muted sm:text-sm">
                        {product.dimensions}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className="text-xs text-rc-muted">Quantity</span>
                        <div className="inline-flex items-stretch rounded-md border border-rc-border bg-white shadow-sm">
                          <button
                            type="button"
                            className="flex min-w-[2.25rem] items-center justify-center px-2 py-1.5 text-rc-navy transition-colors hover:bg-rc-surface active:bg-rc-border disabled:pointer-events-none disabled:opacity-40"
                            aria-label={`Decrease quantity of ${product.name}`}
                            onClick={() => adjustQuantity(product.id, -1)}
                          >
                            <span className="text-lg leading-none">−</span>
                          </button>
                          <span className="flex min-w-[2.5rem] items-center justify-center border-x border-rc-border px-2 py-1.5 text-sm font-semibold text-rc-navy tabular-nums">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            className="flex min-w-[2.25rem] items-center justify-center px-2 py-1.5 text-rc-navy transition-colors hover:bg-rc-surface active:bg-rc-border disabled:pointer-events-none disabled:opacity-40"
                            aria-label={`Increase quantity of ${product.name}`}
                            disabled={atMax}
                            onClick={() => adjustQuantity(product.id, 1)}
                          >
                            <span className="text-lg leading-none">+</span>
                          </button>
                        </div>
                        {atMax ? (
                          <span className="text-[11px] text-rc-muted">
                            Max {MAX_QTY} per line
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-start justify-between gap-4 border-t border-rc-border pt-2 sm:flex-col sm:border-t-0 sm:pt-0 sm:text-right">
                    <p className="text-sm font-semibold text-rc-navy sm:text-base">
                      ₹{formatRupee(lineTotal)}
                    </p>
                    {quantity > 1 ? (
                      <p className="text-[11px] text-rc-muted sm:order-first">
                        ₹{formatRupee(unit)} each
                      </p>
                    ) : (
                      <span className="sm:order-first sm:invisible sm:h-[14px]" aria-hidden />
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
              <dd className="font-medium text-rc-navy">₹{formatRupee(subtotal)}</dd>
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
              href="/account"
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
