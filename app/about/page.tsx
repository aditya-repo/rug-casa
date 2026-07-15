import type { Metadata } from "next";
import { AboutCertifications } from "@/components/about/AboutCertifications";
import { AboutGuides } from "@/components/about/AboutGuides";
import { AboutHero } from "@/components/about/AboutHero";
import { AboutStory } from "@/components/about/AboutStory";
import { HeaderAndNav } from "@/components/layout/HeaderAndNav";
import { SiteFooter } from "@/components/layout/SiteFooter";

export const metadata: Metadata = {
  title: "About Us — Rugs Bhadohi",
  description:
    "Learn about Rugs Bhadohi — a Bhadohi-based rug manufacturer and exporter rooted in a family craft tradition since 1946.",
};

export default function AboutPage() {
  return (
    <div className="flex min-h-full flex-col bg-white">
      <HeaderAndNav />
      <main className="flex-1">
        <AboutHero />
        <AboutStory />
        <AboutGuides />
        <AboutCertifications />
      </main>
      <SiteFooter />
    </div>
  );
}
