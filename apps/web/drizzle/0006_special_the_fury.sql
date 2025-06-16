ALTER TABLE "threads" ALTER COLUMN "selectedModel" SET DEFAULT 'gemini-2.5-flash-preview-04-17';--> statement-breakpoint
ALTER TABLE "threads" ALTER COLUMN "selectedModel" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "threads" ADD COLUMN "selectedProvider" text DEFAULT 'google' NOT NULL;