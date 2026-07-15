import type { ReactNode } from "react";

type DashboardPageHeaderProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  /** When false, omits the bottom border (useful when filters sit under the title in the same header). */
  bordered?: boolean;
};

export function DashboardPageHeader({
  title,
  description,
  actions,
  bordered = true,
}: DashboardPageHeaderProps) {
  return (
    <div
      className={`flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between ${
        bordered ? "border-b border-neutral-200 pb-5" : ""
      }`}
    >
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
          {title}
        </h1>
        {description ? (
          <p className="mt-1 text-sm text-neutral-500">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}
