import type { CartLine } from "@/lib/data/cart";
import { CartClient } from "./CartClient";

type CartViewProps = {
  lines: CartLine[];
};

export function CartView({ lines }: CartViewProps) {
  return <CartClient initialLines={lines} />;
}
