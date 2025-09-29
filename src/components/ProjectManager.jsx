import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

const ProjectManager = () => {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    location: 'all',
    developer: 'all',
    category: 'all'
  });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priceRange: { min: '', max: '' },
    location: '',
    status: 'upcoming',
    category: 'residential',
    developer: '',
    keyHighlights: [''],
    images: [''],
    completionDate: '',
    paymentPlan: '',
    amenities: ['']
  });

  useEffect(() => {
    fetchProjects();
  }, [filters]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await apiService.getProjects(filters);
      setProjects(response.data);
    } catch (err) {
      setError('Failed to fetch projects');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      
      const projectData = {
        ...formData,
        priceRange: {
          min: parseInt(formData.priceRange.min),
          max: parseInt(formData.priceRange.max)
        },
        keyHighlights: formData.keyHighlights.filter(h => h.trim()),
        images: formData.images.filter(img => img.trim()),
        amenities: formData.amenities.filter(a => a.trim())
      };

      if (editingProject) {
        await apiService.updateProject(editingProject._id, projectData);
        setSuccess('Project updated successfully!');
      } else {
        await apiService.createProject(projectData);
        setSuccess('Project created successfully!');
      }
      
      resetForm();
      fetchProjects();
    } catch (err) {
      setError(err.message || 'Failed to save project');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        setLoading(true);
        await apiService.deleteProject(id);
        setSuccess('Project deleted successfully!');
        fetchProjects();
      } catch (err) {
        setError('Failed to delete project');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      priceRange: {
        min: project.priceRange.min.toString(),
        max: project.priceRange.max.toString()
      },
      location: project.location,
      status: project.status,
      category: project.category,
      developer: project.developer,
      keyHighlights: project.keyHighlights || [''],
      images: project.images || [''],
      completionDate: project.completionDate || '',
      paymentPlan: project.paymentPlan || '',
      amenities: project.amenities || ['']
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      priceRange: { min: '', max: '' },
      location: '',
      status: 'upcoming',
      category: 'residential',
      developer: '',
      keyHighlights: [''],
      images: [''],
      completionDate: '',
      paymentPlan: '',
      amenities: ['']
    });
    setEditingProject(null);
    setShowForm(false);
  };

  const handleArrayFieldChange = (field, index, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayField = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const removeArrayField = (field, index) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="project-manager">
      <div className="project-manager-header">
        <h2>Projects Management</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          Add New Project
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Filters */}
      <div className="filters-section">
        <div className="filters-grid">
          <select 
            value={filters.status} 
            onChange={(e) => setFilters({...filters, status: e.target.value})}
          >
            <option value="all">All Status</option>
            <option value="upcoming">Upcoming</option>
            <option value="under-construction">Under Construction</option>
            <option value="ready">Ready</option>
            <option value="completed">Completed</option>
          </select>

          <select 
            value={filters.category} 
            onChange={(e) => setFilters({...filters, category: e.target.value})}
          >
            <option value="all">All Categories</option>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
            <option value="mixed-use">Mixed Use</option>
          </select>

          <input
            type="text"
            placeholder="Filter by location..."
            value={filters.location === 'all' ? '' : filters.location}
            onChange={(e) => setFilters({...filters, location: e.target.value || 'all'})}
          />

          <input
            type="text"
            placeholder="Filter by developer..."
            value={filters.developer === 'all' ? '' : filters.developer}
            onChange={(e) => setFilters({...filters, developer: e.target.value || 'all'})}
          />
        </div>
      </div>

      {/* Projects List */}
      <div className="projects-list">
        {loading ? (
          <div className="loading">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="no-projects">No projects found</div>
        ) : (
          <div className="projects-grid">
            {projects.map((project) => (
              <div key={project._id} className="project-card">
                <div className="project-image">
                  {project.images && project.images[0] ? (
                    <img src={project.images[0]} alt={project.title} />
                  ) : (
                    <div className="placeholder-image">No Image</div>
                  )}
                  <div className={`status-badge ${project.status}`}>
                    {project.status.replace('-', ' ').toUpperCase()}
                  </div>
                </div>
                
                <div className="project-content">
                  <h3>{project.title}</h3>
                  <p className="developer">by {project.developer}</p>
                  <p className="location">📍 {project.location}</p>
                  <p className="description">{project.description}</p>
                  
                  <div className="price-range">
                    <strong>
                      {formatPrice(project.priceRange.min)} - {formatPrice(project.priceRange.max)}
                    </strong>
                  </div>

                  {project.keyHighlights && project.keyHighlights.length > 0 && (
                    <div className="key-highlights">
                      <h4>Key Highlights:</h4>
                      <ul>
                        {project.keyHighlights.slice(0, 3).map((highlight, index) => (
                          <li key={index}>{highlight}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="project-actions">
                    <button 
                      className="btn btn-secondary"
                      onClick={() => handleEdit(project)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-danger"
                      onClick={() => handleDelete(project._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Project Form Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingProject ? 'Edit Project' : 'Add New Project'}</h3>
              <button className="close-btn" onClick={resetForm}>×</button>
            </div>

            <form onSubmit={handleSubmit} className="project-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Developer *</label>
                  <input
                    type="text"
                    value={formData.developer}
                    onChange={(e) => setFormData({...formData, developer: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Location *</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Status *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    required
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="under-construction">Under Construction</option>
                    <option value="ready">Ready</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    required
                  >
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="mixed-use">Mixed Use</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Completion Date</label>
                  <input
                    type="date"
                    value={formData.completionDate}
                    onChange={(e) => setFormData({...formData, completionDate: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label>Min Price (AED) *</label>
                  <input
                    type="number"
                    value={formData.priceRange.min}
                    onChange={(e) => setFormData({
                      ...formData, 
                      priceRange: {...formData.priceRange, min: e.target.value}
                    })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Max Price (AED) *</label>
                  <input
                    type="number"
                    value={formData.priceRange.max}
                    onChange={(e) => setFormData({
                      ...formData, 
                      priceRange: {...formData.priceRange, max: e.target.value}
                    })}
                    required
                  />
                </div>
              </div>

              <div className="form-group full-width">
                <label>Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="4"
                  required
                />
              </div>

              <div className="form-group full-width">
                <label>Payment Plan</label>
                <textarea
                  value={formData.paymentPlan}
                  onChange={(e) => setFormData({...formData, paymentPlan: e.target.value})}
                  rows="3"
                  placeholder="e.g., 10% on booking, 40% during construction, 50% on handover"
                />
              </div>

              {/* Key Highlights */}
              <div className="form-group full-width">
                <label>Key Highlights</label>
                {formData.keyHighlights.map((highlight, index) => (
                  <div key={index} className="array-input">
                    <input
                      type="text"
                      value={highlight}
                      onChange={(e) => handleArrayFieldChange('keyHighlights', index, e.target.value)}
                      placeholder="Enter key highlight"
                    />
                    {formData.keyHighlights.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => removeArrayField('keyHighlights', index)}
                        className="remove-btn"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button 
                  type="button" 
                  onClick={() => addArrayField('keyHighlights')}
                  className="add-btn"
                >
                  Add Highlight
                </button>
              </div>

              {/* Images */}
              <div className="form-group full-width">
                <label>Images (URLs)</label>
                {formData.images.map((image, index) => (
                  <div key={index} className="array-input">
                    <input
                      type="url"
                      value={image}
                      onChange={(e) => handleArrayFieldChange('images', index, e.target.value)}
                      placeholder="Enter image URL"
                    />
                    {formData.images.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => removeArrayField('images', index)}
                        className="remove-btn"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button 
                  type="button" 
                  onClick={() => addArrayField('images')}
                  className="add-btn"
                >
                  Add Image
                </button>
              </div>

              {/* Amenities */}
              <div className="form-group full-width">
                <label>Amenities</label>
                {formData.amenities.map((amenity, index) => (
                  <div key={index} className="array-input">
                    <input
                      type="text"
                      value={amenity}
                      onChange={(e) => handleArrayFieldChange('amenities', index, e.target.value)}
                      placeholder="Enter amenity"
                    />
                    {formData.amenities.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => removeArrayField('amenities', index)}
                        className="remove-btn"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button 
                  type="button" 
                  onClick={() => addArrayField('amenities')}
                  className="add-btn"
                >
                  Add Amenity
                </button>
              </div>

              <div className="form-actions">
                <button type="button" onClick={resetForm} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="btn btn-primary">
                  {loading ? 'Saving...' : (editingProject ? 'Update Project' : 'Create Project')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .project-manager {
          padding: 20px;
        }

        .project-manager-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .project-manager-header h2 {
          margin: 0;
          color: #333;
        }

        .filters-section {
          margin-bottom: 30px;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .filters-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
        }

        .filters-grid select,
        .filters-grid input {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }

        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 20px;
        }

        .project-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          overflow: hidden;
          transition: transform 0.2s;
        }

        .project-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0,0,0,0.15);
        }

        .project-image {
          position: relative;
          height: 200px;
          background: #f0f0f0;
        }

        .project-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .placeholder-image {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: #666;
          font-size: 14px;
        }

        .status-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: bold;
          color: white;
        }

        .status-badge.upcoming { background: #007bff; }
        .status-badge.under-construction { background: #ffc107; color: #000; }
        .status-badge.ready { background: #28a745; }
        .status-badge.completed { background: #6c757d; }

        .project-content {
          padding: 20px;
        }

        .project-content h3 {
          margin: 0 0 8px 0;
          color: #333;
          font-size: 18px;
        }

        .developer {
          color: #666;
          font-size: 14px;
          margin: 0 0 8px 0;
        }

        .location {
          color: #666;
          font-size: 14px;
          margin: 0 0 12px 0;
        }

        .description {
          color: #555;
          font-size: 14px;
          line-height: 1.4;
          margin: 0 0 15px 0;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .price-range {
          margin: 15px 0;
          font-size: 16px;
          color: #007bff;
        }

        .key-highlights {
          margin: 15px 0;
        }

        .key-highlights h4 {
          margin: 0 0 8px 0;
          font-size: 14px;
          color: #333;
        }

        .key-highlights ul {
          margin: 0;
          padding-left: 16px;
          font-size: 13px;
          color: #555;
        }

        .key-highlights li {
          margin-bottom: 4px;
        }

        .project-actions {
          display: flex;
          gap: 10px;
          margin-top: 15px;
        }

        .btn {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.2s;
        }

        .btn-primary {
          background: #007bff;
          color: white;
        }

        .btn-primary:hover {
          background: #0056b3;
        }

        .btn-secondary {
          background: #6c757d;
          color: white;
        }

        .btn-secondary:hover {
          background: #545b62;
        }

        .btn-danger {
          background: #dc3545;
          color: white;
        }

        .btn-danger:hover {
          background: #c82333;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          border-radius: 8px;
          width: 90%;
          max-width: 800px;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #eee;
        }

        .modal-header h3 {
          margin: 0;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #666;
        }

        .project-form {
          padding: 20px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .form-group label {
          margin-bottom: 5px;
          font-weight: 500;
          color: #333;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }

        .array-input {
          display: flex;
          gap: 10px;
          margin-bottom: 10px;
          align-items: center;
        }

        .array-input input {
          flex: 1;
        }

        .remove-btn {
          background: #dc3545;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        }

        .add-btn {
          background: #28a745;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }

        .form-actions {
          display: flex;
          gap: 15px;
          justify-content: flex-end;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #eee;
        }

        .alert {
          padding: 12px;
          border-radius: 4px;
          margin-bottom: 20px;
        }

        .alert-error {
          background: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }

        .alert-success {
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }

        .loading {
          text-align: center;
          padding: 40px;
          color: #666;
        }

        .no-projects {
          text-align: center;
          padding: 40px;
          color: #666;
          font-size: 16px;
        }
      `}</style>
    </div>
  );
};

export default ProjectManager;