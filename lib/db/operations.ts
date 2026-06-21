import { db } from './index'
import {
  camps,
  camp_sessions,
  camp_enrollments,
  camp_feedback,
  announcements_enhanced,
  announcement_categories,
  community_statistics,
  services,
  achievements,
  gallery_albums,
  gallery_images,
  testimonials,
  page_blocks,
  cms_settings,
} from './schema'
import { eq, desc, and, sql, count, sum } from 'drizzle-orm'
import { Audit } from './audit'

// =====================================================
// STATISTICS OPERATIONS
// =====================================================

export async function getCommunityStatistics() {
  try {
    const stats = await db.query.community_statistics.findMany()
    return stats.map((stat) => ({
      metric_name: stat.metric_name,
      metric_value: stat.metric_value,
      metric_type: stat.metric_type,
    }))
  } catch (error) {
    console.error('[v0] Error fetching community statistics:', error)
    return []
  }
}

export async function updateStatistic(
  metricName: string,
  metricValue: string
) {
  try {
    const result = await db
      .insert(community_statistics)
      .values({
        metric_name: metricName,
        metric_value: metricValue,
        metric_type: 'number',
      })
      .onConflictDoUpdate({
        target: community_statistics.metric_name,
        set: {
          metric_value: metricValue,
          updated_at: new Date(),
        },
      })
      .returning()

    return result[0]
  } catch (error) {
    console.error('[v0] Error updating statistic:', error)
    throw error
  }
}

// =====================================================
// CAMPS OPERATIONS
// =====================================================

export async function getAllCamps(limit = 100) {
  try {
    const result = await db
      .select()
      .from(camps)
      .where(eq(camps.status, 'active'))
      .orderBy(desc(camps.start_date))
      .limit(limit)

    return result
  } catch (error) {
    console.error('[v0] Error fetching camps:', error)
    return []
  }
}

export async function getCampById(campId: number) {
  try {
    const result = await db.query.camps.findFirst({
      where: eq(camps.id, campId),
      with: {
        sessions: true,
      },
    })

    return result
  } catch (error) {
    console.error('[v0] Error fetching camp:', error)
    return null
  }
}

export async function createCamp(campData: {
  title: string
  description: string
  category: string
  start_date: Date
  end_date: Date
  location: string
  organizer_id: string
  max_participants: number
  camp_image?: string
}) {
  try {
    const result = await db
      .insert(camps)
      .values(campData)
      .returning()

    await Audit.logAction({
      userId: campData.organizer_id,
      action: 'CREATE',
      resourceType: 'camp',
      resourceId: String(result[0].id),
    })

    return result[0]
  } catch (error) {
    console.error('[v0] Error creating camp:', error)
    throw error
  }
}

export async function enrollInCamp(
  campId: number,
  memberId: number,
  userId: string
) {
  try {
    const result = await db
      .insert(camp_enrollments)
      .values({
        camp_id: campId,
        member_id: memberId,
      })
      .returning()

    await Audit.logAction({
      userId,
      action: 'CREATE',
      resourceType: 'camp_enrollment',
      resourceId: String(result[0].id),
    })

    return result[0]
  } catch (error) {
    console.error('[v0] Error enrolling in camp:', error)
    throw error
  }
}

export async function getCampEnrollments(campId: number) {
  try {
    const result = await db
      .select()
      .from(camp_enrollments)
      .where(eq(camp_enrollments.camp_id, campId))

    return result
  } catch (error) {
    console.error('[v0] Error fetching enrollments:', error)
    return []
  }
}

// =====================================================
// ANNOUNCEMENTS OPERATIONS
// =====================================================

export async function getAllAnnouncements(limit = 50) {
  try {
    const result = await db
      .select()
      .from(announcements_enhanced)
      .where(eq(announcements_enhanced.status, 'published'))
      .orderBy(desc(announcements_enhanced.published_at))
      .limit(limit)

    return result
  } catch (error) {
    console.error('[v0] Error fetching announcements:', error)
    return []
  }
}

export async function getAnnouncementById(announcementId: number) {
  try {
    const result = await db.query.announcements_enhanced.findFirst({
      where: eq(announcements_enhanced.id, announcementId),
    })

    return result
  } catch (error) {
    console.error('[v0] Error fetching announcement:', error)
    return null
  }
}

