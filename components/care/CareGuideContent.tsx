import Link from "next/link";
import { careGuideContent } from "@/lib/data/care-guide";
import { company, companyWhatsAppUrl } from "@/lib/data/company";

function CareIcon({ id }: { id: string }) {
  const common = {
    className: "h-7 w-7 text-rc-navy",
    fill: "none" as const,
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    strokeWidth: 1.5,
    "aria-hidden": true as const,
  };

  switch (id) {
    case "no-scrub":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path strokeLinecap="round" d="M7.5 7.5l9 9M8 15.5h6.5M9 12h5M9.5 8.5h4" />
        </svg>
      );
    case "vacuum":
      return (
        <svg {...common}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 15V9a4 4 0 018 0v1h1.5A1.5 1.5 0 0119 11.5V15M8 15h7m-7 0a2 2 0 11-4 0 2 2 0 014 0zm9 0a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      );
    case "spills":
      return (
        <svg {...common}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 14c0 2.2 1.8 4 4 4s4-1.8 4-4c0-3-4-7-4-7s-4 4-4 7z"
          />
          <path strokeLinecap="round" d="M15.5 7.5l1.5-1.5M17 10h2" />
        </svg>
      );
    case "rotate":
      return (
        <svg {...common}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 12a8 8 0 0114.5-4.5M20 12a8 8 0 01-14.5 4.5"
          />
          <path strokeLinecap="round" strokeLinejoin="round" d="M18.5 4v3.5H15M5.5 20v-3.5H9" />
        </svg>
      );
    case "furniture":
      return (
        <svg {...common}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18h12M8 18V9h8v9M10 9V6.5a2 2 0 012-2h0a2 2 0 012 2V9"
          />
          <path strokeLinecap="round" d="M9 18v2M15 18v2" />
        </svg>
      );
    case "threads":
      return (
        <svg {...common}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7 17l4-4 2 2 4-4M14 7l3 3M8 8l1.5 1.5"
          />
        </svg>
      );
    case "professional":
      return (
        <svg {...common}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 12a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM5.5 19a6.5 6.5 0 0113 0"
          />
        </svg>
      );
    default:
      return null;
  }
}

export function CareGuideContent() {
  const mailto = `mailto:${company.supportEmail}?subject=${encodeURIComponent("Rug care question")}`;

  return (
    <div className="bg-white">
      <section className="border-b border-rc-border bg-rc-surface">
        <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-rc-muted">
            Care guide
          </p>
          <h1 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-rc-navy md:text-4xl">
            {careGuideContent.title}
          </h1>
          <div className="mt-4 h-px w-16 bg-rc-navy/35" aria-hidden />
          <p className="mt-6 text-sm leading-relaxed text-rc-muted md:text-[15px] md:leading-7">
            {careGuideContent.intro}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
        <ol className="space-y-6 md:space-y-8">
          {careGuideContent.sections.map((section, index) => (
            <li
              key={section.id}
              className="border border-rc-border bg-white p-5 md:grid md:grid-cols-[auto_1fr] md:gap-6 md:p-7"
            >
              <div className="mb-4 flex items-center gap-3 md:mb-0 md:flex-col md:items-center md:gap-2">
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-rc-border bg-rc-surface">
                  <CareIcon id={section.id} />
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-rc-muted md:mt-1">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <div>
                <h2 className="font-heading text-xl font-semibold tracking-tight text-rc-navy md:text-2xl">
                  {section.title}
                </h2>
                <p className="mt-2 text-sm font-semibold text-rc-navy md:text-[15px]">
                  {section.rule}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-rc-muted md:text-[15px] md:leading-7">
                  {section.explanation}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <section
          className="mt-12 border border-rc-border bg-rc-surface px-5 py-8 md:mt-16 md:px-8 md:py-10"
          aria-labelledby="care-closing-heading"
        >
          <h2
            id="care-closing-heading"
            className="font-heading text-2xl font-semibold tracking-tight text-rc-navy"
          >
            {careGuideContent.closing.title}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-rc-muted md:text-[15px] md:leading-7">
            {careGuideContent.closing.body}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={mailto}
              className="inline-flex items-center justify-center bg-rc-navy px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-90"
            >
              Email {company.brandName}
            </a>
            <a
              href={companyWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center border border-rc-navy px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-rc-navy transition-colors hover:bg-white"
            >
              WhatsApp {company.whatsapp.display}
            </a>
            <Link
              href="/help"
              className="inline-flex items-center justify-center border border-rc-navy px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-rc-navy transition-colors hover:bg-white"
            >
              Help &amp; support
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
