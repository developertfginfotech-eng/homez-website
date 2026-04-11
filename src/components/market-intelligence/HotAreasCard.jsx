'use client';

import { useEffect, useState } from 'react';
import { marketIntelligenceAPI } from '@/services/marketIntelligenceApi';
import Link from 'next/link';

const fmt = (num) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(num);

function getHeat(score) {
  if (score >= 80) return { label: 'Very Hot', color: '#dc2626', bg: '#fef2f2', border: '#fca5a5', dot: '🔥' };
  if (score >= 60) return { label: 'Hot', color: '#d97706', bg: '#fffbeb', border: '#fcd34d', dot: '⚡' };
  return { label: 'Warm', color: '#2563eb', bg: '#eff6ff', border: '#93c5fd', dot: '📈' };
}

export default function HotAreasCard({ filters = {}, limit = 10 }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHotAreas = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await marketIntelligenceAPI.getHotAreas({ ...filters, limit });
        if (result.success) setData(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchHotAreas();
  }, [filters.country, limit]);

  const cardWrap = (children) => (
    <div style={{ background: 'white', borderRadius: 16, border: '1.5px solid #f0f0f0', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', marginBottom: 24, overflow: 'hidden' }}>
      <div style={{ padding: '22px 28px', borderBottom: '1px solid #f7f7f7', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #dc2626, #f97316)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="fas fa-fire" style={{ color: 'white', fontSize: 15 }} />
          </div>
          <h5 style={{ fontWeight: 800, fontSize: 17, margin: 0, color: '#111827' }}>Hot Investment Areas</h5>
        </div>
        {data && <span style={{ background: '#fef2f2', color: '#dc2626', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700, border: '1px solid #fca5a5' }}>{data.length} Cities</span>}
      </div>
      <div style={{ padding: '24px 28px' }}>{children}</div>
    </div>
  );

  if (loading) {
    return cardWrap(
      <div style={{ textAlign: 'center', padding: '48px 0' }}>
        <div style={{ width: 44, height: 44, borderRadius: '50%', border: '3px solid #f3f4f6', borderTopColor: '#dc2626', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
        <p style={{ color: '#9ca3af', fontSize: 14, margin: 0 }}>Loading hot areas…</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error || !data || data.length === 0) {
    return cardWrap(
      <div style={{ textAlign: 'center', padding: '56px 24px', background: '#f9fafb', borderRadius: 14, border: '1.5px dashed #e5e7eb' }}>
        <div style={{ fontSize: 44, marginBottom: 14 }}>🔥</div>
        <h6 style={{ color: '#374151', fontWeight: 700, marginBottom: 6 }}>No Hot Areas Found</h6>
        <p style={{ color: '#9ca3af', fontSize: 13, marginBottom: 0 }}>No hot area data available for the selected filters. Try broadening your search.</p>
      </div>
    );
  }

  return cardWrap(
    <>
      <p style={{ color: '#9ca3af', fontSize: 13, marginBottom: 20 }}>
        Top cities ranked by market activity, diversity, and listing volume.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {data.map((area, index) => {
          const heat = getHeat(area.hotnessScore);
          return (
            <div key={index} style={{ border: `1.5px solid ${heat.border}`, background: heat.bg, borderRadius: 14, padding: '18px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {/* Rank */}
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: index < 3 ? 'linear-gradient(135deg, #f59e0b, #d97706)' : '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {index < 3
                      ? <i className="fas fa-crown" style={{ color: 'white', fontSize: 14 }} />
                      : <span style={{ fontWeight: 800, fontSize: 14, color: '#374151' }}>#{index + 1}</span>
                    }
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 15, color: '#111827', lineHeight: 1.2 }}>{area.city}</div>
                    <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{area.state}, {area.country}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ background: heat.color, color: 'white', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, marginBottom: 5 }}>
                    {heat.dot} {heat.label}
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: heat.color, lineHeight: 1 }}>{area.hotnessScore?.toFixed(0)}<span style={{ fontSize: 12, color: '#9ca3af', fontWeight: 400 }}>/100</span></div>
                </div>
              </div>

              {/* Metrics */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 14 }}>
                {[
                  { label: 'Listings', value: area.totalListings, color: '#374151' },
                  { label: 'New (30d)', value: area.recentListings, color: '#059669' },
                  { label: 'Avg Price', value: fmt(area.avgPrice), color: '#111827' },
                  { label: 'Activity', value: `${area.activityScore?.toFixed(0)}%`, color: '#3b82f6' },
                ].map(m => (
                  <div key={m.label} style={{ background: 'rgba(255,255,255,0.7)', borderRadius: 8, padding: '8px 10px', textAlign: 'center' }}>
                    <div style={{ fontSize: 10, color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>{m.label}</div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: m.color }}>{m.value}</div>
                  </div>
                ))}
              </div>

              {/* Top property types */}
              {area.topPropertyTypes && area.topPropertyTypes.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                  {area.topPropertyTypes.map((p, i) => (
                    <span key={i} style={{ background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(0,0,0,0.08)', color: '#374151', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 500 }}>
                      {p.type} ({p.count})
                    </span>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div style={{ display: 'flex', gap: 8 }}>
                <Link href={`/grid-full-3-col?city=${encodeURIComponent(area.city)}`} style={{ flex: 1, textAlign: 'center', padding: '8px 14px', borderRadius: 8, background: heat.color, color: 'white', textDecoration: 'none', fontSize: 12, fontWeight: 700 }}>
                  View Properties
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
