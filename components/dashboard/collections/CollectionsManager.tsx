"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { CollectionFormModal } from "@/components/dashboard/collections/CollectionFormModal";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import {
  DashboardTable,
  DashboardTableHead,
  PrimaryButton,
  SecondaryButton,
} from "@/components/dashboard/DashboardTable";
import {
  createCollectionClient,
  deleteCollectionClient,
  fetchCollectionsClient,
  updateCollectionClient,
  type ApiCollection,
  type CollectionFormPayload,
} from "@/lib/api/collections";
import { imageUrl, mapStatusToUi } from "@/lib/api/mappers";

type CollectionsManagerProps = {
  initialCollections: ApiCollection[];
};

type ModalState =
  | { type: "closed" }
  | { type: "create" }
  | { type: "edit"; collection: ApiCollection };

type DeleteState =
  | { type: "closed" }
  | { type: "confirm"; collection: ApiCollection };

export function CollectionsManager({ initialCollections }: CollectionsManagerProps) {
  const router = useRouter();
  const [collections, setCollections] = useState(initialCollections);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<ModalState>({ type: "closed" });
  const [deleteState, setDeleteState] = useState<DeleteState>({ type: "closed" });
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  const loadCollections = useCallback(async (query: string) => {
    setLoading(true);
    try {
      const { items } = await fetchCollectionsClient({ search: query || undefined });
      setCollections(items);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCollections(debouncedSearch);
  }, [debouncedSearch, loadCollections]);

  async function handleFormSubmit(payload: CollectionFormPayload) {
    setFormError("");
    setSubmitting(true);
    try {
      if (modal.type === "create") {
        await createCollectionClient(payload);
      } else if (modal.type === "edit") {
        await updateCollectionClient(modal.collection.id, payload);
      }
      setModal({ type: "closed" });
      await loadCollections(debouncedSearch);
      router.refresh();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to save collection");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteConfirm() {
    if (deleteState.type !== "confirm") return;
    setDeleting(true);
    try {
      await deleteCollectionClient(deleteState.collection.id);
      setDeleteState({ type: "closed" });
      await loadCollections(debouncedSearch);
      router.refresh();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to delete collection");
      setDeleteState({ type: "closed" });
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Collections"
        description="Create collections with a title, description, and image. They appear in the product form collection dropdown."
        actions={
          <PrimaryButton
            onClick={() => {
              setFormError("");
              setModal({ type: "create" });
            }}
          >
            Add collection
          </PrimaryButton>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search collections…"
          className="w-full max-w-sm rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm outline-none focus:border-rc-accent focus:ring-1 focus:ring-rc-accent"
          aria-label="Search collections"
        />
        {loading ? <span className="text-sm text-neutral-500">Searching…</span> : null}
      </div>

      {formError && modal.type === "closed" && deleteState.type === "closed" ? (
        <p className="text-sm text-red-600">{formError}</p>
      ) : null}

      <DashboardTable>
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <DashboardTableHead
            columns={["", "Title", "Slug", "Products", "Status", "Actions"]}
          />
          <tbody className="divide-y divide-neutral-100">
            {collections.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-neutral-500">
                  {debouncedSearch
                    ? "No collections match your search."
                    : "No collections yet. Add one to populate the product dropdown."}
                </td>
              </tr>
            ) : (
              collections.map((item) => (
                <tr key={item.id} className="text-neutral-800">
                  <td className="px-4 py-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-md border border-neutral-200 bg-neutral-50">
                      {item.image ? (
                        <Image
                          src={imageUrl(item.image)}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center text-[10px] text-neutral-400">
                          —
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-neutral-900">{item.title}</p>
                    {item.description ? (
                      <p className="mt-0.5 line-clamp-1 text-xs text-neutral-500">
                        {item.description}
                      </p>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-neutral-500">{item.slug}</td>
                  <td className="px-4 py-3">{item._count?.products ?? 0}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={mapStatusToUi(item.status)} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <SecondaryButton
                        onClick={() => {
                          setFormError("");
                          setModal({ type: "edit", collection: item });
                        }}
                      >
                        Edit
                      </SecondaryButton>
                      <SecondaryButton
                        onClick={() => setDeleteState({ type: "confirm", collection: item })}
                      >
                        Delete
                      </SecondaryButton>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </DashboardTable>

      <CollectionFormModal
        open={modal.type !== "closed"}
        mode={modal.type === "edit" ? "edit" : "create"}
        collection={modal.type === "edit" ? modal.collection : null}
        loading={submitting}
        error={modal.type !== "closed" ? formError : undefined}
        onClose={() => {
          if (!submitting) {
            setModal({ type: "closed" });
            setFormError("");
          }
        }}
        onSubmit={handleFormSubmit}
      />

      <ConfirmDialog
        open={deleteState.type === "confirm"}
        title="Delete collection?"
        description={
          deleteState.type === "confirm" ? (
            <>
              Remove <strong>{deleteState.collection.title}</strong>? Products already using this
              collection label will keep the text value, but it will no longer appear in the
              dropdown.
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
