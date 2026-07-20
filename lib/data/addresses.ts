export type AddressLabel = "home" | "work" | "other";

export type SavedAddress = {
  id: string;
  label: AddressLabel;
  fullName: string;
  phone: string;
  line1: string;
  line2: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  /** ISO country code when known (e.g. IN). Used for payment gateway routing. */
  countryCode?: string;
  isDefault: boolean;
};

export const ADDRESS_LABEL_OPTIONS: { value: AddressLabel; label: string }[] = [
  { value: "home", label: "Home" },
  { value: "work", label: "Work" },
  { value: "other", label: "Other" },
];
