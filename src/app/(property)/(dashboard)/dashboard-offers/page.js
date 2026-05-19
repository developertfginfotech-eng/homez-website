'use client';

import { useState, useEffect } from 'react';
import DashboardHeader from '@/components/common/DashboardHeader';
import MobileMenu from '@/components/common/mobile-menu';
import DboardMobileNavigation from '@/components/property/dashboard/DboardMobileNavigation';
import Footer from '@/components/property/dashboard/Footer';
import SidebarDashboard from '@/components/property/dashboard/SidebarDashboard';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

function formatPrice(price) {
  if (!price && price !== 0) return '—';
  return '$' + Number(price).toLocaleString();
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function StatusBadge({ status }) {
  const styles = {
    pending:    { background: '#fffbeb', color: '#b45309', border: '1px solid #fde68a' },
    accepted:   { background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0' },
    rejected:   { background: '#fef2f2', color: '#b91c1c', border: '1px solid #fca5a5' },
    countered:  { background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' },
  };
  const style = styles[status] || { background: '#f3f4f6', color: '#6b7280', border: '1px solid #e5e7eb' };
  const label = status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown';
  return (
    <span style={{ ...style, padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
      {label}
    </span>
  );
}

function Avatar({ name, size = 38 }) {
  const initials = (name || '?').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  const colors = ['#3b82f6', '#8b5cf6', '#059669', '#d97706', '#eb6753', '#ec4899'];
  const color = colors[(name?.charCodeAt(0) || 0) % colors.length];
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: size * 0.35, flexShrink: 0 }}>
      {initials}
    </div>
  );
}

export default function DashboardOffers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [actionError, setActionError] = useState(null);
  // Counter form state: keyed by offerId
  const [counterForms, setCounterForms] = useState({});

  useEffect(() => {
    const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    if (userStr) {
      try { setUserRole(JSON.parse(userStr)?.role); } catch {}
    }
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${API_URL}/offers/received`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch offers');
      const data = await res.json();
      setOffers(Array.isArray(data) ? data : (data.offers || data.data || []));
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (offerId, status, extra = {}) => {
    setActionLoading(offerId + status);
    setActionError(null);
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${API_URL}/offers/${offerId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status, ...extra }),
      });
      if (!res.ok) throw new Error('Failed to update offer');
      // Close counter form if open
      setCounterForms(prev => { const next = { ...prev }; delete next[offerId]; return next; });
      await fetchOffers();
    } catch (err) {
      setActionError(err.message || 'Action failed');
    } finally {
      setActionLoading(null);
    }
  };

  const openCounterForm = (offerId) => {
    setCounterForms(prev => ({
      ...prev,
      [offerId]: prev[offerId] ? undefined : { counterPrice: '', counterMessage: '' },
    }));
  };

  const updateCounterForm = (offerId, field, value) => {
    setCounterForms(prev => ({
      ...prev,
      [offerId]: { ...prev[offerId], [field]: value },
    }));
  };

  const submitCounter = (offer) => {
    const form = counterForms[offer._id];
    if (!form?.counterPrice) return;
    handleStatusUpdate(offer._id, 'countered', {
      counterPrice: parseFloat(form.counterPrice),
      counterMessage: form.counterMessage,
    });
  };

  const isSellerRole = userRole === 'seller' || userRole === 'broker' || userRole === 'admin';

  return (
    <>
      <DashboardHeader />
      <MobileMenu />
      <div className="dashboard_content_wrapper">
        <div className="dashboard dashboard_wrapper pr30 pr0-xl">
          <SidebarDashboard />
          <div className="dashboard__main pl0-md">
            <div className="dashboard__content bgc-f7">
              <div className="row pb40">
                <div className="col-lg-12">
                  <DboardMobileNavigation />
                </div>
                <div className="col-lg-12">
                  <div className="dashboard_title_area" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                    <div>
                      <h2>Manage Offers</h2>
                      <p className="text">Review and respond to offers received on your properties</p>
                    </div>
                    <button
                      onClick={fetchOffers}
                      style={{ padding: '8px 18px', borderRadius: 8, border: '1.5px solid #e5e7eb', background: 'white', fontSize: 13, fontWeight: 600, color: '#374151', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                    >
                      <i className="fas fa-sync-alt" style={{ fontSize: 12 }} /> Refresh
                    </button>
                  </div>
                </div>
              </div>

              {!isSellerRole ? (
                <div style={{ textAlign: 'center', padding: '80px 0' }}>
                  <div style={{ fontSize: 52, marginBottom: 16 }}>🔒</div>
                  <h4>Access Restricted</h4>
                  <p style={{ color: '#9ca3af' }}>This page is available to sellers, brokers, and admins. To view your submitted offers, visit <strong>My Offers</strong>.</p>
                </div>
              ) : loading ? (
                <div style={{ textAlign: 'center', padding: '80px 0' }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', border: '3px solid #f3f4f6', borderTopColor: '#7c3aed', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
                  <p style={{ color: '#9ca3af' }}>Loading received offers…</p>
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
              ) : error ? (
                <div style={{ textAlign: 'center', padding: '80px 0' }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
                  <h4>Could Not Load Offers</h4>
                  <p style={{ color: '#9ca3af', marginBottom: 20 }}>{error}</p>
                  <button onClick={fetchOffers} className="ud-btn btn-thm">Try Again</button>
                </div>
              ) : offers.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px 0' }}>
                  <div style={{ fontSize: 52, marginBottom: 16 }}>📥</div>
                  <h4>No Offers Received Yet</h4>
                  <p style={{ color: '#9ca3af' }}>When buyers submit offers on your properties, they will appear here.</p>
                </div>
              ) : (
                <div className="row">
                  <div className="col-lg-12">
                    {actionError && (
                      <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#b91c1c', padding: '10px 16px', borderRadius: 8, marginBottom: 20, fontSize: 13 }}>
                        {actionError}
                      </div>
                    )}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      {offers.map((offer) => {
                        const propertyName = offer.propertyId?.propertyName || offer.propertyName || offer.property?.propertyName || 'Property';
                        const buyerName = offer.buyerId?.name || offer.buyerName || offer.buyer?.name || 'Buyer';
                        const isPending = offer.status === 'pending';
                        const counterFormOpen = !!counterForms[offer._id];
                        const form = counterForms[offer._id] || {};

                        return (
                          <div
                            key={offer._id}
                            style={{
                              background: 'white',
                              borderRadius: 14,
                              border: '1.5px solid #f0f0f0',
                              padding: '22px 28px',
                              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                            }}
                          >
                            <div className="row align-items-center">
                              {/* Buyer + Property Info */}
                              <div className="col-md-5 col-lg-5">
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                                  <Avatar name={buyerName} />
                                  <div>
                                    <div style={{ fontWeight: 700, fontSize: 15, color: '#111827', marginBottom: 2 }}>{buyerName}</div>
                                    <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 2 }}>
                                      <i className="fas fa-home me-1" style={{ fontSize: 11 }} />{propertyName}
                                    </div>
                                    <div style={{ fontSize: 12, color: '#9ca3af' }}>
                                      <i className="fas fa-tag me-1" />
                                      Offered: <strong style={{ color: '#374151' }}>{formatPrice(offer.offerPrice)}</strong>
                                      &nbsp;·&nbsp;
                                      <i className="fas fa-calendar me-1" />{formatDate(offer.createdAt)}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Status */}
                              <div className="col-md-2 col-lg-2 mt15-md">
                                <StatusBadge status={offer.status} />
                              </div>

                              {/* Action buttons for pending */}
                              <div className="col-md-5 col-lg-5 mt15-md">
                                {isPending ? (
                                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                    <button
                                      onClick={() => handleStatusUpdate(offer._id, 'accepted')}
                                      disabled={!!actionLoading}
                                      style={{ padding: '7px 16px', borderRadius: 8, background: actionLoading === offer._id + 'accepted' ? '#e5e7eb' : '#16a34a', color: 'white', border: 'none', fontWeight: 700, fontSize: 12, cursor: actionLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}
                                    >
                                      {actionLoading === offer._id + 'accepted' ? <span className="spinner-border spinner-border-sm" /> : <><i className="fas fa-check" /> Accept</>}
                                    </button>
                                    <button
                                      onClick={() => handleStatusUpdate(offer._id, 'rejected')}
                                      disabled={!!actionLoading}
                                      style={{ padding: '7px 16px', borderRadius: 8, background: actionLoading === offer._id + 'rejected' ? '#e5e7eb' : '#dc2626', color: 'white', border: 'none', fontWeight: 700, fontSize: 12, cursor: actionLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}
                                    >
                                      {actionLoading === offer._id + 'rejected' ? <span className="spinner-border spinner-border-sm" /> : <><i className="fas fa-times" /> Reject</>}
                                    </button>
                                    <button
                                      onClick={() => openCounterForm(offer._id)}
                                      style={{ padding: '7px 16px', borderRadius: 8, background: counterFormOpen ? '#e0f2fe' : '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', fontWeight: 700, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}
                                    >
                                      <i className="fas fa-exchange-alt" /> Counter
                                    </button>
                                  </div>
                                ) : (
                                  <span style={{ fontSize: 13, color: '#9ca3af' }}>
                                    {offer.status === 'accepted' && <><i className="fas fa-check-circle me-1 text-success" />Deal accepted</>}
                                    {offer.status === 'rejected' && <><i className="fas fa-times-circle me-1 text-danger" />Offer rejected</>}
                                    {offer.status === 'countered' && <><i className="fas fa-exchange-alt me-1" style={{ color: '#1d4ed8' }} />Counter sent: {formatPrice(offer.counterPrice)}</>}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Inline counter form */}
                            {counterFormOpen && (
                              <div style={{ marginTop: 20, padding: '20px', background: '#f8faff', borderRadius: 10, border: '1px solid #bfdbfe' }}>
                                <div style={{ fontWeight: 700, color: '#1d4ed8', fontSize: 14, marginBottom: 14 }}>
                                  <i className="fas fa-exchange-alt me-2" />Send a Counter Offer
                                </div>
                                <div className="row g-3">
                                  <div className="col-md-4">
                                    <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>Counter Price *</label>
                                    <div style={{ position: 'relative' }}>
                                      <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#6b7280', fontWeight: 600 }}>$</span>
                                      <input
                                        type="number"
                                        placeholder="0"
                                        value={form.counterPrice || ''}
                                        onChange={e => updateCounterForm(offer._id, 'counterPrice', e.target.value)}
                                        style={{ width: '100%', padding: '9px 12px 9px 26px', borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 13, outline: 'none' }}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-8">
                                    <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>Message (optional)</label>
                                    <textarea
                                      placeholder="Add a note to the buyer…"
                                      rows={2}
                                      value={form.counterMessage || ''}
                                      onChange={e => updateCounterForm(offer._id, 'counterMessage', e.target.value)}
                                      style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 13, resize: 'none', outline: 'none' }}
                                    />
                                  </div>
                                </div>
                                <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
                                  <button
                                    onClick={() => submitCounter(offer)}
                                    disabled={!form.counterPrice || !!actionLoading}
                                    style={{ padding: '8px 20px', borderRadius: 8, background: form.counterPrice ? 'linear-gradient(135deg, #1d4ed8, #1e40af)' : '#e5e7eb', color: form.counterPrice ? 'white' : '#9ca3af', border: 'none', fontWeight: 700, fontSize: 13, cursor: form.counterPrice ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', gap: 6 }}
                                  >
                                    {actionLoading === offer._id + 'countered' ? <span className="spinner-border spinner-border-sm" /> : <><i className="fas fa-paper-plane" /> Send Counter</>}
                                  </button>
                                  <button
                                    onClick={() => openCounterForm(offer._id)}
                                    style={{ padding: '8px 16px', borderRadius: 8, background: 'white', color: '#6b7280', border: '1.5px solid #e5e7eb', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
}
