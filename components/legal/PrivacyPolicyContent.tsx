import Link from "next/link";
import { company, companyFullAddress } from "@/lib/data/company";

type Section = {
  id: string;
  title: string;
  paragraphs?: string[];
  bullets?: string[];
};

function buildSections(): Section[] {
  const { brandName, legalName, paymentGateway, platform } = company;

  return [
    {
      id: "intro",
      title: "",
      paragraphs: [
        `${legalName} operates this store and website, including all related information, content, features, tools, products, and services, in order to provide you, the customer, with a curated shopping experience (the “Services”). The Services run on ${platform.name}.`,
        `This Privacy Policy describes how we collect, use, and disclose your personal information when you visit, use, or make a purchase or other transaction using the Services, including payments processed through third-party payment gateways such as ${paymentGateway.name}, or otherwise communicate with us. If there is a conflict between our Terms of Service and this Privacy Policy, this Privacy Policy controls with respect to the collection, processing, and disclosure of your personal information.`,
        "Please read this Privacy Policy carefully. By using and accessing any of the Services, including initiating a payment transaction, you acknowledge that you have read this Privacy Policy and understand the collection, use, and disclosure of your information as described herein.",
      ],
    },
    {
      id: "collect",
      title: "Personal Information We Collect or Process",
      paragraphs: [
        "When we use the term “personal information,” we are referring to information that identifies or can reasonably be linked to you or another person. Personal information does not include information that is collected anonymously or that has been de-identified so that it cannot reasonably be linked to you.",
        "Depending on how you interact with the Services, where you live, and as permitted or required by applicable law, we may collect or process the following categories of personal information:",
      ],
      bullets: [
        "Contact details including your name, address, billing address, shipping address, phone number, and email address",
        `Financial information including payment method, transaction details, payment status, and payment confirmations. Sensitive payment information such as card numbers, UPI IDs, or bank account details are processed securely by our third-party payment gateway providers (including ${paymentGateway.name}) and are not stored by us.`,
        "Account information including username, password, preferences, and settings",
        "Transaction information including items viewed, added to cart or wishlist, purchased, returned, exchanged, or cancelled",
        "Communications including messages sent to us for customer support or inquiries",
        "Device information including IP address, browser type, device identifiers, and network information",
        "Usage information regarding how and when you interact with the Services",
      ],
    },
    {
      id: "sources",
      title: "Personal Information Sources",
      paragraphs: ["We may collect personal information from the following sources:"],
      bullets: [
        "Directly from you when you create an account, place an order, initiate a payment, communicate with us, or use our Services",
        "Automatically through cookies and similar technologies when you browse our website",
        `From service providers who process data on our behalf, including payment processors such as ${paymentGateway.name}`,
        "From partners or other third parties",
      ],
    },
    {
      id: "use",
      title: "How We Use Your Personal Information",
      paragraphs: ["We may use personal information to:"],
      bullets: [
        "Provide, tailor, and improve the Services — process payments, fulfill orders, manage accounts, arrange shipping, facilitate returns, enable reviews, remember preferences, personalize your shopping experience, and provide transaction alerts",
        "Marketing and advertising — send promotional communications and display relevant advertisements based on your activity and interests, subject to your preferences and applicable law",
        "Security and fraud prevention — protect accounts, prevent fraud, detect suspicious activity, ensure payment security, and comply with regulatory requirements",
        "Communicating with you — provide customer support, respond to inquiries, and send transactional communications related to orders or payments",
        "Legal reasons — comply with applicable laws, legal requests, regulatory obligations (including those imposed by financial institutions and regulators), enforce policies, and protect our rights",
      ],
    },
    {
      id: "disclose",
      title: "How We Disclose Personal Information",
      paragraphs: [
        "We may disclose your personal information:",
      ],
      bullets: [
        `With service providers including payment gateway providers such as ${paymentGateway.name}, banks, analytics providers, shipping partners, and IT service providers, strictly for the purpose of providing the Services`,
        "With marketing partners for personalized advertising, subject to your rights and preferences",
        "When you direct or consent to disclosure",
        "With affiliates or within our corporate group",
        "In connection with business transactions, mergers, or legal obligations",
      ],
    },
    {
      id: "payment-note",
      title: "",
      paragraphs: [
        "When you make a payment, certain personal and transactional information is shared directly with our payment gateway provider as required to complete the transaction. We are not responsible for how such third parties independently process your information beyond the scope of providing payment services.",
      ],
    },
    {
      id: "platform",
      title: `Relationship with Technology Partners and ${paymentGateway.name}`,
      paragraphs: [
        `The Services rely on ${platform.description}. Information submitted through the Services may be processed by these partners, including in countries outside your own, as needed to operate the storefront securely.`,
        `Payments on our website are processed through third-party payment gateways, including ${paymentGateway.name}, which operate under their own privacy policies and regulatory obligations. Such providers may collect, store, and process your information in accordance with applicable laws and their respective privacy policies.`,
      ],
    },
    {
      id: "cookies",
      title: "Cookies and Tracking Technologies",
      paragraphs: [
        "We use cookies and similar technologies to operate and improve the Services, enable secure transactions, remember preferences, analyze usage, and support payment processing. You may disable cookies through your browser settings, but doing so may affect the functionality of the Services.",
      ],
    },
    {
      id: "children",
      title: "Children’s Data",
      paragraphs: [
        "The Services are not intended for children. We do not knowingly collect personal information from children under the age of majority. Parents or guardians may request deletion if such data is provided.",
      ],
    },
    {
      id: "security",
      title: "Security and Retention",
      paragraphs: [
        "We implement reasonable and industry-standard security practices to protect personal information. However, no method of transmission over the internet is completely secure, and we cannot guarantee absolute security. Data retention depends on business, legal, and regulatory requirements.",
      ],
    },
    {
      id: "rights",
      title: "Your Rights and Choices",
      paragraphs: [
        "Depending on your location, you may have rights including access, correction, deletion, data portability, and the right to opt out of certain processing activities.",
        "You may manage marketing communications via unsubscribe links in emails. We may verify your identity before processing requests.",
      ],
    },
    {
      id: "complaints",
      title: "Complaints",
      paragraphs: [
        "If you have concerns about our data practices, please contact us using the details below. You may also lodge a complaint with your local data protection authority if applicable.",
      ],
    },
    {
      id: "transfers",
      title: "International Transfers",
      paragraphs: [
        "Your personal information may be processed outside your country. Where required, we use recognized legal safeguards such as Standard Contractual Clauses.",
      ],
    },
    {
      id: "changes",
      title: "Changes to This Privacy Policy",
      paragraphs: [
        "We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated “Last updated” date. Continued use of the Services constitutes acceptance of the updated policy.",
      ],
    },
    {
      id: "controller",
      title: "",
      paragraphs: [
        `For the purposes of applicable data protection laws, ${brandName} is the data controller of your personal information.`,
      ],
    },
  ];
}

