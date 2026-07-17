import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { syncCustomerFromGoogle } from "@/lib/api/customer-profile";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  pages: {
    signIn: "/signin",
    error: "/signin",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account, profile, user }) {
      if (account?.provider === "google") {
        token.picture = profile?.picture ?? user?.image ?? token.picture;

        const email = (profile?.email ?? user?.email ?? token.email)?.toLowerCase();
        if (email) {
          const fullName =
            profile?.name ?? user?.name ?? email.split("@")[0] ?? "Customer";
          const parts = fullName.trim().split(/\s+/);
          const firstName = parts[0] || "Customer";
          const lastName = parts.slice(1).join(" ");

          try {
            const customer = await syncCustomerFromGoogle({
              email,
              firstName,
              lastName,
              image: (profile?.picture as string | undefined) ?? user?.image ?? null,
            });
            token.customerId = customer.id;
            token.email = customer.email;
            token.name = customer.name;
            token.picture = customer.image ?? token.picture;
          } catch (error) {
            console.error("Failed to sync customer profile:", error);
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.image = (token.picture as string | undefined) ?? session.user.image;
        session.user.email = (token.email as string | undefined) ?? session.user.email;
        session.user.name = (token.name as string | undefined) ?? session.user.name;
        (session.user as { customerId?: string }).customerId =
          token.customerId as string | undefined;
      }
      return session;
    },
  },
  trustHost: true,
});
