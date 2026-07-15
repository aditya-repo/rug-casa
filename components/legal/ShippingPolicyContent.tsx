import Link from "next/link";
import { company, companyWhatsAppUrl } from "@/lib/data/company";

export function ShippingPolicyContent() {
  const { brandName, supportEmail, phone, phoneAlt } = company;

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 md:py-14">
      <header className="border-b border-rc-border pb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-rc-muted">
          Customer service
        </p>
        <h1 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-rc-navy md:text-4xl">
          Shipping policy
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-rc-muted md:text-[15px] md:leading-7">
          At {brandName}, we are committed to delivering your handmade rugs
          safely, securely, and on time. Please review our shipping policy for
          both domestic and international orders below.
        </p>
      </header>

      <div className="mt-10 space-y-10 text-sm leading-relaxed text-rc-muted md:text-[15px] md:leading-7">
        <section aria-labelledby="shipping-india">
          <h2
            id="shipping-india"
            className="font-heading text-xl font-semibold tracking-tight text-rc-navy md:text-2xl"
          >
            1. Shipping within India
          </h2>
          <div className="mt-5 border-l-4 border-rc-navy bg-rc-surface px-4 py-3 text-rc-navy">
            <p className="font-semibold">Free shipping on all orders across India</p>
          </div>
          <ul className="mt-4 list-disc space-y-2 pl-5">
            <li>Orders are usually processed within 24–48 business hours</li>
            <li>
              Once dispatched, orders within India are typically delivered within
              4–6 business days, and usually under a week, depending on location
              and product type
            </li>
          </ul>
        </section>

        <section aria-labelledby="shipping-custom">
          <h2
            id="shipping-custom"
            className="font-heading text-xl font-semibold tracking-tight text-rc-navy md:text-2xl"
          >
            2. Customized orders
          </h2>
          <ul className="mt-4 list-disc space-y-2 pl-5">
            <li>
              Customized or made-to-order rugs require a production time of
              approximately 5–7 business days
            </li>
            <li>
              Once ready, the order is shipped promptly and follows the same
              delivery timelines as standard products
            </li>
          </ul>
        </section>

        <section aria-labelledby="shipping-tracking">
          <h2
            id="shipping-tracking"
            className="font-heading text-xl font-semibold tracking-tight text-rc-navy md:text-2xl"
          >
            3. Shipping confirmation &amp; tracking
          </h2>
          <p className="mt-4">After placing your order, you will receive:</p>
          <ul className="mt-4 list-disc space-y-2 pl-5">
            <li>An email confirmation with your order summary</li>
            <li>A text message confirmation (if applicable)</li>
            <li>A tracking link via email once your order is shipped</li>
          </ul>
        </section>

        <section aria-labelledby="shipping-intl">
          <h2
            id="shipping-intl"
            className="font-heading text-xl font-semibold tracking-tight text-rc-navy md:text-2xl"
          >
            4. International shipping
          </h2>
          <ul className="mt-4 list-disc space-y-2 pl-5">
            <li>
              We ship worldwide using trusted courier partners such as DHL,
              FedEx, and other freight partners
            </li>
            <li>
              International shipping charges are calculated at checkout based on
              destination and product weight
            </li>
            <li>
              Estimated international delivery time is 7–15 business days after
              dispatch
            </li>
          </ul>
        </section>

        <section aria-labelledby="shipping-delays">
          <h2
            id="shipping-delays"
            className="font-heading text-xl font-semibold tracking-tight text-rc-navy md:text-2xl"
          >
            5. Delays during sale periods
          </h2>
          <p className="mt-4">
            During high-volume periods such as festive sales or clearance events,
            deliveries may take 5–7 additional business days. We appreciate your
            patience during such times.
          </p>
        </section>

        <section aria-labelledby="shipping-duties">
          <h2
            id="shipping-duties"
            className="font-heading text-xl font-semibold tracking-tight text-rc-navy md:text-2xl"
          >
            6. Duties and taxes
          </h2>
          <ul className="mt-4 list-disc space-y-2 pl-5">
            <li>
              All prices on our website are inclusive of applicable taxes and
              duties within India
            </li>
            <li>
              For international orders, import duties or local taxes (if
              applicable) are the responsibility of the customer and vary by
              country
            </li>
          </ul>
        </section>

        <section aria-labelledby="shipping-cancel">
          <h2
            id="shipping-cancel"
            className="font-heading text-xl font-semibold tracking-tight text-rc-navy md:text-2xl"
          >
            7. Order cancellation
          </h2>
          <p className="mt-4">
            Orders can be cancelled before shipment by contacting us at:
          </p>
          <ul className="mt-4 space-y-2 text-rc-navy">
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
              <span className="text-rc-muted">Email: </span>
              <a
                href={`mailto:${supportEmail}`}
                className="font-medium text-rc-accent hover:underline"
              >
                {supportEmail}
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
            If eligible, refunds will be processed to the original payment method
            within 48 business hours of cancellation confirmation. See also our{" "}
            <Link href="/returns" className="font-medium text-rc-accent hover:underline">
              Refund Policy
            </Link>
            .
          </p>
        </section>

        <section
          className="border border-rc-border bg-rc-surface px-5 py-8 md:px-8 md:py-10"
          aria-labelledby="shipping-help"
        >
          <h2
            id="shipping-help"
            className="font-heading text-xl font-semibold tracking-tight text-rc-navy md:text-2xl"
          >
            8. Questions or assistance
          </h2>
          <p className="mt-4">
            If you have any questions about shipping, tracking, or delivery
            timelines, feel free to reach out. Our team is always happy to help.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/help"
              className="inline-flex items-center justify-center bg-rc-navy px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-90"
            >
              Help &amp; support
            </Link>
            <a
              href={`mailto:${supportEmail}`}
              className="inline-flex items-center justify-center border border-rc-navy px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-rc-navy transition-colors hover:bg-white"
            >
              Email {brandName}
            </a>
          </div>
        </section>
      </div>
    </article>
  );
}
