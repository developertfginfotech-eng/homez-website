'use client';
import { useState } from 'react';
import { getPropertiesByAgent } from '@/helpers/propertyApi';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const INTENT_COLORS = {
  High: { bg: '#FEF2F2', border: '#FCA5A5', badge: '#DC2626', text: 'High Intent' },
  Medium: { bg: '#FFFBEB', border: '#FCD34D', badge: '#D97706', text: 'Medium Intent' },
  Low: { bg: '#F0FDF4', border: '#86EFAC', badge: '#059669', text: 'Low Intent' },
};

export default function BuyerIntentWidget() {
  const [leads, setLeads] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [show, setShow] = useState(false);

  const handleAnalyze = async () => {
    if (leads) { setShow(s => !s); return; }
    setLoading(true);
    setError(null);
    try {
      // Fetch agent's properties — only approved ones
      const result = await getPropertiesByAgent();
      const allProperties = Array.isArray(result) ? result : (result?.data || []);
      const properties = allProperties.filter(p => p.approvalStatus === 'approved');
      const topProps = properties.slice(0, 8);

      if (allProperties.length === 0) {
        setError('No properties found. Add listings to analyze buyer intent.');
        setLoading(false);
        return;
      }

      if (topProps.length === 0) {
        setError('No approved properties yet. Your listings need admin approval before buyer intent can be analyzed.');
        setLoading(false);
        return;
      }

      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
      const resp = await fetch(`${API_URL}/ai/buyer-intent-analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ properties: topProps }),
      });

      const data = await resp.json();

      if (!resp.ok || !data.success) {
        throw new Error(data.message || 'Analysis failed');
      }

      const parsed = data.data || [];
      setLeads(parsed.length > 0 ? parsed : null);
      if (parsed.length === 0) setError('Could not analyze intent. Please try again.');
      else setShow(true);
    } catch (err) {
      console.error('Buyer intent error:', err);
      setError('Could not analyze buyer intent. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
      <div className="d-flex align-items-center justify-content-between mb20">
        <h4 className="title fz17 mb-0">
          <i className="fas fa-bullseye me-2" style={{ color: '#DC2626' }} />
          AI Buyer Intent
        </h4>
        <button
          type="button"
          onClick={handleAnalyze}
          disabled={loading}
          className="btn btn-sm"
          style={{
            backgroundColor: show ? '#FEF2F2' : '#DC2626',
            color: show ? '#DC2626' : 'white',
            border: show ? '1px solid #FCA5A5' : 'none',
            borderRadius: '8px',
            fontSize: '13px',
            padding: '6px 14px',
            fontWeight: 600,
          }}
        >
          {loading ? (
            <><span className="spinner-border spinner-border-sm me-1" role="status" />Analyzing…</>
          ) : show ? (
            'Hide'
          ) : (
            '🎯 Analyze Intent'
          )}
        </button>
      </div>

      {!show && !loading && (
        <p style={{ color: '#9CA3AF', fontSize: 13, marginBottom: 0 }}>
          Click "Analyze Intent" to see which of your <strong>approved</strong> listings have the highest buyer interest and get actionable recommendations.
        </p>
      )}

      {error && (
        <div className="alert alert-warning mt-2 mb-0" style={{ borderRadius: '8px', fontSize: '13px' }}>
          {error}
        </div>
      )}

      {show && leads && (
        <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
          {leads.map((lead, i) => {
            const colors = INTENT_COLORS[lead.intent] || INTENT_COLORS.Medium;
            return (
              <div
                key={i}
                style={{
                  border: `1.5px solid ${colors.border}`,
                  background: colors.bg,
                  borderRadius: 10,
                  padding: '14px 16px',
                  marginBottom: i < leads.length - 1 ? 12 : 0,
                }}
              >
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span style={{ fontWeight: 700, fontSize: 14, color: '#111827' }}>
                    {i + 1}. {lead.property}
                  </span>
                  <span style={{
                    background: colors.badge, color: 'white',
                    padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700,
                  }}>
                    {colors.text}
                  </span>
                </div>

                {/* Score bar */}
                <div style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 11, color: '#6B7280' }}>Intent Score</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: colors.badge }}>{lead.score}/100</span>
                  </div>
                  <div style={{ height: 6, background: '#E5E7EB', borderRadius: 3 }}>
                    <div style={{ height: '100%', width: `${lead.score}%`, background: colors.badge, borderRadius: 3, transition: 'width 0.5s ease' }} />
                  </div>
                </div>

                {lead.signals.length > 0 && (
                  <div style={{ marginBottom: 8, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {lead.signals.map((s, si) => (
                      <span key={si} style={{ background: 'white', border: `1px solid ${colors.border}`, color: '#374151', borderRadius: 4, padding: '2px 8px', fontSize: 11 }}>
                        {s}
                      </span>
                    ))}
                  </div>
                )}

                {lead.action && (
                  <div style={{ background: 'white', borderRadius: 6, padding: '8px 10px', borderLeft: `3px solid ${colors.badge}` }}>
                    <span style={{ fontSize: 11, color: '#374151', fontWeight: 600 }}>💡 Next Step: </span>
                    <span style={{ fontSize: 11, color: '#4B5563' }}>{lead.action}</span>
                  </div>
                )}
              </div>
            );
          })}

          <p style={{ fontSize: 11, color: '#9CA3AF', fontStyle: 'italic', marginTop: 12, marginBottom: 0, borderTop: '1px solid #E5E7EB', paddingTop: 10 }}>
            <i className="fas fa-info-circle me-1" />AI analysis based on listing engagement. Updated each time you analyze.
          </p>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
