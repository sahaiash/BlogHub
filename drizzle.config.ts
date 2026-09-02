import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

const shouldUseSsl = process.env.NODE_ENV === 'production' || process.env.DB_SSL === 'true';

export default defineConfig({
  out: './drizzle',
  schema: './db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    ssl: shouldUseSsl ? { rejectUnauthorized: false } : undefined,
  },
});
