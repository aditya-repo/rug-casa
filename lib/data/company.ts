/**
 * Single source for brand, legal, and contact details used across storefront pages.
 * Update values here — privacy policy, footer contact copy, and related pages read from this object.
 */
export const company = {
  brandName: "Rugs Bhadohi",
  legalName: "Rugs Bhadohi",
  tagline: "Beautiful rugs and carpets to elevate every space in your home.",

  websiteUrl: "https://rugsbhadohi.com",
  supportEmail: "support@rugsbhadohi.com",

  address: {
    line1: "Khasra No. 799, Aurangabad, Aurai",
    line2: "Bhadohi, Uttar Pradesh – 221301",
    country: "India",
  },

  phone: {
    display: "+91 98765 43210",
    tel: "tel:+919876543210",
  },

  /** Optional secondary support line shown on policy/contact pages */
  phoneAlt: {
    display: "+91 98765 43211",
    tel: "tel:+919876543211",
  },

  whatsapp: {
    display: "+91 98765 43210",
    e164: "919876543210",
  },

  refundPolicy: {
    returnWindowDays: 14,
    refundBusinessDays: 10,
    followUpBusinessDays: 15,
    lastUpdated: "January 12, 2026",
    lastUpdatedIso: "2026-01-12",
  },

  /** Primary payment gateway referenced in policies */
  paymentGateway: {
    name: "Razorpay",
    privacyUrl: "https://razorpay.com/privacy/",
  },

  /** Hosting / platform note for privacy disclosures (custom storefront, not Shopify) */
  platform: {
    name: "our self-hosted storefront and cloud infrastructure providers",
    description:
      "infrastructure and analytics partners that help us operate and improve the website",
  },

  privacyPolicy: {
    lastUpdated: "January 12, 2026",
    lastUpdatedIso: "2026-01-12",
  },

  termsOfService: {
    lastUpdated: "January 12, 2026",
    lastUpdatedIso: "2026-01-12",
  },

  governingLaw: {
    country: "India",
    courts: "Uttar Pradesh, India",
  },

  contactPage: {
    eyebrow: "Contact us",
    title: "Speak with our team",
    intro:
      "Whether you need help with an order, a wholesale enquiry, or product advice, reach us through any channel below. We typically reply within one business day.",
    labels: {
      address: "Address",
      email: "Email",
      phone: "Phone",
      phoneAlt: "Alternate phone",
      whatsapp: "WhatsApp",
    },
    actions: {
      email: "Send an email",
      call: "Call now",
      callAlt: "Call alternate line",
      whatsapp: "Chat on WhatsApp",
      maps: "Open in maps",
      help: "Help & support",
    },
  },
} as const;

export type Company = typeof company;

export function companyFullAddress(): string {
  const { line1, line2, country } = company.address;
  return `${line1}, ${line2}, ${country}`;
}

export function companyWhatsAppUrl(): string {
  return `https://wa.me/${company.whatsapp.e164}`;
}
