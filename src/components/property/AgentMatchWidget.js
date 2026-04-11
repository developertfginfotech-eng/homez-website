'use client';
import { useState, useEffect } from 'react';
import { aiAPI } from '@/services/aiApi';
import { getPropertyById } from '@/helpers/propertyApi';
import Image from 'next/image';
import Link from 'next/link';

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3001';

export default function AgentMatchWidget({ propertyId }) {
  const [agents, setAgents] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [show, setShow] = useState(false);
  const [budget, setBudget] = useState('');
  const [showForm, setShowForm] = useState(true);
  const [property, setProperty] = useState(null);

  useEffect(() => {
    if (propertyId) {
      getPropertyById(propertyId)
        .then(p => setProperty(p))
        .catch(() => {});
    }
  }, [propertyId]);

  const handleMatch = async () => {
    if (agents) { setShow(s => !s); return; }
    setLoading(true);
    setError(null);
    try {
      const resp = await aiAPI.matchAgents({
        location: property?.city || property?.country || '',
        propertyType: property?.propertyType || 'Residential',
        budget: budget ? { max: parseInt(budget.replace(/[^0-9]/g, '')) } : {},
        urgency: 'medium',
      });

      if (resp.success && resp.data?.length > 0) {
        setAgents(resp.data);
        setShow(true);
        setShowForm(false);
      } else {
        setError('No agents found for this area. Try broadening your search.');
      }
    } catch (err) {
      setError(err.message || 'Could not find agents. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getAgentImage = (agent) => {
    const img = agent.agentPhoto || agent.photo || agent.profileImage;
    if (!img || img.includes('placeholder') || img.trim() === '') {
      return '/images/team/agent-3.png';
    }
    if (img.startsWith('http')) return img;
    return `${API_BASE}${img}`;
  };

  const renderStars = (rating) => {
    const r = Math.round(rating || 0);
    return '★'.repeat(r) + '☆'.repeat(5 - r);
  };

  return (
    <div className="mb30">
      <button
        type="button"
        onClick={agents ? () => setShow(s => !s) : undefined}
        disabled={loading}
        className="btn w-100"
        style={{
          backgroundColor: show ? '#F0FDF4' : '#059669',
          color: show ? '#059669' : 'white',
          border: show ? '2px solid #059669' : 'none',
          padding: '15px 20px',
          borderRadius: '12px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'default',
          opacity: loading ? 0.7 : 1,
          transition: 'all 0.3s ease',
          boxShadow: show ? 'none' : '0 4px 12px rgba(5,150,105,0.3)',
        }}
      >
        {loading ? (
          <><span className="spinner-border spinner-border-sm me-2" role="status" />Finding Best Agents…</>
        ) : show ? (
          <><i className="fas fa-eye-slash me-2" />Hide Matched Agents</>
        ) : (
          <><i className="fas fa-handshake me-2" />AI Agent Matching</>
        )}
      </button>

      {/* Quick match form */}
      {!show && !loading && showForm && (
        <div style={{ marginTop: 12, padding: '14px 16px', background: '#F0FDF4', borderRadius: 10, border: '1px solid #A7F3D0' }}>
          <p style={{ fontSize: 12, color: '#065F46', marginBottom: 10, fontWeight: 600 }}>
            <i className="fas fa-magic me-1" />Find the best agent for this property
          </p>
          <div style={{ marginBottom: 10 }}>
            <input
              type="text"
              className="form-control"
              placeholder="Your budget (optional, e.g. $500,000)"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              style={{ fontSize: 13, borderRadius: 8 }}
            />
          </div>
          <button
            type="button"
            onClick={handleMatch}
            disabled={loading}
            className="btn w-100"
            style={{
              background: '#059669', color: 'white',
              borderRadius: 8, fontSize: 13, fontWeight: 600,
              padding: '10px', border: 'none',
            }}
          >
            <i className="fas fa-search me-2" />Match Me with an Agent
          </button>
        </div>
      )}

      {error && (
        <div className="alert alert-warning mt-3 mb-0" style={{ borderRadius: '8px', fontSize: '13px' }}>
          <i className="fas fa-exclamation-triangle me-2" />{error}
        </div>
      )}

      {show && agents && (
        <div className="mt-3" style={{ border: '2px solid #A7F3D0', borderRadius: '12px', overflow: 'hidden', animation: 'slideIn 0.3s ease-out' }}>
          {/* Header */}
          <div style={{ background: 'linear-gradient(135deg, #059669, #047857)', padding: '14px 18px' }}>
            <h5 style={{ color: 'white', marginBottom: 3, fontWeight: 700, fontSize: 15 }}>
              <i className="fas fa-handshake me-2" />Best Matched Agents
            </h5>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, marginBottom: 0 }}>
              {property?.city || property?.country || 'Local'} · AI-ranked by experience & specialization
            </p>
          </div>

          <div style={{ padding: '12px', background: 'white' }}>
            {agents.map((agent, i) => (
              <div
                key={agent._id || i}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px',
                  borderRadius: 10,
                  border: '1.5px solid #E5E7EB',
                  marginBottom: i < agents.length - 1 ? 10 : 0,
                  background: i === 0 ? '#F0FDF4' : 'white',
                }}
              >
                {/* Avatar */}
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <img
                    src={getAgentImage(agent)}
                    alt={agent.name}
                    width={52}
                    height={52}
                    style={{ borderRadius: '50%', objectFit: 'cover', border: '2px solid #A7F3D0' }}
                    onError={(e) => { e.target.src = '/images/team/agent-3.png'; }}
                  />
                  {i === 0 && (
                    <div style={{
                      position: 'absolute', top: -4, right: -4,
                      background: '#F59E0B', borderRadius: '50%',
                      width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 9, fontWeight: 800, color: 'white',
                    }}>
                      #1
                    </div>
                  )}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#111827', marginBottom: 2 }}>
                    {agent.agentName || agent.name || 'Agent'}
                  </div>
                  {agent.rating > 0 && (
                    <div style={{ fontSize: 11, color: '#F59E0B', marginBottom: 3 }}>
                      {renderStars(agent.rating)}
                      <span style={{ color: '#6B7280', marginLeft: 4 }}>({agent.rating?.toFixed(1)})</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {agent.yearsOfExperience > 0 && (
                      <span style={{ fontSize: 11, color: '#6B7280' }}>
                        <i className="fas fa-briefcase me-1" />{agent.yearsOfExperience}y exp
                      </span>
                    )}
                    {agent.totalDeals > 0 && (
                      <span style={{ fontSize: 11, color: '#6B7280' }}>
                        <i className="fas fa-check-circle me-1" />{agent.totalDeals} deals
                      </span>
                    )}
                  </div>
                  {agent.specializations?.length > 0 && (
                    <div style={{ marginTop: 4, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {agent.specializations.slice(0, 2).map((s, si) => (
                        <span key={si} style={{
                          fontSize: 10, background: '#D1FAE5', color: '#065F46',
                          padding: '2px 7px', borderRadius: 10, fontWeight: 600,
                        }}>
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action */}
                <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {(agent.agentPhone || agent.phone) && (
                    <a
                      href={`tel:${agent.agentPhone || agent.phone}`}
                      style={{
                        display: 'block', textAlign: 'center',
                        background: '#059669', color: 'white',
                        borderRadius: 6, padding: '5px 10px', fontSize: 11, fontWeight: 600,
                        textDecoration: 'none',
                      }}
                    >
                      <i className="fas fa-phone me-1" />Call
                    </a>
                  )}
                  {(agent.agentId || agent._id) && (
                    <Link
                      href={`/agent-single/${agent.agentId || agent._id}`}
                      style={{
                        display: 'block', textAlign: 'center',
                        background: '#F0FDF4', color: '#059669',
                        border: '1px solid #A7F3D0',
                        borderRadius: 6, padding: '5px 10px', fontSize: 11, fontWeight: 600,
                        textDecoration: 'none',
                      }}
                    >
                      Profile
                    </Link>
                  )}
                </div>
              </div>
            ))}

            <p style={{ fontSize: 11, color: '#9CA3AF', fontStyle: 'italic', marginTop: 12, marginBottom: 0, borderTop: '1px solid #E5E7EB', paddingTop: 10 }}>
              <i className="fas fa-info-circle me-1" />AI-ranked by specialization, experience, and deal history.
            </p>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
