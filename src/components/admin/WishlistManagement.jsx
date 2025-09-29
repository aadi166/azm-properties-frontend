import React, { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import apiService from '../../services/api'

const WishlistManagement = () => {
  const navigate = useNavigate()
  const [wishlistItems, setWishlistItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('newest')

  useEffect(() => {
    fetchWishlistItems()
  }, [])

  const fetchWishlistItems = async () => {
    try {
      setLoading(true)
      const response = await apiService.getAdminWishlist()
      if (response.success && response.data) {
        setWishlistItems(response.data)
      }
    } catch (error) {
      console.error('Error fetching wishlist items:', error)
      toast.error('Failed to load wishlist items')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to remove this item from wishlist?')) {
      return
    }

    try {
      await apiService.deleteWishlistItem(itemId)
      setWishlistItems(wishlistItems.filter(item => item._id !== itemId))
      toast.success('Item removed from wishlist')
    } catch (error) {
      console.error('Error removing wishlist item:', error)
      toast.error('Failed to remove item')
    }
  }

  const handleViewProperty = (item) => {
    // Navigate to properties or projects page based on property type
    if (item.propertyType === 'off-plan') {
      navigate('/projects')
    } else {
      navigate('/properties')
    }
  }

  const handleUpdateNote = async (itemId, newNote) => {
    try {
      await apiService.updateWishlistItemNote(itemId, newNote)
      setWishlistItems(wishlistItems.map(item => 
        item._id === itemId ? { ...item, userNote: newNote } : item
      ))
      toast.success('Note updated successfully')
    } catch (error) {
      console.error('Error updating note:', error)
      toast.error('Failed to update note')
    }
  }

  const filteredAndSortedItems = wishlistItems
    .filter(item => 
      item.propertyTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.propertyLocation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.userNote?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt)
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt)
        case 'price-high':
          return (b.propertyPrice || 0) - (a.propertyPrice || 0)
        case 'price-low':
          return (a.propertyPrice || 0) - (b.propertyPrice || 0)
        case 'title':
          return (a.propertyTitle || '').localeCompare(b.propertyTitle || '')
        default:
          return 0
      }
    })

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-black shadow rounded-lg p-6 border border-yellow-400/30">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-yellow-400">Wishlist Management</h2>
            <p className="text-yellow-300/70 mt-1">Manage user wishlists and preferences</p>
          </div>
          <div className="text-yellow-300">
            <span className="text-2xl font-bold">{wishlistItems.length}</span>
            <span className="text-sm ml-1">Total Items</span>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-black shadow rounded-lg p-6 border border-yellow-400/30">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-yellow-300 mb-2">Search</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, location, or note..."
              className="w-full bg-gray-800 border border-yellow-400/30 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-yellow-300 mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-800 border border-yellow-400/30 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price-high">Price: High to Low</option>
              <option value="price-low">Price: Low to High</option>
              <option value="title">Title A-Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Wishlist Items */}
      <div className="bg-black shadow rounded-lg border border-yellow-400/30">
        {filteredAndSortedItems.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-yellow-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-yellow-300 mb-2">No wishlist items found</h3>
            <p className="text-yellow-300/70">
              {searchTerm ? 'Try adjusting your search criteria' : 'Users haven\'t added any properties to their wishlist yet'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-yellow-400/20">
            {filteredAndSortedItems.map((item) => (
              <div key={item._id} className="p-6">
                <div className="flex items-start space-x-4">
                  <img
                    src={item.propertyImage || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'}
                    alt={item.propertyTitle}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-yellow-300">{item.propertyTitle}</h3>
                        <p className="text-yellow-300/70">{item.propertyLocation}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-yellow-400 font-bold">
                            {item.propertyPrice || 'Price TBD'}
                          </span>
                          <span className="px-2 py-1 bg-yellow-400/20 text-yellow-300 rounded text-sm">
                            {item.propertyType}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewProperty(item)}
                          className="p-2 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10 rounded-lg transition-colors"
                          title="View property details"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item._id)}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
                          title="Remove from wishlist"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    {item.userNote && (
                      <div className="mt-3 p-3 bg-gray-800/50 rounded-lg">
                        <p className="text-sm text-yellow-300/80">
                          <span className="font-medium">User Note:</span> {item.userNote}
                        </p>
                      </div>
                    )}
                    
                    <div className="mt-3 text-xs text-yellow-300/60">
                      Added on {new Date(item.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-black shadow rounded-lg p-6 border border-yellow-400/30">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-400/20 text-yellow-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-yellow-300/70">Total Wishlist Items</p>
              <p className="text-2xl font-semibold text-yellow-300">{wishlistItems.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-black shadow rounded-lg p-6 border border-yellow-400/30">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-400/20 text-blue-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-yellow-300/70">Items with Notes</p>
              <p className="text-2xl font-semibold text-yellow-300">
                {wishlistItems.filter(item => item.userNote && item.userNote.trim()).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-black shadow rounded-lg p-6 border border-yellow-400/30">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-400/20 text-green-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-yellow-300/70">Most Popular Type</p>
              <p className="text-2xl font-semibold text-yellow-300">
                {wishlistItems.length > 0 
                  ? (() => {
                      const typeCount = wishlistItems.reduce((acc, item) => {
                        const type = item.propertyType || 'Unknown'
                        acc[type] = (acc[type] || 0) + 1
                        return acc
                      }, {})
                      const entries = Object.entries(typeCount)
                      return entries.sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'
                    })()
                  : 'N/A'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WishlistManagement