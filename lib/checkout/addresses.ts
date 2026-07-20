import type { SavedAddress } from "@/lib/data/addresses";

export function isIndiaShippingAddress(
  address: Pick<SavedAddress, "country" | "countryCode">,
): boolean {
  const code = (address.countryCode ?? "").trim().toUpperCase();
  if (code === "IN") return true;
  const name = (address.country ?? "").trim().toLowerCase();
  return name === "india" || name === "in" || name === "bharat";
}
