"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { ImageUploadField } from "@/components/dashboard/ImageUploadField";
import type {
  ApiCollection,
  CollectionFormPayload,
  CollectionStatus,
} from "@/lib/api/collections";

export type CollectionFormValues = {
  title: string;
  slug: string;
  description: string;
  image: string;
  sortOrder: number;
  status: CollectionStatus;
};

type CollectionFormModalProps = {
  open: boolean;
  mode: "create" | "edit";
  collection?: ApiCollection | null;
  loading?: boolean;
  error?: string;
  onClose: () => void;
  onSubmit: (values: CollectionFormPayload) => void;
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

function emptyValues(): CollectionFormValues {
  return {
    title: "",
    slug: "",
    description: "",
    image: "",
    sortOrder: 0,
    status: "ACTIVE",
  };
}

function fromCollection(collection: ApiCollection): CollectionFormValues {
  return {
    title: collection.title,
    slug: collection.slug,
    description: collection.description ?? "",
    image: collection.image ?? "",
    sortOrder: collection.sortOrder,
    status: collection.status ?? "ACTIVE",
  };
}

export function CollectionFormModal({
  open,
  mode,
  collection,
  loading = false,
  error,
  onClose,
  onSubmit,
}: CollectionFormModalProps) {
  const [values, setValues] = useState<CollectionFormValues>(emptyValues());
  const [slugTouched, setSlugTouched] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageCleared, setImageCleared] = useState(false);
  const [initialImage, setInitialImage] = useState("");

  useEffect(() => {
    if (!open) return;
    if (mode === "edit" && collection) {
      const next = fromCollection(collection);
      setValues(next);
      setInitialImage(next.image);
      setSlugTouched(true);
    } else {
      setValues(emptyValues());
      setInitialImage("");
      setSlugTouched(false);
    }
    setImageCleared(false);
    setImageUploading(false);
  }, [open, mode, collection]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading && !imageUploading) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, loading, imageUploading, onClose]);

  const setField = useCallback(
    <K extends keyof CollectionFormValues>(key: K, value: CollectionFormValues[K]) => {
      setValues((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const onTitleChange = (title: string) => {
    setField("title", title);
    if (!slugTouched) setField("slug", slugify(title));
  };

  const onImageChange = (image: string) => {
    setField("image", image);
    setImageCleared(!image.trim());
  };

  function buildPayload(): CollectionFormPayload {
    const payload: CollectionFormPayload = {
      title: values.title.trim(),
      slug: values.slug.trim() || undefined,
      description: values.description.trim() || undefined,
      sortOrder: values.sortOrder,
      status: values.status,
    };

    const nextImage = values.image.trim();

    if (nextImage) {
      // Always send the latest image URL (new upload or unchanged)
      payload.image = nextImage;
    } else if (mode === "create" || imageCleared) {
      payload.image = null;
    }
    // On edit, if image was not changed/cleared, omit the field so we don't wipe it

    return payload;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!values.title.trim() || imageUploading || loading) return;
    onSubmit(buildPayload());
  }

  if (!open) return null;

  const canSubmit = Boolean(values.title.trim()) && !loading && !imageUploading;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal>
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="Close"
        onClick={() => {
          if (!loading && !imageUploading) onClose();
        }}
      />
      <div className="relative z-10 w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-neutral-900">
          {mode === "create" ? "Add collection" : "Edit collection"}
        </h2>
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <ImageUploadField
            key={`${collection?.id ?? "new"}-${open ? "open" : "closed"}-${initialImage}`}
            label="Image"
            value={values.image}
            folder="collections"
            onChange={onImageChange}
            onUploadingChange={setImageUploading}
            disabled={loading}
            hint="Upload completes to Cloudinary. Wait until it finishes, then save."
          />
          <label className="block">
            <span className={labelClass}>Title</span>
            <input
              required
              value={values.title}
              onChange={(e) => onTitleChange(e.target.value)}
              className={inputClass}
              disabled={loading || imageUploading}
              placeholder="e.g. Dreamers"
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
              disabled={loading || imageUploading}
              pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
              title="Lowercase letters, numbers, and hyphens only"
            />
          </label>
          <label className="block">
            <span className={labelClass}>Description</span>
            <textarea
              rows={4}
              value={values.description}
              onChange={(e) => setField("description", e.target.value)}
              className={inputClass}
              disabled={loading || imageUploading}
              placeholder="Short description of this collection…"
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className={labelClass}>Sort order</span>
              <input
                type="number"
                value={values.sortOrder}
                onChange={(e) => setField("sortOrder", Number(e.target.value) || 0)}
                className={inputClass}
                disabled={loading || imageUploading}
              />
            </label>
            <label className="block">
              <span className={labelClass}>Status</span>
              <select
                value={values.status}
                onChange={(e) => setField("status", e.target.value as CollectionStatus)}
                className={inputClass}
                disabled={loading || imageUploading}
              >
                <option value="ACTIVE">Active</option>
                <option value="DRAFT">Draft</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </label>
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading || imageUploading}
              className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className="rounded-lg bg-rc-navy px-4 py-2 text-sm font-semibold text-white hover:bg-rc-navy-dark disabled:opacity-50"
            >
              {imageUploading
                ? "Uploading…"
                : loading
                  ? "Saving…"
                  : mode === "create"
                    ? "Create"
                    : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
