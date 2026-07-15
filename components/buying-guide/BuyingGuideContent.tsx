import Link from "next/link";
import { buyingGuideContent } from "@/lib/data/buying-guide";
import { company } from "@/lib/data/company";

export function BuyingGuideContent() {
  const content = buyingGuideContent;

  return (
    <article className="bg-white">
      <header className="border-b border-rc-border bg-rc-surface">
        <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-rc-muted">
            {content.eyebrow}
          </p>
          <h1 className="mt-3 font-heading text-3xl font-semibold leading-tight tracking-tight text-rc-navy md:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
            {content.title}
          </h1>
          <p className="mt-4 text-sm text-rc-muted">
            {content.publishedLabel}:{" "}
            <time dateTime={content.publishedDateIso}>{content.publishedDate}</time>
            {" · "}
            {company.brandName}
          </p>
          <div className="mt-4 h-px w-16 bg-rc-navy/35" aria-hidden />
          <div className="mt-6 space-y-4 text-sm leading-relaxed text-rc-muted md:text-[15px] md:leading-7">
            {content.intro.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl space-y-12 px-4 py-12 md:space-y-14 md:py-16">
        <section aria-labelledby="why-rugs">
          <h2
            id="why-rugs"
            className="font-heading text-2xl font-semibold tracking-tight text-rc-navy md:text-3xl"
          >
            {content.whyMatter.title}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-rc-muted md:text-[15px] md:leading-7">
            {content.whyMatter.body}
          </p>
        </section>

        <section aria-labelledby="how-to">
          <h2
            id="how-to"
            className="font-heading text-2xl font-semibold tracking-tight text-rc-navy md:text-3xl"
          >
            {content.howToTitle}
          </h2>

          <ol className="mt-8 space-y-0 divide-y divide-rc-border border-y border-rc-border">
            {content.steps.map((step) => (
              <li key={step.number} className="flex gap-4 py-8">
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rc-navy font-heading text-sm font-semibold text-white"
                  aria-hidden
                >
                  {step.number}
                </span>
                <div className="min-w-0 pt-0.5">
                  <h3 className="font-heading text-xl font-semibold tracking-tight text-rc-navy">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-rc-muted md:text-[15px] md:leading-7">
                    {step.body}
                  </p>
                  {"bullets" in step && step.bullets ? (
                    <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-rc-muted md:text-[15px]">
                      {step.bullets.map((item) => (
                        <li key={item.slice(0, 48)}>{item}</li>
                      ))}
                    </ul>
                  ) : null}
                  {"materials" in step && step.materials ? (
                    <ul className="mt-5 space-y-3">
                      {step.materials.map((item) => (
                        <li
                          key={item.name}
                          className="border border-rc-border bg-rc-surface px-4 py-3 text-sm md:text-[15px]"
                        >
                          <span className="font-semibold text-rc-navy">{item.name}</span>
                          <span className="text-rc-muted"> — {item.detail}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  {"styles" in step && step.styles ? (
                    <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                      {step.styles.map((item) => (
                        <li
                          key={item.name}
                          className="border border-rc-border px-4 py-3 text-sm md:text-[15px]"
                        >
                          <p className="font-semibold text-rc-navy">{item.name}</p>
                          <p className="mt-1 text-rc-muted">{item.detail}</p>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  {step.number === "6" ? (
                    <p className="mt-4">
                      <Link
                        href="/care"
                        className="font-medium text-rc-accent hover:underline"
                      >
                        {content.cta.careInline}
                      </Link>
                    </p>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="rooms">
          <h2
            id="rooms"
            className="font-heading text-2xl font-semibold tracking-tight text-rc-navy md:text-3xl"
          >
            {content.rooms.title}
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {content.rooms.items.map((room) => (
              <div key={room.name} className="border border-rc-border bg-rc-surface p-5">
                <h3 className="font-heading text-lg font-semibold text-rc-navy">
                  {room.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-rc-muted md:text-[15px] md:leading-7">
                  {room.detail}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="closing">
          <h2
            id="closing"
            className="font-heading text-2xl font-semibold tracking-tight text-rc-navy md:text-3xl"
          >
            {content.closing.title}
          </h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-rc-muted md:text-[15px] md:leading-7">
            {content.closing.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>
        </section>

        <section className="border border-rc-border bg-rc-surface px-5 py-8 md:px-8 md:py-10">
          <div className="flex flex-wrap gap-3">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center bg-rc-navy px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-90"
            >
              {content.cta.shop}
            </Link>
            <Link
              href="/care"
              className="inline-flex items-center justify-center border border-rc-navy px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-rc-navy transition-colors hover:bg-white"
            >
              {content.cta.care}
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center border border-rc-navy px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-rc-navy transition-colors hover:bg-white"
            >
              {content.cta.contact}
            </Link>
          </div>
        </section>
      </div>
    </article>
  );
}
