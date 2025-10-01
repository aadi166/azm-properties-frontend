import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import apiService from '../services/api'

const TrustedDevelopers = () => {
  const navigate = useNavigate()
  const [developers, setDevelopers] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedDev, setSelectedDev] = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        if (typeof apiService.getDevelopers === 'function') {
          const res = await apiService.getDevelopers()
          let list = []
          if (res && res.success && Array.isArray(res.data)) list = res.data
          else if (Array.isArray(res)) list = res
          else if (res && Array.isArray(res.data?.items)) list = res.data.items
          setDevelopers(list)
        }
      } catch (err) {
        console.error('Failed to load developers', err)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const handleDeveloperClick = (developer) => {
    // open modal/profile pop-off
    setSelectedDev(developer)
  }

  const closeModal = () => setSelectedDev(null)

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
          {loading ? (
            <div className="col-span-full text-center text-gray-400">Loading developers...</div>
          ) : developers.length === 0 ? (
            <div className="col-span-full text-center text-gray-400">No developers found</div>
          ) : (
            developers.map((developer, index) => (
              <div
                key={developer._id || developer.id || index}
                className="group relative cursor-pointer"
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => handleDeveloperClick(developer)}
              >
                {/* Developer Card */}
                <div className="relative bg-gradient-to-br from-white/6 to-white/3 backdrop-blur-sm border border-gold-500/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-4 h-full transition-all duration-500 hover:border-gold-400/40 hover:bg-gradient-to-br hover:from-gold-500/10 hover:to-gold-400/5 hover:scale-105 hover:shadow-2xl hover:shadow-gold-500/20 cursor-pointer">

                  {/* Logo Container or placeholder */}
                  <div className="relative mb-3 sm:mb-4 lg:mb-3">
                    <div className="w-full h-14 sm:h-16 md:h-18 lg:h-14 flex items-center justify-center bg-white/95 rounded-lg sm:rounded-xl p-2 sm:p-3 group-hover:bg-white transition-all duration-300">
                      {developer.logo ? (
                        <img src={developer.logo} alt={developer.name} className="max-w-full max-h-full object-contain filter group-hover:scale-110 transition-all duration-300" loading="lazy" />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center text-gray-700 font-semibold">{(developer.name || 'D').charAt(0)}</div>
                      )}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-gold-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-lg sm:rounded-xl"></div>
                  </div>

                  <div className="text-center">
                    <h3 className="text-white font-bold text-xs sm:text-sm md:text-base lg:text-sm mb-1 sm:mb-2 group-hover:text-gold-400 transition-colors duration-300 leading-tight">{developer.name}</h3>
                    <p className="text-gray-400 text-xs sm:text-sm lg:text-xs leading-relaxed opacity-0 sm:opacity-0 md:group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 hidden sm:block">{developer.description}</p>

                    <div className="mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <span className="text-gold-400 text-xs font-medium border border-gold-400/50 px-2 py-1 rounded-full bg-gold-400/10">View Profile</span>
                    </div>
                  </div>

                  <div className="absolute top-2 right-2 w-2 h-2 sm:w-3 sm:h-3 border-t-2 border-r-2 border-gold-400/30 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                  <div className="absolute bottom-2 left-2 w-2 h-2 sm:w-3 sm:h-3 border-b-2 border-l-2 border-gold-400/30 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                </div>
              </div>
            ))
          )}
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

      {/* Developer Profile Modal */}
      {selectedDev && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={closeModal}></div>
          <div className="relative bg-gray-900 rounded-2xl border border-yellow-400/20 max-w-3xl w-full mx-4 p-6 z-10">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold text-white">{selectedDev.name}</h3>
                <p className="text-yellow-300/70 text-sm">{selectedDev.description}</p>
              </div>
              <button onClick={closeModal} className="text-yellow-300 text-sm px-3 py-1">Close</button>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-yellow-300 font-medium mb-2">Overview</h4>
                <p className="text-gray-300 text-sm leading-relaxed">{selectedDev.about || selectedDev.description}</p>

                <div className="mt-3 text-sm text-yellow-100">
                  <div><strong>Established:</strong> {selectedDev.established || selectedDev.established_year || selectedDev.createdAt?.slice(0,4) || 'N/A'}</div>
                  <div className="mt-1"><strong>Total Projects:</strong> {selectedDev.totalProjects || selectedDev.total_projects || selectedDev.totalProjects || 'N/A'}</div>
                  {selectedDev.specialties && <div className="mt-1"><strong>Specialties:</strong> {(selectedDev.specialties || []).join(', ')}</div>}
                </div>
              </div>

              <div>
                <h4 className="text-yellow-300 font-medium mb-2">Contact</h4>
                <div className="text-sm text-yellow-100">
                  {selectedDev.contact?.website && <div><a href={selectedDev.contact.website} target="_blank" rel="noreferrer" className="text-gold-400 underline">Visit Website</a></div>}
                  {selectedDev.contact?.phone && <div className="mt-1">Phone: {selectedDev.contact.phone}</div>}
                  {selectedDev.contact?.email && <div className="mt-1">Email: {selectedDev.contact.email}</div>}
                  {selectedDev.contact?.address && <div className="mt-1">Address: {selectedDev.contact.address.street || selectedDev.contact.address}</div>}
                </div>
              </div>
            </div>

            {selectedDev.projects && selectedDev.projects.length > 0 && (
              <div className="mt-4">
                <h4 className="text-yellow-300 font-medium mb-2">Projects</h4>
                <ul className="list-disc list-inside text-gray-300 text-sm">
                  {selectedDev.projects.map((p, i) => (
                    <li key={i}>{p.name || p.title || p.projectName || 'Untitled Project'}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}

export default TrustedDevelopers