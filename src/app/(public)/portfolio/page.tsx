import { db } from "@/db";
import { portfolioItems } from "@/db/schema";
import { desc } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function PortfolioPage() {
  const items = await db.query.portfolioItems.findMany({
    orderBy: [desc(portfolioItems.createdAt)],
  });

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto px-6 md:px-12 py-16 flex-grow">
      <div className="max-w-[640px] mb-12">
        <p className="text-xs font-extrabold tracking-[0.16em] uppercase text-gold mb-2">Full Gallery</p>
        <h1 className="text-4xl md:text-5xl font-bold font-fraunces text-wine-deep">Studio Portfolio</h1>
        <p className="mt-4 text-ink-soft text-[15.5px] leading-[1.6]">
          Explore our complete collection of bridal transformations, traditional gele styling, and owanbe glam straight from the Mount Vernon studio.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-[24px] p-12 text-center border border-border shadow-card">
          <p className="text-ink-soft text-[15px] mb-6">No portfolio items have been uploaded by the studio yet.</p>
          <Link href="/book" className="bg-wine text-white font-bold text-sm px-8 py-3.5 rounded-full inline-block shadow-custom">
            Book an Appointment
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.id} className="fold-corner rounded-[18px] aspect-[4/5] relative flex items-end p-4 shadow-custom overflow-hidden group bg-wine/10">
              <Image 
                src={item.imageUrl} 
                alt={item.caption} 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent z-10"></div>
              <div className="relative z-20 flex flex-col">
                <span className="text-white font-bold text-sm bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full w-fit mb-1">
                  {item.category}
                </span>
                <span className="text-xs text-[#e6d3c4] px-1">{item.caption}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}