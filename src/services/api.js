/**
 * API Service Layer
 * Centralized API communication with the backend
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

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

    // Append v1.0 files (only if they're not v2.0 front/back structures)
    Object.keys(v1Files).forEach(key => {
      const fileData = files[key];
      // Only process as v1.0 if it's NOT a v2.0 front/back structure
      if (fileData && !(typeof fileData === 'object' && (fileData.front || fileData.back))) {
        formData.append(v1Files[key], fileData);
      }
    });

    // Append v2.0 files (dynamic keys from requirements)
    // Process all files that either don't exist in v1Files OR have v2.0 front/back structure
    Object.keys(files).forEach(key => {
      const fileData = files[key];
      const isV2FrontBack = fileData && typeof fileData === 'object' && (fileData.front || fileData.back);

      // Process if: not in v1Files OR is a v2.0 front/back structure
      if (!v1Files[key] || isV2FrontBack) {
        console.log(`📎 Processing file key: ${key}`, {
          isArray: Array.isArray(fileData),
          hasObjectStructure: fileData && typeof fileData === 'object',
          hasFrontBack: isV2FrontBack,
          fileData: fileData
        });

        if (Array.isArray(fileData)) {
          // Multiple files (e.g., title deeds)
          fileData.forEach((file, index) => {
            console.log(`  ➡️ Appending array file: ${key}[${index}] - ${file?.name}`);
            formData.append(key, file);
          });
        } else if (isV2FrontBack) {
          // Front/back files (e.g., passport, emirates_id)
          if (fileData.front) {
            console.log(`  ➡️ Appending front: ${key}_front - ${fileData.front?.name}`);
            formData.append(`${key}_front`, fileData.front);
          }
          if (fileData.back) {
            console.log(`  ➡️ Appending back: ${key}_back - ${fileData.back?.name}`);
            formData.append(`${key}_back`, fileData.back);
          }
        } else if (fileData) {
          // Single file
          console.log(`  ➡️ Appending single file: ${key} - ${fileData?.name}`);
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

  trackView: async (id) => {
    const token = localStorage.getItem('authToken');
    const headers = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/property/${id}/view`, {
      method: 'POST',
      headers: headers,
    });
    if (!response.ok) throw new Error('Failed to track view');
    return response.json();
  },

  trackSearch: async (query, filters, resultsCount) => {
    const token = localStorage.getItem('authToken');
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      await fetch(`${API_URL}/property/track/search`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ query, filters, resultsCount }),
      });
    } catch (_) { /* fail silently */ }
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

  checkFavorite: async (propertyId) => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_URL}/favorites/check/${propertyId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to check favorite');
    return response.json();
  },

  getFavoritesOnMyProperties: async () => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_URL}/favorites/my-properties`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch favorites on properties');
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
 * Dashboard API calls
 */
export const dashboardAPI = {
  getStats: async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        // Return empty data if not logged in
        return {
          success: false,
          message: 'Not authenticated',
          activities: [],
          stats: {}
        };
      }
      const response = await fetch(`${API_URL}/dashboard/stats`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        // Return structured error instead of throwing
        return {
          success: false,
          message: error.message || 'Failed to fetch dashboard statistics',
          activities: [],
          stats: {}
        };
      }
      return response.json();
    } catch (error) {
      console.error('Dashboard stats error:', error);
      return {
        success: false,
        message: 'Error fetching dashboard statistics',
        activities: [],
        stats: {}
      };
    }
  },
};

/**
 * Reviews API calls
 */
export const reviewsAPI = {
  addReview: async (reviewData) => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_URL}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(reviewData),
    });
    if (!response.ok) throw new Error('Failed to add review');
    return response.json();
  },

  getPropertyReviews: async (propertyId) => {
    const response = await fetch(`${API_URL}/reviews/property/${propertyId}`, {
      method: 'GET',
    });
    if (!response.ok) throw new Error('Failed to fetch property reviews');
    return response.json();
  },

  getUserReviews: async () => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_URL}/reviews/user`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch user reviews');
    return response.json();
  },

  getReviewsOnMyProperties: async () => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_URL}/reviews/my-properties`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch reviews on properties');
    return response.json();
  },

  updateReview: async (reviewId, reviewData) => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_URL}/reviews/${reviewId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(reviewData),
    });
    if (!response.ok) throw new Error('Failed to update review');
    return response.json();
  },

  deleteReview: async (reviewId) => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_URL}/reviews/${reviewId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to delete review');
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
