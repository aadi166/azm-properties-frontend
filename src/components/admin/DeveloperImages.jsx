import React, { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import apiService from '../../services/api'

const DeveloperImages = () => {
  const [developers, setDevelopers] = useState([])
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)
  const [selectedDeveloper, setSelectedDeveloper] = useState(null)
  const [storedImages, setStoredImages] = useState({})

  useEffect(() => {
    fetchDevelopers()
    loadStoredImages()
  }, [])

  const fetchDevelopers = async () => {
    try {
      setLoading(true)
      const response = await apiService.getDevelopers()
      if (response?.success && Array.isArray(response.data)) {
        setDevelopers(response.data)
      } else {
        setDevelopers([])
      }
    } catch (error) {
      console.error('Error fetching developers:', error)
      setDevelopers([])
    } finally {
      setLoading(false)
    }
  }

  const loadStoredImages = async () => {
    try {
      const response = await apiService.loadStoredDeveloperImages()
      if (response?.success && response.data) {
        setStoredImages(response.data)
      }
    } catch (error) {
      console.error('Error loading stored images:', error)
    }
  }

  const handleDownloadAllImages = async () => {
    try {
      setDownloading(true)
      toast.loading('Downloading all developer images...', { id: 'download-all' })

      const response = await apiService.downloadAllDeveloperImages()

      if (response?.success) {
        toast.success('All developer images downloaded successfully', { id: 'download-all' })
        await loadStoredImages() // Refresh stored images
      } else {
        toast.error(response?.message || 'Failed to download images', { id: 'download-all' })
      }
    } catch (error) {
      console.error('Error downloading all images:', error)
      toast.error('Error downloading images', { id: 'download-all' })
    } finally {
      setDownloading(false)
    }
  }

  const handleDownloadDeveloperImage = async (developerId, developerName, imageType) => {
    try {
      toast.loading(`Downloading ${imageType} for ${developerName}...`, { id: `download-${developerId}-${imageType}` })

      const response = await apiService.downloadDeveloperImage(
        null, // imageUrl - will be fetched from developer data
        developerId,
        developerName,
        imageType
      )

      if (response?.success) {
        toast.success(`${imageType} downloaded successfully for ${developerName}`, { id: `download-${developerId}-${imageType}` })
        await loadStoredImages() // Refresh stored images
      } else {
        toast.error(response?.message || `Failed to download ${imageType}`, { id: `download-${developerId}-${imageType}` })
      }
    } catch (error) {
      console.error(`Error downloading ${imageType}:`, error)
      toast.error(`Error downloading ${imageType}`, { id: `download-${developerId}-${imageType}` })
    }
  }

  const handleClearStoredImages = async () => {
    if (!window.confirm('Are you sure you want to clear all stored developer images?')) {
      return
    }

    try {
      const response = await apiService.clearStoredDeveloperImages()
      if (response?.success) {
        toast.success('Stored images cleared successfully')
        setStoredImages({})
      } else {
        toast.error('Failed to clear stored images')
      }
    } catch (error) {
      console.error('Error clearing stored images:', error)
      toast.error('Error clearing stored images')
    }
  }

  const getImageUrl = (developer, imageType) => {
    const developerId = developer._id || developer.id
    const storedImageKey = `${developerId}_${imageType}`

    // Check if we have a stored image
    if (storedImages[storedImageKey]) {
      return storedImages[storedImageKey]
    }

    // Fallback to API URLs
    if (imageType === 'logo') {
      return developer.logo_url || developer.logo
    } else if (imageType === 'cover') {
      return developer.cover_image_url || developer.cover_image
    }

    return null
  }

  const hasImage = (developer, imageType) => {
    const developerId = developer._id || developer.id
    const storedImageKey = `${developerId}_${imageType}`

    return storedImages[storedImageKey] ||
           (imageType === 'logo' && (developer.logo_url || developer.logo)) ||
           (imageType === 'cover' && (developer.cover_image_url || developer.cover_image))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-2xl shadow-2xl border border-yellow-400/30 backdrop-blur-sm">
        <div className="px-8 py-6 border-b border-yellow-400/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">
                Developer Images ({developers.length})
              </h3>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleClearStoredImages}
                className="flex items-center space-x-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2 rounded-lg transition-all duration-300 font-medium shadow-md hover:shadow-lg"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>Clear Cache</span>
              </button>
              <button
                onClick={handleDownloadAllImages}
                disabled={downloading}
                className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-4 py-2 rounded-lg hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300 font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {downloading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                )}
                <span>{downloading ? 'Downloading...' : 'Download All'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Developers Images Grid */}
      <div className="grid gap-6">
        {developers.length === 0 ? (
          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-2xl shadow-2xl border border-yellow-400/30 backdrop-blur-sm">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-yellow-400/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="text-yellow-300 text-lg font-medium">No developers found</div>
              <p className="text-yellow-300/60 mt-2">Add developers first to manage their images</p>
            </div>
          </div>
        ) : (
          developers.map((developer) => (
            <div
              key={developer._id || developer.id}
              className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-2xl shadow-2xl border border-yellow-400/30 backdrop-blur-sm overflow-hidden"
            >
              {/* Developer Header */}
              <div className="px-6 py-4 border-b border-yellow-400/20 bg-gradient-to-r from-yellow-400/5 to-yellow-600/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-yellow-300">{developer.name}</h3>
                      <p className="text-yellow-300/60 text-sm">
                        {developer.established_year ? `Est. ${developer.established_year}` : 'Year not specified'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      developer.published !== false
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {developer.published !== false ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Images Section */}
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Logo Image */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-md font-medium text-yellow-300">Logo</h4>
                      {hasImage(developer, 'logo') && (
                        <button
                          onClick={() => handleDownloadDeveloperImage(developer._id || developer.id, developer.name, 'logo')}
                          className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-3 py-1 rounded-lg text-sm transition-all duration-300"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span>Download</span>
                        </button>
                      )}
                    </div>
                    <div className="aspect-square bg-gray-900/50 rounded-xl border border-yellow-400/20 overflow-hidden">
                      {hasImage(developer, 'logo') ? (
                        <img
                          src={getImageUrl(developer, 'logo')}
                          alt={`${developer.name} Logo`}
                          className="w-full h-full object-contain p-4"
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE5IDIxVjVhMiAyIDAgMDAtMi0ySDdhMiAyIDAgMDAtMiAydjE2bTE0IDBoMm0tMiAwaC01bS05IDBIM20yIDBoNU05IDdoMW0tMSA0aDFtNC00aDFtLTEgNGgtNXYtNWExIDEgMCAwMTEtMWgyYTEgMSAwIDAxMSAxdi01bTQgMGg0IiBzdHJva2U9IiNlZmJmMDAiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo='
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-center">
                            <svg className="w-12 h-12 text-yellow-400/30 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-yellow-300/50 text-sm">No logo available</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Cover Image */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-md font-medium text-yellow-300">Cover Image</h4>
                      {hasImage(developer, 'cover') && (
                        <button
                          onClick={() => handleDownloadDeveloperImage(developer._id || developer.id, developer.name, 'cover')}
                          className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-3 py-1 rounded-lg text-sm transition-all duration-300"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span>Download</span>
                        </button>
                      )}
                    </div>
                    <div className="aspect-video bg-gray-900/50 rounded-xl border border-yellow-400/20 overflow-hidden">
                      {hasImage(developer, 'cover') ? (
                        <img
                          src={getImageUrl(developer, 'cover')}
                          alt={`${developer.name} Cover`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE5IDIxVjVhMiAyIDAgMDAtMi0ySDdhMiAyIDAgMDAtMiAydjE2bTE0IDBoMm0tMiAwaC01bS05IDBIM20yIDBoNU05IDdoMW0tMSA0aDFtNC00aDFtLTEgNGgtNXYtNWExIDEgMCAwMTEtMWgyYTEgMSAwIDAxMSAxdi01bTQgMGg0IiBzdHJva2U9IiNlZmJmMDAiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo='
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-center">
                            <svg className="w-12 h-12 text-yellow-400/30 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-yellow-300/50 text-sm">No cover image available</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default DeveloperImages