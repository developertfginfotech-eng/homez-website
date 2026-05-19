'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardHeader from '@/components/common/DashboardHeader';
import MobileMenu from '@/components/common/mobile-menu';
import DboardMobileNavigation from '@/components/property/dashboard/DboardMobileNavigation';
import Footer from '@/components/property/dashboard/Footer';
import SidebarDashboard from '@/components/property/dashboard/SidebarDashboard';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3001';

const SELLER_ROLES = ['seller', 'broker', 'admin'];

function StatusBadge({ status }) {
  const cfg = {
    approved:  { bg: '#f0fdf4', color: '#059669', border: '#bbf7d0', label: 'Approved' },
    pending:   { bg: '#fffbeb', color: '#d97706', border: '#fde68a', label: 'Pending' },
    rejected:  { bg: '#fef2f2', color: '#dc2626', border: '#fca5a5', label: 'Rejected' },
    draft:     { bg: '#f9fafb', color: '#6b7280', border: '#e5e7eb', label: 'Draft' },
  };
  const c = cfg[status?.toLowerCase()] || cfg.draft;
  return (
    <span style={{
      fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 12,
      background: c.bg, color: c.color, border: `1px solid ${c.border}`,
    }}>
      {c.label}
    </span>
  );
}

function StatBox({ icon, label, value, color }) {
  return (
    <div style={{
      flex: 1, minWidth: 0, background: '#f9fafb', borderRadius: 10,
      padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 8, background: color + '18',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <i className={icon} style={{ color, fontSize: 13 }} />
      </div>
      <div>
        <div style={{ fontSize: 18, fontWeight: 800, color: '#111827', lineHeight: 1.1 }}>{value}</div>
        <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>{label}</div>
      </div>
    </div>
  );
}

function ViewBar({ views, maxViews }) {
  const pct = maxViews > 0 ? Math.round((views / maxViews) * 100) : 0;
  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
        <span style={{ fontSize: 11, color: '#9ca3af' }}>Relative views</span>
        <span style={{ fontSize: 11, color: '#9ca3af' }}>{pct}%</span>
      </div>
      <div style={{ height: 6, background: '#f3f4f6', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          background: 'linear-gradient(90deg, #7c3aed, #5b21b6)',
          borderRadius: 10,
          transition: 'width 0.6s ease',
        }} />
      </div>
    </div>
  );
}

export default function DashboardListingAnalytics() {
  const router = useRouter();
  const [properties, setProperties] = useState([]);
  const [mergedStats, setMergedStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [roleChecked, setRoleChecked] = useState(false);

  useEffect(() => {
    const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    let role = null;
    if (userStr) {
      try { role = JSON.parse(userStr)?.role; } catch {}
    }
    setUserRole(role);
    setRoleChecked(true);
    if (role && !SELLER_ROLES.includes(role)) {
      router.replace('/dashboard-home');
      return;
    }
    fetchAll();
  }, []);

  const getAuthHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  };

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [propsRes, favsRes, inqsRes] = await Promise.all([
        fetch(`${API_URL}/property/agent/properties`, { headers: getAuthHeaders() }),
        fetch(`${API_URL}/favorites/my-properties`, { headers: getAuthHeaders() }),
        fetch(`${API_URL}/inquiries`, { headers: getAuthHeaders() }),
      ]);

      const [propsData, favsData, inqsData] = await Promise.all([
        propsRes.ok ? propsRes.json() : Promise.resolve({ properties: [], data: [] }),
        favsRes.ok ? favsRes.json() : Promise.resolve([]),
        inqsRes.ok ? inqsRes.json() : Promise.resolve({ data: [] }),
      ]);

      const props = Array.isArray(propsData)
        ? propsData
        : (propsData.properties || propsData.data || []);

      // Build a map of propertyId -> saves count
      const favsArr = Array.isArray(favsData) ? favsData : (favsData.data || favsData.favorites || []);
      const savesMap = {};
      favsArr.forEach(fav => {
        const pid = fav.propertyId?._id || fav.propertyId || fav._id;
        if (pid) savesMap[pid] = (savesMap[pid] || 0) + 1;
      });

      // Build a map of propertyId -> inquiries count
      const inqsArr = Array.isArray(inqsData) ? inqsData : (inqsData.data || inqsData.inquiries || []);
      const inqsMap = {};
      inqsArr.forEach(inq => {
        const pid = inq.propertyId?._id || inq.propertyId;
        if (pid) inqsMap[pid] = (inqsMap[pid] || 0) + 1;
      });

      const stats = {};
      props.forEach(p => {
        const id = p._id;
        stats[id] = {
          saves: savesMap[id] || 0,
          inquiries: inqsMap[id] || 0,
        };
      });

      setProperties(props);
      setMergedStats(stats);
    } catch (err) {
      console.error(err);
      setError('Failed to load analytics. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getThumb = (property) => {
    const imgs = property.images;
    if (imgs && imgs.length > 0) {
      return imgs[0].startsWith('http') ? imgs[0] : `${BACKEND_URL}${imgs[0]}`;
    }
    return '/images/listings/lg-1.jpg';
  };

  const maxViews = Math.max(1, ...properties.map(p => p.viewCount || p.views || 0));

  if (roleChecked && userRole && !SELLER_ROLES.includes(userRole)) {
    return null;
  }

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
                  <div
                    className="dashboard_title_area"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}
                  >
                    <div>
                      <h2>Listing Analytics</h2>
                      <p className="text">Views, saves, and inquiry performance for each of your properties</p>
                    </div>
                    <button
                      onClick={fetchAll}
                      style={{
                        padding: '8px 18px', borderRadius: 8, border: '1.5px solid #e5e7eb',
                        background: 'white', fontSize: 13, fontWeight: 600, color: '#374151',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                      }}
                    >
                      <i className="fas fa-sync-alt" style={{ fontSize: 12 }} /> Refresh
                    </button>
                  </div>
                </div>
              </div>

              {loading ? (
                <div style={{ textAlign: 'center', padding: '80px 0' }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%',
                    border: '3px solid #f3f4f6', borderTopColor: '#7c3aed',
                    animation: 'spin 0.8s linear infinite', margin: '0 auto 16px',
                  }} />
                  <p style={{ color: '#9ca3af' }}>Loading analytics...</p>
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
              ) : error ? (
                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>⚠️</div>
                  <p style={{ color: '#dc2626', marginBottom: 16 }}>{error}</p>
                  <button
                    onClick={fetchAll}
                    style={{
                      padding: '8px 20px', borderRadius: 8, border: 'none',
                      background: '#7c3aed', color: 'white', fontWeight: 600, cursor: 'pointer',
                    }}
                  >
                    Retry
                  </button>
                </div>
              ) : properties.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px 0' }}>
                  <div style={{ fontSize: 56, marginBottom: 16 }}>📊</div>
                  <h4>No listings yet</h4>
                  <p style={{ color: '#9ca3af', maxWidth: 400, margin: '0 auto' }}>
                    Analytics will appear once you create property listings.
                  </p>
                </div>
              ) : (
                <>
                  {/* Summary bar */}
                  <div className="row mb30">
                    {[
                      {
                        icon: 'fas fa-home', label: 'Listings', color: '#7c3aed',
                        value: properties.length,
                      },
                      {
                        icon: 'fas fa-eye', label: 'Total Views', color: '#2563eb',
                        value: properties.reduce((s, p) => s + (p.viewCount || p.views || 0), 0).toLocaleString(),
                      },
                      {
                        icon: 'fas fa-heart', label: 'Total Saves', color: '#ec4899',
                        value: Object.values(mergedStats).reduce((s, v) => s + v.saves, 0),
                      },
                      {
                        icon: 'fas fa-envelope', label: 'Total Inquiries', color: '#d97706',
                        value: Object.values(mergedStats).reduce((s, v) => s + v.inquiries, 0),
                      },
                    ].map((item) => (
                      <div key={item.label} className="col-6 col-lg-3 mb15">
                        <div style={{
                          background: 'white', borderRadius: 14, padding: '18px 20px',
                          border: '1.5px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 14,
                        }}>
                          <div style={{
                            width: 44, height: 44, borderRadius: 12, background: item.color + '15',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                          }}>
                            <i className={item.icon} style={{ color: item.color, fontSize: 16 }} />
                          </div>
                          <div>
                            <div style={{ fontSize: 22, fontWeight: 800, color: '#111827', lineHeight: 1.1 }}>
                              {item.value}
                            </div>
                            <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 3 }}>{item.label}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Per-listing cards */}
                  <div className="row">
                    {properties.map(property => {
                      const id = property._id;
                      const stats = mergedStats[id] || { saves: 0, inquiries: 0 };
                      const views = property.viewCount || property.views || 0;
                      return (
                        <div key={id} className="col-lg-6 col-xl-4 mb24">
                          <div style={{
                            background: 'white', borderRadius: 16, border: '1.5px solid #f0f0f0',
                            overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column',
                          }}>
                            {/* Thumbnail */}
                            <div style={{ position: 'relative', height: 160, flexShrink: 0 }}>
                              <img
                                src={getThumb(property)}
                                alt={property.propertyName || property.title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                onError={e => { e.target.src = '/images/listings/lg-1.jpg'; }}
                              />
                              <div style={{
                                position: 'absolute', top: 10, right: 10,
                              }}>
                                <StatusBadge status={property.approvalStatus || property.status} />
                              </div>
                            </div>

                            {/* Info */}
                            <div style={{ padding: '16px 18px 14px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                              <div style={{ marginBottom: 12 }}>
                                <h6 style={{ fontWeight: 700, color: '#111827', marginBottom: 4, fontSize: 14 }}>
                                  {property.propertyName || property.title || 'Untitled Property'}
                                </h6>
                                <div style={{ fontSize: 12, color: '#9ca3af' }}>
                                  {property.city && <><i className="fas fa-map-marker-alt me-1" />{property.city}</>}
                                  {property.price && (
                                    <span style={{ marginLeft: 10, color: '#7c3aed', fontWeight: 700 }}>
                                      ${Number(property.price).toLocaleString()}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Stats row */}
                              <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                                <StatBox icon="fas fa-eye" label="Views" value={views.toLocaleString()} color="#2563eb" />
                                <StatBox icon="fas fa-heart" label="Saves" value={stats.saves} color="#ec4899" />
                                <StatBox icon="fas fa-envelope" label="Inquiries" value={stats.inquiries} color="#d97706" />
                              </div>

                              {/* View bar */}
                              <ViewBar views={views} maxViews={maxViews} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
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
