import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { WhatsAppFab } from "@/components/layout/WhatsAppFab";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Rugs Bhadohi — Beautiful Rugs. Better Spaces.",
  description:
    "Premium rugs and carpets with free shipping across India. Shop by size, room, material, and style.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-white pb-[calc(4.25rem+env(safe-area-inset-bottom,0px))] font-sans text-foreground md:pb-0">
        {children}
        <MobileBottomNav />
        <WhatsAppFab />
      </body>
    </html>
  );
}
