"use client";

import { useState, type ReactNode } from "react";
import type { PdpInfoAccordions } from "@/lib/data/product-detail";

const accentOpen = "text-[#b89a92]";
const accentClosed = "text-rc-navy";

type AccordionId = "details" | "care" | "shipping" | "design";

function AccordionItem({
  id,
  title,
  openId,
  onToggle,
  children,
}: {
  id: AccordionId;
  title: string;
  openId: AccordionId | null;
  onToggle: (id: AccordionId) => void;
  children: ReactNode;
}) {
  const open = openId === id;
  return (
    <div className="border-b border-rc-border">
      <button
        type="button"
        onClick={() => onToggle(id)}
        className="flex w-full items-center justify-between gap-3 py-4 text-left"
        aria-expanded={open}
      >
        <span
          className={`text-[11px] font-semibold uppercase tracking-[0.16em] ${
            open ? accentOpen : accentClosed
          }`}
        >
          {title}
        </span>
        <span
          className={`text-lg leading-none ${open ? accentOpen : "text-rc-navy"}`}
          aria-hidden
        >
          {open ? "−" : "+"}
        </span>
      </button>
      {open ? <div className="pb-5">{children}</div> : null}
    </div>
  );
}

function CareIcon({ id }: { id: string }) {
  const common =
    "h-9 w-9 shrink-0 rounded-full border border-rc-border text-rc-navy";
  return (
    <span className={`inline-flex items-center justify-center ${common}`} aria-hidden>
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.4">
        {id === "shed" ? (
          <path strokeLinecap="round" d="M5 8c2 2 4-2 6 0s4-2 6 0M5 13c2 2 4-2 6 0s4-2 6 0M5 18c2 2 4-2 6 0s4-2 6 0" />
        ) : id === "brush" ? (
          <>
            <path strokeLinecap="round" d="M8 16l8-8M7 10v7M10 7h7" />
            <path strokeLinecap="round" d="M6 18L18 6" />
          </>
        ) : id === "vacuum" ? (
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 14h8l2-5H9l-2 5zm2 0v4m6-4v4M8 9V6h5" />
        ) : id === "spill" ? (
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 14c2 2 6 2 8 0M9 10h.01M12 8v3M7 7c1.5 1 3 .5 4 2" />
        ) : id === "rotate" ? (
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 12a8 8 0 0114-5M20 12a8 8 0 01-14 5M18 4v3h-3M6 20v-3h3" />
        ) : id === "furniture" ? (
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 8v4h8V8M7 12h10v3H7zm2 3v3m6-3v3" />
        ) : id === "thread" ? (
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 6l4 4 4-4M12 10v8M9 15h6" />
        ) : id === "pro" ? (
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4l1.2 2.5L16 7l-2 2 .5 3L12 10.7 9.5 12l.5-3-2-2 2.8-.5L12 4zM8 17h8" />
        ) : id === "fold" ? (
          <>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h10v10H7zM11 7v10" />
            <path strokeLinecap="round" d="M6 18L18 6" />
          </>
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 19V9l7-5 7 5v10H5zm4-1v-5h6v5" />
        )}
      </svg>
    </span>
  );
}

export function PdpInfoAccordionsPanel({
  data,
}: {
  data: PdpInfoAccordions;
}) {
  const [openId, setOpenId] = useState<AccordionId | null>("details");

  function onToggle(id: AccordionId) {
    setOpenId((prev) => (prev === id ? null : id));
  }

  return (
    <div className="border-t border-rc-border">
      <AccordionItem
        id="details"
        title="Product Details"
        openId={openId}
        onToggle={onToggle}
      >
        {data.attributes.length > 0 ? (
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
            {data.attributes.map((row) => (
              <div key={row.label}>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.1em] text-rc-navy">
                  {row.label}
                </dt>
                <dd className="mt-1 text-sm text-rc-navy">{row.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
        {data.highlights.length > 0 ? (
          <ul className="mt-5 list-disc space-y-1.5 pl-5 text-sm text-rc-navy">
            {data.highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : null}
      </AccordionItem>

      <AccordionItem
        id="care"
        title="Washing & Care"
        openId={openId}
        onToggle={onToggle}
      >
        <ul className="space-y-3.5">
          {data.careItems.map((item) => (
            <li key={item.id} className="flex items-start gap-3">
              <CareIcon id={item.id} />
              <p className="pt-1.5 text-sm leading-snug text-rc-navy">{item.text}</p>
            </li>
          ))}
        </ul>
      </AccordionItem>

      <AccordionItem
        id="shipping"
        title="Shipping & Returns"
        openId={openId}
        onToggle={onToggle}
      >
        <ul className="list-disc space-y-2.5 pl-5 text-sm leading-relaxed text-rc-navy">
          {data.shippingBullets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </AccordionItem>

      <AccordionItem
        id="design"
        title="About This Design"
        openId={openId}
        onToggle={onToggle}
      >
        <div>
          <h3 className="text-xl font-semibold tracking-tight text-rc-navy">
            {data.designStory.title}
          </h3>
          <p className={`mt-2 text-sm font-medium ${accentOpen}`}>
            {data.designStory.productName}
          </p>
          <p className="mt-4 text-sm leading-7 text-rc-navy">
            {data.designStory.body}
          </p>
        </div>
      </AccordionItem>
    </div>
  );
}
