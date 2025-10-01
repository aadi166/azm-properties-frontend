import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import apiService from '../services/api'

const Properties = () => {
  const [filter, setFilter] = useState('all')
  const [viewMode, setViewMode] = useState('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [locationFilter, setLocationFilter] = useState('all')
  const [projectFilter, setProjectFilter] = useState('all')
  const [bedroomsFilter, setBedroomsFilter] = useState('all')
  const [bathroomsFilter, setBathroomsFilter] = useState('all')
  const [priceRange, setPriceRange] = useState('all')
  const [constructionStatusFilter, setConstructionStatusFilter] = useState('all') // New Construction Status filter
  const [statusFilter, setStatusFilter] = useState('all') // Ready Secondary / Offplan Secondary / all
  const [offerTypeFilter, setOfferTypeFilter] = useState('all')
  const [sortBy, setSortBy] = useState('default')
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0)
  const propertiesPerPage = 9
  // Wishlist state
  const [wishlistItems, setWishlistItems] = useState(new Set())
  const [selectedPropertyForNote, setSelectedPropertyForNote] = useState(null)
  const [userNote, setUserNote] = useState('')
  const [showNoteModal, setShowNoteModal] = useState(false)


  // Remove duplicate properties based on title and location
  const removeDuplicateProperties = (properties) => {
    const seen = new Set()
    return properties.filter(property => {
      const key = `${property.title}-${property.location}-${property.bedrooms}`
      if (seen.has(key)) {
        return false
      }
      seen.add(key)
      return true
    })
  }

  const openPropertyDetail = (property) => {
    setSelectedProperty(property)
    setIsModalOpen(true)
  }

  const closePropertyDetail = () => {
    setSelectedProperty(null)
    setIsModalOpen(false)
  }

  const handleLike = async (e, property) => {
    e.stopPropagation()
    const isLiked = wishlistItems.has(property._id)
    
    if (isLiked) {
      // Remove from wishlist
      try {
        await apiService.removeFromWishlist(property._id)
        setWishlistItems(prev => {
          const newSet = new Set(prev)
          newSet.delete(property._id)
          return newSet
        })
        toast.success('Removed from wishlist')
      } catch (error) {
        console.error('Error removing from wishlist:', error)
        toast.error('Failed to remove from wishlist')
      }
    } else {
      // Show note modal before adding to wishlist
      setSelectedPropertyForNote(property)
      setShowNoteModal(true)
    }
  }

  const handleAddToWishlistWithNote = async () => {
    try {
      setShowNoteModal(false)
      await apiService.addToWishlist(selectedPropertyForNote._id, userNote)
      setWishlistItems(prev => new Set([...prev, selectedPropertyForNote._id]))
      setSelectedPropertyForNote(null)
      setUserNote('')
      toast.success('Added to wishlist!')
    } catch (error) {
      console.error('Error adding to wishlist:', error)
      toast.error('Failed to add to wishlist')
    }
  }

  const loadWishlistStatus = async () => {
    try {
      const response = await apiService.getWishlist()
      if (response.success) {
        const wishlistPropertyIds = new Set(response.data.map(item => item.propertyId))
        setWishlistItems(wishlistPropertyIds)
      }
    } catch (error) {
      console.error('Error loading wishlist:', error)
    }
  }

  const handleShare = (e, property) => {
    e.stopPropagation()
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `Check out this amazing property: ${property.title}`,
        url: window.location.href
      })
    } else {
      // Fallback for browsers that don't support Web Share API
      const shareText = `Check out this amazing property: ${property.title} - ${window.location.href}`
      navigator.clipboard.writeText(shareText).then(() => {
        alert('Property link copied to clipboard!')
      })
    }
  }

  // Fetch properties from API
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        console.log('🏠 Properties component: Starting to fetch properties...')
        setLoading(true)
        setError(null)
        
        // Fetch local static data
        const response = await apiService.getProperties()
        console.log('📡 Properties component: API response:', response)
        
        let allProperties = []
        
        // Process local data
        if (response.success) {
          allProperties = [...(response.data || [])]
          console.log('✅ Properties component: Processed properties:', allProperties)
          console.log('📊 Properties component: Count:', allProperties.length)
        } else {
          console.log('❌ Properties component: API response not successful')
        }
        
        // Remove duplicates and set properties
        const uniqueProperties = removeDuplicateProperties(allProperties)
        console.log('🔄 Properties component: After removing duplicates:', uniqueProperties)
        console.log('📈 Properties component: Final count:', uniqueProperties.length)
        setProperties(uniqueProperties)
        
        if (allProperties.length === 0) {
          setError('No properties found')
        }
      } catch (err) {
        console.error('Error fetching properties:', err)
        setError('Failed to connect to server')
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
    loadWishlistStatus()
  }, [])

  // Properties data will be fetched from API

  const filteredProperties = Array.isArray(properties) ? properties.filter(property => {
    // Only show exclusive properties on this page
    const exclusiveMatch = property.category === 'exclusive'
    const typeMatch = filter === 'all' || property.category === filter
    const locationMatch = locationFilter === 'all' || property.location === locationFilter
    const projectMatch = projectFilter === 'all' || (property.projectName && property.projectName === projectFilter)
    const bedroomsMatch = bedroomsFilter === 'all' || property.bedrooms === parseInt(bedroomsFilter)
    const bathroomsMatch = bathroomsFilter === 'all' || property.bathrooms === parseInt(bathroomsFilter)
    const constructionStatusMatch = constructionStatusFilter === 'all' || property.constructionStatus === constructionStatusFilter
    const offerTypeMatch = offerTypeFilter === 'all' || property.offerType === offerTypeFilter
    // Price range matching (assumes property.price is numeric)
    let priceNumeric = 0
    if (property.price && typeof property.price === 'number') priceNumeric = property.price
    else if (property.price && typeof property.price === 'string') {
      const parsed = property.price.replace(/[^0-9.-]+/g, '')
      priceNumeric = parsed ? Number(parsed) : 0
    }
    let priceMatch = true
    if (priceRange === 'under-2m') {
      priceMatch = priceNumeric > 0 ? priceNumeric < 2000000 : true
    } else if (priceRange === '2m-5m') {
      priceMatch = priceNumeric > 0 ? (priceNumeric >= 2000000 && priceNumeric <= 5000000) : true
    } else if (priceRange === '5m-10m') {
      priceMatch = priceNumeric > 0 ? (priceNumeric >= 5000000 && priceNumeric <= 10000000) : true
    } else if (priceRange === 'over-10m') {
      priceMatch = priceNumeric > 0 ? priceNumeric > 10000000 : true
    }

    // Status matching for Secondary Market (best-effort mapping)
    let statusMatch = true
    if (statusFilter === 'ready-secondary') {
      statusMatch = (property.constructionStatus && property.constructionStatus.toLowerCase().includes('ready')) || (property.category && property.category.toLowerCase() === 'exclusive') || (property.status && property.status.toLowerCase().includes('ready'))
    } else if (statusFilter === 'offplan-secondary') {
      statusMatch = (property.category && property.category.toLowerCase() === 'off-plan') || (property.constructionStatus && property.constructionStatus.toLowerCase().includes('off')) || (property.status && property.status.toLowerCase().includes('off'))
    }
    
    const searchMatch = searchQuery === '' || 
      (property.projectName && property.projectName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(searchQuery.toLowerCase())
    
    return exclusiveMatch && typeMatch && locationMatch && projectMatch && bedroomsMatch && bathroomsMatch && constructionStatusMatch && offerTypeMatch && searchMatch && priceMatch && statusMatch
  }) : []

  // Apply sorting to filtered properties
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    switch (sortBy) {
      case 'price-low-high':
        return a.price - b.price
      case 'price-high-low':
        return b.price - a.price
      case 'bedrooms-low-high':
        return a.bedrooms - b.bedrooms
      case 'bedrooms-high-low':
        return b.bedrooms - a.bedrooms
      case 'size-low-high':
        return (a.area || 0) - (b.area || 0)
      case 'size-high-low':
        return (b.area || 0) - (a.area || 0)
      default:
        return 0
    }
  })

  const uniqueLocations = [...new Set(Array.isArray(properties) ? properties.map(property => property.location) : [])]
  const uniqueProjects = [...new Set(Array.isArray(properties) ? properties.map(property => property.projectName) : [])]

  // Pagination logic
  const totalPages = Math.ceil(sortedProperties.length / propertiesPerPage)
  const startIndex = currentPage * propertiesPerPage
  const endIndex = startIndex + propertiesPerPage
  const currentProperties = sortedProperties.slice(startIndex, endIndex)

  // Navigation functions
  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  const resetFilters = () => {
    setFilter('all')
    setSearchQuery('')
    setLocationFilter('all')
    setProjectFilter('all')
    setBedroomsFilter('all')
    setBathroomsFilter('all')
    setOfferTypeFilter('all')
    setConstructionStatusFilter('all')
    setSortBy('default')
    setCurrentPage(0)
  }

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(0)
  }, [filter, searchQuery, locationFilter, projectFilter, bedroomsFilter, bathroomsFilter, constructionStatusFilter, offerTypeFilter, sortBy])

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-dark-900">
      {/* Hero Header */}
      <section className="relative py-32 bg-gradient-to-r from-dark-900 via-luxury-900 to-dark-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-luxury-600/20 to-gold-600/20"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80)'
          }}
        ></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <span className="inline-block text-gold-400 font-medium tracking-wider uppercase text-sm mb-4 animate-fade-in">
            Exclusive Collection
          </span>
          <h1 className="text-6xl md:text-7xl font-bold mb-6 font-serif animate-slide-up">
            <span className="bg-gradient-to-r from-white via-gold-200 to-white bg-clip-text text-transparent">
              Luxury Properties
            </span>
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed text-gray-300 animate-slide-up" style={{animationDelay: '0.2s'}}>
            Discover Dubai's most prestigious properties in the world's most exclusive locations
          </p>
        </div>
      </section>

      {/* Advanced filters hidden per request (logic still available in code) */}

      {/* Properties Grid/List */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 border-4 border-gold-200 border-t-gold-500 rounded-full animate-spin mx-auto mb-8"></div>
              <h3 className="text-2xl font-bold text-white mb-4 font-serif">Loading Properties...</h3>
              <p className="text-gray-300">Please wait while we fetch the latest luxury properties for you.</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div className="w-32 h-32 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-8">
                <svg className="w-16 h-16 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-white mb-4 font-serif">Error Loading Properties</h3>
              <p className="text-xl text-gray-300 mb-8 max-w-md mx-auto">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="btn-primary btn-lg"
              >
                Retry
              </button>
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-32 h-32 bg-gradient-to-br from-luxury-100 to-gold-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <svg className="w-16 h-16 text-luxury-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-white mb-4 font-serif">No Properties Found</h3>
              <p className="text-xl text-gray-300 mb-8 max-w-md mx-auto">Adjust your search criteria to discover more luxury properties.</p>
              <button 
                onClick={() => { setFilter('all'); }}
                className="btn-primary btn-lg"
              >
                View All Properties
              </button>
            </div>
          ) : (
            <div className="bg-black shadow rounded-lg overflow-hidden border border-yellow-400/30">
              <div className="px-6 py-4 border-b border-yellow-400/30">
                <h3 className="text-lg font-medium text-green-400">Properties ({filteredProperties.length})</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-yellow-400/30">
                  <thead className="bg-gray-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">Property</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">Details</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">Created</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-yellow-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-black divide-y divide-yellow-400/30">
                    {currentProperties.map((property) => (
                      <tr key={property._id || property.id} className="hover:bg-gray-800">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center">
                              {property.image ? (
                                <div title={typeof property.image === 'string' ? property.image : ''} className="px-2 py-1 rounded-lg bg-gray-700 text-xs text-yellow-300 max-w-full truncate">{typeof property.image === 'string' ? property.image.split('/').pop() : 'Uploaded'}</div>
                              ) : (
                                <div className="h-10 w-10 rounded-lg bg-gray-700 flex items-center justify-center"><span className="text-yellow-400 text-xs">No Image</span></div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-yellow-300 max-w-xs truncate">{property.title}</div>
                              <div className="text-sm text-yellow-300/70 max-w-xs truncate">{property.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap"><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${property.type === 'off-plan' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>{property.type === 'off-plan' ? 'Off-Plan' : 'Exclusive'}</span></td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-yellow-300">{property.price ? new Intl.NumberFormat('en-AE',{style:'currency',currency:'AED',minimumFractionDigits:0}).format(property.price) : 'N/A'}</div>
                          {property.roi && <div className="text-sm text-green-400">ROI: {property.roi}%</div>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-yellow-300">{property.location}</div></td>
                        <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-yellow-300">{property.bedrooms && `${property.bedrooms} bed`}{property.bedrooms && property.bathrooms && ' • '}{property.bathrooms && `${property.bathrooms} bath`}{property.area && <div className="text-sm text-yellow-300/70">{Number(property.area).toLocaleString()} sq ft</div>}</div></td>
                        <td className="px-6 py-4 whitespace-nowrap"><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${property.status === 'available' ? 'bg-green-100 text-green-800' : property.status === 'sold' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>{(property.status || 'Unknown').charAt(0).toUpperCase() + (property.status || '').slice(1)}</span></td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-300/70">{property.createdAt ? new Date(property.createdAt).toLocaleDateString() : 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button onClick={() => openPropertyDetail(property)} className="text-yellow-400 hover:text-yellow-300 transition-colors flex items-center space-x-1 mr-3"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg><span>View</span></button>
                            <button onClick={(e) => { e.stopPropagation(); handleLike(e, property); }} className={`text-red-400 hover:text-red-300 transition-colors flex items-center space-x-1`}><svg className="w-4 h-4" fill={wishlistItems.has(property._id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg><span>{wishlistItems.has(property._id) ? 'Saved' : 'Save'}</span></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Pagination Navigation */}
          {filteredProperties.length > propertiesPerPage && (
            <div className="flex justify-center items-center mt-12 gap-4">
              <button
                onClick={prevPage}
                disabled={currentPage === 0}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  currentPage === 0
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-luxury-600 to-gold-500 text-white hover:from-luxury-700 hover:to-gold-600 transform hover:-translate-y-1 shadow-lg hover:shadow-gold/25'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>

              <div className="flex items-center gap-2">
                <span className="text-white font-medium">
                  Page {currentPage + 1} of {totalPages}
                </span>
                <span className="text-gray-400 text-sm">
                  ({filteredProperties.length} properties)
                </span>
              </div>

              <button
                onClick={nextPage}
                disabled={currentPage >= totalPages - 1}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  currentPage >= totalPages - 1
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-luxury-600 to-gold-500 text-white hover:from-luxury-700 hover:to-gold-600 transform hover:-translate-y-1 shadow-lg hover:shadow-gold/25'
                }`}
              >
                Next
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA removed as requested */}

      {/* Property Detail Modal */}
      {isModalOpen && selectedProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-dark-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gold-500/20">
            <div className="relative">
              <button
                onClick={closePropertyDetail}
                className="fixed top-8 right-8 z-50 w-12 h-12 bg-dark-700/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-300 hover:text-white transition-colors border border-gold-500/20 shadow-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              {/* Use placeholder panel when selected item is a project or has no images */}
              {(selectedProperty.category !== 'off-plan' && (selectedProperty.images && selectedProperty.images[0] || selectedProperty.image)) ? (
                <img
                  src={selectedProperty.images && selectedProperty.images[0] ? selectedProperty.images[0] : selectedProperty.image}
                  alt={selectedProperty.title}
                  className="w-full h-80 object-cover"
                />
              ) : (
                <div className="w-full h-80 flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-gold-400">
                  <div className="text-center p-4">
                    <h3 className="text-xl font-semibold">{selectedProperty.title}</h3>
                    <p className="text-gray-300">{selectedProperty.location}</p>
                  </div>
                </div>
              )}
              
              <div className="absolute bottom-6 left-6">
                <span className="bg-dark-800/80 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium capitalize">
                  {selectedProperty.type}
                </span>
              </div>
              
              {selectedProperty.badge && (
                <div className="absolute top-6 left-6">
                  <span className="bg-gradient-to-r from-luxury-600 to-gold-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                    {selectedProperty.badge}
                  </span>
                </div>
              )}
            </div>
            
            <div className="p-8">
              <div className="mb-6">
                <span className="text-gold-400 text-sm font-medium tracking-wider uppercase">
                  {selectedProperty.location}
                </span>
                <h2 className="text-4xl font-bold text-white mb-4 font-serif">
                  {selectedProperty.title}
                </h2>
                <div className="text-4xl font-bold text-gold-400 font-serif mb-6">
                  {selectedProperty.priceFormatted || `AED ${selectedProperty.price?.toLocaleString()}`}
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="text-center p-4 bg-gradient-to-br from-dark-700 to-dark-600 rounded-xl border border-gold-500/20">
                  <div className="text-2xl font-bold text-white">{selectedProperty.bedrooms}</div>
                  <div className="text-sm text-gray-300">Bedrooms</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-dark-700 to-dark-600 rounded-xl border border-gold-500/20">
                  <div className="text-2xl font-bold text-white">{selectedProperty.bathrooms}</div>
                  <div className="text-sm text-gray-300">Bathrooms</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-dark-700 to-dark-600 rounded-xl border border-gold-500/20">
                  <div className="text-2xl font-bold text-white">{selectedProperty.areaFormatted || selectedProperty.area}</div>
                  <div className="text-sm text-gray-300">Area</div>
                </div>
              </div>
              
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-4 font-serif">Property Description</h3>
                <p className="text-gray-300 leading-relaxed mb-4">{selectedProperty.description}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h4 className="text-xl font-bold text-white mb-4">Property Details</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Year Built:</span>
                      <span className="font-medium text-white">{selectedProperty.yearBuilt || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Property Type:</span>
                      <span className="font-medium text-white">{selectedProperty.type || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Furnishing:</span>
                      <span className="font-medium text-white">{selectedProperty.furnished ? 'Furnished' : 'Unfurnished'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Status:</span>
                      <span className="font-medium text-white">{selectedProperty.status || 'Available'}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-xl font-bold text-white mb-4">Contact Agent</h4>
                  <div className="bg-gradient-to-br from-dark-700 to-dark-600 p-6 rounded-xl border border-gold-500/20">
                    <div className="text-lg font-bold text-white mb-2">AMZ Properties Agent</div>
                    <div className="space-y-2">
                      <a href="tel:+971-4-123-4567" className="flex items-center text-gold-400 hover:text-gold-300">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                        +971 4 123 4567
                      </a>
                      <a href="mailto:info@amzproperties.ae" className="flex items-center text-gold-400 hover:text-gold-300">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                        info@amzproperties.ae
                      </a>
                    </div>
                    <button className="btn-primary w-full mt-4">
                      Contact Agent
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xl font-bold text-white mb-4">Features</h4>
                  <ul className="space-y-2">
                    {selectedProperty.features && selectedProperty.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-gray-300">
                        <svg className="w-4 h-4 mr-2 text-gold-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-xl font-bold text-white mb-4">Property Information</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Featured:</span>
                      <span className="font-medium text-white">{selectedProperty.featured ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Created:</span>
                      <span className="font-medium text-white">{selectedProperty.createdAt ? new Date(selectedProperty.createdAt).toLocaleDateString() : 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Coordinates:</span>
                      <span className="font-medium text-white">{selectedProperty.coordinates ? `${selectedProperty.coordinates.lat}, ${selectedProperty.coordinates.lng}` : 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
)}

      {/* Note Modal for Wishlist */}
      {showNoteModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-dark-800 border border-gold-500/20 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-6">Add to Wishlist</h3>
              <p className="text-gray-300 mb-6">
                Add a personal note to remember why you love this property
              </p>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Personal Note (Optional)
              </label>
              <textarea
                value={userNote}
                onChange={(e) => setUserNote(e.target.value)}
                placeholder="e.g., Perfect location for family, great investment opportunity..."
                className="w-full px-4 py-3 bg-dark-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 resize-none"
                rows="3"
                maxLength="200"
              />
              <div className="text-right text-sm text-gray-400 mt-1">
                {userNote.length}/200
              </div>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowNoteModal(false)
                  setSelectedPropertyForNote(null)
                  setUserNote('')
                }}
                className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddToWishlistWithNote}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white rounded-xl font-medium transition-all transform hover:scale-105"
              >
                Add to Wishlist
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Properties