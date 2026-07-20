"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState, type FormEvent, type ReactNode } from "react";
import type { ApiCategory } from "@/lib/api/categories";
import type { ApiCollection } from "@/lib/api/collections";
import type { ApiColor } from "@/lib/api/colors";
import { createProductClient, updateProductClient } from "@/lib/api/products";
import type { DashboardProduct, ProductVariant } from "@/lib/dashboard/products";
import { ProductVariantFields } from "@/components/dashboard/products/ProductVariantFields";
import { mapApiColorsToOptions } from "@/components/dashboard/products/ColorSearchSelect";
import {
  CollectionMultiSelect,
  formatCollectionValue,
  parseCollectionValue,
} from "@/components/dashboard/products/CollectionMultiSelect";
import {
  CheckboxMultiSelect,
  formatCsvOptions,
  parseCsvOptions,
} from "@/components/dashboard/products/CheckboxMultiSelect";
import { createEmptyVariant } from "@/lib/dashboard/products";
import {
  PRODUCT_AVAILABILITY,
  PRODUCT_COLORS,
  PRODUCT_DECOR_STYLES,
  PRODUCT_DESIGN_STYLES,
  PRODUCT_EDITABLE_STATUSES,
  PRODUCT_MATERIALS,
  PRODUCT_ORIGINS,
  PRODUCT_PATTERN_ART,
  PRODUCT_SHAPES,
  PRODUCT_TECHNIQUES,
  PRODUCT_THICKNESS,
  TAX_OPTIONS,
  availabilityLabel,
  productStatusLabel,
} from "@/lib/dashboard/product-options";

type ProductFormProps = {
  product: DashboardProduct;
  mode: "create" | "edit";
  categories: ApiCategory[];
  collections: ApiCollection[];
  colors?: ApiColor[];
};

const inputClass =
  "mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm outline-none transition-colors focus:border-rc-accent focus:ring-1 focus:ring-rc-accent";

/** Keep an existing saved value selectable even if it is not in the static list. */
function withCurrentOption(
  options: readonly string[],
  current: string,
): string[] {
  const trimmed = current.trim();
  if (!trimmed || options.includes(trimmed)) return [...options];
  return [trimmed, ...options];
}

const labelClass = "text-xs font-semibold uppercase tracking-wide text-neutral-500";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-neutral-900">{title}</h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

