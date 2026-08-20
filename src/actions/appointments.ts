"use server";

import { db } from "@/db";
import { appointments } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redis } from "@/lib/redis";

export async function confirmAppointment(id: string, priceInDollars: number) {
  try {
    const agreedPriceInCents = Math.round(priceInDollars * 100);
    
    await db.update(appointments)
      .set({ 
        status: "confirmed", 
        agreedPriceInCents 
      })
      .where(eq(appointments.id, id));
      
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to confirm appointment:", error);
    return { success: false };
  }
}

export async function cancelAppointment(id: string, dateString: string) {
  try {
    await db.update(appointments)
      .set({ status: "cancelled" })
      .where(eq(appointments.id, id));
      
    // Invalidate the cache so the slot opens up for new clients
    await redis.del(`availability:${dateString}`);
    
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to cancel appointment:", error);
    return { success: false };
  }
}

export async function completeAppointment(id: string) {
  try {
    await db.update(appointments)
      .set({ status: "completed" })
      .where(eq(appointments.id, id));
      
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to complete appointment:", error);
    return { success: false };
  }
}