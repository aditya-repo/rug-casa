import Link from "next/link";
import { company, companyFullAddress } from "@/lib/data/company";

type Section = {
  id: string;
  number?: string;
  title: string;
  paragraphs?: string[];
  bullets?: string[];
};

function buildSections(): Section[] {
  const { brandName, legalName, paymentGateway, platform, governingLaw } = company;

  return [
    {
      id: "overview",
      title: "Overview",
      paragraphs: [
        `Welcome to ${brandName}! The terms “we”, “us” and “our” refer to ${legalName}. ${legalName} operates this store and website, including all related information, content, features, tools, products and services, in order to provide you, the customer, with a curated shopping experience (the “Services”). The Services run on ${platform.name}.`,
        "The below terms and conditions, together with any policies referenced herein (these “Terms of Service” or “Terms”) describe your rights and responsibilities when you use the Services.",
        "Please read these Terms of Service carefully, as they include important information about your legal rights and cover areas such as warranty disclaimers and limitations of liability.",
        "By visiting, interacting with, making a purchase, or completing a payment transaction through the Services, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these Terms of Service or Privacy Policy, you should not use or access our Services.",
      ],
    },
    {
      id: "access",
      number: "1",
      title: "Access and account",
      paragraphs: [
        "By agreeing to these Terms of Service, you represent that you are at least the age of majority in your state or province of residence, and you have given us your consent to allow any of your minor dependents to use the Services on devices you own, purchase or manage.",
        "To use the Services, including accessing or browsing our online store or purchasing any of the products or services we offer, you may be asked to provide certain information, such as your email address, billing, payment, and shipping information. You represent and warrant that all the information you provide is correct, current and complete and that you have all rights necessary to provide this information.",
        "You are solely responsible for maintaining the security of your account credentials and for all of your account activity. You may not transfer, sell, assign, or license your account to any other person.",
      ],
    },
    {
      id: "products",
      number: "2",
      title: "Our products",
      paragraphs: [
        "We have made every effort to provide an accurate representation of our products and services in our online store. However, colours or product appearance may differ from how they appear on your screen due to your device type, display settings, and configuration.",
        "We do not warrant that the appearance or quality of any products or services purchased by you will meet your expectations or be identical to depictions rendered in our online store.",
        "All descriptions of products are subject to change at any time without notice at our sole discretion. We reserve the right to discontinue any product at any time and may limit the quantities of any products that we offer to any person, geographic region or jurisdiction, on a case-by-case basis.",
      ],
    },
    {
      id: "orders",
      number: "3",
      title: "Orders",
      paragraphs: [
        `When you place an order, you are making an offer to purchase. ${legalName} reserves the right to accept or decline your order for any reason at its discretion. Your order is not accepted until ${legalName} confirms acceptance. We must receive and process your payment before your order is accepted. Please review your order carefully before submitting, as ${legalName} may be unable to accommodate cancellation requests after an order is accepted. In the event that we do not accept, make a change to, or cancel an order, we will attempt to notify you by contacting the email, billing address, and/or phone number provided at the time the order was made.`,
        "Your purchases are subject to return or exchange solely in accordance with our Returns & Refunds Policy.",
        "You represent and warrant that your purchases are for your own personal or household use and not for commercial resale or export, unless you have arranged a separate wholesale or trade agreement with us.",
      ],
    },
    {
      id: "prices",
      number: "4",
      title: "Prices and billing",
      paragraphs: [
        "Prices, discounts and promotions are subject to change without notice. The price charged for a product or service will be the price in effect at the time the order is placed and will be set out in your order confirmation email. Unless otherwise expressly stated, posted prices do not include taxes, shipping, handling, customs or import charges.",
        "Prices posted in our online store may differ from prices offered in physical showrooms or through other third-party channels.",
        "You agree to provide current, complete and accurate purchase, payment and account information for all purchases made at our store. You agree to promptly update your account and other information so that we can complete your transactions and contact you as needed.",
        `Payments on our website are processed through third-party payment gateway providers, including ${paymentGateway.name}. ${legalName} does not store or process sensitive payment information such as card numbers, CVV, UPI credentials, or bank account details. Such information is securely processed by the payment gateway and relevant financial institutions in accordance with applicable laws and regulations.`,
      ],
    },
    {
      id: "shipping",
      number: "5",
      title: "Shipping and delivery",
      paragraphs: [
        "We are not liable for shipping and delivery delays. All delivery times are estimates only and are not guaranteed. We are not responsible for delays caused by shipping carriers, customs processing, or events outside our control. Once we transfer products to the carrier, title and risk of loss passes to you.",
      ],
    },
    {
      id: "ip",
      number: "6",
      title: "Intellectual property",
      paragraphs: [
        `Our Services, including but not limited to all trademarks, brands, text, displays, images, graphics, product reviews, video, and audio, and the design, selection, and arrangement thereof, are owned by ${legalName}, its affiliates or licensors and are protected by Indian and international intellectual property laws.`,
        `These Terms permit you to use the Services for your personal, non-commercial use only. You must not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of the material on the Services without our prior written consent. Except as expressly provided herein, nothing in these Terms grants a license or other rights to you under any patent, trademark, copyright, or other intellectual property of ${legalName} or any third party. Unauthorized use of the Services may violate applicable intellectual property laws. All rights not expressly granted herein are reserved by ${legalName}.`,
        `${legalName}’s names, logos, product and service names, designs, and slogans are trademarks of ${legalName} or its affiliates or licensors. You must not use such trademarks without prior written permission. All other names, logos, product and service names, designs and slogans on the Services are the trademarks of their respective owners.`,
      ],
    },
    {
      id: "tools",
      number: "7",
      title: "Optional tools",
      paragraphs: [
        "You may be provided with access to customer tools offered by third parties as part of the Services, which we neither monitor nor control.",
        "You acknowledge and agree that we provide access to such tools “as is” and “as available” without any warranties, representations or conditions of any kind and without any endorsement. We shall have no liability whatsoever arising from or relating to your use of optional third-party tools.",
        "Any use by you of optional tools offered through the site is entirely at your own risk and discretion, and you should ensure that you are familiar with and approve of the terms on which tools are provided by the relevant third-party provider(s).",
        "We may also, in the future, offer new features through the Services. Such new features shall also be deemed part of the Services and are subject to these Terms of Service.",
      ],
    },
    {
      id: "links",
      number: "8",
      title: "Third-party links",
      paragraphs: [
        "The Services may contain materials and hyperlinks to websites provided or operated by third parties (including any embedded third-party functionality). We are not responsible for examining or evaluating the content or accuracy of any third-party materials or websites you choose to access. If you decide to leave the Services to access these materials or third-party sites, you do so at your own risk.",
        "We are not liable for any harm or damages related to your access of any third-party websites, or your purchase or use of any products, services, resources, or content on any third-party websites. Please review carefully the third party’s policies and practices before you engage in any transaction. Complaints, claims, concerns, or questions regarding third-party products and services should be directed to the third party.",
      ],
    },
    {
      id: "platform",
      number: "9",
      title: "Relationship with technology and payment partners",
      paragraphs: [
        `${legalName} operates the storefront directly. Sales and purchases you make are between you and ${legalName}. Our ${platform.description} support operation of the Services, but they are not a party to your purchase contracts with us.`,
        `By using the Services, you acknowledge that payment gateway providers (including ${paymentGateway.name}) and other infrastructure partners are not responsible for product quality, fulfilment commitments, or consumer disputes arising from purchases made with ${legalName}, except to the extent required by applicable payment network or banking rules.`,
      ],
    },
    {
      id: "privacy",
      number: "10",
      title: "Privacy policy",
      paragraphs: [
        "All personal information we collect through the Services is subject to our Privacy Policy. By using the Services, you acknowledge that you have read our Privacy Policy.",
        "By making a payment through the Services, you acknowledge and consent to the sharing of necessary personal and transactional information with our payment gateway providers, banks, card networks, and regulatory authorities solely for the purpose of completing and securing transactions.",
      ],
    },
    {
      id: "feedback",
      number: "11",
      title: "Feedback",
      paragraphs: [
        "If you submit, upload, post, email, or otherwise transmit any ideas, suggestions, feedback, reviews, proposals, plans, or other content (collectively, “Feedback”), you grant us a perpetual, worldwide, sublicensable, royalty-free license to use, reproduce, modify, publish, distribute and display such Feedback in any medium for any purpose, including for commercial use. We may use our rights under this license to operate, provide, evaluate, enhance, improve and promote the Services and to perform our obligations and exercise our rights under these Terms.",
        "You also represent and warrant that: (i) you own or have all necessary rights to all Feedback; (ii) you have disclosed any compensation or incentives received in connection with your submission of Feedback; and (iii) your Feedback will comply with these Terms. We are under no obligation (1) to maintain your Feedback in confidence; (2) to pay compensation for your Feedback; or (3) to respond to your Feedback.",
        "We may, but have no obligation to, monitor, edit or remove Feedback that we determine in our sole discretion to be unlawful, offensive, threatening, libelous, defamatory, pornographic, obscene or otherwise objectionable or that violates any party’s intellectual property or these Terms of Service.",
        "You agree that your Feedback will not violate any right of any third party, including copyright, trademark, privacy, personality or other personal or proprietary right. You further agree that your Feedback will not contain libelous or otherwise unlawful, abusive or obscene material, or contain any computer virus or other malware that could affect the operation of the Services. You may not use a false email address, pretend to be someone other than yourself, or otherwise mislead us or third parties as to the origin of any Feedback. You are solely responsible for any Feedback you make and its accuracy. We take no responsibility and assume no liability for any Feedback posted by you or any third party.",
      ],
    },
    {
      id: "errors",
      number: "12",
      title: "Errors, inaccuracies and omissions",
      paragraphs: [
        "Occasionally there may be information on or in the Services that contains typographical errors, inaccuracies or omissions that may relate to product descriptions, pricing, promotions, offers, shipping charges, transit times and availability. We reserve the right to correct any errors, inaccuracies or omissions, and to change or update information or cancel orders if any information is inaccurate at any time without prior notice (including after you have submitted your order).",
      ],
    },
    {
      id: "prohibited",
      number: "13",
      title: "Prohibited uses",
      paragraphs: [
        "You may access and use the Services for lawful purposes only. You may not access or use the Services, directly or indirectly:",
      ],
      bullets: [
        "for any unlawful or malicious purpose",
        "to violate any applicable local, national or international law or regulation",
        "to infringe upon or violate our intellectual property rights or the intellectual property rights of others",
        "to harass, abuse, insult, harm, defame, slander, disparage, intimidate, or harm any of our employees or any other person",
        "to transmit false or misleading information",
        "to send, knowingly receive, upload, download, use, or re-use any material that does not comply with these Terms",
        "to transmit, or procure the sending of, any advertising or promotional material without authorization, including junk mail, chain letters, spam, or similar solicitations",
        "to impersonate or attempt to impersonate any other person or entity",
        `to engage in any other conduct that restricts or inhibits anyone’s use or enjoyment of the Services, or which, as determined by us, may harm ${legalName} or users of the Services, or expose them to liability`,
      ],
    },
    {
      id: "prohibited-extra",
      title: "",
      paragraphs: [
        "In addition, you agree not to: (a) upload or transmit viruses or any other type of malicious code that will or may affect the functionality or operation of the Services; (b) reproduce, duplicate, copy, sell, resell or exploit any portion of the Services without authorization; (c) collect or track the personal information of others; (d) spam, phish, pharm, pretext, spider, crawl, or scrape; or (e) interfere with or circumvent the security features of the Services or any related website or the Internet. We reserve the right to suspend, disable, or terminate your account at any time, without notice, if we determine that you have violated any part of these Terms.",
      ],
    },
    {
      id: "termination",
      number: "14",
      title: "Termination",
      paragraphs: [
        "We may terminate this agreement or your access to the Services (or any part thereof) in our sole discretion at any time without notice, and you will remain liable for all amounts due up to and including the date of termination.",
        "The following sections will continue to apply following any termination: Intellectual Property, Feedback, Termination, Disclaimer of Warranties, Limitation of Liability, Indemnification, Severability, Waiver; Entire Agreement, Assignment, Governing Law, Privacy Policy, and any other provisions that by their nature should survive termination.",
      ],
    },
    {
      id: "disclaimer",
      number: "15",
      title: "Disclaimer of warranties",
      paragraphs: [
        "The information presented on or through the Services is made available solely for general information purposes. We do not warrant the accuracy, completeness, or usefulness of this information. Any reliance you place on such information is strictly at your own risk. We disclaim all liability and responsibility arising from any reliance placed on such materials by you or any other visitor to the Services, or by anyone who may be informed of any of its contents.",
        `EXCEPT AS EXPRESSLY STATED BY ${legalName.toUpperCase()}, THE SERVICES AND ALL PRODUCTS OFFERED THROUGH THE SERVICES ARE PROVIDED “AS IS” AND “AS AVAILABLE” FOR YOUR USE, WITHOUT ANY REPRESENTATION, WARRANTIES OR CONDITIONS OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ALL IMPLIED WARRANTIES OR CONDITIONS OF MERCHANTABILITY, MERCHANTABLE QUALITY, FITNESS FOR A PARTICULAR PURPOSE, DURABILITY, TITLE, AND NON-INFRINGEMENT. WE DO NOT GUARANTEE, REPRESENT OR WARRANT THAT YOUR USE OF THE SERVICES WILL BE UNINTERRUPTED, TIMELY, SECURE OR ERROR-FREE. SOME JURISDICTIONS LIMIT OR DO NOT ALLOW THE DISCLAIMER OF IMPLIED OR OTHER WARRANTIES SO THE ABOVE DISCLAIMER MAY NOT APPLY TO YOU.`,
      ],
    },
    {
      id: "liability",
      number: "16",
      title: "Limitation of liability",
      paragraphs: [
        `TO THE FULLEST EXTENT PROVIDED BY LAW, IN NO CASE SHALL ${legalName.toUpperCase()}, OUR PARTNERS, DIRECTORS, OFFICERS, EMPLOYEES, AFFILIATES, AGENTS, CONTRACTORS, SERVICE PROVIDERS OR LICENSORS, INCLUDING PAYMENT GATEWAY PROVIDERS, BE LIABLE FOR ANY DAMAGES ARISING FROM:`,
      ],
      bullets: [
        "payment failures",
        "transaction declines",
        "technical errors",
        "bank-side issues",
        "third-party service interruptions",
      ],
    },
    {
      id: "liability-extra",
      title: "",
      paragraphs: [
        "All payment-related disputes, including chargebacks and refunds, are governed by our Returns & Refunds Policy and applicable banking and network rules.",
      ],
    },
    {
      id: "indemnification",
      number: "17",
      title: "Indemnification",
      paragraphs: [
        `You agree to indemnify, defend and hold harmless ${legalName} and our affiliates, partners, officers, directors, employees, agents, contractors, licensors, and service providers from any losses, damages, liabilities or claims, including reasonable attorneys’ fees, payable to any third party due to or arising out of (1) your breach of these Terms of Service or the documents they incorporate by reference, (2) your violation of any law or the rights of a third party, or (3) your access to and use of the Services.`,
        "We will notify you of any indemnifiable claim, provided that a failure to promptly notify will not relieve you of your obligations unless you are materially prejudiced. We may control the defense and settlement of such claim at your expense, including choice of counsel, but will not settle any claim requiring non-monetary obligations from you without your consent (not to be unreasonably withheld). You will cooperate in the defense of indemnified claims, including by providing relevant documents.",
      ],
    },
    {
      id: "severability",
      number: "18",
      title: "Severability",
      paragraphs: [
        "In the event that any provision of these Terms of Service is determined to be unlawful, void or unenforceable, such provision shall nonetheless be enforceable to the fullest extent permitted by applicable law, and the unenforceable portion shall be deemed to be severed from these Terms of Service. Such determination shall not affect the validity and enforceability of any other remaining provisions.",
      ],
    },
    {
      id: "waiver",
      number: "19",
      title: "Waiver; entire agreement",
      paragraphs: [
        "The failure of us to exercise or enforce any right or provision of these Terms of Service shall not constitute a waiver of such right or provision.",
        "These Terms of Service and any policies or operating rules posted by us on this site or in respect to the Services constitute the entire agreement and understanding between you and us and govern your use of the Services, superseding any prior or contemporaneous agreements, communications and proposals, whether oral or written, between you and us (including any prior versions of the Terms of Service).",
        "Any ambiguities in the interpretation of these Terms of Service shall not be construed against the drafting party.",
      ],
    },
    {
      id: "assignment",
      number: "20",
      title: "Assignment",
      paragraphs: [
        "You may not delegate, transfer or assign this Agreement or any of your rights or obligations under these Terms without our prior written consent, and any such attempt will be null and void. We may transfer, assign, or delegate these Terms and our rights and obligations without consent or notice to you.",
      ],
    },
    {
      id: "law",
      number: "21",
      title: "Governing law",
      paragraphs: [
        `These Terms of Service and any separate agreements whereby we provide you Services shall be governed by and construed in accordance with the laws of ${governingLaw.country}. You and ${legalName} agree that the courts located in ${governingLaw.courts} shall have exclusive jurisdiction over any disputes arising under these Terms.`,
      ],
    },
    {
      id: "headings",
      number: "22",
      title: "Headings",
      paragraphs: [
        "The headings used in this agreement are included for convenience only and will not limit or otherwise affect these Terms.",
      ],
    },
    {
      id: "changes",
      number: "23",
      title: "Changes to Terms of Service",
      paragraphs: [
        "You can review the most current version of the Terms of Service at any time on this page.",
        "We reserve the right, in our sole discretion, to update, change, or replace any part of these Terms of Service by posting updates and changes to our website. It is your responsibility to check our website periodically for changes. We will notify you of any material changes to these Terms in accordance with applicable law, and such changes will be effective on the date specified in the notice. Your continued use of or access to the Services following the posting of any changes to these Terms of Service constitutes acceptance of those changes.",
      ],
    },
  ];
}

