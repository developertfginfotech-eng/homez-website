'use client';

import { useState, useEffect } from 'react';
import DashboardHeader from '@/components/common/DashboardHeader';
import MobileMenu from '@/components/common/mobile-menu';
import DboardMobileNavigation from '@/components/property/dashboard/DboardMobileNavigation';
import Footer from '@/components/property/dashboard/Footer';
import SidebarDashboard from '@/components/property/dashboard/SidebarDashboard';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

function formatPrice(price) {
  if (!price && price !== 0) return null;
  return '$' + Number(price).toLocaleString();
}

const COLUMNS = [
  {
    key: 'shortlisted',
    label: 'Shortlisted',
    icon: 'fas fa-bookmark',
    color: '#2563eb',
    bgColor: '#eff6ff',
    borderColor: '#bfdbfe',
    headerBg: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
  },
  {
    key: 'offerMade',
    label: 'Offer Made',
    icon: 'fas fa-file-signature',
    color: '#d97706',
    bgColor: '#fffbeb',
    borderColor: '#fde68a',
    headerBg: 'linear-gradient(135deg, #f59e0b, #d97706)',
  },
  {
    key: 'negotiating',
    label: 'Negotiating',
    icon: 'fas fa-comments-dollar',
    color: '#7c3aed',
    bgColor: '#f5f3ff',
    borderColor: '#ddd6fe',
    headerBg: 'linear-gradient(135deg, #7c3aed, #5b21b6)',
  },
  {
    key: 'closed',
    label: 'Closed',
    icon: 'fas fa-handshake',
    color: '#059669',
    bgColor: '#f0fdf4',
    borderColor: '#bbf7d0',
    headerBg: 'linear-gradient(135deg, #059669, #047857)',
  },
];

function DealCard({ item, column }) {
  const chipColors = {
    shortlisted: { bg: '#eff6ff', color: '#2563eb' },
    offerMade:   { bg: '#fffbeb', color: '#d97706' },
    negotiating: { bg: '#f5f3ff', color: '#7c3aed' },
    closed:      { bg: '#f0fdf4', color: '#059669' },
  };
  const chip = chipColors[column.key];

  return (
    <div style={{
      background: 'white',
      borderRadius: 10,
      border: `1.5px solid ${column.borderColor}`,
      padding: '14px 16px',
      marginBottom: 10,
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      transition: 'box-shadow 0.15s',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 8 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: '#111827', lineHeight: 1.3, flex: 1 }}>
          {item.name}
        </div>
        <span style={{ background: chip.bg, color: chip.color, padding: '2px 8px', borderRadius: 12, fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0 }}>
          {column.label}
        </span>
      </div>
      {item.price && (
        <div style={{ fontSize: 13, fontWeight: 700, color: column.color, marginBottom: 4 }}>
          {item.price}
        </div>
      )}
      {item.city && (
        <div style={{ fontSize: 12, color: '#9ca3af' }}>
          <i className="fas fa-map-marker-alt me-1" style={{ fontSize: 10 }} />{item.city}
        </div>
      )}
      {item.offerPrice && (
        <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
          <i className="fas fa-tag me-1" style={{ fontSize: 10 }} />
          Offer: <strong>{item.offerPrice}</strong>
        </div>
      )}
    </div>
  );
}

