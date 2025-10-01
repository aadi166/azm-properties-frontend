// Central export file for all static data
export { default as blogs } from './blogs.js';
export { default as partners } from './partners.js';
export { default as testimonials } from './testimonials.js';
export { default as contacts } from './contacts.js';

// Helper functions for data manipulation
export const getPropertyById = (id) => {
  try {
    // attempt to load static properties if present
    // use require to avoid bundling if file is removed
    // if not available, return null
    // eslint-disable-next-line import/no-dynamic-require, global-require
    const mod = require('./properties.js');
    const properties = mod && (mod.default || mod.properties || mod)
    if (Array.isArray(properties)) {
      return properties.find(property => property._id === id || property.id === id) || null
    }
  } catch (e) {
    // properties.js not present or failed to load
  }
  return null
};

export const getBlogBySlug = (slug) => {
  const { blogs } = require('./blogs.js');
  return blogs.find(blog => blog.slug === slug);
};

export const getBlogById = (id) => {
  const { blogs } = require('./blogs.js');
  return blogs.find(blog => blog._id === id || blog.id === id);
};

export const getPartnerById = (id) => {
  const { partners } = require('./partners.js');
  return partners.find(partner => partner._id === id || partner.id === id);
};

export const getPublishedTestimonials = () => {
  const { testimonials } = require('./testimonials.js');
  return testimonials.filter(testimonial => testimonial.published === true);
};

export const getPublishedBlogs = () => {
  const { blogs } = require('./blogs.js');
  return blogs.filter(blog => blog.status === 'published');
};

export const getActivePartners = () => {
  const { partners } = require('./partners.js');
  return partners.filter(partner => partner.status === 'active');
};

export const getPropertiesByCategory = (category) => {
  try {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    const mod = require('./properties.js');
    const properties = mod && (mod.default || mod.properties || mod)
    if (Array.isArray(properties)) return properties.filter(property => property.category === category)
  } catch (e) {
    // missing static properties
  }
  return []
};

export const getFeaturedProperties = () => {
  try {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    const mod = require('./properties.js');
    const properties = mod && (mod.default || mod.properties || mod)
    if (Array.isArray(properties)) return properties.filter(property => property.featured === true)
  } catch (e) {
    // missing static properties
  }
  return []
};