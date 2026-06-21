import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Calendar, Clock, MapPin, Users, ArrowLeft } from 'lucide-react'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { events as eventsTable } from '@/lib/db/schema'
import { fallbackEvents, type DisplayEvent } from '@/lib/events'

export const dynamic = 'force-dynamic'

type EventDetailsPageProps = {
  params: Promise<{ id: string }>
}

async function getEvent(id: number): Promise<DisplayEvent | null> {
  try {
    const rows = await db
      .select()
      .from(eventsTable)
      .where(eq(eventsTable.id, id))
      .limit(1)

    const event = rows[0]
    if (event) {
      return {
        id: event.id,
        title: event.title,
        description: event.description ?? '',
        image: event.event_image ?? '/comm/kayy1.jpg',
        date: event.event_date,
        time: event.event_date
          ? new Date(event.event_date).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          })
          : 'TBD',
        location: event.location ?? 'TBD',
        maxAttendees: event.max_attendees ?? 100,
        currentAttendees: event.current_attendees ?? 0,
        tag: event.status ?? 'Event',
      }
    }
  } catch {
    // Fall back to the local event data when the database is unavailable.
  }

  return fallbackEvents.find((event) => event.id === id) ?? null
}

export default async function EventDetailsPage({ params }: EventDetailsPageProps) {
  const { id } = await params
  const eventId = Number(id)

  if (!Number.isFinite(eventId)) {
    notFound()
  }

  const event = await getEvent(eventId)

  if (!event) {
    notFound()
  }

  const eventDate = new Date(event.date)
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
  const spotsLeft = Math.max(event.maxAttendees - event.currentAttendees, 0)
  const fillPct = Math.min((event.currentAttendees / event.maxAttendees) * 100, 100)

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline mb-6"
        >
          <ArrowLeft size={16} />
          Back to events
        </Link>

        <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="relative h-72 md:h-96 bg-muted">
            <Image
              src={event.image}
              alt={event.title}
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
            <div className="absolute left-5 right-5 bottom-5">
              <span className="inline-flex mb-3 rounded-full bg-primary px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary-foreground">
                {event.tag}
              </span>
              <h1 className="text-3xl md:text-5xl font-bold text-white">{event.title}</h1>
            </div>
          </div>

          <div className="grid gap-8 p-6 md:grid-cols-[1fr_320px] md:p-8">
            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">Event Details</h2>
              <p className="text-muted-foreground leading-7">{event.description}</p>
            </section>

            <aside className="rounded-xl border border-border bg-background p-5">
              <div className="space-y-4 text-sm">
                <div className="flex gap-3">
                  <Calendar className="mt-0.5 text-primary" size={18} />
                  <div>
                    <p className="font-semibold text-foreground">Date</p>
                    <p className="text-muted-foreground">{formattedDate}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Clock className="mt-0.5 text-primary" size={18} />
                  <div>
                    <p className="font-semibold text-foreground">Time</p>
                    <p className="text-muted-foreground">{event.time}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <MapPin className="mt-0.5 text-primary" size={18} />
                  <div>
                    <p className="font-semibold text-foreground">Location</p>
                    <p className="text-muted-foreground">{event.location}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Users className="mt-0.5 text-primary" size={18} />
                  <div className="w-full">
                    <p className="font-semibold text-foreground">Participants</p>
                    <p className="text-muted-foreground">
                      {event.currentAttendees} / {event.maxAttendees} registered
                    </p>
                    <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${fillPct}%` }} />
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">{spotsLeft} spots left</p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </article>
      </div>
    </main>
  )
}

