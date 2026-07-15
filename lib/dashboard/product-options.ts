export const PRODUCT_COLLECTIONS = [
  "Living Room",
  "Bedroom",
  "Runners",
  "Outdoor",
  "Handwoven",
  "Vintage",
] as const;

export const PRODUCT_MATERIALS = ["Wool", "Cotton", "Silk", "Jute", "Synthetic"] as const;

export const PRODUCT_SHAPES = ["Rectangle", "Round", "Runner", "Square"] as const;

export const PRODUCT_COLORS = [
  "Beige",
  "Blue",
  "Brown",
  "Cream",
  "Grey",
  "Ivory",
  "Multi",
  "Red",
  "Teal",
] as const;

export const PRODUCT_AVAILABILITY = ["in_stock", "out_of_stock", "preorder"] as const;

export const PRODUCT_THICKNESS = ["Low pile", "Medium pile", "High pile"] as const;

export const PRODUCT_TECHNIQUES = [
  "Hand-knotted",
  "Hand-tufted",
  "Flatweave",
  "Machine-made",
  "Braided",
] as const;

export const PRODUCT_ORIGINS = ["India", "Persia", "Turkey", "Morocco", "Afghanistan"] as const;

export const PRODUCT_STYLES = [
  "Traditional",
  "Modern",
  "Bohemian",
  "Minimal",
  "Vintage",
  "Contemporary",
] as const;

export const PRODUCT_DESIGN_STYLES = ["Modern", "Transitional", "Traditional"] as const;

export const PRODUCT_DECOR_STYLES = [
  "Minimalist",
  "Bohemian",
  "Eclectic",
  "Maximalist",
] as const;

/** Rug pattern / art motifs shown on listing and PDP */
export const PRODUCT_PATTERN_ART = [
  "Floral",
  "Geometric",
  "Medallion",
  "Abstract",
  "Solid",
  "Tribal",
  "Heritage",
  "Kilim",
  "Paisley",
  "Chevron",
] as const;

export const PRODUCT_SIZES = ["5x7", "6x9", "8x10", "9x12", "2.5x8", "6 ft round"] as const;

export const PRODUCT_STATUSES = ["published", "draft", "out_of_stock", "archived"] as const;

export const TAX_OPTIONS = ["GST 5%", "GST 12%", "GST 18%", "Exempt"] as const;

export function availabilityLabel(value: string) {
  if (value === "in_stock") return "In stock";
  if (value === "out_of_stock") return "Out of stock";
  if (value === "preorder") return "Pre-order";
  return value;
}
