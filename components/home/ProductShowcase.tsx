import { ArtistCollectionCarousel } from "@/components/home/ArtistCollectionCarousel";
import { CompanyIntroSection } from "@/components/home/CompanyIntroSection";
import { FeaturedRugsSection } from "@/components/home/FeaturedRugsSection";
import type { ArtistCollectionItem } from "@/lib/data/artist-collection";
import type { ProductItem } from "@/lib/data/products";

export function ProductShowcase({
  artistCollection,
  featuredProducts,
}: {
  artistCollection: ArtistCollectionItem[];
  featuredProducts: ProductItem[];
}) {
  return (
    <section className="bg-white pb-4 pt-1 md:pb-5 md:pt-2" aria-label="Product collections">
      <div className="mt-2 md:mt-4">
        <FeaturedRugsSection products={featuredProducts} />
      </div>
      <CompanyIntroSection />
      <div className="mx-auto max-w-7xl px-4 pt-4 md:pt-5">
        <ArtistCollectionCarousel items={artistCollection} />
      </div>
    </section>
  );
}
