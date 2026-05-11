import Image from "next/image";
import Link from "next/link";
import type { ProductItem } from "@/lib/data/products";

function Star() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-3 w-3 text-emerald-600"
      aria-hidden
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.539 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81H7.03a1 1 0 00.95-.69l1.07-3.292z" />
    </svg>
  );
}

export type ProductCardProps = {
  product: ProductItem;
  /** Link for the product image + title area. Defaults to `/shop/[id]`. */
  href?: string;
};

export function ProductCard({ product, href }: ProductCardProps) {
  const productHref = href ?? `/product/${product.id}`;

  return (
    <article className="flex h-full min-h-0 flex-col overflow-hidden rounded-md border border-rc-border bg-white">
      <Link
        href={productHref}
        className="relative block aspect-[16/9] w-full shrink-0 overflow-hidden"
      >
        <Image
          src={product.imageSrc}
          alt={product.imageAlt}
          fill
          sizes="(max-width: 768px) 50vw, min(25vw, 320px)"
          className="object-cover transition-transform duration-300 hover:scale-105"
        />
        {product.tag ? (
          <span
            className={`absolute left-2 top-2 rounded px-1.5 py-0.5 text-[10px] font-semibold text-white ${
              product.tag === "Editor's Pick"
                ? "bg-rc-navy"
                : product.tag === "Bestseller"
                  ? "bg-emerald-600"
                  : "bg-orange-500"
            }`}
          >
            {product.tag}
          </span>
        ) : null}
      </Link>
      <div className="flex flex-1 flex-col space-y-1 p-2.5">
        <div className="flex items-center gap-1.5 text-[11px] text-rc-navy">
          <span className="font-semibold">{product.rating.toFixed(1)}</span>
          <Star />
          <span className="h-3 w-px shrink-0 bg-rc-border" aria-hidden />
          <span className="text-rc-muted">{product.reviews}</span>
        </div>
        <Link href={productHref} className="block min-w-0">
          <p className="truncate text-xs font-bold text-rc-navy md:text-sm">
            {product.brand}
          </p>
          <p className="line-clamp-2 text-[11px] font-normal text-rc-muted md:text-xs">
            {product.name}
          </p>
          <p className="mt-0.5 text-[10px] font-medium text-rc-muted md:text-[11px]">
            {product.dimensions}
          </p>
        </Link>
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 pt-0.5">
          <span className="text-sm font-bold text-rc-navy md:text-base">
            ₹{product.price}
          </span>
          <span className="text-xs text-rc-muted-light line-through">
            ₹{product.mrp}
          </span>
          <span className="text-[11px] font-medium text-orange-400">
            ({product.discountPercent}% OFF)
          </span>
        </div>
      </div>
    </article>
  );
}
