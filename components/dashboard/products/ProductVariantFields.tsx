"use client";

import Image from "next/image";
import { useRef, useState, type ChangeEvent, type ReactNode } from "react";
import type { ProductVariant } from "@/lib/dashboard/products";
import {
  PRODUCT_COLORS,
  PRODUCT_SIZES,
} from "@/lib/dashboard/product-options";
import { imageUrl } from "@/lib/api/mappers";
import { uploadMediaClient } from "@/lib/api/media";

const inputClass =
  "mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm outline-none transition-colors focus:border-rc-accent focus:ring-1 focus:ring-rc-accent";

const labelClass = "text-xs font-semibold uppercase tracking-wide text-neutral-500";

function VariantField({
  label,
  hint,
  children,
  className = "",
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className={labelClass}>{label}</span>
      <span className="mt-0.5 block min-h-[16px] text-[11px] font-normal normal-case text-neutral-400">
        {hint ?? "\u00A0"}
      </span>
      {children}
    </label>
  );
}

function VariantCombobox({
  listId,
  value,
  options,
  placeholder,
  onChange,
  required,
}: {
  listId: string;
  value: string;
  options: readonly string[];
  placeholder?: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <>
      <input
        list={listId}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
      />
      <datalist id={listId}>
        {options.map((option) => (
          <option key={option} value={option} />
        ))}
      </datalist>
    </>
  );
}

type ProductVariantFieldsProps = {
  variant: ProductVariant;
  index: number;
  onChange: (patch: Partial<ProductVariant>) => void;
  onSetPrimary: () => void;
  onRemove: () => void;
  canRemove: boolean;
};

export function ProductVariantFields({
  variant,
  index,
  onChange,
  onSetPrimary,
  onRemove,
  canRemove,
}: ProductVariantFieldsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fieldId = (key: string) => `variant-${variant.id}-${key}`;

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length === 0) return;

    setUploadError("");
    setUploading(true);
    try {
      const uploaded = await uploadMediaClient("products", files);
      const paths = uploaded.map((item) => item.relativePath).filter(Boolean);
      if (paths.length === 0) {
        setUploadError("No images were uploaded");
        return;
      }
      onChange({ images: [...variant.images, ...paths] });
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Failed to upload images");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (imageIndex: number) => {
    onChange({ images: variant.images.filter((_, i) => i !== imageIndex) });
  };

  const variantTitle =
    variant.size || variant.sku
      ? [variant.size, variant.sku].filter(Boolean).join(" · ")
      : `Variant ${index + 1}`;

  return (
    <div
      className={`rounded-lg border bg-neutral-50/60 p-4 ${
        variant.isPrimary ? "border-rc-navy/40 ring-1 ring-rc-navy/20" : "border-neutral-200"
      }`}
    >
      <div className="mb-4 flex items-center justify-between gap-2 border-b border-neutral-200 pb-3">
        <div className="flex min-w-0 flex-wrap items-center gap-3">
          <p className="text-sm font-semibold text-neutral-900">{variantTitle}</p>
          <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-neutral-700">
            <input
              type="checkbox"
              checked={variant.isPrimary}
              onChange={(e) => {
                if (e.target.checked) onSetPrimary();
              }}
              className="rounded border-neutral-300 text-rc-accent focus:ring-rc-accent"
            />
            <span className="font-medium">
              {variant.isPrimary ? "Primary variant" : "Set as primary"}
            </span>
          </label>
        </div>
        {canRemove ? (
          <button
            type="button"
            onClick={onRemove}
            className="shrink-0 text-xs font-semibold text-red-600 hover:underline"
          >
            Remove
          </button>
        ) : null}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <VariantField label="Size" hint="Select or type custom">
          <VariantCombobox
            listId={fieldId("size")}
            value={variant.size}
            options={PRODUCT_SIZES}
            placeholder="e.g. 5x7"
            onChange={(size) => onChange({ size })}
            required
          />
        </VariantField>

        <VariantField label="Color" hint="Select or type custom">
          <VariantCombobox
            listId={fieldId("color")}
            value={variant.color}
            options={PRODUCT_COLORS}
            placeholder="e.g. Beige"
            onChange={(color) => onChange({ color })}
          />
        </VariantField>

        <VariantField label="Price" hint="Base price in ₹">
          <input
            required
            type="number"
            min={0}
            step="1"
            placeholder="18000"
            value={variant.price}
            onChange={(e) => onChange({ price: e.target.value })}
            className={inputClass}
          />
        </VariantField>

        <VariantField label="Sale price" hint="Optional discount price">
          <input
            type="number"
            min={0}
            step="1"
            placeholder="16500"
            value={variant.salePrice}
            onChange={(e) => onChange({ salePrice: e.target.value })}
            className={inputClass}
          />
        </VariantField>

        <VariantField label="SKU" hint="Unique variant code">
          <input
            required
            placeholder="HR001"
            value={variant.sku}
            onChange={(e) => onChange({ sku: e.target.value.toUpperCase() })}
            className={inputClass}
          />
        </VariantField>

        <VariantField label="Images" hint="Upload one or more" className="sm:col-span-2 lg:col-span-1">
          <div className="mt-1 flex min-h-[42px] flex-wrap items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              disabled={uploading}
              onChange={handleImageUpload}
            />
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="rounded-lg border border-dashed border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:border-rc-accent hover:bg-blue-50/50 disabled:opacity-50"
            >
              {uploading ? "Uploading…" : "Upload"}
            </button>
            {variant.images.map((src, imageIndex) => {
              const displaySrc = imageUrl(src) || src;
              return (
                <div
                  key={`${src}-${imageIndex}`}
                  className="group relative h-10 w-10 overflow-hidden rounded-md border border-neutral-200 bg-white"
                >
                  <Image
                    src={displaySrc}
                    alt={variant.size || `Variant image ${imageIndex + 1}`}
                    fill
                    className="object-cover"
                    sizes="40px"
                    unoptimized={displaySrc.startsWith("blob:")}
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(imageIndex)}
                    className="absolute inset-0 flex items-center justify-center bg-black/50 text-[10px] font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100"
                    aria-label={`Remove image ${imageIndex + 1}`}
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
          {uploadError ? <p className="mt-1 text-xs text-red-600">{uploadError}</p> : null}
        </VariantField>
      </div>
    </div>
  );
}
