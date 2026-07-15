import { API_ORIGIN } from "./config";
import type { DashboardProduct, ProductVariant } from "@/lib/dashboard/products";
import type { ProductListRow } from "./products";

export function formatCurrency(amount: number | string | null | undefined): string {
  const n = typeof amount === "string" ? parseFloat(amount) : (amount ?? 0);
  if (Number.isNaN(n)) return "₹0";
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  return `₹${n.toLocaleString("en-IN")}`;
}

export function formatDate(iso: string | Date | null | undefined): string {
  if (!iso) return "—";
  const d = typeof iso === "string" ? new Date(iso) : iso;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function formatRelativeDate(iso: string | Date): string {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return formatDate(d);
}

export function mapStatusToUi(status: string): string {
  return status.toLowerCase();
}

export function mapStatusToApi(status: string): "DRAFT" | "PUBLISHED" | "ARCHIVED" {
  const s = status.toUpperCase();
  if (s === "PUBLISHED" || s === "OUT_OF_STOCK") return "PUBLISHED";
  if (s === "ARCHIVED") return "ARCHIVED";
  return "DRAFT";
}

export function imageUrl(path: string | null | undefined): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_ORIGIN}/${path.replace(/^\//, "")}`;
}

type ApiVariant = {
  id: string;
  sku: string;
  price: number | string;
  salePrice?: number | string | null;
  stock: number;
  thumbnail?: string | null;
  attributes?: Record<string, string> | null;
};

type ApiProduct = {
  id: string;
  title: string;
  slug: string;
  skuPrefix?: string | null;
  shortDescription?: string | null;
  description?: string | null;
  categoryId?: string | null;
  collection?: string | null;
  origin?: string | null;
  careInstructions?: string | null;
  isFeatured: boolean;
  status: string;
  updatedAt: string;
  category?: { id: string; name: string; slug: string } | null;
  images?: Array<{ path: string; alt?: string | null; isFeatured: boolean }>;
  variants?: ApiVariant[];
  seo?: { seoDescription?: string | null } | null;
};

function parseDesignPayload(raw: string | null | undefined): {
  title: string;
  description: string;
  items: string[];
  designStyle: string;
  decorStyle: string;
  photoShootingCondition: string;
  usages: string;
  note: string;
  hsn: string;
  tax: string;
} {
  const empty = {
    title: "",
    description: "",
    items: [] as string[],
    designStyle: "",
    decorStyle: "",
    photoShootingCondition: "",
    usages: "",
    note: "",
    hsn: "",
    tax: "",
  };
  if (!raw?.trim()) return empty;
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return {
        ...empty,
        items: parsed.map((item) => String(item).trim()).filter(Boolean),
      };
    }
    if (parsed && typeof parsed === "object") {
      const items = Array.isArray(parsed.items)
        ? parsed.items.map((item: unknown) => String(item).trim()).filter(Boolean)
        : [];
      return {
        title: typeof parsed.title === "string" ? parsed.title : "",
        description: typeof parsed.description === "string" ? parsed.description : "",
        items,
        designStyle:
          typeof parsed.designStyle === "string"
            ? parsed.designStyle
            : typeof parsed.style === "string"
              ? parsed.style
              : "",
        decorStyle: typeof parsed.decorStyle === "string" ? parsed.decorStyle : "",
        photoShootingCondition:
          typeof parsed.photoShootingCondition === "string"
            ? parsed.photoShootingCondition
            : "",
        usages: typeof parsed.usages === "string" ? parsed.usages : "",
        note: typeof parsed.note === "string" ? parsed.note : "",
        hsn: typeof parsed.hsn === "string" ? parsed.hsn : "",
        tax: typeof parsed.tax === "string" ? parsed.tax : "",
      };
    }
  } catch {
    // fall through — treat as newline-separated list
  }
  return {
    ...empty,
    items: raw
      .split("\n")
      .map((line) => line.replace(/^[-*•]\s*/, "").trim())
      .filter(Boolean),
  };
}

