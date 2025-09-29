// Static API service - returns static data instead of making HTTP requests
import { properties, blogs, partners, testimonials, contacts } from '../data/index.js';
import { projects } from '../data/projects.js';

// Global API configuration
const API_CONFIG = {
  BASE_URL: 'http://127.0.0.1:5000', // This is your domain/base URL
  ENDPOINTS: {
    LOGIN: '/api/users/login/web',
    BLOG_CREATE: '/api/blog/create',
    BLOG_READ: '/api/blog/read',
    TESTIMONIAL_CREATE: '/api/testimonial/create',
    TESTIMONIAL_READ: '/api/testimonial/read'
  }
};

// Simulate API delay for realistic behavior
const simulateDelay = (ms = 100) => new Promise(resolve => setTimeout(resolve, ms));

// Local storage keys for admin functionality
const STORAGE_KEYS = {
  PROPERTIES: 'amz_properties',
  PROJECTS: 'amz_projects',
  BLOGS: 'amz_blogs',
  PARTNERS: 'amz_partners',
  TESTIMONIALS: 'amz_testimonials',
  CONTACTS: 'amz_contacts',
  WISHLIST: 'amz_wishlist',
  ADMIN_TOKEN: 'adminToken'
};

// Initialize local storage with static data if not exists
const initializeLocalStorage = () => {
  console.log('🚀 Initializing localStorage...');
  console.log('📋 Imported properties:', properties);
  console.log('📊 Properties count:', properties ? properties.length : 0);
  
  if (!localStorage.getItem(STORAGE_KEYS.PROPERTIES)) {
    console.log('💾 Storing properties to localStorage...');
    localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(properties));
  } else {
    console.log('✅ Properties already exist in localStorage');
  }
  if (!localStorage.getItem(STORAGE_KEYS.PROJECTS)) {
    console.log('💾 Storing projects to localStorage...');
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  } else {
    console.log('✅ Projects already exist in localStorage');
  }
  if (!localStorage.getItem(STORAGE_KEYS.BLOGS)) {
    localStorage.setItem(STORAGE_KEYS.BLOGS, JSON.stringify(blogs));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PARTNERS)) {
    localStorage.setItem(STORAGE_KEYS.PARTNERS, JSON.stringify(partners));
  }
  if (!localStorage.getItem(STORAGE_KEYS.TESTIMONIALS)) {
    localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(testimonials));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CONTACTS)) {
    localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(contacts));
  }
  if (!localStorage.getItem(STORAGE_KEYS.WISHLIST)) {
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify([]));
  }
  
  console.log('✅ localStorage initialization complete');
};

// Helper functions for local storage operations
const getFromStorage = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
  }
};

const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

// Generate unique ID
const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

class StaticApiService {
  constructor() {
    initializeLocalStorage();
  }

  // Simulate API response format
  createResponse(data, success = true, message = '') {
    return {
      success,
      data,
      message,
      timestamp: new Date().toISOString()
    };
  }

  // Properties API methods
  async getProperties(filters = {}) {
    await simulateDelay();
    let propertiesData = getFromStorage(STORAGE_KEYS.PROPERTIES);
    
    console.log('🔍 getProperties called with filters:', filters);
    console.log('📦 Raw properties data from storage:', propertiesData);
    console.log('📊 Properties count:', propertiesData ? propertiesData.length : 0);
    
    // Apply filters
    if (filters.category && filters.category !== 'all') {
      propertiesData = propertiesData.filter(p => p.category === filters.category);
    }
    if (filters.location && filters.location !== 'all') {
      propertiesData = propertiesData.filter(p => p.location.toLowerCase().includes(filters.location.toLowerCase()));
    }
    if (filters.propertyType && filters.propertyType !== 'all') {
      propertiesData = propertiesData.filter(p => p.propertyType === filters.propertyType);
    }
    if (filters.minPrice) {
      propertiesData = propertiesData.filter(p => p.price >= parseInt(filters.minPrice));
    }
    if (filters.maxPrice) {
      propertiesData = propertiesData.filter(p => p.price <= parseInt(filters.maxPrice));
    }
    
    console.log('✅ Filtered properties data:', propertiesData);
    console.log('📈 Final count:', propertiesData ? propertiesData.length : 0);
    
    return this.createResponse(propertiesData);
  }

  async getPropertyById(id) {
    await simulateDelay();
    const propertiesData = getFromStorage(STORAGE_KEYS.PROPERTIES);
    const property = propertiesData.find(p => p._id === id || p.id === id);
    
    if (property) {
      return this.createResponse(property);
    } else {
      throw new Error('Property not found');
    }
  }

  async searchProperties(query) {
    await simulateDelay();
    const propertiesData = getFromStorage(STORAGE_KEYS.PROPERTIES);
    const searchResults = propertiesData.filter(p => 
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase()) ||
      p.location.toLowerCase().includes(query.toLowerCase())
    );
    
