CREATE TYPE "public"."workspace_access_mode" AS ENUM('VIEW_ONLY', 'VIEW_WRITE');--> statement-breakpoint
CREATE TABLE "situm_explore"."workspace_situm_configs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"access_mode" "workspace_access_mode" NOT NULL,
	"situm_account_id" varchar(255) NOT NULL,
	"encrypted_api_key" varchar(2048) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "workspace_situm_configs_workspace_id_unique" UNIQUE("workspace_id")
);
--> statement-breakpoint
ALTER TABLE "situm_explore"."workspace_situm_configs" ADD CONSTRAINT "workspace_situm_configs_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "situm_explore"."workspaces"("id") ON DELETE cascade ON UPDATE no action;