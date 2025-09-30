import React, { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import apiService from '../../services/api'

// Import API config for base URL
const API_CONFIG = {
  BASE_URL: 'http://127.0.0.1:5000'
};

const TestimonialManagement = () => {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    comments: '',
    image: null,
    designation: '',
    published: true
  })

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const response = await apiService.getTestimonials()
      console.log('Testimonial response:', response)
      if (response && response.testimonials && Array.isArray(response.testimonials)) {
        setTestimonials(response.testimonials)
      } else if (response && response.success) {
        setTestimonials([])
      } else {
        console.error('Invalid testimonial response structure:', response)
        // Fallback to mock data
        setTestimonials(mockTestimonials)
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error)
      // Fallback to mock data
      setTestimonials(mockTestimonials)
    } finally {
      setLoading(false)
    }
  }

  // Mock testimonials data
  const mockTestimonials = [
    {
      _id: '1',
      name: 'John Smith',
      email: 'john.smith@email.com',
      comments: 'AMZ Properties provided exceptional service in finding my dream home in Dubai Marina. The team was professional and went above and beyond to meet my requirements.',
      image: null,
      designation: 'Investment Manager',
      published: true,
      createdAt: new Date().toISOString()
    },
    {
      _id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      comments: 'Professional team and smooth transaction process. They made buying my first property in Dubai a seamless experience.',
      image: null,
      designation: 'Marketing Director',
      published: false,
      createdAt: new Date(Date.now() - 86400000).toISOString()
    }
  ]

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target
    
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else if (type === 'file') {
      setFormData(prev => ({ ...prev, [name]: files[0] }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      let response
      const submitData = new FormData()
      
      Object.keys(formData).forEach(key => {
        if (key === 'image' && formData[key]) {
          submitData.append('image', formData[key])
        } else if (key !== 'image') {
          submitData.append(key, formData[key])
        }
      })

      if (editingTestimonial) {
        response = await apiService.updateTestimonial(editingTestimonial._id, submitData)
      } else {
        response = await apiService.createTestimonial(submitData)
      }

      if (response && response.success) {
        toast.success(`Testimonial ${editingTestimonial ? 'updated' : 'created'} successfully`)
        setShowForm(false)
        setEditingTestimonial(null)
        resetForm()
        // notify other parts of the app to refresh testimonials
        window.dispatchEvent(new CustomEvent('testimonialsUpdated'))
        fetchTestimonials()
      } else {
        toast.error(response?.message || 'Failed to save testimonial')
        // If an admin token exists, the API call should have been attempted and failing means request denied or server error.
        // In that case, DO NOT create a local testimonial because it would be out-of-sync with the backend.
        const adminToken = localStorage.getItem('adminToken') || localStorage.getItem('accessToken')
        if (!adminToken) {
          // Only fallback to local UI update when there is no admin token (offline/local mode)
          if (editingTestimonial) {
            setTestimonials(prev => prev.map(testimonial => 
              testimonial._id === editingTestimonial._id 
                ? { ...editingTestimonial, ...formData, image: formData.image ? URL.createObjectURL(formData.image) : editingTestimonial.image }
                : testimonial
            ))
          } else {
            const newTestimonial = {
              _id: Date.now().toString(),
              ...formData,
              image: formData.image ? URL.createObjectURL(formData.image) : null,
              createdAt: new Date().toISOString()
            }
            setTestimonials(prev => [newTestimonial, ...prev])
          }
        }
        setShowForm(false)
        setEditingTestimonial(null)
        resetForm()
      }
    } catch (error) {
      console.error('Error saving testimonial:', error)
      toast.error('Error saving testimonial')
    }
  }

  const handleEdit = (testimonial) => {
    setEditingTestimonial(testimonial)
    setFormData({
      name: testimonial.name,
      email: testimonial.email,
      comments: testimonial.comments,
      designation: testimonial.designation || '',
      image: null,
      published: testimonial.published !== false
    })
    setShowForm(true)
  }

  const handlePublishToggle = async (testimonialId, currentStatus) => {
    try {
      const newStatus = !currentStatus
      const response = await apiService.updateTestimonial(testimonialId, { published: newStatus })
      
      if (response && response.success) {
        toast.success(`Testimonial ${newStatus ? 'published' : 'unpublished'} successfully`)
        setTestimonials(prev => prev.map(testimonial => 
          testimonial._id === testimonialId ? { ...testimonial, published: newStatus } : testimonial
        ))
        // notify other parts of the app to refresh testimonials
        window.dispatchEvent(new CustomEvent('testimonialsUpdated'))
      } else {
        toast.error(response?.message || 'Failed to update testimonial status')
        const adminToken = localStorage.getItem('adminToken') || localStorage.getItem('accessToken')
        if (!adminToken) {
          // Only fallback locally when not authenticated
          setTestimonials(prev => prev.map(testimonial => 
            testimonial._id === testimonialId ? { ...testimonial, published: newStatus } : testimonial
          ))
        }
      }
    } catch (error) {
      console.error('Error updating testimonial status:', error)
      // Help debugging: log message and any nested response text if present
      try {
        console.error('Error details:', error.message || error.toString())
      } catch (e) {}
      toast.error('Error updating testimonial status')
      // If admin token exists, do NOT change local state (server-side operation failed)
      const adminToken = localStorage.getItem('adminToken') || localStorage.getItem('accessToken')
      if (!adminToken) {
        const newStatus = !currentStatus
        setTestimonials(prev => prev.map(testimonial => 
          testimonial._id === testimonialId ? { ...testimonial, published: newStatus } : testimonial
        ))
        // notify other parts of the app to refresh testimonials
        window.dispatchEvent(new CustomEvent('testimonialsUpdated'))
      }
    }
  }

  const handleDelete = async (testimonialId) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) {
      return
    }

    try {
      const response = await apiService.deleteTestimonial(testimonialId)
      
      if (response && response.success) {
        toast.success('Testimonial deleted successfully')
        // notify other parts of the app to refresh testimonials
        window.dispatchEvent(new CustomEvent('testimonialsUpdated'))
        fetchTestimonials()
      } else {
        toast.error(response?.message || 'Failed to delete testimonial')
        // Fallback: remove from local state
        setTestimonials(prev => prev.filter(testimonial => testimonial._id !== testimonialId))
      }
    } catch (error) {
      console.error('Error deleting testimonial:', error)
      toast.error('Error deleting testimonial')
      // If admin token exists, do NOT remove locally (server-side delete failed)
      const adminToken = localStorage.getItem('adminToken') || localStorage.getItem('accessToken')
      if (!adminToken) {
        // Only remove locally in offline/local mode
        setTestimonials(prev => prev.filter(testimonial => testimonial._id !== testimonialId))
        window.dispatchEvent(new CustomEvent('testimonialsUpdated'))
      }
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      comments: '',
      image: null,
      designation: '',
      published: true
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">Testimonial Management</h2>
          <p className="text-yellow-300/70 mt-1">Manage customer testimonials and reviews</p>
        </div>
        <button
          onClick={() => {
            setShowForm(true)
            setEditingTestimonial(null)
            resetForm()
          }}
          className="bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-600 hover:to-yellow-500 text-black px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Add New Testimonial</span>
        </button>
      </div>

      {/* Testimonial Form */}
      {showForm && (
        <div className="bg-gray-800 rounded-2xl border border-yellow-400/30 max-w-4xl w-full mx-auto my-8 admin-modal-panel">
          <div className="sticky top-0 bg-gray-800 p-6 border-b border-yellow-400/30 rounded-t-2xl">
            <h3 className="text-xl font-bold text-yellow-300">
              {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
            </h3>
          </div>

          <div className="modal-body max-h-96 overflow-y-auto">
            <form id="testimonialForm" onSubmit={handleSubmit} className="space-y-6 p-6">
              {/* Basic Information */}
              <div className="border-b border-yellow-400/30 pb-6">
                <h4 className="text-md font-medium text-yellow-300 mb-4">Basic Information</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-yellow-300 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100 placeholder-yellow-300/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300 backdrop-blur-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-yellow-300 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100 placeholder-yellow-300/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300 backdrop-blur-sm"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-yellow-300 mb-1">
                    Designation
                  </label>
                  <input
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleInputChange}
                    placeholder="e.g. CEO, Marketing Manager, etc."
                    className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100 placeholder-yellow-300/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300 backdrop-blur-sm"
                  />
                </div>
              </div>

              {/* Testimonial Content */}
              <div className="border-b border-yellow-400/30 pb-6">
                <h4 className="text-md font-medium text-yellow-300 mb-4">Testimonial Content</h4>

                <div>
                  <label className="block text-sm font-medium text-yellow-300 mb-1">
                    Comments *
                  </label>
                  <textarea
                    name="comments"
                    value={formData.comments}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    placeholder="Write the testimonial comments here..."
                    className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100 placeholder-yellow-300/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300 backdrop-blur-sm"
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div className="border-b border-yellow-400/30 pb-6">
                <h4 className="text-md font-medium text-yellow-300 mb-4">Profile Image</h4>

                <div>
                  <label className="block text-sm font-medium text-yellow-300 mb-1">
                    Upload Image
                  </label>
                  <input
                    type="file"
                    name="image"
                    onChange={handleInputChange}
                    accept="image/*"
                    className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-400 file:text-gray-900 hover:file:bg-yellow-300 transition-all duration-300 backdrop-blur-sm"
                  />
                </div>
              </div>

              {/* Publishing Options */}
              <div className="border-b border-yellow-400/30 pb-6">
                <h4 className="text-md font-medium text-yellow-300 mb-4">Publishing Options</h4>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="published"
                    name="published"
                    checked={formData.published}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-yellow-400 bg-gray-900 border-yellow-400/30 rounded focus:ring-yellow-400 focus:ring-2"
                  />
                  <label htmlFor="published" className="text-sm font-medium text-yellow-300 cursor-pointer">
                    Publish immediately
                  </label>
                </div>
              </div>
            </form>
          </div>

          <div className="modal-footer sticky bottom-0 bg-gray-800 p-6 border-t border-yellow-400/30 rounded-b-2xl">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingTestimonial(null);
                resetForm();
              }}
              className="px-6 py-3 border border-yellow-400/30 text-yellow-300 rounded-xl hover:bg-yellow-400/10 transition-all duration-300 backdrop-blur-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="testimonialForm"
              className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-xl hover:from-yellow-300 hover:to-yellow-400 font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {editingTestimonial ? 'Update Testimonial' : 'Create Testimonial'}
            </button>
          </div>
        </div>
      )}

      {/* Testimonials List */}
      <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-2xl shadow-2xl border border-yellow-400/30 backdrop-blur-sm">
        <div className="px-8 py-6 border-b border-yellow-400/20">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">All Testimonials ({testimonials.length})</h3>
          </div>
        </div>
        <div className="p-8">
          {testimonials.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-yellow-400/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div className="text-yellow-300 text-lg font-medium">No testimonials found</div>
              <p className="text-yellow-300/60 mt-2">Create your first testimonial to get started</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {testimonials.map((testimonial) => (
                <div key={testimonial._id} className="bg-gradient-to-r from-gray-900/60 to-gray-800/60 p-6 rounded-xl border border-yellow-400/20 hover:border-yellow-400/40 transition-all duration-300 hover:shadow-lg backdrop-blur-sm">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-3">
                        {testimonial.image && (
                          <img 
                            src={testimonial.image_url ? `${API_CONFIG.BASE_URL}${testimonial.image_url}` : testimonial.image}
                            alt={testimonial.name}
                            className="h-12 w-12 rounded-full object-cover border border-yellow-400/30"
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h4 className="text-xl font-bold text-yellow-300 hover:text-yellow-400 transition-colors">{testimonial.name}</h4>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              testimonial.published !== false 
                                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                                : 'bg-red-500/20 text-red-400 border border-red-500/30'
                            }`}>
                              {testimonial.published !== false ? 'Published' : 'Unpublished'}
                            </span>
                          </div>
                          {testimonial.designation && (
                            <p className="text-yellow-400/70 text-sm mt-1">{testimonial.designation}</p>
                          )}
                        </div>
                      </div>
                      <p className="text-yellow-200/70 text-sm mb-4 italic">&ldquo;{testimonial.comments}&rdquo;</p>
                      <div className="flex items-center space-x-4 text-sm text-yellow-300/60">
                        <span>{testimonial.email}</span>
                        <span>{new Date(testimonial.createdAt || Date.now()).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 ml-6">
                      <button
                        onClick={() => handlePublishToggle(testimonial._id, testimonial.published)}
                        className={`p-3 rounded-xl transition-all duration-300 hover:scale-110 group ${
                          testimonial.published !== false
                            ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400'
                            : 'bg-green-500/20 hover:bg-green-500/30 text-green-400'
                        }`}
                        title={testimonial.published !== false ? 'Unpublish testimonial' : 'Publish testimonial'}
                      >
                        {testimonial.published !== false ? (
                          <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                      <button
                        onClick={() => handleEdit(testimonial)}
                        className="p-3 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-xl transition-all duration-300 hover:scale-110 group"
                        title="Edit testimonial"
                      >
                        <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(testimonial._id)}
                        className="p-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl transition-all duration-300 hover:scale-110 group"
                        title="Delete testimonial"
                      >
                        <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TestimonialManagement