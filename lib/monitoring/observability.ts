'use server'

import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { RBAC } from '@/lib/security/rbac'

// System health metrics
export interface SystemMetrics {
  timestamp: Date
  uptime: number
  cpuUsage: number
  memoryUsage: number
  databaseConnections: number
  avgResponseTime: number
  errorRate: number
  requestsPerSecond: number
  activeUsers: number
}

// Monitoring configuration for Sentry
export const SENTRY_CONFIG = {
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  debug: process.env.NODE_ENV === 'development',
  integrations: [
    // Error tracking
    // Performance monitoring
    // Release tracking
  ],
}

// PostHog analytics configuration
export const POSTHOG_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_POSTHOG_API_KEY,
  apiHost: process.env.NEXT_PUBLIC_POSTHOG_API_HOST || 'https://app.posthog.com',
  enabled: process.env.NODE_ENV === 'production',
  capturePageView: true,
  capturePageLeave: true,
}

// Performance monitoring alerts
export const PERFORMANCE_THRESHOLDS = {
  // Page load metrics (Core Web Vitals)
  LCP: {
    // Largest Contentful Paint
    good: 2500, // ms
    needsImprovement: 4000, // ms
  },
  FID: {
    // First Input Delay
    good: 100, // ms
    needsImprovement: 300, // ms
  },
  CLS: {
    // Cumulative Layout Shift
    good: 0.1,
    needsImprovement: 0.25,
  },

  // API performance
  API_RESPONSE_TIME: {
    good: 200, // ms
    warning: 500, // ms
    critical: 1000, // ms
  },

  // Error rates
  ERROR_RATE: {
    good: 0.1, // 0.1%
    warning: 0.5, // 0.5%
    critical: 1.0, // 1%
  },

  // Resource usage
  MEMORY_USAGE: {
    warning: 70, // 70%
    critical: 85, // 85%
  },
  DATABASE_CONNECTIONS: {
    warning: 80, // 80% of max
    critical: 95, // 95% of max
  },
}

// Monitoring dashboard permissions
export async function checkMonitoringAccess(userId: string): Promise<boolean> {
  const canView = await RBAC.hasPermission(userId, 'monitoring.view')
  return canView
}

// Get system health metrics
export async function getSystemMetrics(): Promise<SystemMetrics> {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    throw new Error('Unauthorized')
  }

  // Check if user has monitoring access
  const hasAccess = await checkMonitoringAccess(session.user.id)
  if (!hasAccess) {
    throw new Error('Insufficient permissions')
  }

  // Collect metrics from various sources
  const metrics: SystemMetrics = {
    timestamp: new Date(),
    uptime: process.uptime(),
    cpuUsage: process.cpuUsage().user / 1000000, // Convert to percentage
    memoryUsage: (process.memoryUsage().heapUsed / process.memoryUsage().heapTotal) * 100,
    databaseConnections: 0, // Would query from database
    avgResponseTime: 0, // Would collect from logs
    errorRate: 0, // Would calculate from logs
    requestsPerSecond: 0, // Would calculate from metrics
    activeUsers: 0, // Would query from sessions
  }

  return metrics
}

// Performance monitoring alerts
export async function checkPerformanceMetrics() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    throw new Error('Unauthorized')
  }

  const metrics = await getSystemMetrics()
  const alerts = []

  // Check Core Web Vitals
  if (metrics.avgResponseTime > PERFORMANCE_THRESHOLDS.API_RESPONSE_TIME.critical) {
    alerts.push({
      level: 'critical',
      metric: 'API Response Time',
      value: metrics.avgResponseTime,
      threshold: PERFORMANCE_THRESHOLDS.API_RESPONSE_TIME.critical,
      message: 'API response time exceeds critical threshold',
    })
  }

  if (metrics.errorRate > PERFORMANCE_THRESHOLDS.ERROR_RATE.critical) {
    alerts.push({
      level: 'critical',
      metric: 'Error Rate',
      value: metrics.errorRate,
      threshold: PERFORMANCE_THRESHOLDS.ERROR_RATE.critical,
      message: 'Error rate exceeds critical threshold',
    })
  }

  if (metrics.memoryUsage > PERFORMANCE_THRESHOLDS.MEMORY_USAGE.critical) {
    alerts.push({
      level: 'critical',
      metric: 'Memory Usage',
      value: metrics.memoryUsage,
      threshold: PERFORMANCE_THRESHOLDS.MEMORY_USAGE.critical,
      message: 'Memory usage exceeds critical threshold',
    })
  }

  return alerts
}

