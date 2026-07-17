"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useState,
  useTransition,
  type MouseEvent,
} from "react";
import { IconHeart } from "@/components/layout/icons";
import { toggleMyWishlist } from "@/lib/auth/wishlist-actions";

type WishlistHeartButtonProps = {
  productId: string;
  initialWishlisted?: boolean;
  isAuthenticated: boolean;
  className?: string;
  iconClassName?: string;
  /** Filled heart uses red on PDP; navy on shop cards. */
  activeClassName?: string;
};

export function WishlistHeartButton({
  productId,
  initialWishlisted = false,
  isAuthenticated,
  className = "absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-rc-navy shadow-sm transition-colors hover:bg-white",
  iconClassName = "h-4 w-4",
  activeClassName = "fill-rc-navy text-rc-navy",
}: WishlistHeartButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [wishlisted, setWishlisted] = useState(initialWishlisted);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    setWishlisted(initialWishlisted);
  }, [initialWishlisted, productId]);

  const onClick = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (!isAuthenticated) {
        const callbackUrl = pathname || `/product/${productId}`;
        router.push(
          `/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`,
        );
        return;
      }

      const previous = wishlisted;
      setWishlisted(!previous);

      startTransition(async () => {
        const result = await toggleMyWishlist(productId);
        if (!result.ok) {
          setWishlisted(previous);
          if ("needsAuth" in result && result.needsAuth) {
            router.push(
              `/signin?callbackUrl=${encodeURIComponent(pathname || `/product/${productId}`)}`,
            );
          }
          return;
        }
        setWishlisted(result.wishlisted);
        router.refresh();
      });
    },
    [isAuthenticated, pathname, productId, router, wishlisted],
  );

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      className={`${className} disabled:opacity-70`}
      aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={wishlisted}
    >
      <IconHeart
        className={`${iconClassName} ${wishlisted ? activeClassName : ""}`}
      />
    </button>
  );
}
