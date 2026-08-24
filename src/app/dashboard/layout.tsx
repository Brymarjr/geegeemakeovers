"use client";

import { logoutAdmin } from "@/actions/auth";
import Link from "next/link";
import { BackButton } from "@/components/BackButton";
import { useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <header className="bg-white border-b border-border h-20 sticky top-0 z-50">
        <div className="flex items-center justify-between h-full px-6 md:px-10">
          <div className="flex items-center gap-8 md:gap-12">
            
            <div className="flex items-center">
              <BackButton />
              <div className="font-fraunces font-bold text-xl text-wine-deep flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center p-[2px] bg-gradient-to-tr from-[#5A1B2E] via-[#C9982E] to-[#1F4B3F]">
                  <span className="w-full h-full rounded-full bg-cream flex items-center justify-center font-fraunces font-bold text-[11px] text-wine-deep">GG</span>
                </div>
                <span className="hidden sm:inline">Admin Center</span>
                <span className="sm:hidden">Admin</span>
              </div>
            </div>

            <nav className="hidden md:flex gap-8">
              <Link href="/dashboard" className="text-[12px] font-extrabold text-ink-soft hover:text-wine transition-colors tracking-[0.05em] uppercase">
                Appointments
              </Link>
              <Link href="/dashboard/schedule" className="text-[12px] font-extrabold text-ink-soft hover:text-wine transition-colors tracking-[0.05em] uppercase">
                Schedule Management
              </Link>
              <Link href="/dashboard/portfolio" className="text-[12px] font-extrabold text-ink-soft hover:text-wine transition-colors tracking-[0.05em] uppercase">
                Portfolio Manager
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            <form action={logoutAdmin} className="hidden md:block">
              <button 
                type="submit"
                className="text-[12px] font-extrabold text-ink-soft hover:text-[#A8422F] transition-colors tracking-[0.05em] uppercase"
              >
                Sign Out
              </button>
            </form>

            <button
              className="md:hidden flex flex-col gap-1.5 p-2 focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <div className={`w-6 h-0.5 bg-wine-deep transition-all duration-300 ${isMobileMenuOpen ? "rotate-45 translate-y-2" : ""}`}></div>
              <div className={`w-6 h-0.5 bg-wine-deep transition-all duration-300 ${isMobileMenuOpen ? "opacity-0" : ""}`}></div>
              <div className={`w-6 h-0.5 bg-wine-deep transition-all duration-300 ${isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}></div>
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-cream shadow-card flex flex-col p-6 gap-6 font-semibold text-sm border-t border-border md:hidden">
            <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="text-[12px] font-extrabold text-ink-soft hover:text-wine transition-colors tracking-[0.05em] uppercase">
              Appointments
            </Link>
            <Link href="/dashboard/schedule" onClick={() => setIsMobileMenuOpen(false)} className="text-[12px] font-extrabold text-ink-soft hover:text-wine transition-colors tracking-[0.05em] uppercase">
              Schedule Management
            </Link>
            <Link href="/dashboard/portfolio" className="text-[12px] font-extrabold text-ink-soft hover:text-wine transition-colors tracking-[0.05em] uppercase">
              Portfolio Manager
            </Link>
            <form action={logoutAdmin} className="mt-2 border-t border-border pt-4">
              <button type="submit" className="text-[12px] font-extrabold text-[#A8422F] hover:text-wine-deep transition-colors tracking-[0.05em] uppercase w-full text-left">
                Sign Out
              </button>
            </form>
          </div>
        )}
      </header>
      
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}