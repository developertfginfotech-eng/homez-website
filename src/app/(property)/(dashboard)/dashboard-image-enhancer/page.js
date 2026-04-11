"use client";

import DashboardHeader from "@/components/common/DashboardHeader";
import MobileMenu from "@/components/common/mobile-menu";
import DboardMobileNavigation from "@/components/property/dashboard/DboardMobileNavigation";
import Footer from "@/components/property/dashboard/Footer";
import SidebarDashboard from "@/components/property/dashboard/SidebarDashboard";
import ImageEnhancementWidget from "@/components/property/ImageEnhancementWidget";

export default function DashboardImageEnhancer() {
  return (
    <>
      <DashboardHeader />
      <MobileMenu />

      <div className="dashboard_content_wrapper">
        <div className="dashboard dashboard_wrapper pr30 pr0-xl">
          <SidebarDashboard />

          <div className="dashboard__main pl0-md">
            <div className="dashboard__content bgc-f7">
              <div className="row pb10">
                <div className="col-lg-12">
                  <DboardMobileNavigation />
                </div>
              </div>

              <div className="row">
                <div className="col-xl-12">
                  <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30">
                    {/* Page header */}
                    <div className="d-flex align-items-center gap-3 mb30">
                      <div style={{
                        width: 52, height: 52, borderRadius: 14,
                        background: 'linear-gradient(135deg,#7C3AED,#5B21B6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0,
                      }}>✨</div>
                      <div>
                        <h4 className="title fz20 mb0">AI Image Enhancement</h4>
                        <p className="text fz14 mb0" style={{ color: '#9CA3AF' }}>
                          Enhance your property photos with Globperty AI — auto enhance, sky replacement, clutter removal & upscaling
                        </p>
                      </div>
                    </div>

                    {/* How it works */}
                    <div style={{
                      background: 'linear-gradient(135deg,#F5F3FF,#EFF6FF)',
                      border: '1px solid #DDD6FE', borderRadius: 12,
                      padding: '16px 20px', marginBottom: 28,
                      display: 'flex', gap: 24, flexWrap: 'wrap',
                    }}>
                      {[
                        { step: '1', icon: '📸', text: 'Upload your property photo' },
                        { step: '2', icon: '🎯', text: 'Choose an enhancement type' },
                        { step: '3', icon: '✨', text: 'AI enhances the photo' },
                        { step: '4', icon: '⬇️', text: 'Download & use in listing' },
                      ].map(s => (
                        <div key={s.step} style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 180 }}>
                          <div style={{
                            width: 28, height: 28, borderRadius: '50%',
                            background: '#7C3AED', color: 'white',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 12, fontWeight: 800, flexShrink: 0,
                          }}>{s.step}</div>
                          <span style={{ fontSize: 13, color: '#374151' }}>{s.icon} {s.text}</span>
                        </div>
                      ))}
                    </div>

                    {/* Enhancement types info */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 28 }}>
                      {[
                        { icon: '✨', label: 'Auto Enhance', desc: 'AI lighting & color fix', color: '#7C3AED', bg: '#F5F3FF' },
                        { icon: '🎨', label: 'Color Boost', desc: 'Brightness & contrast', color: '#2563EB', bg: '#EFF6FF' },
                        { icon: '🌤️', label: 'Sky Replacement', desc: 'Bright sunny sky AI', color: '#0891B2', bg: '#ECFEFF' },
                        { icon: '🧹', label: 'Remove Clutter', desc: 'Clean up the scene', color: '#D97706', bg: '#FFFBEB' },
                        { icon: '🔍', label: 'Upscale 2x', desc: 'Higher resolution', color: '#059669', bg: '#ECFDF5' },
                      ].map(e => (
                        <div key={e.label} style={{ background: e.bg, borderRadius: 10, padding: '12px 14px', border: `1px solid ${e.color}22` }}>
                          <div style={{ fontSize: 22, marginBottom: 6 }}>{e.icon}</div>
                          <div style={{ fontWeight: 700, fontSize: 13, color: e.color, marginBottom: 3 }}>{e.label}</div>
                          <div style={{ fontSize: 11, color: '#6B7280' }}>{e.desc}</div>
                        </div>
                      ))}
                    </div>

                    {/* The main widget */}
                    <ImageEnhancementWidget />

                    {/* Tips */}
                    <div style={{ marginTop: 24, padding: '14px 18px', background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 10 }}>
                      <div style={{ fontWeight: 700, fontSize: 13, color: '#92400E', marginBottom: 8 }}>💡 Tips for best results</div>
                      <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: '#78350F', lineHeight: 1.8 }}>
                        <li>Use <strong>Auto Enhance</strong> first for general improvements on any photo</li>
                        <li>Use <strong>Sky Replacement</strong> on exterior shots with overcast or white sky</li>
                        <li>Use <strong>Remove Clutter</strong> on rooms with personal items, clothes, or mess</li>
                        <li>Use <strong>Upscale</strong> on older or low-resolution photos before publishing</li>
                        <li>Free tier: <strong>25 enhancements/month</strong> — each click uses 1 credit</li>
                      </ul>
                    </div>
                  </div>
                </div>
                {/* End col */}
              </div>
              {/* End .row */}
            </div>
            {/* End .dashboard__content */}

            <Footer />
          </div>
          {/* End .dashboard__main */}
        </div>
      </div>
      {/* End dashboard_content_wrapper */}
    </>
  );
}
