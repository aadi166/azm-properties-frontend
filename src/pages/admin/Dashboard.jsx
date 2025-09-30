import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast, Toaster } from 'react-hot-toast'
import PropertyManagement from '../../components/admin/PropertyManagement'
import ContactManagement from '../../components/admin/ContactManagement'
import BlogManagement from '../../components/admin/BlogManagement'
import DeveloperManagement from '../../components/admin/DeveloperManagement'
import TestimonialManagement from '../../components/admin/TestimonialManagement'
import ProjectManagement from '../../components/admin/ProjectManagement'
import amzLogo from '../../assets/amz.logo.jpeg'

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('properties')
  const [adminInfo, setAdminInfo] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    const user = localStorage.getItem('adminUser')
    
    if (!token) {
      navigate('/admin/login')
      return
    }

    // Set admin info from localStorage or use default
    if (user) {
      try {
        setAdminInfo(JSON.parse(user))
      } catch (error) {
        console.error('Error parsing admin user data:', error)
        // Fallback to default admin info
        setAdminInfo({
          name: 'Admin User',
          email: 'admin@amzproperties.com'
        })
      }
    } else {
      // Fallback to default admin info
      setAdminInfo({
        name: 'Admin User',
        email: 'admin@amzproperties.com'
      })
    }
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    toast.success('Logged out successfully')
    navigate('/admin/login')
  }

  const tabs = [
    { 
      id: 'properties', 
      label: 'Properties', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    { 
      id: 'projects', 
      label: 'Projects', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v4a1 1 0 001 1h3v6h8v-6h3a1 1 0 001-1V7M7 7V5a3 3 0 016 0v2" />
        </svg>
      )
    },
    { 
      id: 'contacts', 
      label: 'Contacts', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    { 
      id: 'blogs', 
      label: 'Blogs', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      )
    },
    { 
      id: 'developers', 
      label: 'Developers', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    { 
      id: 'testimonials', 
      label: 'Testimonials', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )
    },
    // Wishlist tab removed from admin dashboard per request
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Header */}
      <header className="bg-gradient-to-r from-black via-gray-900 to-black shadow-2xl border-b-2 border-yellow-400 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center py-4 sm:py-6 gap-4 sm:gap-0">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <img 
                src={amzLogo} 
                alt="AMZ Properties Logo" 
                className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl filter drop-shadow-lg border border-yellow-400/30 hover:scale-105 transition-all duration-300"
                style={{imageRendering: 'crisp-edges'}}
              />
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">
                  AMZ Properties
                </h1>
                <p className="text-yellow-300/70 text-xs sm:text-sm font-medium">Admin Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 sm:space-x-6">
              {adminInfo && (
                <div className="text-right hidden sm:block">
                  <div className="text-yellow-300 font-medium text-sm lg:text-base">{adminInfo.name}</div>
                  <div className="text-yellow-400/60 text-xs">Administrator</div>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-1 sm:space-x-2"
              >
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-gradient-to-r from-gray-900/80 via-black/90 to-gray-900/80 backdrop-blur-md border-b border-yellow-400/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-1 sm:gap-2 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative py-3 sm:py-4 px-3 sm:px-4 lg:px-6 font-medium text-xs sm:text-sm transition-all duration-300 rounded-t-xl whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-b from-yellow-400/20 to-yellow-600/10 text-yellow-300 border-b-2 border-yellow-400 shadow-lg'
                    : 'text-yellow-200/70 hover:text-yellow-300 hover:bg-yellow-400/5 border-b-2 border-transparent hover:border-yellow-400/50'
                }`}
              >
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <span className="text-yellow-300">{tab.icon}</span>
                  <span className="font-semibold hidden sm:inline">{tab.label}</span>
                  <span className="font-semibold sm:hidden text-xs">{tab.label.slice(0, 4)}</span>
                </div>
                {activeTab === tab.id && (
                  <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-yellow-400 to-yellow-300"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8">
        <div className="py-4 sm:py-6">
          <div className="bg-gradient-to-br from-gray-900/95 via-black/90 to-gray-800/95 rounded-xl sm:rounded-2xl shadow-2xl border border-yellow-400/30 backdrop-blur-sm overflow-hidden">
            {/* Content Header */}
            <div className="bg-gradient-to-r from-yellow-400/10 to-yellow-600/5 border-b border-yellow-400/20 p-4 sm:p-6">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
                  <span className="text-black text-sm sm:text-base">
                    {tabs.find(tab => tab.id === activeTab)?.icon}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">
                  {tabs.find(tab => tab.id === activeTab)?.label} Management
                </h2>
              </div>
            </div>
            
            {/* Content Body */}
            <div className="p-4 sm:p-6 lg:p-8">
              {activeTab === 'properties' && <PropertyManagement />}
              {activeTab === 'contacts' && <ContactManagement />}
              {activeTab === 'blogs' && <BlogManagement />}
              {activeTab === 'projects' && <ProjectManagement />}
              {activeTab === 'developers' && <DeveloperManagement />}
              {activeTab === 'testimonials' && <TestimonialManagement />}
              {/* Wishlist removed from admin panel */}
            </div>
          </div>
        </div>
      </main>
      <Toaster position="top-right" />
    </div>
  )
}

export default AdminDashboard