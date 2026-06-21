'use client'

interface Service {
  id: number
  name: string
  description: string
  icon: string
  image_url?: string
}

export function ServiceCard({ service }: { service: Service }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg hover:scale-105 transition-all">
      <div className="text-5xl mb-4">{service.icon}</div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">{service.name}</h3>
      <p className="text-gray-600">{service.description}</p>
    </div>
  )
}

interface ServicesGridProps {
  services?: Service[]
  isLoading?: boolean
  columns?: 2 | 3 | 4 | 6
}

export function ServicesGrid({
  services = [],
  isLoading = false,
  columns = 6,
}: ServicesGridProps) {
  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    6: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
  }

  if (isLoading) {
    return (
      <div className={`grid ${gridCols[columns]} gap-4`}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-gray-200 rounded-lg h-32 animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className={`grid ${gridCols[columns]} gap-4`}>
      {services.map((service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  )
}
