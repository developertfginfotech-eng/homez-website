'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { chatAPI } from '@/services/chatApi';
import { aiAPI } from '@/services/aiApi';
import Link from 'next/link';

const QUICK_ACTIONS = [
  { icon: '🏠', label: 'Find Properties', prompt: 'Show me the best properties available right now' },
  { icon: '💰', label: 'Investment Advice', prompt: 'Which properties are best for investment with high ROI?' },
  { icon: '🔑', label: 'Rentals', prompt: 'Show me properties available for rent' },
  { icon: '🏖️', label: 'Dubai Luxury', prompt: 'Show me luxury apartments in Dubai' },
  { icon: '🌍', label: 'Compare Markets', prompt: 'Compare real estate investment in UAE vs UK vs Australia' },
  { icon: '📊', label: 'Market Trends', prompt: 'What are the current real estate market trends globally?' },
];

const STARTERS = [
  '"3 bedroom apartment in Dubai under $500k"',
  '"Best investment properties right now"',
  '"Show rentals in London"',
  '"Compare UAE vs Portugal market"',
];

function TypingDots() {
  return (
    <div style={{ display: 'flex', gap: '5px', alignItems: 'center', height: '20px' }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{
          width: '7px', height: '7px', borderRadius: '50%',
          background: '#eb6753', display: 'inline-block',
          animation: `copilotBounce 1.2s ease-in-out ${i * 0.2}s infinite`,
        }} />
      ))}
      <style>{`
        @keyframes copilotBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.35; }
          30% { transform: translateY(-7px); opacity: 1; }
        }
        @keyframes copilotFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes copilotPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(235,103,83,0.5); }
          50% { box-shadow: 0 0 0 8px rgba(235,103,83,0); }
        }
      `}</style>
    </div>
  );
}

