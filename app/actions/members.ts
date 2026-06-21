'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { members, contributions, events, eventAttendees } from '@/lib/db/schema'
import { and, desc, eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

// Member actions
export async function getMemberProfile() {
  const userId = await getUserId()
  const member = await db
    .select()
    .from(members)
    .where(eq(members.userId, userId))
    .limit(1)
  return member[0] || null
}

export async function updateMemberProfile(data: {
  first_name?: string
  last_name?: string
  phone?: string
}) {
  const userId = await getUserId()
  const member = await getMemberProfile()
  if (!member) throw new Error('Member profile not found')

  await db
    .update(members)
    .set({
      ...data,
      updated_at: new Date(),
    })
    .where(eq(members.userId, userId))

  revalidatePath('/member')
}

// Contribution actions
export async function getMemberContributions() {
  const userId = await getUserId()
  return db
    .select()
    .from(contributions)
    .where(eq(contributions.user_id, userId))
    .orderBy(desc(contributions.created_at))
}

export async function getContributionStats() {
  const userId = await getUserId()
  const contribs = await db
    .select()
    .from(contributions)
    .where(eq(contributions.user_id, userId))

  const total = contribs.reduce((sum, c) => sum + parseFloat(c.amount as any), 0)
  const count = contribs.length

  return { total, count }
}

// Event actions
export async function getUpcomingEvents() {
  return db
    .select()
    .from(events)
    .where(eq(events.status, 'upcoming'))
    .orderBy(events.event_date)
}

export async function getMemberRegisteredEvents() {
  const member = await getMemberProfile()
  if (!member) return []

  const userEvents = await db
    .select()
    .from(eventAttendees)
    .where(eq(eventAttendees.member_id, member.id))

  return userEvents.map((ea) => ea.event_id)
}

export async function registerForEvent(eventId: number) {
  const member = await getMemberProfile()
  if (!member) throw new Error('Member profile not found')

  await db.insert(eventAttendees).values({
    event_id: eventId,
    member_id: member.id,
    status: 'registered',
  }).onConflictDoNothing()

  revalidatePath('/events')
}

export async function cancelEventRegistration(eventId: number) {
  const member = await getMemberProfile()
  if (!member) throw new Error('Member profile not found')

  await db
    .delete(eventAttendees)
    .where(and(
      eq(eventAttendees.event_id, eventId),
      eq(eventAttendees.member_id, member.id)
    ))

  revalidatePath('/events')
}

// Admin actions
export async function isAdmin() {
  const userId = await getUserId()
  const member = await db
    .select()
    .from(members)
    .where(and(eq(members.userId, userId), eq(members.member_status, 'active')))
    .limit(1)
  return member.length > 0
}

export async function getAllMembers() {
  const isAdminUser = await isAdmin()
  if (!isAdminUser) throw new Error('Unauthorized: Admin access required')

  return db.select().from(members).orderBy(members.last_name)
}
