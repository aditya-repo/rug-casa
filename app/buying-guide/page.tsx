import type { Metadata } from "next";
import { BuyingGuideContent } from "@/components/buying-guide/BuyingGuideContent";
import { HeaderAndNav } from "@/components/layout/HeaderAndNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { buyingGuideContent } from "@/lib/data/buying-guide";
import { company } from "@/lib/data/company";

export const metadata: Metadata = {
  title: `${buyingGuideContent.title} — ${company.brandName}`,
  description: buyingGuideContent.intro[0],
};

export default function BuyingGuidePage() {
  return (
    <div className="flex min-h-full flex-col bg-white">
      <HeaderAndNav />
      <main className="flex-1">
        <BuyingGuideContent />
      </main>
      <SiteFooter />
    </div>
  );
}
