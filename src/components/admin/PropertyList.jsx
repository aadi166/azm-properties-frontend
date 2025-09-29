import React from 'react'

const PropertyList = ({ properties, onEdit, onDelete }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 0
    }).format(price)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusBadge = (status) => {
    const statusColors = {
      available: 'bg-green-100 text-green-800',
      sold: 'bg-red-100 text-red-800',
      reserved: 'bg-yellow-100 text-yellow-800'
    }
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        statusColors[status] || 'bg-gray-100 text-gray-800'
      }`}>
        {status?.charAt(0).toUpperCase() + status?.slice(1) || 'Unknown'}
      </span>
    )
  }

  const getTypeBadge = (type) => {
    const typeColors = {
      exclusive: 'bg-blue-100 text-blue-800',
      'off-plan': 'bg-purple-100 text-purple-800'
    }
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        typeColors[type] || 'bg-gray-100 text-gray-800'
      }`}>
        {type === 'off-plan' ? 'Off-Plan' : 'Exclusive'}
      </span>
    )
  }

  if (properties.length === 0) {
    return (
      <div className="bg-black shadow rounded-lg p-6 border border-yellow-400/30">
        <div className="text-center py-12">
          <div className="text-yellow-400 text-6xl mb-4">🏢</div>
          <h3 className="text-lg font-medium text-yellow-400 mb-2">No properties found</h3>
          <p className="text-yellow-300/70">Get started by adding your first property.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-black shadow rounded-lg overflow-hidden border border-yellow-400/30">
      <div className="px-6 py-4 border-b border-yellow-400/30">
        <h3 className="text-lg font-medium text-green-400">
          Properties ({properties.length})
        </h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-yellow-400/30">
          <thead className="bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">
                Property
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">
                Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-yellow-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-black divide-y divide-yellow-400/30">
            {properties.map((property) => (
              <tr key={property._id} className="hover:bg-gray-800">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12">
                      {property.image ? (
                        <img
                          className="h-12 w-12 rounded-lg object-cover"
                          src={property.image}
                          alt={property.title}
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=48&h=48&fit=crop'
                          }}
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-lg bg-gray-700 flex items-center justify-center">
                          <span className="text-yellow-400 text-xs">No Image</span>
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-yellow-300 max-w-xs truncate">
                        {property.title}
                      </div>
                      <div className="text-sm text-yellow-300/70 max-w-xs truncate">
                        {property.description}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getTypeBadge(property.type)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-yellow-300">
                    {formatPrice(property.price)}
                  </div>
                  {property.roi && (
                    <div className="text-sm text-green-400">
                      ROI: {property.roi}%
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-yellow-300">{property.location}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-yellow-300">
                    {property.bedrooms && `${property.bedrooms} bed`}
                    {property.bedrooms && property.bathrooms && ' • '}
                    {property.bathrooms && `${property.bathrooms} bath`}
                  </div>
                  {property.area && (
                    <div className="text-sm text-yellow-300/70">
                      {property.area.toLocaleString()} sq ft
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(property.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-300/70">
                  {formatDate(property.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => onEdit(property)}
                      className="text-yellow-400 hover:text-yellow-300 transition-colors flex items-center space-x-1 mr-3"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => onDelete(property._id || property.id)}
                      className="text-red-400 hover:text-red-300 transition-colors flex items-center space-x-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span>Delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default PropertyList