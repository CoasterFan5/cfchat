ALTER TABLE "user" ADD COLUMN "messageLimit" integer DEFAULT 10 NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "messagesSent" integer DEFAULT 0 NOT NULL;