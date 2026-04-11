'use client';

import { useState, useEffect } from 'react';
import DashboardHeader from '@/components/common/DashboardHeader';
import MobileMenu from '@/components/common/mobile-menu';
import DboardMobileNavigation from '@/components/property/dashboard/DboardMobileNavigation';
import Footer from '@/components/property/dashboard/Footer';
import SidebarDashboard from '@/components/property/dashboard/SidebarDashboard';
import { inquiryAPI } from '@/services/inquiryApi';
import Link from 'next/link';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3001';

function timeAgo(date) {
  const secs = Math.floor((Date.now() - new Date(date)) / 1000);
  if (secs < 60) return 'just now';
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  return `${Math.floor(secs / 86400)}d ago`;
}

function Avatar({ name, size = 40 }) {
  const initials = (name || '?').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  const colors = ['#3b82f6', '#8b5cf6', '#059669', '#d97706', '#eb6753', '#ec4899'];
  const color = colors[name?.charCodeAt(0) % colors.length] || '#3b82f6';
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: size * 0.35, flexShrink: 0 }}>
      {initials}
    </div>
  );
}

function MessageBubble({ msg }) {
  const isUser = msg.sender === 'user';
  const isAI = msg.sender === 'ai';
  const isAgent = msg.sender === 'agent';

  if (isUser) {
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
        <div style={{ maxWidth: '75%' }}>
          <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 4, textAlign: 'right' }}>{msg.senderName} · {timeAgo(msg.createdAt)}</div>
          <div style={{ background: '#7c3aed', color: 'white', borderRadius: '16px 16px 4px 16px', padding: '10px 14px', fontSize: 13, lineHeight: 1.6 }}>
            {msg.content}
          </div>
        </div>
      </div>
    );
  }

  if (isAI) {
    return (
      <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
        <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #5b21b6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <i className="fas fa-robot" style={{ color: 'white', fontSize: 13 }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 4 }}>AI Property Assistant · {timeAgo(msg.createdAt)}</div>
          <div style={{ background: '#f5f3ff', border: '1px solid #ddd6fe', borderRadius: '4px 16px 16px 16px', padding: '12px 14px', fontSize: 13, color: '#1f2937', lineHeight: 1.6 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#7c3aed', marginBottom: 6 }}>
              <i className="fas fa-robot me-1" /> AI Property Assistant
            </div>
            {msg.content}
          </div>
        </div>
      </div>
    );
  }

  // Agent reply
  return (
    <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
      <Avatar name={msg.senderName} size={34} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 4 }}>{msg.senderName} (You) · {timeAgo(msg.createdAt)}</div>
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '4px 16px 16px 16px', padding: '10px 14px', fontSize: 13, color: '#1f2937', lineHeight: 1.6 }}>
          {msg.content}
        </div>
      </div>
    </div>
  );
}

