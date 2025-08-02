import { pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
//pushing the schema to the database by db:push
export const blogTable = pgTable('blogs', {
    id:uuid().primaryKey().defaultRandom(),
    title:varchar({length:80}).notNull(),
    body:text().notNull(),
    orgId:text().notNull(),
})

export type CreateBlogType = typeof blogTable.$inferInsert;
export type SelectBlogType = typeof blogTable.$inferInsert;

