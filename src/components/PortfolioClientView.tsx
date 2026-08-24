"use client";

import { useState } from "react";
import Image from "next/image";

interface PortfolioItem {
  id: string;
  imageUrl: string;
  category: string;
  caption: string;
  createdAt: Date | null;
}

export default function PortfolioClientView({
  initialItems,
  uploadAction,
  deleteAction,
}: {
  initialItems: PortfolioItem[];
  uploadAction: (formData: FormData) => Promise<void>;
  deleteAction: (formData: FormData) => Promise<void>;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsUploading(true);
    setErrorMessage(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      await uploadAction(formData);
      form.reset();
      window.location.reload();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("An unexpected error occurred during upload.");
      }
      setIsUploading(false);
    }
  }

  return (
    <div className="min-h-screen bg-cream p-6 md:p-10">
      <div className="max-w-[1180px] mx-auto space-y-10 pb-20">
        <div>
          <p className="text-[12px] font-extrabold tracking-[0.16em] uppercase text-emerald-deep mb-1">Owner access</p>
          <h1 className="text-[30px] font-bold font-fraunces text-wine-deep">Portfolio Manager</h1>
          <p className="text-ink-soft text-[14px] mt-1">Upload and manage gallery images directly from your device.</p>
        </div>

        {errorMessage && (
          <div className="bg-[#A8422F]/10 border border-[#A8422F]/30 text-[#A8422F] text-[13.5px] p-4 rounded-[12px]">
            <span className="font-bold">Upload Failed:</span> {errorMessage}
          </div>
        )}

        <div className="bg-white rounded-[20px] border border-border p-6 md:p-8 shadow-sm">
          <h2 className="text-[18px] font-bold font-fraunces text-wine-deep mb-4">Upload New Picture</h2>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input 
              type="file" 
              name="image" 
              accept="image/png, image/jpeg, image/webp" 
              required
              disabled={isUploading}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-wine/10 file:text-wine-deep hover:file:bg-wine/20 text-[13.5px] text-ink-soft border border-border rounded-[10px] p-2 disabled:opacity-50"
            />
            <input 
              type="text" 
              name="category" 
              placeholder="Category (e.g. Bridal Glam)" 
              required
              disabled={isUploading}
              className="h-11 px-4 rounded-[10px] border border-border bg-white text-[14px] focus:outline-none focus:border-gold disabled:opacity-50"
            />
            <input 
              type="text" 
              name="caption" 
              placeholder="Caption (e.g. Mt Vernon Studio)" 
              required
              disabled={isUploading}
              className="h-11 px-4 rounded-[10px] border border-border bg-white text-[14px] focus:outline-none focus:border-gold disabled:opacity-50"
            />
            
            <button 
              type="submit"
              disabled={isUploading}
              className="md:col-span-3 bg-emerald text-white text-[13px] font-bold h-11 rounded-[10px] hover:-translate-y-0.5 transition-transform shadow-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0 cursor-pointer"
            >
              {isUploading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading to Cloud...
                </>
              ) : (
                "Upload to Live Portfolio"
              )}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-[20px] border border-border p-6 md:p-8">
          <h2 className="text-[18px] font-bold font-fraunces text-wine-deep mb-4">Current Gallery Items</h2>
          {initialItems.length === 0 ? (
            <p className="text-center py-6 text-ink-soft text-[13.5px]">No items uploaded yet.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {initialItems.map((item) => (
                <div key={item.id} className="flex flex-col gap-2">
                  <div className="relative aspect-[4/5] rounded-[12px] overflow-hidden border border-border shadow-sm bg-cream">
                    <Image src={item.imageUrl} alt={item.caption} fill className="object-cover" />
                  </div>
                  <div className="text-[12px] font-semibold text-wine-deep truncate">{item.caption}</div>
                  <form action={deleteAction}>
                    <input type="hidden" name="id" value={item.id} />
                    <input type="hidden" name="imageUrl" value={item.imageUrl} />
                    <button 
                      type="submit"
                      className="w-full bg-[#A8422F]/10 text-[#A8422F] text-[12px] font-bold py-2 rounded-[8px] hover:bg-[#A8422F]/20 transition-colors"
                    >
                      Delete Photo
                    </button>
                  </form>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}