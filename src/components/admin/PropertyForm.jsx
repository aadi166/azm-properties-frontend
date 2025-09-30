import React, { useState, useEffect, useRef } from 'react'

const PropertyForm = ({ property, onSubmit, onCancel }) => {
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
    if (property) {
      setFormData({
        title: property.title || '',
        description: property.description || '',
        price: property.price || '',
        location: property.location || '',
        image: property.image || '',
        type: property.type || 'exclusive',
        bedrooms: property.bedrooms || '',
        bathrooms: property.bathrooms || '',
        area: property.area || '',
        features: property.features || [],
        status: property.status || 'available',
        developer: property.developer || '',
        completionDate: property.completionDate || '',
        paymentPlan: property.paymentPlan || '',
        roi: property.roi || ''
      })
      
      // Set image preview if property has an image
      if (property.image) {
        setImagePreview(property.image)
      }
    }
  }, [property])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      
      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }))
      setNewFeature('')
    }
  }

  const handleRemoveFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      // If we have a file, we need to use FormData to send it
      if (imageFile) {
        const formDataObj = new FormData()
        
        // Append all form fields
        Object.keys(formData).forEach(key => {
          if (key === 'features') {
            // Handle array data
            formData.features.forEach(feature => {
              formDataObj.append('features', feature)
            })
          } else if (key !== 'image') { // Skip image field as we'll append the file
            formDataObj.append(key, formData[key])
          }
        })
        
        // Append the image file
        formDataObj.append('image', imageFile)
        
        console.log('Submitting form with FormData')
        onSubmit(formDataObj, true) // true indicates FormData
      } else {
        // No file, just submit the regular form data
        console.log('Submitting form with JSON data:', formData)
        onSubmit(formData, false)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Error submitting form. Please try again.')
    }
  }

  return (
    <div className="bg-gray-800 rounded-2xl border border-yellow-400/30 max-w-4xl w-full mx-auto my-8 admin-modal-panel">
      <div className="sticky top-0 bg-gray-800 p-6 border-b border-yellow-400/30 rounded-t-2xl">
        <h3 className="text-xl font-bold text-yellow-300">
          {property ? 'Edit Property' : 'Add New Property'}
        </h3>
      </div>

      <div className="modal-body max-h-96 overflow-y-auto">
        <form id="propertyForm" onSubmit={handleSubmit} className="space-y-6 p-6">
          {/* Basic Information */}
          <div className="border-b border-yellow-400/30 pb-6">
            <h4 className="text-md font-medium text-yellow-300 mb-4">Basic Information</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-yellow-300 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100 placeholder-yellow-300/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300 backdrop-blur-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-yellow-300 mb-1">
                  Property Type *
                </label>
                <select
                  name="type"
                  required
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300 backdrop-blur-sm"
                >
                  <option value="exclusive">Exclusive Property</option>
                  <option value="off-plan">Off-Plan Property</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-yellow-300 mb-1">
                  Price (AED) *
                </label>
                <input
                  type="number"
                  name="price"
                  required
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100 placeholder-yellow-300/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300 backdrop-blur-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-yellow-300 mb-1">
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100 placeholder-yellow-300/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300 backdrop-blur-sm"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-yellow-300 mb-1">
                Description *
              </label>
              <textarea
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100 placeholder-yellow-300/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300 backdrop-blur-sm"
              />
            </div>
          </div>

          {/* Property Details */}
          <div className="border-b border-yellow-400/30 pb-6">
            <h4 className="text-md font-medium text-yellow-300 mb-4">Property Details</h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-yellow-300 mb-1">
                  Bedrooms
                </label>
                <input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100 placeholder-yellow-300/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300 backdrop-blur-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-yellow-300 mb-1">
                  Bathrooms
                </label>
                <input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100 placeholder-yellow-300/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300 backdrop-blur-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-yellow-300 mb-1">
                  Area (sq ft)
                </label>
                <input
                  type="number"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100 placeholder-yellow-300/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300 backdrop-blur-sm"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-yellow-300 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300 backdrop-blur-sm"
              >
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
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Add a feature"
                className="flex-1 bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100 placeholder-yellow-300/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300 backdrop-blur-sm"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-xl hover:from-yellow-300 hover:to-yellow-400 font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.features.map((feature, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-400/20 text-yellow-300 border border-yellow-400/30"
                >
                  {feature}
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(index)}
                    className="ml-2 text-yellow-400 hover:text-yellow-200"
                  >
                    ×
                  </button>
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
                  <label className="block text-sm font-medium text-yellow-300 mb-1">
                    Developer
                  </label>
                  <input
                    type="text"
                    name="developer"
                    value={formData.developer}
                    onChange={handleChange}
                    className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100 placeholder-yellow-300/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300 backdrop-blur-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-yellow-300 mb-1">
                    Completion Date
                  </label>
                  <input
                    type="date"
                    name="completionDate"
                    value={formData.completionDate}
                    onChange={handleChange}
                    className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300 backdrop-blur-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-yellow-300 mb-1">
                    ROI (%)
                  </label>
                  <input
                    type="number"
                    name="roi"
                    step="0.1"
                    value={formData.roi}
                    onChange={handleChange}
                    className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100 placeholder-yellow-300/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300 backdrop-blur-sm"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-yellow-300 mb-1">
                  Payment Plan
                </label>
                <textarea
                  name="paymentPlan"
                  rows={3}
                  value={formData.paymentPlan}
                  onChange={handleChange}
                  placeholder="e.g., 10% on booking, 40% during construction, 50% on completion"
                  className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100 placeholder-yellow-300/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300 backdrop-blur-sm"
                />
              </div>
            </div>
          )}

          {/* Image Upload */}
          <div className="border-b border-yellow-400/30 pb-6">
            <h4 className="text-md font-medium text-yellow-300 mb-4">Property Image</h4>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-yellow-300 mb-1">
                  Upload Image *
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-xl hover:from-yellow-300 hover:to-yellow-400 font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    {imageFile ? 'Change Image' : 'Select Image'}
                  </button>
                  {imagePreview && (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Property preview"
                        className="h-20 w-20 object-cover rounded-xl border border-yellow-400/30"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null)
                          setImagePreview('')
                          if (fileInputRef.current) {
                            fileInputRef.current.value = ''
                          }
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
                {!imagePreview && !imageFile && formData.image && (
                  <p className="text-sm text-yellow-300/60 mt-1">Current image will be used</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-yellow-300 mb-1">
                  Or Image URL
                </label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100 placeholder-yellow-300/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300 backdrop-blur-sm"
                />
              </div>
            </div>
          </div>
        </form>
      </div>

      <div className="modal-footer sticky bottom-0 bg-gray-800 p-6 border-t border-yellow-400/30 rounded-b-2xl">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 border border-yellow-400/30 text-yellow-300 rounded-xl hover:bg-yellow-400/10 transition-all duration-300 backdrop-blur-sm"
        >
          Cancel
        </button>
        <button
          type="submit"
          form="propertyForm"
          className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-xl hover:from-yellow-300 hover:to-yellow-400 font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          {property ? 'Update Property' : 'Create Property'}
        </button>
      </div>
    </div>
  )
}

export default PropertyForm