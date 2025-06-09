DROP TABLE "message" CASCADE;--> statement-breakpoint
ALTER TABLE "threads" ADD COLUMN "messages" text DEFAULT '[]' NOT NULL;