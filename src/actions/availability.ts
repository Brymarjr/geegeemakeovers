"use server";

import { db } from "@/db";
import { appointments, blockouts } from "@/db/schema";
import { redis } from "@/lib/redis";
import { and, gte, lt, eq } from "drizzle-orm";

import { STANDARD_TIME_SLOTS } from "@/lib/constants";

function convertSlotToISO(dateString: string, timeSlot: string): string {
  const [timeStr, ampm] = timeSlot.split(" ");
  let [hours, minutes] = timeStr.split(":").map(Number);
  if (ampm === "PM" && hours !== 12) hours += 12;
  if (ampm === "AM" && hours === 12) hours = 0;
  
  const slotDate = new Date(dateString);
  slotDate.setHours(hours, minutes, 0, 0);
  return slotDate.toISOString();
}

export async function getOccupiedSlots(dateString: string) {
  try {
    const cacheKey = `availability:${dateString}`;
    
    const cachedSlots = await redis.get(cacheKey);
    if (cachedSlots) {
      try {
        const parsedSlots = typeof cachedSlots === "string" 
          ? JSON.parse(cachedSlots) 
          : cachedSlots;
          
        if (Array.isArray(parsedSlots)) {
          return { success: true, occupiedSlots: parsedSlots };
        }
      } catch (parseError) {
        console.warn("Cache parse error. Bypassing cache to query DB:", parseError);
      }
    }

    // 1. Check for Administrative Blockouts First
    const dayBlocks = await db.query.blockouts.findMany({
      where: eq(blockouts.targetDate, dateString),
    });

    const isFullDayBlocked = dayBlocks.some(b => b.timeSlot === null);
    
    // Convert all standard slots dynamically to match frontend timestamps
    if (isFullDayBlocked) {
      const allBlockedSlots = STANDARD_TIME_SLOTS.map(slot => convertSlotToISO(dateString, slot));
      await redis.set(cacheKey, JSON.stringify(allBlockedSlots), { ex: 300 });
      return { success: true, occupiedSlots: allBlockedSlots };
    }

    // Convert individual blocked slots
    const blockedISOSlots = dayBlocks
      .filter(b => b.timeSlot !== null)
      .map(b => convertSlotToISO(dateString, b.timeSlot!));

    // 2. Check for Booked Appointments
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

    const appointmentISOSlots = bookedAppointments.map((apt) => {
      return apt.startTime.toISOString();
    });

    // 3. Merge both arrays and remove duplicates
    const occupiedSlots = Array.from(new Set([...blockedISOSlots, ...appointmentISOSlots]));

    await redis.set(cacheKey, JSON.stringify(occupiedSlots), { ex: 300 });

    return { success: true, occupiedSlots };
    
  } catch (error) {
    console.error("Availability check failed:", error);
    return { success: false, occupiedSlots: [] };
  }
}