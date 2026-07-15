export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export const homepageFaqs: FaqItem[] = [
  {
    id: "shipping",
    question: "Do you offer free shipping across India?",
    answer:
      "Yes. Rugs Bhadohi provides free pan-India shipping on all orders. Most metropolitan deliveries arrive within 5–7 business days; other locations typically take 7–12 business days depending on courier availability.",
  },
  {
    id: "returns",
    question: "What is your return and exchange policy?",
    answer:
      "We offer an easy 7-day return window for unused rugs in original condition with tags intact. If the product arrives damaged or incorrect, contact us within 48 hours and we will arrange a free pickup and replacement or refund.",
  },
  {
    id: "handmade",
    question: "Are your rugs handcrafted?",
    answer:
      "Yes. Our collections are handwoven and hand-knotted by skilled artisans in Bhadohi—one of India’s historic rug-making hubs—using traditional techniques with modern design sensibilities.",
  },
  {
    id: "sizing",
    question: "How do I choose the right rug size for my room?",
    answer:
      "For living rooms, leave 15–30 cm of floor showing around furniture edges. Dining rugs should extend at least 60 cm beyond the table on all sides so chairs stay on the rug when pulled out. Our product pages list exact dimensions in feet for easy planning.",
  },
  {
    id: "care",
    question: "How should I clean and care for my rug?",
    answer:
      "Vacuum regularly without a beater bar, blot spills immediately with a clean cloth, and rotate the rug every few months for even wear. For deep cleans, we recommend professional rug washing suited to wool and bamboo silk fibres.",
  },
  {
    id: "custom",
    question: "Can I order a custom size or design?",
    answer:
      "Custom sizes and colourways are available for select collections. Reach out via WhatsApp or our help page with your preferred dimensions, palette, and timeline, and our team will confirm feasibility and lead time.",
  },
];
