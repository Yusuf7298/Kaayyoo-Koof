'use client'

import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react'

interface UpcomingEvent {
  id: number
  title: string
  date: string
  time: string
  location: string
  attendees: number
  description: string
  image: string
  category: string
}

export function UpcomingEventsSection() {
  const upcomingEvents: UpcomingEvent[] = [
    {
      id: 1,
      title: 'Community Leadership Summit',
      date: 'February 15, 2026',
      time: '2:00 PM - 5:00 PM',
      location: 'Kayyoo Hub, Lagos',
      attendees: 150,
      description: 'Join us for an inspiring summit featuring industry leaders sharing insights on community building.',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop',
      category: 'Leadership',
    },
    {
      id: 2,
      title: 'Youth Empowerment Workshop',
      date: 'February 22, 2026',
      time: '10:00 AM - 1:00 PM',
      location: 'Community Center',
      attendees: 100,
      description: 'Skill-building workshop designed for young professionals to develop leadership and entrepreneurship skills.',
      image: 'https://images.unsplash.com/photo-1517457373614-b7152f800fd1?w=500&h=300&fit=crop',
      category: 'Workshop',
    },
    {
      id: 3,
      title: 'Volunteer Appreciation Night',
      date: 'March 5, 2026',
      time: '6:00 PM - 9:00 PM',
      location: 'Kayyoo Hub, Lagos',
      attendees: 200,
      description: 'An evening to celebrate and appreciate our amazing volunteers and their contributions to the community.',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop',
      category: 'Celebration',
    },
    {
      id: 4,
      title: 'Monthly Community Meetup',
      date: 'March 12, 2026',
      time: '5:00 PM - 7:00 PM',
      location: 'Virtual & In-Person',
      attendees: 75,
      description: 'Connect with community members, share experiences, and discuss upcoming initiatives.',
      image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=500&h=300&fit=crop',
      category: 'Networking',
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="mb-12 text-center animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground text-balance">
            Upcoming Events
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Be part of our exciting events and connect with our vibrant community. Register now to secure your spot!
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {upcomingEvents.map((event, idx) => (
            <div
              key={event.id}
              className="animate-fade-in-up hover-lift bg-card rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-border"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {/* Event Image */}
              <div className="relative h-48 overflow-hidden bg-muted group">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Category Badge */}
                <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                  {event.category}
                </div>
              </div>

              {/* Event Details */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-3">{event.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{event.description}</p>

                {/* Event Meta Information */}
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Calendar size={18} className="text-primary flex-shrink-0" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Calendar size={18} className="text-primary flex-shrink-0" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <MapPin size={18} className="text-primary flex-shrink-0" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Users size={18} className="text-primary flex-shrink-0" />
                    <span>{event.attendees} expected attendees</span>
                  </div>
                </div>

                {/* Register Button */}
                <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2 group">
                  Register Now
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Events CTA */}
        <div className="text-center animate-fade-in-up">
          <button className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-8 rounded-lg transition-all duration-300 hover:shadow-lg">
            View All Events
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </section>
  )
}
