"use client";

import { useState, type ReactNode } from "react";
import type { CategoryItem } from "@/lib/data/categories";
import {
  PRODUCT_MATERIALS,
  PRODUCT_PATTERN_ART,
  PRODUCT_SHAPES,
  PRODUCT_TECHNIQUES,
  PRODUCT_THICKNESS,
} from "@/lib/dashboard/product-options";

export type ShopFilterOption = {
  slug: string;
  label: string;
};

export type ShopFilterState = {
  categories: string[];
  collections: string[];
  shapes: string[];
  weavingTypes: string[];
  materials: string[];
  patterns: string[];
  thicknesses: string[];
  sizes: string[];
  colors: string[];
};

export const SHOP_SIZE_OPTIONS = [
  { id: "2x3", label: "2x3", count: 9 },
  { id: "3x5", label: "3x5", count: 46 },
  { id: "4x6", label: "4x6", count: 92 },
  { id: "5x7", label: "5x7", count: 120 },
  { id: "5x8", label: "5x8", count: 217 },
  { id: "6x9", label: "6x9", count: 298 },
  { id: "8x10", label: "8x10", count: 154 },
] as const;

export const SHOP_COLOR_OPTIONS = [
  { id: "grey", label: "Grey", count: 64, swatch: "#9ca3af" },
  { id: "green", label: "Green", count: 12, swatch: "#4d7c5a" },
  { id: "navy", label: "Navy", count: 28, swatch: "#1a2744" },
  { id: "beige", label: "Beige", count: 41, swatch: "#d6c6a8" },
  { id: "purple", label: "Purple", count: 3, swatch: "#7c6b8a" },
] as const;

const VISIBLE_OPTION_COUNT = 4;

type ShopFiltersSidebarProps = {
  filters: ShopFilterState;
  onChange: (next: ShopFilterState) => void;
  categories?: CategoryItem[];
  collections?: ShopFilterOption[];
};

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="border-b border-rc-border py-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-rc-navy">
        {title}
      </p>
      <div className="mt-3 space-y-2.5">{children}</div>
    </div>
  );
}

function CheckboxRow({
  checked,
  onChange,
  label,
  trailing,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  trailing?: ReactNode;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm text-rc-navy">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-3.5 w-3.5 shrink-0 rounded-sm border-rc-border text-rc-navy accent-rc-navy"
      />
      {trailing}
      <span className="leading-snug">{label}</span>
    </label>
  );
}

function toggleInList(list: string[], id: string): string[] {
  return list.includes(id) ? list.filter((item) => item !== id) : [...list, id];
}

function ExpandableOptions({
  options,
  selected,
  onToggle,
  emptyLabel,
  getLabel = (id: string) => id,
  renderTrailing,
}: {
  options: readonly string[];
  selected: string[];
  onToggle: (id: string) => void;
  emptyLabel: string;
  getLabel?: (id: string) => string;
  renderTrailing?: (id: string) => ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);

  if (options.length === 0) {
    return <p className="text-sm text-rc-muted">{emptyLabel}</p>;
  }

  const visible = expanded ? options : options.slice(0, VISIBLE_OPTION_COUNT);
  const canExpand = options.length > VISIBLE_OPTION_COUNT;

  return (
    <>
      {visible.map((id) => (
        <CheckboxRow
          key={id}
          checked={selected.includes(id)}
          onChange={() => onToggle(id)}
          label={getLabel(id)}
          trailing={renderTrailing?.(id)}
        />
      ))}
      {canExpand ? (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-1 text-xs font-medium text-rc-navy underline underline-offset-2"
        >
          {expanded ? "Show less" : "View more"}
        </button>
      ) : null}
    </>
  );
}

