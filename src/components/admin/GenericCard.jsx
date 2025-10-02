import React from 'react'
import { API_CONFIG } from '../../services/api'

const GenericCard = ({
  item,
  type,
  onEdit,
  onDelete,
  onPublishToggle,
  onView,
  fields = [],
  imageField,
  titleField,
  subtitleField,
  descriptionField,
  dateField,
  statusField,
  actions = []
}) => {
  // Safety check for item
  if (!item || typeof item !== 'object') {
    console.warn('GenericCard: Invalid item data', item)
    return null
  }

  console.log('GenericCard rendering:', type, item._id, item[titleField] || item.name || item.title)
  const getStatusBadge = (status, published) => {
    if (published !== undefined) {
      return (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
          published !== false
            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
            : 'bg-red-500/20 text-red-400 border border-red-500/30'
        }`}>
          {published !== false ? 'Published' : 'Unpublished'}
        </span>
      )
    }

    if (status) {
      const statusColors = {
        new: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
        contacted: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
        resolved: 'bg-green-500/20 text-green-400 border border-green-500/30'
      }
      return (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[status] || 'bg-gray-500/20 text-gray-400 border border-gray-500/30'}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      )
    }

    return null
  }

  const getActionButton = (action) => {
    const actionConfigs = {
      publish: {
        icon: item.published !== false ? (
          <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
          </svg>
        ) : (
          <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        ),
        className: `p-3 rounded-xl transition-all duration-300 hover:scale-110 group ${
          item.published !== false
            ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400'
            : 'bg-green-500/20 hover:bg-green-500/30 text-green-400'
        }`,
        title: item.published !== false ? `Unpublish ${type}` : `Publish ${type}`,
        onClick: () => onPublishToggle(item._id, item.published)
      },
      edit: {
        icon: (
          <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        ),
        className: "p-3 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-xl transition-all duration-300 hover:scale-110 group",
        title: `Edit ${type}`,
        onClick: () => onEdit(item)
      },
      delete: {
        icon: (
          <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        ),
        className: "p-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl transition-all duration-300 hover:scale-110 group",
        title: `Delete ${type}`,
        onClick: () => onDelete(item._id)
      },
      view: {
        icon: (
          <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        ),
        className: "p-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-xl transition-all duration-300 hover:scale-110 group",
        title: `View ${type}`,
        onClick: () => onView(item)
      }
    }

    return actionConfigs[action]
  }

  const renderField = (field) => {
    try {
      if (field.key === 'image' && imageField) {
        const imageUrl = item[imageField] || item.image_url
        if (imageUrl) {
          const fullUrl = imageUrl.startsWith('http') ? imageUrl : `${API_CONFIG.BASE_URL}${imageUrl}`
          return (
            <img
              src={fullUrl}
              alt={item[titleField] || item.name || item.title || 'Image'}
              className="h-12 w-12 rounded-full object-cover border border-yellow-400/30"
              onError={(e) => {
                e.target.style.display = 'none'
              }}
            />
          )
        }
      }

      if (field.key === 'status') {
        return getStatusBadge(item[statusField || 'status'], item.published)
      }

      if (field.key === 'date' && dateField) {
        try {
          const date = new Date(item[dateField])
          return (
            <span className="text-yellow-300/60 text-sm">
              {date.toLocaleDateString()}
            </span>
          )
        } catch (error) {
          console.warn('Invalid date for field:', dateField, item[dateField])
          return null
        }
      }

      if (field.key === 'price' && item[field.key]) {
        const price = item[field.key]
        const formattedPrice = new Intl.NumberFormat('en-AE', {
          style: 'currency',
          currency: 'AED',
          minimumFractionDigits: 0
        }).format(price)

        return (
          <div className={`text-sm ${field.className || 'text-yellow-300'}`}>
            {field.label && <span className="font-medium">{field.label}: </span>}
            <span>{formattedPrice}</span>
            {item.roi && <div className="text-green-400 text-xs">ROI: {item.roi}%</div>}
          </div>
        )
      }

      if (field.key === 'type') {
        const typeValue = item[field.key]
        const typeLabel = typeValue === 'off-plan' ? 'Off-Plan' : typeValue === 'exclusive' ? 'Exclusive' : typeValue
        return (
          <div className={`text-sm ${field.className || 'text-yellow-300'}`}>
            {field.label && <span className="font-medium">{field.label}: </span>}
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
              typeValue === 'off-plan' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
              typeValue === 'exclusive' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
              'bg-gray-500/20 text-gray-400 border border-gray-500/30'
            }`}>
              {typeLabel}
            </span>
          </div>
        )
      }

      const value = field.key.includes('.') 
        ? field.key.split('.').reduce((obj, key) => obj && obj[key], item)
        : item[field.key]

      if (!value && value !== 0) return null

      // Handle arrays (like tags)
      const displayValue = Array.isArray(value) ? value.join(', ') : String(value)

      return (
        <div className={`text-sm ${field.className || 'text-yellow-300'}`}>
          {field.label && <span className="font-medium">{field.label}: </span>}
          {field.truncate ? (
            <span className="max-w-xs truncate" title={displayValue}>{displayValue}</span>
          ) : (
            <span>{displayValue}</span>
          )}
        </div>
      )
    } catch (error) {
      console.error('Error rendering field:', field.key, error)
      return null
    }
  }

  return (
    <div className="bg-gradient-to-r from-gray-900/60 to-gray-800/60 p-6 rounded-xl border border-yellow-400/20 hover:border-yellow-400/40 transition-all duration-300 hover:shadow-lg backdrop-blur-sm">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          {/* Header with image and title */}
          <div className="flex items-center space-x-4 mb-3">
            {imageField && renderField({ key: 'image' })}
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <h4 className="text-xl font-bold text-yellow-300 hover:text-yellow-400 transition-colors">
                  {item[titleField] || item.name || item.title || 'Untitled'}
                </h4>
                {(statusField || item.published !== undefined) && renderField({ key: 'status' })}
              </div>
              {subtitleField && item[subtitleField] && (
                <p className="text-yellow-400/70 text-sm mt-1">{item[subtitleField]}</p>
              )}
            </div>
          </div>

          {/* Description */}
          {descriptionField && item[descriptionField] && (
            <p className="text-yellow-200/70 text-sm mb-4 italic">
              {descriptionField === 'comments' ? `"${item[descriptionField]}"` : item[descriptionField]}
            </p>
          )}

          {/* Additional fields */}
          <div className="flex items-center space-x-4 text-sm text-yellow-300/60 mb-4">
            {fields.map((field, index) => (
              <React.Fragment key={field.key}>
                {renderField(field)}
                {index < fields.length - 1 && <span>•</span>}
              </React.Fragment>
            ))}
          </div>

          {/* Date */}
          {dateField && renderField({ key: 'date' })}
        </div>

        {/* Action buttons */}
        <div className="flex items-center space-x-3 ml-6">
          {actions.map(action => {
            const config = getActionButton(action)
            return config ? (
              <button
                key={action}
                onClick={config.onClick}
                className={config.className}
                title={config.title}
              >
                {config.icon}
              </button>
            ) : null
          })}
        </div>
      </div>
    </div>
  )
}

export default GenericCard