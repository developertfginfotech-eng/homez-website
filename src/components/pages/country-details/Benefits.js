"use client";

const Benefits = ({ benefits }) => {
  return (
    <>
      <style jsx>{`
        .benefit-item {
          background: linear-gradient(135deg, rgba(235, 103, 83, 0.03) 0%, rgba(235, 103, 83, 0.01) 100%);
          padding: 14px 16px;
          border-radius: 10px;
          border-left: 3px solid #eb6753;
          margin-bottom: 10px;
          transition: all 0.3s ease;
          display: flex;
          align-items: start;
          gap: 12px;
        }

        .benefit-item:hover {
          transform: translateX(5px);
          background: linear-gradient(135deg, rgba(235, 103, 83, 0.08) 0%, rgba(235, 103, 83, 0.03) 100%);
          box-shadow: 0 4px 20px rgba(235, 103, 83, 0.1);
        }

        .benefit-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: linear-gradient(135deg, #eb6753 0%, #dc3c28 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(235, 103, 83, 0.3);
        }

        .benefit-text {
          flex: 1;
          font-size: 14.5px;
          color: #1f2937;
          line-height: 1.6;
          font-weight: 500;
        }
      `}</style>

      <div className="benefits-list">
        {benefits.map((benefit, index) => (
          <div key={index} className="benefit-item">
            <div className="benefit-icon">
              <i className="fas fa-check" style={{ color: 'white', fontSize: '14px' }}></i>
            </div>
            <div className="benefit-text">{benefit}</div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Benefits;