export function ShopFiltersSidebar({
  filters,
  onChange,
  categories = [],
  collections = [],
}: ShopFiltersSidebarProps) {
  return (
    <aside className="w-full" aria-label="Product filters">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rc-navy">
        Filter by
      </p>

      <FilterSection title="Category">
        <ExpandableOptions
          options={categories.map((c) => c.slug)}
          selected={filters.categories}
          onToggle={(slug) =>
            onChange({
              ...filters,
              categories: toggleInList(filters.categories, slug),
            })
          }
          emptyLabel="No categories yet"
          getLabel={(slug) =>
            categories.find((c) => c.slug === slug)?.label ?? slug
          }
        />
      </FilterSection>

      <FilterSection title="Collection">
        <ExpandableOptions
          options={collections.map((c) => c.slug)}
          selected={filters.collections}
          onToggle={(slug) =>
            onChange({
              ...filters,
              collections: toggleInList(filters.collections, slug),
            })
          }
          emptyLabel="No collections yet"
          getLabel={(slug) =>
            collections.find((c) => c.slug === slug)?.label ?? slug
          }
        />
      </FilterSection>

      <FilterSection title="Shape">
        <ExpandableOptions
          options={PRODUCT_SHAPES}
          selected={filters.shapes}
          onToggle={(id) =>
            onChange({
              ...filters,
              shapes: toggleInList(filters.shapes, id),
            })
          }
          emptyLabel="No shapes yet"
        />
      </FilterSection>

      <FilterSection title="Weaving technique">
        <ExpandableOptions
          options={PRODUCT_TECHNIQUES}
          selected={filters.weavingTypes}
          onToggle={(id) =>
            onChange({
              ...filters,
              weavingTypes: toggleInList(filters.weavingTypes, id),
            })
          }
          emptyLabel="No techniques yet"
        />
      </FilterSection>

      <FilterSection title="Material">
        <ExpandableOptions
          options={PRODUCT_MATERIALS}
          selected={filters.materials}
          onToggle={(id) =>
            onChange({
              ...filters,
              materials: toggleInList(filters.materials, id),
            })
          }
          emptyLabel="No materials yet"
        />
      </FilterSection>

      <FilterSection title="Pattern">
        <ExpandableOptions
          options={PRODUCT_PATTERN_ART}
          selected={filters.patterns}
          onToggle={(id) =>
            onChange({
              ...filters,
              patterns: toggleInList(filters.patterns, id),
            })
          }
          emptyLabel="No patterns yet"
        />
      </FilterSection>

      <FilterSection title="Thickness">
        <ExpandableOptions
          options={PRODUCT_THICKNESS}
          selected={filters.thicknesses}
          onToggle={(id) =>
            onChange({
              ...filters,
              thicknesses: toggleInList(filters.thicknesses, id),
            })
          }
          emptyLabel="No thicknesses yet"
        />
      </FilterSection>

      <FilterSection title="Size (ft.)">
        <ExpandableOptions
          options={SHOP_SIZE_OPTIONS.map((s) => s.id)}
          selected={filters.sizes}
          onToggle={(id) =>
            onChange({
              ...filters,
              sizes: toggleInList(filters.sizes, id),
            })
          }
          emptyLabel="No sizes yet"
          getLabel={(id) => {
            const size = SHOP_SIZE_OPTIONS.find((s) => s.id === id);
            return size ? `${size.label} (${size.count})` : id;
          }}
        />
      </FilterSection>

      <FilterSection title="Color">
        <ExpandableOptions
          options={SHOP_COLOR_OPTIONS.map((c) => c.id)}
          selected={filters.colors}
          onToggle={(id) =>
            onChange({
              ...filters,
              colors: toggleInList(filters.colors, id),
            })
          }
          emptyLabel="No colors yet"
          getLabel={(id) => {
            const color = SHOP_COLOR_OPTIONS.find((c) => c.id === id);
            return color ? `${color.label} (${color.count})` : id;
          }}
          renderTrailing={(id) => {
            const color = SHOP_COLOR_OPTIONS.find((c) => c.id === id);
            if (!color) return null;
            return (
              <span
                className="h-3.5 w-3.5 shrink-0 rounded-[2px] border border-rc-border"
                style={{ backgroundColor: color.swatch }}
                aria-hidden
              />
            );
          }}
        />
      </FilterSection>
    </aside>
  );
}
