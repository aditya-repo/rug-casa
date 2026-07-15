import { company } from "@/lib/data/company";

export const buyingGuideContent = {
  eyebrow: "Buying guide",
  publishedLabel: "Published",
  publishedDate: "January 22, 2025",
  publishedDateIso: "2025-01-22",
  title: "The ultimate guide to choosing the perfect rug for your home",
  intro: [
    "Rugs are more than floor coverings — they bring warmth, personality, and cohesion to a room. With so many sizes, styles, and materials available, choosing the right one can feel overwhelming.",
    `This guide walks you through purpose, size, material, style, layering, and care — whether you need living-room anchors, dining pieces, bedroom comfort, or hallway runners from ${company.brandName}.`,
  ],
  whyMatter: {
    title: "Why rugs matter in home décor",
    body: "Rugs quietly shape how a room works and feels. They define zones, add texture, soften acoustics, and pull furniture into a cohesive composition. Decorating with rugs is one of the fastest ways to make a space feel finished — the right piece does more than cover floor; it elevates the whole room.",
  },
  howToTitle: "How to choose the perfect rug",
  steps: [
    {
      number: "1",
      title: "Determine your rug’s purpose",
      body: "Start with role: Will it anchor a seating group, protect hard floors, quiet a hallway, or add colour? Purpose drives size, construction, and fibre. Living-room rugs are often larger to sit under furniture, while runners prioritize durable traffic paths.",
    },
    {
      number: "2",
      title: "Use a rug size guide",
      body: "Proportions matter. A rug that is too small can make furniture feel adrift. Use these room rules as a starting point:",
      bullets: [
        "Living rooms: Place at least the front legs of major seating on the rug. Common sizes are 8×10 ft or 9×12 ft, depending on layout.",
        "Dining rooms: Extend the rug 24–36 inches beyond the table so chairs stay on the rug when pulled out.",
        "Bedrooms: Position a rug under the lower two-thirds of the bed so it frames the sides and foot — often 6×9 or 8×10.",
        "Hallways & entryways: Leave a slim margin of floor visible on each side of a runner for balance.",
        "Small rooms: Choose a rug large enough to connect furniture without crowding — scale beats too-many small mats.",
      ],
    },
    {
      number: "3",
      title: "Choose the right material",
      body: "Match fibre to lifestyle and room demands:",
      materials: [
        {
          name: "Wool",
          detail:
            "Durable, soft, and naturally resilient — a strong classic for busy living areas.",
        },
        {
          name: "Cotton",
          detail:
            "Lightweight and easy to clean — suited to casual kitchens, playrooms, and relaxed spaces.",
        },
        {
          name: "Jute & sisal",
          detail:
            "Textured natural fibres that add warmth; less ideal where spills are frequent.",
        },
        {
          name: "Silk & silk blends",
          detail:
            "Luminous and refined for lower-traffic rooms or statement pieces; need careful maintenance.",
        },
        {
          name: "Synthetics",
          detail:
            "Practical nylon or polyester options for families and pets — easy care and broad design range.",
        },
      ],
    },
    {
      number: "4",
      title: "Focus on style and colour",
      body: "Style should support the mood of the room and the palette already in place:",
      styles: [
        {
          name: "Traditional",
          detail: "Intricate patterns and richer tones for formal or heritage schemes.",
        },
        {
          name: "Modern",
          detail: "Clean geometries and minimal fields for contemporary interiors.",
        },
        {
          name: "Vintage & distressed",
          detail: "Softened colour and character for lived-in, layered looks.",
        },
        {
          name: "Shag & plush",
          detail: "Extra texture and comfort underfoot in bedrooms or lounge zones.",
        },
      ],
    },
    {
      number: "5",
      title: "Layer rugs for depth",
      body: "Layering adds depth without over-decorating: start with a large neutral base, then place a smaller patterned rug on top. It works especially well in living rooms and bedrooms and lets you trial colour and pattern with less risk.",
    },
    {
      number: "6",
      title: "Plan for maintenance",
      body: "Beauty lasts longer with a simple care rhythm: vacuum regularly (avoid harsh beater modes on handmade pieces), blot spills promptly, and schedule professional cleaning for fine rugs when needed. See our Care Guide for detailed tips.",
    },
  ],
  rooms: {
    title: "The perfect rug for every room",
    items: [
      {
        name: "Living rooms",
        detail:
          "Go generous — rugs should connect seating and leave a balanced border of floor around the edges.",
      },
      {
        name: "Dining rooms",
        detail:
          "Choose a wipe-friendly construction and a size that keeps chairs on the rug when occupied.",
      },
      {
        name: "Bedrooms",
        detail:
          "Soft, inviting piles under or beside the bed create a calm landing for bare feet.",
      },
      {
        name: "Hallways",
        detail:
          "Durable runners add style while handling daily traffic and guiding movement.",
      },
    ],
  },
  closing: {
    title: "Final thoughts",
    paragraphs: [
      "Choosing a rug is both practical and personal. With clear purpose, the right size, and a material that matches how you live, you can build rooms that feel beautiful and usable every day.",
      `Take your time, explore options, and treat a well-chosen rug as an investment in comfort and atmosphere. Browse the ${company.brandName} collection when you’re ready to find your next piece.`,
    ],
  },
  cta: {
    shop: "Shop rugs",
    care: "Read care guide",
    careInline: "Open the Care Guide",
    contact: "Ask our team",
  },
} as const;
