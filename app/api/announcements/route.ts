import { NextRequest, NextResponse } from 'next/server'
import { DatabaseOperations } from '@/lib/db/operations'
import { auth } from '@/lib/auth'

// GET /api/announcements
// Return list of all published announcements
export async function GET(request: NextRequest) {
  try {
    const announcements = await DatabaseOperations.getAllAnnouncements()

    return NextResponse.json(
      {
        success: true,
        data: announcements,
        count: announcements.length,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] Error in GET /api/announcements:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch announcements',
      },
      { status: 500 }
    )
  }
}

// POST /api/announcements
// Create a new announcement (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
        },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      title,
      content,
      category_id,
      is_pinned,
      is_featured,
      announcement_image,
      expiration_date,
    } = body

    if (!title || !content) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: title, content',
        },
        { status: 400 }
      )
    }

    const announcement = await DatabaseOperations.createAnnouncement({
      title,
      content,
      author_id: session.user.id,
      category_id,
      is_pinned: is_pinned || false,
      is_featured: is_featured || false,
      announcement_image,
      expiration_date: expiration_date ? new Date(expiration_date) : undefined,
    })

    return NextResponse.json(
      {
        success: true,
        data: announcement,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('[v0] Error in POST /api/announcements:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create announcement',
      },
      { status: 500 }
    )
  }
}
