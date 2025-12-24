import axios from 'axios';

const API_URL = 'http://16.16.211.219:5000/api';
// For local testing, use:
// const API_URL = 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Get pending properties
export const getPendingProperties = async () => {
  try {
    const response = await apiClient.get('/property/admin/pending', {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return response.data.properties || [];
  } catch (error) {
    console.error('Error fetching pending properties:', error);
    throw error.response?.data || error;
  }
};

// Get all properties with filter
export const getPropertiesForApproval = async (status = 'all') => {
  try {
    const response = await apiClient.get(`/property/admin/approval?status=${status}`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return response.data.properties || [];
  } catch (error) {
    console.error('Error fetching properties for approval:', error);
    throw error.response?.data || error;
  }
};

// Approve property
export const approveProperty = async (propertyId) => {
  try {
    const response = await apiClient.put(
      `/property/admin/approve/${propertyId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error approving property:', error);
    throw error.response?.data || error;
  }
};

// Reject property
export const rejectProperty = async (propertyId, reason) => {
  try {
    const response = await apiClient.put(
      `/property/admin/reject/${propertyId}`,
      { reason },
      {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error rejecting property:', error);
    throw error.response?.data || error;
  }
};
