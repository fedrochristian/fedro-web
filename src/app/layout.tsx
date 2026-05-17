import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geist = localFont({
  variable: "--font-geist",
  display: "block",
  src: [
    { path: "../../public/fonts/Geist-latin.woff2", weight: "100 900", style: "normal" },
    { path: "../../public/fonts/Geist-latin-ext.woff2", weight: "100 900", style: "normal" },
  ],
});

const cartograph = localFont({
  variable: "--font-cartograph",
  display: "block",
  src: [
    { path: "../../public/fonts/CartographCF-Regular.otf", weight: "400", style: "normal" },
    { path: "../../public/fonts/CartographCF-DemiBold.otf", weight: "600", style: "normal" },
    { path: "../../public/fonts/CartographCF-Bold.otf", weight: "700", style: "normal" },
  ],
});

const SITE = "https://ozgur.design";
const TITLE = "Oz Gultekin — Product Experience Designer Portfolio ⊹ Montreal, Canada";
const DESC =
  "Oz Gultekin is a Product Experience Designer in Canada, working remotely across the globe. Portfolio of select case studies, approach, and tools.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: TITLE,
  description: DESC,
  icons: {
    icon: [
      { url: "/seo/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
      { url: "/seo/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/seo/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/seo/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/seo/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/seo/apple-touch-icon.png",
  },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: SITE,
    type: "website",
    siteName: "Oz Gultekin",
    locale: "en_CA",
    images: [{ url: "/seo/og.png", width: 1200, height: 630, alt: "Oz Gultekin, Product Experience Designer in Montreal, Canada" }],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} ${cartograph.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
