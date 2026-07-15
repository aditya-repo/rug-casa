import {
  IconGift,
  IconMedal,
  IconReturn,
  IconTruck,
} from "@/components/layout/icons";

const items = [
  {
    icon: IconGift,
    title: "Wide Range",
    subtitle: "1000+ Designs",
  },
  {
    icon: IconMedal,
    title: "Premium Quality",
    subtitle: "Built to Last",
  },
  {
    icon: IconTruck,
    title: "Free Shipping",
    subtitle: "Pan India",
  },
  {
    icon: IconReturn,
    title: "Easy Returns",
    subtitle: "7 Days Return Policy",
  },
] as const;

export function TrustBar() {
  return (
    <section
      className="border-t border-rc-border bg-rc-surface py-4 mt-10 md:mt-2 md:py-10"
      aria-label="Why shop with Rugs Bhadohi"
    >
      <div className="mx-auto max-w-7xl px-2 md:px-4">
        <ul className="grid grid-cols-4 gap-1.5 md:gap-4">
          {items.map(({ icon: Icon, title, subtitle }) => (
            <li
              key={title}
              className="flex min-w-0 flex-col items-center gap-1 text-center md:flex-row md:items-start md:gap-3 md:text-left"
            >
              <Icon className="h-5 w-5 shrink-0 text-rc-navy md:h-9 md:w-9" />
              <div className="min-w-0">
                <p className="text-[10px] font-semibold leading-tight text-rc-navy md:text-sm">
                  {title}
                </p>
                <p className="mt-0.5 text-[9px] leading-tight text-rc-muted md:text-sm">
                  {subtitle}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
