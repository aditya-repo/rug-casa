import type {
  PRODUCT_AVAILABILITY,
  PRODUCT_MATERIALS,
  PRODUCT_SHAPES,
  PRODUCT_STATUSES,
} from "./product-options";

export type ProductStatus = (typeof PRODUCT_STATUSES)[number];
export type ProductAvailability = (typeof PRODUCT_AVAILABILITY)[number];
export type ProductMaterial = (typeof PRODUCT_MATERIALS)[number];
export type ProductShape = (typeof PRODUCT_SHAPES)[number];

export type ProductVariant = {
  id: string;
  shape: string;
  /** Combined size label for display/API, e.g. `5x7`. Derived from length × width. */
  size: string;
  /** Length in feet (e.g. `5`). */
  length: string;
  /** Width in feet (e.g. `7`). */
  width: string;
  material: string;
  /** Primary colour name from master colour list. */
  color: string;
  /** Additional colours (comma-separated names). */
  otherColors: string;
  weavingType: string;
  patternArt: string;
  thickness: string;
  origin: string;
  price: string;
  salePrice: string;
  stock: number;
  sku: string;
  images: string[];
  isPrimary: boolean;
};

/** Build storefront size label from length × width (feet). */
export function composeSizeLabel(length: string, width: string): string {
  const l = length.trim();
  const w = width.trim();
  if (l && w) return `${l}x${w}`;
  return l || w || "";
}

/** Split a stored size like `5x7` / `5 × 7` into length and width. */
export function parseSizeParts(size: string): { length: string; width: string } {
  const match = size.trim().match(/^([\d.]+)\s*[x×]\s*([\d.]+)/i);
  if (match) return { length: match[1], width: match[2] };
  if (size.trim()) return { length: size.trim(), width: "" };
  return { length: "", width: "" };
}

export function createEmptyVariant(): ProductVariant {
  return {
    id: `var-${Date.now()}`,
    shape: "Rectangle",
    size: "",
    length: "",
    width: "",
    material: "Indian Wool",
    color: "Beige",
    otherColors: "",
    weavingType: "Hand-knotted",
    patternArt: "Geometric",
    thickness: "Medium",
    origin: "India",
    price: "",
    salePrice: "",
    stock: 0,
    sku: "",
    images: [],
    isPrimary: false,
  };
}

export type DashboardProduct = {
  id: string;
  name: string;
  title: string;
  slug: string;
  shortDescription: string;
  detailedDescription: string;
  seoDescription: string;
  imageSrc: string;
  imageAlt: string;
  collection: string;
  categoryId: string;
  weavingType: string;
  material: string;
  patternArt: string;
  thickness: string;
  shape: string;
  featureList: string[];
  designTitle: string;
  designDescription: string;
  designStyle: string;
  decorStyle: string;
  origin: string;
  photoShootingCondition: string;
  usages: string;
  note: string;
  basePrice: string;
  salePrice: string;
  wholesalePrice: string;
  tax: string;
  sku: string;
  barcode: string;
  hsn: string;
  quantity: number;
  lowStockAlert: number;
  variants: ProductVariant[];
  status: ProductStatus;
  availability: ProductAvailability;
  featured: boolean;
  updatedAt: string;
};

export type DashboardProductListItem = Pick<
  DashboardProduct,
  | "id"
  | "name"
  | "sku"
  | "imageSrc"
  | "imageAlt"
  | "status"
  | "updatedAt"
  | "collection"
  | "featured"
  | "availability"
> & {
  price: string;
  stock: number;
  material: string;
  shape: string;
  color: string;
};

function toListItem(p: DashboardProduct): DashboardProductListItem {
  const stock = p.variants.reduce((sum, v) => sum + v.stock, 0) || p.quantity;
  const firstVariant = p.variants[0];
  return {
    id: p.id,
    name: p.name,
    sku: p.sku,
    imageSrc: p.imageSrc,
    imageAlt: p.imageAlt,
    price: p.salePrice || p.basePrice,
    stock,
    status: p.status,
    updatedAt: p.updatedAt,
    collection: p.collection,
    material: p.material || firstVariant?.material || "Indian Wool",
    shape: p.shape || firstVariant?.shape || "Rectangle",
    color: firstVariant?.color ?? "—",
    availability: p.availability,
    featured: p.featured,
  };
}

