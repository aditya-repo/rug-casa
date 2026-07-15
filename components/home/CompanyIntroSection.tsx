import Image from "next/image";
import Link from "next/link";

const HERITAGE_IMAGE =
  "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&h=1200&fit=crop";

function HeritageMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden
    >
      <path
        d="M24 4L28.8 15.2L40 16.6L31.6 24.8L34.2 36L24 30.2L13.8 36L16.4 24.8L8 16.6L19.2 15.2L24 4Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="24" cy="24" r="5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function CompanyIntroSection() {
  return (
    <section
      className="bg-rc-surface py-12 md:py-16"
      aria-labelledby="company-intro-heading"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 md:grid-cols-2 md:gap-14 lg:gap-20">
        <div className="relative aspect-square w-full overflow-hidden bg-rc-navy/5">
          <Image
            src={HERITAGE_IMAGE}
            alt="Handwoven rugs and weaving atelier at Rugs Bhadohi"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-rc-navy/35 via-transparent to-rc-navy/40" />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white">
            <HeritageMark className="mb-4 h-10 w-10 text-white/90 md:h-12 md:w-12" />
            <p className="font-heading text-sm font-semibold uppercase leading-relaxed tracking-[0.12em] md:text-base md:leading-snug">
              Crafted with heritage
              <br />
              Made for tomorrow
            </p>
            <p className="mt-3 text-[11px] tracking-wide text-white/85 md:text-xs">
              Premium Rugs. Timeless Quality.
            </p>
          </div>
        </div>

        <div className="max-w-lg md:py-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-rc-muted">
            Our company
          </p>
          <h2
            id="company-intro-heading"
            className="mt-4 font-heading text-3xl font-semibold leading-tight tracking-tight text-rc-navy md:text-4xl lg:text-[2.75rem] lg:leading-[1.15]"
          >
            Craft heritage, shaped for modern production.
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-rc-muted md:text-[15px] md:leading-7">
            Established in 2016, Rugs Bhadohi carries forward a family connection
            to rug making that began in 1946. We work with designers, retailers,
            hospitality teams, and international sourcing partners.
          </p>
          <Link
            href="/about"
            className="mt-8 inline-block border-b border-rc-navy pb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-rc-navy transition-opacity hover:opacity-70"
          >
            About Rugs Bhadohi
          </Link>
        </div>
      </div>
    </section>
  );
}
