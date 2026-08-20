"use server";

import { db } from "@/db";
import { blockouts } from "@/db/schema";
import { redis } from "@/lib/redis";
import { eq } from "drizzle-orm";

export async function fetchBlockouts() {
  try {
    const data = await db.query.blockouts.findMany();
    return { success: true, data };
  } catch (error) {
    console.error("Database query failed:", error);
    return { success: false, data: [] };
  }
}

export async function addBlockout(targetDate: string, timeSlot: string | null) {
  try {
    await db.insert(blockouts).values({
      targetDate,
      timeSlot,
    });

    await redis.del(`availability:${targetDate}`);
    
    return { success: true };
  } catch (error) {
    console.error("Insertion failed:", error);
    return { success: false };
  }
}

export async function removeBlockout(id: string, targetDate: string) {
  try {
    await db.delete(blockouts).where(eq(blockouts.id, id));
    
    await redis.del(`availability:${targetDate}`);
    
    return { success: true };
  } catch (error) {
    console.error("Deletion failed:", error);
    return { success: false };
  }
}