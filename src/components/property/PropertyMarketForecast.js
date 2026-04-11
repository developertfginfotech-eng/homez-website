'use client';
import { useState } from 'react';
import { getPropertyById } from '@/helpers/propertyApi';
import { marketIntelligenceAPI } from '@/services/marketIntelligenceApi';
import { chatAPI } from '@/services/chatApi';

export default function PropertyMarketForecast({ propertyId }) {
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [show, setShow] = useState(false);
  const [location, setLocation] = useState(null);
  const [sourceLabel, setSourceLabel] = useState('market data');

  const fetchAiFallback = async (property) => {
    const prompt = `You are a real estate market analyst. Provide a 6-month market forecast for:

Location: ${property.city || ''}, ${property.country || ''}
Property Type: ${property.propertyType || 'Residential'}
Current Price: $${(property.price || 0).toLocaleString()}

Give a realistic forecast. Respond EXACTLY in this format:

TREND: [rising / stable / declining]
CONFIDENCE: [50-85]
MONTHLY_CHANGE: [e.g. +1.2 or -0.8]
MONTH_1: [month name] | $[price] | [+/-X.X%]
MONTH_2: [month name] | $[price] | [+/-X.X%]
MONTH_3: [month name] | $[price] | [+/-X.X%]
MONTH_4: [month name] | $[price] | [+/-X.X%]
MONTH_5: [month name] | $[price] | [+/-X.X%]
MONTH_6: [month name] | $[price] | [+/-X.X%]`;

    const resp = await chatAPI.sendMessage(prompt, `forecast_${propertyId}`, []);
    const text = resp.message || resp.aiResponse || '';

    const trend = text.match(/TREND:\s*(.+)/)?.[1]?.trim() || 'stable';
    const confidence = parseFloat(text.match(/CONFIDENCE:\s*([\d.]+)/)?.[1] || '60') / 100;
    const avgMonthlyChange = parseFloat(text.match(/MONTHLY_CHANGE:\s*([+-]?[\d.]+)/)?.[1] || '0');

    const forecasts = [1, 2, 3, 4, 5, 6].map(n => {
      const line = text.match(new RegExp(`MONTH_${n}:\\s*(.+)`))?.[1]?.trim() || '';
      const parts = line.split('|').map(p => p.trim());
      const month = parts[0] || `Month ${n}`;
      const price = parseFloat((parts[1] || '0').replace(/[$,]/g, '')) || 0;
      const change = parseFloat((parts[2] || '0').replace(/[+%]/g, '')) || 0;
      return { month, predictedPrice: price, predictedChange: change };
    }).filter(f => f.predictedPrice > 0);

    return {
      summary: { predictedTrend: trend, confidence, avgMonthlyChange },
      forecasts,
    };
  };

  const handleGet = async () => {
    if (forecast) { setShow(s => !s); return; }
    setLoading(true);
    setError(null);
    try {
      const property = await getPropertyById(propertyId);
      const city = property.city || '';
      const country = property.country || '';
      setLocation({ city, country });

      let data = null;
      try {
        const resp = await marketIntelligenceAPI.getMarketForecast({ city, country, months: 6 });
        data = resp.data || resp;
      } catch {
        // Fall back to AI-generated forecast
        data = await fetchAiFallback(property);
        setSourceLabel('AI analysis');
      }

      setForecast(data);
      setShow(true);
    } catch (err) {
      console.error('Market forecast error:', err);
      setError('Could not load market forecast. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const trendColor = (trend) => {
    if (!trend) return '#6B7280';
    const t = trend.toLowerCase();
    if (t.includes('up') || t.includes('rise') || t.includes('grow')) return '#059669';
    if (t.includes('down') || t.includes('fall') || t.includes('declin')) return '#DC2626';
    return '#D97706';
  };

  const trendIcon = (trend) => {
    if (!trend) return '📊';
    const t = trend.toLowerCase();
    if (t.includes('up') || t.includes('rise') || t.includes('grow')) return '📈';
    if (t.includes('down') || t.includes('fall') || t.includes('declin')) return '📉';
    return '➡️';
  };

  return (
    <div className="mb30">
      <button
        type="button"
        onClick={handleGet}
        disabled={loading}
        className="btn w-100"
        style={{
          backgroundColor: show ? '#F0FDF4' : '#065F46',
          color: show ? '#065F46' : 'white',
          border: show ? '2px solid #065F46' : 'none',
          padding: '15px 20px',
          borderRadius: '12px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1,
          transition: 'all 0.3s ease',
          boxShadow: show ? 'none' : '0 4px 12px rgba(6,95,70,0.3)',
        }}
      >
        {loading ? (
          <><span className="spinner-border spinner-border-sm me-2" role="status" />Loading Forecast…</>
        ) : show ? (
          <><i className="fas fa-eye-slash me-2" />Hide Market Forecast</>
        ) : (
          <><i className="fas fa-chart-line me-2" />AI Market Forecast</>
        )}
      </button>

      {error && (
        <div className="alert alert-warning mt-3 mb-0" style={{ borderRadius: '8px', fontSize: '14px' }}>
          <i className="fas fa-exclamation-triangle me-2" />{error}
        </div>
      )}

      {show && forecast && (
        <div className="mt-3" style={{ border: '2px solid #D1FAE5', borderRadius: '12px', overflow: 'hidden', animation: 'slideIn 0.3s ease-out' }}>
          {/* Header */}
          <div style={{ background: 'linear-gradient(135deg, #065F46, #047857)', padding: '16px 20px' }}>
            <h5 style={{ color: 'white', marginBottom: 4, fontWeight: 700 }}>
              <i className="fas fa-chart-line me-2" />Market Forecast
            </h5>
            {location && (
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, marginBottom: 0 }}>
                {location.city}{location.city && location.country ? ', ' : ''}{location.country} · Next 6 months
              </p>
            )}
          </div>

          <div style={{ padding: '16px', background: 'white' }}>
            {/* Summary */}
            {forecast.summary && (
              <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
                {forecast.summary.predictedTrend && (
                  <div style={{ flex: 1, minWidth: 120, background: '#F0FDF4', borderRadius: 8, padding: '10px 14px', textAlign: 'center' }}>
                    <div style={{ fontSize: 22 }}>{trendIcon(forecast.summary.predictedTrend)}</div>
                    <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 2 }}>Trend</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: trendColor(forecast.summary.predictedTrend), textTransform: 'capitalize' }}>
                      {forecast.summary.predictedTrend}
                    </div>
                  </div>
                )}
                {forecast.summary.confidence !== undefined && (
                  <div style={{ flex: 1, minWidth: 120, background: '#EFF6FF', borderRadius: 8, padding: '10px 14px', textAlign: 'center' }}>
                    <div style={{ fontSize: 22 }}>🎯</div>
                    <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 2 }}>Confidence</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#1D4ED8' }}>
                      {Math.round(forecast.summary.confidence * 100)}%
                    </div>
                  </div>
                )}
                {forecast.summary.avgMonthlyChange !== undefined && (
                  <div style={{ flex: 1, minWidth: 120, background: '#FFF7ED', borderRadius: 8, padding: '10px 14px', textAlign: 'center' }}>
                    <div style={{ fontSize: 22 }}>💰</div>
                    <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 2 }}>Avg Change/Mo</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#C2410C' }}>
                      {forecast.summary.avgMonthlyChange > 0 ? '+' : ''}{forecast.summary.avgMonthlyChange?.toFixed(1)}%
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Forecast table */}
            {Array.isArray(forecast.forecasts) && forecast.forecasts.length > 0 && (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: '#F9FAFB' }}>
                      <th style={{ padding: '8px 10px', textAlign: 'left', color: '#374151', fontWeight: 600, borderBottom: '1px solid #E5E7EB' }}>Month</th>
                      <th style={{ padding: '8px 10px', textAlign: 'right', color: '#374151', fontWeight: 600, borderBottom: '1px solid #E5E7EB' }}>Avg Price</th>
                      <th style={{ padding: '8px 10px', textAlign: 'right', color: '#374151', fontWeight: 600, borderBottom: '1px solid #E5E7EB' }}>Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {forecast.forecasts.slice(0, 6).map((f, i) => {
                      const change = f.predictedChange ?? f.changePercent ?? 0;
                      const isPos = change >= 0;
                      return (
                        <tr key={i} style={{ borderBottom: '1px solid #F3F4F6' }}>
                          <td style={{ padding: '7px 10px', color: '#111827' }}>{f.month || f.period || `Month ${i + 1}`}</td>
                          <td style={{ padding: '7px 10px', textAlign: 'right', color: '#1D4ED8', fontWeight: 600 }}>
                            ${(f.predictedPrice || f.avgPrice || 0).toLocaleString()}
                          </td>
                          <td style={{ padding: '7px 10px', textAlign: 'right', fontWeight: 700, color: isPos ? '#059669' : '#DC2626' }}>
                            {isPos ? '▲' : '▼'} {Math.abs(change).toFixed(1)}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* No data fallback */}
            {(!forecast.forecasts || forecast.forecasts.length === 0) && !forecast.summary?.predictedTrend && (
              <p style={{ color: '#9CA3AF', fontSize: 13, textAlign: 'center', padding: '16px 0' }}>
                Not enough local data yet. Market analysis uses available listings in this area.
              </p>
            )}

            <div style={{ fontSize: 11, color: '#9CA3AF', fontStyle: 'italic', marginTop: 12, borderTop: '1px solid #E5E7EB', paddingTop: 10 }}>
              <i className="fas fa-info-circle me-1" />AI forecast based on {sourceLabel}. Always verify with a local expert.
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