export default function DashboardInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    if (userStr) {
      try { setUserRole(JSON.parse(userStr)?.role); } catch {}
    }
    fetchInquiries();
  }, []);

  const isBuyer = userRole === 'buyer' || userRole === 'user';

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const res = await inquiryAPI.getInquiries();
      if (res.success) {
        setInquiries(res.data);
        if (res.data.length > 0 && !selected) {
          setSelected(res.data[0]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (inq) => {
    setSelected(inq);
    setReplyText('');
  };

  const handleSendReply = async () => {
    if (!replyText.trim() || !selected) return;
    setSending(true);
    try {
      const res = await inquiryAPI.reply(selected._id, replyText.trim());
      if (res.success) {
        setSelected(res.data);
        setInquiries(prev => prev.map(i => i._id === res.data._id ? res.data : i));
        setReplyText('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async () => {
    if (!selected || !window.confirm('Delete this inquiry?')) return;
    setDeleting(true);
    try {
      await inquiryAPI.deleteInquiry(selected._id);
      const remaining = inquiries.filter(i => i._id !== selected._id);
      setInquiries(remaining);
      setSelected(remaining[0] || null);
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  const filtered = inquiries.filter(i =>
    i.inquirerName?.toLowerCase().includes(search.toLowerCase()) ||
    i.propertyTitle?.toLowerCase().includes(search.toLowerCase())
  );

  const getPropertyImage = (inq) => {
    const imgs = inq.propertyId?.images;
    if (imgs && imgs.length > 0) {
      return imgs[0].startsWith('http') ? imgs[0] : `${BACKEND_URL}${imgs[0]}`;
    }
    return '/images/listings/lg-1.jpg';
  };

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
                      <h2>{isBuyer ? 'My Sent Inquiries' : 'Property Inquiries'}</h2>
                      <p className="text">{isBuyer ? 'Inquiries you sent on property pages — see AI replies and agent responses' : 'Messages received via the AI Instant Response widget on your property pages'}</p>
                    </div>
                    <button onClick={fetchInquiries} style={{ padding: '8px 18px', borderRadius: 8, border: '1.5px solid #e5e7eb', background: 'white', fontSize: 13, fontWeight: 600, color: '#374151', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <i className="fas fa-sync-alt" style={{ fontSize: 12 }} /> Refresh
                    </button>
                  </div>
                </div>
              </div>

              {loading ? (
                <div style={{ textAlign: 'center', padding: '80px 0' }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', border: '3px solid #f3f4f6', borderTopColor: '#7c3aed', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
                  <p style={{ color: '#9ca3af' }}>Loading inquiries…</p>
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
              ) : inquiries.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px 0' }}>
                  <div style={{ fontSize: 56, marginBottom: 16 }}>📬</div>
                  <h4>{isBuyer ? 'No Inquiries Sent Yet' : 'No Inquiries Yet'}</h4>
                  <p style={{ color: '#9ca3af' }}>
                    {isBuyer
                      ? 'You haven\'t sent any inquiries yet. Visit a property page and use the AI Instant Response widget to ask a question.'
                      : 'When buyers send inquiries via the AI Instant Response widget on your property pages, they will appear here.'}
                  </p>
                  <Link href="/grid-full-3-col" className="ud-btn btn-thm mt-3">Browse Properties</Link>
                </div>
              ) : (
                <div className="row mb40">
                  {/* ── Left: Inquiry List ── */}
                  <div className="col-lg-5 col-xl-4">
                    <div style={{ background: 'white', borderRadius: 16, border: '1.5px solid #f0f0f0', overflow: 'hidden', height: 680, display: 'flex', flexDirection: 'column' }}>
                      {/* Search */}
                      <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid #f3f4f6' }}>
                        <div style={{ position: 'relative' }}>
                          <i className="fas fa-search" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: 13 }} />
                          <input
                            type="text"
                            placeholder="Search inquiries…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={{ width: '100%', padding: '8px 12px 8px 36px', borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 13, outline: 'none' }}
                          />
                        </div>
                      </div>

                      {/* List */}
                      <div style={{ flex: 1, overflowY: 'auto' }}>
                        {filtered.map(inq => {
                          const isActive = selected?._id === inq._id;
                          const lastMsg = inq.messages?.[inq.messages.length - 1];
                          const unread = !inq.isReadByAgent && inq.status === 'open';
                          return (
                            <div
                              key={inq._id}
                              onClick={() => handleSelect(inq)}
                              style={{
                                padding: '14px 16px', cursor: 'pointer',
                                background: isActive ? '#f5f3ff' : 'white',
                                borderLeft: isActive ? '3px solid #7c3aed' : '3px solid transparent',
                                borderBottom: '1px solid #f9fafb',
                                display: 'flex', gap: 12, alignItems: 'flex-start',
                              }}
                            >
                              <Avatar name={isBuyer ? (inq.propertyTitle || 'Property') : inq.inquirerName} size={42} />
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                                  <span style={{ fontWeight: unread ? 700 : 600, fontSize: 14, color: '#111827' }}>
                                    {isBuyer ? (inq.propertyTitle || inq.propertyId?.propertyName || 'Property') : inq.inquirerName}
                                  </span>
                                  <span style={{ fontSize: 11, color: '#9ca3af' }}>{timeAgo(inq.updatedAt)}</span>
                                </div>
                                <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {isBuyer
                                    ? <><i className="fas fa-map-marker-alt" style={{ marginRight: 4, fontSize: 10 }} />{inq.propertyId?.city || ''}</>
                                    : <><i className="fas fa-home" style={{ marginRight: 4, fontSize: 10 }} />{inq.propertyTitle || inq.propertyId?.propertyName || 'Property'}</>
                                  }
                                </div>
                                <div style={{ fontSize: 12, color: '#9ca3af', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {lastMsg?.content?.slice(0, 55)}{lastMsg?.content?.length > 55 ? '…' : ''}
                                </div>
                                <div style={{ marginTop: 5, display: 'flex', gap: 5 }}>
                                  <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 10, background: inq.status === 'replied' ? '#f0fdf4' : '#fef2f2', color: inq.status === 'replied' ? '#059669' : '#dc2626' }}>
                                    {inq.status === 'replied' ? 'Replied' : 'Open'}
                                  </span>
                                  {unread && <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 10, background: '#7c3aed', color: 'white' }}>New</span>}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        {filtered.length === 0 && (
                          <div style={{ padding: '40px 16px', textAlign: 'center', color: '#9ca3af', fontSize: 13 }}>
                            No inquiries match your search.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ── Right: Conversation ── */}
                  <div className="col-lg-7 col-xl-8 mt30-md">
                    {selected ? (
                      <div style={{ background: 'white', borderRadius: 16, border: '1.5px solid #f0f0f0', height: 680, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        {/* Header */}
                        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <Avatar name={isBuyer ? (selected.agentId?.name || 'Agent') : selected.inquirerName} size={44} />
                            <div>
                              <div style={{ fontWeight: 700, fontSize: 15, color: '#111827' }}>
                                {isBuyer ? (selected.agentId?.name || 'Property Agent') : selected.inquirerName}
                              </div>
                              <div style={{ fontSize: 12, color: '#9ca3af' }}>
                                {isBuyer
                                  ? <>{selected.agentId?.email && <><i className="fas fa-envelope me-1" />{selected.agentId.email}</>}</>
                                  : <>{selected.inquirerEmail && <><i className="fas fa-envelope me-1" />{selected.inquirerEmail} · </>}</>
                                }
                                {selected.messages?.length} messages
                              </div>
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                            {selected.propertyId && (
                              <Link href={`/single-v1/${selected.propertyId._id || selected.propertyId}`} style={{ fontSize: 12, color: '#7c3aed', textDecoration: 'none', fontWeight: 600, background: '#f5f3ff', padding: '6px 12px', borderRadius: 8, border: '1px solid #ddd6fe' }}>
                                <i className="fas fa-external-link-alt me-1" /> View Property
                              </Link>
                            )}
                            <button onClick={handleDelete} disabled={deleting} style={{ fontSize: 12, color: '#dc2626', background: '#fef2f2', border: '1px solid #fca5a5', padding: '6px 12px', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
                              {deleting ? '…' : 'Delete'}
                            </button>
                          </div>
                        </div>

                        {/* Property info strip */}
                        {selected.propertyId && (
                          <div style={{ padding: '10px 20px', background: '#f9fafb', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                            <img src={getPropertyImage(selected)} alt="" style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover' }} onError={e => { e.target.src = '/images/listings/lg-1.jpg'; }} />
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 700, color: '#374151' }}>{selected.propertyTitle || selected.propertyId?.propertyName}</div>
                              <div style={{ fontSize: 11, color: '#9ca3af' }}>
                                {selected.propertyId?.city && <><i className="fas fa-map-marker-alt me-1" />{selected.propertyId.city}</>}
                                {selected.propertyId?.price && <> · ${selected.propertyId.price?.toLocaleString()}</>}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Messages */}
                        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                          {selected.messages?.map((msg, i) => (
                            <MessageBubble key={i} msg={msg} />
                          ))}
                        </div>

                        {/* Reply box — agents only */}
                        {!isBuyer ? (
                          <div style={{ padding: '14px 16px', borderTop: '1px solid #f3f4f6', flexShrink: 0 }}>
                            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
                              <textarea
                                value={replyText}
                                onChange={e => setReplyText(e.target.value)}
                                placeholder="Type your reply…"
                                rows={2}
                                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendReply(); } }}
                                style={{ flex: 1, padding: '10px 14px', borderRadius: 10, border: '1.5px solid #e5e7eb', fontSize: 13, resize: 'none', outline: 'none', lineHeight: 1.5 }}
                              />
                              <button
                                onClick={handleSendReply}
                                disabled={sending || !replyText.trim()}
                                style={{ padding: '10px 18px', borderRadius: 10, background: replyText.trim() ? 'linear-gradient(135deg, #7c3aed, #5b21b6)' : '#e5e7eb', color: replyText.trim() ? 'white' : '#9ca3af', border: 'none', cursor: replyText.trim() ? 'pointer' : 'not-allowed', fontWeight: 700, fontSize: 13, height: 44 }}
                              >
                                {sending ? <span className="spinner-border spinner-border-sm" /> : <><i className="fas fa-paper-plane me-1" />Send</>}
                              </button>
                            </div>
                            <p style={{ fontSize: 11, color: '#9ca3af', margin: '6px 0 0' }}>Press Enter to send · Shift+Enter for new line</p>
                          </div>
                        ) : (
                          <div style={{ padding: '12px 16px', borderTop: '1px solid #f3f4f6', flexShrink: 0, background: '#f9fafb', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <i className="fas fa-info-circle" style={{ color: '#9ca3af', fontSize: 13 }} />
                            <span style={{ fontSize: 12, color: '#9ca3af' }}>Agent replies will appear above. You can also check for replies on the property page.</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div style={{ background: 'white', borderRadius: 16, border: '1.5px solid #f0f0f0', height: 680, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: 48, marginBottom: 12 }}>💬</div>
                          <p style={{ color: '#9ca3af', fontSize: 14 }}>Select an inquiry to view the conversation</p>
                        </div>
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
