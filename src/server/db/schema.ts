// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import { index, pgTableCreator } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

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

export const items = createTable(
  "items",
  (d) => ({
    id: d.text("id").primaryKey().$defaultFn(() => createId()),
    title: d.varchar("title", { length: 255 }).notNull(),
    description: d.text("description").notNull(),
    category: d.varchar("category", { length: 100 }).notNull(),
    imageUrl: d.text("image_url").notNull(),
    ownerId: d.varchar("owner_id", { length: 255 }).notNull(),
    createdAt: d
      .timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d
      .timestamp("updated_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  }),
  (table) => ({
    categoryIdx: index("items_category_idx").on(table.category),
    ownerIdx: index("items_owner_idx").on(table.ownerId),
  })
);