CREATE SCHEMA IF NOT EXISTS "situm_explore";

CREATE TABLE "situm_explore"."app_settings" (
	"key" varchar(100) PRIMARY KEY NOT NULL,
	"value" varchar(500),
	"created_at" timestamp DEFAULT now() NOT NULL
);
