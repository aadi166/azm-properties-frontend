// Static API service - returns static data instead of making HTTP requests

// Global API configuration
const API_CONFIG = {
  BASE_URL: 'http://127.0.0.1:5000', // This is your domain/base URL
  ENDPOINTS: {
    LOGIN: '/api/users/login/web',
    BLOG_CREATE: '/api/blog/create',
    BLOG_READ: '/api/blog/read',
    PROPERTY_READ: '/api/property/read',
    PROPERTY_CREATE: '/api/property/create',
    PROPERTY_DELETE: '/api/property/delete',
    TESTIMONIAL_CREATE: '/api/testimonial/create',
    TESTIMONIAL_READ: '/api/testimonial/read',
    TESTIMONIAL_DELETE: '/api/testimonial/delete',
    DEVELOPER_CREATE: '/api/developer/create',
    DEVELOPER_DELETE: '/api/developer/delete',
    PROJECT_READ: '/api/project/read',
    PROJECT_CREATE: '/api/project/create',
    PROJECT_DELETE: '/api/project/delete',
    DEVELOPER_READ: '/api/developer/read',
    CONTACT_CREATE: '/api/contact/create',
    CONTACT_READ: '/api/contact/read',
    CONTACT_DELETE: '/api/contact/delete'
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
  
  if (!localStorage.getItem(STORAGE_KEYS.PROPERTIES)) {
    // Do NOT seed properties from static data; prefer API-backed properties only
    console.log('ℹ️ Skipping seeding properties to localStorage to ensure dynamic backend data is used');
  } else {
    console.log('✅ Properties already exist in localStorage');
  }
  if (!localStorage.getItem(STORAGE_KEYS.PROJECTS)) {
    // Intentionally not seeding projects from static data to force API usage
    console.log('ℹ️ Skipping seeding projects to localStorage to prefer API-backed data');
  } else {
    console.log('✅ Projects already exist in localStorage');
  }
  if (!localStorage.getItem(STORAGE_KEYS.BLOGS)) {
    console.log('ℹ️ Skipping seeding blogs to localStorage to prefer API-backed data');
  }
  // Do not seed partners (developers) into localStorage - prefer API-backed developers
  if (!localStorage.getItem(STORAGE_KEYS.PARTNERS)) {
    console.log('ℹ️ Skipping seeding partners to localStorage to prefer API-backed data');
  }
  if (!localStorage.getItem(STORAGE_KEYS.TESTIMONIALS)) {
    console.log('ℹ️ Skipping seeding testimonials to localStorage to prefer API-backed data');
  }
  if (!localStorage.getItem(STORAGE_KEYS.CONTACTS)) {
    console.log('ℹ️ Skipping seeding contacts to localStorage to prefer API-backed data');
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
    // Allow public property reads. If an admin token exists, include it; otherwise call public endpoint without auth.
    const token = localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN) || localStorage.getItem('accessToken');

    try {
      // Build GET endpoint and append filters as query string (no body)
      const qs = (filters && Object.keys(filters).length) ? `?${new URLSearchParams(filters).toString()}` : '';
      const endpoint = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PROPERTY_READ}${qs}`;
      const headers = { 'Accept': 'application/json' };
      if (token) headers['x-session-key'] = token;

      const resp = await fetch(endpoint, {
        method: 'GET',
        headers
      });

      if (!resp.ok) {
        const text = await resp.text().catch(() => null);
        throw new Error(`HTTP ${resp.status} - ${text}`);
      }

      const result = await resp.json().catch(() => null);
      const raw = (result && (result.response_data || result.data || result.properties)) || [];
      const items = Array.isArray(raw) ? raw : [];

      const normalized = items.map(p => ({
        _id: p.id || p._id,
        id: p.id || p._id,
        title: p.title || p.name || '',
        description: p.description || p.desc || '',
        price: p.price || p.amount || 0,
        location: p.location || p.address || '',
        image: p.image || (p.images && p.images[0]) || null,
        type: p.type || p.property_type || p.propertyType || 'exclusive',
        bedrooms: p.bedrooms || p.bedroom_count || 0,
        bathrooms: p.bathrooms || p.bathroom_count || 0,
        area: p.area || p.size || p.sqft || 0,
        status: p.status || 'available',
        createdAt: p.created_on ? new Date(p.created_on).toISOString() : (p.createdAt || new Date().toISOString()),
        ...p
      }));

      return { data: normalized, success: true };
    } catch (error) {
      console.error('Error fetching properties from API:', error && error.message ? error.message : error);
      return this.createResponse([], false, error && error.message ? error.message : 'Failed to fetch properties from API');
    }
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
    // Require admin token for property creation
    const token = localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN) || localStorage.getItem('accessToken');
    if (!token) {
      return this.createResponse(null, false, 'Admin token not found. Please login to create properties.');
    }

    try {
  const endpoint = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PROPERTY_CREATE}`;

      // Ensure body is FormData (for file upload)
      let body = propertyData;
      if (!(propertyData instanceof FormData)) {
        const fd = new FormData();
        Object.keys(propertyData).forEach(key => {
          const v = propertyData[key];
          if (Array.isArray(v)) {
            v.forEach(item => fd.append(key, item));
          } else if (v instanceof File) {
            fd.append(key, v);
          } else if (v !== undefined && v !== null) {
            fd.append(key, v);
          } else {
            fd.append(key, '');
          }
        });
        body = fd;
      }

      const resp = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'x-session-key': token
          // Do NOT set Content-Type for FormData
        },
        body
      });

      const result = await resp.json().catch(() => null);
      if (resp.ok && result && (result.response_code === 200 || result.success === true)) {
        const created = result.response_data || result.data || {};
        const prop = {
          _id: created.id || created._id || generateId(),
          id: created.id || created._id || generateId(),
          title: created.title || created.name || propertyData.title || '',
          description: created.description || propertyData.description || '',
          price: created.price || propertyData.price || 0,
          location: created.location || propertyData.location || '',
          image: created.image || propertyData.image || null,
          type: created.type || propertyData.type || 'exclusive',
          bedrooms: created.bedrooms || propertyData.bedrooms || 0,
          bathrooms: created.bathrooms || propertyData.bathrooms || 0,
          area: created.area || propertyData.area || 0,
          status: created.status || propertyData.status || 'available',
          createdAt: created.created_on ? new Date(created.created_on).toISOString() : new Date().toISOString(),
          updatedAt: created.updated_on ? new Date(created.updated_on).toISOString() : new Date().toISOString(),
          ...created
        };

        return this.createResponse(prop, true, result.response_message || 'Property created successfully');
      }

      const errMsg = (result && (result.response_message || result.message)) || `HTTP ${resp.status}`;
      return this.createResponse(result || { message: errMsg }, false, errMsg || 'Failed to create property');
    } catch (error) {
      console.error('Error creating property via API:', error);
      return this.createResponse({ error: error && error.message ? error.message : String(error) }, false, error && error.message ? error.message : 'Network error while creating property');
    }
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
    const token = localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN) || localStorage.getItem('accessToken');
    if (!token) {
      return this.createResponse(null, false, 'Admin token not found. Please login to delete properties.');
    }

    try {
  const endpoint = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PROPERTY_DELETE}`;
      const resp = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-session-key': token
        },
        body: JSON.stringify({ id })
      });

      const result = await resp.json().catch(() => null);
      if (resp.ok && result && (result.response_code === 200 || result.success === true)) {
        return this.createResponse(null, true, result.response_message || 'Property deleted successfully');
      }

      const errMsg = (result && (result.response_message || result.message)) || `HTTP ${resp.status}`;
      return this.createResponse(null, false, errMsg || 'Failed to delete property');
    } catch (error) {
      console.error('Error deleting property via API:', error);
      return this.createResponse(null, false, error && error.message ? error.message : 'Network error while deleting property');
    }
  }

  // Projects API methods
  async getProjects(filters = {}) {
    // Call backend /api/project/read endpoint and return normalized projects
    try {
      const endpoint = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PROJECT_READ}`;
      const resp = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!resp.ok) {
        throw new Error(`HTTP ${resp.status}`);
      }

      const data = await resp.json();
      const projectsRaw = data.response_data || data.projects || [];

      // Normalize
      const projects = (Array.isArray(projectsRaw) ? projectsRaw : []).map(p => ({
        _id: p.id || p._id,
        id: p.id || p._id,
        title: p.title || p.name || '',
        description: p.description || '',
        priceRange: p.priceRange || p.price_range || { min: 0, max: 0 },
        location: p.location || '',
        status: p.status || 'upcoming',
        category: p.category || '',
        developer: p.developer || '',
        keyHighlights: p.keyHighlights || p.key_highlights || [],
        images: p.images || p.image || [],
        createdAt: p.created_on ? new Date(p.created_on).toISOString() : (p.createdAt || new Date().toISOString()),
        updatedAt: p.updated_on ? new Date(p.updated_on).toISOString() : (p.updatedAt || new Date().toISOString()),
        ...p
      }));

      // apply filters client-side if provided
      let filtered = projects;
      if (filters.status && filters.status !== 'all') filtered = filtered.filter(p => p.status === filters.status);
      if (filters.location && filters.location !== 'all') filtered = filtered.filter(p => p.location.toLowerCase().includes(filters.location.toLowerCase()));
      if (filters.developer && filters.developer !== 'all') filtered = filtered.filter(p => p.developer.toLowerCase().includes(filters.developer.toLowerCase()));
      if (filters.category && filters.category !== 'all') filtered = filtered.filter(p => p.category === filters.category);
      if (filters.minPrice) filtered = filtered.filter(p => (p.priceRange?.min || 0) >= parseInt(filters.minPrice));
      if (filters.maxPrice) filtered = filtered.filter(p => (p.priceRange?.max || 0) <= parseInt(filters.maxPrice));

      return { data: filtered, success: true };
    } catch (error) {
      console.error('Error fetching projects from API:', error);
      throw error;
    }
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
    try {
      const endpoint = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PROJECT_CREATE}`;
      const token = localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN) || localStorage.getItem('accessToken');

      // Send only x-session-key header as requested by backend; do not set Content-Type so
      // the browser can set it for FormData (multipart) requests. If projectData is a FormData
      // instance, send as-is; otherwise send JSON string without setting Content-Type header.
      const headers = {
        'x-session-key': token || ''
      }

      let bodyToSend = projectData
      if (!(projectData instanceof FormData)) {
        // Send JSON body and set Content-Type so backend can parse it
        headers['Content-Type'] = 'application/json'
        bodyToSend = JSON.stringify(projectData)
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: bodyToSend
      });

      const result = await response.json().catch(() => null);
      if (response.ok && result && (result.response_code === 200 || result.success === true)) {
        const created = result.response_data || projectData;
        const project = {
          _id: created.id || created._id || generateId(),
          id: created.id || created._id || generateId(),
          name: created.name || created.title || '',
          location: created.location || '',
          project_types: created.project_types || created.project_type || '',
          bedrooms: created.bedrooms || 0,
          area: created.area || '',
          description: created.description || '',
          total_units: created.total_units || 0,
          project_statuses: created.project_statuses || created.status || 'planned',
          launch_date: created.launch_date || '',
          completion_date: created.completion_date || '',
          createdAt: created.created_on ? new Date(created.created_on).toISOString() : new Date().toISOString(),
          updatedAt: created.updated_on ? new Date(created.updated_on).toISOString() : new Date().toISOString()
        };

        return this.createResponse(project, true, result.response_message || 'Project created successfully');
      }

  // Return a structured failure response instead of throwing, include raw server result for diagnostics
  const errMsg = (result && (result.response_message || result.message)) || `HTTP ${response.status}`;
  return this.createResponse(result || { message: errMsg }, false, errMsg || 'Failed to create project');
    } catch (error) {
      console.error('Error creating project via API:', error);
      // Return a failure response including error message for diagnostics
      return this.createResponse({ error: error && error.message ? error.message : String(error) }, false, error && error.message ? error.message : 'Network error while creating project');
    }
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
    try {
      const endpoint = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PROJECT_DELETE}`;
      const token = localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN) || localStorage.getItem('accessToken');

      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-session-key': token || ''
        },
        body: JSON.stringify({ id })
      });

      const result = await response.json().catch(() => null);
      if (response.ok && result && (result.response_code === 200 || result.success === true)) {
        return this.createResponse(null, true, result.response_message || 'Project deleted successfully');
      }

      const errMsg = (result && (result.response_message || result.message)) || `HTTP ${response.status}`;
      throw new Error(errMsg || 'Failed to delete project');
    } catch (error) {
      console.error('Error deleting project via API:', error);
      throw error;
    }
  }

  // Contact API methods
  async submitContactForm(formData) {
    try {
      const endpoint = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CONTACT_CREATE}`;
      const token = localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN) || localStorage.getItem('accessToken');

      // Create FormData object
      let data = formData;
      if (!(formData instanceof FormData)) {
        data = new FormData();
        Object.keys(formData).forEach(key => {
          data.append(key, formData[key]);
        });
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'x-session-key': token || ''
        },
        body: data
      });

      const result = await response.json().catch(() => null);
      if (response.ok && result && (result.response_code === 200 || result.success === true)) {
        return this.createResponse(result.response_data || formData, true, result.response_message || 'Contact form submitted successfully');
      }

      const errMsg = (result && (result.response_message || result.message)) || `HTTP ${response.status}`;
      throw new Error(errMsg || 'Failed to submit contact form');
    } catch (error) {
      console.error('Error submitting contact form via API:', error);
      throw error;
    }
  }

  async getContactSubmissions() {
    try {
      const endpoint = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CONTACT_READ}`;
      const token = localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN) || localStorage.getItem('accessToken');

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-session-key': token || ''
        }
      });

      const result = await response.json().catch(() => null);
      if (response.ok && result && (result.response_code === 200 || result.success === true)) {
        const contacts = (result.response_data || []).map(contact => ({
          _id: contact.id || contact._id,
          id: contact.id || contact._id,
          name: contact.name,
          email: contact.email,
          phone: contact.phone,
          message: contact.message,
          status: contact.status || 'new',
          source: contact.source || 'website',
          createdAt: contact.created_on ? new Date(contact.created_on).toISOString() : (contact.createdAt || new Date().toISOString()),
          updatedAt: contact.updated_on ? new Date(contact.updated_on).toISOString() : (contact.updatedAt || new Date().toISOString())
        }));

        return this.createResponse(contacts, true, result.response_message || 'Contacts retrieved successfully');
      }

      const errMsg = (result && (result.response_message || result.message)) || `HTTP ${response.status}`;
      throw new Error(errMsg || 'Failed to retrieve contacts');
    } catch (error) {
      console.error('Error fetching contacts via API:', error);
      throw error;
    }
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
    try {
      const endpoint = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CONTACT_DELETE}`;
      const token = localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN) || localStorage.getItem('accessToken');

      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-session-key': token || ''
        },
        body: JSON.stringify({ id })
      });

      const result = await response.json().catch(() => null);
      if (response.ok && result && (result.response_code === 200 || result.success === true)) {
        return this.createResponse(null, true, result.response_message || 'Contact deleted successfully');
      }

      const errMsg = (result && (result.response_message || result.message)) || `HTTP ${response.status}`;
      throw new Error(errMsg || 'Failed to delete contact');
    } catch (error) {
      console.error('Error deleting contact via API:', error);
      throw error;
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
    // If admin token exists, call backend delete endpoint and do NOT fallback to localStorage on failure
    const token = localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN) || localStorage.getItem('accessToken');
    if (token) {
      try {
        const endpoint = `${API_CONFIG.BASE_URL}/api/blog/delete`;
        // Try DELETE with JSON body (some servers accept body with DELETE)
        let response = await fetch(endpoint, {
          method: 'DELETE',
          headers: {
            'x-session-key': token,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ id })
        });

        // If DELETE not allowed, try POST fallback
        if (response.status === 405 || response.status === 404) {
          try {
            response = await fetch(endpoint, {
              method: 'POST',
              headers: {
                'x-session-key': token,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              body: JSON.stringify({ id })
            });
          } catch (postErr) {
            console.error('POST fallback for blog delete failed:', postErr);
            throw postErr;
          }
        }

        const data = await response.json().catch(() => null);
        if (response.ok && data && (data.response_code === 200 || data.success === true)) {
          return this.createResponse(null, true, data.response_message || 'Blog deleted successfully');
        }

        const errMsg = (data && (data.response_message || data.message)) || `HTTP ${response.status}`;
        throw new Error(errMsg || 'Failed to delete blog');
      } catch (error) {
        console.error('Error deleting blog via API:', error);
        throw error; // do not fallback to localStorage when admin token exists
      }
    }

    // No token: fallback to localStorage
    await simulateDelay();
    const blogsData = getFromStorage(STORAGE_KEYS.BLOGS);
    const filteredBlogs = blogsData.filter(b => b._id !== id && b.id !== id);

    if (filteredBlogs.length < blogsData.length) {
      saveToStorage(STORAGE_KEYS.BLOGS, filteredBlogs);
      return this.createResponse(null, true, 'Blog deleted successfully (local)');
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
    // Call backend /api/developer/read and return developers (no local fallback)
    try {
      const endpoint = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DEVELOPER_READ}`;
      const token = localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN) || localStorage.getItem('accessToken');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['x-session-key'] = token;

      const resp = await fetch(endpoint, { method: 'GET', headers });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      const devsRaw = data.response_data || data.data || [];
      const devs = (Array.isArray(devsRaw) ? devsRaw : []).map(d => ({
        _id: d.id || d._id || d.developer_id,
        id: d.developer_id || d.id || d._id,
        name: d.name || d.about || '',
        description: d.description || '',
        established_year: d.established_year || '',
        projects_count: d.projects_count || {},
        contact_info: d.contact_info || {},
        logo: d.logo || d.image || null,
        cover_image: d.cover_image || null,
        projects: d.projects || d.project_ids || [],
        website: d.website || '',
        createdAt: d.created_on ? new Date(d.created_on).toISOString() : (d.createdAt || new Date().toISOString()),
        updatedAt: d.updated_on ? new Date(d.updated_on).toISOString() : (d.updatedAt || new Date().toISOString()),
        ...d
      }));

      // apply limit filter
      let filtered = devs;
      if (filters.limit) filtered = filtered.slice(0, parseInt(filters.limit));
      if (filters.status && filters.status !== 'all') filtered = filtered.filter(d => d.status === filters.status);

      return { data: filtered, success: true };
    } catch (error) {
      console.error('Error fetching developers from API:', error);
      throw error;
    }
  }

  async getDeveloperById(id) {
    try {
      const endpoint = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DEVELOPER_READ}`;
      const token = localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN) || localStorage.getItem('accessToken');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['x-session-key'] = token;

      const resp = await fetch(`${endpoint}?id=${encodeURIComponent(id)}`, { method: 'GET', headers });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      const d = data.response_data || data.data || null;
      if (!d) throw new Error('Developer not found');
      const developer = {
        _id: d.id || d._id || d.developer_id,
        id: d.developer_id || d.id || d._id,
        name: d.name || d.about || '',
        description: d.description || '',
        established_year: d.established_year || '',
        projects_count: d.projects_count || {},
        contact_info: d.contact_info || {},
        logo: d.logo || d.image || null,
        cover_image: d.cover_image || null,
        projects: d.projects || d.project_ids || [],
        website: d.website || '',
        createdAt: d.created_on ? new Date(d.created_on).toISOString() : (d.createdAt || new Date().toISOString()),
        updatedAt: d.updated_on ? new Date(d.updated_on).toISOString() : (d.updatedAt || new Date().toISOString()),
        ...d
      };
      return this.createResponse(developer, true);
    } catch (error) {
      console.error('Error fetching developer by id from API:', error);
      throw error;
    }
  }

  async createDeveloper(developerData) {
    // If admin token exists, call backend create endpoint with FormData and x-session-key
    const token = localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN) || localStorage.getItem('accessToken');
    const endpoint = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DEVELOPER_CREATE}`;

    if (token) {
      try {
        let formData = developerData;
        if (!(developerData instanceof FormData)) {
          formData = new FormData();
          Object.keys(developerData).forEach(key => {
            // For nested objects, stringify
            const value = developerData[key];
            if (value && typeof value === 'object' && !(value instanceof File)) {
              formData.append(key, JSON.stringify(value));
            } else if (value !== undefined && value !== null) {
              formData.append(key, value);
            }
          });
        }

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'x-session-key': token
          },
          body: formData
        });

        const data = await res.json().catch(() => null);
        if (res.ok && data && (data.response_code === 200 || data.success === true)) {
          const created = data.response_data || data;
          // Normalize created developer
          const developer = {
            _id: created.id || created._id || created.developer_id || generateId(),
            id: created.developer_id || created.id || created._id || generateId(),
            name: created.name || created.about || created.title || '',
            description: created.description || '',
            established_year: created.established_year || '',
            projects_count: created.projects_count || {},
            contact_info: created.contact_info || {},
            logo: created.logo || created.image || null,
            cover_image: created.cover_image || null,
            website: created.website || '',
            createdAt: created.created_on ? new Date(created.created_on).toISOString() : new Date().toISOString(),
            updatedAt: created.updated_on ? new Date(created.updated_on).toISOString() : new Date().toISOString()
          };

          return this.createResponse(developer, true, data.response_message || 'Developer created');
        }

        const errMsg = (data && (data.response_message || data.message)) || `HTTP ${res.status}`;
        throw new Error(errMsg || 'Failed to create developer');
      } catch (error) {
        console.error('Error creating developer via API:', error);
        // Do not fallback to localStorage when admin token exists
        throw error;
      }
    }

    // No token -> fallback to localStorage behavior
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

    return this.createResponse(newDeveloper, true, 'Developer created successfully (local)');
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
    // If admin token exists, call backend delete endpoint and do NOT fallback to localStorage on failure
    const token = localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN) || localStorage.getItem('accessToken');
    if (token) {
      try {
        const endpoint = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DEVELOPER_DELETE}`;

        // Try DELETE with JSON body
        let response = await fetch(endpoint, {
          method: 'DELETE',
          headers: {
            'x-session-key': token,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ id })
        });

        if (response.status === 405 || response.status === 404) {
          // Try POST fallback
          response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'x-session-key': token,
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({ id })
          });
        }

        const data = await response.json().catch(() => null);
        if (response.ok && data && (data.response_code === 200 || data.success === true)) {
          return this.createResponse(null, true, data.response_message || 'Developer deleted');
        }

        const errMsg = (data && (data.response_message || data.message)) || `HTTP ${response.status}`;
        throw new Error(errMsg || 'Failed to delete developer');
      } catch (error) {
        console.error('Error deleting developer via API:', error);
        throw error; // do not fallback to localStorage when admin token exists
      }
    }

    // No token: fallback to localStorage
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
          // Backend expects the access token in x-session-key for multipart requests
          'x-session-key': token
          // Don't set Content-Type for FormData, let the browser set it (boundary)
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
    // Try to call the backend update endpoint when an admin token exists.
    // Support both JSON and FormData payloads. If no token, fallback to localStorage.
    const token = localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN) || localStorage.getItem('accessToken');

    // Build a list of candidate endpoints to try for update compatibility.
    const baseCreate = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TESTIMONIAL_CREATE}`;
    const candidates = [
      baseCreate.replace('/create', '/update'),
      baseCreate.replace('/create', '/edit'),
      baseCreate.replace('/create', '/status'),
      baseCreate.replace('/create', '/publish'),
      baseCreate // original create endpoint as a last resort (handled below too)
    ];

    // Helper to transform API response_data into internal testimonial shape
    const transform = (data) => ({
      _id: data.id || data._id || data.testimonial_id || id,
      id: data.testimonial_id || data.id || data._id || id,
      name: data.name,
      email: data.email,
      comments: data.comments,
      designation: data.designation,
      image: data.image,
      image_url: data.image_url,
      published: data.published !== false,
      createdAt: data.created_on ? new Date(data.created_on).toISOString() : new Date().toISOString(),
      updatedAt: data.updated_on ? new Date(data.updated_on).toISOString() : new Date().toISOString()
    });

    if (token) {
      try {
        let lastError = null;

        // For each candidate endpoint, try PATCH then POST fallback
        for (const ep of candidates) {
          try {
            // Determine body and headers for this attempt
            let fetchOpts = {
              method: 'PATCH',
              headers: {
                'x-session-key': token,
                'Accept': 'application/json'
              }
            };

            if (testimonialData instanceof FormData) {
              // Make a fresh FormData for each attempt to avoid reusing the same instance
              const fd = new FormData();
              for (const [k, v] of testimonialData.entries()) fd.append(k, v);
              // include id for compatibility
              fd.append('id', id);
              fetchOpts.body = fd;
            } else {
              fetchOpts.headers['Content-Type'] = 'application/json';
              fetchOpts.body = JSON.stringify({ id, ...testimonialData });
            }

            let response = await fetch(ep, fetchOpts);

            if (response.status === 405 || response.status === 404) {
              // Try POST fallback to the same endpoint
              const postOpts = { ...fetchOpts, method: 'POST' };
              response = await fetch(ep, postOpts);
            }

            const data = await response.json().catch(() => null);
            if (response.ok && data && (data.response_code === 200 || data.success === true)) {
              const updated = data.response_data ? transform(data.response_data) : transform(testimonialData);
              return this.createResponse(updated, true, data.response_message || 'Testimonial updated');
            }

            // not successful, remember last error and continue to next candidate
            lastError = data && (data.response_message || data.message) ? new Error(data.response_message || data.message) : new Error(`HTTP ${response.status}`);
          } catch (epErr) {
            lastError = epErr;
            console.warn('Attempt to update via', ep, 'failed:', epErr && epErr.message ? epErr.message : epErr);
            // try next candidate
          }
        }

        // If we reach here, all candidate endpoints failed. Try original create endpoint as a last resort (already included in candidates but ensure)
        try {
          const createEndpoint = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TESTIMONIAL_CREATE}`;
          let createOpts = {
            method: 'POST',
            headers: {
              'x-session-key': token,
              'Accept': 'application/json'
            }
          };

          if (testimonialData instanceof FormData) {
            const fd2 = new FormData();
            for (const [k, v] of testimonialData.entries()) fd2.append(k, v);
            fd2.append('id', id);
            createOpts.body = fd2;
          } else {
            createOpts.headers['Content-Type'] = 'application/json';
            createOpts.body = JSON.stringify({ id, ...testimonialData });
          }

          const createResp = await fetch(createEndpoint, createOpts);
          const createData = await createResp.json().catch(() => null);
          if (createResp.ok && createData && (createData.response_code === 200 || createData.success === true)) {
            const updated = createData.response_data ? transform(createData.response_data) : transform(testimonialData);
            return this.createResponse(updated, true, createData.response_message || 'Testimonial updated via create endpoint');
          }
          lastError = createData && (createData.response_message || createData.message) ? new Error(createData.response_message || createData.message) : new Error(`HTTP ${createResp.status}`);
        } catch (createFallbackErr) {
          lastError = createFallbackErr;
          console.warn('Create-endpoint fallback failed for update:', createFallbackErr);
        }

        // If all attempts failed, surface the last error
        throw lastError || new Error('Failed to update testimonial');
      } catch (error) {
        console.error('Error updating testimonial via API:', error);
        // Do not fallback to localStorage when admin token exists
        throw error;
      }
    }

    // No token -> fallback to localStorage update
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
      return this.createResponse(testimonialsData[index], true, 'Testimonial updated successfully (local)');
    } else {
      throw new Error('Testimonial not found');
    }
  }

  async deleteTestimonial(id) {
    // If an admin token exists, call backend using DELETE and do NOT fallback to localStorage on failure
    const token = localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN) || localStorage.getItem('accessToken');
    if (token) {
      try {
        // Use DELETE to the endpoint with id as query parameter (many servers accept query for DELETE)
        const endpoint = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TESTIMONIAL_DELETE}?id=${encodeURIComponent(id)}`;
        let response = await fetch(endpoint, {
          method: 'DELETE',
          headers: {
            'x-session-key': token,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id })
        });

        // If server does not allow DELETE (405), try POST fallback with JSON body { id }
        if (response.status === 405) {
          try {
            const postEndpoint = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TESTIMONIAL_DELETE}`;
            response = await fetch(postEndpoint, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-session-key': token,
                'Accept': 'application/json'
              },
              body: JSON.stringify({ id })
            });
          } catch (postErr) {
            console.error('POST fallback for delete failed:', postErr);
            throw postErr;
          }
        }

        const data = await response.json().catch(() => null);
        if (response.ok && data && (data.response_code === 200 || data.success === true)) {
          return this.createResponse(null, true, data.response_message || 'Testimonial deleted successfully');
        }

        // If the server returned a non-success response, surface the error to caller (no local fallback)
        const errMsg = (data && (data.response_message || data.message)) || `HTTP ${response.status}`;
        throw new Error(errMsg || 'Failed to delete testimonial');
      } catch (error) {
        console.error('Error deleting testimonial via API:', error);
        throw error; // do not fallback to localStorage when admin token exists
      }
    }

    // No admin token: fallback to localStorage
    await simulateDelay();
    const testimonialsData = getFromStorage(STORAGE_KEYS.TESTIMONIALS);
    const filteredTestimonials = testimonialsData.filter(t => t._id !== id && t.id !== id);

    if (filteredTestimonials.length < testimonialsData.length) {
      saveToStorage(STORAGE_KEYS.TESTIMONIALS, filteredTestimonials);
      return this.createResponse(null, true, 'Testimonial deleted successfully (local fallback)');
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