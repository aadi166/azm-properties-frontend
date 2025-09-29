import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import apiService from '../services/api.js'
import TrustedDevelopers from '../components/TrustedDevelopers'
import { countryCodes } from '../data/countryCodes'
import { default as staticTestimonials } from '../data/testimonials'
// Using Unicode symbols instead of react-icons for now

const Home = () => {
  const navigate = useNavigate()
  const [currentBgIndex, setCurrentBgIndex] = useState(0)
  const [activeTestimonial, setActiveTestimonial] = useState(0)


 
  const [exclusiveProperties, setExclusiveProperties] = useState([])
  const [offPlanProperties, setOffPlanProperties] = useState([])
  const [allExclusiveProperties, setAllExclusiveProperties] = useState([])
  const [allOffPlanProperties, setAllOffPlanProperties] = useState([])
  const [currentExclusiveIndex, setCurrentExclusiveIndex] = useState(0)
  const [currentOffPlanIndex, setCurrentOffPlanIndex] = useState(0)
  const [partnerDevelopers, setPartnerDevelopers] = useState([])
  const [testimonials, setTestimonials] = useState([])
  const [blogPosts, setBlogPosts] = useState([])
  const [allBlogs, setAllBlogs] = useState([])
  const [currentBlogIndex, setCurrentBlogIndex] = useState(0)
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
  const staticPartnerDevelopers = [
    { id: 1, name: 'Emaar Properties', logo: 'https://picsum.photos/200/100?random=1', projects: 25 },
    { id: 2, name: 'Dubai Properties', logo: 'https://picsum.photos/200/100?random=2', projects: 18 },
    { id: 3, name: 'Damac Properties', logo: 'https://picsum.photos/200/100?random=3', projects: 22 },
    { id: 4, name: 'Sobha Realty', logo: 'https://picsum.photos/200/100?random=4', projects: 15 },
    { id: 5, name: 'Meraas', logo: 'https://picsum.photos/200/100?random=5', projects: 12 },
    { id: 6, name: 'Nakheel', logo: 'https://picsum.photos/200/100?random=6', projects: 20 }
  ]

  // no services on home - keep page minimal

  // Auto-change background images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prevIndex) => (prevIndex + 1) % heroBackgrounds.length)
    }, 5000) // Change every 5 seconds
    
    return () => clearInterval(interval)
  }, [])
  
 



  // Fetch partners from API
  const fetchPartners = async () => {
    try {
      // Fetch both partners and projects data
      const [partnersResult, projectsResult] = await Promise.all([
        apiService.getPartners({ limit: 1000 }),
        apiService.getProjects({ limit: 1000 })
      ])
      
      const partnersData = partnersResult.partners || []
      const projectsData = projectsResult.data || []
      
      if (Array.isArray(partnersData) && partnersData.length > 0) {
        // Calculate actual project counts for each developer
        const transformedPartners = partnersData
          .filter(partner => partner.status === 'active')
          .map(partner => {
            // Count actual projects for this developer
            const actualProjectCount = projectsData.filter(project => 
              project.developer && 
              project.developer.toLowerCase().includes(partner.name.toLowerCase())
            ).length
            
            return {
              id: partner._id,
              name: partner.name,
              logo: partner.logo ? 
                (partner.logo.startsWith('http') ? partner.logo : `http://localhost:5003${partner.logo}`) : 
                'https://via.placeholder.com/200x100/d97706/000000?text=' + partner.name.replace(/\s+/g, '+'),
              projects: actualProjectCount,
              description: partner.description
            }
          })
        setPartnerDevelopers(transformedPartners)
      } else {
        // Fallback to static data but calculate actual project counts
        const projectsData = projectsResult.data || []
        const updatedStaticPartners = staticPartnerDevelopers.map(partner => {
          const actualProjectCount = projectsData.filter(project => 
            project.developer && 
            project.developer.toLowerCase().includes(partner.name.toLowerCase())
          ).length
          
          return {
            ...partner,
            projects: actualProjectCount
          }
        })
        setPartnerDevelopers(updatedStaticPartners)
      }
    } catch (error) {
      console.error('Error fetching partners:', error)
      // Fallback to static data with calculated project counts
      try {
        const projectsResult = await apiService.getProjects({ limit: 1000 })
        const projectsData = projectsResult.data || []
        const updatedStaticPartners = staticPartnerDevelopers.map(partner => {
          const actualProjectCount = projectsData.filter(project => 
            project.developer && 
            project.developer.toLowerCase().includes(partner.name.toLowerCase())
          ).length
          
          return {
            ...partner,
            projects: actualProjectCount
          }
        })
        setPartnerDevelopers(updatedStaticPartners)
      } catch (projectError) {
        console.error('Error fetching projects for fallback:', projectError)
        // Final fallback to original static data
        setPartnerDevelopers(staticPartnerDevelopers)
      }
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
        setTestimonials(publishedTestimonials)
      } else {
        // Fallback to static testimonials
        setTestimonials(staticTestimonials)
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error)
      // Fallback to static testimonials
      setTestimonials(staticTestimonials)
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

  // Off-Plan Properties navigation functions
  const nextOffPlanProperties = () => {
    if (currentOffPlanIndex + 3 < allOffPlanProperties.length) {
      const newIndex = currentOffPlanIndex + 3
      setCurrentOffPlanIndex(newIndex)
      setOffPlanProperties(allOffPlanProperties.slice(newIndex, newIndex + 3))
    }
  }

  const prevOffPlanProperties = () => {
    if (currentOffPlanIndex > 0) {
      const newIndex = Math.max(0, currentOffPlanIndex - 3)
      setCurrentOffPlanIndex(newIndex)
      setOffPlanProperties(allOffPlanProperties.slice(newIndex, newIndex + 3))
    }
  }

  // Property click handler
  const handlePropertyClick = (property) => {
    navigate(`/property/${property._id || property.id}`)
  }

  // Initialize data
  useEffect(() => {
    fetchPartners()
    fetchBlogs()
    fetchTestimonials()
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
    return () => {
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('testimonialsUpdated', handleTestimonialsUpdated)
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


  // Fetch properties from static API service
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const result = await apiService.getProperties()
        if (result.success && Array.isArray(result.data)) {
          const exclusive = result.data.filter(property => property.category === 'exclusive')
          const offPlan = result.data.filter(property => property.category === 'off-plan')
          setAllExclusiveProperties(exclusive)
          setAllOffPlanProperties(offPlan)
          setExclusiveProperties(exclusive.slice(0, 3))
          setOffPlanProperties(offPlan.slice(0, 3))
        } else {
          // Fallback to static data if data is not an array
          setAllExclusiveProperties(staticExclusiveProperties)
          setAllOffPlanProperties(staticOffPlanProperties)
          setExclusiveProperties(staticExclusiveProperties.slice(0, 3))
          setOffPlanProperties(staticOffPlanProperties.slice(0, 3))
        }
      } catch (error) {
        console.error('Error fetching properties:', error)
        // Fallback to static data if API fails
        setAllExclusiveProperties(staticExclusiveProperties)
        setAllOffPlanProperties(staticOffPlanProperties)
        setExclusiveProperties(staticExclusiveProperties.slice(0, 3))
        setOffPlanProperties(staticOffPlanProperties.slice(0, 3))
      }
    }
    
    fetchProperties()
  }, [])

  // Developer navigation handled in TrustedDevelopers component



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




  
  // Static Exclusive Properties Data (fallback)
  const staticExclusiveProperties = [
    {
      id: 1,
      title: 'Luxury Villa',
      price: 'FROM AED 7,500,000',
      bedrooms: 2,
      bathrooms: 2,
      location: 'Jumeirah Village Triangle',
      badge: 'Exclusive',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 2,
      title: 'Premium Penthouse',
      price: 'FROM AED 35,000,000',
      bedrooms: 7,
      bathrooms: 7,
      location: 'Al Manara',
      badge: 'Exclusive',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 3,
      title: 'Modern Apartment',
      price: 'FROM AED 2,400,000',
      bedrooms: 2,
      bathrooms: 2,
      location: 'Mohammad Bin Rashid City',
      badge: 'Exclusive',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 4,
      title: 'Studio Apartment',
      price: 'FROM AED 1,850,000',
      bedrooms: 1,
      bathrooms: 1,
      location: 'Mohammad Bin Rashid City',
      badge: 'Exclusive',
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 5,
      title: 'Waterfront Villa',
      price: 'FROM AED 3,200,000',
      bedrooms: 4,
      bathrooms: 4,
      location: 'Damac Lagoons',
      badge: 'Exclusive',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 6,
      title: 'Modern Studio',
      price: 'FROM AED 1,280,000',
      bedrooms: 2,
      bathrooms: 2,
      location: 'Dubai Studio City',
      badge: 'Exclusive',
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
  ]

  // Static Off-Plan Properties Data (fallback)
  const staticOffPlanProperties = [
    {
      id: 7,
      title: 'Luxury Apartments',
      price: 'FROM AED 2,100,000',
      bedrooms: '1 2 3',
      location: 'Mina Rashid',
      developer: 'Emaar Properties',
      badge: 'Off Plan',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 8,
      title: 'Studio & Apartments',
      price: 'FROM AED 748,000',
      bedrooms: 'Studio 1 2',
      location: 'Majan',
      developer: 'Meraki Developers',
      badge: 'Off Plan',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 9,
      title: 'Premium Villas',
      price: 'FROM AED 4,100,000',
      bedrooms: '1 2 3 4',
      location: 'Palm Jumeirah',
      developer: 'Beyond Development',
      badge: 'Off Plan',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 10,
      title: 'Waterfront Apartments',
      price: 'FROM AED 1,910,000',
      bedrooms: '1 2 3',
      location: 'Dubai Creek Harbour',
      developer: 'Emaar Properties',
      badge: 'Off Plan',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
  ]



  

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
  <TrustedDevelopers />

      {/* Highlighted Properties Section (Featured Ready Listings) */}
      <section className="py-12 sm:py-16 lg:py-20 bg-black/95 border-t border-gold-500/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <span className="text-gold-400 font-medium tracking-wider uppercase text-sm mb-4 block">Highlighted</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gold-400 mb-4 sm:mb-6 font-serif px-4 sm:px-0">Featured Properties</h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto px-4 sm:px-0">Selected ready listings curated from our Properties section</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allExclusiveProperties.slice(0,3).map((p) => (
              <div key={p.id || p._id} onClick={() => handlePropertyClick(p)} className="luxury-card cursor-pointer overflow-hidden">
                <img src={p.images && p.images.length ? p.images[0] : p.image} alt={p.title} className="w-full h-56 object-cover" />
                <div className="p-4">
                  <h3 className="text-white font-bold text-lg">{p.title}</h3>
                  <p className="text-gray-300 mt-2">{p.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
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
            {allOffPlanProperties.slice(0,3).map((p) => (
              <div key={p.id || p._id} onClick={() => handlePropertyClick(p)} className="luxury-card cursor-pointer overflow-hidden">
                <img src={p.images && p.images.length ? p.images[0] : p.image} alt={p.title} className="w-full h-56 object-cover" />
                <div className="p-4">
                  <h3 className="text-white font-bold text-lg">{p.title}</h3>
                  <p className="text-gray-300 mt-2">Developer: {p.developer || 'N/A'}</p>
                </div>
              </div>
            ))}
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
              <Link key={post._id || post.id} to={`/blog/${post._id || post.id}`} className="block h-full">
                <article className="luxury-card overflow-hidden group cursor-pointer h-full flex flex-col">
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
              </Link>
            ))}
            </div>

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