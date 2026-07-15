import Image from "next/image";

const PILLARS = [
  {
    id: "fabric",
    title: "Finest Quality Fabric",
    body: "We choose yarns for body and longevity — so every Rugs Bhadohi piece feels solid underfoot and holds its look through years of real living.",
    imageSrc:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&h=700&fit=crop",
    imageAlt: "Quality yarn and textile materials for rug making",
  },
  {
    id: "plush",
    title: "Soft & Plush",
    body: "From low, tidy piles to deeper comfort under bare feet, our finishes are made for rooms you actually use — inviting, quiet, and easy to settle into.",
    imageSrc:
      "https://images.unsplash.com/photo-1615529328331-f8917597711f?w=900&h=700&fit=crop",
    imageAlt: "Soft textured rug surface samples",
  },
  {
    id: "hand",
    title: "Woven By Hand",
    body: "Finished in Bhadohi workshops by skilled weavers, each rug carries careful knotting and fair, steady work — never a rushed machine replica.",
    imageSrc:
      "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=900&h=700&fit=crop",
    imageAlt: "Handwoven rug craftsmanship detail",
  },
] as const;

export function PdpCraftPillarsSection() {
  return (
    <section
      className="mt-14 border-t border-rc-border pt-10 md:mt-16 md:pt-12"
      aria-label="Craft values"
    >
      <ul className="grid gap-10 sm:grid-cols-3 sm:gap-6 lg:gap-10">
        {PILLARS.map((pillar) => (
          <li key={pillar.id} className="text-center">
            <div className="relative mx-auto aspect-[5/4] w-full max-w-md overflow-hidden bg-rc-surface">
              <Image
                src={pillar.imageSrc}
                alt={pillar.imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 33vw"
              />
            </div>
            <h3 className="mt-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-rc-navy md:text-xs">
              {pillar.title}
            </h3>
            <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-rc-navy md:text-[15px] md:leading-7">
              {pillar.body}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
