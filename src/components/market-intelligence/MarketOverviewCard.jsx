'use client';

import { useEffect, useState } from 'react';
import { marketIntelligenceAPI } from '@/services/marketIntelligenceApi';

const fmt = (num) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(num);

function StatCard({ icon, label, value, sub, color = '#3b82f6', bg = '#eff6ff' }) {
  return (
    <div style={{ background: 'white', borderRadius: 14, padding: '20px 22px', border: '1.5px solid #f0f0f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', flex: 1, minWidth: 160 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <i className={icon} style={{ color, fontSize: 15 }} />
        </div>
        <span style={{ fontSize: 12, color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</span>
      </div>
      <div style={{ fontSize: 24, fontWeight: 800, color: '#111827', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: '#6b7280', marginTop: 5 }}>{sub}</div>}
    </div>
  );
}

function EmptyState({ icon, title, desc }) {
  return (
    <div style={{ textAlign: 'center', padding: '56px 24px', background: '#f9fafb', borderRadius: 14, border: '1.5px dashed #e5e7eb' }}>
      <div style={{ fontSize: 44, marginBottom: 14 }}>{icon}</div>
      <h6 style={{ color: '#374151', fontWeight: 700, marginBottom: 6 }}>{title}</h6>
      <p style={{ color: '#9ca3af', fontSize: 13, marginBottom: 0 }}>{desc}</p>
    </div>
  );
}

export default function MarketOverviewCard({ filters = {} }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await marketIntelligenceAPI.getMarketOverview(filters);
        if (result.success) setData(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [filters.country, filters.state, filters.city]);

  if (loading) {
    return (
      <div style={{ background: 'white', borderRadius: 16, padding: '48px 24px', textAlign: 'center', border: '1.5px solid #f0f0f0', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', marginBottom: 24 }}>
        <div style={{ width: 44, height: 44, borderRadius: '50%', border: '3px solid #f3f4f6', borderTopColor: '#eb6753', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
        <p style={{ color: '#9ca3af', fontSize: 14, margin: 0 }}>Loading market overview…</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ background: 'white', borderRadius: 16, padding: '32px', border: '1.5px solid #f0f0f0', marginBottom: 24 }}>
        <EmptyState icon="📊" title="No Market Data Available" desc="No approved listings found for the selected location. Try selecting a different country, city, or broaden your filters." />
      </div>
    );
  }

  if (!data || data.totalListings === 0) {
    return (
      <div style={{ background: 'white', borderRadius: 16, padding: '32px', border: '1.5px solid #f0f0f0', marginBottom: 24 }}>
        <EmptyState icon="🏙️" title="No Listings in This Area Yet" desc="There are no approved properties for the selected location. Add listings or select a broader area to see market insights." />
      </div>
    );
  }

  return (
    <div style={{ background: 'white', borderRadius: 16, border: '1.5px solid #f0f0f0', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', marginBottom: 24, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '22px 28px', borderBottom: '1px solid #f7f7f7', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #3b82f6, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="fas fa-chart-line" style={{ color: 'white', fontSize: 15 }} />
          </div>
          <h5 style={{ fontWeight: 800, fontSize: 17, margin: 0, color: '#111827' }}>Market Overview</h5>
        </div>
        <span style={{ background: '#f0fdf4', color: '#059669', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700, border: '1px solid #bbf7d0' }}>
          {data.location?.city || data.location?.state || data.location?.country || 'Global'}
        </span>
      </div>

      <div style={{ padding: '24px 28px' }}>
        {/* Key Metrics */}
        <div style={{ display: 'flex', gap: 14, marginBottom: 24, flexWrap: 'wrap' }}>
          <StatCard icon="fas fa-home" label="Total Listings" value={data.totalListings.toLocaleString()} color="#3b82f6" bg="#eff6ff" />
          <StatCard icon="fas fa-clock" label="New (30 days)" value={data.recentListings?.toLocaleString() || '0'} sub={data.listingGrowth !== 0 ? `${data.listingGrowth > 0 ? '+' : ''}${data.listingGrowth?.toFixed(1)}% vs prev month` : null} color="#059669" bg="#f0fdf4" />
          <StatCard icon="fas fa-dollar-sign" label="Avg Price" value={fmt(data.priceStats?.average || 0)} color="#d97706" bg="#fffbeb" />
          <StatCard icon="fas fa-ruler-combined" label="Price / Sq Ft" value={fmt(data.priceStats?.avgPricePerSqft || 0)} color="#8b5cf6" bg="#f5f3ff" />
        </div>

        {/* Price Stats + Distribution row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

          {/* Price Statistics */}
          <div style={{ background: '#f9fafb', borderRadius: 12, padding: '18px 20px', border: '1px solid #f0f0f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <i className="fas fa-chart-bar" style={{ color: '#6b7280', fontSize: 13 }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: '#374151' }}>Price Statistics</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Median', value: fmt(data.priceStats?.median || 0) },
                { label: 'Minimum', value: fmt(data.priceStats?.min || 0) },
                { label: 'Maximum', value: fmt(data.priceStats?.max || 0) },
              ].map(r => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, color: '#6b7280' }}>{r.label}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Property Type Distribution */}
          <div style={{ background: '#f9fafb', borderRadius: 12, padding: '18px 20px', border: '1px solid #f0f0f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <i className="fas fa-building" style={{ color: '#6b7280', fontSize: 13 }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: '#374151' }}>Property Types</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {Object.entries(data.distribution?.propertyTypes || {})
                .sort((a, b) => b[1] - a[1])
                .slice(0, 4)
                .map(([type, count]) => {
                  const pct = Math.round((count / data.totalListings) * 100);
                  return (
                    <div key={type}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                        <span style={{ fontSize: 12, color: '#374151', textTransform: 'capitalize', fontWeight: 500 }}>{type}</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#374151' }}>{count} <span style={{ color: '#9ca3af', fontWeight: 400 }}>({pct}%)</span></span>
                      </div>
                      <div style={{ height: 5, background: '#e5e7eb', borderRadius: 3 }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, #3b82f6, #6366f1)', borderRadius: 3 }} />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Ad type split */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
          <div style={{ borderRadius: 12, padding: '16px 20px', background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', border: '1px solid #bfdbfe', textAlign: 'center' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>For Rent</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#1d4ed8' }}>{data.distribution?.adTypes?.rent || 0}</div>
          </div>
          <div style={{ borderRadius: 12, padding: '16px 20px', background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', border: '1px solid #bbf7d0', textAlign: 'center' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>For Sale</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#065f46' }}>{data.distribution?.adTypes?.resale || 0}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
