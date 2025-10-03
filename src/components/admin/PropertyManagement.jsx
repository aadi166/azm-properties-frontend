import React, { useState, useEffect, useRef } from 'react'
import { toast } from 'react-hot-toast'
import apiService from '../../services/api'
import GenericCard from './GenericCard'

const PropertyManagement = () => {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingProperty, setEditingProperty] = useState(null)

  // Form state (only fields used by backend body)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    image: '',
    property_type: '',
    offer_type: 'Sale',
    bedrooms: '',
    bathrooms: '',
    size: '',
    area: '',
    features: [],
    status: '',
    developer_id: '',
    project_id: ''
  })
  const [newFeature, setNewFeature] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [showForm, setShowForm] = useState(false)
  const fileInputRef = useRef(null)

  // Developer/Project dropdown data
  const [developers, setDevelopers] = useState([])
  const [projects, setProjects] = useState([])
  const [loadingDevelopers, setLoadingDevelopers] = useState(false)
  const [loadingProjects, setLoadingProjects] = useState(false)

  useEffect(() => { fetchProperties() }, [])

  useEffect(() => {
    if (editingProperty) {
      setFormData({
        title: editingProperty.title || '',
        description: editingProperty.description || '',
        price: editingProperty.price || '',
        location: editingProperty.location || '',
        image: editingProperty.image || '',
        property_type: editingProperty.property_type || editingProperty.type || '',
        offer_type: editingProperty.offer_type || 'Sale',
        bedrooms: editingProperty.bedrooms || '',
        bathrooms: editingProperty.bathrooms || '',
        size: editingProperty.size || editingProperty.sqft || editingProperty.area || '',
        area: editingProperty.area_text || editingProperty.area || '',
        features: editingProperty.features || [],
        status: editingProperty.status || '',
        developer_id: editingProperty.developer_id || '',
        project_id: editingProperty.project_id || ''
      })
      setImagePreview(editingProperty.image || '')
      setImageFile(null)
    } else {
      setFormData({
        title: '', description: '', price: '', location: '', image: '', property_type: '', offer_type: 'Sale', bedrooms: '', bathrooms: '', size: '', area: '', features: [], status: '', developer_id: '', project_id: ''
      })
      setImageFile(null)
      setImagePreview('')
    }
  }, [editingProperty])

  // Load developers when the form opens
  useEffect(() => {
    const loadDevelopers = async () => {
      try {
        setLoadingDevelopers(true)
        const res = await apiService.getDevelopers()
        if (res && res.success && Array.isArray(res.data)) setDevelopers(res.data)
      } catch (e) {
        console.error('Error loading developers:', e)
        toast.error('Failed to load developers')
      } finally { setLoadingDevelopers(false) }
    }
    if (showForm) loadDevelopers()
  }, [showForm])

  // Load projects after developer changes
  useEffect(() => {
    const loadProjects = async () => {
      if (!formData.developer_id) { setProjects([]); return }
      try {
        setLoadingProjects(true)
        const res = await apiService.getProjects()
        let list = (res && res.data) || []
        // Try strict id match, otherwise fallback to name match
        list = list.filter(p => (p.developer_id && (String(p.developer_id) === String(formData.developer_id))) || (!p.developer_id && p.developer && developers.find(d => (d.id === formData.developer_id || d._id === formData.developer_id) && d.name && p.developer.toLowerCase().includes(String(d.name).toLowerCase()))))
        setProjects(list)
      } catch (e) {
        console.error('Error loading projects:', e)
        toast.error('Failed to load projects')
      } finally { setLoadingProjects(false) }
    }
    loadProjects()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.developer_id])

  const fetchProperties = async () => {
    try {
      setLoading(true)
      const response = await apiService.getProperties()
      if (response && response.success) setProperties(response.data || [])
      else {
        console.error('API returned error:', response && response.message)
        toast.error('Failed to load properties')
      }
    } catch (error) {
      console.error('Error fetching properties:', error)
      toast.error('Failed to load properties')
    } finally { setLoading(false) }
  }

  const handleAddProperty = () => { setEditingProperty(null); setShowForm(true) }
  const handleEditProperty = (property) => { setEditingProperty(property); setShowForm(true) }

  const handleDeleteProperty = async (propertyId) => {
    if (!window.confirm('Are you sure you want to delete this property?')) return
    try {
      const response = await apiService.deleteProperty(propertyId)
      if (response && response.success) {
        toast.success('Property deleted successfully')
        fetchProperties()
        try { window.dispatchEvent(new Event('propertiesUpdated')) } catch(e){}
      } else {
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
        try { window.dispatchEvent(new Event('propertiesUpdated')) } catch(e){}
      } else toast.error('Failed to update property status')
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
  const handleCancelForm = () => { setShowForm(false); setEditingProperty(null) }

  const handleSubmitForm = async (e) => {
    e.preventDefault()
    try {
      const fd = new FormData()
      fd.append('title', formData.title || '')
      fd.append('description', formData.description || '')
      fd.append('price', formData.price || '')
      fd.append('location', formData.location || '')
      fd.append('property_type', formData.property_type || '')
      fd.append('offer_type', formData.offer_type || 'Sale')
      fd.append('bedrooms', formData.bedrooms || '')
      fd.append('bathrooms', formData.bathrooms || '')
      fd.append('size', formData.size || '')
      fd.append('area', formData.area || '')
      fd.append('status', formData.status || '')
      if (formData.developer_id) fd.append('developer_id', formData.developer_id)
      if (formData.project_id) fd.append('project_id', formData.project_id)
      fd.append('features', JSON.stringify(Array.isArray(formData.features) ? formData.features : []))
      if (imageFile) fd.append('image', imageFile)
      else if (formData.image) fd.append('image', formData.image)

      let response
      if (editingProperty) {
        response = await apiService.updateProperty(editingProperty._id || editingProperty.id, fd)
      } else {
        response = await apiService.createProperty(fd)
      }

      if (response && response.success) {
        toast.success(editingProperty ? 'Property updated successfully' : 'Property created successfully')
        setShowForm(false)
        setEditingProperty(null)
        fetchProperties()
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

  // Render combined UI
  return (
    <div className="space-y-6">
      {showForm && (
        <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-2xl shadow-2xl border border-yellow-400/30 backdrop-blur-sm">
          <div className="p-6 border-b border-yellow-400/30">
            <h3 className="text-xl font-bold text-yellow-300">{editingProperty ? 'Edit Property' : 'Add New Property'}</h3>
          </div>
          <form onSubmit={handleSubmitForm} className="space-y-6 p-6">
            {/* Basic Information */}
            <div className="border-b border-yellow-400/30 pb-6">
              <h4 className="text-md font-medium text-yellow-300 mb-4">Basic Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-yellow-300 mb-1">Title *</label>
                  <input type="text" name="title" required value={formData.title} onChange={handleChange} className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-yellow-300 mb-1">Price (AED) *</label>
                  <input type="number" name="price" required value={formData.price} onChange={handleChange} className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-yellow-300 mb-1">Location *</label>
                  <input type="text" name="location" required value={formData.location} onChange={handleChange} className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-yellow-300 mb-1">Property Type *</label>
                  <input type="text" name="property_type" required value={formData.property_type} onChange={handleChange} placeholder="Apartment, Villa, Townhouse" className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-yellow-300 mb-1">Offer Type *</label>
                  <select name="offer_type" required value={formData.offer_type} onChange={handleChange} className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100">
                    <option value="Sale">Sale</option>
                    <option value="Rent">Rent</option>
                  </select>
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
                  <label className="block text-sm font-medium text-yellow-300 mb-1">Size (sq ft)</label>
                  <input type="number" name="size" value={formData.size} onChange={handleChange} className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                <div>
                  <label className="block text-sm font-medium text-yellow-300 mb-1">Area (Locality / Block)</label>
                  <input type="text" name="area" value={formData.area} onChange={handleChange} placeholder="e.g., Clifton Block 5" className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-yellow-300 mb-1">Developer *</label>
                  <select name="developer_id" value={formData.developer_id} onChange={(e)=>{ setFormData(prev=>({ ...prev, developer_id: e.target.value, project_id: '' })) }} className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100">
                    <option value="">{loadingDevelopers ? 'Loading developers...' : 'Select developer'}</option>
                    {developers.map(d => (
                      <option key={d._id || d.id} value={d.id || d._id}>{d.name || d.title || 'Unnamed Developer'}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-yellow-300 mb-1">Project</label>
                  <select name="project_id" value={formData.project_id} onChange={handleChange} disabled={!formData.developer_id || loadingProjects} className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100">
                    <option value="">{!formData.developer_id ? 'Select developer first' : (loadingProjects ? 'Loading projects...' : 'Select project')}</option>
                    {projects.map(p => (
                      <option key={p._id || p.id} value={p.id || p._id}>{p.title || p.name || 'Unnamed Project'}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-yellow-300 mb-1">Status *</label>
                <input type="text" name="status" placeholder="e.g., Ready Secondary" value={formData.status} onChange={handleChange} className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100" />
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

            {/* Image Upload */}
            <div className="border-b border-yellow-400/30 pb-6">
              <h4 className="text-md font-medium text-yellow-300 mb-4">Property Image</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-yellow-300 mb-1">Upload Image *</label>
                  <div className="flex items-center space-x-4">
                    <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
                    <button type="button" onClick={() => fileInputRef.current && fileInputRef.current.click()} className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-xl">{imageFile ? 'Change Image' : 'Select Image'}</button>
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

            {/* Form Actions */}
            <div className="flex justify-end space-x-4">
              <button type="button" onClick={handleCancelForm} className="px-6 py-3 border border-yellow-400/30 text-yellow-300 rounded-xl hover:bg-yellow-400/10 transition-colors">Cancel</button>
              <button type="submit" className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-xl hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300">{editingProperty ? 'Update Property' : 'Create Property'}</button>
            </div>
          </form>
        </div>
      )}

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
                    { key: 'property_type', label: 'Type', className: 'text-yellow-300' },
                    { key: 'price', label: 'Price', className: 'text-yellow-300 font-medium' },
                    { key: 'bedrooms', label: 'Beds', className: 'text-yellow-300/70' },
                    { key: 'bathrooms', label: 'Baths', className: 'text-yellow-300/70' },
                    { key: 'size', label: 'Size', className: 'text-yellow-300/70' }
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

export default PropertyManagement