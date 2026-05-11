export type ProductItem = {
  id: string;
  brand: string;
  name: string;
  /** Display size for listings, e.g. `5 x 7 ft` or `6 ft (round)`. */
  dimensions: string;
  /** Sale price (formatted, no currency symbol). */
  price: string;
  /** Original MRP before discount (formatted, no currency symbol). */
  mrp: string;
  discountPercent: number;
  rating: number;
  reviews: number;
  tag?: string;
  imageSrc: string;
  imageAlt: string;
};

export const newArrivals: ProductItem[] = [
  {
    id: "na-medallion",
    brand: "RugCasa",
    name: "Persian Medallion Rug",
    dimensions: "5 x 7 ft",
    price: "4,999",
    mrp: "7,999",
    discountPercent: 38,
    rating: 4.5,
    reviews: 120,
    tag: "Bestseller",
    imageSrc:
      "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=800&h=520&fit=crop",
    imageAlt: "Persian medallion rug in a living room",
  },
  {
    id: "na-abstract",
    brand: "RugCasa",
    name: "Modern Abstract Rug",
    dimensions: "6 x 9 ft",
    price: "3,499",
    mrp: "4,799",
    discountPercent: 27,
    rating: 4.4,
    reviews: 98,
    tag: "New",
    imageSrc:
      "https://images.unsplash.com/photo-1615529328331-f8917597711f?w=800&h=520&fit=crop",
    imageAlt: "Modern abstract rug",
  },
  {
    id: "na-boho",
    brand: "RugCasa",
    name: "Boho Patterned Rug",
    dimensions: "4 x 6 ft",
    price: "2,999",
    mrp: "3,699",
    discountPercent: 19,
    rating: 4.6,
    reviews: 75,
    tag: "New",
    imageSrc:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&h=520&fit=crop",
    imageAlt: "Boho patterned rug",
  },
  {
    id: "na-traditional",
    brand: "RugCasa",
    name: "Traditional Motif Rug",
    dimensions: "8 x 10 ft",
    price: "5,499",
    mrp: "6,999",
    discountPercent: 21,
    rating: 4.7,
    reviews: 66,
    tag: "New",
    imageSrc:
      "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=800&h=520&fit=crop",
    imageAlt: "Traditional motif rug",
  },
  {
    id: "na-jute",
    brand: "RugCasa",
    name: "Jute Braided Rug",
    dimensions: "3 x 5 ft",
    price: "2,499",
    mrp: "3,299",
    discountPercent: 24,
    rating: 4.3,
    reviews: 40,
    tag: "New",
    imageSrc:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=520&fit=crop",
    imageAlt: "Jute braided rug",
  },
];

export const trendingNow: ProductItem[] = [
  {
    id: "tr-vintage",
    brand: "RugCasa",
    name: "Vintage Distressed Rug",
    dimensions: "5 x 8 ft",
    price: "3,199",
    mrp: "4,199",
    discountPercent: 24,
    rating: 4.5,
    reviews: 107,
    tag: "Bestseller",
    imageSrc:
      "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?w=800&h=520&fit=crop",
    imageAlt: "Vintage distressed rug",
  },
  {
    id: "tr-rugged",
    brand: "RugCasa",
    name: "Rugged Runner Rug",
    dimensions: "2.5 x 8 ft",
    price: "2,899",
    mrp: "3,699",
    discountPercent: 22,
    rating: 4.4,
    reviews: 86,
    tag: "Bestseller",
    imageSrc:
      "https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=800&h=520&fit=crop",
    imageAlt: "Runner rug in hallway",
  },
  {
    id: "tr-floral",
    brand: "RugCasa",
    name: "Floral Heritage Rug",
    dimensions: "6 x 9 ft",
    price: "3,799",
    mrp: "4,999",
    discountPercent: 24,
    rating: 4.6,
    reviews: 63,
    tag: "Bestseller",
    imageSrc:
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=520&fit=crop",
    imageAlt: "Floral patterned rug",
  },
  {
    id: "tr-minimal",
    brand: "RugCasa",
    name: "Minimal Living Rug",
    dimensions: "8 x 10 ft",
    price: "4,299",
    mrp: "5,499",
    discountPercent: 22,
    rating: 4.7,
    reviews: 74,
    tag: "Bestseller",
    imageSrc:
      "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=800&h=520&fit=crop",
    imageAlt: "Minimal interior with rug",
  },
  {
    id: "tr-textured",
    brand: "RugCasa",
    name: "Textured Weave Rug",
    dimensions: "4 x 6 ft",
    price: "2,699",
    mrp: "3,499",
    discountPercent: 23,
    rating: 4.4,
    reviews: 51,
    tag: "Bestseller",
    imageSrc:
      "https://images.unsplash.com/photo-1615529328331-f8917597711f?w=800&h=520&fit=crop",
    imageAlt: "Textured weave rug",
  },
];

