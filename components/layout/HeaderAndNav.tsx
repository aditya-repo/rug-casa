import Link from "next/link";
import { auth } from "@/auth";
import { CartNavLink } from "@/components/cart/CartNavLink";
import {
  IconHeart,
  IconSearch,
  IconTruck,
  IconUser,
} from "@/components/layout/icons";

function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`font-heading text-center ${className}`}>
      <span className="block text-xl font-semibold tracking-tight text-rc-navy sm:text-2xl">
        Rugs Bhadohi
      </span>
    </Link>
  );
}

export async function HeaderAndNav() {
  const session = await auth();
  const accountHref = session?.user ? "/account" : "/signin";
  const accountLabel = session?.user ? "My Account" : "Sign in";

  return (
    <header className="sticky top-0 z-30 border-b border-rc-border bg-white">
      <div className="flex items-center justify-center gap-2 bg-rc-navy px-4 py-1.5 text-center text-xs text-white sm:text-sm">
        <IconTruck className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" aria-hidden />
        <span>We also offer international shipping worldwide</span>
      </div>

      {/* Mobile */}
      <div className="md:hidden">
        <div className="flex items-center justify-between px-4 py-2.5">
          <Logo className="text-left" />
          <div className="flex items-center gap-2 text-rc-navy">
            <Link
              href="/search"
              className="rounded-md p-1.5 hover:bg-rc-surface"
              aria-label="Search"
            >
              <IconSearch className="h-5 w-5" />
            </Link>
            <Link
              href={accountHref}
              className="rounded-md p-1.5 hover:bg-rc-surface"
              aria-label={accountLabel}
            >
              <IconUser className="h-5 w-5" />
            </Link>
            <Link
              href="/wishlist"
              className="rounded-md p-1.5 hover:bg-rc-surface"
              aria-label="Wishlist"
            >
              <IconHeart className="h-5 w-5" />
            </Link>
            <CartNavLink />
          </div>
        </div>
      </div>

      {/* Desktop */}
      <div className="mx-auto hidden max-w-7xl items-center gap-6 px-4 py-2.5 md:flex">
        <Logo className="shrink-0 text-left" />
        <form
          className="mx-auto flex max-w-2xl flex-1 justify-center"
          action="/search"
          role="search"
        >
          <label htmlFor="desktop-search" className="sr-only">
            Search for rugs
          </label>
          <div className="flex w-full overflow-hidden rounded-md border border-rc-border bg-white">
            <input
              id="desktop-search"
              name="q"
              type="search"
              placeholder="Search for rugs, carpets..."
              className="min-w-0 flex-1 px-3 py-2.5 text-sm text-rc-navy placeholder:text-rc-muted-light outline-none"
            />
            <button
              type="submit"
              className="shrink-0 bg-rc-navy px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-rc-navy-dark"
            >
              Search
            </button>
          </div>
        </form>
        <div className="flex shrink-0 items-center gap-5 text-rc-navy">
          <Link
            href={accountHref}
            className="flex items-center gap-2.5 transition-opacity hover:opacity-85"
          >
            <IconUser className="h-5 w-5 shrink-0 text-rc-navy" />
            <span className="text-sm font-bold tracking-tight text-rc-navy">
              {accountLabel}
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/wishlist"
              className="rounded-full p-1.5 text-rc-navy hover:bg-rc-surface"
              aria-label="Wishlist"
            >
              <IconHeart className="h-5 w-5" />
            </Link>
            <CartNavLink className="relative rounded-full p-1.5 text-rc-navy hover:bg-rc-surface" />
          </div>
        </div>
      </div>
    </header>
  );
}
