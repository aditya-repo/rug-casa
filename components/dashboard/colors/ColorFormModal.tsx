"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { ApiColor, ColorFormPayload, ColorStatus } from "@/lib/api/colors";

export type ColorFormValues = {
  name: string;
  hex: string;
  sortOrder: number;
  status: ColorStatus;
};

type ColorFormModalProps = {
  open: boolean;
  mode: "create" | "edit";
  color?: ApiColor | null;
  loading?: boolean;
  error?: string;
  onClose: () => void;
  onSubmit: (values: ColorFormPayload) => void;
};

const inputClass =
  "mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm outline-none focus:border-rc-accent focus:ring-1 focus:ring-rc-accent";

const labelClass = "text-xs font-semibold uppercase tracking-wide text-neutral-500";

function emptyValues(): ColorFormValues {
  return {
    name: "",
    hex: "#FFFFFF",
    sortOrder: 0,
    status: "ACTIVE",
  };
}

function fromColor(color: ApiColor): ColorFormValues {
  return {
    name: color.name,
    hex: color.hex,
    sortOrder: color.sortOrder,
    status: color.status ?? "ACTIVE",
  };
}

export function ColorFormModal({
  open,
  mode,
  color,
  loading = false,
  error,
  onClose,
  onSubmit,
}: ColorFormModalProps) {
  const [values, setValues] = useState<ColorFormValues>(emptyValues());

  useEffect(() => {
    if (!open) return;
    setValues(color ? fromColor(color) : emptyValues());
  }, [open, color]);

  if (!open) return null;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit({
      name: values.name.trim(),
      hex: values.hex.trim(),
      sortOrder: values.sortOrder,
      status: values.status,
    });
  }

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/45 p-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="color-form-title"
        className="w-full max-w-md rounded-xl border border-neutral-200 bg-white p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="color-form-title" className="text-lg font-semibold text-neutral-900">
          {mode === "create" ? "Add colour" : "Edit colour"}
        </h2>
        <p className="mt-1 text-sm text-neutral-500">
          Master colour list used for product variants.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <label className="block">
            <span className={labelClass}>Colour name</span>
            <input
              required
              value={values.name}
              onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
              className={inputClass}
              placeholder="e.g. Ivory"
            />
          </label>

          <div className="grid grid-cols-[1fr_auto] gap-3">
            <label className="block">
              <span className={labelClass}>Hex code</span>
              <input
                required
                value={values.hex}
                onChange={(e) => setValues((v) => ({ ...v, hex: e.target.value }))}
                className={inputClass}
                placeholder="#FFFFFF"
                pattern="^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$"
                title="Use a hex colour like #FFFFFF"
              />
            </label>
            <label className="block">
              <span className={labelClass}>Swatch</span>
              <input
                type="color"
                value={/^#[0-9A-Fa-f]{6}$/.test(values.hex) ? values.hex : "#FFFFFF"}
                onChange={(e) =>
                  setValues((v) => ({ ...v, hex: e.target.value.toUpperCase() }))
                }
                className="mt-1 h-[42px] w-14 cursor-pointer rounded-lg border border-neutral-300 bg-white p-1"
                aria-label="Pick colour"
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className={labelClass}>Sort order</span>
              <input
                type="number"
                value={values.sortOrder}
                onChange={(e) =>
                  setValues((v) => ({
                    ...v,
                    sortOrder: Number(e.target.value) || 0,
                  }))
                }
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className={labelClass}>Status</span>
              <select
                value={values.status}
                onChange={(e) =>
                  setValues((v) => ({
                    ...v,
                    status: e.target.value as ColorStatus,
                  }))
                }
                className={inputClass}
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
              disabled={loading}
              className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-800 hover:bg-neutral-50 disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-rc-navy px-4 py-2 text-sm font-semibold text-white hover:bg-rc-navy-dark disabled:opacity-60"
            >
              {loading ? "Saving…" : mode === "create" ? "Add colour" : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
