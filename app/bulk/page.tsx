import type { Metadata } from "next";
import { BulkOrdersContent } from "@/components/bulk/BulkOrdersContent";
import { HeaderAndNav } from "@/components/layout/HeaderAndNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { company } from "@/lib/data/company";

export const metadata: Metadata = {
  title: `Wholesale & Bulk Orders — ${company.brandName}`,
  description: `Source wholesale and custom handmade rugs from ${company.brandName} in Bhadohi. Trade pricing, project programmes, and export shipping.`,
};

export default function BulkOrdersPage() {
  return (
    <div className="flex min-h-full flex-col bg-white">
      <HeaderAndNav />
      <main className="flex-1">
        <BulkOrdersContent />
      </main>
      <SiteFooter />
    </div>
  );
}
