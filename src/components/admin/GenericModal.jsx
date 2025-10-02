import React, { useEffect, useState, useCallback } from 'react'

const GenericModal = ({
  isOpen,
  onClose,
  title,
  sections = [],
  onSubmit,
  submitButtonText = 'Save',
  cancelButtonText = 'Cancel',
  formData: controlledFormData, // optional controlled pattern
  onFormChange,
  children,
  initialData = {},
  size = 'xl', // sm | md | lg | xl | 2xl
  maxHeight = '90vh',
  preventBodyScroll = true,
  showCloseButton = true
}) => {
  if (!isOpen) return null

  // Internal state if a fully controlled formData isn't provided
  const [internalData, setInternalData] = useState(initialData)

  // Reset internal state when opening or initialData changes
  useEffect(() => {
    if (isOpen) {
      setInternalData(initialData || {})
    }
  }, [isOpen, initialData])

  // Manage body scroll lock
  useEffect(() => {
    if (isOpen && preventBodyScroll) {
      const original = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = original }
    }
  }, [isOpen, preventBodyScroll])

  const data = controlledFormData !== undefined ? controlledFormData : internalData

  const updateField = useCallback((event) => {
    if (!event) return
    const { name, type, value, checked, files } = event.target
    let newValue
    if (type === 'checkbox') newValue = checked
    else if (type === 'file') newValue = files && files[0]
    else newValue = value

    const updater = (prev) => ({ ...prev, [name]: newValue })

    if (controlledFormData !== undefined && onFormChange) {
      // delegate up
      onFormChange(event)
    } else {
      setInternalData(prev => updater(prev))
    }
  }, [controlledFormData, onFormChange])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(data)
  }

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      e.stopPropagation()
      onClose && onClose()
    }
  }, [onClose])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Size map for panel width
  const sizeMap = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    '2xl': 'max-w-6xl'
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal Panel */}
      <div
        className={`relative w-full ${sizeMap[size] || sizeMap.xl} mx-4 rounded-2xl border border-yellow-400/30 bg-gray-800 shadow-2xl flex flex-col overflow-hidden animate-scaleIn`}
        style={{ maxHeight }}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gray-800/95 backdrop-blur px-6 py-5 border-b border-yellow-400/30 flex items-start justify-between rounded-t-2xl">
          <div>
            <h3 className="text-xl font-bold text-yellow-300">{title}</h3>
          </div>
          {showCloseButton && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="text-yellow-300/70 hover:text-yellow-200 transition-colors p-2 rounded-lg hover:bg-yellow-400/10"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 pt-4 custom-scrollbar">
          <form onSubmit={handleSubmit} className="space-y-6" id="generic-modal-form">
            {sections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="border-b border-yellow-400/30 pb-6 last:border-b-0">
                {section.title && (
                  <h4 className="text-md font-medium text-yellow-300 mb-4">{section.title}</h4>
                )}

                {section.fields && section.fields.map((field, fieldIndex) => {
                  const value = data[field.name] ?? ''
                  return (
                    <div key={fieldIndex} className={field.wrapperClass || 'mb-4'}>
                      {field.type !== 'checkbox' && field.type !== 'hidden' && (
                        <label className="block text-sm font-medium text-yellow-300 mb-1">
                          {field.label} {field.required && '*'}
                        </label>
                      )}

                      {field.type === 'textarea' && (
                        <textarea
                          name={field.name}
                          value={value}
                          onChange={updateField}
                          required={field.required}
                          rows={field.rows || 4}
                          placeholder={field.placeholder}
                          className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100 placeholder-yellow-300/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300 backdrop-blur-sm"
                        />
                      )}

                      {field.type === 'select' && (
                        <select
                          name={field.name}
                          value={value}
                          onChange={updateField}
                          required={field.required}
                          className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300 backdrop-blur-sm"
                        >
                          {(field.options || []).map((option, optionIndex) => (
                            <option key={optionIndex} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                      )}

                      {field.type === 'checkbox' && (
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            id={field.name}
                            name={field.name}
                            checked={!!value}
                            onChange={updateField}
                            className="w-5 h-5 text-yellow-400 bg-gray-900 border-yellow-400/30 rounded focus:ring-yellow-400 focus:ring-2"
                          />
                          <label htmlFor={field.name} className="text-sm font-medium text-yellow-300 cursor-pointer">
                            {field.label}
                          </label>
                        </div>
                      )}

                      {field.type === 'file' && (
                        <input
                          type="file"
                          name={field.name}
                          accept={field.accept || 'image/*'}
                          onChange={updateField}
                          className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-400 file:text-gray-900 hover:file:bg-yellow-300 transition-all duration-300 backdrop-blur-sm"
                        />
                      )}

                      {(!['textarea','select','checkbox','file'].includes(field.type)) && (
                        <input
                          type={field.type || 'text'}
                          name={field.name}
                          value={value}
                          onChange={updateField}
                          required={field.required}
                          placeholder={field.placeholder}
                          min={field.min}
                          max={field.max}
                          step={field.step}
                          className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100 placeholder-yellow-300/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300 backdrop-blur-sm"
                        />
                      )}

                      {field.helpText && (
                        <p className="text-xs text-yellow-300/60 mt-1">{field.helpText}</p>
                      )}
                    </div>
                  )
                })}

                {section.customContent && section.customContent(data, updateField)}
              </div>
            ))}

            {children}
          </form>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-800/95 backdrop-blur px-6 py-5 border-t border-yellow-400/30 flex items-center justify-end space-x-4 rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 border border-yellow-400/30 text-yellow-300 rounded-xl hover:bg-yellow-400/10 transition-all duration-300 backdrop-blur-sm"
          >
            {cancelButtonText}
          </button>
          <button
            type="submit"
            form="generic-modal-form"
            className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-xl hover:from-yellow-300 hover:to-yellow-400 font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            {submitButtonText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default GenericModal