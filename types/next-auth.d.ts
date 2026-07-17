import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      customerId?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    customerId?: string;
    picture?: string;
  }
}
