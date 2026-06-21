import { NextRequest, NextResponse } from 'next/server'
import { DatabaseOperations } from '@/lib/db/operations'

// GET /api/analytics/bot
// Return bot command analytics and statistics
export async function GET(request: NextRequest) {
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

    return NextResponse.json(
      {
        success: true,
        data: {
          command_summary: commandSummary,
          health: {
            status: errorRate < 0.05 ? 'healthy' : errorRate < 0.1 ? 'warning' : 'error',
            response_time_ms: 50, // Simulated
            error_rate: errorRate,
            total_commands: totalCommands,
            success_count: totalSuccess,
          },
          recent_errors: stats.filter((s) => !s.success).slice(0, 10),
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] Error in GET /api/analytics/bot:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch bot analytics',
      },
      { status: 500 }
    )
  }
}

// POST /api/analytics/bot
// Log a bot command execution
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { command_name, telegram_user_id, success, error_message } = body

    if (!command_name || !telegram_user_id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: command_name, telegram_user_id',
        },
        { status: 400 }
      )
    }

    const result = await DatabaseOperations.logBotCommand(
      command_name,
      telegram_user_id,
      success !== false,
      error_message
    )

    return NextResponse.json(
      {
        success: true,
        data: result,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('[v0] Error in POST /api/analytics/bot:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to log bot command',
      },
      { status: 500 }
    )
  }
}
