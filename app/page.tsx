import { FaqSection } from "@/components/home/FaqSection";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { ProductShowcase } from "@/components/home/ProductShowcase";
import { ShopByCategory } from "@/components/home/ShopByCategory";
import { TrustBar } from "@/components/home/TrustBar";
import { WovenStories } from "@/components/home/WovenStories";
import { HeaderAndNav } from "@/components/layout/HeaderAndNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { fetchPublicArtistCollection } from "@/lib/api/artist-collection";
import { fetchPublicHomepageBanners } from "@/lib/api/banners";
import { fetchPublicHomepageCategories } from "@/lib/api/categories";
import { fetchPublicFeaturedProducts } from "@/lib/api/featured-products";

export default async function Home() {
  const [heroSlides, categories, artistCollection, featuredProducts] = await Promise.all([
    fetchPublicHomepageBanners(),
    fetchPublicHomepageCategories(),
    fetchPublicArtistCollection(),
    fetchPublicFeaturedProducts(),
  ]);

  return (
    <div className="flex min-h-full flex-col bg-white">
      <HeaderAndNav />
      <main className="flex-1">
        <HeroCarousel slides={heroSlides} />
        <ShopByCategory categories={categories} />
        <ProductShowcase
          artistCollection={artistCollection}
          featuredProducts={featuredProducts}
        />
        <WovenStories />
        <FaqSection />
        <TrustBar />
      </main>
      <SiteFooter />
    </div>
  );
}
