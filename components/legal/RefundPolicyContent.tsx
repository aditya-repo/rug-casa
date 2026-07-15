import Link from "next/link";
import { company, companyWhatsAppUrl } from "@/lib/data/company";

export function RefundPolicyContent() {
  const {
    brandName,
    supportEmail,
    phone,
    phoneAlt,
    refundPolicy,
  } = company;

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 md:py-14">
      <header className="border-b border-rc-border pb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-rc-muted">
          Customer service
        </p>
        <h1 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-rc-navy md:text-4xl">
          Refund policy
        </h1>
        <p className="mt-3 text-sm text-rc-muted">
          Last updated:{" "}
          <time dateTime={refundPolicy.lastUpdatedIso}>
            {refundPolicy.lastUpdated}
          </time>
        </p>
        <p className="mt-4 text-sm leading-relaxed text-rc-muted md:text-[15px] md:leading-7">
          We want you to love what you order from {brandName}. If something
          isn’t right, we’re here to help.
        </p>
      </header>

      <div className="mt-10 space-y-10 text-sm leading-relaxed text-rc-muted md:text-[15px] md:leading-7">
        <section aria-labelledby="return-window">
          <h2
            id="return-window"
            className="font-heading text-xl font-semibold tracking-tight text-rc-navy md:text-2xl"
          >
            {refundPolicy.returnWindowDays}-day return policy
          </h2>
          <p className="mt-4">
            We offer a {refundPolicy.returnWindowDays}-day return window on all
            eligible products. That means you have {refundPolicy.returnWindowDays}{" "}
            days from the date you receive your order to request a return.
          </p>
          <div className="mt-5 border-l-4 border-amber-500 bg-amber-50 px-4 py-3 text-amber-950">
            <p>
              <span className="font-semibold">Important: </span>
              Customized or made-to-order products are not eligible for return or
              refund, unless they arrive damaged or defective.
            </p>
          </div>
        </section>

        <section aria-labelledby="eligibility">
          <h2
            id="eligibility"
            className="font-heading text-xl font-semibold tracking-tight text-rc-navy md:text-2xl"
          >
            Eligibility for returns
          </h2>
          <p className="mt-4">To be eligible for a return, the item must:</p>
          <ul className="mt-4 list-disc space-y-2 pl-5">
            <li>Be in the same condition as received</li>
            <li>Be unused and uninstalled</li>
            <li>Be returned in its original packaging</li>
            <li>Include the receipt or proof of purchase</li>
          </ul>
        </section>

        <section aria-labelledby="start-return">
          <h2
            id="start-return"
            className="font-heading text-xl font-semibold tracking-tight text-rc-navy md:text-2xl"
          >
            How to start a return
          </h2>
          <p className="mt-4">
            To initiate a return, please contact us with your order details:
          </p>
          <ul className="mt-4 space-y-2 text-rc-navy">
            <li>
              <span className="text-rc-muted">Email: </span>
              <a
                href={`mailto:${supportEmail}`}
                className="font-medium text-rc-accent hover:underline"
              >
                {supportEmail}
              </a>
            </li>
            <li>
              <span className="text-rc-muted">Phone: </span>
              <a href={phone.tel} className="font-medium text-rc-accent hover:underline">
                {phone.display}
              </a>
              {" / "}
              <a
                href={phoneAlt.tel}
                className="font-medium text-rc-accent hover:underline"
              >
                {phoneAlt.display}
              </a>
            </li>
            <li>
              <span className="text-rc-muted">WhatsApp: </span>
              <a
                href={companyWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-rc-accent hover:underline"
              >
                {company.whatsapp.display}
              </a>
            </li>
          </ul>
          <p className="mt-4">
            Once your return request is approved, we’ll share clear instructions
            on how and where to send the product.
          </p>
          <p className="mt-4 font-medium text-rc-navy">
            Returns sent without prior approval will not be accepted.
          </p>
        </section>

        <section aria-labelledby="damaged">
          <h2
            id="damaged"
            className="font-heading text-xl font-semibold tracking-tight text-rc-navy md:text-2xl"
          >
            Damaged, defective, or wrong items
          </h2>
          <p className="mt-4">Please inspect your order as soon as it arrives.</p>
          <p className="mt-4">If you receive:</p>
          <ul className="mt-4 list-disc space-y-2 pl-5">
            <li>A damaged product</li>
            <li>A defective item</li>
            <li>The wrong product</li>
          </ul>
          <p className="mt-4">
            Contact us immediately so we can review the issue and resolve it
            quickly.
          </p>
          <div className="mt-5 border-l-4 border-rc-navy bg-rc-surface px-4 py-3 text-rc-navy">
            <p>
              In such cases, only returns are accepted. Exchanges are not
              available for damaged or defective items.
            </p>
          </div>
        </section>

        <section aria-labelledby="refunds">
          <h2
            id="refunds"
            className="font-heading text-xl font-semibold tracking-tight text-rc-navy md:text-2xl"
          >
            Refunds
          </h2>
          <p className="mt-4">
            Once we receive and inspect your returned item, we’ll notify you
            about the approval status.
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5">
            <li>
              If approved, you will receive a <strong className="text-rc-navy">100% refund</strong>
            </li>
            <li>
              Refunds are issued to the original payment method within{" "}
              <strong className="text-rc-navy">
                {refundPolicy.refundBusinessDays} business days
              </strong>
            </li>
          </ul>
          <p className="mt-4">
            Please note: your bank or card provider may take additional time to
            process and reflect the refund.
          </p>
          <p className="mt-4">
            If {refundPolicy.followUpBusinessDays} business days have passed since
            your refund was approved and you haven’t received it, please contact
            us at{" "}
            <a
              href={`mailto:${supportEmail}`}
              className="font-medium text-rc-accent hover:underline"
            >
              {supportEmail}
            </a>
            .
          </p>
        </section>

        <section
          className="border border-rc-border bg-rc-surface px-5 py-8 md:px-8 md:py-10"
          aria-labelledby="need-help"
        >
          <h2
            id="need-help"
            className="font-heading text-xl font-semibold tracking-tight text-rc-navy md:text-2xl"
          >
            Need help?
          </h2>
          <p className="mt-4">
            For any questions regarding returns or refunds, feel free to reach
            out. We’re always happy to assist you.
          </p>
          <ul className="mt-4 space-y-2 text-rc-navy">
            <li>
              <span className="text-rc-muted">Email: </span>
              <a
                href={`mailto:${supportEmail}`}
                className="font-medium text-rc-accent hover:underline"
              >
                {supportEmail}
              </a>
            </li>
            <li>
              <span className="text-rc-muted">Phone: </span>
              <a href={phone.tel} className="font-medium text-rc-accent hover:underline">
                {phone.display}
              </a>
              {" / "}
              <a
                href={phoneAlt.tel}
                className="font-medium text-rc-accent hover:underline"
              >
                {phoneAlt.display}
              </a>
            </li>
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/help"
              className="inline-flex items-center justify-center bg-rc-navy px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-90"
            >
              Help &amp; support
            </Link>
            <a
              href={companyWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center border border-rc-navy px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-rc-navy transition-colors hover:bg-white"
            >
              WhatsApp us
            </a>
          </div>
        </section>
      </div>
    </article>
  );
}
