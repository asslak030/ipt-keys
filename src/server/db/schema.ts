import { sql } from "drizzle-orm";
import {
  index,
  pgTableCreator,
  pgTable,
  serial,
  varchar,
  numeric,
  text,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

/**
 * Multi-project schema setup for Drizzle ORM.
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `ipt-keys_${name}`);

// === API KEYS TABLE ===
export const apiKeys = createTable("api_keys", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  name: varchar("name", { length: 256 }).notNull(),
  hashedKey: text("hashed_key").notNull(),
  last4: varchar("last4", { length: 4 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  revoked: boolean("revoked").notNull().default(false),
});

export const heroes = createTable("heroes", {
  id: serial("id").primaryKey(),

  gameName: varchar("game_name", { length: 255 }),
  category: varchar("category", { length: 100 }),
  price: numeric("price", { precision: 5, scale: 2 }),
  imageUrl: varchar("image_url", { length: 512 }), 
  userId: varchar("user_id", { length: 64 }).notNull(),
  description: text("description"),
});
