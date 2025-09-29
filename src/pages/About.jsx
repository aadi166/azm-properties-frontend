import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import apiService from '../services/api.js'

const About = () => {
  const [counters, setCounters] = useState({
    properties: 0,
    experience: 0,
    clients: 0,
    awards: 0
  })

  const [partners, setPartners] = useState([])
  const [allPartners, setAllPartners] = useState([])
  const [currentPartnerIndex, setCurrentPartnerIndex] = useState(0)
  const [partnersLoading, setPartnersLoading] = useState(true)

  // Animated counters effect
  useEffect(() => {
    const targets = { properties: 500, experience: 15, clients: 1200, awards: 25 }
    const duration = 2500 // 2.5 seconds
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

  // Fetch partners from static data
  useEffect(() => {
    const fetchPartners = async () => {
      try {
        setPartnersLoading(true)
        const result = await apiService.getPartners()
        if (result.success) {
          const data = result.data || []
          // Filter active partners
          const activePartners = data.filter(partner => partner.status === 'active')
          setAllPartners(activePartners)
          // Display first 3 partners
          setPartners(activePartners.slice(0, 3))
          setCurrentPartnerIndex(0)
        }
      } catch (error) {
        console.error('Error fetching partners:', error)
      } finally {
        setPartnersLoading(false)
      }
    }

    fetchPartners()
  }, [])

  // Partners navigation functions
  const nextPartners = () => {
    if (currentPartnerIndex + 3 < allPartners.length) {
      const newIndex = currentPartnerIndex + 3
      setCurrentPartnerIndex(newIndex)
      setPartners(allPartners.slice(newIndex, newIndex + 3))
    }
  }

  const prevPartners = () => {
    if (currentPartnerIndex > 0) {
      const newIndex = Math.max(0, currentPartnerIndex - 3)
      setCurrentPartnerIndex(newIndex)
      setPartners(allPartners.slice(newIndex, newIndex + 3))
    }
  }

  const teamMembers = [
    {
      name: 'Ahmed Al Mansouri',
      position: 'CEO & Founder',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      description: 'With over 15 years in Dubai real estate, Ahmed leads our vision of excellence.'
    },
    {
      name: 'Sarah Johnson',
      position: 'Head of Sales',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      description: 'Sarah brings international expertise and a client-first approach to every transaction.'
    },
    {
      name: 'Mohammed Hassan',
      position: 'Senior Property Consultant',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      description: 'Mohammed specializes in luxury properties and investment opportunities.'
    }
  ]

  const stats = [
    { 
      icon: (
        <svg className="w-12 h-12 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L2 7v10c0 5.55 3.84 9.739 9 11 5.16-1.261 9-5.45 9-11V7l-10-5z"/>
          <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ), 
      number: counters.properties, 
      label: 'Premium Properties', 
      suffix: '+',
      description: 'Luxury properties sold across Dubai'
    },
    { 
      icon: (
        <svg className="w-12 h-12 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      ), 
      number: counters.experience, 
      label: 'Years Excellence', 
      suffix: '+',
      description: 'Decades of market expertise'
    },
    { 
      icon: (
        <svg className="w-12 h-12 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.5 7h-5c-.8 0-1.5.7-1.5 1.5v6c0 .8.7 1.5 1.5 1.5H16v6h4zM12.5 11.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5zM5.5 6c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2zm2 16v-7H9V9c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v6h1.5v7h4z"/>
        </svg>
      ), 
      number: counters.clients, 
      label: 'Satisfied Clients', 
      suffix: '+',
      description: 'Happy families and investors'
    },
    { 
      icon: (
        <svg className="w-12 h-12 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ), 
      number: counters.awards, 
      label: 'Industry Awards', 
      suffix: '+',
      description: 'Recognition for excellence'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-amber-900"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="animate-fade-in">
            <span className="text-amber-400 font-medium tracking-wider uppercase text-sm mb-4 block">About Us</span>
            <h1 className="text-6xl md:text-7xl font-bold mb-6 font-serif text-white animate-slide-up">AMZ Properties</h1>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto mb-8 animate-scale-in"></div>
            <p className="text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed animate-slide-up" style={{animationDelay: '0.3s'}}>
              Redefining luxury real estate in Dubai with unparalleled expertise, 
              <span className="text-amber-400 font-semibold"> exceptional service</span>, and a commitment to excellence that spans over a decade
            </p>
          </div>
          
          <div className="mt-16 animate-fade-in" style={{animationDelay: '0.6s'}}>
            <div className="flex flex-wrap justify-center gap-8 text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-3xl font-bold text-amber-400 font-serif">{counters.experience}+</div>
                <div className="text-white/80 text-sm uppercase tracking-wider">Years Excellence</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-3xl font-bold text-amber-400 font-serif">{counters.properties}+</div>
                <div className="text-white/80 text-sm uppercase tracking-wider">Properties Sold</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-3xl font-bold text-amber-400 font-serif">{counters.clients}+</div>
                <div className="text-white/80 text-sm uppercase tracking-wider">Happy Clients</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-float">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-amber-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-32 bg-gradient-to-br from-black to-dark-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23f3f4f6%22%20fill-opacity%3D%220.3%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22%3E%3C/circle%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-in">
              <span className="text-amber-400 font-medium tracking-wider uppercase text-sm mb-4 block">Our Journey</span>
              <h2 className="text-5xl font-bold text-white mb-8 font-serif animate-slide-up">Crafting Excellence Since 2009</h2>
              
              <div className="space-y-6 animate-slide-up" style={{animationDelay: '0.2s'}}>
                <p className="text-xl text-gray-300 leading-relaxed">
                  Born from a vision to redefine luxury real estate in Dubai, <span className="text-amber-400 font-semibold">AMZ Properties</span> has evolved 
                  from a boutique agency to the city's most prestigious real estate consultancy.
                </p>
                <p className="text-lg text-gray-400 leading-relaxed">
                  Our journey began with an unwavering commitment to excellence, transparency, and personalized service. 
                  We've cultivated relationships with Dubai's most exclusive developers and discerning clientele, 
                  establishing ourselves as the trusted advisor for luxury property investments.
                </p>
                <p className="text-lg text-gray-400 leading-relaxed">
                  Today, we continue to set new standards in the industry, leveraging cutting-edge technology 
                  and market insights to deliver exceptional results for our valued clients.
                </p>
              </div>
              
              <div className="mt-10 animate-fade-in" style={{animationDelay: '0.4s'}}>
                <Link 
                  to="/contact" 
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-500 text-black rounded-xl font-semibold hover:from-amber-500 hover:to-amber-400 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                >
                  Partner With Us
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
            
            <div className="relative animate-fade-in" style={{animationDelay: '0.3s'}}>
              <div className="relative group">
                <img 
                  src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Luxury Dubai Properties" 
                  className="rounded-2xl shadow-2xl group-hover:shadow-3xl transition-all duration-500 transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
              </div>
              
              {/* Floating stats cards */}
              <div className="absolute -bottom-8 -left-8 bg-gray-900 p-6 rounded-2xl shadow-xl border border-amber-500/20 animate-float">
                <div className="text-4xl font-bold text-amber-400 font-serif">{counters.experience}+</div>
                <div className="text-gray-300 font-medium">Years of Excellence</div>
              </div>
              
              <div className="absolute -top-8 -right-8 bg-black text-white p-6 rounded-2xl shadow-xl animate-float" style={{animationDelay: '1s'}}>
                <div className="text-4xl font-bold text-amber-400 font-serif">{counters.awards}+</div>
                <div className="text-gray-300 font-medium">Industry Awards</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-32 bg-gradient-to-r from-black via-gray-900 to-amber-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-black/90 to-amber-900/90"></div>
        
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-20 animate-fade-in">
            <span className="text-amber-400 font-medium tracking-wider uppercase text-sm mb-4 block">Our Achievements</span>
            <h2 className="text-6xl font-bold text-white mb-6 font-serif animate-slide-up">Excellence in Numbers</h2>
            <div className="w-32 h-1 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto mb-8 animate-scale-in"></div>
            <p className="text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed animate-slide-up" style={{animationDelay: '0.2s'}}>
              Every number tells a story of dedication, expertise, and unwavering commitment to our clients' success
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="group text-center p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-amber-500/30 transition-all duration-500 hover:transform hover:-translate-y-4 animate-fade-in"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="mb-6 group-hover:scale-110 transition-transform duration-300 flex justify-center">
                  {stat.icon}
                </div>
                <div className="text-5xl md:text-6xl font-bold text-amber-400 mb-4 font-serif group-hover:text-amber-300 transition-colors duration-300">
                  {stat.number}{stat.suffix}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-amber-200 transition-colors duration-300">
                  {stat.label}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                  {stat.description}
                </p>
              </div>
            ))}
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-20 left-10 w-20 h-20 border border-amber-400/20 rounded-full animate-float"></div>
          <div className="absolute bottom-20 right-10 w-16 h-16 border border-amber-400/20 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-20 w-2 h-2 bg-amber-400/30 rounded-full animate-pulse"></div>
          <div className="absolute top-1/3 right-32 w-3 h-3 bg-amber-400/20 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-32 bg-gradient-to-br from-black to-dark-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23f3f4f6%22%20fill-opacity%3D%220.3%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22%3E%3C/circle%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-20 animate-fade-in">
            <span className="text-gold-400 font-medium tracking-wider uppercase text-sm mb-4 block">Our Purpose</span>
            <h2 className="text-5xl font-bold text-white mb-6 font-serif animate-slide-up">Mission & Vision</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-gold-400 to-gold-600 mx-auto mb-8 animate-scale-in"></div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed animate-slide-up" style={{animationDelay: '0.2s'}}>
              Driven by purpose, guided by excellence, and committed to transforming dreams into reality
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="group bg-gray-900/90 backdrop-blur-sm p-10 rounded-3xl shadow-2xl border border-amber-500/20 hover:shadow-3xl transition-all duration-500 hover:transform hover:-translate-y-2 animate-fade-in" style={{animationDelay: '0.3s'}}>
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-amber-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-10 h-10 text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-400 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
              </div>
              <h3 className="text-3xl font-bold text-white mb-6 font-serif group-hover:text-amber-400 transition-colors duration-300">Our Mission</h3>
              <p className="text-lg text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                To provide <span className="text-amber-400 font-semibold">exceptional real estate services</span> that exceed our clients' expectations, 
                while maintaining the highest standards of integrity, professionalism, and market expertise. 
                We strive to make every property transaction smooth, transparent, and successful.
              </p>
              <div className="mt-8 flex items-center text-amber-400 font-medium group-hover:text-amber-300 transition-colors duration-300">
                <span>Excellence in Service</span>
                <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
            
            <div className="group bg-gradient-to-br from-black to-amber-900 p-10 rounded-3xl shadow-2xl text-white hover:shadow-3xl transition-all duration-500 hover:transform hover:-translate-y-2 animate-fade-in" style={{animationDelay: '0.5s'}}>
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-10 h-10 text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors duration-300"></div>
              </div>
              <h3 className="text-3xl font-bold mb-6 font-serif group-hover:text-amber-200 transition-colors duration-300">Our Vision</h3>
              <p className="text-lg text-gray-200 leading-relaxed group-hover:text-white transition-colors duration-300">
                To be <span className="text-amber-400 font-semibold">Dubai's leading real estate company</span>, recognized for our innovation, expertise, 
                and unwavering commitment to client satisfaction. We envision a future where every 
                client finds their perfect property through our dedicated service and market knowledge.
              </p>
              <div className="mt-8 flex items-center text-amber-400 font-medium group-hover:text-amber-300 transition-colors duration-300">
                <span>Leading the Future</span>
                <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-32 bg-gradient-to-br from-black to-dark-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2280%22%20height%3D%2280%22%20viewBox%3D%220%200%2080%2080%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23d4af37%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M0%200h40v40H0V0zm40%2040h40v40H40V40z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-20 animate-fade-in">
            <span className="text-amber-400 font-medium tracking-wider uppercase text-sm mb-4 block">Our Experts</span>
            <h2 className="text-5xl font-bold text-white mb-6 font-serif animate-slide-up">Meet Our Team</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto mb-8 animate-scale-in"></div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed animate-slide-up" style={{animationDelay: '0.2s'}}>
              Our experienced professionals are dedicated to providing you with <span className="text-amber-400 font-semibold">exceptional service</span> and unmatched expertise
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {teamMembers.map((member, index) => (
              <div key={index} className="group bg-gray-900/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-500 hover:transform hover:-translate-y-3 animate-fade-in border border-amber-500/20" style={{animationDelay: `${0.1 * (index + 1)}s`}}>
                <div className="relative overflow-hidden">
                  <div className="aspect-w-1 aspect-h-1">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute top-4 right-4 w-12 h-12 bg-amber-400/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="flex space-x-3">
                      <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-amber-400/30 transition-colors duration-300 cursor-pointer">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                        </svg>
                      </div>
                      <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-amber-400/30 transition-colors duration-300 cursor-pointer">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-8 relative">
                  <div className="absolute top-0 left-8 w-16 h-1 bg-gradient-to-r from-amber-400 to-amber-600 transform -translate-y-1"></div>
                  <h3 className="text-2xl font-bold text-white mb-2 font-serif group-hover:text-amber-400 transition-colors duration-300">{member.name}</h3>
                  <p className="text-amber-400 font-semibold mb-4 text-lg group-hover:text-amber-300 transition-colors duration-300">{member.position}</p>
                  <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">{member.description}</p>
                  <div className="mt-6 flex items-center text-amber-400 font-medium opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                    <span>View Profile</span>
                    <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-32 bg-gradient-to-br from-black to-dark-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23d4af37%22%20fill-opacity%3D%220.08%22%3E%3Cpolygon%20points%3D%2230%200%2060%2030%2030%2060%200%2030%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-20 animate-fade-in">
            <span className="text-amber-400 font-medium tracking-wider uppercase text-sm mb-4 block">Our Foundation</span>
            <h2 className="text-5xl font-bold text-white mb-6 font-serif animate-slide-up">Our Values</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto mb-8 animate-scale-in"></div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed animate-slide-up" style={{animationDelay: '0.2s'}}>
              The <span className="text-amber-400 font-semibold">principles that guide</span> everything we do and define who we are
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group text-center bg-gray-900/90 backdrop-blur-sm p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:transform hover:-translate-y-2 border border-amber-500/20 animate-fade-in" style={{animationDelay: '0.1s'}}>
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-amber-700 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-10 h-10 text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-400 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 font-serif group-hover:text-amber-200 transition-colors duration-300">Integrity</h3>
              <p className="text-gray-300 leading-relaxed group-hover:text-white transition-colors duration-300">
                We conduct business with <span className="text-amber-400 font-semibold">honesty, transparency</span>, and ethical practices in every transaction.
              </p>
            </div>
            
            <div className="group text-center bg-gradient-to-br from-amber-50 to-amber-100 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:transform hover:-translate-y-2 border border-amber-200/50 animate-fade-in" style={{animationDelay: '0.2s'}}>
               <div className="relative mb-8">
                 <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-amber-700 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                   <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                   </svg>
                 </div>
                 <div className="absolute -top-2 -right-2 w-6 h-6 bg-black/20 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
               </div>
               <h3 className="text-2xl font-bold text-black mb-4 font-serif group-hover:text-amber-700 transition-colors duration-300">Excellence</h3>
               <p className="text-gray-700 leading-relaxed group-hover:text-gray-800 transition-colors duration-300">
                 We strive for <span className="text-amber-700 font-semibold">excellence in every aspect</span> of our service, from initial consultation to closing.
               </p>
             </div>
            
            <div className="group text-center bg-gray-900/90 backdrop-blur-sm p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:transform hover:-translate-y-2 border border-amber-500/20 animate-fade-in" style={{animationDelay: '0.3s'}}>
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-amber-700 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-10 h-10 text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-400 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 font-serif group-hover:text-amber-200 transition-colors duration-300">Client Focus</h3>
              <p className="text-gray-300 leading-relaxed group-hover:text-white transition-colors duration-300">
                Our clients' <span className="text-amber-400 font-semibold">needs and satisfaction</span> are at the heart of everything we do.
              </p>
            </div>
            
            <div className="group text-center bg-gradient-to-br from-amber-50 to-amber-100 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:transform hover:-translate-y-2 border border-amber-200/50 animate-fade-in" style={{animationDelay: '0.4s'}}>
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-amber-700 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-10 h-10 text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-black/20 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
              </div>
              <h3 className="text-2xl font-bold text-black mb-4 font-serif group-hover:text-amber-700 transition-colors duration-300">Innovation</h3>
              <p className="text-gray-700 leading-relaxed group-hover:text-gray-800 transition-colors duration-300">
                We embrace <span className="text-amber-600 font-semibold">technology and innovative solutions</span> to enhance the real estate experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Developer Partnerships Section */}
      <section className="py-20 bg-black/95 border-t border-amber-500/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-amber-400 font-medium tracking-wider uppercase text-sm mb-4 block">Premium Network</span>
            <h2 className="text-4xl md:text-5xl font-bold text-amber-400 mb-6 font-serif">Developer Partnerships</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We collaborate with <span className="text-amber-400 font-semibold">Dubai's premier developers</span> to bring you exclusive access to the finest properties and investment opportunities in the region.
            </p>
          </div>

          {partnersLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-600"></div>
            </div>
          ) : partners.length > 0 ? (
            <div className="relative">
              {/* Navigation Buttons */}
              {allPartners.length > 3 && (
                <>
                  <button 
                    onClick={prevPartners}
                    disabled={currentPartnerIndex === 0}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-amber-500/20 hover:bg-amber-500/40 text-amber-600 hover:text-amber-700 p-3 rounded-full backdrop-blur-sm transition-all duration-300 transform hover:scale-110 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  <button 
                    onClick={nextPartners}
                    disabled={currentPartnerIndex + 3 >= allPartners.length}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-amber-500/20 hover:bg-amber-500/40 text-amber-600 hover:text-amber-700 p-3 rounded-full backdrop-blur-sm transition-all duration-300 transform hover:scale-110 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
              
              {/* Partners Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 px-4">
              {partners.map((partner, index) => (
                <div 
                  key={partner._id} 
                  className="group luxury-card overflow-hidden w-full h-full flex flex-col transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/20 animate-fade-in"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <div className="relative overflow-hidden">
                    {partner.logo ? (
                      <img 
                        src={partner.logo.startsWith('http') ? partner.logo : `http://localhost:5002${partner.logo}`}
                        alt={partner.name}
                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-64 bg-gradient-to-br from-amber-500/20 to-amber-600/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-700">
                        <svg className="w-20 h-20 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a2 2 0 114 0 2 2 0 01-4 0zm8-2a2 2 0 100 4 2 2 0 000-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-black/40 transition-all duration-500"></div>
                    
                    {/* Partner Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="bg-amber-500/90 text-black px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
                        Partner
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-white font-bold text-xl mb-3 group-hover:text-amber-400 transition-colors duration-300 line-clamp-2 leading-tight">
                      {partner.name}
                    </h3>
                    
                    <p className="text-gray-300 leading-relaxed mb-4">
                      {partner.description || 'Premium developer partnership for exclusive properties and investment opportunities.'}
                    </p>
                    
                    {partner.specialties && partner.specialties.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-amber-400 mb-3">Specialties</h4>
                        <div className="flex flex-wrap gap-2">
                          {partner.specialties.slice(0, 3).map((specialty, idx) => (
                            <span 
                              key={idx}
                              className="px-3 py-1 bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-amber-300 rounded-full text-xs font-medium border border-amber-500/30"
                            >
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {partner.website && (
                      <div className="mt-auto">
                        <a 
                          href={partner.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-black rounded-xl font-semibold text-sm hover:from-amber-400 hover:to-amber-500 transition-all duration-300 transform hover:scale-105 w-full justify-center"
                        >
                          Visit Website
                          <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-20 animate-fade-in">
              <div className="w-24 h-24 bg-gradient-to-br from-gold-100 to-gold-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gold-400 mb-4 font-serif">Building Partnerships</h3>
              <p className="text-gray-300 max-w-md mx-auto">
                We're actively building relationships with Dubai's top developers. Check back soon for our growing network of partnerships.
              </p>
            </div>
          )}

          <div className="text-center animate-fade-in" style={{animationDelay: '0.6s'}}>
            <Link 
              to="/contact" 
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-white rounded-xl font-semibold hover:from-gold-400 hover:to-gold-500 transition-all duration-300 transform hover:scale-105"
            >
              Partner With Us
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-20 h-20 border border-gold-400/20 rounded-full animate-float"></div>
        <div className="absolute bottom-20 right-10 w-16 h-16 border border-gold-400/20 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-20 w-2 h-2 bg-gold-400/30 rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-32 w-3 h-3 bg-gold-400/20 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-gradient-to-r from-black via-gray-900 to-amber-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-black/90 to-amber-900/90"></div>
        <div className="container mx-auto px-4 text-center relative">
          <div className="animate-fade-in">
            <span className="text-amber-400 font-medium tracking-wider uppercase text-sm mb-4 block">Start Your Journey</span>
            <h2 className="text-6xl font-bold mb-8 font-serif animate-slide-up">Ready to Work With Us?</h2>
            <div className="w-32 h-1 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto mb-8 animate-scale-in"></div>
            <p className="text-2xl mb-12 max-w-4xl mx-auto leading-relaxed animate-slide-up" style={{animationDelay: '0.2s'}}>
              Experience the <span className="text-amber-400 font-semibold">AMZ Properties difference</span>. Let our expert team help you achieve your real estate goals with unmatched expertise and dedication.
            </p>
            <div className="animate-fade-in" style={{animationDelay: '0.4s'}}>
              <Link 
                to="/contact" 
                className="inline-flex items-center px-12 py-6 bg-gradient-to-r from-amber-500 to-amber-600 text-black rounded-2xl font-bold text-xl hover:from-amber-400 hover:to-amber-500 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
              >
                Get In Touch
                <svg className="ml-3 w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-20 left-10 w-20 h-20 border border-amber-400/20 rounded-full animate-float"></div>
          <div className="absolute bottom-20 right-10 w-16 h-16 border border-amber-400/20 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-20 w-2 h-2 bg-amber-400/30 rounded-full animate-pulse"></div>
          <div className="absolute top-1/3 right-32 w-3 h-3 bg-amber-400/20 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
      </section>
    </div>
  )
}

export default About