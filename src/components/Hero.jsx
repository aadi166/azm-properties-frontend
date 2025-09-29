import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  
  const slides = [
    {
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
      title: 'Luxury Villas',
      subtitle: 'Emirates Hills & Palm Jumeirah',
      description: 'Exclusive collection of ultra-luxury villas in Dubai\'s most prestigious neighborhoods'
    },
    {
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
      title: 'Premium Penthouses',
      subtitle: 'Downtown Dubai & Marina',
      description: 'Breathtaking penthouses with panoramic city and ocean views'
    },
    {
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
      title: 'Waterfront Mansions',
      subtitle: 'Dubai Creek & Jumeirah Bay',
      description: 'Magnificent waterfront properties with private beach access'
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div 
            className="absolute inset-0 bg-cover bg-center transform scale-105"
            style={{
              backgroundImage: `url(${slide.image})`
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
        </div>
      ))}
      
      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            {/* Animated Content */}
            <div className="animate-fade-in">
              <span className="inline-block text-gold-400 font-medium tracking-wider uppercase text-sm mb-4 animate-slide-up">
                Dubai's Premier Real Estate
              </span>
              <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight font-serif animate-slide-up" style={{animationDelay: '0.2s'}}>
                <span className="text-white block">Discover</span>
                <span className="bg-gradient-to-r from-gold-400 via-gold-300 to-gold-500 bg-clip-text text-transparent block">
                  Luxury Living
                </span>
              </h1>
              <div className="mb-8 animate-slide-up" style={{animationDelay: '0.4s'}}>
                <h2 className="text-2xl md:text-3xl text-gold-300 font-serif mb-4">
                  {slides[currentSlide].title}
                </h2>
                <p className="text-xl text-white/90 mb-4">
                  {slides[currentSlide].subtitle}
                </p>
                <p className="text-lg text-white/80 max-w-2xl leading-relaxed">
                  {slides[currentSlide].description}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-6 mb-12 animate-slide-up" style={{animationDelay: '0.6s'}}>
                <Link to="/properties" className="btn-primary btn-lg group">
                  Explore Collection
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link to="/contact" className="btn-ghost btn-lg group">
                  Schedule Viewing
                  <svg className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </Link>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-fade-in" style={{animationDelay: '0.8s'}}>
              <div className="text-center">
                <div className="text-3xl font-bold text-gold-400 font-serif mb-2">500+</div>
                <div className="text-white/80 text-sm uppercase tracking-wider">Luxury Properties</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gold-400 font-serif mb-2">2.5B+</div>
                <div className="text-white/80 text-sm uppercase tracking-wider">AED in Sales</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gold-400 font-serif mb-2">98%</div>
                <div className="text-white/80 text-sm uppercase tracking-wider">Client Satisfaction</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gold-400 font-serif mb-2">15+</div>
                <div className="text-white/80 text-sm uppercase tracking-wider">Years Excellence</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-gold-400 w-8' 
                  : 'bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 right-8 z-20 animate-float">
        <div className="flex flex-col items-center text-white/70">
          <span className="text-xs uppercase tracking-wider mb-2 rotate-90 origin-center">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-white/70 to-transparent"></div>
        </div>
      </div>
    </section>
  )
}

export default Hero