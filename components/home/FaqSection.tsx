"use client";

import { useId, useState } from "react";
import { homepageFaqs, type FaqItem } from "@/lib/data/faq";

function FaqRow({
  item,
  open,
  onToggle,
}: {
  item: FaqItem;
  open: boolean;
  onToggle: () => void;
}) {
  const panelId = useId();
  const buttonId = useId();

  return (
    <div className="border-b border-rc-border">
      <h3>
        <button
          type="button"
          id={buttonId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="flex w-full items-start justify-between gap-4 py-5 text-left transition-colors duration-300 ease-out hover:text-rc-navy md:py-6"
        >
          <span className="font-heading text-base font-semibold leading-snug text-rc-navy md:text-lg">
            {item.question}
          </span>
          <span
            className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center border border-rc-border text-rc-navy transition-all duration-300 ease-out ${
              open ? "rotate-45 bg-rc-navy text-white" : "rotate-0 bg-white"
            }`}
            aria-hidden
          >
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.75">
              <path d="M8 3v10M3 8h10" strokeLinecap="round" />
            </svg>
          </span>
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <p
            className={`pr-12 pb-5 text-sm leading-relaxed text-rc-muted transition-opacity duration-300 ease-out md:pb-6 md:text-[15px] md:leading-7 ${
              open ? "opacity-100" : "opacity-0"
            }`}
          >
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export function FaqSection({ items = homepageFaqs }: { items?: FaqItem[] }) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <section
      className="bg-white py-12 md:py-16"
      aria-labelledby="faq-heading"
    >
      <div className="mx-auto max-w-7xl px-4">
        <div className="max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-rc-muted">
            Support
          </p>
          <h2
            id="faq-heading"
            className="mt-3 font-heading text-3xl font-semibold tracking-tight text-rc-navy md:text-4xl"
          >
            Frequently asked questions
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-rc-muted md:text-[15px]">
            Answers about shipping, returns, craftsmanship, and caring for your
            Rugs Bhadohi piece.
          </p>
        </div>

        <div className="mt-8 w-full border-t border-rc-border md:mt-10">
          {items.map((item) => (
            <FaqRow
              key={item.id}
              item={item}
              open={openId === item.id}
              onToggle={() =>
                setOpenId((current) => (current === item.id ? null : item.id))
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}
