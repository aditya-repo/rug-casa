import Image from "next/image";
import Link from "next/link";
import type { ProductItem } from "@/lib/data/products";

function FeaturedRugCard({ product }: { product: ProductItem }) {
  return (
    <Link
      href={`/product/${product.id}`}
      className="group relative block aspect-[5/5.5] overflow-hidden rounded-2xl bg-rc-surface shadow-[0_10px_28px_rgba(26,39,68,0.08)] transition-transform duration-300 hover:-translate-y-0.5 md:rounded-[1.25rem]"
    >
      {product.imageSrc ? (
        <Image
          src={product.imageSrc}
          alt={product.imageAlt}
          fill
          sizes="(max-width: 768px) 45vw, 22vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      ) : null}

      <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

      <span className="absolute right-3 top-3 z-10 rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold tracking-wide text-neutral-900 shadow-sm md:right-4 md:top-4 md:text-[11px]">
        Featured
      </span>

      <span className="absolute inset-x-0 bottom-0 z-10 p-3.5 md:p-4">
        <span className="block font-heading text-base font-semibold leading-tight text-white md:text-lg">
          {product.name}
        </span>
        <span className="mt-1 block text-[11px] leading-snug text-white/85 md:text-xs">
          {product.dimensions || "Handwoven carpet rug"}
        </span>
      </span>
    </Link>
  );
}

export function FeaturedRugsSection({ products }: { products: ProductItem[] }) {
  const items = products.slice(0, 8);

  if (items.length === 0) return null;

  return (
    <section
      className="relative overflow-hidden rounded-none px-4 py-10 md:py-14"
      aria-labelledby="featured-rugs-heading"
      style={{
        backgroundColor: "#f7f5f2",
        backgroundImage:
          "linear-gradient(rgba(26,39,68,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(26,39,68,0.045) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            id="featured-rugs-heading"
            className="font-heading text-3xl font-semibold tracking-tight text-rc-navy md:text-4xl"
          >
            Featured Rugs
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-rc-muted md:text-[15px]">
            Handpicked pieces from our workshop — selected for craft, design, and
            how they transform a room.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:mt-10 md:grid-cols-4 md:gap-5">
          {items.map((product) => (
            <FeaturedRugCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-8 flex justify-center md:mt-10">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-full bg-rc-navy-dark px-6 py-2.5 text-xs font-semibold tracking-[0.14em] text-white transition-colors hover:bg-rc-navy md:text-[13px]"
          >
            VIEW ALL
            <span aria-hidden className="text-sm leading-none">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
