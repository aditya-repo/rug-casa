"use server";

import { auth } from "@/auth";
import {
  createCustomerAddress,
  deleteCustomerAddress,
  fetchCustomerAddresses,
  setDefaultCustomerAddress,
  updateCustomerAddress,
  type AddressInput,
} from "@/lib/api/addresses";
import type { SavedAddress } from "@/lib/data/addresses";

export async function getMyAddresses(): Promise<SavedAddress[]> {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) return [];
  try {
    return await fetchCustomerAddresses(email);
  } catch {
    return [];
  }
}

export async function createMyAddress(
  input: AddressInput,
): Promise<{ ok: true; address: SavedAddress } | { ok: false; error: string }> {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) return { ok: false, error: "Please sign in to save addresses." };

  try {
    const address = await createCustomerAddress(email, input);
    return { ok: true, address };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Failed to create address",
    };
  }
}

export async function updateMyAddress(
  id: string,
  input: AddressInput,
): Promise<{ ok: true; address: SavedAddress } | { ok: false; error: string }> {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) return { ok: false, error: "Please sign in to update addresses." };

  try {
    const address = await updateCustomerAddress(email, id, input);
    return { ok: true, address };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Failed to update address",
    };
  }
}

export async function deleteMyAddress(
  id: string,
): Promise<{ ok: true; addresses: SavedAddress[] } | { ok: false; error: string }> {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) return { ok: false, error: "Please sign in to delete addresses." };

  try {
    const addresses = await deleteCustomerAddress(email, id);
    return { ok: true, addresses };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Failed to delete address",
    };
  }
}

export async function setMyDefaultAddress(
  id: string,
): Promise<{ ok: true; address: SavedAddress } | { ok: false; error: string }> {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) return { ok: false, error: "Please sign in to update addresses." };

  try {
    const address = await setDefaultCustomerAddress(email, id);
    return { ok: true, address };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Failed to set default address",
    };
  }
}
