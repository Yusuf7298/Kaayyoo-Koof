'use client'

import React from 'react'

interface ImpactCardProps {
  title: string
  description: string
  icon: string
}

const ImpactCard: React.FC<ImpactCardProps> = ({ title, description, icon }) => (
  <div className="bg-white rounded-lg p-8 border-l-4 border-primary hover:shadow-lg transition-all duration-300 animate-slide-in-left">
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-2xl font-bold text-foreground mb-3">{title}</h3>
    <p className="text-muted-foreground leading-relaxed">{description}</p>
  </div>
)

export default function ImpactSection() {
  const impacts = [
    {
      icon: '💪',
      title: 'Empowerment',
      description: 'We empower members to reach their full potential through education, mentorship, and support systems that foster personal and professional growth.',
    },
    {
      icon: '🤲',
      title: 'Social Responsibility',
      description: 'Our community actively contributes to social development through volunteering and community projects that create lasting positive impact.',
    },
    {
      icon: '🌟',
      title: 'Leadership Development',
      description: 'We nurture the next generation of leaders by providing platforms for skill development, decision-making experience, and community responsibility.',
    },
    {
      icon: '🌱',
      title: 'Sustainable Growth',
      description: 'Kayyoo Koof focuses on long-term community development that creates lasting value and sustainable opportunities for all members.',
    },
  ]

  return (
    <section className="py-20 bg-muted">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl font-bold text-foreground mb-4">Why We Are - Our Impact</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Understanding the core mission and lasting impact of Kayyoo Koof Association on our community
          </p>
        </div>
        <div className="space-y-6">
          {impacts.map((impact, index) => (
            <div key={index} style={{ animationDelay: `${index * 0.1}s` }} className="stagger-1">
              <ImpactCard {...impact} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
