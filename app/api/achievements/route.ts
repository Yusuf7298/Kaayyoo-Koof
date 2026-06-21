import { NextRequest, NextResponse } from 'next/server'
import { DatabaseOperations } from '@/lib/db/operations'

// GET /api/achievements
// Return list of all achievements
export async function GET(request: NextRequest) {
  try {
    const achievements = await DatabaseOperations.getAllAchievements()

    return NextResponse.json(
      {
        success: true,
        data: achievements,
        count: achievements.length,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] Error in GET /api/achievements:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch achievements',
      },
      { status: 500 }
    )
  }
}
