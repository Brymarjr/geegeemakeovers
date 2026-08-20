// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Inter is a clean, highly legible sans-serif font
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GeeGee Makeovers | Bespoke Gele & Makeup in NYC",
  description: "Luxury makeup artistry and traditional Gele styling in New York City. Request your custom appointment today.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        {/* The main tag automatically pushes the footer down if the page is short */}
        <main className="flex-grow flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}