export function TermsOfServiceContent() {
  const sections = buildSections();
  const { brandName, supportEmail, termsOfService } = company;

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 md:py-14">
      <header className="border-b border-rc-border pb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-rc-muted">
          Legal
        </p>
        <h1 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-rc-navy md:text-4xl">
          Terms of Service
        </h1>
        <p className="mt-3 text-sm text-rc-muted">
          Last updated:{" "}
          <time dateTime={termsOfService.lastUpdatedIso}>
            {termsOfService.lastUpdated}
          </time>
        </p>
        <p className="mt-4 text-sm text-rc-muted">
          Related:{" "}
          <Link href="/privacy" className="font-medium text-rc-accent hover:underline">
            Privacy Policy
          </Link>
          {" · "}
          <Link href="/returns" className="font-medium text-rc-accent hover:underline">
            Returns &amp; Refunds
          </Link>
        </p>
      </header>

      <div className="mt-10 space-y-10 text-sm leading-relaxed text-rc-muted md:text-[15px] md:leading-7">
        {sections.map((section) => (
          <section
            key={section.id}
            aria-labelledby={section.title ? section.id : undefined}
          >
            {section.title ? (
              <h2
                id={section.id}
                className="font-heading text-xl font-semibold tracking-tight text-rc-navy md:text-2xl"
              >
                {section.number ? `Section ${section.number} — ${section.title}` : section.title}
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
                  <li key={item.slice(0, 64)}>{item}</li>
                ))}
              </ul>
            ) : null}
            {section.id === "privacy" ? (
              <p className="mt-4">
                Read our{" "}
                <Link href="/privacy" className="font-medium text-rc-accent hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>
            ) : null}
            {section.id === "orders" ? (
              <p className="mt-4">
                See our{" "}
                <Link href="/returns" className="font-medium text-rc-accent hover:underline">
                  Returns &amp; Refunds Policy
                </Link>
                .
              </p>
            ) : null}
          </section>
        ))}

        <section aria-labelledby="contact">
          <h2
            id="contact"
            className="font-heading text-xl font-semibold tracking-tight text-rc-navy md:text-2xl"
          >
            Section 24 — Contact information
          </h2>
          <p className="mt-4">
            Questions about the Terms of Service should be sent to us at:
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
            Prefer live help?{" "}
            <Link href="/help" className="font-medium text-rc-accent hover:underline">
              Visit Help &amp; Support
            </Link>{" "}
            for {brandName}.
          </p>
        </section>
      </div>
    </article>
  );
}
