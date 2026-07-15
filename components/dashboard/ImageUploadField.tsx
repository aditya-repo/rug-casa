"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { imageUrl } from "@/lib/api/mappers";
import { uploadMediaClient, type UploadFolder } from "@/lib/api/media";

type ImageUploadFieldProps = {
  label: string;
  value: string;
  folder: UploadFolder;
  onChange: (relativePath: string) => void;
  onUploadingChange?: (uploading: boolean) => void;
  disabled?: boolean;
  hint?: string;
};

export function ImageUploadField({
  label,
  value,
  folder,
  onChange,
  onUploadingChange,
  disabled = false,
  hint,
}: ImageUploadFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Clear local preview when parent value changes (modal reopen / successful upload)
  useEffect(() => {
    setPreviewUrl(null);
    setError("");
  }, [value]);

  const displaySrc = previewUrl || (value ? imageUrl(value) : "");

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setError("");
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);
    setUploading(true);
    onUploadingChange?.(true);

    try {
      const uploaded = await uploadMediaClient(folder, file);
      const next = uploaded[0]?.path || uploaded[0]?.relativePath || "";
      if (!next) {
        throw new Error("Upload succeeded but no image URL was returned");
      }
      onChange(next);
      setPreviewUrl(null);
      URL.revokeObjectURL(localPreview);
    } catch (err) {
      URL.revokeObjectURL(localPreview);
      setPreviewUrl(null);
      setError(err instanceof Error ? err.message : "Failed to upload image");
    } finally {
      setUploading(false);
      onUploadingChange?.(false);
    }
  }

  function handleRemove() {
    setPreviewUrl(null);
    setError("");
    onChange("");
  }

  return (
    <div>
      <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">{label}</span>
      <div className="mt-1 flex flex-wrap items-start gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
          className="hidden"
          disabled={disabled || uploading}
          onChange={handleFileChange}
        />
        <button
          type="button"
          disabled={disabled || uploading}
          onClick={() => fileInputRef.current?.click()}
          className="rounded-lg border border-dashed border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:border-rc-accent hover:bg-blue-50/50 disabled:opacity-50"
        >
          {uploading ? "Uploading…" : value || previewUrl ? "Replace image" : "Upload image"}
        </button>
        {displaySrc ? (
          <div className="relative h-16 w-16 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50">
            <Image
              src={displaySrc}
              alt=""
              fill
              className="object-cover"
              sizes="64px"
              unoptimized={displaySrc.startsWith("blob:")}
            />
          </div>
        ) : null}
        {(value || previewUrl) && !uploading ? (
          <button
            type="button"
            disabled={disabled}
            onClick={handleRemove}
            className="text-sm font-medium text-red-600 hover:underline disabled:opacity-50"
          >
            Remove
          </button>
        ) : null}
      </div>
      {hint ? <p className="mt-1 text-xs text-neutral-500">{hint}</p> : null}
      {uploading ? (
        <p className="mt-1 text-xs text-neutral-500">Wait for upload to finish before saving.</p>
      ) : null}
      {error ? <p className="mt-1 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
