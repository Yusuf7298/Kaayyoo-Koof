'use server'

import { auth } from '@/lib/auth'
import { DatabaseOperations } from '@/lib/db/operations'
import { headers } from 'next/headers'
import { RBAC } from '@/lib/rbac'

// =====================================================
// STATISTICS ACTIONS
// =====================================================

export async function getStatisticsAction() {
  try {
    return await DatabaseOperations.getCommunityStatistics()
  } catch (error) {
    console.error('[v0] Error getting statistics:', error)
    throw new Error('Failed to fetch statistics')
  }
}

// =====================================================
// CAMPS ACTIONS
// =====================================================

export async function getCampsAction() {
  try {
    return await DatabaseOperations.getAllCamps()
  } catch (error) {
    console.error('[v0] Error getting camps:', error)
    throw new Error('Failed to fetch camps')
  }
}

export async function getCampDetailAction(campId: number) {
  try {
    return await DatabaseOperations.getCampById(campId)
  } catch (error) {
    console.error('[v0] Error getting camp detail:', error)
    throw new Error('Failed to fetch camp details')
  }
}

export async function createCampAction(campData: {
  title: string
  description: string
  category: string
  start_date: Date
  end_date: Date
  location: string
  max_participants: number
  camp_image?: string
}) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session) {
      throw new Error('Unauthorized')
    }

    // Check permission
    const canCreate = await RBAC.hasPermission(session.user.id, 'camps.create')
    if (!canCreate) {
      throw new Error('Permission denied')
    }

    return await DatabaseOperations.createCamp({
      ...campData,
      organizer_id: session.user.id,
    })
  } catch (error) {
    console.error('[v0] Error creating camp:', error)
    throw error
  }
}

export async function enrollInCampAction(campId: number, memberId: number) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session) {
      throw new Error('Unauthorized')
    }

    return await DatabaseOperations.enrollInCamp(
      campId,
      memberId,
      session.user.id
    )
  } catch (error) {
    console.error('[v0] Error enrolling in camp:', error)
    throw error
  }
}

// =====================================================
// ANNOUNCEMENTS ACTIONS
// =====================================================

export async function getAnnouncementsAction() {
  try {
    return await DatabaseOperations.getAllAnnouncements()
  } catch (error) {
    console.error('[v0] Error getting announcements:', error)
    throw new Error('Failed to fetch announcements')
  }
}

export async function getFeaturedAnnouncementsAction() {
  try {
    return await DatabaseOperations.getFeaturedAnnouncements()
  } catch (error) {
    console.error('[v0] Error getting featured announcements:', error)
    throw new Error('Failed to fetch featured announcements')
  }
}

export async function createAnnouncementAction(announcementData: {
  title: string
  content: string
  category_id?: number
  is_pinned?: boolean
  is_featured?: boolean
  announcement_image?: string
  expiration_date?: Date
}) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session) {
      throw new Error('Unauthorized')
    }

    // Check permission
    const canCreate = await RBAC.hasPermission(
      session.user.id,
      'announcements.create'
    )
    if (!canCreate) {
      throw new Error('Permission denied')
    }

    return await DatabaseOperations.createAnnouncement({
      ...announcementData,
      author_id: session.user.id,
    })
  } catch (error) {
    console.error('[v0] Error creating announcement:', error)
    throw error
  }
}

// =====================================================
// SERVICES ACTIONS
// =====================================================

export async function getServicesAction() {
  try {
    return await DatabaseOperations.getAllServices()
  } catch (error) {
    console.error('[v0] Error getting services:', error)
    throw new Error('Failed to fetch services')
  }
}

// =====================================================
// ACHIEVEMENTS ACTIONS
// =====================================================

export async function getAchievementsAction() {
  try {
    return await DatabaseOperations.getAllAchievements()
  } catch (error) {
    console.error('[v0] Error getting achievements:', error)
    throw new Error('Failed to fetch achievements')
  }
}

// =====================================================
// GALLERY ACTIONS
// =====================================================

export async function getGalleryAlbumsAction() {
  try {
    return await DatabaseOperations.getAllGalleryAlbums()
  } catch (error) {
    console.error('[v0] Error getting gallery albums:', error)
    throw new Error('Failed to fetch gallery albums')
  }
}

