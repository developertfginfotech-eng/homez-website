"use client";

const EconomyInfo = ({ economy }) => {
  return (
    <>
      <style jsx>{`
        .economy-card {
          background: linear-gradient(135deg, #fff 0%, #f9fafb 100%);
          padding: 25px;
          border-radius: 12px;
          border: 1px solid rgba(235, 103, 83, 0.1);
          transition: all 0.3s ease;
          height: 100%;
        }

        .economy-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(235, 103, 83, 0.12);
          border-color: rgba(235, 103, 83, 0.2);
        }

        .economy-icon {
          width: 50px;
          height: 50px;
          border-radius: 10px;
          background: linear-gradient(135deg, rgba(235, 103, 83, 0.1) 0%, rgba(235, 103, 83, 0.05) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 15px;
          transition: all 0.3s ease;
        }

        .economy-card:hover .economy-icon {
          background: linear-gradient(135deg, #eb6753 0%, #dc3c28 100%);
          transform: scale(1.1);
        }

        .economy-card:hover .economy-icon i {
          color: white !important;
        }

        .economy-title {
          font-size: 15px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 8px;
        }

        .economy-value {
          font-size: 20px;
          font-weight: 800;
          background: linear-gradient(135deg, #eb6753 0%, #dc3c28 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1.2;
        }
      `}</style>

      <div className="economy-info">
        <p className="text mb30" style={{ fontSize: '15px', color: '#6b7280', lineHeight: '1.7' }}>
          {economy.overview}
        </p>

        <div className="row g-3">
          <div className="col-md-6">
            <div className="economy-card">
              <div className="economy-icon">
                <i className="fas fa-chart-line" style={{ fontSize: '22px', color: '#eb6753' }}></i>
              </div>
              <div className="economy-title">GDP Growth</div>
              <div className="economy-value">{economy.gdpGrowth} annual</div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="economy-card">
              <div className="economy-icon">
                <i className="fas fa-users" style={{ fontSize: '22px', color: '#eb6753' }}></i>
              </div>
              <div className="economy-title">Unemployment Rate</div>
              <div className="economy-value">{economy.unemployment}</div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="economy-card">
              <div className="economy-icon">
                <i className="fas fa-percentage" style={{ fontSize: '22px', color: '#eb6753' }}></i>
              </div>
              <div className="economy-title">Inflation Rate</div>
              <div className="economy-value">{economy.inflation}</div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="economy-card">
              <div className="economy-icon">
                <i className="fas fa-industry" style={{ fontSize: '22px', color: '#eb6753' }}></i>
              </div>
              <div className="economy-title">Key Industries</div>
              <div className="economy-value" style={{ fontSize: '14px', fontWeight: '600' }}>
                {economy.keyIndustries.slice(0, 3).join(", ")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EconomyInfo;
