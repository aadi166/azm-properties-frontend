import React from 'react'
import { Link } from 'react-router-dom'
import amzLogo from '../assets/amz.logo.jpeg'

const Footer = () => {
  return (
    <footer className="bg-dark-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-luxury-900/20 to-gold-900/20"></div>
      <div className="container mx-auto px-4 py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mt-12 ">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <img 
                src={amzLogo} 
                alt="AMZ Properties Logo" 
                className="w-16 h-16 rounded-xl filter drop-shadow-lg border border-gold-300/20 hover:scale-105 transition-all duration-300"
                style={{imageRendering: 'crisp-edges'}}
              />
              <div>
                <h3 className="text-2xl font-bold font-serif">AMZ Properties</h3>
                <p className="text-gold-400 text-sm font-medium tracking-wider">LUXURY REAL ESTATE</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
              Dubai's premier luxury real estate agency, specializing in exclusive properties 
              and exceptional service for discerning clients seeking the finest in luxury living.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-gray-300 hover:text-gold-400 hover:bg-white/20 transition-all duration-300 group">
                <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-gray-300 hover:text-gold-400 hover:bg-white/20 transition-all duration-300 group">
                <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001.012.001z"/>
                </svg>
              </a>
              <a href="#" className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-gray-300 hover:text-gold-400 hover:bg-white/20 transition-all duration-300 group">
                <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="#" className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-gray-300 hover:text-gold-400 hover:bg-white/20 transition-all duration-300 group">
                <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.40z"/>
                </svg>
              </a>
              <a href="https://github.com/amzproperties/amz-properties" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-gray-300 hover:text-gold-400 hover:bg-white/20 transition-all duration-300 group">
                <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xl font-bold mb-6 font-serif text-gold-400">Our Services</h4>
            <ul className="space-y-3">
              <li><Link to="/" className="text-gray-300 hover:text-gold-400 transition-colors duration-300 flex items-center group">
                <span className="w-2 h-2 bg-gold-500 rounded-full mr-3 group-hover:scale-125 transition-transform"></span>
                Luxury Property Sales
              </Link></li>
              <li><Link to="/properties" className="text-gray-300 hover:text-gold-400 transition-colors duration-300 flex items-center group">
                <span className="w-2 h-2 bg-gold-500 rounded-full mr-3 group-hover:scale-125 transition-transform"></span>
                Exclusive Listings
              </Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-gold-400 transition-colors duration-300 flex items-center group">
                <span className="w-2 h-2 bg-gold-500 rounded-full mr-3 group-hover:scale-125 transition-transform"></span>
                Investment Advisory
              </Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-gold-400 transition-colors duration-300 flex items-center group">
                <span className="w-2 h-2 bg-gold-500 rounded-full mr-3 group-hover:scale-125 transition-transform"></span>
                Property Management
              </Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xl font-bold mb-6 font-serif text-gold-400">Contact Us</h4>
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-center space-x-3 group">
                <div className="w-10 h-10 bg-luxury-600/20 rounded-lg flex items-center justify-center group-hover:bg-luxury-600/30 transition-colors">
                  <svg className="w-5 h-5 text-gold-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-white">Dubai Marina</div>
                  <div className="text-sm">United Arab Emirates</div>
                </div>
              </li>
              <li className="flex items-center space-x-3 group">
                <div className="w-10 h-10 bg-luxury-600/20 rounded-lg flex items-center justify-center group-hover:bg-luxury-600/30 transition-colors">
                  <svg className="w-5 h-5 text-gold-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-white">+971 50 123 4567</div>
                  <div className="text-sm">24/7 Support Available</div>
                </div>
              </li>
              <li className="flex items-center space-x-3 group">
                <div className="w-10 h-10 bg-luxury-600/20 rounded-lg flex items-center justify-center group-hover:bg-luxury-600/30 transition-colors">
                  <svg className="w-5 h-5 text-gold-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-white">info@amzproperties.ae</div>
                  <div className="text-sm">Get Expert Consultation</div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 mb-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; 2025 AMZ Properties. All rights reserved. | Luxury Real Estate Excellence
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-gray-400 hover:text-gold-400 text-sm transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="text-gray-400 hover:text-gold-400 text-sm transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer