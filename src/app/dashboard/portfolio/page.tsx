import { db } from "@/db";
import { portfolioItems } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import Image from "next/image";
import { createClient } from "@supabase/supabase-js";
import PortfolioClientView from "@/components/PortfolioClientView";

export const dynamic = "force-dynamic";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

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
    
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileName = `${Date.now()}-${cleanFileName}`;

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

    if (imageUrl && imageUrl.includes("/portfolio/")) {
      const pathParts = imageUrl.split("/portfolio/");
      const filePath = pathParts[pathParts.length - 1];
      if (filePath) {
        await supabase.storage.from("portfolio").remove([filePath]);
      }
    }

    await db.delete(portfolioItems).where(eq(portfolioItems.id, id));

    revalidatePath("/portfolio");
    revalidatePath("/dashboard/portfolio");
  }

  return (
    <PortfolioClientView 
      initialItems={items} 
      uploadAction={handleUpload} 
      deleteAction={handleDelete} 
    />
  );
}