'use client'
import React from 'react'
interface AchievementProps {
  number: string
  label: string
  description: string
}

const AchievementCard: React.FC<AchievementProps> = ({ number, label, description }) => (
  <div className="text-center animate-scale-in hover:shadow-lg transition-all p-6 rounded-lg">
    <div className="text-5xl font-bold text-primary mb-2">{number}</div>
    <h3 className="text-xl font-bold text-foreground mb-2">{label}</h3>
    <p className="text-muted-foreground text-sm">{description}</p>
  </div>
)

export default function AchievementsSection() {
  const achievements = [
    {
      number: '1,250+',
      label: 'Active Members',
      description: 'Growing community of engaged and committed individuals',
    },
    {
      number: '48',
      label: 'Events Hosted',
      description: 'Diverse programs and activities throughout the year',
    },
    {
      number: '3,500+',
      label: 'Community Hours',
      description: 'Volunteer and community service hours contributed',
    },
    {
      number: '$20K+',
      label: 'Funds Raised',
      description: 'Resources mobilized for community development projects',
    },
    {
      number: '89%',
      label: 'Member Satisfaction',
      description: 'Positive feedback from community members',
    },
    {
      number: '20+',
      label: 'Projects Completed',
      description: 'Successful community development initiatives',
    },
  ]

  return (
    <section className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl font-bold text-foreground mb-4">Our Achievements</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Celebrating the milestones and accomplishments of our Kayyoo Koof community
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {achievements.map((achievement, index) => (
            <div key={index} style={{ animationDelay: `${index * 0.1}s` }} className="stagger-1">
              <AchievementCard {...achievement} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
