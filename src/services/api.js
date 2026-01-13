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

  getProfile: async () => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_URL}/auth/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch profile');
    return response.json();
  },
};

/**
 * KYC (Know Your Customer) API calls
 */
export const kycAPI = {
  submitKYC: async (kycData, files) => {
    const formData = new FormData();

    // Append form fields - handles both v1.0 and v2.0
    Object.keys(kycData).forEach(key => {
      if (typeof kycData[key] === 'object' && kycData[key] !== null) {
        formData.append(key, JSON.stringify(kycData[key]));
      } else {
        formData.append(key, kycData[key]);
      }
    });

    // Append files - supports both v1.0 (flat) and v2.0 (dynamic keys) formats
    // V1.0 files (legacy field names)
    const v1Files = {
      frontImage: 'frontimage',
      backImage: 'backimage',
      aadhaarCard: 'aadhaarcard',
      panCard: 'pancard',
      driversLicense: 'driverslicense',
      passport: 'passport',
      propertyOwnership: 'propertyownership',
      businessLicense: 'businesslicense',
      taxDocument: 'taxdocument',
      bankStatement: 'bankstatement',
      addressProof: 'addressproof'
    };

    // Append v1.0 files
    Object.keys(v1Files).forEach(key => {
      if (files[key]) {
        formData.append(v1Files[key], files[key]);
      }
    });

    // Append v2.0 files (dynamic keys from requirements)
    // All keys that don't match v1.0 format are treated as v2.0
    Object.keys(files).forEach(key => {
      if (!v1Files[key]) {
        const fileData = files[key];
        if (Array.isArray(fileData)) {
          // Multiple files (e.g., title deeds)
          fileData.forEach((file, index) => {
            formData.append(key, file);
          });
        } else if (fileData) {
          // Single file
          formData.append(key, fileData);
        }
      }
    });

    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_URL}/kyc/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'KYC submission failed');
    }
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

  // Admin KYC endpoints
  getAllKYCSubmissions: async (status = 'all') => {
    const token = localStorage.getItem('authToken');
    const url = status === 'all'
      ? `${API_URL}/kyc/all`
      : `${API_URL}/kyc/all?status=${status}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch KYC submissions');
    return response.json();
  },

  verifyKYC: async (kycId, status, rejectionReason = '') => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_URL}/kyc/verify/${kycId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ status, rejectionReason }),
    });
    if (!response.ok) throw new Error('Failed to verify KYC');
    return response.json();
  },

  getKYCDetails: async (kycId) => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_URL}/kyc/details/${kycId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch KYC details');
    return response.json();
  },
};

/**
 * Properties API calls
 */
export const propertiesAPI = {
  getAll: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters);
    const url = `${API_URL}/property/all?${queryParams}`;

    console.log(`📡 Fetching properties from: ${url}`, filters);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ API Error ${response.status}:`, {
          url,
          status: response.status,
          statusText: response.statusText,
          body: errorText,
        });
        throw new Error(`API Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`✅ API Success:`, { properties: data.properties?.length || 0, data });
      return data;
    } catch (error) {
      console.error(`🔴 Failed to fetch properties:`, { error, url, filters });
      throw error;
    }
  },

  getById: async (id) => {
    const response = await fetch(`${API_URL}/property/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Failed to fetch property');
    return response.json();
  },

  create: async (propertyData) => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_URL}/property/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(propertyData),
    });
    if (!response.ok) throw new Error('Failed to create property');
    return response.json();
  },

  update: async (id, propertyData) => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_URL}/property/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(propertyData),
    });
    if (!response.ok) throw new Error('Failed to update property');
    return response.json();
  },

  delete: async (id) => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_URL}/property/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to delete property');
    return response.json();
  },
};

/**
 * Agents API calls
 */
export const agentsAPI = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/agents`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Failed to fetch agents');
    return response.json();
  },

  getById: async (id) => {
    const response = await fetch(`${API_URL}/agents/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Failed to fetch agent');
    return response.json();
  },
};

/**
 * Favorites API calls
 */
export const favoritesAPI = {
  getAll: async () => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_URL}/favorites`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch favorites');
    return response.json();
  },

  add: async (propertyId) => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_URL}/favorites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ propertyId }),
    });
    if (!response.ok) throw new Error('Failed to add favorite');
    return response.json();
  },

  remove: async (propertyId) => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_URL}/favorites/${propertyId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to remove favorite');
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
 * Tour Request API calls
 */
export const tourAPI = {
  submitTourRequest: async (tourData) => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_URL}/tours/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: JSON.stringify(tourData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Tour request submission failed');
    }
    return response.json();
  },

  getMyTours: async () => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_URL}/tours/my-tours`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch tours');
    return response.json();
  },

  getToursByProperty: async (propertyId) => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_URL}/tours/property/${propertyId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch property tours');
    return response.json();
  },

  updateTourStatus: async (tourId, status) => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_URL}/tours/${tourId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error('Failed to update tour status');
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
