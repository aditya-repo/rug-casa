import { CollectionsManager } from "@/components/dashboard/collections/CollectionsManager";
import { fetchCollections } from "@/lib/api/collections";

export default async function DashboardCollectionsPage() {
  const { items: collections } = await fetchCollections({ limit: 100 });

  return <CollectionsManager initialCollections={collections} />;
}
