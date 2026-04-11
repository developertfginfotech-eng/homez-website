'use client';

import { useEffect, useState } from 'react';
import { marketIntelligenceAPI } from '@/services/marketIntelligenceApi';
import Link from 'next/link';

const fmt = (num) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(num);

function getScoreStyle(score) {
  if (score >= 85) return { label: 'Excellent', color: '#059669', bg: '#f0fdf4', border: '#bbf7d0' };
  if (score >= 70) return { label: 'Very Good', color: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe' };
  if (score >= 60) return { label: 'Good', color: '#d97706', bg: '#fffbeb', border: '#fcd34d' };
  return { label: 'Fair', color: '#6b7280', bg: '#f9fafb', border: '#e5e7eb' };
}

function ScoreBar({ label, value, color }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 12, color: '#6b7280', fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color }}>{value}/100</span>
      </div>
      <div style={{ height: 6, background: '#f3f4f6', borderRadius: 3 }}>
        <div style={{ height: '100%', width: `${value}%`, background: `linear-gradient(90deg, ${color}, ${color}99)`, borderRadius: 3, transition: 'width 0.6s ease' }} />
      </div>
    </div>
  );
}

export default function InvestmentHotspots({ filters = {} }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHotspots = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await marketIntelligenceAPI.getInvestmentHotspots(filters);
        if (result.success) setData(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchHotspots();
  }, [filters.country, filters.propertyType, filters.budget]);

  const cardWrap = (children) => (
    <div style={{ background: 'white', borderRadius: 16, border: '1.5px solid #f0f0f0', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', marginBottom: 24, overflow: 'hidden' }}>
      <div style={{ padding: '22px 28px', borderBottom: '1px solid #f7f7f7', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #f59e0b, #d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="fas fa-trophy" style={{ color: 'white', fontSize: 15 }} />
          </div>
          <h5 style={{ fontWeight: 800, fontSize: 17, margin: 0, color: '#111827' }}>Investment Hotspots</h5>
        </div>
        <span style={{ background: '#f0fdf4', color: '#059669', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700, border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', gap: 5 }}>
          <i className="fas fa-robot" style={{ fontSize: 10 }} /> AI Powered
        </span>
      </div>
      <div style={{ padding: '24px 28px' }}>{children}</div>
    </div>
  );

  if (loading) {
    return cardWrap(
      <div style={{ textAlign: 'center', padding: '48px 0' }}>
        <div style={{ width: 44, height: 44, borderRadius: '50%', border: '3px solid #f3f4f6', borderTopColor: '#f59e0b', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
        <p style={{ color: '#9ca3af', fontSize: 14, margin: 0 }}>Analyzing investment opportunities…</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error || !data || data.hotspots.length === 0) {
    return cardWrap(
      <div style={{ textAlign: 'center', padding: '56px 24px', background: '#f9fafb', borderRadius: 14, border: '1.5px dashed #e5e7eb' }}>
        <div style={{ fontSize: 44, marginBottom: 14 }}>🏆</div>
        <h6 style={{ color: '#374151', fontWeight: 700, marginBottom: 6 }}>No Investment Hotspots Found</h6>
        <p style={{ color: '#9ca3af', fontSize: 13, marginBottom: 0 }}>No hotspots available for the selected criteria. Try adjusting your filters.</p>
      </div>
    );
  }

  return cardWrap(
    <>
      {/* AI Analysis block */}
      {data.analysis && (
        <div style={{ background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', border: '1.5px solid #bbf7d0', borderRadius: 14, padding: '18px 20px', marginBottom: 24, display: 'flex', gap: 14 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <i className="fas fa-robot" style={{ color: 'white', fontSize: 14 }} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#065f46', marginBottom: 8 }}>AI Investment Analysis</div>
            <div style={{ fontSize: 13, color: '#374151', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{data.analysis}</div>
          </div>
        </div>
      )}

      {/* Hotspot cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {data.hotspots.map((hotspot, index) => {
          const ss = getScoreStyle(hotspot.investmentScore);
          return (
            <div key={index} style={{ border: `1.5px solid ${ss.border}`, background: ss.bg, borderRadius: 14, padding: '20px 22px' }}>
              {/* Top row */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: index < 3 ? 'linear-gradient(135deg, #f59e0b, #d97706)' : '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {index < 3
                      ? <i className="fas fa-crown" style={{ color: 'white', fontSize: 16 }} />
                      : <span style={{ fontWeight: 800, fontSize: 15, color: '#374151' }}>#{index + 1}</span>
                    }
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 16, color: '#111827', lineHeight: 1.2 }}>{hotspot.city}</div>
                    <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{hotspot.country}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ background: ss.color, color: 'white', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, marginBottom: 6 }}>{ss.label}</div>
                  <div style={{ fontSize: 26, fontWeight: 800, color: ss.color, lineHeight: 1 }}>
                    {hotspot.investmentScore?.toFixed(1)}<span style={{ fontSize: 12, color: '#9ca3af', fontWeight: 400 }}>/100</span>
                  </div>
                </div>
              </div>

              {/* Metrics grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 16 }}>
                {[
                  { label: 'Listings', value: hotspot.totalListings },
                  { label: 'Avg Price', value: fmt(hotspot.avgPrice), small: true },
                  { label: 'Rental Yield', value: `${hotspot.estimatedRentalYield}%`, color: '#059669' },
                  { label: 'Growth Rate', value: `${hotspot.growthRate}%`, color: '#3b82f6' },
                ].map(m => (
                  <div key={m.label} style={{ background: 'rgba(255,255,255,0.7)', borderRadius: 8, padding: '10px 12px', textAlign: 'center' }}>
                    <div style={{ fontSize: 10, color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>{m.label}</div>
                    <div style={{ fontSize: m.small ? 11 : 14, fontWeight: 800, color: m.color || '#111827' }}>{m.value}</div>
                  </div>
                ))}
              </div>

              {/* Score bars */}
              <div style={{ marginBottom: 14 }}>
                <ScoreBar label="Investment Score" value={hotspot.investmentScore} color={ss.color} />
                <ScoreBar label="Amenities Score" value={hotspot.amenitiesScore} color="#3b82f6" />
              </div>

              {/* Recent activity */}
              <div style={{ background: 'rgba(255,255,255,0.7)', borderRadius: 8, padding: '8px 12px', marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: '#6b7280' }}>Recent Activity (30 days)</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#059669' }}>{hotspot.recentActivity} new listings</span>
              </div>

              {/* Action */}
              <Link href={`/grid-full-3-col?city=${encodeURIComponent(hotspot.city)}`} style={{ display: 'block', textAlign: 'center', padding: '9px', borderRadius: 8, background: ss.color, color: 'white', textDecoration: 'none', fontSize: 13, fontWeight: 700 }}>
                Explore Properties in {hotspot.city}
              </Link>
            </div>
          );
        })}
      </div>
    </>
  );
}
