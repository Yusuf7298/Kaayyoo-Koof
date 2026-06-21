import Link from 'next/link'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { EventCard } from '@/components/event-card'
import { fallbackEvents } from '@/lib/events'

export const dynamic = 'force-dynamic'

// Static fallback events — shown when DB is not yet set up
const STATIC_EVENTS = [
  {
    id: 1,
    title: 'Summer Camp 2026',
    description:'An immersive multi-day outdoor camp designed to build resilience, teamwork, and leadership in young community members through hands-on activities, workshops, and nature challenges.',
    image: '/comm/kayy1.jpg',
    date: new Date('2026-07-06'),
    time: '8:00 AM – 5:00 PM',
    location: 'Kaayyoo Koof Tranning Center(Abosto, Bekera R-429) ',
    maxAttendees: 80,
    currentAttendees: 62,
    tag: 'Summery Camp',
  },
 {
  id: 2,
  title: 'Wada ',
  description: 'A structured Wada Cup program pairing experienced professionals with young, aspiring leaders. Gain guidance, build networks, and fast-track your personal and career growth.',
  image: '/comm/kayy2.jpg',
  date: 'Ongoing',
  time: '10:00 AM – 12:00 PM',
  location: 'Kaayyoo Koof Training Center (Abosto, Bekera R-429)',
  maxAttendees: 50,
  currentAttendees: 27,
  tag: 'Networking Young',
},
  {
    id: 3,
    title: 'Live Sessions',
    description:'Monthly live interactive sessions featuring guest speakers, open Q&A panels, skill-building workshops, and community discussions on topics that matter most to our members.',
    image: '/comm/kayy3.jpg',
    date: new Date('2026-07-08'),
    time: '9:00 PM – 10:30 PM',
    location: 'Online & Community Center',
    maxAttendees: 150,
    currentAttendees: 89,
    tag: 'Telegram Live',
  },
]

export default async function EventsPage() {
  let isLoggedIn = false
  let dbEvents: any[] = []

  try {
    const session = await auth.api.getSession({ headers: await headers() })
    isLoggedIn = !!session?.user
  } catch {
    // auth not critical for public events page
  }

  try {
    const { getUpcomingEvents } = await import('@/app/actions/members')
    dbEvents = await getUpcomingEvents()
  } catch {
    // DB not ready — fall back to static events below
  }

  // Merge:Cup prefer DB events if available, else show static
  const events = dbEvents.length > 0
    ? dbEvents.map((e) => ({
      id: e.id,
      title: e.title,
      description: e.description ?? '',
      image: e.event_image ?? '/kayyoo1.jpg',
      date: e.event_date,
      time: e.event_date
        ? new Date(e.event_date).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        })
        : 'TBD',
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
