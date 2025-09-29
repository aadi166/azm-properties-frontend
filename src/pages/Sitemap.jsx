import React from 'react'
import { Link } from 'react-router-dom'

const Sitemap = () => {
  const siteStructure = [
    {
      title: "Main Pages",
      links: [
        { name: "Home", path: "/", description: "Welcome to AMZ Properties - Luxury Real Estate in Dubai" },
        { name: "About Us", path: "/about", description: "Learn about our company, mission, and team" },
        { name: "Properties", path: "/properties", description: "Browse our exclusive luxury property listings" },
        { name: "Projects", path: "/projects", description: "Discover our featured development projects" },
        { name: "Contact", path: "/contact", description: "Get in touch with our real estate experts" },
        { name: "Wishlist", path: "/wishlist", description: "View your saved properties and favorites" }
      ]
    },
    {
      title: "Property Categories",
      links: [
        { name: "Luxury Apartments", path: "/properties?type=apartment", description: "Premium apartments in Dubai's finest locations" },
        { name: "Luxury Villas", path: "/properties?type=villa", description: "Exclusive villas with world-class amenities" },
        { name: "Penthouses", path: "/properties?type=penthouse", description: "Ultra-luxury penthouses with stunning views" },
        { name: "Commercial Properties", path: "/properties?type=commercial", description: "Prime commercial real estate opportunities" }
      ]
    },
    {
      title: "Featured Locations",
      links: [
        { name: "Dubai Marina", path: "/properties?location=dubai-marina", description: "Waterfront living in Dubai's premier marina" },
        { name: "Downtown Dubai", path: "/properties?location=downtown", description: "Heart of the city with iconic landmarks" },
        { name: "Palm Jumeirah", path: "/properties?location=palm-jumeirah", description: "Exclusive island living with beach access" },
        { name: "Business Bay", path: "/properties?location=business-bay", description: "Modern business district with luxury residences" },
        { name: "Jumeirah Beach Residence", path: "/properties?location=jbr", description: "Beachfront community with resort-style living" }
      ]
    },
    {
      title: "Developer Partners",
      links: [
        { name: "Emaar Properties", path: "/partner/1", description: "Dubai's leading property developer" },
        { name: "Damac Properties", path: "/partner/2", description: "Luxury real estate development company" },
        { name: "Sobha Realty", path: "/partner/3", description: "Premium residential and commercial developments" },
        { name: "Omniyat", path: "/partner/4", description: "Ultra-luxury property development" },
        { name: "Mag Properties", path: "/partner/5", description: "Innovative real estate solutions" }
      ]
    },
    {
      title: "Services",
      links: [
        { name: "Property Sales", path: "/services/sales", description: "Expert assistance in buying luxury properties" },
        { name: "Investment Advisory", path: "/services/investment", description: "Professional real estate investment guidance" },
        { name: "Property Management", path: "/services/management", description: "Comprehensive property management services" },
        { name: "Market Analysis", path: "/services/analysis", description: "In-depth market research and insights" },
        { name: "Consultation", path: "/services/consultation", description: "Personalized real estate consultation" }
      ]
    },
    {
      title: "Resources",
      links: [
        { name: "Market Reports", path: "/resources/reports", description: "Latest Dubai real estate market insights" },
        { name: "Investment Guide", path: "/resources/guide", description: "Complete guide to property investment in Dubai" },
        { name: "Buyer's Guide", path: "/resources/buyers", description: "Essential information for property buyers" },
        { name: "Legal Information", path: "/resources/legal", description: "Legal aspects of property ownership in UAE" }
      ]
    },
    {
      title: "Legal & Policies",
      links: [
        { name: "Privacy Policy", path: "/privacy", description: "How we protect and handle your personal information" },
        { name: "Terms & Conditions", path: "/terms", description: "Terms of service for using our website and services" },
        { name: "Cookie Policy", path: "/cookies", description: "Information about our use of cookies" },
        { name: "Disclaimer", path: "/disclaimer", description: "Important disclaimers and limitations" }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-luxury-900 to-dark-900">
      {/* Hero Section */}
      <div className="relative py-24 bg-gradient-to-r from-luxury-900/90 to-gold-900/90">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 font-serif">
              Sitemap
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              Navigate through all pages and sections of AMZ Properties website
            </p>
            <div className="flex items-center justify-center space-x-2 text-gold-400">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <span className="text-gray-400">/</span>
              <span className="text-white">Sitemap</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            
            {/* Introduction */}
            <div className="text-center mb-12">
              <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
                Explore our comprehensive website structure and find exactly what you're looking for. 
                Our sitemap provides easy access to all pages, services, and resources available on AMZ Properties.
              </p>
            </div>

            {/* Site Structure Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {siteStructure.map((section, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-gold-500/30 transition-all duration-300">
                  <h2 className="text-2xl font-bold text-gold-400 mb-6 font-serif flex items-center">
                    <span className="w-8 h-8 bg-gold-500/20 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-gold-400 font-bold">{index + 1}</span>
                    </span>
                    {section.title}
                  </h2>
                  
                  <div className="space-y-4">
                    {section.links.map((link, linkIndex) => (
                      <div key={linkIndex} className="group">
                        <Link 
                          to={link.path} 
                          className="block p-4 rounded-lg bg-white/5 hover:bg-white/10 border border-transparent hover:border-gold-500/30 transition-all duration-300"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="text-white font-semibold group-hover:text-gold-400 transition-colors mb-1">
                                {link.name}
                              </h3>
                              <p className="text-gray-400 text-sm leading-relaxed">
                                {link.description}
                              </p>
                            </div>
                            <div className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                              <svg className="w-5 h-5 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Navigation */}
            <div className="mt-16 bg-gradient-to-r from-luxury-600/20 to-gold-600/20 rounded-2xl p-8 border border-gold-500/30">
              <h2 className="text-3xl font-bold text-white mb-6 font-serif text-center">Quick Navigation</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link to="/" className="bg-white/10 rounded-lg p-4 text-center hover:bg-white/20 transition-all duration-300 group">
                  <div className="w-12 h-12 bg-gold-500/20 rounded-lg mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <span className="text-white font-medium">Home</span>
                </Link>
                
                <Link to="/properties" className="bg-white/10 rounded-lg p-4 text-center hover:bg-white/20 transition-all duration-300 group">
                  <div className="w-12 h-12 bg-gold-500/20 rounded-lg mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <span className="text-white font-medium">Properties</span>
                </Link>
                
                <Link to="/about" className="bg-white/10 rounded-lg p-4 text-center hover:bg-white/20 transition-all duration-300 group">
                  <div className="w-12 h-12 bg-gold-500/20 rounded-lg mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-white font-medium">About</span>
                </Link>
                
                <Link to="/contact" className="bg-white/10 rounded-lg p-4 text-center hover:bg-white/20 transition-all duration-300 group">
                  <div className="w-12 h-12 bg-gold-500/20 rounded-lg mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-white font-medium">Contact</span>
                </Link>
              </div>
            </div>

            {/* Contact Information */}
            <div className="mt-12 text-center">
              <h3 className="text-2xl font-bold text-white mb-4 font-serif">Need Help Finding Something?</h3>
              <p className="text-gray-300 mb-6">
                Can't find what you're looking for? Our team is here to help you navigate our services.
              </p>
              <Link 
                to="/contact" 
                className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-gold-600 to-gold-500 text-white font-semibold rounded-lg hover:from-gold-500 hover:to-gold-400 transition-all duration-300 transform hover:scale-105"
              >
                Contact Our Team
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Sitemap