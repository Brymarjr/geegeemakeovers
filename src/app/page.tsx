import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto">
      
      <section className="grid md:grid-cols-2 gap-12 items-center px-6 md:px-12 pt-8 pb-24">
        <div>
          <p className="text-xs font-extrabold tracking-[0.16em] uppercase text-gold mb-4">Bridal & Owanbe Glam</p>
          <h1 className="text-5xl md:text-6xl lg:text-[64px] leading-[1.03] font-bold text-wine-deep">
            Every fold<br /><em className="italic text-gold font-medium">tells a story.</em>
          </h1>
          <p className="mt-6 text-[17px] leading-[1.65] text-ink-soft max-w-[46ch]">
            Gee-Gee Makeovers brings together flawless makeup and expertly tied gele, so you walk into every aso-ebi, wedding or owanbe looking exactly like the occasion deserves across Mount Vernon and New York City.
          </p>
          <div className="flex flex-wrap gap-4 mt-8">
            <Link href="/book" className="bg-wine text-cream font-bold text-sm px-7 py-3.5 rounded-full hover:-translate-y-0.5 transition-transform shadow-custom">
              Check available dates
            </Link>
            <Link href="/portfolio" className="bg-transparent border-[1.5px] border-wine text-wine font-bold text-sm px-7 py-3.5 rounded-full hover:-translate-y-0.5 transition-transform">
              See past work
            </Link>
          </div>
          <div className="flex flex-wrap gap-8 mt-11">
            <div><b className="block font-fraunces text-2xl text-wine-deep">500+</b><span className="text-xs text-ink-soft font-semibold">Faces & geles styled</span></div>
            <div><b className="block font-fraunces text-2xl text-wine-deep">4.9★</b><span className="text-xs text-ink-soft font-semibold">Average client rating</span></div>
            <div><b className="block font-fraunces text-2xl text-wine-deep">7 yrs</b><span className="text-xs text-ink-soft font-semibold">In the glam business</span></div>
          </div>
        </div>
        
        <div className="relative aspect-[1/1.05] order-first md:order-last max-w-[320px] md:max-w-none mx-auto w-full shadow-custom overflow-hidden rounded-[32px]">
          <Image 
            src="/portfolio/image1.jpg" 
            alt="Gee-Gee Makeovers Signature Look" 
            fill 
            priority
            className="object-cover" 
          />
        </div>
      </section>

      <section id="portfolio" className="px-6 md:px-12 py-16">
        <div className="max-w-[640px] mb-10">
          <p className="text-xs font-extrabold tracking-[0.16em] uppercase text-gold">Portfolio</p>
          <h2 className="text-[28px] md:text-[40px] mt-2 font-bold leading-tight text-wine-deep">A few recent transformations</h2>
          <p className="mt-3 text-ink-soft text-[15.5px] leading-[1.6]">Take a look at some of our favorite bridal looks and owanbe glam from the Mount Vernon studio.</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          
          <div className="fold-corner rounded-[18px] aspect-[4/5] relative flex items-end p-4 shadow-custom overflow-hidden group bg-wine/10">
            <Image src="/portfolio/image6.jpg" alt="Party Makeup" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent z-10"></div>
            <span className="relative z-20 text-white font-bold text-sm bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">Party Makeup</span>
          </div>

          <div className="fold-corner rounded-[18px] aspect-[4/5] relative flex items-end p-4 shadow-custom overflow-hidden group bg-emerald/10">
            <Image src="/portfolio/image2.jpg" alt="Bridal Glam in the Bronx" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent z-10"></div>
            <span className="relative z-20 text-white font-bold text-sm bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">Bridal Glam</span>
          </div>

          <div className="fold-corner rounded-[18px] aspect-[4/5] relative flex items-end p-4 shadow-custom overflow-hidden group bg-gold/10">
            <Image src="/portfolio/image3.jpg" alt="Owanbe Ready Makeup" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent z-10"></div>
            <span className="relative z-20 text-white font-bold text-sm bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">Owanbe Ready</span>
          </div>

          <div className="fold-corner rounded-[18px] aspect-[4/5] relative flex items-end p-4 shadow-custom overflow-hidden group bg-wine/10">
            <Image src="/portfolio/image4.jpg" alt="Traditional Wedding Styling" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent z-10"></div>
            <span className="relative z-20 text-white font-bold text-sm bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">Traditional Wedding</span>
          </div>

          <div className="fold-corner rounded-[18px] aspect-[4/5] relative flex items-end p-4 shadow-custom overflow-hidden group bg-rose/10">
            <Image src="/portfolio/image5.jpg" alt="Soft Glam Photoshoot" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent z-10"></div>
            <span className="relative z-20 text-white font-bold text-sm bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">Soft Glam</span>
          </div>

          <div className="fold-corner rounded-[18px] aspect-[4/5] relative flex items-end p-4 shadow-custom overflow-hidden group bg-rose/10">
            <Image src="/portfolio/image7.jpg" alt="Birthday Makeup" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent z-10"></div>
            <span className="relative z-20 text-white font-bold text-sm bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">Birthday Makeup</span>
          </div>

        </div>
      </section>

      <div className="bg-wine-deep rounded-[32px] p-10 md:p-14 text-cream grid md:grid-cols-2 gap-12 mx-6 md:mx-12 my-16 shadow-card items-center">
        <div>
          <p className="text-xs font-extrabold tracking-[0.16em] uppercase text-gold-light">How booking works</p>
          <h2 className="text-white text-3xl font-bold mt-2">No prices online <br />we settle it on WhatsApp.</h2>
          <p className="mt-3 text-[14.5px] text-[#e6d3c4] leading-[1.6]">Pick an open date and time on our secure calendar. We will send your request straight to Gee-Gee's WhatsApp, where you can agree on pricing together.</p>
          
          <div className="mt-8 flex flex-col gap-5">
            <div className="flex gap-4">
              <div className="w-8 h-8 shrink-0 rounded-full bg-secondary text-gold-light flex items-center justify-center font-extrabold font-fraunces text-sm">1</div>
              <div>
                <b className="block text-[15px] mb-1">Choose your date and time</b>
                <span className="text-[13.5px] text-[#d8c2b4] leading-relaxed">View all open slots directly on our booking page.</span>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 shrink-0 rounded-full bg-secondary text-gold-light flex items-center justify-center font-extrabold font-fraunces text-sm">2</div>
              <div>
                <b className="block text-[15px] mb-1">Tell us about your booking</b>
                <span className="text-[13.5px] text-[#d8c2b4] leading-relaxed">Provide your name and the exact party size needed.</span>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 shrink-0 rounded-full bg-secondary text-gold-light flex items-center justify-center font-extrabold font-fraunces text-sm">3</div>
              <div>
                <b className="block text-[15px] mb-1">Chat and confirm on WhatsApp</b>
                <span className="text-[13.5px] text-[#d8c2b4] leading-relaxed">Gee-Gee will reply to confirm pricing, location, and travel details.</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center">
          <Link href="/book" className="bg-cream text-ink rounded-[24px] p-8 shadow-card flex flex-col items-center text-center gap-4 hover:scale-[1.02] transition-transform w-full max-w-sm">
            <div className="w-16 h-16 bg-blush rounded-full flex items-center justify-center text-wine-deep">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            </div>
            <div>
              <h3 className="text-xl font-bold">Ready for glam?</h3>
              <p className="text-sm text-ink-soft mt-2">Tap below to view the studio calendar and lock in your date.</p>
            </div>
            <span className="bg-wine text-white font-bold text-sm px-6 py-3 rounded-full mt-2 w-full">Open Booking Calendar</span>
          </Link>
        </div>
      </div>

      <footer id="contact" className="bg-wine-deep text-[#e9dbcf] px-6 md:px-12 py-12 flex flex-col gap-8 rounded-t-[32px] mx-6 md:mx-12 mt-10">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div className="flex flex-col gap-2">
            <b className="font-fraunces text-white text-[15px]">Gee-Gee Makeovers</b>
            <div className="text-[13.5px] text-[#cdb6a6] leading-loose">Makeup and gele styling<br />Mount Vernon, New York</div>
          </div>
          <div className="flex flex-col gap-2">
            <b className="font-fraunces text-white text-[15px]">Reach us</b>
            <div className="text-[13.5px] text-[#cdb6a6] leading-loose">Calls: (929) 246-4115<br />Email: Gladysmomoh18@gmail.com</div>
          </div>
          <div className="flex flex-col gap-2">
            <b className="font-fraunces text-white text-[15px]">Working hours: 8am to 8pm Daily</b>
            <div className="text-[13.5px] text-[#cdb6a6] leading-loose">Mon to Sun, strictly by appointment </div>
          </div>
        </div>
        <div className="text-center text-xs text-[#9c8375] pt-6 border-t border-white/10 w-full">
          Copyright 2026 Gee-Gee Makeovers. Proudly servicing Mount Vernon and NYC.
        </div>
      </footer>
      
    </div>
  );
}