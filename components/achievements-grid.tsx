'use client'

interface Achievement {
  id: number
  title: string
  description: string
  metric_value: string
  metric_label: string
  achievement_icon?: string
}

export function AchievementCard({ achievement }: { achievement: Achievement }) {
  return (
    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg shadow-md p-6 text-center border-2 border-yellow-300 hover:shadow-lg transition-shadow">
      <div className="text-5xl mb-3">
        {achievement.achievement_icon || '🏆'}
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mb-1">
        {achievement.metric_value}
      </h3>
      <p className="text-gray-700 font-semibold mb-3">{achievement.metric_label}</p>
      <p className="text-gray-600 text-sm">{achievement.description}</p>
    </div>
  )
}

interface AchievementsGridProps {
  achievements?: Achievement[]
  isLoading?: boolean
  columns?: 2 | 3 | 4 | 5
}

export function AchievementsGrid({
  achievements = [],
  isLoading = false,
  columns = 4,
}: AchievementsGridProps) {
  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-5',
  }

  if (isLoading) {
    return (
      <div className={`grid ${gridCols[columns]} gap-6`}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-gray-200 rounded-lg h-40 animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className={`grid ${gridCols[columns]} gap-6`}>
      {achievements.map((achievement) => (
        <AchievementCard key={achievement.id} achievement={achievement} />
      ))}
    </div>
  )
}
