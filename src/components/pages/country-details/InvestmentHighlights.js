"use client";

const InvestmentHighlights = ({ country }) => {
  const { foreignInvestment, benefits, rules } = country;

  return (
    <>
      <style jsx>{`
        .investment-overview {
          font-size: 15px;
          color: #4b5563;
          line-height: 1.7;
          margin-bottom: 25px;
        }

        .key-points {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 15px;
          margin-bottom: 25px;
        }

        .point-card {
          padding: 20px;
          background: linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(249, 250, 251, 1) 100%);
          border: 2px solid #e5e7eb;
          border-radius: 14px;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .point-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #eb6753 0%, #dc3c28 100%);
          transform: scaleX(0);
          transition: transform 0.4s ease;
        }

        .point-card:hover::before {
          transform: scaleX(1);
        }

        .point-card:hover {
          border-color: rgba(235, 103, 83, 0.4);
          box-shadow: 0 8px 25px rgba(235, 103, 83, 0.15);
          transform: translateY(-4px);
        }

        .point-icon {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: linear-gradient(135deg, rgba(235, 103, 83, 0.12) 0%, rgba(235, 103, 83, 0.06) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 14px;
          transition: all 0.3s ease;
        }

        .point-card:hover .point-icon {
          background: linear-gradient(135deg, #eb6753 0%, #dc3c28 100%);
          transform: scale(1.1) rotate(5deg);
          box-shadow: 0 6px 20px rgba(235, 103, 83, 0.3);
        }

        .point-card:hover .point-icon i {
          color: white !important;
        }

        .point-label {
          font-size: 12px;
          color: #6b7280;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 5px;
        }

        .point-value {
          font-size: 15px;
          font-weight: 700;
          color: #1f2937;
        }

        .section-title {
          font-size: 16px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 15px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .section-title::before {
          content: '';
          width: 4px;
          height: 20px;
          background: linear-gradient(135deg, #eb6753 0%, #dc3c28 100%);
          border-radius: 2px;
        }

        .benefit-list {
          margin-bottom: 25px;
        }

        .benefit-item {
          display: flex;
          align-items: start;
          gap: 14px;
          padding: 14px 12px;
          border-bottom: 1px solid #f3f4f6;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .benefit-item:last-child {
          border-bottom: none;
        }

        .benefit-item:hover {
          background: linear-gradient(90deg, rgba(235, 103, 83, 0.06) 0%, transparent 100%);
          padding-left: 18px;
        }

        .benefit-icon {
          width: 26px;
          height: 26px;
          border-radius: 8px;
          background: linear-gradient(135deg, rgba(235, 103, 83, 0.12) 0%, rgba(235, 103, 83, 0.08) 100%);
          border: 1.5px solid rgba(235, 103, 83, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
          transition: all 0.3s ease;
        }

        .benefit-item:hover .benefit-icon {
          background: linear-gradient(135deg, #eb6753 0%, #dc3c28 100%);
          border-color: transparent;
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(235, 103, 83, 0.25);
        }

        .benefit-item:hover .benefit-icon i {
          color: white !important;
        }

        .benefit-text {
          flex: 1;
          font-size: 14px;
          color: #374151;
          line-height: 1.6;
        }

        .rule-item {
          display: flex;
          align-items: start;
          gap: 14px;
          padding: 14px 12px;
          border-bottom: 1px solid #f3f4f6;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .rule-item:last-child {
          border-bottom: none;
        }

        .rule-item:hover {
          background: linear-gradient(90deg, rgba(235, 103, 83, 0.06) 0%, transparent 100%);
          padding-left: 18px;
        }

        .rule-icon {
          width: 26px;
          height: 26px;
          border-radius: 8px;
          background: linear-gradient(135deg, rgba(235, 103, 83, 0.12) 0%, rgba(235, 103, 83, 0.08) 100%);
          border: 1.5px solid rgba(235, 103, 83, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
          transition: all 0.3s ease;
        }

        .rule-item:hover .rule-icon {
          background: linear-gradient(135deg, #eb6753 0%, #dc3c28 100%);
          border-color: transparent;
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(235, 103, 83, 0.25);
        }

        .rule-item:hover .rule-icon i {
          color: white !important;
        }

        .rule-text {
          flex: 1;
          font-size: 14px;
          color: #374151;
          line-height: 1.6;
        }
      `}</style>

      {/* Investment Overview */}
      <p className="investment-overview">{foreignInvestment.overview}</p>

      {/* Key Investment Information */}
      <div className="key-points">
        <div className="point-card">
          <div className="point-icon">
            <i className="fas fa-dollar-sign" style={{ fontSize: '16px', color: '#eb6753' }}></i>
          </div>
          <div className="point-label">Minimum Investment</div>
          <div className="point-value">{foreignInvestment.minimumInvestment}</div>
        </div>

        <div className="point-card">
          <div className="point-icon">
            <i className="fas fa-shield-alt" style={{ fontSize: '16px', color: '#eb6753' }}></i>
          </div>
          <div className="point-label">Approval Required</div>
          <div className="point-value">{foreignInvestment.approvalRequired ? 'Yes' : 'No'}</div>
        </div>

        {foreignInvestment.processingTime && foreignInvestment.processingTime !== "N/A" && (
          <div className="point-card">
            <div className="point-icon">
              <i className="fas fa-clock" style={{ fontSize: '16px', color: '#eb6753' }}></i>
            </div>
            <div className="point-label">Processing Time</div>
            <div className="point-value">{foreignInvestment.processingTime}</div>
          </div>
        )}
      </div>

      {/* Key Benefits */}
      <div className="section-title">Key Benefits</div>
      <div className="benefit-list">
        {benefits.slice(0, 4).map((benefit, index) => (
          <div key={index} className="benefit-item">
            <div className="benefit-icon">
              <i className="fas fa-star" style={{ color: '#eb6753', fontSize: '12px' }}></i>
            </div>
            <div className="benefit-text">{benefit}</div>
          </div>
        ))}
      </div>

      {/* Important Rules */}
      <div className="section-title">Important Regulations</div>
      <div className="rule-list">
        {rules.slice(0, 4).map((rule, index) => (
          <div key={index} className="rule-item">
            <div className="rule-icon">
              <i className="fas fa-shield-alt" style={{ color: '#eb6753', fontSize: '11px' }}></i>
            </div>
            <div className="rule-text">{rule}</div>
          </div>
        ))}
      </div>
    </>
  );
};

export default InvestmentHighlights;
