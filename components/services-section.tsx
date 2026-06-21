'use client'

import React from 'react'

interface ServiceItemProps {
  icon: string
  title: string
  description: string
}

const ServiceItem: React.FC<ServiceItemProps> = ({ icon, title, description }) => (
  <div className="bg-white rounded-lg p-8 hover:shadow-lg transition-shadow duration-300 animate-fade-in-up border border-border">
    <div className="text-5xl mb-4">{icon}</div>
    <h3 className="text-xl font-bold text-foreground mb-3">{title}</h3>
    <p className="text-muted-foreground leading-relaxed">{description}</p>
  </div>
)

export default function ServicesSection() {
  const services = [
    {
      icon: '🤝',
      title: 'Community Support',
      description: 'We provide mentorship, guidance, and support to help members achieve their goals and develop their potential within our community.',
    },
    {
      icon: '📚',
      title: 'Skill Development',
      description: 'Access workshops, training programs, and resources to develop professional and personal skills that matter.',
    },
    {
      icon: '🌍',
      title: 'Social Impact',
      description: 'Participate in community projects that create meaningful change and contribute to a better society.',
    },
    {
      icon: '💼',
      title: 'Networking',
      description: 'Connect with like-minded individuals and build relationships that can lead to collaborations and opportunities.',
    },
    {
      icon: '🎯',
      title: 'Goal Achievement',
      description: 'Work with our team to identify, plan, and accomplish your personal and professional objectives.',
    },
    {
      icon: '🎊',
      title: 'Events & Gatherings',
      description: 'Enjoy regular events, celebrations, and gatherings that strengthen our community bonds.',
    },
  ]

  return (
    <section className="py-20 bg-muted">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl font-bold text-foreground mb-4">Our Services</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover how Kayyoo Koof supports your journey with comprehensive services designed for community members
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} style={{ animationDelay: `${index * 0.1}s` }} className="stagger-1">
              <ServiceItem {...service} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
