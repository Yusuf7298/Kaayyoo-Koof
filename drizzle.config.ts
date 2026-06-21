import { defineConfig } from 'drizzle-kit'
import { config } from 'dotenv'
import { expand } from 'dotenv-expand'

// Load .env.local first (Next.js convention), then fall back to .env
expand(config({ path: '.env.local' }))
expand(config({ path: '.env' }))

export default defineConfig({
    schema: './lib/db/schema.ts',
    out: './drizzle',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
})
