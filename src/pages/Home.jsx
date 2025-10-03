import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import apiService from '../services/api.js'
import { countryCodes } from '../data/countryCodes'
// Using Unicode symbols instead of react-icons for now

const Home = () => {
  const navigate = useNavigate()
  const [currentBgIndex, setCurrentBgIndex] = useState(0)
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [currentExclusiveIndex, setCurrentExclusiveIndex] = useState(0)
  const [partnerDevelopers, setPartnerDevelopers] = useState([])
  const [testimonials, setTestimonials] = useState([])
  const [blogPosts, setBlogPosts] = useState([])
  const [allBlogs, setAllBlogs] = useState([])
  const [currentBlogIndex, setCurrentBlogIndex] = useState(0)
  const [activeBlog, setActiveBlog] = useState(null) // blog to show in modal
  const [publishedProjects, setPublishedProjects] = useState([])
  const [activeProject, setActiveProject] = useState(null)
  const [selectedDev, setSelectedDev] = useState(null) // developer to show in modal
  // Highlighted (featured) properties state
  const [highlightedProperties, setHighlightedProperties] = useState([])
  const [activeProperty, setActiveProperty] = useState(null)
  // keep minimal state for home
  

  
  // Contact form state (simplified)
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    countryCode: '+971',
    message: ''
  })
  const [contactSubmitting, setContactSubmitting] = useState(false)
  const [contactMessage, setContactMessage] = useState(null)
  
  // Background images for hero section
  const heroBackgrounds = [
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
  ]

  // Partner Developers Data
  // Removed static data - now relies entirely on API

  // Auto-change background images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prevIndex) => (prevIndex + 1) % heroBackgrounds.length)
    }, 5000) // Change every 5 seconds
    
    return () => clearInterval(interval)
  }, [])
  
 



  // Fetch developers from API
  const fetchDevelopers = async () => {
    try {
      if (typeof apiService.getDevelopers === 'function') {
        const res = await apiService.getDevelopers()
        let developersList = []
        if (res?.success && Array.isArray(res.data)) developersList = res.data
        else if (Array.isArray(res)) developersList = res
        else if (res?.data && Array.isArray(res.data)) developersList = res.data

        // Filter only active developers
        const activeDevelopers = developersList.filter(developer => developer.status !== 'inactive')
        setPartnerDevelopers(activeDevelopers)
      }
    } catch (error) {
      console.error('Error fetching developers:', error)
      setPartnerDevelopers([])
    }
  }

  // Fetch projects for highlighted projects section
  const fetchPublishedProjects = async () => {
    try {
      const res = await apiService.getProjects({ limit: 1000 })
      let items = []
      if (Array.isArray(res)) items = res
      else if (res && Array.isArray(res.data)) items = res.data
      else if (res && res.data && Array.isArray(res.data.items)) items = res.data.items
      else {
        const possibleArray = res && typeof res === 'object' ? Object.values(res).find(v => Array.isArray(v)) : null
        if (possibleArray) items = possibleArray
      }

      const published = (items || []).filter(p => p.published !== false)
      // Normalize image property
      const normalized = published.map(p => ({
        ...p,
        title: p.title || p.name || '',
        image: p.image || (p.images && p.images.length ? p.images[0] : null)
      }))
      setPublishedProjects(normalized.slice(0, 3))
    } catch (error) {
      console.error('Error fetching projects for highlighted section', error)
      setPublishedProjects([])
    }
  }

  // Fetch highlighted properties (similar pattern to highlighted projects)
  const fetchHighlightedProperties = async () => {
    try {
      if (typeof apiService.getProperties !== 'function') return
      const res = await apiService.getProperties({ limit: 1000 })
      let items = []
      // Flexible extraction like projects
      if (Array.isArray(res)) items = res
      else if (res && Array.isArray(res.data)) items = res.data
      else if (res && res.data && Array.isArray(res.data.items)) items = res.data.items
      else {
        const possibleArray = res && typeof res === 'object' ? Object.values(res).find(v => Array.isArray(v)) : null
        if (possibleArray) items = possibleArray
      }

      // We consider properties as highlight-worthy if status available (or no status) and maybe type exclusive/off-plan
      const candidates = (items || []).filter(p => p && p.status !== 'inactive')

      // Normalize structure similar to PropertyManagement display
      const normalized = candidates.map(p => ({
        ...p,
        title: p.title || p.name || '',
        image: p.image || (p.images && p.images.length ? p.images[0] : null)
      }))

      // Choose first 3 (could later add isHighlighted flag filtering if backend provides)
      setHighlightedProperties(normalized.slice(0, 3))
    } catch (error) {
      console.error('Error fetching highlighted properties', error)
      setHighlightedProperties([])
    }
  }

  // Fetch blogs from API
  const fetchBlogs = async () => {
    try {
      const result = await apiService.getBlogs({ limit: 1000 })
      if (result.blogs && Array.isArray(result.blogs)) {
        // Filter only published blogs
        const publishedBlogs = result.blogs.filter(blog => blog.published !== false)
        setAllBlogs(publishedBlogs)
        setBlogPosts(publishedBlogs.slice(0, 3))
      } else {
        // No blogs available
        setAllBlogs([])
        setBlogPosts([])
      }
    } catch (error) {
      console.error('Error fetching blogs:', error)
      // No blogs available
      setAllBlogs([])
      setBlogPosts([])
    }
  }

  // Fetch testimonials from API
  const fetchTestimonials = async () => {
    try {
      const result = await apiService.getTestimonials({ limit: 1000 })
      if (result.testimonials && Array.isArray(result.testimonials)) {
        // Filter only published testimonials
        const publishedTestimonials = result.testimonials.filter(testimonial => testimonial.published !== false)

        // Load downloaded testimonial images and match them with testimonials
        try {
          const storedImagesResult = await apiService.loadStoredImages()
          if (storedImagesResult.success && storedImagesResult.data && Array.isArray(storedImagesResult.data)) {
            const storedImages = storedImagesResult.data

            // Match stored images with testimonials by ID
            const testimonialsWithImages = publishedTestimonials.map(testimonial => {
              const matchingImage = storedImages.find(img => img.id === testimonial._id || img.id === testimonial.id)
              if (matchingImage) {
                return {
                  ...testimonial,
                  image: matchingImage.dataUrl // Use the downloaded image data URL
                }
              }
              return testimonial // Return testimonial as-is if no matching downloaded image
            })

            setTestimonials(testimonialsWithImages)
          } else {
            setTestimonials(publishedTestimonials)
          }
        } catch (imageError) {
          console.warn('Error loading stored testimonial images:', imageError)
          setTestimonials(publishedTestimonials)
        }
      } else {
        // No fallback available
        setTestimonials([])
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error)
      // No fallback available
      setTestimonials([])
    }
  }

  // Blog navigation functions
  const nextBlogs = () => {
    if (currentBlogIndex + 3 < allBlogs.length) {
      const newIndex = currentBlogIndex + 3
      setCurrentBlogIndex(newIndex)
      setBlogPosts(allBlogs.slice(newIndex, newIndex + 3))
    }
  }

  const prevBlogs = () => {
    if (currentBlogIndex > 0) {
      const newIndex = Math.max(0, currentBlogIndex - 3)
      setCurrentBlogIndex(newIndex)
      setBlogPosts(allBlogs.slice(newIndex, newIndex + 3))
    }
  }

  // Exclusive Properties navigation functions
  const nextExclusiveProperties = () => {
    if (currentExclusiveIndex + 3 < allExclusiveProperties.length) {
      const newIndex = currentExclusiveIndex + 3
      setCurrentExclusiveIndex(newIndex)
      setExclusiveProperties(allExclusiveProperties.slice(newIndex, newIndex + 3))
    }
  }

  const prevExclusiveProperties = () => {
    if (currentExclusiveIndex > 0) {
      const newIndex = Math.max(0, currentExclusiveIndex - 3)
      setCurrentExclusiveIndex(newIndex)
      setExclusiveProperties(allExclusiveProperties.slice(newIndex, newIndex + 3))
    }
  }



  // Property click handler
  const handlePropertyClick = (property) => {
    // open quick-view modal instead of navigation
    setActiveProject(property)
  }

  // Developer click handler
  const handleDeveloperClick = (developer) => {
    // open modal/profile pop-off
    setSelectedDev(developer)
  }

  // Close developer modal
  const closeDeveloperModal = () => setSelectedDev(null)

  // Initialize data
  useEffect(() => {
    fetchDevelopers()
    fetchBlogs()
    fetchTestimonials()
    fetchPublishedProjects()
    fetchHighlightedProperties()
  }, [])

  // Refresh blogs when window gains focus (user returns from admin panel)
  useEffect(() => {
    const handleFocus = () => {
      fetchBlogs()
      fetchTestimonials()
    }
    
    window.addEventListener('focus', handleFocus)
    // Listen for testimonial updates dispatched from admin panel
    const handleTestimonialsUpdated = () => fetchTestimonials()
    window.addEventListener('testimonialsUpdated', handleTestimonialsUpdated)
    // Listen for projects updates dispatched from admin (publish/unpublish)
    const handleProjectsUpdated = () => fetchPublishedProjects()
  const handlePropertiesUpdated = () => fetchHighlightedProperties()
    const handleDevelopersUpdated = () => fetchDevelopers()
    window.addEventListener('projectsUpdated', handleProjectsUpdated)
  window.addEventListener('propertiesUpdated', handlePropertiesUpdated)
    window.addEventListener('developersUpdated', handleDevelopersUpdated)

    return () => {
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('testimonialsUpdated', handleTestimonialsUpdated)
      window.removeEventListener('projectsUpdated', handleProjectsUpdated)
      window.removeEventListener('propertiesUpdated', handlePropertiesUpdated)
      window.removeEventListener('developersUpdated', handleDevelopersUpdated)
    }
  }, [])

  // Auto-rotate testimonials
  useEffect(() => {
    if (testimonials.length > 0) {
      const interval = setInterval(() => {
        setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [testimonials])


  // Contact form handling functions
  const handleContactInputChange = (e) => {
    const { name, value } = e.target
    setContactForm(prev => ({ ...prev, [name]: value }))
  }

  const handleContactSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      setContactMessage({
        type: 'error',
        text: 'Please fill in all required fields.'
      })
      return
    }

    setContactSubmitting(true)
    setContactMessage(null)

    try {
      const result = await apiService.submitContactForm(contactForm)
      if (result.success) {
        setContactMessage({
          type: 'success',
          text: 'Thank you for your message! We will get back to you soon.'
        })
        // Reset form
        setContactForm({
          name: '',
          email: '',
          phone: '',
          countryCode: '+971',
          propertyInterest: '',
          subject: '',
          message: ''
        })
      } else {
        setContactMessage({
          type: 'error',
          text: result.message || 'Error sending message. Please try again.'
        })
      }
    } catch (error) {
      console.error('Error sending message:', error)
      setContactMessage({
        type: 'error',
        text: 'Error sending message. Please check your connection and try again.'
      })
    } finally {
      setContactSubmitting(false)
    }
  }




  

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section with Search */}
      <section className="relative min-h-screen text-white overflow-hidden">
        {/* Background Images */}
        {heroBackgrounds.map((bg, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${
              index === currentBgIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ backgroundImage: `url(${bg})` }}
          />
        ))}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50 sm:bg-black/65"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-luxury-600/60 to-gold-600/60 sm:from-luxury-600/40 sm:to-gold-600/40"></div>
        
        {/* Background Indicators */}
        <div className="absolute bottom-4 xs:bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-1 xs:space-x-2 z-10">
          {heroBackgrounds.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBgIndex(index)}
              className={`w-2 h-2 xs:w-3 xs:h-3 rounded-full transition-all duration-300 ${
                index === currentBgIndex 
                  ? 'bg-gold-400 scale-125' 
                  : 'bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
        
        <div className="relative container mx-auto px-2 xs:px-4 py-8 xs:py-12 sm:py-20 flex flex-col justify-center min-h-screen">
          <div className="text-center max-w-6xl mx-auto">
            <div className="mb-4 xs:mb-6 sm:mb-8">
              <span className="text-gold-400 font-medium tracking-wider uppercase text-xs xs:text-sm sm:text-lg mb-2 xs:mb-4 block">Welcome to AMZ Properties</span>
              <h1 className="text-2xl xs:text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-3 xs:mb-4 sm:mb-6 font-serif bg-gradient-to-r from-white via-gold-200 to-white bg-clip-text text-transparent leading-tight px-1">
                Dubai's Premier<br className="hidden xs:block" /><span className="xs:hidden"> </span>Luxury Real Estate
              </h1>
              <p className="text-sm xs:text-base sm:text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-6 xs:mb-8 sm:mb-12 px-2 xs:px-4 sm:px-0">
                Discover exceptional properties in the world's most prestigious locations. 
                We specialize in exclusive luxury real estate that defines sophisticated living.
              </p>
            </div>
            
                  {/* Minimal hero - no search */}
                  <div className="mb-6 xs:mb-8 sm:mb-12 px-2">
                    {/* Intro copy intentionally minimal - removed verbose summary as requested */}
                  </div>
          </div>
        </div>
      </section>

      
  {/* Partner Developers Section */}
  <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-black via-dark-900 to-black relative overflow-hidden">
    {/* Background decorative elements */}
    <div className="absolute inset-0 opacity-10">
      <div className="absolute top-20 left-10 w-32 h-32 bg-gold-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-luxury-500/20 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gold-400/10 rounded-full blur-3xl"></div>
    </div>

    <div className="container mx-auto px-4 relative z-10">
      {/* Section Header */}
      <div className="text-center mb-8 sm:mb-12 lg:mb-16">
        <span className="inline-block text-gold-400 font-medium tracking-wider uppercase text-xs sm:text-sm mb-3 sm:mb-4 px-3 sm:px-4 py-1.5 sm:py-2 border border-gold-500/30 rounded-full bg-gold-500/10">
          Trusted Partners
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 sm:mb-6 font-serif px-4 sm:px-0">
          Our <span className="text-gold-400">Trusted</span> Partners
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-4 sm:px-6 lg:px-0">
          Partnering with Dubai's most prestigious and renowned developers to deliver exceptional properties and unmatched quality
        </p>
      </div>

      {/* Developers Grid */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 lg:gap-4">
        {partnerDevelopers.length === 0 ? (
          <div className="col-span-full text-center text-gray-400">No developers found</div>
        ) : (
          partnerDevelopers.map((developer, index) => (
            <div
              key={developer._id || developer.id || index}
              className="group relative cursor-pointer"
              style={{ animationDelay: `${index * 0.05}s` }}
              onClick={() => handleDeveloperClick(developer)}
            >
              {/* Developer Card */}
              <div className="relative bg-gradient-to-br from-white/6 to-white/3 backdrop-blur-sm border border-gold-500/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-4 h-full transition-all duration-500 hover:border-gold-400/40 hover:bg-gradient-to-br hover:from-gold-500/10 hover:to-gold-400/5 hover:scale-105 hover:shadow-2xl hover:shadow-gold-500/20 cursor-pointer overflow-hidden">

                {/* Cover Image */}
                <div className="relative mb-3 sm:mb-4 lg:mb-3 h-20 sm:h-24 lg:h-20 rounded-lg sm:rounded-xl overflow-hidden">
                  {developer.cover_image ? (
                    <img src={developer.cover_image} alt={`${developer.name} cover`} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-300" loading="lazy" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gold-500/20 to-gold-400/10 flex items-center justify-center">
                      <div className="text-gold-400 text-xs font-semibold">Cover Image</div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                </div>

                {/* Logo Container or placeholder */}
                <div className="relative mb-3 sm:mb-4 lg:mb-3">
                  <div className="w-full h-14 sm:h-16 md:h-18 lg:h-14 flex items-center justify-center bg-white/95 rounded-lg sm:rounded-xl p-2 sm:p-3 group-hover:bg-white transition-all duration-300">
                    {developer.logo ? (
                      <img src={developer.logo} alt={developer.name} className="max-w-full max-h-full object-contain filter group-hover:scale-110 transition-all duration-300" loading="lazy" />
                    ) : (
                      <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center text-gray-700 font-semibold">{(developer.name || 'D').charAt(0)}</div>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-gold-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-lg sm:rounded-xl"></div>
                </div>

                <div className="text-center">
                  <h3 className="text-white font-bold text-xs sm:text-sm md:text-base lg:text-sm mb-1 sm:mb-2 group-hover:text-gold-400 transition-colors duration-300 leading-tight">{developer.name}</h3>
                  <p className="text-gray-400 text-xs sm:text-sm lg:text-xs leading-relaxed opacity-0 sm:opacity-0 md:group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 hidden sm:block">{developer.description}</p>

                  <div className="mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <span className="text-gold-400 text-xs font-medium border border-gold-400/50 px-2 py-1 rounded-full bg-gold-400/10">View Profile</span>
                  </div>
                </div>

                <div className="absolute top-2 right-2 w-2 h-2 sm:w-3 sm:h-3 border-t-2 border-r-2 border-gold-400/30 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                <div className="absolute bottom-2 left-2 w-2 h-2 sm:w-3 sm:h-3 border-b-2 border-l-2 border-gold-400/30 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bottom CTA */}
      <div className="text-center mt-12 sm:mt-16 lg:mt-20 px-4 sm:px-0">
        <p className="text-gray-300 mb-6 sm:mb-8 text-base sm:text-lg max-w-2xl mx-auto">
          Ready to explore premium properties from these trusted partners?
        </p>
        <button className="bg-gradient-to-r from-gold-400 to-gold-600 text-black px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg hover:from-gold-500 hover:to-gold-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl w-full sm:w-auto max-w-xs sm:max-w-none">
          View All Properties
        </button>
      </div>
    </div>

    {/* Developer Profile Modal */}
    {selectedDev && (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/60" onClick={closeDeveloperModal}></div>
        <div className="relative bg-gray-900 rounded-2xl border border-yellow-400/20 max-w-4xl w-full mx-4 p-6 z-10">
          {/* Cover Image Header */}
          {selectedDev.cover_image && (
            <div className="relative h-32 sm:h-40 rounded-xl overflow-hidden mb-6">
              <img src={selectedDev.cover_image} alt={`${selectedDev.name} cover`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-2xl font-bold text-white">{selectedDev.name}</h3>
                <p className="text-yellow-300/70 text-sm">{selectedDev.description}</p>
              </div>
            </div>
          )}

          <div className="flex justify-between items-start mb-4">
            {!selectedDev.cover_image && (
              <div>
                <h3 className="text-2xl font-bold text-white">{selectedDev.name}</h3>
                <p className="text-yellow-300/70 text-sm">{selectedDev.description}</p>
              </div>
            )}
            <button onClick={closeDeveloperModal} className="text-yellow-300 text-sm px-3 py-1 hover:bg-yellow-400/10 rounded">Close</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-yellow-300 font-medium mb-3">Overview</h4>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">{selectedDev.about || selectedDev.description}</p>

              {/* Logo Display */}
              {selectedDev.logo && (
                <div className="mb-4">
                  <div className="w-20 h-20 bg-white/95 rounded-lg flex items-center justify-center p-2">
                    <img src={selectedDev.logo} alt={selectedDev.name} className="max-w-full max-h-full object-contain" />
                  </div>
                </div>
              )}

              <div className="text-sm text-yellow-100 space-y-2">
                <div><strong>Established:</strong> {selectedDev.established || selectedDev.established_year || selectedDev.createdAt?.slice(0,4) || 'N/A'}</div>
                <div><strong>Total Projects:</strong> {selectedDev.projects_count?.total || selectedDev.totalProjects || selectedDev.total_projects || 'N/A'}</div>
                {selectedDev.projects_count && (
                  <div><strong>Completed:</strong> {selectedDev.projects_count.completed || 0} • <strong>In Progress:</strong> {selectedDev.projects_count.in_progress || 0}</div>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-yellow-300 font-medium mb-3">Contact Information</h4>
              <div className="text-sm text-yellow-100 space-y-2">
                {selectedDev.website && <div><a href={selectedDev.website} target="_blank" rel="noreferrer" className="text-gold-400 underline hover:text-gold-300">Visit Website</a></div>}
                {selectedDev.contact_info?.email && <div><strong>Email:</strong> {selectedDev.contact_info.email}</div>}
                {selectedDev.contact_info?.mobile_no && <div><strong>Phone:</strong> {selectedDev.contact_info.mobile_no}</div>}
                {selectedDev.contact_info?.address && <div><strong>Address:</strong> {selectedDev.contact_info.address}</div>}
              </div>

              {selectedDev.projects && selectedDev.projects.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-yellow-300 font-medium mb-3">Projects</h4>
                  <div className="space-y-1">
                    {selectedDev.projects.slice(0, 5).map((project, i) => (
                      <div key={i} className="text-gray-300 text-sm">• {typeof project === 'string' ? project : project.name || project.title || 'Untitled Project'}</div>
                    ))}
                    {selectedDev.projects.length > 5 && (
                      <div className="text-gray-400 text-xs mt-2">And {selectedDev.projects.length - 5} more projects...</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )}
  </section>
      {/* Highlighted Projects Section (Featured Off-Plan) */}
      <section className="py-20 bg-black/95 border-t border-gold-500/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-gold-400 font-medium tracking-wider uppercase text-sm mb-4 block">Featured</span>
            <h2 className="text-4xl font-bold text-gold-400 mb-4 font-serif">Highlighted Projects</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">Selected off-plan projects curated from our projects collection</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publishedProjects.length > 0 ? (
              publishedProjects.map((p) => (
                <div key={p.id || p._id} className="luxury-card cursor-pointer overflow-hidden" onClick={() => handlePropertyClick(p)}>
                  <img src={p.image || (p.images && p.images.length ? p.images[0] : null) || 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} alt={p.title} className="w-full h-56 object-cover" />
                  <div className="p-4 bg-gray-900">
                    <h3 className="text-white font-bold text-lg">{p.title}</h3>
                    <p className="text-gray-300 mt-2">Developer: {p.developer || 'N/A'}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-400 py-12">
                <p className="text-lg">No featured projects available at the moment.</p>
                <p className="text-sm mt-2">Check back soon for new listings.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Highlighted Properties Section (Featured Listings) */}
      <section className="py-20 bg-black border-t border-gold-500/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-gold-400 font-medium tracking-wider uppercase text-sm mb-4 block">Featured</span>
            <h2 className="text-4xl font-bold text-gold-400 mb-4 font-serif">Highlighted Properties</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">A curated selection of standout properties from our collection</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {highlightedProperties.length > 0 ? (
              highlightedProperties.map((prop) => (
                <div
                  key={prop._id || prop.id}
                  className="luxury-card cursor-pointer overflow-hidden group"
                  onClick={() => setActiveProperty(prop)}
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={prop.image || (prop.images && prop.images[0]) || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'}
                      alt={prop.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                    {prop.type && (
                      <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold bg-gold-500/90 text-black`}>{prop.type === 'off-plan' ? 'Off-Plan' : 'Exclusive'}</span>
                    )}
                  </div>
                  <div className="p-4 bg-gray-900">
                    <h3 className="text-white font-bold text-lg line-clamp-1">{prop.title}</h3>
                    <div className="mt-2 text-gold-400 font-semibold text-sm">
                      {prop.price ? new Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED', minimumFractionDigits: 0 }).format(prop.price) : 'Price on Request'}
                    </div>
                    <p className="text-gray-400 text-sm mt-2 line-clamp-2">{prop.location}</p>
                    <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-300">
                      {prop.bedrooms && <span>{prop.bedrooms} BR</span>}
                      {prop.bathrooms && <span>{prop.bathrooms} BA</span>}
                      {prop.area && <span>{Number(prop.area).toLocaleString()} sq ft</span>}
                      {prop.roi && <span className="text-green-400">ROI {prop.roi}%</span>}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-400 py-12">
                <p className="text-lg">No highlighted properties available right now.</p>
                <p className="text-sm mt-2">New featured listings will appear here soon.</p>
              </div>
            )}
          </div>
        </div>
      </section>


      {/* Testimonials Section - always shown; show placeholder when empty */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 to-black/80"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-600">Clients Say</span></h2>
            <p className="text-gray-300 max-w-2xl mx-auto">Real experiences from our clients</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {testimonials.length > 0 ? (
                <>
                  <div className="luxury-card p-8 md:p-12 text-center min-h-[300px] flex flex-col justify-center">
                    <div className="mb-6">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full overflow-hidden border-4 border-gold-400">
                        <img src={testimonials[activeTestimonial]?.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'} alt={testimonials[activeTestimonial]?.name} className="w-full h-full object-cover" />
                      </div>
                    </div>
                    <blockquote className="text-white text-lg leading-relaxed italic">{testimonials[activeTestimonial]?.comments}</blockquote>
                    <div className="mt-6 font-semibold text-gold-400">{testimonials[activeTestimonial]?.name}</div>
                  </div>
                  {testimonials.length > 1 && (
                    <div className="flex justify-center mt-6 space-x-3">
                      {testimonials.map((_, i) => (
                        <button key={i} onClick={() => setActiveTestimonial(i)} className={`w-3 h-3 rounded-full ${activeTestimonial===i? 'bg-gold-400' : 'bg-gray-600'}`} />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="luxury-card p-8 md:p-12 text-center min-h-[260px] flex flex-col items-center justify-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-gray-800/60 flex items-center justify-center border-2 border-gold-400 text-gold-400 text-3xl">“</div>
                  <h3 className="text-xl text-white font-semibold">No testimonials yet</h3>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section (Latest Posts) with optional manual add - moved above Contact */}
      <section className="py-20 bg-black/95 border-t border-gold-500/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-gold-400 font-medium tracking-wider uppercase text-sm mb-4 block">Latest Insights</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gold-400 mb-6 font-serif">From Our Blog</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">Stay updated with the latest trends and insights in Dubai's luxury real estate market</p>
          </div>
          
          <div className="relative">
            {/* Navigation Buttons */}
            {allBlogs.length > 3 && (
              <>
                <button
                  onClick={prevBlogs}
                  disabled={currentBlogIndex === 0}
                  className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 rounded-full border-2 border-gold-500 flex items-center justify-center transition-all duration-300 ${
                    currentBlogIndex === 0 
                      ? 'bg-gray-800 text-gray-500 cursor-not-allowed opacity-50' 
                      : 'bg-black/80 text-gold-400 hover:bg-gold-500 hover:text-black hover:scale-110'
                  }`}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <button
                  onClick={nextBlogs}
                  disabled={currentBlogIndex + 3 >= allBlogs.length}
                  className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 rounded-full border-2 border-gold-500 flex items-center justify-center transition-all duration-300 ${
                    currentBlogIndex + 3 >= allBlogs.length 
                      ? 'bg-gray-800 text-gray-500 cursor-not-allowed opacity-50' 
                      : 'bg-black/80 text-gold-400 hover:bg-gold-500 hover:text-black hover:scale-110'
                  }`}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 px-2 sm:px-4">
            {blogPosts.map((post) => (
              <div key={post._id || post.id} className="block h-full">
                <article onClick={() => setActiveBlog(post)} className="luxury-card overflow-hidden group cursor-pointer h-full flex flex-col">
                  <div className="relative overflow-hidden">
                    <img src={post.image || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=250&fit=crop'} alt={post.title} className="w-full h-48 object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="text-white font-bold text-lg">{post.title}</h3>
                    <p className="text-gray-300 mt-2 flex-1">{post.excerpt}</p>
                    <div className="mt-4 text-sm text-gray-400">{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : ''}</div>
                  </div>
                </article>
              </div>
            ))}
            </div>

            {/* Blog Modal */}
            {activeBlog && (
              <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                <div className="absolute inset-0 bg-black/70" onClick={() => setActiveBlog(null)} />
                <div role="dialog" aria-modal="true" className="relative max-w-3xl w-full mx-auto">
                  <div className="bg-gray-900 rounded-2xl overflow-hidden border border-gold-500/20 shadow-2xl">
                    <div className="relative h-56 sm:h-72 md:h-80 lg:h-96">
                      <img src={activeBlog.image || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=400&fit=crop'} alt={activeBlog.title} className="w-full h-full object-cover" />
                      <button onClick={() => setActiveBlog(null)} className="absolute top-3 right-3 bg-black/50 text-white rounded-full p-2">✕</button>
                    </div>
                    <div className="p-6 max-h-[60vh] overflow-y-auto bg-gray-900">
                      <h3 className="text-2xl font-bold text-white mb-3">{activeBlog.title}</h3>
                      <div className="text-sm text-gray-400 mb-4">{activeBlog.publishedAt ? new Date(activeBlog.publishedAt).toLocaleDateString() : ''}</div>
                      <div className="text-gray-200 leading-relaxed">
                        {/* Use content if available, otherwise show excerpt */}
                        {activeBlog.content ? (
                          <div dangerouslySetInnerHTML={{ __html: activeBlog.content }} />
                        ) : (
                          <p>{activeBlog.excerpt}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Project Quick View Modal */}
            {activeProject && (
              <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                <div className="absolute inset-0 bg-black/70" onClick={() => setActiveProject(null)} />
                <div role="dialog" aria-modal="true" className="relative max-w-4xl w-full mx-auto">
                  <div className="bg-gray-900 rounded-2xl overflow-hidden border border-gold-500/20 shadow-2xl">
                    <div className="relative h-56 sm:h-72 md:h-80 lg:h-96">
                      <img src={activeProject.image || (activeProject.images && activeProject.images[0]) || 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} alt={activeProject.title || activeProject.name} className="w-full h-full object-cover" />
                      <button onClick={() => setActiveProject(null)} className="absolute top-3 right-3 bg-black/50 text-white rounded-full p-2">✕</button>
                    </div>
                    <div className="p-6 max-h-[70vh] overflow-y-auto bg-gray-900">
                      <h3 className="text-2xl font-bold text-white mb-3">{activeProject.title || activeProject.name}</h3>
                      <div className="text-sm text-gray-400 mb-4">Developer: {activeProject.developer || 'N/A'}</div>
                      <div className="text-gray-200 leading-relaxed">
                        <p>{activeProject.description || activeProject.summary || ''}</p>
                        <div className="mt-4 text-sm text-gray-400">Bedrooms: {activeProject.bedrooms || 'N/A'} • Area: {activeProject.area || 'N/A'}</div>
                        <div className="mt-2 text-sm text-gray-400">Status: {activeProject.status || activeProject.project_statuses || 'N/A'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Property Quick View Modal */}
            {activeProperty && (
              <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                <div className="absolute inset-0 bg-black/70" onClick={() => setActiveProperty(null)} />
                <div role="dialog" aria-modal="true" className="relative max-w-4xl w-full mx-auto">
                  <div className="bg-gray-900 rounded-2xl overflow-hidden border border-gold-500/20 shadow-2xl">
                    <div className="relative h-56 sm:h-72 md:h-80 lg:h-96">
                      <img
                        src={activeProperty.image || (activeProperty.images && activeProperty.images[0]) || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'}
                        alt={activeProperty.title}
                        className="w-full h-full object-cover"
                      />
                      <button onClick={() => setActiveProperty(null)} className="absolute top-3 right-3 bg-black/50 text-white rounded-full p-2">✕</button>
                    </div>
                    <div className="p-6 max-h-[70vh] overflow-y-auto bg-gray-900">
                      <h3 className="text-2xl font-bold text-white mb-3">{activeProperty.title}</h3>
                      <div className="text-sm text-gray-400 mb-4">
                        {activeProperty.location} {activeProperty.type && <span className="ml-2 text-gold-400">• {activeProperty.type === 'off-plan' ? 'Off-Plan' : 'Exclusive'}</span>}
                      </div>
                      <div className="text-gold-400 font-semibold text-lg mb-4">
                        {activeProperty.price ? new Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED', minimumFractionDigits: 0 }).format(activeProperty.price) : 'Price on Request'}
                      </div>
                      <div className="text-gray-200 leading-relaxed">
                        <p>{activeProperty.description}</p>
                        <div className="mt-4 text-sm text-gray-300 flex flex-wrap gap-4">
                          {activeProperty.bedrooms && <span>{activeProperty.bedrooms} Bedrooms</span>}
                          {activeProperty.bathrooms && <span>{activeProperty.bathrooms} Bathrooms</span>}
                          {activeProperty.area && <span>{Number(activeProperty.area).toLocaleString()} sq ft</span>}
                          {activeProperty.status && <span>Status: {activeProperty.status}</span>}
                          {activeProperty.roi && <span className="text-green-400">ROI {activeProperty.roi}%</span>}
                        </div>
                        {activeProperty.features && activeProperty.features.length > 0 && (
                          <div className="mt-6">
                            <h4 className="text-gold-400 font-medium mb-2">Features</h4>
                            <div className="flex flex-wrap gap-2">
                              {activeProperty.features.map((f, i) => (
                                <span key={i} className="px-3 py-1 rounded-full text-xs bg-gold-500/10 border border-gold-500/30 text-gold-300">{f}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* manual admin CTA removed */}
            
            {/* Pagination Indicators */}
            {allBlogs.length > 3 && (
              <div className="flex justify-center mt-8 space-x-2">
                {Array.from({ length: Math.ceil(allBlogs.length / 3) }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      const newIndex = i * 3
                      setCurrentBlogIndex(newIndex)
                      setBlogPosts(allBlogs.slice(newIndex, newIndex + 3))
                    }}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      Math.floor(currentBlogIndex / 3) === i 
                        ? 'bg-gold-400 scale-125' 
                        : 'bg-gray-600 hover:bg-gold-400/50'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-gradient-to-br from-black to-dark-900 border-t border-gold-500/20 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gold-400/10 to-transparent"></div>
          <div className="absolute top-1/4 right-0 w-96 h-96 bg-gold-400/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-gold-400/5 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <span className="text-gold-400 font-medium tracking-wider uppercase text-sm mb-4 block">Get In Touch</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gold-400 mb-6 font-serif">Contact Us</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Ready to find your dream property? Get in touch with our expert team today
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="bg-gradient-to-br from-luxury-900/50 to-black/50 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-gold-500/20 shadow-2xl">
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Name *</label>
                  <input type="text" name="name" value={contactForm.name} onChange={handleContactInputChange} required className="w-full px-4 py-3 rounded-lg bg-dark-700/50 border border-gray-600 text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
                  <input type="email" name="email" value={contactForm.email} onChange={handleContactInputChange} required className="w-full px-4 py-3 rounded-lg bg-dark-700/50 border border-gray-600 text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                  <div className="flex gap-2">
                    <select name="countryCode" value={contactForm.countryCode} onChange={handleContactInputChange} className="px-3 py-3 rounded-lg bg-dark-700/50 border border-gray-600 text-white">
                      {countryCodes.map(c => (<option key={c.code} value={c.code}>{c.code}</option>))}
                    </select>
                    <input type="tel" name="phone" value={contactForm.phone} onChange={handleContactInputChange} className="flex-1 px-4 py-3 rounded-lg bg-dark-700/50 border border-gray-600 text-white" placeholder="e.g. 501234567" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Message *</label>
                  <textarea name="message" value={contactForm.message} onChange={handleContactInputChange} required rows={5} className="w-full px-4 py-3 rounded-lg bg-dark-700/50 border border-gray-600 text-white" />
                </div>
                <div className="text-center">
                  <button type="submit" disabled={contactSubmitting} className="px-6 py-3 bg-gradient-to-r from-gold-600 to-yellow-500 text-black font-semibold rounded-xl">{contactSubmitting? 'Sending...' : 'Send Message'}</button>
                </div>
                {contactMessage && (<div className={`text-center p-3 rounded-lg ${contactMessage.type==='success'?'bg-green-500/10 text-green-300':'bg-red-500/10 text-red-300'}`}>{contactMessage.text}</div>)}
              </form>
            </div>
          </div>
        </div>
      </section>





      

      

      

    </div>
  )
}

export default Home