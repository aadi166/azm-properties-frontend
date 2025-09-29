import React, { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import apiService from '../../services/api.js'

const ReviewManagement = () => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [ratingFilter, setRatingFilter] = useState('all')
  const [showEditForm, setShowEditForm] = useState(false)
  const [editingReview, setEditingReview] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    rating: 5,
    title: '',
    message: '',
    status: 'pending'
  })

  // Fetch reviews from API
  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const data = await apiService.getReviews()
      
      if (data.success) {
        setReviews(data.data || [])
      } else {
        console.error('Failed to fetch reviews')
        setReviews(mockReviews)
        toast.error('Failed to load reviews')
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
      setReviews(mockReviews)
      toast.error('Failed to load reviews')
    } finally {
      setLoading(false)
    }
  }

  // Mock reviews data
  const mockReviews = [
    {
      _id: 1,
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+971 50 123 4567',
      rating: 5,
      title: 'Excellent Service',
      message: 'AMZ Properties provided exceptional service in finding my dream home in Dubai Marina.',
      status: 'approved',
      createdAt: new Date().toISOString()
    },
    {
      _id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '+971 55 987 6543',
      rating: 4,
      title: 'Great Experience',
      message: 'Professional team and smooth transaction process. Highly recommended!',
      status: 'pending',
      createdAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      _id: 3,
      name: 'Ahmed Al-Rashid',
      email: 'ahmed.rashid@email.com',
      phone: '+971 52 456 7890',
      rating: 5,
      title: 'Outstanding Support',
      message: 'The team went above and beyond to help me with my property investment.',
      status: 'approved',
      createdAt: new Date(Date.now() - 172800000).toISOString()
    }
  ]

  const handleStatusChange = async (reviewId, newStatus) => {
    try {
      const response = await apiService.updateReviewStatus(reviewId, newStatus)

      if (response.success) {
        setReviews(reviews.map(review => 
          review._id === reviewId ? {...review, status: newStatus} : review
        ))
        toast.success('Review status updated successfully')
      } else {
        toast.error('Failed to update review status')
      }
    } catch (error) {
      console.error('Error updating review status:', error)
      toast.error('Failed to update review status')
    }
  }

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return
    }

    try {
      const response = await apiService.deleteReview(reviewId)

      if (response.success) {
        setReviews(reviews.filter(review => review._id !== reviewId))
        toast.success('Review deleted successfully')
      } else {
        toast.error('Failed to delete review')
      }
    } catch (error) {
      console.error('Error deleting review:', error)
      toast.error('Failed to delete review')
    }
  }

  const handleEdit = (review) => {
    setEditingReview(review)
    setFormData({
      name: review.name,
      email: review.email,
      phone: review.phone || '',
      rating: review.rating,
      title: review.title,
      message: review.message,
      status: review.status
    })
    setShowEditForm(true)
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const response = await apiService.updateReview(editingReview._id, formData)

      if (response.success) {
        setReviews(reviews.map(review => 
          review._id === editingReview._id ? response.data : review
        ))
        setShowEditForm(false)
        setEditingReview(null)
        toast.success('Review updated successfully')
      } else {
        toast.error('Failed to update review')
      }
    } catch (error) {
      console.error('Error updating review:', error)
      toast.error('Failed to update review')
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Filter reviews
  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || review.status === statusFilter
    const matchesRating = ratingFilter === 'all' || review.rating.toString() === ratingFilter
    
    return matchesSearch && matchesStatus && matchesRating
  })

  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      approved: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200'
    }
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusStyles[status] || statusStyles.pending}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const renderStars = (rating) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="text-sm text-gray-600 ml-1">({rating})</span>
      </div>
    )
  }

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
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-yellow-300">Review Management</h3>
          <p className="text-yellow-200/70 text-sm">Manage customer reviews and ratings</p>
        </div>
        <div className="text-yellow-300 text-sm">
          Total Reviews: {reviews.length}
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <input
            type="text"
            placeholder="Search reviews..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-yellow-400/30 rounded-lg text-yellow-100 placeholder-yellow-300/50 focus:outline-none focus:border-yellow-400"
          />
        </div>
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-yellow-400/30 rounded-lg text-yellow-100 focus:outline-none focus:border-yellow-400"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div>
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-yellow-400/30 rounded-lg text-yellow-100 focus:outline-none focus:border-yellow-400"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-gray-800/50 rounded-lg overflow-hidden">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-yellow-400/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-1l-4 4z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-yellow-300">No reviews found</h3>
            <p className="mt-1 text-sm text-yellow-200/70">No reviews match your current filters.</p>
          </div>
        ) : (
          <div className="divide-y divide-yellow-400/20">
            {filteredReviews.map((review) => (
              <div key={review._id} className="p-6 hover:bg-gray-700/30 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-4">
                        <h4 className="text-lg font-medium text-yellow-300">{review.name}</h4>
                        {getStatusBadge(review.status)}
                      </div>
                      {renderStars(review.rating)}
                    </div>
                    
                    <div className="mb-3">
                      <h5 className="font-medium text-yellow-200 mb-1">{review.title}</h5>
                      <p className="text-yellow-100/80 text-sm leading-relaxed">{review.message}</p>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-xs text-yellow-300/70">
                      <span>{review.email}</span>
                      {review.phone && <span>{review.phone}</span>}
                      <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    {review.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatusChange(review._id, 'approved')}
                          className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded-lg transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusChange(review._id, 'rejected')}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded-lg transition-colors"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {review.status === 'approved' && (
                      <button
                        onClick={() => handleStatusChange(review._id, 'pending')}
                        className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white text-xs rounded-lg transition-colors"
                      >
                        Unpublish
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(review)}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(review._id)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded-lg transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Form Modal */}
      {showEditForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium text-yellow-300 mb-4">Edit Review</h3>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-yellow-200 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-yellow-400/30 rounded-lg text-yellow-100 focus:outline-none focus:border-yellow-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-yellow-200 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-yellow-400/30 rounded-lg text-yellow-100 focus:outline-none focus:border-yellow-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-yellow-200 mb-1">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-yellow-400/30 rounded-lg text-yellow-100 focus:outline-none focus:border-yellow-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-yellow-200 mb-1">Rating</label>
                <select
                  name="rating"
                  value={formData.rating}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-yellow-400/30 rounded-lg text-yellow-100 focus:outline-none focus:border-yellow-400"
                  required
                >
                  <option value={5}>5 Stars</option>
                  <option value={4}>4 Stars</option>
                  <option value={3}>3 Stars</option>
                  <option value={2}>2 Stars</option>
                  <option value={1}>1 Star</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-yellow-200 mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-yellow-400/30 rounded-lg text-yellow-100 focus:outline-none focus:border-yellow-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-yellow-200 mb-1">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 bg-gray-800 border border-yellow-400/30 rounded-lg text-yellow-100 focus:outline-none focus:border-yellow-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-yellow-200 mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-yellow-400/30 rounded-lg text-yellow-100 focus:outline-none focus:border-yellow-400"
                  required
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditForm(false)}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
                >
                  Update Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReviewManagement