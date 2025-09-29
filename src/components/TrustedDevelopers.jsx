import React from 'react'
import { useNavigate } from 'react-router-dom'

// Import all developer logos
import EmaarLogo from '../assets/Emaar-Properties-Logo.png'
import DubaiPropertiesLogo from '../assets/Dubai-Properties-Logo.png'
import DamacLogo from '../assets/damac.png'
import SobhaLogo from '../assets/Sobha-Master-Logo-Hi-Res.png'
import MeraasLogo from '../assets/Meraas.png'
import NakheelLogo from '../assets/nakheel.png'

// Import partners data for detailed information
import { partners } from '../data/partners'

const TrustedDevelopers = () => {
  const navigate = useNavigate()
  
  const developers = [
    {
      id: 1,
      partnerId: '1', // Maps to partners data
      name: 'Emaar Properties',
      logo: EmaarLogo,
      description: 'Leading developer of premium lifestyle communities'
    },
    {
      id: 2,
      partnerId: '2', // Maps to partners data
      name: 'Dubai Properties',
      logo: DubaiPropertiesLogo,
      description: 'Iconic developments across Dubai'
    },
    {
      id: 3,
      partnerId: '3', // Maps to partners data
      name: 'DAMAC Properties',
      logo: DamacLogo,
      description: 'Luxury real estate development'
    },
    {
      id: 4,
      partnerId: '4', // Maps to partners data
      name: 'Sobha Realty',
      logo: SobhaLogo,
      description: 'Crafting extraordinary living experiences'
    },
    {
      id: 5,
      partnerId: '5', // Maps to partners data
      name: 'Meraas',
      logo: MeraasLogo,
      description: 'Creating vibrant communities and destinations'
    },
    {
      id: 6,
      partnerId: '6', // Maps to partners data
      name: 'Nakheel',
      logo: NakheelLogo,
      description: 'Shaping Dubai\'s skyline with iconic projects'
    }
  ]

  // Handle developer card click
  const handleDeveloperClick = (partnerId) => {
    navigate(`/partner/${partnerId}`)
  }

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-black via-dark-900 to-black relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gold-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-luxury-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gold-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <span className="inline-block text-gold-400 font-medium tracking-wider uppercase text-xs sm:text-sm mb-3 sm:mb-4 px-3 sm:px-4 py-1.5 sm:py-2 border border-gold-500/30 rounded-full bg-gold-500/10">
            Trusted Partners
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 sm:mb-6 font-serif px-4 sm:px-0">
            Our <span className="text-gold-400">Trusted</span> Developers
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-4 sm:px-6 lg:px-0">
            Partnering with Dubai's most prestigious and renowned developers to deliver exceptional properties and unmatched quality
          </p>
        </div>

        {/* Developers Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 lg:gap-4">
          {developers.map((developer, index) => (
            <div
              key={developer.id}
              className="group relative cursor-pointer"
              style={{
                animationDelay: `${index * 0.1}s`
              }}
              onClick={() => handleDeveloperClick(developer.partnerId)}
            >
              {/* Developer Card */}
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-gold-500/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-4 h-full transition-all duration-500 hover:border-gold-400/40 hover:bg-gradient-to-br hover:from-gold-500/10 hover:to-gold-400/5 hover:scale-105 hover:shadow-2xl hover:shadow-gold-500/20 cursor-pointer">
                
                {/* Logo Container */}
                <div className="relative mb-3 sm:mb-4 lg:mb-3">
                  <div className="w-full h-14 sm:h-16 md:h-18 lg:h-14 flex items-center justify-center bg-white/95 rounded-lg sm:rounded-xl p-2 sm:p-3 group-hover:bg-white transition-all duration-300">
                    <img
                      src={developer.logo}
                      alt={developer.name}
                      className="max-w-full max-h-full object-contain filter group-hover:scale-110 transition-all duration-300"
                      loading="lazy"
                    />
                  </div>
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gold-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-lg sm:rounded-xl"></div>
                </div>

                {/* Developer Info */}
                <div className="text-center">
                  <h3 className="text-white font-bold text-xs sm:text-sm md:text-base lg:text-sm mb-1 sm:mb-2 group-hover:text-gold-400 transition-colors duration-300 leading-tight">
                    {developer.name}
                  </h3>
                  <p className="text-gray-400 text-xs sm:text-sm lg:text-xs leading-relaxed opacity-0 sm:opacity-0 md:group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 hidden sm:block">
                    {developer.description}
                  </p>
                  
                  {/* View Profile Indicator */}
                  <div className="mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <span className="text-gold-400 text-xs font-medium border border-gold-400/50 px-2 py-1 rounded-full bg-gold-400/10">
                      View Profile
                    </span>
                  </div>
                </div>

                {/* Decorative corner elements */}
                <div className="absolute top-2 right-2 w-2 h-2 sm:w-3 sm:h-3 border-t-2 border-r-2 border-gold-400/30 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                <div className="absolute bottom-2 left-2 w-2 h-2 sm:w-3 sm:h-3 border-b-2 border-l-2 border-gold-400/30 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12 sm:mt-16 lg:mt-20 px-4 sm:px-0">
          <p className="text-gray-300 mb-6 sm:mb-8 text-base sm:text-lg max-w-2xl mx-auto">
            Ready to explore premium properties from these trusted developers?
          </p>
          <button className="bg-gradient-to-r from-gold-400 to-gold-600 text-black px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg hover:from-gold-500 hover:to-gold-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl w-full sm:w-auto max-w-xs sm:max-w-none">
            View All Properties
          </button>
        </div>
      </div>
    </section>
  )
}

export default TrustedDevelopers