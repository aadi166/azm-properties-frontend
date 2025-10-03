import React, { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import apiService, { API_CONFIG } from '../../services/api'
import GenericCard from './GenericCard'

const TestimonialManagement = () => {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    designation: '',
    comments: '',
    image: null,
    published: true
  })

  useEffect(() => {
    fetchTestimonials()
  }, [])

  useEffect(() => {
    if (editingTestimonial) {
      setFormData({
        name: editingTestimonial.name || '',
        email: editingTestimonial.email || '',
        designation: editingTestimonial.designation || '',
        comments: editingTestimonial.comments || '',
        image: null,
        published: editingTestimonial.published !== false
      })
    } else {
      setFormData({
        name: '',
        email: '',
        designation: '',
        comments: '',
        image: null,
        published: true
      })
    }
  }, [editingTestimonial])

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target
    
    if (type === 'file') {
      setFormData(prev => ({ ...prev, [name]: files[0] }))
    } else if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleCancelForm = () => {
    setShowForm(false)
    setEditingTestimonial(null)
    setFormData({
      name: '',
      email: '',
      designation: '',
      comments: '',
      image: null,
      published: true
    })
  }

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      let response
      const formDataToSend = new FormData()
      
      Object.keys(formData).forEach(key => {
        if (key === 'image' && formData[key]) {
          formDataToSend.append('image', formData[key])
        } else if (key !== 'image') {
          formDataToSend.append(key, formData[key])
        }
      })

      if (editingTestimonial) {
        response = await apiService.updateTestimonial(editingTestimonial._id, formDataToSend)
      } else {
        response = await apiService.createTestimonial(formDataToSend)
      }

      if (response && response.success) {
        toast.success(`Testimonial ${editingTestimonial ? 'updated' : 'created'} successfully`)
        handleCancelForm()
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
        handleCancelForm()
      }
    } catch (error) {
      console.error('Error saving testimonial:', error)
      toast.error('Error saving testimonial')
    }
  }

  const handleEdit = (testimonial) => {
    setEditingTestimonial(testimonial)
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Testimonial Form */}
      {showForm && (
        <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-2xl shadow-2xl border border-yellow-400/30 backdrop-blur-sm">
          <div className="p-6 border-b border-yellow-400/30">
            <h3 className="text-xl font-bold text-yellow-300">
              {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
            </h3>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6 p-6">
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
                    placeholder="Enter full name"
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
                    placeholder="Enter email address"
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

            {/* Profile Image */}
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

            {/* Form Actions */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={handleCancelForm}
                className="px-6 py-3 border border-yellow-400/30 text-yellow-300 rounded-xl hover:bg-yellow-400/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-xl hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300"
              >
                {editingTestimonial ? 'Update Testimonial' : 'Create Testimonial'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Testimonials List */}
      <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-2xl shadow-2xl border border-yellow-400/30 backdrop-blur-sm">
        <div className="px-8 py-6 border-b border-yellow-400/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">All Testimonials ({testimonials.length})</h3>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-4 py-2 rounded-lg hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300 font-medium shadow-md hover:shadow-lg"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Add New Testimonial</span>
            </button>
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
                <GenericCard
                  key={testimonial._id}
                  item={testimonial}
                  type="testimonial"
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onPublishToggle={handlePublishToggle}
                  titleField="name"
                  subtitleField="designation"
                  descriptionField="comments"
                  dateField="createdAt"
                  imageField="image"
                  fields={[
                    { key: 'email', label: 'Email', className: 'text-yellow-300/70' }
                  ]}
                  actions={['publish', 'edit', 'delete']}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )

}

export default TestimonialManagement