const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const chatAPI = {
  /**
   * Send a chat message to the AI assistant
   * @param {string} message - User's message
   * @param {string} sessionId - Session ID for context
   * @param {Array} conversationHistory - Previous messages for context
   * @returns {Promise<Object>} Response with message, properties, and filters
   */
  sendMessage: async (message, sessionId, conversationHistory = []) => {
    const token = localStorage.getItem('authToken');
    const headers = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/chat/query`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ message, sessionId, conversationHistory }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      const msg = error.message || '';
      if (response.status === 429 || msg.includes('429') || msg.toLowerCase().includes('quota')) {
        throw new Error('AI is temporarily busy. Please wait a moment and try again.');
      }
      throw new Error(msg || 'Failed to send message');
    }
    return response.json();
  },

  /**
   * Compare multiple properties
   * @param {Array<string>} propertyIds - Array of property IDs to compare
   * @returns {Promise<Object>} Comparison results
   */
  compareProperties: async (propertyIds) => {
    const token = localStorage.getItem('authToken');
    const headers = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/chat/compare`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ propertyIds }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to compare properties');
    }
    return response.json();
  },
};
