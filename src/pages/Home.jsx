import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import apiService from '../services/api.js'
import TrustedDevelopers from '../components/TrustedDevelopers'
import { countryCodes } from '../data/countryCodes'
import { default as staticTestimonials } from '../data/testimonials'
// Using Unicode symbols instead of react-icons for now

const Home = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [currentBgIndex, setCurrentBgIndex] = useState(0)
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    countryCode: '+971',
    message: ''
  })

  const [counters, setCounters] = useState({
    properties: 0,
    clients: 0,
    experience: 0,
    awards: 0
  })
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
  const [services, setServices] = useState([])
  

  
  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    countryCode: '+971',
    propertyInterest: '',
    subject: '',
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

  // Services Data
   const staticServices = [
    {
      icon: <div className="w-16 h-16 bg-gradient-to-br from-luxury-600 to-gold-500 rounded-2xl flex items-center justify-center mx-auto"><svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg></div>,
      title: 'Property Sales',
      description: 'Expert guidance in buying and selling luxury properties with personalized service'
    },
    {
      icon: <div className="w-16 h-16 bg-gradient-to-br from-luxury-600 to-gold-500 rounded-2xl flex items-center justify-center mx-auto"><svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>,
      title: 'Property Management',
      description: 'Comprehensive property management services ensuring maximum returns on investment'
    },
    {
      icon: <div className="w-16 h-16 bg-gradient-to-br from-luxury-600 to-gold-500 rounded-2xl flex items-center justify-center mx-auto"><svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg></div>,
      title: 'Investment Advisory',
      description: 'Strategic investment advice to help you make informed decisions in Dubai real estate'
    },
    {
      icon: <div className="w-16 h-16 bg-gradient-to-br from-luxury-600 to-gold-500 rounded-2xl flex items-center justify-center mx-auto"><svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg></div>,
      title: 'Concierge Services',
      description: 'Premium concierge services for all your luxury lifestyle and property needs'
    }
  ]

  // Auto-change background images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prevIndex) => (prevIndex + 1) % heroBackgrounds.length)
    }, 5000) // Change every 5 seconds
    
    return () => clearInterval(interval)
  }, [])
  
  // Animated counters
  useEffect(() => {
    const targets = { properties: 500, clients: 1200, experience: 15, awards: 25 }
    const duration = 2000 // 2 seconds
    const steps = 60
    const stepDuration = duration / steps
    
    const intervals = Object.keys(targets).map(key => {
      let current = 0
      const increment = targets[key] / steps
      
      const intervalId = setInterval(() => {
        current += increment
        if (current >= targets[key]) {
          current = targets[key]
          clearInterval(intervalId)
        }
        setCounters(prev => ({ ...prev, [key]: Math.floor(current) }))
      }, stepDuration)
      
      return intervalId
    })
    
    return () => intervals.forEach(clearInterval)
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
    setServices(staticServices)
  }, [])

  // Refresh blogs when window gains focus (user returns from admin panel)
  useEffect(() => {
    const handleFocus = () => {
      fetchBlogs()
      fetchTestimonials()
    }
    
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
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

  // Form handling functions
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    try {
      const result = await apiService.submitContactForm(formData)
      if (result.success) {
        alert('Message sent successfully!')
        setFormData({ name: '', email: '', phone: '', countryCode: '+971', message: '' })
      }
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Error sending message. Please try again.')
    }
  }

  const handleDeveloperClick = (developerId) => {
    // Navigate to partner detail page
    // For database partners, use their _id, for static partners use their id
    window.location.href = `/partner/${developerId}`
  }



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



  const achievements = [
    { 
      icon: (
        <div className="w-16 h-16 bg-gradient-to-br from-gold-600 to-gold-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            <circle cx="12" cy="10" r="2" fill="currentColor" opacity="0.3"/>
          </svg>
        </div>
      ), 
      number: counters.properties, 
      label: 'Premium Properties', 
      suffix: '+' 
    },
    { 
      icon: (
        <div className="w-16 h-16 bg-gradient-to-br from-gold-600 to-gold-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            <circle cx="12" cy="12" r="1" fill="currentColor" opacity="0.4"/>
          </svg>
        </div>
      ), 
      number: counters.clients, 
      label: 'Happy Clients', 
      suffix: '+' 
    },
    { 
      icon: (
        <div className="w-16 h-16 bg-gradient-to-br from-gold-600 to-gold-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.2"/>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6v2m0 8v2m6-6h-2m-8 0H6" stroke="currentColor" opacity="0.5"/>
          </svg>
        </div>
      ), 
      number: counters.experience, 
      label: 'Years Experience', 
      suffix: '+' 
    },
    { 
      icon: (
        <div className="w-16 h-16 bg-gradient-to-br from-gold-600 to-gold-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            <circle cx="12" cy="12" r="2" fill="white" opacity="0.3"/>
          </svg>
        </div>
      ), 
      number: counters.awards, 
      label: 'Awards Won', 
      suffix: '+' 
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
            
            {/* Property Search */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl xs:rounded-2xl p-3 xs:p-4 sm:p-6 lg:p-8 mb-6 xs:mb-8 sm:mb-12 border border-white/20 mx-2 xs:mx-4 sm:mx-0">
              <h3 className="text-sm xs:text-base sm:text-xl lg:text-2xl font-semibold mb-3 xs:mb-4 sm:mb-6 text-gold-200 px-1">Find Your Dream Luxury Property</h3>
              <div className="flex flex-col gap-2 xs:gap-3 sm:gap-4">
                <input
                  type="text"
                  placeholder="Enter project name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 xs:px-4 sm:px-6 py-2 xs:py-3 sm:py-4 rounded-lg xs:rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent text-xs xs:text-sm sm:text-base"
                />
                <button className="w-full px-4 xs:px-6 sm:px-8 py-2 xs:py-3 sm:py-4 bg-gradient-to-r from-luxury-600 to-gold-500 text-white rounded-lg xs:rounded-xl font-semibold hover:from-luxury-700 hover:to-gold-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-xs xs:text-sm sm:text-base">
                  Search Properties
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted Developers Section */}
      <TrustedDevelopers />

      {/* Exclusive Properties Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-black/95 border-t border-gold-500/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <span className="text-gold-400 font-medium tracking-wider uppercase text-sm mb-4 block">Premium Collection</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gold-400 mb-4 sm:mb-6 font-serif px-4 sm:px-0">Exclusive Properties with AMZ Properties</h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto px-4 sm:px-0">Discover our handpicked selection of Dubai's most prestigious properties</p>
          </div>
          
          <div className="relative">
            {/* Navigation Buttons */}
            {allExclusiveProperties.length > 3 && (
              <>
                <button 
                  onClick={prevExclusiveProperties}
                  disabled={currentExclusiveIndex === 0}
                  className="absolute left-2 sm:left-0 top-1/2 -translate-y-1/2 z-10 bg-gold-500/20 hover:bg-gold-500/40 text-gold-400 hover:text-white p-2 sm:p-3 rounded-full backdrop-blur-sm transition-all duration-300 transform hover:scale-110 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <button 
                  onClick={nextExclusiveProperties}
                  disabled={currentExclusiveIndex + 3 >= allExclusiveProperties.length}
                  className="absolute right-2 sm:right-0 top-1/2 -translate-y-1/2 z-10 bg-gold-500/20 hover:bg-gold-500/40 text-gold-400 hover:text-white p-2 sm:p-3 rounded-full backdrop-blur-sm transition-all duration-300 transform hover:scale-110 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
            
            {/* Properties Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 px-2 sm:px-4">
            {exclusiveProperties.map((property, index) => (
              <div key={property.id} onClick={() => handlePropertyClick(property)} className="group luxury-card overflow-hidden w-full h-full flex flex-col transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-gold-500/20 animate-fade-in cursor-pointer" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="relative overflow-hidden">
                  <img 
                    src={property.images && property.images.length > 0 ? property.images[0] : property.image} 
                    alt={property.title}
                    className="w-full h-48 sm:h-56 lg:h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-black/40 transition-all duration-500"></div>
                  
                  {/* Property Badge */}
                  <div className="absolute top-2 sm:top-4 left-2 sm:left-4">
                    <span className="bg-gold-500/90 text-black px-2 sm:px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
                      {property.type === 'exclusive' ? 'Exclusive' : property.badge || 'Exclusive'}
                    </span>
                  </div>
                  
                  {/* Price Badge */}
                  <div className="absolute top-2 sm:top-4 right-2 sm:right-4">
                    <span className="bg-black/70 text-gold-400 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold backdrop-blur-sm">
                      {property.price}
                    </span>
                  </div>
                </div>
                
                <div className="p-4 sm:p-5 lg:p-6 flex-1 flex flex-col">
                  <h3 className="text-white font-bold text-lg sm:text-xl mb-2 sm:mb-3 group-hover:text-gold-400 transition-colors duration-300 line-clamp-2 leading-tight">
                    {property.title}
                  </h3>
                  
                  {/* Property Details */}
                  <div className="flex flex-wrap items-center text-gray-300 mb-3 sm:mb-4 text-xs sm:text-sm gap-2 sm:gap-0">
                    <div className="flex items-center mr-2 sm:mr-4">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2V7z" />
                      </svg>
                      <span>{property.bedrooms} bed</span>
                    </div>
                    <div className="flex items-center mr-2 sm:mr-4">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10v11M20 10v11" />
                      </svg>
                      <span>{property.bathrooms} bath</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      </svg>
                      <span>{property.area}</span>
                    </div>
                  </div>
                  
                  {/* Location */}
                  <div className="flex items-center text-gray-400 text-xs sm:text-sm mb-4 sm:mb-6 flex-1">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="truncate">{property.location}</span>
                  </div>
                  
                  {/* View Details Button */}
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center text-gold-400 text-xs sm:text-sm font-semibold group-hover:text-gold-300 transition-all duration-300 transform group-hover:translate-x-2">
                      <span>View Details</span>
                      <svg className="ml-1 sm:ml-2 w-3 h-3 sm:w-4 sm:h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                    
                    {/* Property Type */}
                    <div className="text-gray-500 text-xs uppercase tracking-wider">
                      Premium
                    </div>
                  </div>
                </div>
                
                {/* Bottom Border Animation */}
                <div className="h-1 bg-gradient-to-r from-gold-500 to-gold-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </div>
            ))}
            </div>
          </div>
        </div>
      </section>

      {/* Off-Plan Properties Section */}
      <section className="py-20 bg-black/95 border-t border-gold-500/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <span className="text-gold-400 font-medium tracking-wider uppercase text-sm mb-4 block">Future Investments</span>
            <h2 className="text-5xl font-bold text-gold-400 mb-6 font-serif animate-slide-up">Off-Plan Properties</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto animate-slide-up" style={{animationDelay: '0.2s'}}>Secure your future with Dubai's most promising upcoming developments</p>
          </div>
          
          <div className="relative">
            {/* Navigation Buttons */}
            {allOffPlanProperties.length > 3 && (
              <>
                <button 
                  onClick={prevOffPlanProperties}
                  disabled={currentOffPlanIndex === 0}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-blue-500/20 hover:bg-blue-500/40 text-blue-400 hover:text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300 transform hover:scale-110 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <button 
                  onClick={nextOffPlanProperties}
                  disabled={currentOffPlanIndex + 3 >= allOffPlanProperties.length}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-blue-500/20 hover:bg-blue-500/40 text-blue-400 hover:text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300 transform hover:scale-110 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
            
            {/* Properties Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
            {offPlanProperties.map((property, index) => (
              <div key={property.id} onClick={() => handlePropertyClick(property)} className="group luxury-card overflow-hidden w-full h-full flex flex-col transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-gold-500/20 animate-fade-in cursor-pointer" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="relative overflow-hidden">
                  <img 
                    src={property.images && property.images.length > 0 ? property.images[0] : property.image} 
                    alt={property.title}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-black/40 transition-all duration-500"></div>
                  
                  {/* Property Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-blue-500/90 text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
                      {property.type === 'off-plan' ? 'Off-Plan' : property.badge || 'Off-Plan'}
                    </span>
                  </div>
                  
                  {/* Price Badge */}
                  <div className="absolute top-4 right-4">
                    <span className="bg-black/70 text-gold-400 px-3 py-1 rounded-full text-sm font-bold backdrop-blur-sm">
                      {property.price}
                    </span>
                  </div>
                  
                  {/* Completion Status */}
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-green-500/90 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                      Coming Soon
                    </span>
                  </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-white font-bold text-xl mb-3 group-hover:text-gold-400 transition-colors duration-300 line-clamp-2 leading-tight">
                    {property.title}
                  </h3>
                  
                  {/* Property Details */}
                  <div className="flex items-center text-gray-300 mb-4 text-sm">
                    <div className="flex items-center mr-4">
                      <svg className="w-4 h-4 mr-1 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2V7z" />
                      </svg>
                      <span>{property.bedrooms} bed</span>
                    </div>
                    <div className="flex items-center mr-4">
                      <svg className="w-4 h-4 mr-1 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10v11M20 10v11" />
                      </svg>
                      <span>{property.bathrooms} bath</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      </svg>
                      <span>{property.area}</span>
                    </div>
                  </div>
                  
                  {/* Location */}
                  <div className="flex items-center text-gray-400 text-sm mb-3">
                    <svg className="w-4 h-4 mr-2 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{property.location}</span>
                  </div>
                  
                  {/* Developer */}
                  {property.developer && (
                    <div className="flex items-center text-gray-400 text-sm mb-6 flex-1">
                      <svg className="w-4 h-4 mr-2 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span>Developer: {property.developer}</span>
                    </div>
                  )}
                  
                  {/* Reserve Now Button */}
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center text-gold-400 text-sm font-semibold group-hover:text-gold-300 transition-all duration-300 transform group-hover:translate-x-2">
                      <span>Reserve Now</span>
                      <svg className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                    
                    {/* Investment Type */}
                    <div className="text-gray-500 text-xs uppercase tracking-wider">
                      Investment
                    </div>
                  </div>
                </div>
                
                {/* Bottom Border Animation */}
                <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </div>
            ))}
          </div>
        </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-black/90 border-t border-gold-500/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-gold-400 font-medium tracking-wider uppercase text-sm mb-4 block">Premium Services</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gold-400 mb-6 font-serif">Exceptional Service Excellence</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Tailored luxury real estate services designed for discerning clients who demand nothing but the finest
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div key={service.title} className="luxury-card text-center p-8 group hover:scale-105 transition-all duration-500">
                <div className="mb-6 group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-4 font-serif group-hover:text-gold-400 transition-colors">{service.title}</h3>
                <p className="text-gray-300 leading-relaxed">{service.description}</p>
              </div>
            ))}
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

          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-luxury-900/50 to-black/50 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-gold-500/20 shadow-2xl">
              {/* Contact Form */}
              <form onSubmit={handleContactSubmit} className="space-y-6 sm:space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {/* Name Field */}
                  <div className="group">
                    <label htmlFor="contact-name" className="block text-xs sm:text-sm font-semibold text-gray-300 mb-2 sm:mb-3 group-hover:text-gold-400 transition-colors duration-300">
                      Full Name *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="contact-name"
                        name="name"
                        value={contactForm.name}
                        onChange={handleContactInputChange}
                        required
                        className="bg-dark-700/50 border border-gray-600 text-white placeholder-gray-400 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 w-full text-sm sm:text-base group-hover:border-gold-400 focus:border-gold-500 focus:ring-2 focus:ring-gold-200/20 transition-all duration-300"
                        placeholder="Your full name"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-gold-500/5 to-gold-400/5 rounded-lg sm:rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  </div>

                  {/* Email Field */}
                  <div className="group">
                    <label htmlFor="contact-email" className="block text-xs sm:text-sm font-semibold text-gray-300 mb-2 sm:mb-3 group-hover:text-gold-400 transition-colors duration-300">
                      Email Address *
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        id="contact-email"
                        name="email"
                        value={contactForm.email}
                        onChange={handleContactInputChange}
                        required
                        className="bg-dark-700/50 border border-gray-600 text-white placeholder-gray-400 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 w-full text-sm sm:text-base group-hover:border-gold-400 focus:border-gold-500 focus:ring-2 focus:ring-gold-200/20 transition-all duration-300"
                        placeholder="your.email@example.com"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-gold-500/5 to-gold-400/5 rounded-lg sm:rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  </div>
                </div>

                {/* Phone Field */}
                <div className="group">
                  <label htmlFor="contact-phone" className="block text-sm font-semibold text-gray-300 mb-3 group-hover:text-gold-400 transition-colors duration-300">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="flex flex-col gap-3 sm:flex-row sm:gap-0">
                      <select
                        name="countryCode"
                        value={contactForm.countryCode}
                        onChange={handleContactInputChange}
                        className="w-full sm:w-36 md:w-40 lg:w-44 bg-dark-700/50 border border-gray-600 text-white rounded-xl sm:rounded-l-xl sm:rounded-r-none px-4 py-4 sm:py-3 text-base sm:text-sm md:text-base group-hover:border-gold-400 focus:border-gold-500 focus:ring-2 focus:ring-gold-200/20 transition-all duration-300 truncate appearance-none cursor-pointer"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                          backgroundPosition: 'right 1rem center',
                          backgroundRepeat: 'no-repeat',
                          backgroundSize: '1.25em 1.25em',
                          paddingRight: '3rem'
                        }}
                        title={`${contactForm.countryCode} - ${countryCodes.find(c => c.code === contactForm.countryCode)?.country || ''}`}
                      >
                        {countryCodes.map((country) => (
                          <option key={country.code} value={country.code} title={`${country.code} ${country.country}`} className="py-3 px-4 text-base bg-dark-700 text-white">
                            {country.code} {country.country.length > 10 ? country.country.substring(0, 10) + '...' : country.country}
                          </option>
                        ))}
                      </select>
                      <input
                        type="tel"
                        id="contact-phone"
                        name="phone"
                        value={contactForm.phone}
                        onChange={handleContactInputChange}
                        className="flex-1 bg-dark-700/50 border border-gray-600 sm:border-l-0 text-white placeholder-gray-400 rounded-xl sm:rounded-l-none sm:rounded-r-xl px-4 py-4 sm:py-3 text-base sm:text-base group-hover:border-gold-400 focus:border-gold-500 focus:ring-2 focus:ring-gold-200/20 transition-all duration-300"
                        placeholder="50 123 4567"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-gold-500/5 to-gold-400/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>

                {/* Property Interest Field */}
                <div className="group relative overflow-visible">
                  <label htmlFor="contact-property-interest" className="block text-sm font-semibold text-gray-300 mb-3 group-hover:text-gold-400 transition-colors duration-300">
                    Property Interest
                  </label>
                  <div className="relative z-10">
                    <select
                      id="contact-property-interest"
                      name="propertyInterest"
                      value={contactForm.propertyInterest}
                      onChange={handleContactInputChange}
                      className="bg-dark-700/50 border border-gray-600 text-white rounded-xl px-4 py-4 sm:py-3 w-full text-base sm:text-base group-hover:border-gold-400 focus:border-gold-500 focus:ring-2 focus:ring-gold-200/20 transition-all duration-300 appearance-none cursor-pointer relative z-20"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                        backgroundPosition: 'right 1rem center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '1.25em 1.25em',
                        paddingRight: '3rem'
                      }}
                    >
                      <option value="" className="py-3 px-4 text-base bg-dark-700 text-white">Select property type</option>
                      <option value="apartment" className="py-3 px-4 text-base bg-dark-700 text-white">Luxury Apartment</option>
                      <option value="villa" className="py-3 px-4 text-base bg-dark-700 text-white">Premium Villa</option>
                      <option value="penthouse" className="py-3 px-4 text-base bg-dark-700 text-white">Exclusive Penthouse</option>
                      <option value="townhouse" className="py-3 px-4 text-base bg-dark-700 text-white">Designer Townhouse</option>
                      <option value="studio" className="py-3 px-4 text-base bg-dark-700 text-white">Modern Studio</option>
                      <option value="commercial" className="py-3 px-4 text-base bg-dark-700 text-white">Commercial Property</option>
                      <option value="investment" className="py-3 px-4 text-base bg-dark-700 text-white">Investment Opportunity</option>
                    </select>
                    <div className="absolute inset-0 bg-gradient-to-r from-gold-500/5 to-gold-400/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>

                {/* Subject Field */}
                <div className="group">
                  <label htmlFor="contact-subject" className="block text-xs sm:text-sm font-semibold text-gray-300 mb-2 sm:mb-3 group-hover:text-gold-400 transition-colors duration-300">
                    Subject *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="contact-subject"
                      name="subject"
                      value={contactForm.subject}
                      onChange={handleContactInputChange}
                      required
                      className="bg-dark-700/50 border border-gray-600 text-white placeholder-gray-400 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 w-full text-sm sm:text-base group-hover:border-gold-400 focus:border-gold-500 focus:ring-2 focus:ring-gold-200/20 transition-all duration-300"
                      placeholder="How can we help you?"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-luxury-500/5 to-gold-500/5 rounded-lg sm:rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>

                {/* Message Field */}
                <div className="group">
                  <label htmlFor="contact-message" className="block text-xs sm:text-sm font-semibold text-gray-300 mb-2 sm:mb-3 group-hover:text-gold-400 transition-colors duration-300">
                    Message *
                  </label>
                  <div className="relative">
                    <textarea
                      id="contact-message"
                      name="message"
                      value={contactForm.message}
                      onChange={handleContactInputChange}
                      required
                      rows={5}
                      className="bg-dark-700/50 border border-gray-600 text-white placeholder-gray-400 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 w-full text-sm sm:text-base resize-none group-hover:border-gold-400 focus:border-gold-500 focus:ring-2 focus:ring-gold-200/20 transition-all duration-300"
                      placeholder="Tell us more about your requirements, budget, preferred location, and timeline..."
                    ></textarea>
                    <div className="absolute inset-0 bg-gradient-to-r from-luxury-500/5 to-gold-500/5 rounded-lg sm:rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="text-center">
                  <button
                    type="submit"
                    disabled={contactSubmitting}
                    className="group btn-primary btn-lg relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      {contactSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
                        </>
                      )}
                    </span>
                  </button>
                </div>

                {/* Success/Error Message */}
                {contactMessage && (
                  <div className={`text-center p-4 rounded-xl ${
                    contactMessage.type === 'success' 
                      ? 'bg-green-500/20 border border-green-500/30 text-green-400' 
                      : 'bg-red-500/20 border border-red-500/30 text-red-400'
                  }`}>
                    {contactMessage.text}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>





      {/* Achievements Section */}
      <section className="py-20 bg-black/95 border-t border-gold-500/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-gold-400 font-medium tracking-wider uppercase text-sm mb-4 block">Our Achievements</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gold-400 mb-6 font-serif">Excellence in Numbers</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">Our track record speaks for itself - delivering exceptional results for our clients</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <div key={achievement.label} className="luxury-card text-center p-8 group hover:scale-105 transition-all duration-500">
                <div className="mb-6 group-hover:scale-110 transition-transform duration-300">
                  {achievement.icon}
                </div>
                <div className="text-4xl font-bold text-gold-400 mb-2">
                  {achievement.number}{achievement.suffix}
                </div>
                <h3 className="text-lg font-semibold text-white group-hover:text-gold-400 transition-colors">{achievement.label}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
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
                <article className="luxury-card overflow-hidden group cursor-pointer h-full flex flex-col transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-gold-500/20">
                  <div className="relative overflow-hidden">
                    <img 
                      src={post.image_url ? `http://127.0.0.1:5000${post.image_url}` : (post.image || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=250&fit=crop')} 
                      alt={post.title}
                      className="w-full h-48 sm:h-52 lg:h-56 object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-black/40 transition-all duration-500"></div>
                    
                    {/* Category Badge */}
                    <div className="absolute top-2 sm:top-4 left-2 sm:left-4">
                      <span className="bg-gold-500/90 text-black px-2 sm:px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
                        {post.category}
                      </span>
                    </div>
                    
                    {/* Date Badge */}
                    <div className="absolute top-2 sm:top-4 right-2 sm:right-4">
                      <span className="bg-black/70 text-gold-400 px-2 sm:px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                        {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : (post.date || new Date(post.createdAt).toLocaleDateString())}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4 sm:p-5 lg:p-6 flex-1 flex flex-col">
                    <h3 className="text-white font-bold text-lg sm:text-xl mb-2 sm:mb-3 group-hover:text-gold-400 transition-colors duration-300 line-clamp-2 leading-tight">
                      {post.title}
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed mb-4 sm:mb-6 flex-1 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    {/* Read More Button */}
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center text-gold-400 text-xs sm:text-sm font-semibold group-hover:text-gold-300 transition-all duration-300 transform group-hover:translate-x-2">
                        <span>Read Article</span>
                        <svg className="ml-1 sm:ml-2 w-3 h-3 sm:w-4 sm:h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                      
                      {/* Reading Time Estimate */}
                      <div className="text-gray-500 text-xs">
                        {Math.ceil((post.excerpt?.length || 100) / 200)} min read
                      </div>
                    </div>
                  </div>
                  
                  {/* Bottom Border Animation */}
                  <div className="h-1 bg-gradient-to-r from-gold-500 to-gold-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                </article>
              </Link>
            ))}
            </div>
            
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

      {/* Testimonials Section */}
      {testimonials.length > 0 && (
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 to-black/80"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-600">Clients Say</span>
              </h2>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                Discover why our clients trust us with their most important property investments
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="relative">
                {/* Main Testimonial Display */}
                <div className="luxury-card p-8 md:p-12 text-center min-h-[400px] flex flex-col justify-center">
                  <div className="mb-8">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full overflow-hidden border-4 border-gold-400">
                      <img 
                        src={testimonials[activeTestimonial]?.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'} 
                        alt={testimonials[activeTestimonial]?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-6xl text-gold-400 mb-4">"</div>
                  </div>

                  <blockquote className="text-white text-lg md:text-xl leading-relaxed mb-8 italic">
                    {testimonials[activeTestimonial]?.comments}
                  </blockquote>

                  <div className="border-t border-gray-700 pt-6">
                    <div className="font-semibold text-gold-400 text-lg">
                      {testimonials[activeTestimonial]?.name}
                    </div>
                    {testimonials[activeTestimonial]?.designation && (
                      <div className="text-gray-400 text-sm mt-1">
                        {testimonials[activeTestimonial]?.designation}
                      </div>
                    )}
                  </div>
                </div>

                {/* Navigation Arrows */}
                {testimonials.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveTestimonial(activeTestimonial === 0 ? testimonials.length - 1 : activeTestimonial - 1)}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-gold-500/20 hover:bg-gold-500/30 border border-gold-400/30 rounded-full flex items-center justify-center text-gold-400 hover:text-gold-300 transition-all duration-300 backdrop-blur-sm"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>

                    <button
                      onClick={() => setActiveTestimonial((activeTestimonial + 1) % testimonials.length)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-gold-500/20 hover:bg-gold-500/30 border border-gold-400/30 rounded-full flex items-center justify-center text-gold-400 hover:text-gold-300 transition-all duration-300 backdrop-blur-sm"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}
              </div>

              {/* Testimonial Indicators */}
              {testimonials.length > 1 && (
                <div className="flex justify-center mt-8 space-x-3">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveTestimonial(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        activeTestimonial === index 
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
      )}

    </div>
  )
}

export default Home