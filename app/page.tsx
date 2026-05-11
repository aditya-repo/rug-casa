import { HeroCarousel } from "@/components/home/HeroCarousel";
import { ProductShowcase } from "@/components/home/ProductShowcase";
import { ShopByCategory } from "@/components/home/ShopByCategory";
import { TrustBar } from "@/components/home/TrustBar";
import { HeaderAndNav } from "@/components/layout/HeaderAndNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { UtilityBar } from "@/components/layout/UtilityBar";

export default function Home() {
  return (
    <div className="flex min-h-full flex-col bg-white">
      <UtilityBar />
      <HeaderAndNav />
      <main className="flex-1">
        <ShopByCategory />
        <HeroCarousel />
        <ProductShowcase />
        <TrustBar />
      </main>
      <SiteFooter />
    </div>
  );
}
