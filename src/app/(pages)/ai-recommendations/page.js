'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Footer from '@/components/common/default-footer';
import { aiAPI } from '@/services/aiApi';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3001';

const SORT_OPTIONS = [
  { value: 'score', label: 'Best Match' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
];

function PropertyCard({ property }) {
  const imageUrl =
    property.images && property.images.length > 0 && property.images[0]
      ? property.images[0].startsWith('http')
        ? property.images[0]
        : `${BACKEND_URL}${property.images[0]}`
      : '/images/listings/lg-1.jpg';

  return (
    <div className="col-sm-6 col-lg-4 mb-4">
      <div className="listing-style1" style={{ borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.08)', border: '1.5px solid #f0f0f0', display: 'flex', flexDirection: 'column' }}>

        {/* Match Score Badge */}
        <div style={{
          position: 'absolute', top: 15, left: 15, zIndex: 2,
          background: property.recommendationScore >= 70 ? '#059669' : property.recommendationScore >= 40 ? '#d97706' : '#6b7280',
          color: 'white', padding: '4px 12px', borderRadius: 20,
          fontSize: 12, fontWeight: 700, boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        }}>
          {property.recommendationScore}% Match
        </div>

        {/* Image */}
        <div className="list-thumb" style={{ position: 'relative', height: 240 }}>
          <Link href={`/single-v1/${property._id}`}>
            <img
              src={imageUrl}
              alt={property.propertyName || property.title}
              onError={e => { e.target.src = '/images/listings/lg-1.jpg'; }}
              style={{ width: '100%', height: 240, objectFit: 'cover' }}
            />
          </Link>
          <div className="list-meta">
            <Link href="#" className="fav"><span className="flaticon-heart" /></Link>
          </div>
          {/* Ad type tag */}
          <div style={{
            position: 'absolute', bottom: 12, right: 12,
            background: property.propertyAdType === 'rent' ? '#3b82f6' : '#10b981',
            color: 'white', padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700,
          }}>
            {property.propertyAdType === 'rent' ? 'FOR RENT' : 'FOR SALE'}
          </div>
        </div>

        {/* Content */}
        <div className="list-content" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div className="list-price">
            ${property.price?.toLocaleString() || 'N/A'}
            {property.propertyAdType === 'rent' && <span className="fz14">/month</span>}
          </div>
          <h6 className="list-title">
            <Link href={`/single-v1/${property._id}`}>
              {property.propertyName || property.title}
            </Link>
          </h6>
          <p className="list-text">📍 {property.city}, {property.state || property.country}</p>

          {/* Match Reason */}
          {property.reason && (
            <div style={{
              marginBottom: 10, padding: '6px 10px',
              background: '#E0F2F1', borderRadius: 8,
              fontSize: 12, color: '#00796B', fontWeight: 500,
            }}>
              <i className="fas fa-star me-1" />{property.reason}
            </div>
          )}

          {/* Features */}
          <div className="list-meta d-flex align-items-center gap-3">
            {property.bedrooms && <span><i className="flaticon-bed me-1" />{property.bedrooms} Bed</span>}
            {property.bathrooms && <span><i className="flaticon-shower me-1" />{property.bathrooms} Bath</span>}
            {(property.superBuiltUpArea || property.sizeInFt) && (
              <span><i className="flaticon-expand me-1" />{property.superBuiltUpArea || property.sizeInFt} ft²</span>
            )}
          </div>

          <div className="list-meta2 d-flex justify-content-between align-items-center mt-auto pt-3">
            <Link href={`/single-v1/${property._id}`} className="ud-btn btn-white2">
              View Details <i className="fal fa-arrow-right-long ms-2" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AIRecommendationsPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('score');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
        let preferences = {};
        if (userStr) {
          try {
            const user = JSON.parse(userStr);
            if (user.preferences) preferences = user.preferences;
          } catch {}
        }
        const res = await aiAPI.getRecommendations(preferences);
        if (res.success && res.data) {
          setProperties(res.data); // Show ALL recommendations, not just 6
        } else {
          setError('Could not load recommendations.');
        }
      } catch (err) {
        setError(err.message || 'Failed to load recommendations.');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Filter
  const filtered = properties.filter(p => {
    if (filterType === 'all') return true;
    return p.propertyAdType === filterType;
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'score') return (b.recommendationScore || 0) - (a.recommendationScore || 0);
    if (sortBy === 'price_asc') return (a.price || 0) - (b.price || 0);
    if (sortBy === 'price_desc') return (b.price || 0) - (a.price || 0);
    return 0;
  });

  const avgScore = properties.length
    ? Math.round(properties.reduce((s, p) => s + (p.recommendationScore || 0), 0) / properties.length)
    : 0;

  return (
    <>
      {/* ── Dark Hero (navbar + title + stats) ── */}
      <div style={{
        background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 60%, #16213e 100%)',
      }}>
        {/* Navbar */}
        <div style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
              <Link href="/" style={{ textDecoration: 'none', fontSize: 22, fontWeight: 800, color: '#eb6753', letterSpacing: '-0.5px' }}>
                Globperty
              </Link>
              <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
                {[{ href: '/', label: 'Home' }, { href: '/grid-full-3-col', label: 'Listings' }, { href: '/dashboard-home', label: 'Dashboard' }].map(l => (
                  <Link key={l.href} href={l.href} style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>
                    {l.label}
                  </Link>
                ))}
                <Link href="/" style={{
                  color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: 13, fontWeight: 600,
                  border: '1px solid rgba(255,255,255,0.18)', padding: '6px 14px', borderRadius: 8,
                }}>
                  ← Home
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="container" style={{ padding: '40px 0 36px' }}>
          {/* Title + subtitle */}
          <h1 style={{ color: 'white', fontWeight: 800, fontSize: 36, margin: '0 0 8px', lineHeight: 1.15 }}>
            AI Recommendations For You
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, margin: 0 }}>
            Personalized properties matched by AI based on your preferences &amp; behaviour
          </p>

          {/* Stats row */}
          {!loading && properties.length > 0 && (
            <div style={{ display: 'flex', gap: 0, marginTop: 28, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 24 }}>
              {[
                { label: 'Properties Found', value: properties.length, icon: '🏠' },
                { label: 'Avg Match Score', value: `${avgScore}%`, icon: '🎯' },
                { label: 'For Rent', value: properties.filter(p => p.propertyAdType === 'rent').length, icon: '🔑' },
                { label: 'For Sale', value: properties.filter(p => p.propertyAdType !== 'rent').length, icon: '🏷️' },
              ].map((s, i) => (
                <div key={s.label} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  paddingRight: 32, marginRight: 32,
                  borderRight: i < 3 ? '1px solid rgba(255,255,255,0.08)' : 'none',
                }}>
                  <span style={{ fontSize: 20 }}>{s.icon}</span>
                  <div>
                    <div style={{ color: 'white', fontWeight: 800, fontSize: 22, lineHeight: 1 }}>{s.value}</div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 3 }}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="body_content" style={{ paddingTop: 0 }}>

        {/* Filters & Sort Bar */}
        <section style={{ background: 'white', borderBottom: '1px solid #f0f0f0', padding: '14px 0' }}>
          <div className="container">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
              {/* Filter by type */}
              <div style={{ display: 'flex', gap: 8 }}>
                {[
                  { value: 'all', label: 'All' },
                  { value: 'sale', label: 'For Sale' },
                  { value: 'rent', label: 'For Rent' },
                ].map(f => (
                  <button
                    key={f.value}
                    onClick={() => setFilterType(f.value)}
                    style={{
                      padding: '7px 18px', borderRadius: 8, border: 'none',
                      background: filterType === f.value ? '#eb6753' : '#f3f4f6',
                      color: filterType === f.value ? 'white' : '#374151',
                      fontWeight: 600, fontSize: 13, cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Sort */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 13, color: '#6b7280', fontWeight: 600 }}>Sort by:</span>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  style={{
                    padding: '7px 14px', borderRadius: 8,
                    border: '1.5px solid #e5e7eb', fontSize: 13,
                    color: '#374151', fontWeight: 600, cursor: 'pointer', background: 'white',
                  }}
                >
                  {SORT_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Properties Grid */}
        <section className="pt50 pb90">
          <div className="container">
            {loading ? (
              <div style={{ textAlign: 'center', padding: '80px 0' }}>
                <div style={{
                  width: 60, height: 60, borderRadius: '50%',
                  border: '4px solid #f3f4f6', borderTopColor: '#eb6753',
                  animation: 'spin 0.8s linear infinite', margin: '0 auto 20px',
                }} />
                <p style={{ color: '#6b7280', fontSize: 15 }}>Globperty AI is finding your best matches…</p>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            ) : error ? (
              <div style={{ textAlign: 'center', padding: '80px 0' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>😕</div>
                <h4>Could not load recommendations</h4>
                <p style={{ color: '#9ca3af' }}>{error}</p>
                <Link href="/" className="ud-btn btn-thm mt-3">Go Back Home</Link>
              </div>
            ) : sorted.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 0' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
                <h4>No recommendations yet</h4>
                <p style={{ color: '#9ca3af' }}>Browse some properties first and AI will learn your preferences.</p>
                <Link href="/grid-full-3-col" className="ud-btn btn-thm mt-3">Browse All Properties</Link>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: 28, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <p style={{ color: '#6b7280', fontSize: 14, margin: 0 }}>
                    Showing <strong style={{ color: '#111' }}>{sorted.length}</strong> AI-matched properties
                  </p>
                </div>
                <div className="row">
                  {sorted.map(property => (
                    <PropertyCard key={property._id} property={property} />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        {/* Footer */}
        <section className="footer-style1 pt60 pb-0">
          <Footer />
        </section>
      </div>
    </>
  );
}
