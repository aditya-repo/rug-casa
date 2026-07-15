import Link from "next/link";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import {
  DashboardTable,
  DashboardTableHead,
} from "@/components/dashboard/DashboardTable";
import {
  buildStatCards,
  fetchDashboardAnalytics,
  fetchDashboardLatest,
  fetchDashboardOverview,
  fillMonthlySales,
  mapRecentOrder,
} from "@/lib/api/dashboard";

export default async function DashboardOverviewPage() {
  const [overview, latest, analytics] = await Promise.all([
    fetchDashboardOverview(),
    fetchDashboardLatest(),
    fetchDashboardAnalytics(),
  ]);

  const stats = buildStatCards(overview);
  const recentOrders = latest.orders.map(mapRecentOrder).slice(0, 4);
  const monthlySales = fillMonthlySales(analytics.monthlySales ?? [], 6);

  const attentionItems = [
    {
      label: "Orders awaiting approval",
      href: "/dashboard/orders",
      count: overview.orders.pending,
    },
    {
      label: "Reviews awaiting approval",
      href: "/dashboard/reviews",
      count: overview.reviews.pending,
    },
    {
      label: "Return & exchange requests",
      href: "/dashboard/returns",
      count: overview.returns.pending,
    },
    {
      label: "Out of stock products",
      href: "/dashboard/products",
      count: overview.products.outOfStock,
    },
  ].filter((item) => item.count > 0);

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Dashboard"
        description="Live overview of store performance and items needing attention."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <DashboardCharts overview={overview} monthlySales={monthlySales} />

        <section className="space-y-4">
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-neutral-900">Recent orders</h2>
              <Link href="/dashboard/orders" className="text-sm font-medium text-rc-accent hover:underline">
                View all
              </Link>
            </div>
            <DashboardTable>
              <table className="w-full min-w-[520px] border-collapse text-left text-sm">
                <DashboardTableHead columns={["Order", "Customer", "Total", "Status", "Date"]} />
                <tbody className="divide-y divide-neutral-100">
                  {recentOrders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-neutral-500">
                        No orders yet
                      </td>
                    </tr>
                  ) : (
                    recentOrders.map((order) => (
                      <tr key={order.id} className="text-neutral-800">
                        <td className="whitespace-nowrap px-4 py-3 font-semibold text-neutral-900">
                          <Link
                            href={`/dashboard/orders/${order.id}`}
                            className="hover:text-rc-accent hover:underline"
                          >
                            {order.orderNumber}
                          </Link>
                        </td>
                        <td className="px-4 py-3">{order.customer}</td>
                        <td className="whitespace-nowrap px-4 py-3 font-medium">{order.total}</td>
                        <td className="px-4 py-3">
                          <StatusBadge status={order.status} />
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-neutral-500">{order.date}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </DashboardTable>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-neutral-900">Needs attention</h2>
            {attentionItems.length === 0 ? (
              <p className="mt-3 text-sm text-neutral-500">Everything looks good — no pending actions.</p>
            ) : (
              <ul className="mt-3 space-y-3 text-sm">
                {attentionItems.map((item) => (
                  <li key={item.label} className="flex items-center justify-between gap-2">
                    <Link href={item.href} className="text-rc-accent hover:underline">
                      {item.label}
                    </Link>
                    <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-900">
                      {item.count}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-neutral-900">Top selling</h2>
            {(analytics.topSellingProducts ?? []).filter(Boolean).length === 0 ? (
              <p className="mt-3 text-sm text-neutral-500">No sales data yet.</p>
            ) : (
              <ul className="mt-3 space-y-3 text-sm">
                {(analytics.topSellingProducts ?? [])
                  .filter(Boolean)
                  .slice(0, 5)
                  .map((row) => (
                    <li
                      key={row!.product?.id ?? row!.product?.slug}
                      className="flex items-center justify-between gap-2"
                    >
                      <span className="min-w-0 truncate font-medium text-neutral-900">
                        {row!.product?.title ?? "Unknown product"}
                      </span>
                      <span className="shrink-0 text-xs font-semibold text-neutral-500">
                        {row!.quantitySold} sold
                      </span>
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