export function ProductForm({
  product: initial,
  mode,
  categories,
  collections,
  colors = [],
}: ProductFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<DashboardProduct>(initial);
  const colorOptions = useMemo(() => {
    if (colors.length > 0) return mapApiColorsToOptions(colors);
    return PRODUCT_COLORS.map((name) => ({ name, hex: "" }));
  }, [colors]);
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [featureDraft, setFeatureDraft] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const setField = useCallback(
    <K extends keyof DashboardProduct>(key: K, value: DashboardProduct[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const updateVariant = useCallback(
    (id: string, patch: Partial<ProductVariant>) => {
      setForm((prev) => ({
        ...prev,
        variants: prev.variants.map((v) => (v.id === id ? { ...v, ...patch } : v)),
      }));
    },
    [],
  );

  const setPrimaryVariant = useCallback((id: string) => {
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.map((v) => ({
        ...v,
        isPrimary: v.id === id,
      })),
    }));
  }, []);

  const addVariant = useCallback(() => {
    setForm((prev) => {
      const next = {
        ...createEmptyVariant(),
        material: prev.material,
        weavingType: prev.weavingType,
        patternArt: prev.patternArt,
        thickness: prev.thickness,
        shape: prev.shape,
        isPrimary: prev.variants.length === 0,
      };
      return {
        ...prev,
        variants: [...prev.variants, next],
      };
    });
  }, []);

  const removeVariant = useCallback((id: string) => {
    setForm((prev) => {
      const remaining = prev.variants.filter((v) => v.id !== id);
      const hasPrimary = remaining.some((v) => v.isPrimary);
      return {
        ...prev,
        variants: hasPrimary
          ? remaining
          : remaining.map((v, index) => ({ ...v, isPrimary: index === 0 })),
      };
    });
  }, []);

  const onTitleChange = (title: string) => {
    setField("title", title);
    if (!slugTouched) {
      setField("slug", slugify(title));
    }
  };

  const addFeatureTag = () => {
    const value = featureDraft.trim();
    if (!value) return;
    if (form.featureList.some((item) => item.toLowerCase() === value.toLowerCase())) {
      setFeatureDraft("");
      return;
    }
    setField("featureList", [...form.featureList, value]);
    setFeatureDraft("");
  };

  const removeFeatureTag = (index: number) => {
    setField(
      "featureList",
      form.featureList.filter((_, i) => i !== index),
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (form.variants.length === 0) {
      setError("Add at least one variant with length, width, price, and SKU.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      if (mode === "create") {
        const created = await createProductClient(form);
        router.push(`/dashboard/products/${created.id}`);
      } else {
        await updateProductClient(form.id, form);
        router.push(`/dashboard/products/${form.id}`);
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save product");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Section title="Basic">
            <p className="-mt-2 text-sm text-neutral-500">
              Core listing details for the storefront — title, name, slug, category, and description.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className={labelClass}>Title</span>
                <input
                  required
                  value={form.title}
                  onChange={(e) => onTitleChange(e.target.value)}
                  className={inputClass}
                  placeholder="Product title shown on the storefront…"
                />
              </label>
              <label className="block">
                <span className={labelClass}>Name</span>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setField("name", e.target.value)}
                  className={inputClass}
                />
              </label>
              <label className="block">
                <span className={labelClass}>Slug</span>
                <input
                  required
                  value={form.slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    setField("slug", e.target.value);
                  }}
                  className={inputClass}
                  pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                  title="Lowercase letters, numbers, and hyphens only"
                />
              </label>
              <label className="block">
                <span className={labelClass}>Category</span>
                <select
                  value={form.categoryId}
                  onChange={(e) => setField("categoryId", e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>
              <div className="grid gap-4 sm:col-span-2 sm:grid-cols-2">
                <div className="block min-w-0">
                  <span className={labelClass}>Collection</span>
                  <CollectionMultiSelect
                    collections={collections}
                    value={parseCollectionValue(form.collection)}
                    onChange={(titles) => setField("collection", formatCollectionValue(titles))}
                  />
                </div>
                <label className="block min-w-0">
                  <span className={labelClass}>Featured</span>
                  <select
                    value={form.featured ? "yes" : "no"}
                    onChange={(e) => setField("featured", e.target.value === "yes")}
                    className={inputClass}
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                  <p className="mt-1 text-xs text-neutral-500">
                    Featured products can appear on the homepage (latest 8).
                  </p>
                </label>
              </div>
              <label className="block sm:col-span-2">
                <span className={labelClass}>Description</span>
                <textarea
                  required
                  rows={5}
                  value={form.detailedDescription}
                  onChange={(e) => setField("detailedDescription", e.target.value)}
                  className={inputClass}
                  placeholder="Product details shown on the storefront…"
                />
              </label>
            </div>
          </Section>
        </div>

        <Section title="Product type">
          <p className="-mt-2 text-sm text-neutral-500">
            Shared across all variants.
          </p>
          <label className="block">
            <span className={labelClass}>Shape</span>
            <select
              value={form.shape}
              onChange={(e) => setField("shape", e.target.value)}
              className={inputClass}
            >
              <option value="">Select shape</option>
              {withCurrentOption(PRODUCT_SHAPES, form.shape).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className={labelClass}>Weaving technique</span>
            <select
              value={form.weavingType}
              onChange={(e) => setField("weavingType", e.target.value)}
              className={inputClass}
            >
              <option value="">Select technique</option>
              {withCurrentOption(PRODUCT_TECHNIQUES, form.weavingType).map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <div className="block">
            <span className={labelClass}>Material</span>
            <CheckboxMultiSelect
              options={PRODUCT_MATERIALS}
              value={parseCsvOptions(form.material)}
              onChange={(materials) => setField("material", formatCsvOptions(materials))}
              placeholder="Select materials"
            />
          </div>
          <label className="block">
            <span className={labelClass}>Pattern</span>
            <select
              value={form.patternArt}
              onChange={(e) => setField("patternArt", e.target.value)}
              className={inputClass}
            >
              <option value="">Select pattern</option>
              {withCurrentOption(PRODUCT_PATTERN_ART, form.patternArt).map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className={labelClass}>Thickness</span>
            <select
              value={form.thickness}
              onChange={(e) => setField("thickness", e.target.value)}
              className={inputClass}
            >
              <option value="">Select thickness</option>
              {withCurrentOption(PRODUCT_THICKNESS, form.thickness).map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
        </Section>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Section title="Design">
          <label className="block">
            <span className={labelClass}>Title</span>
            <input
              value={form.designTitle}
              onChange={(e) => setField("designTitle", e.target.value)}
              className={inputClass}
              placeholder="Short design title or headline…"
            />
          </label>
          <label className="block">
            <span className={labelClass}>Description</span>
            <textarea
              rows={4}
              value={form.designDescription}
              onChange={(e) => setField("designDescription", e.target.value)}
              className={inputClass}
              placeholder="Design notes or supporting copy…"
            />
          </label>
          <label className="block">
            <span className={labelClass}>Style</span>
            <select
              value={form.designStyle}
              onChange={(e) => setField("designStyle", e.target.value)}
              className={inputClass}
            >
              <option value="">Select style</option>
              {PRODUCT_DESIGN_STYLES.map((style) => (
                <option key={style} value={style}>
                  {style}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className={labelClass}>Decor style</span>
            <select
              value={form.decorStyle}
              onChange={(e) => setField("decorStyle", e.target.value)}
              className={inputClass}
            >
              <option value="">Select decor style</option>
              {PRODUCT_DECOR_STYLES.map((style) => (
                <option key={style} value={style}>
                  {style}
                </option>
              ))}
            </select>
          </label>
          <div>
            <span className={labelClass}>Feature list</span>
            <div className="mt-1 flex gap-2">
              <input
                value={featureDraft}
                onChange={(e) => setFeatureDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addFeatureTag();
                  }
                }}
                className={inputClass + " mt-0"}
                placeholder="Add a list item…"
              />
              <button
                type="button"
                onClick={addFeatureTag}
                className="shrink-0 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-semibold text-rc-navy shadow-sm hover:bg-neutral-50"
              >
                Add
              </button>
            </div>
            {form.featureList.length > 0 ? (
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-neutral-800">
                {form.featureList.map((item, index) => (
                  <li key={`${item}-${index}`} className="marker:text-rc-navy">
                    <span className="inline-flex items-start gap-2">
                      <span>{item}</span>
                      <button
                        type="button"
                        onClick={() => removeFeatureTag(index)}
                        className="text-xs font-medium text-neutral-400 hover:text-red-600"
                        aria-label={`Remove ${item}`}
                      >
                        Remove
                      </button>
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-xs text-neutral-500">
                No list items yet. Add highlights shown as a bullet list on the storefront.
              </p>
            )}
          </div>
        </Section>

        <Section title="Inventory">
          <label className="block">
            <span className={labelClass}>SKU</span>
            <input
              required
              value={form.sku}
              onChange={(e) => setField("sku", e.target.value.toUpperCase())}
              className={inputClass}
              pattern="[A-Za-z0-9-]+"
            />
          </label>
          <label className="block">
            <span className={labelClass}>Status</span>
            <select
              value={form.status === "out_of_stock" ? "published" : form.status}
              onChange={(e) =>
                setField("status", e.target.value as DashboardProduct["status"])
              }
              className={inputClass}
            >
              {PRODUCT_EDITABLE_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {productStatusLabel(status)}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-neutral-500">
              Draft products stay hidden from the public shop.
            </p>
          </label>
          <label className="block">
            <span className={labelClass}>Stock quantity</span>
            <input
              type="number"
              min={0}
              value={form.quantity}
              onChange={(e) => setField("quantity", Number(e.target.value) || 0)}
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className={labelClass}>HSN number</span>
            <input
              value={form.hsn}
              onChange={(e) => setField("hsn", e.target.value)}
              className={inputClass}
              placeholder="e.g. 5701"
              inputMode="numeric"
            />
          </label>
          <label className="block">
            <span className={labelClass}>Tax</span>
            <select
              value={form.tax}
              onChange={(e) => setField("tax", e.target.value)}
              className={inputClass}
            >
              {TAX_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className={labelClass}>Availability</span>
            <select
              value={form.availability}
              onChange={(e) =>
                setField("availability", e.target.value as DashboardProduct["availability"])
              }
              className={inputClass}
            >
              {PRODUCT_AVAILABILITY.map((a) => (
                <option key={a} value={a}>
                  {availabilityLabel(a)}
                </option>
              ))}
            </select>
          </label>
        </Section>

        <Section title="Details">
          <p className="-mt-2 text-sm text-neutral-500">
            Origin, shooting notes, usages, and other product remarks.
          </p>
          <label className="block">
            <span className={labelClass}>Origin</span>
            <input
              list="product-origin"
              value={form.origin}
              onChange={(e) => setField("origin", e.target.value)}
              className={inputClass}
              placeholder="e.g. India"
            />
            <datalist id="product-origin">
              {PRODUCT_ORIGINS.map((o) => (
                <option key={o} value={o} />
              ))}
            </datalist>
          </label>
          <label className="block">
            <span className={labelClass}>Photo shooting condition</span>
            <textarea
              rows={3}
              value={form.photoShootingCondition}
              onChange={(e) => setField("photoShootingCondition", e.target.value)}
              className={inputClass}
              placeholder="Lighting, styling, or shoot conditions…"
            />
          </label>
          <label className="block">
            <span className={labelClass}>Usages</span>
            <textarea
              rows={3}
              value={form.usages}
              onChange={(e) => setField("usages", e.target.value)}
              className={inputClass}
              placeholder="Recommended rooms or use cases…"
            />
          </label>
          <label className="block">
            <span className={labelClass}>Note</span>
            <textarea
              rows={3}
              value={form.note}
              onChange={(e) => setField("note", e.target.value)}
              className={inputClass}
              placeholder="Internal or storefront notes…"
            />
          </label>
        </Section>
      </div>

      <Section title="Variants">
        <p className="-mt-2 text-sm text-neutral-500">
          Each variant is a sellable option — length, width, color, price, SKU, and image. Mark one as
          primary (defaults to the first). Product type attributes are set above.
        </p>

        {form.variants.length === 0 ? (
          <div className="rounded-lg border border-dashed border-neutral-300 bg-neutral-50/50 px-4 py-8 text-center">
            <p className="text-sm font-medium text-neutral-700">No variants yet</p>
            <p className="mt-1 text-xs text-neutral-500">
              Use Add Variant to define sizes with separate length and width (e.g. 5 × 7 ft).
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {form.variants.map((variant, index) => {
              const isPrimary =
                variant.isPrimary ||
                (!form.variants.some((v) => v.isPrimary) && index === 0);
              return (
                <ProductVariantFields
                  key={variant.id}
                  variant={{ ...variant, isPrimary }}
                  index={index}
                  colorOptions={colorOptions}
                  onChange={(patch) => updateVariant(variant.id, patch)}
                  onSetPrimary={() => setPrimaryVariant(variant.id)}
                  onRemove={() => removeVariant(variant.id)}
                  canRemove
                />
              );
            })}
          </div>
        )}

        <button
          type="button"
          onClick={addVariant}
          className="mt-4 inline-flex items-center gap-1 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-rc-navy shadow-sm transition-colors hover:bg-neutral-50"
        >
          + Add Variant
        </button>
      </Section>

      <div className="flex flex-wrap gap-3 border-t border-neutral-200 pt-4">
        {error ? <p className="w-full rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-rc-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-rc-navy-dark disabled:opacity-60"
        >
          {submitting ? "Saving…" : mode === "create" ? "Create product" : "Save changes"}
        </button>
        <Link
          href={
            mode === "create"
              ? "/dashboard/products"
              : `/dashboard/products/${form.id}`
          }
          className="rounded-lg border border-neutral-200 bg-white px-5 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
