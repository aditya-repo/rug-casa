import Link from "next/link";

export default function WishlistPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="font-heading text-2xl font-semibold text-rc-navy">
        Wishlist
      </h1>
      <p className="mt-2 text-sm text-rc-muted">
        Save your favorite rugs here. Sign in to sync across devices.
      </p>
      <Link
        href="/shop"
        className="mt-6 inline-flex rounded-lg bg-rc-navy px-6 py-3 text-sm font-semibold text-white"
      >
        Continue shopping
      </Link>
    </div>
  );
}
