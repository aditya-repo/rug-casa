import Link from "next/link";

export default function AccountPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="font-heading text-2xl font-semibold text-rc-navy">
        My Account
      </h1>
      <p className="mt-2 text-sm text-rc-muted">
        Log in or create an account to track orders and manage your profile.
      </p>
      <Link
        href="/shop"
        className="mt-6 inline-flex rounded-lg border border-rc-navy px-6 py-3 text-sm font-semibold text-rc-navy"
      >
        Back to shop
      </Link>
    </div>
  );
}