export async function createAnnouncement(announcementData: {
  title: string
  content: string
  author_id: string
  category_id?: number
  is_pinned?: boolean
  is_featured?: boolean
  announcement_image?: string
  expiration_date?: Date
}) {
  try {
    const result = await db
      .insert(announcements_enhanced)
      .values({
        ...announcementData,
        status: 'published',
        published_at: new Date(),
      })
      .returning()

    await Audit.logAction({
      userId: announcementData.author_id,
      action: 'CREATE',
      resourceType: 'announcement',
      resourceId: String(result[0].id),
    })

    return result[0]
  } catch (error) {
    console.error('[v0] Error creating announcement:', error)
    throw error
  }
}

export async function getFeaturedAnnouncements(limit = 5) {
  try {
    const result = await db
      .select()
      .from(announcements_enhanced)
      .where(
        and(
          eq(announcements_enhanced.is_featured, true),
          eq(announcements_enhanced.status, 'published')
        )
      )
      .orderBy(desc(announcements_enhanced.published_at))
      .limit(limit)

    return result
  } catch (error) {
    console.error('[v0] Error fetching featured announcements:', error)
    return []
  }
}

// =====================================================
// SERVICES OPERATIONS
// =====================================================

export async function getAllServices() {
  try {
    const result = await db
      .select()
      .from(services)
      .where(eq(services.is_active, true))
      .orderBy(sql`COALESCE(${services.service_order}, 999)`)

    return result
  } catch (error) {
    console.error('[v0] Error fetching services:', error)
    return []
  }
}

export async function createService(serviceData: {
  name: string
  description: string
  icon: string
  image_url?: string
  service_order: number
}) {
  try {
    const result = await db
      .insert(services)
      .values(serviceData)
      .returning()

    return result[0]
  } catch (error) {
    console.error('[v0] Error creating service:', error)
    throw error
  }
}

// =====================================================
// ACHIEVEMENTS OPERATIONS
// =====================================================

export async function getAllAchievements() {
  try {
    const result = await db.select().from(achievements)

    return result
  } catch (error) {
    console.error('[v0] Error fetching achievements:', error)
    return []
  }
}

export async function updateAchievement(
  achievementId: number,
  achievementData: {
    metric_value: string
    metric_label: string
  }
) {
  try {
    const result = await db
      .update(achievements)
      .set({
        metric_value: achievementData.metric_value,
        metric_label: achievementData.metric_label,
        updated_at: new Date(),
      })
      .where(eq(achievements.id, achievementId))
      .returning()

    return result[0]
  } catch (error) {
    console.error('[v0] Error updating achievement:', error)
    throw error
  }
}

// =====================================================
// GALLERY OPERATIONS
// =====================================================

export async function getAllGalleryAlbums() {
  try {
    const result = await db
      .select()
      .from(gallery_albums)
      .where(eq(gallery_albums.is_public, true))
      .orderBy(desc(gallery_albums.created_at))

    return result
  } catch (error) {
    console.error('[v0] Error fetching gallery albums:', error)
    return []
  }
}

export async function getGalleryAlbumWithImages(albumId: number) {
  try {
    const album = await db.query.gallery_albums.findFirst({
      where: eq(gallery_albums.id, albumId),
      with: {
        images: {
          orderBy: gallery_images.image_order,
        },
      },
    })

    return album
  } catch (error) {
    console.error('[v0] Error fetching gallery album:', error)
    return null
  }
}

export async function createGalleryAlbum(albumData: {
  name: string
  description: string
  category: string
  cover_image?: string
  created_by: string
}) {
  try {
    const result = await db
      .insert(gallery_albums)
      .values(albumData)
      .returning()

    return result[0]
  } catch (error) {
    console.error('[v0] Error creating gallery album:', error)
    throw error
  }
}

// =====================================================
// TESTIMONIALS OPERATIONS
// =====================================================

export async function getFeaturedTestimonials() {
  try {
    const result = await db
      .select()
      .from(testimonials)
      .where(
        and(
          eq(testimonials.is_featured, true),
          eq(testimonials.is_approved, true)
        )
      )
      .orderBy(desc(testimonials.created_at))

    return result
  } catch (error) {
    console.error('[v0] Error fetching testimonials:', error)
    return []
  }
}

export async function createTestimonial(testimonialData: {
  member_id: number
  title: string
  message: string
  rating: number
  member_role: string
  member_image?: string
}) {
  try {
    const result = await db
      .insert(testimonials)
      .values(testimonialData)
      .returning()

    return result[0]
  } catch (error) {
    console.error('[v0] Error creating testimonial:', error)
    throw error
  }
}

// =====================================================
// PAGE BLOCKS / CMS OPERATIONS
// =====================================================

export async function getPageBlocks(pageType: string) {
  try {
    const result = await db
      .select()
      .from(page_blocks)
      .where(
        and(
          eq(page_blocks.page_type, pageType),
          eq(page_blocks.is_visible, true)
        )
      )
      .orderBy(page_blocks.block_order)

    return result
  } catch (error) {
    console.error('[v0] Error fetching page blocks:', error)
    return []
  }
}

