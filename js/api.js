// API Configuration
const API_BASE_URL = 'http://localhost:3000/api';

// Token Management
const getToken = () => localStorage.getItem('token');
const setToken = (token) => localStorage.setItem('token', token);
const removeToken = () => localStorage.removeItem('token');
const getCurrentUser = () => JSON.parse(localStorage.getItem('currentUser') || '{}');

// API Helper Functions
const apiCall = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'API call failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    
    // Fallback to local data for demo purposes
    if (endpoint.includes('/items')) {
      return getLocalItems(endpoint, options);
    }
    
    throw error;
  }
};

// Local data fallback
const getLocalItems = async (endpoint, options) => {
  // Create a script element to load data.js
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = './data.js';
    script.onload = () => {
      // After data.js loads, the items variable will be available
      const url = new URL(API_BASE_URL + endpoint, window.location.origin);
      const category = url.searchParams.get('category');
      const search = url.searchParams.get('search');

      let filteredItems = window.items || [];

      if (category) {
        filteredItems = filteredItems.filter(item => item.category === category);
      }

      if (search) {
        const searchLower = search.toLowerCase();
        filteredItems = filteredItems.filter(item =>
          item.name.toLowerCase().includes(searchLower) ||
          item.category.toLowerCase().includes(searchLower) ||
          item.description.toLowerCase().includes(searchLower)
        );
      }

      resolve(filteredItems);
    };
    script.onerror = () => {
      console.error('Failed to load data.js');
      resolve([]);
    };
    document.head.appendChild(script);
  });
};

// Auth API
const authAPI = {
  register: async (userData) => {
    const data = await apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    setToken(data.token);
    localStorage.setItem('currentUser', JSON.stringify(data.user));
    return data;
  },

  login: async (credentials) => {
    const data = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    setToken(data.token);
    localStorage.setItem('currentUser', JSON.stringify(data.user));
    return data;
  },

  logout: () => {
    removeToken();
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
  },

  isAuthenticated: () => !!getToken()
};

// Items API
const itemsAPI = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    return await apiCall(`/items?${params}`);
  },

  getById: async (id) => {
    return await apiCall(`/items/${id}`);
  },

  create: async (formData) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/items`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create item');
    }

    return await response.json();
  },

  update: async (id, formData) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/items/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update item');
    }

    return await response.json();
  },

  delete: async (id) => {
    return await apiCall(`/items/${id}`, {
      method: 'DELETE'
    });
  },

  getUserItems: async () => {
    return await apiCall('/user/items');
  }
};

// Categories API
const categoriesAPI = {
  getAll: async () => {
    return await apiCall('/categories');
  }
};

// Utility Functions
const formatPrice = (price) => `¥${price.toLocaleString('en-IN')}`;
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

// Form Validation
const validateItemForm = (formData) => {
  const errors = {};

  if (!formData.get('name')?.trim()) {
    errors.name = 'Item name is required';
  }
  if (!formData.get('category')) {
    errors.category = 'Category is required';
  }
  if (!formData.get('sellingPrice') || formData.get('sellingPrice') <= 0) {
    errors.sellingPrice = 'Valid selling price is required';
  }
  if (!formData.get('originalPrice') || formData.get('originalPrice') <= 0) {
    errors.originalPrice = 'Valid original price is required';
  }
  if (!formData.get('condition')?.trim()) {
    errors.condition = 'Condition is required';
  }
  if (!formData.get('sellerName')?.trim()) {
    errors.sellerName = 'Seller name is required';
  }
  if (!formData.get('contact')?.trim()) {
    errors.contact = 'Contact number is required';
  }
  if (!formData.get('location')?.trim()) {
    errors.location = 'Location is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

const validateAuthForm = (formData, isLogin = false) => {
  const errors = {};

  if (!formData.get('email')?.trim()) {
    errors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(formData.get('email'))) {
    errors.email = 'Email is invalid';
  }

  if (!formData.get('password')?.trim()) {
    errors.password = 'Password is required';
  } else if (!isLogin && formData.get('password').length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (!isLogin) {
    if (!formData.get('fullName')?.trim()) {
      errors.fullName = 'Full name is required';
    }
    if (!formData.get('phone')?.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.get('phone'))) {
      errors.phone = 'Phone number must be 10 digits';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Export for use in other scripts
window.CampusExchangeAPI = {
  authAPI,
  itemsAPI,
  categoriesAPI,
  formatPrice,
  formatDate,
  validateItemForm,
  validateAuthForm,
  getToken,
  getCurrentUser,
  isAuthenticated: authAPI.isAuthenticated
};
