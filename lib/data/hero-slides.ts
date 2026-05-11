export type HeroSlide = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  imageSrc: string;
  imageAlt: string;
};

export const heroSlides: HeroSlide[] = [
  {
    id: "comfort",
    eyebrow: "STYLE THAT COMFORTS",
    title: "Beautiful Rugs. Better Spaces.",
    description:
      "Discover handcrafted textures and timeless patterns designed to anchor every room with warmth and character.",
    ctaLabel: "Shop Now",
    ctaHref: "/shop",
    imageSrc:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600&h=900&fit=crop",
    imageAlt: "Bright living room with sectional sofa and large area rug",
  },
  {
    id: "premium",
    eyebrow: "PREMIUM QUALITY",
    title: "Built to Last, Made to Love.",
    description:
      "Premium fibers and expert weaving for rugs that stand up to daily life while staying soft underfoot.",
    ctaLabel: "Shop Best Sellers",
    ctaHref: "/shop",
    imageSrc:
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1600&h=900&fit=crop",
    imageAlt: "Warm-toned area rug on hardwood floors in a home interior",
  },
  {
    id: "shipping",
    eyebrow: "PAN INDIA DELIVERY",
    title: "Free Shipping. Easy Returns.",
    description:
      "Enjoy free shipping across India and hassle-free returns within 7 days on eligible orders.",
    ctaLabel: "View Deals",
    ctaHref: "/shop",
    imageSrc:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1600&h=900&fit=crop",
    imageAlt: "Cozy living space with sofa and textured rug",
  },
  {
    id: "variety",
    eyebrow: "1000+ DESIGNS",
    title: "Find Your Perfect Fit.",
    description:
      "Shop by size, room, material, or style — from minimal solids to bold statement pieces.",
    ctaLabel: "Shop by Category",
    ctaHref: "/shop",
    imageSrc:
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1600&h=900&fit=crop",
    imageAlt: "Decorative rug and welcome mat at a bright entryway",
  },
];