export async function updatePageBlock(blockId: number, blockData: any) {
  try {
    const result = await db
      .update(page_blocks)
      .set({
        ...blockData,
        updated_at: new Date(),
      })
      .where(eq(page_blocks.id, blockId))
      .returning()

    return result[0]
  } catch (error) {
    console.error('[v0] Error updating page block:', error)
    throw error
  }
}

// =====================================================
// EVENTS OPERATIONS (ENHANCED)
// =====================================================

export async function getAllEvents(limit = 100) {
  try {
    const result = await db
      .select()
      .from(events_enhanced)
      .where(eq(events_enhanced.status, 'upcoming'))
      .orderBy(desc(events_enhanced.event_date))
      .limit(limit)

    return result
  } catch (error) {
    console.error('[v0] Error fetching events:', error)
    return []
  }
}

export async function getEventById(eventId: number) {
  try {
    const result = await db.query.events_enhanced.findFirst({
      where: eq(events_enhanced.id, eventId),
      with: {
        speakers: true,
      },
    })

    return result
  } catch (error) {
    console.error('[v0] Error fetching event:', error)
    return null
  }
}

export async function createEvent(eventData: {
  title: string
  description: string
  event_date: Date
  start_time: string
  end_time: string
  location: string
  capacity: number
  event_image?: string
  category: string
  organizer_id: string
}) {
  try {
    const result = await db
      .insert(events_enhanced)
      .values(eventData)
      .returning()

    await Audit.logAction({
      userId: eventData.organizer_id,
      action: 'CREATE',
      resourceType: 'event',
      resourceId: String(result[0].id),
    })

    return result[0]
  } catch (error) {
    console.error('[v0] Error creating event:', error)
    throw error
  }
}

export async function registerForEvent(
  eventId: number,
  userId: string,
  memberId?: number
) {
  try {
    const result = await db
      .insert(event_attendees)
      .values({
        event_id: eventId,
        user_id: userId,
        member_id: memberId,
      })
      .returning()

    // Increment registered count
    await db
      .update(events_enhanced)
      .set({
        registered_count: sql`registered_count + 1`,
      })
      .where(eq(events_enhanced.id, eventId))

    return result[0]
  } catch (error) {
    console.error('[v0] Error registering for event:', error)
    throw error
  }
}

export async function getFeaturedEvents(limit = 5) {
  try {
    const result = await db
      .select()
      .from(events_enhanced)
      .where(
        and(
          eq(events_enhanced.is_featured, true),
          eq(events_enhanced.status, 'upcoming')
        )
      )
      .orderBy(desc(events_enhanced.event_date))
      .limit(limit)

    return result
  } catch (error) {
    console.error('[v0] Error fetching featured events:', error)
    return []
  }
}

// =====================================================
// BOT ANALYTICS OPERATIONS
// =====================================================

export async function getBotCommandStats() {
  try {
    const result = await db.query.bot_commands_analytics.findMany({
      orderBy: desc(bot_commands_analytics.executed_at),
      limit: 100,
    })

    return result
  } catch (error) {
    console.error('[v0] Error fetching bot command stats:', error)
    return []
  }
}

export async function logBotCommand(
  command_name: string,
  telegram_user_id: number,
  success: boolean,
  error_message?: string
) {
  try {
    const result = await db
      .insert(bot_commands_analytics)
      .values({
        command_name,
        telegram_user_id,
        success,
        error_message,
      })
      .returning()

    return result[0]
  } catch (error) {
    console.error('[v0] Error logging bot command:', error)
    return null
  }
}

export const DatabaseOperations = {
  // Statistics
  getCommunityStatistics,
  updateStatistic,
  // Camps
  getAllCamps,
  getCampById,
  createCamp,
  enrollInCamp,
  getCampEnrollments,
  // Announcements
  getAllAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  getFeaturedAnnouncements,
  // Services
  getAllServices,
  createService,
  // Achievements
  getAllAchievements,
  updateAchievement,
  // Gallery
  getAllGalleryAlbums,
  getGalleryAlbumWithImages,
  createGalleryAlbum,
  // Testimonials
  getFeaturedTestimonials,
  createTestimonial,
  // CMS
  getPageBlocks,
  updatePageBlock,
  // Events
  getAllEvents,
  getEventById,
  createEvent,
  registerForEvent,
  getFeaturedEvents,
  // Bot Analytics
  getBotCommandStats,
  logBotCommand,
}
