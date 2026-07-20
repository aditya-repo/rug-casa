"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, type ChangeEvent, type ReactNode } from "react";
import {
  ColorMultiSearchSelect,
  ColorSearchSelect,
  type ColorOption,
} from "@/components/dashboard/products/ColorSearchSelect";
import {
  composeSizeLabel,
  type ProductVariant,
} from "@/lib/dashboard/products";
import { formatCsvOptions, parseCsvOptions } from "@/components/dashboard/products/CheckboxMultiSelect";
import { imageUrl } from "@/lib/api/mappers";
import { uploadMediaClient } from "@/lib/api/media";

const inputClass =
  "mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm outline-none transition-colors focus:border-rc-accent focus:ring-1 focus:ring-rc-accent";

const labelClass = "text-xs font-semibold uppercase tracking-wide text-neutral-500";

function ColourGalleryLink() {
  return (
    <Link
      href="/dashboard/colors"
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-rc-accent hover:underline"
    >
      Colour gallery
    </Link>
  );
}

function VariantField({
  label,
  hint,
  children,
  className = "",
}: {
  label: string;
  hint?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`block ${className}`}>
      <span className={labelClass}>{label}</span>
      <span className="mt-0.5 block min-h-[16px] text-[11px] font-normal normal-case text-neutral-400">
        {hint ?? "\u00A0"}
      </span>
      {children}
    </div>
  );
}

type ProductVariantFieldsProps = {
  variant: ProductVariant;
  index: number;
  colorOptions: ColorOption[];
  onChange: (patch: Partial<ProductVariant>) => void;
  onSetPrimary: () => void;
  onRemove: () => void;
  canRemove: boolean;
};

export function ProductVariantFields({
  variant,
  index,
  colorOptions,
  onChange,
  onSetPrimary,
  onRemove,
  canRemove,
}: ProductVariantFieldsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const sizeLabel =
    composeSizeLabel(variant.length, variant.width) || variant.size;
  const otherColors = parseCsvOptions(variant.otherColors);

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

  const updateDimensions = (patch: { length?: string; width?: string }) => {
    const length = patch.length ?? variant.length;
    const width = patch.width ?? variant.width;
    onChange({
      length,
      width,
      size: composeSizeLabel(length, width),
    });
  };

  const setPrimaryColor = (color: string) => {
    const nextOther = otherColors.filter(
      (name) => name.toLowerCase() !== color.trim().toLowerCase(),
    );
    onChange({
      color,
      otherColors: formatCsvOptions(nextOther),
    });
  };

  const variantTitle =
    sizeLabel || variant.sku
      ? [sizeLabel, variant.sku].filter(Boolean).join(" · ")
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

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-12">
        <VariantField label="Length" hint="Feet (e.g. 5)" className="lg:col-span-1">
          <input
            required
            type="number"
            min={0}
            step="0.1"
            inputMode="decimal"
            placeholder="5"
            value={variant.length}
            onChange={(e) => updateDimensions({ length: e.target.value })}
            className={inputClass}
          />
        </VariantField>

        <VariantField label="Width" hint="Feet (e.g. 7)" className="lg:col-span-1">
          <input
            required
            type="number"
            min={0}
            step="0.1"
            inputMode="decimal"
            placeholder="7"
            value={variant.width}
            onChange={(e) => updateDimensions({ width: e.target.value })}
            className={inputClass}
          />
        </VariantField>

        <VariantField
          label="Primary colour"
          hint={
            <>
              Search & select one · <ColourGalleryLink />
            </>
          }
          className="sm:col-span-2 lg:col-span-2"
        >
          <ColorSearchSelect
            options={colorOptions}
            value={variant.color}
            onChange={setPrimaryColor}
            placeholder="Search primary colour…"
            required
          />
        </VariantField>

        <VariantField
          label="Other colours"
          hint={
            <>
              Optional multi-select · <ColourGalleryLink />
            </>
          }
          className="sm:col-span-2 lg:col-span-2"
        >
          <ColorMultiSearchSelect
            options={colorOptions}
            value={otherColors}
            exclude={variant.color ? [variant.color] : []}
            onChange={(names) => onChange({ otherColors: formatCsvOptions(names) })}
            placeholder="Search & select other colours…"
          />
        </VariantField>

        <VariantField label="Price" hint="Base price in ₹" className="lg:col-span-2">
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

        <VariantField label="Sale price" hint="Optional discount price" className="lg:col-span-2">
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

        <VariantField label="SKU" hint="Unique variant code" className="lg:col-span-2">
          <input
            required
            placeholder="HR001"
            value={variant.sku}
            onChange={(e) => onChange({ sku: e.target.value.toUpperCase() })}
            className={inputClass}
          />
        </VariantField>

        <VariantField label="Images" hint="Upload one or more" className="sm:col-span-2 lg:col-span-4">
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
                    alt={sizeLabel || `Variant image ${imageIndex + 1}`}
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

      {sizeLabel ? (
        <p className="mt-3 text-xs text-neutral-500">
          Size label: <span className="font-medium text-neutral-800">{sizeLabel} ft</span>
        </p>
      ) : null}
    </div>
  );
}
