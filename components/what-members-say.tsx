'use client'

import Image from 'next/image'
import { Star } from 'lucide-react'

interface MemberMessage {
  id: number
  name: string
  role: string
  message: string
  rating: number
  image: string
  joinDate: string
}

const memberMessages: MemberMessage[] = [
  {
    id: 1,
    name: 'Yusuf Mohammed',
    role: 'Youth Volunteer | Active Members',
    message: 'Kayyoo Koof changed my perspective on community involvement. I came in with just an idea, but the support and mentorship I received helped me launch a successful community initiative. Now I mentor other youth members!',
    rating: 5,
    image: '/we/kayyoo3.jpg',
    joinDate: 'Joined 18 months ago',
  },
  {
    id: 2,
    name: 'Duressa Shigido',
    role: 'Active Member & Coordinator',
    message: 'What impressed me most is the genuine care and commitment. Every member genuinely wants to see each other succeed. The networking opportunities and skill-sharing sessions have been invaluable for my personal and professional growth.',
    rating: 5,
    image: '/we/kayyoo2.jpg',
    joinDate: 'Joined 2 years ago',
  },
  {
    id: 3,
    name: 'Hikma Denbel',
    role: 'Student Member',
    message: 'As a student, I was overwhelmed with life decisions. Kayyoo Koof provided guidance, internship opportunities, and a supportive network. The leadership programs prepared me for real-world challenges. Highly recommend!',
    rating: 5,
    image: '/we/kayyoo5.jpg',
    joinDate: 'Joined 1 year ago',
  },
]

export default function WhatMembersSay() {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-20 animate-fade-in-up">
          <h2 className="text-5xl font-bold text-foreground mb-6">What Members Say</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Real stories from real members who have transformed their lives through community, support, and shared purpose.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {memberMessages.map((member, index) => (
            <div
              key={member.id}
              className="animate-fade-in-up hover:scale-105 transition-transform duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="h-full bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-8 border-t-4 border-primary flex flex-col">
                <div className="flex items-start gap-4 mb-6">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-muted ring-2 ring-primary/20">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-foreground">{member.name}</h3>
                    <p className="text-sm text-primary font-semibold">{member.role}</p>
                    <p className="text-xs text-muted-foreground mt-1">{member.joinDate}</p>
                  </div>
                </div>

                <div className="flex gap-1 mb-4" aria-label={`${member.rating} out of 5 rating`}>
                  {Array.from({ length: member.rating }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className="fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                <p className="text-muted-foreground leading-relaxed flex-1 mb-6 italic">
                  "{member.message}"
                </p>

                <div className="border-t pt-4 flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1" />
                  <p className="text-xs text-muted-foreground">Verified Member</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16 animate-fade-in-up">
          <p className="text-lg text-muted-foreground mb-6">
            Ready to join our thriving community?
          </p>
          <a
            href="#join"
            className="inline-block px-10 py-4 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition font-bold text-lg hover-lift"
          >
            Share Your Story
          </a>
        </div>
      </div>
    </section>
  )
}
