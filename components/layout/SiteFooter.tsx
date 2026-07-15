import Link from "next/link";

const linkColumns = [
  {
    title: "Shop",
    links: [
      { href: "/shop", label: "All Rugs" },
      { href: "/shop", label: "Shop by Material" },
      { href: "/shop", label: "Best Sellers" },
      { href: "/shop", label: "New Arrivals" },
      { href: "/custom-rugs", label: "Custom Rugs" },
    ],
  },
  {
    title: "Customer Service",
    links: [
      { href: "/contact", label: "Contact Us" },
      { href: "/shipping", label: "Shipping Policy" },
      { href: "/returns", label: "Returns & Refunds" },
      { href: "/bulk", label: "Bulk Orders" },
      { href: "/buying-guide", label: "Rug Buying Guide" },
    ],
  },
  {
    title: "Information",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/care", label: "Care Guide" },
      { href: "/blog", label: "Blog" },
      { href: "/terms", label: "Terms & Conditions" },
      { href: "/privacy", label: "Privacy Policy" },
    ],
  },
] as const;

const socialLinks = [
  { href: "https://www.facebook.com/", label: "Facebook" },
  { href: "https://www.instagram.com/", label: "Instagram" },
  { href: "https://www.pinterest.com/", label: "Pinterest" },
  { href: "https://x.com/", label: "X (Twitter)" },
  { href: "https://wa.me/", label: "WhatsApp" },
] as const;

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-gradient-to-br from-[#0f2038] to-[#091527] text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 md:py-10">
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 border-b border-white/15 pb-6 md:grid-cols-[minmax(0,1.25fr)_repeat(4,minmax(0,1fr))] md:gap-8">
          <div className="col-span-2 md:col-span-1">
            <p className="font-heading text-2xl font-semibold">Rugs Bhadohi</p>
            <p className="mt-3 max-w-xs text-sm text-white/80">
              Beautiful rugs and carpets to elevate every space in your home.
            </p>
          </div>

          {linkColumns.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold">{column.title}</h3>
              <ul className="mt-3 space-y-1.5 text-sm text-white/80">
                {column.links.map((item) => (
                  <li key={item.href + item.label}>
                    <Link href={item.href} className="hover:text-white">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="text-sm font-semibold">Social Media</h3>
            <ul className="mt-3 space-y-1.5 text-sm text-white/80">
              {socialLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-4 flex flex-col items-center justify-between gap-3 text-xs text-white/70 md:flex-row">
          <p>© {new Date().getFullYear()} Rugs Bhadohi. All Rights Reserved.</p>
          <div className="flex items-center gap-2 text-[10px]">
            <span className="rounded bg-white px-2 py-1 text-black">VISA</span>
            <span className="rounded bg-white px-2 py-1 text-black">MC</span>
            <span className="rounded bg-white px-2 py-1 text-black">AMEX</span>
            <span className="rounded bg-white px-2 py-1 text-black">UPI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
