import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://homez-q5lh.onrender.com/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
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
    const token = getAuthToken();
    console.log('Fetching properties with status:', status);
    console.log('Auth token present:', !!token);
    console.log('API URL:', API_URL);

    const response = await apiClient.get(`/property/admin/approval?status=${status}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('API Response:', response.data);
    console.log('Properties count:', response.data.properties?.length || 0);

    return response.data.properties || [];
  } catch (error) {
    console.error('Error fetching properties for approval:', error);
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
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
