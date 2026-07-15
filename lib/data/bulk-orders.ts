import { company } from "@/lib/data/company";

export const bulkOrdersContent = {
  heroTitle: `Wholesale rugs & project carpets | ${company.brandName}`,
  heroIntro: `${company.brandName} supplies volume rug programmes for retailers, designers, hospitality teams, and commercial buyers. From our base in Bhadohi, India, we produce custom carpets, classic woven styles, contemporary area rugs, and made-to-order floor coverings for trade and project work.`,

  audience: {
    title: "Who we work with",
    intro:
      "We support professionals and organisations that need a dependable partner for wholesale and commercial rug programmes:",
    items: [
      {
        title: "Retailers & distributors",
        body: "Build stock depth with handmade rugs at consistent trade pricing.",
      },
      {
        title: "Interior designers & studios",
        body: "Specify custom pieces that match client finishes, sizes, and timelines.",
      },
      {
        title: "Hotels & hospitality groups",
        body: "Supply lobbies, suites, banquet floors, and corridor runs at scale.",
      },
      {
        title: "Events & venue partners",
        body: "Temporary or permanent flooring for weddings, showcases, and large gatherings.",
      },
      {
        title: "Architects & contractors",
        body: "Specification-ready carpets for residential and commercial developments.",
      },
      {
        title: "Corporate buyers",
        body: "Branded or custom-sized rugs for offices, lounges, and reception spaces.",
      },
    ],
  },

  custom: {
    title: "Custom manufacturing for your brief",
    intro:
      "Every project has different floor requirements. We produce handmade rugs configured to your brief from Bhadohi:",
  },

  customizationRows: [
    {
      option: "Shapes",
      choices:
        "Rectangle, round, runner, square, oval, or made-to-measure outlines",
    },
    {
      option: "Materials",
      choices:
        "New Zealand wool, Indian wool, viscose (art silk), jute, pure silk, wool–silk blends, cotton",
    },
    {
      option: "Styles & patterns",
      choices:
        "Modern contemporary, traditional Persian-inspired, abstract, vintage distressed, geometric, floral, or original designs",
    },
    {
      option: "Sizes",
      choices:
        "Standard sizes or custom dimensions — from accent pieces to oversized lobby carpets",
    },
    {
      option: "Construction",
      choices:
        "Hand-knotted, hand-tufted, flat-weave (kilim / dhurrie), shag, loop & cut pile",
    },
    {
      option: "Dyeing",
      choices:
        "Vegetable / natural dyes or chrome dyes — AZO-free and eco-conscious options available",
    },
  ] as const,

  moq: {
    quantityLabel: "5 pcs",
    note: "We support small wholesale trial runs and large commercial contracts. Single-piece statement rugs for hotels and premium interiors can also be discussed.",
  },

  whyBuy: {
    title: `Why source bulk rugs from ${company.brandName}?`,
    items: [
      {
        title: "Factory-direct supply",
        body: "Work with a Bhadohi manufacturer — clearer pricing without unnecessary layers.",
      },
      {
        title: "Handmade expertise",
        body: "Artisan know-how across traditional techniques and contemporary programmes.",
      },
      {
        title: "Volume-friendly pricing",
        body: "Structured wholesale rates that improve with larger, repeatable orders.",
      },
      {
        title: "Export experience",
        body: "Shipping experience supporting buyers across the USA, UK, Europe, UAE, Australia, and Asia.",
      },
      {
        title: "Quality controls",
        body: "Sample approval, photography packs, and pre-shipment checks before dispatch.",
      },
      {
        title: "Responsible options",
        body: "Natural fibres, thoughtful dye choices, and production aligned to ethical expectations.",
      },
    ],
  },

  shipping: {
    title: "Shipping & delivery",
    items: [
      {
        title: "Pan-India coverage",
        body: "Qualified bulk programmes can include complimentary domestic shipping.",
      },
      {
        title: "International export",
        body: "Shipments to 50+ countries via express carriers and freight partners.",
      },
      {
        title: "Tracked handoff",
        body: "Door-to-door visibility once your consignment leaves the workshop.",
      },
      {
        title: "Protective packing",
        body: "Rugs are rolled and wrapped for waterproof, transit-ready protection.",
      },
      {
        title: "Bulk logistics support",
        body: "Large-quantity handmade carpet programmes can qualify for freight support.",
      },
    ],
  },

  process: {
    title: "How to place a bulk rug order",
    steps: [
      {
        title: "Share your requirements",
        body: "Tell us quantities, sizes, materials, styles, and destination.",
      },
      {
        title: "Receive a wholesale quote in 24–48 hours",
        bullets: [
          "Unit pricing for the requested volumes",
          "Material and design recommendations",
          "Production timeline and delivery estimates",
        ],
      },
      {
        title: "Approve a sample (optional, recommended for custom or large programmes)",
        bullets: [
          "Physical sample or high-resolution detail imagery",
          "Colour, texture, and pile height confirmation",
        ],
      },
      {
        title: "Production begins",
        body: "We keep you updated through milestones and quality checkpoints.",
      },
      {
        title: "Inspect, pack, and deliver",
        body: "Final checks, secure packing, and tracked delivery to your address.",
      },
    ],
  },

  cta: {
    title: "Request your wholesale quote",
    body: `Ready for premium handmade rugs at volume? Whether you need a boutique hospitality set or a larger retail assortment, ${company.brandName} balances craft, customization, and clear trade pricing.`,
  },
} as const;
