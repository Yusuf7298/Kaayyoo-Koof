'use client'

import React from 'react'

interface MembershipCategoryProps {
  title: string
  icon: string
  requirements: string[]
}

const MembershipCategory: React.FC<MembershipCategoryProps> = ({ title, icon, requirements }) => (
  <div className="bg-white rounded-lg p-8 border border-primary/20 hover:border-primary hover:shadow-lg transition-all duration-300 animate-fade-in-up">
    <div className="text-5xl mb-4">{icon}</div>
    <h3 className="text-2xl font-bold text-foreground mb-4">{title}</h3>
    <ul className="space-y-3">
      {requirements.map((req, i) => (
        <li key={i} className="flex items-start gap-3">
          <span className="text-primary font-bold">✓</span>
          <span className="text-foreground">{req}</span>
        </li>
      ))}
    </ul>
  </div>
)

export default function MembershipSection() {
  const categories = [
    {
      icon: '👤',
      title: 'Individual Members',
      requirements: [
        'Must be at least 18 years old',
        'Committed to community values',
        'Active participation in events',
        'Payment of membership fees',
        'Agreement to code of conduct',
      ],
    },
    {
      icon: '🎓',
      title: 'Student Members',
      requirements: [
        'Currently enrolled in school/university',
        'Valid student ID',
        'Reduced membership fees',
        'Access to student programs',
        'Leadership development opportunities',
      ],
    },
    {
      icon: '🏢',
      title: 'Corporate Partners',
      requirements: [
        'Registered business entity',
        'Interest in community development',
        'Sponsorship opportunities',
        'Brand visibility in events',
        'CSR alignment with our mission',
      ],
    },
    {
      icon: '💝',
      title: 'Benefactors',
      requirements: [
        'Major financial contributors',
        'Long-term commitment to mission',
        'Board recognition and involvement',
        'Exclusive event access',
        'Impact on community projects',
      ],
    },
  ]

  return (
    <section className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl font-bold text-foreground mb-4">Who Can Be Our Member?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Kayyoo Koof welcomes individuals and organizations who share our vision of community development and social impact
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {categories.map((category, index) => (
            <div key={index} style={{ animationDelay: `${index * 0.1}s` }} className="stagger-1">
              <MembershipCategory {...category} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
