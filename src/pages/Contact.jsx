import React, { useState, useEffect } from 'react'
import { apiService } from '../services/api'
import { countryCodes } from '../data/countryCodes'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    countryCode: '+971',
    subject: '',
    message: '',
    propertyType: 'apartment'
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')
  const [activeTab, setActiveTab] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage('')
    
    try {
      const response = await apiService.submitContactForm(formData)
      setSubmitMessage('Thank you for your message! We will get back to you within 24 hours.')
      setFormData({
        name: '',
        email: '',
        phone: '',
        countryCode: '+971',
        subject: '',
        message: '',
        propertyType: 'apartment'
      })
    } catch (error) {
      console.error('Contact form submission error:', error)
      setSubmitMessage('Sorry, there was an error sending your message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
        </svg>
      ),
      title: 'Visit Our Office',
      details: ['Business Bay, Dubai, UAE', 'Office 1205, XYZ Tower'],
      gradient: 'from-luxury-500 to-gold-500'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.3"/>
        </svg>
      ),
      title: 'Call Us',
      details: ['+971 50 123 4567', '+971 4 567 8901'],
      gradient: 'from-blue-500 to-luxury-500'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          <circle cx="12" cy="12" r="2" fill="currentColor" opacity="0.4"/>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12l2 2 4-4" stroke="currentColor" opacity="0.6"/>
        </svg>
      ),
      title: 'Email Us',
      details: ['info@amzproperties.ae', 'sales@amzproperties.ae'],
      gradient: 'from-green-500 to-luxury-500'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
      ),
      title: 'Working Hours',
      details: ['Mon - Fri: 9:00 AM - 7:00 PM', 'Sat - Sun: 10:00 AM - 6:00 PM'],
      gradient: 'from-purple-500 to-luxury-500'
    }
  ]

  const faqs = [
    {
      question: 'What areas of Dubai do you cover?',
      answer: 'We cover all major areas of Dubai including Downtown, Marina, JBR, Palm Jumeirah, Business Bay, DIFC, Arabian Ranches, Emirates Hills, and many more premium locations with exclusive properties.'
    },
    {
      question: 'Do you assist with property financing?',
      answer: 'Yes, we work with leading banks and financial institutions to help you secure the best mortgage rates and financing options. Our financial advisors will guide you through the entire process.'
    },
    {
      question: 'What is your commission structure?',
      answer: 'Our commission is competitive and transparent with no hidden charges. We provide detailed fee structures upfront and offer flexible payment options for our premium services.'
    },
    {
      question: 'How long does the property buying process take?',
      answer: 'The timeline varies depending on the property type and financing. Typically, it takes 2-4 weeks from offer acceptance to completion for ready properties, while off-plan properties may take longer.'
    },
    {
      question: 'Do you provide property management services?',
      answer: 'Yes, we offer comprehensive property management services including tenant sourcing, maintenance, rent collection, and investment portfolio management for property owners.'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-dark-900">
      {/* Enhanced Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-dark-900 via-luxury-800 to-dark-900 text-white overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-luxury-600/70 to-gold-600/70"></div>
        <div className="absolute inset-0 bg-black/30"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 sm:top-20 left-10 sm:left-20 w-24 sm:w-32 h-24 sm:h-32 bg-gold-400/30 sm:bg-gold-400/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-10 sm:bottom-20 right-10 sm:right-20 w-32 sm:w-40 h-32 sm:h-40 bg-luxury-400/30 sm:bg-luxury-400/20 rounded-full blur-3xl animate-float-delayed"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 sm:w-60 h-40 sm:h-60 bg-gold-300/20 sm:bg-gold-300/10 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute top-5 sm:top-10 right-1/4 w-16 sm:w-24 h-16 sm:h-24 bg-luxury-300/25 sm:bg-luxury-300/15 rounded-full blur-2xl animate-bounce-slow"></div>
          <div className="absolute bottom-5 sm:bottom-10 left-1/4 w-24 sm:w-36 h-24 sm:h-36 bg-gold-200/20 sm:bg-gold-200/10 rounded-full blur-3xl animate-float"></div>
        </div>
        
        {/* Geometric Patterns */}
        <div className="absolute inset-0 opacity-20 sm:opacity-10">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-gold-400 rotate-45 animate-twinkle"></div>
          <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-luxury-400 rotate-45 animate-twinkle" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-gold-300 rotate-45 animate-twinkle" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-luxury-300 rotate-45 animate-twinkle" style={{animationDelay: '0.5s'}}></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className={`transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <span className="text-gold-400 font-medium tracking-wider uppercase text-sm mb-4 block animate-fade-in">
              Luxury Real Estate Experts
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 font-serif bg-gradient-to-r from-white via-gold-200 to-white bg-clip-text text-transparent animate-slide-up">
              Contact Us
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed text-gray-200 animate-fade-in px-4" style={{animationDelay: '0.3s'}}>
              Ready to find your dream property? Our luxury real estate experts are here to guide you through every step of your journey in Dubai's premium market.
            </p>
            
            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in" style={{animationDelay: '0.6s'}}>
              <a href="#contact-form" className="group btn-primary btn-lg scroll-smooth relative overflow-hidden">
                <span className="relative z-10 flex items-center justify-center">
                  Start Your Journey
                  <svg className="w-5 h-5 ml-2 group-hover:translate-y-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-gold-600 to-luxury-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </a>
              <a href="tel:+971501234567" className="group btn-ghost btn-lg relative overflow-hidden">
                <span className="relative z-10 flex items-center justify-center">
                  Call Now
                  <svg className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Simplified Contact Form (Home-style) */}
      <section id="contact-form" className="py-20 bg-gradient-to-br from-black to-dark-900 border-t border-gold-500/20 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <span className="text-gold-400 font-medium tracking-wider uppercase text-sm mb-4 block">Get In Touch</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gold-400 mb-6 font-serif">Contact Us</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">Ready to find your dream property? Get in touch with our expert team today</p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="bg-gradient-to-br from-luxury-900/50 to-black/50 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-gold-500/20 shadow-2xl">
              {submitMessage && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-800 px-6 py-4 rounded-xl mb-8">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {submitMessage}
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3 rounded-lg bg-dark-700/50 border border-gray-600 text-white" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-3 rounded-lg bg-dark-700/50 border border-gray-600 text-white" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                  <div className="flex gap-2">
                    <select name="countryCode" value={formData.countryCode} onChange={handleChange} className="px-3 py-3 rounded-lg bg-dark-700/50 border border-gray-600 text-white">
                      {countryCodes.map(c => (<option key={c.code} value={c.code}>{c.code}</option>))}
                    </select>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="flex-1 px-4 py-3 rounded-lg bg-dark-700/50 border border-gray-600 text-white" placeholder="e.g. 501234567" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Message *</label>
                  <textarea name="message" value={formData.message} onChange={handleChange} required rows={5} className="w-full px-4 py-3 rounded-lg bg-dark-700/50 border border-gray-600 text-white" />
                </div>

                <div className="text-center">
                  <button type="submit" disabled={isSubmitting} className="px-6 py-3 bg-gradient-to-r from-gold-600 to-yellow-500 text-black font-semibold rounded-xl">{isSubmitting? 'Sending...' : 'Send Message'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Google Maps Section */}
      <section className="py-20 bg-gradient-to-b from-dark-900 to-black relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-1/4 w-32 h-32 border border-luxury-300 rounded-full"></div>
          <div className="absolute bottom-20 right-1/4 w-24 h-24 border border-gold-300 rounded-full"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <span className="text-gold-400 font-medium tracking-wider uppercase text-sm animate-fade-in">Location</span>
            <h2 className="text-5xl font-bold text-white mt-2 mb-6 font-serif animate-slide-up">Visit Our Office</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed animate-fade-in" style={{animationDelay: '0.2s'}}>
              Located in the heart of Business Bay, Dubai - Your gateway to luxury real estate
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Office Details */}
            <div className="space-y-8">
              <div className="bg-dark-800/90 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-gold-500/20">
                <h3 className="text-2xl font-bold text-white mb-6 font-serif">AMZ Properties Office</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-luxury-600 to-gold-500 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2">Address</h4>
                      <p className="text-gray-300">Office 1205, XYZ Tower</p>
                      <p className="text-gray-300">Business Bay, Dubai, UAE</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-600 to-luxury-500 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2">Office Hours</h4>
                      <p className="text-gray-300">Monday - Friday: 9:00 AM - 7:00 PM</p>
                      <p className="text-gray-300">Saturday - Sunday: 10:00 AM - 6:00 PM</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-green-600 to-luxury-500 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2">Nearby Landmarks</h4>
                      <p className="text-gray-300">• Burj Khalifa (5 min drive)</p>
                      <p className="text-gray-300">• Dubai Mall (7 min drive)</p>
                      <p className="text-gray-300">• DIFC (3 min walk)</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gold-500/20">
                  <a 
                    href="https://maps.google.com/?q=Business+Bay+Dubai+UAE"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-gold-400 hover:text-gold-300 font-medium transition-colors duration-300"
                  >
                    <span>Get Directions</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Google Maps Embed */}
            <div className="relative">
              <div className="bg-dark-800/90 backdrop-blur-sm p-4 rounded-3xl shadow-2xl border border-gold-500/20">
                <div className="relative overflow-hidden rounded-2xl" style={{paddingBottom: '56.25%', height: 0}}>
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3610.1739405345794!2d55.26395!3d25.1972!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43348a67e24b%3A0xff45e502e1ceb7e2!2sBusiness%20Bay%2C%20Dubai%20-%20United%20Arab%20Emirates!5e0!3m2!1sen!2s!4v1647875234567!5m2!1sen!2s"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      border: 0
                    }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="AMZ Properties Office Location"
                  ></iframe>
                </div>
              </div>
              
              {/* Floating Contact Card */}
              <div className="absolute -bottom-6 -right-6 bg-gradient-to-r from-luxury-600 to-gold-500 p-6 rounded-2xl shadow-2xl border border-gold-400/30">
                <div className="text-center">
                  <h4 className="text-white font-bold mb-2">Need Directions?</h4>
                  <a 
                    href="tel:+971501234567"
                    className="text-white/90 hover:text-white text-sm font-medium transition-colors duration-300"
                  >
                    Call: +971 50 123 4567
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced FAQ Section */}
      <section className="py-20 bg-gradient-to-b from-black to-dark-900 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-1/4 w-32 h-32 border border-luxury-300 rounded-full"></div>
          <div className="absolute bottom-20 right-1/4 w-24 h-24 border border-gold-300 rounded-full"></div>
          <div className="absolute top-1/2 left-10 w-16 h-16 bg-luxury-200 rounded-full blur-xl"></div>
          <div className="absolute top-1/3 right-10 w-20 h-20 bg-gold-200 rounded-full blur-xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <span className="text-gold-400 font-medium tracking-wider uppercase text-sm animate-fade-in">Support</span>
            <h2 className="text-5xl font-bold text-white mt-2 mb-6 font-serif animate-slide-up">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed animate-fade-in" style={{animationDelay: '0.2s'}}>
              Quick answers to common questions about our luxury real estate services
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className={`group bg-dark-800/90 backdrop-blur-sm rounded-2xl border border-gold-500/20 p-8 cursor-pointer transition-all duration-500 hover:shadow-2xl hover:shadow-gold-500/20 animate-fade-in ${
                  activeTab === index ? 'ring-2 ring-gold-400/50 bg-gradient-to-r from-gold-500/10 to-gold-400/10' : 'hover:bg-gradient-to-r hover:from-gold-500/5 hover:to-gold-400/5'
                }`}
                style={{animationDelay: `${index * 0.1}s`}}
                onClick={() => setActiveTab(activeTab === index ? -1 : index)}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white font-serif group-hover:text-gold-400 transition-colors duration-300 flex-1 pr-4">
                    {faq.question}
                  </h3>
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-r from-gold-500 to-gold-400 flex items-center justify-center text-white transition-transform duration-300 ${
                    activeTab === index ? 'rotate-180' : 'group-hover:scale-110'
                  }`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                
                <div className={`overflow-hidden transition-all duration-500 ${
                  activeTab === index ? 'max-h-96 opacity-100 mt-6' : 'max-h-0 opacity-0'
                }`}>
                  <div className="border-t border-gold-500/20 pt-6">
                    <p className="text-gray-300 text-lg leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
                
                {/* Hover Border Effect */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-gold-400/30 rounded-2xl transition-colors duration-300 pointer-events-none"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA removed per request */}

      {/* Floating WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <a
          href="https://wa.me/971501234567?text=Hello! I'm interested in your luxury properties. Can you help me find the perfect home?"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full shadow-2xl hover:shadow-green-500/50 transition-all duration-300 transform hover:scale-110 active:scale-95 animate-bounce"
          style={{animationDuration: '2s'}}
        >
          {/* Background Glow */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-600 to-green-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* WhatsApp Icon */}
          <svg className="relative z-10 w-8 h-8 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
          </svg>
          
          {/* Pulse Animation */}
          <div className="absolute inset-0 rounded-full bg-green-400 opacity-30 animate-ping group-hover:opacity-0 transition-opacity duration-300"></div>
          
          {/* Ripple Effect */}
          <div className="absolute inset-0 rounded-full bg-green-400 opacity-0 group-hover:opacity-30 group-hover:scale-150 transition-all duration-500"></div>
          
          {/* Tooltip */}
          <div className="absolute right-full mr-4 top-1/2 transform -translate-y-1/2 bg-dark-800 text-white px-4 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap transform translate-x-2 group-hover:translate-x-0">
            
            <div className="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-dark-800 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
          </div>
        </a>
      </div>
    </div>
  )
}

export default Contact