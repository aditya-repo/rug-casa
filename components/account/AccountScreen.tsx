import Image from "next/image";
import Link from "next/link";
import { auth } from "@/auth";
import { HeaderAndNav } from "@/components/layout/HeaderAndNav";
import { IconChevronRightThin } from "@/components/layout/icons";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { UtilityBar } from "@/components/layout/UtilityBar";
import {
  fetchCustomerRecentOrders,
  formatOrderDate,
  formatOrderTotal,
  type CustomerRecentOrder,
} from "@/lib/api/customer-orders";
import {
  AccountBreadcrumb,
  DesktopAccountSidebar,
} from "./AccountChrome";
import { LogoutConfirmButton } from "./LogoutConfirmButton";
import { accountNavItems, type OrderStatus } from "./constants";

const statusLabel: Record<OrderStatus, string> = {
  delivered: "Delivered",
  shipped: "Shipped",
  processing: "Processing",
  cancelled: "Cancelled",
  failed: "Failed",
  pending_payment: "Awaiting payment",
};

const statusClass: Record<OrderStatus, string> = {
  delivered: "bg-[#D1FAE5] text-[#065F46]",
  shipped: "bg-[#DBEAFE] text-[#1E40AF]",
  processing: "bg-[#FFEDD5] text-[#9A3412]",
  cancelled: "bg-neutral-100 text-neutral-600",
  failed: "bg-red-50 text-red-700",
  pending_payment: "bg-amber-50 text-amber-800",
};

const mobileAccountTileStyles: Record<
  string,
  { wrap: string; icon: string }
> = {
  orders: { wrap: "bg-neutral-100", icon: "text-neutral-600" },
  wishlist: { wrap: "bg-rose-50", icon: "text-rose-600" },
  addresses: { wrap: "bg-sky-50", icon: "text-sky-600" },
  profile: { wrap: "bg-violet-50", icon: "text-violet-600" },
  help: { wrap: "bg-amber-50", icon: "text-amber-700" },
};

function toRecentOrderView(order: CustomerRecentOrder) {
  return {
    id: order.orderNumber,
    orderId: order.id,
    date: formatOrderDate(order.date),
    productName: order.productName,
    size: order.size || (order.itemCount > 1 ? `${order.itemCount} items` : ""),
    total: formatOrderTotal(order.total, order.currency),
    imageSrc: order.imageSrc,
    imageAlt: order.imageAlt,
    status: order.status as OrderStatus,
    actionLabel: order.actionLabel,
  };
}

