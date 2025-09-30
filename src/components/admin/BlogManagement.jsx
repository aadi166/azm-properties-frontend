import React, { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { apiService } from '../../services/api'

// Import API config for base URL
const API_CONFIG = {
  BASE_URL: 'http://127.0.0.1:5000'
};

const BlogManagement = () => {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingBlog, setEditingBlog] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Market Analysis',
    tags: '',
    image: null,
    published: true
  })

  const categories = [
    'Market Analysis',
    'Investment', 
    'Lifestyle',
    'Location Guide',
    'Property News'
  ]

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    try {
      const response = await apiService.getBlogs({ 
        limit: 1000 // Set high limit for admin panel to show all blogs
      })
      console.log('Blog response:', response) // Debug log
      if (response && response.blogs && Array.isArray(response.blogs)) {
        // Ensure all blogs have a published field
        const blogsWithPublishedField = response.blogs.map(blog => ({
          ...blog,
          published: blog.published !== false // Default to true if undefined
        }));
        setBlogs(blogsWithPublishedField)
      } else if (response && response.success) {
        setBlogs([])
      } else {
        console.error('Invalid blog response structure:', response)
        toast.error('Failed to fetch blogs')
        setBlogs([])
      }
    } catch (error) {
      console.error('Error fetching blogs:', error)
      toast.error('Error fetching blogs')
      setBlogs([])
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
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      let response
      if (editingBlog) {
        // Use the existing local API for updates
        const submitData = new FormData()
        
        Object.keys(formData).forEach(key => {
          if (key === 'image' && formData[key]) {
            submitData.append('image', formData[key])
          } else if (key !== 'image') {
            submitData.append(key, formData[key])
          }
        })
        
        response = await apiService.updateBlog(editingBlog._id, submitData)
      } else {
        // Use the real API for creating new blogs
        try {
          response = await apiService.createBlogWithAPI(formData)
          console.log('API Response:', response)
        } catch (apiError) {
          console.warn('Real API failed, falling back to local storage:', apiError.message)
          toast.error(`API Error: ${apiError.message}. Using local storage instead.`)
          
          // Fallback to local storage if real API fails
          const submitData = new FormData()
          
          Object.keys(formData).forEach(key => {
            if (key === 'image' && formData[key]) {
              submitData.append('image', formData[key])
            } else if (key !== 'image') {
              submitData.append(key, formData[key])
            }
          })
          
          response = await apiService.createBlog(submitData)
        }
      }

      if (response.success) {
        toast.success(`Blog ${editingBlog ? 'updated' : 'created'} successfully`)
        setShowForm(false)
        setEditingBlog(null)
        resetForm()
        fetchBlogs()
      } else {
        toast.error(response.message || 'Failed to save blog')
      }
    } catch (error) {
      console.error('Error saving blog:', error)
      toast.error('Error saving blog')
    }
  }

  const handleEdit = (blog) => {
    setEditingBlog(blog)
    setFormData({
      title: blog.title,
      content: blog.content,
      category: blog.category,
      tags: blog.tags ? blog.tags.join(', ') : '',
      image: null,
      published: blog.published !== false
    })
    setShowForm(true)
  }

  const handlePublishToggle = async (blogId, currentStatus) => {
    try {
      console.log('Toggling blog publish status:', { blogId, currentStatus });
      
      const newStatus = !currentStatus;
      
      // First update the local state optimistically
      setBlogs(prev => prev.map(blog => 
        blog._id === blogId ? { ...blog, published: newStatus } : blog
      ));
      
      try {
        const response = await apiService.updateBlog(blogId, { published: newStatus });
        
        if (response && response.success) {
          toast.success(`Blog ${newStatus ? 'published' : 'unpublished'} successfully`);
        } else {
          // If API fails, keep the optimistic update but show warning
          console.warn('API update failed but keeping local state change');
          toast.success(`Blog ${newStatus ? 'published' : 'unpublished'} locally`);
        }
      } catch (apiError) {
        console.error('API Error updating blog status:', apiError);
        // Keep the optimistic update and show success message
        toast.success(`Blog ${newStatus ? 'published' : 'unpublished'} locally`);
      }
    } catch (error) {
      console.error('Error updating blog status:', error);
      toast.error('Error updating blog status');
      // Revert the optimistic update
      fetchBlogs();
    }
  }

  const handleDelete = async (blogId) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) {
      return
    }

    try {
      const response = await apiService.deleteBlog(blogId)
      
      if (response.success) {
        toast.success('Blog deleted successfully')
        fetchBlogs()
      } else {
        toast.error(response.message || 'Failed to delete blog')
        const adminToken = localStorage.getItem('adminToken') || localStorage.getItem('accessToken')
        if (!adminToken) {
          // Only remove locally when not authenticated
          setBlogs(prev => prev.filter(blog => blog._id !== blogId))
        }
      }
    } catch (error) {
      console.error('Error deleting blog:', error)
      toast.error('Error deleting blog')
      const adminToken = localStorage.getItem('adminToken') || localStorage.getItem('accessToken')
      if (!adminToken) {
        setBlogs(prev => prev.filter(blog => blog._id !== blogId))
      }
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      category: 'Market Analysis',
      tags: '',
      image: null,
      published: true
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
          <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">Blog Management</h2>
          <p className="text-yellow-300/70 mt-1">Create and manage your blog posts</p>
        </div>
        <button
          onClick={() => {
            setShowForm(true)
            setEditingBlog(null)
            resetForm()
          }}
          className="bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-600 hover:to-yellow-500 text-black px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Add New Blog</span>
        </button>
      </div>

      {/* Blog Form */}
      {showForm && (
        <div className="bg-gray-800 rounded-2xl border border-yellow-400/30 max-w-4xl w-full mx-auto my-8 admin-modal-panel">
          <div className="sticky top-0 bg-gray-800 p-6 border-b border-yellow-400/30 rounded-t-2xl">
            <h3 className="text-xl font-bold text-yellow-300">
              {editingBlog ? 'Edit Blog Post' : 'Add New Blog Post'}
            </h3>
          </div>

          <div className="modal-body max-h-96 overflow-y-auto">
            <form id="blogForm" onSubmit={handleSubmit} className="space-y-6 p-6">
              {/* Basic Information */}
              <div className="border-b border-yellow-400/30 pb-6">
                <h4 className="text-md font-medium text-yellow-300 mb-4">Basic Information</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-yellow-300 mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100 placeholder-yellow-300/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300 backdrop-blur-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-yellow-300 mb-1">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300 backdrop-blur-sm"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-yellow-300 mb-1">
                    Content *
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    placeholder="Write your blog content here..."
                    className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100 placeholder-yellow-300/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300 backdrop-blur-sm"
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-yellow-300 mb-1">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder="dubai, real estate, investment"
                    className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100 placeholder-yellow-300/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300 backdrop-blur-sm"
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div className="border-b border-yellow-400/30 pb-6">
                <h4 className="text-md font-medium text-yellow-300 mb-4">Featured Image</h4>

                <div>
                  <label className="block text-sm font-medium text-yellow-300 mb-1">
                    Blog Image
                  </label>
                  <input
                    type="file"
                    name="image"
                    onChange={handleInputChange}
                    accept="image/*"
                    className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-400 file:text-gray-900 hover:file:bg-yellow-300 transition-all duration-300 backdrop-blur-sm"
                  />
                </div>
              </div>

              {/* Publishing Options */}
              <div className="border-b border-yellow-400/30 pb-6">
                <h4 className="text-md font-medium text-yellow-300 mb-4">Publishing Options</h4>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="published"
                    name="published"
                    checked={formData.published}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-yellow-400 bg-gray-900 border-yellow-400/30 rounded focus:ring-yellow-400 focus:ring-2"
                  />
                  <label htmlFor="published" className="text-sm font-medium text-yellow-300 cursor-pointer">
                    Publish immediately
                  </label>
                </div>
              </div>
            </form>
          </div>

          <div className="modal-footer sticky bottom-0 bg-gray-800 p-6 border-t border-yellow-400/30 rounded-b-2xl">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingBlog(null);
                resetForm();
              }}
              className="px-6 py-3 border border-yellow-400/30 text-yellow-300 rounded-xl hover:bg-yellow-400/10 transition-all duration-300 backdrop-blur-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="blogForm"
              className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-xl hover:from-yellow-300 hover:to-yellow-400 font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {editingBlog ? 'Update Blog' : 'Create Blog'}
            </button>
          </div>
        </div>
      )}

      {/* Blogs List */}
      <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-2xl shadow-2xl border border-yellow-400/30 backdrop-blur-sm">
        <div className="px-8 py-6 border-b border-yellow-400/20">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">All Blog Posts ({blogs.length})</h3>
          </div>
        </div>
        <div className="p-8">
          {blogs.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-yellow-400/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="text-yellow-300 text-lg font-medium">No blogs found</div>
              <p className="text-yellow-300/60 mt-2">Create your first blog post to get started</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {blogs.map((blog) => (
                <div key={blog._id} className="bg-gradient-to-r from-gray-900/60 to-gray-800/60 p-6 rounded-xl border border-yellow-400/20 hover:border-yellow-400/40 transition-all duration-300 hover:shadow-lg backdrop-blur-sm">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        {blog.image && (
                          <img 
                            src={blog.image_url ? `${API_CONFIG.BASE_URL}${blog.image_url}` : (blog.image ? `http://localhost:5003${blog.image}` : null)}
                            alt={blog.title}
                            className="h-12 w-12 rounded-lg object-cover"
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h4 className="text-xl font-bold text-yellow-300 hover:text-yellow-400 transition-colors">{blog.title}</h4>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              blog.published !== false 
                                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                                : 'bg-red-500/20 text-red-400 border border-red-500/30'
                            }`}>
                              {blog.published !== false ? 'Published' : 'Unpublished'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 mt-2">
                            <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-full text-xs font-semibold">
                              {blog.category}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-yellow-200/70 text-sm mb-4 line-clamp-2">{blog.content ? blog.content.replace(/<[^>]+>/g, '').substring(0, 150) : 'No content available'}...</p>
                      <div className="flex items-center space-x-6 text-sm text-yellow-300/60">
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                          <span>{blog.tags ? blog.tags.join(', ') : 'No tags'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 ml-6">
                      <button
                        onClick={() => {
                          console.log('Blog toggle clicked:', { 
                            id: blog._id, 
                            title: blog.title, 
                            currentPublished: blog.published,
                            typeof: typeof blog.published
                          });
                          handlePublishToggle(blog._id, blog.published);
                        }}
                        className={`p-3 rounded-xl transition-all duration-300 hover:scale-110 group ${
                          blog.published !== false
                            ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400'
                            : 'bg-green-500/20 hover:bg-green-500/30 text-green-400'
                        }`}
                        title={blog.published !== false ? 'Unpublish blog' : 'Publish blog'}
                      >
                        {blog.published !== false ? (
                          <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                      <button
                        onClick={() => handleEdit(blog)}
                        className="p-3 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-xl transition-all duration-300 hover:scale-110 group"
                        title="Edit blog"
                      >
                        <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(blog._id)}
                        className="p-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl transition-all duration-300 hover:scale-110 group"
                        title="Delete blog"
                      >
                        <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BlogManagement