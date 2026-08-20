ALTER TABLE "appointments" RENAME COLUMN "quoted_price_in_cents" TO "agreed_price_in_cents";--> statement-breakpoint
ALTER TABLE "appointments" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "appointments" ALTER COLUMN "status" SET DEFAULT 'pending_consultation'::text;--> statement-breakpoint
DROP TYPE "public"."appointment_status";--> statement-breakpoint
CREATE TYPE "public"."appointment_status" AS ENUM('pending_consultation', 'confirmed', 'cancelled', 'completed');--> statement-breakpoint
ALTER TABLE "appointments" ALTER COLUMN "status" SET DEFAULT 'pending_consultation'::"public"."appointment_status";--> statement-breakpoint
ALTER TABLE "appointments" ALTER COLUMN "status" SET DATA TYPE "public"."appointment_status" USING "status"::"public"."appointment_status";