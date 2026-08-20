// src/components/layout/navbar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        
        {/* BRAND LOGO - Updated with Gold Accent */}
        <Link 
          href="/" 
          className="text-xl font-medium tracking-tight hover:opacity-80 transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          GeeGee <span className="text-primary font-normal">Makeovers</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-8 text-sm font-light">
          {/* Swapped to standard anchor tags for native browser scrolling */}
          <a href="/#portfolio" className="transition-colors hover:text-primary">
            Portfolio
          </a>
          <a href="/#process" className="transition-colors hover:text-primary">
            The Process
          </a>
          <Link 
            href="/book" 
            className="inline-flex h-10 items-center justify-center bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Request Consultation
          </Link>
        </nav>

        <button
          className="md:hidden p-2 -mr-2 text-foreground"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Mobile Menu"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6 stroke-[1.5]" />
          ) : (
            <Menu className="h-6 w-6 stroke-[1.5]" />
          )}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="flex flex-col space-y-4 p-4 text-base font-light">
            <a 
              href="/#portfolio" 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="px-2 py-2 hover:bg-secondary hover:text-primary transition-colors block"
            >
              Portfolio
            </a>
            <a 
              href="/#process" 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="px-2 py-2 hover:bg-secondary hover:text-primary transition-colors block"
            >
              The Process
            </a>
            <div className="pt-2">
              <Link 
                href="/book" 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="inline-flex h-12 w-full items-center justify-center bg-primary px-6 text-base font-medium text-primary-foreground transition-colors active:bg-primary/90"
              >
                Request Consultation
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}