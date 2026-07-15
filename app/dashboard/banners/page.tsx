import { BannersManager } from "@/components/dashboard/banners/BannersManager";
import { fetchHomepageBanners } from "@/lib/api/banners";

export default async function DashboardBannersPage() {
  const { items: banners } = await fetchHomepageBanners();

  return <BannersManager initialBanners={banners} />;
}
