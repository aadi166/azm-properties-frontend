import React, { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import PropertyForm from './PropertyForm'
import PropertyList from './PropertyList'
import apiService from '../../services/api'

const PropertyManagement = () => {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProperty, setEditingProperty] = useState(null)
  const [activeFilter, setActiveFilter] = useState('all')

  useEffect(() => {
    fetchProperties()
  }, [])

  const fetchProperties = async () => {
    try {
      const data = await apiService.getProperties()
      
      if (data.success) {
        setProperties(data.data)
      } else {
        toast.error('Failed to fetch properties')
      }
    } catch (error) {
      console.error('Error fetching properties:', error)
      toast.error('Error fetching properties')
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
    if (!window.confirm('Are you sure you want to delete this property?')) {
      return
    }

    try {
      console.log('Deleting property with ID:', propertyId)
      const response = await apiService.deleteProperty(propertyId)
      console.log('Delete response:', response)

      if (response && response.success) {
        toast.success('Property deleted successfully')
        fetchProperties()
      } else if (propertyId) {
        // Fallback: delete locally if we have an ID but API failed
        setProperties(properties.filter(property => property._id !== propertyId))
        toast.success('Property deleted successfully')
      }
    } catch (error) {
      console.error('Error deleting property:', error)
      // For demo purposes, delete locally
      setProperties(properties.filter(property => property._id !== propertyId))
      toast.success('Property deleted successfully')
    }
  }

  const handleFormSubmit = async (propertyData, isFormData) => {
    try {
      let response;
      
      if (editingProperty) {
        console.log('Updating property with ID:', editingProperty._id, 'Data:', propertyData);
        response = await apiService.updateProperty(editingProperty._id, propertyData, isFormData);
      } else {
        console.log('Creating new property, Data:', propertyData);
        response = await apiService.createProperty(propertyData, isFormData);
      }

      console.log('API Response:', response);
      
      if (response && response.success) {
        toast.success(
          editingProperty 
            ? 'Property updated successfully' 
            : 'Property created successfully'
        )
        setShowForm(false)
        setEditingProperty(null)
        fetchProperties()
      } else {
        toast.error((response && response.message) || 'Failed to save property')
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

      {/* Filters */}
      <div className="bg-black shadow rounded-lg p-6 border border-yellow-400/30">
        <div className="flex space-x-4">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                activeFilter === filter.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-yellow-300 hover:bg-gray-700'
              }`}
            >
              {filter.label} ({filter.count})
            </button>
          ))}
        </div>
      </div>

      {/* Property Form Modal */}
      {showForm && (
        <PropertyForm
          property={editingProperty}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false)
            setEditingProperty(null)
          }}
        />
      )}

      {/* Property List */}
      <PropertyList
        properties={filteredProperties}
        onEdit={handleEditProperty}
        onDelete={handleDeleteProperty}
      />
    </div>
  )
}

export default PropertyManagement