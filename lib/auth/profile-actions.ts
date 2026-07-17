"use server";

import { auth } from "@/auth";
import {
  fetchCustomerProfile,
  updateCustomerProfile,
  type CustomerProfile,
} from "@/lib/api/customer-profile";

export async function getMyCustomerProfile(): Promise<CustomerProfile | null> {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) return null;
  return fetchCustomerProfile(email);
}

export async function saveMyCustomerProfile(input: {
  name: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
}): Promise<{ ok: true; profile: CustomerProfile } | { ok: false; error: string }> {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) {
    return { ok: false, error: "You must be signed in to update your profile." };
  }

  const parts = input.name.trim().split(/\s+/).filter(Boolean);
  const firstName = parts[0] || "Customer";
  const lastName = parts.slice(1).join(" ");

  try {
    const existing = await fetchCustomerProfile(email);
    const profile = await updateCustomerProfile({
      email,
      firstName,
      lastName,
      phone: input.phone,
      gender: input.gender,
      dateOfBirth: input.dateOfBirth,
      image: existing?.image ?? session.user?.image ?? null,
    });
    return { ok: true, profile };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Failed to save profile",
    };
  }
}
