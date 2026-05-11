import Image from "next/image";
import Link from "next/link";
import type { CategoryItem } from "@/lib/data/categories";

type CategoriesGridProps = {
  categories: CategoryItem[];
};

export function CategoriesGrid({ categories }: CategoriesGridProps) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:gap-4">
      {categories.map((cat) => (
        <li key={cat.slug} className="min-w-0">
          <Link
            href={`/shop?category=${cat.slug}`}
            className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rc-navy"
          >
            <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-rc-border bg-rc-surface shadow-sm">
              <Image
                src={cat.imageSrc}
                alt={cat.imageAlt}
                fill
                sizes="(max-width: 640px) 50vw, 360px"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent px-2 pb-3 pt-10">
                <p className="text-center text-sm font-semibold leading-tight text-white drop-shadow-sm sm:text-base">
                  {cat.label}
                </p>
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
