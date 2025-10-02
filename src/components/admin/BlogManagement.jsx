import React, { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { apiService, API_CONFIG } from '../../services/api'
import GenericCard from './GenericCard'
import GenericModal from './GenericModal'

const BlogManagement = () => {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingBlog, setEditingBlog] = useState(null)

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
      console.log('BlogManagement: Starting fetchBlogs')
      const response = await apiService.getBlogs({
        limit: 1000 // Set high limit for admin panel to show all blogs
      })
      console.log('BlogManagement: API response', response)
      if (response && response.blogs && Array.isArray(response.blogs)) {
        // Ensure all blogs have a published field
        const blogsWithPublishedField = response.blogs.map(blog => ({
          ...blog,
          published: blog.published !== false // Default to true if undefined
        }));
        console.log('BlogManagement: Setting blogs from response.blogs', blogsWithPublishedField.length)
        setBlogs(blogsWithPublishedField)
      } else if (response && response.success) {
        console.log('BlogManagement: Setting empty blogs array')
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

  const handleSubmit = async (submitData) => {
    try {
      let response
      if (editingBlog) {
        // Use the existing local API for updates
        const formDataToSend = new FormData()

        Object.keys(submitData).forEach(key => {
          if (key === 'image' && submitData[key]) {
            formDataToSend.append('image', submitData[key])
          } else if (key !== 'image') {
            formDataToSend.append(key, submitData[key])
          }
        })

        response = await apiService.updateBlog(editingBlog._id, formDataToSend)
      } else {
        // Use the real API for creating new blogs
        try {
          response = await apiService.createBlogWithAPI(submitData)
          console.log('API Response:', response)
        } catch (apiError) {
          console.warn('Real API failed, falling back to local storage:', apiError.message)
          toast.error(`API Error: ${apiError.message}. Using local storage instead.`)

          // Fallback to local storage if real API fails
          const formDataToSend = new FormData()

          Object.keys(submitData).forEach(key => {
            if (key === 'image' && submitData[key]) {
              formDataToSend.append('image', submitData[key])
            } else if (key !== 'image') {
              formDataToSend.append(key, submitData[key])
            }
          })

          response = await apiService.createBlog(formDataToSend)
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
    // Form data is now handled by GenericModal
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
      {/* Blog Modal */}
      <GenericModal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false)
          setEditingBlog(null)
          resetForm()
        }}
        title={editingBlog ? 'Edit Blog Post' : 'Add New Blog Post'}
        onSubmit={handleSubmit}
        submitButtonText={editingBlog ? 'Update Blog' : 'Create Blog'}
        sections={[
          {
            title: 'Basic Information',
            fields: [
              {
                name: 'title',
                label: 'Title',
                type: 'text',
                required: true,
                placeholder: 'Enter blog title'
              },
              {
                name: 'category',
                label: 'Category',
                type: 'select',
                required: true,
                options: categories.map(cat => ({ value: cat, label: cat }))
              },
              {
                name: 'content',
                label: 'Content',
                type: 'textarea',
                required: true,
                placeholder: 'Write your blog content here...',
                rows: 6
              },
              {
                name: 'tags',
                label: 'Tags (comma separated)',
                type: 'text',
                placeholder: 'dubai, real estate, investment'
              }
            ]
          },
          {
            title: 'Featured Image',
            fields: [
              {
                name: 'image',
                label: 'Blog Image',
                type: 'file',
                accept: 'image/*'
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
        ]}
        initialData={editingBlog ? {
          title: editingBlog.title,
          content: editingBlog.content,
          category: editingBlog.category,
          tags: editingBlog.tags ? editingBlog.tags.join(', ') : '',
          image: null,
          published: editingBlog.published !== false
        } : {
          title: '',
          content: '',
          category: 'Market Analysis',
          tags: '',
          image: null,
          published: true
        }}
      />

      <div className="space-y-6">
        {/* Blogs List */}
      <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-2xl shadow-2xl border border-yellow-400/30 backdrop-blur-sm">
        <div className="px-8 py-6 border-b border-yellow-400/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">All Blog Posts ({blogs.length})</h3>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-4 py-2 rounded-lg hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300 font-medium shadow-md hover:shadow-lg"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Add New Blog</span>
            </button>
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
                <GenericCard
                  key={blog._id}
                  item={blog}
                  type="blog"
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onPublishToggle={handlePublishToggle}
                  titleField="title"
                  subtitleField="category"
                  descriptionField="content"
                  dateField="createdAt"
                  imageField="image"
                  fields={[
                    { key: 'tags', label: 'Tags', className: 'text-yellow-300/70' }
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

export default BlogManagement