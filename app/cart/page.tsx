import Link from "next/link";

export default function CartPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="font-heading text-2xl font-semibold text-rc-navy">
        Shopping cart
      </h1>
      <p className="mt-2 text-sm text-rc-muted">Your cart is empty.</p>
      <Link
        href="/shop"
        className="mt-6 inline-flex rounded-lg bg-rc-navy px-6 py-3 text-sm font-semibold text-white"
      >
        Start shopping
      </Link>
    </div>
  );
}