export default function DashboardDealTracker() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [columns, setColumns] = useState({
    shortlisted: [],
    offerMade: [],
    negotiating: [],
    closed: [],
  });
  const [counts, setCounts] = useState({ shortlisted: 0, offerMade: 0, negotiating: 0, closed: 0 });

  useEffect(() => {
    let role = null;
    const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    if (userStr) {
      try { role = JSON.parse(userStr)?.role; setUserRole(role); } catch {}
    }
    loadBoardData(role);
  }, []);

  const loadBoardData = async (role) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('authToken');
      const headers = { Authorization: `Bearer ${token}` };

      const isSeller = role === 'seller' || role === 'broker' || role === 'admin';

      // Always fetch favorites for shortlisted column
      const [favRes, offersRes] = await Promise.all([
        fetch(`${API_URL}/favorites`, { headers }),
        fetch(`${API_URL}/offers/${isSeller ? 'received' : 'my-offers'}`, { headers }),
      ]);

      let shortlistedItems = [];
      if (favRes.ok) {
        const favData = await favRes.json();
        const favList = Array.isArray(favData) ? favData : (favData.favorites || favData.data || []);
        shortlistedItems = favList.map(fav => {
          const prop = fav.propertyId || fav.property || fav;
          return {
            id: fav._id || prop._id,
            name: prop.propertyName || prop.title || 'Property',
            price: formatPrice(prop.price || prop.listingPrice),
            city: prop.city || prop.location || null,
          };
        });
      }

      let offerMadeItems = [];
      let negotiatingItems = [];
      let closedItems = [];

      if (offersRes.ok) {
        const offersData = await offersRes.json();
        const offersList = Array.isArray(offersData) ? offersData : (offersData.offers || offersData.data || []);

        offersList.forEach(offer => {
          const prop = offer.propertyId || offer.property || {};
          const propName = prop.propertyName || prop.title || offer.propertyName || 'Property';
          const offerEntry = {
            id: offer._id,
            name: propName,
            price: formatPrice(prop.price || prop.listingPrice),
            city: prop.city || prop.location || null,
            offerPrice: formatPrice(offer.offerPrice),
          };

          if (offer.status === 'pending') {
            offerMadeItems.push(offerEntry);
          } else if (offer.status === 'countered') {
            negotiatingItems.push(offerEntry);
          } else if (offer.status === 'accepted') {
            closedItems.push(offerEntry);
          }
        });
      }

      const newColumns = {
        shortlisted: shortlistedItems,
        offerMade: offerMadeItems,
        negotiating: negotiatingItems,
        closed: closedItems,
      };

      setColumns(newColumns);
      setCounts({
        shortlisted: shortlistedItems.length,
        offerMade: offerMadeItems.length,
        negotiating: negotiatingItems.length,
        closed: closedItems.length,
      });
    } catch (err) {
      setError(err.message || 'Failed to load deal tracker');
    } finally {
      setLoading(false);
    }
  };

  const totalDeals = Object.values(counts).reduce((a, b) => a + b, 0);

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
                      <h2>Deal Tracker</h2>
                      <p className="text">
                        Visual pipeline of your property deals — {totalDeals} active {totalDeals === 1 ? 'deal' : 'deals'}
                      </p>
                    </div>
                    <button
                      onClick={() => loadBoardData(userRole)}
                      style={{ padding: '8px 18px', borderRadius: 8, border: '1.5px solid #e5e7eb', background: 'white', fontSize: 13, fontWeight: 600, color: '#374151', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                    >
                      <i className="fas fa-sync-alt" style={{ fontSize: 12 }} /> Refresh
                    </button>
                  </div>
                </div>
              </div>

              {loading ? (
                <div style={{ textAlign: 'center', padding: '80px 0' }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', border: '3px solid #f3f4f6', borderTopColor: '#7c3aed', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
                  <p style={{ color: '#9ca3af' }}>Building your deal board…</p>
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
              ) : error ? (
                <div style={{ textAlign: 'center', padding: '80px 0' }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
                  <h4>Could Not Load Deal Tracker</h4>
                  <p style={{ color: '#9ca3af', marginBottom: 20 }}>{error}</p>
                  <button onClick={() => loadBoardData(userRole)} className="ud-btn btn-thm">Try Again</button>
                </div>
              ) : (
                <>
                  {/* Summary stats strip */}
                  <div className="row mb30">
                    {COLUMNS.map(col => (
                      <div key={col.key} className="col-6 col-lg-3 mb15-md">
                        <div style={{ background: 'white', borderRadius: 12, padding: '16px 20px', border: `1.5px solid ${col.borderColor}`, display: 'flex', alignItems: 'center', gap: 14 }}>
                          <div style={{ width: 42, height: 42, borderRadius: 10, background: col.headerBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <i className={col.icon} style={{ color: 'white', fontSize: 16 }} />
                          </div>
                          <div>
                            <div style={{ fontSize: 22, fontWeight: 800, color: '#111827', lineHeight: 1 }}>{counts[col.key]}</div>
                            <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>{col.label}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Kanban board */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(4, 1fr)',
                      gap: 16,
                    }}
                    className="deal-tracker-board"
                  >
                    {COLUMNS.map(col => (
                      <div key={col.key}>
                        {/* Column header */}
                        <div style={{ background: col.headerBg, borderRadius: '10px 10px 0 0', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <i className={col.icon} style={{ color: 'white', fontSize: 14 }} />
                            <span style={{ color: 'white', fontWeight: 700, fontSize: 14 }}>{col.label}</span>
                          </div>
                          <span style={{ background: 'rgba(255,255,255,0.25)', color: 'white', borderRadius: 12, padding: '2px 9px', fontSize: 12, fontWeight: 700 }}>
                            {counts[col.key]}
                          </span>
                        </div>

                        {/* Column body */}
                        <div style={{ background: col.bgColor, borderRadius: '0 0 10px 10px', border: `1.5px solid ${col.borderColor}`, borderTop: 'none', padding: '12px 10px', minHeight: 200 }}>
                          {columns[col.key].length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '30px 12px', color: col.color, opacity: 0.5 }}>
                              <i className={col.icon} style={{ fontSize: 24, display: 'block', marginBottom: 8 }} />
                              <span style={{ fontSize: 12 }}>No deals here yet</span>
                            </div>
                          ) : (
                            columns[col.key].map(item => (
                              <DealCard key={item.id} item={item} column={col} />
                            ))
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Responsive styles for mobile */}
                  <style>{`
                    @media (max-width: 991px) {
                      .deal-tracker-board {
                        grid-template-columns: repeat(2, 1fr) !important;
                      }
                    }
                    @media (max-width: 575px) {
                      .deal-tracker-board {
                        grid-template-columns: 1fr !important;
                      }
                    }
                  `}</style>

                  {totalDeals === 0 && (
                    <div style={{ textAlign: 'center', marginTop: 40, padding: '40px 0' }}>
                      <div style={{ fontSize: 52, marginBottom: 16 }}>🗺️</div>
                      <h4>Your Deal Board Is Empty</h4>
                      <p style={{ color: '#9ca3af', maxWidth: 380, margin: '0 auto' }}>
                        Save properties to your favorites to add them to Shortlisted, or submit offers to move deals through the pipeline.
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
}
