import React, { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import apiService from '../../services/api'
import GenericCard from './GenericCard'
import GenericModal from './GenericModal'

const ProjectManagement = () => {
  const [projects, setProjects] = useState([])
  // No search/filters in admin project listing; show all projects
  const [showModal, setShowModal] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [loading, setLoading] = useState(false)
  const [publishingId, setPublishingId] = useState(null)

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

  const handleSubmit = async (formData) => {
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
        completion_date: formData.completion_date,
        published: formData.published
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
        setShowModal(false)
        setEditingProject(null)
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
    setShowModal(true)
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

  const togglePublish = async (project) => {
    const id = project._id || project.id
    const newPublished = project.published === true ? false : true
    setPublishingId(id)
    try {
      // Primary: try to update via createProject endpoint (server may treat create with id as update)
      const payload = { id, published: newPublished }
      let res = null
      try {
        res = await apiService.createProject(payload)
      } catch (err) {
        // If createProject fails (network/auth), try updateProject fallback
        try {
          res = await apiService.updateProject(id, { published: newPublished })
        } catch (err2) {
          // both failed
          console.warn('Both createProject and updateProject failed for publish toggle', err, err2)
          throw err2 || err
        }
      }

      // Normalize response success handling
      if (res && (res.success === true || res.success)) {
        toast.success(newPublished ? 'Project published' : 'Project unpublished')
        setProjects(prev => prev.map(p => (p._id === id || p.id === id) ? { ...p, published: newPublished } : p))
        // Notify other parts of app to refresh (e.g., Home featured projects)
        try { window.dispatchEvent(new Event('projectsUpdated')) } catch(e){}
      } else {
        // If response shape is different, try to detect message
        const msg = (res && (res.message || res.response_message)) || 'Failed to update publish status'
        toast.error(msg)
      }
    } catch (error) {
      console.error('Error toggling publish:', error)
      toast.error(error && error.message ? error.message : 'Error updating publish status')
    } finally {
      setPublishingId(null)
    }
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

  const modalConfig = {
    title: editingProject ? 'Edit Project' : 'Add New Project',
    sections: [
      {
        title: 'Basic Information',
        fields: [
          {
            name: 'name',
            label: 'Project Name',
            type: 'text',
            required: true,
            placeholder: 'Enter project name'
          },
          {
            name: 'location',
            label: 'Location',
            type: 'text',
            required: true,
            placeholder: 'Enter project location'
          },
          {
            name: 'description',
            label: 'Description',
            type: 'textarea',
            placeholder: 'Brief description about the project'
          }
        ]
      },
      {
        title: 'Project Details',
        fields: [
          {
            name: 'project_types',
            label: 'Project Type',
            type: 'select',
            options: [
              { value: '', label: 'Select Type' },
              { value: 'Apartment', label: 'Apartment' },
              { value: 'Villa', label: 'Villa' },
              { value: 'Townhouse', label: 'Townhouse' },
              { value: 'Penthouse', label: 'Penthouse' },
              { value: 'Studio', label: 'Studio' }
            ]
          },
          {
            name: 'bedrooms',
            label: 'Bedrooms',
            type: 'number',
            min: 0,
            placeholder: 'Number of bedrooms'
          },
          {
            name: 'area',
            label: 'Area (sqft)',
            type: 'text',
            placeholder: 'e.g. 1200 sqft'
          },
          {
            name: 'total_units',
            label: 'Total Units',
            type: 'number',
            min: 0,
            placeholder: 'Total number of units'
          }
        ]
      },
      {
        title: 'Status & Timeline',
        fields: [
          {
            name: 'project_statuses',
            label: 'Project Status',
            type: 'select',
            options: [
              { value: 'planned', label: 'Planned' },
              { value: 'ongoing', label: 'Ongoing' },
              { value: 'completed', label: 'Completed' },
              { value: 'cancelled', label: 'Cancelled' }
            ]
          },
          {
            name: 'launch_date',
            label: 'Launch Date',
            type: 'date'
          },
          {
            name: 'completion_date',
            label: 'Completion Date',
            type: 'date'
          }
        ]
      },
      {
        title: 'Publishing Options',
        fields: [
          {
            name: 'published',
            label: 'Publish immediately',
            type: 'checkbox'
          }
        ]
      }
    ]
  }

  const getInitialData = () => {
    if (editingProject) {
      return {
        name: editingProject.name || editingProject.title || '',
        location: editingProject.location || '',
        project_types: editingProject.project_types || editingProject.project_type || '',
        bedrooms: editingProject.bedrooms || '',
        area: editingProject.area || '',
        description: editingProject.description || '',
        total_units: editingProject.total_units || '',
        project_statuses: editingProject.project_statuses || editingProject.status || 'planned',
        launch_date: editingProject.launch_date || '',
        completion_date: editingProject.completion_date || '',
        published: editingProject.published !== false
      }
    }
    return {
      name: '',
      location: '',
      project_types: '',
      bedrooms: '',
      area: '',
      description: '',
      total_units: '',
      project_statuses: 'planned',
      launch_date: '',
      completion_date: '',
      published: true
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <>
      {/* Generic Modal for Add/Edit */}
      <GenericModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          setEditingProject(null)
        }}
        title={editingProject ? 'Edit Project' : 'Add New Project'}
        onSubmit={handleSubmit}
        submitButtonText={editingProject ? 'Update Project' : 'Create Project'}
        sections={modalConfig.sections}
        initialData={getInitialData()}
      />

      <div className="space-y-6">
        {/* Projects List */}
      <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-2xl shadow-2xl border border-yellow-400/30 backdrop-blur-sm">
        <div className="px-8 py-6 border-b border-yellow-400/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">All Projects ({projects.length})</h3>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-4 py-2 rounded-lg hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300 font-medium shadow-md hover:shadow-lg"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Add New Project</span>
            </button>
          </div>
        </div>
        <div className="p-8">
          {projects.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-yellow-400/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="text-yellow-300 text-lg font-medium">No projects found</div>
              <p className="text-yellow-300/60 mt-2">Create your first project to get started</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {projects.map((project) => (
                <GenericCard
                  key={project._id || project.id}
                  item={project}
                  type="project"
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onPublishToggle={togglePublish}
                  titleField="name"
                  subtitleField="location"
                  descriptionField="description"
                  dateField="launch_date"
                  fields={[
                    { key: 'project_types', label: 'Type', className: 'text-yellow-300' },
                    { key: 'total_units', label: 'Units', className: 'text-yellow-300/70' },
                    { key: 'bedrooms', label: 'Beds', className: 'text-yellow-300/70' },
                    { key: 'area', label: 'Area', className: 'text-yellow-300/70' }
                  ]}
                  actions={['publish', 'edit', 'delete']}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  </>
)

}

export default ProjectManagement