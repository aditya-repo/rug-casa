export type CategoryItem = {
  slug: string;
  label: string;
  imageSrc: string;
  imageAlt: string;
};

/** Single source for Shop by Category (no hero sidebar). */
export const categories: CategoryItem[] = [
  {
    slug: "area-rugs",
    label: "Area Rugs",
    imageSrc:
      "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=400&h=400&fit=crop",
    imageAlt: "Patterned area rug in a living space",
  },
  {
    slug: "carpets",
    label: "Carpets",
    imageSrc:
      "https://images.unsplash.com/photo-1615529328331-f8917597711f?w=400&h=400&fit=crop",
    imageAlt: "Wall-to-wall style carpet texture",
  },
  {
    slug: "runner-rugs",
    label: "Runner Rugs",
    imageSrc:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=400&h=400&fit=crop",
    imageAlt: "Long runner rug in a hallway",
  },
  {
    slug: "round-rugs",
    label: "Round Rugs",
    imageSrc:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    imageAlt: "Round rug under a table",
  },
  {
    slug: "door-mats",
    label: "Door Mats",
    imageSrc:
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400&h=400&fit=crop",
    imageAlt: "Welcome mat at entrance",
  },
  {
    slug: "shaggy-rugs",
    label: "Shaggy Rugs",
    imageSrc:
      "https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=400&h=400&fit=crop",
    imageAlt: "Plush shag rug texture",
  },
  {
    slug: "kids-rugs",
    label: "Kids Rugs",
    imageSrc:
      "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?w=400&h=400&fit=crop",
    imageAlt: "Colorful rug in a kids room",
  },
  {
    slug: "outdoor-rugs",
    label: "Outdoor Rugs",
    imageSrc:
      "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=400&h=400&fit=crop",
    imageAlt: "Outdoor patio rug",
  },
];
