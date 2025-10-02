import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Header from './components/Header'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import Properties from './pages/Properties'
import Projects from './pages/Projects'
import Wishlist from './pages/Wishlist'
import About from './pages/About'
import Contact from './pages/Contact'
import BlogDetail from './pages/BlogDetail'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsAndConditions from './pages/TermsAndConditions'
import AdminLogin from './pages/admin/Login'
import AdminDashboard from './pages/admin/Dashboard'
import './App.css'

// Admin route guard component
const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken')
  return token ? children : <Navigate to="/admin/login" />
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="App">
        <Routes>
          {/* Admin routes without header and footer */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          
          {/* Public routes with header and footer */}
          <Route path="*" element={
            <>
              <Header />
              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/properties" element={<Properties />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/blog/:id" element={<BlogDetail />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/terms" element={<TermsAndConditions />} />
                </Routes>
              </main>
              <Footer />
            </>
          } />
        </Routes>
        
        {/* Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1f2937',
              color: '#f3f4f6',
              border: '1px solid #374151',
              borderRadius: '0.75rem',
              fontSize: '14px',
              fontWeight: '500',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#1f2937',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#1f2937',
              },
            },
          }}
        />
      </div>
    </Router>
  )
}

export default App