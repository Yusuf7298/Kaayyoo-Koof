import { NextRequest, NextResponse } from 'next/server'
import { DatabaseOperations } from '@/lib/db/operations'
import { auth } from '@/lib/auth'

// GET /api/camps
// Return list of all active camps
export async function GET(request: NextRequest) {
  try {
    const camps = await DatabaseOperations.getAllCamps()

    return NextResponse.json(
      {
        success: true,
        data: camps,
        count: camps.length,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] Error in GET /api/camps:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch camps',
      },
      { status: 500 }
    )
  }
}

// POST /api/camps
// Create a new camp (organizer only)
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
      category,
      start_date,
      end_date,
      location,
      max_participants,
      camp_image,
    } = body

    if (!title || !category || !start_date || !end_date) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: title, category, start_date, end_date',
        },
        { status: 400 }
      )
    }

    const camp = await DatabaseOperations.createCamp({
      title,
      description,
      category,
      start_date: new Date(start_date),
      end_date: new Date(end_date),
      location,
      organizer_id: session.user.id,
      max_participants: max_participants || 100,
      camp_image,
    })

    return NextResponse.json(
      {
        success: true,
        data: camp,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('[v0] Error in POST /api/camps:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create camp',
      },
      { status: 500 }
    )
  }
}
