"use client";

const Rules = ({ rules }) => {
  return (
    <>
      <style jsx>{`
        .rule-item {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.03) 0%, rgba(59, 130, 246, 0.01) 100%);
          padding: 14px 16px;
          border-radius: 10px;
          border-left: 3px solid #3b82f6;
          margin-bottom: 10px;
          transition: all 0.3s ease;
          display: flex;
          align-items: start;
          gap: 12px;
        }

        .rule-item:hover {
          transform: translateX(5px);
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(59, 130, 246, 0.03) 100%);
          box-shadow: 0 4px 20px rgba(59, 130, 246, 0.1);
        }

        .rule-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .rule-text {
          flex: 1;
          font-size: 14.5px;
          color: #1f2937;
          line-height: 1.6;
          font-weight: 500;
        }
      `}</style>

      <div className="rules-list">
        {rules.map((rule, index) => (
          <div key={index} className="rule-item">
            <div className="rule-icon">
              <i className="fas fa-info-circle" style={{ color: 'white', fontSize: '14px' }}></i>
            </div>
            <div className="rule-text">{rule}</div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Rules;
