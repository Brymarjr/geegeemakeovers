// src/db/schema.ts
import { 
  pgTable, 
  text, 
  integer, 
  timestamp, 
  boolean, 
  pgEnum, 
  uuid 
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const appointmentStatusEnum = pgEnum("appointment_status", [
  "pending_consultation", // Client requested slot, negotiating on WhatsApp or other medium
  "confirmed",            // Owner manually locked the slot after agreement
  "cancelled",            // Owner or client backed out
  "completed"             // Service rendered 
]);

export const services = pgTable("services", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  basePriceInCents: integer("base_price_in_cents").notNull(),
  isFlexiblePrice: boolean("is_flexible_price").default(true).notNull(),
  estimatedDurationMinutes: integer("estimated_duration_minutes").notNull(),
  imageUrl: text("image_url"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const appointments = pgTable("appointments", {
  id: uuid("id").primaryKey().defaultRandom(),
  serviceId: uuid("service_id").references(() => services.id).notNull(),
  
  clientName: text("client_name").notNull(),
  clientEmail: text("client_email").notNull(),
  clientPhone: text("client_phone").notNull(),
  
  startTime: timestamp("start_time", { withTimezone: true }).notNull(),
  endTime: timestamp("end_time", { withTimezone: true }).notNull(),
  status: appointmentStatusEnum("status").default("pending_consultation").notNull(),
  
  agreedPriceInCents: integer("agreed_price_in_cents"),
  stripeSessionId: text("stripe_session_id"), 
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const servicesRelations = relations(services, ({ many }) => ({
  appointments: many(appointments),
}));

export const appointmentsRelations = relations(appointments, ({ one }) => ({
  service: one(services, {
    fields: [appointments.serviceId],
    references: [services.id],
  }),
}));