function DesktopAccountCenter({
  orders,
  loadError,
}: {
  orders: ReturnType<typeof toRecentOrderView>[];
  loadError: string;
}) {
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

        {loadError ? (
          <p className="rounded-[10px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {loadError}
          </p>
        ) : orders.length === 0 ? (
          <div className="rounded-[10px] border border-dashed border-neutral-200 bg-neutral-50 px-6 py-12 text-center">
            <p className="font-medium text-neutral-900">No orders yet</p>
            <p className="mt-1 text-sm text-neutral-500">
              When you place an order, it will show up here.
            </p>
            <Link
              href="/shop"
              className="mt-4 inline-flex rounded-lg bg-rc-navy px-4 py-2 text-sm font-semibold text-white"
            >
              Browse rugs
            </Link>
          </div>
        ) : (
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
                {orders.map((order) => (
                  <tr key={order.orderId} className="align-middle text-neutral-800">
                    <td className="whitespace-nowrap px-4 py-4 font-semibold text-neutral-900">
                      {order.id}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-neutral-600">
                      {order.date}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-neutral-100">
                          {order.imageSrc ? (
                            <Image
                              src={order.imageSrc}
                              alt={order.imageAlt}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          ) : null}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-neutral-900">
                            {order.productName}
                          </p>
                          {order.size ? (
                            <p className="text-xs text-neutral-500">{order.size}</p>
                          ) : null}
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
        )}
      </section>
    </div>
  );
}

function MobileAccountDashboard({
  displayName,
  image,
  orders,
  loadError,
}: {
  displayName: string;
  image?: string | null;
  orders: ReturnType<typeof toRecentOrderView>[];
  loadError: string;
}) {
  const mobileNavItems = accountNavItems.filter((item) => item.id !== "profile");
  const gridCount = mobileNavItems.length;
  const initial = (displayName.trim()[0] || "U").toUpperCase();

  return (
    <div className="space-y-3.5 pb-3">
      <div>
        <h1 className="text-lg font-semibold tracking-tight text-rc-navy">
          My Account
        </h1>

        <Link
          href="/account/profile"
          className="mt-2.5 flex items-center gap-2.5 rounded-lg border border-neutral-200 bg-white p-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-colors active:bg-neutral-50"
        >
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt=""
              className="h-10 w-10 shrink-0 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EDE9FE] text-sm font-semibold text-violet-800">
              {initial}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-neutral-900">
              Hi, {displayName}
            </p>
            <p className="mt-0.5 text-xs text-neutral-500">Welcome back!</p>
          </div>
          <IconChevronRightThin className="h-4 w-4 shrink-0 text-neutral-400" />
        </Link>

        <ul className="mt-2.5 grid grid-cols-2 gap-2">
          {mobileNavItems.map(({ id, label, href, Icon }, index) => {
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
        {loadError ? (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            {loadError}
          </p>
        ) : orders.length === 0 ? (
          <div className="rounded-lg border border-dashed border-neutral-200 bg-neutral-50 px-4 py-8 text-center">
            <p className="text-sm font-medium text-neutral-900">No orders yet</p>
            <Link
              href="/shop"
              className="mt-3 inline-flex text-xs font-semibold text-rc-accent hover:underline"
            >
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {orders.map((order) => (
              <Link
                key={order.orderId}
                href="/account"
                className="block rounded-lg border border-neutral-200 bg-white p-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-colors active:bg-neutral-50"
              >
                <div className="flex items-start justify-between gap-2 text-[11px]">
                  <span className="font-semibold text-neutral-900">{order.id}</span>
                  <span className="shrink-0 text-neutral-500">{order.date}</span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <div className="relative h-11 w-11 shrink-0 self-start overflow-hidden rounded-md bg-neutral-100">
                    {order.imageSrc ? (
                      <Image
                        src={order.imageSrc}
                        alt={order.imageAlt}
                        fill
                        className="object-cover"
                        sizes="44px"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium leading-snug text-neutral-900">
                      {order.productName}
                    </p>
                    {order.size ? (
                      <p className="mt-0.5 text-[11px] text-neutral-500">
                        {order.size}
                      </p>
                    ) : null}
                    <div className="mt-1 flex items-center justify-between gap-1.5">
                      <p className="text-xs font-semibold text-neutral-900">
                        {order.total}
                      </p>
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
        )}
      </section>

      <LogoutConfirmButton variant="mobile" />
    </div>
  );
}

export async function AccountScreen() {
  const session = await auth();
  const displayName =
    session?.user?.name?.trim() ||
    session?.user?.email?.split("@")[0] ||
    "there";

  let orders: ReturnType<typeof toRecentOrderView>[] = [];
  let loadError = "";

  if (session?.user?.email) {
    try {
      const recent = await fetchCustomerRecentOrders(session.user.email, 10);
      orders = recent.map(toRecentOrderView);
    } catch (error) {
      loadError =
        error instanceof Error ? error.message : "Could not load your orders.";
    }
  }

  return (
    <div className="flex min-h-full flex-col bg-white">
      <UtilityBar />
      <HeaderAndNav />
      <main className="flex-1 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 md:py-8">
          <div className="hidden md:block">
            <AccountBreadcrumb
              items={[
                { label: "Home", href: "/" },
                { label: "My Account" },
              ]}
            />
            <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
              <DesktopAccountSidebar activeNavId="orders" />
              <DesktopAccountCenter orders={orders} loadError={loadError} />
            </div>
          </div>
          <div className="md:hidden">
            <MobileAccountDashboard
              displayName={displayName}
              image={session?.user?.image}
              orders={orders}
              loadError={loadError}
            />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
