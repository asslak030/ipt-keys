// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import { index, pgTableCreator } from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `ipt-keys_${name}`);

export const apiKeys = createTable("api_keys", (d) => ({
  id: d.text("id").primaryKey(),
  userId: d.varchar("user_id", { length: 255 }).notNull(),
  name: d.varchar({ length: 256 }).notNull(),
  hashedKey: d.text("hashed_key").notNull(),
  last4: d.varchar("last4", { length: 4 }).notNull(),
  createdAt: d
    .timestamp({ withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  revoked: d.boolean("revoked").notNull().default(false),
}));

export const items = createTable("items", (d) => ({
  id: d.text("id").primaryKey(),
  heroName: d.varchar("hero_name", { length: 255 }).notNull(),
  role: d.varchar("role", { length: 100 }).notNull(),
  pickRate: d.numeric("pick_rate", { precision: 5, scale: 2 }).notNull(),
  ownerId: d.varchar("owner_id", { length: 255 }).notNull(),
  title: d.varchar("title", { length: 255 }),
  description: d.text("description"),
  category: d.varchar("category", { length: 100 }),
  imageUrl: d.text("image_url"),
  createdAt: d
    .timestamp({ withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: d
    .timestamp({ withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
}));
