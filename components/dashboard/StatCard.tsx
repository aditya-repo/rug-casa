import Link from "next/link";

type StatCardProps = {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral" | "warn";
  href?: string;
};

const trendClass: Record<StatCardProps["trend"], string> = {
  up: "text-emerald-700 bg-emerald-50",
  down: "text-red-700 bg-red-50",
  neutral: "text-neutral-600 bg-neutral-100",
  warn: "text-amber-800 bg-amber-50",
};

export function StatCard({ label, value, change, trend, href }: StatCardProps) {
  const inner = (
    <>
      <p className="text-sm font-medium text-neutral-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900">{value}</p>
      <span
        className={`mt-2 inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${trendClass[trend]}`}
      >
        {change}
      </span>
    </>
  );

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm transition-colors hover:border-neutral-300">
      {href ? (
        <Link href={href} className="block">
          {inner}
        </Link>
      ) : (
        inner
      )}
    </div>
  );
}
