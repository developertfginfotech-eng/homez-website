'use client';
import { useState, useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import PropertyCard from './PropertyCard';
import { chatAPI } from '@/services/chatApi';
import styles from './ChatWidget.module.scss';

export default function ChatInterface({ sessionId, onClose }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hi! I\'m your AI property assistant. Ask me anything like "Show me 3 bedroom apartments under $500k in Toronto"',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProperties, setSelectedProperties] = useState([]);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load chat history from localStorage
  useEffect(() => {
    if (!sessionId) return;

    const history = localStorage.getItem(`chat_${sessionId}`);
    if (history) {
      try {
        setMessages(JSON.parse(history));
      } catch (e) {
        console.error('Failed to load chat history:', e);
      }
    }
  }, [sessionId]);

  // Save chat history
  useEffect(() => {
    if (messages.length > 1 && sessionId) {
      localStorage.setItem(`chat_${sessionId}`, JSON.stringify(messages));
    }
  }, [messages, sessionId]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await chatAPI.sendMessage(
        userMessage.content,
        sessionId,
        messages.slice(-10)
      );

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.message || response.aiResponse,
        properties: response.properties || [],
        filters: response.filters,
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompareProperties = async () => {
    if (selectedProperties.length < 2 || selectedProperties.length > 4) {
      alert('Please select 2-4 properties to compare');
      return;
    }

    setIsLoading(true);
    try {
      const response = await chatAPI.compareProperties(selectedProperties);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.comparison.message || 'Comparison complete',
        comparisonData: response.comparison,
        timestamp: new Date()
      }]);
      setSelectedProperties([]);
    } catch (error) {
      console.error('Comparison error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I could not compare the properties. Please try again.',
        timestamp: new Date(),
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.chatInterface}>
      {/* Header */}
      <div className={styles.chatHeader}>
        <div>
          <h4>AI Property Assistant</h4>
          <span className={styles.status}>
            <span className={styles.statusDot}></span> Online
          </span>
        </div>
        <button onClick={onClose} className={styles.closeButton}>
          <i className="fas fa-times" />
        </button>
      </div>

      {/* Messages */}
      <div className={styles.chatMessages}>
        {messages.map((msg, index) => (
          <div key={index}>
            <ChatMessage message={msg} />
            {msg.properties && msg.properties.length > 0 && (
              <div className={styles.propertiesContainer}>
                {msg.properties.map(property => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    isSelected={selectedProperties.includes(property.id)}
                    onSelect={(id) => {
                      setSelectedProperties(prev =>
                        prev.includes(id)
                          ? prev.filter(p => p !== id)
                          : [...prev, id]
                      );
                    }}
                  />
                ))}
                {selectedProperties.length >= 2 && (
                  <button
                    onClick={handleCompareProperties}
                    className={styles.compareButton}
                  >
                    Compare Selected ({selectedProperties.length})
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className={styles.loadingIndicator}>
            <span></span><span></span><span></span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className={styles.chatInput}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Ask about properties..."
          disabled={isLoading}
        />
        <button
          onClick={handleSendMessage}
          disabled={isLoading || !inputValue.trim()}
          className={styles.sendButton}
        >
          <i className="fas fa-paper-plane" />
        </button>
      </div>

      {/* Quick Actions */}
      <div className={styles.quickActions}>
        <button onClick={() => setInputValue('Show houses under $500k')}>
          Houses under $500k
        </button>
        <button onClick={() => setInputValue('3 bedroom apartments with gym')}>
          3BR with gym
        </button>
      </div>
    </div>
  );
}
