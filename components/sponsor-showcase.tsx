'use client'

export function SponsorShowcase() {
  const sponsors = [
    { name: 'Tech Partner A', logo: '🏢', tier: 'Gold' },
    { name: 'Community Leader B', logo: '🌟', tier: 'Silver' },
    { name: 'Local Business C', logo: '🏪', tier: 'Bronze' },
    { name: 'Innovation Hub D', logo: '🚀', tier: 'Gold' },
    { name: 'Support Org E', logo: '❤️', tier: 'Silver' },
    { name: 'Partner F', logo: '🤝', tier: 'Bronze' },
  ]

  const tiers = {
    Gold: 'bg-yellow-100 border-yellow-300',
    Silver: 'bg-gray-100 border-gray-300',
    Bronze: 'bg-orange-100 border-orange-300',
  }

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Sponsors</h2>
          <p className="text-lg text-gray-600">Supporting community excellence</p>
        </div>

        <div className="space-y-12">
          {['Gold', 'Silver', 'Bronze'].map((tier) => (
            <div key={tier}>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 capitalize">{tier} Sponsors</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {sponsors
                  .filter((s) => s.tier === tier)
                  .map((sponsor) => (
                    <div
                      key={sponsor.name}
                      className={`p-8 rounded-lg border-2 flex flex-col items-center justify-center space-y-4 hover:shadow-lg transition-shadow ${tiers[tier as keyof typeof tiers]}`}
                    >
                      <div className="text-5xl">{sponsor.logo}</div>
                      <h4 className="font-semibold text-gray-900 text-center">{sponsor.name}</h4>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4">Interested in partnering with us?</p>
          <button className="px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold rounded-lg transition-colors">
            Become a Sponsor
          </button>
        </div>
      </div>
    </section>
  )
}
