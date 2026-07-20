import { ColorsManager } from "@/components/dashboard/colors/ColorsManager";
import { fetchColors } from "@/lib/api/colors";

export default async function DashboardColorsPage() {
  const { items: colors } = await fetchColors({ limit: 200 });

  return <ColorsManager initialColors={colors} />;
}
