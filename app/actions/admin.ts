'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { members, contributions, events, announcements } from '@/lib/db/schema'
import { and, desc, eq, count } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

async function isAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return false
  const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim().toLowerCase()) ?? []
  if (adminEmails.length > 0) {
    return adminEmails.includes(session.user.email.toLowerCase())
  }
  const userId = session.user.id
  const member = await db.select().from(members).where(eq(members.userId, userId)).limit(1)
  return member.length > 0
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────

export async function getAdminDashboardStats() {
  const admin = await isAdmin()
  if (!admin) throw new Error('Unauthorized')

  const allMembers = await db.select().from(members)
  const allContribs = await db.select().from(contributions)
  const allEvents = await db.select().from(events)
  const allAnnouncements = await db.select().from(announcements)

  return {
    totalMembers: allMembers.length,
    activeMembers: allMembers.filter(m => m.member_status === 'active').length,
    pendingMembers: allMembers.filter(m => m.member_status === 'pending').length,
    totalContributions: allContribs.reduce((s, c) => s + parseFloat(c.amount as any), 0),
    totalEvents: allEvents.length,
    upcomingEvents: allEvents.filter(e => e.status === 'upcoming').length,
    totalAnnouncements: allAnnouncements.length,
  }
}

// ─── MEMBERS ──────────────────────────────────────────────────────────────────

export async function getAllMembers() {
  const admin = await isAdmin()
  if (!admin) throw new Error('Unauthorized: Admin access required')
  return db.select().from(members).orderBy(members.last_name)
}

export async function getMemberStats() {
  const admin = await isAdmin()
  if (!admin) throw new Error('Unauthorized: Admin access required')
  const allMembers = await db.select().from(members)
  const allContributions = await db.select().from(contributions)
  return {
    totalMembers: allMembers.length,
    activeMembers: allMembers.filter(m => m.member_status === 'active').length,
    totalContributions: allContributions.reduce((s, c) => s + parseFloat(c.amount as any), 0),
  }
}

export async function updateMemberStatus(memberId: number, status: string) {
  const admin = await isAdmin()
  if (!admin) throw new Error('Unauthorized')
  await db.update(members).set({ member_status: status, updated_at: new Date() }).where(eq(members.id, memberId))
  revalidatePath('/admin/members')
}

export async function deleteMember(memberId: number) {
  const admin = await isAdmin()
  if (!admin) throw new Error('Unauthorized')
  await db.delete(members).where(eq(members.id, memberId))
  revalidatePath('/admin/members')
}

// ─── EVENTS ───────────────────────────────────────────────────────────────────

export async function createEvent(data: {
  title: string
  description?: string
  event_date: string
  location?: string
  max_attendees?: number
}) {
  const userId = await getUserId()
  const admin = await isAdmin()
  if (!admin) throw new Error('Unauthorized')
  const result = await db.insert(events).values({
    title: data.title,
    description: data.description,
    event_date: new Date(data.event_date),
    location: data.location,
    max_attendees: data.max_attendees,
    organizer_id: userId,
  }).returning()
  revalidatePath('/admin/events')
  revalidatePath('/events')
  return result[0]
}

export async function getAllEvents() {
  const admin = await isAdmin()
  if (!admin) throw new Error('Unauthorized')
  return db.select().from(events).orderBy(desc(events.event_date))
}

export async function updateEvent(eventId: number, data: {
  title?: string
  description?: string
  event_date?: string
  location?: string
  max_attendees?: number
  status?: string
}) {
  const admin = await isAdmin()
  if (!admin) throw new Error('Unauthorized')
  await db.update(events).set({
    ...(data.title && { title: data.title }),
    ...(data.description !== undefined && { description: data.description }),
    ...(data.event_date && { event_date: new Date(data.event_date) }),
    ...(data.location !== undefined && { location: data.location }),
    ...(data.max_attendees !== undefined && { max_attendees: data.max_attendees }),
    ...(data.status && { status: data.status }),
    updated_at: new Date(),
  }).where(eq(events.id, eventId))
  revalidatePath('/admin/events')
  revalidatePath('/events')
}

export async function updateEventStatus(eventId: number, status: string) {
  const admin = await isAdmin()
  if (!admin) throw new Error('Unauthorized')
  await db.update(events).set({ status, updated_at: new Date() }).where(eq(events.id, eventId))
  revalidatePath('/admin/events')
}

export async function deleteEvent(eventId: number) {
  const admin = await isAdmin()
  if (!admin) throw new Error('Unauthorized')
  await db.delete(events).where(eq(events.id, eventId))
  revalidatePath('/admin/events')
  revalidatePath('/events')
}

// ─── CONTRIBUTIONS ────────────────────────────────────────────────────────────

export async function getAllContributions() {
  const admin = await isAdmin()
  if (!admin) throw new Error('Unauthorized')
  return db.select().from(contributions).orderBy(desc(contributions.created_at))
}

export async function addContribution(data: {
  member_id: number
  user_id: string
  amount: string
  contribution_type: string
  description?: string
  payment_method?: string
}) {
  const admin = await isAdmin()
  if (!admin) throw new Error('Unauthorized')
  const result = await db.insert(contributions).values({
    member_id: data.member_id,
    user_id: data.user_id,
    amount: data.amount,
    contribution_type: data.contribution_type,
    description: data.description,
    payment_method: data.payment_method,
    status: 'completed',
  }).returning()
  revalidatePath('/admin/contributions')
  return result[0]
}

export async function deleteContribution(id: number) {
  const admin = await isAdmin()
  if (!admin) throw new Error('Unauthorized')
  await db.delete(contributions).where(eq(contributions.id, id))
  revalidatePath('/admin/contributions')
}

export async function getContributionReport() {
  const admin = await isAdmin()
  if (!admin) throw new Error('Unauthorized')
  const contribs = await db.select().from(contributions)
  const byType: Record<string, number> = {}
  let total = 0
  contribs.forEach(c => {
    const amount = parseFloat(c.amount as any)
    total += amount
    byType[c.contribution_type] = (byType[c.contribution_type] || 0) + amount
  })
  return {
    total,
    byType,
    count: contribs.length,
    average: contribs.length > 0 ? total / contribs.length : 0,
  }
}

// ─── ANNOUNCEMENTS ────────────────────────────────────────────────────────────

export async function createAdminAnnouncement(data: { title: string; content: string }) {
  const userId = await getUserId()
  const admin = await isAdmin()
  if (!admin) throw new Error('Unauthorized')
  const result = await db.insert(announcements).values({
    ...data,
    author_id: userId,
    published_at: new Date(),
  }).returning()
  revalidatePath('/admin/announcements')
  revalidatePath('/announcements')
  return result[0]
}

export async function getAllAnnouncements() {
  const admin = await isAdmin()
  if (!admin) throw new Error('Unauthorized')
  return db.select().from(announcements).orderBy(desc(announcements.published_at))
}

export async function updateAnnouncement(id: number, data: { title?: string; content?: string }) {
  const admin = await isAdmin()
  if (!admin) throw new Error('Unauthorized')
  await db.update(announcements).set({ ...data, updated_at: new Date() }).where(eq(announcements.id, id))
  revalidatePath('/admin/announcements')
}

export async function deleteAnnouncement(id: number) {
  const admin = await isAdmin()
  if (!admin) throw new Error('Unauthorized')
  await db.delete(announcements).where(eq(announcements.id, id))
  revalidatePath('/admin/announcements')
}
