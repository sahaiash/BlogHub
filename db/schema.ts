import { index, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
//pushing the schema to the database by db:push
export const blogTable = pgTable('blogs', {
    id:uuid().primaryKey().defaultRandom(),
    title:varchar({length:80}).notNull(),
    body:text().notNull(),
    orgId:text().notNull(),
    createdAt:timestamp().defaultNow().notNull(),
}, (table) => [
    // Every read is "this org's posts, newest first". This composite index
    // serves both the orgId filter and the createdAt ordering in one scan.
    index('blogs_org_id_created_at_idx').on(table.orgId, table.createdAt.desc()),
])

export type CreateBlogType = typeof blogTable.$inferInsert;
export type SelectBlogType = typeof blogTable.$inferSelect;

