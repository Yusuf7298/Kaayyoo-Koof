import { NextRequest, NextResponse } from 'next/server'
import { DatabaseOperations } from '@/lib/db/operations'

// GET /api/stats
// Returns all community statistics
export async function GET(request: NextRequest) {
  try {
    const stats = await DatabaseOperations.getCommunityStatistics()

    return NextResponse.json(
      {
        success: true,
        data: stats,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] Error in GET /api/stats:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch statistics',
      },
      { status: 500 }
    )
  }
}

// POST /api/stats
// Update a statistic (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { metric_name, metric_value } = body

    if (!metric_name || !metric_value) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: metric_name, metric_value',
        },
        { status: 400 }
      )
    }

    const result = await DatabaseOperations.updateStatistic(
      metric_name,
      metric_value
    )

    return NextResponse.json(
      {
        success: true,
        data: result,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] Error in POST /api/stats:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update statistics',
      },
      { status: 500 }
    )
  }
}
