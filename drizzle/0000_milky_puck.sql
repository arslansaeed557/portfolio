CREATE TABLE "experiences" (
	"id" serial PRIMARY KEY NOT NULL,
	"role" text NOT NULL,
	"company" text NOT NULL,
	"location" text,
	"start_date" text NOT NULL,
	"end_date" text,
	"description" text,
	"tech_stack" text DEFAULT '' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"body" text NOT NULL,
	"read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profile" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"name" text NOT NULL,
	"headline" text NOT NULL,
	"bio" text NOT NULL,
	"location" text,
	"email" text,
	"github_url" text,
	"linkedin_url" text,
	"twitter_url" text,
	"resume_url" text,
	"avatar_url" text,
	"years_experience" integer DEFAULT 7,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"summary" text NOT NULL,
	"description" text,
	"tech_stack" text DEFAULT '' NOT NULL,
	"image_url" text,
	"repo_url" text,
	"live_url" text,
	"featured" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "skills" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"category" text DEFAULT 'Other' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
