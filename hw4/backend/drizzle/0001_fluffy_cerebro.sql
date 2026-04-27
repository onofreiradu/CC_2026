CREATE TABLE "profile_pictures" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "profile_pictures_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" integer NOT NULL,
	"imageUrl" varchar(500) NOT NULL,
	"isCurrent" boolean DEFAULT false NOT NULL,
	"uploadedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "profile_pictures" ADD CONSTRAINT "profile_pictures_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;