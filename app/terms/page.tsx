import type { Metadata } from "next";
import { TermsOfServiceContent } from "@/components/legal/TermsOfServiceContent";
import { HeaderAndNav } from "@/components/layout/HeaderAndNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { company } from "@/lib/data/company";

export const metadata: Metadata = {
  title: `Terms of Service — ${company.brandName}`,
  description: `Terms of Service for shopping with ${company.brandName}, including accounts, orders, payments, shipping, and liability.`,
};

export default function TermsOfServicePage() {
  return (
    <div className="flex min-h-full flex-col bg-white">
      <HeaderAndNav />
      <main className="flex-1">
        <TermsOfServiceContent />
      </main>
      <SiteFooter />
    </div>
  );
}
