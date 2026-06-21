import { db } from './db'
import { auditLogs } from './db/schema'
import { headers } from 'next/headers'

export interface AuditLogEntry {
  userId?: string
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'VIEW' | 'EXPORT' | 'LOGIN' | 'LOGOUT'
  resourceType: string
  resourceId: string
  changes?: {
    before?: Record<string, any>
    after?: Record<string, any>
  }
  status?: 'success' | 'failure'
  errorMessage?: string
}

// Get IP address from request
async function getClientIP(): Promise<string> {
  const headersList = await headers()
  return (
    headersList.get('x-forwarded-for')?.split(',')[0].trim() ||
    headersList.get('x-real-ip') ||
    'unknown'
  )
}

// Get user agent from request
async function getUserAgent(): Promise<string> {
  const headersList = await headers()
  return headersList.get('user-agent') || 'unknown'
}

// Log action to audit logs
export async function logAction(entry: AuditLogEntry) {
  try {
    const ipAddress = await getClientIP()
    const userAgent = await getUserAgent()

    const result = await db
      .insert(auditLogs)
      .values({
        user_id: entry.userId,
        action: entry.action,
        resource_type: entry.resourceType,
        resource_id: entry.resourceId,
        changes: entry.changes,
        ip_address: ipAddress,
        user_agent: userAgent,
        status: entry.status || 'success',
        error_message: entry.errorMessage,
      })
      .returning()

    return result[0]
  } catch (error) {
    console.error('[v0] Error logging action:', error)
    // Don't throw - audit logging should not break application flow
    return null
  }
}

// Get audit logs for a resource
export async function getResourceAuditLogs(
  resourceType: string,
  resourceId: string,
  limit = 100
) {
  try {
    const { and, eq, desc } = await import('drizzle-orm')
    const logs = await db
      .select()
      .from(auditLogs)
      .where(
        and(
          eq(auditLogs.resource_type, resourceType),
          eq(auditLogs.resource_id, resourceId)
        )
      )
      .orderBy(desc(auditLogs.created_at))
      .limit(limit)

    return logs
  } catch (error) {
    console.error('[v0] Error fetching audit logs:', error)
    return []
  }
}

// Get user activity logs
export async function getUserActivityLogs(userId: string, limit = 100) {
  try {
    const { eq, desc } = await import('drizzle-orm')
    const logs = await db
      .select()
      .from(auditLogs)
      .where(eq(auditLogs.user_id, userId))
      .orderBy(desc(auditLogs.created_at))
      .limit(limit)

    return logs
  } catch (error) {
    console.error('[v0] Error fetching user activity:', error)
    return []
  }
}

// Get all audit logs (admin only)
export async function getAllAuditLogs(limit = 1000, offset = 0) {
  try {
    const logs = await db
      .select()
      .from(auditLogs)
      .orderBy((table) => table.created_at)
      .limit(limit)
      .offset(offset)

    return logs
  } catch (error) {
    console.error('[v0] Error fetching all audit logs:', error)
    return []
  }
}

export const Audit = {
  logAction,
  getResourceAuditLogs,
  getUserActivityLogs,
  getAllAuditLogs,
}
