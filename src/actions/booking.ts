"use server";

import { db } from "@/db";
import { appointments, services } from "@/db/schema";
import { z } from "zod";
import { redis } from "@/lib/redis";

const bookingSchema = z.object({
  clientName: z.string().min(2, "Name is required"),
  clientPhone: z.string().min(10, "Valid phone number required"),
  location: z.string().min(2, "Location is required"),
  startTime: z.string().datetime(), 
  endTime: z.string().datetime(),
  numberOfPeople: z.number().min(1, "At least one person is required"),
});

export async function requestAppointment(formData: z.infer<typeof bookingSchema>) {
  try {
    const parsedData = bookingSchema.parse(formData);

    let defaultService = await db.query.services.findFirst();
    
    if (!defaultService) {
      const [newService] = await db.insert(services).values({
        name: "Standard Makeover & Gele",
        category: "Bridal",
        basePriceInCents: 15000, 
        estimatedDurationMinutes: 120,
      }).returning();
      defaultService = newService;
    }

    const [newAppointment] = await db.insert(appointments).values({
      serviceId: defaultService.id,
      clientName: parsedData.clientName,
      clientEmail: "pending@whatsapp.com", 
      clientPhone: parsedData.clientPhone,
      location: parsedData.location, 
      startTime: new Date(parsedData.startTime),
      endTime: new Date(parsedData.endTime),
      numberOfPeople: parsedData.numberOfPeople,
      status: "pending_consultation",
    }).returning();

    // CACHE INVALIDATION: Clear the Redis cache for this specific date
    const dateKey = new Date(parsedData.startTime).toISOString().split('T')[0];
    await redis.del(`availability:${dateKey}`);

    return { 
      success: true, 
      appointmentId: newAppointment.id,
    };

  } catch (error) {
    console.error("Database persistence error:", error);
    return { 
      success: false, 
      message: "Failed to save appointment to the database." 
    };
  }
}