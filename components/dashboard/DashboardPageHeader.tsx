import Link from "next/link";
import type { ReactNode } from "react";
import { SecondaryButton } from "@/components/dashboard/DashboardTable";

export type DashboardBreadcrumbItem = {
  label: string;
  href?: string;
};

type DashboardPageHeaderProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  breadcrumbs?: DashboardBreadcrumbItem[];
  backHref?: string;
  backLabel?: string;
  /** When false, omits the bottom border (useful when filters sit under the title in the same header). */
  bordered?: boolean;
};

export function DashboardPageHeader({
  title,
  description,
  actions,
  breadcrumbs,
  backHref,
  backLabel = "Back",
  bordered = true,
}: DashboardPageHeaderProps) {
  return (
    <div className={bordered ? "border-b border-neutral-200 pb-5" : ""}>
      {breadcrumbs && breadcrumbs.length > 0 ? (
        <nav className="mb-3 text-xs text-neutral-500" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5">
            {breadcrumbs.map((item, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return (
                <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
                  {index > 0 ? <span aria-hidden>/</span> : null}
                  {item.href && !isLast ? (
                    <Link href={item.href} className="hover:text-rc-navy hover:underline">
                      {item.label}
                    </Link>
                  ) : (
                    <span
                      className={isLast ? "font-medium text-neutral-700" : undefined}
                      aria-current={isLast ? "page" : undefined}
                    >
                      {item.label}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            {backHref ? (
              <Link href={backHref} className="shrink-0">
                <SecondaryButton type="button" className="!px-3 !py-1.5 text-xs">
                  ← {backLabel}
                </SecondaryButton>
              </Link>
            ) : null}
            <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">{title}</h1>
          </div>
          {description ? (
            <p className="mt-1 text-sm text-neutral-500">{description}</p>
          ) : null}
        </div>
        {actions ? (
          <div className="flex shrink-0 flex-wrap items-center gap-1.5 sm:justify-end">
            {actions}
          </div>
        ) : null}
      </div>
    </div>
  );
}
