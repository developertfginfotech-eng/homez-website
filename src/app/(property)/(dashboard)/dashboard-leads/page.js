'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardHeader from '@/components/common/DashboardHeader';
import MobileMenu from '@/components/common/mobile-menu';
import DboardMobileNavigation from '@/components/property/dashboard/DboardMobileNavigation';
import Footer from '@/components/property/dashboard/Footer';
import SidebarDashboard from '@/components/property/dashboard/SidebarDashboard';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const SELLER_ROLES = ['seller', 'broker', 'admin'];

const INTERACTION_COLORS = {
  'Inquiry':     { bg: '#fffbeb', color: '#d97706', border: '#fde68a' },
  'Saved':       { bg: '#fdf2f8', color: '#db2777', border: '#f9a8d4' },
  'Tour Request':{ bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' },
};

function timeAgo(date) {
  if (!date) return '—';
  const secs = Math.floor((Date.now() - new Date(date)) / 1000);
  if (secs < 60) return 'just now';
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  if (secs < 604800) return `${Math.floor(secs / 86400)}d ago`;
  return new Date(date).toLocaleDateString();
}

function Avatar({ name, size = 36 }) {
  const initials = (name || '?').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  const colors = ['#3b82f6', '#8b5cf6', '#059669', '#d97706', '#eb6753', '#ec4899'];
  const color = colors[(name?.charCodeAt(0) || 0) % colors.length];
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', background: color,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'white', fontWeight: 700, fontSize: size * 0.35, flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}

function InteractionChip({ label }) {
  const cfg = INTERACTION_COLORS[label] || { bg: '#f3f4f6', color: '#374151', border: '#e5e7eb' };
  return (
    <span style={{
      fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 12,
      background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
      whiteSpace: 'nowrap',
    }}>
      {label}
    </span>
  );
}

export default function DashboardLeads() {
  const router = useRouter();
  const [leads, setLeads] = useState([]);
  const [propertyCount, setPropertyCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [roleChecked, setRoleChecked] = useState(false);
  const [search, setSearch] = useState('');

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
    fetchLeads();
  }, []);

  const getAuthHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  };

  const fetchLeads = async () => {
    setLoading(true);
    setError(null);
    try {
      // Step 1: fetch agent properties, inquiries, and favorites in parallel
      const [propsRes, inqsRes, favsRes] = await Promise.all([
        fetch(`${API_URL}/property/agent/properties`, { headers: getAuthHeaders() }),
        fetch(`${API_URL}/inquiries`, { headers: getAuthHeaders() }),
        fetch(`${API_URL}/favorites/my-properties`, { headers: getAuthHeaders() }),
      ]);

      const [propsData, inqsData, favsData] = await Promise.all([
        propsRes.ok ? propsRes.json() : Promise.resolve({}),
        inqsRes.ok ? inqsRes.json() : Promise.resolve({}),
        favsRes.ok ? favsRes.json() : Promise.resolve([]),
      ]);

      const properties = Array.isArray(propsData)
        ? propsData
        : (propsData.properties || propsData.data || []);

      const propMap = {};
      properties.forEach(p => { propMap[p._id] = p.propertyName || p.title || 'Untitled'; });
      setPropertyCount(properties.length);

      // Step 2: fetch tours for each property in parallel
      const tourResults = await Promise.allSettled(
        properties.map(p =>
          fetch(`${API_URL}/tours/property/${p._id}`, { headers: getAuthHeaders() })
            .then(r => r.ok ? r.json() : Promise.resolve([]))
            .then(data => Array.isArray(data) ? data : (data.tours || data.data || []))
            .then(tours => tours.map(t => ({ ...t, _resolvedPropertyId: p._id })))
        )
      );

      const allTours = tourResults
        .filter(r => r.status === 'fulfilled')
        .flatMap(r => r.value);

      // Step 3: merge all interactions into a lead map keyed by buyerId or email
      const leadMap = {};

      const ensureLead = (key, name, email, propertyId, propertyName, date) => {
        if (!key) return;
        if (!leadMap[key]) {
          leadMap[key] = {
            key, name: name || email || 'Unknown', email: email || '',
            propertyId, propertyName: propertyName || propMap[propertyId] || 'Unknown Property',
            interactions: [], lastSeen: date || null,
          };
        }
        if (date && (!leadMap[key].lastSeen || new Date(date) > new Date(leadMap[key].lastSeen))) {
          leadMap[key].lastSeen = date;
        }
        if (propertyName && !leadMap[key].propertyName) {
          leadMap[key].propertyName = propertyName;
        }
      };

      const addInteraction = (key, type) => {
        if (!leadMap[key]) return;
        if (!leadMap[key].interactions.includes(type)) {
          leadMap[key].interactions.push(type);
        }
      };

      // Inquiries
      const inqsArr = Array.isArray(inqsData) ? inqsData : (inqsData.data || inqsData.inquiries || []);
      inqsArr.forEach(inq => {
        const pid = inq.propertyId?._id || inq.propertyId;
        const key = inq.inquirerId || inq.inquirerEmail || inq.buyerId;
        if (!key) return;
        ensureLead(
          key,
          inq.inquirerName || inq.name,
          inq.inquirerEmail || inq.email,
          pid,
          inq.propertyTitle || propMap[pid],
          inq.createdAt || inq.updatedAt,
        );
        addInteraction(key, 'Inquiry');
      });

      // Favorites (saves on my properties)
      const favsArr = Array.isArray(favsData) ? favsData : (favsData.data || favsData.favorites || []);
      favsArr.forEach(fav => {
        const pid = fav.propertyId?._id || fav.propertyId;
        const buyer = fav.userId || fav.buyerId || fav.user;
        const key = buyer?._id || buyer?.email || buyer;
        if (!key) return;
        ensureLead(
          key,
          buyer?.name || buyer?.fullName,
          buyer?.email,
          pid,
          propMap[pid],
          fav.createdAt,
        );
        addInteraction(key, 'Saved');
      });

      // Tours
      allTours.forEach(tour => {
        const pid = tour.propertyId?._id || tour.propertyId || tour._resolvedPropertyId;
        const buyer = tour.userId || tour.buyerId || tour.requestedBy || tour.user;
        const key = buyer?._id || buyer?.email || tour.email || buyer;
        if (!key) return;
        ensureLead(
          key,
          buyer?.name || buyer?.fullName || tour.name,
          buyer?.email || tour.email,
          pid,
          propMap[pid],
          tour.createdAt || tour.scheduledDate,
        );
        addInteraction(key, 'Tour Request');
      });

      // Sort by lastSeen desc
      const sorted = Object.values(leadMap).sort((a, b) => {
        if (!a.lastSeen) return 1;
        if (!b.lastSeen) return -1;
        return new Date(b.lastSeen) - new Date(a.lastSeen);
      });

      setLeads(sorted);
    } catch (err) {
      console.error(err);
      setError('Failed to load leads. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filtered = leads.filter(lead => {
    const q = search.toLowerCase();
    return (
      lead.name?.toLowerCase().includes(q) ||
      lead.email?.toLowerCase().includes(q) ||
      lead.propertyName?.toLowerCase().includes(q)
    );
  });

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
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <h2 style={{ margin: 0 }}>Leads</h2>
                        {leads.length > 0 && (
                          <span style={{
                            background: '#7c3aed', color: 'white', borderRadius: 20,
                            padding: '2px 11px', fontSize: 12, fontWeight: 700, lineHeight: 1.6,
                          }}>
                            {leads.length}
                          </span>
                        )}
                      </div>
                      <p className="text" style={{ margin: 0 }}>
                        {leads.length > 0
                          ? `${leads.length} lead${leads.length !== 1 ? 's' : ''} across ${propertyCount} propert${propertyCount !== 1 ? 'ies' : 'y'}`
                          : 'Buyers who have interacted with your listings'
                        }
                      </p>
                    </div>
                    <button
                      onClick={fetchLeads}
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
                  <p style={{ color: '#9ca3af' }}>Gathering leads...</p>
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
              ) : error ? (
                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>⚠️</div>
                  <p style={{ color: '#dc2626', marginBottom: 16 }}>{error}</p>
                  <button
                    onClick={fetchLeads}
                    style={{
                      padding: '8px 20px', borderRadius: 8, border: 'none',
                      background: '#7c3aed', color: 'white', fontWeight: 600, cursor: 'pointer',
                    }}
                  >
                    Retry
                  </button>
                </div>
              ) : leads.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px 0' }}>
                  <div style={{ fontSize: 56, marginBottom: 16 }}>👥</div>
                  <h4>No leads yet</h4>
                  <p style={{ color: '#9ca3af', maxWidth: 480, margin: '0 auto' }}>
                    Leads appear when buyers inquire, save, or request tours on your listings.
                  </p>
                </div>
              ) : (
                <div className="row">
                  <div className="col-lg-12">
                    {/* Search bar */}
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ position: 'relative', maxWidth: 380 }}>
                        <i className="fas fa-search" style={{
                          position: 'absolute', left: 12, top: '50%',
                          transform: 'translateY(-50%)', color: '#9ca3af', fontSize: 13,
                        }} />
                        <input
                          type="text"
                          placeholder="Search leads by name, email, or property..."
                          value={search}
                          onChange={e => setSearch(e.target.value)}
                          style={{
                            width: '100%', padding: '9px 12px 9px 36px', borderRadius: 10,
                            border: '1.5px solid #e5e7eb', fontSize: 13, outline: 'none',
                            background: 'white',
                          }}
                        />
                      </div>
                    </div>

                    {/* Table */}
                    <div style={{ background: 'white', borderRadius: 16, border: '1.5px solid #f0f0f0', overflow: 'hidden' }}>
                      {/* Table header */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '2fr 2fr 2fr 3fr 1.5fr',
                        gap: 8,
                        padding: '12px 20px',
                        background: '#f9fafb',
                        borderBottom: '1px solid #f0f0f0',
                      }}>
                        {['Name', 'Email', 'Property', 'Interactions', 'Last Activity'].map(col => (
                          <div key={col} style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            {col}
                          </div>
                        ))}
                      </div>

                      {/* Table rows */}
                      {filtered.length === 0 ? (
                        <div style={{ padding: '40px 20px', textAlign: 'center', color: '#9ca3af', fontSize: 13 }}>
                          No leads match your search.
                        </div>
                      ) : (
                        filtered.map((lead, idx) => (
                          <div
                            key={lead.key}
                            style={{
                              display: 'grid',
                              gridTemplateColumns: '2fr 2fr 2fr 3fr 1.5fr',
                              gap: 8,
                              padding: '14px 20px',
                              alignItems: 'center',
                              borderBottom: idx < filtered.length - 1 ? '1px solid #f9fafb' : 'none',
                              transition: 'background 0.1s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = '#faf8ff'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                          >
                            {/* Name */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                              <Avatar name={lead.name} size={34} />
                              <span style={{
                                fontSize: 13, fontWeight: 600, color: '#111827',
                                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                              }}>
                                {lead.name}
                              </span>
                            </div>

                            {/* Email */}
                            <div style={{
                              fontSize: 12, color: '#6b7280',
                              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                            }}>
                              {lead.email || <span style={{ color: '#d1d5db' }}>—</span>}
                            </div>

                            {/* Property */}
                            <div style={{
                              fontSize: 12, color: '#374151', fontWeight: 500,
                              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                            }}>
                              <i className="fas fa-home" style={{ color: '#9ca3af', fontSize: 10, marginRight: 5 }} />
                              {lead.propertyName}
                            </div>

                            {/* Interactions */}
                            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                              {lead.interactions.map(type => (
                                <InteractionChip key={type} label={type} />
                              ))}
                            </div>

                            {/* Last activity */}
                            <div style={{ fontSize: 12, color: '#9ca3af' }}>
                              {timeAgo(lead.lastSeen)}
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Footer count */}
                    {filtered.length > 0 && (
                      <div style={{ marginTop: 12, fontSize: 12, color: '#9ca3af', textAlign: 'right' }}>
                        Showing {filtered.length} of {leads.length} lead{leads.length !== 1 ? 's' : ''}
                      </div>
                    )}
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
