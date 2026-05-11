import Link from "next/link";

export default function CategoriesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="font-heading text-2xl font-semibold text-rc-navy">
        Categories
      </h1>
      <p className="mt-2 text-sm text-rc-muted">
        Browse all rug categories — this page is a placeholder for your catalog.
      </p>
      <Link
        href="/shop"
        className="mt-6 inline-flex rounded-lg bg-rc-navy px-6 py-3 text-sm font-semibold text-white"
      >
        Shop all rugs
      </Link>
    </div>
  );
}
