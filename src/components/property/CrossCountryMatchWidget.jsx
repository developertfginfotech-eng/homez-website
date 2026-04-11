'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { aiAPI } from '@/services/aiApi';

const COUNTRY_FLAGS = {
  'United Arab Emirates': '🇦🇪', UAE: '🇦🇪',
  'United Kingdom': '🇬🇧', UK: '🇬🇧',
  'United States': '🇺🇸', USA: '🇺🇸',
  Australia: '🇦🇺', Canada: '🇨🇦', Germany: '🇩🇪',
  France: '🇫🇷', Spain: '🇪🇸', Portugal: '🇵🇹',
  Italy: '🇮🇹', Turkey: '🇹🇷', India: '🇮🇳',
  Singapore: '🇸🇬', Thailand: '🇹🇭', Indonesia: '🇮🇩',
  Malaysia: '🇲🇾', 'Saudi Arabia': '🇸🇦',
  'South Africa': '🇿🇦', Egypt: '🇪🇬',
  Netherlands: '🇳🇱', Greece: '🇬🇷',
  'New Zealand': '🇳🇿', Japan: '🇯🇵',
  China: '🇨🇳', Brazil: '🇧🇷', Mexico: '🇲🇽',
};

function getFlag(country) {
  return COUNTRY_FLAGS[country] || '🌍';
}

function PropertyMiniCard({ property }) {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3001';

  let imageUrl = '/images/listings/list-1.jpg';
  if (Array.isArray(property.images) && property.images.length > 0) {
    const img = property.images[0];
    imageUrl = img.startsWith('http') ? img : `${API_BASE}${img}`;
  } else if (typeof property.images === 'string' && property.images) {
    imageUrl = property.images.startsWith('http') ? property.images : `${API_BASE}${property.images}`;
  }

  const price = property.price
    ? `$${Number(property.price).toLocaleString()}`
    : 'Price on request';

  return (
    <Link
      href={`/property-details?id=${property._id}`}
      style={{ textDecoration: 'none', display: 'block' }}
    >
      <div style={{
        background: 'white',
        borderRadius: 14,
        overflow: 'hidden',
        border: '1.5px solid #f0f0f0',
        boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
        transition: 'all 0.2s',
        cursor: 'pointer',
      }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-3px)';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'none';
          e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.06)';
        }}
      >
        <div style={{ height: 120, overflow: 'hidden', background: '#f3f4f6' }}>
          <img
            src={imageUrl}
            alt={property.title || property.propertyName || 'Property'}
            onError={e => { e.target.src = '/images/listings/list-1.jpg'; }}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
        <div style={{ padding: '10px 12px' }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: '#eb6753', marginBottom: 3 }}>{price}</div>
          <div style={{ fontSize: 12, color: '#111', fontWeight: 600, marginBottom: 4, lineHeight: 1.3 }}>
            {(property.title || property.propertyName || 'Property').slice(0, 28)}
            {(property.title || property.propertyName || '').length > 28 ? '…' : ''}
          </div>
          <div style={{ display: 'flex', gap: 8, fontSize: 11, color: '#9ca3af' }}>
            {property.bedrooms && <span>🛏 {property.bedrooms}</span>}
            {property.bathrooms && <span>🚿 {property.bathrooms}</span>}
            {property.superBuiltUpArea && <span>📐 {property.superBuiltUpArea} ft²</span>}
          </div>
          <div style={{ fontSize: 11, color: '#c0c4cc', marginTop: 4 }}>
            📍 {property.city || 'N/A'}
          </div>
        </div>
      </div>
    </Link>
  );
}

/**
 * CrossCountryMatchWidget
 * Shows similar properties from other countries for a given property.
 * Usage: <CrossCountryMatchWidget propertyId="..." />
 */
