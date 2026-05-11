import Link from "next/link";
import { accountNavItems } from "./constants";
import { LogoutConfirmButton } from "./LogoutConfirmButton";

export type AccountBreadcrumbItem = {
  label: string;
  href?: string;
};

export function AccountBreadcrumb({ items }: { items: readonly AccountBreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-5 text-sm text-neutral-500">
      <ol className="flex flex-wrap items-center gap-2">
        {items.flatMap((item, index) => {
          const sep =
            index > 0 ? (
              <li key={`sep-${index}`} aria-hidden className="text-neutral-400">
                &gt;
              </li>
            ) : null;
          const cell = (
            <li key={`${index}-${item.label}`}>
              {item.href ? (
                <Link
                  href={item.href}
                  className="transition-colors hover:text-rc-navy"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="font-medium text-neutral-900">{item.label}</span>
              )}
            </li>
          );
          return sep ? [sep, cell] : [cell];
        })}
      </ol>
    </nav>
  );
}

export function AccountNavRows({ activeNavId }: { activeNavId: string | null }) {
  return (
    <ul className="space-y-0.5">
      {accountNavItems.map(({ id, label, href, Icon }) => {
        const active = activeNavId !== null && id === activeNavId;
        return (
          <li key={id}>
            <Link
              href={href}
              className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-[#EBF4FF] text-[#1E40AF]"
                  : "text-neutral-800 hover:bg-neutral-50"
              }`}
            >
              {active ? (
                <span
                  className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r bg-rc-accent"
                  aria-hidden
                />
              ) : null}
              <Icon
                className={`h-5 w-5 shrink-0 ${
                  active
                    ? "text-rc-accent"
                    : "text-neutral-500 group-hover:text-neutral-700"
                }`}
              />
              <span className={active ? "pl-1" : ""}>{label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function DesktopAccountSidebar({ activeNavId }: { activeNavId: string | null }) {
  return (
    <div className="w-full lg:max-w-[300px]">
      <div className="rounded-[10px] border border-neutral-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
        <p className="border-b border-neutral-100 px-4 py-3.5 text-[15px] font-semibold text-neutral-900">
          My Account
        </p>
        <div className="p-2 pb-1">
          <AccountNavRows activeNavId={activeNavId} />
        </div>
        <div className="border-t border-neutral-100 p-2">
          <LogoutConfirmButton variant="sidebar" />
        </div>
      </div>
    </div>
  );
}
