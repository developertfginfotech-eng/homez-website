'use client';
import { useState, useEffect, useCallback } from 'react';
import { aiAPI } from '@/services/aiApi';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export default function AIAutoResponse({ propertyId }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [reply, setReply] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [inquiryId, setInquiryId] = useState(null);
  const [agentReplies, setAgentReplies] = useState([]);
  const [checkingReplies, setCheckingReplies] = useState(false);
  const [lastChecked, setLastChecked] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const resp = await aiAPI.generateAutoResponse({
        propertyId,
        userName: name,
        userEmail: email,
        userMessage: message,
        inquiryType: 'general',
      });
      if (resp.success && resp.data?.message) {
        setReply(resp.data);
        setSubmitted(true);
        if (resp.data.inquiryId) {
          setInquiryId(resp.data.inquiryId);
        }
      } else {
        setError('Could not generate response. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Failed to send inquiry.');
    } finally {
      setLoading(false);
    }
  };

  const checkForReplies = useCallback(async () => {
    if (!inquiryId) return;
    setCheckingReplies(true);
    try {
      const res = await fetch(`${API_URL}/inquiries/public/${inquiryId}`);
      const data = await res.json();
      if (data.success) {
        const agentMsgs = data.data.messages.filter(m => m.sender === 'agent');
        setAgentReplies(agentMsgs);
        setLastChecked(new Date());
      }
    } catch (err) {
      console.error('Check replies error:', err);
    } finally {
      setCheckingReplies(false);
    }
  }, [inquiryId]);

  // Auto-check for replies every 30 seconds after submission
  useEffect(() => {
    if (!inquiryId) return;
    checkForReplies();
    const interval = setInterval(checkForReplies, 30000);
    return () => clearInterval(interval);
  }, [inquiryId, checkForReplies]);

  const handleReset = () => {
    setSubmitted(false);
    setReply(null);
    setName('');
    setEmail('');
    setMessage('');
    setInquiryId(null);
    setAgentReplies([]);
    setLastChecked(null);
  };

  return (
    <div className="mb30">
      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <h6 style={{ fontWeight: 700, fontSize: 15, color: '#111827', marginBottom: 4 }}>
          <i className="fas fa-robot me-2" style={{ color: '#7C3AED' }} />
          AI Instant Response
        </h6>
        <p style={{ fontSize: 12, color: '#6B7280', margin: 0 }}>
          Send your inquiry and get an AI-powered instant reply
        </p>
      </div>

      {!submitted ? (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 10 }}>
            <input
              type="text"
              className="form-control"
              placeholder="Your Name *"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ fontSize: 13, borderRadius: 8 }}
            />
          </div>
          <div style={{ marginBottom: 10 }}>
            <input
              type="email"
              className="form-control"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ fontSize: 13, borderRadius: 8 }}
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <textarea
              className="form-control"
              placeholder="Your message about this property... *"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              style={{ fontSize: 13, borderRadius: 8, resize: 'none' }}
            />
          </div>

          {error && (
            <div style={{ fontSize: 12, color: '#DC2626', marginBottom: 10, padding: '8px 12px', background: '#FEF2F2', borderRadius: 6 }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !name.trim() || !message.trim()}
            className="btn w-100"
            style={{
              background: 'linear-gradient(135deg, #7C3AED, #5B21B6)',
              color: 'white', borderRadius: 10, padding: '12px 20px',
              fontSize: 14, fontWeight: 600, border: 'none',
              opacity: loading || !name.trim() || !message.trim() ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading
              ? <><span className="spinner-border spinner-border-sm me-2" role="status" />Getting AI Response…</>
              : <><i className="fas fa-paper-plane me-2" />Send &amp; Get Instant Reply</>
            }
          </button>
        </form>
      ) : (
        <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
          {/* User message bubble */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
            <div style={{
              maxWidth: '85%', background: '#7C3AED', color: 'white',
              borderRadius: '16px 16px 4px 16px', padding: '10px 14px', fontSize: 13,
            }}>
              <div style={{ fontWeight: 600, fontSize: 11, marginBottom: 4, opacity: 0.8 }}>{name}</div>
              {message}
            </div>
          </div>

          {/* AI reply bubble */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
            <div style={{
              width: 34, height: 34, borderRadius: '50%',
              background: 'linear-gradient(135deg, #7C3AED, #5B21B6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <i className="fas fa-robot" style={{ color: 'white', fontSize: 14 }} />
            </div>
            <div style={{
              flex: 1, background: '#F5F3FF', border: '1px solid #DDD6FE',
              borderRadius: '4px 16px 16px 16px', padding: '12px 14px',
              fontSize: 13, color: '#1F2937', lineHeight: 1.6,
            }}>
              <div style={{ fontWeight: 700, fontSize: 11, color: '#7C3AED', marginBottom: 6 }}>
                <i className="fas fa-robot me-1" />AI Property Assistant
              </div>
              {reply.message}
              {reply.agentName && (
                <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid #DDD6FE', fontSize: 12, color: '#6B7280' }}>
                  <i className="fas fa-user-tie me-1" />
                  Agent: <strong>{reply.agentName}</strong>
                  {reply.agentPhone && <> · <i className="fas fa-phone me-1" />{reply.agentPhone}</>}
                </div>
              )}
            </div>
          </div>

          {/* Agent reply section */}
          {agentReplies.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              {agentReplies.map((msg, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: '50%',
                    background: '#059669', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', flexShrink: 0,
                  }}>
                    <i className="fas fa-user-tie" style={{ color: 'white', fontSize: 13 }} />
                  </div>
                  <div style={{
                    flex: 1, background: '#F0FDF4', border: '1px solid #BBF7D0',
                    borderRadius: '4px 16px 16px 16px', padding: '12px 14px',
                    fontSize: 13, color: '#1F2937', lineHeight: 1.6,
                  }}>
                    <div style={{ fontWeight: 700, fontSize: 11, color: '#059669', marginBottom: 6 }}>
                      <i className="fas fa-user-tie me-1" />{msg.senderName} (Agent Reply)
                    </div>
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Check for replies button */}
          {inquiryId && (
            <div style={{
              background: agentReplies.length > 0 ? '#F0FDF4' : '#F9FAFB',
              border: `1px solid ${agentReplies.length > 0 ? '#BBF7D0' : '#E5E7EB'}`,
              borderRadius: 10, padding: '10px 14px', marginBottom: 12,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{ fontSize: 12, color: '#6B7280' }}>
                {agentReplies.length > 0
                  ? <><i className="fas fa-check-circle me-1" style={{ color: '#059669' }} />Agent has replied!</>
                  : <><i className="fas fa-clock me-1" />Waiting for agent reply…</>
                }
                {lastChecked && (
                  <span style={{ marginLeft: 8, fontSize: 11, color: '#9CA3AF' }}>
                    Checked {Math.round((Date.now() - lastChecked) / 1000)}s ago
                  </span>
                )}
              </div>
              <button
                onClick={checkForReplies}
                disabled={checkingReplies}
                style={{
                  fontSize: 11, fontWeight: 600, color: '#7C3AED',
                  background: 'none', border: '1px solid #DDD6FE',
                  borderRadius: 6, padding: '4px 10px', cursor: 'pointer',
                }}
              >
                {checkingReplies
                  ? <><span className="spinner-border spinner-border-sm me-1" style={{ width: 10, height: 10 }} />Checking…</>
                  : <><i className="fas fa-sync-alt me-1" />Check Now</>
                }
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={handleReset}
            style={{ fontSize: 12, color: '#7C3AED', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <i className="fas fa-redo me-1" />Send another inquiry
          </button>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
