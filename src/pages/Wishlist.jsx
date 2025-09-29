import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import apiService from '../services/api'

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingNote, setEditingNote] = useState(null)
  const [noteText, setNoteText] = useState('')

  useEffect(() => {
    fetchWishlistItems()
  }, [])

  const fetchWishlistItems = async () => {
    try {
      setLoading(true)
      const response = await apiService.getWishlist()
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

  const handleRemoveFromWishlist = async (itemId) => {
    if (!window.confirm('Are you sure you want to remove this property from your wishlist?')) {
      return
    }

    try {
      await apiService.removeFromWishlist(itemId)
      setWishlistItems(wishlistItems.filter(item => item._id !== itemId))
      toast.success('Property removed from wishlist')
    } catch (error) {
      console.error('Error removing from wishlist:', error)
      toast.error('Failed to remove property')
    }
  }

  const handleEditNote = (item) => {
    setEditingNote(item._id)
    setNoteText(item.userNote || '')
  }

  const handleSaveNote = async (itemId) => {
    try {
      await apiService.updateWishlistNote(itemId, noteText)
      setWishlistItems(wishlistItems.map(item => 
        item._id === itemId ? { ...item, userNote: noteText } : item
      ))
      setEditingNote(null)
      setNoteText('')
      toast.success('Note updated successfully')
    } catch (error) {
      console.error('Error updating note:', error)
      toast.error('Failed to update note')
    }
  }

  const handleCancelEdit = () => {
    setEditingNote(null)
    setNoteText('')
  }

  const handleShare = (property) => {
    const propertyId = property.propertyId || property._id
    const propertyTitle = property.propertyTitle || property.propertyId?.title || 'Property'
    if (navigator.share) {
      navigator.share({
        title: propertyTitle,
        text: `Check out this amazing property: ${propertyTitle}`,
        url: window.location.origin + `/property/${propertyId}`
      })
    } else {
      const shareText = `Check out this amazing property: ${propertyTitle} - ${window.location.origin}/property/${propertyId}`
      navigator.clipboard.writeText(shareText).then(() => {
        toast.success('Property link copied to clipboard!')
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gold-400 mx-auto mb-4"></div>
          <p className="text-gold-400">Loading your wishlist...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-gradient-to-r from-black via-gray-900 to-black py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gold-400 via-yellow-300 to-gold-400 bg-clip-text text-transparent mb-6">
              My Wishlist
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Your saved properties and dream homes in one place
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {wishlistItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-gold-400 mb-8">
              <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Your wishlist is empty</h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Start exploring our amazing properties and save your favorites to build your dream wishlist.
            </p>
            <Link
              to="/projects"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-gold-600 to-yellow-500 text-black font-semibold rounded-xl hover:from-gold-700 hover:to-yellow-600 transition-all duration-300 transform hover:scale-105"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Explore Properties
            </Link>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="mb-8 sm:mb-12">
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-gold-400/20">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Your Saved Properties</h2>
                    <p className="text-gray-400 text-sm sm:text-base">
                      {wishlistItems.length} {wishlistItems.length === 1 ? 'property' : 'properties'} in your wishlist
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <div className="text-2xl sm:text-3xl font-bold text-gold-400">{wishlistItems.length}</div>
                    <div className="text-sm text-gray-400">Saved</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Wishlist Items */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              {wishlistItems.map((item) => (
                <div key={item._id} className="bg-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gold-400/20 hover:border-gold-400/40 transition-all duration-300 group">
                  {/* Image */}
                  <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
                    <img
                      src={item.propertyImage || item.propertyId?.image || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                      alt={item.propertyTitle || item.propertyId?.title || 'Property'}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    
                    {/* Action Buttons */}
                    <div className="absolute top-4 right-4 flex space-x-2">
                      <button
                        onClick={() => handleShare(item)}
                        className="p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-gold-500 hover:text-black transition-colors"
                        title="Share property"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleRemoveFromWishlist(item._id)}
                        className="p-2 bg-red-500/80 backdrop-blur-sm rounded-full text-white hover:bg-red-600 transition-colors"
                        title="Remove from wishlist"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>

                    {/* Property Type Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-gold-500/90 backdrop-blur-sm text-black text-sm font-semibold rounded-full">
                        {item.propertyType || item.propertyId?.type || 'Property'}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-2">
                      <div className="flex-1">
                        <h3 className="text-lg sm:text-xl font-bold text-white mb-2 line-clamp-2">{item.propertyTitle || item.propertyId?.title || 'Property'}</h3>
                        <p className="text-gray-400 flex items-center text-sm sm:text-base">
                          <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="line-clamp-1">{item.propertyLocation || item.propertyId?.location || 'Location'}</span>
                        </p>
                      </div>
                      <div className="text-left sm:text-right flex-shrink-0">
                        <div className="text-xl sm:text-2xl font-bold text-gold-400">
                          {item.propertyPrice || item.propertyId?.price || 'TBD'}
                        </div>
                        <div className="text-gray-400 text-sm">AED</div>
                      </div>
                    </div>

                    {/* User Note */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-gold-400">Your Note</label>
                        {editingNote !== item._id && (
                          <button
                            onClick={() => handleEditNote(item)}
                            className="text-xs text-gray-400 hover:text-gold-400 transition-colors"
                          >
                            {item.userNote ? 'Edit' : 'Add Note'}
                          </button>
                        )}
                      </div>
                      
                      {editingNote === item._id ? (
                        <div className="space-y-2">
                          <textarea
                            value={noteText}
                            onChange={(e) => setNoteText(e.target.value)}
                            placeholder="Add your thoughts about this property..."
                            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gold-500 resize-none"
                            rows="3"
                          />
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleSaveNote(item._id)}
                              className="px-4 py-2 bg-gold-600 text-black text-sm font-medium rounded-lg hover:bg-gold-700 transition-colors"
                            >
                              Save
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="px-4 py-2 bg-gray-700 text-white text-sm font-medium rounded-lg hover:bg-gray-600 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 bg-gray-800/50 rounded-lg min-h-[60px] flex items-center">
                          <p className="text-gray-300 text-sm">
                            {item.userNote || 'No notes added yet. Click "Add Note" to share your thoughts about this property.'}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Added Date */}
                    <div className="text-xs text-gray-500 mb-4">
                      Added on {new Date(item.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Link
                        to={item.propertyType === 'off-plan' ? '/projects' : '/properties'}
                        className="flex-1 py-3 px-4 bg-gradient-to-r from-gold-600 to-yellow-500 text-black font-semibold rounded-xl hover:from-gold-700 hover:to-yellow-600 transition-all duration-300 text-center text-sm sm:text-base"
                      >
                        View {item.propertyType === 'off-plan' ? 'Projects' : 'Properties'}
                      </Link>
                      <button
                        onClick={() => handleShare(item)}
                        className="sm:px-6 py-3 px-4 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition-colors text-sm sm:text-base"
                      >
                        Share
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Continue Browsing */}
            <div className="text-center mt-16">
              <Link
                to="/projects"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-gold-600 to-yellow-500 text-black font-semibold rounded-xl hover:from-gold-700 hover:to-yellow-600 transition-all duration-300 transform hover:scale-105"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Continue Browsing Properties
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Wishlist