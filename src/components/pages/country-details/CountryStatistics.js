"use client";

const CountryStatistics = ({ country }) => {
  return (
    <>
      <style jsx>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .stats-section {
          background: linear-gradient(180deg, #ffffff 0%, #f9fafb 100%);
          padding: 80px 0;
          position: relative;
        }

        .stat-card {
          background: white;
          padding: 35px 25px;
          border-radius: 16px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.06);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid rgba(235, 103, 83, 0.08);
          animation: slideUp 0.6s ease-out;
          animation-fill-mode: both;
          position: relative;
          overflow: hidden;
        }

        .stat-card::before {
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

        .stat-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 60px rgba(235, 103, 83, 0.15);
        }

        .stat-card:hover::before {
          transform: scaleX(1);
        }

        .stat-card:nth-child(1) { animation-delay: 0.1s; }
        .stat-card:nth-child(2) { animation-delay: 0.2s; }
        .stat-card:nth-child(3) { animation-delay: 0.3s; }
        .stat-card:nth-child(4) { animation-delay: 0.4s; }

        .stat-icon {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(235, 103, 83, 0.1) 0%, rgba(235, 103, 83, 0.05) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          transition: all 0.3s ease;
        }

        .stat-card:hover .stat-icon {
          background: linear-gradient(135deg, #eb6753 0%, #dc3c28 100%);
          transform: rotate(10deg) scale(1.1);
        }

        .stat-card:hover .stat-icon span {
          color: white !important;
        }

        .stat-number {
          font-size: 42px;
          font-weight: 800;
          background: linear-gradient(135deg, #eb6753 0%, #dc3c28 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 8px;
          line-height: 1;
        }

        .stat-label {
          font-size: 14px;
          color: #6b7280;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        @media (max-width: 768px) {
          .stats-section {
            padding: 60px 0;
          }
          .stat-number {
            font-size: 36px;
          }
        }
      `}</style>

      <section className="stats-section">
        <div className="container">
          <div className="row g-4">
            <div className="col-6 col-lg-3">
              <div className="stat-card text-center">
                <div className="stat-icon">
                  <i className="fas fa-home" style={{ fontSize: '32px', color: '#eb6753' }} />
                </div>
                <div className="stat-number">
                  {country.investmentGuide?.bestAreas?.length || 4}
                </div>
                <div className="stat-label">Top Investment Areas</div>
              </div>
            </div>

            <div className="col-6 col-lg-3">
              <div className="stat-card text-center">
                <div className="stat-icon">
                  <i className="fas fa-users" style={{ fontSize: '32px', color: '#eb6753' }} />
                </div>
                <div className="stat-number">{country.population}</div>
                <div className="stat-label">Population</div>
              </div>
            </div>

            <div className="col-6 col-lg-3">
              <div className="stat-card text-center">
                <div className="stat-icon">
                  <i className="fas fa-chart-line" style={{ fontSize: '32px', color: '#eb6753' }} />
                </div>
                <div className="stat-number">{country.economy.gdpGrowth}</div>
                <div className="stat-label">GDP Growth</div>
              </div>
            </div>

            <div className="col-6 col-lg-3">
              <div className="stat-card text-center">
                <div className="stat-icon">
                  <i className="fas fa-shield-alt" style={{ fontSize: '32px', color: '#eb6753' }} />
                </div>
                <div className="stat-number">{country.benefits.length}</div>
                <div className="stat-label">Investment Benefits</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CountryStatistics;
