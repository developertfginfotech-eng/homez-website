'use client';
import { useState } from 'react';
import { chatAPI } from '@/services/chatApi';
import { getPropertyById } from '@/helpers/propertyApi';
import Link from 'next/link';

const COUNTRY_FLAGS = {
  'UAE': '🇦🇪', 'United Arab Emirates': '🇦🇪', 'Dubai': '🇦🇪',
  'UK': '🇬🇧', 'United Kingdom': '🇬🇧', 'London': '🇬🇧',
  'USA': '🇺🇸', 'United States': '🇺🇸',
  'Portugal': '🇵🇹', 'Lisbon': '🇵🇹',
  'Australia': '🇦🇺', 'Sydney': '🇦🇺', 'Melbourne': '🇦🇺',
  'Canada': '🇨🇦', 'Toronto': '🇨🇦',
  'Spain': '🇪🇸', 'Barcelona': '🇪🇸', 'Madrid': '🇪🇸',
  'Turkey': '🇹🇷', 'Istanbul': '🇹🇷',
  'India': '🇮🇳', 'Mumbai': '🇮🇳',
  'Singapore': '🇸🇬', 'Thailand': '🇹🇭', 'Bali': '🇮🇩', 'Indonesia': '🇮🇩',
  'Germany': '🇩🇪', 'France': '🇫🇷', 'Italy': '🇮🇹',
  'Cyprus': '🇨🇾', 'Malta': '🇲🇹', 'Greece': '🇬🇷',
};

function getFlag(location) {
  for (const [key, flag] of Object.entries(COUNTRY_FLAGS)) {
    if (location?.toLowerCase().includes(key.toLowerCase())) return flag;
  }
  return '🌍';
}