    return this.createResponse(searchResults);
  }

  async createProperty(propertyData) {
    await simulateDelay();
    const propertiesData = getFromStorage(STORAGE_KEYS.PROPERTIES);
    const newProperty = {
      ...propertyData,
      _id: generateId(),
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    propertiesData.push(newProperty);
    saveToStorage(STORAGE_KEYS.PROPERTIES, propertiesData);
    
    return this.createResponse(newProperty, true, 'Property created successfully');
  }

  async updateProperty(id, propertyData) {
    await simulateDelay();
    const propertiesData = getFromStorage(STORAGE_KEYS.PROPERTIES);
    const index = propertiesData.findIndex(p => p._id === id || p.id === id);
    
    if (index !== -1) {
      propertiesData[index] = {
        ...propertiesData[index],
        ...propertyData,
        updatedAt: new Date().toISOString()
      };
      saveToStorage(STORAGE_KEYS.PROPERTIES, propertiesData);
      return this.createResponse(propertiesData[index], true, 'Property updated successfully');
    } else {
      throw new Error('Property not found');
    }
  }

  async deleteProperty(id) {
    await simulateDelay();
    const propertiesData = getFromStorage(STORAGE_KEYS.PROPERTIES);
    const filteredProperties = propertiesData.filter(p => p._id !== id && p.id !== id);
    
    if (filteredProperties.length < propertiesData.length) {
      saveToStorage(STORAGE_KEYS.PROPERTIES, filteredProperties);
      return this.createResponse(null, true, 'Property deleted successfully');
    } else {
      throw new Error('Property not found');
    }
  }

  // Projects API methods
  async getProjects(filters = {}) {
    await simulateDelay();
    let projectsData = getFromStorage(STORAGE_KEYS.PROJECTS);
    
    console.log('🔍 getProjects called with filters:', filters);
    console.log('📦 Raw projects data from storage:', projectsData);
    console.log('📊 Projects count:', projectsData ? projectsData.length : 0);
    
    // Apply filters
    if (filters.status && filters.status !== 'all') {
      projectsData = projectsData.filter(p => p.status === filters.status);
    }
    if (filters.location && filters.location !== 'all') {
      projectsData = projectsData.filter(p => p.location.toLowerCase().includes(filters.location.toLowerCase()));
    }
    if (filters.developer && filters.developer !== 'all') {
      projectsData = projectsData.filter(p => p.developer.toLowerCase().includes(filters.developer.toLowerCase()));
    }
    if (filters.category && filters.category !== 'all') {
      projectsData = projectsData.filter(p => p.category === filters.category);
    }
    if (filters.minPrice) {
      projectsData = projectsData.filter(p => p.priceRange.min >= parseInt(filters.minPrice));
    }
    if (filters.maxPrice) {
      projectsData = projectsData.filter(p => p.priceRange.max <= parseInt(filters.maxPrice));
    }
    
    console.log('✅ Filtered projects data:', projectsData);
    console.log('📈 Final count:', projectsData ? projectsData.length : 0);
    
    return this.createResponse(projectsData);
  }

  async getProjectById(id) {
    await simulateDelay();
    const projectsData = getFromStorage(STORAGE_KEYS.PROJECTS);
    const project = projectsData.find(p => p._id === id || p.id === id);
    
    if (project) {
      return this.createResponse(project);
    } else {
      throw new Error('Project not found');
    }
  }

  async searchProjects(query) {
    await simulateDelay();
    const projectsData = getFromStorage(STORAGE_KEYS.PROJECTS);
    const searchResults = projectsData.filter(p => 
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase()) ||
      p.location.toLowerCase().includes(query.toLowerCase()) ||
      p.developer.toLowerCase().includes(query.toLowerCase())
    );
    
    return this.createResponse(searchResults);
  }

  async createProject(projectData) {
    await simulateDelay();
    const projectsData = getFromStorage(STORAGE_KEYS.PROJECTS);
    const newProject = {
      ...projectData,
      _id: generateId(),
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    projectsData.push(newProject);
    saveToStorage(STORAGE_KEYS.PROJECTS, projectsData);
    
    return this.createResponse(newProject, true, 'Project created successfully');
  }

  async updateProject(id, projectData) {
    await simulateDelay();
    const projectsData = getFromStorage(STORAGE_KEYS.PROJECTS);
    const index = projectsData.findIndex(p => p._id === id || p.id === id);
    
    if (index !== -1) {
      projectsData[index] = {
        ...projectsData[index],
        ...projectData,
        updatedAt: new Date().toISOString()
      };
      saveToStorage(STORAGE_KEYS.PROJECTS, projectsData);
      return this.createResponse(projectsData[index], true, 'Project updated successfully');
    } else {
      throw new Error('Project not found');
    }
  }

  async deleteProject(id) {
    await simulateDelay();
    const projectsData = getFromStorage(STORAGE_KEYS.PROJECTS);
    const filteredProjects = projectsData.filter(p => p._id !== id && p.id !== id);
    
    if (filteredProjects.length < projectsData.length) {
      saveToStorage(STORAGE_KEYS.PROJECTS, filteredProjects);
      return this.createResponse(null, true, 'Project deleted successfully');
    } else {
      throw new Error('Project not found');
    }
  }

  // Contact API methods
  async submitContactForm(formData) {
    await simulateDelay();
    const contactsData = getFromStorage(STORAGE_KEYS.CONTACTS);
    const newContact = {
      ...formData,
      _id: generateId(),
      id: generateId(),
      status: 'new',
      source: 'website',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    contactsData.push(newContact);
    saveToStorage(STORAGE_KEYS.CONTACTS, contactsData);
    
    return this.createResponse(newContact, true, 'Contact form submitted successfully');
  }

  async getContactSubmissions() {
    await simulateDelay();
    const contactsData = getFromStorage(STORAGE_KEYS.CONTACTS);
    return this.createResponse(contactsData);
  }

  async updateContact(id, contactData) {
    await simulateDelay();
    const contactsData = getFromStorage(STORAGE_KEYS.CONTACTS);
    const index = contactsData.findIndex(c => c._id === id || c.id === id);
    
    if (index !== -1) {
      contactsData[index] = {
        ...contactsData[index],
        ...contactData,
        updatedAt: new Date().toISOString()
      };
      saveToStorage(STORAGE_KEYS.CONTACTS, contactsData);
      return this.createResponse(contactsData[index], true, 'Contact updated successfully');
    } else {
      throw new Error('Contact not found');
    }
  }

  async updateContactStatus(id, status) {
    return this.updateContact(id, { status });
  }

  async deleteContact(id) {
    await simulateDelay();
    const contactsData = getFromStorage(STORAGE_KEYS.CONTACTS);
    const filteredContacts = contactsData.filter(c => c._id !== id && c.id !== id);
    
    if (filteredContacts.length < contactsData.length) {
      saveToStorage(STORAGE_KEYS.CONTACTS, filteredContacts);
      return this.createResponse(null, true, 'Contact deleted successfully');
    } else {
      throw new Error('Contact not found');
    }
  }

  // Blog API methods
  async getBlogs(filters = {}) {
    // Try to get blogs from real API first
    try {
      const apiResult = await this.getBlogsFromAPI(filters);
      if (apiResult.success && apiResult.blogs) {
        console.log('Successfully fetched blogs from API:', apiResult.blogs.length);
        return apiResult;
      }
    } catch (error) {
      console.warn('Real API failed:', error.message);
      // If it's an authentication error, don't fallback to local storage
      if (error.message.includes('access token') || error.message.includes('Unauthenticated')) {
        throw error;
      }
    }

    // Only fallback to local storage for non-auth errors
    console.log('Falling back to local storage...');
    await simulateDelay();
    let blogsData = getFromStorage(STORAGE_KEYS.BLOGS);
    
    // Ensure blogsData is an array
    if (!Array.isArray(blogsData)) {
      console.warn('Blogs data is not an array, initializing empty array');
      blogsData = [];
      saveToStorage(STORAGE_KEYS.BLOGS, blogsData);
    }
    
    // Ensure each blog has required properties
    blogsData = blogsData.map(blog => ({
      _id: blog._id || blog.id || 'unknown',
      id: blog.id || blog._id || 'unknown',
      title: blog.title || 'Untitled',
      content: blog.content || 'No content available',
      category: blog.category || 'Uncategorized',
      tags: blog.tags || [],
      image: blog.image || null,
      published: blog.published !== false, // Default to true if undefined
      createdAt: blog.createdAt || new Date().toISOString(),
      updatedAt: blog.updatedAt || new Date().toISOString(),
      ...blog
    }));
    
    // Apply filters
    if (filters.category && filters.category !== 'all') {
      blogsData = blogsData.filter(b => b.category === filters.category);
    }
    if (filters.limit) {
      blogsData = blogsData.slice(0, parseInt(filters.limit));
    }
    
    console.log('Returning blogs data from local storage:', blogsData.length); // Debug log
    return { blogs: blogsData, success: true };
  }

  async getBlogById(id) {
    await simulateDelay();
    const blogsData = getFromStorage(STORAGE_KEYS.BLOGS);
    const blog = blogsData.find(b => b._id === id || b.id === id);
    
    if (blog) {
      return this.createResponse(blog);
    } else {
      throw new Error('Blog not found');
    }
  }

  async getBlogBySlug(slug) {
    await simulateDelay();
    const blogsData = getFromStorage(STORAGE_KEYS.BLOGS);
    const blog = blogsData.find(b => b.slug === slug);
    
    if (blog) {
      return this.createResponse(blog);
    } else {
      throw new Error('Blog not found');
    }
  }

  async createBlog(blogData) {
    await simulateDelay();
    const blogsData = getFromStorage(STORAGE_KEYS.BLOGS);
    
    // Process tags if they're provided as a string
    let processedTags = [];
    if (blogData.tags) {
      if (typeof blogData.tags === 'string') {
        processedTags = blogData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      } else if (Array.isArray(blogData.tags)) {
        processedTags = blogData.tags;
      }
    }
    
    const newBlog = {
      ...blogData,
      _id: generateId(),
      id: generateId(),
      tags: processedTags,
      published: blogData.published !== false, // Default to true if undefined
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    blogsData.push(newBlog);
    saveToStorage(STORAGE_KEYS.BLOGS, blogsData);
    
    return this.createResponse(newBlog, true, 'Blog created successfully');
  }

  async updateBlog(id, blogData) {
    await simulateDelay();
    const blogsData = getFromStorage(STORAGE_KEYS.BLOGS);
    console.log('Updating blog:', { id, blogData, totalBlogs: blogsData.length });
    
    const index = blogsData.findIndex(b => b._id === id || b.id === id);
    console.log('Found blog at index:', index);
    
    if (index !== -1) {
      // Process tags if they're provided as a string
      let processedData = { ...blogData };
      if (blogData.tags) {
        if (typeof blogData.tags === 'string') {
          processedData.tags = blogData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
        } else if (Array.isArray(blogData.tags)) {
          processedData.tags = blogData.tags;
        }
      }
      
      const updatedBlog = {
        ...blogsData[index],
        ...processedData,
        updatedAt: new Date().toISOString()
      };
      
      blogsData[index] = updatedBlog;
      console.log('Updated blog:', updatedBlog);
      saveToStorage(STORAGE_KEYS.BLOGS, blogsData);
      return this.createResponse(updatedBlog, true, 'Blog updated successfully');
    } else {
      console.error('Blog not found with id:', id, 'Available blogs:', blogsData.map(b => ({ id: b.id, _id: b._id, title: b.title })));
      throw new Error('Blog not found');
    }
  }

  async deleteBlog(id) {
    await simulateDelay();
    const blogsData = getFromStorage(STORAGE_KEYS.BLOGS);
    const filteredBlogs = blogsData.filter(b => b._id !== id && b.id !== id);
    
    if (filteredBlogs.length < blogsData.length) {
      saveToStorage(STORAGE_KEYS.BLOGS, filteredBlogs);
      return this.createResponse(null, true, 'Blog deleted successfully');
    } else {
      throw new Error('Blog not found');
    }
  }

  // Partners API methods (Legacy)
  async getPartners(filters = {}) {
    await simulateDelay();
    let partnersData = getFromStorage(STORAGE_KEYS.PARTNERS);
    
    // Apply filters
    if (filters.status && filters.status !== 'all') {
      partnersData = partnersData.filter(p => p.status === filters.status);
    }
    if (filters.limit) {
      partnersData = partnersData.slice(0, parseInt(filters.limit));
    }
    
    return { partners: partnersData, success: true };
  }

  async getPartnerById(id) {
    await simulateDelay();
    const partnersData = getFromStorage(STORAGE_KEYS.PARTNERS);
    const partner = partnersData.find(p => p._id === id || p.id === id);
    
    if (partner) {
      return this.createResponse(partner);
    } else {
      throw new Error('Partner not found');
    }
  }

  async createPartner(partnerData) {
    await simulateDelay();
    const partnersData = getFromStorage(STORAGE_KEYS.PARTNERS);
    const newPartner = {
      ...partnerData,
      _id: generateId(),
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    partnersData.push(newPartner);
    saveToStorage(STORAGE_KEYS.PARTNERS, partnersData);
    
    return this.createResponse(newPartner, true, 'Partner created successfully');
  }

  async updatePartner(id, partnerData) {
    await simulateDelay();
    const partnersData = getFromStorage(STORAGE_KEYS.PARTNERS);
    const index = partnersData.findIndex(p => p._id === id || p.id === id);
    
    if (index !== -1) {
      partnersData[index] = {
        ...partnersData[index],
        ...partnerData,
        updatedAt: new Date().toISOString()
      };
      saveToStorage(STORAGE_KEYS.PARTNERS, partnersData);
      return this.createResponse(partnersData[index], true, 'Partner updated successfully');
    } else {
      throw new Error('Partner not found');
    }
  }

  async deletePartner(id) {
    await simulateDelay();
    const partnersData = getFromStorage(STORAGE_KEYS.PARTNERS);
    const filteredPartners = partnersData.filter(p => p._id !== id && p.id !== id);
    
    if (filteredPartners.length < partnersData.length) {
      saveToStorage(STORAGE_KEYS.PARTNERS, filteredPartners);
      return this.createResponse(null, true, 'Partner deleted successfully');
    } else {
      throw new Error('Partner not found');
    }
  }

  // Developers API methods (New)
  async getDevelopers(filters = {}) {
    await simulateDelay();
    let developersData = getFromStorage(STORAGE_KEYS.PARTNERS); // Using same storage for now
    
    // Apply filters
    if (filters.status && filters.status !== 'all') {
      developersData = developersData.filter(p => p.status === filters.status);
    }
    if (filters.limit) {
      developersData = developersData.slice(0, parseInt(filters.limit));
    }
    
    return { data: developersData, success: true };
  }

  async getDeveloperById(id) {
    await simulateDelay();
    const developersData = getFromStorage(STORAGE_KEYS.PARTNERS); // Using same storage for now
    const developer = developersData.find(p => p._id === id || p.id === id);
    
    if (developer) {
      return this.createResponse(developer);
    } else {
      throw new Error('Developer not found');
    }
  }

  async createDeveloper(developerData) {
    await simulateDelay();
    const developersData = getFromStorage(STORAGE_KEYS.PARTNERS); // Using same storage for now
    
    // Handle FormData
    let data = {};
    if (developerData instanceof FormData) {
      for (let [key, value] of developerData.entries()) {
        if (key === 'projects_count' || key === 'contact_info') {
          try {
            data[key] = JSON.parse(value);
          } catch (e) {
            data[key] = value;
          }
        } else if (key.startsWith('logo') || key.startsWith('cover_image') || key.startsWith('image')) {
          // Handle file uploads - in real implementation, these would be uploaded to a server
          if (value instanceof File) {
            data[key] = URL.createObjectURL(value);
          }
        } else {
          data[key] = value;
        }
      }
    } else {
      data = developerData;
    }

    const newDeveloper = {
      ...data,
      _id: generateId(),
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    developersData.push(newDeveloper);
    saveToStorage(STORAGE_KEYS.PARTNERS, developersData);
    
    return this.createResponse(newDeveloper, true, 'Developer created successfully');
  }

  async updateDeveloper(id, developerData) {
    await simulateDelay();
    const developersData = getFromStorage(STORAGE_KEYS.PARTNERS); // Using same storage for now
    const index = developersData.findIndex(p => p._id === id || p.id === id);
    
    if (index !== -1) {
      // Handle FormData
      let data = {};
      if (developerData instanceof FormData) {
        for (let [key, value] of developerData.entries()) {
          if (key === 'projects_count' || key === 'contact_info') {
            try {
              data[key] = JSON.parse(value);
            } catch (e) {
              data[key] = value;
            }
          } else if (key.startsWith('logo') || key.startsWith('cover_image') || key.startsWith('image')) {
            // Handle file uploads
            if (value instanceof File) {
              data[key] = URL.createObjectURL(value);
            }
          } else {
            data[key] = value;
          }
        }
      } else {
        data = developerData;
      }

      developersData[index] = {
        ...developersData[index],
        ...data,
        updatedAt: new Date().toISOString()
      };
      saveToStorage(STORAGE_KEYS.PARTNERS, developersData);
      return this.createResponse(developersData[index], true, 'Developer updated successfully');
    } else {
      throw new Error('Developer not found');
    }
  }

  async deleteDeveloper(id) {
    await simulateDelay();
    const developersData = getFromStorage(STORAGE_KEYS.PARTNERS); // Using same storage for now
    const filteredDevelopers = developersData.filter(p => p._id !== id && p.id !== id);
    
    if (filteredDevelopers.length < developersData.length) {
      saveToStorage(STORAGE_KEYS.PARTNERS, filteredDevelopers);
      return this.createResponse(null, true, 'Developer deleted successfully');
    } else {
      throw new Error('Developer not found');
    }
  }

  // Testimonials API methods
  async getTestimonials(filters = {}) {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN);
      if (!token) {
        console.warn('No admin token found, using localStorage fallback');
        // Fallback to localStorage
        await simulateDelay();
        let testimonialsData = getFromStorage(STORAGE_KEYS.TESTIMONIALS);
        
        // Apply filters
        if (filters.published !== undefined) {
          testimonialsData = testimonialsData.filter(t => t.published === filters.published);
        }
        if (filters.limit) {
          testimonialsData = testimonialsData.slice(0, parseInt(filters.limit));
        }
        
        return { testimonials: testimonialsData, success: true };
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TESTIMONIAL_READ}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      console.log('API Response for getTestimonials:', data);

      if (response.ok && data.response_code === 200) {
        // Transform API response to match expected format
        let testimonials = [];
        if (data.response_data && Array.isArray(data.response_data)) {
          testimonials = data.response_data.map(testimonial => ({
            _id: testimonial.id,
            id: testimonial.testimonial_id,
            name: testimonial.name,
            email: testimonial.email,
            comments: testimonial.comments,
            designation: testimonial.designation,
            image: testimonial.image,
            image_url: testimonial.image_url,
            published: testimonial.published !== false, // Default to true if not specified
            createdAt: new Date(testimonial.created_on).toISOString(),
            updatedAt: new Date(testimonial.updated_on).toISOString()
          }));
        }

        // Apply filters
        if (filters.published !== undefined) {
          testimonials = testimonials.filter(t => t.published === filters.published);
        }
        if (filters.limit) {
          testimonials = testimonials.slice(0, parseInt(filters.limit));
        }

        return { testimonials, success: true };
      } else {
        console.warn('API request failed, using localStorage fallback');
        // Fallback to localStorage
        await simulateDelay();
        let testimonialsData = getFromStorage(STORAGE_KEYS.TESTIMONIALS);
        
        // Apply filters
        if (filters.published !== undefined) {
          testimonialsData = testimonialsData.filter(t => t.published === filters.published);
        }
        if (filters.limit) {
          testimonialsData = testimonialsData.slice(0, parseInt(filters.limit));
        }
        
        return { testimonials: testimonialsData, success: true };
      }
    } catch (error) {
      console.error('Error fetching testimonials from API:', error);
      // Fallback to localStorage
      await simulateDelay();
      let testimonialsData = getFromStorage(STORAGE_KEYS.TESTIMONIALS);
      
      // Apply filters
      if (filters.published !== undefined) {
        testimonialsData = testimonialsData.filter(t => t.published === filters.published);
      }
      if (filters.limit) {
        testimonialsData = testimonialsData.slice(0, parseInt(filters.limit));
      }
      
      return { testimonials: testimonialsData, success: true };
    }
  }

  async createTestimonial(testimonialData) {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN);
      if (!token) {
        console.warn('No admin token found, using localStorage fallback');
        // Fallback to localStorage
        await simulateDelay();
        const testimonialsData = getFromStorage(STORAGE_KEYS.TESTIMONIALS);
        
        // Handle FormData
        let data = {};
        if (testimonialData instanceof FormData) {
          for (let [key, value] of testimonialData.entries()) {
            if (key === 'published') {
              data[key] = value === 'true';
            } else if (key === 'image') {
              // For now, just store the file name or create a mock URL
              data[key] = value ? URL.createObjectURL(value) : null;
            } else {
              data[key] = value;
            }
          }
        } else {
          data = testimonialData;
        }

        const newTestimonial = {
          ...data,
          _id: generateId(),
          id: generateId(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        testimonialsData.unshift(newTestimonial);
        saveToStorage(STORAGE_KEYS.TESTIMONIALS, testimonialsData);
        
        return this.createResponse(newTestimonial, true, 'Testimonial created successfully');
      }

      // Prepare FormData for API request
      let formData = testimonialData;
      if (!(testimonialData instanceof FormData)) {
        formData = new FormData();
        Object.keys(testimonialData).forEach(key => {
          formData.append(key, testimonialData[key]);
        });
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TESTIMONIAL_CREATE}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // Don't set Content-Type for FormData, let the browser set it
        },
        body: formData
      });

      const data = await response.json();
      console.log('API Response for createTestimonial:', data);

      if (response.ok && data.response_code === 200) {
        // Transform API response to match expected format
        const testimonial = {
          _id: data.response_data.id,
          id: data.response_data.testimonial_id,
          name: data.response_data.name,
          email: data.response_data.email,
          comments: data.response_data.comments,
          designation: data.response_data.designation,
          image: data.response_data.image,
          image_url: data.response_data.image_url,
          published: true, // Newly created testimonials are published by default
          createdAt: new Date(data.response_data.created_on).toISOString(),
          updatedAt: new Date(data.response_data.updated_on).toISOString()
        };

        return this.createResponse(testimonial, true, 'Testimonial created successfully');
      } else {
        console.error('API request failed:', data);
        return this.createResponse(null, false, data.response_message || 'Failed to create testimonial');
      }
    } catch (error) {
      console.error('Error creating testimonial:', error);
      return this.createResponse(null, false, 'Network error while creating testimonial');
    }
  }

  async updateTestimonial(id, testimonialData) {
    // Note: No specific update API endpoint provided, using localStorage for now
    // TODO: Implement real API call when endpoint is available
    console.log('Updating testimonial with localStorage (API endpoint not implemented):', id, testimonialData);
    
    await simulateDelay();
    const testimonialsData = getFromStorage(STORAGE_KEYS.TESTIMONIALS);
    const index = testimonialsData.findIndex(t => t._id === id || t.id === id);
    
    if (index !== -1) {
      // Handle FormData
      let data = {};
      if (testimonialData instanceof FormData) {
        for (let [key, value] of testimonialData.entries()) {
          if (key === 'published') {
            data[key] = value === 'true';
          } else if (key === 'image' && value) {
            data[key] = URL.createObjectURL(value);
          } else if (key !== 'image') {
            data[key] = value;
          }
        }
      } else {
        data = testimonialData;
      }

      testimonialsData[index] = {
        ...testimonialsData[index],
        ...data,
        updatedAt: new Date().toISOString()
      };
      saveToStorage(STORAGE_KEYS.TESTIMONIALS, testimonialsData);
      return this.createResponse(testimonialsData[index], true, 'Testimonial updated successfully');
    } else {
      throw new Error('Testimonial not found');
    }
  }

  async deleteTestimonial(id) {
    // Note: No specific delete API endpoint provided, using localStorage for now
    // TODO: Implement real API call when endpoint is available
    console.log('Deleting testimonial with localStorage (API endpoint not implemented):', id);
    
    await simulateDelay();
    const testimonialsData = getFromStorage(STORAGE_KEYS.TESTIMONIALS);
    const filteredTestimonials = testimonialsData.filter(t => t._id !== id && t.id !== id);
    
    if (filteredTestimonials.length < testimonialsData.length) {
      saveToStorage(STORAGE_KEYS.TESTIMONIALS, filteredTestimonials);
      return this.createResponse(null, true, 'Testimonial deleted successfully');
    } else {
      throw new Error('Testimonial not found');
    }
  }

  // Wishlist API methods
  async getWishlist() {
    await simulateDelay();
    const wishlistData = getFromStorage(STORAGE_KEYS.WISHLIST);
    return this.createResponse(wishlistData);
  }

  async addToWishlist(propertyId, userNote = '') {
    await simulateDelay();
    const wishlistData = getFromStorage(STORAGE_KEYS.WISHLIST);
    const propertiesData = getFromStorage(STORAGE_KEYS.PROPERTIES);
    
    const property = propertiesData.find(p => p._id === propertyId || p.id === propertyId);
    if (!property) {
      throw new Error('Property not found');
    }
    
    const existingItem = wishlistData.find(item => item.propertyId === propertyId);
    if (existingItem) {
      throw new Error('Property already in wishlist');
    }
    
    const newWishlistItem = {
      _id: generateId(),
      propertyId,
      property,
      userNote,
      createdAt: new Date().toISOString()
    };
    
    wishlistData.push(newWishlistItem);
    saveToStorage(STORAGE_KEYS.WISHLIST, wishlistData);
    
    return this.createResponse(newWishlistItem, true, 'Property added to wishlist');
  }

  async removeFromWishlist(propertyId) {
    await simulateDelay();
    const wishlistData = getFromStorage(STORAGE_KEYS.WISHLIST);
    const filteredWishlist = wishlistData.filter(item => item.propertyId !== propertyId);
    
    if (filteredWishlist.length < wishlistData.length) {
      saveToStorage(STORAGE_KEYS.WISHLIST, filteredWishlist);
      return this.createResponse(null, true, 'Property removed from wishlist');
    } else {
      throw new Error('Property not found in wishlist');
    }
  }

  async checkWishlistStatus(propertyId) {
    await simulateDelay();
    const wishlistData = getFromStorage(STORAGE_KEYS.WISHLIST);
    const isInWishlist = wishlistData.some(item => item.propertyId === propertyId);
    return this.createResponse({ isInWishlist });
  }

  async updateWishlistNote(propertyId, userNote) {
    await simulateDelay();
    const wishlistData = getFromStorage(STORAGE_KEYS.WISHLIST);
    const index = wishlistData.findIndex(item => item.propertyId === propertyId);
    
    if (index !== -1) {
      wishlistData[index].userNote = userNote;
      saveToStorage(STORAGE_KEYS.WISHLIST, wishlistData);
      return this.createResponse(wishlistData[index], true, 'Wishlist note updated');
    } else {
      throw new Error('Property not found in wishlist');
    }
  }

  async getAdminWishlist() {
    return this.getWishlist();
  }

  async deleteWishlistItem(itemId) {
    await simulateDelay();
    const wishlistData = getFromStorage(STORAGE_KEYS.WISHLIST);
    const filteredWishlist = wishlistData.filter(item => item._id !== itemId);
    
    if (filteredWishlist.length < wishlistData.length) {
      saveToStorage(STORAGE_KEYS.WISHLIST, filteredWishlist);
      return this.createResponse(null, true, 'Wishlist item deleted');
    } else {
      throw new Error('Wishlist item not found');
    }
  }

  async updateWishlistItemNote(itemId, userNote) {
    await simulateDelay();
    const wishlistData = getFromStorage(STORAGE_KEYS.WISHLIST);
    const index = wishlistData.findIndex(item => item._id === itemId);
    
    if (index !== -1) {
      wishlistData[index].userNote = userNote;
      saveToStorage(STORAGE_KEYS.WISHLIST, wishlistData);
      return this.createResponse(wishlistData[index], true, 'Wishlist note updated');
    } else {
      throw new Error('Wishlist item not found');
    }
  }

  // Admin authentication
  async adminLogin(credentials) {
    await simulateDelay();
    // Simple static authentication - in a real app, this would be more secure
    if (credentials.username === 'admin' && credentials.password === 'admin123') {
      const token = 'static-admin-token-' + Date.now();
      localStorage.setItem(STORAGE_KEYS.ADMIN_TOKEN, token);
      return this.createResponse({ token, user: { username: 'admin', role: 'admin' } }, true, 'Login successful');
    } else {
      throw new Error('Invalid credentials');
    }
  }

  // Real API login function for backend integration
  async realAdminLogin(credentials) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LOGIN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email_address: credentials.email,
          password: credentials.password
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.response_code === 200) {
        // Store the access token in localStorage for API calls
        const accessToken = data.response_data.access_token;
        localStorage.setItem('adminToken', accessToken);
        localStorage.setItem('adminUser', JSON.stringify(data.response_data.user));
        
        // Also store it separately for easy access
        localStorage.setItem('accessToken', accessToken);
        
        console.log('Login successful, token stored:', accessToken);
        
        return {
          success: true,
          token: accessToken,
          admin: data.response_data.user,
          message: data.response_message
        };
      } else {
        throw new Error(data.response_message || 'Login failed');
      }
    } catch (error) {
      console.error('Login API error:', error);
      throw new Error(error.message || 'Network error occurred');
    }
  }

  // Real API blog creation function for backend integration
  async createBlogWithAPI(blogData) {
    try {
      // Use BASE_URL + endpoint
      const endpoint = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.BLOG_CREATE}`;
      
      // Get access token for authentication
      const accessToken = localStorage.getItem('accessToken') || localStorage.getItem('adminToken');
      
      if (!accessToken) {
        throw new Error('No access token found. Please login first.');
      }
      
      // Create FormData object
      const formData = new FormData();
      
      // Add ALL required fields to FormData - ensure none are empty
      const title = blogData.title && blogData.title.trim();
      const content = blogData.content && blogData.content.trim();
      const category = blogData.category && blogData.category.trim();
      
      if (!title || !content || !category) {
        throw new Error('Missing required fields: title, content, and category are required');
      }
      
      formData.append('title', title);
      formData.append('content', content);
      formData.append('category', category);
      
      // Handle tags - convert to string format as expected by API
      if (blogData.tags) {
        let tagsString = '';
        if (typeof blogData.tags === 'string') {
          tagsString = blogData.tags.trim();
        } else if (Array.isArray(blogData.tags)) {
          tagsString = blogData.tags.filter(tag => tag && tag.trim()).join(',');
        }
        
        if (tagsString) {
          formData.append('tags', tagsString);
        } else {
          // Add empty tags if none provided to avoid missing parameter error
          formData.append('tags', '');
        }
      } else {
        formData.append('tags', '');
      }
      
      // Handle image file - required by API
      if (blogData.image && blogData.image instanceof File) {
        formData.append('image', blogData.image);
      } else {
        // If no image provided, we might need to handle this case
        // For now, let's see if the API accepts no image
        console.warn('No image file provided for blog creation');
      }

      // Debug: Log what we're sending
      console.log('Sending blog data:', {
        title: title,
        content: content ? content.substring(0, 50) + '...' : 'No content',
        category: category,
        tags: formData.get('tags'),
        hasImage: !!blogData.image,
        accessToken: accessToken ? 'Present' : 'Missing'
      });

      // Make the API call - DON'T set Content-Type header when using FormData
      // The browser will set it automatically with the correct boundary
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'x-session-key': accessToken
        },
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Blog creation API Response:', data);

      if (data.response_code === 200) {
        return {
          success: true,
          data: data.response_data,
          message: data.response_message
        };
      } else {
        throw new Error(data.response_message || 'Blog creation failed');
      }
    } catch (error) {
      console.error('Create blog API error:', error);
      throw new Error(error.message || 'Network error occurred');
    }
  }

  // Real API blog reading function for backend integration
  async getBlogsFromAPI(filters = {}) {
    try {
      // Use BASE_URL + endpoint
      const endpoint = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.BLOG_READ}`;
      
      // Get access token for authentication
      const accessToken = localStorage.getItem('accessToken') || localStorage.getItem('adminToken');
      
      if (!accessToken) {
        throw new Error('No access token found. Please login first.');
      }

      console.log('Fetching blogs with access token:', accessToken ? 'Present' : 'Missing');

      // Make the API call
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-session-key': accessToken
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Fetch blogs API Response:', data);

      if (data.response_code === 200) {
        let blogs = data.response_data || [];
        
        // Transform the API response to match our internal structure
        blogs = blogs.map(blog => ({
          _id: blog.id,
          id: blog.id,
          blog_id: blog.blog_id,
          title: blog.title,
          content: blog.content,
          category: blog.category,
          tags: blog.tags || [],
          image: blog.image,
          image_url: blog.image_url,
          createdAt: blog.created_on ? new Date(blog.created_on).toISOString() : new Date().toISOString(),
          updatedAt: blog.updated_on ? new Date(blog.updated_on).toISOString() : new Date().toISOString()
        }));

        // Apply filters
        if (filters.category && filters.category !== 'all') {
          blogs = blogs.filter(b => b.category === filters.category);
        }
        if (filters.limit) {
          blogs = blogs.slice(0, parseInt(filters.limit));
        }

        return {
          success: true,
          blogs: blogs,
          message: data.response_message
        };
      } else {
        throw new Error(data.response_message || 'Failed to fetch blogs');
      }
    } catch (error) {
      console.error('Fetch blogs API error:', error);
      throw new Error(error.message || 'Network error occurred');
    }
  }

  // Health check
  async healthCheck() {
    await simulateDelay();
    return this.createResponse({ status: 'healthy', mode: 'static' }, true, 'Static API service is running');
  }

  // Legacy method aliases for backward compatibility
  async getPosts(filters = {}) {
    return this.getBlogs(filters);
  }

  async getPostBySlug(slug) {
    return this.getBlogBySlug(slug);
  }

  async getAdminPosts(filters = {}) {
    return this.getBlogs(filters);
  }

  async createPost(postData) {
    return this.createBlog(postData);
  }

  async updatePost(id, postData) {
    return this.updateBlog(id, postData);
  }

  async deletePost(id) {
    return this.deleteBlog(id);
  }

  async getPostForEdit(id) {
    return this.getBlogById(id);
  }
}

const apiService = new StaticApiService();
export default apiService;
export { apiService };

// Export individual methods for backward compatibility
export const {
  getProperties,
  getPropertyById,
  searchProperties,
  createProperty,
  updateProperty,
  deleteProperty,
  submitContactForm,
  getContactSubmissions,
  getPosts,
  getPostBySlug,
  getAdminPosts,
  createPost,
  updatePost,
  deletePost,
  getPostForEdit,
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  getPartners,
  getPartnerById,
  createPartner,
  updatePartner,
  deletePartner,
  getDevelopers,
  getDeveloperById,
  createDeveloper,
  updateDeveloper,
  deleteDeveloper,
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlistStatus,
  updateWishlistNote,
  getAdminWishlist,
  deleteWishlistItem,
  updateWishlistItemNote,
  healthCheck,
  adminLogin
} = apiService;