export const editorsPicks: ProductItem[] = [
  {
    id: "ep-kilim",
    brand: "RugCasa",
    name: "Kilim Flatweave Area Rug",
    dimensions: "5 x 7 ft",
    price: "3,599",
    mrp: "4,899",
    discountPercent: 27,
    rating: 4.6,
    reviews: 142,
    tag: "Editor's Pick",
    imageSrc:
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&h=520&fit=crop",
    imageAlt: "Colorful kilim style flatweave rug",
  },
  {
    id: "ep-ombre",
    brand: "RugCasa",
    name: "Ombre Wool Blend Rug",
    dimensions: "6 x 9 ft",
    price: "4,199",
    mrp: "5,499",
    discountPercent: 24,
    rating: 4.5,
    reviews: 88,
    tag: "Editor's Pick",
    imageSrc:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=520&fit=crop",
    imageAlt: "Soft ombre rug in a living room",
  },
  {
    id: "ep-berber",
    brand: "RugCasa",
    name: "Berber Inspired Shag Rug",
    dimensions: "5 x 8 ft",
    price: "3,899",
    mrp: "5,199",
    discountPercent: 25,
    rating: 4.7,
    reviews: 201,
    tag: "Editor's Pick",
    imageSrc:
      "https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=800&h=520&fit=crop",
    imageAlt: "Plush berber style rug",
  },
  {
    id: "ep-geometric",
    brand: "RugCasa",
    name: "Geometric Low-Pile Rug",
    dimensions: "3 x 5 ft",
    price: "2,799",
    mrp: "3,699",
    discountPercent: 24,
    rating: 4.4,
    reviews: 56,
    tag: "Editor's Pick",
    imageSrc:
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=520&fit=crop",
    imageAlt: "Geometric pattern rug at entryway",
  },
  {
    id: "ep-sisal",
    brand: "RugCasa",
    name: "Natural Sisal Border Rug",
    dimensions: "6 x 9 ft",
    price: "3,299",
    mrp: "4,299",
    discountPercent: 23,
    rating: 4.3,
    reviews: 67,
    tag: "Editor's Pick",
    imageSrc:
      "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=800&h=520&fit=crop",
    imageAlt: "Natural fiber sisal rug",
  },
];

export const roomEssentials: ProductItem[] = [
  {
    id: "re-runner",
    brand: "RugCasa",
    name: "Slim Hallway Runner",
    dimensions: "2 x 10 ft",
    price: "1,899",
    mrp: "2,499",
    discountPercent: 24,
    rating: 4.5,
    reviews: 312,
    tag: "Popular",
    imageSrc:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&h=520&fit=crop",
    imageAlt: "Long runner rug in hallway",
  },
  {
    id: "re-round",
    brand: "RugCasa",
    name: "Round Jute Accent Rug",
    dimensions: "6 ft (round)",
    price: "2,199",
    mrp: "2,899",
    discountPercent: 24,
    rating: 4.6,
    reviews: 94,
    tag: "Popular",
    imageSrc:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=520&fit=crop",
    imageAlt: "Round jute rug under furniture",
  },
  {
    id: "re-doormat",
    brand: "RugCasa",
    name: "Heavy Duty Door Mat",
    dimensions: "2 x 3 ft",
    price: "899",
    mrp: "1,299",
    discountPercent: 31,
    rating: 4.2,
    reviews: 428,
    tag: "Popular",
    imageSrc:
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=520&fit=crop",
    imageAlt: "Durable door mat",
  },
  {
    id: "re-kids",
    brand: "RugCasa",
    name: "Playroom Washable Rug",
    dimensions: "5 x 7 ft",
    price: "2,499",
    mrp: "3,299",
    discountPercent: 24,
    rating: 4.5,
    reviews: 73,
    tag: "Popular",
    imageSrc:
      "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?w=800&h=520&fit=crop",
    imageAlt: "Colorful kids room rug",
  },
  {
    id: "re-outdoor",
    brand: "RugCasa",
    name: "Outdoor Patio Rug",
    dimensions: "5 x 8 ft",
    price: "2,599",
    mrp: "3,499",
    discountPercent: 26,
    rating: 4.4,
    reviews: 115,
    tag: "Popular",
    imageSrc:
      "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=800&h=520&fit=crop",
    imageAlt: "Outdoor patio area rug",
  },
];

/** Full catalog for listing / PLP (deduped by `id`). */
export const catalogProducts: ProductItem[] = (() => {
  const merged = [
    ...newArrivals,
    ...trendingNow,
    ...editorsPicks,
    ...roomEssentials,
  ];
  const seen = new Set<string>();
  return merged.filter((p) => {
    if (seen.has(p.id)) return false;
    seen.add(p.id);
    return true;
  });
})();

export function getProductById(id: string): ProductItem | undefined {
  return catalogProducts.find((p) => p.id === id);
}
