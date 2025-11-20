import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const sofas = pgTable("sofas", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(),
  width: integer("width").notNull(),
  depth: integer("depth").notNull(),
  height: integer("height").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  comfort: text("comfort").notNull(),
  inStore: boolean("in_store").notNull().default(false),
  inStock: boolean("in_stock").notNull().default(false),
  onOrder: boolean("on_order").notNull().default(false),
  mainImage: text("main_image").notNull(),
  images: text("images").array().notNull().default(sql`ARRAY[]::text[]`),
  description: text("description"),
  features: text("features").array().default(sql`ARRAY[]::text[]`),
});

export const insertSofaSchema = createInsertSchema(sofas).omit({
  id: true,
});

export type InsertSofa = z.infer<typeof insertSofaSchema>;
export type Sofa = typeof sofas.$inferSelect;

export type SofaType = "fixe" | "convertible" | "fauteuil" | "meridienne";
export type DepthType = "shallow" | "standard" | "lounge";
export type AvailabilityType = "store" | "stock" | "order";
