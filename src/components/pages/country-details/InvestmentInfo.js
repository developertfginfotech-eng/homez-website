"use client";

const InvestmentInfo = ({ investment }) => {
  return (
    <>
      <style jsx>{`
        .investment-overview {
          background: linear-gradient(135deg, #f9fafb 0%, #ffffff 100%);
          padding: 18px 22px;
          border-radius: 12px;
          border: 1px solid rgba(235, 103, 83, 0.1);
          margin-bottom: 20px;
        }

        .investment-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 15px;
          margin-bottom: 0;
        }

        .investment-card {
          background: white;
          padding: 18px;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          transition: all 0.3s ease;
        }

        .investment-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(235, 103, 83, 0.12);
          border-color: rgba(235, 103, 83, 0.2);
        }

        .card-icon {
          width: 45px;
          height: 45px;
          border-radius: 10px;
          background: linear-gradient(135deg, rgba(235, 103, 83, 0.1) 0%, rgba(235, 103, 83, 0.05) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 15px;
        }

        .investment-card:hover .card-icon {
          background: linear-gradient(135deg, #eb6753 0%, #dc3c28 100%);
        }

        .investment-card:hover .card-icon i {
          color: white !important;
        }

        .card-label {
          font-size: 13px;
          color: #6b7280;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }

        .card-value {
          font-size: 18px;
          font-weight: 700;
          color: #1f2937;
          line-height: 1.4;
        }

        .card-subtext {
          font-size: 13px;
          color: #9ca3af;
          margin-top: 5px;
          font-weight: 500;
        }
      `}</style>

      <div className="investment-info">
        <div className="investment-overview">
          <p style={{ fontSize: '15px', color: '#4b5563', lineHeight: '1.7', marginBottom: 0 }}>
            {investment.overview}
          </p>
        </div>

        <div className="investment-grid">
          <div className="investment-card">
            <div className="card-icon">
              <i className="fas fa-shield-alt" style={{ fontSize: '20px', color: '#eb6753' }}></i>
            </div>
            <div className="card-label">Approval Required</div>
            <div className="card-value">{investment.approvalRequired ? 'Yes' : 'No'}</div>
            {investment.approvalRequired && investment.approvalBody && (
              <div className="card-subtext">{investment.approvalBody}</div>
            )}
          </div>

          <div className="investment-card">
            <div className="card-icon">
              <i className="fas fa-dollar-sign" style={{ fontSize: '20px', color: '#eb6753' }}></i>
            </div>
            <div className="card-label">Minimum Investment</div>
            <div className="card-value">{investment.minimumInvestment}</div>
          </div>

          {investment.processingTime && investment.processingTime !== "N/A" && (
            <div className="investment-card">
              <div className="card-icon">
                <i className="fas fa-clock" style={{ fontSize: '20px', color: '#eb6753' }}></i>
              </div>
              <div className="card-label">Processing Time</div>
              <div className="card-value">{investment.processingTime}</div>
            </div>
          )}

          <div className="investment-card">
            <div className="card-icon">
              <i className="fas fa-file-invoice-dollar" style={{ fontSize: '20px', color: '#eb6753' }}></i>
            </div>
            <div className="card-label">Application Fee</div>
            <div className="card-value" style={{ fontSize: '16px' }}>{investment.applicationFee}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvestmentInfo;
