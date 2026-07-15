const milestones = [
  { value: "1946", label: "Roots in rug craft" },
  { value: "2016", label: "Rugs Bhadohi established" },
  { value: "Bhadohi", label: "India-based production" },
] as const;

export function AboutStory() {
  return (
    <section
      className="relative overflow-hidden bg-rc-surface py-16 md:py-24"
      aria-labelledby="about-story-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.45]"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 50% at 0% 0%, rgba(26,39,68,0.07), transparent 55%), radial-gradient(ellipse 60% 40% at 100% 100%, rgba(26,39,68,0.05), transparent 50%)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4">
        <div className="grid gap-10 md:grid-cols-2 md:gap-16 lg:gap-24">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-rc-muted">
              Our story
            </p>
            <h2
              id="about-story-heading"
              className="mt-4 max-w-md font-heading text-3xl font-semibold leading-tight tracking-tight text-rc-navy md:text-4xl lg:text-[2.75rem] lg:leading-[1.15]"
            >
              From family looms to interiors worldwide.
            </h2>
          </div>

          <div className="space-y-5 text-sm leading-relaxed text-rc-muted md:text-[15px] md:leading-7">
            <p>
              Bhadohi is one of India’s foremost centres for handmade rugs. Our
              work sits in that tradition — skilled handwork, assured material
              judgement, patient finishing, and a practical understanding of
              export programmes and project demands.
            </p>
            <p>
              The business took formal shape in 2016, yet the craft behind it
              reaches back to a family practice that began in 1946. That blend
              keeps us anchored in heritage while staying responsive to
              contemporary design briefs and delivery timelines.
            </p>
          </div>
        </div>

        <div className="mt-14 grid gap-8 border-t border-rc-border/80 pt-10 sm:grid-cols-3 sm:gap-0 md:mt-16 md:pt-12">
          {milestones.map((item, index) => (
            <div
              key={item.value}
              className={`about-fade-up sm:px-6 ${index > 0 ? "sm:border-l sm:border-rc-border/80" : "sm:pl-0"}`}
              style={{ animationDelay: `${420 + index * 120}ms` }}
            >
              <p className="font-heading text-3xl font-semibold tracking-tight text-rc-navy md:text-4xl">
                {item.value}
              </p>
              <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-rc-muted">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
