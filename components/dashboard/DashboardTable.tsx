import type { ReactNode } from "react";

type DashboardTableProps = {
  children: ReactNode;
};

export function DashboardTable({ children }: DashboardTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

type DashboardTableHeadProps = {
  columns: string[];
};

export function DashboardTableHead({ columns }: DashboardTableHeadProps) {
  return (
    <thead>
      <tr className="border-b border-neutral-200 bg-neutral-50/80">
        {columns.map((col) => (
          <th
            key={col}
            className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500"
          >
            {col}
          </th>
        ))}
      </tr>
    </thead>
  );
}

type DashboardToolbarProps = {
  searchPlaceholder?: string;
  children?: ReactNode;
};

export function DashboardToolbar({
  searchPlaceholder = "Search…",
  children,
}: DashboardToolbarProps) {
  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <input
        type="search"
        placeholder={searchPlaceholder}
        className="w-full max-w-sm rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm outline-none transition-colors focus:border-rc-accent focus:ring-1 focus:ring-rc-accent"
        aria-label="Search"
      />
      {children}
    </div>
  );
}

export function PrimaryButton({
  children,
  className = "",
  onClick,
  disabled,
  type = "button",
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg bg-rc-navy px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-rc-navy-dark disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  className = "",
  onClick,
  disabled,
  type = "button",
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}
