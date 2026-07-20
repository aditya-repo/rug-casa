"use server";

import { auth } from "@/auth";
import {
  createCheckoutSession,
  verifyCheckoutPayment,
  type CheckoutAddressPayload,
  type CheckoutItemPayload,
  type CheckoutSessionResult,
  type CheckoutVerifyResult,
} from "@/lib/api/checkout";

export async function startCheckoutSession(input: {
  address: CheckoutAddressPayload;
  items: CheckoutItemPayload[];
}): Promise<
  | { ok: true; data: CheckoutSessionResult }
  | { ok: false; error: string }
> {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) {
    return { ok: false, error: "Please sign in to continue checkout." };
  }
  if (!input.items.length) {
    return { ok: false, error: "Your cart is empty." };
  }

  try {
    const data = await createCheckoutSession({
      email,
      address: input.address,
      items: input.items,
    });
    return { ok: true, data };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Checkout failed",
    };
  }
}

export async function confirmCheckoutPayment(
  orderId: string,
): Promise<
  | { ok: true; data: CheckoutVerifyResult }
  | { ok: false; error: string }
> {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) {
    return { ok: false, error: "Please sign in to verify payment." };
  }

  try {
    const data = await verifyCheckoutPayment({ email, orderId });
    return { ok: true, data };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Payment verification failed",
    };
  }
}
