import Image from "next/image";
import Link from "next/link";
import { HeaderAndNav } from "@/components/layout/HeaderAndNav";
import { IconChevronRightThin } from "@/components/layout/icons";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { UtilityBar } from "@/components/layout/UtilityBar";
import { IconLogout } from "./account-icons";
import {
  accountNavItems,
  mockRecentOrders,
  type OrderStatus,
} from "./constants";

/** Set to an `accountNavItems` id to highlight that row, or `null` for none. */
const ACTIVE_NAV_ID: string | null = null;

const statusLabel: Record<OrderStatus, string> = {
  delivered: "Delivered",
  shipped: "Shipped",
  processing: "Processing",
};

const statusClass: Record<OrderStatus, string> = {
  delivered: "bg-[#D1FAE5] text-[#065F46]",
  shipped: "bg-[#DBEAFE] text-[#1E40AF]",
  processing: "bg-[#FFEDD5] text-[#9A3412]",
};

const mobileAccountTileStyles: Record<
  string,
  { wrap: string; icon: string }
> = {
  orders: { wrap: "bg-neutral-100", icon: "text-neutral-600" },
  wishlist: { wrap: "bg-rose-50", icon: "text-rose-600" },
  addresses: { wrap: "bg-sky-50", icon: "text-sky-600" },
  help: { wrap: "bg-amber-50", icon: "text-amber-700" },
};

function AccountNavRows() {
  return (
    <ul className="space-y-0.5">
      {accountNavItems.map(({ id, label, href, Icon }) => {
        const active = ACTIVE_NAV_ID !== null && id === ACTIVE_NAV_ID;
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

function AccountBreadcrumb() {
  return (
    <nav aria-label="Breadcrumb" className="mb-5 text-sm text-neutral-500">
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link href="/" className="transition-colors hover:text-rc-navy">
            Home
          </Link>
        </li>
        <li aria-hidden className="text-neutral-400">
          &gt;
        </li>
        <li className="font-medium text-neutral-900">My Account</li>
      </ol>
    </nav>
  );
}

function DesktopAccountSidebar() {
  return (
    <div className="w-full lg:max-w-[300px]">
      <div className="rounded-[10px] border border-neutral-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
        <p className="border-b border-neutral-100 px-4 py-3.5 text-[15px] font-semibold text-neutral-900">
          My Account
        </p>
        <div className="p-2 pb-1">
          <AccountNavRows />
        </div>
        <div className="border-t border-neutral-100 p-2">
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            <IconLogout className="h-5 w-5 shrink-0" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

function DesktopAccountCenter() {
  return (
    <div className="min-w-0 flex-1">
      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold text-neutral-900">Recent Orders</h2>
          <Link
            href="/account"
            className="text-sm font-medium text-rc-accent hover:underline"
          >
            View All Orders
          </Link>
        </div>

        <div className="overflow-x-auto rounded-[10px] border border-neutral-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50/80">
                <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Order
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Date
                </th>
                <th className="min-w-[220px] px-4 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Items
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Total
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Status
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {mockRecentOrders.map((order) => (
                <tr key={order.id} className="align-middle text-neutral-800">
                  <td className="whitespace-nowrap px-4 py-4 font-semibold text-neutral-900">
                    {order.id}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-neutral-600">{order.date}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-neutral-100">
                        <Image
                          src={order.imageSrc}
                          alt={order.imageAlt}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-neutral-900">{order.productName}</p>
                        <p className="text-xs text-neutral-500">{order.size}</p>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 font-semibold text-neutral-900">
                    {order.total}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusClass[order.status]}`}
                    >
                      {statusLabel[order.status]}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4">
                    <Link
                      href="/account"
                      className="font-medium text-rc-accent hover:underline"
                    >
                      {order.actionLabel}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function MobileAccountDashboard() {
  const gridCount = accountNavItems.length;

  return (
    <div className="space-y-3.5 pb-3">
      <div>
        <h1 className="text-lg font-semibold tracking-tight text-rc-navy">
          My Account
        </h1>

        <Link
          href="/account"
          className="mt-2.5 flex items-center gap-2.5 rounded-lg border border-neutral-200 bg-white p-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-colors active:bg-neutral-50"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EDE9FE] text-sm font-semibold text-violet-800">
            A
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-neutral-900">Hi, Arjun Sharma</p>
            <p className="mt-0.5 text-xs text-neutral-500">Welcome back!</p>
          </div>
          <IconChevronRightThin className="h-4 w-4 shrink-0 text-neutral-400" />
        </Link>

        <ul className="mt-2.5 grid grid-cols-2 gap-2">
          {accountNavItems.map(({ id, label, href, Icon }, index) => {
            const styles = mobileAccountTileStyles[id] ?? {
              wrap: "bg-neutral-100",
              icon: "text-neutral-600",
            };
            const spanLast =
              gridCount % 2 === 1 && index === gridCount - 1 ? "col-span-2" : "";

            return (
              <li key={id} className={spanLast}>
                <Link
                  href={href}
                  className="flex h-full min-h-[3.25rem] items-center gap-2 rounded-lg border border-neutral-200 bg-white p-2 shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-colors active:bg-neutral-50"
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${styles.wrap}`}
                  >
                    <Icon className={`h-4 w-4 ${styles.icon}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-xs font-semibold leading-snug text-neutral-900">
                      {label}
                    </p>
                  </div>
                  <IconChevronRightThin className="h-4 w-4 shrink-0 text-neutral-400" />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <section>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-neutral-900">Recent Orders</h2>
          <Link
            href="/account"
            className="text-xs font-medium text-rc-accent hover:underline"
          >
            View All
          </Link>
        </div>
        <div className="space-y-2">
          {mockRecentOrders.map((order) => (
            <Link
              key={order.id}
              href="/account"
              className="block rounded-lg border border-neutral-200 bg-white p-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-colors active:bg-neutral-50"
            >
              <div className="flex items-start justify-between gap-2 text-[11px]">
                <span className="font-semibold text-neutral-900">{order.id}</span>
                <span className="shrink-0 text-neutral-500">{order.date}</span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <div className="relative h-11 w-11 shrink-0 self-start overflow-hidden rounded-md bg-neutral-100">
                  <Image
                    src={order.imageSrc}
                    alt={order.imageAlt}
                    fill
                    className="object-cover"
                    sizes="44px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium leading-snug text-neutral-900">
                    {order.productName}
                  </p>
                  <p className="mt-0.5 text-[11px] text-neutral-500">{order.size}</p>
                  <div className="mt-1 flex items-center justify-between gap-1.5">
                    <p className="text-xs font-semibold text-neutral-900">{order.total}</p>
                    <span
                      className={`shrink-0 rounded-full px-2 py-px text-[10px] font-semibold leading-tight ${statusClass[order.status]}`}
                    >
                      {statusLabel[order.status]}
                    </span>
                  </div>
                </div>
                <IconChevronRightThin className="h-4 w-4 shrink-0 self-center text-neutral-400" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <button
        type="button"
        className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-red-100 bg-white py-2 text-xs font-semibold text-red-600 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors active:bg-red-50"
      >
        <IconLogout className="h-4 w-4 shrink-0" />
        Logout
      </button>
    </div>
  );
}

export function AccountScreen() {
  return (
    <div className="flex min-h-full flex-col bg-white">
      <UtilityBar />
      <HeaderAndNav />
      <main className="flex-1 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 md:py-8">
          <div className="hidden md:block">
            <AccountBreadcrumb />
            <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
              <DesktopAccountSidebar />
              <DesktopAccountCenter />
            </div>
          </div>
          <div className="md:hidden">
            <MobileAccountDashboard />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
