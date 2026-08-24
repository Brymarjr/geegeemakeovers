import { db } from "@/db";
import { portfolioItems } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import Image from "next/image";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function AdminPortfolioPage() {
  const items = await db.query.portfolioItems.findMany({
    orderBy: [desc(portfolioItems.createdAt)],
  });

  async function handleUpload(formData: FormData) {
    "use server";
    const file = formData.get("image") as File;
    const category = formData.get("category") as string;
    const caption = formData.get("caption") as string;

    if (!file || file.size === 0) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      throw new Error("Invalid file type. Only JPEG, PNG, and WebP images are allowed.");
    }
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("File size exceeds the 5MB limit.");
    }

    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;

    const { error: uploadError } = await supabase.storage
      .from("portfolio")
      .upload(fileName, fileBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`Storage upload failed: ${uploadError.message}`);
    }

    const { data: publicUrlData } = supabase.storage
      .from("portfolio")
      .getPublicUrl(fileName);

    const imageUrl = publicUrlData.publicUrl;

    await db.insert(portfolioItems).values({
      imageUrl,
      category: category || "Glam",
      caption: caption || "Studio Look",
    });

    revalidatePath("/portfolio");
    revalidatePath("/dashboard/portfolio");
  }

  async function handleDelete(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    const imageUrl = formData.get("imageUrl") as string;

    if (!id) return;

    // Extract file path from Supabase public URL to delete it from storage bucket
    if (imageUrl && imageUrl.includes("/portfolio/")) {
      const pathParts = imageUrl.split("/portfolio/");
      const filePath = pathParts[pathParts.length - 1];
      if (filePath) {
        await supabase.storage.from("portfolio").remove([filePath]);
      }
    }

    // Delete record from database
    await db.delete(portfolioItems).where(eq(portfolioItems.id, id));

    revalidatePath("/portfolio");
    revalidatePath("/dashboard/portfolio");
  }

  return (
    <div className="min-h-screen bg-cream p-6 md:p-10">
      <div className="max-w-[1180px] mx-auto space-y-10 pb-20">
        <div>
          <p className="text-[12px] font-extrabold tracking-[0.16em] uppercase text-emerald-deep mb-1">Owner access</p>
          <h1 className="text-[30px] font-bold font-fraunces text-wine-deep">Portfolio Manager</h1>
          <p className="text-ink-soft text-[14px] mt-1">Upload and manage gallery images directly from your device.</p>
        </div>

        <div className="bg-white rounded-[20px] border border-border p-6 md:p-8 shadow-sm">
          <h2 className="text-[18px] font-bold font-fraunces text-wine-deep mb-4">Upload New Picture</h2>
          <form action={handleUpload} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input 
              type="file" 
              name="image" 
              accept="image/png, image/jpeg, image/webp" 
              required
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-wine/10 file:text-wine-deep hover:file:bg-wine/20 text-[13.5px] text-ink-soft border border-border rounded-[10px] p-2"
            />
            <input 
              type="text" 
              name="category" 
              placeholder="Category (e.g. Bridal Glam)" 
              required
              className="h-11 px-4 rounded-[10px] border border-border bg-white text-[14px] focus:outline-none focus:border-gold"
            />
            <input 
              type="text" 
              name="caption" 
              placeholder="Caption (e.g. Mt Vernon Studio)" 
              required
              className="h-11 px-4 rounded-[10px] border border-border bg-white text-[14px] focus:outline-none focus:border-gold"
            />
            <button 
              type="submit"
              className="md:col-span-3 bg-emerald text-white text-[13px] font-bold h-11 rounded-[10px] hover:-translate-y-0.5 transition-transform shadow-sm"
            >
              Upload to Live Portfolio
            </button>
          </form>
        </div>

        <div className="bg-white rounded-[20px] border border-border p-6 md:p-8">
          <h2 className="text-[18px] font-bold font-fraunces text-wine-deep mb-4">Current Gallery Items</h2>
          {items.length === 0 ? (
            <p className="text-center py-6 text-ink-soft text-[13.5px]">No items uploaded yet.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {items.map((item) => (
                <div key={item.id} className="flex flex-col gap-2">
                  <div className="relative aspect-[4/5] rounded-[12px] overflow-hidden border border-border shadow-sm">
                    <Image src={item.imageUrl} alt={item.caption} fill className="object-cover" />
                  </div>
                  <form action={handleDelete}>
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