// Event tracking for analytics
export async function trackEvent(
  eventName: string,
  properties: Record<string, any> = {}
) {
  try {
    // Track with PostHog
    if (typeof window !== 'undefined' && window.posthog) {
      window.posthog.capture(eventName, properties)
    }

    // Track with Sentry
    if (typeof Sentry !== 'undefined') {
      Sentry.captureMessage(`Event: ${eventName}`, 'info')
    }
  } catch (error) {
    console.error('[v0] Error tracking event:', error)
  }
}

// Error logging with context
export async function logError(
  error: Error,
  context: Record<string, any> = {}
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })

    const errorData = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date(),
      userId: session?.user?.id,
      context,
    }

    // Log to Sentry with context
    if (typeof Sentry !== 'undefined') {
      Sentry.captureException(error, {
        contexts: {
          user: { id: session?.user?.id },
          ...context,
        },
      })
    }

    // Log to database
    // await db.insert(error_logs).values(errorData)

    console.error('[v0] Error logged:', errorData)
  } catch (loggingError) {
    console.error('[v0] Error logging failed:', loggingError)
  }
}

// Real-time dashboard updates
export async function getDashboardData() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    throw new Error('Unauthorized')
  }

  const hasAccess = await checkMonitoringAccess(session.user.id)
  if (!hasAccess) {
    throw new Error('Insufficient permissions')
  }

  const metrics = await getSystemMetrics()
  const alerts = await checkPerformanceMetrics()

  return {
    metrics,
    alerts,
    lastUpdated: new Date(),
  }
}

// Custom monitoring events
export const MONITORING_EVENTS = {
  USER_LOGIN: 'user_login',
  USER_LOGOUT: 'user_logout',
  ROLE_CHANGE: 'role_change',
  PERMISSION_DENIED: 'permission_denied',
  RATE_LIMIT_HIT: 'rate_limit_hit',
  API_ERROR: 'api_error',
  DATABASE_ERROR: 'database_error',
  SECURITY_INCIDENT: 'security_incident',
  BACKUP_COMPLETED: 'backup_completed',
  BACKUP_FAILED: 'backup_failed',
}

// Webhook configuration for alerts
export const WEBHOOK_ENDPOINTS = {
  slack: process.env.SLACK_WEBHOOK_URL,
  email: process.env.ALERT_EMAIL,
  pagerduty: process.env.PAGERDUTY_INTEGRATION_KEY,
}

// Send alert to webhooks
export async function sendAlert(
  severity: 'critical' | 'warning' | 'info',
  message: string,
  context: Record<string, any> = {}
) {
  try {
    // Send to Slack
    if (WEBHOOK_ENDPOINTS.slack) {
      const payload = {
        text: `🚨 ${severity.toUpperCase()}: ${message}`,
        attachments: [
          {
            color: severity === 'critical' ? 'danger' : 'warning',
            fields: Object.entries(context).map(([key, value]) => ({
              title: key,
              value: String(value),
              short: true,
            })),
            ts: Math.floor(Date.now() / 1000),
          },
        ],
      }

      await fetch(WEBHOOK_ENDPOINTS.slack, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    }

    // Could also send to email, PagerDuty, etc
  } catch (error) {
    console.error('[v0] Error sending alert:', error)
  }
}
