import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL ?? "http://localhost:3000"),
  title: "kAI Connect — Buy what you need. Use what you have.",
  description:
    "An intelligent weekly food assistant helping whānau spend less, use what they have, and waste less.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: { title: "kAI Connect", description: "Buy what you need. Use what you have. Waste less." },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-NZ">
      <body>{children}</body>
    </html>
  );
}
