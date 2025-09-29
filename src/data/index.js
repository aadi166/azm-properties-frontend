// Central export file for all static data
export { default as properties } from './properties.js';
export { default as blogs } from './blogs.js';
export { default as partners } from './partners.js';
export { default as testimonials } from './testimonials.js';
export { default as contacts } from './contacts.js';

// Helper functions for data manipulation
export const getPropertyById = (id) => {
  const { properties } = require('./properties.js');
  return properties.find(property => property._id === id || property.id === id);
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
  const { properties } = require('./properties.js');
  return properties.filter(property => property.category === category);
};

export const getFeaturedProperties = () => {
  const { properties } = require('./properties.js');
  return properties.filter(property => property.featured === true);
};