"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { CategoryFormModal } from "@/components/dashboard/categories/CategoryFormModal";
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
  createCategoryClient,
  deleteCategoryClient,
  fetchCategoriesClient,
  updateCategoryClient,
  type ApiCategory,
  type CategoryFormPayload,
} from "@/lib/api/categories";
import { imageUrl, mapStatusToUi } from "@/lib/api/mappers";

type CategoriesManagerProps = {
  initialCategories: ApiCategory[];
};

type ModalState =
  | { type: "closed" }
  | { type: "create" }
  | { type: "edit"; category: ApiCategory };

type DeleteState =
  | { type: "closed" }
  | { type: "confirm"; category: ApiCategory };

export function CategoriesManager({ initialCategories }: CategoriesManagerProps) {
  const router = useRouter();
  const [categories, setCategories] = useState(initialCategories);
  const [parentOptions, setParentOptions] = useState(initialCategories);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<ModalState>({ type: "closed" });
  const [deleteState, setDeleteState] = useState<DeleteState>({ type: "closed" });
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchCategoriesClient({ limit: 200 })
      .then(({ items }) => setParentOptions(items))
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  const loadCategories = useCallback(async (query: string) => {
    setLoading(true);
    try {
      const { items } = await fetchCategoriesClient({ search: query || undefined });
      setCategories(items);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories(debouncedSearch);
  }, [debouncedSearch, loadCategories]);

  async function handleFormSubmit(payload: CategoryFormPayload) {
    setFormError("");
    setSubmitting(true);
    try {
      if (modal.type === "create") {
        await createCategoryClient(payload);
      } else if (modal.type === "edit") {
        await updateCategoryClient(modal.category.id, payload);
      }
      setModal({ type: "closed" });
      await loadCategories(debouncedSearch);
      fetchCategoriesClient({ limit: 200 })
        .then(({ items }) => setParentOptions(items))
        .catch(() => undefined);
      router.refresh();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to save category");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteConfirm() {
    if (deleteState.type !== "confirm") return;
    setDeleting(true);
    try {
      await deleteCategoryClient(deleteState.category.id);
      setDeleteState({ type: "closed" });
      await loadCategories(debouncedSearch);
      fetchCategoriesClient({ limit: 200 })
        .then(({ items }) => setParentOptions(items))
        .catch(() => undefined);
      router.refresh();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to delete category");
      setDeleteState({ type: "closed" });
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Category management"
        description="Organize products with nested categories."
        actions={
          <PrimaryButton onClick={() => { setFormError(""); setModal({ type: "create" }); }}>
            Add category
          </PrimaryButton>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search categories…"
          className="w-full max-w-sm rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm outline-none focus:border-rc-accent focus:ring-1 focus:ring-rc-accent"
          aria-label="Search categories"
        />
        {loading ? <span className="text-sm text-neutral-500">Searching…</span> : null}
      </div>

      <DashboardTable>
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <DashboardTableHead columns={["", "Name", "Slug", "Products", "Status", "Actions"]} />
          <tbody className="divide-y divide-neutral-100">
            {categories.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-neutral-500">
                  {debouncedSearch ? "No categories match your search." : "No categories found."}
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat.id} className="text-neutral-800">
                  <td className="px-4 py-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-md border border-neutral-200 bg-neutral-50">
                      {cat.image ? (
                        <Image
                          src={imageUrl(cat.image)}
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
                  <td className="px-4 py-3 font-semibold text-neutral-900">{cat.name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-neutral-500">{cat.slug}</td>
                  <td className="px-4 py-3">{cat._count?.products ?? 0}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={mapStatusToUi(cat.status)} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <SecondaryButton
                        onClick={() => {
                          setFormError("");
                          setModal({ type: "edit", category: cat });
                        }}
                      >
                        Edit
                      </SecondaryButton>
                      <SecondaryButton
                        onClick={() => setDeleteState({ type: "confirm", category: cat })}
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

      <CategoryFormModal
        open={modal.type !== "closed"}
        mode={modal.type === "edit" ? "edit" : "create"}
        category={modal.type === "edit" ? modal.category : null}
        parentOptions={parentOptions}
        loading={submitting}
        error={formError}
        onClose={() => {
          if (!submitting) setModal({ type: "closed" });
        }}
        onSubmit={handleFormSubmit}
      />

      <ConfirmDialog
        open={deleteState.type === "confirm"}
        title="Delete category?"
        description={
          deleteState.type === "confirm" ? (
            <>
              <p>
                Are you sure you want to delete <strong>{deleteState.category.name}</strong>?
              </p>
              {(deleteState.category._count?.products ?? 0) > 0 ? (
                <p className="mt-2 text-amber-700">
                  This category has {deleteState.category._count?.products} product(s). Products will
                  remain but lose this category assignment.
                </p>
              ) : null}
              <p className="mt-2">This action cannot be undone.</p>
            </>
          ) : null
        }
        confirmLabel="Delete category"
        loading={deleting}
        onConfirm={handleDeleteConfirm}
        onClose={() => {
          if (!deleting) setDeleteState({ type: "closed" });
        }}
      />
    </div>
  );
}
