import Link from "next/link";
import { company, companyWhatsAppUrl } from "@/lib/data/company";
import { customRugsContent } from "@/lib/data/custom-rugs";

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden>
      <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M6 10.2l2.4 2.4L14 7.2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CustomRugsContent() {
  const content = customRugsContent;
  const whatsappUrl = companyWhatsAppUrl();
  const mailto = `mailto:${company.supportEmail}?subject=${encodeURIComponent("Custom rug enquiry")}`;

  return (
    <div className="bg-white">
      <section className="border-b border-rc-border bg-rc-surface">
        <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-rc-muted">
            {content.eyebrow}
          </p>
          <h1 className="mt-3 font-heading text-3xl font-semibold leading-tight tracking-tight text-rc-navy md:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
            {content.title}
          </h1>
          <div className="mt-4 h-px w-16 bg-rc-navy/35" aria-hidden />
          <p className="mt-6 text-sm leading-relaxed text-rc-muted md:text-[15px] md:leading-7">
            {content.intro}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-[#25D366] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-90"
            >
              {content.cta.whatsapp}
            </a>
            <a
              href={mailto}
              className="inline-flex items-center justify-center border border-rc-navy px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-rc-navy transition-colors hover:bg-white"
            >
              {content.cta.email}
            </a>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-3xl space-y-14 px-4 py-12 md:space-y-16 md:py-16">
        <section aria-labelledby="custom-options">
          <h2
            id="custom-options"
            className="font-heading text-2xl font-semibold tracking-tight text-rc-navy md:text-3xl"
          >
            {content.whatTitle}
          </h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {content.customization.map((item) => (
              <li key={item.title} className="border border-rc-border bg-rc-surface px-4 py-4">
                <p className="font-semibold text-rc-navy">{item.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-rc-muted md:text-[15px]">
                  {item.body}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="custom-process">
          <h2
            id="custom-process"
            className="font-heading text-2xl font-semibold tracking-tight text-rc-navy md:text-3xl"
          >
            {content.processTitle}
          </h2>
          <ol className="mt-8 space-y-0 divide-y divide-rc-border border-y border-rc-border">
            {content.process.map((step) => (
              <li key={step.number} className="flex gap-4 py-6">
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rc-navy font-heading text-sm font-semibold text-white"
                  aria-hidden
                >
                  {step.number}
                </span>
                <div className="min-w-0 pt-0.5">
                  <h3 className="font-semibold text-rc-navy md:text-[15px]">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-rc-muted md:text-[15px] md:leading-7">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="custom-why">
          <h2
            id="custom-why"
            className="font-heading text-2xl font-semibold tracking-tight text-rc-navy md:text-3xl"
          >
            {content.whyTitle}
          </h2>
          <ul className="mt-6 space-y-3">
            {content.why.map((item) => (
              <li key={item} className="flex gap-3 text-sm md:text-[15px]">
                <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-rc-navy" />
                <span className="text-rc-muted">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="custom-projects">
          <h2
            id="custom-projects"
            className="font-heading text-2xl font-semibold tracking-tight text-rc-navy md:text-3xl"
          >
            {content.projectsTitle}
          </h2>
          <ul className="mt-6 list-disc space-y-2 pl-5 text-sm text-rc-muted md:text-[15px]">
            {content.projects.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="custom-lead">
          <h2
            id="custom-lead"
            className="font-heading text-2xl font-semibold tracking-tight text-rc-navy md:text-3xl"
          >
            {content.leadTime.title}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-rc-muted md:text-[15px] md:leading-7">
            {content.leadTime.body}
          </p>
        </section>

        <section
          className="border border-rc-border bg-rc-surface px-5 py-8 md:px-8 md:py-10"
          aria-labelledby="custom-cta"
        >
          <h2
            id="custom-cta"
            className="font-heading text-2xl font-semibold tracking-tight text-rc-navy md:text-3xl"
          >
            {content.cta.title}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-rc-muted md:text-[15px] md:leading-7">
            {content.cta.intro}
          </p>
          <p className="mt-4 text-sm font-semibold text-rc-navy md:text-[15px]">
            WhatsApp:{" "}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-rc-accent hover:underline"
            >
              {company.whatsapp.display}
            </a>
          </p>
          <p className="mt-2 text-sm text-rc-navy md:text-[15px]">
            Email:{" "}
            <a
              href={mailto}
              className="font-semibold text-rc-accent hover:underline"
            >
              {company.supportEmail}
            </a>
          </p>
          <ol className="mt-5 list-decimal space-y-2 pl-5 text-sm text-rc-muted md:text-[15px]">
            {content.cta.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-[#25D366] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-90"
            >
              {content.cta.whatsapp}
            </a>
            <a
              href={mailto}
              className="inline-flex items-center justify-center bg-rc-navy px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-90"
            >
              {content.cta.email}
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center border border-rc-navy px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-rc-navy transition-colors hover:bg-white"
            >
              {content.cta.contactPage}
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
