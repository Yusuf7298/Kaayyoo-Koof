import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { members, telegram_logs } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || ''
const TELEGRAM_BOT_USERNAME = '@KaayyooKoof_bot'

async function logTelegramAction(
  telegramUserId: number,
  telegramUsername: string | undefined,
  action: string,
  status: 'success' | 'error',
  message: string,
  memberId?: number
) {
  try {
    await db.insert(telegram_logs).values({
      telegram_user_id: telegramUserId,
      telegram_username: telegramUsername || null,
      action,
      status,
      message,
      member_id: memberId || null,
    })
  } catch (error) {
    console.error('Failed to log Telegram action:', error)
  }
}

async function sendTelegramMessage(chatId: number, text: string) {
  if (!TELEGRAM_BOT_TOKEN) return
  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text }),
    })
  } catch (error) {
    console.error('Error sending Telegram message:', error)
  }
}

async function handleStart(chatId: number, userId: number, firstName: string, username?: string) {
  const message = `Welcome to Kayyoo Koof Association! 👋\n\nI'm your community bot. Here's what I can help you with:\n\n/register - Register as a member\n/status - Check your membership status\n/events - See upcoming events\n/help - Get help`
  await sendTelegramMessage(chatId, message)
  await logTelegramAction(userId, username, 'start', 'success', 'User started bot')
}

async function handleRegister(chatId: number, userId: number, firstName: string, username?: string) {
  try {
    const existingMember = await db
      .select()
      .from(members)
      .where(eq(members.telegram_id, String(userId)))
      .limit(1)

    if (existingMember.length > 0) {
      const m = existingMember[0]
      const message = `You're already registered! Your status is: ${m.member_status}`
      await sendTelegramMessage(chatId, message)
      await logTelegramAction(userId, username, 'register', 'success', 'Already registered', m.id)
      return
    }

    const result = await db
      .insert(members)
      .values({
        first_name: firstName,
        last_name: '',
        email: `telegram_${userId}@kayyoo.local`,
        userId: `telegram_${userId}`,
        telegram_id: String(userId),
        member_status: 'active',
      })
      .returning()

    const message = `Welcome to Kayyoo Koof, ${firstName}! ✅\n\nYou've been registered as a member.\n\nUse /help for more commands.`
    await sendTelegramMessage(chatId, message)
    await logTelegramAction(userId, username, 'register', 'success', `Registered with ID: ${result[0].id}`, result[0].id)
  } catch (error) {
    console.error('Error registering member:', error)
    const message = 'An error occurred during registration. Please try again.'
    await sendTelegramMessage(chatId, message)
    await logTelegramAction(userId, username, 'register', 'error', String(error))
  }
}

async function handleStatus(chatId: number, userId: number, username?: string) {
  try {
    const member = await db
      .select()
      .from(members)
      .where(eq(members.telegram_id, String(userId)))
      .limit(1)

    if (!member.length) {
      const message = `You're not registered yet. Use /register to join Kayyoo Koof!`
      await sendTelegramMessage(chatId, message)
      return
    }

    const memberData = member[0]
    const joinedDate = new Date(memberData.joined_date).toLocaleDateString()
    const fullName = `${memberData.first_name} ${memberData.last_name}`.trim()
    const message = `📋 Your Membership Status\n\nName: ${fullName}\nStatus: ${memberData.member_status}\nJoined: ${joinedDate}`
    await sendTelegramMessage(chatId, message)
    await logTelegramAction(userId, username, 'status', 'success', `Status checked for member ${memberData.id}`, memberData.id)
  } catch (error) {
    console.error('Error checking status:', error)
    await logTelegramAction(userId, username, 'status', 'error', String(error))
  }
}

async function handleHelp(chatId: number, userId: number, username?: string) {
  const message = `🆘 Help & Commands\n\n/start - Welcome message\n/register - Register as a member\n/status - Check your membership\n/events - See upcoming events\n\nNeed more help? Contact support@kayyoo.local`
  await sendTelegramMessage(chatId, message)
  await logTelegramAction(userId, username, 'help', 'success', 'Help requested')
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const message = body.message

    if (!message) {
      return NextResponse.json({ ok: true })
    }

    const chatId = message.chat.id
    const userId = message.from.id
    const firstName = message.from.first_name
    const username = message.from.username
    const text = message.text

    if (!text) {
      return NextResponse.json({ ok: true })
    }

    const command = text.split(' ')[0].toLowerCase()

    switch (command) {
      case '/start':
        await handleStart(chatId, userId, firstName, username)
        break
      case '/register':
        await handleRegister(chatId, userId, firstName, username)
        break
      case '/status':
        await handleStatus(chatId, userId, username)
        break
      case '/help':
        await handleHelp(chatId, userId, username)
        break
      default:
        await handleHelp(chatId, userId, username)
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 })
  }
}
