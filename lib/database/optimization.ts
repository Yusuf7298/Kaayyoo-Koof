import { db } from '@/lib/db'
import { sql } from 'drizzle-orm'

// Database optimization utilities

export async function analyzeMissingIndexes() {
  const result = await db.execute(
    sql`
    SELECT 
      schemaname,
      tablename,
      attname,
      null_frac,
      avg_width,
      n_distinct,
      correlation
    FROM pg_stats
    WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
    ORDER BY abs(correlation) DESC
    LIMIT 50
  `
  )

  return result
}

export async function getTableStatistics() {
  const result = await db.execute(
    sql`
    SELECT 
      schemaname,
      tablename,
      pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size,
      n_live_tup as row_count,
      n_dead_tup as dead_rows,
      round(100 * n_dead_tup / (n_live_tup + n_dead_tup), 2) as dead_ratio
    FROM pg_stat_user_tables
    ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
  `
  )

  return result
}

export async function getSlowQueries() {
  const result = await db.execute(
    sql`
    SELECT 
      query,
      calls,
      total_time,
      mean_time,
      max_time,
      stddev_time
    FROM pg_stat_statements
    WHERE query NOT LIKE '%pg_stat%'
    ORDER BY mean_time DESC
    LIMIT 20
  `
  )

  return result
}

export async function getIndexUsageStats() {
  const result = await db.execute(
    sql`
    SELECT 
      schemaname,
      tablename,
      indexname,
      idx_scan,
      idx_tup_read,
      idx_tup_fetch,
      pg_size_pretty(pg_relation_size(indexrelid)) as size
    FROM pg_stat_user_indexes
    WHERE idx_scan = 0
    ORDER BY pg_relation_size(indexrelid) DESC
  `
  )

  return result
}

export async function identifyUnusedIndexes() {
  const result = await db.execute(
    sql`
    SELECT 
      schemaname,
      tablename,
      indexname,
      pg_size_pretty(pg_relation_size(indexrelid)) as size,
      idx_scan,
      idx_tup_read,
      idx_tup_fetch
    FROM pg_stat_user_indexes
    WHERE idx_scan = 0
    AND indexrelname NOT LIKE 'pg_toast%'
    ORDER BY pg_relation_size(indexrelid) DESC
  `
  )

  return result
}

export async function getConnectionPoolStats() {
  const result = await db.execute(
    sql`
    SELECT 
      datname,
      count(*) as connections,
      state,
      wait_event_type
    FROM pg_stat_activity
    GROUP BY datname, state, wait_event_type
    ORDER BY count(*) DESC
  `
  )

  return result
}

export async function analyzeQueryPlans(query: string) {
  const result = await db.execute(sql`EXPLAIN ANALYZE ${sql.raw(query)}`)
  return result
}

export async function vacuumAndAnalyze(tableName: string) {
  await db.execute(sql`VACUUM ANALYZE ${sql.identifier(tableName)}`)
}

export async function getTableBloat() {
  const result = await db.execute(
    sql`
    SELECT 
      schemaname,
      tablename,
      pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as total_size,
      pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) as index_size,
      ROUND(100 * (1 - pg_relation_size(schemaname||'.'||tablename)::numeric / pg_total_relation_size(schemaname||'.'||tablename)), 2) as index_ratio
    FROM pg_tables
    WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
    ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
  `
  )

  return result
}

export async function getConnectionActivity() {
  const result = await db.execute(
    sql`
    SELECT 
      application_name,
      state,
      count(*) as count,
      max(now() - state_change) as longest_duration
    FROM pg_stat_activity
    WHERE datname = current_database()
    GROUP BY application_name, state
  `
  )

  return result
}

// Caching strategy recommendations
export const CACHING_RECOMMENDATIONS = {
  announcements: {
    ttl: 300, // 5 minutes
    pattern: 'announcements:*',
  },
  camps: {
    ttl: 600, // 10 minutes
    pattern: 'camps:*',
  },
  events: {
    ttl: 600, // 10 minutes
    pattern: 'events:*',
  },
  statistics: {
    ttl: 900, // 15 minutes
    pattern: 'stats:*',
  },
  userProfiles: {
    ttl: 1800, // 30 minutes
    pattern: 'user:*',
  },
}

// Query optimization patterns
export const QUERY_OPTIMIZATION = {
  useIndexes: [
    'CREATE INDEX idx_announcements_status ON announcements(status) WHERE is_visible = true',
    'CREATE INDEX idx_camps_dates ON camps(start_date, end_date)',
    'CREATE INDEX idx_events_date_status ON events_enhanced(event_date, status)',
    'CREATE INDEX idx_memberships_user_status ON memberships(user_id, status)',
  ],
  removeUnused: [
    // Add names of unused indexes to drop here
  ],
  analyzeJoinPatterns: [
    // Document common join patterns for optimization
    'Users <-> Memberships: Filter by status first',
    'Events <-> Attendees: Use event_id index',
    'Announcements <-> Views: Pre-filter by published_at',
  ],
}

export async function generateOptimizationReport() {
  const report = {
    timestamp: new Date(),
    tables: await getTableStatistics(),
    slowQueries: await getSlowQueries(),
    unusedIndexes: await identifyUnusedIndexes(),
    tableBloa: await getTableBloat(),
    connectionPoolStats: await getConnectionPoolStats(),
    recommendations: [],
  }

  // Add recommendations based on analysis
  if (report.unusedIndexes.length > 0) {
    report.recommendations.push(
      `Found ${report.unusedIndexes.length} unused indexes that can be dropped to improve write performance`
    )
  }

  if (report.slowQueries.length > 0) {
    const slowestQuery = report.slowQueries[0]
    report.recommendations.push(
      `Slowest query takes ${slowestQuery.mean_time}ms on average - consider adding indexes or rewriting`
    )
  }

  return report
}
