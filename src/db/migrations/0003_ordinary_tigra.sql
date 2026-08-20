CREATE TABLE "blockouts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"target_date" date NOT NULL,
	"time_slot" text,
	"reason" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
