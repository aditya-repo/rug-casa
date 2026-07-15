import Image from "next/image";
import Link from "next/link";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=1920&h=1080&fit=crop&q=80";

export function AboutHero() {
  return (
    <section
      className="relative flex min-h-[72vh] items-end overflow-hidden md:min-h-[78vh]"
      aria-labelledby="about-hero-heading"
    >
      <Image
        src={HERO_IMAGE}
        alt="Artisans working rug fibres by hand in Bhadohi"
        fill
        priority
        sizes="100vw"
        className="about-hero-image object-cover object-center"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-rc-navy-dark/90 via-rc-navy-dark/72 to-rc-navy/45"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-rc-navy-dark/70 via-transparent to-rc-navy-dark/25"
        aria-hidden
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-14 pt-28 md:pb-20 md:pt-36">
        <p
          className="about-fade-up font-heading text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-4xl"
          style={{ animationDelay: "80ms" }}
        >
          Rugs Bhadohi
        </p>
        <h1
          id="about-hero-heading"
          className="about-fade-up mt-5 max-w-3xl font-heading text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl md:mt-6 md:text-5xl md:leading-[1.12]"
          style={{ animationDelay: "180ms" }}
        >
          A manufacturing house shaped by generations at the loom.
        </h1>
        <p
          className="about-fade-up mt-5 max-w-2xl text-sm leading-relaxed text-white/85 md:mt-6 md:text-base md:leading-7"
          style={{ animationDelay: "280ms" }}
        >
          Based in Bhadohi, India, we make and export handmade rugs. Since
          launching commercially in 2016, we have drawn on a family craft line
          that began in 1946 — working with designers, retailers, hospitality
          teams, and international sourcing partners.
        </p>
        <div
          className="about-fade-up mt-8 flex flex-wrap gap-3"
          style={{ animationDelay: "380ms" }}
        >
          <Link
            href="/shop"
            className="inline-flex items-center justify-center bg-white px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-rc-navy transition-opacity hover:opacity-90"
          >
            Shop the collection
          </Link>
          <Link
            href="/help"
            className="inline-flex items-center justify-center border border-white/55 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-white/10"
          >
            Talk to us
          </Link>
        </div>
      </div>
    </section>
  );
}
