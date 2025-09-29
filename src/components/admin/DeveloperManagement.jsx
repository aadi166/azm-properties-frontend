import React, { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import apiService from '../../services/api'

const DeveloperManagement = () => {
  const [developers, setDevelopers] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingDeveloper, setEditingDeveloper] = useState(null)
  const [loading, setLoading] = useState(false)
  const [projectsList, setProjectsList] = useState([])
  const [selectedProjectIds, setSelectedProjectIds] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    established_year: '',
    about: '',
    projects_count: {
      total: 0,
      completed: 0,
      in_progress: 0
    },
    contact_info: {
      email: '',
      mobile_no: '',
      address: ''
    },
    logo: null,
    cover_image: null,
    image: null,
    website: '',
    email: '', // backward compatibility
    mobile_no: '', // backward compatibility
    address: '' // backward compatibility
  })

  useEffect(() => {
    fetchDevelopers()
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const res = await apiService.getProjects({ limit: 1000 })
      const data = res?.data || []
      setProjectsList(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to fetch projects for developer form:', err)
      setProjectsList([])
    }
  }

  const fetchDevelopers = async () => {
    try {
      setLoading(true)
      const response = await apiService.getDevelopers()
      
      if (response?.success && Array.isArray(response.data)) {
        setDevelopers(response.data)
      } else {
        console.warn('Invalid API response for developers')
        setDevelopers([])
      }
    } catch (error) {
      console.error('Error fetching developers:', error)
      toast.error('Failed to fetch developers')
      setDevelopers([])
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target

    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else if (type === 'file') {
      setFormData(prev => ({ ...prev, [name]: files[0] }))
    } else if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'number' ? (value === '' ? 0 : Number(value)) : value
        }
      }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      // Check for duplicate developer name (only for new developers)
      if (!editingDeveloper) {
        const duplicateDeveloper = developers.find(developer => 
          developer.name.toLowerCase().trim() === formData.name.toLowerCase().trim()
        )
        
        if (duplicateDeveloper) {
          toast.error(`Developer name "${formData.name}" already exists. Please choose a different name.`)
          return
        }
      }

      // Prepare form data
      const submitData = new FormData()
      
  // Add basic fields
  // Per backend contract: treat `about` form field as the developer `name` when sending to API
  const apiName = formData.about && formData.about.trim() ? formData.about : formData.name
  submitData.append('name', apiName)
  submitData.append('description', formData.description)
  submitData.append('established_year', formData.established_year)
  // Keep about locally for backward compatibility but do not send it separately as API expects 'name'
  submitData.append('website', formData.website)
      
      // Add nested objects as JSON strings
      submitData.append('projects_count', JSON.stringify(formData.projects_count))
      submitData.append('contact_info', JSON.stringify(formData.contact_info))

      // Include selected project ids (both as array JSON and as repeated fields 'projects[]')
      if (selectedProjectIds && Array.isArray(selectedProjectIds) && selectedProjectIds.length > 0) {
        submitData.append('projects', JSON.stringify(selectedProjectIds))
        selectedProjectIds.forEach(pid => submitData.append('projects[]', pid))
      }
      
      // Add backward compatibility fields
      submitData.append('email', formData.email || formData.contact_info.email)
      submitData.append('mobile_no', formData.mobile_no || formData.contact_info.mobile_no)
      submitData.append('address', formData.address || formData.contact_info.address)
      
      // Add files if present
      if (formData.logo) {
        submitData.append('logo', formData.logo)
      }
      if (formData.cover_image) {
        submitData.append('cover_image', formData.cover_image)
      }
      if (formData.image) {
        submitData.append('image', formData.image)
      }

      let response
      if (editingDeveloper) {
        response = await apiService.updateDeveloper(editingDeveloper._id, submitData)
      } else {
        response = await apiService.createDeveloper(submitData)
      }
      
      if (response && response.success) {
        toast.success(`Developer ${editingDeveloper ? 'updated' : 'created'} successfully`)
        
        // Close form and refresh developers list
        setShowForm(false)
        setEditingDeveloper(null)
        resetForm()
        
        // Refresh the developers list
        await fetchDevelopers()
        // clear selected projects after successful save
        setSelectedProjectIds([])
      } else {
        const errorMessage = response?.message || 'Failed to save developer'
        toast.error(errorMessage)
      }
    } catch (error) {
      console.error('Error saving developer:', error)
      toast.error(error.message || 'Error saving developer. Please try again.')
    }
  }

  const handleEdit = (developer) => {
    setEditingDeveloper(developer)
    setFormData({
      name: developer.name,
      description: developer.description,
      established_year: developer.established_year || '',
      // Map stored developer.name into about field for editing (treat `about` as name)
      about: developer.name || developer.about || '',
      projects_count: developer.projects_count || {
        total: 0,
        completed: 0,
        in_progress: 0
      },
      contact_info: developer.contact_info || {
        email: '',
        mobile_no: '',
        address: ''
      },
      logo: null,
      cover_image: null,
      image: null,
      website: developer.website || '',
      email: developer.email || '', // backward compatibility
      mobile_no: developer.mobile_no || '', // backward compatibility
      address: developer.address || '' // backward compatibility
    })
    // Prefill selected projects from developer record if available
    const existingProjectIds = []
    if (Array.isArray(developer.projects)) {
      developer.projects.forEach(p => {
        if (typeof p === 'string') existingProjectIds.push(p)
        else if (p && (p._id || p.id)) existingProjectIds.push(p._id || p.id)
      })
    } else if (Array.isArray(developer.project_ids)) {
      developer.project_ids.forEach(pid => existingProjectIds.push(pid))
    } else if (Array.isArray(developer.projects_ids)) {
      developer.projects_ids.forEach(pid => existingProjectIds.push(pid))
    }
    setSelectedProjectIds(existingProjectIds)
    setShowForm(true)
  }

  const handleDelete = async (developerId) => {
    if (!window.confirm('Are you sure you want to delete this developer?')) {
      return
    }

    try {
      const response = await apiService.deleteDeveloper(developerId)
      
      if (response.success) {
        toast.success('Developer deleted successfully')
        // Immediately remove developer from the list
        setDevelopers(prev => prev.filter(developer => developer._id !== developerId))
      } else {
        toast.error(response.message || 'Failed to delete developer')
      }
    } catch (error) {
      console.error('Error deleting developer:', error)
      toast.error('Error deleting developer')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      established_year: '',
      about: '',
      projects_count: {
        total: 0,
        completed: 0,
        in_progress: 0
      },
      contact_info: {
        email: '',
        mobile_no: '',
        address: ''
      },
      logo: null,
      cover_image: null,
      image: null,
      website: '',
      email: '', // backward compatibility
      mobile_no: '', // backward compatibility
      address: '' // backward compatibility
    })
    setSelectedProjectIds([])
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">Developer Management</h2>
          <p className="text-yellow-300/80 mt-1">Manage property developers and their information</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-6 py-3 rounded-xl hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Add New Developer</span>
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-2xl border border-yellow-400/30 max-w-4xl w-full max-h-[90vh] admin-modal-panel">
            <div className="sticky top-0 bg-gray-800 p-6 border-b border-yellow-400/30 rounded-t-2xl">
              <h3 className="text-xl font-bold text-yellow-300">
                {editingDeveloper ? 'Edit Developer' : 'Add New Developer'}
              </h3>
            </div>

            <div className="modal-body">
              <form id="developerForm" onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="border-b border-yellow-400/30 pb-6">
                  <h4 className="text-md font-medium text-yellow-300 mb-4">Basic Information</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-yellow-300 mb-1">
                        Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className={`w-full bg-gray-900/50 border rounded-xl px-4 py-3 text-yellow-100 placeholder-yellow-300/50 focus:outline-none focus:ring-2 transition-all duration-300 backdrop-blur-sm ${
                          !editingDeveloper && formData.name && developers.find(developer => 
                            developer.name.toLowerCase().trim() === formData.name.toLowerCase().trim()
                          ) 
                            ? 'border-red-400/50 focus:ring-red-400 focus:border-red-400' 
                            : 'border-yellow-400/30 focus:ring-yellow-400 focus:border-yellow-400'
                        }`}
                      />
                      {!editingDeveloper && formData.name && developers.find(developer => 
                        developer.name.toLowerCase().trim() === formData.name.toLowerCase().trim()
                      ) && (
                        <p className="text-red-400 text-xs mt-1 flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          This developer name already exists
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-yellow-300 mb-1">
                        Established Year *
                      </label>
                      <input
                        type="number"
                        name="established_year"
                        value={formData.established_year}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g., 1995"
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
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100 placeholder-yellow-300/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300 backdrop-blur-sm"
                    />
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-yellow-300 mb-1">
                      About *
                    </label>
                    <textarea
                      name="about"
                      value={formData.about}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100 placeholder-yellow-300/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300 backdrop-blur-sm"
                    />
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-yellow-300 mb-1">
                      Website
                    </label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100 placeholder-yellow-300/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300 backdrop-blur-sm"
                    />
                  </div>
                </div>

                {/* Projects association */}
                <div className="border-b border-yellow-400/30 pb-6">
                  <h4 className="text-md font-medium text-yellow-300 mb-4">Associated Projects</h4>
                  <p className="text-yellow-300/70 text-sm mb-3">Select projects this developer is involved in (multiple selection supported).</p>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => setSelectedProjectIds(projectsList.map(p => p._id || p.id))}
                        className="px-3 py-1 bg-yellow-400 text-gray-900 rounded-lg text-sm"
                      >Select All</button>
                      <button
                        type="button"
                        onClick={() => setSelectedProjectIds([])}
                        className="px-3 py-1 bg-gray-700 text-yellow-300 rounded-lg text-sm border border-yellow-400/20"
                      >Clear</button>
                    </div>

                    <div className="max-h-48 overflow-y-auto pr-2">
                      {projectsList.length === 0 ? (
                        <p className="text-yellow-300/60 text-sm">No projects available</p>
                      ) : (
                        projectsList.map(project => {
                          const pid = project._id || project.id
                          const label = project.title || project.name || pid
                          const checked = selectedProjectIds.includes(pid)
                          return (
                            <label key={pid} className="flex items-center space-x-3 py-1">
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={(e) => {
                                  if (e.target.checked) setSelectedProjectIds(prev => Array.from(new Set([...prev, pid])))
                                  else setSelectedProjectIds(prev => prev.filter(x => x !== pid))
                                }}
                                className="form-checkbox h-4 w-4 text-yellow-400 bg-gray-900 border-yellow-400/30"
                              />
                              <span className="text-yellow-100 text-sm">{label}</span>
                            </label>
                          )
                        })
                      )}
                    </div>
                  </div>
                </div>

                {/* Project Statistics */}
                <div className="border-b border-yellow-400/30 pb-6">
                  <h4 className="text-md font-medium text-yellow-300 mb-4">Project Statistics</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-yellow-300 mb-1">
                        Total Projects
                      </label>
                      <input
                        type="number"
                        name="projects_count.total"
                        value={formData.projects_count.total}
                        onChange={handleInputChange}
                        min="0"
                        className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100 placeholder-yellow-300/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300 backdrop-blur-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-yellow-300 mb-1">
                        Completed Projects
                      </label>
                      <input
                        type="number"
                        name="projects_count.completed"
                        value={formData.projects_count.completed}
                        onChange={handleInputChange}
                        min="0"
                        className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100 placeholder-yellow-300/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300 backdrop-blur-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-yellow-300 mb-1">
                        In Progress Projects
                      </label>
                      <input
                        type="number"
                        name="projects_count.in_progress"
                        value={formData.projects_count.in_progress}
                        onChange={handleInputChange}
                        min="0"
                        className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100 placeholder-yellow-300/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300 backdrop-blur-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="border-b border-yellow-400/30 pb-6">
                  <h4 className="text-md font-medium text-yellow-300 mb-4">Contact Information</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-yellow-300 mb-1">
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        name="contact_info.mobile_no"
                        value={formData.contact_info.mobile_no}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100 placeholder-yellow-300/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300 backdrop-blur-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-yellow-300 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="contact_info.email"
                        value={formData.contact_info.email}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100 placeholder-yellow-300/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300 backdrop-blur-sm"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-yellow-300 mb-1">
                      Address
                    </label>
                    <textarea
                      name="contact_info.address"
                      value={formData.contact_info.address}
                      onChange={handleInputChange}
                      rows={2}
                      placeholder="Complete Address"
                      className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100 placeholder-yellow-300/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300 backdrop-blur-sm"
                    />
                  </div>
                </div>

                {/* Image Uploads */}
                <div className="border-b border-yellow-400/30 pb-6">
                  <h4 className="text-md font-medium text-yellow-300 mb-4">Images</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-yellow-300 mb-1">
                        Logo
                      </label>
                      <input
                        type="file"
                        name="logo"
                        onChange={handleInputChange}
                        accept="image/*"
                        className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-400 file:text-gray-900 hover:file:bg-yellow-300 transition-all duration-300 backdrop-blur-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-yellow-300 mb-1">
                        Cover Image
                      </label>
                      <input
                        type="file"
                        name="cover_image"
                        onChange={handleInputChange}
                        accept="image/*"
                        className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-400 file:text-gray-900 hover:file:bg-yellow-300 transition-all duration-300 backdrop-blur-sm"
                      />
                    </div>
                  </div>
                </div>

              </form>
            </div>

              <div className="modal-footer">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingDeveloper(null)
                  resetForm()
                }}
                className="px-6 py-3 border border-yellow-400/30 text-yellow-300 rounded-xl hover:bg-yellow-400/10 transition-all duration-300 backdrop-blur-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="developerForm"
                onClick={() => { /* form submission handled by form's onSubmit */ }}
                className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-xl hover:from-yellow-300 hover:to-yellow-400 font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {editingDeveloper ? 'Update Developer' : 'Create Developer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Developers List */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-yellow-400/30">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-yellow-300 mb-4">
            All Developers ({developers.length})
          </h3>
          
          {developers.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-yellow-400/10 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <p className="text-yellow-300/80 text-lg">No developers found</p>
              <p className="text-yellow-300/60 text-sm">Add your first developer to get started</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-yellow-400/30">
                    <th className="text-left py-3 px-4 font-medium text-yellow-300">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-yellow-300">Established</th>
                    <th className="text-left py-3 px-4 font-medium text-yellow-300">Total Projects</th>
                    <th className="text-left py-3 px-4 font-medium text-yellow-300">Contact</th>
                    <th className="text-right py-3 px-4 font-medium text-yellow-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {developers.map((developer) => (
                    <tr key={developer._id} className="border-b border-yellow-400/10 hover:bg-yellow-400/5 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          {developer.logo && (
                            <img
                              src={`http://localhost:5003${developer.logo}`}
                              alt={developer.name}
                              className="w-12 h-12 rounded-lg object-cover border border-yellow-400/30"
                            />
                          )}
                          <div>
                            <p className="text-yellow-100 font-medium">{developer.name}</p>
                            <p className="text-yellow-300/70 text-sm">{developer.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-yellow-100">
                        {developer.established_year || 'N/A'}
                      </td>
                      <td className="py-4 px-4 text-yellow-100">
                        {developer.projects_count?.total || developer.totalProjects || 0}
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-yellow-100">
                          <p className="text-sm">{developer.contact_info?.email || developer.email}</p>
                          <p className="text-sm text-yellow-300/70">{developer.contact_info?.mobile_no || developer.mobile_no}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(developer)}
                            className="p-2 text-yellow-400 hover:bg-yellow-400/10 rounded-lg transition-colors"
                            title="Edit Developer"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(developer._id)}
                            className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                            title="Delete Developer"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DeveloperManagement