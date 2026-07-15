"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { ImageUploadField } from "@/components/dashboard/ImageUploadField";
import { PrimaryButton, SecondaryButton } from "@/components/dashboard/DashboardTable";
import {
  createBannerClient,
  deleteBannerClient,
  MAX_HOMEPAGE_BANNERS,
  updateBannerClient,
  type ApiBanner,
  type BannerFormPayload,
} from "@/lib/api/banners";

type BannersManagerProps = {
  initialBanners: ApiBanner[];
};

type BannerDraft = {
  title: string;
  image: string;
  buttonText: string;
  buttonUrl: string;
};

type DeleteState = { type: "closed" } | { type: "confirm"; banner: ApiBanner };

const emptyDraft = (): BannerDraft => ({
  title: "",
  image: "",
  buttonText: "Explore More",
  buttonUrl: "/shop",
});

const inputClass =
  "mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm outline-none focus:border-rc-accent focus:ring-1 focus:ring-rc-accent";

const labelClass = "text-xs font-semibold uppercase tracking-wide text-neutral-500";

function BannerEditor({
  draft,
  onChange,
  onSave,
  onCancel,
  saveLabel,
  saving,
  error,
}: {
  draft: BannerDraft;
  onChange: (patch: Partial<BannerDraft>) => void;
  onSave: () => void;
  onCancel?: () => void;
  saveLabel: string;
  saving: boolean;
  error?: string;
}) {
  return (
    <div className="space-y-4">
      <ImageUploadField
        label="Banner image"
        value={draft.image}
        folder="banners"
        onChange={(image) => onChange({ image })}
        disabled={saving}
        hint="Recommended wide landscape image (approx. 1600×900)."
      />
      <label className="block">
        <span className={labelClass}>Title</span>
        <input
          required
          value={draft.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="Rugs Bhadohi x Artist Collection"
          className={inputClass}
          disabled={saving}
        />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className={labelClass}>Button label</span>
          <input
            value={draft.buttonText}
            onChange={(e) => onChange({ buttonText: e.target.value })}
            placeholder="Explore More"
            className={inputClass}
            disabled={saving}
          />
        </label>
        <label className="block">
          <span className={labelClass}>Button link</span>
          <input
            value={draft.buttonUrl}
            onChange={(e) => onChange({ buttonUrl: e.target.value })}
            placeholder="/shop"
            className={inputClass}
            disabled={saving}
          />
        </label>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <div className="flex flex-wrap gap-2">
        <PrimaryButton onClick={onSave} disabled={saving || !draft.image || !draft.title.trim()}>
          {saving ? "Saving…" : saveLabel}
        </PrimaryButton>
        {onCancel ? (
          <SecondaryButton onClick={onCancel} disabled={saving}>
            Cancel
          </SecondaryButton>
        ) : null}
      </div>
    </div>
  );
}

export function BannersManager({ initialBanners }: BannersManagerProps) {
  const router = useRouter();
  const [banners, setBanners] = useState(
    [...initialBanners].sort((a, b) => a.sortOrder - b.sortOrder || a.createdAt.localeCompare(b.createdAt)),
  );
  const [edits, setEdits] = useState<Record<string, BannerDraft>>({});
  const [adding, setAdding] = useState(false);
  const [newDraft, setNewDraft] = useState<BannerDraft>(emptyDraft);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleteState, setDeleteState] = useState<DeleteState>({ type: "closed" });
  const [deleting, setDeleting] = useState(false);
  const [formError, setFormError] = useState("");

  const canAdd = banners.length < MAX_HOMEPAGE_BANNERS;

  function getEdit(banner: ApiBanner): BannerDraft {
    return (
      edits[banner.id] ?? {
        title: banner.title,
        image: banner.image,
        buttonText: banner.buttonText ?? "Shop Now",
        buttonUrl: banner.buttonUrl ?? banner.linkUrl ?? "/shop",
      }
    );
  }

  function setEdit(bannerId: string, patch: Partial<BannerDraft>) {
    setEdits((prev) => {
      const banner = banners.find((b) => b.id === bannerId);
      if (!banner) return prev;
      const base =
        prev[bannerId] ?? {
          title: banner.title,
          image: banner.image,
          buttonText: banner.buttonText ?? "Shop Now",
          buttonUrl: banner.buttonUrl ?? banner.linkUrl ?? "/shop",
        };
      return { ...prev, [bannerId]: { ...base, ...patch } };
    });
  }

  function toPayload(draft: BannerDraft, sortOrder: number): BannerFormPayload {
    const buttonUrl = draft.buttonUrl.trim() || "/shop";
    return {
      title: draft.title.trim(),
      image: draft.image,
      buttonText: draft.buttonText.trim() || "Explore More",
      buttonUrl,
      linkUrl: buttonUrl,
      sortOrder,
      status: "ENABLED",
      type: "HOMEPAGE",
    };
  }

  async function handleCreate() {
    setFormError("");
    setCreating(true);
    try {
      const created = await createBannerClient(toPayload(newDraft, banners.length));
      setBanners((prev) => [...prev, created].sort((a, b) => a.sortOrder - b.sortOrder));
      setAdding(false);
      setNewDraft(emptyDraft());
      router.refresh();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to create banner");
    } finally {
      setCreating(false);
    }
  }

  async function handleUpdate(banner: ApiBanner) {
    setFormError("");
    setSavingId(banner.id);
    try {
      const draft = getEdit(banner);
      const updated = await updateBannerClient(banner.id, toPayload(draft, banner.sortOrder));
      setBanners((prev) => prev.map((b) => (b.id === banner.id ? updated : b)));
      setEdits((prev) => {
        const next = { ...prev };
        delete next[banner.id];
        return next;
      });
      router.refresh();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to update banner");
    } finally {
      setSavingId(null);
    }
  }

  async function handleDeleteConfirm() {
    if (deleteState.type !== "confirm") return;
    setDeleting(true);
    try {
      await deleteBannerClient(deleteState.banner.id);
      setBanners((prev) => prev.filter((b) => b.id !== deleteState.banner.id));
      setDeleteState({ type: "closed" });
      router.refresh();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to delete banner");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Homepage banners"
        description={`Upload up to ${MAX_HOMEPAGE_BANNERS} hero banners. Each can include a title, button label, and link shown on the left of the image.`}
        actions={
          canAdd && !adding ? (
            <PrimaryButton onClick={() => setAdding(true)}>Add banner</PrimaryButton>
          ) : null
        }
      />

      <p className="text-sm text-neutral-600">
        {banners.length} of {MAX_HOMEPAGE_BANNERS} banner slots used. Enabled banners appear on the
        storefront homepage in sort order.
      </p>

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {banners.map((banner, index) => (
          <section
            key={banner.id}
            className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm"
          >
            <div className="mb-4 flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-neutral-900">Banner {index + 1}</p>
              <button
                type="button"
                onClick={() => setDeleteState({ type: "confirm", banner })}
                className="text-xs font-semibold text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
            <BannerEditor
              draft={getEdit(banner)}
              onChange={(patch) => setEdit(banner.id, patch)}
              onSave={() => handleUpdate(banner)}
              saveLabel="Save changes"
              saving={savingId === banner.id}
              error={savingId === banner.id ? formError : undefined}
            />
          </section>
        ))}

        {adding ? (
          <section className="rounded-xl border border-dashed border-rc-accent/40 bg-blue-50/30 p-5 shadow-sm">
            <p className="mb-4 text-sm font-semibold text-neutral-900">New banner</p>
            <BannerEditor
              draft={newDraft}
              onChange={(patch) => setNewDraft((prev) => ({ ...prev, ...patch }))}
              onSave={handleCreate}
              onCancel={() => {
                setAdding(false);
                setNewDraft(emptyDraft());
                setFormError("");
              }}
              saveLabel="Create banner"
              saving={creating}
              error={formError}
            />
          </section>
        ) : null}
      </div>

      {banners.length === 0 && !adding ? (
        <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 px-6 py-12 text-center">
          <p className="text-sm font-medium text-neutral-700">No homepage banners yet</p>
          <p className="mt-1 text-sm text-neutral-500">
            Add up to {MAX_HOMEPAGE_BANNERS} images to replace the default hero carousel.
          </p>
          {canAdd ? (
            <PrimaryButton className="mt-4" onClick={() => setAdding(true)}>
              Add first banner
            </PrimaryButton>
          ) : null}
        </div>
      ) : null}

      <ConfirmDialog
        open={deleteState.type === "confirm"}
        title="Delete banner?"
        description={
          deleteState.type === "confirm" ? (
            <>
              Remove <strong>{deleteState.banner.title}</strong> from the homepage carousel? This
              cannot be undone.
            </>
          ) : null
        }
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteState({ type: "closed" })}
      />
    </div>
  );
}
