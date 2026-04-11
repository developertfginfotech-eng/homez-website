'use client';
import React, { useState } from "react";
import { aiAPI } from "@/services/aiApi";

const ChatBoxForm = () => {
  const [message, setMessage] = useState('');
  const [generating, setGenerating] = useState(false);
  const [showAIButton, setShowAIButton] = useState(true);

  const handleGenerateAIResponse = async () => {
    // For demo purposes, using default data
    // In production, this would use actual property and user data
    setGenerating(true);

    try {
      const inquiryData = {
        propertyId: "demo-property-id", // This would come from context
        userName: "Interested Buyer", // This would come from the message thread
        userMessage: "I'm interested in this property. Can you tell me more?", // Last message from buyer
        inquiryType: "general"
      };

      const response = await aiAPI.generateAutoResponse(inquiryData);

      if (response.success && response.data) {
        setMessage(response.data.message);
        setShowAIButton(false);
        alert('✨ AI response generated! You can edit it before sending.');
      }
    } catch (error) {
      console.error('AI response error:', error);
      alert('Failed to generate response. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle message send here
    console.log('Sending message:', message);
    setMessage('');
    setShowAIButton(true);
  };

  return (
    <>
      {showAIButton && (
        <div className="mb-2">
          <button
            type="button"
            className="btn btn-sm"
            onClick={handleGenerateAIResponse}
            disabled={generating}
            style={{
              backgroundColor: '#E0F2F1',
              color: '#00796B',
              border: '1px solid #00796B',
              padding: '8px 16px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: generating ? 'not-allowed' : 'pointer',
              opacity: generating ? 0.7 : 1,
            }}
          >
            {generating ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" />
                Generating AI Response...
              </>
            ) : (
              <>
                🤖 Generate AI Response
              </>
            )}
          </button>
          <small className="d-block text-muted mt-1" style={{ fontSize: '11px' }}>
            Click to auto-generate a professional response
          </small>
        </div>
      )}

      <form className="d-flex align-items-center" onSubmit={handleSubmit}>
        <input
          className="form-control"
          type="text"
          placeholder="Type a Message"
          aria-label="Search"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        <button type="submit" className="btn ud-btn btn-thm">
          Send Message
          <i className="fal fa-arrow-right-long" />
        </button>
      </form>
    </>
  );
};

export default ChatBoxForm;
