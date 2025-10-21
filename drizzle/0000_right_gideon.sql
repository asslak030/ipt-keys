CREATE TABLE "ipt-keys_api_keys" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"name" varchar(256) NOT NULL,
	"hashed_key" text NOT NULL,
	"last4" varchar(4) NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"revoked" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ipt-keys_heroes" (
	"id" serial PRIMARY KEY NOT NULL,
	"game_name" varchar(255),
	"category" varchar(100),
	"price" numeric(5, 2),
	"description" text,
	"game_image" varchar(512)
);
