"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CartCountBadge } from "@/components/cart/CartNavLink";

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

function IconCategories({
  active,
  className = "h-6 w-6",
}: {
  active: boolean;
  className?: string;
}) {
  if (active) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M3.375 5.25C3.375 4.422 4.047 3.75 4.875 3.75h2.25c.828 0 1.5.672 1.5 1.5v2.25c0 .828-.672 1.5-1.5 1.5h-2.25a1.5 1.5 0 01-1.5-1.5V5.25zM13.125 5.25c0-.828.672-1.5 1.5-1.5h2.25c.828 0 1.5.672 1.5 1.5v2.25c0 .828-.672 1.5-1.5 1.5h-2.25a1.5 1.5 0 01-1.5-1.5V5.25zM3.375 14.25c0-.828.672-1.5 1.5-1.5h2.25c.828 0 1.5.672 1.5 1.5V18a1.5 1.5 0 01-1.5 1.5h-2.25a1.5 1.5 0 01-1.5-1.5v-2.25zM13.125 14.25c0-.828.672-1.5 1.5-1.5h2.25c.828 0 1.5.672 1.5 1.5V18a1.5 1.5 0 01-1.5 1.5h-2.25a1.5 1.5 0 01-1.5-1.5v-2.25z" />
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
        d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM13.5 6A2.25 2.25 0 0115.75 3.75H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75A2.25 2.25 0 0115.75 13.5H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25v-2.25z"
      />
    </svg>
  );
}

function IconHeartTab({ active, className = "h-6 w-6" }: { active: boolean; className?: string }) {
  if (active) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
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
        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
      />
    </svg>
  );
}

function IconUserTab({ active, className = "h-6 w-6" }: { active: boolean; className?: string }) {
  if (active) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path
          fillRule="evenodd"
          d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
          clipRule="evenodd"
        />
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
        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
      />
    </svg>
  );
}

function IconCartTab({ active, className = "h-6 w-6" }: { active: boolean; className?: string }) {
  if (active) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a3 3 0 002.988-2.647l1.946-9.114A.75.75 0 0023.25 3H6.257a2.25 2.25 0 00-2.163-1.63H2.25z" />
        <path d="M6 20.25a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm12.75 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
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
        d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218a1.5 1.5 0 001.464-1.175l3.5-16.5a.75.75 0 00-.75-.9H7.5M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
      />
    </svg>
  );
}

function tabStyles(active: boolean) {
  return [
    "flex min-w-0 flex-1 flex-col items-center gap-1 py-1.5 mx-0.5 transition-colors",
    active
      ? "font-semibold text-rc-navy"
      : "font-medium text-rc-muted hover:text-rc-navy",
  ].join(" ");
}

export function MobileBottomNav() {
  const pathname = usePathname();

  if (pathname.startsWith("/dashboard")) {
    return null;
  }

  const isHome = pathname === "/";
  const isCategories = pathname.startsWith("/categories");
  const isWishlist = pathname.startsWith("/wishlist");
  const isAccount = pathname.startsWith("/account");
  const isCart = pathname.startsWith("/cart");

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex border-t border-rc-border bg-white px-0.5 pt-2 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] max-md:rounded-t-2xl md:hidden pb-[calc(0.35rem+env(safe-area-inset-bottom,0px))]"
      aria-label="Mobile navigation"
    >
      <Link
        href="/"
        className={tabStyles(isHome)}
        aria-current={isHome ? "page" : undefined}
      >
        <IconHome active={isHome} className="h-6 w-6 shrink-0" />
        <span className="max-w-full truncate text-center text-[10px] leading-tight">
          Home
        </span>
      </Link>

      <Link
        href="/categories"
        className={tabStyles(isCategories)}
        aria-current={isCategories ? "page" : undefined}
      >
        <IconCategories active={isCategories} className="h-6 w-6 shrink-0" />
        <span className="max-w-full truncate text-center text-[10px] leading-tight">
          Categories
        </span>
      </Link>

      <Link
        href="/wishlist"
        className={tabStyles(isWishlist)}
        aria-current={isWishlist ? "page" : undefined}
      >
        <IconHeartTab active={isWishlist} className="h-6 w-6 shrink-0" />
        <span className="max-w-full truncate text-center text-[10px] leading-tight">
          Wishlist
        </span>
      </Link>

      <Link
        href="/account"
        className={tabStyles(isAccount)}
        aria-current={isAccount ? "page" : undefined}
      >
        <IconUserTab active={isAccount} className="h-6 w-6 shrink-0" />
        <span className="max-w-full truncate text-center text-[10px] leading-tight">
          Account
        </span>
      </Link>

      <Link
        href="/cart"
        className={`relative ${tabStyles(isCart)}`}
        aria-current={isCart ? "page" : undefined}
      >
        <span className="relative inline-flex shrink-0">
          <IconCartTab active={isCart} className="h-6 w-6" />
          <CartCountBadge />
        </span>
        <span className="max-w-full truncate text-center text-[10px] leading-tight">
          Cart
        </span>
      </Link>
    </nav>
  );
}
