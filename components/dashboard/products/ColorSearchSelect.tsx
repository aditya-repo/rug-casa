"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { ApiColor } from "@/lib/api/colors";

export type ColorOption = {
  name: string;
  hex?: string;
};

type ColorSearchSelectProps = {
  options: ColorOption[];
  value: string;
  onChange: (name: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
};

type ColorMultiSearchSelectProps = {
  options: ColorOption[];
  value: string[];
  onChange: (names: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  /** Names that cannot be selected (e.g. primary colour). */
  exclude?: string[];
};

function useOutsideClose(
  open: boolean,
  rootRef: React.RefObject<HTMLDivElement | null>,
  onClose: () => void,
) {
  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) onClose();
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose, rootRef]);
}

function Swatch({ hex, className = "h-4 w-4" }: { hex?: string; className?: string }) {
  return (
    <span
      className={`${className} shrink-0 rounded-sm border border-neutral-300`}
      style={{ backgroundColor: hex || "#E5E7EB" }}
      aria-hidden
    />
  );
}

/** Single searchable colour dropdown (primary colour). */
export function ColorSearchSelect({
  options,
  value,
  onChange,
  placeholder = "Search colour…",
  required = false,
  disabled = false,
}: ColorSearchSelectProps) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useOutsideClose(open, rootRef, () => setOpen(false));

  const colorOptions = options ?? [];
  const selected = colorOptions.find((o) => o.name === value);
  const orphan = value && !selected ? { name: value, hex: undefined } : null;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = orphan ? [orphan, ...colorOptions] : colorOptions;
    if (!q) return base;
    return base.filter((o) => o.name.toLowerCase().includes(q));
  }, [colorOptions, orphan, query]);

  return (
    <div ref={rootRef} className="relative mt-1">
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-required={required}
        onClick={() => {
          setQuery("");
          setOpen((prev) => !prev);
        }}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-left text-sm text-neutral-900 shadow-sm outline-none transition-colors hover:border-neutral-400 focus:border-rc-accent focus:ring-1 focus:ring-rc-accent disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span className="flex min-w-0 items-center gap-2">
          {value ? <Swatch hex={selected?.hex ?? orphan?.hex} /> : null}
          <span className={value ? "truncate" : "text-neutral-400"}>
            {value || placeholder}
          </span>
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

      {/* Keep required validation without a visible native select */}
      {required ? (
        <input
          tabIndex={-1}
          className="sr-only"
          required
          value={value}
          onChange={() => undefined}
          aria-hidden
        />
      ) : null}

      {open ? (
        <div
          id={listId}
          role="listbox"
          className="absolute z-30 mt-1 w-full overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-lg"
        >
          <div className="border-b border-neutral-100 p-2">
            <input
              autoFocus
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type to search…"
              className="w-full rounded-md border border-neutral-200 px-2.5 py-1.5 text-sm outline-none focus:border-rc-accent focus:ring-1 focus:ring-rc-accent"
            />
          </div>
          <ul className="max-h-56 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-sm text-neutral-500">No colours found</li>
            ) : (
              filtered.map((option) => {
                const active = option.name === value;
                return (
                  <li key={option.name}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={active}
                      className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm hover:bg-neutral-50 ${
                        active ? "bg-blue-50 text-rc-navy" : "text-neutral-800"
                      }`}
                      onClick={() => {
                        onChange(option.name);
                        setOpen(false);
                        setQuery("");
                      }}
                    >
                      <Swatch hex={option.hex} />
                      <span className="truncate">{option.name}</span>
                      {option.hex ? (
                        <span className="ml-auto font-mono text-[10px] uppercase text-neutral-400">
                          {option.hex}
                        </span>
                      ) : null}
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

/** Multi searchable colour dropdown (other colours). */
export function ColorMultiSearchSelect({
  options,
  value,
  onChange,
  placeholder = "Search & select colours…",
  disabled = false,
  exclude = [],
}: ColorMultiSearchSelectProps) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useOutsideClose(open, rootRef, () => setOpen(false));

  const colorOptions = options ?? [];
  const excluded = new Set(exclude.map((n) => n.toLowerCase()));
  const selected = new Set(value);
  const orphanValues = value.filter(
    (name) => !colorOptions.some((o) => o.name === name),
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const available = [
      ...orphanValues.map((name) => ({ name, hex: undefined as string | undefined })),
      ...colorOptions.filter((o) => !excluded.has(o.name.toLowerCase())),
    ];
    // Dedupe by name
    const seen = new Set<string>();
    const unique = available.filter((o) => {
      if (seen.has(o.name)) return false;
      seen.add(o.name);
      return true;
    });
    if (!q) return unique;
    return unique.filter((o) => o.name.toLowerCase().includes(q));
  }, [excluded, colorOptions, orphanValues, query]);

  function toggle(name: string) {
    if (selected.has(name)) {
      onChange(value.filter((item) => item !== name));
      return;
    }
    onChange([...value, name]);
  }

  const summary =
    value.length === 0
      ? placeholder
      : value.length === 1
        ? value[0]
        : `${value.length} colours selected`;

  return (
    <div ref={rootRef} className="relative mt-1">
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => {
          setQuery("");
          setOpen((prev) => !prev);
        }}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-left text-sm text-neutral-900 shadow-sm outline-none transition-colors hover:border-neutral-400 focus:border-rc-accent focus:ring-1 focus:ring-rc-accent disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span className="flex min-w-0 flex-1 items-center gap-2">
          {value.length > 0 ? (
            <span className="flex -space-x-1">
              {value.slice(0, 3).map((name) => {
                const hex = options.find((o) => o.name === name)?.hex;
                return <Swatch key={name} hex={hex} className="h-4 w-4 ring-1 ring-white" />;
              })}
            </span>
          ) : null}
          <span className={`truncate ${value.length === 0 ? "text-neutral-400" : ""}`}>
            {summary}
          </span>
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
          className="absolute z-30 mt-1 w-full overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-lg"
        >
          <div className="border-b border-neutral-100 p-2">
            <input
              autoFocus
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type to search…"
              className="w-full rounded-md border border-neutral-200 px-2.5 py-1.5 text-sm outline-none focus:border-rc-accent focus:ring-1 focus:ring-rc-accent"
            />
          </div>
          <ul className="max-h-56 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-sm text-neutral-500">No colours found</li>
            ) : (
              filtered.map((option) => {
                const checked = selected.has(option.name);
                return (
                  <li key={option.name}>
                    <label className="flex cursor-pointer items-center gap-2.5 px-3 py-2 text-sm text-neutral-800 hover:bg-neutral-50">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggle(option.name)}
                        className="h-4 w-4 rounded border-neutral-300 text-rc-navy focus:ring-rc-accent"
                      />
                      <Swatch hex={option.hex} />
                      <span className="min-w-0 flex-1 truncate">{option.name}</span>
                      {option.hex ? (
                        <span className="font-mono text-[10px] uppercase text-neutral-400">
                          {option.hex}
                        </span>
                      ) : null}
                    </label>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

export function mapApiColorsToOptions(colors: ApiColor[]): ColorOption[] {
  return colors.map((c) => ({ name: c.name, hex: c.hex }));
}
