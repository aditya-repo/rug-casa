"use client";

import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import {
  IconArchive,
  IconDelete,
  IconDraft,
  IconPublish,
} from "@/components/dashboard/dashboard-icons";
import {
  deleteProductClient,
  setProductStatusClient,
  type ProductApiStatus,
} from "@/lib/api/products";
import { productStatusLabel } from "@/lib/dashboard/product-options";

type DialogState =
  | { type: "closed" }
  | { type: "delete" }
  | { type: "status"; next: ProductApiStatus };

type ProductLifecycleActionsProps = {
  productId: string;
  productName: string;
  apiStatus: ProductApiStatus;
  /** Compact icon buttons for table rows */
  compact?: boolean;
  onChanged?: () => void | Promise<void>;
};

const iconBtn =
  "inline-flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-700 transition-colors hover:bg-neutral-50 disabled:opacity-50";
const iconDangerBtn =
  "inline-flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 bg-white text-red-700 transition-colors hover:bg-red-50 disabled:opacity-50";
const solidBtn =
  "rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-50";
const solidDanger =
  "rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50";

function normalizeApiStatus(status: string): ProductApiStatus {
  const upper = status.toUpperCase();
  if (upper === "PUBLISHED" || upper === "OUT_OF_STOCK") return "PUBLISHED";
  if (upper === "ARCHIVED") return "ARCHIVED";
  return "DRAFT";
}

function IconActionButton({
  label,
  className,
  onClick,
  children,
}: {
  label: string;
  className: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      className={className}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function ProductLifecycleActions({
  productId,
  productName,
  apiStatus,
  compact = false,
  onChanged,
}: ProductLifecycleActionsProps) {
  const router = useRouter();
  const [dialog, setDialog] = useState<DialogState>({ type: "closed" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const current = normalizeApiStatus(apiStatus);

  async function refresh() {
    if (onChanged) await onChanged();
    else router.refresh();
  }

  async function handleConfirm() {
    setLoading(true);
    setError("");
    try {
      if (dialog.type === "delete") {
        await deleteProductClient(productId);
        setDialog({ type: "closed" });
        if (onChanged) await onChanged();
        else router.push("/dashboard/products");
        router.refresh();
        return;
      }
      if (dialog.type === "status") {
        await setProductStatusClient(productId, dialog.next);
        setDialog({ type: "closed" });
        await refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed");
    } finally {
      setLoading(false);
    }
  }

  const statusDialog =
    dialog.type === "status"
      ? {
          title:
            dialog.next === "PUBLISHED"
              ? "Publish product?"
              : dialog.next === "DRAFT"
                ? "Move to draft?"
                : "Archive product?",
          description: (
            <>
              Change <strong>{productName}</strong> from{" "}
              {productStatusLabel(current.toLowerCase())} to{" "}
              <strong>{productStatusLabel(dialog.next.toLowerCase())}</strong>?
            </>
          ),
          confirmLabel:
            dialog.next === "PUBLISHED"
              ? "Publish"
              : dialog.next === "DRAFT"
                ? "Move to draft"
                : "Archive",
          variant: dialog.next === "ARCHIVED" ? ("danger" as const) : ("primary" as const),
        }
      : null;

  return (
    <>
      <div className="flex flex-wrap gap-1.5">
        {current !== "PUBLISHED" ? (
          compact ? (
            <IconActionButton
              label="Publish"
              className={iconBtn}
              onClick={() => setDialog({ type: "status", next: "PUBLISHED" })}
            >
              <IconPublish />
            </IconActionButton>
          ) : (
            <button
              type="button"
              className={solidBtn}
              onClick={() => setDialog({ type: "status", next: "PUBLISHED" })}
            >
              Publish
            </button>
          )
        ) : null}
        {current !== "DRAFT" ? (
          compact ? (
            <IconActionButton
              label="Draft"
              className={iconBtn}
              onClick={() => setDialog({ type: "status", next: "DRAFT" })}
            >
              <IconDraft />
            </IconActionButton>
          ) : (
            <button
              type="button"
              className={solidBtn}
              onClick={() => setDialog({ type: "status", next: "DRAFT" })}
            >
              Draft
            </button>
          )
        ) : null}
        {current !== "ARCHIVED" ? (
          compact ? (
            <IconActionButton
              label="Archive"
              className={iconBtn}
              onClick={() => setDialog({ type: "status", next: "ARCHIVED" })}
            >
              <IconArchive />
            </IconActionButton>
          ) : (
            <button
              type="button"
              className={solidBtn}
              onClick={() => setDialog({ type: "status", next: "ARCHIVED" })}
            >
              Archive
            </button>
          )
        ) : null}
        {compact ? (
          <IconActionButton
            label="Delete"
            className={iconDangerBtn}
            onClick={() => setDialog({ type: "delete" })}
          >
            <IconDelete />
          </IconActionButton>
        ) : (
          <button
            type="button"
            className={solidDanger}
            onClick={() => setDialog({ type: "delete" })}
          >
            Delete
          </button>
        )}
      </div>

      {error ? <p className="mt-2 text-xs text-red-600">{error}</p> : null}

      <ConfirmDialog
        open={dialog.type === "delete"}
        title="Delete product?"
        description={
          <>
            Permanently remove <strong>{productName}</strong> from the catalogue? This cannot be
            undone from the storefront listing.
          </>
        }
        confirmLabel="Delete"
        variant="danger"
        loading={loading}
        onConfirm={handleConfirm}
        onClose={() => {
          if (!loading) {
            setError("");
            setDialog({ type: "closed" });
          }
        }}
      />

      <ConfirmDialog
        open={dialog.type === "status"}
        title={statusDialog?.title ?? ""}
        description={statusDialog?.description}
        confirmLabel={statusDialog?.confirmLabel}
        variant={statusDialog?.variant ?? "primary"}
        loading={loading}
        onConfirm={handleConfirm}
        onClose={() => {
          if (!loading) {
            setError("");
            setDialog({ type: "closed" });
          }
        }}
      />
    </>
  );
}
