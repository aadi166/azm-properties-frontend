import React, { useState, useEffect, useMemo } from 'react'
import { toast } from 'react-hot-toast'
import apiService from '../../services/api'

const DeveloperManagement = () => {
  const [developers, setDevelopers] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingDeveloper, setEditingDeveloper] = useState(null)
  const [loading, setLoading] = useState(false)
  const [projectsList, setProjectsList] = useState([])
  const [selectedProjectIds, setSelectedProjectIds] = useState([])
  // Missing states / handlers that previous edits assumed
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    established_year: '',
    about: '',
    projects_count: { total: 0, completed: 0, in_progress: 0 },
    contact_info: { email: '', mobile_no: '', address: '' },
    logo: null,
    cover_image: null,
    image: null,
    website: '',
    email: '',
    mobile_no: '',
    address: ''
  })

  const [projectFilters, setProjectFilters] = useState({
    location: 'All',
    type: 'All',
    bedrooms: 'Any',
    bathrooms: 'Any',
    status: 'All',
    priceMin: '',
    priceMax: ''
  })
  const [projectSortBy, setProjectSortBy] = useState('default')
  const [projectView, setProjectView] = useState('grid')

  // Generic input handler that supports nested names like 'contact_info.email'
  const handleInputChange = (e) => {
    const { name, type, files, value } = e.target
    if (type === 'file') {
      setFormData(prev => ({ ...prev, [name]: files && files[0] }))
      return
    }

    if (name && name.includes('.')) {
      const parts = name.split('.')
      setFormData(prev => {
        const copy = JSON.parse(JSON.stringify(prev || {}))
        let cur = copy
        for (let i = 0; i < parts.length - 1; i++) {
          if (!cur[parts[i]]) cur[parts[i]] = {}
          cur = cur[parts[i]]
        }
        cur[parts[parts.length - 1]] = value
        return copy
      })
      return
    }

    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Fetch developers and projects safely (apiService methods may or may not exist)
  const fetchDevelopers = async () => {
    try {
      setLoading(true)
      if (typeof apiService.getDevelopers === 'function') {
        const res = await apiService.getDevelopers()
        if (res?.success && Array.isArray(res.data)) setDevelopers(res.data)
        else if (Array.isArray(res)) setDevelopers(res)
      }
    } catch (err) {
      console.error('Error fetching developers:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchProjects = async () => {
    try {
      if (typeof apiService.getProjects === 'function') {
        const res = await apiService.getProjects()
        // api.getProjects may return { data, success } or { success, data }
        if (res?.success && Array.isArray(res.data)) setProjectsList(res.data)
        else if (Array.isArray(res.data)) setProjectsList(res.data)
        else if (Array.isArray(res)) setProjectsList(res)
      }
    } catch (err) {
      console.error('Error fetching projects:', err)
      setProjectsList([])
    }
  }

  useEffect(() => {
    fetchDevelopers()
    fetchProjects()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const submitData = new FormData();

      // Add basic fields
      submitData.append('name', formData.name);
      submitData.append('description', formData.description);
      submitData.append('established_year', formData.established_year);
      submitData.append('website', formData.website);

      // Add contact info
      submitData.append('contact_info', JSON.stringify(formData.contact_info));

      // Add project statistics
      submitData.append('projects_count', JSON.stringify(formData.projects_count));

      // Add selected projects
      selectedProjectIds.forEach(projectId => {
        submitData.append('projects[]', projectId);
      });

      // Add files
      if (formData.logo) submitData.append('logo', formData.logo);
      if (formData.cover_image) submitData.append('cover_image', formData.cover_image);

      let response;
      if (editingDeveloper) {
        response = await apiService.updateDeveloper(editingDeveloper._id, submitData);
      } else {
        response = await apiService.createDeveloper(submitData);
      }

      if (response.success) {
        toast.success(editingDeveloper ? 'Developer updated successfully' : 'Developer created successfully');
        setShowForm(false);
        setEditingDeveloper(null);
        resetForm();
        fetchDevelopers(); // Refresh the list
      } else {
        toast.error(response.message || 'Failed to save developer');
      }
    } catch (error) {
      console.error('Error saving developer:', error);
      toast.error(error.message || 'Error saving developer. Please try again.');
    }
  };

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

  // Note: client-side project filters/search removed per admin UX decision.
  // Use `projectsList` directly for the developer associated-projects multi-select.

  const uniqueValues = (keyCandidates) => {
    const set = new Set()
    projectsList.forEach(p => {
      for (const k of keyCandidates) {
        if (p && p[k]) set.add(p[k])
      }
    })
    return Array.from(set).filter(Boolean)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
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

      {/* Inline Add/Edit Form */}
      {showForm && (
        <div className="bg-gray-800 rounded-2xl border border-yellow-400/30 max-w-4xl w-full mx-auto my-8 admin-modal-panel">
          <div className="sticky top-0 bg-gray-800 p-6 border-b border-yellow-400/30 rounded-t-2xl">
            <h3 className="text-xl font-bold text-yellow-300">
              {editingDeveloper ? 'Edit Developer' : 'Add New Developer'}
            </h3>
          </div>

          <div className="modal-body max-h-96 overflow-y-auto">
            <form id="developerForm" onSubmit={handleSubmit} className="space-y-6 p-6">
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
                          (developer.name || '').toLowerCase().trim() === formData.name.toLowerCase().trim()
                        )
                          ? 'border-red-400/50 focus:ring-red-400 focus:border-red-400'
                          : 'border-yellow-400/30 focus:ring-yellow-400 focus:border-yellow-400'
                      }`}
                    />
                    {!editingDeveloper && formData.name && developers.find(developer =>
                      (developer.name || '').toLowerCase().trim() === formData.name.toLowerCase().trim()
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
                      Established Year
                    </label>
                    <input
                      type="number"
                      name="established_year"
                      value={formData.established_year}
                      onChange={handleInputChange}
                      min="1800"
                      max={new Date().getFullYear()}
                      placeholder="e.g. 2020"
                      className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100 placeholder-yellow-300/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300 backdrop-blur-sm"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-yellow-300 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Brief description about the developer"
                    className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100 placeholder-yellow-300/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300 backdrop-blur-sm"
                  />
                </div>
              </div>

              {/* Projects Association */}
              <div className="border-b border-yellow-400/30 pb-6">
                <h4 className="text-md font-medium text-yellow-300 mb-4">Associated Projects</h4>
                <p className="text-yellow-300/70 text-sm mb-3">Select projects this developer is involved in (multiple selection supported).</p>
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setSelectedProjectIds(projectsList.map(p => p._id || p.id))}
                      className="px-3 py-1 bg-yellow-400 text-gray-900 rounded-lg text-sm hover:bg-yellow-300 transition-colors"
                    >
                      Select All
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedProjectIds([])}
                      className="px-3 py-1 bg-gray-700 text-yellow-300 rounded-lg text-sm border border-yellow-400/20 hover:bg-gray-600 transition-colors"
                    >
                      Clear
                    </button>
                  </div>

                  <div className="max-h-48 overflow-y-auto pr-2 border border-yellow-400/20 rounded-lg p-3 bg-gray-900/30">
                    {projectsList.length === 0 ? (
                      <p className="text-yellow-300/60 text-sm">No projects available</p>
                    ) : (
                      projectsList.map((project) => {
                        const pid = project._id || project.id;
                        const label = project.name || project.title || pid;
                        return (
                          <label key={pid} className="flex items-center space-x-2 mb-2 hover:bg-yellow-400/5 p-2 rounded cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedProjectIds.includes(pid)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedProjectIds(prev => Array.from(new Set([...prev, pid])));
                                } else {
                                  setSelectedProjectIds(prev => prev.filter(x => x !== pid));
                                }
                              }}
                              className="form-checkbox h-4 w-4 text-yellow-400 bg-gray-900 border-yellow-400/30 rounded focus:ring-yellow-400 focus:ring-2"
                            />
                            <span className="text-yellow-100 text-sm">{label}</span>
                          </label>
                        );
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

                <div className="mt-4">
                  <label className="block text-sm font-medium text-yellow-300 mb-1">
                    Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="https://example.com"
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

          <div className="modal-footer sticky bottom-0 bg-gray-800 p-6 border-t border-yellow-400/30 rounded-b-2xl">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingDeveloper(null);
                resetForm();
              }}
              className="px-6 py-3 border border-yellow-400/30 text-yellow-300 rounded-xl hover:bg-yellow-400/10 transition-all duration-300 backdrop-blur-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="developerForm"
              className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-xl hover:from-yellow-300 hover:to-yellow-400 font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {editingDeveloper ? 'Update Developer' : 'Create Developer'}
            </button>
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
                        <div>
                          <p className="text-yellow-100 font-medium">{developer.name}</p>
                          <p className="text-yellow-300/70 text-sm">{developer.description}</p>
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
  );

}

export default DeveloperManagement