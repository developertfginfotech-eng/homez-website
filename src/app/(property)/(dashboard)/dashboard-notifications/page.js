'use client';

import { useState, useEffect } from 'react';
import DashboardHeader from '@/components/common/DashboardHeader';
import MobileMenu from '@/components/common/mobile-menu';
import DboardMobileNavigation from '@/components/property/dashboard/DboardMobileNavigation';
import Footer from '@/components/property/dashboard/Footer';
import SidebarDashboard from '@/components/property/dashboard/SidebarDashboard';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

function timeAgo(date) {
  const secs = Math.floor((Date.now() - new Date(date)) / 1000);
  if (secs < 60) return 'just now';
  if (secs < 3600) return `${Math.floor(secs / 60)} minutes ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)} hours ago`;
  if (secs < 604800) return `${Math.floor(secs / 86400)} days ago`;
  return new Date(date).toLocaleDateString();
}

const TYPE_CONFIG = {
  offer:   { icon: '💰', label: 'Offer',   color: '#059669', bg: '#f0fdf4', border: '#bbf7d0' },
  tour:    { icon: '📅', label: 'Tour',    color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' },
  kyc:     { icon: '🔒', label: 'KYC',     color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe' },
  inquiry: { icon: '💬', label: 'Inquiry', color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
  lead:    { icon: '👤', label: 'Lead',    color: '#0891b2', bg: '#ecfeff', border: '#a5f3fc' },
  default: { icon: '🔔', label: 'Notice',  color: '#6b7280', bg: '#f9fafb', border: '#e5e7eb' },
};

function getTypeConfig(type) {
  return TYPE_CONFIG[type] || TYPE_CONFIG.default;
}

export default function DashboardNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, []);

  const getAuthHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  };

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/notifications`, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error('Failed to fetch notifications');
      const data = await res.json();
      setNotifications(Array.isArray(data) ? data : (data.notifications || data.data || []));
    } catch (err) {
      console.error(err);
      setError('Could not load notifications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const res = await fetch(`${API_URL}/notifications/unread-count`, { headers: getAuthHeaders() });
      if (!res.ok) return;
      const data = await res.json();
      setUnreadCount(data.count ?? data.unreadCount ?? 0);
    } catch (err) {
      console.error(err);
    }
  };

  const markRead = async (id) => {
    try {
      const res = await fetch(`${API_URL}/notifications/${id}/read`, {
        method: 'PUT',
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Failed to mark read');
      setNotifications(prev =>
        prev.map(n => n._id === id ? { ...n, isRead: true, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const markAllRead = async () => {
    setMarkingAll(true);
    try {
      const res = await fetch(`${API_URL}/notifications/read-all`, {
        method: 'PUT',
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Failed to mark all read');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    } finally {
      setMarkingAll(false);
    }
  };

  const isUnread = (n) => !(n.isRead || n.read);

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
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <h2 style={{ margin: 0 }}>Notifications</h2>
                          {unreadCount > 0 && (
                            <span style={{
                              background: '#7c3aed', color: 'white', borderRadius: 20,
                              padding: '2px 10px', fontSize: 12, fontWeight: 700, lineHeight: 1.6,
                            }}>
                              {unreadCount} new
                            </span>
                          )}
                        </div>
                        <p className="text" style={{ margin: 0 }}>Stay on top of offers, tours, inquiries, and account updates</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllRead}
                          disabled={markingAll}
                          style={{
                            padding: '8px 18px', borderRadius: 8, border: 'none',
                            background: 'linear-gradient(135deg, #7c3aed, #5b21b6)',
                            color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: 6, opacity: markingAll ? 0.7 : 1,
                          }}
                        >
                          {markingAll
                            ? <span className="spinner-border spinner-border-sm" />
                            : <><i className="fas fa-check-double" /> Mark all read</>
                          }
                        </button>
                      )}
                      <button
                        onClick={() => { fetchNotifications(); fetchUnreadCount(); }}
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
              </div>

              {loading ? (
                <div style={{ textAlign: 'center', padding: '80px 0' }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%',
                    border: '3px solid #f3f4f6', borderTopColor: '#7c3aed',
                    animation: 'spin 0.8s linear infinite', margin: '0 auto 16px',
                  }} />
                  <p style={{ color: '#9ca3af' }}>Loading notifications...</p>
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
              ) : error ? (
                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>⚠️</div>
                  <p style={{ color: '#dc2626', marginBottom: 16 }}>{error}</p>
                  <button
                    onClick={fetchNotifications}
                    style={{
                      padding: '8px 20px', borderRadius: 8, border: 'none',
                      background: '#7c3aed', color: 'white', fontWeight: 600, cursor: 'pointer',
                    }}
                  >
                    Retry
                  </button>
                </div>
              ) : notifications.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px 0' }}>
                  <div style={{ fontSize: 56, marginBottom: 16 }}>🔔</div>
                  <h4>No notifications yet</h4>
                  <p style={{ color: '#9ca3af', maxWidth: 400, margin: '0 auto' }}>
                    When you receive offers, tour requests, inquiries, or account updates, they will appear here.
                  </p>
                </div>
              ) : (
                <div className="row">
                  <div className="col-lg-8 col-xl-7">
                    <div style={{ background: 'white', borderRadius: 16, border: '1.5px solid #f0f0f0', overflow: 'hidden' }}>
                      {notifications.map((notif, idx) => {
                        const cfg = getTypeConfig(notif.type);
                        const unread = isUnread(notif);
                        return (
                          <div
                            key={notif._id || idx}
                            onClick={() => unread && markRead(notif._id)}
                            style={{
                              display: 'flex', gap: 16, padding: '18px 20px',
                              borderBottom: idx < notifications.length - 1 ? '1px solid #f3f4f6' : 'none',
                              background: unread ? '#faf8ff' : 'white',
                              cursor: unread ? 'pointer' : 'default',
                              transition: 'background 0.15s',
                              position: 'relative',
                            }}
                          >
                            {/* Unread indicator bar */}
                            {unread && (
                              <div style={{
                                position: 'absolute', left: 0, top: 0, bottom: 0,
                                width: 3, background: '#7c3aed', borderRadius: '0 2px 2px 0',
                              }} />
                            )}

                            {/* Type icon */}
                            <div style={{
                              width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                              background: cfg.bg, border: `1.5px solid ${cfg.border}`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: 20,
                            }}>
                              {cfg.icon}
                            </div>

                            {/* Content */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 4 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                  <span style={{
                                    fontWeight: unread ? 700 : 600, fontSize: 14, color: '#111827',
                                  }}>
                                    {notif.title || notif.subject || cfg.label}
                                  </span>
                                  <span style={{
                                    fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 10,
                                    background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
                                  }}>
                                    {cfg.label}
                                  </span>
                                  {unread && (
                                    <span style={{
                                      width: 8, height: 8, borderRadius: '50%',
                                      background: '#7c3aed', display: 'inline-block',
                                    }} />
                                  )}
                                </div>
                                <span style={{ fontSize: 11, color: '#9ca3af', whiteSpace: 'nowrap', flexShrink: 0 }}>
                                  {timeAgo(notif.createdAt || notif.date)}
                                </span>
                              </div>
                              <p style={{ fontSize: 13, color: '#6b7280', margin: 0, lineHeight: 1.6 }}>
                                {notif.message || notif.body || notif.description || ''}
                              </p>
                              {notif.link && (
                                <a
                                  href={notif.link}
                                  style={{ fontSize: 12, color: '#7c3aed', textDecoration: 'none', fontWeight: 600, marginTop: 6, display: 'inline-block' }}
                                  onClick={e => e.stopPropagation()}
                                >
                                  View details <i className="fas fa-arrow-right" style={{ fontSize: 10 }} />
                                </a>
                              )}
                            </div>

                            {/* Mark read button */}
                            {unread && (
                              <button
                                onClick={e => { e.stopPropagation(); markRead(notif._id); }}
                                title="Mark as read"
                                style={{
                                  background: 'none', border: 'none', cursor: 'pointer',
                                  color: '#9ca3af', fontSize: 16, padding: '0 4px',
                                  flexShrink: 0, alignSelf: 'flex-start',
                                }}
                              >
                                <i className="fas fa-times" style={{ fontSize: 12 }} />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Summary sidebar */}
                  <div className="col-lg-4 col-xl-3 mt30-md">
                    <div style={{ background: 'white', borderRadius: 16, border: '1.5px solid #f0f0f0', padding: 20 }}>
                      <h6 style={{ fontWeight: 700, color: '#374151', marginBottom: 16 }}>Summary</h6>
                      {Object.entries(TYPE_CONFIG).filter(([k]) => k !== 'default').map(([type, cfg]) => {
                        const count = notifications.filter(n => n.type === type).length;
                        if (count === 0) return null;
                        return (
                          <div key={type} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{ fontSize: 16 }}>{cfg.icon}</span>
                              <span style={{ fontSize: 13, color: '#374151' }}>{cfg.label}s</span>
                            </div>
                            <span style={{
                              fontSize: 12, fontWeight: 700, background: cfg.bg,
                              color: cfg.color, padding: '2px 9px', borderRadius: 12,
                              border: `1px solid ${cfg.border}`,
                            }}>
                              {count}
                            </span>
                          </div>
                        );
                      })}
                      <hr style={{ borderColor: '#f3f4f6', margin: '16px 0' }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 13, color: '#374151', fontWeight: 600 }}>Total</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>{notifications.length}</span>
                      </div>
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
