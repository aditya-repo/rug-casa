import Link from "next/link";
import { bulkOrdersContent } from "@/lib/data/bulk-orders";
import { company, companyWhatsAppUrl } from "@/lib/data/company";

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
    >
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

function CheckList({
  items,
}: {
  items: ReadonlyArray<{ title: string; body: string }>;
}) {
  return (
    <ul className="mt-6 space-y-4">
      {items.map((item) => (
        <li key={item.title} className="flex gap-3 text-sm leading-relaxed md:text-[15px] md:leading-7">
          <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-rc-navy" />
          <p className="text-rc-muted">
            <span className="font-semibold text-rc-navy">{item.title}</span>
            {" — "}
            {item.body}
          </p>
        </li>
      ))}
    </ul>
  );
}

export function BulkOrdersContent() {
  const content = bulkOrdersContent;
  const mailto = `mailto:${company.supportEmail}?subject=${encodeURIComponent("Bulk / wholesale rug enquiry")}`;
  const whatsapp = companyWhatsAppUrl();

  return (
    <div className="bg-white">
      <section className="border-b border-rc-border bg-rc-surface">
        <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-rc-muted">
            Trade & projects
          </p>
          <h1 className="mt-3 font-heading text-3xl font-semibold leading-tight tracking-tight text-rc-navy md:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
            {content.heroTitle}
          </h1>
          <div className="mt-4 h-px w-16 bg-rc-navy/35" aria-hidden />
          <p className="mt-6 text-sm leading-relaxed text-rc-muted md:text-[15px] md:leading-7">
            {content.heroIntro}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl space-y-14 px-4 py-12 md:space-y-16 md:py-16">
        <section aria-labelledby="bulk-audience-heading">
          <h2
            id="bulk-audience-heading"
            className="font-heading text-2xl font-semibold tracking-tight text-rc-navy md:text-3xl"
          >
            {content.audience.title}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-rc-muted md:text-[15px] md:leading-7">
            {content.audience.intro}
          </p>
          <CheckList items={content.audience.items} />
        </section>

        <section aria-labelledby="bulk-custom-heading">
          <h2
            id="bulk-custom-heading"
            className="font-heading text-2xl font-semibold tracking-tight text-rc-navy md:text-3xl"
          >
            {content.custom.title}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-rc-muted md:text-[15px] md:leading-7">
            {content.custom.intro}
          </p>

          <div className="mt-8 overflow-hidden border border-rc-border">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="bg-rc-navy text-white">
                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.14em]">
                    Customization option
                  </th>
                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.14em]">
                    Available choices
                  </th>
                </tr>
              </thead>
              <tbody>
                {content.customizationRows.map((row, index) => (
                  <tr
                    key={row.option}
                    className={index % 2 === 0 ? "bg-white" : "bg-rc-surface"}
                  >
                    <td className="border-t border-rc-border px-4 py-3 font-semibold text-rc-navy align-top">
                      {row.option}
                    </td>
                    <td className="border-t border-rc-border px-4 py-3 text-rc-muted align-top">
                      {row.choices}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 border-l-4 border-rc-navy bg-rc-surface px-4 py-4 md:px-5">
            <p className="text-sm leading-relaxed text-rc-muted md:text-[15px] md:leading-7">
              <span className="font-semibold text-rc-navy">
                Minimum order quantity (MOQ): {content.moq.quantityLabel}
              </span>
              {" — "}
              {content.moq.note}
            </p>
          </div>
        </section>

        <section aria-labelledby="bulk-why-heading">
          <h2
            id="bulk-why-heading"
            className="font-heading text-2xl font-semibold tracking-tight text-rc-navy md:text-3xl"
          >
            {content.whyBuy.title}
          </h2>
          <CheckList items={content.whyBuy.items} />
        </section>

        <section aria-labelledby="bulk-shipping-heading">
          <h2
            id="bulk-shipping-heading"
            className="font-heading text-2xl font-semibold tracking-tight text-rc-navy md:text-3xl"
          >
            {content.shipping.title}
          </h2>
          <CheckList items={content.shipping.items} />
        </section>

        <section aria-labelledby="bulk-process-heading">
          <h2
            id="bulk-process-heading"
            className="font-heading text-2xl font-semibold tracking-tight text-rc-navy md:text-3xl"
          >
            {content.process.title}
          </h2>
          <ol className="mt-8 space-y-0 divide-y divide-rc-border border-y border-rc-border">
            {content.process.steps.map((step, index) => (
              <li key={step.title} className="flex gap-4 py-6">
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rc-navy font-heading text-sm font-semibold text-white"
                  aria-hidden
                >
                  {index + 1}
                </span>
                <div className="min-w-0 pt-0.5">
                  <h3 className="font-semibold text-rc-navy md:text-[15px]">
                    {step.title}
                  </h3>
                  {"body" in step && step.body ? (
                    <p className="mt-2 text-sm leading-relaxed text-rc-muted md:text-[15px] md:leading-7">
                      {step.body}
                    </p>
                  ) : null}
                  {"bullets" in step && step.bullets ? (
                    <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-rc-muted md:text-[15px]">
                      {step.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  ) : null}
                  {index === 0 ? (
                    <ul className="mt-4 space-y-2 text-sm text-rc-navy">
                      <li>
                        <span className="text-rc-muted">Email: </span>
                        <a
                          href={mailto}
                          className="font-medium text-rc-accent hover:underline"
                        >
                          {company.supportEmail}
                        </a>
                      </li>
                      <li>
                        <span className="text-rc-muted">WhatsApp: </span>
                        <a
                          href={whatsapp}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-rc-accent hover:underline"
                        >
                          {company.whatsapp.display} — Chat with us
                        </a>
                      </li>
                    </ul>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section
          className="border border-rc-border bg-rc-surface px-5 py-8 md:px-8 md:py-10"
          aria-labelledby="bulk-cta-heading"
        >
          <h2
            id="bulk-cta-heading"
            className="font-heading text-2xl font-semibold tracking-tight text-rc-navy md:text-3xl"
          >
            {content.cta.title}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-rc-muted md:text-[15px] md:leading-7">
            {content.cta.body}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={mailto}
              className="inline-flex items-center justify-center bg-rc-navy px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-90"
            >
              Contact for bulk pricing
            </a>
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center border border-rc-navy px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-rc-navy transition-colors hover:bg-white"
            >
              Request a sample
            </a>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center bg-rc-navy px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-90"
            >
              Browse collections
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
