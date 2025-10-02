import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import apiService from '../services/api'
import { toast } from 'react-hot-toast'
import { useLocation } from 'react-router-dom'

const Properties = () => {
  const [filter, setFilter] = useState('all')
  const [priceRange, setPriceRange] = useState('all')
  const [viewMode, setViewMode] = useState('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [locationFilter, setLocationFilter] = useState('all')
  const [projectFilter, setProjectFilter] = useState('all')
  const [developerFilter, setDeveloperFilter] = useState('all')
  const [bedroomsFilter, setBedroomsFilter] = useState('all')
  const [bathroomsFilter, setBathroomsFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [propertyTypeFilter, setPropertyTypeFilter] = useState('all') // New Property Type filter
  const [constructionStatusFilter, setConstructionStatusFilter] = useState('all') // New Status filter
  const [offerTypeFilter, setOfferTypeFilter] = useState('all')
  const [sortBy, setSortBy] = useState('default')
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [properties, setProperties] = useState([]) // will hold properties from API
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0)
  const propertiesPerPage = 9
  // Wishlist state
  const [wishlistItems, setWishlistItems] = useState(new Set())
  const [showNoteModal, setShowNoteModal] = useState(false)
  const [selectedPropertyForNote, setSelectedPropertyForNote] = useState(null)
  const [userNote, setUserNote] = useState('')



  const openPropertyDetail = (property) => {
    setSelectedProperty(property)
    setIsModalOpen(true)
  }

  const closePropertyDetail = () => {
    setSelectedProperty(null)
    setIsModalOpen(false)
  }

  const handleShare = (e, property) => {
    e.stopPropagation()
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `Check out this property: ${property.title}`,
        url: window.location.href
      })
    } else {
      const shareText = `Check out this property: ${property.title} - ${window.location.href}`
      navigator.clipboard.writeText(shareText).then(() => {
        alert('Property link copied to clipboard!')
      })
    }
  }

  const handleLike = async (e, property) => {
    e.stopPropagation()
    
    const isLiked = wishlistItems.has(property._id)
    
    if (isLiked) {
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
      setSelectedPropertyForNote(property)
      setUserNote('')
      setShowNoteModal(true)
    }
  }

  const handleAddToWishlistWithNote = async () => {
    if (!selectedPropertyForNote) return
    
    try {
      await apiService.addToWishlist(selectedPropertyForNote._id, userNote)
      setWishlistItems(prev => new Set([...prev, selectedPropertyForNote._id]))
      setShowNoteModal(false)
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
      if (response.success && response.data) {
        const wishlistPropertyIds = new Set(response.data.map(item => item.propertyId))
        setWishlistItems(wishlistPropertyIds)
      }
    } catch (error) {
      console.error('Error loading wishlist:', error)
    }
  }

  // Fetch properties from API
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await apiService.getProperties()

        let allProperties = []

        if (Array.isArray(response)) {
          allProperties = response
        } else if (response && Array.isArray(response.data)) {
          allProperties = response.data
        } else if (response && response.success && Array.isArray(response.data)) {
          allProperties = response.data
        } else if (response && response.data && Array.isArray(response.data.items)) {
          allProperties = response.data.items
        } else {
          if (response && typeof response === 'object') {
            const possibleArray = Object.values(response).find(v => Array.isArray(v))
            if (possibleArray) allProperties = possibleArray
          }
        }
        
        if (!allProperties || allProperties.length === 0) {
          try {
            const ls = localStorage.getItem('amz_properties')
            if (ls) {
              const parsed = JSON.parse(ls)
              if (Array.isArray(parsed) && parsed.length > 0) {
                console.warn('Using localStorage amz_properties as fallback for properties')
                allProperties = parsed
              }
            }
          } catch (e) {
            console.warn('Failed to parse amz_properties from localStorage', e)
          }
        }

        const normalized = allProperties.map(p => ({
          _id: p._id || p.id || p.uuid || null,
          title: p.title || p.name || p.projectName || '',
          projectName: p.projectName || p.name || p.title || '',
          price: typeof p.price === 'number' ? p.price : (p.price && Number(p.price)) || (p.priceFrom || p.minPrice) || (p.priceRange && (p.priceRange.min || p.priceRange.max)) || 0,
          location: p.location || p.city || p.address || 'Unknown',
          bedrooms: p.bedrooms || p.units || null,
          bathrooms: p.bathrooms || null,
          area: p.area || p.size || null,
          developer: p.developer || p.projectDeveloper || p.build_by || '',
          category: p.category || p.type || 'off-plan',
          ...p
        }))

        const uniqueProperties = removeDuplicateProperties(normalized)
        setProperties(uniqueProperties)
        
        if (allProperties.length === 0) {
          setError('No properties found')
        }
      } catch (err) {
        console.error('Error fetching properties:', err)

        try {
          const propsResp = await apiService.getProjects()
          if (propsResp && propsResp.success && Array.isArray(propsResp.data)) {
            const fallback = propsResp.data.map(p => ({
              _id: p._id || p.id || null,
              title: p.title || p.name || p.projectName || '',
              projectName: p.projectName || p.name || p.title || '',
              price: typeof p.price === 'number' ? p.price : (p.price && Number(p.price)) || (p.priceFrom || p.minPrice) || (p.priceRange && (p.priceRange.min || p.priceRange.max)) || 0,
              location: p.location || p.city || p.address || 'Unknown',
              bedrooms: p.bedrooms || p.units || null,
              bathrooms: p.bathrooms || null,
              area: p.area || p.size || null,
              developer: p.developer || p.projectDeveloper || p.build_by || '',
              category: p.category || p.type || 'off-plan',
              ...p
            }))

            const uniqueProperties = removeDuplicateProperties(fallback)
            setProperties(uniqueProperties)
            setLoading(false)
            return
          }
        } catch (e) {
          console.warn('Fallback getProjects failed', e)
        }

        try {
          const lsCandidates = ['amz_projects', 'amz_properties']
          for (const key of lsCandidates) {
            const raw = localStorage.getItem(key)
            if (!raw) continue
            const parsed = JSON.parse(raw)
            if (Array.isArray(parsed) && parsed.length > 0) {
              const fallback = parsed.map(p => ({
                _id: p._id || p.id || null,
                title: p.title || p.name || p.projectName || '',
                projectName: p.projectName || p.name || p.title || '',
                price: typeof p.price === 'number' ? p.price : (p.price && Number(p.price)) || (p.priceFrom || p.minPrice) || (p.priceRange && (p.priceRange.min || p.priceRange.max)) || 0,
                location: p.location || p.city || p.address || 'Unknown',
                bedrooms: p.bedrooms || p.units || null,
                bathrooms: p.bathrooms || null,
                area: p.area || p.size || null,
                developer: p.developer || p.projectDeveloper || p.build_by || '',
                category: p.category || p.type || 'off-plan',
                ...p
              }))

              const uniqueProperties = removeDuplicateProperties(fallback)
              setProperties(uniqueProperties)
              setLoading(false)
              return
            }
          }
        } catch (e) {
          console.warn('LocalStorage fallback failed', e)
        }

        setError('Failed to connect to server')
      } finally {
        setLoading(false)
      }
    }

    const removeDuplicateProperties = (properties) => {
      const seen = new Map()
      return properties.filter(property => {
        const key = `${property.title}-${property.location}-${property.bedrooms}-${property.price}`
        if (seen.has(key)) {
          const existing = seen.get(key)
          if (property.keyFeatures?.length > existing.keyFeatures?.length || 
              property.images?.length > existing.images?.length) {
            seen.set(key, property)
            return true
          }
          return false
        }
        seen.set(key, property)
        return true
      })
    }

    fetchProperties()
    loadWishlistStatus()
  }, [])

  const filteredProperties = Array.isArray(properties) ? properties.filter(property => {
    // NOTE: This page should list ALL property categories. A prior off-plan only check
    // (copied from Projects page) hid every item whose category didn't include 'off'.
    // Removed that constraint so general properties display correctly.
    const typeMatch = filter === 'all' || property.category === filter
    const locationMatch = locationFilter === 'all' || property.location === locationFilter
  const projectMatch = projectFilter === 'all' || (property.projectName && property.projectName === projectFilter)
  const developerMatch = developerFilter === 'all' || !developerFilter || (property.developer && property.developer.toLowerCase().includes(developerFilter.toLowerCase())) || (property.projectDeveloper && property.projectDeveloper.toLowerCase().includes(developerFilter.toLowerCase()))
    const bedroomsMatch = bedroomsFilter === 'all' || property.bedrooms === parseInt(bedroomsFilter)
    const bathroomsMatch = bathroomsFilter === 'all' || property.bathrooms === parseInt(bathroomsFilter)
    const statusMatch = statusFilter === 'all' || 
      (statusFilter === 'Ready Secondary' && property.category === 'exclusive') ||
      (statusFilter === 'Offplan Secondary' && property.category === 'off-plan')
    const offerTypeMatch = offerTypeFilter === 'all' || property.offerType === offerTypeFilter
    
    const propertyTypeMatch = propertyTypeFilter === 'all' || 
      (property.propertyType && property.propertyType.toLowerCase() === propertyTypeFilter.toLowerCase())
    const constructionStatusMatch = constructionStatusFilter === 'all' || 
      (property.constructionStatus && property.constructionStatus.toLowerCase() === constructionStatusFilter.toLowerCase()) ||
      (constructionStatusFilter === 'ready' && property.status === 'Ready') ||
      (constructionStatusFilter === 'in-construction' && property.status === 'Under Construction')
    
    const searchMatch = searchQuery === '' || 
      (property.projectName && property.projectName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(searchQuery.toLowerCase())
    
    let priceMatch = true
    
    if (priceRange === 'under-2m') {
      priceMatch = property.price < 2000000
    } else if (priceRange === '2m-5m') {
      priceMatch = property.price >= 2000000 && property.price <= 5000000
    } else if (priceRange === '5m-10m') {
      priceMatch = property.price >= 5000000 && property.price <= 10000000
    } else if (priceRange === 'over-10m') {
      priceMatch = property.price > 10000000
    }
    
    return typeMatch && locationMatch && projectMatch && developerMatch && bedroomsMatch && bathroomsMatch && statusMatch && offerTypeMatch && propertyTypeMatch && constructionStatusMatch && searchMatch && priceMatch
  }) : []

  // Debug aid: if we have raw properties but nothing passes filters, log a hint once.
  if (properties.length > 0 && filteredProperties.length === 0) {
    // eslint-disable-next-line no-console
    console.warn('[Properties] All items filtered out. Current raw count:', properties.length, 'Check active filters.');
  }

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

  const totalPages = Math.ceil(sortedProperties.length / propertiesPerPage)
  const startIndex = currentPage * propertiesPerPage
  const endIndex = startIndex + propertiesPerPage
  const currentProperties = sortedProperties.slice(startIndex, endIndex)

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
    setPriceRange('all')
    setSearchQuery('')
    setLocationFilter('all')
    setProjectFilter('all')
    setBedroomsFilter('all')
    setBathroomsFilter('all')
    setStatusFilter('all')
    setOfferTypeFilter('all')
    setPropertyTypeFilter('all')
    setConstructionStatusFilter('all')
    setSortBy('default')
    setCurrentPage(0)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gold-500 mx-auto mb-4"></div>
          <p className="text-gold-400 text-xl">Loading properties...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-xl mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-3 bg-gold-500 text-black rounded-lg hover:bg-gold-400 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <section className="relative py-32 bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-gold-900/20 opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <span className="text-gold-400 font-medium tracking-wider uppercase text-sm mb-4 block animate-fade-in">Properties</span>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 font-serif animate-slide-up">
              Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-yellow-300">Properties</span>
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed text-gray-300 animate-slide-up" style={{animationDelay: '0.2s'}}>
              Browse all properties managed by our team. Use filters to refine your search.
            </p>
          </div>
        </div>
      </section>

      <section className="py-8 bg-black/90 backdrop-blur-sm border-b border-gold-500/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-6">
            <div className="relative">
              <label className="block text-sm font-medium text-gold-400 mb-2">Search by name or location</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search properties..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 bg-gray-900/50 border border-gold-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-all duration-300 backdrop-blur-sm"
                />
                <svg className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 items-center justify-between">
              <div className="flex flex-wrap gap-3 items-center">
                <div className="relative">
                  <label className="block text-xs font-medium text-gold-400 mb-1">Location</label>
                  <select
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="luxury-select"
                  >
                    <option value="all">All Locations</option>
                    {uniqueLocations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>

                <div className="relative">
                  <label className="block text-xs font-medium text-gold-400 mb-1">Property Type</label>
                  <select
                    value={propertyTypeFilter}
                    onChange={(e) => setPropertyTypeFilter(e.target.value)}
                    className="luxury-select"
                  >
                    <option value="all">All Types</option>
                    <option value="apartment">Apartment</option>
                    <option value="villa">Villa</option>
                    <option value="townhouse">Townhouse</option>
                    <option value="penthouse">Penthouse</option>
                    <option value="studio">Studio</option>
                  </select>
                </div>

                <div className="relative">
                  <label className="block text-xs font-medium text-gold-400 mb-1">Bedrooms</label>
                  <select
                    value={bedroomsFilter}
                    onChange={(e) => setBedroomsFilter(e.target.value)}
                    className="luxury-select"
                  >
                    <option value="all">Any</option>
                    <option value="1">1 BR</option>
                    <option value="2">2 BR</option>
                    <option value="3">3 BR</option>
                    <option value="4">4 BR</option>
                    <option value="5">5+ BR</option>
                  </select>
                </div>

                <div className="relative">
                  <label className="block text-xs font-medium text-gold-400 mb-1">Bathrooms</label>
                  <select
                    value={bathroomsFilter}
                    onChange={(e) => setBathroomsFilter(e.target.value)}
                    className="luxury-select"
                  >
                    <option value="all">Any</option>
                    <option value="1">1 Bath</option>
                    <option value="2">2 Bath</option>
                    <option value="3">3 Bath</option>
                    <option value="4">4 Bath</option>
                    <option value="5">5+ Bath</option>
                  </select>
                </div>

                <div className="relative">
                  <label className="block text-xs font-medium text-gold-400 mb-1">Price Range</label>
                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="luxury-select"
                  >
                    <option value="all">All Prices</option>
                    <option value="under-2m">Under 2M AED</option>
                    <option value="2m-5m">2M - 5M AED</option>
                    <option value="5m-10m">5M - 10M AED</option>
                    <option value="over-10m">Over 10M AED</option>
                  </select>
                </div>

                <div className="relative">
                  <label className="block text-xs font-medium text-gold-400 mb-1">Status</label>
                  <select
                    value={constructionStatusFilter}
                    onChange={(e) => setConstructionStatusFilter(e.target.value)}
                    className="luxury-select"
                  >
                    <option value="all">All Status</option>
                    <option value="ready">Ready</option>
                    <option value="in-construction">In Construction</option>
                    <option value="planning">Planning</option>
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
                    <option value="size-low-high">Size: Low to High</option>
                    <option value="size-high-low">Size: High to Low</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={resetFilters}
                    className="btn-primary text-xs mt-5"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>

            </div>

            <div className="flex justify-between items-center">
              <p className="text-gray-300">
                Showing <span className="text-gold-400 font-semibold">{currentProperties.length}</span> of{' '}
                <span className="text-gold-400 font-semibold">{filteredProperties.length}</span> properties
              </p>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-gold-500 text-black' : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' ? 'bg-gold-500 text-black' : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-black">
        <div className="container mx-auto px-4">
          {currentProperties.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gold-400 to-yellow-300 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">No Properties Found</h3>
              <p className="text-gray-400 mb-8">Try adjusting your filters to see more results</p>
              <button
                onClick={resetFilters}
                className="px-8 py-3 bg-gradient-to-r from-gold-600 to-yellow-500 text-black font-semibold rounded-xl hover:from-gold-700 hover:to-yellow-600 transition-all duration-300 transform hover:scale-105"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-8'}>
              {currentProperties.map((property) => (
                <div
                  key={property._id || property.id}
                  className={`group cursor-pointer transform transition-all duration-500 hover:scale-105 ${
                    viewMode === 'list' ? 'flex bg-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gold-500/20 hover:border-gold-400/40' : 'bg-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gold-500/20 hover:border-gold-400/40'
                  }`}
                  onClick={() => openPropertyDetail(property)}
                >
                  <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-1/3' : 'h-40'}`}>
                    {property.image ? (
                      <img src={property.image} alt={property.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-700 text-gold-400 font-semibold text-lg">
                        {property.title || property.name}
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

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

                    <div className="absolute bottom-4 left-4">
                      <span className="px-4 py-2 bg-gradient-to-r from-gold-600 to-yellow-500 text-black font-bold rounded-full text-sm">
                        {property.price ? `${(property.price / 1000000).toFixed(1)}M AED` : 'Price on Request'}
                      </span>
                    </div>
                  </div>

                  <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-gold-400 transition-colors">
                        {property.title || property.name || property.name}
                      </h3>
                      <p className="text-gold-400 text-sm font-medium mb-1">
                        {property.projectName || property.name || ''}
                      </p>
                      <p className="text-gray-400 text-sm flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {property.location}
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-gold-400 font-semibold">{property.bedrooms || property.units || '-'}</div>
                        <div className="text-gray-400 text-xs">Bedrooms</div>
                      </div>
                      <div className="text-center">
                        <div className="text-gold-400 font-semibold">{property.bathrooms || '-'}</div>
                        <div className="text-gray-400 text-xs">Bathrooms</div>
                      </div>
                      <div className="text-center">
                        <div className="text-gold-400 font-semibold">{property.area || 'N/A'}</div>
                        <div className="text-gray-400 text-xs">Sq Ft</div>
                      </div>
                    </div>

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

                    <button className="w-full py-3 bg-gradient-to-r from-gold-600 to-yellow-500 text-black font-semibold rounded-xl hover:from-gold-700 hover:to-yellow-600 transition-all duration-300 transform hover:scale-105">
                      View Property Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4 mt-16">
              <button
                onClick={prevPage}
                disabled={currentPage === 0}
                className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  currentPage === 0
                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-gold-600 to-yellow-500 text-black hover:from-gold-700 hover:to-yellow-600 transform hover:scale-105'
                }`}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                disabled={currentPage === totalPages - 1}
                className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  currentPage === totalPages - 1
                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-gold-600 to-yellow-500 text-black hover:from-gold-700 hover:to-yellow-600 transform hover:scale-105'
                }`}
              >
                Next
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </section>

      {isModalOpen && selectedProperty && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-dark-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gold-500/20 shadow-2xl">
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
                src={selectedProperty.image || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                alt={selectedProperty.title}
                className="w-full h-80 object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
                }}
              />
              
              <div className="absolute bottom-6 left-6">
                <span className="bg-dark-800/80 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium capitalize">
                  {selectedProperty.type || 'Property'}
                </span>
              </div>
            </div>
            
            <div className="p-8">
              <h2 className="text-3xl font-bold text-white mb-4">{selectedProperty.title}</h2>
              <p className="text-gold-400 text-lg mb-2">{selectedProperty.projectName}</p>
              <p className="text-gray-400 mb-6">{selectedProperty.location}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gold-400">{selectedProperty.bedrooms}</div>
                  <div className="text-gray-400">Bedrooms</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gold-400">{selectedProperty.bathrooms}</div>
                  <div className="text-gray-400">Bathrooms</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gold-400">{selectedProperty.area || 'N/A'}</div>
                  <div className="text-gray-400">Sq Ft</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gold-400">
                    {selectedProperty.price ? `${(selectedProperty.price / 1000000).toFixed(1)}M` : 'TBD'}
                  </div>
                  <div className="text-gray-400">AED</div>
                </div>
              </div>

              {selectedProperty.description && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-white mb-4">Property Description</h3>
                  <p className="text-gray-300 leading-relaxed">{selectedProperty.description}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h4 className="text-xl font-bold text-white mb-4">Property Details</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Type:</span>
                      <span className="font-medium text-white">{selectedProperty.type || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Furnishing:</span>
                      <span className="font-medium text-white">{selectedProperty.furnishing || 'Unfurnished'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Availability:</span>
                      <span className="font-medium text-white">{selectedProperty.availability || 'Available'}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-xl font-bold text-white mb-4">Contact Agent</h4>
                  <div className="bg-dark-700 rounded-xl p-6 border border-gold-500/10">
                    <div className="text-center mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                      </div>
                      <h5 className="font-bold text-white">AMZ Properties Agent</h5>
                      <p className="text-gold-400 text-sm">Licensed Real Estate Agent</p>
                    </div>
                    <div className="space-y-3">
                      <a href="tel:+971-4-123-4567" className="flex items-center text-gold-400 hover:text-gold-300">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                        </svg>
                        +971 4 123 4567
                      </a>
                      <a href="mailto:info@amzproperties.ae" className="flex items-center text-gold-400 hover:text-gold-300">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
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
                {selectedProperty.amenities && selectedProperty.amenities.length > 0 && (
                  <div>
                    <h4 className="text-xl font-bold text-white mb-4">Features</h4>
                    <ul className="space-y-2">
                      {selectedProperty.amenities.map((amenity, index) => (
                        <li key={index} className="flex items-center text-gray-300">
                          <svg className="w-4 h-4 mr-2 text-gold-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {amenity}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
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

      {showNoteModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl p-8 max-w-md w-full border border-gray-800">
            <h3 className="text-2xl font-bold text-white mb-6">Add to Wishlist</h3>
            
            {selectedPropertyForNote && (
              <div className="mb-6">
                <div className="flex items-center space-x-4 mb-4">
                  {(selectedPropertyForNote.category !== 'off-plan' && selectedPropertyForNote.image) ? (
                    <img
                      src={selectedPropertyForNote.image}
                      alt={selectedPropertyForNote.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center text-gold-400 font-semibold">
                      <span className="text-sm">{(selectedPropertyForNote.title || '').slice(0,2).toUpperCase()}</span>
                    </div>
                  )}
                  <div>
                    <h4 className="text-white font-semibold">{selectedPropertyForNote.title}</h4>
                    <p className="text-gray-400 text-sm">{selectedPropertyForNote.location}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="mb-6">
              <label className="block text-white font-medium mb-2">Add a note (optional)</label>
              <textarea
                value={userNote}
                onChange={(e) => setUserNote(e.target.value)}
                placeholder="Why are you interested in this property?"
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gold-500 resize-none"
                rows="3"
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowNoteModal(false)
                  setSelectedPropertyForNote(null)
                  setUserNote('')
                }}
                className="flex-1 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddToWishlistWithNote}
                className="flex-1 py-3 bg-gradient-to-r from-gold-600 to-yellow-500 text-black font-semibold rounded-lg hover:from-gold-700 hover:to-yellow-600 transition-all duration-300"
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