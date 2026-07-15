import type { Metadata } from "next";
import { ContactPageContent } from "@/components/contact/ContactPageContent";
import { HeaderAndNav } from "@/components/layout/HeaderAndNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { company } from "@/lib/data/company";

export const metadata: Metadata = {
  title: `${company.contactPage.title} — ${company.brandName}`,
  description: company.contactPage.intro,
};

export default function ContactPage() {
  return (
    <div className="flex min-h-full flex-col bg-white">
      <HeaderAndNav />
      <main className="flex-1">
        <ContactPageContent />
      </main>
      <SiteFooter />
    </div>
  );
}
