import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { apiService } from '../services/api'

const BlogDetail = () => {
  const { id } = useParams()
  const [blog, setBlog] = useState(null)
  const [relatedBlogs, setRelatedBlogs] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch blog data from API
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        // Try to get blog by ID using apiService
        const blogResponse = await apiService.getBlogById(id)
        if (blogResponse.success && blogResponse.data) {
          setBlog(blogResponse.data)
        } else {
          throw new Error('Blog not found in API')
        }
        
        // Fetch related blogs
        const relatedResponse = await apiService.getBlogs({ limit: 3 })
        if (relatedResponse.success && relatedResponse.blogs) {
          const related = relatedResponse.blogs.filter(post => (post._id || post.id) !== id).slice(0, 2)
          setRelatedBlogs(related)
        }
      } catch (error) {
        console.error('Error fetching blog from API:', error)
        // Blog not found
        setBlog(null)
        setRelatedBlogs([])
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchBlog()
    } else {
      setLoading(false)
    }
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-gold-400 text-xl">Loading...</div>
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Blog Post Not Found</h1>
          <Link to="/" className="text-gold-400 hover:text-gold-300 transition-colors">
            Return to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-dark-900 pt-20">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-black via-dark-900 to-black">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <nav className="mb-8">
              <Link to="/" className="text-gold-400 hover:text-gold-300 transition-colors">
                Home
              </Link>
              <span className="text-gray-500 mx-2">/</span>
              <span className="text-gray-300">Blog</span>
              <span className="text-gray-500 mx-2">/</span>
              <span className="text-white">{blog.title}</span>
            </nav>

            {/* Blog Header */}
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-2 bg-gold-500/20 text-gold-400 rounded-full text-sm font-medium mb-4">
                {blog.category}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 font-serif leading-tight">
                {blog.title}
              </h1>
              <div className="flex items-center justify-center space-x-6 text-gray-400">
                <span>By AMZ Properties Team</span>
                <span>•</span>
                <span>{blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : (blog.date || new Date().toLocaleDateString())}</span>
                <span>•</span>
                <span>5 min read</span>
              </div>
            </div>

            {/* Featured Image */}
            <div className="relative overflow-hidden rounded-2xl mb-12">
              <img 
                src={blog.image_url ? `http://127.0.0.1:5000${blog.image_url}` : (blog.image || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=400&fit=crop')} 
                alt={blog.title}
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-dark-800/50 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-gold-500/20">
              <div 
                className="prose prose-lg prose-invert max-w-none"
                style={{
                  color: '#e5e7eb',
                  lineHeight: '1.8'
                }}
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Related Blogs */}
      {relatedBlogs.length > 0 && (
        <section className="py-16 border-t border-gold-500/20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-12 text-center font-serif">
                Related Articles
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                {relatedBlogs.map((relatedBlog) => (
                  <Link 
                    key={relatedBlog._id || relatedBlog.id}
                    to={`/blog/${relatedBlog._id || relatedBlog.id}`}
                    className="group"
                  >
                    <article className="bg-dark-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gold-500/20 hover:border-gold-400/40 transition-all duration-300">
                      <div className="relative overflow-hidden">
                        <img 
                          src={relatedBlog.image_url ? `http://127.0.0.1:5000${relatedBlog.image_url}` : (relatedBlog.image || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=250&fit=crop')} 
                          alt={relatedBlog.title}
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300"></div>
                      </div>
                      
                      <div className="p-6">
                        <div className="flex items-center text-gold-400 text-sm mb-3">
                          <span>{relatedBlog.category}</span>
                          <span className="mx-2">•</span>
                          <span>{relatedBlog.createdAt ? new Date(relatedBlog.createdAt).toLocaleDateString() : (relatedBlog.date || new Date().toLocaleDateString())}</span>
                        </div>
                        <h3 className="text-white font-semibold text-lg mb-3 group-hover:text-gold-400 transition-colors">
                          {relatedBlog.title}
                        </h3>
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {relatedBlog.content.replace(/<[^>]+>/g, '').substring(0, 150)}...
                        </p>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-gold-600/20 to-gold-400/20 border-t border-gold-500/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6 font-serif">
            Ready to Explore Dubai's Luxury Properties?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Contact our expert team to discover exclusive investment opportunities in Dubai's premium real estate market.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/contact" 
              className="px-8 py-4 bg-gradient-to-r from-gold-600 to-gold-500 text-white rounded-xl font-semibold hover:from-gold-700 hover:to-gold-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Contact Us
            </Link>
            <Link 
              to="/properties" 
              className="px-8 py-4 border border-gold-500 text-gold-400 rounded-xl font-semibold hover:bg-gold-500/10 transition-all duration-300"
            >
              View Properties
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default BlogDetail