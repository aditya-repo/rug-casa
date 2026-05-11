import Link from "next/link";
import { IconCart, IconHeart, IconSearch, IconUser } from "@/components/layout/icons";

function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`font-heading text-center ${className}`}
    >
      <span className="block text-xl font-semibold tracking-tight text-rc-navy sm:text-2xl">
        RugCasa
      </span>
      <span className="mt-0.5 block text-[10px] font-normal tracking-[0.22em] text-rc-muted">
        LIVE BEAUTIFULLY
      </span>
    </Link>
  );
}

export function HeaderAndNav() {
  return (
    <header className="sticky top-0 z-30 border-b border-rc-border bg-white">
      {/* Mobile */}
      <div className="md:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <Logo className="text-left" />
          <div className="flex items-center gap-0.5 text-rc-navy">
            <Link
              href="/search"
              className="rounded-md p-2 hover:bg-rc-surface"
              aria-label="Search"
            >
              <IconSearch className="h-6 w-6" />
            </Link>
            <Link
              href="/wishlist"
              className="rounded-md p-2 hover:bg-rc-surface"
              aria-label="Wishlist"
            >
              <IconHeart className="h-6 w-6" />
            </Link>
            <Link
              href="/cart"
              className="relative rounded-md p-2 hover:bg-rc-surface"
              aria-label="Shopping cart, 0 items"
            >
              <IconCart className="h-6 w-6" />
              <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rc-accent px-1 text-[10px] font-semibold leading-none text-white">
                0
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Desktop */}
      <div className="mx-auto hidden max-w-7xl items-center gap-8 px-4 py-4 md:flex">
        <Logo className="shrink-0 text-left" />
        <form
          className="mx-auto flex max-w-2xl flex-1 justify-center"
          action="/search"
          role="search"
        >
          <label htmlFor="desktop-search" className="sr-only">
            Search for rugs
          </label>
          <div className="flex w-full overflow-hidden rounded-lg border border-rc-border bg-white">
            <input
              id="desktop-search"
              name="q"
              type="search"
              placeholder="Search for rugs, carpets..."
              className="min-w-0 flex-1 px-4 py-3 text-sm text-rc-navy placeholder:text-rc-muted-light outline-none"
            />
            <button
              type="submit"
              className="shrink-0 bg-rc-navy px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-rc-navy-dark"
            >
              Search
            </button>
          </div>
        </form>
        <div className="flex shrink-0 items-center gap-8 text-rc-navy">
          <Link
            href="/account"
            className="flex items-center gap-3 transition-opacity hover:opacity-85"
          >
            <IconUser className="h-6 w-6 shrink-0 text-rc-navy" />
            <span className="flex flex-col items-start gap-0.5 leading-none">
              <span className="text-[11px] font-normal text-rc-muted">
                Login / Signup
              </span>
              <span className="text-sm font-bold tracking-tight text-rc-navy">
                My Account
              </span>
            </span>
          </Link>
          <div className="flex items-center gap-1">
            <Link
              href="/wishlist"
              className="rounded-full p-2 text-rc-navy hover:bg-rc-surface"
              aria-label="Wishlist"
            >
              <IconHeart className="h-6 w-6" />
            </Link>
            <Link
              href="/cart"
              className="relative rounded-full p-2 text-rc-navy hover:bg-rc-surface"
              aria-label="Shopping cart, 0 items"
            >
              <IconCart className="h-6 w-6" />
              <span className="absolute right-1 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rc-accent px-1 text-[10px] font-semibold leading-none text-white">
                0
              </span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