export async function getGalleryAlbumDetailAction(albumId: number) {
  try {
    return await DatabaseOperations.getGalleryAlbumWithImages(albumId)
  } catch (error) {
    console.error('[v0] Error getting gallery album detail:', error)
    throw new Error('Failed to fetch gallery album details')
  }
}

// =====================================================
// TESTIMONIALS ACTIONS
// =====================================================

export async function getTestimonialsAction() {
  try {
    return await DatabaseOperations.getFeaturedTestimonials()
  } catch (error) {
    console.error('[v0] Error getting testimonials:', error)
    throw new Error('Failed to fetch testimonials')
  }
}

// =====================================================
// PAGE BLOCKS / CMS ACTIONS
// =====================================================

export async function getPageBlocksAction(pageType: string) {
  try {
    return await DatabaseOperations.getPageBlocks(pageType)
  } catch (error) {
    console.error('[v0] Error getting page blocks:', error)
    throw new Error('Failed to fetch page blocks')
  }
}

// =====================================================
// EVENTS ACTIONS
// =====================================================

export async function getEventsAction() {
  try {
    return await DatabaseOperations.getAllEvents()
  } catch (error) {
    console.error('[v0] Error getting events:', error)
    throw new Error('Failed to fetch events')
  }
}

export async function getEventDetailAction(eventId: number) {
  try {
    return await DatabaseOperations.getEventById(eventId)
  } catch (error) {
    console.error('[v0] Error getting event detail:', error)
    throw new Error('Failed to fetch event details')
  }
}

export async function getFeaturedEventsAction() {
  try {
    return await DatabaseOperations.getFeaturedEvents()
  } catch (error) {
    console.error('[v0] Error getting featured events:', error)
    throw new Error('Failed to fetch featured events')
  }
}

export async function createEventAction(eventData: {
  title: string
  description: string
  event_date: Date
  start_time: string
  end_time: string
  location: string
  capacity: number
  event_image?: string
  category: string
}) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session) {
      throw new Error('Unauthorized')
    }

    // Check permission
    const canCreate = await RBAC.hasPermission(session.user.id, 'events.create')
    if (!canCreate) {
      throw new Error('Permission denied')
    }

    return await DatabaseOperations.createEvent({
      ...eventData,
      organizer_id: session.user.id,
    })
  } catch (error) {
    console.error('[v0] Error creating event:', error)
    throw error
  }
}

export async function registerForEventAction(eventId: number) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session) {
      throw new Error('Unauthorized')
    }

    return await DatabaseOperations.registerForEvent(eventId, session.user.id)
  } catch (error) {
    console.error('[v0] Error registering for event:', error)
    throw error
  }
}

// =====================================================
// BOT ANALYTICS ACTIONS
// =====================================================

export async function getBotAnalyticsAction() {
  try {
    const stats = await DatabaseOperations.getBotCommandStats()

    // Process stats for dashboard
    const commandSummary: Record<
      string,
      { count: number; success: number; failure: number }
    > = {}
    let totalSuccess = 0
    let totalFailure = 0

    stats.forEach((stat) => {
      if (!commandSummary[stat.command_name]) {
        commandSummary[stat.command_name] = {
          count: 0,
          success: 0,
          failure: 0,
        }
      }
      commandSummary[stat.command_name].count++
      if (stat.success) {
        commandSummary[stat.command_name].success++
        totalSuccess++
      } else {
        commandSummary[stat.command_name].failure++
        totalFailure++
      }
    })

    const totalCommands = totalSuccess + totalFailure
    const errorRate = totalCommands > 0 ? totalFailure / totalCommands : 0

    return {
      command_summary: commandSummary,
      health: {
        status: errorRate < 0.05 ? 'healthy' : errorRate < 0.1 ? 'warning' : 'error',
        response_time_ms: 50,
        error_rate: errorRate,
        total_commands: totalCommands,
        success_count: totalSuccess,
      },
      recent_errors: stats.filter((s) => !s.success).slice(0, 10),
    }
  } catch (error) {
    console.error('[v0] Error getting bot analytics:', error)
    throw new Error('Failed to fetch bot analytics')
  }
}

export async function logBotCommandAction(
  command_name: string,
  telegram_user_id: number,
  success: boolean,
  error_message?: string
) {
  try {
    return await DatabaseOperations.logBotCommand(
      command_name,
      telegram_user_id,
      success,
      error_message
    )
  } catch (error) {
    console.error('[v0] Error logging bot command:', error)
    throw new Error('Failed to log bot command')
  }
}
