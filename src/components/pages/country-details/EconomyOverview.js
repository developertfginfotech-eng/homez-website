"use client";

const EconomyOverview = ({ country }) => {
  return (
    <>
      <style jsx>{`
        .economy-overview-text {
          font-size: 15px;
          color: #4b5563;
          line-height: 1.7;
          margin-bottom: 25px;
        }

        .quick-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 15px;
          margin-bottom: 25px;
        }

        .stat-item {
          padding: 18px;
          background: linear-gradient(135deg, rgba(235, 103, 83, 0.04) 0%, rgba(235, 103, 83, 0.01) 100%);
          border-radius: 12px;
          border-left: 4px solid #eb6753;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .stat-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(235, 103, 83, 0.08) 0%, transparent 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .stat-item:hover::before {
          opacity: 1;
        }

        .stat-item:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(235, 103, 83, 0.15);
          border-left-width: 5px;
        }

        .stat-label {
          font-size: 11px;
          color: #6b7280;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          margin-bottom: 8px;
          position: relative;
        }

        .stat-value {
          font-size: 20px;
          font-weight: 800;
          background: linear-gradient(135deg, #eb6753 0%, #dc3c28 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          position: relative;
        }

        .info-row {
          display: flex;
          align-items: center;
          padding: 14px 16px;
          border-bottom: 1px solid #f3f4f6;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .info-row:last-child {
          border-bottom: none;
        }

        .info-row:hover {
          background: linear-gradient(90deg, rgba(235, 103, 83, 0.04) 0%, transparent 100%);
          padding-left: 24px;
        }

        .info-label {
          font-size: 14px;
          color: #6b7280;
          font-weight: 600;
          min-width: 120px;
        }

        .info-value {
          font-size: 14px;
          color: #1f2937;
          font-weight: 500;
        }

        .cities-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .city-tag {
          padding: 8px 18px;
          background: linear-gradient(135deg, #eb6753 0%, #dc3c28 100%);
          color: white;
          border-radius: 25px;
          font-size: 13px;
          font-weight: 600;
          box-shadow: 0 4px 12px rgba(235, 103, 83, 0.25);
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .city-tag:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(235, 103, 83, 0.35);
        }
      `}</style>

      {/* Economy Overview Text */}
      <p className="economy-overview-text">{country.economy.overview}</p>

      {/* Key Economic Indicators */}
      <div className="quick-stats">
        <div className="stat-item">
          <div className="stat-label">GDP Growth</div>
          <div className="stat-value">{country.economy.gdpGrowth}</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Unemployment</div>
          <div className="stat-value">{country.economy.unemployment}</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Inflation</div>
          <div className="stat-value">{country.economy.inflation}</div>
        </div>
      </div>

      {/* Country Details */}
      <div className="country-details">
        <div className="info-row">
          <span className="info-label">Capital</span>
          <span className="info-value">{country.capital}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Currency</span>
          <span className="info-value">{country.currency}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Population</span>
          <span className="info-value">{country.population}</span>
        </div>
        <div className="info-row">
          <span className="info-label">GDP</span>
          <span className="info-value">{country.gdp}</span>
        </div>
      </div>

      {/* Popular Cities */}
      <div style={{ marginTop: '25px' }}>
        <h6 className="fz15 fw600 mb15">Popular Cities</h6>
        <div className="cities-tags">
          {country.popularCities.map((city, index) => (
            <span key={index} className="city-tag">
              {city}
            </span>
          ))}
        </div>
      </div>
    </>
  );
};

export default EconomyOverview;
