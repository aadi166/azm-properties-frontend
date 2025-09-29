import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaGlobe, FaBuilding, FaAward, FaUsers, FaCalendarAlt } from 'react-icons/fa'
import apiService from '../services/api.js'

const PartnerDetail = () => {
  const { id } = useParams()
  const [partner, setPartner] = useState(null)
  const [relatedPartners, setRelatedPartners] = useState([])
  const [loading, setLoading] = useState(true)

  // Static partner data (same as Home page)
  const staticPartnerDevelopers = [
    {
      id: 1,
      name: 'Emaar Properties',
      logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop',
      description: 'Leading developer of premium lifestyle communities in Dubai',
      detailedDescription: `
        Emaar Properties is Dubai's most valuable and largest real estate development company. Founded in 1997, Emaar has established itself as a global leader in real estate development, hospitality, and retail.
        
        The company is renowned for developing some of the world's most iconic landmarks, including the Burj Khalifa, the world's tallest building, and The Dubai Mall, one of the world's largest shopping and entertainment destinations.
        
        Emaar's commitment to excellence and innovation has made it a trusted name in luxury real estate development across the Middle East, North Africa, Asia, and beyond.
      `,
      specialties: ['Luxury Residential', 'Commercial Developments', 'Hospitality', 'Retail'],
      location: 'Dubai, UAE',
      established: '1997',
      totalProjects: '150+',
      employees: '5000+',
      website: 'www.emaar.com',
      phone: '+971 4 367 3333',
      email: 'info@emaar.ae',
      projects: [
        {
          name: 'Burj Khalifa',
          type: 'Mixed-use',
          status: 'Completed',
          year: '2010'
        },
        {
          name: 'Downtown Dubai',
          type: 'Master Community',
          status: 'Completed',
          year: '2004-2014'
        },
        {
          name: 'Dubai Creek Harbour',
          type: 'Waterfront Development',
          status: 'Ongoing',
          year: '2016-2025'
        },
        {
          name: 'Emaar Beachfront',
          type: 'Luxury Residential',
          status: 'Ongoing',
          year: '2017-2024'
        }
      ],
      awards: [
        'Best Developer in the Middle East 2023',
        'Excellence in Real Estate Development 2022',
        'Sustainable Development Award 2021'
      ],
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=400&fit=crop'
    },
    {
      id: 2,
      name: 'DAMAC Properties',
      logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop',
      description: 'Luxury real estate developer with premium residential and commercial projects',
      detailedDescription: `
        DAMAC Properties is a leading luxury real estate developer in the Middle East, with a strong presence in Dubai, Abu Dhabi, Saudi Arabia, Qatar, Jordan, Lebanon, and the United Kingdom.
        
        Since its inception in 2002, DAMAC has delivered over 44,000 homes and has a development portfolio of over 50,000 units at various stages of progress and planning across the Middle East.
        
        The company is known for its luxury developments, innovative designs, and strategic partnerships with world-renowned brands and designers.
      `,
      specialties: ['Luxury Villas', 'High-end Apartments', 'Golf Communities', 'Branded Residences'],
      location: 'Dubai, UAE',
      established: '2002',
      totalProjects: '200+',
      employees: '3000+',
      website: 'www.damacproperties.com',
      phone: '+971 4 420 0000',
      email: 'info@damacproperties.com',
      projects: [
        {
          name: 'DAMAC Hills',
          type: 'Golf Community',
          status: 'Completed',
          year: '2015-2020'
        },
        {
          name: 'AKOYA Oxygen',
          type: 'Golf Community',
          status: 'Ongoing',
          year: '2014-2024'
        },
        {
          name: 'DAMAC Lagoons',
          type: 'Waterfront Community',
          status: 'Ongoing',
          year: '2021-2026'
        },
        {
          name: 'Paramount Tower',
          type: 'Luxury Residential',
          status: 'Completed',
          year: '2017'
        }
      ],
      awards: [
        'Best Luxury Developer 2023',
        'Innovation in Design Award 2022',
        'Customer Excellence Award 2021'
      ],
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=400&fit=crop'
    },
    {
      id: 3,
      name: 'Sobha Realty',
      logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop',
      description: 'Premium developer known for quality construction and luxury amenities',
      detailedDescription: `
        Sobha Realty is the international arm of Sobha Limited, one of the fastest growing and foremost backward integrated real estate players in the country.
        
        Founded in 1995, Sobha Limited is currently one of India's largest real estate companies. The company has expanded its operations to Dubai, focusing on luxury residential developments.
        
        Sobha Realty is known for its commitment to quality, innovation, and customer satisfaction, delivering projects that set new benchmarks in luxury living.
      `,
      specialties: ['Luxury Apartments', 'Premium Villas', 'Waterfront Properties', 'Golf Communities'],
      location: 'Dubai, UAE',
      established: '2014',
      totalProjects: '25+',
      employees: '1500+',
      website: 'www.sobharealty.com',
      phone: '+971 4 373 7777',
      email: 'info@sobharealty.com',
      projects: [
        {
          name: 'Sobha Hartland',
          type: 'Waterfront Community',
          status: 'Ongoing',
          year: '2014-2025'
        },
        {
          name: 'Sobha Creek Vistas',
          type: 'Luxury Apartments',
          status: 'Completed',
          year: '2019'
        },
        {
          name: 'Sobha One',
          type: 'Ultra-luxury Tower',
          status: 'Ongoing',
          year: '2022-2026'
        },
        {
          name: 'Sobha Seahaven',
          type: 'Beachfront Residences',
          status: 'Planning',
          year: '2024-2028'
        }
      ],
      awards: [
        'Quality Excellence Award 2023',
        'Best Residential Developer 2022',
        'Green Building Certification 2021'
      ],
      image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&h=400&fit=crop'
    }
  ]

  useEffect(() => {
    const fetchPartnerData = async () => {
      try {
        // Use the API service which handles both _id and id fields correctly
        const result = await apiService.getPartnerById(id)
        
        if (result.success && result.data) {
          const apiPartner = result.data
          
          // Transform API data to match frontend format
          const transformedPartner = {
            id: apiPartner._id || apiPartner.id,
            name: apiPartner.name,
            description: apiPartner.description,
            logo: apiPartner.logo ? 
              (apiPartner.logo.startsWith('http') ? apiPartner.logo : `http://localhost:5003${apiPartner.logo}`) : 
              'https://via.placeholder.com/200x100/d97706/000000?text=' + apiPartner.name.replace(/\s+/g, '+'),
            established: apiPartner.established,
            totalProjects: apiPartner.totalProjects + '+',
            employees: '500+', // Default value
            location: apiPartner.contact?.address?.city + ', ' + apiPartner.contact?.address?.country || 'Dubai, UAE',
            website: apiPartner.contact?.website || '',
            phone: apiPartner.contact?.phone || '',
            email: apiPartner.contact?.email || '',
            detailedDescription: apiPartner.about || apiPartner.description,
            specialties: apiPartner.specialties || ['Luxury Properties', 'Premium Developments'],
            projects: [
              {
                name: 'Premium Project 1',
                type: 'Luxury Development',
                status: 'Ongoing',
                year: '2023-2025'
              }
            ],
            awards: apiPartner.awards || ['Excellence Award 2023'],
            image: apiPartner.coverImage ? 
              (apiPartner.coverImage.startsWith('http') ? apiPartner.coverImage : `http://localhost:5003${apiPartner.coverImage}`) : 
              'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&h=400&fit=crop'
          }
          setPartner(transformedPartner)
          
          // Fetch other partners for related section
          const partnersResult = await apiService.getPartners()
          if (partnersResult.success || partnersResult.partners) {
            const allPartners = partnersResult.data || partnersResult.partners || []
            const related = allPartners
              .filter(p => (p._id || p.id) !== id && p.status === 'active')
              .slice(0, 2)
              .map(p => ({
                id: p._id || p.id,
                name: p.name,
                description: p.description,
                logo: p.logo ? 
                  (p.logo.startsWith('http') ? p.logo : `http://localhost:5003${p.logo}`) : 
                  'https://via.placeholder.com/200x100/d97706/000000?text=' + p.name.replace(/\s+/g, '+'),
                location: p.contact?.address?.city + ', ' + p.contact?.address?.country || 'Dubai, UAE'
              }))
            setRelatedPartners(related)
          }
        } else {
          // Fallback to static data
          const foundPartner = staticPartnerDevelopers.find(dev => 
            dev.id === parseInt(id) || dev.id.toString() === id || dev._id === id
          )
          if (foundPartner) {
            setPartner(foundPartner)
            const related = staticPartnerDevelopers.filter(dev => 
              dev.id !== parseInt(id) && dev.id.toString() !== id && dev._id !== id
            ).slice(0, 2)
            setRelatedPartners(related)
          }
        }
      } catch (error) {
        console.error('Error fetching partner:', error)
        // Fallback to static data
        const foundPartner = staticPartnerDevelopers.find(dev => 
          dev.id === parseInt(id) || dev.id.toString() === id || dev._id === id
        )
        if (foundPartner) {
          setPartner(foundPartner)
          const related = staticPartnerDevelopers.filter(dev => 
            dev.id !== parseInt(id) && dev.id.toString() !== id && dev._id !== id
          ).slice(0, 2)
          setRelatedPartners(related)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchPartnerData()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-gold-400 text-xl">Loading...</div>
      </div>
    )
  }

  if (!partner) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Partner Not Found</h1>
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
          <div className="max-w-6xl mx-auto">
            {/* Breadcrumb */}
            <nav className="mb-8">
              <Link to="/" className="text-gold-400 hover:text-gold-300 transition-colors">
                Home
              </Link>
              <span className="text-gray-500 mx-2">/</span>
              <span className="text-gray-300">Partners</span>
              <span className="text-gray-500 mx-2">/</span>
              <span className="text-white">{partner.name}</span>
            </nav>

            {/* Partner Header */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center mb-6">
                  <img 
                    src={partner.logo} 
                    alt={partner.name}
                    className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-gold-500/30"
                  />
                  <div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 font-serif">
                      {partner.name}
                    </h1>
                    <p className="text-gold-400 text-lg">{partner.description}</p>
                  </div>
                </div>
                
                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-dark-800/50 backdrop-blur-sm rounded-xl p-4 border border-gold-500/20">
                    <div className="flex items-center text-gold-400 mb-2">
                      <FaCalendarAlt className="mr-2" />
                      <span className="text-sm">Established</span>
                    </div>
                    <p className="text-white font-semibold">{partner.established}</p>
                  </div>
                  <div className="bg-dark-800/50 backdrop-blur-sm rounded-xl p-4 border border-gold-500/20">
                    <div className="flex items-center text-gold-400 mb-2">
                      <FaBuilding className="mr-2" />
                      <span className="text-sm">Projects</span>
                    </div>
                    <p className="text-white font-semibold">{partner.totalProjects}</p>
                  </div>
                  <div className="bg-dark-800/50 backdrop-blur-sm rounded-xl p-4 border border-gold-500/20">
                    <div className="flex items-center text-gold-400 mb-2">
                      <FaUsers className="mr-2" />
                      <span className="text-sm">Employees</span>
                    </div>
                    <p className="text-white font-semibold">{partner.employees}</p>
                  </div>
                  <div className="bg-dark-800/50 backdrop-blur-sm rounded-xl p-4 border border-gold-500/20">
                    <div className="flex items-center text-gold-400 mb-2">
                      <FaMapMarkerAlt className="mr-2" />
                      <span className="text-sm">Location</span>
                    </div>
                    <p className="text-white font-semibold">{partner.location}</p>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <img 
                  src={partner.image} 
                  alt={partner.name}
                  className="w-full h-96 object-cover rounded-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <div className="bg-dark-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gold-500/20 mb-8">
                  <h2 className="text-3xl font-bold text-white mb-6 font-serif">About {partner.name}</h2>
                  <div className="text-gray-300 leading-relaxed whitespace-pre-line">
                    {partner.detailedDescription}
                  </div>
                </div>

                {/* Specialties */}
                <div className="bg-dark-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gold-500/20 mb-8">
                  <h3 className="text-2xl font-bold text-white mb-6 font-serif">Specialties</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {partner.specialties.map((specialty, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-2 h-2 bg-gold-400 rounded-full mr-3"></div>
                        <span className="text-gray-300">{specialty}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Major Projects */}
                <div className="bg-dark-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gold-500/20">
                  <h3 className="text-2xl font-bold text-white mb-6 font-serif">Major Projects</h3>
                  <div className="space-y-4">
                    {partner.projects.map((project, index) => (
                      <div key={index} className="border border-gold-500/20 rounded-xl p-4 hover:border-gold-400/40 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-white font-semibold">{project.name}</h4>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            project.status === 'Completed' ? 'bg-green-500/20 text-green-400' :
                            project.status === 'Ongoing' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {project.status}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-400">
                          <span>{project.type}</span>
                          <span>{project.year}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-8">
                {/* Contact Info */}
                <div className="bg-dark-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gold-500/20">
                  <h3 className="text-xl font-bold text-white mb-6 font-serif">Contact Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <FaGlobe className="text-gold-400 mr-3" />
                      <a href={`https://${partner.website}`} className="text-gray-300 hover:text-gold-400 transition-colors">
                        {partner.website}
                      </a>
                    </div>
                    <div className="flex items-center">
                      <FaPhone className="text-gold-400 mr-3" />
                      <a href={`tel:${partner.phone}`} className="text-gray-300 hover:text-gold-400 transition-colors">
                        {partner.phone}
                      </a>
                    </div>
                    <div className="flex items-center">
                      <FaEnvelope className="text-gold-400 mr-3" />
                      <a href={`mailto:${partner.email}`} className="text-gray-300 hover:text-gold-400 transition-colors">
                        {partner.email}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Awards */}
                <div className="bg-dark-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gold-500/20">
                  <h3 className="text-xl font-bold text-white mb-6 font-serif">Awards & Recognition</h3>
                  <div className="space-y-3">
                    {partner.awards.map((award, index) => (
                      <div key={index} className="flex items-start">
                        <FaAward className="text-gold-400 mr-3 mt-1 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{award}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Partners */}
      {relatedPartners.length > 0 && (
        <section className="py-16 border-t border-gold-500/20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-12 text-center font-serif">
                Other Partners
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                {relatedPartners.map((relatedPartner) => (
                  <Link 
                    key={relatedPartner.id}
                    to={`/partner/${relatedPartner.id}`}
                    className="group"
                  >
                    <div className="bg-dark-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gold-500/20 hover:border-gold-400/40 transition-all duration-300">
                      <div className="flex items-center mb-4">
                        <img 
                          src={relatedPartner.logo} 
                          alt={relatedPartner.name}
                          className="w-12 h-12 rounded-full object-cover mr-4 border border-gold-500/30"
                        />
                        <div>
                          <h3 className="text-white font-semibold text-lg group-hover:text-gold-400 transition-colors">
                            {relatedPartner.name}
                          </h3>
                          <p className="text-gray-400 text-sm">{relatedPartner.location}</p>
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {relatedPartner.description}
                      </p>
                    </div>
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
            Interested in {partner.name} Properties?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Contact our expert team to explore exclusive properties from {partner.name} and other premium developers.
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

export default PartnerDetail