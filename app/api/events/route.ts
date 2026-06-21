import { NextRequest, NextResponse } from 'next/server'
import { DatabaseOperations } from '@/lib/db/operations'
import { auth } from '@/lib/auth'

// GET /api/events
// Return list of all upcoming events
export async function GET(request: NextRequest) {
  try {
    const events = await DatabaseOperations.getAllEvents()

    return NextResponse.json(
      {
        success: true,
        data: events,
        count: events.length,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] Error in GET /api/events:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch events',
      },
      { status: 500 }
    )
  }
}

// POST /api/events
// Create a new event (organizer only)
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
      description,
      event_date,
      start_time,
      end_time,
      location,
      capacity,
      event_image,
      category,
    } = body

    if (!title || !event_date || !location || !capacity) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: title, event_date, location, capacity',
        },
        { status: 400 }
      )
    }

    const event = await DatabaseOperations.createEvent({
      title,
      description,
      event_date: new Date(event_date),
      start_time,
      end_time,
      location,
      capacity: parseInt(capacity),
      event_image,
      category: category || 'workshop',
      organizer_id: session.user.id,
    })

    return NextResponse.json(
      {
        success: true,
        data: event,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('[v0] Error in POST /api/events:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create event',
      },
      { status: 500 }
    )
  }
}
