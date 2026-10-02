ALTER TABLE "fear_occurrences"
  ADD COLUMN "behaviors" text[] DEFAULT '{}'::text[] NOT NULL;
--> statement-breakpoint
ALTER TABLE "fears"
  DROP COLUMN "behaviors";
