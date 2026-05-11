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

export function ProductShowcase() {
  return (
    <section className="bg-white py-4 md:py-5" aria-label="Product collections">
      <div className="mx-auto max-w-7xl space-y-4 px-4 md:space-y-5">
        <ProductRow title="New Arrivals" products={newArrivals} />
        <ProductRow title="Trending Now" products={trendingNow} />
        <ProductRow title="Editor's Picks" products={editorsPicks} />
        <ProductRow title="Room Essentials" products={roomEssentials} />
      </div>
    </section>
  );
}
