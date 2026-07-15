import type { Metadata } from "next";
import { RefundPolicyContent } from "@/components/legal/RefundPolicyContent";
import { HeaderAndNav } from "@/components/layout/HeaderAndNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { company } from "@/lib/data/company";

export const metadata: Metadata = {
  title: `Refund Policy — ${company.brandName}`,
  description: `${company.brandName} ${company.refundPolicy.returnWindowDays}-day return and refund policy for eligible handmade rugs and carpets.`,
};

export default function RefundPolicyPage() {
  return (
    <div className="flex min-h-full flex-col bg-white">
      <HeaderAndNav />
      <main className="flex-1">
        <RefundPolicyContent />
      </main>
      <SiteFooter />
    </div>
  );
}
