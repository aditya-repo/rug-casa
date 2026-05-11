import Image from "next/image";
import Link from "next/link";
import { categories } from "@/lib/data/categories";

export function ShopByCategory() {
  return (
    <section
      className="border-b border-rc-border bg-white py-4 md:py-5"
      aria-label="Shop by category"
    >
      <div className="mx-auto max-w-7xl px-4">
        <div
          className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-8 md:gap-3 md:overflow-visible md:px-0 md:pb-0 [&::-webkit-scrollbar]:hidden"
        >
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/shop?category=${cat.slug}`}
              className="flex w-[4.5rem] shrink-0 flex-col items-center gap-0.5 md:w-[4.75rem] md:justify-self-center"
            >
              <span className="relative h-[4.5rem] w-[4.5rem] shrink-0 overflow-hidden rounded-full border border-rc-border bg-rc-surface shadow-sm md:h-[4.75rem] md:w-[4.75rem]">
                <Image
                  src={cat.imageSrc}
                  alt={cat.imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 72px, 76px"
                />
              </span>
              <span className="max-w-[5rem] text-center text-[11px] font-medium leading-tight text-rc-navy md:max-w-none md:text-xs">
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
