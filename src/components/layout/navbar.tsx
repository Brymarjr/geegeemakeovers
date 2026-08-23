"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { BackButton } from "@/components/BackButton";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isBookPage = pathname === "/book";

  return (
    <nav className="relative flex items-center justify-between py-6 px-6 md:px-12 w-full max-w-7xl mx-auto z-50">
      <div className="flex items-center">
        <BackButton />
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center p-[2px] bg-gradient-to-tr from-[#5A1B2E] via-[#C9982E] to-[#1F4B3F]">
            <span className="w-full h-full rounded-full bg-cream flex items-center justify-center font-fraunces font-bold text-sm text-wine-deep">GG</span>
          </div>
          <div className="font-fraunces font-bold text-lg text-wine-deep flex flex-col">
            GeeGee Makeovers
            <small className="font-sans font-semibold text-[10px] tracking-widest text-ink-soft uppercase">Makeup & Gele Studio</small>
          </div>
        </Link>
      </div>

      <div className="hidden md:flex items-center gap-8 font-semibold text-sm">
        <Link href="/#portfolio" className="text-ink hover:text-wine transition-colors">Portfolio</Link>
        {!isBookPage && (
          <Link href="/book" className="text-ink hover:text-wine transition-colors">Book a date</Link>
        )}
        <Link href="/contact" className="text-ink hover:text-wine transition-colors">Contact</Link>
      </div>

      {!isBookPage && (
        <Link href="/book" className="hidden md:inline-flex bg-gold text-wine-deep font-bold text-sm px-6 py-3 rounded-full shadow-custom hover:-translate-y-0.5 transition-transform">
          Book now
        </Link>
      )}

      <button
        className="md:hidden flex flex-col gap-1.5 p-2 focus:outline-none ml-auto"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <div className={`w-6 h-0.5 bg-wine-deep transition-all duration-300 ${isMobileMenuOpen ? "rotate-45 translate-y-2" : ""}`}></div>
        <div className={`w-6 h-0.5 bg-wine-deep transition-all duration-300 ${isMobileMenuOpen ? "opacity-0" : ""}`}></div>
        <div className={`w-6 h-0.5 bg-wine-deep transition-all duration-300 ${isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}></div>
      </button>

      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-cream shadow-card flex flex-col p-6 gap-6 font-semibold text-sm border-t border-border md:hidden">
          <Link href="/#portfolio" onClick={() => setIsMobileMenuOpen(false)} className="text-ink hover:text-wine transition-colors">Portfolio</Link>
          {!isBookPage && (
            <Link href="/book" onClick={() => setIsMobileMenuOpen(false)} className="text-ink hover:text-wine transition-colors">Book a date</Link>
          )}
          <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-ink hover:text-wine transition-colors">Contact</Link>
        </div>
      )}
    </nav>
  );
}