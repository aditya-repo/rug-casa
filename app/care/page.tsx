import type { Metadata } from "next";
import { CareGuideContent } from "@/components/care/CareGuideContent";
import { HeaderAndNav } from "@/components/layout/HeaderAndNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { company } from "@/lib/data/company";

export const metadata: Metadata = {
  title: `Care Guide — ${company.brandName}`,
  description: `Washing and care tips for handmade rugs from ${company.brandName}. Learn how to vacuum, treat spills, rotate, and protect your carpet.`,
};

export default function CareGuidePage() {
  return (
    <div className="flex min-h-full flex-col bg-white">
      <HeaderAndNav />
      <main className="flex-1">
        <CareGuideContent />
      </main>
      <SiteFooter />
    </div>
  );
}
