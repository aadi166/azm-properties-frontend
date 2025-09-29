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
  const [constructionStatusFilter, setConstructionStatusFilter] = useState('all') // New Construction Status filter
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
    
    const searchMatch = searchQuery === '' || 
      (property.projectName && property.projectName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(searchQuery.toLowerCase())
    
    return exclusiveMatch && typeMatch && locationMatch && projectMatch && bedroomsMatch && bathroomsMatch && constructionStatusMatch && offerTypeMatch && searchMatch
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

      {/* Advanced Filters */}
      <section className="py-8 bg-black/90 backdrop-blur-sm border-b border-gold-500/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-6">
            {/* Search Bar */}
            <div className="relative">
                  <label className="block text-sm font-medium text-gold-400 mb-2">Search by Project Name or Location</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter project name or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 pl-12 bg-dark-800 border border-gold-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-lg text-white placeholder-gray-400"
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            {/* Filter Row */}
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="relative">
                  <label className="block text-xs font-medium text-gold-400 mb-1">Property Type</label>
                  <select 
                    value={filter} 
                    onChange={(e) => setFilter(e.target.value)}
                    className="luxury-select"
                  >
                    <option key="all-types" value="all">All Types</option>
                    <option key="apartment" value="apartment">Apartments</option>
                    <option key="villa" value="villa">Villas</option>
                    <option key="penthouse" value="penthouse">Penthouses</option>
                    <option key="townhouse" value="townhouse">Townhouses</option>
                    <option key="studio" value="studio">Studios</option>
                  </select>
                </div>

                <div className="relative">
                  <label className="block text-xs font-medium text-gold-400 mb-1">Bedrooms</label>
                  <select 
                    value={bedroomsFilter} 
                    onChange={(e) => setBedroomsFilter(e.target.value)}
                    className="luxury-select"
                  >
                    <option key="all-bedrooms" value="all">All Bedrooms</option>
                    <option key="studio-bed" value="0">Studio</option>
                    <option key="1-bed" value="1">1 Bedroom</option>
                    <option key="2-bed" value="2">2 Bedrooms</option>
                    <option key="3-bed" value="3">3 Bedrooms</option>
                    <option key="4-bed" value="4">4 Bedrooms</option>
                    <option key="5-bed" value="5">5+ Bedrooms</option>
                  </select>
                </div>

                <div className="relative">
                  <label className="block text-xs font-medium text-gold-400 mb-1">Bathrooms</label>
                  <select 
                    value={bathroomsFilter} 
                    onChange={(e) => setBathroomsFilter(e.target.value)}
                    className="luxury-select"
                  >
                    <option key="all-bathrooms" value="all">All Bathrooms</option>
                    <option key="1-bath" value="1">1 Bathroom</option>
                    <option key="2-bath" value="2">2 Bathrooms</option>
                    <option key="3-bath" value="3">3 Bathrooms</option>
                    <option key="4-bath" value="4">4 Bathrooms</option>
                    <option key="5-bath" value="5">5+ Bathrooms</option>
                  </select>
                </div>
                
                <div className="relative">
                  <label className="block text-xs font-medium text-gold-400 mb-1">Location</label>
                  <select 
                    value={locationFilter} 
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="luxury-select"
                  >
                    <option key="all-locations" value="all">All Locations</option>
                    {uniqueLocations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>
                
                
                <div className="relative">
                  <label className="block text-xs font-medium text-gold-400 mb-1">Construction Status</label>
                  <select 
                    value={constructionStatusFilter} 
                    onChange={(e) => setConstructionStatusFilter(e.target.value)}
                    className="luxury-select"
                  >
                    <option key="all-construction" value="all">All Status</option>
                    <option key="ready" value="ready">Ready</option>
                    <option key="in-construction" value="in-construction">In Construction</option>
                  </select>
                </div>

                <div className="relative">
                  <label className="block text-xs font-medium text-gold-400 mb-1">Offer Type</label>
                  <select 
                    value={offerTypeFilter} 
                    onChange={(e) => setOfferTypeFilter(e.target.value)}
                    className="luxury-select"
                  >
                    <option key="all-offer" value="all">All Offers</option>
                    <option key="sale" value="Sale">For Sale</option>
                    <option key="rent" value="Rent">For Rent</option>
                  </select>
                </div>

                <div className="relative">
                  <label className="block text-xs font-medium text-gold-400 mb-1">Sort By</label>
                  <select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                    className="luxury-select"
                  >
                    <option value="default">Default</option>
                    <option value="price-low-high">Price: Low to High</option>
                    <option value="price-high-low">Price: High to Low</option>
                    <option value="bedrooms-low-high">Bedrooms: Low to High</option>
                    <option value="bedrooms-high-low">Bedrooms: High to Low</option>
                    <option value="size-low-high">Size: Small to Large</option>
                    <option value="size-high-low">Size: Large to Small</option>
                  </select>
                </div>
                
                <div className="flex items-end">
                  <button 
                    onClick={resetFilters}
                    className="btn-primary text-sm mt-6"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </div>

            {/* Results Summary */}
            <div className="flex justify-between items-center">
              <p className="text-gray-300">
                Showing <span className="text-gold-400 font-semibold">{sortedProperties.length}</span> of{' '}
                <span className="text-gold-400 font-semibold">{properties.length}</span> properties
              </p>
              
              {/* View Mode Toggle */}
              <div className="flex items-center space-x-2">
              <div className="flex bg-dark-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'grid' ? 'bg-gold-500 shadow-sm text-black' : 'text-gray-400 hover:text-gold-400'
                  }`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'list' ? 'bg-gold-500 shadow-sm text-black' : 'text-gray-400 hover:text-gold-400'
                  }`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
            </div>
          </div>
        </div>
      </section>

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
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-8'}>
              {currentProperties.map((property, index) => (
                <div
                  key={property.id}
                  className={`group cursor-pointer transform transition-all duration-500 hover:scale-105 ${
                    viewMode === 'list' ? 'flex bg-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gold-500/20 hover:border-gold-400/40' : 'bg-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gold-500/20 hover:border-gold-400/40'
                  }`}
                  onClick={() => openPropertyDetail(property)}
                >
                  {/* Property Image */}
                  <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-1/3' : 'h-64'}`}>
                    <img
                      src={property.images && property.images[0] ? property.images[0] : property.image}
                      alt={property.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                    
                    {/* Property Type Badge */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      <span className="px-3 py-1 bg-gradient-to-r from-purple-600 to-purple-500 text-white text-xs font-semibold rounded-full">
                        EXCLUSIVE
                      </span>
                      {/* Construction Status Badge */}
                      {property.constructionStatus && (
                        <span className={`px-3 py-1 text-white text-xs font-semibold rounded-full ${
                          property.constructionStatus.toLowerCase() === 'ready' ? 'bg-gradient-to-r from-green-600 to-green-500' :
                          property.constructionStatus.toLowerCase() === 'in-construction' ? 'bg-gradient-to-r from-orange-600 to-orange-500' :
                          'bg-gradient-to-r from-purple-600 to-purple-500'
                        }`}>
                          {property.constructionStatus}
                        </span>
                      )}

                    </div>
                    
                    {/* Action Buttons */}
                    <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={(e) => handleLike(e, property)}
                        className={`p-2 backdrop-blur-sm rounded-full transition-colors ${
                          wishlistItems.has(property._id)
                            ? 'bg-red-500 text-white hover:bg-red-600'
                            : 'bg-black/50 text-white hover:bg-gold-500 hover:text-black'
                        }`}
                      >
                        <svg className="w-4 h-4" fill={wishlistItems.has(property._id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => handleShare(e, property)}
                        className="p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-gold-500 hover:text-black transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                        </svg>
                      </button>
                    </div>

                    {/* Price Badge */}
                    <div className="absolute bottom-4 left-4">
                      <span className="px-4 py-2 bg-gradient-to-r from-gold-600 to-yellow-500 text-black font-bold rounded-full text-sm">
                        {property.price ? `${(property.price / 1000000).toFixed(1)}M AED` : 'Price on Request'}
                      </span>
                    </div>

                  </div>
                  
                  {/* Property Details */}
                  <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-gold-400 transition-colors">
                        {property.title}
                      </h3>
                      <p className="text-gold-400 text-sm font-medium mb-1">
                        {property.projectName}
                      </p>
                      <p className="text-gray-400 text-sm flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {property.location}
                      </p>
                    </div>

                    {/* Property Features */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-gold-400 font-semibold">{property.bedrooms}</div>
                        <div className="text-gray-400 text-xs">Bedrooms</div>
                      </div>
                      <div className="text-center">
                        <div className="text-gold-400 font-semibold">{property.bathrooms}</div>
                        <div className="text-gray-400 text-xs">Bathrooms</div>
                      </div>
                      <div className="text-center">
                        <div className="text-gold-400 font-semibold">{property.area || 'N/A'}</div>
                        <div className="text-gray-400 text-xs">Sq Ft</div>
                      </div>
                    </div>

                    {/* Key Highlights */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {property.completionDate && (
                          <span className="px-2 py-1 bg-gray-800/50 text-gold-400 text-xs rounded-lg border border-gold-500/20">
                            📅 {property.completionDate}
                          </span>
                        )}
                        {property.paymentPlan && (
                          <span className="px-2 py-1 bg-gray-800/50 text-gold-400 text-xs rounded-lg border border-gold-500/20">
                            💳 {property.paymentPlan}
                          </span>
                        )}
                        {property.developer && (
                          <span className="px-2 py-1 bg-gray-800/50 text-gold-400 text-xs rounded-lg border border-gold-500/20">
                            🏗️ {property.developer}
                          </span>
                        )}
                        {property.roi && (
                          <span className="px-2 py-1 bg-gray-800/50 text-green-400 text-xs rounded-lg border border-green-500/20">
                            📈 {property.roi}% ROI
                          </span>
                        )}
                      </div>
                      
                      {/* Key Features */}
                      {property.keyFeatures && property.keyFeatures.length > 0 && (
                        <div className="space-y-1">
                          {property.keyFeatures.slice(0, 3).map((feature, index) => (
                            <div key={index} className="flex items-center text-xs text-gray-300">
                              <span className="w-1 h-1 bg-gold-400 rounded-full mr-2"></span>
                              {feature}
                            </div>
                          ))}
                          {property.keyFeatures.length > 3 && (
                            <div className="text-xs text-gold-400">
                              +{property.keyFeatures.length - 3} more features
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* View Details Button */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        openPropertyDetail(property);
                      }}
                      className="w-full py-3 bg-gradient-to-r from-gold-600 to-yellow-500 text-black font-semibold rounded-xl hover:from-gold-700 hover:to-yellow-600 transition-all duration-300 transform hover:scale-105"
                    >
                      View Property Details
                    </button>
                  </div>
                </div>
              ))}
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

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-dark-900 via-luxury-900 to-dark-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-luxury-600/20 to-gold-600/20"></div>
        <div className="container mx-auto px-4 text-center relative">
          <h2 className="text-5xl font-bold mb-6 font-serif bg-gradient-to-r from-white via-gold-200 to-white bg-clip-text text-transparent">
            Discover Your Dream Property
          </h2>
          <p className="text-xl mb-12 max-w-3xl mx-auto text-gray-300 leading-relaxed">
            Our luxury real estate experts are ready to help you find the perfect property that exceeds your expectations
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/contact" className="btn-primary btn-lg">
              Schedule Consultation
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </Link>
            <a href="tel:+971-4-123-4567" className="btn-ghost btn-lg">
              Call Now: +971 4 123 4567
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </a>
          </div>
        </div>
      </section>

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
              
              <img
                src={selectedProperty.images && selectedProperty.images[0] ? selectedProperty.images[0] : selectedProperty.image}
                alt={selectedProperty.title}
                className="w-full h-80 object-cover"
              />
              
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