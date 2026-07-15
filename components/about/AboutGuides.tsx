const pillars = [
  {
    title: "Handed-down skill",
    body: "Commercial operations started in 2016, while the family’s loom knowledge in Bhadohi stretches nearly eight decades — shaping how we select yarn, weave, and finish every programme.",
  },
  {
    title: "Trade-ready production",
    body: "Runs are scheduled for overseas buyers: clear paperwork, protective packing, dependable lead times, and quality that holds up order after order.",
  },
  {
    title: "Accountable practice",
    body: "Recognised certifications and trade memberships back our approach to materials, environmental care, and fair working standards across the supply chain.",
  },
] as const;

export function AboutGuides() {
  return (
    <section
      className="bg-rc-navy-dark py-16 text-white md:py-24"
      aria-labelledby="about-guides-heading"
    >
      <div className="mx-auto max-w-7xl px-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55">
          What guides us
        </p>
        <h2
          id="about-guides-heading"
          className="mt-4 max-w-xl font-heading text-3xl font-semibold leading-tight tracking-tight text-white md:text-4xl lg:text-[2.75rem] lg:leading-[1.15]"
        >
          Heritage at the loom, reliability for every buyer.
        </h2>

        <div className="mt-12 grid gap-10 md:mt-16 md:grid-cols-3 md:gap-12 lg:gap-16">
          {pillars.map((pillar) => (
            <article key={pillar.title} className="min-w-0">
              <div className="mb-5 h-px w-full bg-white/25" aria-hidden />
              <h3 className="font-heading text-xl font-semibold tracking-tight text-white md:text-2xl">
                {pillar.title}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-white/70 md:text-[15px] md:leading-7">
                {pillar.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
