"use server";

import { signOut } from "@/auth";

/** Clears the Auth.js session and sends the shopper back to the storefront home. */
export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}
