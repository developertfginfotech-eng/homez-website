"use client";

import CountryHero from "./CountryHero";
import EconomyOverview from "./EconomyOverview";
import InvestmentHighlights from "./InvestmentHighlights";
import FAQ from "./FAQ";
import CountryPropertyListings from "./CountryPropertyListings";

const CountryDetailsContent = ({ country }) => {
  return (
    <>
      <style jsx>{`
        .content-section {
          padding-top: 60px;
          padding-bottom: 100px;
          background:
            radial-gradient(circle at 20% 30%, rgba(235, 103, 83, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(235, 103, 83, 0.02) 0%, transparent 50%),
            linear-gradient(180deg, #ffffff 0%, #f9fafb 50%, #ffffff 100%);
          position: relative;
        }

        .content-section .container {
          max-width: 1400px;
          padding-left: 40px;
          padding-right: 40px;
        }

        @media (max-width: 1199px) {
          .content-section .container {
            max-width: 100%;
            padding-left: 30px;
            padding-right: 30px;
          }
        }

        .content-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg,
            transparent 0%,
            rgba(235, 103, 83, 0.3) 50%,
            transparent 100%);
        }

        .info-card {
          background: linear-gradient(145deg, #ffffff 0%, #fafafa 100%);
          border-radius: 24px;
          padding: 44px;
          margin-bottom: 32px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04);
          border: 2px solid transparent;
          background-clip: padding-box;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .info-card::after {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(135deg, rgba(235, 103, 83, 0.15) 0%, rgba(220, 60, 40, 0.15) 100%);
          border-radius: 24px;
          z-index: -1;
          opacity: 0;
          transition: opacity 0.5s ease;
        }

        .info-card:hover::after {
          opacity: 1;
        }

        .info-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #eb6753 0%, #dc3c28 100%);
          transform: scaleX(0);
          transition: transform 0.4s ease;
        }

        .info-card:hover::before {
          transform: scaleX(1);
        }

        .info-card:hover {
          box-shadow: 0 20px 60px rgba(235, 103, 83, 0.2), 0 8px 24px rgba(0, 0, 0, 0.1);
          transform: translateY(-8px) scale(1.01);
        }

        .card-title {
          font-size: 28px;
          font-weight: 900;
          background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 28px;
          padding-bottom: 24px;
          border-bottom: 3px solid transparent;
          border-image: linear-gradient(90deg, #eb6753 0%, #dc3c28 50%, transparent 100%);
          border-image-slice: 1;
          position: relative;
          letter-spacing: -0.8px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .card-title::before {
          content: '';
          width: 6px;
          height: 32px;
          background: linear-gradient(135deg, #eb6753 0%, #dc3c28 100%);
          border-radius: 3px;
          box-shadow: 0 4px 12px rgba(235, 103, 83, 0.3);
        }

        .sidebar-header {
          background: linear-gradient(135deg, #eb6753 0%, #dc3c28 100%);
          border-radius: 24px;
          padding: 36px 32px;
          margin-bottom: 28px;
          box-shadow: 0 16px 48px rgba(235, 103, 83, 0.35), 0 4px 16px rgba(0, 0, 0, 0.1);
          position: relative;
          overflow: hidden;
          border: 2px solid rgba(255, 255, 255, 0.2);
        }

        .sidebar-header::before {
          content: '';
          position: absolute;
          top: -60%;
          right: -30px;
          width: 250px;
          height: 250px;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%);
          border-radius: 50%;
          animation: float 6s ease-in-out infinite;
        }

        .sidebar-header::after {
          content: '';
          position: absolute;
          bottom: -40%;
          left: -40px;
          width: 200px;
          height: 200px;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
          border-radius: 50%;
          animation: float 8s ease-in-out infinite reverse;
        }

        @keyframes float {
          0%, 100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(20px, 20px);
          }
        }

        .sidebar-header h4 {
          font-size: 26px;
          font-weight: 900;
          color: white;
          margin: 0 0 12px 0;
          position: relative;
          z-index: 1;
          letter-spacing: -0.5px;
          text-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .sidebar-header h4::before {
          content: '✨';
          font-size: 24px;
          animation: sparkle 2s ease-in-out infinite;
        }

        @keyframes sparkle {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.2);
          }
        }

        .sidebar-header p {
          font-size: 15px;
          color: rgba(255, 255, 255, 0.95);
          margin: 0;
          position: relative;
          z-index: 1;
          font-weight: 500;
          letter-spacing: 0.3px;
        }

        .properties-container {
          position: sticky;
          top: 100px;
        }

        @media (max-width: 991px) {
          .properties-container {
            position: relative;
            top: 0;
          }

          .info-card {
            padding: 30px;
          }

          .card-title {
            font-size: 20px;
          }
        }
      `}</style>

      <CountryHero country={country} />

      <section className="content-section">
        <div className="container">
          <div className="row g-4">
            {/* Left Column - Country Information */}
            <div className="col-lg-8">
              {/* Economy & Market Overview */}
              <div className="info-card">
                <h4 className="card-title">Economy & Market Overview</h4>
                <EconomyOverview country={country} />
              </div>

              {/* Investment Highlights */}
              <div className="info-card">
                <h4 className="card-title">Investment Highlights</h4>
                <InvestmentHighlights country={country} />
              </div>

              {/* FAQs */}
              <div className="info-card">
                <h4 className="card-title">Frequently Asked Questions</h4>
                <FAQ faqs={country.faqs} />
              </div>
            </div>

            {/* Right Column - Property Listings */}
            <div className="col-lg-4">
              <div className="properties-container">
                <div className="sidebar-header">
                  <h4>Available Properties</h4>
                  <p>Browse {country.name} real estate</p>
                </div>
                <CountryPropertyListings country={country.name} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CountryDetailsContent;
