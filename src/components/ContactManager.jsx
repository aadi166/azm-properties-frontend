import React, { useState, useEffect } from 'react'

const ContactManager = () => {
  const [contactInfo, setContactInfo] = useState({
    phone: '+971 50 123 4567',
    email: 'info@amzproperties.ae',
    address: 'Dubai Marina, Dubai, UAE',
    whatsapp: '+971 50 123 4567',
    instagram: '@amzproperties',
    facebook: 'AMZ Properties Dubai',
    linkedin: 'AMZ Properties',
    workingHours: 'Mon - Fri: 9:00 AM - 6:00 PM'
  })
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(contactInfo)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    // Load contact info from localStorage or API
    const savedContactInfo = localStorage.getItem('contactInfo')
    if (savedContactInfo) {
      const parsed = JSON.parse(savedContactInfo)
      setContactInfo(parsed)
      setFormData(parsed)
    }
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Save to localStorage (you can replace this with API call)
      localStorage.setItem('contactInfo', JSON.stringify(formData))
      setContactInfo(formData)
      setIsEditing(false)
      
      // Show success message
      alert('Contact information updated successfully!')
    } catch (error) {
      console.error('Error saving contact info:', error)
      alert('Error saving contact information')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setFormData(contactInfo)
    setIsEditing(false)
  }

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Contact Information Management</h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Edit Contact Info
          </button>
        ) : (
          <div className="space-x-2">
            <button
              onClick={handleCancel}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-6">Contact Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            {isEditing ? (
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <div className="p-3 bg-gray-50 rounded-md">{contactInfo.phone}</div>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            {isEditing ? (
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <div className="p-3 bg-gray-50 rounded-md">{contactInfo.email}</div>
            )}
          </div>

          {/* WhatsApp */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              WhatsApp Number
            </label>
            {isEditing ? (
              <input
                type="tel"
                value={formData.whatsapp}
                onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <div className="p-3 bg-gray-50 rounded-md">{contactInfo.whatsapp}</div>
            )}
          </div>

          {/* Working Hours */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Working Hours
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.workingHours}
                onChange={(e) => handleInputChange('workingHours', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <div className="p-3 bg-gray-50 rounded-md">{contactInfo.workingHours}</div>
            )}
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Office Address
            </label>
            {isEditing ? (
              <textarea
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <div className="p-3 bg-gray-50 rounded-md">{contactInfo.address}</div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-6">Social Media</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Instagram */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instagram Handle
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.instagram}
                onChange={(e) => handleInputChange('instagram', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="@username"
              />
            ) : (
              <div className="p-3 bg-gray-50 rounded-md">{contactInfo.instagram}</div>
            )}
          </div>

          {/* Facebook */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Facebook Page
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.facebook}
                onChange={(e) => handleInputChange('facebook', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <div className="p-3 bg-gray-50 rounded-md">{contactInfo.facebook}</div>
            )}
          </div>

          {/* LinkedIn */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              LinkedIn Profile
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.linkedin}
                onChange={(e) => handleInputChange('linkedin', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <div className="p-3 bg-gray-50 rounded-md">{contactInfo.linkedin}</div>
            )}
          </div>
        </div>
      </div>

      {/* Preview Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-6">Contact Information Preview</h3>
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Phone:</strong> {isEditing ? formData.phone : contactInfo.phone}
            </div>
            <div>
              <strong>Email:</strong> {isEditing ? formData.email : contactInfo.email}
            </div>
            <div>
              <strong>WhatsApp:</strong> {isEditing ? formData.whatsapp : contactInfo.whatsapp}
            </div>
            <div>
              <strong>Hours:</strong> {isEditing ? formData.workingHours : contactInfo.workingHours}
            </div>
            <div className="md:col-span-2">
              <strong>Address:</strong> {isEditing ? formData.address : contactInfo.address}
            </div>
            <div>
              <strong>Instagram:</strong> {isEditing ? formData.instagram : contactInfo.instagram}
            </div>
            <div>
              <strong>Facebook:</strong> {isEditing ? formData.facebook : contactInfo.facebook}
            </div>
            <div>
              <strong>LinkedIn:</strong> {isEditing ? formData.linkedin : contactInfo.linkedin}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactManager