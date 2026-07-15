import type { Metadata } from "next";
import { PrivacyPolicyContent } from "@/components/legal/PrivacyPolicyContent";
import { HeaderAndNav } from "@/components/layout/HeaderAndNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { company } from "@/lib/data/company";

export const metadata: Metadata = {
  title: `Privacy Policy — ${company.brandName}`,
  description: `How ${company.brandName} collects, uses, and protects your personal information when you shop or communicate with us.`,
};

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-full flex-col bg-white">
      <HeaderAndNav />
      <main className="flex-1">
        <PrivacyPolicyContent />
      </main>
      <SiteFooter />
    </div>
  );
}
