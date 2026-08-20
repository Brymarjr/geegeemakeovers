"use server";

import { db } from "@/db";
import { appointments } from "@/db/schema";
import { redis } from "@/lib/redis"; // Adjust path if your redis client is located elsewhere
import { and, gte, lt } from "drizzle-orm";

export async function getOccupiedSlots(dateString: string) {
  try {
    const cacheKey = `availability:${dateString}`;
    
// 1. Check Redis Cache
    const cachedSlots = await redis.get(cacheKey);
    if (cachedSlots) {
      try {
        // If the Redis client already parsed it into an array, use it directly. 
        // Otherwise, parse the string.
        const parsedSlots = typeof cachedSlots === "string" 
          ? JSON.parse(cachedSlots) 
          : cachedSlots;
          
        if (Array.isArray(parsedSlots)) {
          return { success: true, occupiedSlots: parsedSlots };
        }
      } catch (parseError) {
        console.warn("Cache parse error. Bypassing cache to query DB:", parseError);
        // If the cache is corrupted, we simply ignore it and hit PostgreSQL.
      }
    }

    // 2. Cache Miss: Query PostgreSQL
    const targetDate = new Date(dateString);
    const nextDay = new Date(targetDate);
    nextDay.setDate(targetDate.getDate() + 1);

    const bookedAppointments = await db.query.appointments.findMany({
      where: and(
        gte(appointments.startTime, targetDate),
        lt(appointments.startTime, nextDay)
      ),
      columns: {
        startTime: true,
      },
    });

    // Return exact ISO strings instead of relying on server timezone formatting
    const occupiedSlots = bookedAppointments.map((apt) => {
      return apt.startTime.toISOString();
    });

    // 3. Cache the result in Redis with a 5-minute TTL
   await redis.set(cacheKey, JSON.stringify(occupiedSlots), { ex: 300 });

    return { success: true, occupiedSlots };
    
  } catch (error) {
    console.error("Availability check failed:", error);
    return { success: false, occupiedSlots: [] };
  }
}