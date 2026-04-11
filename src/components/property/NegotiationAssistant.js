'use client';
import { useState } from 'react';
import { chatAPI } from '@/services/chatApi';
import { getPropertyById } from '@/helpers/propertyApi';

export default function NegotiationAssistant({ propertyId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [show, setShow] = useState(false);

  const handleGet = async () => {
    if (data) { setShow(s => !s); return; }
    setLoading(true);
    setError(null);
    try {
      const property = await getPropertyById(propertyId);
      const prompt = `You are a real estate negotiation expert. Analyze this property and give practical negotiation advice.

Property: ${property.title || 'Property'}
Type: ${property.propertyType || 'N/A'} | For: ${property.propertyAdType === 'rent' ? 'Rent' : 'Sale'}
Location: ${property.city || ''}, ${property.country || ''}
Price: $${(property.price || 0).toLocaleString()}
Size: ${property.sizeInFt || 'N/A'} sqft | Beds: ${property.bedrooms || 'N/A'} | Baths: ${property.bathrooms || 'N/A'}
Year Built: ${property.yearBuilt || 'N/A'}
Amenities: ${Array.isArray(property.amenities) ? property.amenities.join(', ') : 'N/A'}

Respond in this exact format:
OFFER_PRICE: [recommended offer price as a number]
OFFER_RANGE: [min - max range]
STRATEGY: [2-3 sentences on negotiation approach]
TALKING_POINTS:
- [point 1]
- [point 2]
- [point 3]
WATCH_OUT: [1-2 key cautions]`;

      const resp = await chatAPI.sendMessage(prompt, `neg_${propertyId}`, []);
      const text = resp.message || resp.aiResponse || '';

      // Parse structured response — handle plain and markdown bold formats (e.g. **OFFER_PRICE:**)
      const key = (k) => `\\*{0,2}${k}\\*{0,2}:?\\*{0,2}`;
      const offerPrice = text.match(new RegExp(`${key('OFFER_PRICE')}\\s*\\$?([\\d,]+)`))?.[1]?.replace(/,/g, '') || null;
      const offerRange = text.match(new RegExp(`${key('OFFER_RANGE')}\\s*(.+)`))?.[1]?.trim() || null;
      const strategy = text.match(new RegExp(`${key('STRATEGY')}\\s*([\\s\\S]+?)(?=${key('TALKING_POINTS')}|$)`))?.[1]?.trim() || null;
      const talkingPointsRaw = text.match(new RegExp(`${key('TALKING_POINTS')}([\\s\\S]+?)(?=${key('WATCH_OUT')}|$)`))?.[1] || '';
      const talkingPoints = talkingPointsRaw.split('\n').map(l => l.replace(/^[-•*\d.]\s*/, '').trim()).filter(Boolean);
      const watchOut = text.match(new RegExp(`${key('WATCH_OUT')}\\s*([\\s\\S]+?)$`))?.[1]?.trim() || null;

      const parsed = { offerPrice, offerRange, strategy, talkingPoints, watchOut, raw: text, price: property.price };
      const hasContent = offerPrice || offerRange || strategy || talkingPoints.length > 0 || watchOut;
      if (!hasContent) {
        // Fallback: show the raw AI response as strategy
        parsed.strategy = text.trim();
      }
      setData(parsed);
      setShow(true);
    } catch (err) {
      console.error('Negotiation assistant error:', err);
      setError('Could not generate negotiation advice. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb30">
      <button
        type="button"
        onClick={handleGet}
        disabled={loading}
        className="btn w-100"
        style={{
          backgroundColor: show ? '#EDE7F6' : '#673AB7',
          color: show ? '#673AB7' : 'white',
          border: show ? '2px solid #673AB7' : 'none',
          padding: '15px 20px',
          borderRadius: '12px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1,
          transition: 'all 0.3s ease',
          boxShadow: show ? 'none' : '0 4px 12px rgba(103,58,183,0.3)',
        }}
      >
        {loading ? (
          <><span className="spinner-border spinner-border-sm me-2" role="status" />Analyzing…</>
        ) : show ? (
          <><i className="fas fa-eye-slash me-2" />Hide Negotiation Strategy</>
        ) : (
          <><i className="fas fa-handshake me-2" />Get Negotiation Strategy</>
        )}
      </button>

      {error && (
        <div className="alert alert-warning mt-3 mb-0" style={{ borderRadius: '8px', fontSize: '14px' }}>
          <i className="fas fa-exclamation-triangle me-2" />
          {error}
        </div>
      )}

      {show && data && (
        <div className="mt-3" style={{ border: '2px solid #E5E7EB', borderRadius: '12px', overflow: 'hidden', animation: 'slideIn 0.3s ease-out' }}>
          {/* Header */}
          <div style={{ background: 'linear-gradient(135deg, #673AB7, #512DA8)', padding: '18px 20px' }}>
            <h5 style={{ color: 'white', marginBottom: 4, fontWeight: 700 }}>
              <i className="fas fa-handshake me-2" />Negotiation Strategy
            </h5>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, marginBottom: 0 }}>AI-powered advice based on market data</p>
          </div>

          <div style={{ padding: '20px', background: 'white' }}>
            {/* Recommended Offer */}
            {(data.offerPrice || data.offerRange) && (
              <div style={{ background: '#F3E5F5', borderRadius: 10, padding: 16, marginBottom: 16, border: '2px solid #CE93D8' }}>
                <div style={{ fontSize: 12, color: '#7B1FA2', fontWeight: 600, marginBottom: 6 }}>
                  <i className="fas fa-tag me-1" />RECOMMENDED OFFER
                </div>
                {data.offerPrice && (
                  <div style={{ fontSize: 28, fontWeight: 800, color: '#512DA8' }}>
                    ${parseInt(data.offerPrice).toLocaleString()}
                  </div>
                )}
                {data.offerRange && (
                  <div style={{ fontSize: 13, color: '#9C27B0', marginTop: 4 }}>Range: {data.offerRange}</div>
                )}
                {data.price && data.offerPrice && (
                  <div style={{ fontSize: 12, color: '#AB47BC', marginTop: 4 }}>
                    {Math.round((1 - parseInt(data.offerPrice) / data.price) * 100)}% below asking price
                  </div>
                )}
              </div>
            )}

            {/* Strategy */}
            {data.strategy && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 8 }}>
                  <i className="fas fa-chess me-2" style={{ color: '#673AB7' }} />Strategy
                </div>
                <p style={{ fontSize: 14, color: '#4B5563', lineHeight: 1.6, marginBottom: 0 }}>{data.strategy}</p>
              </div>
            )}

            {/* Talking Points */}
            {data.talkingPoints?.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 8 }}>
                  <i className="fas fa-comments me-2" style={{ color: '#673AB7' }} />Key Talking Points
                </div>
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                  {data.talkingPoints.map((pt, i) => (
                    <li key={i} style={{ fontSize: 13, color: '#4B5563', marginBottom: 6, lineHeight: 1.5 }}>{pt}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Watch Out */}
            {data.watchOut && (
              <div style={{ background: '#FFF9E6', borderRadius: 8, padding: 12, border: '1px solid #FFE082' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#F57C00', marginBottom: 6 }}>
                  <i className="fas fa-exclamation-triangle me-2" />Watch Out
                </div>
                <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 0, lineHeight: 1.5 }}>{data.watchOut}</p>
              </div>
            )}

            <div style={{ fontSize: 11, color: '#9CA3AF', fontStyle: 'italic', marginTop: 14, borderTop: '1px solid #E5E7EB', paddingTop: 10 }}>
              <i className="fas fa-info-circle me-1" />AI-generated strategy for guidance only. Consult a real estate professional.
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
