import type { Metadata } from "next";
import { ShippingPolicyContent } from "@/components/legal/ShippingPolicyContent";
import { HeaderAndNav } from "@/components/layout/HeaderAndNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { company } from "@/lib/data/company";

export const metadata: Metadata = {
  title: `Shipping Policy — ${company.brandName}`,
  description: `Domestic and international shipping timelines, tracking, duties, and cancellation details for ${company.brandName}.`,
};

export default function ShippingPolicyPage() {
  return (
    <div className="flex min-h-full flex-col bg-white">
      <HeaderAndNav />
      <main className="flex-1">
        <ShippingPolicyContent />
      </main>
      <SiteFooter />
    </div>
  );
}
