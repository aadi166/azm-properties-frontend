import React, { useState, useEffect, useRef } from 'react'
import { toast } from 'react-hot-toast'
import apiService from '../../services/api'
import GenericCard from './GenericCard'

const PropertyManagement = () => {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingProperty, setEditingProperty] = useState(null)

  // Added missing form-related state and refs
  const [formData, setFormData] = useState({
    title: '', description: '', price: '', location: '', image: '', type: 'exclusive', bedrooms: '', bathrooms: '', area: '', features: [], status: 'available', developer: '', completionDate: '', paymentPlan: '', roi: '', published: true
  })
  const [newFeature, setNewFeature] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [showForm, setShowForm] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    fetchProperties()
  }, [])

  useEffect(() => {
    if (editingProperty) {
      setFormData({
        title: editingProperty.title || '',
        description: editingProperty.description || '',
        price: editingProperty.price || '',
        location: editingProperty.location || '',
        image: editingProperty.image || '',
        type: editingProperty.type || 'exclusive',
        bedrooms: editingProperty.bedrooms || '',
        bathrooms: editingProperty.bathrooms || '',
        area: editingProperty.area || '',
        features: editingProperty.features || [],
        status: editingProperty.status || 'available',
        developer: editingProperty.developer || '',
        completionDate: editingProperty.completionDate || '',
        paymentPlan: editingProperty.paymentPlan || '',
        roi: editingProperty.roi || '',
        published: editingProperty.published !== false
      })
      setImagePreview(editingProperty.image || '')
      setImageFile(null)
    } else {
      // Reset form when not editing
      setFormData({
        title: '', description: '', price: '', location: '', image: '', type: 'exclusive', bedrooms: '', bathrooms: '', area: '', features: [], status: 'available', developer: '', completionDate: '', paymentPlan: '', roi: '', published: true
      })
      setImageFile(null)
      setImagePreview('')
    }
  }, [editingProperty])

  const fetchProperties = async () => {
    try {
      setLoading(true)
      const response = await apiService.getProperties()

      if (response && response.success) {
        setProperties(response.data || [])
      } else {
        console.error('API returned error:', response && response.message)
        toast.error('Failed to load properties')
      }
    } catch (error) {
      console.error('Error fetching properties:', error)
      toast.error('Failed to load properties')
    } finally {
      setLoading(false)
    }
  }

  const handleAddProperty = () => {
    setEditingProperty(null)
    setShowForm(true)
  }

  const handleEditProperty = (property) => {
    setEditingProperty(property)
    setShowForm(true)
  }

  const handleDeleteProperty = async (propertyId) => {
    if (!window.confirm('Are you sure you want to delete this property?')) return

    try {
      const response = await apiService.deleteProperty(propertyId)
      if (response && response.success) {
        toast.success('Property deleted successfully')
        fetchProperties()
        // notify other parts of the app to refresh properties
        try { window.dispatchEvent(new Event('propertiesUpdated')) } catch(e){}
      } else {
        // fallback local delete
        setProperties(prev => prev.filter(p => p._id !== propertyId && p.id !== propertyId))
        toast.success('Property deleted (local)')
        try { window.dispatchEvent(new Event('propertiesUpdated')) } catch(e){}
      }
    } catch (error) {
      console.error('Error deleting property:', error)
      setProperties(prev => prev.filter(p => p._id !== propertyId && p.id !== propertyId))
      toast.success('Property deleted (local)')
      try { window.dispatchEvent(new Event('propertiesUpdated')) } catch(e){}
    }
  }

  const handlePublishToggle = async (propertyId) => {
    try {
      const property = properties.find(p => p._id === propertyId || p.id === propertyId)
      if (!property) return

      const newPublishedStatus = !property.published
      const response = await apiService.updateProperty(propertyId, { published: newPublishedStatus })

      if (response && response.success) {
        toast.success(`Property ${newPublishedStatus ? 'published' : 'unpublished'} successfully`)
        fetchProperties()
        // notify other parts of the app to refresh properties
        try { window.dispatchEvent(new Event('propertiesUpdated')) } catch(e){}
      } else {
        toast.error('Failed to update property status')
      }
    } catch (error) {
      console.error('Error toggling property publish status:', error)
      toast.error('Error updating property status')
    }
  }

  // Form helpers
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({ ...prev, features: [...prev.features, newFeature.trim()] }))
      setNewFeature('')
    }
  }

  const handleRemoveFeature = (index) => {
    setFormData(prev => ({ ...prev, features: prev.features.filter((_, i) => i !== index) }))
  }

  const handleCancelForm = () => {
    setShowForm(false)
    setEditingProperty(null)
  }

  const handleSubmitForm = async (e) => {
    e.preventDefault()
    try {
      const fd = new FormData()
      Object.keys(formData).forEach(key => {
        if (key === 'features') {
          formData.features.forEach(feature => fd.append('features', feature))
        } else if (key !== 'image') {
          const val = formData[key] !== undefined && formData[key] !== null ? formData[key] : ''
          fd.append(key, val)
        }
      })

      if (imageFile) fd.append('image', imageFile)
      else if (formData.image) fd.append('image', formData.image)

      let response
      if (editingProperty) {
        // If API supports update with FormData, apiService.updateProperty should handle it; otherwise we keep local update
        response = await apiService.updateProperty(editingProperty._id || editingProperty.id, fd)
      } else {
        response = await apiService.createProperty(fd)
      }

      if (response && response.success) {
        toast.success(editingProperty ? 'Property updated successfully' : 'Property created successfully')
        setShowForm(false)
        setEditingProperty(null)
        fetchProperties()
        // notify other parts of the app to refresh properties
        try { window.dispatchEvent(new Event('propertiesUpdated')) } catch(e){}
      } else {
        const msg = (response && response.message) || 'Failed to save property'
        toast.error(msg)
        console.error('Save property response:', response)
      }
    } catch (error) {
      console.error('Error saving property:', error)
      toast.error('Error saving property')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Render combined UI (modal form, list)
  return (
    <>
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 rounded-2xl border border-yellow-400/30 max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden admin-modal-panel">
          <div className="sticky top-0 bg-gray-800 p-6 border-b border-yellow-400/30 rounded-t-2xl">
            <h3 className="text-xl font-bold text-yellow-300">{editingProperty ? 'Edit Property' : 'Add New Property'}</h3>
          </div>
          <div className="modal-body max-h-96 overflow-y-auto">
            <form id="propertyForm" onSubmit={handleSubmitForm} className="space-y-6 p-6">
              {/* Basic Information */}
              <div className="border-b border-yellow-400/30 pb-6">
                <h4 className="text-md font-medium text-yellow-300 mb-4">Basic Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-yellow-300 mb-1">Title *</label>
                    <input type="text" name="title" required value={formData.title} onChange={handleChange} className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100 placeholder-yellow-300/50 focus:outline-none focus:ring-2 focus:ring-yellow-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-yellow-300 mb-1">Property Type *</label>
                    <select name="type" required value={formData.type} onChange={handleChange} className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-400">
                      <option value="exclusive">Exclusive Property</option>
                      <option value="off-plan">Off-Plan Property</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-yellow-300 mb-1">Price (AED) *</label>
                    <input type="number" name="price" required value={formData.price} onChange={handleChange} className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-yellow-300 mb-1">Location *</label>
                    <input type="text" name="location" required value={formData.location} onChange={handleChange} className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100" />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-yellow-300 mb-1">Description *</label>
                  <textarea name="description" required rows={4} value={formData.description} onChange={handleChange} className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100" />
                </div>
              </div>

              {/* Property Details */}
              <div className="border-b border-yellow-400/30 pb-6">
                <h4 className="text-md font-medium text-yellow-300 mb-4">Property Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-yellow-300 mb-1">Bedrooms</label>
                    <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-yellow-300 mb-1">Bathrooms</label>
                    <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-yellow-300 mb-1">Area (sq ft)</label>
                    <input type="number" name="area" value={formData.area} onChange={handleChange} className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100" />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-yellow-300 mb-1">Status</label>
                  <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100">
                    <option value="available">Available</option>
                    <option value="sold">Sold</option>
                    <option value="reserved">Reserved</option>
                  </select>
                </div>
              </div>

              {/* Features */}
              <div className="border-b border-yellow-400/30 pb-6">
                <h4 className="text-md font-medium text-yellow-300 mb-4">Features</h4>
                <div className="flex gap-2 mb-4">
                  <input type="text" value={newFeature} onChange={(e) => setNewFeature(e.target.value)} placeholder="Add a feature" className="flex-1 bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100" onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())} />
                  <button type="button" onClick={handleAddFeature} className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-xl">Add</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.features.map((feature, index) => (
                    <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-400/20 text-yellow-300 border border-yellow-400/30">
                      {feature}
                      <button type="button" onClick={() => handleRemoveFeature(index)} className="ml-2 text-yellow-400">×</button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Off-plan specific fields */}
              {formData.type === 'off-plan' && (
                <div className="border-b border-yellow-400/30 pb-6">
                  <h4 className="text-md font-medium text-yellow-300 mb-4">Off-Plan Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-yellow-300 mb-1">Developer</label>
                      <input type="text" name="developer" value={formData.developer} onChange={handleChange} className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-yellow-300 mb-1">Completion Date</label>
                      <input type="date" name="completionDate" value={formData.completionDate} onChange={handleChange} className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-yellow-300 mb-1">ROI (%)</label>
                      <input type="number" name="roi" step="0.1" value={formData.roi} onChange={handleChange} className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-yellow-300 mb-1">Payment Plan</label>
                    <textarea name="paymentPlan" rows={3} value={formData.paymentPlan} onChange={handleChange} placeholder="e.g., 10% on booking, 40% during construction, 50% on completion" className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100" />
                  </div>
                </div>
              )}

              {/* Image Upload */}
              <div className="border-b border-yellow-400/30 pb-6">
                <h4 className="text-md font-medium text-yellow-300 mb-4">Property Image</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-yellow-300 mb-1">Upload Image *</label>
                    <div className="flex items-center space-x-4">
                      <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
                      <button type="button" onClick={() => fileInputRef.current.click()} className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-xl">{imageFile ? 'Change Image' : 'Select Image'}</button>
                      {imagePreview && (
                        <div className="relative">
                          <img src={imagePreview} alt="Property preview" className="h-20 w-20 object-cover rounded-xl border border-yellow-400/30" />
                          <button type="button" onClick={() => { setImageFile(null); setImagePreview(''); if (fileInputRef.current) fileInputRef.current.value = '' }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">×</button>
                        </div>
                      )}
                    </div>
                    {!imagePreview && !imageFile && formData.image && <p className="text-sm text-yellow-300/60 mt-1">Current image will be used</p>}
                  </div>
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
                    onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
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
            <button type="button" onClick={handleCancelForm} className="px-6 py-3 border border-yellow-400/30 text-yellow-300 rounded-xl">Cancel</button>
            <button type="submit" form="propertyForm" className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-xl">{editingProperty ? 'Update Property' : 'Create Property'}</button>
          </div>
        </div>
      </div>
      )}

      <div className="space-y-6">
        {/* Property List */}
        <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-2xl shadow-2xl border border-yellow-400/30 backdrop-blur-sm">
        <div className="px-8 py-6 border-b border-yellow-400/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">All Properties ({properties.length})</h3>
            </div>
            <button
              onClick={() => { setEditingProperty(null); setShowForm(true); }}
              className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-4 py-2 rounded-lg hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300 font-medium shadow-md hover:shadow-lg"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Add Property</span>
            </button>
          </div>
        </div>
        <div className="p-8">
          {properties.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-yellow-400/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="text-yellow-300 text-lg font-medium">No properties found</div>
              <p className="text-yellow-300/60 mt-2">Create your first property to get started</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {properties.map((property) => (
                <GenericCard
                  key={property._id || property.id}
                  item={property}
                  type="property"
                  onEdit={handleEditProperty}
                  onDelete={handleDeleteProperty}
                  onPublishToggle={handlePublishToggle}
                  titleField="title"
                  subtitleField="location"
                  descriptionField="description"
                  dateField="createdAt"
                  imageField="image"
                  fields={[
                    { key: 'type', label: 'Type', className: 'text-yellow-300' },
                    { key: 'price', label: 'Price', className: 'text-yellow-300 font-medium' },
                    { key: 'bedrooms', label: 'Beds', className: 'text-yellow-300/70' },
                    { key: 'bathrooms', label: 'Baths', className: 'text-yellow-300/70' },
                    { key: 'area', label: 'Area', className: 'text-yellow-300/70' }
                  ]}
                  actions={['publish', 'edit', 'delete']}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  </>
)

}

export default PropertyManagement