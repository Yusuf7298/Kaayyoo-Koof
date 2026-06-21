import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

// Use DATABASE_URL from environment or fallback to local development
const connectionString = process.env.DATABASE_URL || 'postgresql://localhost/kayyoo_dev'

export const pool = new Pool({
  connectionString,
})

export const db = drizzle(pool, { schema })
