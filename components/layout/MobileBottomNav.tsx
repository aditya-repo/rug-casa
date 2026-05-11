"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconCart, IconHeart, IconUser } from "@/components/layout/icons";

function IconHome({ active, className = "h-6 w-6" }: { active: boolean; className?: string }) {
  if (active) {
    return (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden
      >
        <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.061l-8.689-8.688a1.5 1.5 0 00-2.122 0l-8.69 8.688a.75.75 0 101.061 1.06l8.69-8.689z" />
        <path d="M12 5.432l8.159 8.159c.03.029.059.057.089.085v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75H9.75a.75.75 0 00-.75.75v4.5a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198c.03-.028.059-.056.09-.085L12 5.432z" />
      </svg>
    );
  }
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
      />
    </svg>
  );
}

function IconCategories({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM13.5 6A2.25 2.25 0 0115.75 3.75H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75A2.25 2.25 0 0115.75 13.5H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25v-2.25z"
      />
    </svg>
  );
}

const CART_COUNT = 0;

export function MobileBottomNav() {
  const pathname = usePathname();

  const isHome = pathname === "/";
  const isCategories = pathname.startsWith("/categories");
  const isWishlist = pathname.startsWith("/wishlist");
  const isAccount = pathname.startsWith("/account");
  const isCart = pathname.startsWith("/cart");

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex border-t border-rc-border bg-white px-1 pt-2 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] max-md:rounded-t-2xl md:hidden pb-[calc(0.35rem+env(safe-area-inset-bottom,0px))]"
      aria-label="Mobile navigation"
    >
      <Link
        href="/"
        className={`flex min-w-0 flex-1 flex-col items-center gap-1 py-1 text-rc-navy ${isHome ? "font-semibold" : "font-medium"}`}
        aria-current={isHome ? "page" : undefined}
      >
        <IconHome active={isHome} className="h-6 w-6 shrink-0 text-rc-navy" />
        <span className="max-w-full truncate text-center text-[10px] leading-tight">
          Home
        </span>
      </Link>

      <Link
        href="/categories"
        className={`flex min-w-0 flex-1 flex-col items-center gap-1 py-1 text-rc-navy ${isCategories ? "font-semibold" : "font-medium"}`}
        aria-current={isCategories ? "page" : undefined}
      >
        <IconCategories className="h-6 w-6 shrink-0 text-rc-navy" />
        <span className="max-w-full truncate text-center text-[10px] leading-tight">
          Categories
        </span>
      </Link>

      <Link
        href="/wishlist"
        className={`flex min-w-0 flex-1 flex-col items-center gap-1 py-1 text-rc-navy ${isWishlist ? "font-semibold" : "font-medium"}`}
        aria-current={isWishlist ? "page" : undefined}
      >
        <IconHeart className="h-6 w-6 shrink-0 text-rc-navy" />
        <span className="max-w-full truncate text-center text-[10px] leading-tight">
          Wishlist
        </span>
      </Link>

      <Link
        href="/account"
        className={`flex min-w-0 flex-1 flex-col items-center gap-1 py-1 text-rc-navy ${isAccount ? "font-semibold" : "font-medium"}`}
        aria-current={isAccount ? "page" : undefined}
      >
        <IconUser className="h-6 w-6 shrink-0 text-rc-navy" />
        <span className="max-w-full truncate text-center text-[10px] leading-tight">
          Account
        </span>
      </Link>

      <Link
        href="/cart"
        className={`relative flex min-w-0 flex-1 flex-col items-center gap-1 py-1 text-rc-navy ${isCart ? "font-semibold" : "font-medium"}`}
        aria-current={isCart ? "page" : undefined}
      >
        <span className="relative inline-flex shrink-0">
          <IconCart className="h-6 w-6 text-rc-navy" />
          <span className="absolute -right-1.5 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rc-navy px-1 text-[9px] font-bold leading-none text-white">
            {CART_COUNT}
          </span>
        </span>
        <span className="max-w-full truncate text-center text-[10px] leading-tight">
          Cart
        </span>
      </Link>
    </nav>
  );
}
