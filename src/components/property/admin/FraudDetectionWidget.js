'use client';
import { useState } from 'react';
import { chatAPI } from '@/services/chatApi';

export default function FraudDetectionWidget({ property }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const handleAnalyze = async () => {
    if (result) { setShow(s => !s); return; }
    setLoading(true);
    try {
      const prompt = `You are an AI fraud detection specialist for a global real estate platform. Analyze this property listing for potential fraud or suspicious patterns:

Title: ${property.title}
Price: $${(property.price || 0).toLocaleString()}
Location: ${property.city}, ${property.country}
Type: ${property.propertyType || 'N/A'} | Ad Type: ${property.propertyAdType || 'N/A'}
Bedrooms: ${property.bedrooms || 0} | Bathrooms: ${property.bathrooms || 0}
Size: ${property.sizeInFt || property.superBuiltUpArea || 'N/A'} sqft
Description: ${(property.description || property.propertyDescription || '').slice(0, 300)}
Agent: ${property.agentId?.name || 'Unknown'} | Email: ${property.agentId?.email || 'N/A'}
Images count: ${Array.isArray(property.images) ? property.images.length : 0}
Submitted: ${property.createdAt ? new Date(property.createdAt).toLocaleDateString() : 'N/A'}

Respond EXACTLY in this format:

RISK_LEVEL: [Low / Medium / High]
SCORE: [0-100, where 100 is highest fraud risk]
FLAGS:
- [flag 1]
- [flag 2]
- [flag 3 if applicable]
RECOMMENDATION: [Approve / Review Further / Reject]
SUMMARY: [1-2 sentences explaining the overall assessment]`;

      const resp = await chatAPI.sendMessage(prompt, `fraud_${property._id}`, []);
      const text = resp.message || resp.aiResponse || '';

      const riskLevel = text.match(/RISK_LEVEL:\s*(.+)/)?.[1]?.trim() || 'Unknown';
      const score = parseInt(text.match(/SCORE:\s*(\d+)/)?.[1] || '0');
      const flagsBlock = text.match(/FLAGS:\n([\s\S]+?)(?=\nRECOMMENDATION:)/)?.[1] || '';
      const flags = flagsBlock.split('\n').map(f => f.replace(/^[-•*]\s*/, '').trim()).filter(Boolean);
      const recommendation = text.match(/RECOMMENDATION:\s*(.+)/)?.[1]?.trim() || '';
      const summary = text.match(/SUMMARY:\s*([\s\S]+?)$/)?.[1]?.trim() || '';

      setResult({ riskLevel, score, flags, recommendation, summary });
      setShow(true);
    } catch (err) {
      console.error('Fraud detection error:', err);
    } finally {
      setLoading(false);
    }
  };

  const riskColor = result?.riskLevel === 'High' ? '#DC2626' :
    result?.riskLevel === 'Medium' ? '#D97706' : '#059669';

  const recColor = result?.recommendation === 'Reject' ? '#DC2626' :
    result?.recommendation === 'Review Further' ? '#D97706' : '#059669';

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={handleAnalyze}
        disabled={loading}
        className="btn btn-sm w-100"
        style={{
          backgroundColor: show ? '#FFF3CD' : '#1E40AF',
          color: show ? '#92400E' : 'white',
          border: show ? '1px solid #F59E0B' : 'none',
          borderRadius: '6px',
          fontSize: '12px',
          padding: '5px 8px',
        }}
      >
        {loading ? (
          <><span className="spinner-border spinner-border-sm me-1" role="status" />Analyzing...</>
        ) : show ? (
          <>🛡 Hide Analysis</>
        ) : (
          <>🔍 AI Fraud Check</>
        )}
      </button>

      {show && result && (
        <div style={{
          marginTop: 8,
          border: `2px solid ${riskColor}`,
          borderRadius: 8,
          overflow: 'hidden',
          fontSize: 12,
        }}>
          {/* Risk Header */}
          <div style={{ background: riskColor, padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'white', fontWeight: 700 }}>
              {result.riskLevel === 'High' ? '🚨' : result.riskLevel === 'Medium' ? '⚠️' : '✅'} {result.riskLevel} Risk
            </span>
            <span style={{ color: 'white', fontWeight: 700, fontSize: 14 }}>Score: {result.score}/100</span>
          </div>

          <div style={{ padding: '10px 12px', background: 'white' }}>
            {/* Flags */}
            {result.flags.length > 0 && (
              <div style={{ marginBottom: 8 }}>
                <strong style={{ fontSize: 11, color: '#374151' }}>Flags:</strong>
                <ul style={{ margin: '4px 0 0 0', paddingLeft: 16 }}>
                  {result.flags.map((f, i) => (
                    <li key={i} style={{ color: '#4B5563', marginBottom: 2 }}>{f}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommendation */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <span style={{ fontSize: 11, color: '#374151', fontWeight: 600 }}>Recommendation:</span>
              <span style={{
                background: recColor, color: 'white',
                padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700
              }}>
                {result.recommendation}
              </span>
            </div>

            {result.summary && (
              <p style={{ color: '#6B7280', margin: 0, lineHeight: 1.4, fontSize: 11 }}>{result.summary}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
