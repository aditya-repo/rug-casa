import Image from "next/image";
import Link from "next/link";

const RUG_IMAGE =
  "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=1200&h=1400&fit=crop";

const certifications = [
  { id: "iso9001", name: "ISO 9001", detail: "Quality Management" },
  { id: "gots", name: "GOTS", detail: "Organic Textile" },
  { id: "iso14001", name: "ISO 14001", detail: "Environmental" },
  { id: "oeko", name: "OEKO-TEX", detail: "Textile Safety" },
  { id: "smeta", name: "SMETA", detail: "Ethical Trade" },
] as const;

function CertBadge({ name, detail }: { name: string; detail: string }) {
  return (
    <div className="flex aspect-square flex-col items-center justify-center border border-rc-border bg-white px-1.5 text-center shadow-sm">
      <span className="font-heading text-[10px] font-semibold leading-tight tracking-tight text-rc-navy sm:text-xs">
        {name}
      </span>
      <span className="mt-1 text-[8px] uppercase tracking-wide text-rc-muted sm:text-[9px]">
        {detail}
      </span>
    </div>
  );
}

export function AboutCertifications() {
  return (
    <section
      className="bg-rc-surface py-16 md:py-24"
      aria-labelledby="about-certifications-heading"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 md:grid-cols-2 md:gap-14 lg:gap-20">
        <div className="relative aspect-[5/4] w-full overflow-hidden bg-rc-navy/5 md:aspect-[4/4]">
          <Image
            src={RUG_IMAGE}
            alt="Handwoven patterned rug from Rugs Bhadohi"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        <div className="max-w-xl md:py-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-rc-muted">
            Certifications
          </p>
          <h2
            id="about-certifications-heading"
            className="mt-4 font-heading text-3xl font-semibold leading-tight tracking-tight text-rc-navy md:text-4xl lg:text-[2.5rem] lg:leading-[1.15]"
          >
            Credentials that stand behind responsible manufacturing.
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-rc-muted md:text-[15px] md:leading-7">
            Rugs Bhadohi holds ISO 9001:2015, GOTS, ISO 14001, OEKO-TEX, and
            Sedex membership — frameworks that help us meet quality,
            environmental care, textile safety, and ethical trade expectations
            for buyers abroad.
          </p>

          <ul className="mt-8 grid grid-cols-5 gap-2 sm:gap-3" aria-label="Certification marks">
            {certifications.map((cert) => (
              <li key={cert.id}>
                <CertBadge name={cert.name} detail={cert.detail} />
              </li>
            ))}
          </ul>

          <Link
            href="/help"
            className="mt-10 inline-block border-b border-rc-navy pb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-rc-navy transition-opacity hover:opacity-70"
          >
            Review manufacturing systems
          </Link>
        </div>
      </div>
    </section>
  );
}
