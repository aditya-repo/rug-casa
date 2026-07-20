"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { confirmCheckoutPayment } from "@/lib/checkout/actions";

export function CheckoutReturnClient() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const orderId = searchParams.get("order_id") ?? "";
  const [status, setStatus] = useState<"loading" | "paid" | "pending" | "failed">(
    "loading",
  );
  const [message, setMessage] = useState("Confirming your payment…");
  const [orderNumber, setOrderNumber] = useState(orderId);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!orderId) {
        setStatus("failed");
        setMessage("Missing order reference from payment return.");
        return;
      }

      const result = await confirmCheckoutPayment(orderId);
      if (cancelled) return;

      if (!result.ok) {
        setStatus("failed");
        setMessage(result.error);
        return;
      }

      setOrderNumber(result.data.orderNumber);
      if (result.data.paymentStatus === "PAID") {
        setStatus("paid");
        setMessage("Payment successful. Thank you for your order.");
        clearCart();
        try {
          sessionStorage.removeItem("rc-pending-order");
        } catch {
          /* ignore */
        }
        return;
      }

      if (result.data.paymentStatus === "FAILED") {
        setStatus("failed");
        setMessage("Payment was not completed. You can try again from your cart.");
        return;
      }

      setStatus("pending");
      setMessage(
        "Payment is still processing. We will confirm it via Cashfree webhook shortly.",
      );
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, [clearCart, orderId]);

  const title =
    status === "paid"
      ? "Order confirmed"
      : status === "failed"
        ? "Payment incomplete"
        : status === "pending"
          ? "Payment processing"
          : "Confirming payment";

  return (
    <div className="mx-auto max-w-lg rounded-lg border border-rc-border bg-white px-6 py-12 text-center">
      <h1 className="font-heading text-2xl font-semibold text-rc-navy">{title}</h1>
      <p className="mt-3 text-sm text-rc-muted">{message}</p>
      {orderNumber ? (
        <p className="mt-4 text-sm font-medium text-rc-navy">
          Order {orderNumber}
        </p>
      ) : null}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/shop"
          className="inline-flex items-center justify-center rounded-lg bg-rc-navy px-5 py-2.5 text-sm font-semibold text-white"
        >
          Continue shopping
        </Link>
        <Link
          href="/account"
          className="inline-flex items-center justify-center rounded-lg border border-rc-navy px-5 py-2.5 text-sm font-semibold text-rc-navy"
        >
          My account
        </Link>
      </div>
    </div>
  );
}