export function PrivacyPolicyContent() {
  const sections = buildSections();
  const { brandName, supportEmail, privacyPolicy, paymentGateway } = company;

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 md:py-14">
      <header className="border-b border-rc-border pb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-rc-muted">
          Legal
        </p>
        <h1 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-rc-navy md:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-3 text-sm text-rc-muted">
          Last updated:{" "}
          <time dateTime={privacyPolicy.lastUpdatedIso}>
            {privacyPolicy.lastUpdated}
          </time>
        </p>
      </header>

      <div className="mt-10 space-y-10 text-sm leading-relaxed text-rc-muted md:text-[15px] md:leading-7">
        {sections.map((section) => (
          <section key={section.id} aria-labelledby={section.title ? section.id : undefined}>
            {section.title ? (
              <h2
                id={section.id}
                className="font-heading text-xl font-semibold tracking-tight text-rc-navy md:text-2xl"
              >
                {section.title}
              </h2>
            ) : null}
            {section.paragraphs?.map((paragraph, index) => (
              <p
                key={`${section.id}-p-${index}`}
                className={section.title || index > 0 ? "mt-4" : undefined}
              >
                {paragraph}
              </p>
            ))}
            {section.bullets ? (
              <ul className="mt-4 list-disc space-y-2 pl-5">
                {section.bullets.map((item) => (
                  <li key={item.slice(0, 48)}>{item}</li>
                ))}
              </ul>
            ) : null}
            {section.id === "platform" ? (
              <p className="mt-4">
                More details regarding {paymentGateway.name}&apos;s data practices
                are available at:{" "}
                <a
                  href={paymentGateway.privacyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-rc-accent hover:underline"
                >
                  {paymentGateway.privacyUrl}
                </a>
              </p>
            ) : null}
          </section>
        ))}

        <section aria-labelledby="contact">
          <h2
            id="contact"
            className="font-heading text-xl font-semibold tracking-tight text-rc-navy md:text-2xl"
          >
            Contact
          </h2>
          <p className="mt-4">
            If you have any questions about this Privacy Policy or wish to exercise
            your rights, please contact us:
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
              <span className="text-rc-muted">Address: </span>
              <span className="font-medium">{companyFullAddress()}</span>
            </li>
          </ul>
          <p className="mt-6">
            Prefer a quick chat?{" "}
            <Link href="/help" className="font-medium text-rc-accent hover:underline">
              Visit Help &amp; Support
            </Link>{" "}
            or browse{" "}
            <Link href="/about" className="font-medium text-rc-accent hover:underline">
              About {brandName}
            </Link>
            .
          </p>
        </section>
      </div>
    </article>
  );
}
