import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

const shouldUseSsl = process.env.NODE_ENV === 'production' || process.env.DB_SSL === 'true';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: shouldUseSsl
    ? { rejectUnauthorized: false }
    : undefined,
});

export const db = drizzle(pool);
