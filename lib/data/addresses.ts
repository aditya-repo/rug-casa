export type AddressLabel = "home" | "work" | "other";

export type SavedAddress = {
  id: string;
  label: AddressLabel;
  fullName: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
};

export const ADDRESS_LABEL_OPTIONS: { value: AddressLabel; label: string }[] = [
  { value: "home", label: "Home" },
  { value: "work", label: "Work" },
  { value: "other", label: "Other" },
];

export const defaultAddresses: SavedAddress[] = [
  {
    id: "seed-home",
    label: "home",
    fullName: "Arjun Sharma",
    phone: "+91 98765 43210",
    line1: "42, Palm Grove Apartments",
    line2: "Near City Mall",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001",
    country: "India",
    isDefault: true,
  },
  {
    id: "seed-work",
    label: "work",
    fullName: "Arjun Sharma",
    phone: "+91 98765 43210",
    line1: "RugCasa Studio, 12 Industrial Lane",
    line2: "Unit 3B",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400051",
    country: "India",
    isDefault: false,
  },
];
