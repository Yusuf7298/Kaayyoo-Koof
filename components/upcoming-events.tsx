'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Clock, MapPin, Users, ArrowRight } from 'lucide-react'

const TELEGRAM_BOT = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || 'KaayyooKoof_bot'

const upcomingEvents = [
  {
    id: 1,
    title: 'Summer Camp 2026',
    date: 'July 08, 2026',
    time: '8:00 AM – 5:00 PM',
    location: 'Kaayyoo Koof Training Center (Abosto, Bekera R-429)',
    attendees: 80,
    description: 'An immersive multi-day outdoor camp designed to build resilience, teamwork, and leadership in young community members through hands-on activities and nature challenges.',
    image: '/comm/kayy1.jpg',
    category: 'Camp',
  },
  {
    id: 2,
    title: 'Wada CUP',
    date: 'Ongoing',
    time: '10:00 AM – 12:00 PM',
    location: 'Sport Field',
    attendees: 40,
    description: 'A structured 4-week mentoring program pairing experienced professionals with young aspiring leaders. Gain guidance, build networks, and fast-track your growth.',
    image: '/comm/kayy2.jpg',
    category: 'Networking Young',
  },
  {
    id: 3,
    title: 'Live Sessions',
    date: 'Weekly Sunday Night',
    time: '9:00 PM – 11:00 PM',
    location: 'Online & Community Center',
    attendees: 150,
    description: 'Weekly live interactive sessions featuring guest speakers, open Q&A panels, skill-building workshops, and community discussions on topics that matter most.',
    image: '/comm/kayy3.jpg',
    category: 'Live',
  },
  {
    id: 4,
    title: 'Hiking',
    date: 'Coming Soon',
    time: '8:00 AM – 6:00 PM',
    location: 'Tour Place',
    attendees: 150,
    description: 'Quarterly outdoor excursions for members to connect with nature, admire scenic landscapes, and bond through challenging yet rewarding trail walks.',
    image: '/comm/kayy4.jpg',
    category: 'Adventure',
  },
  {
    id: 5,
    title: 'Itikaf Programs',
    date: 'Coming Soon',
    time: '8:00 AM – 6:00 PM',
    location: 'Community Mosque / Center',
    attendees: 150,
    description: 'A dedicated spiritual retreat providing members a quiet space for reflection, prayer, community bonding, and spiritual growth.',
    image: '/comm/kayy5.jpg',
    category: 'Spiritual',
  },
  {
    id: 6,
    title: 'Book Review',
    date: 'Coming Soon',
    time: '8:00 AM – 6:00 PM',
    location: 'Kaayyoo Koof Training Center (Abosto, Bekera R-429)',
    attendees: 150,
    description: 'An engaging group discussion focused on exploring impactful literature, sharing perspectives, and fostering a culture of continuous learning and intellectual curiosity.',
    image: '/comm/kayy6.jpg',
    category: 'Education',
  }
];

export function UpcomingEventsSection() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center animate-fade-in-up">
          <span className="inline-block bg-primary/10 text-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            What&apos;s Coming
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Upcoming Events
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Be part of our exciting events and connect with our vibrant community. Join via Telegram to register!
          </p>
        </div>

        {/* Events grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {upcomingEvents.map((event, idx) => (
            <div
              key={event.id}
              className="bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col animate-fade-in-up"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden bg-muted">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  {event.category}
                </span>
              </div>

              {/* Body */}
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-foreground mb-2">{event.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                  {event.description}
                </p>

                <div className="space-y-2 mb-5 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-primary flex-shrink-0" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-primary flex-shrink-0" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-primary flex-shrink-0" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={14} className="text-primary flex-shrink-0" />
                    <span>{event.attendees} spots available</span>
                  </div>
                </div>

                <a
                  href={`https://t.me/${TELEGRAM_BOT}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all duration-200 group"
                >
                  Register via Telegram
                  <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* View all CTA */}
        <div className="text-center animate-fade-in-up">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl border-2 border-primary text-primary font-semibold hover:bg-primary hover:text-primary-foreground transition-all duration-200"
          >
            View All Events
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  )
}
