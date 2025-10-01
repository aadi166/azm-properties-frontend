import React, { useState, useEffect, useRef } from 'react'
import { toast } from 'react-hot-toast'
import { apiService } from '../../services/api'

const PropertyManagement = () => {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProperty, setEditingProperty] = useState(null)
  const [activeFilter, setActiveFilter] = useState('all')

  // Form state (merged from PropertyForm.jsx)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    image: '',
    type: 'exclusive',
    bedrooms: '',
    bathrooms: '',
    area: '',
    features: [],
    status: 'available',
    developer: '',
    completionDate: '',
    paymentPlan: '',
    roi: ''
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const fileInputRef = useRef(null)
  const [newFeature, setNewFeature] = useState('')

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
        roi: editingProperty.roi || ''
      })
      setImagePreview(editingProperty.image || '')
      setImageFile(null)
    } else {
      // Reset form when not editing
      setFormData({
        title: '', description: '', price: '', location: '', image: '', type: 'exclusive', bedrooms: '', bathrooms: '', area: '', features: [], status: 'available', developer: '', completionDate: '', paymentPlan: '', roi: ''
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
      } else {
        // fallback local delete
        setProperties(prev => prev.filter(p => p._id !== propertyId && p.id !== propertyId))
        toast.success('Property deleted (local)')
      }
    } catch (error) {
      console.error('Error deleting property:', error)
      setProperties(prev => prev.filter(p => p._id !== propertyId && p.id !== propertyId))
      toast.success('Property deleted (local)')
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

  const filteredProperties = properties.filter(property => {
    if (activeFilter === 'all') return true
    return property.type === activeFilter
  })

  const filters = [
    { id: 'all', label: 'All Properties', count: properties.length },
    { id: 'exclusive', label: 'Exclusive Properties', count: properties.filter(p => p.type === 'exclusive').length },
    { id: 'off-plan', label: 'Off-Plan Properties', count: properties.filter(p => p.type === 'off-plan').length }
  ]

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Render combined UI (header, modal form, list)
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-black shadow rounded-lg p-6 border border-yellow-400/30">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-yellow-400">Property Management</h2>
            <p className="text-yellow-300/70 mt-1">Manage exclusive and off-plan properties</p>
          </div>
          <button
            onClick={handleAddProperty}
            className="bg-yellow-600 hover:bg-yellow-500 text-gray-900 px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Add Property</span>
          </button>
        </div>
      </div>

      {/* Form Modal (inlined) */}
      {showForm && (
        <div className="bg-gray-800 rounded-2xl border border-yellow-400/30 max-w-4xl w-full mx-auto my-8 admin-modal-panel">
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
            </form>
          </div>
          <div className="modal-footer sticky bottom-0 bg-gray-800 p-6 border-t border-yellow-400/30 rounded-b-2xl">
            <button type="button" onClick={handleCancelForm} className="px-6 py-3 border border-yellow-400/30 text-yellow-300 rounded-xl">Cancel</button>
            <button type="submit" form="propertyForm" className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-xl">{editingProperty ? 'Update Property' : 'Create Property'}</button>
          </div>
        </div>
      )}

      {/* Property List (inlined) */}
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
              {filteredProperties.map((property) => (
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
                      <button onClick={() => handleEditProperty(property)} className="text-yellow-400 hover:text-yellow-300 transition-colors flex items-center space-x-1 mr-3"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg><span>Edit</span></button>
                      <button onClick={() => handleDeleteProperty(property._id || property.id)} className="text-red-400 hover:text-red-300 transition-colors flex items-center space-x-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg><span>Delete</span></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default PropertyManagement