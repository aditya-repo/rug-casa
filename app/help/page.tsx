import type { Metadata } from "next";
import Link from "next/link";
import {
  AccountBreadcrumb,
  DesktopAccountSidebar,
} from "@/components/account/AccountChrome";
import { HelpContactSection } from "@/components/help/HelpContactSection";
import { IconArrowLeft } from "@/components/layout/icons";
import { HeaderAndNav } from "@/components/layout/HeaderAndNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { UtilityBar } from "@/components/layout/UtilityBar";

export const metadata: Metadata = {
  title: "Help & Support — Rugs Bhadohi",
  description:
    "Call or message Rugs Bhadohi on WhatsApp for orders, delivery, and product help.",
};

export default function HelpPage() {
  return (
    <div className="flex min-h-full flex-col bg-white">
      <UtilityBar />
      <HeaderAndNav />
      <main className="flex-1 bg-white pb-10 md:pb-14">
        <div className="mx-auto max-w-7xl px-4 py-4 md:py-8">
          {/* Desktop: same account shell; center column = help only */}
          <div className="hidden md:block">
            <AccountBreadcrumb
              items={[
                { label: "Home", href: "/" },
                { label: "My Account", href: "/account" },
                { label: "Help & Support" },
              ]}
            />
            <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
              <DesktopAccountSidebar activeNavId="help" />
              <div className="min-w-0 flex-1 space-y-6">
                <header>
                  <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 lg:text-[28px] lg:leading-tight">
                    Help & Support
                  </h1>
                </header>
                <HelpContactSection variant="embedded" />
                <p className="text-sm text-neutral-500">
                  Prefer email?{" "}
                  <Link
                    href="/contact"
                    className="font-semibold text-rc-accent hover:underline"
                  >
                    Contact us
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Mobile: full-width help (unchanged standalone flow) */}
          <div className="pb-10 md:hidden">
            <div className="flex min-w-0 items-center gap-1.5">
              <Link
                href="/account"
                className="-ml-1 shrink-0 rounded-full p-2 text-rc-navy hover:bg-rc-surface"
                aria-label="Back to my account"
              >
                <IconArrowLeft className="h-5 w-5" />
              </Link>
              <nav
                className="min-w-0 flex-1 overflow-hidden text-xs text-rc-muted"
                aria-label="Breadcrumb"
              >
                <ol className="flex flex-nowrap items-center gap-1.5 overflow-hidden">
                  <li className="shrink-0">
                    <Link href="/" className="hover:text-rc-navy">
                      Home
                    </Link>
                  </li>
                  <li className="shrink-0" aria-hidden>
                    /
                  </li>
                  <li className="shrink-0">
                    <Link href="/account" className="hover:text-rc-navy">
                      My Account
                    </Link>
                  </li>
                  <li className="shrink-0" aria-hidden>
                    /
                  </li>
                  <li className="shrink-0 font-medium text-rc-navy">Help & Support</li>
                </ol>
              </nav>
            </div>

            <header className="mt-4 border-b border-rc-border pb-4">
              <h1 className="font-heading text-2xl font-semibold text-rc-navy">
                Help & Support
              </h1>
            </header>

            <div className="mt-8">
              <HelpContactSection />
            </div>

            <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-rc-muted">
              Prefer email? Use{" "}
              <Link
                href="/contact"
                className="font-semibold text-rc-navy underline-offset-2 hover:underline"
              >
                Contact us
              </Link>{" "}
              for the full form.
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