const handwovenRug: DashboardProduct = {
  id: "handwoven-rug",
  name: "Handwoven Rug",
  title: "Handwoven Rug",
  slug: "handwoven-rug",
  shortDescription: "Artisan handwoven rug with natural fibres and timeless pattern.",
  detailedDescription:
    "Crafted by skilled weavers using traditional techniques. Soft underfoot with durable construction suited for living rooms and bedrooms. Each piece may show subtle variations that add character.",
  seoDescription:
    "Shop the Handwoven Rug at Rugs Bhadohi — wool blend, multiple sizes, free shipping across India.",
  imageSrc:
    "https://images.unsplash.com/photo-1600166898402-4ae75bbb0e93?w=200&h=200&fit=crop",
  imageAlt: "Handwoven rug texture",
  collection: "Handwoven",
  categoryId: "",
  weavingType: "Hand-knotted",
  material: "Indian Wool",
  patternArt: "Geometric",
  thickness: "Medium",
  shape: "Rectangle",
  featureList: [],
  designTitle: "",
  designDescription: "",
  designStyle: "",
  decorStyle: "",
  origin: "India",
  photoShootingCondition: "",
  usages: "",
  note: "",
  basePrice: "4999",
  salePrice: "3999",
  wholesalePrice: "3200",
  tax: "GST 12%",
  sku: "RC-HW-001",
  barcode: "8901234567890",
  hsn: "",
  quantity: 0,
  lowStockAlert: 5,
  variants: [
    {
      id: "var-5x7",
      shape: "Rectangle",
      size: "5x7",
      length: "5",
      width: "7",
      material: "Indian Wool",
      color: "Beige",
      otherColors: "",
      weavingType: "Hand-knotted",
      patternArt: "Geometric",
      thickness: "Medium",
      origin: "India",
      price: "18000",
      salePrice: "16500",
      stock: 2,
      sku: "HR001",
      images: ["https://images.unsplash.com/photo-1600166898402-4ae75bbb0e93?w=200&h=200&fit=crop"],
    isPrimary: true,
    },
    {
      id: "var-6x9",
      shape: "Rectangle",
      size: "6x9",
      length: "6",
      width: "9",
      material: "Indian Wool",
      color: "Ivory",
      otherColors: "",
      weavingType: "Hand-knotted",
      patternArt: "Geometric",
      thickness: "Medium",
      origin: "India",
      price: "22000",
      salePrice: "19999",
      stock: 8,
      sku: "HR002",
      images: ["https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=200&h=200&fit=crop"],
    isPrimary: false,
    },
    {
      id: "var-8x10",
      shape: "Rectangle",
      size: "8x10",
      length: "8",
      width: "10",
      material: "Indian Wool",
      color: "Cream",
      otherColors: "",
      weavingType: "Hand-knotted",
      patternArt: "Heritage",
      thickness: "Medium",
      origin: "India",
      price: "28000",
      salePrice: "25999",
      stock: 4,
      sku: "HR003",
      images: ["https://images.unsplash.com/photo-1615529328331-f8917597711f?w=200&h=200&fit=crop"],
    isPrimary: false,
    },
  ],
  status: "published",
  availability: "in_stock",
  featured: true,
  updatedAt: "Jun 25, 2026",
};

