import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";
import {
  editorsPicks,
  newArrivals,
  roomEssentials,
  trendingNow,
  type ProductItem,
} from "@/lib/data/products";

function ProductRow({
  title,
  products,
}: {
  title: string;
  products: ProductItem[];
}) {
  return (
    <section className="space-y-2.5" aria-label={title}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-rc-navy">{title}</h2>
        <Link href="/shop" className="text-sm font-medium text-rc-navy hover:underline">
          View All
        </Link>
      </div>
      <div className="grid grid-cols-2 items-stretch gap-2.5 md:grid-cols-4 md:gap-3">
        {products.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

function TrendingCarouselSection({ products }: { products: ProductItem[] }) {
  return (
    <section className="space-y-2.5" aria-labelledby="trending-now-heading">
      <div className="flex items-center justify-between">
        <h2 id="trending-now-heading" className="text-xl font-semibold text-rc-navy">
          Trending Now
        </h2>
        <Link href="/shop" className="text-sm font-medium text-rc-navy hover:underline">
          View All
        </Link>
      </div>
      <div className="relative">
        <div
          className="flex snap-x snap-mandatory gap-3 overflow-x-auto overflow-y-hidden scroll-smooth px-1 pb-2 pt-0.5 [-webkit-overflow-scrolling:touch] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:gap-4 md:px-0.5"
          role="region"
          aria-roledescription="carousel"
          aria-label="Trending products"
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="w-[min(46vw,15.25rem)] shrink-0 snap-start sm:w-52 md:w-[14.75rem] lg:w-60"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProductShowcase() {
  return (
    <section className="bg-white py-4 md:py-5" aria-label="Product collections">
      <div className="mx-auto max-w-7xl space-y-4 px-4 md:space-y-5">
        <TrendingCarouselSection products={trendingNow} />
        <ProductRow title="New Arrivals" products={newArrivals} />
        <ProductRow title="Editor's Picks" products={editorsPicks} />
        <ProductRow title="Room Essentials" products={roomEssentials} />
      </div>
    </section>
  );
}
