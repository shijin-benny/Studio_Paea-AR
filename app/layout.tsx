import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import "./globals.css";
import NavigationWrapper from "@/components/NavigationWrapper";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "STUDIO PAEA",
    template: "%s | STUDIO PAEA",
  },
  description: "Architecture, interiors, and landscape design.",
  keywords: ["architecture", "interior design", "landscape design", "STUDIO PAEA"],
  authors: [{ name: "STUDIO PAEA" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "STUDIO PAEA",
    title: "STUDIO PAEA",
    description: "Architecture, interiors, and landscape design.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${spaceGrotesk.variable}`}>
      <body className="min-h-screen antialiased font-sans">
        <NavigationWrapper />
        {children}
      </body>
    </html>
  );
}
