'use client';

import { useEffect, useState } from 'react';
import { marketIntelligenceAPI } from '@/services/marketIntelligenceApi';
import { ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const fmt = (num) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(num);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'white', border: '1.5px solid #f0f0f0', borderRadius: 10, padding: '12px 16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
      <p style={{ fontWeight: 700, color: '#374151', marginBottom: 8, fontSize: 13 }}>{label}</p>
      {payload.map((p, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color }} />
          <span style={{ fontSize: 12, color: '#6b7280' }}>{p.name}:</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#111827' }}>
            {p.name === 'Confidence' ? `${p.value}%` : fmt(p.value)}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function MarketForecast({ filters = {}, months = 6 }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await marketIntelligenceAPI.getMarketForecast({ ...filters, months });
        if (result.success) setData(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchForecast();
  }, [filters.country, filters.state, filters.city, months]);

  const cardWrap = (children) => (
    <div style={{ background: 'white', borderRadius: 16, border: '1.5px solid #f0f0f0', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', marginBottom: 24, overflow: 'hidden' }}>
      <div style={{ padding: '22px 28px', borderBottom: '1px solid #f7f7f7', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="fas fa-magic" style={{ color: 'white', fontSize: 14 }} />
          </div>
          <h5 style={{ fontWeight: 800, fontSize: 17, margin: 0, color: '#111827' }}>Market Forecast</h5>
        </div>
        <span style={{ background: '#f5f3ff', color: '#7c3aed', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700, border: '1px solid #ddd6fe', display: 'flex', alignItems: 'center', gap: 5 }}>
          <i className="fas fa-robot" style={{ fontSize: 10 }} /> AI Powered
        </span>
      </div>
      <div style={{ padding: '24px 28px' }}>{children}</div>
    </div>
  );

  if (loading) {
    return cardWrap(
      <div style={{ textAlign: 'center', padding: '48px 0' }}>
        <div style={{ width: 44, height: 44, borderRadius: '50%', border: '3px solid #f3f4f6', borderTopColor: '#8b5cf6', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
        <p style={{ color: '#9ca3af', fontSize: 14, margin: 0 }}>Generating AI forecast…</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error || !data || !data.forecast) {
    return cardWrap(
      <div style={{ textAlign: 'center', padding: '56px 24px', background: '#f9fafb', borderRadius: 14, border: '1.5px dashed #e5e7eb' }}>
        <div style={{ fontSize: 44, marginBottom: 14 }}>🔮</div>
        <h6 style={{ color: '#374151', fontWeight: 700, marginBottom: 6 }}>Not Enough Data for Forecast</h6>
        <p style={{ color: '#9ca3af', fontSize: 13, marginBottom: 0 }}>Not enough historical data available. Try selecting a location with more listings.</p>
      </div>
    );
  }

  const outlook = data.forecast.summary.outlook;
  const outlookColor = outlook === 'Bullish' ? '#059669' : outlook === 'Bearish' ? '#dc2626' : '#d97706';
  const outlookBg = outlook === 'Bullish' ? '#f0fdf4' : outlook === 'Bearish' ? '#fef2f2' : '#fffbeb';
  const outlookBorder = outlook === 'Bullish' ? '#bbf7d0' : outlook === 'Bearish' ? '#fca5a5' : '#fcd34d';
  const outlookIcon = outlook === 'Bullish' ? 'fa-arrow-trend-up' : outlook === 'Bearish' ? 'fa-arrow-trend-down' : 'fa-minus';

  const chartData = [
    ...(data.historical || []).map(h => ({ month: h.month, price: h.avgPrice, type: 'Historical' })),
    ...(data.forecast.predictions || []).map(p => ({ month: p.month, forecastPrice: p.predictedPrice, confidence: p.confidence })),
  ];

  const pct = data.forecast.summary.predictedPriceChangePercent;

  return cardWrap(
    <>
      {/* Outlook + Summary */}
      <div style={{ display: 'flex', gap: 14, marginBottom: 24, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 140, background: outlookBg, border: `1.5px solid ${outlookBorder}`, borderRadius: 12, padding: '16px 18px' }}>
          <div style={{ fontSize: 11, color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>Outlook</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <i className={`fas ${outlookIcon}`} style={{ color: outlookColor, fontSize: 18 }} />
            <span style={{ fontSize: 20, fontWeight: 800, color: outlookColor }}>{outlook}</span>
          </div>
        </div>
        {[
          { label: 'Current Avg', value: fmt(data.forecast.summary.currentAvgPrice), color: '#374151', bg: '#f9fafb', border: '#e5e7eb' },
          { label: 'Predicted Change', value: `${pct > 0 ? '+' : ''}${pct?.toFixed(2)}%`, color: pct > 0 ? '#059669' : '#dc2626', bg: pct > 0 ? '#f0fdf4' : '#fef2f2', border: pct > 0 ? '#bbf7d0' : '#fca5a5' },
          { label: 'Monthly Growth', value: `${data.forecast.summary.monthlyGrowthRate?.toFixed(2)}%`, color: '#8b5cf6', bg: '#f5f3ff', border: '#ddd6fe' },
        ].map(s => (
          <div key={s.label} style={{ flex: 1, minWidth: 130, background: s.bg, border: `1.5px solid ${s.border}`, borderRadius: 12, padding: '16px 18px' }}>
            <div style={{ fontSize: 11, color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div style={{ width: '100%', height: 360, marginBottom: 28 }}>
        <ResponsiveContainer>
          <ComposedChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <defs>
              <linearGradient id="histGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="foreGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="month" style={{ fontSize: 11 }} tick={{ fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <YAxis style={{ fontSize: 11 }} tick={{ fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
            <Area type="monotone" dataKey="price" name="Historical" stroke="#3b82f6" strokeWidth={3} fill="url(#histGrad)" dot={{ fill: '#3b82f6', r: 4, strokeWidth: 0 }} />
            <Area type="monotone" dataKey="forecastPrice" name="Forecast" stroke="#8b5cf6" strokeWidth={3} strokeDasharray="6 3" fill="url(#foreGrad)" dot={{ fill: '#8b5cf6', r: 4, strokeWidth: 0 }} />
            <Line type="monotone" dataKey="confidence" name="Confidence" stroke="#10b981" strokeWidth={1.5} dot={false} strokeDasharray="4 2" yAxisId={0} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* AI Analysis */}
      {data.forecast.analysis && (
        <div style={{ background: 'linear-gradient(135deg, #f5f3ff, #ede9fe)', border: '1.5px solid #ddd6fe', borderRadius: 14, padding: '18px 20px', marginBottom: 24, display: 'flex', gap: 14 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <i className="fas fa-brain" style={{ color: 'white', fontSize: 14 }} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#4c1d95', marginBottom: 8 }}>AI Market Analysis</div>
            <div style={{ fontSize: 13, color: '#374151', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{data.forecast.analysis}</div>
          </div>
        </div>
      )}

      {/* Forecast table */}
      <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: 20, marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <i className="fas fa-table" style={{ color: '#9ca3af', fontSize: 12 }} />
          Detailed Forecast
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1.5px solid #f0f0f0' }}>
                {['Month', 'Predicted Price', 'Confidence', 'Change'].map(h => (
                  <th key={h} style={{ padding: '8px 12px', textAlign: h === 'Month' ? 'left' : 'right', fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.forecast.predictions.map((p, i) => {
                const prev = i === 0 ? data.forecast.summary.currentAvgPrice : data.forecast.predictions[i - 1].predictedPrice;
                const change = ((p.predictedPrice - prev) / prev) * 100;
                return (
                  <tr key={i} style={{ borderBottom: '1px solid #f9fafb' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 600, color: '#374151' }}>{p.month}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, color: '#111827' }}>{fmt(p.predictedPrice)}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                      <span style={{ background: p.confidence >= 80 ? '#f0fdf4' : p.confidence >= 60 ? '#fffbeb' : '#f9fafb', color: p.confidence >= 80 ? '#059669' : p.confidence >= 60 ? '#d97706' : '#9ca3af', padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700 }}>
                        {p.confidence}%
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, color: change > 0 ? '#059669' : change < 0 ? '#dc2626' : '#9ca3af' }}>
                      <i className={`fas fa-arrow-${change > 0 ? 'up' : change < 0 ? 'down' : 'right'} me-1`} style={{ fontSize: 10 }} />
                      {change > 0 ? '+' : ''}{change.toFixed(2)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Disclaimer */}
      <div style={{ background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: 10, padding: '12px 16px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <i className="fas fa-info-circle" style={{ color: '#d97706', fontSize: 14, marginTop: 1 }} />
        <p style={{ fontSize: 12, color: '#92400e', margin: 0, lineHeight: 1.6 }}>
          <strong>Disclaimer:</strong> This forecast is AI-generated based on historical data and market trends. Actual prices may vary. Use as guidance only, not financial advice.
        </p>
      </div>
    </>
  );
}
