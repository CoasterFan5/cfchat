CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text,
	"token" text NOT NULL,
	CONSTRAINT "sessions_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE "userIdentities" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text,
	"provider" text NOT NULL,
	"providerUserId" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "userIdentities_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text,
	"name" text
);
--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "userIdentities" ADD CONSTRAINT "userIdentities_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;