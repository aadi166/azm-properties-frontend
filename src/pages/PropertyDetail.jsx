import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import apiService from '../services/api'

const PropertyDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isInWishlist, setIsInWishlist] = useState(false)

  useEffect(() => {
    fetchProperty()
    checkWishlistStatus()
  }, [id])

  const fetchProperty = async () => {
    try {
      setLoading(true)
      const response = await apiService.getPropertyById(id)
      if (response.success && response.data) {
        setProperty(response.data)
      } else {
        setError('Property not found')
      }
    } catch (error) {
      console.error('Error fetching property:', error)
      setError('Failed to load property details')
    } finally {
      setLoading(false)
    }
  }

  const checkWishlistStatus = async () => {
    try {
      const response = await apiService.checkWishlistStatus(id)
      setIsInWishlist(response.success && response.data?.inWishlist)
    } catch (error) {
      console.error('Error checking wishlist status:', error)
    }
  }

  const handleWishlistToggle = async () => {
    try {
      if (isInWishlist) {
        await apiService.removeFromWishlist(id)
        setIsInWishlist(false)
        toast.success('Removed from wishlist')
      } else {
        await apiService.addToWishlist(id)
        setIsInWishlist(true)
        toast.success('Added to wishlist')
      }
    } catch (error) {
      console.error('Error updating wishlist:', error)
      toast.error('Failed to update wishlist')
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `Check out this amazing property: ${property.title}`,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => {
        toast.success('Property link copied to clipboard!')
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gold-400 mx-auto mb-4"></div>
          <p className="text-gold-300 text-xl">Loading property details...</p>
        </div>
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-dark-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-400 mb-4">Property Not Found</h1>
          <p className="text-gray-300 mb-8">{error || 'The property you are looking for does not exist.'}</p>
          <button
            onClick={() => navigate('/properties')}
            className="btn-primary"
          >
            Back to Properties
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-dark-900">
      {/* Hero Section */}
      <section className="relative h-screen">
        <div className="absolute inset-0">
          {/* If this is a project/off-plan without reliable images, show a placeholder panel */}
          {property.category === 'off-plan' || !property.image ? (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-gold-400">
              <div className="text-center p-8">
                <h2 className="text-3xl font-bold">{property.title}</h2>
                <p className="text-gray-300 mt-2">{property.projectName || property.location}</p>
              </div>
            </div>
          ) : (
            <>
              <img
                src={property.image}
                alt={property.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
            </>
          )}
        </div>
        
        <div className="relative z-10 container mx-auto px-4 h-full flex items-end pb-20">
          <div className="max-w-4xl">
            <div className="mb-6">
              <span className="inline-block px-4 py-2 bg-gold-500/20 text-gold-300 rounded-full text-sm font-medium mb-4">
                {property.type === 'exclusive' ? 'Exclusive Property' : 'Off-Plan Property'}
              </span>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 font-serif">
                {property.title}
              </h1>
              <p className="text-xl text-gold-300 mb-6">{property.location}</p>
              <div className="text-4xl md:text-5xl font-bold text-gold-400 font-serif">
                AED {property.price?.toLocaleString()}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleWishlistToggle}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  isInWishlist
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-gradient-to-r from-luxury-600 to-gold-500 text-white hover:from-luxury-700 hover:to-gold-600'
                }`}
              >
                <svg className="w-5 h-5" fill={isInWishlist ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </button>
              
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl font-medium hover:bg-white/20 transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                Share
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Property Details */}
      <section className="py-20 bg-black/95">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Details */}
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-br from-dark-800 to-dark-700 rounded-2xl p-8 border border-gold-500/20 mb-8">
                <h2 className="text-3xl font-bold text-gold-300 mb-6 font-serif">Property Details</h2>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                  <div className="text-center p-4 bg-gradient-to-br from-dark-700 to-dark-600 rounded-xl border border-gold-500/20">
                    <div className="text-2xl font-bold text-white">{property.bedrooms || 'N/A'}</div>
                    <div className="text-sm text-gray-300">Bedrooms</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-dark-700 to-dark-600 rounded-xl border border-gold-500/20">
                    <div className="text-2xl font-bold text-white">{property.bathrooms || 'N/A'}</div>
                    <div className="text-sm text-gray-300">Bathrooms</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-dark-700 to-dark-600 rounded-xl border border-gold-500/20">
                    <div className="text-2xl font-bold text-white">{property.area ? `${property.area} sq ft` : 'N/A'}</div>
                    <div className="text-sm text-gray-300">Area</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-dark-700 to-dark-600 rounded-xl border border-gold-500/20">
                    <div className="text-2xl font-bold text-white">{property.projectName || 'N/A'}</div>
                    <div className="text-sm text-gray-300">Project</div>
                  </div>
                </div>

                {property.description && (
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gold-300 mb-4">Description</h3>
                    <p className="text-gray-300 leading-relaxed">{property.description}</p>
                  </div>
                )}

                {property.amenities && property.amenities.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold text-gold-300 mb-4">Amenities</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {property.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center gap-3 text-gray-300">
                          <svg className="w-5 h-5 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {amenity}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-dark-800 to-dark-700 rounded-2xl p-8 border border-gold-500/20 sticky top-8">
                <h3 className="text-2xl font-bold text-gold-300 mb-6 font-serif">Contact Agent</h3>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-gray-300">
                    <svg className="w-5 h-5 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>+971 4 123 4567</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <svg className="w-5 h-5 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>info@amzproperties.ae</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <button
                      onClick={() => navigate('/contact')}
                      className="w-full btn-primary"
                    >
                      Contact Agent
                    </button>
                  <button
                    onClick={() => window.open('tel:+971-4-123-4567')}
                    className="w-full btn-ghost"
                  >
                    Call Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Back to Properties */}
      <section className="py-12 bg-black/90">
        <div className="container mx-auto px-4 text-center">
          <button
            onClick={() => navigate('/properties')}
            className="inline-flex items-center gap-2 text-gold-300 hover:text-gold-400 transition-colors duration-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Properties
          </button>
        </div>
      </section>
    </div>
  )
}

export default PropertyDetail