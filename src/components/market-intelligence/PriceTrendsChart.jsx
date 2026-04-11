'use client';

import { useEffect, useState } from 'react';
import { marketIntelligenceAPI } from '@/services/marketIntelligenceApi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const fmt = (num) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(num);

function EmptyState({ icon, title, desc }) {
  return (
    <div style={{ textAlign: 'center', padding: '56px 24px', background: '#f9fafb', borderRadius: 14, border: '1.5px dashed #e5e7eb' }}>
      <div style={{ fontSize: 44, marginBottom: 14 }}>{icon}</div>
      <h6 style={{ color: '#374151', fontWeight: 700, marginBottom: 6 }}>{title}</h6>
      <p style={{ color: '#9ca3af', fontSize: 13, marginBottom: 0 }}>{desc}</p>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'white', border: '1.5px solid #f0f0f0', borderRadius: 10, padding: '12px 16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
      <p style={{ fontWeight: 700, color: '#374151', marginBottom: 8, fontSize: 13 }}>{label}</p>
      {payload.map((p, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color }} />
          <span style={{ fontSize: 12, color: '#6b7280' }}>{p.name}:</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#111827' }}>{fmt(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

export default function PriceTrendsChart({ filters = {}, months = 12 }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await marketIntelligenceAPI.getPriceTrends({ ...filters, months });
        if (result.success) setData(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTrends();
  }, [filters.country, filters.state, filters.city, filters.propertyType, months]);

  const card = (children) => (
    <div style={{ background: 'white', borderRadius: 16, border: '1.5px solid #f0f0f0', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', marginBottom: 24, overflow: 'hidden' }}>
      <div style={{ padding: '22px 28px', borderBottom: '1px solid #f7f7f7', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #059669, #10b981)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <i className="fas fa-chart-line" style={{ color: 'white', fontSize: 15 }} />
        </div>
        <h5 style={{ fontWeight: 800, fontSize: 17, margin: 0, color: '#111827' }}>Price Trends</h5>
      </div>
      <div style={{ padding: '24px 28px' }}>{children}</div>
    </div>
  );

  if (loading) {
    return card(
      <div style={{ textAlign: 'center', padding: '48px 0' }}>
        <div style={{ width: 44, height: 44, borderRadius: '50%', border: '3px solid #f3f4f6', borderTopColor: '#059669', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
        <p style={{ color: '#9ca3af', fontSize: 14, margin: 0 }}>Loading price trends…</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error || !data || !data.trends || data.trends.length === 0) {
    return card(<EmptyState icon="📈" title="No Price Trend Data" desc="There are no properties matching your selected filters. Try adjusting your search criteria or selecting a different location." />);
  }

  const dir = data.summary.direction;
  const dirColor = dir === 'rising' ? '#059669' : dir === 'falling' ? '#dc2626' : '#d97706';
  const dirBg = dir === 'rising' ? '#f0fdf4' : dir === 'falling' ? '#fef2f2' : '#fffbeb';
  const dirIcon = dir === 'rising' ? 'fa-arrow-up' : dir === 'falling' ? 'fa-arrow-down' : 'fa-minus';

  return card(
    <>
      {/* Summary strip */}
      <div style={{ display: 'flex', gap: 14, marginBottom: 24, flexWrap: 'wrap' }}>
        {[
          { label: 'Price Change', value: `${data.summary.changePercent > 0 ? '+' : ''}${data.summary.changePercent?.toFixed(2)}%`, color: data.summary.changePercent > 0 ? '#059669' : '#dc2626', bg: data.summary.changePercent > 0 ? '#f0fdf4' : '#fef2f2' },
          { label: 'Total Listings', value: data.summary.totalListings?.toLocaleString(), color: '#3b82f6', bg: '#eff6ff' },
          { label: 'Trend', value: dir.charAt(0).toUpperCase() + dir.slice(1), color: dirColor, bg: dirBg },
          { label: 'Period', value: data.summary.period || `${months} months`, color: '#8b5cf6', bg: '#f5f3ff' },
        ].map(s => (
          <div key={s.label} style={{ flex: 1, minWidth: 120, background: s.bg, borderRadius: 12, padding: '14px 16px', border: `1px solid ${s.color}22` }}>
            <div style={{ fontSize: 11, color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 5 }}>{s.label}</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div style={{ width: '100%', height: 360, marginBottom: 28 }}>
        <ResponsiveContainer>
          <LineChart data={data.trends} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="month" style={{ fontSize: 11 }} tick={{ fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <YAxis style={{ fontSize: 11 }} tick={{ fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
            <Line type="monotone" dataKey="avgPrice" name="Average Price" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="avgPricePerSqft" name="Price per Sq Ft" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 3, strokeWidth: 0 }} strokeDasharray="6 3" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Data Table */}
      <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <i className="fas fa-table" style={{ color: '#9ca3af', fontSize: 12 }} />
          Monthly Breakdown
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1.5px solid #f0f0f0' }}>
                {['Month', 'Avg Price', 'Price / Sq Ft', 'Listings'].map(h => (
                  <th key={h} style={{ padding: '8px 12px', textAlign: h === 'Month' ? 'left' : 'right', fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.trends.slice().reverse().map((t, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f9fafb' }}>
                  <td style={{ padding: '10px 12px', fontWeight: 600, color: '#374151' }}>{t.month}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', color: '#111827', fontWeight: 700 }}>{fmt(t.avgPrice)}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', color: '#6b7280' }}>{fmt(t.avgPricePerSqft)}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', color: '#6b7280' }}>{t.listings}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