const dashboardProductsStore: DashboardProduct[] = [
  handwovenRug,
  {
    id: "tr-vintage",
    name: "Vintage Distressed Rug",
    title: "Vintage Distressed Rug",
    slug: "vintage-distressed-rug",
    shortDescription: "Aged look with distressed finish for character-rich interiors.",
    detailedDescription:
      "Inspired by antique Persian designs with a deliberately faded palette. Power-loomed for consistency with a soft feel underfoot.",
    seoDescription: "Vintage distressed rug — rectangle wool rug in multiple sizes.",
    imageSrc:
      "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?w=200&h=200&fit=crop",
    imageAlt: "Vintage distressed rug",
    collection: "Vintage",
    categoryId: "",
    weavingType: "Hand-knotted",
    material: "Indian Wool",
    patternArt: "Geometric",
    thickness: "Medium",
    shape: "Rectangle",
    featureList: [],
    designTitle: "",
    designDescription: "",
    designStyle: "",
    decorStyle: "",
    origin: "India",
    photoShootingCondition: "",
    usages: "",
    note: "",
    basePrice: "4199",
    salePrice: "3199",
    wholesalePrice: "2600",
    tax: "GST 12%",
    sku: "RC-VD-58",
    barcode: "8901234567891",
    hsn: "",
    quantity: 24,
    lowStockAlert: 6,
    variants: [
      {
        id: "vd-5x7",
        shape: "Rectangle",
        size: "5x7",
      length: "5",
      width: "7",
        material: "Indian Wool",
        color: "Brown",
        otherColors: "",
        weavingType: "Machine-made",
        patternArt: "Heritage",
        thickness: "Thin",
        origin: "India",
        price: "4199",
        salePrice: "3199",
        stock: 14,
        sku: "RC-VD-58-57",
        images: ["https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?w=200&h=200&fit=crop"],
      isPrimary: true,
      },
      {
        id: "vd-6x9",
        shape: "Rectangle",
        size: "6x9",
      length: "6",
      width: "9",
        material: "Indian Wool",
        color: "Brown",
        otherColors: "",
        weavingType: "Machine-made",
        patternArt: "Heritage",
        thickness: "Thin",
        origin: "India",
        price: "5599",
        salePrice: "4599",
        stock: 10,
        sku: "RC-VD-58-69",
        images: ["https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?w=200&h=200&fit=crop"],
      isPrimary: false,
      },
    ],
    status: "published",
    availability: "in_stock",
    featured: true,
    updatedAt: "Jun 24, 2026",
  },
  {
    id: "na-jute",
    name: "Jute Braided Rug",
    title: "Jute Braided Rug",
    slug: "jute-braided-rug",
    shortDescription: "Natural jute braided rug for casual, earthy spaces.",
    detailedDescription: "Eco-friendly jute construction with braided texture. Ideal for layering in bedrooms and sunrooms.",
    seoDescription: "Jute braided rug — cotton-jute blend, runner and rectangle sizes.",
    imageSrc:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop",
    imageAlt: "Jute braided rug",
    collection: "Bedroom",
    categoryId: "",
    weavingType: "Hand-knotted",
    material: "Indian Wool",
    patternArt: "Geometric",
    thickness: "Medium",
    shape: "Rectangle",
    featureList: [],
    designTitle: "",
    designDescription: "",
    designStyle: "",
    decorStyle: "",
    origin: "India",
    photoShootingCondition: "",
    usages: "",
    note: "",
    basePrice: "2999",
    salePrice: "2499",
    wholesalePrice: "1900",
    tax: "GST 5%",
    sku: "RC-JB-46",
    barcode: "8901234567892",
    hsn: "",
    quantity: 8,
    lowStockAlert: 4,
    variants: [
      {
        id: "jb-6x9",
        shape: "Rectangle",
        size: "6x9",
      length: "6",
      width: "9",
        material: "Jute",
        color: "Beige",
        otherColors: "",
        weavingType: "Braided",
        patternArt: "Solid",
        thickness: "Thin",
        origin: "India",
        price: "2999",
        salePrice: "2499",
        stock: 8,
        sku: "RC-JB-46-69",
        images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop"],
      isPrimary: true,
      },
    ],
    status: "published",
    availability: "in_stock",
    featured: false,
    updatedAt: "Jun 23, 2026",
  },
  {
    id: "ep-kilim",
    name: "Kilim Flatweave",
    title: "Kilim Flatweave",
    slug: "kilim-flatweave",
    shortDescription: "Colourful flatweave kilim with geometric motifs.",
    detailedDescription: "Lightweight flatweave suitable for high-traffic areas. Reversible design extends usable life.",
    seoDescription: "Kilim flatweave rug — cotton flatweave in bold geometric patterns.",
    imageSrc:
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=200&h=200&fit=crop",
    imageAlt: "Kilim flatweave rug",
    collection: "Living Room",
    categoryId: "",
    weavingType: "Hand-knotted",
    material: "Indian Wool",
    patternArt: "Geometric",
    thickness: "Medium",
    shape: "Rectangle",
    featureList: [],
    designTitle: "",
    designDescription: "",
    designStyle: "",
    decorStyle: "",
    origin: "India",
    photoShootingCondition: "",
    usages: "",
    note: "",
    basePrice: "4599",
    salePrice: "3599",
    wholesalePrice: "2900",
    tax: "GST 12%",
    sku: "RC-KF-57",
    barcode: "8901234567893",
    hsn: "",
    quantity: 0,
    lowStockAlert: 5,
    variants: [
      {
        id: "kf-5x7",
        shape: "Rectangle",
        size: "5x7",
      length: "5",
      width: "7",
        material: "Cotton",
        color: "Multi",
        otherColors: "",
        weavingType: "Flatweave",
        patternArt: "Kilim",
        thickness: "Thin",
        origin: "Turkey",
        price: "4599",
        salePrice: "3599",
        stock: 0,
        sku: "RC-KF-57-57",
        images: ["https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=200&h=200&fit=crop"],
      isPrimary: true,
      },
    ],
    status: "out_of_stock",
    availability: "out_of_stock",
    featured: false,
    updatedAt: "Jun 22, 2026",
  },
  {
    id: "tr-floral",
    name: "Floral Heritage Rug",
    title: "Floral Heritage Rug",
    slug: "floral-heritage-rug",
    shortDescription: "Classic floral heritage pattern in rich jewel tones.",
    detailedDescription: "Dense floral motif with bordered frame. Draft listing — not yet visible on storefront.",
    seoDescription: "Floral heritage wool rug — traditional pattern for formal living spaces.",
    imageSrc:
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=200&h=200&fit=crop",
    imageAlt: "Floral heritage rug",
    collection: "Living Room",
    categoryId: "",
    weavingType: "Hand-knotted",
    material: "Indian Wool",
    patternArt: "Geometric",
    thickness: "Medium",
    shape: "Rectangle",
    featureList: [],
    designTitle: "",
    designDescription: "",
    designStyle: "",
    decorStyle: "",
    origin: "India",
    photoShootingCondition: "",
    usages: "",
    note: "",
    basePrice: "4999",
    salePrice: "3799",
    wholesalePrice: "3100",
    tax: "GST 18%",
    sku: "RC-FH-69",
    barcode: "8901234567894",
    hsn: "",
    quantity: 15,
    lowStockAlert: 5,
    variants: [
      {
        id: "fh-6x9",
        shape: "Rectangle",
        size: "6x9",
      length: "6",
      width: "9",
        material: "Silk",
        color: "Red",
        otherColors: "",
        weavingType: "Hand-tufted",
        patternArt: "Floral",
        thickness: "Thick",
        origin: "Persia",
        price: "4999",
        salePrice: "3799",
        stock: 15,
        sku: "RC-FH-69-69",
        images: ["https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=200&h=200&fit=crop"],
      isPrimary: true,
      },
    ],
    status: "draft",
    availability: "preorder",
    featured: false,
    updatedAt: "Jun 20, 2026",
  },
];

export function getDashboardProducts(): DashboardProductListItem[] {
  return dashboardProductsStore.map(toListItem);
}

export function getDashboardProductById(id: string): DashboardProduct | undefined {
  return dashboardProductsStore.find((p) => p.id === id);
}

export function createEmptyProduct(): DashboardProduct {
  return {
    id: "",
    name: "",
    title: "",
    slug: "",
    shortDescription: "",
    detailedDescription: "",
    seoDescription: "",
    imageSrc: "",
    imageAlt: "",
    collection: "",
    categoryId: "",
    weavingType: "Hand-knotted",
    material: "Indian Wool",
    patternArt: "Geometric",
    thickness: "Medium",
    shape: "Rectangle",
    featureList: [],
    designTitle: "",
    designDescription: "",
    designStyle: "",
    decorStyle: "",
    origin: "India",
    photoShootingCondition: "",
    usages: "",
    note: "",
    basePrice: "",
    salePrice: "",
    wholesalePrice: "",
    tax: "GST 12%",
    sku: "",
    barcode: "",
    hsn: "",
    quantity: 0,
    lowStockAlert: 5,
    variants: [createEmptyVariant()],
    status: "draft",
    availability: "in_stock",
    featured: false,
    updatedAt: "—",
  };
}
