type StatusBadgeProps = {
  status: string;
  variant?: "default" | "success" | "warning" | "danger" | "info" | "muted";
};

const variantClass: Record<NonNullable<StatusBadgeProps["variant"]>, string> = {
  default: "bg-neutral-100 text-neutral-700",
  success: "bg-emerald-50 text-emerald-800",
  warning: "bg-amber-50 text-amber-900",
  danger: "bg-red-50 text-red-700",
  info: "bg-blue-50 text-blue-800",
  muted: "bg-neutral-50 text-neutral-500",
};

const statusVariantMap: Record<string, StatusBadgeProps["variant"]> = {
  active: "success",
  published: "success",
  approved: "success",
  delivered: "success",
  completed: "success",
  paid: "success",
  enabled: "success",
  pending: "warning",
  reported: "warning",
  returned: "warning",
  processing: "info",
  confirmed: "info",
  packed: "info",
  shipped: "info",
  exchanged: "info",
  scheduled: "info",
  draft: "muted",
  inactive: "muted",
  disabled: "muted",
  out_of_stock: "danger",
  cancelled: "danger",
  refunded: "danger",
  rejected: "danger",
  blocked: "danger",
  cod: "warning",
};

function formatStatus(status: string) {
  return status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function StatusBadge({ status, variant }: StatusBadgeProps) {
  const resolved = variant ?? statusVariantMap[status.toLowerCase()] ?? "default";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${variantClass[resolved]}`}
    >
      {formatStatus(status)}
    </span>
  );
}
