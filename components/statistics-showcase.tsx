'use client'

import { useState, useEffect } from 'react'

interface Statistic {
  metric_name: string
  metric_value: string
  metric_type: string
}

function animateValue(
  element: HTMLElement,
  start: number,
  end: number,
  duration: number = 2000
) {
  let startTimestamp: number | null = null
  const step = (timestamp: number) => {
    if (!startTimestamp) startTimestamp = timestamp
    const progress = Math.min((timestamp - startTimestamp) / duration, 1)

    const value = Math.floor(progress * (end - start) + start)
    element.textContent = value.toLocaleString()

    if (progress < 1) {
      window.requestAnimationFrame(step)
    }
  }
  window.requestAnimationFrame(step)
}

export function StatisticCard({
  metric_name,
  metric_value,
  metric_type,
}: Statistic) {
  const numericValue = parseInt(metric_value.replace(/\D/g, ''), 10) || 0
  const displayValue = metric_value

  const getLabel = (name: string) => {
    const labels: Record<string, string> = {
      active_members: 'Active Members',
      events_hosted: 'Events Hosted',
      volunteer_hours: 'Volunteer Hours',
      funds_raised: 'Funds Raised',
    }
    return labels[name] || name
  }

  const getIcon = (name: string) => {
    const icons: Record<string, string> = {
      active_members: '👥',
      events_hosted: '📅',
      volunteer_hours: '⏱️',
      funds_raised: '💰',
    }
    return icons[name] || '📊'
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-yellow-400 text-center hover:shadow-lg transition-shadow">
      <div className="text-4xl mb-2">{getIcon(metric_name)}</div>
      <div
        className="text-3xl font-bold text-gray-800 mb-2"
        data-stat-value={numericValue}
      >
        {displayValue}
      </div>
      <p className="text-gray-600 font-medium">{getLabel(metric_name)}</p>
    </div>
  )
}

interface StatisticsShowcaseProps {
  stats?: Statistic[]
  isLoading?: boolean
  columns?: 1 | 2 | 3 | 4
}

export function StatisticsShowcase({
  stats = [],
  isLoading = false,
  columns = 4,
}: StatisticsShowcaseProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }

  if (isLoading) {
    return (
      <div className={`grid ${gridCols[columns]} gap-6`}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-gray-200 rounded-lg h-32 animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className={`grid ${gridCols[columns]} gap-6`}>
      {stats.map((stat) => (
        <StatisticCard key={stat.metric_name} {...stat} />
      ))}
    </div>
  )
}