export default function CrossCountryMatchWidget({ propertyId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    if (!propertyId) return;
    setLoading(true);
    setError(null);

    aiAPI.getCrossCountryMatches(propertyId, 3)
      .then(res => {
        if (res.success && res.data) setData(res.data);
        else setError(res.message || 'No matches found');
      })
      .catch(() => setError('Could not load global alternatives'))
      .finally(() => setLoading(false));
  }, [propertyId]);

  if (loading) {
    return (
      <div style={{
        background: 'white', borderRadius: 16, padding: '24px 28px',
        border: '1.5px solid #f0f0f0', boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        marginTop: 24,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ fontSize: 24 }}>🌍</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: '#111' }}>Similar Properties Worldwide</div>
            <div style={{ fontSize: 12, color: '#9ca3af' }}>AI matching across countries…</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{
              flex: 1, height: 180, borderRadius: 12,
              background: 'linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite',
            }} />
          ))}
        </div>
        <style>{`
          @keyframes shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}</style>
      </div>
    );
  }

  if (error || !data || data.totalMatches === 0) {
    return (
      <div style={{
        background: 'white', borderRadius: 16, marginTop: 24,
        border: '1.5px solid #f0f0f0', boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        overflow: 'hidden',
      }}>
        <div style={{
          padding: '20px 24px',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{ fontSize: 26 }}>🌍</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: 'white' }}>Similar Properties Worldwide</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>Global investment alternatives</div>
          </div>
        </div>
        <div style={{ padding: '20px 24px', textAlign: 'center', color: '#9ca3af', fontSize: 13 }}>
          <div style={{ fontSize: 32, marginBottom: 10 }}>🏠</div>
          No global matches found yet. Add more approved listings from other countries to see alternatives here.
        </div>
      </div>
    );
  }

  const countries = Object.keys(data.matches);

  return (
    <div style={{
      background: 'white', borderRadius: 16,
      border: '1.5px solid #f0f0f0',
      boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      marginTop: 24, overflow: 'hidden',
    }}>
      {/* Header */}
      <div
        onClick={() => setExpanded(p => !p)}
        style={{
          padding: '20px 24px',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 26 }}>🌍</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: 'white' }}>
              Similar Properties Worldwide
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>
              {data.totalMatches} match{data.totalMatches !== 1 ? 'es' : ''} in {countries.length} countr{countries.length !== 1 ? 'ies' : 'y'}
              {' '}· {countries.map(c => getFlag(c)).join(' ')}
            </div>
          </div>
        </div>
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 18, transition: 'transform 0.2s', transform: expanded ? 'rotate(180deg)' : 'none' }}>
          ▾
        </div>
      </div>

      {expanded && (
        <div style={{ padding: '20px 24px' }}>
          {/* AI intro */}
          {data.intro && (
            <div style={{
              background: 'linear-gradient(135deg, #fef3f0, #fff7f5)',
              border: '1px solid #fed7cc',
              borderRadius: 10,
              padding: '12px 16px',
              marginBottom: 20,
              fontSize: 13,
              color: '#7c2d12',
              lineHeight: 1.6,
              display: 'flex',
              gap: 10,
              alignItems: 'flex-start',
            }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>🤖</span>
              <span>{data.intro}</span>
            </div>
          )}

          {/* Country sections */}
          {countries.map(country => (
            <div key={country} style={{ marginBottom: 24 }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                marginBottom: 12,
              }}>
                <span style={{ fontSize: 20 }}>{getFlag(country)}</span>
                <span style={{ fontWeight: 700, fontSize: 15, color: '#111' }}>{country}</span>
                <span style={{
                  background: '#f3f4f6', color: '#6b7280',
                  borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600,
                }}>
                  {data.matches[country].length} listing{data.matches[country].length !== 1 ? 's' : ''}
                </span>
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${Math.min(data.matches[country].length, 3)}, 1fr)`,
                gap: 12,
              }}>
                {data.matches[country].map(prop => (
                  <PropertyMiniCard key={prop._id} property={prop} />
                ))}
              </div>
            </div>
          ))}

          {/* Footer CTA */}
          <div style={{
            borderTop: '1px solid #f3f4f6',
            paddingTop: 14,
            textAlign: 'center',
          }}>
            <Link href="/grid-full-3-col" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              color: '#eb6753', fontWeight: 600, fontSize: 13,
              textDecoration: 'none',
            }}>
              Explore all global listings →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
