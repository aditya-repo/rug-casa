"use client";

import { formatCurrency } from "@/lib/api/mappers";
import type { DashboardOverview, MonthlySale } from "@/lib/api/dashboard";

type DashboardChartsProps = {
  overview: DashboardOverview;
  monthlySales: MonthlySale[];
};

function monthLabel(key: string) {
  const [y, m] = key.split("-").map(Number);
  const date = new Date(y, (m || 1) - 1, 1);
  return date.toLocaleString("en-IN", { month: "short" });
}

function RevenueLineChart({ data }: { data: MonthlySale[] }) {
  const width = 560;
  const height = 200;
  const padX = 12;
  const padTop = 16;
  const padBottom = 28;
  const chartW = width - padX * 2;
  const chartH = height - padTop - padBottom;
  const max = Math.max(...data.map((d) => d.revenue), 1);
  const n = Math.max(data.length - 1, 1);

  const points = data.map((point, i) => {
    const x = padX + (i / n) * chartW;
    const y = padTop + chartH - (point.revenue / max) * chartH;
    return { ...point, x, y };
  });

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
    .join(" ");

  const areaPath = [
    `M ${points[0]?.x.toFixed(2) ?? padX} ${(padTop + chartH).toFixed(2)}`,
    ...points.map((p) => `L ${p.x.toFixed(2)} ${p.y.toFixed(2)}`),
    `L ${points[points.length - 1]?.x.toFixed(2) ?? padX} ${(padTop + chartH).toFixed(2)}`,
    "Z",
  ].join(" ");

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-52 w-full"
        role="img"
        aria-label="Monthly revenue line chart"
      >
        {[0.25, 0.5, 0.75, 1].map((tick) => {
          const y = padTop + chartH * (1 - tick);
          return (
            <line
              key={tick}
              x1={padX}
              x2={width - padX}
              y1={y}
              y2={y}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          );
        })}

        <path d={areaPath} fill="rgba(26, 39, 68, 0.08)" />
        <path
          d={linePath}
          fill="none"
          stroke="#1a2744"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {points.map((p) => (
          <g key={p.month}>
            <circle cx={p.x} cy={p.y} r="4" fill="#fff" stroke="#1a2744" strokeWidth="2">
              <title>
                {monthLabel(p.month)}: {formatCurrency(p.revenue)}
              </title>
            </circle>
            <text
              x={p.x}
              y={height - 8}
              textAnchor="middle"
              className="fill-neutral-500"
              fontSize="11"
            >
              {monthLabel(p.month)}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function PieChart({
  title,
  segments,
  centerLabel = "total",
}: {
  title: string;
  segments: Array<{ label: string; value: number; color: string }>;
  centerLabel?: string;
}) {
  const size = 180;
  const cx = size / 2;
  const cy = size / 2;
  const radius = 68;
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  const visible = segments.filter((s) => s.value > 0);

  let angle = -Math.PI / 2;
  const slices =
    total === 0
      ? []
      : visible.map((seg) => {
          const slice = (seg.value / total) * Math.PI * 2;
          const start = angle;
          const end = angle + slice;
          angle = end;

          const x1 = cx + radius * Math.cos(start);
          const y1 = cy + radius * Math.sin(start);
          const x2 = cx + radius * Math.cos(end);
          const y2 = cy + radius * Math.sin(end);
          const largeArc = slice > Math.PI ? 1 : 0;

          if (visible.length === 1) {
            return {
              ...seg,
              path: `M ${cx} ${cy - radius} A ${radius} ${radius} 0 1 1 ${cx - 0.01} ${cy - radius} Z`,
            };
          }

          return {
            ...seg,
            path: `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`,
          };
        });

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-neutral-900">{title}</h3>
        <span className="text-xs text-neutral-500">{total} total</span>
      </div>

      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="h-44 w-44 shrink-0"
          role="img"
          aria-label={title}
        >
          {total === 0 ? (
            <circle cx={cx} cy={cy} r={radius} fill="#e5e7eb" />
          ) : (
            slices.map((slice) => (
              <path key={slice.label} d={slice.path} fill={slice.color}>
                <title>
                  {slice.label}: {slice.value} (
                  {total ? Math.round((slice.value / total) * 100) : 0}%)
                </title>
              </path>
            ))
          )}
          <circle cx={cx} cy={cy} r={38} fill="#fff" />
          <text
            x={cx}
            y={cy - 4}
            textAnchor="middle"
            className="fill-neutral-900"
            fontSize="18"
            fontWeight="600"
          >
            {total}
          </text>
          <text
            x={cx}
            y={cy + 14}
            textAnchor="middle"
            className="fill-neutral-500"
            fontSize="10"
          >
            {centerLabel}
          </text>
        </svg>

        <ul className="w-full space-y-2">
          {segments.map((seg) => (
            <li key={seg.label} className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-neutral-600">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: seg.color }}
                  aria-hidden
                />
                {seg.label}
              </span>
              <span className="font-semibold text-neutral-900">
                {seg.value}
                <span className="ml-1 text-xs font-medium text-neutral-400">
                  {total ? `${Math.round((seg.value / total) * 100)}%` : "0%"}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function DashboardCharts({ overview, monthlySales }: DashboardChartsProps) {
  const orderSegments = [
    { label: "Pending", value: overview.orders.pending, color: "#f59e0b" },
    { label: "Delivered", value: overview.orders.completed, color: "#10b981" },
    {
      label: "Other active",
      value: Math.max(
        0,
        overview.orders.total -
          overview.orders.pending -
          overview.orders.completed -
          overview.orders.cancelled,
      ),
      color: "#1a2744",
    },
    { label: "Cancelled", value: overview.orders.cancelled, color: "#d1d5db" },
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm md:p-5">
        <PieChart title="Orders by status" segments={orderSegments} centerLabel="orders" />
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm md:p-5">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold text-neutral-900">Revenue trend</h2>
            <p className="mt-0.5 text-xs text-neutral-500">Last 6 months · non-cancelled orders</p>
          </div>
          <p className="text-sm font-semibold text-rc-navy">
            {formatCurrency(overview.revenue)}
            <span className="ml-1 text-xs font-medium text-neutral-500">lifetime</span>
          </p>
        </div>
        <RevenueLineChart data={monthlySales} />
      </div>
    </div>
  );
}
