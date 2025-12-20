/**
 * API Service Layer
 * Centralized API communication with the backend
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Authentication API calls
 */
export const authAPI = {
  register: async (userData) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Registration failed');
    return response.json();
  },

  login: async (email, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) throw new Error('Login failed');
    return response.json();
  },

  logout: async () => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Logout failed');
    return response.json();
  },
};

/**
 * KYC (Know Your Customer) API calls
 */
export const kycAPI = {
  submitKYC: async (kycData, files) => {
    const formData = new FormData();

    // Append form fields
    Object.keys(kycData).forEach(key => {
      formData.append(key, kycData[key]);
    });

    // Append files
    if (files.frontImage) formData.append('frontImage', files.frontImage);
    if (files.backImage) formData.append('backImage', files.backImage);

    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_URL}/kyc/submit`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    if (!response.ok) throw new Error('KYC submission failed');
    return response.json();
  },

  getKYCStatus: async () => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_URL}/kyc/status`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch KYC status');
    return response.json();
  },
};

/**
 * Contact Form API calls
 */
export const contactAPI = {
  submitContact: async (contactData) => {
    const response = await fetch(`${API_URL}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactData),
    });
    if (!response.ok) throw new Error('Contact form submission failed');
    return response.json();
  },
};

/**
 * Generic API call handler with error handling
 */
export const apiCall = async (endpoint, options = {}) => {
  const {
    method = 'GET',
    body = null,
    headers = {},
    requiresAuth = false,
  } = options;

  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  if (requiresAuth) {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API request failed');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
