import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/provider";

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
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://estateflowapp.vercel.app";

const TITLE = "EstateFlow — AI Real Estate CRM for UAE Agencies";
const DESCRIPTION =
  "EstateFlow captures every Bayut, Property Finder & WhatsApp lead, scores buyer intent in 2 seconds, and replies in Arabic or English — automatically. Built for UAE real estate agencies. Never lose a hot lead again.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "real estate CRM UAE",
    "Dubai property CRM",
    "AI lead capture",
    "Bayut leads",
    "Property Finder CRM",
    "WhatsApp real estate",
    "RERA CRM",
    "Golden Visa property",
    "real estate automation Dubai",
  ],
  authors: [{ name: "EstateFlow" }],
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "EstateFlow",
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_AE",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
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
      <body className="min-h-full flex flex-col">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
