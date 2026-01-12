const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://globperty-q5lh.onrender.com/api';

// Get auth token from localStorage
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

// Property API endpoints
export const propertyAPI = {
  // Create new property
  createProperty: async (propertyData) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/property/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(propertyData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create property');
      }

      return data;
    } catch (error) {
      console.error('Create property error:', error);
      throw error;
    }
  },

  // Get all properties
  getAllProperties: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const url = `${API_URL}/property/all${queryParams ? `?${queryParams}` : ''}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch properties');
      }

      return data;
    } catch (error) {
      console.error('Get properties error:', error);
      throw error;
    }
  },

  // Get user's properties
  getMyProperties: async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/property/agent/properties`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch properties');
      }

      return data;
    } catch (error) {
      console.error('Get my properties error:', error);
      throw error;
    }
  },

  // Get property by ID
  getPropertyById: async (id) => {
    try {
      const response = await fetch(`${API_URL}/property/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch property');
      }

      return data;
    } catch (error) {
      console.error('Get property error:', error);
      throw error;
    }
  },

  // Update property
  updateProperty: async (id, propertyData) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/property/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(propertyData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update property');
      }

      return data;
    } catch (error) {
      console.error('Update property error:', error);
      throw error;
    }
  },

  // Delete property
  deleteProperty: async (id) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/property/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete property');
      }

      return data;
    } catch (error) {
      console.error('Delete property error:', error);
      throw error;
    }
  },
};

// Auth API endpoints
export const authAPI = {
  // Login
  login: async (credentials) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store token
      if (data.token && typeof window !== 'undefined') {
        localStorage.setItem('authToken', data.token);
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Register
  register: async (userData) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Store token
      if (data.token && typeof window !== 'undefined') {
        localStorage.setItem('authToken', data.token);
      }

      return data;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  },

  // Logout
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to get user');
      }

      return data;
    } catch (error) {
      console.error('Get user error:', error);
      throw error;
    }
  },
};

export default {
  property: propertyAPI,
  auth: authAPI,
};
