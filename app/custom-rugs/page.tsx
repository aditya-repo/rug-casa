import type { Metadata } from "next";
import { CustomRugsContent } from "@/components/custom/CustomRugsContent";
import { HeaderAndNav } from "@/components/layout/HeaderAndNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { company } from "@/lib/data/company";
import { customRugsContent } from "@/lib/data/custom-rugs";

export const metadata: Metadata = {
  title: `${customRugsContent.title} — ${company.brandName}`,
  description: customRugsContent.intro,
};

export default function CustomRugsPage() {
  return (
    <div className="flex min-h-full flex-col bg-white">
      <HeaderAndNav />
      <main className="flex-1">
        <CustomRugsContent />
      </main>
      <SiteFooter />
    </div>
  );
}
