// Central export file for all static data

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