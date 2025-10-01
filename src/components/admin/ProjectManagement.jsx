import React, { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import apiService from '../../services/api'

const ProjectManagement = () => {
  const [projects, setProjects] = useState([])
  // No search/filters in admin project listing; show all projects
  const [showForm, setShowForm] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    project_types: '',
    bedrooms: '',
    area: '',
    description: '',
    total_units: '',
    project_statuses: 'planned',
    launch_date: '',
    completion_date: ''
  })

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const response = await apiService.getProjects()

      let fetched = []
      if (Array.isArray(response)) {
        fetched = response
      } else if (response && Array.isArray(response.data)) {
        fetched = response.data
      } else if (response && response.data && Array.isArray(response.data.items)) {
        fetched = response.data.items
      } else {
        // Try to find any array payload in response
        const possibleArray = response && typeof response === 'object' ? Object.values(response).find(v => Array.isArray(v)) : null
        if (possibleArray) fetched = possibleArray
      }

      // Normalize basic fields used in the admin table
      const normalized = fetched.map(p => ({
        ...p,
        name: p.name || p.title || p.projectName || '',
        project_types: p.project_types || p.project_type || p.type || ''
      }))

      setProjects(normalized)
    } catch (error) {
      console.error('Error fetching projects:', error)
      toast.error('Failed to fetch projects')
      setProjects([])
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const submitData = {
        name: formData.name,
        location: formData.location,
        project_types: formData.project_types,
        bedrooms: parseInt(formData.bedrooms) || 0,
        area: formData.area,
        description: formData.description,
        // Server expects total_units as a string type per validation error. Send both typed and alias forms.
        total_units: String(formData.total_units || ''),
        totalUnits: String(formData.total_units || ''),
        project_statuses: formData.project_statuses,
        launch_date: formData.launch_date,
        completion_date: formData.completion_date
      }

      // Include alias for location if backend expects 'location_name'
      if (formData.location && !submitData.location_name) submitData.location_name = formData.location

      let response
      if (editingProject) {
        // For now, we'll use create as update (backend might handle this)
        response = await apiService.createProject({ ...submitData, id: editingProject._id })
      } else {
        response = await apiService.createProject(submitData)
      }

      if (response && response.success) {
        toast.success(editingProject ? 'Project updated successfully' : 'Project created successfully')
        setShowForm(false)
        setEditingProject(null)
        resetForm()
        fetchProjects() // Refresh the list
      } else {
        // Show server-side validation message when provided
          let msg = 'Failed to save project'
        // The API may return various shapes: result.message, result.response_message, result.errors (object), or nested response_data
    if (response) {
            // If server returns response_data with details, try to extract messages
            if (response.data && response.data.response_data) {
              const rd = response.data.response_data
              if (Array.isArray(rd) && rd.length > 0) {
                // Try to map common patterns
                const mapped = rd.map(item => {
                  if (typeof item === 'string') return item
                  if (item.message) return item.message
                  if (item.msg) return item.msg
                  if (item.field && item.message) return `${item.field}: ${item.message}`
                  return JSON.stringify(item)
                }).join(' | ')
                msg = mapped || msg
              } else if (typeof rd === 'object') {
                // flatten object
                const flattened = Object.keys(rd).map(k => {
                  const v = rd[k]
                  if (Array.isArray(v)) return `${k}: ${v.join(', ')}`
                  return `${k}: ${String(v)}`
                }).join(' | ')
                msg = flattened || msg
              }
            }
          if (response.message) msg = response.message
          else if (response.response_message) msg = response.response_message
          else if (response.data && response.data.message) msg = response.data.message
            else if (response.data && response.data.errors) {
            const errs = response.data.errors
            // flatten object messages
            const flattened = Object.keys(errs).map(k => Array.isArray(errs[k]) ? errs[k].join(', ') : String(errs[k])).join(' | ')
            msg = flattened || msg
          } else if (response.errors) {
            const errs = response.errors
            const flattened = Object.keys(errs).map(k => Array.isArray(errs[k]) ? errs[k].join(', ') : String(errs[k])).join(' | ')
            msg = flattened || msg
          } else if (response.data && typeof response.data === 'string') {
            msg = response.data
          }
        }
        toast.error(msg)
      }
    } catch (error) {
      console.error('Error saving project:', error)
      toast.error(error.message || 'Error saving project. Please try again.')
    }
  }

  const handleEdit = (project) => {
    setEditingProject(project)
    setFormData({
      name: project.name || project.title || '',
      location: project.location || '',
      project_types: project.project_types || project.project_type || '',
      bedrooms: project.bedrooms || '',
      area: project.area || '',
      description: project.description || '',
      total_units: project.total_units || '',
      project_statuses: project.project_statuses || project.status || 'planned',
      launch_date: project.launch_date || '',
      completion_date: project.completion_date || ''
    })
    setShowForm(true)
  }

  const handleDelete = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return
    }

    try {
      const response = await apiService.deleteProject(projectId)

      if (response.success) {
        toast.success('Project deleted successfully')
        // Immediately remove project from the list
        setProjects(prev => prev.filter(project => project._id !== projectId))
      } else {
        toast.error(response.message || 'Failed to delete project')
      }
    } catch (error) {
      console.error('Error deleting project:', error)
      toast.error('Error deleting project')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      location: '',
      project_types: '',
      bedrooms: '',
      area: '',
      description: '',
      total_units: '',
      project_statuses: 'planned',
      launch_date: '',
      completion_date: ''
    })
  }

  

  const getStatusBadge = (status) => {
    const statusStyles = {
      planned: 'bg-blue-100 text-blue-800',
      ongoing: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    }

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[status] || statusStyles.planned}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
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
          <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">Project Management</h2>
          <p className="text-yellow-300/80 mt-1">Manage property development projects</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-6 py-3 rounded-xl hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Add New Project</span>
        </button>
      </div>



      {/* Inline Add/Edit Form */}
      {showForm && (
        <div className="bg-gray-800 rounded-2xl border border-yellow-400/30 max-w-4xl w-full mx-auto my-8 admin-modal-panel">
          <div className="sticky top-0 bg-gray-800 p-6 border-b border-yellow-400/30 rounded-t-2xl">
            <h3 className="text-xl font-bold text-yellow-300">
              {editingProject ? 'Edit Project' : 'Add New Project'}
            </h3>
          </div>

          <div className="modal-body max-h-96 overflow-y-auto">
            <form id="projectForm" onSubmit={handleSubmit} className="space-y-6 p-6">
              {/* Basic Information */}
              <div className="border-b border-yellow-400/30 pb-6">
                <h4 className="text-md font-medium text-yellow-300 mb-4">Basic Information</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-yellow-300 mb-1">
                      Project Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-gray-900/50 border rounded-xl px-4 py-3 text-yellow-100 placeholder-yellow-300/50 focus:outline-none focus:ring-2 transition-all duration-300 backdrop-blur-sm border-yellow-400/30 focus:ring-yellow-400 focus:border-yellow-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-yellow-300 mb-1">
                      Location *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
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
                    placeholder="Brief description about the project"
                    className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100 placeholder-yellow-300/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300 backdrop-blur-sm"
                  />
                </div>
              </div>

              {/* Project Details */}
              <div className="border-b border-yellow-400/30 pb-6">
                <h4 className="text-md font-medium text-yellow-300 mb-4">Project Details</h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-yellow-300 mb-1">
                      Project Type
                    </label>
                    <select
                      name="project_types"
                      value={formData.project_types}
                      onChange={handleInputChange}
                      className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300 backdrop-blur-sm"
                    >
                      <option value="">Select Type</option>
                      <option value="Apartment">Apartment</option>
                      <option value="Villa">Villa</option>
                      <option value="Townhouse">Townhouse</option>
                      <option value="Penthouse">Penthouse</option>
                      <option value="Studio">Studio</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-yellow-300 mb-1">
                      Bedrooms
                    </label>
                    <input
                      type="number"
                      name="bedrooms"
                      value={formData.bedrooms}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100 placeholder-yellow-300/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300 backdrop-blur-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-yellow-300 mb-1">
                      Area (sqft)
                    </label>
                    <input
                      type="text"
                      name="area"
                      value={formData.area}
                      onChange={handleInputChange}
                      placeholder="e.g. 1200 sqft"
                      className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100 placeholder-yellow-300/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300 backdrop-blur-sm"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-yellow-300 mb-1">
                    Total Units
                  </label>
                  <input
                    type="number"
                    name="total_units"
                    value={formData.total_units}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100 placeholder-yellow-300/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300 backdrop-blur-sm"
                  />
                </div>
              </div>

              {/* Project Status & Timeline */}
              <div className="border-b border-yellow-400/30 pb-6">
                <h4 className="text-md font-medium text-yellow-300 mb-4">Status & Timeline</h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-yellow-300 mb-1">
                      Project Status
                    </label>
                    <select
                      name="project_statuses"
                      value={formData.project_statuses}
                      onChange={handleInputChange}
                      className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300 backdrop-blur-sm"
                    >
                      <option value="planned">Planned</option>
                      <option value="ongoing">Ongoing</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-yellow-300 mb-1">
                      Launch Date
                    </label>
                    <input
                      type="date"
                      name="launch_date"
                      value={formData.launch_date}
                      onChange={handleInputChange}
                      className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300 backdrop-blur-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-yellow-300 mb-1">
                      Completion Date
                    </label>
                    <input
                      type="date"
                      name="completion_date"
                      value={formData.completion_date}
                      onChange={handleInputChange}
                      className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300 backdrop-blur-sm"
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
                setShowForm(false)
                setEditingProject(null)
                resetForm()
              }}
              className="px-6 py-3 border border-yellow-400/30 text-yellow-300 rounded-xl hover:bg-yellow-400/10 transition-all duration-300 backdrop-blur-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="projectForm"
              className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-xl hover:from-yellow-300 hover:to-yellow-400 font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {editingProject ? 'Update Project' : 'Create Project'}
            </button>
          </div>
        </div>
      )}

      {/* Projects Panel - simple list (no filters/search) */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-yellow-400/30 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-yellow-300">All Projects ({projects.length})</h3>
            <p className="text-yellow-300/70 text-sm">Listing of all projects from the API.</p>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-yellow-400/30">
          <div className="p-6">
            {projects.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 bg-yellow-400/10 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <p className="text-yellow-300/80 text-lg">No projects found</p>
                <p className="text-yellow-300/60 text-sm">Add a project to get started</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-yellow-400/30">
                      <th className="text-left py-3 px-4 font-medium text-yellow-300">Project Name</th>
                      <th className="text-left py-3 px-4 font-medium text-yellow-300">Location</th>
                      <th className="text-left py-3 px-4 font-medium text-yellow-300">Type</th>
                      <th className="text-left py-3 px-4 font-medium text-yellow-300">Units</th>
                      <th className="text-left py-3 px-4 font-medium text-yellow-300">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-yellow-300">Launch Date</th>
                      <th className="text-right py-3 px-4 font-medium text-yellow-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((project) => (
                      <tr key={project._id || project.id} className="border-b border-yellow-400/10 hover:bg-yellow-400/5 transition-colors">
                        <td className="py-4 px-4">
                          <div>
                            <p className="text-yellow-100 font-medium">{project.name || project.title}</p>
                            <p className="text-yellow-300/70 text-sm">{project.description}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-yellow-100">{project.location}</td>
                        <td className="py-4 px-4 text-yellow-100">{project.project_types || project.project_type || project.type}</td>
                        <td className="py-4 px-4 text-yellow-100">{project.total_units || project.units || 0}</td>
                        <td className="py-4 px-4">{getStatusBadge(project.project_statuses || project.status)}</td>
                        <td className="py-4 px-4 text-yellow-100">{formatDate(project.launch_date)}</td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button onClick={() => handleEdit(project)} className="p-2 text-yellow-400 hover:bg-yellow-400/10 rounded-lg transition-colors" title="Edit Project">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button onClick={() => handleDelete(project._id || project.id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors" title="Delete Project">
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
    </div>
  )
}

export default ProjectManagement