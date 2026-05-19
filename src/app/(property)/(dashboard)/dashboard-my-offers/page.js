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

export default function DashboardMyOffers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [actionError, setActionError] = useState(null);

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
      const res = await fetch(`${API_URL}/offers/my-offers`, {
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

  const handleCounterAction = async (offerId, action) => {
    setActionLoading(offerId + action);
    setActionError(null);
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${API_URL}/offers/${offerId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: action }),
      });
      if (!res.ok) throw new Error('Failed to update offer status');
      await fetchOffers();
    } catch (err) {
      setActionError(err.message || 'Action failed');
    } finally {
      setActionLoading(null);
    }
  };

  const isBuyerRole = !userRole || userRole === 'buyer' || userRole === 'user';

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
                      <h2>My Offers</h2>
                      <p className="text">Track all offers you have submitted on properties</p>
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

              {!isBuyerRole ? (
                <div style={{ textAlign: 'center', padding: '80px 0' }}>
                  <div style={{ fontSize: 52, marginBottom: 16 }}>🏠</div>
                  <h4>Seller View Not Available Here</h4>
                  <p style={{ color: '#9ca3af' }}>This page is for buyers. Go to <strong>Manage Offers</strong> to review offers on your listings.</p>
                </div>
              ) : loading ? (
                <div style={{ textAlign: 'center', padding: '80px 0' }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', border: '3px solid #f3f4f6', borderTopColor: '#7c3aed', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
                  <p style={{ color: '#9ca3af' }}>Loading your offers…</p>
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
                  <div style={{ fontSize: 52, marginBottom: 16 }}>📋</div>
                  <h4>No Offers Yet</h4>
                  <p style={{ color: '#9ca3af' }}>You haven't submitted any offers yet. Browse properties and make your first offer.</p>
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
                        const isCountered = offer.status === 'countered';
                        const isPending = offer.status === 'pending';
                        return (
                          <div
                            key={offer._id}
                            style={{
                              background: 'white',
                              borderRadius: 14,
                              border: '1.5px solid',
                              borderColor: isCountered ? '#bfdbfe' : '#f0f0f0',
                              padding: '22px 28px',
                              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                            }}
                          >
                            <div className="row align-items-center">
                              {/* Property + Offer Info */}
                              <div className="col-md-6 col-lg-5">
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                                  <div style={{ width: 44, height: 44, borderRadius: 10, background: 'linear-gradient(135deg, #7c3aed22, #7c3aed44)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <i className="fas fa-home" style={{ color: '#7c3aed', fontSize: 18 }} />
                                  </div>
                                  <div>
                                    <div style={{ fontWeight: 700, fontSize: 15, color: '#111827', marginBottom: 3 }}>{propertyName}</div>
                                    <div style={{ fontSize: 12, color: '#9ca3af' }}>
                                      <i className="fas fa-tag me-1" />
                                      Offered: <strong style={{ color: '#374151' }}>{formatPrice(offer.offerPrice)}</strong>
                                    </div>
                                    <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>
                                      <i className="fas fa-calendar me-1" />
                                      Submitted: {formatDate(offer.createdAt)}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Status */}
                              <div className="col-md-3 col-lg-3 mt15-md">
                                <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</div>
                                <StatusBadge status={offer.status} />
                              </div>

                              {/* Action / Info panel */}
                              <div className="col-md-3 col-lg-4 mt15-md">
                                {isPending && (
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#b45309', background: '#fffbeb', padding: '8px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500 }}>
                                    <i className="fas fa-clock" />
                                    Awaiting response
                                  </div>
                                )}
                                {offer.status === 'accepted' && (
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#15803d', background: '#f0fdf4', padding: '8px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500 }}>
                                    <i className="fas fa-check-circle" />
                                    Offer accepted! Expect contact soon.
                                  </div>
                                )}
                                {offer.status === 'rejected' && (
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#b91c1c', background: '#fef2f2', padding: '8px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500 }}>
                                    <i className="fas fa-times-circle" />
                                    Offer was not accepted
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Counter offer section */}
                            {isCountered && (
                              <div style={{ marginTop: 20, padding: '16px 20px', background: '#eff6ff', borderRadius: 10, border: '1px solid #bfdbfe' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                  <i className="fas fa-exchange-alt" style={{ color: '#1d4ed8', fontSize: 14 }} />
                                  <span style={{ fontWeight: 700, color: '#1d4ed8', fontSize: 14 }}>
                                    Seller counter-offered at {formatPrice(offer.counterPrice || offer.counterOffer?.price)}
                                  </span>
                                </div>
                                {(offer.counterMessage || offer.counterOffer?.message) && (
                                  <p style={{ fontSize: 13, color: '#374151', marginBottom: 12, lineHeight: 1.5 }}>
                                    "{offer.counterMessage || offer.counterOffer?.message}"
                                  </p>
                                )}
                                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                                  <button
                                    onClick={() => handleCounterAction(offer._id, 'accepted')}
                                    disabled={!!actionLoading}
                                    style={{ padding: '8px 20px', borderRadius: 8, background: actionLoading === offer._id + 'accepted' ? '#e5e7eb' : '#16a34a', color: 'white', border: 'none', fontWeight: 700, fontSize: 13, cursor: actionLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                                  >
                                    {actionLoading === offer._id + 'accepted' ? <span className="spinner-border spinner-border-sm" /> : <><i className="fas fa-check" /> Accept Counter</>}
                                  </button>
                                  <button
                                    onClick={() => handleCounterAction(offer._id, 'rejected')}
                                    disabled={!!actionLoading}
                                    style={{ padding: '8px 20px', borderRadius: 8, background: actionLoading === offer._id + 'rejected' ? '#e5e7eb' : '#dc2626', color: 'white', border: 'none', fontWeight: 700, fontSize: 13, cursor: actionLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                                  >
                                    {actionLoading === offer._id + 'rejected' ? <span className="spinner-border spinner-border-sm" /> : <><i className="fas fa-times" /> Decline Counter</>}
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
