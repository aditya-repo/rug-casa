import Image from "next/image";
import Link from "next/link";

const TOP_PILLARS = [
  {
    id: "earth",
    label: "Earth-conscious",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
        <circle cx="12" cy="12" r="9" />
        <path strokeLinecap="round" d="M12 3c2.5 2.8 2.5 7.2 0 10s-2.5 7.2 0 10M3.5 9.5h17M3.5 14.5h17" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.5 4.5c1 .8 1.8 2.2 1.2 3.5-.8 1.6-2.6.6-3.2-.5" />
      </svg>
    ),
  },
  {
    id: "hands",
    label: "Loom-finished",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.5 11c-1.5 0-2.5 1.2-2.5 2.6V17h4.5v-3.4C10.5 12.2 9.8 11 8.5 11zm7 0c-1.3 0-2 1.2-2 2.6V17H18v-3.4c0-1.4-1-2.6-2.5-2.6z"
        />
        <path strokeLinecap="round" d="M12 8.5c1.2-1.4 3.2-1.2 4 .4M12 8.5c-1.2-1.4-3.2-1.2-4 .4" />
        <path strokeLinecap="round" d="M12 9v2.5" />
      </svg>
    ),
  },
  {
    id: "yarn",
    label: "Real fibres only",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
        <circle cx="12" cy="12" r="6.5" />
        <path strokeLinecap="round" d="M12 5.5c2.8 1.2 4.2 3.4 4.2 6.5S14.8 17.3 12 18.5M12 5.5C9.2 6.7 7.8 8.9 7.8 12s1.4 5.3 4.2 6.5" />
        <path strokeLinecap="round" d="M12 18.5V21" />
      </svg>
    ),
  },
] as const;

const TRUST_POINTS = [
  {
    id: "fair",
    label: "Fair wages on every order",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
        <circle cx="12" cy="12" r="8" />
        <path strokeLinecap="round" d="M12 8v8M9.5 10.5c.6-1 1.5-1.5 2.5-1.5s2 .6 2 1.6-1 1.5-2.5 1.9-2.5.8-2.5 2 1.1 1.7 2.5 1.7 2-.5 2.4-1.4" />
      </svg>
    ),
  },
  {
    id: "low-impact",
    label: "Lower-impact dyeing",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7 12a5 5 0 019.9-1M16.5 15.5A4.5 4.5 0 1110 10M8 17.5a3.5 3.5 0 105.8-2.7"
        />
      </svg>
    ),
  },
  {
    id: "community",
    label: "Weaver community first",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 11a3 3 0 100-6 3 3 0 000 6zm6 0a3 3 0 100-6 3 3 0 000 6zM4.5 19c.6-2.4 2.6-4 4.5-4s3.2.8 4 2M11 17c.7-1.5 2.2-2.5 4-2.5s3.5 1.2 4.2 3"
        />
      </svg>
    ),
  },
] as const;

export function PdpArtisanSection() {
  return (
    <section
      className="mt-14 border-t border-rc-border pt-10 md:mt-16 md:pt-12"
      aria-labelledby="pdp-artisan-heading"
    >
      <ul className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-x-10 gap-y-4 text-rc-navy">
        {TOP_PILLARS.map((item) => (
          <li key={item.id} className="flex items-center gap-2.5">
            {item.icon}
            <span className="text-sm font-medium tracking-tight">{item.label}</span>
          </li>
        ))}
      </ul>

      <div className="mt-10 grid items-center gap-8 md:mt-12 md:grid-cols-2 md:gap-10 lg:gap-14">
        <div className="min-w-0">
          <h2
            id="pdp-artisan-heading"
            className="font-heading text-2xl font-semibold tracking-tight text-rc-navy md:text-3xl"
          >
            Woven where the craft began
          </h2>
          <p className="mt-4 text-sm leading-7 text-rc-navy md:text-[15px]">
            Rugs Bhadohi rugs are finished in Bhadohi, Uttar Pradesh — a weaving
            belt known for patient knotting, honest fibre, and designs meant for
            real homes. Nothing here is rushed through a factory floor; each
            piece carries the pace and judgment of people who still read a loom
            by touch.
          </p>
          <p className="mt-4 text-sm leading-7 text-rc-navy md:text-[15px]">
            We stay close to the workshops that make our collections: clearer
            briefs, steadier work, and materials you can name. From first colour
            trial to final edge, the rug on your floor is the same one that left
            those hands — not a mass-run lookalike.
          </p>

          <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-rc-navy">
            {TRUST_POINTS.map((item) => (
              <li key={item.id} className="flex items-center gap-2">
                {item.icon}
                <span className="text-xs font-medium md:text-[13px]">{item.label}</span>
              </li>
            ))}
          </ul>

          <Link
            href="/about"
            className="mt-7 inline-flex items-center gap-1.5 text-sm font-medium text-[#b89a92] transition-colors hover:text-rc-navy"
          >
            Meet the makers behind Rugs Bhadohi
            <span aria-hidden>→</span>
          </Link>
        </div>

        <div className="relative aspect-[16/11] w-full overflow-hidden bg-rc-surface">
          <Image
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=820&fit=crop"
            alt="Artisan-finished rugs that reflect Bhadohi loom craft"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </div>
    </section>
  );
}
