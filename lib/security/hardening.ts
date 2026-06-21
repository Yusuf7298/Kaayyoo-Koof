'use server'

import { headers } from 'next/headers'
import { auth } from '@/lib/auth'

// CSRF Token generation and validation
const CSRF_TOKEN_LENGTH = 32
const CSRF_TOKEN_EXPIRY = 1000 * 60 * 60 // 1 hour

export async function generateCSRFToken(): Promise<string> {
  const token = Buffer.from(crypto.getRandomValues(new Uint8Array(CSRF_TOKEN_LENGTH))).toString('hex')
  
  // Store token in server session with timestamp
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    throw new Error('Unauthorized')
  }
  
  return token
}

export async function validateCSRFToken(token: string): Promise<boolean> {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) {
      return false
    }

    // Verify token hasn't expired and matches session
    const headerToken = (await headers()).get('x-csrf-token')
    if (!headerToken || headerToken !== token) {
      return false
    }

    return true
  } catch (error) {
    console.error('[v0] CSRF validation error:', error)
    return false
  }
}

// Rate limiting using in-memory store (upgrade to Redis for production)
interface RateLimitEntry {
  count: number
  resetTime: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()
const RATE_LIMIT_WINDOW = 1000 * 60 // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 100

export async function checkRateLimit(identifier: string): Promise<boolean> {
  const now = Date.now()
  const entry = rateLimitStore.get(identifier)

  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    })
    return true
  }

  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false
  }

  entry.count++
  return true
}

export function getRateLimitStatus(identifier: string) {
  const entry = rateLimitStore.get(identifier)
  if (!entry) {
    return {
      remaining: RATE_LIMIT_MAX_REQUESTS,
      resetTime: Date.now() + RATE_LIMIT_WINDOW,
    }
  }

  return {
    remaining: Math.max(0, RATE_LIMIT_MAX_REQUESTS - entry.count),
    resetTime: entry.resetTime,
  }
}

// Content Security Policy header configuration
export const CSP_HEADERS = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-inline'", // Required for Next.js
    'cdn.jsdelivr.net',
    'cdn.vercel-analytics.com',
  ],
  'style-src': ["'self'", "'unsafe-inline'", 'fonts.googleapis.com'],
  'font-src': ["'self'", 'fonts.gstatic.com'],
  'img-src': ["'self'", 'data:', 'https:', 'blob:'],
  'frame-ancestors': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'upgrade-insecure-requests': [],
}

export function generateCSPHeader(): string {
  return Object.entries(CSP_HEADERS)
    .map(([key, values]) => {
      if (values.length === 0) return key
      return `${key} ${values.join(' ')}`
    })
    .join('; ')
}

// Security headers configuration
export const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy':
    'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
}

// Secure cookie configuration
export const SECURE_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'Strict' as const,
  maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
}

// Input sanitization for XSS prevention
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '')
    .replace(/["']/g, '&quot;')
    .trim()
}

// SQL injection prevention via parameterized queries
export function sanitizeSQLInput(input: string): string {
  return input.replace(/['";\\]/g, (char) => {
    const escapeMap: Record<string, string> = {
      "'": "''",
      '"': '""',
      ';': '',
      '\\': '\\\\',
    }
    return escapeMap[char] || char
  })
}

// Login attempt tracking
interface LoginAttempt {
  count: number
  lastAttempt: number
  locked: boolean
  lockedUntil?: number
}

const loginAttempts = new Map<string, LoginAttempt>()
const LOGIN_ATTEMPT_WINDOW = 1000 * 60 * 15 // 15 minutes
const MAX_LOGIN_ATTEMPTS = 5
const LOCKOUT_DURATION = 1000 * 60 * 30 // 30 minutes

export async function trackLoginAttempt(email: string, success: boolean): Promise<void> {
  const key = `login:${email}`
  const attempt = loginAttempts.get(key)
  const now = Date.now()

  if (!attempt) {
    if (!success) {
      loginAttempts.set(key, {
        count: 1,
        lastAttempt: now,
        locked: false,
      })
    }
    return
  }

  // Check if account is locked
  if (attempt.locked && attempt.lockedUntil && now < attempt.lockedUntil) {
    throw new Error(`Account temporarily locked. Try again in ${Math.ceil((attempt.lockedUntil - now) / 1000)} seconds.`)
  }

  // Reset attempt if window expired
  if (now - attempt.lastAttempt > LOGIN_ATTEMPT_WINDOW) {
    if (success) {
      loginAttempts.delete(key)
    } else {
      loginAttempts.set(key, {
        count: 1,
        lastAttempt: now,
        locked: false,
      })
    }
    return
  }

  if (success) {
    // Clear attempts on successful login
    loginAttempts.delete(key)
  } else {
    // Increment failed attempts
    attempt.count++
    attempt.lastAttempt = now

    if (attempt.count >= MAX_LOGIN_ATTEMPTS) {
      attempt.locked = true
      attempt.lockedUntil = now + LOCKOUT_DURATION
      throw new Error(`Too many failed login attempts. Account locked for 30 minutes.`)
    }
  }
}

export function isAccountLocked(email: string): boolean {
  const key = `login:${email}`
  const attempt = loginAttempts.get(key)

  if (!attempt || !attempt.locked) {
    return false
  }

  if (attempt.lockedUntil && Date.now() > attempt.lockedUntil) {
    loginAttempts.delete(key)
    return false
  }

  return true
}
