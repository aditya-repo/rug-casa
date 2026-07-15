"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { ApiCollection } from "@/lib/api/collections";

type CollectionMultiSelectProps = {
  collections: ApiCollection[];
  value: string[];
  onChange: (titles: string[]) => void;
  disabled?: boolean;
};

export function parseCollectionValue(value: string): string[] {
  if (!value.trim()) return [];
  return value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

export function formatCollectionValue(titles: string[]): string {
  return titles.join(", ");
}

export function CollectionMultiSelect({
  collections,
  value,
  onChange,
  disabled = false,
}: CollectionMultiSelectProps) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const selected = new Set(value);
  const orphanTitles = value.filter(
    (title) => !collections.some((collection) => collection.title === title),
  );

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    window.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function toggleTitle(title: string) {
    if (selected.has(title)) {
      onChange(value.filter((item) => item !== title));
      return;
    }
    onChange([...value, title]);
  }

  const summary =
    value.length === 0
      ? "Select collections"
      : value.length === 1
        ? value[0]
        : `${value.length} collections selected`;

  return (
    <div ref={rootRef} className="relative mt-1">
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between rounded-lg border border-neutral-300 bg-white px-3 py-2 text-left text-sm text-neutral-900 shadow-sm outline-none transition-colors hover:border-neutral-400 focus:border-rc-accent focus:ring-1 focus:ring-rc-accent disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span className={value.length === 0 ? "text-neutral-400" : "truncate text-neutral-900"}>
          {summary}
        </span>
        <svg
          className={`h-4 w-4 shrink-0 text-neutral-500 transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open ? (
        <div
          id={listId}
          role="listbox"
          aria-multiselectable="true"
          className="absolute z-20 mt-1 max-h-64 w-full overflow-y-auto rounded-lg border border-neutral-200 bg-white py-1 shadow-lg"
        >
          {collections.length === 0 && orphanTitles.length === 0 ? (
            <p className="px-3 py-2 text-sm text-neutral-500">No collections available</p>
          ) : null}

          {collections.map((collection) => {
            const checked = selected.has(collection.title);
            return (
              <label
                key={collection.id}
                className="flex cursor-pointer items-center gap-2.5 px-3 py-2 text-sm text-neutral-800 hover:bg-neutral-50"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleTitle(collection.title)}
                  className="h-4 w-4 rounded border-neutral-300 text-rc-navy focus:ring-rc-accent"
                />
                <span>{collection.title}</span>
              </label>
            );
          })}

          {orphanTitles.map((title) => (
            <label
              key={title}
              className="flex cursor-pointer items-center gap-2.5 px-3 py-2 text-sm text-neutral-800 hover:bg-neutral-50"
            >
              <input
                type="checkbox"
                checked
                onChange={() => toggleTitle(title)}
                className="h-4 w-4 rounded border-neutral-300 text-rc-navy focus:ring-rc-accent"
              />
              <span>
                {title} <span className="text-neutral-400">(current)</span>
              </span>
            </label>
          ))}
        </div>
      ) : null}
    </div>
  );
}