function PropertyCard({ property, isSelected, onSelect }) {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'https://homez-q5lh.onrender.com';
  // Chat API returns images as a string, direct API returns images as an array
  let imageUrl = '/images/listings/list-1.jpg';
  if (property.images && typeof property.images === 'string' && property.images.length > 0) {
    imageUrl = property.images.startsWith('http') ? property.images : `${API_BASE}${property.images}`;
  } else if (Array.isArray(property.images) && property.images.length > 0) {
    const img = property.images[0];
    imageUrl = img.startsWith('http') ? img : `${API_BASE}${img}`;
  } else if (property.image) {
    imageUrl = property.image.startsWith('http') ? property.image : `${API_BASE}${property.image}`;
  }

  const price = property.price
    ? (typeof property.price === 'number' ? `$${property.price.toLocaleString()}` : property.price)
    : 'Price on request';

  return (
    <div
      onClick={() => onSelect?.(property._id || property.id)}
      style={{
        width: '180px', flexShrink: 0, borderRadius: '14px', overflow: 'hidden',
        background: 'white', cursor: 'pointer',
        border: isSelected ? '2px solid #eb6753' : '1.5px solid #f0f0f0',
        boxShadow: isSelected ? '0 6px 20px rgba(235,103,83,0.2)' : '0 2px 12px rgba(0,0,0,0.06)',
        transform: isSelected ? 'translateY(-3px)' : 'none',
        transition: 'all 0.2s',
      }}
    >
      <div style={{ height: '110px', background: '#f3f4f6', position: 'relative', overflow: 'hidden' }}>
        <img src={imageUrl} alt={property.title || 'Property'} onError={e => { e.target.src = '/images/listings/list-1.jpg'; }}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        {isSelected && (
          <div style={{
            position: 'absolute', top: 8, right: 8, width: 22, height: 22, borderRadius: '50%',
            background: '#eb6753', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 700,
          }}>✓</div>
        )}
        <div style={{
          position: 'absolute', bottom: 7, left: 7,
          background: property.propertyAdType === 'rent' ? '#3b82f6' : '#10b981',
          color: 'white', borderRadius: 5, padding: '2px 8px', fontSize: 10, fontWeight: 700,
        }}>
          {property.propertyAdType === 'rent' ? 'RENT' : 'SALE'}
        </div>
      </div>
      <div style={{ padding: '10px 12px' }}>
        <div style={{ fontWeight: 600, fontSize: 12, color: '#111', marginBottom: 3, lineHeight: 1.3 }}>
          {(property.title || 'Property').slice(0, 30)}{(property.title || '').length > 30 ? '…' : ''}
        </div>
        <div style={{ color: '#eb6753', fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{price}</div>
        <div style={{ color: '#9ca3af', fontSize: 11, display: 'flex', gap: 6 }}>
          {(property.bedrooms || property.bed) ? <span>🛏 {property.bedrooms || property.bed}</span> : null}
          {(property.bathrooms || property.bath) ? <span>🚿 {property.bathrooms || property.bath}</span> : null}
        </div>
        <div style={{ color: '#c0c4cc', fontSize: 10, marginTop: 3 }}>
          📍 {property.city || (property.location || '').split(',')[0] || 'N/A'}
        </div>
      </div>
    </div>
  );
}

function buildListingUrl(filters) {
  if (!filters) return '/grid-full-3-col';
  const p = new URLSearchParams();
  if (filters.city) p.set('search', filters.city);
  else if (filters.location) p.set('search', filters.location);
  if (filters.type === 'rent') p.set('type', 'Rent');
  else if (filters.type === 'sale') p.set('type', 'Sale');
  else p.set('type', 'All');
  if (filters.minBedrooms || filters.bedrooms) p.set('beds', filters.minBedrooms || filters.bedrooms);
  if (filters.maxPrice) p.set('maxPrice', filters.maxPrice);
  if (filters.propertyType) p.set('propertyType', filters.propertyType);
  if (filters.amenities?.gym) p.set('gym', 'true');
  if (filters.amenities?.swimmingPool || filters.amenities?.pool) p.set('pool', 'true');
  if (filters.amenities?.parking) p.set('parking', 'true');
  return `/grid-full-3-col?${p.toString()}`;
}

function renderText(content) {
  return content.split('\n').map((line, i, arr) => {
    const html = line
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em style="color:#eb6753">$1</em>');
    return (
      <span key={i}>
        <span dangerouslySetInnerHTML={{ __html: html }} />
        {i < arr.length - 1 && <br />}
      </span>
    );
  });
}

export default function GlobpertyCopilot() {
  const sessionId = useRef(`copilot_${Date.now()}`).current;
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [isComparing, setIsComparing] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const toggleVoice = useCallback(async () => {
    if (isTranscribing) return;

    if (isListening) {
      // Stop recording
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    // Start recording via MediaRecorder
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
          ? 'audio/webm'
          : 'audio/mp4';

      const recorder = new MediaRecorder(stream, { mimeType });
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        // Stop all tracks
        stream.getTracks().forEach(t => t.stop());

        if (audioChunksRef.current.length === 0) return;
        setIsTranscribing(true);
        try {
          const blob = new Blob(audioChunksRef.current, { type: mimeType });
          const base64 = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });

          const res = await aiAPI.transcribeVoice(base64, mimeType.split(';')[0]);
          if (res.success && res.data?.transcription) {
            setInputValue(res.data.transcription);
            setTimeout(() => inputRef.current?.focus(), 100);
          }
        } catch {
          // Silently fail — user can type instead
        } finally {
          setIsTranscribing(false);
        }
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsListening(true);
    } catch {
      alert('Microphone access denied. Please allow microphone access and try again.');
    }
  }, [isListening, isTranscribing]);

  const sendMessage = useCallback(async (text) => {
    const trimmed = (text || inputValue).trim();
    if (!trimmed || isLoading) return;
    setShowWelcome(false);
    setMessages(prev => [...prev, { role: 'user', content: trimmed, timestamp: new Date() }]);
    setInputValue('');
    setIsLoading(true);
    try {
      const resp = await chatAPI.sendMessage(trimmed, sessionId, messages.slice(-10));
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: resp.message || resp.aiResponse || "Here's what I found:",
        properties: resp.properties || [],
        filters: resp.filters || null,
        timestamp: new Date(),
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant', content: 'Sorry, something went wrong. Please try again.', isError: true, timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [inputValue, isLoading, messages, sessionId]);

  const handleCompare = async () => {
    if (selectedProperties.length < 2) return;
    setIsComparing(true);
    try {
      const resp = await chatAPI.compareProperties(selectedProperties);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: resp.comparison?.message || 'Comparison complete',
        comparisonData: resp.comparison,
        timestamp: new Date(),
      }]);
      setSelectedProperties([]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant', content: 'Could not compare. Please try again.', isError: true, timestamp: new Date(),
      }]);
    } finally {
      setIsComparing(false);
    }
  };

  const toggleSelect = (id) => setSelectedProperties(prev =>
    prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
  );

  return (
    <div style={{
      display: 'flex', height: '100vh',
      fontFamily: "'Inter', -apple-system, sans-serif",
      background: '#f5f5f7',
    }}>

      {/* ===== LEFT SIDEBAR ===== */}
      <div style={{
        width: '260px', flexShrink: 0,
        background: 'linear-gradient(180deg, #0f0f1a 0%, #1a1a2e 60%, #16213e 100%)',
        display: 'flex', flexDirection: 'column',
        padding: '28px 20px',
        gap: '28px',
        overflowY: 'auto',
      }}>
        {/* Logo */}
        <div>
          <div style={{
            width: 50, height: 50, borderRadius: 16,
            background: 'linear-gradient(135deg, #eb6753, #f59e0b)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 26, marginBottom: 14,
            boxShadow: '0 6px 20px rgba(235,103,83,0.4)',
          }}>🤖</div>
          <div style={{ color: 'white', fontWeight: 700, fontSize: 18 }}>Globperty AI Copilot</div>
          <div style={{ color: '#64748b', fontSize: 12, marginTop: 4 }}>
            <span style={{ color: '#4ade80', fontSize: 9 }}>●</span>
            {' '}Ask anything about real estate — globally
          </div>
        </div>

        {/* New Chat */}
        <button
          onClick={() => { setMessages([]); setShowWelcome(true); setSelectedProperties([]); }}
          style={{
            background: 'rgba(255,255,255,0.06)', color: 'white', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 10, padding: '10px 14px', cursor: 'pointer', fontSize: 13, fontWeight: 500,
            display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(235,103,83,0.15)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
        >
          <span style={{ fontSize: 16 }}>✨</span> New Conversation
        </button>

        {/* Quick Actions */}
        <div>
          <div style={{ color: '#4b5563', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>
            Quick Actions
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {QUICK_ACTIONS.map((a, i) => (
              <button key={i} onClick={() => sendMessage(a.prompt)} disabled={isLoading}
                style={{
                  background: 'transparent', color: '#94a3b8', border: 'none', borderRadius: 9,
                  padding: '10px 12px', cursor: isLoading ? 'not-allowed' : 'pointer',
                  fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 10,
                  textAlign: 'left', transition: 'all 0.15s', opacity: isLoading ? 0.5 : 1,
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'white'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8'; }}
              >
                <span style={{ fontSize: 16 }}>{a.icon}</span> {a.label}
              </button>
            ))}
          </div>
        </div>

        {/* Back to Home */}
        <div style={{ marginTop: 'auto' }}>
          <Link href="/" style={{
            color: 'white', fontSize: 13, fontWeight: 600, textDecoration: 'none',
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 14px', borderRadius: 10, transition: 'all 0.15s',
            background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(235,103,83,0.15)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
          >
            <span style={{ fontSize: 15 }}>🏠</span> Back to Home
          </Link>
        </div>
      </div>

      {/* ===== MAIN CHAT AREA ===== */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Top bar */}
        <div style={{
          background: 'white', borderBottom: '1px solid #e8e8ec',
          padding: '14px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: '#111' }}>Globperty AI Copilot</div>
            <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 1 }}>
              Ask anything about real estate — globally
            </div>
          </div>
          {selectedProperties.length >= 2 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 13, color: '#6b7280' }}>
                {selectedProperties.length} selected
              </span>
              <button onClick={() => setSelectedProperties([])}
                style={{ background: '#f3f4f6', border: 'none', borderRadius: 7, padding: '6px 12px', fontSize: 12, cursor: 'pointer', color: '#6b7280' }}>
                Clear
              </button>
              <button onClick={handleCompare} disabled={isComparing}
                style={{ background: '#eb6753', color: 'white', border: 'none', borderRadius: 7, padding: '7px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                {isComparing ? 'Comparing…' : 'Compare Now'}
              </button>
            </div>
          )}
        </div>

        {/* Messages */}
        <div style={{
          flex: 1, overflowY: 'auto', padding: '32px 28px',
          display: 'flex', flexDirection: 'column', gap: 24,
        }}>

          {/* Welcome Screen */}
          {showWelcome && messages.length === 0 && (
            <div style={{
              textAlign: 'center', paddingTop: 40,
              animation: 'copilotFadeIn 0.5s ease',
            }}>
              <div style={{ fontSize: 52, marginBottom: 16 }}>🤖</div>
              <h2 style={{ fontSize: 28, fontWeight: 800, color: '#111', marginBottom: 8 }}>
                How can I help you today?
              </h2>
              <p style={{ fontSize: 15, color: '#6b7280', marginBottom: 40, maxWidth: 460, margin: '0 auto 40px' }}>
                I can find properties, give investment advice, compare markets, and much more.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, maxWidth: 540, margin: '0 auto' }}>
                {STARTERS.map((s, i) => (
                  <button key={i} onClick={() => sendMessage(s.replace(/"/g, ''))}
                    style={{
                      background: 'white', border: '1.5px solid #e5e7eb', borderRadius: 14,
                      padding: '14px 16px', cursor: 'pointer', textAlign: 'left',
                      fontSize: 13, color: '#374151', lineHeight: 1.5,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)', transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#eb6753'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(235,103,83,0.12)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)'; }}
                  >
                    <span style={{ color: '#9ca3af', marginRight: 6 }}>→</span>{s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chat Messages */}
          {messages.map((msg, idx) => (
            <div key={idx} style={{
              display: 'flex', gap: 14,
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              animation: 'copilotFadeIn 0.3s ease',
            }}>
              {msg.role === 'assistant' && (
                <div style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0, marginTop: 2,
                  background: 'linear-gradient(135deg, #eb6753, #f59e0b)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                }}>🤖</div>
              )}

              <div style={{ maxWidth: '72%' }}>
                <div style={{
                  padding: '13px 18px', borderRadius: msg.role === 'user' ? '18px 18px 6px 18px' : '6px 18px 18px 18px',
                  background: msg.role === 'user'
                    ? 'linear-gradient(135deg, #eb6753, #d94f3c)'
                    : msg.isError ? '#fff1f0' : 'white',
                  color: msg.role === 'user' ? 'white' : msg.isError ? '#c0392b' : '#1a1a1a',
                  fontSize: 14, lineHeight: 1.7,
                  boxShadow: msg.role === 'user'
                    ? '0 4px 16px rgba(235,103,83,0.3)'
                    : '0 2px 12px rgba(0,0,0,0.07)',
                  border: msg.isError ? '1px solid #ffd6d6' : 'none',
                }}>
                  {renderText(msg.content)}
                </div>

                {/* Property Cards */}
                {msg.properties?.length > 0 && (
                  <div style={{ marginTop: 16 }}>
                    <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 10, fontWeight: 500 }}>
                      {msg.properties.length} properties found · click to select for comparison
                    </div>
                    <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8, scrollbarWidth: 'thin' }}>
                      {msg.properties.slice(0, 6).map((prop, pi) => (
                        <PropertyCard
                          key={prop._id || prop.id || pi}
                          property={prop}
                          isSelected={selectedProperties.includes(prop._id || prop.id)}
                          onSelect={toggleSelect}
                        />
                      ))}
                    </div>
                    {msg.filters && (
                      <Link href={buildListingUrl(msg.filters)} style={{
                        marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 7,
                        background: '#111', color: 'white', padding: '10px 20px', borderRadius: 10,
                        textDecoration: 'none', fontSize: 13, fontWeight: 600,
                        boxShadow: '0 3px 12px rgba(0,0,0,0.15)', transition: 'all 0.2s',
                      }}>
                        View All Properties →
                      </Link>
                    )}
                  </div>
                )}

                {/* Comparison Table */}
                {msg.comparisonData?.criteria && (
                  <div style={{ marginTop: 14, background: 'white', borderRadius: 14, padding: '16px 18px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12, color: '#111' }}>📊 Comparison</div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                      <tbody>
                        {Object.entries(msg.comparisonData.criteria).map(([k, v]) => (
                          <tr key={k} style={{ borderBottom: '1px solid #f5f5f7' }}>
                            <td style={{ padding: '8px 0', color: '#6b7280', textTransform: 'capitalize', width: '35%' }}>{k.replace(/([A-Z])/g, ' $1')}</td>
                            <td style={{ padding: '8px 0', color: '#111' }}>{typeof v === 'object' ? JSON.stringify(v) : String(v)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <div style={{ fontSize: 10, color: '#c0c4cc', marginTop: 5, textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>

              {msg.role === 'user' && (
                <div style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0, marginTop: 2,
                  background: '#1a1a2e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17,
                }}>👤</div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {isLoading && (
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', animation: 'copilotFadeIn 0.3s ease' }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                background: 'linear-gradient(135deg, #eb6753, #f59e0b)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
              }}>🤖</div>
              <div style={{ background: 'white', padding: '14px 18px', borderRadius: '6px 18px 18px 18px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
                <TypingDots />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ===== INPUT BAR ===== */}
        <div style={{
          padding: '16px 28px 20px',
          background: 'white',
          borderTop: '1px solid #e8e8ec',
          flexShrink: 0,
        }}>
          <div style={{
            display: 'flex', gap: 10, alignItems: 'center',
            background: '#f5f5f7', borderRadius: 14,
            padding: '8px 8px 8px 16px',
            border: '1.5px solid transparent',
            transition: 'all 0.2s',
          }}
          onFocus={() => {}}
          >
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder={isTranscribing ? '⏳ Transcribing with Globperty AI…' : isListening ? '🎤 Recording… click mic to stop' : 'Ask anything about real estate…'}
              disabled={isLoading || isTranscribing}
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                fontSize: 14, color: '#111', padding: '6px 0',
              }}
            />
            <button
              onClick={toggleVoice}
              title={isTranscribing ? 'Transcribing…' : isListening ? 'Stop recording' : 'Voice input (Globperty AI)'}
              disabled={isTranscribing}
              style={{
                width: 38, height: 38, borderRadius: 10, border: 'none', flexShrink: 0,
                background: isTranscribing ? '#f59e0b' : isListening ? '#ef4444' : '#e8e8ec',
                cursor: isTranscribing ? 'not-allowed' : 'pointer',
                fontSize: 17, display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s',
                animation: (isListening || isTranscribing) ? 'copilotPulse 1s ease-in-out infinite' : 'none',
              }}>
              {isTranscribing ? '⏳' : '🎤'}
            </button>
            <button onClick={() => sendMessage()} disabled={isLoading || !inputValue.trim()}
              style={{
                height: 38, padding: '0 18px', borderRadius: 10, border: 'none', flexShrink: 0,
                background: (!inputValue.trim() || isLoading) ? '#d1d5db' : 'linear-gradient(135deg, #eb6753, #d94f3c)',
                color: (!inputValue.trim() || isLoading) ? '#9ca3af' : 'white',
                cursor: (!inputValue.trim() || isLoading) ? 'not-allowed' : 'pointer',
                fontWeight: 700, fontSize: 14, transition: 'all 0.2s',
              }}>
              {isLoading ? '…' : 'Send'}
            </button>
          </div>
          <div style={{ textAlign: 'center', fontSize: 11, color: '#c0c4cc', marginTop: 9 }}>
            Globperty AI · Results may vary
          </div>
        </div>
      </div>
    </div>
  );
}
