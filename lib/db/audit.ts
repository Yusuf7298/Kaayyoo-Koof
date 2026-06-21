import { db } from './index'
import { auditLogs } from './schema'

interface AuditLogData {
  userId?: string
  action: string
  resourceType: string
  resourceId: string
  changes?: Record<string, any>
  ipAddress?: string
  status?: string
}

export const Audit = {
  async logAction(data: AuditLogData) {
    try {
      await db
        .insert(auditLogs)
        .values({
          user_id: data.userId,
          action: data.action,
          resource_type: data.resourceType,
          resource_id: data.resourceId,
          changes: data.changes,
          ip_address: data.ipAddress || 'unknown',
          status: data.status || 'success',
        })
    } catch (error) {
      console.error('Error logging audit action:', error)
    }
  },
}
