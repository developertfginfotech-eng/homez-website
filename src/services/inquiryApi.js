const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

function getAuthHeaders() {
  const token = typeof window !== 'undefined' ? (localStorage.getItem('authToken') || localStorage.getItem('token')) : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export const inquiryAPI = {
  getInquiries: async () => {
    const res = await fetch(`${API_URL}/inquiries`, { headers: getAuthHeaders() });
    return res.json();
  },

  getInquiry: async (id) => {
    const res = await fetch(`${API_URL}/inquiries/${id}`, { headers: getAuthHeaders() });
    return res.json();
  },

  reply: async (id, content) => {
    const res = await fetch(`${API_URL}/inquiries/${id}/reply`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ content }),
    });
    return res.json();
  },

  deleteInquiry: async (id) => {
    const res = await fetch(`${API_URL}/inquiries/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  getUnreadCount: async () => {
    const res = await fetch(`${API_URL}/inquiries/unread-count`, { headers: getAuthHeaders() });
    return res.json();
  },
};
