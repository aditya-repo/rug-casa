import Image from "next/image";
import Link from "next/link";

const FEATURES = [
  {
    id: "clean",
    label: "Professional cleaning (recom.)",
    icon: (
      <svg viewBox="0 0 48 48" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <rect x="10" y="12" width="28" height="26" rx="3" />
        <circle cx="24" cy="25" r="8" />
        <circle cx="24" cy="25" r="4" />
        <path strokeLinecap="round" d="M16 12V9h16v3" />
      </svg>
    ),
  },
  {
    id: "stain",
    label: "Everyday spill ready",
    icon: (
      <svg viewBox="0 0 48 48" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M18 14c2 4 1 8-2 11-3 3-3 7 1 9 5 3 12 1 15-4 3-5 1-12-4-15-3-2-7-2-10-1z"
        />
        <path strokeLinecap="round" d="M28 12l4-4" />
      </svg>
    ),
  },
  {
    id: "designs",
    label: "Wide design range",
    icon: (
      <svg viewBox="0 0 48 48" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <rect x="8" y="12" width="18" height="24" rx="1.5" />
        <rect x="22" y="8" width="18" height="24" rx="1.5" />
        <path strokeLinecap="round" d="M12 20h10M12 26h8M12 32h6M26 16h10M26 22h8M26 28h6" />
      </svg>
    ),
  },
] as const;

export function PdpHowItWorksSection() {
  return (
    <section
      className="mt-14 border-t border-rc-border pt-10 md:mt-16 md:pt-12"
      aria-labelledby="pdp-how-heading"
    >
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-12 xl:gap-16">
        <div className="lg:sticky lg:top-[7.5rem] lg:self-start">
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-rc-surface md:aspect-[2/1]">
            <Image
              src="https://images.unsplash.com/photo-1615529328331-f8917597711f?w=1200&h=900&fit=crop"
              alt="Lifestyle scene showing everyday care around a rug at home"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 55vw"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent px-5 pb-5 pt-16">
              <span className="inline-block bg-rc-navy px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-white">
                Care tip
              </span>
              <p className="mt-2.5 text-sm font-medium text-white md:text-[15px]">
                Blot spills gently — rubbing only pushes the mark deeper.
              </p>
            </div>
          </div>
        </div>

        <div className="min-w-0 lg:pt-2">
          <h2
            id="pdp-how-heading"
            className="font-heading text-3xl font-semibold tracking-tight text-rc-navy md:text-4xl"
          >
            How it works
          </h2>
          <p className="mt-5 max-w-md text-sm leading-7 text-rc-navy md:text-[15px]">
            Finding the right Rugs Bhadohi piece is straightforward. Pick a
            design that fits your room, choose size and finish options, then
            we take care of packing, delivery, and aftercare guidance — so
            comfort arrives without the guesswork.
          </p>

          <ul className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2">
            {FEATURES.map((feature) => (
              <li key={feature.id} className="flex items-start gap-3 text-rc-navy">
                <span className="shrink-0">{feature.icon}</span>
                <span className="pt-2 text-[11px] font-semibold uppercase tracking-[0.12em]">
                  {feature.label}
                </span>
              </li>
            ))}
          </ul>

          <Link
            href="/care"
            className="mt-10 inline-flex text-sm font-medium text-[#b89a92] transition-colors hover:text-rc-navy"
          >
            Read full care notes →
          </Link>
        </div>
      </div>
    </section>
  );
}
