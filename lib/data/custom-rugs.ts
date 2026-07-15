import { company } from "@/lib/data/company";

export const customRugsContent = {
  eyebrow: "Custom rugs",
  title: "From idea to thread — fully custom rugs",
  intro: `Turn your dream rug into reality with ${company.brandName}. Whether you’re designing for your home, office, or a special project, we offer end-to-end customization to bring your vision to life.`,
  whatTitle: "What can be customized?",
  customization: [
    {
      title: "Size",
      body: "From runners to oversized rugs, made to your exact dimensions.",
    },
    {
      title: "Colors",
      body: "Match your interior palette with custom dyeing.",
    },
    {
      title: "Design",
      body: "Share your ideas or draw inspiration from our collections.",
    },
    {
      title: "Material",
      body: "Wool, viscose, cotton, jute, or blends — your choice.",
    },
    {
      title: "Shape",
      body: "Round, oval, square, or fully custom outlines.",
    },
  ],
  processTitle: "How it works",
  process: [
    {
      number: "1",
      title: "Share your idea",
      body: "Send reference images, sketches, or a detailed description of what you want.",
    },
    {
      number: "2",
      title: "Get a quote & timeline",
      body: "We’ll reply with a clear price estimate, production time, and practical recommendations.",
    },
    {
      number: "3",
      title: "Watch it come to life",
      body: "Experienced artisans handcraft your rug with care, and we share progress updates along the way — including images and milestones.",
    },
    {
      number: "4",
      title: "Delivered to your door",
      body: "Your rug is packed securely and shipped worldwide, ready to unroll in your space.",
    },
  ],
  whyTitle: "Why choose us?",
  why: [
    "Decades of expertise in handmade rugs",
    "Made in India by skilled artisans",
    "Thoughtful, more sustainable production practices",
    "Premium craftsmanship built for lasting durability",
  ],
  projectsTitle: "Custom projects we handle",
  projects: [
    "Interior design & architecture collaborations",
    "Commercial & hospitality programmes",
    "Residential and home makeovers",
    "Wedding or event décor rugs",
    "Personalized gifting or heirloom pieces",
  ],
  leadTime: {
    title: "Lead time",
    body: "Depending on size, design complexity, and material, production typically takes 2–3 weeks. We’ll confirm the timeline once your design is finalized.",
  },
  cta: {
    title: "Let’s get started",
    intro: "Ready to create your own custom rug? Reach us on WhatsApp or email to begin:",
    steps: [
      "Share your requirements on WhatsApp or email.",
      "Receive a personalized quote within 24–48 hours.",
      "Approve a sample (optional — recommended for custom or large programmes).",
      "Production and delivery timelines are confirmed so the project stays clear and predictable.",
    ],
    whatsapp: "Message us on WhatsApp",
    email: "Email your brief",
    contactPage: "All contact details",
  },
} as const;
