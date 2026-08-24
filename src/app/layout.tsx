import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "GeeGee Makeovers | Bespoke Gele & Makeup in Mount Vernon, NY",
  description: "Luxury makeup artistry and traditional Gele styling in Mount Vernon, New York State. Request your custom appointment today.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${manrope.variable} ${fraunces.variable} font-sans min-h-screen flex flex-col bg-blush text-ink`}>
        <main className="flex-grow flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}