import { auth } from "@/auth";
import { NextResponse } from "next/server";

function isProtectedPath(pathname: string) {
  return (
    pathname === "/account" ||
    pathname.startsWith("/account/") ||
    pathname === "/wishlist" ||
    pathname.startsWith("/wishlist/")
  );
}

export default auth((req) => {
  const { pathname } = req.nextUrl;

  if (isProtectedPath(pathname) && !req.auth) {
    const signInUrl = new URL("/signin", req.nextUrl.origin);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/account/:path*", "/wishlist", "/wishlist/:path*"],
};
