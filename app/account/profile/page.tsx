import type { Metadata } from "next";
import Link from "next/link";
import {
  AccountBreadcrumb,
  DesktopAccountSidebar,
} from "@/components/account/AccountChrome";
import { ProfileInformationBody } from "@/components/account/ProfileInformationBody";
import { IconArrowLeft } from "@/components/layout/icons";
import { HeaderAndNav } from "@/components/layout/HeaderAndNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { UtilityBar } from "@/components/layout/UtilityBar";

export const metadata: Metadata = {
  title: "Profile Information — Rugs Bhadohi",
  description: "View and update your Rugs Bhadohi account profile.",
};

export default function AccountProfilePage() {
  return (
    <div className="flex min-h-full flex-col bg-white">
      <UtilityBar />
      <HeaderAndNav />
      <main className="flex-1 bg-white pb-10 md:pb-14">
        <div className="mx-auto max-w-7xl px-4 py-4 md:py-8">
          <div className="mb-4 flex min-w-0 items-center gap-1.5 md:hidden">
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
                <li className="shrink-0 font-medium text-rc-navy">Profile</li>
              </ol>
            </nav>
          </div>

          <div className="mb-5 hidden md:block">
            <AccountBreadcrumb
              items={[
                { label: "Home", href: "/" },
                { label: "My Account", href: "/account" },
                { label: "Profile Information" },
              ]}
            />
          </div>

          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
            <div className="hidden md:block">
              <DesktopAccountSidebar activeNavId="profile" />
            </div>

            <div className="min-w-0 flex-1 space-y-4">
              <header className="border-b border-rc-border pb-4 md:border-0 md:pb-0">
                <h1 className="font-heading text-xl font-semibold text-rc-navy md:font-sans md:text-2xl md:font-semibold md:tracking-tight md:text-neutral-900 lg:text-[28px] lg:leading-tight">
                  Profile Information
                </h1>
              </header>

              <ProfileInformationBody />
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