function serializeDesignPayload(input: {
  title: string;
  description: string;
  items: string[];
  designStyle: string;
  decorStyle: string;
  photoShootingCondition: string;
  usages: string;
  note: string;
  hsn: string;
  tax: string;
}): string | undefined {
  const items = input.items.map((item) => item.trim()).filter(Boolean);
  const title = input.title.trim();
  const description = input.description.trim();
  const designStyle = input.designStyle.trim();
  const decorStyle = input.decorStyle.trim();
  const photoShootingCondition = input.photoShootingCondition.trim();
  const usages = input.usages.trim();
  const note = input.note.trim();
  const hsn = input.hsn.trim();
  const tax = input.tax.trim();
  if (
    !title &&
    !description &&
    items.length === 0 &&
    !designStyle &&
    !decorStyle &&
    !photoShootingCondition &&
    !usages &&
    !note &&
    !hsn &&
    !tax
  ) {
    return undefined;
  }
  return JSON.stringify({
    title,
    description,
    items,
    designStyle,
    decorStyle,
    photoShootingCondition,
    usages,
    note,
    hsn,
    tax,
  });
}

function attrs(v: ApiVariant | undefined, productOrigin?: string | null) {
  const a = v?.attributes ?? {};
  return {
    shape: a.shape ?? "Rectangle",
    material: a.material ?? "Wool",
    color: a.color ?? "Beige",
    size: a.size ?? "",
    weavingType: a.technique ?? a.weavingType ?? "Hand-knotted",
    patternArt: a.style ?? a.patternArt ?? a.pattern ?? "Geometric",
    thickness: a.thickness ?? "Medium pile",
    origin: a.origin ?? productOrigin ?? "India",
    isPrimary: a.isPrimary === "true" || a.isPrimary === "1",
  };
}

function pickPrimaryVariant<T extends { attributes?: Record<string, string> | null }>(
  variants: T[],
): T | undefined {
  return (
    variants.find((v) => v.attributes?.isPrimary === "true" || v.attributes?.isPrimary === "1") ??
    variants[0]
  );
}

function parseVariantImages(
  thumbnail: string | null | undefined,
  attributes: Record<string, string> | null | undefined,
): string[] {
  const raw = attributes?.images;
  if (raw?.trim()) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => String(item).trim()).filter(Boolean);
      }
    } catch {
      const split = raw
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
      if (split.length) return split;
    }
  }
  return thumbnail ? [thumbnail] : [];
}

export function mapProductToListItem(p: ApiProduct): ProductListRow {
  const variants = p.variants ?? [];
  const variant = pickPrimaryVariant(variants);
  const va = attrs(variant, p.origin);
  const stock = variants.reduce((s, v) => s + v.stock, 0);
  const price = variant?.salePrice ?? variant?.price ?? 0;
  const featuredImage = p.images?.find((i) => i.isFeatured) ?? p.images?.[0];
  const uiStatus = mapStatusToUi(p.status);
  const apiStatus = p.status.toUpperCase() as ProductListRow["apiStatus"];

  return {
    id: p.id,
    name: p.title,
    slug: p.slug,
    sku: variant?.sku ?? p.skuPrefix ?? "—",
    imageSrc: imageUrl(featuredImage?.path ?? variant?.thumbnail),
    imageAlt: featuredImage?.alt ?? p.title,
    price: formatCurrency(price),
    stock,
    variantCount: variants.length,
    status: stock === 0 && uiStatus === "published" ? "out_of_stock" : uiStatus,
    apiStatus,
    categoryName: p.category?.name ?? "—",
    categoryId: p.categoryId ?? p.category?.id ?? "",
    collection: p.collection ?? "—",
    shape: va.shape,
    material: va.material,
    weavingType: va.weavingType,
    patternArt: va.patternArt,
    thickness: va.thickness,
    origin: va.origin,
    featured: p.isFeatured,
    updatedAt: formatDate(p.updatedAt),
  };
}

