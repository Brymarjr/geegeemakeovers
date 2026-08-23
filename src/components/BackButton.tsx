"use client";

import { useRouter, usePathname } from "next/navigation";

export function BackButton() {
  const router = useRouter();
  const pathname = usePathname();

  // Hide the back button if the user is on the main landing page or main dashboard
  if (pathname === "/" || pathname === "/dashboard") {
    return null;
  }

  return (
    <button 
      onClick={() => router.back()}
      className="w-10 h-10 shrink-0 rounded-full bg-wine/10 flex items-center justify-center text-wine-deep hover:bg-wine/20 transition-colors mr-2 md:mr-4"
      aria-label="Go back"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="12" x2="5" y2="12"></line>
        <polyline points="12 19 5 12 12 5"></polyline>
      </svg>
    </button>
  );
}