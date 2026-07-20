export const PRODUCT_COLLECTIONS = [
  "Living Room",
  "Bedroom",
  "Runners",
  "Outdoor",
  "Handwoven",
  "Vintage",
] as const;

export const PRODUCT_MATERIALS = [
  "New Zealand Wool",
  "Indian Wool",
  "Silk",
  "Cotton",
  "Jute",
  "Hemp",
  "Linen",
  "Nettle",
  "Bamboo Silk",
  "Tencel",
  "Sari Silk",
  "Mohair",
] as const;

export const PRODUCT_SHAPES = [
  "Rectangle",
  "Runner",
  "Round",
  "Oval",
  "Square",
  "Irregular",
  "Organic",
  "Freeform",
] as const;

export const PRODUCT_COLORS = [
  "White",
  "Off White",
  "Ivory",
  "Cream",
  "Linen",
  "Beige",
  "Sand",
  "Natural",
  "Taupe",
  "Greige",
  "Camel",
  "Tan",
  "Khaki",
  "Brown",
  "Chocolate",
  "Coffee",
  "Mocha",
  "Walnut",
  "Chestnut",
  "Grey",
  "Light Grey",
  "Medium Grey",
  "Dark Grey",
  "Charcoal",
  "Graphite",
  "Black",
  "Blue",
  "Sky Blue",
  "Navy",
  "Indigo",
  "Denim",
  "Slate Blue",
  "Teal",
  "Turquoise",
  "Aqua",
  "Green",
  "Sage",
  "Olive",
  "Moss",
  "Forest Green",
  "Emerald",
  "Mint",
  "Yellow",
  "Mustard",
  "Gold",
  "Ochre",
  "Orange",
  "Burnt Orange",
  "Terracotta",
  "Rust",
  "Red",
  "Brick Red",
  "Crimson",
  "Burgundy",
  "Wine",
  "Maroon",
  "Pink",
  "Blush",
  "Dusty Rose",
  "Coral",
  "Peach",
  "Purple",
  "Lavender",
  "Plum",
  "Lilac",
  "Violet",
  "Silver",
  "Metallic Gold",
  "Metallic Silver",
  "Copper",
  "Multicolor",
] as const;

export const PRODUCT_AVAILABILITY = ["in_stock", "out_of_stock", "preorder"] as const;

export const PRODUCT_THICKNESS = [
  "Ultra Thin",
  "Thin",
  "Medium",
  "Thick",
  "Plush",
] as const;

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

export const PRODUCT_DESIGN_STYLES = [
  "Modern",
  "Persian",
  "Vintage",
  "Abstract",
  "Geometric",
  "Moroccan",
  "Tribal",
  "Scandinavian",
  "Minimalist",
  "Traditional",
  "Contemporary",
] as const;

export const PRODUCT_DECOR_STYLES = [
  "Modern",
  "Scandinavian",
  "Luxury",
  "Farmhouse",
  "Rustic",
  "Industrial",
  "Bohemian",
  "Coastal",
  "Japandi",
  "Mid-Century Modern",
  "Traditional",
  "Eclectic",
  "Transitional",
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

/** Editable product statuses (stock-driven out_of_stock is derived). */
export const PRODUCT_EDITABLE_STATUSES = ["draft", "published", "archived"] as const;

export const TAX_OPTIONS = ["GST 5%", "GST 12%", "GST 18%", "Exempt"] as const;

export function availabilityLabel(value: string) {
  if (value === "in_stock") return "In stock";
  if (value === "out_of_stock") return "Out of stock";
  if (value === "preorder") return "Pre-order";
  return value;
}

export function productStatusLabel(value: string) {
  if (value === "published") return "Published";
  if (value === "draft") return "Draft";
  if (value === "out_of_stock") return "Out of stock";
  if (value === "archived") return "Archived";
  return value;
}