export default function CrossCountryMatcher({ propertyId }) {
  const [matches, setMatches] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [show, setShow] = useState(false);

  const handleGet = async () => {
    if (matches) { setShow(s => !s); return; }
    setLoading(true);
    setError(null);
    try {
      const property = await getPropertyById(propertyId);
      const prompt = `You are a global real estate expert. A buyer is looking at this property:

Property: ${property.title || 'Property'}
Type: ${property.propertyType || 'Residential'} | For: ${property.propertyAdType === 'rent' ? 'Rent' : 'Sale'}
Location: ${property.city || ''}, ${property.country || ''}
Price: $${(property.price || 0).toLocaleString()}
Beds: ${property.bedrooms || 'N/A'} | Size: ${property.sizeInFt || 'N/A'} sqft
Amenities: ${Array.isArray(property.amenities) ? property.amenities.join(', ') : 'Standard'}

Suggest 3 similar properties in OTHER countries with comparable investment potential. For each suggestion respond EXACTLY in this format:

MATCH_1:
COUNTRY: [country name]
CITY: [city name]
PRICE_RANGE: [price range like $200k-$350k]
PROPERTY_TYPE: [type]
ROI: [estimated ROI %]
WHY: [1-2 sentences on why it's a good alternative]

MATCH_2:
COUNTRY: [country name]
CITY: [city name]
PRICE_RANGE: [price range]
PROPERTY_TYPE: [type]
ROI: [estimated ROI %]
WHY: [1-2 sentences]

MATCH_3:
COUNTRY: [country name]
CITY: [city name]
PRICE_RANGE: [price range]
PROPERTY_TYPE: [type]
ROI: [estimated ROI %]
WHY: [1-2 sentences]`;

      const resp = await chatAPI.sendMessage(prompt, `match_${propertyId}`, []);
      const text = resp.message || resp.aiResponse || '';

      // Parse 3 matches
      const parsed = [1, 2, 3].map(n => {
        const block = text.match(new RegExp(`MATCH_${n}:[\\s\\S]+?(?=MATCH_${n + 1}:|$)`))?.[0] || '';
        return {
          country: block.match(/COUNTRY:\s*(.+)/)?.[1]?.trim() || '',
          city: block.match(/CITY:\s*(.+)/)?.[1]?.trim() || '',
          priceRange: block.match(/PRICE_RANGE:\s*(.+)/)?.[1]?.trim() || '',
          propertyType: block.match(/PROPERTY_TYPE:\s*(.+)/)?.[1]?.trim() || '',
          roi: block.match(/ROI:\s*(.+)/)?.[1]?.trim() || '',
          why: block.match(/WHY:\s*([\s\S]+?)(?=\n[A-Z_]+:|$)/)?.[1]?.trim() || '',
        };
      }).filter(m => m.country);

      setMatches(parsed.length > 0 ? parsed : null);
      if (parsed.length === 0) setError('Could not parse suggestions. Please try again.');
      else setShow(true);
    } catch (err) {
      console.error('Cross-country matcher error:', err);
      setError('Could not generate suggestions. Please try again.');
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
          backgroundColor: show ? '#E3F2FD' : '#1565C0',
          color: show ? '#1565C0' : 'white',
          border: show ? '2px solid #1565C0' : 'none',
          padding: '15px 20px',
          borderRadius: '12px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1,
          transition: 'all 0.3s ease',
          boxShadow: show ? 'none' : '0 4px 12px rgba(21,101,192,0.3)',
        }}
      >
        {loading ? (
          <><span className="spinner-border spinner-border-sm me-2" role="status" />Finding global matches…</>
        ) : show ? (
          <><i className="fas fa-eye-slash me-2" />Hide Global Matches</>
        ) : (
          <><i className="fas fa-globe me-2" />Find Similar in Other Countries</>
        )}
      </button>

      {error && (
        <div className="alert alert-warning mt-3 mb-0" style={{ borderRadius: '8px', fontSize: '14px' }}>
          <i className="fas fa-exclamation-triangle me-2" />{error}
        </div>
      )}

      {show && matches && (
        <div className="mt-3" style={{ border: '2px solid #E5E7EB', borderRadius: '12px', overflow: 'hidden', animation: 'slideIn 0.3s ease-out' }}>
          {/* Header */}
          <div style={{ background: 'linear-gradient(135deg, #1565C0, #0D47A1)', padding: '18px 20px' }}>
            <h5 style={{ color: 'white', marginBottom: 4, fontWeight: 700 }}>
              <i className="fas fa-globe me-2" />Global Property Matches
            </h5>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, marginBottom: 0 }}>Similar investment opportunities worldwide</p>
          </div>

          <div style={{ padding: '16px', background: 'white' }}>
            {matches.map((m, i) => (
              <div key={i} style={{
                border: '1.5px solid #E5E7EB', borderRadius: 10, padding: 16,
                marginBottom: i < matches.length - 1 ? 12 : 0,
                transition: 'all 0.2s',
              }}>
                <div className="d-flex align-items-start justify-content-between mb-2">
                  <div>
                    <span style={{ fontSize: 24, marginRight: 8 }}>{getFlag(m.country || m.city)}</span>
                    <span style={{ fontWeight: 700, fontSize: 15, color: '#111827' }}>
                      {m.city}{m.city && m.country ? ', ' : ''}{m.country}
                    </span>
                  </div>
                  {m.roi && (
                    <div style={{ background: '#E8F5E9', borderRadius: 6, padding: '3px 10px', fontSize: 12, fontWeight: 700, color: '#2E7D32' }}>
                      ROI: {m.roi}
                    </div>
                  )}
                </div>

                <div className="d-flex gap-3 mb-2" style={{ flexWrap: 'wrap' }}>
                  {m.priceRange && (
                    <span style={{ fontSize: 13, color: '#1565C0', fontWeight: 600 }}>
                      <i className="fas fa-tag me-1" />{m.priceRange}
                    </span>
                  )}
                  {m.propertyType && (
                    <span style={{ fontSize: 13, color: '#6B7280' }}>
                      <i className="fas fa-home me-1" />{m.propertyType}
                    </span>
                  )}
                </div>

                {m.why && (
                  <p style={{ fontSize: 13, color: '#4B5563', marginBottom: 8, lineHeight: 1.5 }}>{m.why}</p>
                )}

                <Link
                  href={`/grid-full-3-col?search=${encodeURIComponent(m.city || m.country)}&type=All`}
                  style={{ fontSize: 12, color: '#1565C0', textDecoration: 'none', fontWeight: 600 }}
                >
                  Browse properties in {m.city || m.country} →
                </Link>
              </div>
            ))}

            <div style={{ fontSize: 11, color: '#9CA3AF', fontStyle: 'italic', marginTop: 14, borderTop: '1px solid #E5E7EB', paddingTop: 10 }}>
              <i className="fas fa-info-circle me-1" />AI-generated suggestions based on market analysis. Do your own due diligence.
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
