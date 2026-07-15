"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { ImageUploadField } from "@/components/dashboard/ImageUploadField";
import type { ApiCategory, CategoryFormPayload, CategoryStatus } from "@/lib/api/categories";

export type CategoryFormValues = {
  name: string;
  slug: string;
  description: string;
  image: string;
  parentId: string;
  sortOrder: number;
  status: CategoryStatus;
  isFeatured: boolean;
};

type CategoryFormModalProps = {
  open: boolean;
  mode: "create" | "edit";
  category?: ApiCategory | null;
  parentOptions: ApiCategory[];
  loading?: boolean;
  error?: string;
  onClose: () => void;
  onSubmit: (values: CategoryFormPayload) => void;
};

const inputClass =
  "mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm outline-none focus:border-rc-accent focus:ring-1 focus:ring-rc-accent";

const labelClass = "text-xs font-semibold uppercase tracking-wide text-neutral-500";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function emptyValues(): CategoryFormValues {
  return {
    name: "",
    slug: "",
    description: "",
    image: "",
    parentId: "",
    sortOrder: 0,
    status: "ACTIVE",
    isFeatured: false,
  };
}

function fromCategory(category: ApiCategory): CategoryFormValues {
  return {
    name: category.name,
    slug: category.slug,
    description: category.description ?? "",
    image: category.image ?? "",
    parentId: category.parentId ?? "",
    sortOrder: category.sortOrder,
    status: category.status,
    isFeatured: category.isFeatured,
  };
}

function toPayload(values: CategoryFormValues): CategoryFormPayload {
  return {
    name: values.name.trim(),
    slug: values.slug.trim() || undefined,
    description: values.description.trim() || undefined,
    image: values.image.trim() || null,
    parentId: values.parentId || null,
    sortOrder: values.sortOrder,
    status: values.status,
    isFeatured: values.isFeatured,
  };
}

export function CategoryFormModal({
  open,
  mode,
  category,
  parentOptions,
  loading = false,
  error,
  onClose,
  onSubmit,
}: CategoryFormModalProps) {
  const [values, setValues] = useState<CategoryFormValues>(emptyValues());
  const [slugTouched, setSlugTouched] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (mode === "edit" && category) {
      setValues(fromCategory(category));
      setSlugTouched(true);
    } else {
      setValues(emptyValues());
      setSlugTouched(false);
    }
  }, [open, mode, category]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, loading, onClose]);

  const setField = useCallback(<K extends keyof CategoryFormValues>(key: K, value: CategoryFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  const onNameChange = (name: string) => {
    setField("name", name);
    if (!slugTouched) {
      setField("slug", slugify(name));
    }
  };

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit(toPayload(values));
  }

  if (!open) return null;

  const parentChoices = parentOptions.filter((c) => c.id !== category?.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="presentation">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label="Close modal"
        onClick={loading ? undefined : onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="category-modal-title"
        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-neutral-200 bg-white shadow-xl"
      >
        <form onSubmit={handleSubmit}>
          <div className="border-b border-neutral-200 px-6 py-4">
            <h2 id="category-modal-title" className="text-lg font-semibold text-neutral-900">
              {mode === "create" ? "Add category" : "Edit category"}
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              {mode === "create"
                ? "Create a new product category for your store."
                : "Update category details and visibility."}
            </p>
          </div>

          <div className="space-y-4 px-6 py-5">
            <label className="block">
              <span className={labelClass}>Name</span>
              <input
                required
                value={values.name}
                onChange={(e) => onNameChange(e.target.value)}
                className={inputClass}
                placeholder="Living Room"
              />
            </label>

            <label className="block">
              <span className={labelClass}>Slug</span>
              <input
                value={values.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setField("slug", e.target.value);
                }}
                className={inputClass}
                placeholder="living-room"
                pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                title="Lowercase letters, numbers, and hyphens only"
              />
            </label>

            <label className="block">
              <span className={labelClass}>Description</span>
              <textarea
                rows={3}
                value={values.description}
                onChange={(e) => setField("description", e.target.value)}
                className={inputClass}
                placeholder="Optional category description"
              />
            </label>

            <ImageUploadField
              label="Category image"
              value={values.image}
              folder="categories"
              disabled={loading}
              hint="Shown in category listings and navigation. JPG, PNG, or WebP."
              onChange={(path) => setField("image", path)}
              onUploadingChange={setImageUploading}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className={labelClass}>Parent category</span>
                <select
                  value={values.parentId}
                  onChange={(e) => setField("parentId", e.target.value)}
                  className={inputClass}
                >
                  <option value="">None (top level)</option>
                  {parentChoices.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className={labelClass}>Sort order</span>
                <input
                  type="number"
                  min={0}
                  value={values.sortOrder}
                  onChange={(e) => setField("sortOrder", Number(e.target.value) || 0)}
                  className={inputClass}
                />
              </label>
            </div>

            <label className="block">
              <span className={labelClass}>Status</span>
              <select
                value={values.status}
                onChange={(e) => setField("status", e.target.value as CategoryStatus)}
                className={inputClass}
              >
                <option value="ACTIVE">Active</option>
                <option value="DRAFT">Draft</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={values.isFeatured}
                onChange={(e) => setField("isFeatured", e.target.checked)}
                className="rounded border-neutral-300 text-rc-accent focus:ring-rc-accent"
              />
              <span className="font-medium text-neutral-800">Featured category</span>
            </label>

            {error ? (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
            ) : null}
          </div>

          <div className="flex justify-end gap-2 border-t border-neutral-200 px-6 py-4">
            <button
              type="button"
              disabled={loading}
              onClick={onClose}
              className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || imageUploading}
              className="rounded-lg bg-rc-navy px-4 py-2 text-sm font-semibold text-white hover:bg-rc-navy-dark disabled:opacity-50"
            >
              {loading ? "Saving…" : imageUploading ? "Uploading image…" : mode === "create" ? "Create category" : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