export function mapProductToDetail(p: ApiProduct): DashboardProduct {
  const apiVariants = p.variants ?? [];
  const variant = pickPrimaryVariant(apiVariants);
  const featuredImage = p.images?.find((i) => i.isFeatured) ?? p.images?.[0];
  const stock = apiVariants.reduce((s, v) => s + v.stock, 0);
  const primaryAttrs = attrs(variant, p.origin);
  const hasExplicitPrimary = apiVariants.some(
    (v) => v.attributes?.isPrimary === "true" || v.attributes?.isPrimary === "1",
  );

  const variants: ProductVariant[] = apiVariants.map((v, index) => {
    const va = attrs(v, p.origin);
    return {
      id: v.id,
      shape: va.shape,
      size: va.size,
      material: va.material,
      color: va.color,
      weavingType: va.weavingType,
      patternArt: va.patternArt,
      thickness: va.thickness,
      origin: va.origin,
      price: String(v.price),
      salePrice: v.salePrice ? String(v.salePrice) : "",
      stock: v.stock,
      sku: v.sku,
      images: parseVariantImages(v.thumbnail, v.attributes),
      isPrimary: hasExplicitPrimary ? va.isPrimary : index === 0,
    };
  });

  const design = parseDesignPayload(p.careInstructions);

  return {
    id: p.id,
    name: p.shortDescription?.trim() || p.title,
    title: p.title,
    slug: p.slug,
    shortDescription: p.shortDescription ?? "",
    detailedDescription: p.description ?? "",
    seoDescription: p.seo?.seoDescription ?? "",
    imageSrc: imageUrl(featuredImage?.path ?? variant?.thumbnail),
    imageAlt: featuredImage?.alt ?? p.title,
    collection: p.collection ?? "",
    categoryId: p.categoryId ?? p.category?.id ?? "",
    weavingType: primaryAttrs.weavingType,
    material: primaryAttrs.material,
    patternArt: primaryAttrs.patternArt,
    thickness: primaryAttrs.thickness,
    shape: primaryAttrs.shape,
    featureList: design.items,
    designTitle: design.title,
    designDescription: design.description,
    designStyle: design.designStyle,
    decorStyle: design.decorStyle,
    origin: p.origin ?? primaryAttrs.origin ?? "India",
    photoShootingCondition: design.photoShootingCondition,
    usages: design.usages,
    note: design.note,
    basePrice: variant ? String(variant.price) : "",
    salePrice: variant?.salePrice ? String(variant.salePrice) : "",
    wholesalePrice: "",
    tax: design.tax || "GST 12%",
    sku: variant?.sku ?? p.skuPrefix ?? "",
    barcode: "",
    hsn: design.hsn,
    quantity: stock,
    lowStockAlert: 5,
    variants,
    status: (stock === 0 && p.status === "PUBLISHED" ? "out_of_stock" : mapStatusToUi(p.status)) as DashboardProduct["status"],
    availability: stock > 0 ? "in_stock" : "out_of_stock",
    featured: p.isFeatured,
    updatedAt: formatDate(p.updatedAt),
  };
}

export function mapProductFormToApi(form: DashboardProduct) {
  const description = form.detailedDescription.trim();
  const hasPrimary = form.variants.some((v) => v.isPrimary);
  const ordered = [...form.variants].sort((a, b) => {
    const aPrimary = a.isPrimary || (!hasPrimary && form.variants[0]?.id === a.id);
    const bPrimary = b.isPrimary || (!hasPrimary && form.variants[0]?.id === b.id);
    if (aPrimary === bPrimary) return 0;
    return aPrimary ? -1 : 1;
  });

  const variants = ordered.map((v, i) => {
    const isPrimary = hasPrimary ? v.isPrimary : i === 0;
    const imagePaths = v.images.map((src) => src.trim()).filter(Boolean);
    return {
      sku: v.sku || `${form.sku || "SKU"}-${String(i + 1).padStart(3, "0")}`,
      price: parseFloat(v.price || form.basePrice) || 1,
      salePrice: v.salePrice ? parseFloat(v.salePrice) : null,
      stock: v.stock,
      thumbnail: imagePaths[0] || undefined,
      attributes: {
        shape: form.shape,
        size: v.size,
        color: v.color,
        origin: form.origin,
        material: form.material,
        technique: form.weavingType,
        style: form.patternArt,
        thickness: form.thickness,
        isPrimary: isPrimary ? "true" : "false",
        images: JSON.stringify(imagePaths),
      },
    };
  });

  return {
    title: form.title.trim() || form.name,
    slug: form.slug || undefined,
    skuPrefix: form.sku || undefined,
    shortDescription: form.name.trim() || description.slice(0, 200) || undefined,
    description: description || undefined,
    categoryId: form.categoryId || null,
    collection: form.collection || undefined,
    origin: form.origin.trim() || undefined,
    careInstructions: serializeDesignPayload({
      title: form.designTitle,
      description: form.designDescription,
      items: form.featureList,
      designStyle: form.designStyle,
      decorStyle: form.decorStyle,
      photoShootingCondition: form.photoShootingCondition,
      usages: form.usages,
      note: form.note,
      hsn: form.hsn,
      tax: form.tax,
    }),
    isFeatured: form.featured,
    status: mapStatusToApi(form.status),
    variants,
  };
}
