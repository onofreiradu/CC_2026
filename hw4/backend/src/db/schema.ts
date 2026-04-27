import { integer, pgTable, varchar, boolean, timestamp } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  age: integer().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
});

export const profilePicturesTable = pgTable("profile_pictures", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer().references(() => usersTable.id).notNull(),
  imageUrl: varchar({ length: 500 }).notNull(),
  isCurrent: boolean().default(false).notNull(),
  uploadedAt: timestamp().defaultNow().notNull(),
});