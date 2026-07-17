"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import { IconCart } from "@/components/layout/icons";

type CartNavLinkProps = {
  className?: string;
  badgeClassName?: string;
  showIcon?: boolean;
};

export function CartNavLink({
  className = "relative rounded-md p-1.5 hover:bg-rc-surface",
  badgeClassName = "absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rc-accent px-1 text-[10px] font-semibold leading-none text-white",
  showIcon = true,
}: CartNavLinkProps) {
  const { itemCount, ready } = useCart();
  const count = ready ? itemCount : 0;
  const label =
    count === 0
      ? "Shopping cart"
      : `Shopping cart, ${count} ${count === 1 ? "item" : "items"}`;

  return (
    <Link href="/cart" className={className} aria-label={label}>
      {showIcon ? <IconCart className="h-5 w-5" /> : null}
      <span className={badgeClassName}>{count > 99 ? "99+" : count}</span>
    </Link>
  );
}

export function CartCountBadge({
  className = "absolute -right-1.5 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rc-navy px-1 text-[9px] font-bold leading-none text-white",
}: {
  className?: string;
}) {
  const { itemCount, ready } = useCart();
  const count = ready ? itemCount : 0;
  return <span className={className}>{count > 99 ? "99+" : count}</span>;
}
