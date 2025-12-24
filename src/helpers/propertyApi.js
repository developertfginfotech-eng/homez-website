import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://16.16.211.219:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Add new property
export const addProperty = async (propertyData) => {
  try {
    // Check if propertyData is FormData (for file uploads)
    const isFormData = propertyData instanceof FormData;

    const headers = {
      Authorization: `Bearer ${getAuthToken()}`,
    };

    // For FormData, don't set Content-Type - axios will set it automatically with boundary
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await apiClient.post('/property/add', propertyData, {
      headers,
    });
    return response.data;
  } catch (error) {
    console.error('Error adding property:', error);
    throw error.response?.data || error;
  }
};

// Get all properties
export const getAllProperties = async () => {
  try {
    const response = await apiClient.get('/property/all');
    return response.data.properties || [];
  } catch (error) {
    console.error('Error fetching properties:', error);
    throw error;
  }
};

// Get properties by agent
export const getPropertiesByAgent = async () => {
  try {
    const response = await apiClient.get('/property/agent/properties', {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return {
      success: true,
      data: response.data.properties || response.data.data || [],
    };
  } catch (error) {
    console.error('Error fetching agent properties:', error);
    return {
      success: false,
      data: [],
      error: error.response?.data?.message || error.message,
    };
  }
};

// Get property by ID
export const getPropertyById = async (propertyId) => {
  try {
    const response = await apiClient.get(`/property/${propertyId}`);
    return response.data.property;
  } catch (error) {
    console.error('Error fetching property:', error);
    throw error;
  }
};

// Update property
export const updateProperty = async (propertyId, propertyData) => {
  try {
    const response = await apiClient.put(`/property/${propertyId}`, propertyData, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating property:', error);
    throw error.response?.data || error;
  }
};

// Delete property
export const deleteProperty = async (propertyId) => {
  try {
    const response = await apiClient.delete(`/property/${propertyId}`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting property:', error);
    throw error.response?.data || error;
  }
};
