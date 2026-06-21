import Link from 'next/link'
import { EventCard } from '@/components/event-card'
import { fallbackEvents } from '@/lib/events'

export const dynamic = 'force-dynamic'

export default async function EventsPage() {
  let dbEvents: any[] = []

  try {
    const { getUpcomingEvents } = await import('@/app/actions/members')
    dbEvents = await getUpcomingEvents()
  } catch {
    // DB not ready — fall back to static events
  }

  const events = dbEvents.length > 0
    ? dbEvents.map((e) => ({
      id: e.id,
      title: e.title,
      description: e.description ?? '',
      image: e.event_image ?? '/comm/kayy1.jpg',
      date: e.event_date,
      time: new Date(e.event_date).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      location: e.location ?? 'TBD',
      maxAttendees: e.max_attendees ?? 100,
      currentAttendees: e.current_attendees ?? 0,
      tag: 'Event',
    }))
    : fallbackEvents

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <Link href="/" className="text-primary hover:underline mb-4 inline-block text-sm">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-foreground mt-2">Upcoming Events</h1>
          <p className="text-muted-foreground mt-2">
            Join us for community events and be part of something meaningful
          </p>
        </div>
      </div>

      {/* Events Grid */}
      <div className="max-w-6xl mx-auto px-4 py-14">
        {events.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">📅</p>
            <p className="text-xl font-semibold text-foreground mb-2">No upcoming events</p>
            <p className="text-muted-foreground">Check back soon — something exciting is coming!</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event, index) => (
              <EventCard
                key={event.id}
                id={event.id}
                title={event.title}
                description={event.description}
                image={event.image}
                date={event.date}
                time={event.time}
                location={event.location}
                maxAttendees={event.maxAttendees}
                currentAttendees={event.currentAttendees}
                tag={event.tag}
                delay={index * 100}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
