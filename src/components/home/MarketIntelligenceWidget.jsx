'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { marketIntelligenceAPI } from '@/services/marketIntelligenceApi';

export default function MarketIntelligenceWidget() {
  const [overview, setOverview] = useState(null);
  const [hotAreas, setHotAreas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch overview data
        const overviewResult = await marketIntelligenceAPI.getMarketOverview({});
        if (overviewResult.success) {
          setOverview(overviewResult.data);
        }

        // Fetch top 3 hot areas
        const hotAreasResult = await marketIntelligenceAPI.getHotAreas({ limit: 3 });
        if (hotAreasResult.success) {
          setHotAreas(hotAreasResult.data);
        }
      } catch (error) {
        console.error('Error fetching market data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <section className="pb90 pt-0">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!overview) return null;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <section className="pb90 pt60" style={{ background: '#f8fafc' }}>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-12">
            <div className="main-title mb30">
              <h2 className="title">
                <i className="fas fa-chart-line text-primary me-3"></i>
                Market Intelligence
              </h2>
              <p className="paragraph">
                AI-powered insights and real-time market analytics to help you make informed decisions
              </p>
            </div>
          </div>
        </div>

        <div className="row">
          {/* Market Overview Stats */}
          <div className="col-lg-8 mb30">
            <div className="feature-style1 bdrs16" style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              padding: '40px',
              height: '100%'
            }}>
              <div className="row align-items-center">
                <div className="col-md-8">
                  <h3 className="text-white mb20">
                    <i className="fas fa-robot me-3"></i>
                    Live Market Overview
                  </h3>
                  <div className="row g-3">
                    <div className="col-6">
                      <div className="text-white-50 mb-1">Total Listings</div>
                      <h2 className="text-white mb-0">{overview.totalListings.toLocaleString()}</h2>
                    </div>
                    <div className="col-6">
                      <div className="text-white-50 mb-1">Avg Price</div>
                      <h4 className="text-white mb-0">{formatCurrency(overview.priceStats.average)}</h4>
                    </div>
                    <div className="col-6">
                      <div className="text-white-50 mb-1">New (30 days)</div>
                      <h4 className="text-white mb-0">
                        {overview.recentListings}
                        {overview.listingGrowth !== 0 && (
                          <span className="ms-2 fs-6">
                            <i className={`fas fa-arrow-${overview.listingGrowth > 0 ? 'up' : 'down'}`}></i>
                            {Math.abs(overview.listingGrowth).toFixed(1)}%
                          </span>
                        )}
                      </h4>
                    </div>
                    <div className="col-6">
                      <div className="text-white-50 mb-1">Price/Sq Ft</div>
                      <h4 className="text-white mb-0">{formatCurrency(overview.priceStats.avgPricePerSqft)}</h4>
                    </div>
                  </div>
                  <Link href="/market-intelligence" className="btn btn-light mt-4">
                    <i className="fas fa-chart-bar me-2"></i>
                    View Full Dashboard
                  </Link>
                </div>
                <div className="col-md-4 text-center d-none d-md-block">
                  <i className="fas fa-chart-pie text-white opacity-25" style={{ fontSize: '120px' }}></i>
                </div>
              </div>
            </div>
          </div>

          {/* Hot Investment Areas */}
          <div className="col-lg-4 mb30">
            <div className="feature-style1 bdrs16 p-4" style={{ height: '100%', background: '#fff', border: '1px solid #e9ecef' }}>
              <div className="d-flex align-items-center justify-content-between mb20">
                <h5 className="mb-0">
                  <i className="fas fa-fire text-danger me-2"></i>
                  Hot Areas
                </h5>
                <span className="badge bg-danger">Live</span>
              </div>

              {hotAreas.length > 0 ? (
                <div className="list-style1">
                  {hotAreas.map((area, index) => (
                    <div key={index} className="mb15 pb15" style={{ borderBottom: index < hotAreas.length - 1 ? '1px solid #e9ecef' : 'none' }}>
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <div className="d-flex align-items-center">
                          <div
                            className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2"
                            style={{ width: '24px', height: '24px', fontSize: '12px', fontWeight: 'bold' }}
                          >
                            {index + 1}
                          </div>
                          <strong>{area.city}</strong>
                        </div>
                        <span className="badge bg-warning-subtle text-warning">
                          {area.hotnessScore.toFixed(0)}
                        </span>
                      </div>
                      <div className="d-flex justify-content-between" style={{ fontSize: '12px' }}>
                        <span className="text-muted">{area.totalListings} listings</span>
                        <span className="text-muted">{formatCurrency(area.avgPrice)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted">Loading hot areas...</p>
              )}

              <Link href="/market-intelligence?tab=hot-areas" className="btn btn-outline-primary w-100 mt-3">
                <i className="fas fa-map-marked-alt me-2"></i>
                View All Hot Areas
              </Link>
            </div>
          </div>
        </div>

        {/* Features Row */}
        <div className="row mt30">
          {[
            { icon: 'fa-chart-line', color: '#2563EB', bg: '#EFF6FF', label: 'Price Trends', sub: 'Historical analysis' },
            { icon: 'fa-trophy', color: '#D97706', bg: '#FFFBEB', label: 'Investment Score', sub: 'AI-powered ROI' },
            { icon: 'fa-magic', color: '#0891B2', bg: '#ECFEFF', label: 'Market Forecast', sub: '6-month predictions' },
            { icon: 'fa-fire', color: '#DC2626', bg: '#FEF2F2', label: 'Hot Zones', sub: 'Top opportunities' },
          ].map((item) => (
            <div key={item.label} className="col-md-3 col-6 mb-3">
              <Link
                href="/market-intelligence"
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  textDecoration: 'none', background: '#fff', border: '1px solid #e5e7eb',
                  borderRadius: '12px', padding: '24px 16px', minHeight: '110px',
                  transition: 'all 0.2s ease', cursor: 'pointer',
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}
              >
                <div style={{ width: 48, height: 48, borderRadius: 12, background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                  <i className={`fas ${item.icon}`} style={{ fontSize: '20px', color: item.color }} />
                </div>
                <h6 style={{ marginBottom: 2, fontSize: 14, fontWeight: 600, color: '#1f2937' }}>{item.label}</h6>
                <small style={{ color: '#9ca3af', fontSize: 12 }}>{item.sub}</small>
              </Link>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
