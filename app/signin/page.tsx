import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { HeaderAndNav } from "@/components/layout/HeaderAndNav";
import { SiteFooter } from "@/components/layout/SiteFooter";

export const metadata: Metadata = {
  title: "Sign in — Rugs Bhadohi",
  description: "Sign in to your Rugs Bhadohi account with Google.",
};

type SearchParams = Promise<{ callbackUrl?: string; error?: string }>;

const errorMessages: Record<string, string> = {
  OAuthAccountNotLinked:
    "This email is already linked to another sign-in method. Try Google again or contact support.",
  OAuthSignin: "Could not start Google sign-in. Check your Google OAuth credentials.",
  OAuthCallback: "Google sign-in was cancelled or failed. Please try again.",
  AccessDenied: "Access was denied. Please try again with a different Google account.",
  Configuration:
    "Sign-in is not configured yet. Add AUTH_GOOGLE_ID and AUTH_GOOGLE_SECRET to your environment.",
  Default: "Something went wrong while signing in. Please try again.",
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = await auth();
  const { callbackUrl, error } = await searchParams;
  const safeCallback =
    callbackUrl && callbackUrl.startsWith("/") ? callbackUrl : "/account";

  if (session?.user) {
    redirect(safeCallback);
  }

  const errorMessage = error
    ? errorMessages[error] ?? errorMessages.Default
    : null;

  return (
    <div className="flex min-h-full flex-col bg-white">
      <HeaderAndNav />
      <main className="flex flex-1 items-center justify-center px-4 py-12 md:py-16">
        <div className="w-full max-w-md">
          <div className="border border-rc-border bg-white px-6 py-8 shadow-sm md:px-8 md:py-10">
            <div className="text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-rc-muted">
                Rugs Bhadohi
              </p>
              <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-rc-navy">
                Sign in
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-rc-muted">
                Use your Google account to access orders, wishlist, and saved
                addresses. No password required.
              </p>
            </div>

            {errorMessage ? (
              <p className="mt-6 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-800">
                {errorMessage}
              </p>
            ) : null}

            <div className="mt-8">
              <GoogleSignInButton callbackUrl={safeCallback} />
            </div>

            <p className="mt-6 text-center text-xs leading-relaxed text-rc-muted">
              By continuing, you agree to our{" "}
              <Link href="/terms" className="font-medium text-rc-navy underline-offset-2 hover:underline">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="font-medium text-rc-navy underline-offset-2 hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </div>

          <p className="mt-6 text-center text-sm text-rc-muted">
            Looking for the admin dashboard?{" "}
            <Link
              href="/dashboard/login"
              className="font-medium text-rc-navy underline-offset-2 hover:underline"
            >
              Admin sign in
            </Link>
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
