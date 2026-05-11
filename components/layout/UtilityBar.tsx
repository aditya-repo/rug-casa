import {
  IconBadge,
  IconLock,
  IconReturn,
  IconTruck,
} from "@/components/layout/icons";

const desktopItems = [
  { icon: IconBadge, text: "100% Quality Assured Rugs" },
  { icon: IconTruck, text: "Free Shipping Across India" },
  { icon: IconReturn, text: "Easy 7 Days Return" },
  { icon: IconLock, text: "Secure Payments" },
] as const;

export function UtilityBar() {
  return (
    <>
      <div className="hidden border-b border-rc-border bg-white md:block">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-2 px-4 py-2.5 text-xs text-rc-muted sm:justify-between sm:text-sm">
          {desktopItems.map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-2 text-rc-navy"
            >
              <Icon className="h-4 w-4 shrink-0 text-rc-navy" />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 bg-rc-navy px-4 py-2.5 text-sm text-white md:hidden">
        <IconTruck className="h-4 w-4 shrink-0" aria-hidden />
        <span>Free Shipping Across India</span>
      </div>
    </>
  );
}
