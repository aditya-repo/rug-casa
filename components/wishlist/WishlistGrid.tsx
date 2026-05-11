import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";
import type { ProductItem } from "@/lib/data/products";

type WishlistGridProps = {
  products: ProductItem[];
  /** Narrower grid for account sidebar + center layout on desktop */
  variant?: "page" | "account";
};

export function WishlistGrid({ products, variant = "page" }: WishlistGridProps) {
  const gridClass =
    variant === "account"
      ? "grid grid-cols-2 items-stretch gap-2.5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-3"
      : "grid grid-cols-2 items-stretch gap-2.5 sm:grid-cols-3 md:grid-cols-4 md:gap-3 lg:grid-cols-4";
  if (products.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-rc-border bg-rc-surface/50 px-6 py-14 text-center">
        <p className="font-heading text-lg font-semibold text-rc-navy">
          Your wishlist is empty
        </p>
        <p className="mx-auto mt-2 max-w-md text-sm text-rc-muted">
          Tap the heart on any rug to save it here. Build a shortlist before you buy.
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
    <ul className={gridClass}>
      {products.map((product) => (
        <li key={product.id} className="min-w-0">
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}
