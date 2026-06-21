'use client'

export function PremiumHeroSection() {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight text-balance">
              Empower Your Community
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Build stronger connections with Kayyoo Koof Association. Join thousands of community leaders
              creating meaningful impact through collaboration and shared purpose.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="px-8 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold rounded-lg transition-colors">
                Get Started
              </button>
              <button className="px-8 py-3 border-2 border-gray-900 hover:bg-gray-50 text-gray-900 font-semibold rounded-lg transition-colors">
                Learn More
              </button>
            </div>
          </div>

          <div className="relative h-96 md:h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 to-yellow-100 rounded-2xl transform rotate-3 shadow-lg" />
            <div className="absolute inset-4 bg-white rounded-2xl shadow-xl p-8 space-y-4">
              <div className="h-48 bg-gradient-to-br from-yellow-200 to-yellow-100 rounded-lg" />
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
