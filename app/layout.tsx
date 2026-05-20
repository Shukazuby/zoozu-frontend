import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import LayoutWrapper from "./components/LayoutWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const zoozuLogo =
  "https://res.cloudinary.com/dkqtwvhq2/image/upload/v1765556450/zoozu_logo_lm422a.jpg";

export const metadata: Metadata = {
  title: "ZOOZU_ng | Premium Modern Fashion",
  description:
    "Redefining Nigerian elegance with clean lines, premium fabrics, and timeless style for the modern individual.",
  icons: {
    icon: [{ url: zoozuLogo, type: "image/jpeg" }],
    shortcut: zoozuLogo,
    apple: zoozuLogo,
  },
  openGraph: {
    title: "ZOOZU_ng | Premium Modern Fashion",
    description:
      "Redefining Nigerian elegance with clean lines, premium fabrics, and timeless style for the modern individual.",
    images: [zoozuLogo],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zoozu_ng | Boost Your Confidence. Set Trends.",
    description:
      "Redefining Nigerian elegance with clean lines, premium fabrics, and timeless style for the modern individual.",
    images: [zoozuLogo],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased`}
      >
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
