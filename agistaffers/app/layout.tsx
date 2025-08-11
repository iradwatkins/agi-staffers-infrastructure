import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/lib/providers";
import { Toaster } from "@/components/ui/sonner";
import { PWAInstallBanner } from "@/components/pwa-install-banner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AGI Staffers - Admin Dashboard",
  description: "Professional VPS Management Dashboard",
  manifest: "/manifest.json",
  themeColor: "#667eea",
  viewport: {
    width: "device-width",
    initialScale: 1,
    viewportFit: "cover",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#667eea" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <Providers>{children}</Providers>
        <Toaster />
        <PWAInstallBanner />
      </body>
    </html>
  );
}
