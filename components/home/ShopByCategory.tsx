import Image from "next/image";
import Link from "next/link";
import type { CategoryItem } from "@/lib/data/categories";

export function ShopByCategory({ categories }: { categories: CategoryItem[] }) {
  return (
    <section
      className="bg-white pt-6 pb-4 md:pt-8 md:pb-5"
      aria-label="Shop by category"
    >
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="mb-8 text-center font-heading text-2xl font-semibold tracking-tight text-rc-navy md:mb-10 md:text-3xl">
          Categories
        </h2>

        <div className="-mx-4 flex gap-5 overflow-x-auto px-4 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] md:hidden [&::-webkit-scrollbar]:hidden">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/shop?category=${cat.slug}`}
              className="group flex w-[9.5rem] shrink-0 flex-col items-center gap-3"
            >
              <span className="relative aspect-square w-full overflow-hidden bg-rc-surface">
                <Image
                  src={cat.imageSrc}
                  alt={cat.imageAlt}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  sizes="152px"
                />
              </span>
              <span className="text-center text-sm font-medium text-rc-navy">
                {cat.label}
              </span>
            </Link>
          ))}
        </div>

        <div className="hidden gap-6 md:grid md:grid-cols-3 lg:grid-cols-6 lg:gap-5">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/shop?category=${cat.slug}`}
              className="group flex flex-col items-center gap-3"
            >
              <span className="relative aspect-square w-full overflow-hidden bg-rc-surface">
                <Image
                  src={cat.imageSrc}
                  alt={cat.imageAlt}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  sizes="(min-width: 1024px) 12vw, 22vw"
                />
              </span>
              <span className="text-center text-sm font-medium text-rc-navy md:text-[15px]">
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
