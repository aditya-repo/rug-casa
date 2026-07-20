"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ColorFormModal } from "@/components/dashboard/colors/ColorFormModal";
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
  createColorClient,
  deleteColorClient,
  fetchColorsClient,
  updateColorClient,
  type ApiColor,
  type ColorFormPayload,
} from "@/lib/api/colors";
import { mapStatusToUi } from "@/lib/api/mappers";

type ColorsManagerProps = {
  initialColors: ApiColor[];
};

type ModalState =
  | { type: "closed" }
  | { type: "create" }
  | { type: "edit"; color: ApiColor };

type DeleteState =
  | { type: "closed" }
  | { type: "confirm"; color: ApiColor };

export function ColorsManager({ initialColors }: ColorsManagerProps) {
  const router = useRouter();
  const [colors, setColors] = useState(initialColors);
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

  const loadColors = useCallback(async (query: string) => {
    setLoading(true);
    try {
      const { items } = await fetchColorsClient({
        search: query || undefined,
        limit: 200,
      });
      setColors(items);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadColors(debouncedSearch);
  }, [debouncedSearch, loadColors]);

  async function handleFormSubmit(payload: ColorFormPayload) {
    setFormError("");
    setSubmitting(true);
    try {
      if (modal.type === "create") {
        await createColorClient(payload);
      } else if (modal.type === "edit") {
        await updateColorClient(modal.color.id, payload);
      }
      setModal({ type: "closed" });
      await loadColors(debouncedSearch);
      router.refresh();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to save colour");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteConfirm() {
    if (deleteState.type !== "confirm") return;
    setDeleting(true);
    try {
      await deleteColorClient(deleteState.color.id);
      setDeleteState({ type: "closed" });
      await loadColors(debouncedSearch);
      router.refresh();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to delete colour");
      setDeleteState({ type: "closed" });
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Colours"
        description="Master colour list with name and hex code. Used when assigning colours to product variants."
        actions={
          <PrimaryButton
            onClick={() => {
              setFormError("");
              setModal({ type: "create" });
            }}
          >
            Add colour
          </PrimaryButton>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search colours…"
          className="w-full max-w-sm rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm outline-none focus:border-rc-accent focus:ring-1 focus:ring-rc-accent"
          aria-label="Search colours"
        />
        {loading ? <span className="text-sm text-neutral-500">Searching…</span> : null}
      </div>

      {formError && modal.type === "closed" && deleteState.type === "closed" ? (
        <p className="text-sm text-red-600">{formError}</p>
      ) : null}

      <DashboardTable>
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <DashboardTableHead columns={["", "Name", "Hex", "Order", "Status", "Actions"]} />
          <tbody className="divide-y divide-neutral-100">
            {colors.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-neutral-500">
                  {debouncedSearch
                    ? "No colours match your search."
                    : "No colours yet. Add one to populate the product colour list."}
                </td>
              </tr>
            ) : (
              colors.map((item) => (
                <tr key={item.id} className="text-neutral-800">
                  <td className="px-4 py-3">
                    <span
                      className="inline-block h-8 w-8 rounded-md border border-neutral-200 shadow-sm"
                      style={{ backgroundColor: item.hex }}
                      title={item.hex}
                      aria-hidden
                    />
                  </td>
                  <td className="px-4 py-3 font-semibold text-neutral-900">{item.name}</td>
                  <td className="px-4 py-3 font-mono text-xs uppercase text-neutral-600">
                    {item.hex}
                  </td>
                  <td className="px-4 py-3 text-neutral-600">{item.sortOrder}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={mapStatusToUi(item.status ?? "ACTIVE")} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <SecondaryButton
                        onClick={() => {
                          setFormError("");
                          setModal({ type: "edit", color: item });
                        }}
                      >
                        Edit
                      </SecondaryButton>
                      <SecondaryButton
                        onClick={() => setDeleteState({ type: "confirm", color: item })}
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

      <ColorFormModal
        open={modal.type !== "closed"}
        mode={modal.type === "edit" ? "edit" : "create"}
        color={modal.type === "edit" ? modal.color : null}
        loading={submitting}
        error={formError}
        onClose={() => {
          setFormError("");
          setModal({ type: "closed" });
        }}
        onSubmit={handleFormSubmit}
      />

      <ConfirmDialog
        open={deleteState.type === "confirm"}
        title="Delete colour?"
        description={
          deleteState.type === "confirm" ? (
            <>
              Remove <strong>{deleteState.color.name}</strong> from the master colour list?
              Existing product variants keep their saved colour text.
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
